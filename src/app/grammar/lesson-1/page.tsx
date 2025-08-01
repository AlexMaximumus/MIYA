
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
import { ArrowLeft, CheckCircle, XCircle, Share2, Volume2 } from 'lucide-react';
import Link from 'next/link';
import InteractiveText from '@/components/interactive-text';
import InteractiveFormula from '@/components/interactive-formula';
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


type ExerciseType = 'multiple-choice' | 'fill-in-the-blank' | 'sort' | 'construct' | 'select-correct';

interface Exercise {
    id: string;
    type: ExerciseType;
    title: string;
    description: string;
    options: any[] | { word: string, category: string }[];
    correctAnswer: any;
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
    {
        id: 'q5',
        type: 'multiple-choice',
        title: 'Упражнение 5: Укажи правильное местоимение',
        description: '"Он — студент."',
        options: ['あのかた', 'わたし', 'あなた'],
        correctAnswer: 'あのかた'
    },
    {
        id: 'q6',
        type: 'multiple-choice',
        title: 'Упражнение 6: Выбери правильную форму "что"',
        description: '(　)ですか？',
        options: ['なに', 'なん'],
        correctAnswer: 'なん'
    },
    {
        id: 'q7',
        type: 'select-correct',
        title: 'Упражнение 7: Отметь вежливую форму',
        description: 'Какое из этих местоимений более вежливое?',
        options: ['あのひと', 'あのかた'],
        correctAnswer: 'あのかた'
    },
    {
        id: 'q8',
        type: 'construct',
        title: 'Упражнение 8: Преобразуй в отрицательное',
        description: 'Преобразуйте предложение "わたし は がくせい です。" в отрицательную форму.',
        options: ["わたし", "は", "がくせい", "では", "ありません"],
        correctAnswer: "わたし は がくせい では ありません"
    },
    {
        id: 'q9',
        type: 'construct',
        title: 'Упражнение 9: Собери по частям',
        description: 'Соберите вопрос "Что это?"',
        options: ["です", "か", "なん", "これ", "は"],
        correctAnswer: "これ は なん です か"
    },
    {
        id: 'q10',
        type: 'construct',
        title: 'Упражнение 10: Построй утверждение',
        description: 'Подлежащее: わたし, Сказуемое: がくせい',
        options: ["わたし", "は", "がくせい", "です"],
        correctAnswer: "わたし は がくせい です"
    },
    {
        id: 'q11',
        type: 'construct',
        title: 'Упражнение 11: Сделай отрицание',
        description: 'Основа: あのひと は せんせい',
        options: ["あのひと", "は", "せんせい", "では", "ありません"],
        correctAnswer: "あのひと は せんせい では ありません"
    },
    {
        id: 'q12',
        type: 'fill-in-the-blank',
        title: 'Упражнение 12: Определи пропущенное подлежащее',
        description: '(　) は せんせい です。',
        options: ["たなかさん", "がくせい", "わたし"],
        correctAnswer: "たなかさん"
    },
    {
        id: 'q13',
        type: 'construct',
        title: 'Упражнение 13: Расставь по порядку',
        description: 'Пример: "Я не студент"',
        options: ["わたし", "は", "がくせい", "ではありません"],
        correctAnswer: "わたし は がくせい ではありません"
    }
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

const pronouns = [
    { face: '1-е лицо', jp: 'わたくし', romaji: 'watakushi', translation: 'я (очень вежливо)', plural: 'わたくしたち' },
    { face: '1-е лицо', jp: 'わたし', romaji: 'watashi', translation: 'я (нейтрально)', plural: 'わたしたち' },
    { face: '2-е лицо', jp: 'あなた', romaji: 'anata', translation: 'ты, вы', plural: 'あなたがた' },
    { face: '3-е лицо', jp: 'あのかた', romaji: 'ano kata', translation: 'он, она (вежливо)', plural: 'あのかたがた' },
    { face: '3-е лицо', jp: 'あのひと', romaji: 'ano hito', translation: 'он, она (нейтрально)', plural: 'あのひとたち' },
];

const LESSON_ID = 'lesson-1';

const ExerciseConstruct = ({ exercise, answers, handleConstructAnswer, resetConstructAnswer }: {
    exercise: Exercise,
    answers: Record<string, any>,
    handleConstructAnswer: (questionId: string, word: string) => void,
    resetConstructAnswer: (questionId: string) => void
}) => {
    const { id, options } = exercise;
    const [shuffledOptions, setShuffledOptions] = useState<string[]>([]);

    useEffect(() => {
        const stringOptions = options.map(o => typeof o === 'string' ? o : o.word);
        setShuffledOptions([...stringOptions].sort(() => Math.random() - 0.5));
    }, [options]);

    return (
        <div className="space-y-4">
            <div className="border rounded-md p-4 min-h-[50px] bg-muted/50 text-xl font-japanese">
                {(answers[id] || []).join(' ')}
            </div>
            <div className="flex flex-wrap gap-2">
                {shuffledOptions.map((word, index) => (
                    <Button key={index} variant="outline" onClick={() => handleConstructAnswer(id, word)}>
                        {word}
                    </Button>
                ))}
            </div>
            <Button variant="ghost" size="sm" onClick={() => resetConstructAnswer(id)}>Сбросить</Button>
        </div>
    );
}

export default function GrammarLesson1Page() {
    const [progress, setProgress] = useState(0);
    const [answers, setAnswers] = useState<Record<string, any>>(() => {
        const initialAnswers: Record<string, any> = { q1: {} };
        exercises.forEach(ex => {
            if (ex.type === 'construct') {
                initialAnswers[ex.id] = [];
            }
        });
        return initialAnswers;
    });
    const [results, setResults] = useState<Record<string, boolean | null>>({});
    const [_, copy] = useCopyToClipboard();
    const { toast } = useToast();
    const [desuForm, setDesuForm] = useState<'da' | 'desu' | 'dewa arimasen'>('desu');
    const [showPlural, setShowPlural] = useState(false);
    const [desuAssertion, setDesuAssertion] = useState<'affirmative' | 'negative'>('affirmative');
    const [dewaJa, setDewaJa] = useState<'dewa' | 'ja'>('dewa');
    
    useEffect(() => {
        try {
            const storedProgress = localStorage.getItem(`${LESSON_ID}-progress`);
            const storedResults = localStorage.getItem(`${LESSON_ID}-results`);
            const storedAnswers = localStorage.getItem(`${LESSON_ID}-answers`);

            if (storedProgress) setProgress(JSON.parse(storedProgress));
            if (storedResults) setResults(JSON.parse(storedResults));
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

    const handleConstructAnswer = (questionId: string, word: string) => {
        setAnswers(prev => {
            const currentAnswer = prev[questionId] || [];
            return { ...prev, [questionId]: [...currentAnswer, word] };
        });
    }

    const resetConstructAnswer = (questionId: string) => {
        setAnswers(prev => ({ ...prev, [questionId]: [] }));
    }
    
    const checkAnswers = () => {
        const newResults: Record<string, boolean | null> = {};
        
        exercises.forEach(ex => {
            let isCorrect = false;
            if (ex.type === 'sort') {
                const q1Answer = answers[ex.id] || {};
                isCorrect = (ex.options as {word:string, category:string}[]).every(opt => q1Answer[opt.word] === opt.category);
            } else if (ex.type === 'construct') {
                const userAnswer = (answers[ex.id] || []).join(' ');
                isCorrect = userAnswer.trim() === (ex.correctAnswer as string).trim();
            } else {
                isCorrect = answers[ex.id] === ex.correctAnswer;
            }
            newResults[ex.id] = isCorrect;
        });
        
        updateProgress(newResults);
        try {
            localStorage.setItem(`${LESSON_ID}-answers`, JSON.stringify(answers));
        } catch (error) {
             console.error("Failed to save answers to localStorage", error);
        }
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
            case 'sort':
                return baseCard(
                    <div className="flex flex-col gap-4">
                        {(options as {word: string, category: string}[]).map(opt => (
                            <div key={opt.word} className="flex items-center gap-4">
                                <span className="font-japanese text-xl w-24">{opt.word}</span>
                                <RadioGroup value={answers[id]?.[opt.word]} onValueChange={(val) => handleAnswer(id, {...answers[id], [opt.word]: val})} className="flex flex-wrap gap-2">
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
                );
            case 'fill-in-the-blank':
            case 'select-correct':
                return baseCard(
                    <RadioGroup value={answers[id]} onValueChange={(val) => handleAnswer(id, val)} className="flex flex-col gap-2">
                        {(options as string[]).map(option => (
                            <div key={option} className="flex items-center space-x-2">
                                <RadioGroupItem value={option} id={`${id}-${option}`} />
                                <Label htmlFor={`${id}-${option}`}>{option}</Label>
                            </div>
                        ))}
                    </RadioGroup>
                );
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
            case 'construct':
                return baseCard(
                   <ExerciseConstruct
                        exercise={exercise}
                        answers={answers}
                        handleConstructAnswer={handleConstructAnswer}
                        resetConstructAnswer={resetConstructAnswer}
                   />
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
                    <CardTitle className="text-2xl md:text-3xl">Тема 1: Основы японского предложения</CardTitle>
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
                <AccordionItem value="item-4">
                    <AccordionTrigger className="text-xl font-semibold">§4. Личные местоимения</AccordionTrigger>
                    <AccordionContent className="text-lg text-foreground/90 space-y-4 px-2">
                        <p>Местоимения в японском языке зависят от контекста и уровня вежливости. Часто их и вовсе опускают, если понятно, о ком речь.</p>
                        <div className="flex items-center space-x-2 my-4">
                            <Switch id="plural-switch" checked={showPlural} onCheckedChange={setShowPlural} />
                            <Label htmlFor="plural-switch">Показать множественное число</Label>
                        </div>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Лицо</TableHead>
                                    <TableHead>Местоимение</TableHead>
                                    <TableHead>Перевод</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {pronouns.map(p => (
                                    <TableRow key={p.jp}>
                                        <TableCell>{p.face}</TableCell>
                                        <TableCell className="font-japanese text-lg">
                                            {showPlural ? p.plural : p.jp}
                                        </TableCell>
                                        <TableCell>{p.translation}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                         <p className="text-sm text-muted-foreground mt-2"><b>Важно:</b> местоимение <b>あなた</b> (ты/вы) используется редко. Японцы предпочитают обращаться к человеку по имени или должности (например, やまださん или せんせい).</p>
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-5">
                    <AccordionTrigger className="text-xl font-semibold">§5. Вопросительное местоимение 何 (что)</AccordionTrigger>
                    <AccordionContent className="text-lg text-foreground/90 space-y-4 px-2">
                        <p>Местоимение <span className="font-japanese">何</span> (что) имеет два чтения: <b className="text-primary">なん (nan)</b> и <b className="text-primary">なに (nani)</b>. Выбор зависит от следующего за ним звука.</p>
                        <ul className="list-disc list-inside space-y-1">
                            <li>Читается <b className="font-japanese">なん</b> перед частицами <span className="font-japanese">です</span>, <span className="font-japanese">の</span>, а также перед слогами на <b>т, д, н</b>.</li>
                            <li>В остальных случаях чаще читается <b className="font-japanese">なに</b>.</li>
                        </ul>
                        <Card className="bg-card/70 mt-4">
                            <CardHeader><CardTitle>Пример</CardTitle></CardHeader>
                            <CardContent>
                                <InteractiveText analysis={grammarAnalyses.sorewanandesuka} />
                            </CardContent>
                        </Card>
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-6">
                    <AccordionTrigger className="text-xl font-semibold">§6. Формы связки です</AccordionTrigger>
                    <AccordionContent className="text-lg text-foreground/90 space-y-4 px-2">
                        <p>Связка <span className="font-japanese">です</span> используется для вежливого завершения предложений с именным сказуемым в настоящем-будущем времени.</p>
                        <div className="flex items-center space-x-2 my-4">
                             <Label>Форма:</Label>
                             <Button variant={desuAssertion === 'affirmative' ? 'default' : 'outline'} size="sm" onClick={() => setDesuAssertion('affirmative')}>Утверждение</Button>
                             <Button variant={desuAssertion === 'negative' ? 'default' : 'outline'} size="sm" onClick={() => setDesuAssertion('negative')}>Отрицание</Button>
                        </div>
                        <Table>
                             <TableHeader>
                                <TableRow>
                                    <TableHead>Форма</TableHead>
                                    <TableHead>Степень вежливости</TableHead>
                                    <TableHead>Пример</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                            {desuAssertion === 'affirmative' ? (
                                <>
                                    <TableRow>
                                        <TableCell className="font-japanese">です</TableCell>
                                        <TableCell>Вежливая</TableCell>
                                        <TableCell><InteractiveText analysis={grammarAnalyses.gakuseidesu} /></TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell className="font-japanese">だ</TableCell>
                                        <TableCell>Простая (разговорная)</TableCell>
                                        <TableCell><span className="font-japanese text-2xl">がくせい だ</span></TableCell>
                                    </TableRow>
                                </>
                            ) : (
                                <>
                                    <TableRow>
                                        <TableCell className="font-japanese">ではありません</TableCell>
                                        <TableCell>Вежливая</TableCell>
                                        <TableCell><InteractiveText analysis={grammarAnalyses.watashi_wa_gakusei_dewa_arimasen} /></TableCell>
                                    </TableRow>
                                     <TableRow>
                                        <TableCell className="font-japanese">じゃない</TableCell>
                                        <TableCell>Простая (разговорная)</TableCell>
                                        <TableCell><span className="font-japanese text-2xl">がくせい じゃない</span></TableCell>
                                    </TableRow>
                                </>
                            )}
                            </TableBody>
                        </Table>
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-7">
                    <AccordionTrigger className="text-xl font-semibold">§7. Простое нераспространённое предложение</AccordionTrigger>
                    <AccordionContent className="text-lg text-foreground/90 space-y-4 px-2">
                        <p>Предложение состоит из подлежащего (часто с частицей は) и сказуемого (существительное + связка).</p>
                        
                        <Card className="bg-card/70 mt-4">
                            <CardHeader><CardTitle>Структура утверждения: <InteractiveFormula formula="N は N です 。" /></CardTitle></CardHeader>
                            <CardContent className="space-y-4">
                                <InteractiveText analysis={grammarAnalyses.anokatahasenseidesu} />
                                <InteractiveText analysis={grammarAnalyses.gakuseihaanohitodesu} />
                            </CardContent>
                        </Card>

                        <Card className="bg-card/70 mt-4">
                            <CardHeader><CardTitle>Структура отрицания: <InteractiveFormula formula="N は N では (じゃ) ありません 。" /></CardTitle></CardHeader>
                            <CardContent>
                                <div className="flex items-center space-x-2 my-4">
                                    <Label>Форма:</Label>
                                    <Button variant={dewaJa === 'dewa' ? 'default' : 'outline'} size="sm" onClick={() => setDewaJa('dewa')}>Формальная (では)</Button>
                                    <Button variant={dewaJa === 'ja' ? 'default' : 'outline'} size="sm" onClick={() => setDewaJa('ja')}>Разговорная (じゃ)</Button>
                                </div>
                                {dewaJa === 'dewa' ? (
                                    <InteractiveText analysis={grammarAnalyses.anokatahasenseidehaarimasen} />
                                ) : (
                                    <InteractiveText analysis={grammarAnalyses.gakuseihaanohitojaarimasen} />
                                )}
                            </CardContent>
                        </Card>
                        
                        <Card className="bg-card/70 mt-4">
                            <CardHeader><CardTitle>Особенность: опускаемое подлежащее</CardTitle></CardHeader>
                            <CardContent>
                                <p>Подлежащее часто опускается, если оно понятно из контекста. Сказуемое же обязательно.</p>
                                <InteractiveText analysis={grammarAnalyses.senseidesu} />
                            </CardContent>
                        </Card>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
            
            <h2 className="text-3xl font-bold text-foreground mb-8 mt-12 text-center">📝 Закрепление</h2>
            <div className="space-y-4">
                <Card><CardHeader><CardTitle className="text-center">Примеры (文例)</CardTitle></CardHeader>
                <CardContent className="space-y-6">
                    <InteractiveText analysis={grammarAnalyses.watashiwagakuseidesu} />
                    <InteractiveText analysis={grammarAnalyses.anokatawagakuseidehaarimasen} />
                    <InteractiveText analysis={grammarAnalyses.watashiwasenseidehaarimasengakuseidesu} />
                    <InteractiveText analysis={grammarAnalyses.anokatawadonadesuka} />
                    <InteractiveText analysis={grammarAnalyses.anokatawayamadasandesu} />
                </CardContent>
                </Card>
            </div>
            <div className="w-full max-w-4xl space-y-8 mt-8">
                {exercises.map(renderExercise)}
            </div>
             <div className="mt-12 text-center flex flex-col sm:flex-row justify-center items-center gap-4">
                <Button size="lg" variant="default" onClick={checkAnswers}>Проверить все</Button>
                <Button size="lg" asChild className="btn-gradient">
                    <Link href="/grammar/lesson-2">Перейти к Уроку 2 →</Link>
                </Button>
             </div>
        </div>
    </div>
  );
}

    
