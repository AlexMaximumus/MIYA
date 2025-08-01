
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, CheckCircle, XCircle, Share2 } from 'lucide-react';
import Link from 'next/link';
import InteractiveText from '@/components/interactive-text';
import { cn } from '@/lib/utils';
import { grammarAnalyses } from '@/ai/precomputed-analysis';
import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard';
import { useToast } from '@/hooks/use-toast';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
  } from '@/components/ui/tooltip';


type ExerciseType = 'multiple-choice' | 'fill-in-the-blank' | 'select-options' | 'sort' | 'construct';

interface Exercise {
    id: string;
    type: ExerciseType;
    title: string;
    description: string;
    options: string[] | { word: string, category: string }[];
    correctAnswer: string | string[];
}

const exercises: Exercise[] = [
    {
        id: 'q1',
        type: 'sort',
        title: 'Упражнение 1: Распредели по частям речи',
        description: 'Перетащи или выбери правильную категорию для каждого слова.',
        options: [
            { word: 'わたし', category: 'местоимение' },
            { word: 'おいしい', category: 'прилагательное' },
            { word: 'に', category: 'частица' },
            { word: 'がくせい', category: 'существительное' },
        ],
        correctAnswer: 'placeholder', // Not used for this exercise type
    },
    {
        id: 'q2',
        type: 'fill-in-the-blank',
        title: 'Упражнение 2: Вставь слово в обращение',
        description: '( )さん！',
        options: ['やまだ', 'です', 'は'],
        correctAnswer: 'やまだ',
    },
    {
        id: 'q3',
        type: 'multiple-choice',
        title: 'Упражнение 3: Определи падеж',
        description: 'В предложении "わたし は がくせい です。" слово "わたし" находится в падеже:',
        options: ['основной', 'именительный', 'винительный'],
        correctAnswer: 'основной',
    },
];

const cases = [
    { name: 'Основной', suffix: '—', description: 'Обращение, именная часть сказуемого' },
    { name: 'Именительный', suffix: 'が', description: 'Подлежащее' },
    { name: 'Родительный', suffix: 'の', description: 'Принадлежность, определение' },
    { name: 'Дательный', suffix: 'に', description: 'Направление, время, место' },
    { name: 'Винительный', suffix: 'を', description: 'Прямое дополнение' },
    { name: 'Творительный', suffix: 'で', description: 'Инструмент, место действия' },
    { name: 'Исходный', suffix: 'から', description: 'Начальная точка (время, место)' },
    { name: 'Предельный', suffix: 'まで', description: 'Конечная точка (время, место)' },
    { name: 'Совместный', suffix: 'と', description: 'Совместное действие ("с кем-то")' },
    { name: 'Сравнительный', suffix: 'より', description: 'Сравнение ("чем...")' },
    { name: 'Направительный', suffix: 'へ', description: 'Направление движения' },
];


const LESSON_ID = 'lesson-1';
const BASE_PROGRESS = 0; // Start from 0, progress is earned

