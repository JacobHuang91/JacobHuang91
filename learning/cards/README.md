# Learning Cards

This directory contains your learning cards as markdown files. Each card is stored as a separate `.md` file and can be manually edited if needed.

## File Format

Each card follows this structure:

```markdown
---
id: unique-card-id
title: Card Title
category: Category Name
type: low-frequency | high-frequency | awareness-only
reviewCount: 0
reviewSchedule:
  initial: 2026-01-05T00:00:00.000Z
  firstReview: 2026-01-07T00:00:00.000Z
  secondReview: 2026-01-12T00:00:00.000Z
  thirdReview: 2026-01-19T00:00:00.000Z
  monthlyReview: 2026-02-04T00:00:00.000Z
lastReviewed:
---

# Card Title

## One-Line Essence

> Brief essence of the concept

## Use When

Trigger condition for using this concept

## Typical Cases

- Case 1
- Case 2
- Case 3

## Example

\`\`\`
code example here
\`\`\`

## Risks

Common pitfalls or risks

## When NOT to Use

When to avoid this concept

## Related Concepts

- Related Concept 1
- Related Concept 2
```

## Manual Editing

You can manually create or edit cards by:

1. Creating a new `.md` file in this directory
2. Following the format above
3. Ensuring the `id` field is unique
4. The app will automatically load your changes on refresh

## Version Control

Since these are plain markdown files, you can:
- Commit them to git
- Share them with others
- Keep them in sync across devices
- View diffs and history

## Backup

Your cards are automatically backed up in this directory. Simply commit this folder to git or copy it elsewhere to preserve your learning progress.
