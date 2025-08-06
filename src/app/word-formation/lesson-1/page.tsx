
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, CheckCircle, XCircle, Share2, CaseUpper, Check, X } from 'lucide-react';
import Link from 'next/link';
import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import InteractiveText from '@/components/interactive-text';
import { grammarAnalyses } from '@/ai/precomputed-analysis';

type ExerciseType = 'multiple-choice' | 'fill-in-the-blank' | 'select-correct' | 'matching';

interface Exercise {
    id: string;
    type: ExerciseType;
    title: string;
    description: string;
    options: any[];
    correctAnswer: any;
}

const exercises: Exercise[] = [
    {
        id: 'q1',
        type: 'fill-in-the-blank',
        title: 'Упражнение 1: Вставь нужный суффикс',
        description: 'Добавьте さん, где это уместно.',
        options: [
            { word: 'やまだ', answer: 'さん' },
            { word: 'わたし', answer: '' },
        ],
        correctAnswer: { 'やまだ': 'さん', 'わたし': '' },
    },
    {
        id: 'q2',
        type: 'select-correct',
        title: 'Упражнение 2: Выбери подходящий префикс',
        description: '( )せんもん',
        options: ['お', 'ご'],
        correctAnswer: 'ご',
    },
    {
        id: 'q3',
        type: 'select-correct',
        title: 'Упражнение 3: Укажи ошибочное слово',
        description: 'Какое из этих слов написано с ошибкой?',
        options: ['おちゃ', 'ごなまえ', 'おなまえ'],
        correctAnswer: 'ごなまえ',
    },
    {
        id: 'q4',
        type: 'matching',
        title: 'Упражнение 4: Соотнеси слово и префикс',
        description: 'Перетащите или выберите правильный префикс для каждого слова.',
        options: [
            { word: 'ちゃ', correctAnswer: 'お' },
            { word: 'せんもん', correctAnswer: 'ご' },
            { word: 'なまえ', correctAnswer: 'お' }
        ],
        correctAnswer: 'placeholder', // Handled internally
    },
    {
        id: 'q5',
        type: 'multiple-choice',
        title: 'Упражнение 5: Переведи с учётом вежливости',
        description: 'Как вежливо сказать "Ваше имя"?',
        options: ['なまえ', 'おなまえ', 'ごなまえ'],
        correctAnswer: 'おなまえ',
    }
];

const affixesData = [
    { word: 'なまえ', correct: 'お', type: 'japanese' },
    { word: 'ちゃ', correct: 'お', type: 'japanese' },
    { word: 'せんもん', correct: 'ご', type: 'chinese' },
    { word: 'かぞく', correct: 'ご', type: 'chinese' },
    { word: 'かね', correct: 'お', type: 'japanese' },
    { word: 'りょうしん', correct: 'ご', type: 'chinese' }
];

const LESSON_ID = 'word-formation-lesson-1';

