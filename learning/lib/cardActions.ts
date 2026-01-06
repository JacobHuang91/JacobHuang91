'use server';

import fs from 'fs/promises';
import path from 'path';
import { LearningCard, ReviewSchedule } from '@/types/learning';
import clientPromise from './mongodb';

const CARDS_DIR = path.join(process.cwd(), 'cards');

// MongoDB collection name
const DB_NAME = 'learning';
const COLLECTION_NAME = 'cardProgress';

// Ensure cards directory exists
async function ensureCardsDir() {
  try {
    await fs.access(CARDS_DIR);
  } catch {
    await fs.mkdir(CARDS_DIR, { recursive: true });
  }
}

// Get MongoDB collection
async function getCollection() {
  const client = await clientPromise;
  const db = client.db(DB_NAME);
  return db.collection(COLLECTION_NAME);
}

// Convert card content to markdown (no review data)
function cardToMarkdown(card: LearningCard): string {
  let md = `---
id: ${card.id}
title: ${card.title}
${card.emoji ? `emoji: ${card.emoji}\n` : ''}category: ${card.category}
type: ${card.type}
---

# ${card.title}

## One-Line Essence

> ${card.oneLineEssence}

## Use When

${card.useWhen}

## Typical Cases

${card.typicalCase.map(c => `- ${c}`).join('\n')}
`;

  if (card.example) {
    md += `\n## Example\n\n\`\`\`\n${card.example}\n\`\`\`\n`;
  }

  if (card.risks) {
    md += `\n## Risks\n\n${card.risks}\n`;
  }

  if (card.whenNotToUse) {
    md += `\n## When NOT to Use\n\n${card.whenNotToUse}\n`;
  }

  if (card.related && card.related.length > 0) {
    md += `\n## Related Concepts\n\n${card.related.map(r => `- ${r}`).join('\n')}\n`;
  }

  return md;
}

