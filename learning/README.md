# Learning Cards - Knowledge Activation System

A Next.js application implementing the **Knowledge Activation Method** for effective learning and retention.

## Philosophy

> **Don't try to "remember knowledge", build "Knowledge Activation Structures"**

This system is based on evidence-based learning principles:
- Pattern-based learning instead of rote memorization
- Spaced repetition for long-term retention
- Knowledge categorization (High-frequency, Low-frequency, Awareness-only)
- Trigger-based recall

## Features

- 📇 **Interactive Learning Cards** with flip animations
- 🔄 **Spaced Repetition System** (Day 2-3, Week 1, Week 2-4, Monthly)
- 📊 **Progress Tracking** with review statistics
- 🎯 **Smart Filtering** to show cards due for review
- 💾 **Local Storage** persistence
- 🌓 **Dark Mode** support
- 📱 **Responsive Design**

## Spaced Repetition Schedule

- **Day 1**: Initial learning
- **Day 2-3**: First review (critical!)
- **Week 1**: Second review
- **Week 2-4**: Third review
- **Monthly**: Maintenance review

## Getting Started

### Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

### Build for Production

```bash
npm run build
npm start
```

## Deploy to Vercel

### Option 1: Deploy via Vercel Dashboard

1. Push your code to GitHub
2. Go to [Vercel Dashboard](https://vercel.com/dashboard)
3. Click "Add New Project"
4. Import your GitHub repository
5. Vercel will auto-detect Next.js and configure settings
6. Click "Deploy"

### Option 2: Deploy via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# For production deployment
vercel --prod
```

### Environment Variables

No environment variables required for basic functionality. All data is stored in browser localStorage.

## Adding New Cards

Edit `app/page.tsx` and add new cards to the `initialCards` array:

```typescript
{
  id: 'unique-id',
  title: 'Concept Name',
  category: 'Category',
  type: 'low-frequency', // or 'high-frequency' or 'awareness-only'
  useWhen: 'Trigger scenario',
  typicalCase: ['Case 1', 'Case 2'],
  oneLineEssence: 'One sentence summary',
  example: 'Code example',
  risks: 'Potential pitfalls',
  whenNotToUse: 'When to avoid',
  related: ['Related Concept 1', 'Related Concept 2'],
  reviewSchedule: calculateReviewSchedule(new Date()),
  reviewCount: 0,
}
```

## Tech Stack

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Local Storage** - Data persistence

## Project Structure

```
learning-cards/
├── app/
│   ├── layout.tsx       # Root layout
│   ├── page.tsx         # Main page with card data
│   └── globals.css      # Global styles
├── components/
│   └── LearningCard.tsx # Card component
├── types/
│   └── learning.ts      # TypeScript types
└── public/              # Static assets
```

## Learning Methodology

This system implements the **3-Question Learning System**:

1. **When will I use it?** (Trigger condition)
2. **What problem does it solve?** (Why it exists)
3. **One-line version?** (Compressed essence)

### Three Types of Knowledge

1. **High-Frequency Execution** - Must internalize (weekly use)
2. **Low-Frequency but Important** - Know where it is (rare but critical)
3. **Awareness Only** - Don't memorize (very rare, easy to lookup)

## Future Enhancements

- [ ] Add backend for multi-device sync
- [ ] Export/import cards as JSON
- [ ] Analytics dashboard
- [ ] Card creation UI
- [ ] Notification system for due reviews
- [ ] Collaborative card decks
- [ ] Search and filtering
- [ ] Tags and categories

## License

MIT

## Author

Built by Jacob Huang as part of a personal knowledge management system.
