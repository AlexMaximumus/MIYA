
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
    honwo: { sentence: [{ word: '本', furigana: 'ほん', translation: 'книга', partOfSpeech: 'существительное' }, { word: 'を', furigana: 'を', translation: 'частица вин. падежа', partOfSpeech: 'частица' }], fullTranslation: 'книгу' },
    yomu: { sentence: [{ word: '読', furigana: 'よ', translation: 'читать (основа)', partOfSpeech: 'глагол' }, { word: 'む', furigana: 'む', translation: 'окончание', partOfSpeech: 'суффикс' }], fullTranslation: 'читать' },
    shiroi: { sentence: [{ word: '白', furigana: 'しろ', translation: 'белый (основа)', partOfSpeech: 'прилагательное' }, { word: 'い', furigana: 'い', translation: 'окончание', partOfSpeech: 'суффикс' }], fullTranslation: 'белый' },
    hito: { sentence: [{ word: '人', furigana: 'ひと', translation: 'человек', partOfSpeech: 'существительное' }], fullTranslation: 'человек' },
    nihon: { sentence: [{ word: '日本', furigana: 'にほん', translation: 'Япония', partOfSpeech: 'существительное' }], fullTranslation: 'Япония' },
    nihongo: { sentence: [{ word: '日本語', furigana: 'にほんご', translation: 'японский язык', partOfSpeech: 'существительное' }], fullTranslation: 'японский язык' },
    sensei: { sentence: [{ word: '先生', furigana: 'せんせい', translation: 'учитель', partOfSpeech: 'существительное' }], fullTranslation: 'учитель' },
    gakusei: { sentence: [{ word: '学生', furigana: 'がくせい', translation: 'студент', partOfSpeech: 'существительное' }], fullTranslation: 'студент' },
    bungaku: { sentence: [{ word: '文学', furigana: 'ぶんがく', translation: 'литература', partOfSpeech: 'существительное' }], fullTranslation: 'литература' },
    kyou: { sentence: [{ word: 'きょう', furigana: 'きょう', translation: 'сегодня', partOfSpeech: 'существительное' }], fullTranslation: 'сегодня' },
    shu: { sentence: [{ word: 'しゅう', furigana: 'しゅう', translation: 'неделя', partOfSpeech: 'существительное' }], fullTranslation: 'неделя' },
    hiyamizu: { sentence: [{ word: 'ひやみず', furigana: 'ひやみず', translation: 'холодная вода', partOfSpeech: 'существительное' }], fullTranslation: 'холодная вода' },
};

const kanaRows = {
    ma: [{ kana: 'ま', romaji: 'ma' }, { kana: 'み', romaji: 'mi' }, { kana: 'む', romaji: 'mu' }, { kana: 'め', romaji: 'me' }, { kana: 'も', romaji: 'mo' }],
    ya: [{ kana: 'や', romaji: 'ya' }, { kana: 'ゆ', romaji: 'yu' }, { kana: 'よ', romaji: 'yo' }],
    yotated: [
        { kana: 'きゃ', romaji: 'kya' }, { kana: 'きゅ', romaji: 'kyu' }, { kana: 'きょ', romaji: 'kyo' },
        { kana: 'しゃ', romaji: 'sha' }, { kana: 'しゅ', romaji: 'shu' }, { kana: 'しょ', romaji: 'sho' },
        { kana: 'ちゃ', romaji: 'cha' }, { kana: 'ちゅ', romaji: 'chu' }, { kana: 'ちょ', romaji: 'cho' },
    ]
};

const kanjiList = [
    { kanji: '人', kun: 'ひと', on: 'ジン, ニン', meaning: 'человек, люди' },
    { kanji: '方', kun: 'かた', on: 'ホウ', meaning: 'сторона, направление' },
    { kanji: '日', kun: 'ひ', on: 'ニチ, ジツ', meaning: 'день, солнце' },
    { kanji: '文', kun: '-', on: 'ブン, モン', meaning: 'литература, текст' },
    { kanji: '本', kun: 'もと', on: 'ホン', meaning: 'основа, книга' },
    { kanji: '先', kun: 'さき', on: 'セン', meaning: 'раньше, впереди' },
    { kanji: '生', kun: 'うまれる, いきる, なま', on: 'セイ, ショウ', meaning: 'рождаться, жить, сырой' },
    { kanji: '学', kun: 'まなぶ', on: 'ガク', meaning: 'учёба' },
    { kanji: '語', kun: 'かたる', on: 'ゴ', meaning: 'слово, язык' },
];

