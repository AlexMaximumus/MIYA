
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, Share2, Volume2, BookOpen, CheckCircle, XCircle, Lightbulb, Check, HelpCircle } from 'lucide-react';
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
        <CardFooter className="flex flex-col items-start gap-4">
            {onCheck && canCheck && <Button onClick={onCheck}>Проверить</Button>}
            {result === true && <span className="flex items-center gap-2 text-green-600"><CheckCircle/> Верно!</span>}
            {result === false && <span className="flex items-center gap-2 text-destructive"><XCircle/> Ошибка. Попробуйте снова.</span>}
        </CardFooter>
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
    };

    const checkAnswer = (id: string, correctAnswer: string) => {
        const userAnswer = (answers[id] || '').trim().replace(/。/g, '');
        const isCorrect = userAnswer === correctAnswer.replace(/。/g, '');
        setResults(prev => ({ ...prev, [id]: isCorrect }));
    };

    const checkMultiple = (idPrefix: string, correctAnswers: Record<string, string>) => {
        const newResults: Record<string, boolean> = {};
        let allCorrect = true;
        for (const key in correctAnswers) {
            const fullId = `${idPrefix}_${key}`;
            const isCorrect = (answers[fullId] || '').trim().replace(/。/g, '') === correctAnswers[key].replace(/。/g, '');
            newResults[fullId] = isCorrect;
            if (!isCorrect) allCorrect = false;
        }
        setResults(prev => ({ ...prev, ...newResults, [idPrefix]: allCorrect }));
    };

    const correctAnswersEx2 = {
        '1': 'わたしは先生ではありません。学生です。',
        '2': '田中さんは医者ではありません。技師です。',
        '3': 'あのかたは学生ではありません。先生です。',
        '4': '山田さんは先生ではありません。学生です。'
    };
    
    const correctAnswersEx6 = {
        '1': 'だれ',
        '2': 'なん',
        '3': 'なん',
        '4': 'だれ',
        '5': 'なに'
    };

     const correctAnswersEx13 = {
        '1': 'は', '2': 'が', '3': 'は', '4': 'は', '5': 'は', '6': 'は', '7a': 'です', '7b': 'か', '8': 'はい'
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
                    <CardTitle className="text-2xl md:text-3xl">Части речи и грамматические основы</CardTitle>
                    <CardDescription>Прогресс по теме (упражнения будут в следующем обновлении):</CardDescription>
                    <Progress value={progress} className="mt-2" />
                </CardHeader>
            </Card>

            <h2 className="text-3xl font-bold text-foreground mb-6 text-center">🧠 Теория</h2>
             <Accordion type="multiple" className="w-full max-w-4xl mb-12 space-y-4" defaultValue={['item-grammar']}>
                <AccordionItem value="item-grammar">
                    <AccordionTrigger className="text-2xl font-semibold bg-muted/50 px-4 rounded-t-lg"><BookOpen className="mr-4 text-primary"/>Грамматика</AccordionTrigger>
                    <AccordionContent className="text-lg text-foreground/90 space-y-4 px-2 border border-t-0 rounded-b-lg">
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
                                    <p>У существительных нет рода и числа. Они изменяются по 11 падежам с помощью суффиксов. Основной падеж (бессуффиксальный) употребляется в нескольких случаях:</p>
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
                     <AccordionContent className="text-lg text-foreground/90 space-y-4 px-2 border border-t-0 rounded-b-lg">
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
                    <AccordionContent className="text-lg text-foreground/90 space-y-4 px-2 border border-t-0 rounded-b-lg">
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
                    <AccordionContent className="text-lg text-foreground/90 space-y-4 px-2 border border-t-0 rounded-b-lg">
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
                
                <ExerciseCard title="Упражнение 2: Отрицательная форма" onCheck={() => checkMultiple('ex2', correctAnswersEx2)} result={results['ex2']} description="Скажите предложения в отрицательной форме и добавьте правильный вариант. Пример: あのひとは学生ではありません。先生です。">
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

                <ExerciseCard title="Упражнение 6: Вопросительные местоимения" onCheck={() => checkMultiple('ex6', correctAnswersEx6)} result={results['ex6']} description="Заполните пропуски, вставив だれ, なに или なん.">
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
                
                 <ExerciseCard title="Упражнение 13: Частицы и связки" onCheck={() => checkMultiple('ex13', correctAnswersEx13)} result={results['ex13']} description="Заполните пропуски соответствующими словами или грамматическими показателями.">
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 flex-wrap">
                            <label htmlFor="ex13-1" className="font-japanese text-lg">あのかた</label>
                            <Input id="ex13-1" value={answers['ex13_1'] || ''} onChange={e => handleInputChange('ex13_1', e.target.value)} className="w-20 inline-block font-japanese" />
                             <label className="font-japanese text-lg">学生です。</label>
                             {results['ex13_1'] === false && <XCircle className="text-destructive"/>}
                        </div>
                         <div className="flex items-center gap-2 flex-wrap">
                            <label htmlFor="ex13-2" className="font-japanese text-lg">だれ</label>
                            <Input id="ex13-2" value={answers['ex13_2'] || ''} onChange={e => handleInputChange('ex13_2', e.target.value)} className="w-20 inline-block font-japanese" />
                             <label className="font-japanese text-lg">先生ですか。</label>
                             {results['ex13_2'] === false && <XCircle className="text-destructive"/>}
                        </div>
                         <div className="flex items-center gap-2 flex-wrap">
                            <label htmlFor="ex13-3" className="font-japanese text-lg">わたし</label>
                            <Input id="ex13-3" value={answers['ex13_3'] || ''} onChange={e => handleInputChange('ex13_3', e.target.value)} className="w-20 inline-block font-japanese" />
                             <label className="font-japanese text-lg">医者ではありません。</label>
                             {results['ex13_3'] === false && <XCircle className="text-destructive"/>}
                        </div>
                         <div className="flex items-center gap-2 flex-wrap">
                            <label htmlFor="ex13-4" className="font-japanese text-lg">田中さん</label>
                            <Input id="ex13-4" value={answers['ex13_4'] || ''} onChange={e => handleInputChange('ex13_4', e.target.value)} className="w-20 inline-block font-japanese" />
                             <label className="font-japanese text-lg">技師ですか。</label>
                             {results['ex13_4'] === false && <XCircle className="text-destructive"/>}
                        </div>
                         <div className="flex items-center gap-2 flex-wrap">
                            <label htmlFor="ex13-5" className="font-japanese text-lg">ご専門</label>
                            <Input id="ex13-5" value={answers['ex13_5'] || ''} onChange={e => handleInputChange('ex13_5', e.target.value)} className="w-20 inline-block font-japanese" />
                             <label className="font-japanese text-lg">なんですか。</label>
                             {results['ex13_5'] === false && <XCircle className="text-destructive"/>}
                        </div>
                        <div className="flex items-center gap-2 flex-wrap">
                            <label htmlFor="ex13-6" className="font-japanese text-lg">お名前</label>
                            <Input id="ex13-6" value={answers['ex13_6'] || ''} onChange={e => handleInputChange('ex13_6', e.target.value)} className="w-20 inline-block font-japanese" />
                             <label className="font-japanese text-lg">なんですか。</label>
                             {results['ex13_6'] === false && <XCircle className="text-destructive"/>}
                        </div>
                        <div className="flex items-center gap-2 flex-wrap">
                            <label className="font-japanese text-lg">あのかたは学生</label>
                            <Input value={answers['ex13_7a'] || ''} onChange={e => handleInputChange('ex13_7a', e.target.value)} className="w-20 inline-block font-japanese" />
                             <label className="font-japanese text-lg">、先生</label>
                             <Input value={answers['ex13_7b'] || ''} onChange={e => handleInputChange('ex13_7b', e.target.value)} className="w-20 inline-block font-japanese" />
                             <label className="font-japanese text-lg">。</label>
                              {results['ex13_7a'] === false && <XCircle className="text-destructive"/>}
                              {results['ex13_7b'] === false && <XCircle className="text-destructive"/>}
                        </div>
                        <div className="flex items-center gap-2 flex-wrap">
                            <Input value={answers['ex13_8'] || ''} onChange={e => handleInputChange('ex13_8', e.target.value)} className="w-24 inline-block font-japanese" />
                             <label className="font-japanese text-lg">、学生です。</label>
                             {results['ex13_8'] === false && <XCircle className="text-destructive"/>}
                        </div>
                    </div>
                 </ExerciseCard>

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

    