
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, CheckCircle, Info, XCircle } from 'lucide-react';
import Link from 'next/link';
import InteractiveText from '@/components/interactive-text';
import { cn } from '@/lib/utils';


const partsOfSpeech = [
    { name: 'Существительные', example: '猫 (ねこ)', translation: 'Кошка', role: 'Обозначает предмет или явление.' },
    { name: 'Глаголы', example: '食べる (たべる)', translation: 'Есть, кушать', role: 'Обозначает действие или состояние.' },
    { name: 'Прилагательные', example: '美しい (うつくしい)', translation: 'Красивый', role: 'Обозначает признак предмета.' },
    { name: 'Местоимения', example: '私 (わたし)', translation: 'Я', role: 'Указывает на предмет, но не называет его.' },
];

const pronouns = [
    { pronoun: '私', romaji: 'watashi', politeness: 'Нейтрально-вежливое "Я"', translation: 'Я (употребляется и мужчинами и женщинами в официальной обстановке)', role: '1-е лицо, ед.ч.' },
    { pronoun: 'わたくし', romaji: 'watakushi', politeness: 'Очень формальное и вежливое "Я"', translation: 'Я (более формальный вариант)', role: '1-е лицо, ед.ч.' },
    { pronoun: 'あなた', romaji: 'anata', politeness: 'Вежливое "ты/вы", но стоит использовать с осторожностью', translation: 'Ты, вы (в разговоре с незнакомыми или вышестоящими лучше избегать, обращаясь по фамилии)', role: '2-е лицо, ед.ч.' },
    { pronoun: 'あの人', romaji: 'ano hito', politeness: 'Нейтральное "он/она"', translation: 'Он, она, то лицо (буквально: "тот человек")', role: '3-е лицо, ед.ч.' },
    { pronoun: 'あの方', romaji: 'ano kata', politeness: 'Очень вежливое "он/она"', translation: 'Он, она (уважительный, вежливый вариант)', role: '3-е лицо, ед.ч.' },
]

const bunreiSentences = [
    "わたしはがくせいです。",
    "あのかたはがくせいではありません。",
    "わたしはやまだです。",
    "わたしはせんせいではありません。がくせいです。",
    "あのかたはたなかさんです。",
    "あのかたはせんせいです。"
];

