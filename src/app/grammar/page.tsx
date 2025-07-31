
'use client';

import { useState } from 'react';
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


type ExerciseType = 'multiple-choice' | 'fill-in-the-blank' | 'select-options';

interface Exercise {
    id: string;
    type: ExerciseType;
    title: string;
    description: string;
    options: string[];
    correctAnswer: string | string[];
}

const exercises: Exercise[] = [
    {
        id: 'q1',
        type: 'multiple-choice',
        title: 'Упражнение 1. Выберите правильный вопрос',
        description: 'Как спросить "Тот человек г-н Ямада или г-н Танака?"',
        options: ['あのかたはなにですか', 'あのかたはやまださんですか、たなかさんですか', 'やまださんとたなかさんです'],
        correctAnswer: 'あのかたはやまださんですか、たなかさんですか',
    },
    {
        id: 'q2',
        type: 'multiple-choice',
        title: 'Упражнение 2. Выберите правильный ответ',
        description: 'На вопрос "やまださんはせんせいですか、がくせいですか。" дан ответ "Г-н Ямада — учитель." Выберите правильный вариант на японском.',
        options: ['はい、そうです', 'いいえ、がくせいではありません', 'やまださんはせんせいです'],
        correctAnswer: 'やまださんはせんせいです',
    },
    {
        id: 'q3',
        type: 'select-options',
        title: 'Упражнение 3. Заполни пропуски',
        description: 'たなかさんはぎしです（　）、せんせいですか。',
        options: ['か', 'は', 'です'],
        correctAnswer: 'か',
    },
];

const pronouns = [
    { pronoun: '私', romaji: 'watashi', politeness: 'Нейтрально-вежливое "Я"', translation: 'Я (употребляется и мужчинами и женщинами в официальной обстановке)', role: '1-е лицо, ед.ч.' },
    { pronoun: 'わたくし', romaji: 'watakushi', politeness: 'Очень формальное и вежливое "Я"', translation: 'Я (более формальный вариант)', role: '1-е лицо, ед.ч.' },
    { pronoun: 'あなた', romaji: 'anata', politeness: 'Вежливое "ты/вы", но стоит использовать с осторожностью', translation: 'Ты, вы (в разговоре с незнакомыми или вышестоящими лучше избегать, обращаясь по фамилии)', role: '2-е лицо, ед.ч.' },
    { pronoun: 'あの人', romaji: 'ano hito', politeness: 'Нейтральное "он/она"', translation: 'Он, она, то лицо (буквально: "тот человек")', role: '3-е лицо, ед.ч.' },
    { pronoun: 'あの方', romaji: 'ano kata', politeness: 'Очень вежливое "он/она"', translation: 'Он, она (уважительный, вежливый вариант)', role: '3-е лицо, ед.ч.' },
]

