
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

// Since this is a new lesson, we'll create some dummy analyses for interactive examples
const phoneticsAnalyses = {
    kame1: { sentence: [{ word: 'かめ', furigana: 'かめ', translation: 'черепаха', partOfSpeech: 'существительное' }], fullTranslation: 'черепаха' },
    kame2: { sentence: [{ word: 'かめ', furigana: 'かめ', translation: 'кувшин', partOfSpeech: 'существительное' }], fullTranslation: 'кувшин' },
    ruble: { sentence: [{ word: 'ルーブル', furigana: 'ルーブル', translation: 'рубль', partOfSpeech: 'существительное' }], fullTranslation: 'рубль' },
    line: { sentence: [{ word: 'ライン', furigana: 'ライン', translation: 'линия', partOfSpeech: 'существительное' }], fullTranslation: 'линия' },
    kai1: { sentence: [{ word: 'かい', furigana: 'かい', translation: 'моллюск', partOfSpeech: 'существительное' }], fullTranslation: 'моллюск' },
    kai2: { sentence: [{ word: 'かい', furigana: 'かい', translation: 'низший ранг', partOfSpeech: 'существительное' }], fullTranslation: 'низший ранг' },
    akai: { sentence: [{ word: 'あかい', furigana: 'あかい', translation: 'красный', partOfSpeech: 'прилагательное' }], fullTranslation: 'красный' },
    aki: { sentence: [{ word: 'あき', furigana: 'あき', translation: 'осень', partOfSpeech: 'существительное' }], fullTranslation: 'осень' },
    ika: { sentence: [{ word: 'いか', furigana: 'いか', translation: 'кальмар', partOfSpeech: 'существительное' }], fullTranslation: 'кальмар' },
};

const LESSON_ID = 'phonetics-lesson-1';

const kanaRows = {
    a: [
        { kana: 'あ', romaji: 'a' },
        { kana: 'い', romaji: 'i' },
        { kana: 'う', romaji: 'u' },
        { kana: 'え', romaji: 'e' },
        { kana: 'お', romaji: 'o' },
    ],
    ka: [
        { kana: 'か', romaji: 'ka' },
        { kana: 'き', romaji: 'ki' },
        { kana: 'く', romaji: 'ku' },
        { kana: 'け', romaji: 'ke' },
        { kana: 'こ', romaji: 'ko' },
    ],
    ga: [
        { kana: 'が', romaji: 'ga' },
        { kana: 'ぎ', romaji: 'gi' },
        { kana: 'ぐ', romaji: 'gu' },
        { kana: 'げ', romaji: 'ge' },
        { kana: 'ご', romaji: 'go' },
    ],
};

const exercises = [
    { id: 'q1', type: 'multiple-choice', title: 'Вопрос 1', description: 'Какой звук в русском языке заменяет отсутствующий в японском [л]?', options: ['[р]', '[в]', '[ф]'], correctAnswer: '[р]' },
    { id: 'q2', type: 'select-correct', title: 'Вопрос 2', description: 'Какой гласный произносится как нечто среднее между русскими [у] и [ы]?', options: ['[а]', '[у]', '[о]'], correctAnswer: '[у]' },
    { id: 'q3', type: 'select-correct', title: 'Вопрос 3', description: 'Как на письме обозначается долгота гласного [о] в большинстве случаев?', options: ['おお', 'おう', 'おえ'], correctAnswer: 'おう' },
];

