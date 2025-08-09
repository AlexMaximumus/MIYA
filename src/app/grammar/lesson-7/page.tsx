
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowLeft, Share2, Volume2, BookOpen, CheckCircle, XCircle, Lightbulb } from 'lucide-react';
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
    { kanji: '大', kun: ['おお'], on: ['ダイ', 'タイ'], meaning: 'большой, великий' },
    { kanji: '山', kun: ['やま'], on: ['サン'], meaning: 'гора' },
    { kanji: '中', kun: ['なか'], on: ['チュウ'], meaning: 'центр, середина, в, внутри' },
    { kanji: '四', kun: ['よん', 'よ'], on: ['シ'], meaning: 'четыре' },
    { kanji: '室', kun: ['しつ'], on: ['シツ'], meaning: 'комната' },
    { kanji: '信', kun: [], on: ['シン'], meaning: 'вера, учение' },
    { kanji: '教', kun: ['おしえる'], on: ['キョウ'], meaning: 'преподавать' },
    { kanji: '習', kun: ['ならう'], on: ['シュウ'], meaning: 'учиться, обучаться' },
    { kanji: '内', kun: ['うち'], on: ['ナイ'], meaning: 'внутри, в' },
    { kanji: '出', kun: ['でる'], on: ['シュツ'], meaning: 'выходить, появляться' },
    { kanji: '部', kun: [], on: ['ブ'], meaning: 'часть, отдел, отделение' },
    { kanji: '田', kun: ['た'], on: ['デン'], meaning: 'поле' },
    { kanji: '年', kun: ['とし'], on: ['ネン'], meaning: 'год' },
];

