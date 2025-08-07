
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowLeft, Share2 } from 'lucide-react';
import Link from 'next/link';
import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard';
import { useToast } from '@/hooks/use-toast';
import { Progress } from '@/components/ui/progress';

export default function KanjiLesson1Page() {
    const [_, copy] = useCopyToClipboard();
    const { toast } = useToast();

    const handleShare = () => {
        copy(window.location.href)
            .then(() => toast({ title: 'Ссылка скопирована!', description: 'Вы можете поделиться этим уроком с кем угодно.' }))
            .catch(() => toast({ title: 'Ошибка', description: 'Не удалось скопировать ссылку.', variant: 'destructive' }));
    }

  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-background p-4 sm:p-8 pt-16 sm:pt-24 animate-fade-in">
        <div className="w-full max-w-4xl">
            <div className="flex justify-between items-center mb-4">
                <Button asChild variant="ghost">
                    <Link href="/kanji">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        К списку уроков по Кандзи
                    </Link>
                </Button>
                <Button variant="outline" onClick={handleShare}>
                    <Share2 className="mr-2 h-4 w-4" />
                    Поделиться уроком
                </Button>
            </div>
            <Card className="w-full mb-8">
                <CardHeader>
                    <p className="text-sm text-primary font-semibold">Урок 1 — Кандзи</p>
                    <CardTitle className="text-2xl md:text-3xl">Тема в разработке...</CardTitle>
                    <CardDescription>Содержимое этого урока будет добавлено в следующих обновлениях.</CardDescription>
                    <Progress value={0} className="mt-2" />
                </CardHeader>
            </Card>

            <div className="mt-12 text-center flex flex-col items-center gap-4">
                <Button size="lg" asChild className="btn-gradient w-full max-w-xs" disabled>
                    <Link href="/kanji/lesson-2">Перейти к Уроку 2 →</Link>
                </Button>
            </div>
        </div>
    </div>
  );
}
