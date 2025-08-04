
'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// --- Types ---
export type WordProgressStatus = 'new' | 'learning' | 'reviewing' | 'mastered';

export interface WordProgress {
    word: string; // The Japanese word itself as the unique ID
    status: WordProgressStatus;
    lastReviewed: string; // ISO 8601 date string
    nextReview: string; // ISO 8601 date string
    streak: number; // Number of consecutive correct answers
}

interface WordProgressState {
    progress: Record<string, WordProgress>;
    updateWordProgress: (word: string, isCorrect: boolean) => void;
    getWordStatus: (word: string) => WordProgressStatus;
    getReviewQueue: (allWords: { word: string }[], newWordsPerDay?: number) => string[];
    resetProgress: () => void;
}

// --- Spaced Repetition Logic ---
const SRS_INTERVALS_HOURS: { [key: number]: number } = {
  0: 4,      // New -> 4 hours
  1: 8,      // 1 correct -> 8 hours
  2: 24,     // 2 correct -> 1 day
  3: 72,     // 3 correct -> 3 days
  4: 168,    // 4 correct -> 1 week
  5: 336,    // 5 correct -> 2 weeks
  6: 720,    // 6 correct -> 1 month
  7: 2160,   // 7 correct -> 3 months
  8: 4320,   // 8 correct -> 6 months
};
const MASTERED_STREAK = 9;

const calculateNextReviewDate = (streak: number): string => {
    const now = new Date();
    const hoursToAdd = SRS_INTERVALS_HOURS[streak] || SRS_INTERVALS_HOURS[MASTERED_STREAK-1];
    now.setHours(now.getHours() + hoursToAdd);
    return now.toISOString();
};

// --- Zustand Store ---
export const useWordProgress = create<WordProgressState>()(
  persist(
    (set, get) => ({
      progress: {},

      updateWordProgress: (word, isCorrect) => {
        const { progress } = get();
        const now = new Date().toISOString();
        const currentWord = progress[word] || {
          word,
          status: 'new',
          streak: 0,
          lastReviewed: now,
          nextReview: now,
        };
        
        let newStreak: number;
        let newStatus: WordProgressStatus;

        if (isCorrect) {
          newStreak = currentWord.streak + 1;
        } else {
          // Reset streak, but maybe not all the way to 0 to be less punishing.
          newStreak = Math.max(0, Math.floor(currentWord.streak / 2));
        }
        
        if (newStreak >= MASTERED_STREAK) {
          newStatus = 'mastered';
        } else if (newStreak > 0) {
            newStatus = 'reviewing';
        } else {
            newStatus = 'learning';
        }

        const newProgressData: WordProgress = {
          ...currentWord,
          status: newStatus,
          streak: newStreak,
          lastReviewed: now,
          nextReview: calculateNextReviewDate(newStreak),
        };

        set((state) => ({
          progress: {
            ...state.progress,
            [word]: newProgressData,
          },
        }));
      },

      getWordStatus: (word) => {
        const { progress } = get();
        return progress[word]?.status || 'new';
      },
      
      getReviewQueue: (allWords, newWordsPerDay = 10) => {
        const { progress } = get();
        const now = new Date();

        // Get all words due for review
        const dueForReview = Object.values(progress).filter(p => {
          if (p.status === 'mastered') return false;
          const nextReviewDate = new Date(p.nextReview);
          return nextReviewDate <= now;
        }).map(p => p.word);

        // Get new words, ensuring they are not already in progress
        const newWords = allWords
            .filter(w => !progress[w.word])
            .slice(0, newWordsPerDay)
            .map(w => w.word);
        
        // Combine and shuffle
        const queue = [...new Set([...dueForReview, ...newWords])];
        return queue.sort(() => Math.random() - 0.5);
      },

      resetProgress: () => {
        set({ progress: {} });
      },
    }),
    {
      name: 'miya-lingo-word-progress',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