export default function WordFormationLesson1Page() {
    const [progress, setProgress] = useState(0);
    const [answers, setAnswers] = useState<Record<string, any>>({});
    const [results, setResults] = useState<Record<string, boolean | null>>({});
    const [_, copy] = useCopyToClipboard();
    const { toast } = useToast();

    useEffect(() => {
        try {
            const storedProgress = localStorage.getItem(`${LESSON_ID}-progress`);
            const storedAnswers = localStorage.getItem(`${LESSON_ID}-answers`);
    
            if (storedProgress) setProgress(JSON.parse(storedProgress));
            if (storedAnswers) setAnswers(JSON.parse(storedAnswers));
        } catch (error) {
            console.error("Failed to parse from localStorage", error);
        }
    }, []);

    const updateProgress = (newResults: Record<string, boolean | null>) => {
        const answeredCorrectly = Object.values(newResults).filter(r => r === true).length;
        const totalQuestions = exercises.length;
        const newProgress = Math.floor((answeredCorrectly / totalQuestions) * 100);
        
        setProgress(newProgress);
        setResults(newResults);
        try {
            localStorage.setItem(`${LESSON_ID}-progress`, JSON.stringify(newProgress));
            localStorage.setItem(`${LESSON_ID}-results`, JSON.stringify(newResults));
            localStorage.setItem(`${LESSON_ID}-answers`, JSON.stringify(answers));
        } catch (error) {
            console.error("Failed to save to localStorage", error);
        }
    };
    
    const handleShare = () => {
        copy(window.location.href)
            .then(() => toast({ title: 'Ссылка скопирована!', description: 'Вы можете поделиться этим уроком с кем угодно.' }))
            .catch(() => toast({ title: 'Ошибка', description: 'Не удалось скопировать ссылку.', variant: 'destructive' }));
    }

    const handleAnswer = (questionId: string, answer: any) => {
        setAnswers(prev => ({ ...prev, [questionId]: answer }));
    };

    const checkAnswers = () => {
        const newResults: Record<string, boolean | null> = {};
        
        exercises.forEach(ex => {
            let isCorrect = false;
            const userAnswer = answers[ex.id];

            switch(ex.type) {
                case 'fill-in-the-blank':
                    isCorrect = userAnswer && Object.keys(ex.correctAnswer).every(key => userAnswer[key] === ex.correctAnswer[key]);
                    break;
                case 'matching':
                    isCorrect = userAnswer && (ex.options as any[]).every(opt => userAnswer[opt.word] === opt.correctAnswer);
                    break;
                default:
                    isCorrect = userAnswer === ex.correctAnswer;
            }
            newResults[ex.id] = isCorrect;
        });
        
        updateProgress(newResults);
        try {
             localStorage.setItem(`${LESSON_ID}-answers`, JSON.stringify(answers));
        } catch (error) => {
            console.error("Failed to save answers to localStorage", error);
        }
    };

    const renderExercise = (exercise: Exercise) => {
        const { id, type, title, description, options } = exercise;
        const result = results[id];

        const baseCard = (content: React.ReactNode) => (
            <Card key={id} className="w-full">
                <CardHeader>
                    <CardTitle>{title}</CardTitle>
                    <CardDescription>{description}</CardDescription>
                </CardHeader>
                <CardContent>{content}</CardContent>
                <CardFooter>
                     {result === true && <span className="flex items-center gap-2 text-green-600"><CheckCircle/> Верно!</span>}
                     {result === false && <span className="flex items-center gap-2 text-destructive"><XCircle/> Ошибка</span>}
                </CardFooter>
            </Card>
        );

        switch (type) {
            case 'fill-in-the-blank':
                return baseCard(
                    <div className="space-y-4">
                        {(options as {word: string, answer: string}[]).map(opt => (
                            <div key={opt.word} className="flex items-center gap-2">
                                <span className="font-japanese text-xl w-24">{opt.word}</span>
                                <RadioGroup 
                                    value={answers[id]?.[opt.word]} 
                                    onValueChange={(val) => handleAnswer(id, {...(answers[id] || {}), [opt.word]: val})} 
                                    className="flex gap-4">
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="さん" id={`${id}-${opt.word}-san`} />
                                        <Label htmlFor={`${id}-${opt.word}-san`}>さん</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="" id={`${id}-${opt.word}-none`} />
                                        <Label htmlFor={`${id}-${opt.word}-none`}>- (ничего)</Label>
                                    </div>
                                </RadioGroup>
                            </div>
                        ))}
                    </div>
                );
            case 'select-correct':
            case 'multiple-choice':
                return baseCard(
                    <RadioGroup value={answers[id]} onValueChange={(val) => handleAnswer(id, val)} className="flex flex-col gap-4">
                        {(options as string[]).map(option => (
                            <div key={option} className="flex items-center space-x-2">
                                <RadioGroupItem value={option} id={`${id}-${option}`} />
                                <Label htmlFor={`${id}-${option}`}>{option}</Label>
                            </div>
                        ))}
                    </RadioGroup>
                );
            case 'matching':
                return baseCard(
                    <div className="space-y-4">
                        {(options as {word: string, correctAnswer: string}[]).map(opt => (
                            <div key={opt.word} className="flex items-center gap-4">
                                <span className="font-japanese text-xl w-24">{opt.word}</span>
                                <RadioGroup 
                                    value={answers[id]?.[opt.word]} 
                                    onValueChange={(val) => handleAnswer(id, {...(answers[id] || {}), [opt.word]: val})} 
                                    className="flex gap-4">
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="お" id={`${id}-${opt.word}-o`} />
                                        <Label htmlFor={`${id}-${opt.word}-o`}>お</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="ご" id={`${id}-${opt.word}-go`} />
                                        <Label htmlFor={`${id}-${opt.word}-go`}>ご</Label>
                                    </div>
                                </RadioGroup>
                            </div>
                        ))}
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="flex flex-col items-center justify-start min-h-screen bg-background p-4 sm:p-8 pt-16 sm:pt-24 animate-fade-in">
            <div className="w-full max-w-4xl">
                <div className="flex justify-between items-center mb-4">
                    <Button asChild variant="ghost">
                        <Link href="/word-formation">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            К списку уроков
                        </Link>
                    </Button>
                    <Button variant="outline" onClick={handleShare}>
                        <Share2 className="mr-2 h-4 w-4" />
                        Поделиться уроком
                    </Button>
                </div>
                <Card className="w-full mb-8">
                    <CardHeader>
                        <p className="text-sm text-primary font-semibold">Урок 1 — Словообразование</p>
                        <CardTitle className="text-2xl md:text-3xl">Тема: Аффиксы вежливости</CardTitle>
                        <CardDescription>Прогресс по теме:</CardDescription>
                        <Progress value={progress} className="mt-2" />
                    </CardHeader>
                </Card>

                <h2 className="text-3xl font-bold text-foreground mb-6 text-center">🧠 Теория</h2>
                <Accordion type="single" collapsible className="w-full max-w-4xl mb-12" defaultValue="item-1">
                    <AccordionItem value="item-1">
                        <AccordionTrigger className="text-xl font-semibold">§1. Суффикс вежливости さん</AccordionTrigger>
                        <AccordionContent className="text-lg text-foreground/90 space-y-4 px-2">
                            <p>Категория вежливости — основа японской речевой культуры. Суффикс <b className="text-primary font-japanese">〜さん</b> является универсальным и самым распространенным способом выказать уважение к собеседнику. Его можно перевести как «господин/госпожа».</p>
                             <ul className="list-disc list-inside space-y-2">
                                <li>Присоединяется к фамилиям, именам и некоторым должностям.</li>
                                <li><b>Важно:</b> Никогда не используется по отношению к себе (<span className="text-destructive font-japanese">❌ わたしさん</span>).</li>
                                <li>Используется при обращении ко 2-му и 3-му лицу.</li>
                            </ul>
                            <Card className="bg-card/70 mt-4">
                                <CardHeader><CardTitle>Примеры</CardTitle></CardHeader>
                                <CardContent>
                                    <InteractiveText analysis={grammarAnalyses.yamadasan} />
                                    <InteractiveText analysis={grammarAnalyses.tanakasan} />
                                </CardContent>
                            </Card>
                        </AccordionContent>
                    </AccordionItem>
                     <AccordionItem value="item-2">
                        <AccordionTrigger className="text-xl font-semibold">§2. Префиксы вежливости お- и ご-</AccordionTrigger>
                        <AccordionContent className="text-lg text-foreground/90 space-y-4 px-2">
                            <p>Префиксы <b className="text-primary font-japanese">お-</b> и <b className="text-primary font-japanese">ご-</b> ставятся перед существительными, чтобы придать им вежливый оттенок. Часто они используются, когда речь идет о чем-то, что принадлежит собеседнику, или для общей вежливости.</p>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Префикс</TableHead>
                                        <TableHead>Применение</TableHead>
                                        <TableHead>Примеры</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    <TableRow>
                                        <TableCell className="font-japanese text-2xl text-primary">お-</TableCell>
                                        <TableCell>Слова японского происхождения</TableCell>
                                        <TableCell className="font-japanese">おなまえ (имя), おちゃ (чай), おかね (деньги)</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell className="font-japanese text-2xl text-primary">ご-</TableCell>
                                        <TableCell>Слова китайского происхождения (с онным чтением кандзи)</TableCell>
                                        <TableCell className="font-japanese">ごせんもん (специальность), ごかぞく (семья)</TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                             <Card className="bg-card/70 mt-4">
                                <CardHeader><CardTitle>Интерактивный тренажёр</CardTitle></CardHeader>
                                <CardContent>
                                    <p className="mb-4">Выберите правильный префикс для каждого слова:</p>
                                    {affixesData.map(({ word, correct, type }) => (
                                        <div key={word} className="flex items-center gap-4 mb-2">
                                            <span className="font-japanese text-xl w-24">{word}</span>
                                            <RadioGroup className="flex gap-4">
                                                 <div className="flex items-center space-x-2">
                                                    <RadioGroupItem value="お" id={`${word}-o`} />
                                                    <Label htmlFor={`${word}-o`}>お</Label>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <RadioGroupItem value="ご" id={`${word}-go`} />
                                                    <Label htmlFor={`${word}-go`}>ご</Label>
                                                </div>
                                            </RadioGroup>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>

                <h2 className="text-3xl font-bold text-foreground mb-8 mt-12 text-center">📝 Закрепление</h2>
                 <Card className="w-full mb-8">
                    <CardHeader>
                        <CardTitle className="text-center">Выводы</CardTitle>
                    </CardHeader>
                    <CardContent className="text-center space-y-2">
                        <p><b className="text-primary font-japanese">さん</b> используется только при обращении к другим людям для выказывания уважения.</p>
                        <p><b className="text-primary font-japanese">お-</b> и <b className="text-primary font-japanese">ご-</b> — грамматические показатели вежливости, которые ставятся перед существительными.</p>
                    </CardContent>
                </Card>

                <div className="w-full max-w-4xl space-y-8 mt-8">
                    {exercises.map(renderExercise)}
                </div>
                <div className="mt-12 text-center flex flex-col sm:flex-row justify-center items-center gap-4">
                    <Button size="lg" variant="default" onClick={checkAnswers}>Проверить все</Button>
                    <Button size="lg" asChild className="btn-gradient" disabled>
                        <Link href="#">Перейти к Уроку 2 →</Link>
                    </Button>
                </div>
            </div>
        </div>
    );
}
