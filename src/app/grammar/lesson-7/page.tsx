
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, Share2, Volume2, BookOpen, CheckCircle, XCircle } from 'lucide-react';
import Link from 'next/link';
import InteractiveText from '@/components/interactive-text';
import InteractiveFormula from '@/components/interactive-formula';
import { grammarAnalyses, dialogueAnalyses } from '@/ai/precomputed-analysis';
import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const LESSON_ID = 'grammar-lesson-7';

const KatakanaRowDisplay = ({ rowData }: { rowData: { kana: string; romaji: string }[] }) => (
    <div className='flex flex-wrap gap-4 mt-2 justify-center'>
       {rowData.map(char => (
           <Card key={char.kana} className="p-4 flex flex-col items-center justify-center w-24 h-24"><span className="text-3xl md:text-4xl font-japanese">{char.kana}</span><span className="text-muted-foreground">{char.romaji}</span></Card>
       ))}
   </div>
);

const katakanaRows = {
    ta: [{ kana: 'タ', romaji: 'ta' }, { kana: 'チ', romaji: 'chi' }, { kana: 'ツ', romaji: 'tsu' }, { kana: 'テ', romaji: 'te' }, { kana: 'ト', romaji: 'to' }],
    na: [{ kana: 'ナ', romaji: 'na' }, { kana: 'ニ', romaji: 'ni' }, { kana: 'ヌ', romaji: 'nu' }, { kana: 'ネ', romaji: 'ne' }, { kana: 'ノ', romaji: 'no' }],
    ha: [{ kana: 'ハ', romaji: 'ha' }, { kana: 'ヒ', romaji: 'hi' }, { kana: 'フ', romaji: 'fu' }, { kana: 'ヘ', romaji: 'he' }, { kana: 'ホ', romaji: 'ho' }],
};

const kanjiList = [
    { kanji: '大', kun: 'おお', on: 'ダイ, タイ', meaning: 'большой, великий' },
    { kanji: '山', kun: 'やま', on: 'サン', meaning: 'гора' },
    { kanji: '中', kun: 'なか', on: 'チュウ', meaning: 'центр, середина, в, внутри' },
    { kanji: '四', kun: 'よん, よ', on: 'シ', meaning: 'четыре' },
    { kanji: '室', kun: 'しつ', on: 'シツ', meaning: 'комната' },
    { kanji: '信', kun: '-', on: 'シン', meaning: 'вера, учение' },
    { kanji: '教', kun: 'おしえる', on: 'キョウ', meaning: 'преподавать' },
    { kanji: '習', kun: 'ならう', on: 'シュウ', meaning: 'учиться, обучаться' },
    { kanji: '内', kun: 'うち', on: 'ナイ', meaning: 'внутри, в' },
    { kanji: '出', kun: 'でる', on: 'シュツ', meaning: 'выходить, появляться' },
    { kanji: '部', kun: '-', on: 'ブ', meaning: 'часть, отдел, отделение' },
    { kanji: '田', kun: 'た', on: 'デン', meaning: 'поле' },
    { kanji: '年', kun: 'とし', on: 'ネン', meaning: 'год' },
];

