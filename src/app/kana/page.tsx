'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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

export default function KanaPage() {
  const [isQuizActive, setQuizActive] = useState(false);
  const [activeKana, setActiveKana] = useState<'hiragana' | 'katakana'>('hiragana');
  const [quizQuestionType, setQuizQuestionType] = useState<'kana-to-romaji' | 'romaji-to-kana'>('kana-to-romaji');

  const startQuiz = () => {
    setQuizActive(true);
  };

  const endQuiz = () => {
    setQuizActive(false);
  };

  if (isQuizActive) {
    const quizData = activeKana === 'hiragana' ? hiraganaData : katakanaData;
    return <KanaQuiz data={quizData} onQuizEnd={endQuiz} quizType={activeKana} questionType={quizQuestionType} />;
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

      <Tabs defaultValue="hiragana" className="w-full max-w-5xl" onValueChange={(value) => setActiveKana(value as 'hiragana' | 'katakana')}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="hiragana">Хирагана</TabsTrigger>
          <TabsTrigger value="katakana">Катакана</TabsTrigger>
        </TabsList>
        <TabsContent value="hiragana">
          <KanaTable data={hiraganaData} />
        </TabsContent>
        <TabsContent value="katakana">
          <KanaTable data={katakanaData} />
        </TabsContent>
      </Tabs>
      
      <Card className="w-full max-w-5xl mt-8 p-6 bg-card/70 shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Проверьте свои знания</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col sm:flex-row items-center justify-center gap-4">
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
        <Button size="lg" className="btn-gradient">Продолжить к Лексике</Button>
      </div>
    </div>
  );
}
