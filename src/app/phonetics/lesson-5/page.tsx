
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, CheckCircle, XCircle, Share2, Mic2 } from 'lucide-react';
import Link from 'next/link';
import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard';
import { useToast } from '@/hooks/use-toast';
import InteractiveText from '@/components/interactive-text';
import { phoneticsAnalyses, dialogueAnalyses } from '@/ai/precomputed-analysis';

const LESSON_ID = 'phonetics-lesson-5';

const kanaRows = {
    ra: [{ kana: 'ら', romaji: 'ra' }, { kana: 'り', romaji: 'ri' }, { kana: 'る', romaji: 'ru' }, { kana: 'れ', romaji: 're' }, { kana: 'ろ', romaji: 'ro' }],
    wa: [{ kana: 'わ', romaji: 'wa' }, { kana: 'を', romaji: 'o (wo)' }, { kana: 'ん', romaji: 'n' }],
    rya: [{ kana: 'りゃ', romaji: 'rya' }, { kana: 'りゅ', romaji: 'ryu' }, { kana: 'りょ', romaji: 'ryo' }],
};

const gojuonTable = [
    ['あ', 'か', 'さ', 'た', 'な', 'は', 'ま', 'や', 'ら', 'わ'],
    ['い', 'き', 'し', 'ち', 'に', 'ひ', 'み', '', 'り', ''],
    ['う', 'く', 'す', 'つ', 'ぬ', 'ふ', 'む', 'ゆ', 'る', ''],
    ['え', 'け', 'せ', 'て', 'ね', 'へ', 'め', '', 'れ', ''],
    ['お', 'こ', 'そ', 'と', 'の', 'ほ', 'も', 'よ', 'ろ', 'を'],
    ['', '', '', '', '', '', '', '', '', 'ん'],
];

const gojuonDakuten = [
    ['が', 'ざ', 'だ', 'ば', 'ぱ'],
    ['ぎ', 'じ', 'ぢ', 'び', 'ぴ'],
    ['ぐ', 'ず', 'づ', 'ぶ', 'ぷ'],
    ['げ', 'ぜ', 'で', 'べ', 'ぺ'],
    ['ご', 'ぞ', 'ど', 'ぼ', 'ぽ'],
];

const kanjiList = [
    { kanji: '終', kun: 'おわり', on: 'シュウ', meaning: 'конец, окончание' },
    { kanji: '鞄', kun: 'かばん', on: '-', meaning: 'портфель' },
    { kanji: '黒', kun: 'くろ', on: 'コク', meaning: 'чёрный' },
    { kanji: '板', kun: 'いた', on: 'バン', meaning: 'доска' },
    { kanji: '写', kun: 'うつす', on: 'シャ', meaning: 'фотография' },
    { kanji: '新', kun: 'あたらしい', on: 'シン', meaning: 'новый' },
    { kanji: '聞', kun: 'きく', on: 'ブン, モン', meaning: 'слушать, газета' },
    { kanji: '電', kun: '—', on: 'デン', meaning: 'электричество' },
    { kanji: '話', kun: 'はなし', on: 'ワ', meaning: 'разговор, телефон' },
    { kanji: '例', kun: 'れい', on: 'レイ', meaning: 'пример, образец' },
    { kanji: '授', kun: '—', on: 'ジュ', meaning: 'преподавать, занятие' },
    { kanji: '全', kun: 'みんな', on: 'ゼン', meaning: 'все, всё' },
    { kanji: '片', kun: 'かたかな', on: 'ヘン', meaning: 'одна сторона, катакана' },
    { kanji: '字', kun: '—', on: 'ジ', meaning: 'иероглиф' },
    { kanji: '平', kun: 'ひらがな', on: 'ヘイ, ビョウ', meaning: 'плоский, хирагана' },
];

const exercises = [
    { id: 'q1', type: 'multiple-choice', title: 'Вопрос 1: Ассимиляция', description: 'Что происходит в слове "発行" (хакко:)?', options: ['Прогрессивная ассимиляция', 'Регрессивная ассимиляция', 'Взаимная ассимиляция'], correctAnswer: 'Регрессивная ассимиляция' },
    { id: 'q2', type: 'select-correct', title: 'Вопрос 2: Письменность', description: 'Какой знак используется только для обозначения винительного падежа?', options: ['わ', 'を', 'ん'], correctAnswer: 'を' },
    { id: 'q3', type: 'select-correct', title: 'Вопрос 3: Иероглифы', description: 'Какой иероглиф означает "новый"?', options: ['聞', '終', '新'], correctAnswer: '新' },
    { id: 'q4', type: 'fill-in-the-blank', title: 'Упражнение 4: Напишите хираганой', description: 'Напишите слово "annai" (информация, ведение) хираганой.', correctAnswer: 'あんない' },
    { id: 'q5', type: 'construct', title: 'Упражнение 5: Соберите слово', description: 'Соберите слово "ryokou" (путешествие)', options: ['りょ', 'こ', 'う'], correctAnswer: 'りょこう' },
    { id: 'q6', type: 'multiple-choice', title: 'Вопрос 6: Произношение ん', description: 'Как произносится ん в слове 新聞 (しんぶん)?', options: ['Как [н]', 'Как [м]', 'Как носовой [ñ]'], correctAnswer: 'Как [м]' },
];