const exercises = [
    { id: 'q1', type: 'multiple-choice', title: 'Вопрос 1', description: 'Как на письме обозначаются слоги с мягкими согласными (например, КЯ)?', options: ['Одним специальным знаком', 'Сочетанием двух знаков (например, き + や)', 'Никак не обозначаются'], correctAnswer: 'Сочетанием двух знаков (например, き + や)' },
    { id: 'q2', type: 'select-correct', title: 'Вопрос 2', description: 'Какое чтение иероглифа используется в словах китайского происхождения (канго)?', options: ['Онное чтение', 'Кунное чтение'], correctAnswer: 'Онное чтение' },
    { id: 'q3', type: 'select-correct', title: 'Вопрос 3', description: 'Что такое ключ иероглифа?', options: ['Элемент, указывающий на произношение', 'Условно взятая часть для классификации в словарях', 'Схематическое изображение предмета'], correctAnswer: 'Условно взятая часть для классификации в словарях' },
];

const LESSON_ID = 'phonetics-lesson-4';

const KanaRowDisplay = ({ rowData }: { rowData: { kana: string; romaji: string }[] }) => (
    <div className='flex flex-wrap gap-4 mt-2 justify-center'>
       {rowData.map(char => (
           <Card key={char.kana} className="p-4 flex flex-col items-center justify-center w-24 h-24"><span className="text-3xl md:text-4xl font-japanese">{char.kana}</span><span className="text-muted-foreground">{char.romaji}</span></Card>
       ))}
   </div>
);