const ExerciseCard = ({ title, description, children }: { title: string; description?: React.ReactNode; children: React.ReactNode;}) => (
    <Card>
        <CardHeader>
            <CardTitle className="text-lg md:text-xl">{title}</CardTitle>
            {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
        <CardContent>{children}</CardContent>
    </Card>
);

export default function GrammarLesson7Page() {
    const [_, copy] = useCopyToClipboard();
    const { toast } = useToast();

    const handleShare = () => {
        copy(window.location.href)
            .then(() => toast({ title: 'Ссылка скопирована!', description: 'Вы можете поделиться этим уроком с кем угодно.' }))
            .catch(() => toast({ title: 'Ошибка', description: 'Не удалось скопировать ссылку.', variant: 'destructive' }));
    }

    const showNotImplementedToast = () => {
        toast({
          title: 'Упражнение в разработке',
          description: 'Проверка для этого задания пока не реализована. Следите за обновлениями!',
        });
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
                        <p className="text-sm text-primary font-semibold">Урок 7 — Грамматика</p>
                        <CardTitle className="text-2xl md:text-3xl">Указательные местоимения</CardTitle>
                        <CardDescription>Разбор местоимений これ, それ, あれ, падежи, частица も и вопросительные предложения в отрицательной форме.</CardDescription>
                    </CardHeader>
                </Card>

                <h2 className="text-3xl font-bold text-foreground mb-6 text-center">🧠 Теория</h2>
                <Accordion type="multiple" className="w-full max-w-4xl mb-12 space-y-4" defaultValue={['item-grammar']}>
                    <AccordionItem value="item-grammar">
                        <AccordionTrigger className="text-lg md:text-2xl font-semibold bg-muted/50 px-4 rounded-t-lg"><BookOpen className="mr-4 text-primary"/>Грамматика</AccordionTrigger>
                        <AccordionContent className="text-base md:text-lg text-foreground/90 space-y-4 px-6 py-4 border border-t-0 rounded-b-lg">
                           <h4 className="font-bold text-xl mb-2">Предметно-указательные местоимения これ, それ, あれ</h4>
                           <p>Местоимения これ (это), それ (это, то), あれ (то) замещают названия предметов и животных. Различаются по степени удаления от говорящего:</p>
                           <ul className="list-disc list-inside space-y-2 mt-2">
                               <li><b>これ:</b> Предмет у говорящего.</li>
                               <li><b>それ:</b> Предмет у собеседника.</li>
                               <li><b>あれ:</b> Предмет далеко от обоих.</li>
                           </ul>
                           <p className="mt-2">Например, если у говорящего в руках книга, он скажет <b className="font-japanese">これ</b>. Если книга у собеседника — <b className="font-japanese">それ</b>. Если они оба смотрят на далёкое здание — <b className="font-japanese">あれ</b>.</p>
                           <p className="mt-2">Эти местоимения могут быть подлежащим или дополнением, но не определением. Изменяются по падежам, но не имеют родительного падежа.</p>
                           
                           <h4 className="font-bold text-xl mt-4 mb-2">Вопросительное местоимение どれ</h4>
                           <p>Соответствует これ, それ, あれ и означает "какой?", "что?" (из имеющихся).</p>
                           <InteractiveText analysis={grammarAnalyses.kyoukasho_wa_dore_desuka} />
                           <p>Ответ:</p>
                           <InteractiveText analysis={grammarAnalyses.kyoukasho_wa_kore_desu} />

                           <h4 className="font-bold text-xl mt-4 mb-2">Именительный падеж (が)</h4>
                           <p>Суффикс <b>が</b> ставится после подлежащего, когда на него падает логическое ударение (новая информация).</p>
                           <InteractiveText analysis={grammarAnalyses.kore_ga_hon_desu} />
                           <p className="mt-2">Поэтому вопросительные слова (<b>だれ</b>, <b>どれ</b>) в роли подлежащего всегда используются с <b>が</b>.</p>
                           <p><b>Вопрос:</b> <InteractiveText analysis={grammarAnalyses.daregagakuseidesuka} /></p>
                           <p><b>Ответ:</b> <InteractiveText analysis={grammarAnalyses.yamadasan_ga_sensei_desu} /></p>
                           <p className="mt-4 font-semibold">Сравните:</p>
                           <ul className="list-disc list-inside space-y-2">
                               <li><InteractiveText analysis={grammarAnalyses.kore_wa_hon_desu} /> (Ответ на вопрос "Что это?")</li>
                               <li><InteractiveText analysis={grammarAnalyses.kore_ga_hon_desu} /> (Ответ на вопрос "Что из этого книга?")</li>
                           </ul>

                            <h4 className="font-bold text-xl mt-4 mb-2">Частица も</h4>
                           <p>Имеет присоединительное значение "тоже", "и... и...". В отрицательных предложениях — "ни... ни...".</p>
                           <p>Примеры:</p>
                           <InteractiveText analysis={grammarAnalyses.yamadasan_mo_sensei_desu} />
                           <InteractiveText analysis={grammarAnalyses.anna_mo_tanakasan_mo_sensei_dewa_arimasen} />
                           
                           <h4 className="font-bold text-xl mt-4 mb-2">Вопросительное предложение в отрицательной форме</h4>
                           <p>Задается, когда говорящий ожидает подтверждения своего предположения.</p>
                           <InteractiveFormula formula="N は N ではありませんか。" />
                           <InteractiveText analysis={grammarAnalyses.anohito_wa_gakusei_dewa_arimasenka} />
                           <p className="mt-2">Ответы на такой вопрос:</p>
                           <p><b>Да:</b> <InteractiveText analysis={grammarAnalyses.gakuseidesu} /></p>
                           <p><b>Нет:</b> <InteractiveText analysis={grammarAnalyses.watashi_wa_gakusei_dewa_arimasen} /></p>
                        </AccordionContent>
                    </AccordionItem>
                     <AccordionItem value="item-word-formation">
                        <AccordionTrigger className="text-lg md:text-2xl font-semibold bg-muted/50 px-4 rounded-t-lg"><BookOpen className="mr-4 text-primary"/>Словообразование</AccordionTrigger>
                        <AccordionContent className="text-base md:text-lg text-foreground/90 space-y-4 px-6 py-4 border border-t-0 rounded-b-lg">
                           <p>Некоторые корни китайского происхождения (канго), как <b className="font-japanese">学</b>, могут выступать как самостоятельные слова (<InteractiveText analysis={grammarAnalyses.daigaku} />, <InteractiveText analysis={grammarAnalyses.gakuseidesu} />) или как суффиксы для обозначения наук (<InteractiveText analysis={grammarAnalyses.bungaku} /> - литература, 史学 - история).</p>
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
                                            <TableCell className="font-japanese">{k.kun.join(', ')}</TableCell>
                                            <TableCell className="font-japanese">{k.on.join(', ')}</TableCell>
                                            <TableCell>{k.meaning}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                         </AccordionContent>
                    </AccordionItem>
                     <AccordionItem value="item-dialogues">
                        <AccordionTrigger className="text-lg md:text-2xl font-semibold bg-muted/50 px-4 rounded-t-lg"><Volume2 className="mr-4 text-primary"/>Обиходные выражения</AccordionTrigger>
                        <AccordionContent className="text-base md:text-lg text-foreground/90 space-y-4 px-6 py-4 border border-t-0 rounded-b-lg">
                           <InteractiveText analysis={dialogueAnalyses.wakarimashita} />
                           <InteractiveText analysis={dialogueAnalyses.doumo_arigatou_gozaimashita} />
                           <InteractiveText analysis={dialogueAnalyses.dou_itashimashite} />
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
                
                <h2 className="text-3xl font-bold text-foreground mb-8 mt-12 text-center">📝 Закрепление</h2>
                <div className="flex items-center gap-2 p-3 bg-blue-500/10 rounded-lg mb-6">
                    <Lightbulb className="w-5 h-5 text-blue-500 shrink-0" />
                    <p className="text-sm text-blue-800">
                        <b>Примечание:</b> Интерактивная проверка для всех упражнений этого урока находится в разработке. Вы можете выполнять задания в полях для ввода, но автоматическая оценка пока недоступна.
                    </p>
                </div>
                <div className="space-y-6">
                    <ExerciseCard title="Упражнение 1" description="Отработайте интонацию следующих предложений.">
                        <div className="space-y-4">
                            <InteractiveText analysis={grammarAnalyses.kore_wa_hon_desu} />
                            <InteractiveText analysis={dialogueAnalyses.kore_wa_nan_desuka} />
                            <p>あれは図書館です。</p>
                            <p>どれが辞書ですか。</p>
                            <InteractiveText analysis={grammarAnalyses.anohito_wa_gakusei_dewa_arimasenka} />
                        </div>
                    </ExerciseCard>

                    <ExerciseCard title="Упражнение 6" description="Переведите письменно на японский язык.">
                        <div className="space-y-2">
                            <Input placeholder="1. Это газета." className="font-japanese" />
                            <Input placeholder="2. То учебник." className="font-japanese" />
                            <Input placeholder="3. Это потолок." className="font-japanese" />
                            <Input placeholder="4. То аудитория." className="font-japanese" />
                        </div>
                        <Button onClick={showNotImplementedToast} className="mt-4">Проверить</Button>
                    </ExerciseCard>

                    <ExerciseCard title="Упражнение 9" description="Скажите предложения в отрицательной форме, дополнив вариантом правильного ответа.">
                        <div className="space-y-4">
                            <div>
                                <Label>それはノートです。(本)</Label>
                                <Input placeholder="これは...ではありません。...です。" className="font-japanese mt-1" />
                            </div>
                             <div>
                                <Label>あれは地図です。(絵)</Label>
                                <Input className="font-japanese mt-1" />
                            </div>
                        </div>
                         <Button onClick={showNotImplementedToast} className="mt-4">Проверить</Button>
                    </ExerciseCard>
                    <ExerciseCard title="Упражнение 11" description="Дополните предложения, употребив частицу も.">
                        <div className="space-y-4">
                            <div>
                                <Label>これは椅子です。(それ)</Label>
                                <Input className="font-japanese mt-1" />
                            </div>
                             <div>
                                <Label>田中さんは学生です。(山田さん)</Label>
                                <Input className="font-japanese mt-1" />
                            </div>
                        </div>
                         <Button onClick={showNotImplementedToast} className="mt-4">Проверить</Button>
                    </ExerciseCard>
                     <Card>
                        <CardHeader>
                            <CardTitle className="text-lg md:text-xl">Остальные упражнения (2-5, 7, 8, 10, 12-22)</CardTitle>
                            <CardDescription>Эти задания требуют более сложного разбора и будут добавлены в следующих обновлениях.</CardDescription>
                        </CardHeader>
                    </Card>
                </div>


                 <div className="mt-12 text-center flex flex-col items-center gap-4">
                    <Button size="lg" asChild className="btn-gradient w-full max-w-xs">
                        <Link href="/grammar">Вернуться к списку уроков</Link>
                    </Button>
                </div>
            </div>
        </div>
    );
}

    