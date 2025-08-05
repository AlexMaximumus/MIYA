
'use client';

import { useState, useEffect, type SetStateAction } from 'react';
import KanaTable from '@/components/kana-table';
import KanaQuiz from '@/components/kana-quiz';
import { hiraganaData, katakanaData } from '@/lib/kana-data';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel"
import WordQuiz from '@/components/word-quiz';
import { vocabularyData } from '@/lib/dictionary-data';

export type KanaSet = 'hiragana' | 'katakana' | 'all';
export type QuizMode = 'kana' | 'vocabulary';
export type QuizLength = 'full' | '25';
export type VocabSet = 'N5' | 'N4' | 'N3' | 'N2' | 'N1';

export default function KanaPage() {
  const [quizMode, setQuizMode] = useState<QuizMode>('kana');
  const [isQuizActive, setQuizActive] = useState(false);
  const [activeKanaSet, setActiveKanaSet] = useState<KanaSet>('hiragana');
  const [activeVocabSet, setActiveVocabSet] = useState<VocabSet>('N5');
  const [quizLength, setQuizLength] = useState<QuizLength>('full');
  const [quizQuestionType, setQuizQuestionType] = useState<'kana-to-romaji' | 'romaji-to-kana' | 'jp_to_ru' | 'ru_to_jp'>('kana-to-romaji');
  const [api, setApi] = useState<CarouselApi>()
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    if (!api) {
      return
    }
 
    setCurrentSlide(api.selectedScrollSnap())
 
    const handleSelect = () => {
      const selectedSlide = api.selectedScrollSnap();
      setCurrentSlide(selectedSlide)
      if (quizMode === 'kana') {
        setActiveKanaSet(selectedSlide === 0 ? 'hiragana' : 'katakana')
      }
    }

    api.on("select", handleSelect)
 
    return () => {
      api.off("select", handleSelect)
    }
  }, [api, quizMode])

  const handleKanaSetChange = (value: SetStateAction<string>) => {
    const kanaSet = value as KanaSet;
    setActiveKanaSet(kanaSet);
    if (kanaSet === 'hiragana' && api?.selectedScrollSnap() !== 0) {
      api.scrollTo(0);
    } else if (kanaSet === 'katakana' && api?.selectedScrollSnap() !== 1) {
      api.scrollTo(1);
    }
  };

  const handleQuizModeChange = (value: string) => {
    const newMode = value as QuizMode;
    setQuizMode(newMode);
    if (newMode === 'kana') {
      setQuizQuestionType('kana-to-romaji');
    } else {
      setQuizQuestionType('jp_to_ru');
    }
  }


  const startQuiz = () => {
    setQuizActive(true);
  };

  const endQuiz = () => {
    setQuizActive(false);
  };

  if (isQuizActive) {
    if (quizMode === 'vocabulary') {
        const words = vocabularyData[activeVocabSet.toLowerCase() as 'n5' | 'n4'];
        return <WordQuiz
            onQuizEnd={endQuiz}
            words={words}
            questionType={quizQuestionType as 'jp_to_ru' | 'ru_to_jp'}
            quizLength={quizLength}
            vocabSet={activeVocabSet}
        />
    }
    return <KanaQuiz 
        onQuizEnd={endQuiz} 
        kanaSet={activeKanaSet}
        quizLength={quizLength}
        questionType={quizQuestionType as 'kana-to-romaji' | 'romaji-to-kana'}
    />;
  }
  
  const getTitle = () => {
    if (quizMode === 'vocabulary') return "Тест по словарю";
    if (activeKanaSet === 'all') return "Хирагана и Катакана";
    return currentSlide === 0 ? "Хирагана" : "Катакана";
  }

  const renderQuizOptions = () => {
    if (quizMode === 'kana') {
      return (
        <>
          <Select value={activeKanaSet} onValueChange={handleKanaSetChange}>
                <SelectTrigger className="w-full sm:w-[240px]">
                    <SelectValue placeholder="Набор символов" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="hiragana">Хирагана</SelectItem>
                    <SelectItem value="katakana">Катакана</SelectItem>
                    <SelectItem value="all">Смешанный (Все подряд)</SelectItem>
                </SelectContent>
            </Select>
            <Select value={quizQuestionType} onValueChange={(value) => setQuizQuestionType(value as 'kana-to-romaji' | 'romaji-to-kana')}>
                <SelectTrigger className="w-full sm:w-[240px]">
                    <SelectValue placeholder="Тип теста" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="kana-to-romaji">Символ → Ромадзи</SelectItem>
                    <SelectItem value="romaji-to-kana">Ромадзи → Символ</SelectItem>
                </SelectContent>
            </Select>
        </>
      )
    }
    return (
        <>
            <Select value={activeVocabSet} onValueChange={(v) => setActiveVocabSet(v as VocabSet)}>
                <SelectTrigger className="w-full sm:w-[240px]">
                    <SelectValue placeholder="Уровень слов" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="N5">Словарь N5</SelectItem>
                    <SelectItem value="N4">Словарь N4</SelectItem>
                    <SelectItem value="N3" disabled>Словарь N3 (скоро)</SelectItem>
                </SelectContent>
            </Select>
             <Select value={quizQuestionType} onValueChange={(value) => setQuizQuestionType(value as 'jp_to_ru' | 'ru_to_jp')}>
                <SelectTrigger className="w-full sm:w-[240px]">
                    <SelectValue placeholder="Тип теста" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="jp_to_ru">Слово → Перевод</SelectItem>
                    <SelectItem value="ru_to_jp">Перевод → Слово</SelectItem>
                </SelectContent>
            </Select>
        </>
    )
  }

  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-background p-4 sm:p-8 pt-16 sm:pt-24 animate-fade-in">
      <div className="w-full max-w-5xl mb-4">
        <Button asChild variant="ghost">
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Назад
          </Link>
        </Button>
      </div>
      <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-8 font-headline text-center">
        {getTitle()}
      </h1>

      {quizMode === 'kana' && (
         <Carousel setApi={setApi} className="w-full max-w-lg">
            <CarouselContent>
            <CarouselItem>
                <KanaTable data={hiraganaData} />
            </CarouselItem>
            <CarouselItem>
                <KanaTable data={katakanaData} />
            </CarouselItem>
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
        </Carousel>
      )}
      
      <Card className="w-full max-w-5xl mt-8 p-6 bg-card/70 shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Проверьте свои знания</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col sm:flex-row items-center justify-center gap-4 flex-wrap">
            <Select value={quizMode} onValueChange={handleQuizModeChange}>
                <SelectTrigger className="w-full sm:w-[240px]">
                    <SelectValue placeholder="Режим" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="kana">Тест по Кане</SelectItem>
                    <SelectItem value="vocabulary">Тест по Словарю</SelectItem>
                </SelectContent>
            </Select>
            
            {renderQuizOptions()}
            
            <Select value={quizLength} onValueChange={(value) => setQuizLength(value as QuizLength)}>
                <SelectTrigger className="w-full sm:w-[240px]">
                    <SelectValue placeholder="Длина теста" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="full">Полный тест</SelectItem>
                    <SelectItem value="25">Случайные 25</SelectItem>
                </SelectContent>
            </Select>

            <Button size="lg" onClick={startQuiz} className="w-full sm:w-auto btn-gradient">
              Начать тест
            </Button>
        </CardContent>
      </Card>

      <div className="mt-8 text-center">
        <Button size="lg" asChild className="btn-gradient">
            <Link href="/vocabulary">Продолжить к Лексике</Link>
        </Button>
      </div>
    </div>
  );
}

    