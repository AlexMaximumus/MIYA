
'use client';

import { useState } from 'react';
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
           <Card key={char.kana} className="p-4 flex flex-col items-center justify-center w-24 h-24"><span className="text-3xl font-japanese">{char.kana}</span><span className="text-muted-foreground">{char.romaji}</span></Card>
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
            <CardTitle className="text-xl">{title}</CardTitle>
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
                        <CardDescription>Разбор местоимений これ, それ, あれ. Падежи, частица も и вопросительные предложения в отрицательной форме.</CardDescription>
                    </CardHeader>
                </Card>

                <h2 className="text-3xl font-bold text-foreground mb-6 text-center">🧠 Теория</h2>
                <Accordion type="multiple" className="w-full max-w-4xl mb-12 space-y-4" defaultValue={['item-grammar']}>
                    <AccordionItem value="item-grammar">
                        <AccordionTrigger className="text-xl font-semibold bg-muted/50 px-4 rounded-t-lg"><BookOpen className="mr-4 text-primary"/>Грамматика</AccordionTrigger>
                        <AccordionContent className="text-lg text-foreground/90 space-y-4 px-6 py-4 border border-t-0 rounded-b-lg">
                           <h4 className="font-bold text-xl mb-2">Предметно-указательные местоимения これ, それ, あれ</h4>
                           <div className="space-y-2">
                               <p>Местоимения これ (это), それ (это, то), あれ (то) замещают названия предметов и животных. Различаются по степени удаления от говорящего:</p>
                               <ul className="list-disc list-inside space-y-2 mt-2">
                                   <li><b>これ:</b> Предмет у говорящего.</li>
                                   <li><b>それ:</b> Предмет у собеседника.</li>
                                   <li><b>あれ:</b> Предмет далеко от обоих.</li>
                               </ul>
                               <p>Например, если у говорящего в руках книга, он скажет <b>これ</b>. Если книга у собеседника — <b>それ</b>. Если они оба смотрят на далёкое здание — <b>あれ</b>.</p>
                               <p>Эти местоимения могут быть подлежащим или дополнением, но не определением. Изменяются по падежам, но не имеют родительного падежа.</p>
                           </div>
                           
                           <h4 className="font-bold text-xl mt-4 mb-2">Вопросительное местоимение どれ</h4>
                           <div>
                               Вопросительным местоимением, соответствующим これ, それ, あれ, является どれ. Оно означает "какой?", "что?" (из имеющихся).
                               <div className="my-2"><InteractiveText analysis={grammarAnalyses.kyoukasho_wa_dore_desuka} /></div>
                               <div>
                                    <b>Ответ:</b>
                                    <div className="mt-1"><InteractiveText analysis={grammarAnalyses.kyoukasho_wa_kore_desu} /></div>
                               </div>
                           </div>

                           <h4 className="font-bold text-xl mt-4 mb-2">Именительный падеж (が)</h4>
                           <div className="space-y-2">
                               <div>Показателем именительного падежа является суффикс <b>が</b>. Он ставится после подлежащего, когда на него падает логическое ударение (новая информация).</div>
                               <div className="my-2"><InteractiveText analysis={grammarAnalyses.kore_ga_hon_desu} /></div>
                               <div>Поэтому вопросительные слова (<b>だれ</b>, <b>どれ</b>) в роли подлежащего всегда используются с <b>が</b>.</div>
                               <div className="my-2"><b>Вопрос:</b> <InteractiveText analysis={grammarAnalyses.daregagakuseidesuka} /></div>
                               <div className="my-2"><b>Ответ:</b> <InteractiveText analysis={grammarAnalyses.yamadasan_ga_sensei_desu} /></div>
                               <div className="mt-4 font-semibold">Сравните:</div>
                               <ul className="list-disc list-inside space-y-2">
                                   <li><div><InteractiveText analysis={grammarAnalyses.kore_wa_hon_desu} /> (Ответ на вопрос "Что это?")</div></li>
                                   <li><div><InteractiveText analysis={grammarAnalyses.kore_ga_hon_desu} /> (Ответ на вопрос "Что из этого книга?")</div></li>
                               </ul>
                           </div>

                            <h4 className="font-bold text-xl mt-4 mb-2">Частица も</h4>
                            <div className="space-y-2">
                               <div>Частица <b>も</b> имеет присоединительное значение "тоже", "и... и...". В отрицательных предложениях — "ни... ни...".</div>
                               <p>Примеры:</p>
                               <div><InteractiveText analysis={grammarAnalyses.yamadasan_mo_sensei_desu} /></div>
                               <div><InteractiveText analysis={grammarAnalyses.anna_mo_tanakasan_mo_sensei_dewa_arimasen} /></div>
                           </div>
                           
                           <h4 className="font-bold text-xl mt-4 mb-2">Вопросительное предложение в отрицательной форме</h4>
                           <div className="space-y-2">
                               <div>Задается, когда говорящий ожидает подтверждения своего предположения.</div>
                               <InteractiveFormula formula="N は N ではありませんか。" />
                               <div className="my-2"><InteractiveText analysis={grammarAnalyses.anohito_wa_gakusei_dewa_arimasenka} /></div>
                               <div>
                                    <p>Ответы на такой вопрос:</p>
                                    <div className="ml-4"><b>Да:</b> <InteractiveText analysis={grammarAnalyses.hai_gakuseidesu} /></div>
                                    <div className="ml-4"><b>Нет:</b> <InteractiveText analysis={grammarAnalyses.iie_gakuseidewaarimasen} /></div>
                               </div>
                           </div>
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-word-formation">
                        <AccordionTrigger className="text-xl font-semibold bg-muted/50 px-4 rounded-t-lg"><BookOpen className="mr-4 text-primary"/>Словообразование</AccordionTrigger>
                        <AccordionContent className="text-lg text-foreground/90 space-y-4 px-6 py-4 border border-t-0 rounded-b-lg">
                           <div className="space-y-2">
                                <div>Некоторые корни китайского происхождения обладают словообразовательной функцией. Они могут выступать как самостоятельные слова или как суффиксы.</div>
                                <div>Например, корень <b className="font-japanese">学</b> в сочетании с другими корнями образует новые слова: <InteractiveText analysis={grammarAnalyses.gakusei} />, <InteractiveText analysis={grammarAnalyses.daigaku} />.</div>
                                <div>Вместе с тем <b className="font-japanese">学</b> используется как суффикс для обозначения теоретических наук: <InteractiveText analysis={grammarAnalyses.bungaku} />, <InteractiveText analysis={grammarAnalyses.shigaku} />.</div>
                           </div>
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-writing">
                        <AccordionTrigger className="text-xl font-semibold bg-muted/50 px-4 rounded-t-lg"><BookOpen className="mr-4 text-primary"/>Письменность</AccordionTrigger>
                         <AccordionContent className="text-lg text-foreground/90 space-y-4 px-6 py-4 border border-t-0 rounded-b-lg">
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
                                            <TableCell className="text-2xl font-japanese">{k.kanji}</TableCell>
                                            <TableCell className="font-japanese">{k.kun.join(', ')}</TableCell>
                                            <TableCell className="font-japanese">{k.on.join(', ')}</TableCell>
                                            <TableCell>{k.meaning}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                         </AccordionContent>
                    </AccordionItem>
                     <AccordionItem value="item-texts">
                        <AccordionTrigger className="text-xl font-semibold bg-muted/50 px-4 rounded-t-lg"><BookOpen className="mr-4 text-primary"/>Тексты</AccordionTrigger>
                         <AccordionContent className="text-lg text-foreground/90 space-y-4 px-6 py-4 border border-t-0 rounded-b-lg">
                            <h4 className="font-bold text-xl mb-2">ТЕКСТ 7-1</h4>
                            <div className="space-y-2">
                                <div><InteractiveText analysis={grammarAnalyses.kore_wa_note_desu} /></div>
                                <div><InteractiveText analysis={grammarAnalyses.sore_wa_pen_desu} /></div>
                                <div><InteractiveText analysis={grammarAnalyses.are_wa_hondana_desu} /></div>
                                <div><InteractiveText analysis={grammarAnalyses.doa_wa_doko_desu_ka} /></div>
                                <div><InteractiveText analysis={grammarAnalyses.enpitsu_wa_dore_desu_ka} /></div>
                            </div>
                            <h4 className="font-bold text-xl mt-4 mb-2">ТЕКСТ 7-2</h4>
                            <div className="space-y-2">
                                <div><InteractiveText analysis={dialogueAnalyses.kore_wa_nan_desuka} /></div>
                                <div><InteractiveText analysis={dialogueAnalyses.sore_wa_jisho_desu} /></div>
                                <div><InteractiveText analysis={dialogueAnalyses.nihongo_no_jisho_desuka} /></div>
                                <div><InteractiveText analysis={dialogueAnalyses.hai_soudesu} /></div>
                            </div>
                         </AccordionContent>
                    </AccordionItem>
                     <AccordionItem value="item-expressions">
                        <AccordionTrigger className="text-xl font-semibold bg-muted/50 px-4 rounded-t-lg"><Volume2 className="mr-4 text-primary"/>Обиходные выражения</AccordionTrigger>
                        <AccordionContent className="text-lg text-foreground/90 space-y-4 px-6 py-4 border border-t-0 rounded-b-lg">
                           <div><InteractiveText analysis={dialogueAnalyses.wakarimashita} /></div>
                           <div><InteractiveText analysis={dialogueAnalyses.doumo_arigatou_gozaimashita} /></div>
                           <div><InteractiveText analysis={dialogueAnalyses.dou_itashimashite} /></div>
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
                            <div><InteractiveText analysis={grammarAnalyses.kore_wa_hon_desu} /></div>
                            <div><InteractiveText analysis={dialogueAnalyses.kore_wa_nan_desuka} /></div>
                            <div><InteractiveText analysis={{ sentence: [{ word: 'あれ', furigana: 'あれ', translation: 'то', partOfSpeech: 'местоимение' }, { word: 'は', furigana: 'は', translation: 'частица (тема)', partOfSpeech: 'частица (тема)' }, { word: '図書館', furigana: 'としょかん', translation: 'библиотека', partOfSpeech: 'существительное' }, { word: 'です', furigana: 'です', translation: 'есть (связка)', partOfSpeech: 'связка' }], fullTranslation: 'То - библиотека.'}} /></div>
                            <div><InteractiveText analysis={{ sentence: [{ word: 'どれ', furigana: 'どれ', translation: 'который?', partOfSpeech: 'вопросительное местоимение' }, { word: 'が', furigana: 'が', translation: 'частица', partOfSpeech: 'частица' }, { word: '辞書', furigana: 'じしょ', translation: 'словарь', partOfSpeech: 'существительное' }, { word: 'です', furigana: 'です', translation: 'есть (связка)', partOfSpeech: 'связка' }, { word: 'か', furigana: 'か', translation: 'вопросительная частица', partOfSpeech: 'вопросительная частица' }], fullTranslation: 'Что (из этого) - словарь?'}} /></div>
                            <div><InteractiveText analysis={grammarAnalyses.anohito_wa_gakusei_dewa_arimasenka} /></div>
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
                            <CardTitle className="text-xl">Остальные упражнения (2-5, 7, 8, 10, 12-22)</CardTitle>
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
