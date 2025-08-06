
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, Share2, Volume2, BookOpen, CheckCircle, XCircle, Lightbulb, Check, HelpCircle, Repeat } from 'lucide-react';
import Link from 'next/link';
import InteractiveText from '@/components/interactive-text';
import InteractiveFormula from '@/components/interactive-formula';
import { grammarAnalyses, dialogueAnalyses } from '@/ai/precomputed-analysis';
import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard';
import { useToast } from '@/hooks/use-toast';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { Reorder } from 'framer-motion';


const LESSON_ID = 'grammar-lesson-1';

const katakanaRows = {
    a: [{ kana: 'ア', romaji: 'a' }, { kana: 'イ', romaji: 'i' }, { kana: 'ウ', romaji: 'u' }, { kana: 'エ', romaji: 'e' }, { kana: 'オ', romaji: 'o' }],
    ka: [{ kana: 'カ', romaji: 'ka' }, { kana: 'キ', romaji: 'ki' }, { kana: 'ク', romaji: 'ku' }, { kana: 'ケ', romaji: 'ke' }, { kana: 'コ', romaji: 'ko' }],
    sa: [{ kana: 'サ', romaji: 'sa' }, { kana: 'シ', romaji: 'shi' }, { kana: 'ス', romaji: 'su' }, { kana: 'セ', romaji: 'se' }, { kana: 'ソ', romaji: 'so' }],
    na: [{ kana: 'ナ', romaji: 'na' }, { kana: 'ニ', romaji: 'ni' }, { kana: 'ヌ', romaji: 'nu' }, { kana: 'ネ', romaji: 'ne' }, { kana: 'ノ', romaji: 'no' }],
    ta: [{ kana: 'タ', romaji: 'ta' }, { kana: 'チ', romaji: 'chi' }, { kana: 'ツ', romaji: 'tsu' }, { kana: 'テ', romaji: 'te' }, { kana: 'ト', romaji: 'to' }],
    ha: [{ kana: 'ハ', romaji: 'ha' }, { kana: 'ヒ', romaji: 'hi' }, { kana: 'フ', romaji: 'fu' }, { kana: 'ヘ', romaji: 'he' }, { kana: 'ホ', romaji: 'ho' }],
};

const kanjiList = [
    { kanji: '一', kun: 'ひと', on: 'イチ, イツ', meaning: 'один' },
    { kanji: '二', kun: 'ふた', on: 'ニ', meaning: 'два' },
    { kanji: '三', kun: 'み', on: 'サン', meaning: 'три' },
    { kanji: '四', kun: 'よん, よ', on: 'シ', meaning: 'четыре' },
    { kanji: '室', kun: 'しつ', on: 'シツ', meaning: 'комната' },
    { kanji: '教', kun: 'おしえる', on: 'キョウ', meaning: 'вера, учение / преподавать' },
    { kanji: '習', kun: 'ならう', on: 'シュウ', meaning: 'учиться, обучаться' },
];

const KanaRowDisplay = ({ rowData }: { rowData: { kana: string; romaji: string }[] }) => (
    <div className='flex flex-wrap gap-4 mt-2 justify-center'>
       {rowData.map(char => (
           <Card key={char.kana} className="p-4 flex flex-col items-center justify-center w-24 h-24"><span className="text-4xl font-japanese">{char.kana}</span><span className="text-muted-foreground">{char.romaji}</span></Card>
       ))}
   </div>
);

