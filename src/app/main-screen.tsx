
'use client';

import { useState, useEffect } from 'react';
import CategoryCard from '@/components/category-card';
import InteractiveText from '@/components/interactive-text';
import { PenLine, BookOpen, Puzzle, CaseUpper, BookText, BrainCircuit, MessageSquare, GraduationCap, School, Gamepad2 } from 'lucide-react';
import Link from 'next/link';
import { mainScreenAnalyses } from '@/ai/precomputed-analysis';
import type { JapaneseAnalysisOutput } from '@/ai/precomputed-analysis';
import { Skeleton } from '@/components/ui/skeleton';
import { useWordProgress } from '@/hooks/use-word-progress';
import { useTeacherMode } from '@/hooks/use-teacher-mode';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import WelcomeDialog from '@/components/welcome-dialog';


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

  const { isTeacherMode, isNewTeacher, disableTeacherMode } = useTeacherMode();


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
      <WelcomeDialog />
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
        {isTeacherMode && isNewTeacher && (
             <Alert className="max-w-lg mb-8 animate-fade-in border-primary/50 text-foreground">
                <Terminal className="h-4 w-4" />
                <AlertTitle>Режим Учителя активирован!</AlertTitle>
                <AlertDescription>
                    Теперь ты сенсей. Задавай домашку через новый раздел.
                </AlertDescription>
            </Alert>
        )}
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
        {isTeacherMode ? (
            <>
                <Link href="/homework-generator" className="relative group md:col-span-2">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-yellow-400 to-primary rounded-lg blur opacity-60 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-background-shine"></div>
                    <CategoryCard
                        icon={<GraduationCap className="w-10 h-10 md:w-12 md:h-12" />}
                        title="Конструктор Д/З"
                        description="Создавайте кастомные тесты и делитесь ими с учениками"
                        isSpecial
                    />
                </Link>
                 <div onClick={disableTeacherMode} className="cursor-pointer">
                    <CategoryCard
                        icon={<School className="w-10 h-10 md:w-12 md:h-12" />}
                        title="Стать балбесом"
                        description="Вернуться в режим ученика и проходить уроки"
                    />
                </div>
            </>
        ) : (
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
        )}
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
         <Link href="/sentence-scramble">
            <CategoryCard
              icon={<Gamepad2 className="w-10 h-10 md:w-12 md:h-12" />}
              title="Собери фразу"
              description="Мини-игра на составление предложений"
            />
        </Link>
        <div className="relative group">
            <CategoryCard
              icon={<MessageSquare className="w-10 h-10 md:w-12 md:h-12" />}
              title="Диалоги"
              description="Практикуйте общение в реальных ситуациях"
            />
            <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center cursor-not-allowed">
              <span className="text-white text-lg font-bold bg-black/60 px-4 py-2 rounded-md">СКОРО</span>
            </div>
        </div>
      </div>
    </div>
  );
}
