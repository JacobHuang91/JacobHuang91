# Claude

> My personal knowledge base - built with Claude

**Last Updated:** 2026-01-05

---

## Table of Contents

- [Quick Notes](#quick-notes)
- [Concepts & Patterns](#concepts--patterns)
- [Code Snippets](#code-snippets)
- [Problem Solutions](#problem-solutions)
- [System Design](#system-design)
- [Best Practices](#best-practices)
- [Resources & References](#resources--references)
- [Learning Goals](#learning-goals)

---

## Learning Methodology

> **Core Principle: Don't try to "remember knowledge", build "Knowledge Activation Structures"**

### The Three Types of Knowledge

#### 1. High-Frequency Execution (Must Internalize)
**Characteristics:**
- Used weekly
- Bugs happen if wrong
- Must be reflexive

**Examples:** Python list/dict ops, SQL JOINs, basic data structures, async/await

**Learning Goal:** Write without thinking (needs deliberate practice + repetition)

#### 2. Low-Frequency but Important (Know Where It Is)
**Characteristics:**
- Rarely used
- Critical when needed
- Not worth memorizing details

**Examples:** Duck typing, Python MRO, design pattern variants, specialized algorithms

**Learning Goal:** Remember "this exists and when to use it"

**How to Learn:**
1. **Bind to Trigger Scenario** - Not "what is it" but "when do I need it"
2. **Compress to 1-Line Card** - Minimal, scannable reminder
3. **Force Re-activation within 24-72 hours** - Write a demo, add a comment, or explain it

#### 3. Awareness Only (Don't Memorize)
**Characteristics:**
- Very rare usage
- Low lookup cost
- Doesn't affect core ability

**Examples:** Obscure library APIs, language edge cases

**Learning Goal:** Seen it, move on

---

### The 3-Question Learning System

For every new concept, answer:

1. **When will I use it?** (Trigger condition)
2. **What problem does it solve?** (Why it exists)
3. **One-line version?** (Compressed essence)

If you can't answer → Not worth learning deeply yet

---

### Pattern-Based Learning (for Algorithms & Programming)

**Wrong Approach:**
- Solve one problem today
- Different problem tomorrow
- Think "solved = learned"

**Correct Approach:**
- Identify the PATTERN
- Group problems by pattern
- Build pattern library

**Pattern Template:**
```
Pattern: [Name]
- Used when: [Condition]
- Key variables: [State]
- Typical mistakes: [Pitfalls]
- Problems: [Examples]
```

**Example:**
```
Pattern: Sliding Window
- Used when: subarray/substring + constraint
- Key variables: left, right, window state
- Typical mistakes: forgetting to shrink window
- Problems: LC 3, LC 76, LC 438
```

---

### Knowledge Card Template (Low-Frequency Knowledge)

The Learning Cards app (in `/learning`) implements this methodology with markdown-based cards.

**Card Structure:**
```markdown
---
id: concept-name
title: Concept Name
emoji: 🦆
category: Python / Type System
type: low-frequency
---

# Concept Name

## One-Line Essence

> The key concept in one sentence

## Use When

Trigger scenario that tells you when to apply this

## Typical Cases

- Concrete example 1
- Concrete example 2
- Real-world use case

## Example

​```python
# Code example with syntax highlighting
​```

## Risks

Common pitfalls and limitations

## When NOT to Use

Counter-indicators for when to avoid this approach

## Related Concepts

- Related concept 1
- Related concept 2
```

---

### Spaced Repetition Schedule

**Implemented in the Learning Cards App** (`/learning`)

**Critical Window:** Review new cards immediately, then space out reviews

**Review Intervals (Automated):**
- **Day 0**: Initial learning → Review immediately
- **After 1st review**: Next review in 2-3 days
- **After 2nd review**: Week 1
- **After 3rd review**: Week 2
- **After 4th+ review**: Monthly maintenance

**How it works:**
- New cards appear in "Review Now" 🔥 section immediately
- After marking as reviewed, card is scheduled for next interval
- Overdue cards are highlighted with fire badge
- Progress stored in MongoDB, content in markdown (version controlled)

**Creating new cards:**
Use Claude Code to create new learning cards by asking:
- "Add a new learning card about [concept]"
- "Create a card explaining [topic]"
- Claude will generate the markdown file with proper structure

---

## Learning Cards App

**Location:** `/learning`

A Next.js application implementing the spaced repetition methodology described above.

### Features
- 🔥 **Review Now**: Shows cards due for review based on spaced repetition
- 📚 **All Cards**: Browse all cards with category filtering
- 💻 **Syntax Highlighting**: Code examples with VS Code Dark+ theme
- 📱 **Responsive Design**: Mobile-friendly with collapsible sidebar
- 🦆 **Visual Memory**: Custom emoji for each card
- 🎨 **Modern UI**: Tailwind CSS v4 with glassmorphism

### Architecture
- **Storage**: Hybrid approach
  - Markdown files for card content (version controlled in `/learning/cards`)
  - MongoDB for review progress (Vercel-compatible)
- **UI**: Two-panel layout with navigation sidebar and content display
- **Tech**: Next.js 16.1.1, TypeScript, MongoDB, Tailwind CSS v4

### Usage
1. Add new cards as markdown files in `/learning/cards/`
2. Use Claude Code to generate properly formatted cards
3. Visit the app to review cards on schedule
4. Mark cards as reviewed to update the spaced repetition schedule

### Example Card
See `/learning/cards/duck-typing.md` for the card format.

---

## Quick Notes

*Quick thoughts, ideas, and reminders*

### Today I Learned (TIL)

**2026-01-05**
- Created Learning Cards app implementing spaced repetition methodology
- Built two-panel responsive layout with Next.js 16.1.1
- Integrated MongoDB for review progress tracking
- Implemented markdown-based card storage for version control
- Added syntax highlighting for code examples
- Created first example card: Duck Typing (Python)

---

## Concepts & Patterns

*Deep dives into technical concepts, design patterns, and architectural ideas*

### Duck Typing (Python)
**Date:** 2026-01-05
**Category:** Python / Type System
**Type:** Low-Frequency but Important

**Use when:** Care about behavior, not type inheritance

**Typical case:**
- Functions expecting objects with `.read()`, `.write()` methods
- Accepting any object that "acts like" a list/dict without requiring inheritance

**One-line essence:** "If it walks like a duck and quacks like a duck, it's a duck"

**Example:**
```python
# Duck typing - no need for inheritance
class FileLogger:
    def write(self, msg):
        with open('log.txt', 'a') as f:
            f.write(msg)

class ConsoleLogger:
    def write(self, msg):
        print(msg)

def log_message(logger, message):
    # Works with ANY object that has write() method
    logger.write(message)

# Both work!
log_message(FileLogger(), "Error occurred")
log_message(ConsoleLogger(), "Error occurred")
```

**Risk:** Runtime error if method missing

**When NOT to use:** When you need compile-time type checking or clear interfaces

**Related:** Protocol (Python 3.8+), Abstract Base Classes, Structural typing

**Review dates:**
- First: 2026-01-07 ✓
- Second: 2026-01-12
- Third: 2026-01-19

---

### Template

```markdown
### [Concept Name]
**Date:** YYYY-MM-DD
**Category:** [AI/Backend/Frontend/DevOps/etc]

**What is it?**
- Brief explanation

**Why does it matter?**
- Use cases and importance

**Key Takeaways:**
- Important points to remember

**Related Concepts:**
- Links to other related topics
```

---

## Code Snippets

*Reusable code patterns and solutions*

### Template

```markdown
### [Snippet Title]
**Language:** [Python/JavaScript/Go/etc]
**Use Case:** Brief description

​```[language]
// code here
​```

**Notes:**
- When to use this
- Common pitfalls
```

---

## Problem Solutions

*Solutions to specific problems I've encountered*

### Template

```markdown
### [Problem Title]
**Date:** YYYY-MM-DD
**Context:** Where/when this problem occurred

**Problem:**
Detailed description of the issue

**Solution:**
How I solved it

**What I Learned:**
Key insights from solving this problem

**Prevention:**
How to avoid this in the future
```

---

## System Design

*Architectural designs and system planning*

### Template

```markdown
### [System Name]
**Date:** YYYY-MM-DD
**Scale:** [Small/Medium/Large]

**Requirements:**
- Functional requirements
- Non-functional requirements

**Architecture:**
- High-level design
- Components and their interactions

**Trade-offs:**
- Decisions made and why

**Diagrams:**
- Link to diagrams or ASCII art
```

---

## Best Practices

*Coding standards, patterns, and professional wisdom*

### By Category

#### AI/LLM Development
*Best practices for working with AI systems*

#### Backend Development
*Server-side best practices*

#### Frontend Development
*UI/UX and client-side best practices*

#### DevOps & Infrastructure
*Deployment, monitoring, and operations*

#### Testing & Quality
*Testing strategies and quality assurance*

---

## Resources & References

*Useful links, documentation, and learning materials*

### Documentation
- [Add important docs you reference frequently]

### Articles & Tutorials
- [Bookmark valuable articles]

### Tools & Libraries
- [Track tools and libraries you use or want to try]

### Courses & Certifications
- [Learning path and progress]

---

## Learning Goals

*What I want to learn and track progress*

### Current Focus
- [ ] Goal 1
- [ ] Goal 2
- [ ] Goal 3

### Short-term (Next 3 months)
- [ ]
- [ ]
- [ ]

### Long-term (This year)
- [ ]
- [ ]
- [ ]

### Completed
- [x] Created learning journal with Claude (2026-01-05)
- [x] Built Learning Cards app with spaced repetition (2026-01-05)
- [x] Implemented hybrid storage: Markdown + MongoDB (2026-01-05)
- [x] Added responsive UI with syntax highlighting (2026-01-05)

---

## How to Use This Journal

1. **Daily Practice**: Add TIL entries regularly
2. **Learning Cards**: Create cards for concepts using Claude Code
3. **Review System**: Use the Learning Cards app to review on schedule
4. **Problem Solving**: Record solutions to challenging problems
5. **Share with Claude**: Use this as context for conversations with Claude

---

## Quick Commands for Claude

When working with this journal, you can ask Claude to:
- "Create a learning card about [concept]" - Generates properly formatted card
- "Add a new concept about [topic]" - Documents in this file
- "Document this code snippet: [code]"
- "Help me understand [concept] and add it to the journal"
- "Create a TIL entry for today"
- "Review my learning goals and suggest updates"
- "Generate a card for [algorithm/pattern/concept]" - Creates markdown card

---

*Built with Claude Code - Your AI pair programmer*
