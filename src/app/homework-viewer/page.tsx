
'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft, FileWarning } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

const parsePages = (pagesStr: string | null): number[] => {
    if (!pagesStr) return [];
    const result: number[] = [];
    
    const parts = pagesStr.split(',');
    for (const part of parts) {
        if (part.includes('-')) {
            const [start, end] = part.split('-').map(Number);
            if (!isNaN(start) && !isNaN(end) && start <= end) {
                for (let i = start; i <= end; i++) {
                    result.push(i);
                }
            }
        } else {
            const num = Number(part);
            if (!isNaN(num)) {
                result.push(num);
            }
        }
    }
    return result;
}

function HomeworkViewerContent() {
    const searchParams = useSearchParams();
    const pagesStr = searchParams.get('pages');
    const pages = parsePages(pagesStr);

    if (pages.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh]">
                 <Card className="max-w-lg">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><FileWarning/> Ошибка в ссылке</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p>Не указаны страницы для просмотра. Пожалуйста, проверьте ссылку или попросите учителя сгенерировать новую.</p>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="space-y-4">
            {pages.map(pageNumber => (
                <div key={pageNumber} className="border rounded-lg overflow-hidden shadow-lg">
                    <Image
                        src={`/textbook/${pageNumber}.jpg`}
                        alt={`Страница учебника ${pageNumber}`}
                        width={800}
                        height={1131} // Assuming A4-like aspect ratio
                        className="w-full h-auto"
                        placeholder="blur"
                        blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII="
                        unoptimized // Recommended for locally served images if you have many
                    />
                     <div className="text-center p-2 bg-card text-muted-foreground text-sm font-semibold">
                        Страница {pageNumber}
                    </div>
                </div>
            ))}
        </div>
    )
}

export default function HomeworkViewerPage() {
    return (
        <div className="flex flex-col items-center justify-start min-h-screen bg-background p-4 sm:p-8 pt-16 sm:pt-24 animate-fade-in">
            <div className="w-full max-w-4xl">
                 <div className="flex justify-between items-center mb-6">
                    <Button asChild variant="ghost">
                        <Link href="/">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Назад на главную
                        </Link>
                    </Button>
                    <h1 className="text-2xl font-bold">Домашнее задание</h1>
                </div>
                <Suspense fallback={<div>Загрузка страниц...</div>}>
                    <HomeworkViewerContent />
                </Suspense>
            </div>
        </div>
    )
}
