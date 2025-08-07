
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, BookMarked, TestTubeDiagonal } from 'lucide-react';
import { kanjiData } from '@/lib/dictionary-data';
import KanjiCard from '@/components/kanji-card';

export default function KanjiHubPage() {
    const [isQuizActive, setQuizActive] = useState(false);

    // TODO: Implement Kanji Quiz component and state management
    // For now, the quiz section is a placeholder.

  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-background p-4 sm:p-8 pt-16 sm:pt-24 animate-fade-in">
      <div className="w-full max-w-6xl">
        <div className="flex justify-between items-center mb-4">
          <Button asChild variant="ghost">
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Назад на главную
            </Link>
          </Button>
        </div>
        <Card className="w-full mb-8">
            <CardHeader>
                <div className="flex items-center gap-4">
                    <BookMarked className="w-10 h-10 text-primary" />
                    <div>
                        <CardTitle className="text-2xl md:text-3xl">Раздел: Кандзи (漢字)</CardTitle>
                        <CardDescription>Изучайте иероглифы, их чтения и значения по уровням JLPT.</CardDescription>
                    </div>
                </div>
            </CardHeader>
        </Card>

        <Tabs defaultValue="n5" className="w-full">
            <div className="flex justify-center mb-6">
                 <TabsList>
                    <TabsTrigger value="n5">N5</TabsTrigger>
                    <TabsTrigger value="n4" disabled>N4</TabsTrigger>
                    <TabsTrigger value="n3" disabled>N3</TabsTrigger>
                    <TabsTrigger value="n2" disabled>N2</TabsTrigger>
                    <TabsTrigger value="n1" disabled>N1</TabsTrigger>
                </TabsList>
            </div>
            <TabsContent value="n5">
                <Card>
                    <CardContent className="p-4">
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                            {kanjiData.n5.map(kanji => (
                                <KanjiCard key={kanji.kanji} {...kanji} />
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </TabsContent>
        </Tabs>

        <Card className="w-full mt-8">
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><TestTubeDiagonal className="w-5 h-5" />Тест по Кандзи</CardTitle>
                <CardDescription>Этот раздел в разработке. Скоро здесь можно будет проверить свои знания!</CardDescription>
            </CardHeader>
            <CardContent>
                 <Button size="lg" disabled>
                    Начать тест (скоро)
                </Button>
            </CardContent>
        </Card>

      </div>
    </div>
  );
}