// Parse markdown to card content (without review data)
function markdownToCard(markdown: string): Omit<LearningCard, 'reviewCount' | 'reviewSchedule' | 'lastReviewed'> {
  const lines = markdown.split('\n');
  const frontmatterEnd = lines.findIndex((line, idx) => idx > 0 && line.trim() === '---');

  // Parse frontmatter
  const frontmatter = lines.slice(1, frontmatterEnd).join('\n');
  const content = lines.slice(frontmatterEnd + 1).join('\n');

  // Extract frontmatter fields
  const id = frontmatter.match(/id:\s*(.+)/)?.[1] || '';
  const title = frontmatter.match(/title:\s*(.+)/)?.[1] || '';
  const emoji = frontmatter.match(/emoji:\s*(.+)/)?.[1] || undefined;
  const category = frontmatter.match(/category:\s*(.+)/)?.[1] || '';
  const type = frontmatter.match(/type:\s*(.+)/)?.[1] as any || 'low-frequency';

  // Parse content sections
  const oneLineEssence = content.match(/## One-Line Essence\s*\n\s*>\s*(.+)/)?.[1] || '';
  const useWhen = content.match(/## Use When\s*\n\s*(.+?)(?=\n##|\n$)/s)?.[1]?.trim() || '';

  const typicalCaseSection = content.match(/## Typical Cases\s*\n([\s\S]+?)(?=\n##|\n$)/)?.[1] || '';
  const typicalCase = typicalCaseSection
    .split('\n')
    .filter(line => line.trim().startsWith('-'))
    .map(line => line.trim().substring(2).trim())
    .filter(Boolean);

  const example = content.match(/## Example\s*\n\s*```[a-z]*\s*\n([\s\S]+?)\n```/)?.[1] || undefined;
  const risks = content.match(/## Risks\s*\n\s*(.+?)(?=\n##|\n$)/s)?.[1]?.trim() || undefined;
  const whenNotToUse = content.match(/## When NOT to Use\s*\n\s*(.+?)(?=\n##|\n$)/s)?.[1]?.trim() || undefined;

  const relatedSection = content.match(/## Related Concepts\s*\n([\s\S]+?)$/)?.[1] || '';
  const related = relatedSection
    .split('\n')
    .filter(line => line.trim().startsWith('-'))
    .map(line => line.trim().substring(2).trim())
    .filter(Boolean);

  return {
    id,
    title,
    emoji,
    category,
    type,
    useWhen,
    typicalCase,
    oneLineEssence,
    example,
    risks,
    whenNotToUse,
    related: related.length > 0 ? related : undefined,
  };
}

// Get all cards (merge markdown content with MongoDB review progress)
export async function getAllCards(): Promise<LearningCard[]> {
  await ensureCardsDir();

  try {
    const files = await fs.readdir(CARDS_DIR);
    const mdFiles = files.filter(f => f.endsWith('.md') && f !== 'README.md');

    // Read card content from markdown files
    const cardContents = await Promise.all(
      mdFiles.map(async (file) => {
        const content = await fs.readFile(path.join(CARDS_DIR, file), 'utf-8');
        return markdownToCard(content);
      })
    );

    // Get review progress from MongoDB
    const collection = await getCollection();
    const progressDocs = await collection.find({}).toArray();
    const progressMap = new Map(
      progressDocs.map(doc => [doc.cardId, doc])
    );

    // Merge content with progress
    const cards: LearningCard[] = cardContents.map(content => {
      const progress = progressMap.get(content.id);

      // Default review schedule for new cards (firstReview is now so it appears in "Review Now" immediately)
      const defaultSchedule: ReviewSchedule = {
        initial: new Date().toISOString(),
        firstReview: new Date().toISOString(), // Changed: new cards should be reviewed immediately
        secondReview: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        thirdReview: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
        monthlyReview: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      };

      return {
        ...content,
        reviewCount: progress?.reviewCount || 0,
        reviewSchedule: progress?.reviewSchedule || defaultSchedule,
        lastReviewed: progress?.lastReviewed,
      };
    });

    return cards;
  } catch (error) {
    console.error('Error reading cards:', error);
    return [];
  }
}

// Save card review progress to MongoDB
export async function saveCard(card: LearningCard): Promise<void> {
  const collection = await getCollection();

  await collection.updateOne(
    { cardId: card.id },
    {
      $set: {
        cardId: card.id,
        reviewCount: card.reviewCount,
        reviewSchedule: card.reviewSchedule,
        lastReviewed: card.lastReviewed,
        updatedAt: new Date(),
      },
    },
    { upsert: true }
  );
}

// Create a new card (save markdown file)
export async function createCard(card: LearningCard): Promise<void> {
  await ensureCardsDir();

  const filename = `${card.id}.md`;
  const filepath = path.join(CARDS_DIR, filename);
  const markdown = cardToMarkdown(card);

  await fs.writeFile(filepath, markdown, 'utf-8');

  // Also save initial progress to MongoDB
  await saveCard(card);
}

// Delete a card (markdown file and MongoDB progress)
export async function deleteCard(cardId: string): Promise<void> {
  await ensureCardsDir();

  const filename = `${cardId}.md`;
  const filepath = path.join(CARDS_DIR, filename);

  try {
    // Delete markdown file
    await fs.unlink(filepath);

    // Delete progress from MongoDB
    const collection = await getCollection();
    await collection.deleteOne({ cardId });
  } catch (error) {
    console.error('Error deleting card:', error);
  }
}

// Get a single card (merge markdown content with MongoDB progress)
export async function getCard(cardId: string): Promise<LearningCard | null> {
  await ensureCardsDir();

  const filename = `${cardId}.md`;
  const filepath = path.join(CARDS_DIR, filename);

  try {
    // Read card content from markdown
    const content = await fs.readFile(filepath, 'utf-8');
    const cardContent = markdownToCard(content);

    // Get review progress from MongoDB
    const collection = await getCollection();
    const progress = await collection.findOne({ cardId });

    // Default review schedule for new cards (firstReview is now so it appears in "Review Now" immediately)
    const defaultSchedule: ReviewSchedule = {
      initial: new Date().toISOString(),
      firstReview: new Date().toISOString(), // Changed: new cards should be reviewed immediately
      secondReview: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      thirdReview: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
      monthlyReview: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    };

    return {
      ...cardContent,
      reviewCount: progress?.reviewCount || 0,
      reviewSchedule: progress?.reviewSchedule || defaultSchedule,
      lastReviewed: progress?.lastReviewed,
    };
  } catch (error) {
    return null;
  }
}