const KanaRowDisplay = ({ rowData }: { rowData: { kana: string; romaji: string }[] }) => (
    <div className='flex flex-wrap gap-4 mt-2 justify-center'>
       {rowData.map(char => (
           <Card key={char.kana} className="p-4 flex flex-col items-center justify-center w-24 h-24"><span className="text-4xl font-japanese">{char.kana}</span><span className="text-muted-foreground">{char.romaji}</span></Card>
       ))}
   </div>
);


const ExerciseConstruct = ({ exercise, answers, handleConstructAnswer, resetConstructAnswer }: {
    exercise: typeof exercises[0],
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
                {(answers[id] || []).join('')}
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

export default function PhoneticsLesson5Page() {
    const [progress, setProgress] = useState(0);
    const [answers, setAnswers] = useState<Record<string, any>>({});
    const [results, setResults] = useState<Record<string, boolean | null>>({});
    const [_, copy] = useCopyToClipboard();
    const { toast } = useToast();

    useEffect(() => {
        try {
            const storedProgress = localStorage.getItem(`${LESSON_ID}-progress`);
            if (storedProgress) setProgress(JSON.parse(storedProgress));
            const storedAnswers = localStorage.getItem(`${LESSON_ID}-answers`);
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
            if (ex.type === 'construct') {
                const userAnswer = (answers[ex.id] || []).join('');
                isCorrect = userAnswer.trim() === (ex.correctAnswer as string).trim();
            } else if (ex.type === 'fill-in-the-blank') {
                isCorrect = (answers[ex.id] || '').toLowerCase() === ex.correctAnswer;
            } else {
                 isCorrect = answers[ex.id] === ex.correctAnswer;
            }
            newResults[ex.id] = isCorrect;
        });
        setResults(newResults);
        updateProgress(newResults);
    };

    const renderExercise = (exercise: typeof exercises[0]) => {
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
            case 'fill-in-the-blank':
                return baseCard(
                    <Input
                        value={answers[id] || ''}
                        onChange={(e) => handleAnswer(id, e.target.value)}
                        className="font-japanese text-lg"
                    />
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
                        <Link href="/phonetics">
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
                        <p className="text-sm text-primary font-semibold">Урок 5 — Фонетика</p>
                        <CardTitle className="text-2xl md:text-3xl">Завершающие согласные, ассимиляция и полная таблица годзюон</CardTitle>
                        <CardDescription>Прогресс по теме:</CardDescription>
                        <Progress value={progress} className="mt-2" />
                    </CardHeader>
                </Card>

                <h2 className="text-3xl font-bold text-foreground mb-6 text-center">🧠 Теория</h2>
                <Accordion type="single" collapsible className="w-full max-w-4xl mb-12" defaultValue="item-1">
                    <AccordionItem value="item-1">
                        <AccordionTrigger className="text-xl font-semibold">§1. Новые согласные</AccordionTrigger>
                        <AccordionContent className="text-lg text-foreground/90 space-y-4 px-2">
                           <ul className="list-disc list-inside space-y-3">
                                <li><b>Согласный [р]:</b> Напоминает нечто среднее между русскими [р] и [л]. Кончик языка делает один быстрый мазок по верхнему нёбу.</li>
                                <li><b>Согласный [в]:</b> Произносится как звук [ф], но с участием голоса (звонкий).</li>
                                <li><b>Согласный [н]:</b> Перед большинством звуков произносится как носовой [ñ], аналога которому в русском языке нет. Воздух проходит одновременно через рот и нос.</li>
                           </ul>
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-2">
                        <AccordionTrigger className="text-xl font-semibold">§2. Ассимиляция звуков</AccordionTrigger>
                        <AccordionContent className="text-lg text-foreground/90 space-y-4 px-2">
                           <p>Ассимиляция — это изменение звука под влиянием соседних. В японском она очень важна.</p>
                           <h4 className="font-bold text-lg mt-4 mb-2">1. Прогрессивная (влияние предыдущего звука)</h4>
                           <div><InteractiveText analysis={phoneticsAnalyses.deguchi} /></div>
                           <div><InteractiveText analysis={phoneticsAnalyses.monozuki} /></div>
                           <h4 className="font-bold text-lg mt-4 mb-2">2. Регрессивная (влияние последующего звука)</h4>
                           <div><InteractiveText analysis={phoneticsAnalyses.hakko} /></div>
                           <div><InteractiveText analysis={phoneticsAnalyses.bumppo} /></div>
                           <h4 className="font-bold text-lg mt-4 mb-2">3. Взаимная (оба звука меняются)</h4>
                           <div><InteractiveText analysis={phoneticsAnalyses.ninzu} /></div>
                           <div><InteractiveText analysis={phoneticsAnalyses.ippo} /></div>
                        </AccordionContent>
                    </AccordionItem>
                     <AccordionItem value="item-3">
                        <AccordionTrigger className="text-xl font-semibold">§3. Письменность</AccordionTrigger>
                        <AccordionContent className="text-lg text-foreground/90 space-y-4 px-2">
                            <h4 className="font-bold text-xl mt-4 mb-2">Ряд РА (ら)</h4>
                            <KanaRowDisplay rowData={kanaRows.ra} />
                            <h4 className="font-bold text-xl mt-4 mb-2">Ряд ВА (わ) и Н (ん)</h4>
                            <KanaRowDisplay rowData={kanaRows.wa} />
                            <p className="text-sm text-muted-foreground mt-2">Знак <b className="font-japanese">を</b> используется только как показатель винительного падежа.</p>
                             <h4 className="font-bold text-xl mt-4 mb-2">Мягкие слоги с РИ (り)</h4>
                            <KanaRowDisplay rowData={kanaRows.rya} />
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-4">
                        <AccordionTrigger className="text-xl font-semibold">§4. Полная таблица годзюон (五十音)</AccordionTrigger>
                        <AccordionContent className="text-lg text-foreground/90 space-y-4 px-2">
                             <h4 className="font-bold text-xl mb-2 text-center">Основная таблица</h4>
                             <Table>
                                 <TableBody>
                                     {gojuonTable.map((row, rowIndex) => (
                                         <TableRow key={rowIndex}>
                                             {row.map((char, charIndex) => (
                                                 <TableCell key={charIndex} className="font-japanese text-2xl text-center p-1">{char}</TableCell>
                                             )).reverse()}
                                         </TableRow>
                                     ))}
                                 </TableBody>
                             </Table>
                             <h4 className="font-bold text-xl mt-4 mb-2 text-center">Звонкие (゛) и полузвонкие (゜) ряды</h4>
                             <Table>
                                 <TableBody>
                                     {gojuonDakuten.map((row, rowIndex) => (
                                         <TableRow key={rowIndex}>
                                             {row.map((char, charIndex) => (
                                                 <TableCell key={charIndex} className="font-japanese text-2xl text-center p-1">{char}</TableCell>
                                             ))}
                                         </TableRow>
                                     ))}
                                 </TableBody>
                             </Table>
                        </AccordionContent>
                    </AccordionItem>
                     <AccordionItem value="item-5">
                        <AccordionTrigger className="text-xl font-semibold">§5. Иероглифы урока</AccordionTrigger>
                        <AccordionContent className="text-lg text-foreground/90 space-y-4 px-2">
                            <Table>
                                <TableHeader><TableRow><TableHead>Иероглиф</TableHead><TableHead>Кун</TableHead><TableHead>Он</TableHead><TableHead>Значение</TableHead></TableRow></TableHeader>
                                <TableBody>
                                    {kanjiList.map(k => (
                                        <TableRow key={k.kanji}>
                                            <TableCell className="font-japanese text-3xl">{k.kanji}</TableCell>
                                            <TableCell className="font-japanese">{k.kun}</TableCell>
                                            <TableCell className="font-japanese">{k.on}</TableCell>
                                            <TableCell>{k.meaning}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </AccordionContent>
                    </AccordionItem>
                     <AccordionItem value="item-6">
                        <AccordionTrigger className="text-xl font-semibold">§6. Обиходные выражения</AccordionTrigger>
                        <AccordionContent className="text-lg text-foreground/90 space-y-4 px-2">
                            <InteractiveText analysis={dialogueAnalyses.iiesoudewaarimasen} />
                            <InteractiveText analysis={dialogueAnalyses.wakarimasuka} />
                            <InteractiveText analysis={dialogueAnalyses.yondekudasai} />
                            <InteractiveText analysis={dialogueAnalyses.nihongodeittekudasai} />
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>

                <h2 className="text-3xl font-bold text-foreground mb-8 mt-12 text-center">📝 Закрепление</h2>
                <div className="w-full max-w-4xl space-y-8 mt-8">
                    {exercises.map(renderExercise)}
                </div>
                <div className="mt-12 text-center flex flex-col sm:flex-row justify-center items-center gap-4">
                    <Button size="lg" variant="default" onClick={checkAnswers}>Проверить все</Button>
                    <Button size="lg" asChild className="btn-gradient" disabled>
                        <Link href="#">Перейти к следующим урокам →</Link>
                    </Button>
                </div>
            </div>
        </div>
    );
}
