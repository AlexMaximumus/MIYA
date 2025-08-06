
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, CheckCircle, XCircle, Share2, Volume2, Check, X } from 'lucide-react';
import Link from 'next/link';
import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import InteractiveText from '@/components/interactive-text';
import { grammarAnalyses } from '@/ai/precomputed-analysis';

const phoneticsAnalyses = {
    suki: { sentence: [{ word: 'すき', furigana: 'すき', translation: 'нравится', partOfSpeech: 'прилагательное' }], fullTranslation: 'нравится' },
    deshita: { sentence: [{ word: 'でした', furigana: 'でした', translation: 'был (связка)', partOfSpeech: 'связка' }], fullTranslation: 'был' },
    tsuki: { sentence: [{ word: 'つき', furigana: 'つき', translation: 'луна', partOfSpeech: 'существительное' }], fullTranslation: 'луна' },
    desu: { sentence: [{ word: 'です', furigana: 'です', translation: 'есть (связка)', partOfSpeech: 'связка' }], fullTranslation: 'есть' },
};

const LESSON_ID = 'phonetics-lesson-2';

const kanaRows = {
    sa: [{ kana: 'さ', romaji: 'sa' }, { kana: 'し', romaji: 'shi' }, { kana: 'す', romaji: 'su' }, { kana: 'せ', romaji: 'se' }, { kana: 'そ', romaji: 'so' }],
    za: [{ kana: 'ざ', romaji: 'za' }, { kana: 'じ', romaji: 'ji' }, { kana: 'ず', romaji: 'zu' }, { kana: 'ぜ', romaji: 'ze' }, { kana: 'ぞ', romaji: 'zo' }],
    ta: [{ kana: 'た', romaji: 'ta' }, { kana: 'ち', romaji: 'chi' }, { kana: 'つ', romaji: 'tsu' }, { kana: 'て', romaji: 'te' }, { kana: 'と', romaji: 'to' }],
    da: [{ kana: 'だ', romaji: 'da' }, { kana: 'ぢ', romaji: 'ji' }, { kana: 'づ', romaji: 'zu' }, { kana: 'で', romaji: 'de' }, { kana: 'ど', romaji: 'do' }],
};

const exercises = [
    { id: 'q1', type: 'multiple-choice', title: 'Вопрос 1', description: 'Как произносится согласный в слоге し (shi)?', options: ['Как русское [с]', 'Как русское [ш]', 'Среднее между [с] и [ш]'], correctAnswer: 'Среднее между [с] и [ш]' },
    { id: 'q2', type: 'select-correct', title: 'Вопрос 2', description: 'В каком слове гласный звук [у] редуцируется (почти выпадает)?', options: ['くるま (машина)', 'です (связка)'], correctAnswer: 'です (связка)' },
    { id: 'q3', type: 'select-correct', title: 'Вопрос 3', description: 'Каким знаком хираганы сегодня чаще всего записывают звук [дзи]?', options: ['ぢ', 'じ'], correctAnswer: 'じ' },
];

