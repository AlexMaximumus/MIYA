
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowLeft, BookCheck, CaseUpper, BookOpen, MessageSquare, Puzzle } from 'lucide-react';
import LessonCard from '@/components/lesson-card';

const lessonCategories = [
    {
        id: 'grammar',
        title: 'Грамматика',
        description: 'Освойте правила и структуры, от основ до сложных конструкций. Пройдите уроки и закрепите знания упражнениями.',
        href: '/grammar',
        icon: <Puzzle className="w-8 h-8" />,
        lessonIdPrefix: 'lesson-'
    },
    {
        id: 'word-formation',
        title: 'Словообразование',
        description: 'Изучите, как строятся японские слова, разберитесь в аффиксах и принципах словосложения.',
        href: '/word-formation',
        icon: <CaseUpper className="w-8 h-8" />,
        lessonIdPrefix: 'word-formation-lesson-'
    },
    {
        id: 'vocabulary-by-topic',
        title: 'Лексика по урокам',
        description: 'Тематические подборки слов для расширения вашего словарного запаса в конкретных областях.',
        href: '/vocabulary',
        icon: <BookOpen className="w-8 h-8" />,
        lessonIdPrefix: 'vocab-lesson-'
    },
];

export default function LessonsHubPage() {
  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-background p-4 sm:p-8 pt-16 sm:pt-24 animate-fade-in">
      <div className="w-full max-w-4xl">
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
                <CardTitle className="text-2xl md:text-3xl">Раздел: Уроки</CardTitle>
                <CardDescription>Здесь собраны все теоретические материалы. Выберите категорию для изучения.</CardDescription>
            </CardHeader>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {lessonCategories.map(cat => (
                 <Link href={cat.href} key={cat.id} className="flex">
                    <Card className="bg-card/60 backdrop-blur-sm border-primary/20 shadow-lg hover:shadow-primary/20 transition-all duration-300 cursor-pointer transform hover:-translate-y-2 group w-full flex flex-col">
                        <CardHeader className="flex flex-row items-center gap-4">
                            <div className="text-primary bg-primary/20 p-3 rounded-lg group-hover:scale-110 transition-transform duration-300">
                                {cat.icon}
                            </div>
                            <div>
                                <CardTitle className="text-xl">{cat.title}</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="flex-grow flex flex-col justify-between">
                            <CardDescription>
                                {cat.description}
                            </CardDescription>
                        </CardContent>
                    </Card>
                </Link>
            ))}
             <Card className="bg-card/60 border-dashed border-2 flex items-center justify-center text-muted-foreground min-h-[180px] md:col-span-2">
                <div className="text-center">
                    <MessageSquare className="w-10 h-10 mx-auto mb-2"/>
                    <p>Раздел "Диалоги" скоро появится!</p>
                </div>
            </Card>
        </div>
      </div>
    </div>
  );
}