export default function PhoneticsLesson1Page() {
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
        updateProgress(newResults);
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
                        <p className="text-sm text-primary font-semibold">Урок 1 — Фонетика</p>
                        <CardTitle className="text-2xl md:text-3xl">Особенности фонетического строя</CardTitle>
                        <CardDescription>Прогресс по теме:</CardDescription>
                        <Progress value={progress} className="mt-2" />
                    </CardHeader>
                </Card>

                <h2 className="text-3xl font-bold text-foreground mb-6 text-center">🧠 Теория</h2>
                <Accordion type="single" collapsible className="w-full max-w-4xl mb-12" defaultValue="item-1">
                    <AccordionItem value="item-1">
                        <AccordionTrigger className="text-xl font-semibold">§1. Ключевые особенности</AccordionTrigger>
                        <AccordionContent className="text-lg text-foreground/90 space-y-4 px-2">
                            <ul className="list-disc list-inside space-y-3">
                                <li><b>Слоговая структура:</b> Большинство слогов в японском — открытые, то есть заканчиваются на гласный звук (например, `ка`, `ми`, `су`).</li>
                                <li><b>Музыкальная акцентуация:</b> Важна не сила ударения, а высота тона. Изменение высоты может менять смысл слова. Например: <InteractiveText analysis={phoneticsAnalyses.kame1}/> (низкий-высокий тон) и <InteractiveText analysis={phoneticsAnalyses.kame2}/> (высокий-низкий тон).</li>
                                <li><b>Долгота звуков:</b> И гласные, и согласные могут быть краткими и долгими, что также влияет на смысл.</li>
                                <li><b>Отсутствующие звуки:</b> В японском нет некоторых звуков, привычных для русского языка, например, звука [л]. В заимствованных словах он заменяется на [р]: <InteractiveText analysis={phoneticsAnalyses.ruble}/>, <InteractiveText analysis={phoneticsAnalyses.line}/>.</li>
                                <li><b>Артикуляционные особенности:</b> Некоторые звуки произносятся иначе. Например, при произнесении гласных [о] и [у] губы почти не вытягиваются вперед.</li>
                            </ul>
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-2">
                        <AccordionTrigger className="text-xl font-semibold">§2. Гласные звуки [а], [и], [у], [э], [о]</AccordionTrigger>
                        <AccordionContent className="text-lg text-foreground/90 space-y-4 px-2">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Звук</TableHead>
                                        <TableHead>Описание</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    <TableRow><TableCell>[а]</TableCell><TableCell>Близок к русскому ударному [а] в слове «сад».</TableCell></TableRow>
                                    <TableRow><TableCell>[и]</TableCell><TableCell>Как русское [и] в слове «тир». Согласные перед ним смягчаются.</TableCell></TableRow>
                                    <TableRow><TableCell>[у]</TableCell><TableCell>Средний звук между русскими [у] и [ы]. Губы не вытягиваются вперед, а слегка растянуты.</TableCell></TableRow>
                                    <TableRow><TableCell>[э]</TableCell><TableCell>Похож на русское [э] в слове «эти». Предшествующие согласные не смягчаются.</TableCell></TableRow>
                                    <TableRow><TableCell>[о]</TableCell><TableCell>Произносится отчетливо, не заменяется на [а] в безударном положении. Губы слегка округлены, но не вытянуты.</TableCell></TableRow>
                                </TableBody>
                            </Table>
                        </AccordionContent>
                    </AccordionItem>
                     <AccordionItem value="item-3">
                        <AccordionTrigger className="text-xl font-semibold">§3. Долгие гласные и дифтонги</AccordionTrigger>
                        <AccordionContent className="text-lg text-foreground/90 space-y-4 px-2">
                             <h4 className="font-bold text-xl mb-2">Долгие гласные</h4>
                            <p>Долгие гласные отличаются от кратких только продолжительностью звучания. Это важно, так как долгота меняет смысл слова.</p>
                             <h4 className="font-bold text-xl mt-4 mb-2">Дифтонги</h4>
                             <div>Дифтонги — это сочетания гласных. Основные: [ай], [уй]. Важно, что не все сочетания гласных образуют дифтонг. Например:</div>
                             <div><InteractiveText analysis={phoneticsAnalyses.kai1}/> (дифтонг) и <InteractiveText analysis={phoneticsAnalyses.kai2}/> (два отдельных слога).</div>
                             <div className='mt-2'>Сочетание [э] + [и] (`えい`) в современном японском обычно произносится как долгое [э:].</div>
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-4">
                        <AccordionTrigger className="text-xl font-semibold">§4. Согласные звуки</AccordionTrigger>
                        <AccordionContent className="text-lg text-foreground/90 space-y-4 px-2">
                             <h4 className="font-bold text-xl mb-2">Ряды КА и ГА</h4>
                             <p>Согласный [к] произносится твердо в слогах КА, КУ, КЭ, КО, и мягко ([к']) в слоге КИ.</p>
                             <div className='mt-2'>Слог ГА является "озвонченным" вариантом КА. Согласный [г] также произносится твердо (ГА, ГУ, ГЭ, ГО) или мягко (ГИ). В середине слова [г] может приобретать носовой оттенок, аналога которому нет в русском языке.</div>
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-5">
                        <AccordionTrigger className="text-xl font-semibold">§5. Тонизация</AccordionTrigger>
                        <AccordionContent className="text-lg text-foreground/90 space-y-4 px-2">
                           <p>В японском языке используется музыкальное ударение, основанное на высоте тона. Единица ударения — мора (примерно равна одному краткому слогу).</p>
                             <Table>
                                <TableHeader><TableRow><TableHead>Тип</TableHead><TableHead>Описание</TableHead><TableHead>Пример</TableHead></TableRow></TableHeader>
                                <TableBody>
                                    <TableRow><TableCell>Восходящая</TableCell><TableCell>Первая мора низкая, остальные средние.</TableCell><TableCell><InteractiveText analysis={phoneticsAnalyses.akai}/></TableCell></TableRow>
                                    <TableRow><TableCell>Нисходящая</TableCell><TableCell>Первая мора высокая, остальные ниже.</TableCell><TableCell><InteractiveText analysis={phoneticsAnalyses.aki}/></TableCell></TableRow>
                                    <TableRow><TableCell>Нисходяще-восходящая</TableCell><TableCell>Тон повышается со второй моры, затем падает.</TableCell><TableCell><InteractiveText analysis={phoneticsAnalyses.ika}/></TableCell></TableRow>
                                </TableBody>
                            </Table>
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-6">
                        <AccordionTrigger className="text-xl font-semibold">§6. Письменность</AccordionTrigger>
                        <AccordionContent className="text-lg text-foreground/90 space-y-4 px-2">
                            <p>Японская письменность использует две фонетические азбуки (Кана) и иероглифы (Кандзи).</p>
                            <div className="grid md:grid-cols-2 gap-4 mt-4">
                                <Card>
                                    <CardHeader><CardTitle>Хирагана (ひらがな)</CardTitle></CardHeader>
                                    <CardContent>Используется для записи грамматических частиц, окончаний и японских слов, для которых нет кандзи.</CardContent>
                                </Card>
                                <Card>
                                    <CardHeader><CardTitle>Катакана (カタカナ)</CardTitle></CardHeader>
                                    <CardContent>Используется для записи заимствованных слов, имен, названий и для эмфатического выделения.</CardContent>
                                </Card>
                            </div>
                            <h4 className="font-bold text-xl mt-4 mb-2">Написание рядов А, КА, ГА</h4>
                            <p>Изучим первые знаки хираганы.</p>
                            <div className='flex flex-wrap gap-4 mt-2 justify-center'>
                                {kanaRows.a.map(char => (
                                    <Card key={char.kana} className="p-4 flex flex-col items-center justify-center w-24 h-24"><span className="text-4xl font-japanese">{char.kana}</span><span className="text-muted-foreground">{char.romaji}</span></Card>
                                ))}
                            </div>
                             <div className='flex flex-wrap gap-4 mt-2 justify-center'>
                                {kanaRows.ka.map(char => (
                                    <Card key={char.kana} className="p-4 flex flex-col items-center justify-center w-24 h-24"><span className="text-4xl font-japanese">{char.kana}</span><span className="text-muted-foreground">{char.romaji}</span></Card>
                                ))}
                            </div>
                            <p className='mt-4'>Для озвончения к знаку справа вверху добавляется значок нигори (゛).</p>
                            <div className='flex flex-wrap gap-4 mt-2 justify-center'>
                                {kanaRows.ga.map(char => (
                                    <Card key={char.kana} className="p-4 flex flex-col items-center justify-center w-24 h-24"><span className="text-4xl font-japanese">{char.kana}</span><span className="text-muted-foreground">{char.romaji}</span></Card>
                                ))}
                            </div>

                             <h4 className="font-bold text-xl mt-4 mb-2">Написание долгих гласных</h4>
                             <Table>
                                <TableHeader><TableRow><TableHead>Долгота</TableHead><TableHead>Обозначение</TableHead></TableRow></TableHeader>
                                <TableBody>
                                    <TableRow><TableCell>[а:]</TableCell><TableCell>ああ</TableCell></TableRow>
                                    <TableRow><TableCell>[и:]</TableCell><TableCell>いい</TableCell></TableRow>
                                    <TableRow><TableCell>[у:]</TableCell><TableCell>うう</TableCell></TableRow>
                                    <TableRow><TableCell>[э:]</TableCell><TableCell>ええ или чаще えい</TableCell></TableRow>
                                    <TableRow><TableCell>[о:]</TableCell><TableCell>おう или реже おお</TableCell></TableRow>
                                </TableBody>
                             </Table>
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
                        <Link href="#">Перейти к Уроку 2 →</Link>
                    </Button>
                </div>
            </div>
        </div>
    );
}
