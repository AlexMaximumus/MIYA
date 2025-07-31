'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import KanaTable from '@/components/kana-table';
import KanaQuiz from '@/components/kana-quiz';
import { hiraganaData, katakanaData } from '@/lib/kana-data';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function KanaPage() {
  const [isQuizActive, setQuizActive] = useState(false);
  const [quizType, setQuizType] = useState<'hiragana' | 'katakana'>('hiragana');

  const startQuiz = (type: 'hiragana' | 'katakana') => {
    setQuizType(type);
    setQuizActive(true);
  };

  const endQuiz = () => {
    setQuizActive(false);
  };

  if (isQuizActive) {
    const quizData = quizType === 'hiragana' ? hiraganaData : katakanaData;
    return <KanaQuiz data={quizData} onQuizEnd={endQuiz} quizType={quizType} />;
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
        Хирагана и Катакана
      </h1>

      <Tabs defaultValue="hiragana" className="w-full max-w-5xl">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="hiragana">Хирагана</TabsTrigger>
          <TabsTrigger value="katakana">Катакана</TabsTrigger>
        </TabsList>
        <TabsContent value="hiragana">
          <KanaTable data={hiraganaData} />
          <div className="mt-8 text-center">
            <Button size="lg" onClick={() => startQuiz('hiragana')}>
              Проверить себя
            </Button>
          </div>
        </TabsContent>
        <TabsContent value="katakana">
          <KanaTable data={katakanaData} />
           <div className="mt-8 text-center">
            <Button size="lg" onClick={() => startQuiz('katakana')}>
              Проверить себя
            </Button>
          </div>
        </TabsContent>
      </Tabs>
      <div className="mt-8 text-center">
        <Button size="lg">Продолжить к Лексике</Button>
      </div>
    </div>
  );
}
