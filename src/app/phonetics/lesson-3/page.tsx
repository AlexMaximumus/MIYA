
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, CheckCircle, XCircle, Share2, Mic2 } from 'lucide-react';
import Link from 'next/link';
import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard';
import { useToast } from '@/hooks/use-toast';
import InteractiveText from '@/components/interactive-text';
import { grammarAnalyses } from '@/ai/precomputed-analysis';

const phoneticsAnalyses = {
    kuni: { sentence: [{ word: '国', furigana: 'くに', translation: 'страна', partOfSpeech: 'существительное' }], fullTranslation: 'страна' },
    mizu: { sentence: [{ word: '水', furigana: 'みず', translation: 'вода', partOfSpeech: 'существительное' }], fullTranslation: 'вода' },
    akami: { sentence: [{ word: '赤み', furigana: 'あかみ', translation: 'краснота', partOfSpeech: 'существительное' }], fullTranslation: 'краснота' },
    nomimono: { sentence: [{ word: '飲み物', furigana: 'のみもの', translation: 'напитки', partOfSpeech: 'существительное' }], fullTranslation: 'напитки' },
    hayamichi: { sentence: [{ word: '早道', furigana: 'はやみち', translation: 'кратчайший путь', partOfSpeech: 'существительное' }], fullTranslation: 'кратчайший путь' },
    daigaku: { sentence: [{ word: '大学', furigana: 'だいがく', translation: 'университет', partOfSpeech: 'существительное' }], fullTranslation: 'университет' },
    hon: { sentence: [{ word: '本', furigana: 'ほん', translation: 'книга', partOfSpeech: 'существительное' }], fullTranslation: 'книга' },
    kin: { sentence: [{ word: '金', furigana: 'きん', translation: 'золото', partOfSpeech: 'существительное' }], fullTranslation: 'золото' },
    source: { sentence: [{ word: 'ソース', furigana: 'ソース', translation: 'соус', partOfSpeech: 'существительное' }], fullTranslation: 'соус' },
    oasis: { sentence: [{ word: 'オアシス', furigana: 'オアシス', translation: 'оазис', partOfSpeech: 'существительное' }], fullTranslation: 'оазис' },
    dzikki: { sentence: [{ word: 'じっき', furigana: 'じっき', translation: 'история', partOfSpeech: 'существительное' }], fullTranslation: 'история' },
    dziki: { sentence: [{ word: 'じき', furigana: 'じき', translation: 'время', partOfSpeech: 'существительное' }], fullTranslation: 'время' },
    kokki: { sentence: [{ word: '国旗', furigana: 'こっき', translation: 'государственный флаг', partOfSpeech: 'существительное' }], fullTranslation: 'государственный флаг' },
    ittai: { sentence: [{ word: 'いったい', furigana: 'いったい', translation: 'вообще, собственно', partOfSpeech: 'наречие' }], fullTranslation: 'вообще' },
};

const kanaRows = {
    na: [{ kana: 'な', romaji: 'na' }, { kana: 'に', romaji: 'ni' }, { kana: 'ぬ', romaji: 'nu' }, { kana: 'ね', romaji: 'ne' }, { kana: 'の', romaji: 'no' }],
    ha: [{ kana: 'は', romaji: 'ha' }, { kana: 'ひ', romaji: 'hi' }, { kana: 'ふ', romaji: 'fu' }, { kana: 'へ', romaji: 'he' }, { kana: 'ほ', romaji: 'ho' }],
    ba: [{ kana: 'ば', romaji: 'ba' }, { kana: 'び', romaji: 'bi' }, { kana: 'ぶ', romaji: 'bu' }, { kana: 'べ', romaji: 'be' }, { kana: 'ぼ', romaji: 'bo' }],
    pa: [{ kana: 'ぱ', romaji: 'pa' }, { kana: 'ぴ', romaji: 'pi' }, { kana: 'ぷ', romaji: 'pu' }, { kana: 'ぺ', romaji: 'pe' }, { kana: 'ぽ', romaji: 'po' }],
};

const exercises = [
    { id: 'q1', type: 'multiple-choice', title: 'Вопрос 1', description: 'Слово "大学" (университет) относится к какой группе лексики?', options: ['Ваго', 'Канго', 'Гайрайго'], correctAnswer: 'Канго' },
    { id: 'q2', type: 'select-correct', title: 'Вопрос 2', description: 'Каким знаком обозначается долгота согласных на письме?', options: ['ー', 'っ', '゛'], correctAnswer: 'っ' },
    { id: 'q3', type: 'select-correct', title: 'Вопрос 3', description: 'Какой знак используется для озвончения ряда ХА (は) в ряд БА (ば)?', options: ['゛ (нигори)', '゜ (ханнигори)', 'っ (сокуон)'], correctAnswer: '゛ (нигори)' },
];

const LESSON_ID = 'phonetics-lesson-3';

const KanaRowDisplay = ({ rowData }: { rowData: typeof kanaRows.na }) => (
    <div className='flex flex-wrap gap-4 mt-2 justify-center'>
       {rowData.map(char => (
           <Card key={char.kana} className="p-4 flex flex-col items-center justify-center w-24 h-24"><span className="text-4xl font-japanese">{char.kana}</span><span className="text-muted-foreground">{char.romaji}</span></Card>
       ))}
   </div>
);


