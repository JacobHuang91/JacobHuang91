# Claude

> My personal knowledge base - built with Claude

**Last Updated:** 2026-06-03

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

Document concepts directly in this file under the "Concepts & Patterns" section.

**Suggested structure (adapt as needed):**

- **One-Line Essence**: Core idea in one sentence
- **Use When / Trigger Scenarios**: For tools, patterns, techniques
- **Example / Code**: Concrete demonstrations
- **Common Pitfalls**: When relevant to avoid mistakes
- **Related Concepts**: Helpful for connecting ideas

**Golden rule:** Structure the documentation in a way that helps YOU remember and retrieve the knowledge.

---

## Quick Notes

*Quick thoughts, ideas, and reminders*

### Today I Learned (TIL)

**2026-01-05**
- Created initial learning journal structure
- Documented learning methodology and patterns
- Added example concept: Duck Typing (Python)

**2026-06-03**
- Simplified project by removing `/learning` app
- Consolidated all learning materials into CLAUDE.md

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
- [x] Simplified project structure (2026-06-03)

---

## How to Use This Journal

1. **Daily Practice**: Add TIL entries regularly
2. **Document Concepts**: Add new learnings to the "Concepts & Patterns" section
3. **Problem Solving**: Record solutions to challenging problems
4. **Share with Claude**: Use this as context for conversations with Claude

---

## Quick Commands for Claude

When working with this journal, you can ask Claude to:
- "Add a new concept about [topic]" - Documents in the Concepts & Patterns section
- "Document this code snippet: [code]" - Adds to Code Snippets
- "Help me understand [concept] and add it to the journal"
- "Create a TIL entry for today"
- "Review my learning goals and suggest updates"

---

*Built with Claude Code - Your AI pair programmer*