export default function PhoneticsLesson2Page() {
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
            newResults[ex.id] = answers[ex.id] === ex.correctAnswer;
        });
        setResults(newResults); // Show results immediately
        updateProgress(newResults);
        try {
            localStorage.setItem(`${LESSON_ID}-answers`, JSON.stringify(answers));
        } catch (error) {
            console.error("Failed to save to localStorage", error);
        }
    };

    const renderExercise = (exercise: typeof exercises[0]) => {
        const { id, type, title, description, options } = exercise;
        const result = results[id];

        return (
            <Card key={id} className="w-full">
                <CardHeader>
                    <CardTitle>{title}</CardTitle>
                    <CardDescription>{description}</CardDescription>
                </CardHeader>
                <CardContent>
                    <RadioGroup value={answers[id]} onValueChange={(val) => handleAnswer(id, val)} className="flex flex-col gap-4">
                        {(options as string[]).map(option => (
                            <div key={option} className="flex items-center space-x-2">
                                <RadioGroupItem value={option} id={`${id}-${option}`} />
                                <Label htmlFor={`${id}-${option}`} className="font-japanese text-base">{option}</Label>
                            </div>
                        ))}
                    </RadioGroup>
                </CardContent>
                <CardFooter>
                     {result === true && <span className="flex items-center gap-2 text-green-600"><CheckCircle/> Верно!</span>}
                     {result === false && <span className="flex items-center gap-2 text-destructive"><XCircle/> Ошибка</span>}
                </CardFooter>
            </Card>
        );
    };

    const KanaRowDisplay = ({ rowData }: { rowData: typeof kanaRows.sa }) => (
         <div className='flex flex-wrap gap-4 mt-2 justify-center'>
            {rowData.map(char => (
                <Card key={char.kana} className="p-4 flex flex-col items-center justify-center w-24 h-24">
                    <span className="text-4xl font-japanese">{char.kana}</span>
                    <span className="text-muted-foreground">{char.romaji}</span>
                </Card>
            ))}
        </div>
    );

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
                        <p className="text-sm text-primary font-semibold">Урок 2 — Фонетика</p>
                        <CardTitle className="text-2xl md:text-3xl">Согласные звуки и редукция гласных</CardTitle>
                        <CardDescription>Прогресс по теме:</CardDescription>
                        <Progress value={progress} className="mt-2" />
                    </CardHeader>
                </Card>

                <h2 className="text-3xl font-bold text-foreground mb-6 text-center">🧠 Теория</h2>
                <Accordion type="single" collapsible className="w-full max-w-4xl mb-12" defaultValue="item-1">
                    <AccordionItem value="item-1">
                        <AccordionTrigger className="text-xl font-semibold">§1. Согласные звуки</AccordionTrigger>
                        <AccordionContent className="text-lg text-foreground/90 space-y-4 px-2">
                             <div className="space-y-4">
                                <div>
                                    <h4 className="font-bold text-xl mb-2">Ряд СА (さ) и ДЗА (ざ)</h4>
                                    <p>В слогах СА, СУ, СЭ, СО согласный [с] произносится как русское [с]. В слоге СИ (し) звук [с'] смягчается и приобретает шипящий оттенок, напоминая нечто среднее между русскими [сь] и [шь].</p>
                                    <p className="mt-2">Звонкий аналог — ряд ДЗА. Звук [дз] встречается в начале слова. Между гласными он может превращаться в [з]. Слог ДЗИ (じ) также произносится мягко.</p>
                                </div>
                                <div>
                                    <h4 className="font-bold text-xl mb-2">Ряд ТА (た) и ДА (だ)</h4>
                                    <p>В слогах ТА, ТЭ, ТО согласный [т] произносится твердо. В слоге ТИ (ち) он произносится как среднее между мягкими [ть] и [ч]. Слог ЦУ (つ) произносится как русское [ц].</p>
                                    <p className="mt-2">Звонкий аналог — ряд ДА. Слоги ДА, ДЭ, ДО произносятся с твердым [д]. Слоги ДЗИ (ぢ) и ДЗУ (づ) произносятся так же, как じ и ず из ряда ДЗА.</p>
                                </div>
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-2">
                        <AccordionTrigger className="text-xl font-semibold">§2. Редукция гласных [и] и [у]</AccordionTrigger>
                        <AccordionContent className="text-lg text-foreground/90 space-y-4 px-2">
                            <p>Редукция — это ослабление или полное выпадение гласного звука. В японском это происходит с гласными [и] и [у] в определённых позициях:</p>
                             <ul className="list-disc list-inside space-y-2 my-4">
                                <li><b>Между глухими согласными:</b> Например, в слове <InteractiveText analysis={phoneticsAnalyses.suki}/> звук [у] почти не слышен. Другие примеры: <InteractiveText analysis={phoneticsAnalyses.deshita}/>, <InteractiveText analysis={phoneticsAnalyses.tsuki}/>.</li>
                                <li><b>В конце слова после глухого согласного:</b> Если тон на этом слоге понижается, гласный редуцируется. Классический пример: <InteractiveText analysis={phoneticsAnalyses.desu}/>.</li>
                            </ul>
                            <p className="text-sm text-muted-foreground">На письме редукция никак не обозначается, её нужно просто знать и слышать в речи.</p>
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-3">
                        <AccordionTrigger className="text-xl font-semibold">§3. Письменность</AccordionTrigger>
                        <AccordionContent className="text-lg text-foreground/90 space-y-4 px-2">
                            <h4 className="font-bold text-xl mt-4 mb-2">Ряды СА (さ) и ДЗА (ざ)</h4>
                            <KanaRowDisplay rowData={kanaRows.sa} />
                            <p className="mt-4">Ряд ДЗА образуется добавлением значка нигори (゛) к ряду СА.</p>
                            <KanaRowDisplay rowData={kanaRows.za} />

                             <h4 className="font-bold text-xl mt-4 mb-2">Ряды ТА (た) и ДА (だ)</h4>
                            <KanaRowDisplay rowData={kanaRows.ta} />
                            <p className="mt-4">Ряд ДА образуется добавлением значка нигори (゛) к ряду ТА.</p>
                            <KanaRowDisplay rowData={kanaRows.da} />

                            <h4 className="font-bold text-xl mt-4 mb-2">Особенности орфографии</h4>
                            <p>В современном японском языке для обозначения звуков [дзи] и [дзу] почти всегда используются знаки из ряда ДЗА: <span className="font-japanese text-2xl mx-1">じ</span> и <span className="font-japanese text-2xl mx-1">ず</span>. Знаки <span className="font-japanese text-2xl mx-1">ぢ</span> и <span className="font-japanese text-2xl mx-1">づ</span> встречаются очень редко, в основном в словах, где озвончение происходит из-за слияния корней (например, <span className="font-japanese">はなぢ</span> - кровь из носа, от <span className="font-japanese">はな (нос) + ち (кровь)</span>).</p>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>

                <h2 className="text-3xl font-bold text-foreground mb-8 mt-12 text-center">📝 Закрепление</h2>
                 <Card className="w-full mb-8">
                    <CardHeader>
                        <CardTitle className="text-center">Словарь к уроку</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableBody>
                                <TableRow><TableCell className="font-japanese">あさ</TableCell><TableCell>утро</TableCell></TableRow>
                                <TableRow><TableCell className="font-japanese">いす</TableCell><TableCell>стул</TableCell></TableRow>
                                <TableRow><TableCell className="font-japanese">いつ</TableCell><TableCell>когда?</TableCell></TableRow>
                                <TableRow><TableCell className="font-japanese">うち</TableCell><TableCell>дом</TableCell></TableRow>
                                <TableRow><TableCell className="font-japanese">がくせい</TableCell><TableCell>студент</TableCell></TableRow>
                                <TableRow><TableCell className="font-japanese">ぎし</TableCell><TableCell>инженер</TableCell></TableRow>
                                <TableRow><TableCell className="font-japanese">そう</TableCell><TableCell>так</TableCell></TableRow>
                                <TableRow><TableCell className="font-japanese">だいがく</TableCell><TableCell>институт, университет</TableCell></TableRow>
                                <TableRow><TableCell className="font-japanese">つくえ</TableCell><TableCell>стол</TableCell></TableRow>
                                <TableRow><TableCell className="font-japanese">どうぞ</TableCell><TableCell>пожалуйста</TableCell></TableRow>
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
                <div className="w-full max-w-4xl space-y-8 mt-8">
                    {exercises.map(renderExercise)}
                </div>
                <div className="mt-12 text-center flex flex-col sm:flex-row justify-center items-center gap-4">
                    <Button size="lg" variant="default" onClick={checkAnswers}>Проверить все</Button>
                    <Button size="lg" asChild className="btn-gradient" disabled>
                        <Link href="#">Перейти к Уроку 3 →</Link>
                    </Button>
                </div>
            </div>
        </div>
    );
}
