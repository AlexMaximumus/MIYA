
'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { vocabularyData } from '@/lib/dictionary-data';
import type { Word } from '@/lib/dictionary-data';

const allWordsList = [...vocabularyData.n5, ...vocabularyData.n4, ...vocabularyData.n3, ...vocabularyData.n2, ...vocabularyData.n1];

// --- Types ---
export type WordProgressStatus = 'new' | 'learning' | 'reviewing' | 'mastered';

export interface WordProgress {
    word: string;
    status: WordProgressStatus;
    lastReviewed: string; 
    nextReview: string;
    streak: number;
}

export type QueueItem = {
    word: string;
    type: 'new' | 'review';
}

interface WordProgressState {
    progress: Record<string, WordProgress>;
    activeSessionQueue: QueueItem[];
    activeSessionTotal: number;
    completedInSession: QueueItem[];
    updateWordProgress: (word: string, isCorrect: boolean) => void;
    getWordStatus: (word: string) => WordProgressStatus;
    getStreak: (word: string) => number;
    startNewSession: (allWords: { word: string }[]) => void;
    advanceSession: () => void;
    requeueIncorrectAnswer: () => void;
    getReviewQueue: (allWords: { word: string }[], newWordsPerDay?: number) => QueueItem[];
    getLearnedWordsCount: () => number;
    getTodaysReviewCount: () => number;
    resetProgress: () => void;
}

// --- Spaced Repetition Logic ---
const SRS_INTERVALS_HOURS: { [key: number]: number } = {
  0: 4,    
  1: 8,    
  2: 24,   
  3: 72,   
  4: 168,  
};
const MASTERED_STREAK = 5;

const calculateNextReviewDate = (streak: number): string => {
    const now = new Date();
    const hoursToAdd = SRS_INTERVALS_HOURS[streak] || (SRS_INTERVALS_HOURS[MASTERED_STREAK - 1] * Math.pow(2, streak - (MASTERED_STREAK-1)));
    now.setHours(now.getHours() + hoursToAdd);
    return now.toISOString();
};

const shuffleArray = <T,>(array: T[]): T[] => {
    return [...array].sort(() => Math.random() - 0.5);
};


// --- Zustand Store ---
export const useWordProgress = create<WordProgressState>()(
  persist(
    (set, get) => ({
      progress: {},
      activeSessionQueue: [],
      activeSessionTotal: 0,
      completedInSession: [],

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
          newStreak = 0;
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

      getStreak: (word) => {
        const { progress } = get();
        return progress[word]?.streak || 0;
      },
      
      startNewSession: (allWords) => {
        const newQueue = get().getReviewQueue(allWords, 10);
        set({ 
            activeSessionQueue: shuffleArray(newQueue),
            activeSessionTotal: newQueue.length,
            completedInSession: [],
        });
      },

      advanceSession: () => {
        set(state => {
            if (state.activeSessionQueue.length === 0) return {};
            const completedItem = state.activeSessionQueue[0];
            return {
                completedInSession: [...state.completedInSession, completedItem],
                activeSessionQueue: state.activeSessionQueue.slice(1),
            }
        });
      },
      
      requeueIncorrectAnswer: () => {
        set(state => {
            if (state.activeSessionQueue.length <= 1) return state; // Don't requeue if it's the last card
            const incorrectItem = state.activeSessionQueue[0];
            const remaining = state.activeSessionQueue.slice(1);
            
            // Insert it somewhere in the second half of the remaining queue
            const halfLength = Math.ceil(remaining.length / 2);
            const insertIndex = halfLength + Math.floor(Math.random() * (remaining.length - halfLength + 1));
            
            remaining.splice(insertIndex, 0, incorrectItem);
            
            return { activeSessionQueue: remaining };
        });
      },

      getReviewQueue: (allWords, newWordsPerDay = 10) => {
        const { progress } = get();
        const now = new Date();

        const dueForReview: QueueItem[] = Object.values(progress).filter(p => {
          if (p.status === 'mastered') return false;
          const nextReviewDate = new Date(p.nextReview);
          return nextReviewDate <= now;
        }).map(p => ({ word: p.word, type: 'review' }));

        const newWords: QueueItem[] = allWords
            .filter(w => !progress[w.word])
            .slice(0, newWordsPerDay)
            .map(w => ({ word: w.word, type: 'new' }));
        
        // Limit total session size
        const totalSessionSize = 20;
        const reviewPart = dueForReview.slice(0, totalSessionSize - newWords.length);
        
        return [...reviewPart, ...newWords];
      },

      getLearnedWordsCount: () => {
        const { progress } = get();
        return Object.values(progress).filter(p => p.status === 'mastered').length;
      },

      getTodaysReviewCount: () => {
        return get().getReviewQueue(allWordsList).length;
      },

      resetProgress: () => {
        set({ progress: {}, activeSessionQueue: [], completedInSession: [], activeSessionTotal: 0 });
      },
    }),
    {
      name: 'miya-lingo-word-progress',
      storage: createJSONStorage(() => localStorage),
       partialize: (state) => ({ 
         progress: state.progress,
         activeSessionQueue: state.activeSessionQueue,
         completedInSession: state.completedInSession,
         activeSessionTotal: state.activeSessionTotal
        }),
    }
  )
);
