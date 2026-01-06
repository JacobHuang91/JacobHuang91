'use client';

import { useState, useEffect } from 'react';
import LearningCard from '@/components/LearningCard';
import { LearningCard as LearningCardType } from '@/types/learning';
import { getAllCards, saveCard } from '@/lib/cardActions';

export default function Home() {
  const [cards, setCards] = useState<LearningCardType[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [filter, setFilter] = useState<'all' | 'due'>('due'); // Default to "Review Now"
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    // Load cards from filesystem
    loadCards();
  }, []);

  async function loadCards() {
    setLoading(true);
    const loadedCards = await getAllCards();
    setCards(loadedCards);
    setLoading(false);
  }

  const handleReview = async (cardId: string) => {
    const card = cards.find(c => c.id === cardId);
    if (!card) return;

    const now = new Date();
    const newReviewCount = card.reviewCount + 1;

    // Update review schedule based on count
    let newSchedule = { ...card.reviewSchedule };
    if (newReviewCount === 1) {
      // After first review, set next reviews
      newSchedule.firstReview = new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000).toISOString();
    } else if (newReviewCount === 2) {
      newSchedule.secondReview = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString();
    } else if (newReviewCount === 3) {
      newSchedule.thirdReview = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000).toISOString();
    } else {
      // Set monthly review
      newSchedule.monthlyReview = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString();
    }

    const updatedCard = {
      ...card,
      reviewCount: newReviewCount,
      lastReviewed: now.toISOString(),
      reviewSchedule: newSchedule,
    };

    // Save to filesystem
    await saveCard(updatedCard);

    // Update local state
    setCards(cards.map(c => c.id === cardId ? updatedCard : c));
  };

  const getNextReview = (card: LearningCardType) => {
    const schedule = card.reviewSchedule;
    const now = new Date();

    // Return the next review date based on review count
    if (card.reviewCount === 0) {
      return schedule.firstReview;
    } else if (card.reviewCount === 1) {
      return schedule.secondReview;
    } else if (card.reviewCount === 2) {
      return schedule.thirdReview;
    } else {
      return schedule.monthlyReview;
    }
  };

  // Get unique categories
  const categories = Array.from(new Set(cards.map(card => card.category))).sort();

  const filteredCards = filter === 'due'
    ? cards.filter(card => {
        const nextReview = getNextReview(card);
        return nextReview && new Date(nextReview) <= new Date();
      })
    : cards.filter(card => selectedCategory === 'all' || card.category === selectedCategory);

  const currentCard = filteredCards[currentIndex];
  const dueCount = cards.filter(card => {
    const nextReview = getNextReview(card);
    return nextReview && new Date(nextReview) <= new Date();
  }).length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-slate-900 dark:to-gray-900 py-12 px-4 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-pulse">🧠</div>
          <p className="text-xl text-gray-600 dark:text-gray-300 font-medium">Loading cards...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-slate-900 dark:to-gray-900">
      <div className="flex h-screen relative">
        {/* Mobile Overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Left Panel - Navigation */}
        <div className={`
          w-80 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border-r border-gray-200 dark:border-gray-700 overflow-y-auto
          fixed lg:static inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}>
          {/* Header */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-700 sticky top-0 bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl z-10">
            <div className="flex items-center justify-between">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                <h1 className="text-3xl font-extrabold tracking-tight">
                  Learning Cards
                </h1>
              </div>
              {/* Mobile Close Button */}
              <button
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                aria-label="Close sidebar"
              >
                <svg className="w-6 h-6 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Section Tabs */}
          <div className="p-4 space-y-2">
            <button
              onClick={() => {
                setFilter('due');
                setSelectedCategory('all');
                if (filteredCards.length > 0) setCurrentIndex(0);
              }}
              className={`w-full px-4 py-3 rounded-xl font-bold transition-all duration-200 text-left ${
                filter === 'due'
                  ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg'
                  : 'bg-gray-100 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">🔥</span>
                <div className="flex-1">
                  <div className="font-bold">Review Now</div>
                  <div className={`text-xs ${filter === 'due' ? 'text-white/80' : 'text-gray-500 dark:text-gray-400'}`}>
                    {dueCount} {dueCount === 1 ? 'card' : 'cards'}
                  </div>
                </div>
              </div>
            </button>
            <button
              onClick={() => {
                setFilter('all');
                if (filteredCards.length > 0) setCurrentIndex(0);
              }}
              className={`w-full px-4 py-3 rounded-xl font-bold transition-all duration-200 text-left ${
                filter === 'all'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                  : 'bg-gray-100 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">📚</span>
                <div className="flex-1">
                  <div className="font-bold">All Cards</div>
                  <div className={`text-xs ${filter === 'all' ? 'text-white/80' : 'text-gray-500 dark:text-gray-400'}`}>
                    {cards.length} {cards.length === 1 ? 'card' : 'cards'}
                  </div>
                </div>
              </div>
            </button>
          </div>

          {/* Category Filter (only show in All Cards mode) */}
          {filter === 'all' && categories.length > 0 && (
            <div className="px-4 pb-4 border-b border-gray-200 dark:border-gray-700">
              <div className="space-y-1">
                <button
                  onClick={() => {
                    setSelectedCategory('all');
                    setCurrentIndex(0);
                  }}
                  className={`w-full px-3 py-2 rounded-lg text-sm font-semibold transition-all text-left ${
                    selectedCategory === 'all'
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  All Categories ({cards.length})
                </button>
                {categories.map(category => {
                  const count = cards.filter(c => c.category === category).length;
                  return (
                    <button
                      key={category}
                      onClick={() => {
                        setSelectedCategory(category);
                        setCurrentIndex(0);
                      }}
                      className={`w-full px-3 py-2 rounded-lg text-sm font-semibold transition-all text-left ${
                        selectedCategory === category
                          ? 'bg-purple-600 text-white'
                          : 'bg-gray-100 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                      }`}
                    >
                      {category} ({count})
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Card List */}
          <div className="p-4">
            {filteredCards.length > 0 ? (
              <div className="space-y-2">
                {filteredCards.map((card, idx) => {
                  const isReviewDue = (() => {
                    const nextReview = getNextReview(card);
                    return nextReview && new Date(nextReview) <= new Date();
                  })();

                  return (
                    <button
                      key={card.id}
                      onClick={() => {
                        setCurrentIndex(idx);
                        setSidebarOpen(false); // Close sidebar on mobile when card is selected
                      }}
                      className={`w-full p-3 rounded-xl text-left transition-all duration-200 ${
                        currentIndex === idx
                          ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                          : 'bg-gray-100 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                      } ${isReviewDue && currentIndex !== idx ? 'ring-2 ring-yellow-400' : ''}`}
                    >
                      <div className="flex items-start gap-2">
                        {card.emoji && (
                          <span className="text-xl">{card.emoji}</span>
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-sm truncate">{card.title}</div>
                          <div className={`text-xs mt-1 ${currentIndex === idx ? 'text-white/80' : 'text-gray-500 dark:text-gray-400'}`}>
                            {card.category}
                          </div>
                          {isReviewDue && (
                            <div className="flex items-center gap-1 mt-1">
                              <span className="text-xs">🔥</span>
                              <span className={`text-xs font-semibold ${currentIndex === idx ? 'text-white' : 'text-yellow-600 dark:text-yellow-400'}`}>
                                Review Due
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="text-4xl mb-3">
                  {filter === 'due' ? '🎉' : '📚'}
                </div>
                <p className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                  {filter === 'due' ? 'All Caught Up!' : 'No Cards Yet'}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  {filter === 'due' ? 'No cards need review' : 'Add markdown files to /cards'}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right Panel - Card Content */}
        <div className="flex-1 overflow-y-auto">
          {/* Mobile Header with Menu Button */}
          <div className="lg:hidden sticky top-0 z-30 bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl border-b border-gray-200 dark:border-gray-700 p-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold shadow-lg hover:shadow-xl transition-shadow"
              aria-label="Open sidebar"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <span>Menu</span>
            </button>
          </div>

          <div className="p-8">
            {currentCard ? (
              <LearningCard
                card={currentCard}
                onReview={handleReview}
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="text-7xl mb-6">🧠</div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    Select a card to review
                  </p>
                  <p className="text-lg text-gray-600 dark:text-gray-400">
                    Choose from the list on the left
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
