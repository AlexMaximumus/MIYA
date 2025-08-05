
'use client';

import { Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft, FileWarning, BookOpen, TestTubeDiagonal, FileText, Image as ImageIcon } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import type { QuizLength, VocabSet, QuizQuestionTypeVocab, KanaSet, QuizQuestionTypeKana } from '@/types/quiz-types';


type TaskType = 'textbook' | 'dictionary' | 'kana' | 'grammar' | 'instructions' | 'image-upload';
interface Task {
    id: string;
    type: TaskType;
    title: string;
    settings: any;
}

interface Assignment {
    title: string;
    tasks: Task[];
}


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
            const num = Number(part.trim());
            if (!isNaN(num)) {
                result.push(num);
            }
        }
    }
    return [...new Set(result)].sort((a,b) => a-b);
}

const formatPageNumber = (num: number): string => {
    return num.toString().padStart(4, '0');
};

function HomeworkContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const assignmentData = searchParams.get('assignment');
    
    let assignment: Assignment | null = null;
    try {
        if (assignmentData) {
            assignment = JSON.parse(decodeURIComponent(atob(assignmentData)));
        }
    } catch (error) {
        console.error("Failed to parse assignment data:", error);
    }
    
    if (!assignment) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh]">
                 <Card className="max-w-lg text-center">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><FileWarning/> Ошибка в ссылке</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p>Не удалось загрузить задание. Пожалуйста, проверьте ссылку или попросите учителя сгенерировать новую.</p>
                    </CardContent>
                </Card>
            </div>
        )
    }

    const startQuiz = (task: Task) => {
        let path = '';
        const params = new URLSearchParams();
        params.append('quiz', 'true');

        switch(task.type) {
            case 'dictionary':
                path = '/dictionary';
                params.append('vocabSet', task.settings.vocabSet);
                params.append('questionType', task.settings.questionType);
                params.append('quizLength', task.settings.quizLength);
                break;
            case 'kana':
                path = '/kana';
                params.append('kanaSet', task.settings.kanaSet);
                params.append('questionType', task.settings.questionType);
                params.append('quizLength', task.settings.quizLength || 'full'); 
                break;
            case 'grammar':
                path = `/grammar/lesson-${task.settings.lesson}`;
                break;
        }
        router.push(`${path}?${params.toString()}`);
    }

    return (
        <div className="space-y-8">
            <h1 className="text-3xl md:text-4xl font-bold text-center">{assignment.title}</h1>

            {assignment.tasks.map((task, index) => (
                <Card key={task.id} className="shadow-lg">
                    <CardHeader>
                        <CardTitle className="text-xl">Задание {index + 1}: {task.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {task.type === 'textbook' && (
                            <div className="space-y-4">
                                {parsePages(task.settings.pages).map(pageNumber => (
                                     <div key={pageNumber} className="border rounded-lg overflow-hidden shadow-md">
                                        <Image
                                            src={`/textbook/textbook_page-${formatPageNumber(pageNumber)}.jpg`}
                                            alt={`Страница учебника ${pageNumber}`}
                                            width={800}
                                            height={1131}
                                            className="w-full h-auto"
                                            unoptimized
                                        />
                                         <div className="text-center p-2 bg-card text-muted-foreground text-sm font-semibold">
                                            Страница {pageNumber}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {task.type === 'dictionary' && (
                            <div className="flex flex-col items-center gap-4">
                               <TestTubeDiagonal className="w-16 h-16 text-primary" />
                                <CardDescription>
                                    Тест по словарю {task.settings.vocabSet}. Тип: "{task.settings.questionType === 'jp_to_ru' ? 'Слово → Перевод' : 'Перевод → Слово'}". Длина: {task.settings.quizLength}.
                                </CardDescription>
                                <Button onClick={() => startQuiz(task)} className="btn-gradient">Начать тест</Button>
                            </div>
                        )}

                        {task.type === 'kana' && (
                             <div className="flex flex-col items-center gap-4">
                               <BookOpen className="w-16 h-16 text-primary" />
                                <CardDescription>
                                    Тест по Кане: {task.settings.kanaSet}. Тип: "{task.settings.questionType === 'kana-to-romaji' ? 'Кана → Ромадзи' : 'Ромадзи → Кана'}".
                                </CardDescription>
                               <Button onClick={() => startQuiz(task)} className="btn-gradient">Начать тест</Button>
                            </div>
                        )}

                        {task.type === 'grammar' && (
                            <div className="flex flex-col items-center gap-4">
                               <BookOpen className="w-16 h-16 text-primary" />
                                <CardDescription>
                                    Пройдите урок по грамматике и выполните все упражнения.
                                </CardDescription>
                               <Button onClick={() => startQuiz(task)} className="btn-gradient">Перейти к уроку {task.settings.lesson}</Button>
                            </div>
                        )}
                        
                        {task.type === 'image-upload' && task.settings.dataUrl && (
                             <div className="space-y-4">
                                {task.settings.instructions && <p className="text-card-foreground whitespace-pre-wrap">{task.settings.instructions}</p>}
                                <Image src={task.settings.dataUrl} alt="Прикрепленное изображение" width={800} height={600} className="rounded-lg border w-full h-auto" />
                             </div>
                        )}

                        {task.type === 'instructions' && (
                             <div className="space-y-4">
                                <p className="text-card-foreground whitespace-pre-wrap">{task.settings.text}</p>
                             </div>
                        )}
                    </CardContent>
                </Card>
            ))}
             <Card className="text-center p-6 bg-green-500/10 border-green-500/30">
                <CardTitle>🎉 Задание выполнено! 🎉</CardTitle>
                <CardDescription className="mt-2">Отличная работа! Можешь сообщить учителю, что все готово.</CardDescription>
            </Card>
        </div>
    )
}

export default function HomeworkPage() {
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
                </div>
                <Suspense fallback={<div>Загрузка задания...</div>}>
                    <HomeworkContent />
                </Suspense>
            </div>
        </div>
    )
}

    