export default function GrammarPage() {
    const [useJaArimasen, setUseJaArimasen] = useState(false);
    const [progress, setProgress] = useState(60); // Updated progress
    const [answers, setAnswers] = useState<Record<string, string | null>>({});
    const [results, setResults] = useState<Record<string, boolean | null>>({});

    const exercises = {
        q1: { question: "К какой части речи относится слово わたし?", options: ['существительное', 'местоимение', 'частица'], correct: 'местоимение' },
        q2: { question: 'Выберите правильный перевод: "Он не преподаватель."', options: ['あのかたはせんせいです', 'あのかたはせんせいではありません'], correct: 'あのかたはせんせいではありません' },
        q3: { question: 'Вставьте правильную частицу и связку: "Я — Ямада."', text: 'わたし（　）やまだ（　）。', options: ['は / です', 'が / です', 'を / ではありません'], correct: 'は / です' },
    };

    const handleAnswer = (question: string, answer: string) => {
        setAnswers(prev => ({ ...prev, [question]: answer }));
    };
    
    const checkAnswer = (question: string) => {
        const isCorrect = answers[question] === (exercises as any)[question].correct;
        setResults(prev => ({ ...prev, [question]: isCorrect }));
        if (isCorrect) {
            setProgress(p => Math.min(p + 15, 100));
        }
    }

  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-background p-4 sm:p-8 pt-16 sm:pt-24 animate-fade-in">
        <div className="w-full max-w-4xl">
            <Button asChild variant="ghost" className="mb-4">
                <Link href="/">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Назад на главную
                </Link>
            </Button>
            <Card className="w-full mb-8">
                <CardHeader>
                    <p className="text-sm text-primary font-semibold">Урок 1 — Грамматика</p>
                    <CardTitle className="text-2xl md:text-3xl">Тема 1: Части речи, связки, простые предложения</CardTitle>
                    <CardDescription>Прогресс по теме:</CardDescription>
                    <Progress value={progress} className="mt-2" />
                </CardHeader>
            </Card>

            <h2 className="text-3xl font-bold text-foreground mb-6 text-center">🧠 Теория</h2>
            <Accordion type="single" collapsible className="w-full max-w-4xl mb-12" defaultValue="item-7">
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
                             <li>Произносится как <strong className="font-japanese">なん</strong> перед звуками [н], [т], [д], а также перед счетными суффиксами: <InteractiveText text="それは何ですか。" /> <span className="text-muted-foreground text-sm">(нан-десу ка)</span></li>
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
                                <InteractiveText text="あのかたはせんせいです" />
                                <p className="text-muted-foreground text-sm mt-2">Он — преподаватель.</p>
                                <hr className="my-4"/>
                                <InteractiveText text="がくせいはあのひとです" />
                                <p className="text-muted-foreground text-sm mt-2">Студент — он.</p>
                            </CardContent>
                        </Card>

                        <Card className="bg-card/70 mt-4">
                            <CardHeader>
                                <CardTitle className="text-lg">Отрицательные предложения</CardTitle>
                                <CardDescription>Схема: N1 は N2 ではありません</CardDescription>
                            </CardHeader>
                            <CardContent>
                                 <InteractiveText text="あのかたはせんせいではありません" />
                                <p className="text-muted-foreground text-sm mt-2">Он — не преподаватель.</p>
                                 <hr className="my-4"/>
                                <InteractiveText text="がくせいはあのひとじゃありません" />
                                <p className="text-muted-foreground text-sm mt-2">Студент — не он. (разговорная форма)</p>
                            </CardContent>
                        </Card>
                        <p className="text-sm text-muted-foreground pt-4">В японском языке сказуемое — обязательный член предложения, тогда как подлежащее может быть опущено. Например, можно сказать просто <InteractiveText text="せんせいです"/>, и это будет означать "(Он/Она/Я) — преподаватель."</p>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
            
            <h2 className="text-3xl font-bold text-foreground mb-8 mt-12 text-center">ぶんれい (Примеры)</h2>
            <Card className="mb-12">
                <CardContent className="p-6 space-y-4">
                    {bunreiSentences.map((sentence, index) => (
                        <div key={index} className="border-b pb-2">
                             <InteractiveText text={sentence} />
                        </div>
                    ))}
                </CardContent>
            </Card>

            <h2 className="text-3xl font-bold text-foreground mb-8 text-center">📝 Закрепление</h2>
            <div className="w-full max-w-4xl space-y-8">
                {/* Exercise 1 */}
                <Card>
                    <CardHeader>
                        <CardTitle>Упражнение 1. Определи часть речи</CardTitle>
                        <CardDescription>{exercises.q1.question}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <RadioGroup value={answers.q1} onValueChange={(val) => handleAnswer('q1', val)} className="flex flex-col sm:flex-row gap-4">
                             {exercises.q1.options.map(option => (
                                <div key={option} className="flex items-center space-x-2">
                                    <RadioGroupItem value={option} id={`q1-${option}`} />
                                    <Label htmlFor={`q1-${option}`}>{option}</Label>
                                </div>
                            ))}
                        </RadioGroup>
                    </CardContent>
                    <CardFooter>
                         <Button onClick={() => checkAnswer('q1')} disabled={!answers.q1}>Проверить</Button>
                         {results.q1 === true && <span className="flex items-center gap-2 text-green-600 ml-4"><CheckCircle/> Верно!</span>}
                         {results.q1 === false && <span className="flex items-center gap-2 text-destructive ml-4"><XCircle/> Ошибка. Правильный ответ: местоимение.</span>}
                    </CardFooter>
                </Card>

                 {/* Exercise 2 */}
                 <Card>
                    <CardHeader>
                        <CardTitle>Упражнение 2. Выбери правильный перевод</CardTitle>
                        <CardDescription>{exercises.q2.question}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <RadioGroup value={answers.q2} onValueChange={(val) => handleAnswer('q2', val)} className="flex flex-col gap-4">
                             {exercises.q2.options.map(option => (
                                <div key={option} className="flex items-center space-x-2">
                                    <RadioGroupItem value={option} id={`q2-${option}`} />
                                    <Label htmlFor={`q2-${option}`} className="font-japanese text-lg">{option}</Label>
                                </div>
                            ))}
                        </RadioGroup>
                    </CardContent>
                    <CardFooter>
                         <Button onClick={() => checkAnswer('q2')} disabled={!answers.q2}>Проверить</Button>
                         {results.q2 === true && <span className="flex items-center gap-2 text-green-600 ml-4"><CheckCircle/> Отлично!</span>}
                         {results.q2 === false && <span className="flex items-center gap-2 text-destructive ml-4"><XCircle/> Неверно.</span>}
                    </CardFooter>
                </Card>

                 {/* Exercise 3 */}
                <Card>
                    <CardHeader>
                        <CardTitle>Упражнение 3. Заполни пропуски</CardTitle>
                        <CardDescription className="font-japanese text-xl">{exercises.q3.text}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-wrap gap-2">
                            {exercises.q3.options.map(option => (
                                <Button 
                                    key={option}
                                    variant={answers.q3 === option ? 'default' : 'outline'}
                                    onClick={() => handleAnswer('q3', option)}
                                    className={cn("text-lg",
                                        results.q3 === true && answers.q3 === option && 'bg-green-500 hover:bg-green-600',
                                        results.q3 === false && answers.q3 === option && 'bg-destructive hover:bg-destructive/90',
                                    )}
                                >
                                    {option}
                                </Button>
                            ))}
                        </div>
                    </CardContent>
                    <CardFooter>
                         <Button onClick={() => checkAnswer('q3')} disabled={!answers.q3}>Проверить</Button>
                         {results.q3 === true && <span className="flex items-center gap-2 text-green-600 ml-4"><CheckCircle/> Правильно!</span>}
                         {results.q3 === false && <span className="flex items-center gap-2 text-destructive ml-4"><XCircle/> Попробуйте еще раз.</span>}
                    </CardFooter>
                </Card>
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


    