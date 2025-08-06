
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, Share2, Volume2, BookOpen } from 'lucide-react';
import Link from 'next/link';
import InteractiveText from '@/components/interactive-text';
import InteractiveFormula from '@/components/interactive-formula';
import { grammarAnalyses, dialogueAnalyses } from '@/ai/precomputed-analysis';
import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard';
import { useToast } from '@/hooks/use-toast';

const LESSON_ID = 'lesson-1';

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


export default function GrammarLesson1Page() {
    const [progress, setProgress] = useState(0);
    const [_, copy] = useCopyToClipboard();
    const { toast } = useToast();

    useEffect(() => {
        try {
            const storedProgress = localStorage.getItem(`${LESSON_ID}-progress`);
            if (storedProgress) setProgress(JSON.parse(storedProgress));
        } catch (error) {
            console.error("Failed to parse from localStorage", error);
        }
    }, []);

    const handleShare = () => {
        copy(window.location.href)
            .then(() => toast({ title: 'Ссылка скопирована!', description: 'Вы можете поделиться этим уроком с кем угодно.' }))
            .catch(() => toast({ title: 'Ошибка', description: 'Не удалось скопировать ссылку.', variant: 'destructive' }));
    }

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
            <Accordion type="multiple" className="w-full max-w-4xl mb-12 space-y-4">
                
                {/* ГРАММАТИКА */}
                <AccordionItem value="item-grammar">
                    <AccordionTrigger className="text-2xl font-semibold bg-muted/50 px-4 rounded-t-lg"><BookOpen className="mr-4 text-primary"/>Грамматика</AccordionTrigger>
                    <AccordionContent className="text-lg text-foreground/90 space-y-4 px-2 border border-t-0 rounded-b-lg">
                        <Accordion type="single" collapsible>
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
                                <AccordionTrigger className="text-xl font-semibold">§2. Имя существительное</AccordionTrigger>
                                <AccordionContent className="text-lg text-foreground/90 space-y-4 px-2">
                                    <p>У существительных нет рода и числа. Они изменяются по 11 падежам с помощью суффиксов.</p>
                                    <Card className="bg-card/70 mt-4">
                                        <CardHeader><CardTitle>Основной падеж (N)</CardTitle></CardHeader>
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
                                            <div className="my-2"><InteractiveText analysis={grammarAnalyses.anokatawadonadesuka}/></div>
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

                {/* СЛОВООБРАЗОВАНИЕ */}
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

                {/* ИНТОНАЦИЯ */}
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
                
                 {/* ПИСЬМЕННОСТЬ */}
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
                                    <p className="text-sm mt-2 text-muted-foreground">В заимствованных словах долгота гласных передаётся знаком ー.</p>
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
            
            <div className="mt-12 text-center">
                <Button size="lg" asChild className="btn-gradient">
                    <Link href="/grammar/lesson-2">Перейти к Уроку 2 →</Link>
                </Button>
            </div>
        </div>
    </div>
  );
}
