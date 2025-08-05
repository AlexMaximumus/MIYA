
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Clipboard, Check } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { useTeacherMode } from '@/hooks/use-teacher-mode';
import type { QuizLength, VocabSet, QuizQuestionTypeVocab } from '@/types/quiz-types';

export default function HomeworkGeneratorPage() {
    const [quizType, setQuizType] = useState('dictionary');
    const [vocabSet, setVocabSet] = useState<VocabSet>('N5');
    const [questionType, setQuestionType] = useState<QuizQuestionTypeVocab>('jp_to_ru');
    const [quizLength, setQuizLength] = useState<QuizLength>('25');
    const [generatedUrl, setGeneratedUrl] = useState('');

    const [_, copy] = useCopyToClipboard();
    const { toast } = useToast();
    const router = useRouter();
    const { isTeacherMode } = useTeacherMode();
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
        // Redirect if not in teacher mode
        if (isTeacherMode === false) { // check for explicit false, as initial state can be undefined
             router.push('/');
        }
    }, [isTeacherMode, router]);


    const generateLink = () => {
        if (typeof window !== 'undefined') {
            const baseUrl = window.location.origin;
            let path = '';
            const params = new URLSearchParams();

            if (quizType === 'dictionary') {
                path = '/dictionary';
                params.append('quiz', 'true');
                params.append('vocabSet', vocabSet);
                params.append('questionType', questionType);
                params.append('quizLength', quizLength);
            }
            // Future logic for grammar quizzes can be added here
            
            const fullUrl = `${baseUrl}${path}?${params.toString()}`;
            setGeneratedUrl(fullUrl);
        }
    };

    const handleCopy = () => {
        copy(generatedUrl)
            .then(() => toast({ title: 'Ссылка скопирована!', description: 'Теперь вы можете отправить ее ученику.' }))
            .catch(() => toast({ title: 'Ошибка', description: 'Не удалось скопировать ссылку.', variant: 'destructive' }));
    };

    if (!isClient || isTeacherMode === false) {
        // Render nothing or a loading spinner while redirecting
        return null;
    }


    return (
        <div className="flex flex-col items-center justify-start min-h-screen bg-background p-4 sm:p-8 pt-16 sm:pt-24 animate-fade-in">
            <div className="w-full max-w-2xl">
                <div className="flex justify-between items-center mb-4">
                    <Button asChild variant="ghost">
                        <Link href="/">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Назад на главную
                        </Link>
                    </Button>
                </div>
                <Card className="w-full mb-8 shadow-lg border-primary/50">
                    <CardHeader>
                        <CardTitle className="text-2xl md:text-3xl">Конструктор домашних заданий</CardTitle>
                        <CardDescription>Создайте тест для ученика и поделитесь ссылкой.</CardDescription>
                    </CardHeader>
                </Card>

                <Card className="w-full">
                    <CardHeader>
                        <CardTitle>Параметры теста</CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Select value={quizType} onValueChange={setQuizType}>
                            <SelectTrigger>
                                <SelectValue placeholder="Тип задания" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="dictionary">Тест по словарю</SelectItem>
                                <SelectItem value="grammar" disabled>Тест по грамматике (скоро)</SelectItem>
                            </SelectContent>
                        </Select>
                        
                        <Select value={vocabSet} onValueChange={(v) => setVocabSet(v as VocabSet)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Уровень слов" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="N5">Словарь N5</SelectItem>
                                <SelectItem value="N4">Словарь N4</SelectItem>
                                <SelectItem value="N3">Словарь N3</SelectItem>
                                <SelectItem value="N2">Словарь N2</SelectItem>
                                <SelectItem value="N1">Словарь N1</SelectItem>
                            </SelectContent>
                        </Select>

                        <Select value={questionType} onValueChange={(v) => setQuestionType(v as QuizQuestionTypeVocab)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Тип вопросов" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="jp_to_ru">Слово → Перевод</SelectItem>
                                <SelectItem value="ru_to_jp">Перевод → Слово</SelectItem>
                            </SelectContent>
                        </Select>

                        <Select value={quizLength} onValueChange={(v) => setQuizLength(v as QuizLength)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Количество вопросов" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="25">25 вопросов</SelectItem>
                                <SelectItem value="50">50 вопросов</SelectItem>
                                <SelectItem value="full">Все слова уровня</SelectItem>
                            </SelectContent>
                        </Select>
                        
                        <Button size="lg" onClick={generateLink} className="md:col-span-2 btn-gradient">
                            Сгенерировать ссылку на тест
                        </Button>
                    </CardContent>
                </Card>
                
                {generatedUrl && (
                    <Card className="mt-8 animate-fade-in">
                        <CardHeader>
                            <CardTitle>Готовая ссылка</CardTitle>
                        </CardHeader>
                        <CardContent className="flex items-center gap-4">
                            <Input value={generatedUrl} readOnly className="text-muted-foreground"/>
                            <Button onClick={handleCopy} size="icon" variant="outline">
                                <Clipboard className="w-5 h-5"/>
                            </Button>
                        </CardContent>
                    </Card>
                )}

            </div>
        </div>
    );
}
