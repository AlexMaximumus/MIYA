
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowLeft, BookCheck, CaseUpper } from 'lucide-react';
import LessonCard from '@/components/lesson-card';

const lessons = [
    {
        id: 'grammar-lesson-1',
        title: 'Основы: Связки и предложения',
        description: 'Части речи, связка です, простые утвердительные, отрицательные и вопросительные предложения.',
        href: '/grammar/lesson-1',
        lessonNumber: 1,
        icon: <BookCheck className="w-8 h-8" />
    },
    {
        id: 'grammar-lesson-2',
        title: 'Вопросительные предложения',
        description: 'Структура общих и специальных вопросов, вопросительные слова и правильные ответы на вопросы.',
        href: '/grammar/lesson-2',
        lessonNumber: 2,
        icon: <BookCheck className="w-8 h-8" />
    },
    {
        id: 'grammar-lesson-7',
        title: 'Указательные местоимения',
        description: 'Разбор местоимений これ, それ, あれ. Падежи, частица も и вопросительные предложения в отрицательной форме.',
        href: '/grammar/lesson-7',
        lessonNumber: 7,
        icon: <BookCheck className="w-8 h-8" />
    }
];

export default function GrammarHubPage() {
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
                <CardTitle className="text-2xl md:text-3xl">Раздел: Грамматика</CardTitle>
                <CardDescription>Выберите урок, чтобы погрузиться в теорию и практику японской грамматики.</CardDescription>
            </CardHeader>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {lessons.map(lesson => (
                <LessonCard 
                    key={lesson.id}
                    lessonId={lesson.id}
                    title={lesson.title}
                    description={lesson.description}
                    href={lesson.href}
                    icon={lesson.icon}
                    lessonNumber={lesson.lessonNumber}
                />
            ))}
            {/* Future lessons will be added here */}
            <Card className="bg-card/60 border-dashed border-2 flex items-center justify-center text-muted-foreground min-h-[180px]">
                <p>Скоро здесь появятся новые уроки!</p>
            </Card>
        </div>
      </div>
    </div>
  );
}

    