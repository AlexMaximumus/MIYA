
'use client';

import { useState, useEffect } from 'react';
import CategoryCard from '@/components/category-card';
import InteractiveText from '@/components/interactive-text';
import { PenLine, BookOpen, Puzzle, Workflow } from 'lucide-react';
import Link from 'next/link';
import { mainScreenAnalyses } from '@/ai/precomputed-analysis';
import type { JapaneseAnalysisOutput } from '@/ai/precomputed-analysis';
import { Skeleton } from '@/components/ui/skeleton';

const floatingWords = [
  { text: 'こんにちは', highlighted: false },
  { text: 'ありがとう', highlighted: false },
  { text: 'Yamazaki Kento', highlighted: true },
  { text: 'G-Dragon', highlighted: true },
  { text: '127', highlighted: true },
  { text: 'すごい', highlighted: false },
  { text: '日本語', highlighted: false },
];

export default function MainScreen() {
  const [isVibrating, setIsVibrating] = useState(false);
  const [animatedWords, setAnimatedWords] = useState<typeof floatingWords>([]);
  const [clickCount, setClickCount] = useState(0);
  const [lastClickTime, setLastClickTime] = useState(0);
  const [showEasterEgg, setShowEasterEgg] = useState(false);
  const [randomAnalysis, setRandomAnalysis] = useState<JapaneseAnalysisOutput | null>(null);

  useEffect(() => {
    // This runs only on the client, after hydration
    setRandomAnalysis(mainScreenAnalyses[Math.floor(Math.random() * mainScreenAnalyses.length)]);
  }, []);


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
      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
        <Link href="/kana">
          <CategoryCard
            icon={<PenLine className="w-10 h-10 md:w-12 md:h-12" />}
            title="Хирагана и катакана"
            description="Изучите японские слоги"
          />
        </Link>
        <Link href="/vocabulary">
          <CategoryCard
            icon={<BookOpen className="w-10 h-10 md:w-12 md:h-12" />}
            title="Лексика"
            description="Пополняйте словарный запас"
          />
        </Link>
        <Link href="/grammar">
            <CategoryCard
              icon={<Puzzle className="w-10 h-10 md:w-12 md:h-12" />}
              title="Грамматика"
              description="Освойте правила и структуры"
            />
        </Link>
        <CategoryCard
          icon={<Workflow className="w-10 h-10 md:w-12 md:h-12" />}
          title="Синтаксис и построение предложений"
          description="Научитесь строить предложения"
        />
      </div>
    </div>
  );
}