export default function GrammarLesson1Page() {
    const [progress, setProgress] = useState(BASE_PROGRESS);
    const [answers, setAnswers] = useState<Record<string, any>>({ q1: {} });
    const [results, setResults] = useState<Record<string, boolean | null>>({});
    const [_, copy] = useCopyToClipboard();
    const { toast } = useToast();
    const [desuForm, setDesuForm] = useState<'da' | 'desu' | 'dewa arimasen'>('desu');

    useEffect(() => {
        const storedProgress = localStorage.getItem(`${LESSON_ID}-progress`);
        const storedResults = localStorage.getItem(`${LESSON_ID}-results`);
        if (storedProgress) {
            setProgress(JSON.parse(storedProgress));
        } else {
             setProgress(BASE_PROGRESS);
             localStorage.setItem(`${LESSON_ID}-progress`, JSON.stringify(BASE_PROGRESS));
        }
        if (storedResults) {
            setResults(JSON.parse(storedResults));
        }
    }, []);

    const updateProgress = (newResults: Record<string, boolean | null>) => {
        const answeredCorrectly = Object.values(newResults).filter(r => r === true).length;
        const totalQuestions = exercises.length;
        const newProgress = Math.floor((answeredCorrectly / totalQuestions) * 100);
        
        setProgress(newProgress);
        setResults(newResults);
        localStorage.setItem(`${LESSON_ID}-progress`, JSON.stringify(newProgress));
        localStorage.setItem(`${LESSON_ID}-results`, JSON.stringify(newResults));
    };

    const handleShare = () => {
        copy(window.location.href)
            .then(() => {
                toast({
                    title: 'Ссылка скопирована!',
                    description: 'Вы можете поделиться этим уроком с кем угодно.',
                });
            })
            .catch(error => {
                toast({
                    title: 'Ошибка',
                    description: 'Не удалось скопировать ссылку.',
                    variant: 'destructive'
                });
            });
    }

    const handleAnswer = (questionId: string, answer: any) => {
        setAnswers(prev => ({ ...prev, [questionId]: answer }));
    };
    
    const checkAnswers = () => {
        const newResults: Record<string, boolean | null> = {};
        
        // Exercise 1: Sort
        const q1Answer = answers['q1'] || {};
        const q1Correct = (exercises[0].options as {word:string, category:string}[]).every(opt => q1Answer[opt.word] === opt.category);
        newResults['q1'] = q1Correct;

        // Other exercises
        exercises.slice(1).forEach(ex => {
            const isCorrect = answers[ex.id] === ex.correctAnswer;
            newResults[ex.id] = isCorrect;
        });
        
        updateProgress(newResults);
    };

    const renderDesuExample = () => {
        switch(desuForm) {
            case 'da': return 'がくせい だ';
            case 'dewa arimasen': return 'がくせい ではありません';
            case 'desu': 
            default:
                return 'がくせい です';
        }
    }
    
    const renderExercise = (exercise: Exercise, index: number) => {
        const { id, type, title, description, options, correctAnswer } = exercise;
        const result = results[id];

        return (
            <Card key={id} className="w-full">
                <CardHeader>
                    <CardTitle>{title}</CardTitle>
                    <CardDescription>{description}</CardDescription>
                </CardHeader>
                <CardContent>
                    {type === 'sort' && (
                        <div className="flex flex-col gap-4">
                            {(options as {word: string, category: string}[]).map(opt => (
                                <div key={opt.word} className="flex items-center gap-4">
                                    <span className="font-japanese text-xl w-24">{opt.word}</span>
                                    <RadioGroup
                                        value={answers[id]?.[opt.word]}
                                        onValueChange={(val) => handleAnswer(id, {...answers[id], [opt.word]: val})}
                                        className="flex flex-wrap gap-2"
                                    >
                                        {['существительное', 'местоимение', 'прилагательное', 'частица'].map(cat => (
                                            <div key={cat} className="flex items-center space-x-2">
                                                <RadioGroupItem value={cat} id={`${id}-${opt.word}-${cat}`} />
                                                <Label htmlFor={`${id}-${opt.word}-${cat}`}>{cat}</Label>
                                            </div>
                                        ))}
                                    </RadioGroup>
                                </div>
                            ))}
                        </div>
                    )}
                     {type === 'fill-in-the-blank' && (
                         <div className="flex flex-wrap gap-2 items-center">
                            <span className="font-japanese text-xl">{description.split('(')[0]}</span>
                            <div className="inline-flex gap-2">
                                {(options as string[]).map(option => (
                                    <Button 
                                        key={option}
                                        variant={answers[id] === option ? 'default' : 'outline'}
                                        onClick={() => handleAnswer(id, option)}
                                    >
                                        {option}
                                    </Button>
                                ))}
                            </div>
                            <span className="font-japanese text-xl">{description.split(')')[1]}</span>
                        </div>
                    )}
                    {type === 'multiple-choice' && (
                        <RadioGroup value={answers[id]} onValueChange={(val) => handleAnswer(id, val)} className="flex flex-col gap-4">
                            {(options as string[]).map(option => (
                                <div key={option} className="flex items-center space-x-2">
                                    <RadioGroupItem value={option} id={`${id}-${option}`} />
                                    <Label htmlFor={`${id}-${option}`}>{option}</Label>
                                </div>
                            ))}
                        </RadioGroup>
                    )}
                </CardContent>
                <CardFooter>
                     {result === true && <span className="flex items-center gap-2 text-green-600"><CheckCircle/> Верно!</span>}
                     {result === false && <span className="flex items-center gap-2 text-destructive"><XCircle/> Ошибка</span>}
                </CardFooter>
            </Card>
        );
    };


  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-background p-4 sm:p-8 pt-16 sm:pt-24 animate-fade-in">
        <div className="w-full max-w-4xl">
            <div className="flex justify-between items-center mb-4">
                <Button asChild variant="ghost">
                    <Link href="/grammar">
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
                    <p className="text-sm text-primary font-semibold">Урок 1 — Грамматика</p>
                    <CardTitle className="text-2xl md:text-3xl">Тема 1: Части речи и существительные</CardTitle>
                    <CardDescription>Прогресс по теме:</CardDescription>
                    <Progress value={progress} className="mt-2" />
                </CardHeader>
            </Card>

            <h2 className="text-3xl font-bold text-foreground mb-6 text-center">🧠 Теория</h2>
            <Accordion type="single" collapsible className="w-full max-w-4xl mb-12" defaultValue="item-1">
                <AccordionItem value="item-1">
                    <AccordionTrigger className="text-xl font-semibold">§1. Части речи</AccordionTrigger>
                    <AccordionContent className="text-lg text-foreground/90 space-y-4 px-2">
                        <p>В японском языке слова делятся на знаменательные (несущие основной смысл) и служебные (помогающие строить предложения). Междометия стоят особняком.</p>
                        <div className="grid md:grid-cols-2 gap-4">
                            <Card>
                                <CardHeader><CardTitle>Знаменательные</CardTitle></CardHeader>
                                <CardContent>
                                    <p>Несут смысловую нагрузку и имеют грамматические формы.</p>
                                    <ul className="list-disc list-inside mt-2">
                                        <li>существительные, глаголы, прилагательные, местоимения, числительные, наречия.</li>
                                    </ul>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader><CardTitle>Служебные</CardTitle></CardHeader>
                                <CardContent>
                                    <p>Выполняют служебные функции.</p>
                                    <ul className="list-disc list-inside mt-2">
                                    <li>послелоги, союзы, частицы, связки.</li>
                                    </ul>
                                </CardContent>
                            </Card>
                        </div>
                    </AccordionContent>
                </AccordionItem>
                 <AccordionItem value="item-2">
                    <AccordionTrigger className="text-xl font-semibold">§2. Имя существительное</AccordionTrigger>
                    <AccordionContent className="text-lg text-foreground/90 space-y-4 px-2">
                        <p>У существительных в японском нет рода и числа. Множественность выражается контекстом или специальными суффиксами (например, <span className="font-japanese">〜たち</span> для людей). Они склоняются по падежам (11 падежей).</p>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Падеж</TableHead>
                                    <TableHead>Суффикс</TableHead>
                                    <TableHead>Описание</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {cases.map(c => (
                                    <TableRow key={c.name}>
                                        <TableCell>{c.name}</TableCell>
                                        <TableCell className="font-japanese text-lg">{c.suffix}</TableCell>
                                        <TableCell>{c.description}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                    <AccordionTrigger className="text-xl font-semibold">§3. Основной падеж (N)</AccordionTrigger>
                    <AccordionContent className="text-lg text-foreground/90 space-y-4 px-2">
                        <p>Основной падеж совпадает с формой слова в словаре и не имеет специального показателя. Используется в нескольких случаях:</p>
                        <Card className="bg-card/70 mt-4">
                            <CardHeader><CardTitle>1. Обращение</CardTitle></CardHeader>
                            <CardContent>
                                <p>При обращении к кому-либо. Часто используется с вежливыми суффиксами.</p>
                                <p className="font-japanese text-2xl my-2">やまだ！ <span className="text-lg text-muted-foreground">— Ямада!</span></p>
                                <p className="font-japanese text-2xl my-2">やまだ<TooltipProvider><Tooltip><TooltipTrigger><span className="text-primary underline decoration-dotted">さん</span></TooltipTrigger><TooltipContent>Суффиксы вежливости: さん (универсальный), 様 (さま, очень вежливый), 君 (くん, к младшим/равным мужчинам), ちゃん (к детям/близким подругам).</TooltipContent></Tooltip></TooltipProvider>！ <span className="text-lg text-muted-foreground">— г-н Ямада!</span></p>
                            </CardContent>
                        </Card>
                        <Card className="bg-card/70 mt-4">
                            <CardHeader><CardTitle>2. Сказуемое с です</CardTitle></CardHeader>
                            <CardContent>
                                <p>Как именная часть сказуемого. Связка です делает предложение вежливым.</p>
                                <InteractiveText analysis={grammarAnalyses.gakuseidesu} />
                                <div className="flex items-center space-x-2 mt-4">
                                    <Button variant={desuForm === 'da' ? 'default' : 'outline'} size="sm" onClick={() => setDesuForm('da')}>だ</Button>
                                    <Button variant={desuForm === 'desu' ? 'default' : 'outline'} size="sm" onClick={() => setDesuForm('desu')}>です</Button>
                                    <Button variant={desuForm === 'dewa arimasen' ? 'default' : 'outline'} size="sm" onClick={() => setDesuForm('dewa arimasen')}>ではありません</Button>
                                </div>
                                <p className="font-japanese text-2xl mt-2">{renderDesuExample()}</p>
                            </CardContent>
                        </Card>
                        <Card className="bg-card/70 mt-4">
                            <CardHeader><CardTitle>3. С подлежащим через は</CardTitle></CardHeader>
                            <CardContent>
                                <p>Частица は (ва) выделяет тему предложения. Существительное при этом стоит в основном падеже.</p>
                                <InteractiveText analysis={grammarAnalyses.tanakasan_wa_gakuseidesu} />
                            </CardContent>
                        </Card>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
            
            <h2 className="text-3xl font-bold text-foreground mb-8 mt-12 text-center">📝 Закрепление</h2>
            <div className="w-full max-w-4xl space-y-8">
                {exercises.map(renderExercise)}
            </div>
             <div className="mt-12 text-center flex flex-col sm:flex-row justify-center items-center gap-4">
                <Button size="lg" variant="default" onClick={checkAnswers}>Проверить все</Button>
                <Button size="lg" asChild className="btn-gradient">
                    <Link href="#">Следующий параграф → Местоимения</Link>
                </Button>
             </div>
        </div>
    </div>
  );
}

    