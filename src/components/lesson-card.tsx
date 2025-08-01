
'use client';

import { useState, useEffect, type ReactNode } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface LessonCardProps {
    lessonId: string;
    title: string;
    description: string;
    href: string;
    icon: ReactNode;
    lessonNumber: number;
}

const BASE_PROGRESS = 80;

export default function LessonCard({ lessonId, title, description, href, icon, lessonNumber }: LessonCardProps) {
    const [progress, setProgress] = useState<number | null>(null);

    useEffect(() => {
        // This effect runs on the client-side only
        const storedProgress = localStorage.getItem(`${lessonId}-progress`);
        if (storedProgress) {
            setProgress(JSON.parse(storedProgress));
        } else {
            // If no progress is stored, we can assume it's not started beyond the base
            // or you can set it to the base progress by default if viewing the theory counts.
            setProgress(BASE_PROGRESS);
        }
    }, [lessonId]);

    return (
        <Link href={href} className="flex">
            <Card className="bg-card/60 backdrop-blur-sm border-primary/20 shadow-lg hover:shadow-primary/20 transition-all duration-300 cursor-pointer transform hover:-translate-y-2 group w-full flex flex-col">
                <CardHeader className="flex flex-row items-center gap-4">
                    <div className="text-primary bg-primary/20 p-3 rounded-lg group-hover:scale-110 transition-transform duration-300">
                        {icon}
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-primary">Урок {lessonNumber}</p>
                        <CardTitle className="text-xl">{title}</CardTitle>
                    </div>
                </CardHeader>
                <CardContent className="flex-grow flex flex-col justify-between">
                    <CardDescription>
                        {description}
                    </CardDescription>
                    <div className="mt-4">
                        <p className="text-xs text-muted-foreground mb-1">Прогресс:</p>
                        <Progress value={progress} />
                    </div>
                </CardContent>
            </Card>
        </Link>
    );
}

    