export default function GrammarPage() {
    const [useJaArimasen, setUseJaArimasen] = useState(false);
    const [progress, setProgress] = useState(80); 
    const [answers, setAnswers] = useState<Record<string, string | null>>({});
    const [results, setResults] = useState<Record<string, boolean | null>>({});
    const [_, copy] = useCopyToClipboard();
    const { toast } = useToast();

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

    const handleAnswer = (questionId: string, answer: string) => {
        setAnswers(prev => ({ ...prev, [questionId]: answer }));
        if (results[questionId] !== null) {
            setResults(prev => ({ ...prev, [questionId]: null }));
        }
    };
    
    const checkAnswer = (questionId: string) => {
        const exercise = exercises.find(ex => ex.id === questionId);
        if (!exercise || !answers[questionId]) return;

        const isCorrect = answers[questionId] === exercise.correctAnswer;
        setResults(prev => ({ ...prev, [questionId]: isCorrect }));

        if (isCorrect) {
            const answeredCorrectly = Object.values({ ...results, [questionId]: true }).filter(r => r === true).length;
            const totalQuestions = exercises.length;
            const newProgress = 80 + Math.floor((answeredCorrectly / totalQuestions) * 20);
            setProgress(Math.min(newProgress, 100));
        }
    };
    
    const renderExercise = (exercise: Exercise) => {
        const { id, type, title, description, options, correctAnswer } = exercise;
        const userAnswer = answers[id];
        const result = results[id];

        return (
            <Card key={id}>
                <CardHeader>
                    <CardTitle>{title}</CardTitle>
                    <CardDescription className={cn(type === 'select-options' && 'font-japanese text-xl')}>
                        {description}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {type === 'multiple-choice' && (
                        <RadioGroup value={userAnswer || ''} onValueChange={(val) => handleAnswer(id, val)} className="flex flex-col gap-4">
                            {options.map(option => (
                                <div key={option} className="flex items-center space-x-2">
                                    <RadioGroupItem value={option} id={`${id}-${option}`} />
                                    <Label htmlFor={`${id}-${option}`} className={cn(option.includes('〜') || option.includes('。') || option.includes('、') ? 'font-japanese text-lg' : '')}>{option}</Label>
                                </div>
                            ))}
                        </RadioGroup>
                    )}
                    {type === 'select-options' && (
                         <div className="flex flex-wrap gap-2">
                            {options.map(option => (
                                <Button 
                                    key={option}
                                    variant={userAnswer === option ? 'default' : 'outline'}
                                    onClick={() => handleAnswer(id, option)}
                                    className={cn("text-lg",
                                        result === true && userAnswer === option && 'bg-green-500 hover:bg-green-600',
                                        result === false && userAnswer === option && 'bg-destructive hover:bg-destructive/90',
                                    )}
                                >
                                    {option}
                                </Button>
                            ))}
                        </div>
                    )}
                </CardContent>
                <CardFooter>
                    <Button onClick={() => checkAnswer(id)} disabled={!userAnswer}>Проверить</Button>
                    {result === true && <span className="flex items-center gap-2 text-green-600 ml-4"><CheckCircle/> Верно!</span>}
                    {result === false && (
                        <span className="flex items-center gap-2 text-destructive ml-4">
                            <XCircle/> Ошибка. Правильный ответ: {Array.isArray(correctAnswer) ? correctAnswer.join(', ') : correctAnswer}
                        </span>
                    )}
                </CardFooter>
            </Card>
        );
    };


  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-background p-4 sm:p-8 pt-16 sm:pt-24 animate-fade-in">
        <div className="w-full max-w-4xl">
            <div className="flex justify-between items-center mb-4">
                <Button asChild variant="ghost">
                    <Link href="/">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Назад на главную
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
                    <CardTitle className="text-2xl md:text-3xl">Тема 1: Части речи, связки, простые и вопросительные предложения</CardTitle>
                    <CardDescription>Прогресс по теме:</CardDescription>
                    <Progress value={progress} className="mt-2" />
                </CardHeader>
            </Card>

            <h2 className="text-3xl font-bold text-foreground mb-6 text-center">🧠 Теория</h2>
            <Accordion type="single" collapsible className="w-full max-w-4xl mb-12" defaultValue="item-9">
                <AccordionItem value="item-1">
                    <AccordionTrigger className="text-xl font-semibold">§1. Части речи в японском</AccordionTrigger>
                    <AccordionContent className="text-lg text-foreground/90 space-y-4 px-2">
                        <p>Все слова в японском языке делятся на знаменательные (несущие основной смысл) и служебные (помогающие строить предложения).</p>
                    </AccordionContent>
                </AccordionItem>
                 <AccordionItem value="item-4">
                    <AccordionTrigger className="text-xl font-semibold">§2. Личные местоимения (代名詞)</AccordionTrigger>
                    <AccordionContent className="text-lg text-foreground/90 space-y-4 px-2">
                        <p>Выбор местоимения сильно зависит от уровня вежливости и социального контекста. Склоняются по падежам так же, как и существительные.</p>
                         <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Местоимение</TableHead>
                                    <TableHead>Ромадзи</TableHead>
                                    <TableHead>Пояснение</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {pronouns.map(p => (
                                <TableRow key={p.pronoun}>
                                    <TableCell className="font-medium font-japanese text-xl">{p.pronoun}</TableCell>
                                    <TableCell>{p.romaji}</TableCell>
                                    <TableCell className="text-sm">{p.politeness}. {p.translation}</TableCell>
                                </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </AccordionContent>
                </AccordionItem>
                 <AccordionItem value="item-5">
                    <AccordionTrigger className="text-xl font-semibold">§3. Вопросительное местоимение 何 (なに/なん)</AccordionTrigger>
                    <AccordionContent className="text-lg text-foreground/90 space-y-4 px-2">
                        <p>Местоимение <span className="font-japanese">何</span> означает "что?" и используется в вопросах о предметах. Его произношение меняется в зависимости от следующего за ним звука.</p>
                        <ul className="list-disc list-inside space-y-2">
                             <li>Произносится как <strong className="font-japanese">なに</strong>, когда за ним следует самостоятельное слово.</li>
                             <li>Произносится как <strong className="font-japanese">なん</strong> перед звуками [н], [т], [д], а также перед счетными суффиксами: <InteractiveText analysis={grammarAnalyses.sorewanandesuka} /> <span className="text-muted-foreground text-sm">(нан-десу ка)</span></li>
                        </ul>
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-6">
                    <AccordionTrigger className="text-xl font-semibold">§4. Связка です и её формы</AccordionTrigger>
                    <AccordionContent className="text-lg text-foreground/90 space-y-4 px-2">
                        <p>Связка です используется в конце предложения, чтобы сделать его вежливым (нейтрально-вежливый стиль). У неё есть утвердительная и отрицательная формы.</p>
                        <div className="flex items-center space-x-4 p-4 rounded-lg bg-card/70 my-4">
                            <Label htmlFor="tense-switch" className={cn(useJaArimasen && "text-muted-foreground")}>Утвердительная</Label>
                            <Switch id="tense-switch" checked={useJaArimasen} onCheckedChange={(checked) => setUseJaArimasen(checked)} aria-readonly />
                            <Label htmlFor="tense-switch" className={cn(!useJaArimasen && "text-muted-foreground")}>Отрицательная</Label>
                        </div>
                        <div className="p-4 bg-muted rounded-lg text-center">
                            <p className="text-2xl font-japanese">
                            {useJaArimasen ? '〜ではありません / 〜じゃありません' : '〜です'}
                            </p>
                            <p className="text-sm text-muted-foreground mt-2">
                            {useJaArimasen ? 'Отрицательная форма (ではありません — нейтрально-вежливая, じゃありません — разговорный вариант)' : 'Настоящее-будущее время, утверждение'}
                            </p>
                        </div>
                    </AccordionContent>
                </AccordionItem>
                 <AccordionItem value="item-7">
                    <AccordionTrigger className="text-xl font-semibold">§5. Составное именное сказуемое</AccordionTrigger>
                    <AccordionContent className="text-lg text-foreground/90 space-y-4 px-2">
                        <p>Это самый простой тип предложения. Оно состоит из подлежащего (существительное или местоимение), частицы и сказуемого, выраженного другим существительным/местоимением со связкой.</p>
                        
                        <Card className="bg-card/70 mt-4">
                            <CardHeader>
                                <CardTitle className="text-lg">Утвердительные предложения</CardTitle>
                                <CardDescription>Схема: N1 は N2 です</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <InteractiveText analysis={grammarAnalyses.anokatahasenseidesu} />
                                <hr className="my-4"/>
                                <InteractiveText analysis={grammarAnalyses.gakuseihaanohitodesu} />
                            </CardContent>
                        </Card>

                        <Card className="bg-card/70 mt-4">
                            <CardHeader>
                                <CardTitle className="text-lg">Отрицательные предложения</CardTitle>
                                <CardDescription>Схема: N1 は N2 ではありません</CardDescription>
                            </CardHeader>
                            <CardContent>
                                 <InteractiveText analysis={grammarAnalyses.anokatahasenseidehaarimasen} />
                                 <hr className="my-4"/>
                                <InteractiveText analysis={grammarAnalyses.gakuseihaanohitojaarimasen} />
                            </CardContent>
                        </Card>
                        <div className="text-sm text-muted-foreground pt-4">В японском языке сказуемое — обязательный член предложения, тогда как подлежащее может быть опущено. Например, можно сказать просто <InteractiveText analysis={grammarAnalyses.senseidesu}/>, и это будет означать "(Он/Она/Я) — преподаватель."</div>
                    </AccordionContent>
                </AccordionItem>
                 <AccordionItem value="item-8">
                    <AccordionTrigger className="text-xl font-semibold">§6. Вопросительное предложение</AccordionTrigger>
                    <AccordionContent className="text-lg text-foreground/90 space-y-4 px-2">
                        <p>Признаки вопросительного предложения — это интонация и частица <span className="font-japanese font-bold">か</span> в конце. Порядок слов остается таким же, как и в повествовательном предложении.</p>
                        
                        <Card className="bg-card/70 mt-4">
                            <CardHeader>
                                <CardTitle className="text-lg">1. Вопросы с вопросительным словом</CardTitle>
                                <CardDescription>Схема: N は N1 (вопр. слово) ですか</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <InteractiveText analysis={grammarAnalyses.questions.anokatawadonadesuka} />
                            </CardContent>
                        </Card>

                        <Card className="bg-card/70 mt-4">
                            <CardHeader>
                                <CardTitle className="text-lg">2. Вопросы без вопросительного слова</CardTitle>
                                <CardDescription>Схема: N1 は N2 ですか</CardDescription>
                            </CardHeader>
                            <CardContent>
                                 <p className="font-bold">Вопрос:</p>
                                 <InteractiveText analysis={grammarAnalyses.questions.anokatawagakuseidesuka} />
                                 <hr className="my-4"/>
                                 <p className="font-bold">а) Утвердительные ответы:</p>
                                 <InteractiveText analysis={grammarAnalyses.questions.hai_anokatawagakuseidesu} />
                                 <InteractiveText analysis={grammarAnalyses.questions.hai_soudesu} />
                                 <hr className="my-4"/>
                                 <p className="font-bold">б) Отрицательные ответы:</p>
                                 <InteractiveText analysis={grammarAnalyses.questions.iie_anokatawagakuseidehaarimasen} />
                                 <InteractiveText analysis={grammarAnalyses.questions.iie_senseidesu} />
                            </CardContent>
                        </Card>
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-9">
                    <AccordionTrigger className="text-xl font-semibold">§7. Альтернативный вопрос</AccordionTrigger>
                    <AccordionContent className="text-lg text-foreground/90 space-y-4 px-2">
                        <p>Альтернативный вопрос, ставящий собеседника перед выбором из нескольких предметов или действий, передаётся повторением сказуемостной части предложения с вопросительной частицей <span className="font-japanese font-bold">か</span>.</p>
                        <Card className="bg-card/70 mt-4">
                            <CardHeader>
                                <CardTitle className="text-lg">Пример</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <InteractiveText analysis={grammarAnalyses.alternative.anokatahasenseidesukagakuseidesuka} />
                            </CardContent>
                        </Card>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
            
            <h2 className="text-3xl font-bold text-foreground mb-8 mt-12 text-center">ぶんれい (Примеры)</h2>
            <Card className="mb-12">
                <CardContent className="p-6 space-y-4">
                    {Object.values(grammarAnalyses.bunrei).map((analysis, index) => (
                        <div key={index} className="border-b pb-2">
                             <InteractiveText analysis={analysis} />
                        </div>
                    ))}
                </CardContent>
            </Card>

            <h2 className="text-3xl font-bold text-foreground mb-8 text-center">📝 Закрепление</h2>
            <div className="w-full max-w-4xl space-y-8">
                {exercises.map(renderExercise)}
            </div>
             <div className="mt-12 text-center flex flex-col sm:flex-row justify-center items-center gap-4">
                <Button size="lg" variant="outline" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>Повторить теорию</Button>
                <Button size="lg" asChild className="btn-gradient">
                    <Link href="/vocabulary">Следующий блок → Лексика</Link>
                </Button>
             </div>
        </div>
    </div>
  );
}
