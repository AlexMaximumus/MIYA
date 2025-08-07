
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, CheckCircle, XCircle, Share2, Volume2, Check, X } from 'lucide-react';
import Link from 'next/link';
import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import InteractiveText from '@/components/interactive-text';
import { phoneticsAnalyses } from '@/ai/precomputed-analysis';
import * as wanakana from 'wanakana';

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

const ExerciseCard = ({ title, description, children, result, onCheck, canCheck = true }: { title: string; description?: React.ReactNode; children: React.ReactNode; result?: boolean | null; onCheck?: () => void; canCheck?: boolean }) => (
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

const ReadingExercise = ({ words }: { words: string[] }) => (
    <div className="flex flex-wrap gap-2">
        {words.map(word => (
            <InteractiveText key={word} analysis={phoneticsAnalyses[word as keyof typeof phoneticsAnalyses] || { sentence: [{ word, furigana: '...', translation: '...', partOfSpeech: '...' }], fullTranslation: '...' }} />
        ))}
    </div>
);

const WritingExercise = ({ words, exerciseId, answers, onInputChange, onCheck, results, toRomaji = false }: { words: string[], exerciseId: string, answers: Record<string, any>, onInputChange: (id: string, value: string) => void, onCheck: (id: string, correctAnswer: string) => void, results: Record<string, boolean|null>, toRomaji?: boolean }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {words.map(word => {
                const id = `${exerciseId}-${word}`;
                const correctAnswer = toRomaji ? word : wanakana.toHiragana(word);
                return (
                    <div key={id}>
                        <Label>{word.toUpperCase()}</Label>
                        <div className="flex items-center gap-2 mt-1">
                            <Input
                                value={answers[id] || ''}
                                onChange={e => onInputChange(id, e.target.value)}
                                className={cn(
                                    "font-japanese",
                                    results[id] === true && 'border-green-500',
                                    results[id] === false && 'border-destructive'
                                )}
                            />
                            <Button size="sm" variant="outline" onClick={() => onCheck(id, correctAnswer)}>
                                {results[id] === true ? <Check className="text-green-500" /> : results[id] === false ? <X className="text-destructive" /> : <Check />}
                            </Button>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};


export default function PhoneticsLesson1Page() {
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

    useEffect(() => {
        try {
            const storedAnswers = localStorage.getItem(`${LESSON_ID}-answers`);
            if (storedAnswers) setAnswers(JSON.parse(storedAnswers));
        } catch (error) {
            console.error("Failed to parse from localStorage", error);
        }
    }, []);

    const handleInputChange = (id: string, value: string) => {
        setAnswers(prev => ({ ...prev, [id]: value }));
        setResults(prev => ({ ...prev, [id]: null })); // Reset result on change
        localStorage.setItem(`${LESSON_ID}-answers`, JSON.stringify({ ...answers, [id]: value }));
    };

    const checkAnswer = (id: string, correctAnswer: string) => {
        const userAnswer = (answers[id] || '').trim().toLowerCase();
        const isCorrect = userAnswer === correctAnswer;
        setResults(prev => ({ ...prev, [id]: isCorrect }));
    };

    const exercise1Words = ['ai', 'aigo', 'igai', 'eigakukai', 'ikai', 'ikei', 'ikioi', 'ukai', 'ukurai', 'ukei', 'egui', 'eii', 'okugai', 'kagai', 'kaiyaku', 'kakei', 'keiai', 'keiei', 'kiei', 'kigai', 'gikei', 'guai'];
    const exercise3Words = ['igo:', 'eigo:', 'eiko:', 'e:ka:', 'o:', 'o:i', 'o:gi', 'o:goe', 'o:guke', 'o:ka', 'o:koku', 'o:ko:', 'o:ko', 'o:u', 'ka:', 'kagu:', 'kago:', 'kaigo:', 'ki:', 'kiko:', 'ko:eki', 'ko:gaku', 'ko:gi', 'ko:go:', 'ko:gu:', 'ko:ko:', 'ko:ku:', 'ku:geki', 'go:kei', 'gu:', 'gu:gu:'];
    const exercise7Words = ['aigi', 'agaku', 'akagi', 'akogi', 'age', 'ago', 'igi', 'igigaku', 'igo', 'igaku', 'ugai', 'ugoki', 'uigo', 'eiga', 'egaku', 'ogi', 'okage', 'okugi', 'okugaki', 'kagaku', 'kage', 'kago', 'kaiga', 'kaigi', 'keigai', 'kiga', 'koage', 'kokugi', 'kokugo', 'kugai', 'kuge', 'kugi', 'geigeki', 'giga', 'gogaku'];
    const exercise9aWords = ['ago', 'age', 'aiko', 'aiiku', 'aikoku', 'i', 'iku', 'ikei', 'iko:', 'ue', 'ueki', 'uku', 'e', 'eigo', 'eiko:', 'oi', 'o:iki', 'o:koku', 'ou', 'kae', 'kago:', 'kaigo:', 'kaiiki', 'kakigaku', 'kaki', 'kakioki', 'kakikake', 'kakoku', 'kakou', 'kaku', 'kakugo', 'ki', 'kiai', 'kiake', 'kigae', 'kigo:', 'kigu:', 'kikei', 'kikigaki', 'kiko:', 'kikoku', 'kikoe', 'kiku', 'kiuke', 'ku:geki', 'kuikake', 'kukei', 'kukaku', 'ku:ko:', 'ke', 'geka', 'keiei', 'keigaika', 'keigo:', 'keikai', 'keikaku', 'keiko', 'keikoku', 'ko', 'ko:eki', 'ko:gai', 'ko:gaku', 'ko:gei', 'ko:go:', 'kogoe', 'ko:gu:', 'ko:kei', 'koko:', 'koko', 'ko:koku', 'ko:ku:'];
    const exercise9bWords = ['ai', 'aki', 'igi', 'iki', 'ika', 'uka', 'ukai', 'uki', 'eigai', 'eii', 'eki', 'ogi', 'o:ka', 'o:kiku', 'o:ku', 'kagai', 'kagaku', 'kage', 'kageki', 'kago', 'kagu', 'kai', 'kaiga', 'kaigi', 'kaii', 'kaki', 'kaku', 'kakueki', 'kakugi', 'kakui', 'kiga', 'kigi', 'kigu', 'ku', 'kueki', 'kugai', 'kugaku', 'ku:ki', 'kego', 'kei', 'keigu', 'keika', 'keiki', 'ko:', 'koe', 'koga', 'kogaku', 'ko:gai', 'ko:gi', 'ko:i', 'koi', 'ko:ka', 'ko:ki', 'go', 'gogo'];
    const exercise9cWords = [
        'aegu', 'ie', 'ike', 'ugoku', 'uke', 'okugai', 'o:u', 'kagi', 'kikai', 'kikeigaku', 'kiki', 'kiku', 'kugikai', 'kuku', 'kega', 'ko:gi', 'koge', 'koke', 'koku:',
        'ikiiki', 'ukeau', 'ekaki', 'ekikaki', 'o:goe', 'oioi', 'kuike', 'keieigaku', 'keikaiki', 'keikogi', 'keiku', 'ko:ko:gai', 'kokuo:',
        'eigakukai', 'okugaki', 'ko:gekiki',
        'keiko:ku:ki'
    ];
    const exercise12Words = ['agaku', 'ageku', 'ago', 'ai', 'aika', 'aikoku', 'akagi', 'akugi', 'aki', 'igui', 'igo', 'iiai', 'ii', 'ikoku', 'ukeau', 'uki', 'egao', 'eigaka', 'eigo', 'eiki', 'eki', 'oga', 'oku', 'kae', 'kagai', 'keiki', 'keikaku', 'kikai', 'kika', 'kogu', 'ko:go', 'ku:ki', 'ku:ko:', 'gaika', 'gekika', 'gikai', 'gokai', 'goki', 'gu:i', 'guko:', 'guai'];


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
                    <ExerciseCard title="Упражнение 1 и 3" description="Прочтите вслух слова, обращая внимание на произношение дифтонгов и долгого [э:].">
                        <ReadingExercise words={[...exercise1Words, ...exercise3Words]} />
                    </ExerciseCard>

                    <ExerciseCard title="Упражнение 2" description="Напишите слова из упражнения 1 хираганой.">
                        <WritingExercise words={exercise1Words} exerciseId="ex2" answers={answers} onInputChange={handleInputChange} onCheck={checkAnswer} results={results} />
                    </ExerciseCard>
                    
                    <ExerciseCard title="Упражнение 4, 5, 6" description="Эти упражнения объединены с 1-3, так как касаются той же темы долготы гласных. Продолжайте практиковать чтение и написание.">
                        <p className="text-sm text-muted-foreground">Обращайтесь к предыдущим упражнениям для практики.</p>
                    </ExerciseCard>

                     <ExerciseCard title="Упражнение 7" description="Прочтите вслух слова, обращая внимание на произношение [г] в середине слова.">
                        <ReadingExercise words={exercise7Words} />
                    </ExerciseCard>
                    
                    <ExerciseCard title="Упражнение 8" description="Напишите слова из упражнения 7 хираганой.">
                         <WritingExercise words={exercise7Words} exerciseId="ex8" answers={answers} onInputChange={handleInputChange} onCheck={checkAnswer} results={results} />
                    </ExerciseCard>
                    
                    <ExerciseCard title="Упражнение 9" description="Отработайте чтение слов с различными видами тонизации.">
                        <h4 className="font-semibold text-lg mb-2">а) восходящей:</h4>
                        <ReadingExercise words={exercise9aWords} />
                        <h4 className="font-semibold text-lg mt-4 mb-2">б) нисходящей:</h4>
                        <ReadingExercise words={exercise9bWords} />
                        <h4 className="font-semibold text-lg mt-4 mb-2">в) нисходяще-восходящей:</h4>
                        <ReadingExercise words={exercise9cWords} />
                    </ExerciseCard>

                     <ExerciseCard title="Упражнение 10" description="Напишите слова из упражнения 9 хираганой.">
                        <p className="text-sm text-muted-foreground mb-4">Напишите несколько слов для практики.</p>
                        <WritingExercise words={['aiko', 'kaki', 'kikai', 'kage', 'gogo']} exerciseId="ex10" answers={answers} onInputChange={handleInputChange} onCheck={checkAnswer} results={results} />
                    </ExerciseCard>

                    <ExerciseCard title="Упражнение 11" description="Напишите подчёркнутые слова из упражнения 9 латиницей.">
                        <p className="text-sm text-muted-foreground mb-4">Примеры для проверки: えいご (eigo), かいぎ (kaigi), きかい (kikai).</p>
                        <WritingExercise words={['eigo', 'kaigi', 'kikai']} exerciseId="ex11" answers={answers} onInputChange={handleInputChange} onCheck={checkAnswer} results={results} toRomaji />
                    </ExerciseCard>
                    
                    <ExerciseCard title="Упражнение 12" description="Прочтите следующие слова, записанные латиницей.">
                         <ReadingExercise words={exercise12Words} />
                    </ExerciseCard>

                    <ExerciseCard title="Упражнение 13" description="Напишите слова из упражнения 12 хираганой.">
                        <WritingExercise words={exercise12Words} exerciseId="ex13" answers={answers} onInputChange={handleInputChange} onCheck={checkAnswer} results={results} />
                    </ExerciseCard>

                    <ExerciseCard title="Упражнение 14" description="Прочтите следующие слова (самостоятельная практика).">
                        <div className="flex flex-wrap gap-2">
                           <InteractiveText analysis={{sentence: [{word: "映画界", furigana: "えいがかい", translation: "мир кино", partOfSpeech: "существительное"}], fullTranslation: "мир кино"}}/>
                           <InteractiveText analysis={{sentence: [{word: "記憶", furigana: "きおく", translation: "память", partOfSpeech: "существительное"}], fullTranslation: "память"}}/>
                           <InteractiveText analysis={{sentence: [{word: "空位", furigana: "くうい", translation: "вакансия", partOfSpeech: "существительное"}], fullTranslation: "вакансия"}}/>
                           <InteractiveText analysis={{sentence: [{word: "外交", furigana: "がいこう", translation: "дипломатия", partOfSpeech: "существительное"}], fullTranslation: "дипломатия"}}/>
                        </div>
                    </ExerciseCard>
                </div>
                <div className="mt-12 text-center flex flex-col sm:flex-row justify-center items-center gap-4">
                    <Button size="lg" asChild className="btn-gradient">
                        <Link href="/phonetics/lesson-2">Перейти к Уроку 2 →</Link>
                    </Button>
                </div>
            </div>
        </div>
    );
}