export default function PhoneticsLesson4Page() {
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
    };

    const renderExercise = (exercise: typeof exercises[0]) => {
        const { id, title, description, options } = exercise;
        const result = results[id];

        return (
            <Card key={id} className="w-full">
                <CardHeader>
                    <CardTitle className="text-xl md:text-2xl">{title}</CardTitle>
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
                        <p className="text-sm text-primary font-semibold">Урок 4 — Фонетика</p>
                        <CardTitle className="text-2xl md:text-3xl">Йотированные гласные и введение в иероглифику</CardTitle>
                        <CardDescription>Прогресс по теме:</CardDescription>
                        <Progress value={progress} className="mt-2" />
                    </CardHeader>
                </Card>

                <h2 className="text-3xl font-bold text-foreground mb-6 text-center">🧠 Теория</h2>
                <Accordion type="single" collapsible className="w-full max-w-4xl mb-12" defaultValue="item-1">
                    <AccordionItem value="item-1">
                        <AccordionTrigger className="text-xl font-semibold">§1. Новые слоги и звуки</AccordionTrigger>
                        <AccordionContent className="text-lg text-foreground/90 space-y-4 px-2">
                            <div>
                                <h4 className="font-bold text-xl mb-2">Ряд МА (ま)</h4>
                                <p>Согласный [м] в слогах МА, МУ, МЭ, МО похож на русское [м]. В слоге МИ произносится мягкое [м'].</p>
                                <KanaRowDisplay rowData={kanaRows.ma} />
                            </div>
                            <div>
                                <h4 className="font-bold text-xl mt-4 mb-2">Ряд Я (や)</h4>
                                <p>Йотированные гласные [йа], [йу], [йо] совпадают с русскими аналогами.</p>
                                <KanaRowDisplay rowData={kanaRows.ya} />
                            </div>
                            <div>
                                <h4 className="font-bold text-xl mt-4 mb-2">Слоги с мягкими согласными</h4>
                                <div>Мягкие согласные могут сочетаться с йотированными гласными. На письме это обозначается сочетанием знака на -И (き, し, ち и т.д.) и маленького знака из ряда Я (ゃ, ゅ, ょ).</div>
                                <KanaRowDisplay rowData={kanaRows.yotated} />
                                <div className="mt-2">Долгота в таких слогах обозначается добавлением う. Например, <InteractiveText analysis={phoneticsAnalyses.kyou}/>, <InteractiveText analysis={phoneticsAnalyses.shu}/>.</div>
                                <div className="mt-2">Если знак ряда Я пишется обычным размером, он читается отдельно: <InteractiveText analysis={phoneticsAnalyses.hiyamizu}/>.</div>
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-2">
                        <AccordionTrigger className="text-xl font-semibold">§2. Введение в иероглифы (漢字)</AccordionTrigger>
                        <AccordionContent className="text-lg text-foreground/90 space-y-6 px-2">
                            <div>
                                <h4 className="font-bold text-xl mb-2">Что такое иероглиф?</h4>
                                <p>Иероглиф (кандзи) — это письменный знак, обозначающий целое слово или его значимую часть (корень). Японская письменность смешанная: в ней используются и кандзи, и слоговые азбуки (кана).</p>
                            </div>
                             <div>
                                <h4 className="font-bold text-xl mb-2">Виды иероглифов</h4>
                                <ul className="list-disc list-inside space-y-2">
                                    <li><b>Простые (изобразительные):</b> Схематичные изображения предметов. Пример: 日 (солнце), 山 (гора), 木 (дерево).</li>
                                    <li><b>Указательные (символы):</b> Изображения отвлеченных понятий. Пример: 上 (верх), 下 (низ).</li>
                                    <li><b>Сложные (идеограммы):</b> Сочетание простых иероглифов. Пример: 森 (роща) = три дерева.</li>
                                    <li><b>Идеофонограммы:</b> Содержат ключ (указывает на смысл) и фонетик (указывает на чтение). Это самый многочисленный тип иероглифов.</li>
                                </ul>
                            </div>
                             <div>
                                <h4 className="font-bold text-xl mb-2">Чтение иероглифов: Он и Кун</h4>
                                <Table>
                                    <TableHeader><TableRow><TableHead>Тип чтения</TableHead><TableHead>Описание</TableHead></TableRow></TableHeader>
                                    <TableBody>
                                        <TableRow>
                                            <TableCell className="font-bold">Он (音読み)</TableCell>
                                            <TableCell>Китайское чтение, адаптированное под японскую фонетику. Используется в словах китайского происхождения (канго), обычно состоящих из нескольких иероглифов.</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell className="font-bold">Кун (訓読み)</TableCell>
                                            <TableCell>Японское чтение. Соответствует собственно японскому слову с тем же значением. Часто используется для иероглифов, обозначающих одно слово, с добавлением окончаний, записанных хираганой.</TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </div>
                             <div>
                                <h4 className="font-bold text-xl mb-2">Правила смешанного письма</h4>
                                <ul className="list-disc list-inside space-y-2">
                                    <li><b>Существительные:</b> Основа — иероглифом, падежные показатели — каной. Пример: <InteractiveText analysis={phoneticsAnalyses.honwo}/></li>
                                    <li><b>Глаголы:</b> Неизменяемая основа — иероглифом, изменяемая часть (окуригана) — каной. Пример: <InteractiveText analysis={phoneticsAnalyses.yomu}/></li>
                                    <li><b>Прилагательные:</b> Основа — иероглифом, окончание — каной. Пример: <InteractiveText analysis={phoneticsAnalyses.shiroi}/></li>
                                </ul>
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-3">
                        <AccordionTrigger className="text-xl font-semibold">§3. Иероглифы урока</AccordionTrigger>
                        <AccordionContent className="text-lg text-foreground/90 space-y-4 px-2">
                            <Table>
                                <TableHeader><TableRow><TableHead>Иероглиф</TableHead><TableHead>Кун-чтение</TableHead><TableHead>Он-чтение</TableHead><TableHead>Значение</TableHead></TableRow></TableHeader>
                                <TableBody>
                                    {kanjiList.map(k => (
                                        <TableRow key={k.kanji}>
                                            <TableCell className="font-japanese text-2xl md:text-3xl">{k.kanji}</TableCell>
                                            <TableCell className="font-japanese">{k.kun}</TableCell>
                                            <TableCell className="font-japanese">{k.on}</TableCell>
                                            <TableCell>{k.meaning}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                             <h4 className="font-bold text-xl mt-4 mb-2">Примеры слов</h4>
                             <div className="grid grid-cols-2 gap-4">
                                <InteractiveText analysis={phoneticsAnalyses.hito}/>
                                <InteractiveText analysis={phoneticsAnalyses.nihon}/>
                                <InteractiveText analysis={phoneticsAnalyses.nihongo}/>
                                <InteractiveText analysis={phoneticsAnalyses.sensei}/>
                                <InteractiveText analysis={phoneticsAnalyses.gakusei}/>
                                <InteractiveText analysis={phoneticsAnalyses.bungaku}/>
                             </div>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>

                <h2 className="text-3xl font-bold text-foreground mb-8 mt-12 text-center">📝 Закрепление</h2>
                <div className="w-full max-w-4xl space-y-8 mt-8">
                    {exercises.map(renderExercise)}
                </div>
                <div className="mt-12 text-center flex flex-col sm:flex-row justify-center items-center gap-4">
                    <Button size="lg" variant="default" onClick={checkAnswers}>Проверить все</Button>
                    <Button size="lg" asChild className="btn-gradient">
                        <Link href="/phonetics/lesson-5">Перейти к Уроку 5 →</Link>
                    </Button>
                </div>
            </div>
        </div>
    );
}

    