export default function PhoneticsLesson3Page() {
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

    const checkAnswers = () => {
        const newResults: Record<string, boolean | null> = {};
        exercises.forEach(ex => {
            newResults[ex.id] = answers[ex.id] === ex.correctAnswer;
        });
        setResults(newResults);
        updateProgress(newResults);
        try {
            localStorage.setItem(`${LESSON_ID}-answers`, JSON.stringify(answers));
        } catch (error) {
            console.error("Failed to save answers to localStorage", error);
        }
    };

    const renderExercise = (exercise: typeof exercises[0]) => {
        const { id, title, description, options } = exercise;
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
                                <Label htmlFor={`${id}-${option}`}>{option}</Label>
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
                        <p className="text-sm text-primary font-semibold">Урок 3 — Фонетика</p>
                        <CardTitle className="text-2xl md:text-3xl">Новые согласные, удвоение и слои лексики</CardTitle>
                        <CardDescription>Прогресс по теме:</CardDescription>
                        <Progress value={progress} className="mt-2" />
                    </CardHeader>
                </Card>

                <h2 className="text-3xl font-bold text-foreground mb-6 text-center">🧠 Теория</h2>
                <Accordion type="single" collapsible className="w-full max-w-4xl mb-12" defaultValue="item-1">
                    <AccordionItem value="item-1">
                        <AccordionTrigger className="text-xl font-semibold">§1. Слои лексики</AccordionTrigger>
                        <AccordionContent className="text-lg text-foreground/90 space-y-4 px-2">
                           <p>В японском языке слова делятся на три больших слоя по происхождению.</p>
                           <Table>
                               <TableHeader><TableRow><TableHead>Слой</TableHead><TableHead>Описание</TableHead><TableHead>Примеры</TableHead></TableRow></TableHeader>
                               <TableBody>
                                   <TableRow><TableCell>Ваго (和語)</TableCell><TableCell>Собственно японские слова.</TableCell><TableCell><InteractiveText analysis={phoneticsAnalyses.kuni}/>, <InteractiveText analysis={phoneticsAnalyses.mizu}/></TableCell></TableRow>
                                   <TableRow><TableCell>Канго (漢語)</TableCell><TableCell>Слова, заимствованные из Китая или созданные по китайской модели.</TableCell><TableCell><InteractiveText analysis={phoneticsAnalyses.daigaku}/>, <InteractiveText analysis={phoneticsAnalyses.hon}/></TableCell></TableRow>
                                   <TableRow><TableCell>Гайрайго (外来語)</TableCell><TableCell>Слова, заимствованные из европейских (в основном английского) языков.</TableCell><TableCell><InteractiveText analysis={phoneticsAnalyses.source}/>, <InteractiveText analysis={phoneticsAnalyses.oasis}/></TableCell></TableRow>
                               </TableBody>
                           </Table>
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-2">
                        <AccordionTrigger className="text-xl font-semibold">§2. Новые согласные</AccordionTrigger>
                        <AccordionContent className="text-lg text-foreground/90 space-y-4 px-2">
                            <h4 className="font-bold text-xl mb-2">Ряд НА</h4>
                            <p>Согласный [н] в слогах НА, НУ, НЭ, НО похож на русское твердое [н]. В слоге НИ произносится мягкое [н'].</p>
                            
                            <h4 className="font-bold text-xl mt-4 mb-2">Ряд ХА, БА, ПА</h4>
                            <p>Звук [х] в ХА, ХЭ, ХО произносится с легким выдохом. В слоге ХИ звук [х'] мягкий. В слоге ФУ (ふ) звук средний между [ф] и [х], образуется потоком воздуха между губами без участия зубов.</p>
                            <p className="mt-2">С помощью значка <b className="font-japanese text-primary">゛</b> (нигори) ряд ХА превращается в ряд БА (звонкий). А с помощью значка <b className="font-japanese text-primary">゜</b> (ханнигори) — в ряд ПА (глухой).</p>
                        </AccordionContent>
                    </AccordionItem>
                     <AccordionItem value="item-3">
                        <AccordionTrigger className="text-xl font-semibold">§3. Удвоение согласных</AccordionTrigger>
                        <AccordionContent className="text-lg text-foreground/90 space-y-4 px-2">
                            <p>Долгота согласных (удвоение) играет в японском смыслоразличительную роль. Например, <InteractiveText analysis={phoneticsAnalyses.dzikki}/> и <InteractiveText analysis={phoneticsAnalyses.dziki}/>.</p>
                            <p>На письме долгота согласных [к], [с], [т], [п] обозначается маленьким знаком <b className="text-primary font-japanese">っ</b> (сокуон), который ставится перед удваиваемым слогом. Например, <InteractiveText analysis={phoneticsAnalyses.kokki}/> или <InteractiveText analysis={phoneticsAnalyses.ittai}/>.</p>
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-4">
                        <AccordionTrigger className="text-xl font-semibold">§4. Письменность</AccordionTrigger>
                        <AccordionContent className="text-lg text-foreground/90 space-y-4 px-2">
                            <h4 className="font-bold text-xl mt-4 mb-2">Ряд НА (な)</h4>
                            <KanaRowDisplay rowData={kanaRows.na} />
                            <h4 className="font-bold text-xl mt-4 mb-2">Ряд ХА (は)</h4>
                            <KanaRowDisplay rowData={kanaRows.ha} />
                            <h4 className="font-bold text-xl mt-4 mb-2">Ряд БА (ば)</h4>
                            <KanaRowDisplay rowData={kanaRows.ba} />
                            <h4 className="font-bold text-xl mt-4 mb-2">Ряд ПА (ぱ)</h4>
                            <KanaRowDisplay rowData={kanaRows.pa} />
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
                        <Link href="#">Перейти к Уроку 4 →</Link>
                    </Button>
                </div>
            </div>
        </div>
    );
}
