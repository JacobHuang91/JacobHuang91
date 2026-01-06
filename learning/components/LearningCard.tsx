'use client';

import { LearningCard as LearningCardType } from '@/types/learning';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface Props {
  card: LearningCardType;
  onReview: (cardId: string) => void;
}

export default function LearningCard({ card, onReview }: Props) {
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'high-frequency':
        return 'bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg shadow-red-500/30';
      case 'low-frequency':
        return 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/30';
      case 'awareness-only':
        return 'bg-gradient-to-r from-gray-500 to-slate-500 text-white shadow-lg shadow-gray-500/30';
      default:
        return 'bg-gradient-to-r from-gray-500 to-slate-500 text-white';
    }
  };

  const getNextReview = () => {
    const schedule = card.reviewSchedule;
    const now = new Date();

    if (!schedule.firstReview || new Date(schedule.firstReview) > now) {
      return schedule.firstReview;
    }
    if (!schedule.secondReview || new Date(schedule.secondReview) > now) {
      return schedule.secondReview;
    }
    if (!schedule.thirdReview || new Date(schedule.thirdReview) > now) {
      return schedule.thirdReview;
    }
    return schedule.monthlyReview;
  };

  const nextReview = getNextReview();
  const isReviewDue = nextReview && new Date(nextReview) <= new Date();

  return (
    <div className="max-w-3xl mx-auto animate-slide-up">
      <div
        className={`backdrop-blur-sm bg-white/90 dark:bg-gray-800/90 rounded-2xl shadow-2xl p-8 border transition-all duration-300 hover:shadow-3xl ${
          isReviewDue ? 'border-yellow-400 ring-4 ring-yellow-400/20' : 'border-gray-200/50 dark:border-gray-700/50'
        }`}
      >
        {/* Header with Emoji */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1">
            <div className="flex items-center gap-4 mb-3">
              {card.emoji && (
                <div className="text-6xl">
                  {card.emoji}
                </div>
              )}
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight flex-1">
                {card.title}
              </h2>
            </div>
            <div className="flex gap-3 flex-wrap">
              <span className={`px-4 py-1.5 rounded-full text-xs font-bold ${getTypeColor(card.type)}`}>
                {card.type.replace('-', ' ').toUpperCase()}
              </span>
              <span className="px-4 py-1.5 rounded-full text-xs font-bold bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-lg shadow-purple-500/30">
                {card.category}
              </span>
            </div>
          </div>
        </div>

        {/* One-Line Essence */}
        <div className="mb-6 relative">
          <div className="bg-gradient-to-r from-yellow-100 via-orange-100 to-yellow-100 dark:from-yellow-900/30 dark:via-orange-900/30 dark:to-yellow-900/30 rounded-2xl p-6 border-2 border-yellow-400 dark:border-yellow-600 shadow-xl">
            <div className="flex items-start gap-3">
              <span className="text-3xl mt-1">💡</span>
              <div className="flex-1">
                <h3 className="text-sm font-bold text-yellow-800 dark:text-yellow-300 mb-2">
                  KEY CONCEPT
                </h3>
                <blockquote className="text-xl font-bold text-gray-900 dark:text-gray-100 leading-relaxed italic">
                  "{card.oneLineEssence}"
                </blockquote>
              </div>
            </div>
          </div>
        </div>

        {/* Card Content */}
        <div className="space-y-6">
          {/* Use When */}
          <div className="bg-gradient-to-br from-gray-50 to-slate-50 dark:from-gray-800/50 dark:to-slate-800/50 rounded-xl p-5 border border-gray-200/50 dark:border-gray-700/50">
            <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
              <span className="text-2xl">🎯</span>
              <span>Use When:</span>
            </h3>
            <p className="text-base text-gray-900 dark:text-gray-100 leading-relaxed">{card.useWhen}</p>
          </div>

          {/* Typical Cases */}
            <div className="bg-gradient-to-br from-slate-50 to-gray-50 dark:from-slate-800/50 dark:to-gray-800/50 rounded-xl p-5 border border-gray-200/50 dark:border-gray-700/50">
              <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                <span className="text-2xl">📋</span>
                <span>Typical Cases:</span>
              </h3>
              <ul className="space-y-2.5">
                {card.typicalCase.map((case_, idx) => (
                  <li key={idx} className="text-gray-900 dark:text-gray-100 flex items-start gap-3">
                    <span className="text-blue-500 mt-1">•</span>
                    <span className="flex-1 leading-relaxed">{case_}</span>
                  </li>
                ))}
              </ul>
            </div>

            {card.risks && (
              <div className="bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 rounded-xl p-5 border-l-4 border-red-500">
                <h3 className="text-sm font-bold text-red-700 dark:text-red-300 mb-3 flex items-center gap-2">
                  <span className="text-2xl">⚠️</span>
                  <span>Risks:</span>
                </h3>
                <p className="text-gray-900 dark:text-gray-100 leading-relaxed">{card.risks}</p>
              </div>
            )}

            {card.whenNotToUse && (
              <div className="bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 rounded-xl p-5 border-l-4 border-yellow-500">
                <h3 className="text-sm font-bold text-yellow-800 dark:text-yellow-300 mb-3 flex items-center gap-2">
                  <span className="text-2xl">🚫</span>
                  <span>When NOT to Use:</span>
                </h3>
                <p className="text-gray-900 dark:text-gray-100 leading-relaxed">{card.whenNotToUse}</p>
              </div>
            )}

            {card.example && (
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-5 border border-green-200/50 dark:border-green-700/50">
                <h3 className="text-sm font-bold text-green-700 dark:text-green-300 mb-3 flex items-center gap-2">
                  <span className="text-2xl">💻</span>
                  <span>Example</span>
                </h3>
                <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-inner">
                  <SyntaxHighlighter
                    language="python"
                    style={vscDarkPlus}
                    customStyle={{
                      margin: 0,
                      padding: '1.25rem',
                      fontSize: '0.875rem',
                      lineHeight: '1.5',
                    }}
                    showLineNumbers={true}
                  >
                    {card.example}
                  </SyntaxHighlighter>
                </div>
              </div>
            )}

            {card.related && card.related.length > 0 && (
              <div className="bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-xl p-5 border border-purple-200/50 dark:border-purple-700/50">
                <h3 className="text-sm font-bold text-purple-700 dark:text-purple-300 mb-3 flex items-center gap-2">
                  <span className="text-2xl">🔗</span>
                  <span>Related Concepts:</span>
                </h3>
                <div className="flex flex-wrap gap-2">
                  {card.related.map((concept, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1.5 bg-gradient-to-r from-purple-500/10 to-indigo-500/10 hover:from-purple-500/20 hover:to-indigo-500/20 border border-purple-300 dark:border-purple-600 text-purple-900 dark:text-purple-200 rounded-lg text-sm font-medium transition-all cursor-pointer"
                    >
                      {concept}
                    </span>
                  ))}
                </div>
              </div>
            )}

          {/* Mark as Reviewed Button */}
          <button
            onClick={() => onReview(card.id)}
            className="w-full py-4 px-6 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-xl font-semibold text-lg shadow-lg"
          >
            ✓ Mark as Reviewed
          </button>
        </div>

        {/* Review Schedule */}
        <div className="mt-8 pt-6 border-t-2 border-gray-200/50 dark:border-gray-700/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-lg px-4 py-2">
                <span className="text-gray-600 dark:text-gray-400 text-sm font-medium">Reviews: </span>
                <span className="font-bold text-blue-600 dark:text-blue-400 text-lg">{card.reviewCount}</span>
              </div>
            </div>
            {nextReview && (
              <div className={`rounded-lg px-4 py-2 ${isReviewDue ? 'bg-gradient-to-br from-yellow-100 to-amber-100 dark:from-yellow-900/30 dark:to-amber-900/30' : 'bg-gradient-to-br from-gray-100 to-slate-100 dark:from-gray-800/50 dark:to-slate-800/50'}`}>
                <span className="text-gray-600 dark:text-gray-400 text-sm font-medium">Next: </span>
                <span className={`font-bold text-sm ${isReviewDue ? 'text-yellow-700 dark:text-yellow-300' : 'text-gray-900 dark:text-gray-100'}`}>
                  {new Date(nextReview).toLocaleDateString()}
                  {isReviewDue && ' 🔥'}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