export default function GrammarLesson7Page() {
    const [progress, setProgress] = useState(0);
    const [_, copy] = useCopyToClipboard();
    const { toast } = useToast();

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
                        <p className="text-sm text-primary font-semibold">Урок 7 — Грамматика</p>
                        <CardTitle className="text-2xl md:text-3xl">Указательные местоимения</CardTitle>
                        <CardDescription>Разбор местоимений これ, それ, あれ, падежи, частица も и вопросительные предложения в отрицательной форме.</CardDescription>
                        <Progress value={progress} className="mt-2" />
                    </CardHeader>
                </Card>

                <h2 className="text-3xl font-bold text-foreground mb-6 text-center">🧠 Теория</h2>
                <Accordion type="multiple" className="w-full max-w-4xl mb-12 space-y-4" defaultValue={['item-grammar']}>
                    <AccordionItem value="item-grammar">
                        <AccordionTrigger className="text-lg md:text-2xl font-semibold bg-muted/50 px-4 rounded-t-lg"><BookOpen className="mr-4 text-primary"/>Грамматика</AccordionTrigger>
                        <AccordionContent className="text-base md:text-lg text-foreground/90 space-y-4 px-6 py-4 border border-t-0 rounded-b-lg">
                           <p><b>Предметно-указательные местоимения これ, それ, あれ</b> замещают названия предметов. Различаются по степени удаления от говорящего.</p>
                           <ul className="list-disc list-inside space-y-2">
                               <li><b>これ:</b> предмет у говорящего.</li>
                               <li><b>それ:</b> предмет у собеседника.</li>
                               <li><b>あれ:</b> предмет далеко от обоих.</li>
                           </ul>
                           <p><b>Вопросительное местоимение どれ</b> соответствует これ, それ, あれ и означает "какой?", "что?" (из имеющихся).</p>
                           <InteractiveText analysis={grammarAnalyses.kyoukasho_wa_dore_desuka} />
                           <InteractiveText analysis={grammarAnalyses.kyoukasho_wa_kore_desu} />

                           <h4 className="font-semibold text-lg mt-4">Именительный падеж (が)</h4>
                           <p>Подлежащее ставится в именительном падеже с частицей <b>が</b>, когда на него падает логическое ударение (новая информация).</p>
                           <InteractiveText analysis={grammarAnalyses.kore_ga_hon_desu} />
                           <p>Сравните:</p>
                           <ul className="list-disc list-inside space-y-2">
                               <li><InteractiveText analysis={grammarAnalyses.kore_wa_hon_desu} /> (Ответ на вопрос "Что это?")</li>
                               <li><InteractiveText analysis={grammarAnalyses.kore_ga_hon_desu} /> (Ответ на вопрос "Что из этого книга?")</li>
                           </ul>

                            <h4 className="font-semibold text-lg mt-4">Частица も</h4>
                           <p>Имеет присоединительное значение "тоже", "и... и...". В отрицательных предложениях — "ни... ни...".</p>
                           <InteractiveText analysis={grammarAnalyses.yamadasan_mo_sensei_desu} />
                           <InteractiveText analysis={grammarAnalyses.anna_mo_tanakasan_mo_sensei_dewa_arimasen} />
                           
                           <h4 className="font-semibold text-lg mt-4">Вопросительное предложение в отрицательной форме</h4>
                           <p>Задается, когда говорящий ожидает подтверждения.</p>
                           <InteractiveFormula formula="N は N ではありませんか。" />
                           <InteractiveText analysis={grammarAnalyses.anohito_wa_gakusei_dewa_arimasenka} />
                        </AccordionContent>
                    </AccordionItem>
                     <AccordionItem value="item-word-formation">
                        <AccordionTrigger className="text-lg md:text-2xl font-semibold bg-muted/50 px-4 rounded-t-lg"><BookOpen className="mr-4 text-primary"/>Словообразование</AccordionTrigger>
                        <AccordionContent className="text-base md:text-lg text-foreground/90 space-y-4 px-6 py-4 border border-t-0 rounded-b-lg">
                           <p>Некоторые корни китайского происхождения (канго), как <b className="font-japanese">学</b>, могут выступать как самостоятельные слова (大学, 学生) или как суффиксы для обозначения наук (文学 - литература, 史学 - история).</p>
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-writing">
                        <AccordionTrigger className="text-lg md:text-2xl font-semibold bg-muted/50 px-4 rounded-t-lg"><BookOpen className="mr-4 text-primary"/>Письменность</AccordionTrigger>
                         <AccordionContent className="text-base md:text-lg text-foreground/90 space-y-4 px-6 py-4 border border-t-0 rounded-b-lg">
                            <h4 className="font-bold text-xl mt-4 mb-2">Катакана: Ряды ТА, НА, ХА</h4>
                            <KatakanaRowDisplay rowData={katakanaRows.ta} />
                            <KatakanaRowDisplay rowData={katakanaRows.na} />
                            <KatakanaRowDisplay rowData={katakanaRows.ha} />

                            <h4 className="font-bold text-xl mt-4 mb-2">Иероглифы урока 7</h4>
                            <Table>
                                <TableHeader><TableRow><TableHead>Иероглиф</TableHead><TableHead>Кун</TableHead><TableHead>Он</TableHead><TableHead>Значение</TableHead></TableRow></TableHeader>
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
                         </AccordionContent>
                    </AccordionItem>
                </Accordion>
                
                {/* Exercises section will be added here in a future update */}
                 <Card>
                    <CardHeader>
                        <CardTitle>Упражнения</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">Интерактивные упражнения для этого урока находятся в разработке и скоро появятся!</p>
                    </CardContent>
                </Card>

            </div>
        </div>
    );
}
