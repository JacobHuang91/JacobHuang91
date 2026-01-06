export type KnowledgeType = 'high-frequency' | 'low-frequency' | 'awareness-only';

export interface ReviewSchedule {
  initial: string; // ISO date string
  firstReview?: string;
  secondReview?: string;
  thirdReview?: string;
  monthlyReview?: string;
}

export interface LearningCard {
  id: string;
  title: string;
  emoji?: string; // Visual memory aid
  category: string;
  type: KnowledgeType;
  useWhen: string;
  typicalCase: string[];
  oneLineEssence: string;
  example?: string;
  risks?: string;
  whenNotToUse?: string;
  related?: string[];
  reviewSchedule: ReviewSchedule;
  lastReviewed?: string;
  reviewCount: number;
}
