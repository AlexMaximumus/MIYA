'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowLeft, Mic2 } from 'lucide-react';
import LessonCard from '@/components/lesson-card';

const lessons = [
    {
        id: 'phonetics-lesson-1',
        title: 'Основы фонетического строя',
        description: 'Слоговая структура, акцентуация, долгота звуков, гласные и согласные, основы письменности.',
        href: '/phonetics/lesson-1',
        lessonNumber: 1,
        icon: <Mic2 className="w-8 h-8" />
    },
    {
        id: 'phonetics-lesson-2',
        title: 'Согласные и редукция гласных',
        description: 'Особенности согласных звуков [с], [т], [дз] и их написание. Правила редукции гласных [и] и [у].',
        href: '/phonetics/lesson-2',
        lessonNumber: 2,
        icon: <Mic2 className="w-8 h-8" />
    },
    {
        id: 'phonetics-lesson-3',
        title: 'Лексика, новые согласные и удвоение',
        description: 'Слои лексики (ваго, канго, гайрайго). Согласные рядов НА, ХА, БА, ПА. Удвоение согласных.',
        href: '/phonetics/lesson-3',
        lessonNumber: 3,
        icon: <Mic2 className="w-8 h-8" />
    },
    {
        id: 'phonetics-lesson-4',
        title: 'Йотированные гласные и иероглифы',
        description: 'Слоги с мягкими согласными. Введение в иероглифику: онные и кунные чтения, ключи, правила написания.',
        href: '/phonetics/lesson-4',
        lessonNumber: 4,
        icon: <Mic2 className="w-8 h-8" />
    },
    {
        id: 'phonetics-lesson-5',
        title: 'Согласные, ассимиляция и годзюон',
        description: 'Звуки [р], [в], [н]. Правила ассимиляции. Полная таблица годзюон и новые иероглифы.',
        href: '/phonetics/lesson-5',
        lessonNumber: 5,
        icon: <Mic2 className="w-8 h-8" />
    }
];

export default function PhoneticsHubPage() {
  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-background p-4 sm:p-8 pt-16 sm:pt-24 animate-fade-in">
      <div className="w-full max-w-4xl">
        <div className="flex justify-between items-center mb-4">
          <Button asChild variant="ghost">
            <Link href="/lessons">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Назад к списку разделов
            </Link>
          </Button>
        </div>
        <Card className="w-full mb-8">
            <CardHeader>
                <CardTitle className="text-2xl md:text-3xl">Раздел: Фонетика</CardTitle>
                <CardDescription>Уроки, посвященные звукам, произношению и интонации в японском языке.</CardDescription>
            </CardHeader>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
            <Card className="bg-card/60 border-dashed border-2 flex items-center justify-center text-muted-foreground min-h-[180px]">
                <p>Скоро здесь появятся новые уроки!</p>
            </Card>
        </div>
      </div>
    </div>
  );
}