const ExerciseCard = ({ title, description, children, result, onCheck, canCheck = true }: { title: string; description?: React.ReactNode; children: React.ReactNode; result?: boolean | null; onCheck?: () => void, canCheck?: boolean }) => (
    <Card>
        <CardHeader>
            <CardTitle>{title}</CardTitle>
            {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
        <CardContent>{children}</CardContent>
        {onCheck && (
            <CardFooter className="flex flex-col items-start gap-4">
                {canCheck && <Button onClick={onCheck}>Проверить</Button>}
                {result === true && <span className="flex items-center gap-2 text-green-600"><CheckCircle/> Верно!</span>}
                {result === false && <span className="flex items-center gap-2 text-destructive"><XCircle/> Ошибка. Попробуйте снова.</span>}
            </CardFooter>
        )}
    </Card>
);


export default function GrammarLesson1Page() {
    const [progress, setProgress] = useState(0);
    const [answers, setAnswers] = useState<Record<string, any>>({});
    const [results, setResults] = useState<Record<string, boolean | null>>({});

    const [_, copy] = useCopyToClipboard();
    const { toast } = useToast();

    const handleShare = () => {
        copy(window.location.href)
            .then(() => toast({ title: 'Ссылка скопирована!', description: 'Вы можете поделиться этим уроком с кем угодно.' }))
            .catch(() => toast({ title: 'Ошибка', description: 'Не удалось скопировать ссылку.', variant: 'destructive' }));
    }

    const handleInputChange = (id: string, value: string) => {
        setAnswers(prev => ({ ...prev, [id]: value }));
        setResults(prev => ({...prev, [id]: null}));
    };

    const checkAnswer = (id: string, correctAnswer: string) => {
        const userAnswer = (answers[id] || '').trim().replace(/[.\s。]/g, '');
        const isCorrect = userAnswer === correctAnswer.replace(/[.\s。]/g, '');
        setResults(prev => ({ ...prev, [id]: isCorrect }));
    };
    
    const checkAll = () => {
        const newResults: Record<string, boolean> = {};
        
        // Ex 2
        Object.entries(correctAnswersEx2).forEach(([key, value]) => {
            const id = `ex2_${key}`;
            newResults[id] = (answers[id] || '').trim().replace(/[.\s。]/g, '') === value.replace(/[.\s。]/g, '');
        });
        
        // Ex 4
        Object.entries(correctAnswersEx4).forEach(([key, value]) => {
            const id = `ex4_${key}`;
            newResults[id] = (answers[id] || '').trim().replace(/[.\s。]/g, '') === value.replace(/[.\s。]/g, '');
        });

        // Ex 6
        Object.entries(correctAnswersEx6).forEach(([key, value]) => {
            const id = `ex6_${key}`;
            newResults[id] = (answers[id] || '') === value;
        });

        // Ex 7
         Object.entries(correctAnswersEx7).forEach(([key, value]) => {
            const id = `ex7_${key}`;
            newResults[id] = (answers[id] || '').trim().replace(/[.\s。]/g, '') === value.replace(/[.\s。]/g, '');
        });

        // Ex 11
        Object.entries(correctAnswersEx11).forEach(([key, value]) => {
            const id = `ex11_${key}`;
            newResults[id] = (answers[id] || '').trim().replace(/[.\s。]/g, '') === value.replace(/[.\s。]/g, '');
        });
        
        // Ex 13
        Object.entries(correctAnswersEx13).forEach(([key, value]) => {
            const id = `ex13_${key}`;
            newResults[id] = (answers[id] || '') === value;
        });

        setResults(prev => ({...prev, ...newResults}));
    }

    const correctAnswersEx2 = {
        '1': 'わたしは先生ではありません。学生です。',
        '2': '田中さんは医者ではありません。技師です。',
        '3': 'あのかたは学生ではありません。先生です。',
        '4': '山田さんは先生ではありません。学生です。'
    };
    
    const correctAnswersEx4 = {
        '1': 'わたしは先生ですか。はい、先生です。',
        '2': '田中さんは医者ですか。はい、医者です。',
        '3': 'あのかたは学生ですか。はい、学生です。',
        '4': '山田さんは技師ですか。はい、技師です。',
    };
    
    const correctAnswersEx6 = {
        '1': 'だれ', '2': 'なん', '3': 'なん', '4': 'だれ', '5': 'なに'
    };
    
    const correctAnswersEx7 = {
        '1': '山田さんが先生です。',
        '2': '中山さんが医者です。',
        '3': '山本さんが技師です。',
        '4': 'ご専門は文学です。',
        '5': 'お名前はアンナです。',
    };

    const correctAnswersEx11 = {
        '1': 'わたしは医者ですか、先生ですか。',
        '2': '田中さんは技師ですか、医者ですか。',
        '3': 'ご専門は文学ですか、歴史ですか。',
        '4': '山田さんは先生ですか、学生ですか。'
    };

    const correctAnswersEx13 = {
        '1': 'は', '2': 'が', '3': 'は', '4': 'は', '5': 'は', '6': 'は', '7a': 'ですか', '7b': 'ですか', '8': 'はい'
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
                    <p className="text-sm text-primary font-semibold">Урок 1 (6) — Грамматика</p>
                    <CardTitle className="text-2xl md:text-3xl">Части речи и грамматические основы</CardTitle>
                    <CardDescription>Прогресс по теме (упражнения будут в следующем обновлении):</CardDescription>
                    <Progress value={progress} className="mt-2" />
                </CardHeader>
            </Card>

            <h2 className="text-3xl font-bold text-foreground mb-6 text-center">🧠 Теория</h2>
             <Accordion type="multiple" className="w-full max-w-4xl mb-12 space-y-4" defaultValue={['item-grammar']}>
                <AccordionItem value="item-grammar">
                    <AccordionTrigger className="text-2xl font-semibold bg-muted/50 px-4 rounded-t-lg"><BookOpen className="mr-4 text-primary"/>Грамматика</AccordionTrigger>
                    <AccordionContent className="text-lg text-foreground/90 space-y-4 px-6 py-4 border border-t-0 rounded-b-lg">
                        <Accordion type="single" collapsible className="w-full" defaultValue="g-1">
                            <AccordionItem value="g-1">
                                <AccordionTrigger className="text-xl font-semibold">§1. Части речи</AccordionTrigger>
                                <AccordionContent className="text-lg text-foreground/90 space-y-4 px-2">
                                    <p>В японском языке есть слова знаменательные (несущие смысл) и служебные. Отдельно стоят междометия.</p>
                                    <ul className="list-disc list-inside">
                                        <li><b>Знаменательные:</b> существительные, глаголы, прилагательные, местоимения, числительные, наречия.</li>
                                        <li><b>Служебные:</b> послелоги, союзы, частицы, связки.</li>
                                    </ul>
                                </AccordionContent>
                            </AccordionItem>
                             <AccordionItem value="g-2">
                                <AccordionTrigger className="text-xl font-semibold">§2. Имя существительное и Основный падеж</AccordionTrigger>
                                <AccordionContent className="text-lg text-foreground/90 space-y-4 px-2">
                                    <p>У существительных нет рода и числа. Они изменяются по 11 падежам с помощью суффиксов. Основной падеж (бессуффиксальный) совпадает с основой слова (N) и употребляется в нескольких случаях:</p>
                                    <Card className="bg-card/70 mt-4">
                                        <CardHeader><CardTitle>Функции основного падежа (N)</CardTitle></CardHeader>
                                        <CardContent className="space-y-4">
                                            <div><b>1. Обращение:</b> <InteractiveText analysis={grammarAnalyses.yamadasan} /></div>
                                            <div><b>2. Именная часть сказуемого:</b> <InteractiveText analysis={grammarAnalyses.gakuseidesu} /></div>
                                            <div><b>3. Подлежащее (тема) с частицей は:</b> <InteractiveText analysis={grammarAnalyses.tanakasan_wa_gakuseidesu} /></div>
                                        </CardContent>
                                    </Card>
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="g-3">
                                <AccordionTrigger className="text-xl font-semibold">§3. Местоимения</AccordionTrigger>
                                <AccordionContent className="text-lg text-foreground/90 space-y-4 px-2">
                                    <Card>
                                        <CardHeader><CardTitle>Личные местоимения</CardTitle></CardHeader>
                                        <CardContent>
                                            <Table>
                                                <TableHeader><TableRow><TableHead>Лицо</TableHead><TableHead>Местоимение (яп.)</TableHead><TableHead>Перевод</TableHead></TableRow></TableHeader>
                                                <TableBody>
                                                    <TableRow><TableCell>1-е</TableCell><TableCell className="font-japanese">わたくし, わたし</TableCell><TableCell>я</TableCell></TableRow>
                                                    <TableRow><TableCell>2-е</TableCell><TableCell className="font-japanese">あなた</TableCell><TableCell>ты, вы</TableCell></TableRow>
                                                    <TableRow><TableCell>3-е</TableCell><TableCell className="font-japanese">あのかた</TableCell><TableCell>он, она (вежливо)</TableCell></TableRow>
                                                </TableBody>
                                            </Table>
                                            <p className="text-sm mt-2 text-muted-foreground">Местоимение あなた используется редко. Чаще обращаются по имени или должности.</p>
                                        </CardContent>
                                    </Card>
                                     <Card className="mt-4">
                                        <CardHeader><CardTitle>Вопросительные местоимения</CardTitle></CardHeader>
                                        <CardContent>
                                            <p><b className="font-japanese">だれ (кто?)</b> / <b className="font-japanese text-primary">どなた (кто? вежл.)</b> — для людей.</p>
                                            <p><b className="font-japanese">なに (なん) (что?)</b> — для предметов. Чтение зависит от следующего звука.</p>
                                        </CardContent>
                                    </Card>
                                </AccordionContent>
                            </AccordionItem>
                           <AccordionItem value="g-4">
                                <AccordionTrigger className="text-xl font-semibold">§4. Простое предложение и связка です</AccordionTrigger>
                                <AccordionContent className="text-lg text-foreground/90 space-y-4 px-2">
                                    <p>Связка です (desu) используется в настояще-будущем времени. Отрицательная форма: ではありません (dewa arimasen).</p>
                                    <Card className="bg-card/70 mt-4">
                                        <CardHeader><CardTitle>Структура утверждения</CardTitle></CardHeader>
                                        <CardContent>
                                            <InteractiveFormula formula="N は N です 。" />
                                            <div className="mt-2"><InteractiveText analysis={grammarAnalyses.anokatahasenseidesu} /></div>
                                        </CardContent>
                                    </Card>
                                    <Card className="bg-card/70 mt-4">
                                        <CardHeader><CardTitle>Структура отрицания</CardTitle></CardHeader>
                                        <CardContent>
                                           <InteractiveFormula formula="N は N ではありません 。" />
                                            <div className="mt-2"><InteractiveText analysis={grammarAnalyses.anokatahasenseidehaarimasen} /></div>
                                        </CardContent>
                                    </Card>
                                    <Card className="bg-card/70 mt-4">
                                        <CardHeader><CardTitle>Опускаемое подлежащее</CardTitle></CardHeader>
                                        <CardContent>
                                            <p>Подлежащее часто опускается, если оно понятно из контекста. Сказуемое же обязательно.</p>
                                            <div className="mt-2"><InteractiveText analysis={grammarAnalyses.senseidesu} /></div>
                                        </CardContent>
                                    </Card>
                                </AccordionContent>
                            </AccordionItem>
                             <AccordionItem value="g-5">
                                <AccordionTrigger className="text-xl font-semibold">§5. Вопросительные предложения</AccordionTrigger>
                                <AccordionContent className="text-lg text-foreground/90 space-y-4 px-2">
                                    <p>Вопрос образуется добавлением частицы <b className="font-japanese text-primary">か</b> в конце предложения и повышением интонации. Знак (?) обычно не ставится.</p>
                                    <Card className="mt-4">
                                        <CardHeader><CardTitle>1. Общий вопрос (без вопросительного слова)</CardTitle></CardHeader>
                                        <CardContent>
                                            <p>Требует ответа "да/нет".</p>
                                            <InteractiveFormula formula="N は N です か 。" />
                                            <div className="my-2"><InteractiveText analysis={grammarAnalyses.anokatawagakuseidesuka}/></div>
                                            <h4 className="font-semibold mt-4">Ответы:</h4>
                                            <p><b>Да:</b> はい、学生です。 или はい、そうです。</p>
                                            <p><b>Нет:</b> いいえ、学生ではありません。 или いいえ、先生です。</p>
                                        </CardContent>
                                    </Card>
                                    <Card className="mt-4">
                                        <CardHeader><CardTitle>2. Специальный вопрос (с вопросительным словом)</CardTitle></CardHeader>
                                        <CardContent>
                                            <InteractiveFormula formula="QW が N です か 。" />
                                            <div className="my-2"><InteractiveText analysis={grammarAnalyses.daregagakuseidesuka}/></div>
                                        </CardContent>
                                    </Card>
                                     <Card className="mt-4">
                                        <CardHeader><CardTitle>3. Альтернативный вопрос</CardTitle></CardHeader>
                                        <CardContent>
                                            <p>Предлагает выбор между вариантами, каждый из которых заканчивается на か.</p>
                                            <InteractiveFormula formula="N は A です か、B です か。" />
                                            <div className="my-2"><InteractiveText analysis={grammarAnalyses.anokata_wa_sensei_desuka_gakusei_desuka}/></div>
                                        </CardContent>
                                    </Card>
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-word-formation">
                    <AccordionTrigger className="text-2xl font-semibold bg-muted/50 px-4 rounded-t-lg"><BookOpen className="mr-4 text-primary"/>Словообразование</AccordionTrigger>
                     <AccordionContent className="text-lg text-foreground/90 space-y-4 px-6 py-4 border border-t-0 rounded-b-lg">
                        <p>В японском языке вежливость выражается специальными словами и грамматическими формами.</p>
                        <h4 className="font-semibold">Аффиксы вежливости:</h4>
                         <ul className="list-disc list-inside space-y-2">
                            <li><b className="font-japanese">～さん:</b> Вежливый суффикс к именам и фамилиям. Не используется при разговоре о себе.</li>
                            <li><b className="font-japanese text-primary">お～:</b> Префикс вежливости, в основном для слов японского происхождения (<InteractiveText analysis={dialogueAnalyses.onamae}/>).</li>
                            <li><b className="font-japanese text-primary">ご～:</b> Префикс вежливости, в основном для слов китайского происхождения (<InteractiveText analysis={grammarAnalyses.gosenmon}/>).</li>
                        </ul>
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-intonation">
                    <AccordionTrigger className="text-2xl font-semibold bg-muted/50 px-4 rounded-t-lg"><Volume2 className="mr-4 text-primary"/>Интонация</AccordionTrigger>
                    <AccordionContent className="text-lg text-foreground/90 space-y-4 px-6 py-4 border border-t-0 rounded-b-lg">
                       <ul className="list-disc list-inside space-y-2">
                            <li><b>Повествовательное предложение:</b> Логическое ударение на именной части сказуемого, тон понижается на связке です.</li>
                            <li><b>Вопрос без вопросительного слова:</b> Тон повышается на сказуемом и частице か.</li>
                            <li><b>Вопрос с вопросительным словом:</b> Логическое ударение на вопросительном слове.</li>
                            <li><b>Альтернативный вопрос:</b> Каждая часть вопроса произносится с вопросительной интонацией.</li>
                        </ul>
                        <div className="mt-4 p-4 bg-muted/50 rounded-lg flex items-center gap-4">
                            <Volume2 className="w-8 h-8 text-primary"/>
                            <div>
                                <h4 className="font-semibold">Практика</h4>
                                <p className="text-sm">Попробуйте произнести примеры из урока вслух, следуя этим правилам интонации.</p>
                            </div>
                        </div>
                    </AccordionContent>
                </AccordionItem>
                 <AccordionItem value="item-writing">
                    <AccordionTrigger className="text-2xl font-semibold bg-muted/50 px-4 rounded-t-lg"><BookOpen className="mr-4 text-primary"/>Письменность</AccordionTrigger>
                    <AccordionContent className="text-lg text-foreground/90 space-y-4 px-6 py-4 border border-t-0 rounded-b-lg">
                        <Accordion type="single" collapsible>
                            <AccordionItem value="w-1">
                                <AccordionTrigger className="text-xl font-semibold">§1. Катакана</AccordionTrigger>
                                <AccordionContent className="text-lg text-foreground/90 space-y-4 px-2">
                                    <p>Катакана используется для написания заимствованных слов (гайрайго), иностранных имен, а также для выделения слов.</p>
                                    <KanaRowDisplay rowData={katakanaRows.a} />
                                    <KanaRowDisplay rowData={katakanaRows.ka} />
                                    <KanaRowDisplay rowData={katakanaRows.sa} />
                                    <KanaRowDisplay rowData={katakanaRows.na} />
                                    <KanaRowDisplay rowData={katakanaRows.ta} />
                                    <KanaRowDisplay rowData={katakanaRows.ha} />
                                    <p className="text-sm mt-2 text-muted-foreground">В заимстворованных словах долгота гласных передаётся знаком ー.</p>
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="w-2">
                                <AccordionTrigger className="text-xl font-semibold">§2. Иероглифы и правила написания</AccordionTrigger>
                                <AccordionContent className="text-lg text-foreground/90 space-y-4 px-2">
                                     <h4 className="font-bold text-xl mb-2">Правила написания:</h4>
                                    <ul className="list-decimal list-inside space-y-1 text-base">
                                        <li>Сверху вниз.</li>
                                        <li>Горизонтальные черты пишутся слева направо.</li>
                                        <li>Горизонтальные черты раньше вертикальных.</li>
                                        <li>Подчеркивающая черта пишется последней.</li>
                                        <li>Левая откидная черта раньше правой.</li>
                                        <li>Углы пишутся одной чертой.</li>
                                        <li>В замкнутых знаках сначала пишется внешняя часть, потом внутренняя, и в конце — нижняя замыкающая черта.</li>
                                    </ul>
                                    <h4 className="font-bold text-xl mt-4 mb-2">Новые иероглифы:</h4>
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
                        </Accordion>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
            
            <h2 className="text-3xl font-bold text-foreground mb-8 mt-12 text-center">📝 Закрепление</h2>
            <div className="w-full max-w-4xl space-y-8 mt-8">
                
                <ExerciseCard title="Упражнение 1: Интонация" canCheck={false} description="Прочтите вслух, обращая внимание на интонацию.">
                    <div className="space-y-4">
                        <InteractiveText analysis={grammarAnalyses.anokatawagakuseidesu} />
                        <InteractiveText analysis={grammarAnalyses.anokatawagakuseidehaarimasen} />
                        <InteractiveText analysis={grammarAnalyses.daregagakuseidesuka} />
                        <InteractiveText analysis={grammarAnalyses.anokatawagakuseidesuka} />
                        <InteractiveText analysis={grammarAnalyses.anokata_wa_sensei_desuka_gakusei_desuka} />
                    </div>
                </ExerciseCard>
                
                <ExerciseCard title="Упражнение 2: Отрицательная форма" onCheck={() => checkAll()} description="Скажите предложения в отрицательной форме и добавьте правильный вариант. Пример: あのひとは学生ではありません。先生です。">
                    <div className="space-y-4">
                        <div>
                            <Label>わたしは先生です。(学生)</Label>
                            <Input value={answers['ex2_1'] || ''} onChange={e => handleInputChange('ex2_1', e.target.value)} placeholder="Введите ответ..." className="font-japanese" />
                            {results['ex2_1'] === true && <CheckCircle className="text-green-500 inline-block ml-2"/>}
                            {results['ex2_1'] === false && <XCircle className="text-destructive inline-block ml-2"/>}
                        </div>
                         <div>
                            <Label>田中さんは医者です。(技師)</Label>
                            <Input value={answers['ex2_2'] || ''} onChange={e => handleInputChange('ex2_2', e.target.value)} placeholder="Введите ответ..." className="font-japanese"/>
                             {results['ex2_2'] === true && <CheckCircle className="text-green-500 inline-block ml-2"/>}
                            {results['ex2_2'] === false && <XCircle className="text-destructive inline-block ml-2"/>}
                        </div>
                         <div>
                            <Label>あのかたは学生です。(先生)</Label>
                            <Input value={answers['ex2_3'] || ''} onChange={e => handleInputChange('ex2_3', e.target.value)} placeholder="Введите ответ..." className="font-japanese"/>
                             {results['ex2_3'] === true && <CheckCircle className="text-green-500 inline-block ml-2"/>}
                            {results['ex2_3'] === false && <XCircle className="text-destructive inline-block ml-2"/>}
                        </div>
                         <div>
                            <Label>山田さんは先生です。(学生)</Label>
                            <Input value={answers['ex2_4'] || ''} onChange={e => handleInputChange('ex2_4', e.target.value)} placeholder="Введите ответ..." className="font-japanese"/>
                             {results['ex2_4'] === true && <CheckCircle className="text-green-500 inline-block ml-2"/>}
                            {results['ex2_4'] === false && <XCircle className="text-destructive inline-block ml-2"/>}
                        </div>
                    </div>
                </ExerciseCard>

                <ExerciseCard title="Упражнение 6: Вопросительные местоимения" onCheck={() => checkAll()} description="Заполните пропуски, вставив だれ, なに или なん.">
                     <div className="space-y-4">
                        <div>
                            <Label className="font-japanese text-lg">あのかたは（<b className="text-primary">?</b>）ですか。</Label>
                             <RadioGroup value={answers['ex6_1']} onValueChange={(val) => handleInputChange('ex6_1', val)} className="flex gap-4 mt-2">
                                <div className="flex items-center space-x-2"><RadioGroupItem value="だれ" id="q6-1-1" /><Label htmlFor="q6-1-1">だれ</Label></div>
                                <div className="flex items-center space-x-2"><RadioGroupItem value="なに" id="q6-1-2" /><Label htmlFor="q6-1-2">なに</Label></div>
                                <div className="flex items-center space-x-2"><RadioGroupItem value="なん" id="q6-1-3" /><Label htmlFor="q6-1-3">なん</Label></div>
                            </RadioGroup>
                            {results['ex6_1'] === false && <p className="text-destructive text-sm mt-1">Неверно.</p>}
                        </div>
                         <div>
                            <Label className="font-japanese text-lg">ご専門は（<b className="text-primary">?</b>）ですか。</Label>
                             <RadioGroup value={answers['ex6_2']} onValueChange={(val) => handleInputChange('ex6_2', val)} className="flex gap-4 mt-2">
                                <div className="flex items-center space-x-2"><RadioGroupItem value="だれ" id="q6-2-1" /><Label htmlFor="q6-2-1">だれ</Label></div>
                                <div className="flex items-center space-x-2"><RadioGroupItem value="なに" id="q6-2-2" /><Label htmlFor="q6-2-2">なに</Label></div>
                                <div className="flex items-center space-x-2"><RadioGroupItem value="なん" id="q6-2-3" /><Label htmlFor="q6-2-3">なん</Label></div>
                            </RadioGroup>
                             {results['ex6_2'] === false && <p className="text-destructive text-sm mt-1">Неверно.</p>}
                        </div>
                        <div>
                            <Label className="font-japanese text-lg">お名前は（<b className="text-primary">?</b>）ですか。</Label>
                             <RadioGroup value={answers['ex6_3']} onValueChange={(val) => handleInputChange('ex6_3', val)} className="flex gap-4 mt-2">
                                <div className="flex items-center space-x-2"><RadioGroupItem value="だれ" id="q6-3-1" /><Label htmlFor="q6-3-1">だれ</Label></div>
                                <div className="flex items-center space-x-2"><RadioGroupItem value="なに" id="q6-3-2" /><Label htmlFor="q6-3-2">なに</Label></div>
                                <div className="flex items-center space-x-2"><RadioGroupItem value="なん" id="q6-3-3" /><Label htmlFor="q6-3-3">なん</Label></div>
                            </RadioGroup>
                             {results['ex6_3'] === false && <p className="text-destructive text-sm mt-1">Неверно.</p>}
                        </div>
                        <div>
                            <Label className="font-japanese text-lg">（<b className="text-primary">?</b>）が学生ですか。</Label>
                             <RadioGroup value={answers['ex6_4']} onValueChange={(val) => handleInputChange('ex6_4', val)} className="flex gap-4 mt-2">
                                <div className="flex items-center space-x-2"><RadioGroupItem value="だれ" id="q6-4-1" /><Label htmlFor="q6-4-1">だれ</Label></div>
                                <div className="flex items-center space-x-2"><RadioGroupItem value="なに" id="q6-4-2" /><Label htmlFor="q6-4-2">なに</Label></div>
                                <div className="flex items-center space-x-2"><RadioGroupItem value="なん" id="q6-4-3" /><Label htmlFor="q6-4-3">なん</Label></div>
                            </RadioGroup>
                             {results['ex6_4'] === false && <p className="text-destructive text-sm mt-1">Неверно.</p>}
                        </div>
                         <div>
                            <Label className="font-japanese text-lg">これは（<b className="text-primary">?</b>）ですか。</Label>
                             <RadioGroup value={answers['ex6_5']} onValueChange={(val) => handleInputChange('ex6_5', val)} className="flex gap-4 mt-2">
                                <div className="flex items-center space-x-2"><RadioGroupItem value="だれ" id="q6-5-1" /><Label htmlFor="q6-5-1">だれ</Label></div>
                                <div className="flex items-center space-x-2"><RadioGroupItem value="なに" id="q6-5-2" /><Label htmlFor="q6-5-2">なに</Label></div>
                                <div className="flex items-center space-x-2"><RadioGroupItem value="なん" id="q6-5-3" /><Label htmlFor="q6-5-3">なん</Label></div>
                            </RadioGroup>
                             {results['ex6_5'] === false && <p className="text-destructive text-sm mt-1">Неверно.</p>}
                        </div>
                     </div>
                </ExerciseCard>
                
                <ExerciseCard title="Упражнение 7: Ответы на вопросы" description="Ответьте на вопросы, используя слово в скобках. Пример: だれが学生ですか。(田中) → 田中さんが学生です。">
                    <div className="space-y-4">
                        {Object.entries(correctAnswersEx7).map(([key, correctAnswer]) => {
                            const [questionText, name] = {
                                '1': ['だれが先生ですか。', '(山田)'],
                                '2': ['だれが医者ですか。', '(中山)'],
                                '3': ['だれが技師ですか。', '(山本)'],
                                '4': ['ご専門はなんですか。', '(文学)'],
                                '5': ['お名前はなんですか。', '(アンナ)'],
                            }[key]!;
                            const id = `ex7_${key}`;
                            return (
                                <div key={id}>
                                    <Label className="font-japanese">{questionText} {name}</Label>
                                    <Input value={answers[id] || ''} onChange={e => handleInputChange(id, e.target.value)} placeholder="Введите ответ..." className="font-japanese mt-1" />
                                    <Button size="sm" className="mt-2" onClick={() => checkAnswer(id, correctAnswer)}>Проверить</Button>
                                    {results[id] === true && <CheckCircle className="text-green-500 inline-block ml-2"/>} {results[id] === false && <XCircle className="text-destructive inline-block ml-2"/>}
                                </div>
                            );
                        })}
                    </div>
                </ExerciseCard>

                <ExerciseCard title="Упражнение 8: Перевод" description="Переведите предложения на японский язык.">
                     <div className="space-y-4">
                        <div>
                            <Label>(У вас) какая специальность? - Японский язык.</Label>
                            <Input value={answers['ex8_1'] || ''} onChange={e => handleInputChange('ex8_1', e.target.value)} className="font-japanese mt-1" />
                             <Button size="sm" className="mt-2" onClick={() => checkAnswer('ex8_1', 'ご専門はなんですか。日本語です。')}>Проверить</Button>
                            {results['ex8_1'] === true && <CheckCircle className="text-green-500 inline-block ml-2"/>} {results['ex8_1'] === false && <XCircle className="text-destructive inline-block ml-2"/>}
                        </div>
                         <div>
                            <Label>Он кто? - Он - Кашин.</Label>
                            <Input value={answers['ex8_2'] || ''} onChange={e => handleInputChange('ex8_2', e.target.value)} className="font-japanese mt-1" />
                            <Button size="sm" className="mt-2" onClick={() => checkAnswer('ex8_2', 'あのかたはだれですか。カシンさんです。')}>Проверить</Button>
                            {results['ex8_2'] === true && <CheckCircle className="text-green-500 inline-block ml-2"/>} {results['ex8_2'] === false && <XCircle className="text-destructive inline-block ml-2"/>}
                        </div>
                     </div>
                </ExerciseCard>
                
                <ExerciseCard title="Упражнение 9 и 10: Вопросы по ситуации" canCheck={false} description="Задайте вопросы к текстовым описаниям ситуаций.">
                    <div className="space-y-4">
                        <p><b>Ситуация 1:</b> Вы видите человека, который является студентом.</p>
                        <p><b>Ваш вопрос (Упр. 9):</b> あのかたはだれですか。</p>
                        <p><b>Ваш вопрос (Упр. 10):</b> あのかたは学生ですか、先生ですか。</p>
                        <hr/>
                        <p><b>Ситуация 2:</b> Вы видите человека, который является инженером (技師).</p>
                        <p><b>Ваш вопрос (Упр. 9):</b> あのかたはだれですか。</p>
                        <p><b>Ваш вопрос (Упр. 10):</b> あのかたは医者ですか、技師ですか。</p>
                    </div>
                </ExerciseCard>

                <ExerciseCard title="Упражнение 11: Альтернативные вопросы" description="Дополните предложения, превратив их в альтернативные вопросы.">
                    <div className="space-y-4">
                        {Object.entries(correctAnswersEx11).map(([key, correctAnswer]) => {
                             const questionText = {
                                '1': 'わたしは医者です。',
                                '2': '田中さんは技師です。',
                                '3': 'ご専門は文学です。',
                                '4': '山田さんは先生です。',
                            }[key]!;
                             const id = `ex11_${key}`;
                             return (
                                <div key={id}>
                                    <Label className="font-japanese">{questionText}</Label>
                                    <Input value={answers[id] || ''} onChange={e => handleInputChange(id, e.target.value)} className="font-japanese mt-1" placeholder="Введите полный вопрос..."/>
                                    <Button size="sm" className="mt-2" onClick={() => checkAnswer(id, correctAnswer)}>Проверить</Button>
                                    {results[id] === true && <CheckCircle className="text-green-500 inline-block ml-2"/>} {results[id] === false && <XCircle className="text-destructive inline-block ml-2"/>}
                                </div>
                             )
                        })}
                    </div>
                </ExerciseCard>

                <ExerciseCard title="Упражнение 12: Перевод" description="Переведите предложения на японский язык.">
                    <div className="space-y-4">
                        <div>
                            <Label>Он студент или преподаватель?</Label>
                            <Input value={answers['ex12_1'] || ''} onChange={e => handleInputChange('ex12_1', e.target.value)} className="font-japanese mt-1"/>
                            <Button size="sm" className="mt-2" onClick={() => checkAnswer('ex12_1', 'あのかたは学生ですか、先生ですか。')}>Проверить</Button>
                            {results['ex12_1'] === true && <CheckCircle className="text-green-500 inline-block ml-2"/>} {results['ex12_1'] === false && <XCircle className="text-destructive inline-block ml-2"/>}
                        </div>
                         <div>
                            <Label>Кашин - врач или инженер?</Label>
                            <Input value={answers['ex12_2'] || ''} onChange={e => handleInputChange('ex12_2', e.target.value)} className="font-japanese mt-1"/>
                            <Button size="sm" className="mt-2" onClick={() => checkAnswer('ex12_2', 'カシンさんは医者ですか、技師ですか。')}>Проверить</Button>
                            {results['ex12_2'] === true && <CheckCircle className="text-green-500 inline-block ml-2"/>} {results['ex12_2'] === false && <XCircle className="text-destructive inline-block ml-2"/>}
                        </div>
                    </div>
                </ExerciseCard>

                 <ExerciseCard title="Упражнение 13: Частицы и связки" onCheck={() => checkAll()} description="Заполните пропуски соответствующими словами или грамматическими показателями.">
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 flex-wrap">
                            <label htmlFor="ex13-1" className="font-japanese text-lg">あのかた</label>
                            <Input id="ex13_1" value={answers['ex13_1'] || ''} onChange={e => handleInputChange('ex13_1', e.target.value)} className="w-20 inline-block font-japanese" />
                             <label className="font-japanese text-lg">学生です。</label>
                             {results['ex13_1'] === false && <XCircle className="text-destructive"/>}
                        </div>
                         <div className="flex items-center gap-2 flex-wrap">
                            <label htmlFor="ex13-2" className="font-japanese text-lg">だれ</label>
                            <Input id="ex13_2" value={answers['ex13_2'] || ''} onChange={e => handleInputChange('ex13_2', e.target.value)} className="w-20 inline-block font-japanese" />
                             <label className="font-japanese text-lg">先生ですか。</label>
                             {results['ex13_2'] === false && <XCircle className="text-destructive"/>}
                        </div>
                         <div className="flex items-center gap-2 flex-wrap">
                            <label htmlFor="ex13-3" className="font-japanese text-lg">わたし</label>
                            <Input id="ex13_3" value={answers['ex13_3'] || ''} onChange={e => handleInputChange('ex13_3', e.target.value)} className="w-20 inline-block font-japanese" />
                             <label className="font-japanese text-lg">医者ではありません。</label>
                             {results['ex13_3'] === false && <XCircle className="text-destructive"/>}
                        </div>
                         <div className="flex items-center gap-2 flex-wrap">
                            <label htmlFor="ex13-4" className="font-japanese text-lg">田中さん</label>
                            <Input id="ex13_4" value={answers['ex13_4'] || ''} onChange={e => handleInputChange('ex13_4', e.target.value)} className="w-20 inline-block font-japanese" />
                             <label className="font-japanese text-lg">技師ですか。</label>
                             {results['ex13_4'] === false && <XCircle className="text-destructive"/>}
                        </div>
                         <div className="flex items-center gap-2 flex-wrap">
                            <label htmlFor="ex13-5" className="font-japanese text-lg">ご専門</label>
                            <Input id="ex13_5" value={answers['ex13_5'] || ''} onChange={e => handleInputChange('ex13_5', e.target.value)} className="w-20 inline-block font-japanese" />
                             <label className="font-japanese text-lg">なんですか。</label>
                             {results['ex13_5'] === false && <XCircle className="text-destructive"/>}
                        </div>
                        <div className="flex items-center gap-2 flex-wrap">
                            <label htmlFor="ex13-6" className="font-japanese text-lg">お名前</label>
                            <Input id="ex13_6" value={answers['ex13_6'] || ''} onChange={e => handleInputChange('ex13_6', e.target.value)} className="w-20 inline-block font-japanese" />
                             <label className="font-japanese text-lg">なんですか。</label>
                             {results['ex13_6'] === false && <XCircle className="text-destructive"/>}
                        </div>
                        <div className="flex items-center gap-2 flex-wrap">
                            <label className="font-japanese text-lg">あのかたは学生</label>
                            <Input id="ex13_7a" value={answers['ex13_7a'] || ''} onChange={e => handleInputChange('ex13_7a', e.target.value)} className="w-24 inline-block font-japanese" />
                             <label className="font-japanese text-lg">、先生</label>
                             <Input id="ex13_7b" value={answers['ex13_7b'] || ''} onChange={e => handleInputChange('ex13_7b', e.target.value)} className="w-24 inline-block font-japanese" />
                             <label className="font-japanese text-lg">。</label>
                              {results['ex13_7a'] === false && <XCircle className="text-destructive"/>}
                              {results['ex13_7b'] === false && <XCircle className="text-destructive"/>}
                        </div>
                        <div className="flex items-center gap-2 flex-wrap">
                            <Input id="ex13_8" value={answers['ex13_8'] || ''} onChange={e => handleInputChange('ex13_8', e.target.value)} className="w-24 inline-block font-japanese" />
                             <label className="font-japanese text-lg">、学生です。</label>
                             {results['ex13_8'] === false && <XCircle className="text-destructive"/>}
                        </div>
                    </div>
                 </ExerciseCard>
                
                 <ExerciseCard title="Упражнение 14: Составьте вопросы" description="Придумайте вопросы, ответами на которые будут служить данные предложения.">
                    <div className="space-y-4">
                       <div>
                           <Label>Ответ: 田中さんが学生です。</Label>
                           <Input placeholder="Ваш вопрос..." value={answers['ex14_1'] || ''} onChange={(e) => handleInputChange('ex14_1', e.target.value)} className="font-japanese mt-1" />
                           <Button size="sm" className="mt-2" onClick={() => checkAnswer('ex14_1', 'だれが学生ですか。')}>Проверить</Button>
                            {results['ex14_1'] === true && <CheckCircle className="text-green-500 inline-block ml-2"/>} {results['ex14_1'] === false && <XCircle className="text-destructive inline-block ml-2"/>}
                       </div>
                        <div>
                           <Label>Ответ: ご専門は文学です。</Label>
                           <Input placeholder="Ваш вопрос..." value={answers['ex14_2'] || ''} onChange={(e) => handleInputChange('ex14_2', e.target.value)} className="font-japanese mt-1" />
                           <Button size="sm" className="mt-2" onClick={() => checkAnswer('ex14_2', 'ご専門はなんですか。')}>Проверить</Button>
                           {results['ex14_2'] === true && <CheckCircle className="text-green-500 inline-block ml-2"/>} {results['ex14_2'] === false && <XCircle className="text-destructive inline-block ml-2"/>}
                       </div>
                        <div>
                           <Label>Ответ: はい、先生です。</Label>
                           <Input placeholder="Ваш вопрос..." value={answers['ex14_3'] || ''} onChange={(e) => handleInputChange('ex14_3', e.target.value)} className="font-japanese mt-1" />
                           <Button size="sm" className="mt-2" onClick={() => checkAnswer('ex14_3', 'あなたは先生ですか。')}>Проверить</Button>
                           {results['ex14_3'] === true && <CheckCircle className="text-green-500 inline-block ml-2"/>} {results['ex14_3'] === false && <XCircle className="text-destructive inline-block ml-2"/>}
                       </div>
                    </div>
                 </ExerciseCard>

                <ExerciseCard title="Упражнение 15: Составьте предложения" description="Используйте все слова и частицы, чтобы составить грамматически верные предложения.">
                     <div className="space-y-4">
                       <div>
                           <Label>Слова: あのかた、は、学生、です</Label>
                           <Input placeholder="Составьте предложение..." value={answers['ex15_1'] || ''} onChange={(e) => handleInputChange('ex15_1', e.target.value)} className="font-japanese mt-1" />
                           <Button size="sm" className="mt-2" onClick={() => checkAnswer('ex15_1', 'あのかたは学生です。')}>Проверить</Button>
                           {results['ex15_1'] === true && <CheckCircle className="text-green-500 inline-block ml-2"/>} {results['ex15_1'] === false && <XCircle className="text-destructive inline-block ml-2"/>}
                       </div>
                         <div>
                           <Label>Слова: だれ、が、先生、ですか</Label>
                           <Input placeholder="Составьте предложение..." value={answers['ex15_2'] || ''} onChange={(e) => handleInputChange('ex15_2', e.target.value)} className="font-japanese mt-1" />
                           <Button size="sm" className="mt-2" onClick={() => checkAnswer('ex15_2', 'だれが先生ですか。')}>Проверить</Button>
                           {results['ex15_2'] === true && <CheckCircle className="text-green-500 inline-block ml-2"/>} {results['ex15_2'] === false && <XCircle className="text-destructive inline-block ml-2"/>}
                       </div>
                    </div>
                </ExerciseCard>

                <ExerciseCard title="Упражнение 16: Ответьте на вопросы" canCheck={false} description="Это упражнение для самостоятельной практики. Попробуйте ответить на вопросы устно или письменно.">
                    <ul className="list-disc list-inside space-y-2 font-japanese text-lg">
                        <li>あなたは学生ですか。</li>
                        <li>ご専門はなんですか。</li>
                        <li>お名前はなんですか。</li>
                        <li>あのかたはだれですか。</li>
                        <li>先生のお名前はなんですか。</li>
                    </ul>
                </ExerciseCard>

                <ExerciseCard title="Упражнение 17: Перевод диалогов" description="Переведите диалоги на японский язык.">
                     <div className="space-y-6">
                        <div>
                            <p className="font-semibold">Диалог 1:</p>
                            <p>- Вы - студентка? - Да, студентка.</p>
                            <p>- Какая у вас специальность? - Японский язык.</p>
                            <Input placeholder="Введите перевод..." value={answers['ex17_1'] || ''} onChange={(e) => handleInputChange('ex17_1', e.target.value)} className="font-japanese mt-1" />
                            <Button size="sm" className="mt-2" onClick={() => checkAnswer('ex17_1', 'あなたは学生ですか。はい、学生です。ご専門はなんですか。日本語です。')}>Проверить</Button>
                            {results['ex17_1'] === true && <CheckCircle className="text-green-500 inline-block ml-2"/>} {results['ex17_1'] === false && <XCircle className="text-destructive inline-block ml-2"/>}
                        </div>
                         <div>
                            <p className="font-semibold">Диалог 2:</p>
                            <p>- Извините, вы - Анна? - Да, Анна.</p>
                             <Input placeholder="Введите перевод..." value={answers['ex17_2'] || ''} onChange={(e) => handleInputChange('ex17_2', e.target.value)} className="font-japanese mt-1" />
                            <Button size="sm" className="mt-2" onClick={() => checkAnswer('ex17_2', 'すみません、アンナさんですか。はい、アンナです。')}>Проверить</Button>
                             {results['ex17_2'] === true && <CheckCircle className="text-green-500 inline-block ml-2"/>} {results['ex17_2'] === false && <XCircle className="text-destructive inline-block ml-2"/>}
                        </div>
                    </div>
                </ExerciseCard>

                 <ExerciseCard title="Упражнение 18: Диалог" canCheck={false} description="Прочитайте и разберите диалог. Попробуйте воспроизвести его с партнером.">
                     <div className="space-y-2">
                        <p className="font-japanese text-lg">А: <InteractiveText analysis={dialogueAnalyses.hajimemashite} /> <InteractiveText analysis={dialogueAnalyses.tanaka_yoroshiku} /></p>
                        <p className="font-japanese text-lg">Б: <InteractiveText analysis={dialogueAnalyses.anna_hajimemashite} /></p>
                        <p className="font-japanese text-lg">А: <InteractiveText analysis={dialogueAnalyses.tanaka_kochira_koso} /> <InteractiveText analysis={grammarAnalyses.anokatawagakuseidesuka} /></p>
                        <p className="font-japanese text-lg">Б: <InteractiveText analysis={grammarAnalyses.hai_soudesu} /> <InteractiveText analysis={grammarAnalyses.sorewanandesuka} /></p>
                     </div>
                 </ExerciseCard>


                 <Card>
                    <CardHeader>
                        <CardTitle>Остальные упражнения (19-29) находятся в разработке</CardTitle>
                        <CardDescription>Они будут добавлены в следующем обновлении. Спасибо за терпение!</CardDescription>
                    </CardHeader>
                </Card>

                <div className="mt-8 flex justify-center">
                    <Button size="lg" onClick={checkAll}><Repeat className="mr-2"/>Проверить все задания</Button>
                </div>
            </div>

            <div className="mt-12 text-center flex flex-col items-center gap-4">
                <Button size="lg" asChild className="btn-gradient w-full max-w-xs">
                    <Link href="/grammar/lesson-2">Перейти к Уроку 2 →</Link>
                </Button>
            </div>
        </div>
    </div>
  );
}

    
