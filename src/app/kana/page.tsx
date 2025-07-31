'use client';

import { useState } from 'react';
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

export type KanaSet = 'hiragana' | 'katakana' | 'all';
export type QuizLength = 'full' | '25';

export default function KanaPage() {
  const [isQuizActive, setQuizActive] = useState(false);
  const [activeKanaSet, setActiveKanaSet] = useState<KanaSet>('hiragana');
  const [quizLength, setQuizLength] = useState<QuizLength>('full');
  const [quizQuestionType, setQuizQuestionType] = useState<'kana-to-romaji' | 'romaji-to-kana'>('kana-to-romaji');

  const startQuiz = () => {
    setQuizActive(true);
  };

  const endQuiz = () => {
    setQuizActive(false);
  };

  if (isQuizActive) {
    return <KanaQuiz 
        onQuizEnd={endQuiz} 
        kanaSet={activeKanaSet}
        quizLength={quizLength}
        questionType={quizQuestionType} 
    />;
  }

  const currentData = activeKanaSet === 'hiragana' ? hiraganaData : katakanaData;

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
        Хирагана и Катакана
      </h1>

      {activeKanaSet !== 'all' && <KanaTable data={currentData} />}
      
      <Card className="w-full max-w-5xl mt-8 p-6 bg-card/70 shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Проверьте свои знания</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col sm:flex-row items-center justify-center gap-4 flex-wrap">
            <Select value={activeKanaSet} onValueChange={(value) => setActiveKanaSet(value as KanaSet)}>
                <SelectTrigger className="w-full sm:w-[240px]">
                    <SelectValue placeholder="Набор символов" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="hiragana">Хирагана</SelectItem>
                    <SelectItem value="katakana">Катакана</SelectItem>
                    <SelectItem value="all">Смешанный (Все подряд)</SelectItem>
                </SelectContent>
            </Select>

            <Select value={quizLength} onValueChange={(value) => setQuizLength(value as QuizLength)}>
                <SelectTrigger className="w-full sm:w-[240px]">
                    <SelectValue placeholder="Длина теста" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="full">Полный тест</SelectItem>
                    <SelectItem value="25">Случайные 25</SelectItem>
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
