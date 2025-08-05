
'use client';

import { useState, useEffect } from 'react';
import CategoryCard from '@/components/category-card';
import InteractiveText from '@/components/interactive-text';
import { PenLine, BookOpen, Puzzle, CaseUpper, BookText, BrainCircuit, MessageSquare } from 'lucide-react';
import Link from 'next/link';
import { mainScreenAnalyses } from '@/ai/precomputed-analysis';
import type { JapaneseAnalysisOutput } from '@/ai/precomputed-analysis';
import { Skeleton } from '@/components/ui/skeleton';
import { useWordProgress } from '@/hooks/use-word-progress';

const floatingWords = [
  { text: 'こんにちは', highlighted: false },
  { text: 'ありがとう', highlighted: false },
  { text: 'Yamazaki Kento', highlighted: true },
  { text: 'G-Dragon', highlighted: true },
  { text: '127', highlighted: true },
  { text: 'すごい', highlighted: false },
  { text: '日本語', highlighted: false },
];

const grammarLessons = ['lesson-1', 'lesson-2'];
const wordFormationLessons = ['word-formation-lesson-1'];


export default function MainScreen() {
  const [isVibrating, setIsVibrating] = useState(false);
  const [animatedWords, setAnimatedWords] = useState<typeof floatingWords>([]);
  const [clickCount, setClickCount] = useState(0);
  const [lastClickTime, setLastClickTime] = useState(0);
  const [showEasterEgg, setShowEasterEgg] = useState(false);
  const [randomAnalysis, setRandomAnalysis] = useState<JapaneseAnalysisOutput | null>(null);

  // Word Progress
  const { getLearnedWordsCount, getTodaysReviewCount } = useWordProgress();
  const [learnedWords, setLearnedWords] = useState(0);
  const [reviewCount, setReviewCount] = useState(0);

  // Lesson Progress
  const [grammarProgress, setGrammarProgress] = useState<number | null>(null);
  const [wordFormationProgress, setWordFormationProgress] = useState<number | null>(null);


  useEffect(() => {
    // This runs only on the client, after hydration
    setRandomAnalysis(mainScreenAnalyses[Math.floor(Math.random() * mainScreenAnalyses.length)]);

    // Calculate word progress
    setLearnedWords(getLearnedWordsCount());
    setReviewCount(getTodaysReviewCount());

    // Calculate average grammar progress
    const totalGrammarProgress = grammarLessons.reduce((acc, id) => {
        const stored = localStorage.getItem(`${id}-progress`);
        return acc + (stored ? JSON.parse(stored) : 0);
    }, 0);
    setGrammarProgress(Math.round(totalGrammarProgress / grammarLessons.length));

     // Calculate average word formation progress
    const totalWordFormationProgress = wordFormationLessons.reduce((acc, id) => {
        const stored = localStorage.getItem(`${id}-progress`);
        return acc + (stored ? JSON.parse(stored) : 0);
    }, 0);
    setWordFormationProgress(Math.round(totalWordFormationProgress / wordFormationLessons.length));

  }, [getLearnedWordsCount, getTodaysReviewCount]);


  const handleTitleClick = () => {
    const currentTime = new Date().getTime();

    if (currentTime - lastClickTime < 1500) {
      setClickCount(clickCount + 1);
    } else {
      setClickCount(1);
    }
    setLastClickTime(currentTime);

    if (clickCount >= 3) {
      setShowEasterEgg(true);
      setTimeout(() => setShowEasterEgg(false), 3000);
      setClickCount(0);
    }


    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate(100);
    }
    setIsVibrating(true);
    setAnimatedWords(floatingWords);
    setTimeout(() => setIsVibrating(false), 500); // Duration of the animation
    setTimeout(() => setAnimatedWords([]), 1500); // Words fade out
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-background p-4 sm:p-8 pt-16 sm:pt-24 animate-fade-in">
      <div className="relative">
        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 font-headline text-center relative z-10">
          <span 
            onClick={handleTitleClick} 
            className={`cursor-pointer select-none inline-block ${isVibrating ? 'animate-shake' : ''}`}
          >
            MIYA
          </span> LINGO
        </h1>
        {animatedWords.map((word, index) => (
          <span
            key={index}
            className={`absolute text-xl animate-float-up ${word.highlighted ? 'text-primary font-bold' : 'text-foreground/80'}`}
            style={{
                top: `${Math.random() * 80 - 40}%`,
                left: `${Math.random() * 80 + 10}%`,
                animationDelay: `${index * 0.1}s`,
            }}
          >
            {word.text}
          </span>
        ))}
         {showEasterEgg && (
            <div className="absolute inset-0 flex items-center justify-center z-20 animate-fade-in">
                <span className="text-6xl text-destructive font-bold animate-pulse">
                ✨さねちか✨
                </span>
            </div>
        )}
      </div>
      <div className="mb-12 min-h-[60px]">
        {randomAnalysis ? (
          <InteractiveText analysis={randomAnalysis} />
        ) : (
          <div className="space-y-2">
            <Skeleton className="h-8 w-[300px]" />
            <Skeleton className="h-4 w-[250px]" />
          </div>
        )}
      </div>
      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        <Link href="/training" className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-400 to-primary rounded-lg blur opacity-50 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-background-shine"></div>
            <CategoryCard
              icon={<BrainCircuit className="w-10 h-10 md:w-12 md:h-12" />}
              title="Тренировка дня"
              description="Изучайте слова по системе интервальных повторений"
              stats={[
                  { label: "Изучено слов", value: learnedWords },
                  { label: "К повторению", value: reviewCount }
              ]}
              isSpecial
            />
        </Link>
         <Link href="/dialogues" className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-teal-400 to-blue-500 rounded-lg blur opacity-50 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-background-shine"></div>
            <CategoryCard
              icon={<MessageSquare className="w-10 h-10 md:w-12 md:h-12" />}
              title="Диалоги"
              description="Практикуйте общение в реальных ситуациях"
              isSpecial
            />
        </Link>
        <Link href="/kana">
          <CategoryCard
            icon={<PenLine className="w-10 h-10 md:w-12 md:h-12" />}
            title="Кана"
            description="Изучите и проверьте знание японских азбук"
          />
        </Link>
        <Link href="/dictionary">
          <CategoryCard
            icon={<BookText className="w-10 h-10 md:w-12 md:h-12" />}
            title="Словарь и Тесты"
            description="Ищите слова и проверяйте свои знания"
          />
        </Link>
        <Link href="/grammar">
            <CategoryCard
              icon={<Puzzle className="w-10 h-10 md:w-12 md:h-12" />}
              title="Грамматика"
              description="Освойте правила и структуры"
              progress={grammarProgress}
            />
        </Link>
        <Link href="/word-formation">
            <CategoryCard
              icon={<CaseUpper className="w-10 h-10 md:w-12 md:h-12" />}
              title="Словообразование"
              description="Изучите строение слов"
              progress={wordFormationProgress}
            />
        </Link>
         <Link href="/vocabulary">
          <CategoryCard
            icon={<BookOpen className="w-10 h-10 md:w-12 md:h-12" />}
            title="Лексика по урокам"
            description="Тематические подборки слов"
          />
        </Link>
      </div>
    </div>
  );
}
