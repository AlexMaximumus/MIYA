
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
import { Textarea } from '@/components/ui/textarea';

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

const ExerciseCard = ({ title, description, children, onCheck, result, canCheck = true }: { title: string; description?: React.ReactNode; children: React.ReactNode; onCheck?: () => void; result?: boolean | null; canCheck?: boolean; }) => (
    <Card>
        <CardHeader>
            <CardTitle className="text-lg md:text-xl">{title}</CardTitle>
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
                        <AccordionTrigger className="text-lg md:text-2xl font-semibold bg-muted/50 px-4 rounded-t-lg"><BookOpen className="mr-4 text-primary"/>Грамматика</AccordionTrigger>
                        <AccordionContent className="text-base md:text-lg text-foreground/90 space-y-4 px-6 py-4 border border-t-0 rounded-b-lg">
                            <Accordion type="single" collapsible className="w-full" defaultValue="g-1">
                                <AccordionItem value="g-1">
                                    <AccordionTrigger className="text-base md:text-xl font-semibold">§1. Предметно-указательные местоимения これ, それ, あれ</AccordionTrigger>
                                    <AccordionContent className="text-base md:text-lg text-foreground/90 space-y-4 px-2">
                                        <div>Предметно-указательные местоимения これ (это), それ (это, то), あれ (то) замещают названия предметов и животных, в некоторых случаях (в речи о неодушевлённых предметах) переводятся как местоимения он, она, оно, они.</div>
                                        <div>Между собой местоимения これ, それ, あれ различаются по степени удаления от говорящего или по степени известности собеседникам.</div>
                                        <ul className="list-disc list-inside space-y-2 mt-2">
                                            <li><b>これ:</b> Предмет у говорящего.</li>
                                            <li><b>それ:</b> Предмет у собеседника.</li>
                                            <li><b>あれ:</b> Предмет далеко от обоих.</li>
                                        </ul>
                                        <div>Например, если у говорящего в руках книга, он скажет <b>これ</b>. Если книга у собеседника — <b>それ</b>. Если они оба смотрят на далёкое здание — <b>あれ</b>.</div>
                                        <div>Эти местоимения могут быть подлежащим или дополнением, но не определением.</div>
                                    </AccordionContent>
                                </AccordionItem>
                                <AccordionItem value="g-2">
                                     <AccordionTrigger className="text-base md:text-xl font-semibold">§2. Вопросительное местоимение どれ</AccordionTrigger>
                                    <AccordionContent className="text-base md:text-lg text-foreground/90 space-y-4 px-2">
                                        <div>Вопросительным местоимением, соответствующим これ, それ, あれ, является どれ. Оно означает "какой?", "что?" (из имеющихся).</div>
                                        <div className="my-2"><InteractiveText analysis={grammarAnalyses.kyoukasho_wa_dore_desuka} /></div>
                                        <div>
                                            <b>Ответ:</b>
                                            <div className="mt-1"><InteractiveText analysis={grammarAnalyses.kyoukasho_wa_kore_desu} /></div>
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>
                                <AccordionItem value="g-3">
                                     <AccordionTrigger className="text-base md:text-xl font-semibold">§3. Именительный падеж (частица が)</AccordionTrigger>
                                     <AccordionContent className="text-base md:text-lg text-foreground/90 space-y-4 px-2">
                                        <div>Показателем именительного падежа является суффикс <b>が</b>. Он ставится после подлежащего, когда на него падает логическое ударение (новая информация).</div>
                                        <div className="my-2"><InteractiveText analysis={grammarAnalyses.kore_ga_hon_desu} /></div>
                                        <div>Вопросительные слова (<b>だれ</b>, <b>どれ</b>) в роли подлежащего всегда используются с <b>が</b>.</div>
                                        <div className="my-2"><b>Вопрос:</b> <InteractiveText analysis={grammarAnalyses.daregagakuseidesuka} /></div>
                                        <div className="my-2"><b>Ответ:</b> <InteractiveText analysis={grammarAnalyses.yamadasan_ga_sensei_desu} /></div>
                                        <div className="mt-4 font-semibold">Сравните:</div>
                                        <ul className="list-disc list-inside space-y-2">
                                            <li><div><InteractiveText analysis={grammarAnalyses.kore_wa_hon_desu} /> (Ответ на вопрос "Что это?")</div></li>
                                            <li><div><InteractiveText analysis={grammarAnalyses.kore_ga_hon_desu} /> (Ответ на вопрос "Что из этого книга?")</div></li>
                                        </ul>
                                     </AccordionContent>
                                </AccordionItem>
                                <AccordionItem value="g-4">
                                     <AccordionTrigger className="text-base md:text-xl font-semibold">§4. Частица も</AccordionTrigger>
                                     <AccordionContent className="text-base md:text-lg text-foreground/90 space-y-4 px-2">
                                        <div>Частица <b>も</b> имеет присоединительное значение "тоже", "и... и...". В отрицательных предложениях — "ни... ни...".</div>
                                        <div>Примеры:</div>
                                        <div><InteractiveText analysis={grammarAnalyses.yamadasan_mo_sensei_desu} /></div>
                                        <div><InteractiveText analysis={grammarAnalyses.anna_mo_tanakasan_mo_sensei_dewa_arimasen} /></div>
                                     </AccordionContent>
                                </AccordionItem>
                                <AccordionItem value="g-5">
                                     <AccordionTrigger className="text-base md:text-xl font-semibold">§5. Вопросительное предложение в отрицательной форме</AccordionTrigger>
                                     <AccordionContent className="text-base md:text-lg text-foreground/90 space-y-4 px-2">
                                        <div>Задается, когда говорящий ожидает подтверждения своего предположения.</div>
                                        <InteractiveFormula formula="N は N ではありませんか 。" />
                                        <div className="my-2"><InteractiveText analysis={grammarAnalyses.anohito_wa_gakusei_dewa_arimasenka} /></div>
                                        <div>
                                            <p>Ответы на такой вопрос:</p>
                                            <div className="ml-4"><b>Да:</b> <InteractiveText analysis={grammarAnalyses.hai_gakuseidesu} /></div>
                                            <div className="ml-4"><b>Нет:</b> <InteractiveText analysis={grammarAnalyses.iie_gakuseidewaarimasen} /></div>
                                        </div>
                                     </AccordionContent>
                                </AccordionItem>
                            </Accordion>
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-word-formation">
                        <AccordionTrigger className="text-lg md:text-2xl font-semibold bg-muted/50 px-4 rounded-t-lg"><BookOpen className="mr-4 text-primary"/>Словообразование</AccordionTrigger>
                        <AccordionContent className="text-base md:text-lg text-foreground/90 space-y-4 px-6 py-4 border border-t-0 rounded-b-lg">
                           <div className="space-y-2">
                                <div>Некоторые корни китайского происхождения (канго) обладают словообразовательной функцией. Они могут выступать как самостоятельные слова или как суффиксы.</div>
                                <div>Например, корень <b className="font-japanese">学</b> в сочетании с другими корнями образует новые слова: <InteractiveText analysis={grammarAnalyses.gakusei} />, <InteractiveText analysis={grammarAnalyses.daigaku} />.</div>
                                <div>Вместе с тем <b className="font-japanese">学</b> используется как суффикс для обозначения теоретических наук: <InteractiveText analysis={grammarAnalyses.bungaku} />, <InteractiveText analysis={grammarAnalyses.shigaku} />.</div>
                           </div>
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
                        <AccordionTrigger className="text-lg md:text-2xl font-semibold bg-muted/50 px-4 rounded-t-lg"><BookOpen className="mr-4 text-primary"/>Тексты и словари</AccordionTrigger>
                         <AccordionContent className="text-base md:text-lg text-foreground/90 space-y-4 px-6 py-4 border border-t-0 rounded-b-lg">
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
                                <div><b>Танака:</b> <InteractiveText analysis={dialogueAnalyses.kore_wa_nan_desuka} /></div>
                                <div><b>Анна:</b> <InteractiveText analysis={dialogueAnalyses.sore_wa_jisho_desu} /></div>
                                <div><b>Танака:</b> <InteractiveText analysis={dialogueAnalyses.nihongo_no_jisho_desuka} /></div>
                                <div><b>Анна:</b> <InteractiveText analysis={dialogueAnalyses.hai_soudesu} /></div>
                            </div>
                         </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-expressions">
                        <AccordionTrigger className="text-lg md:text-2xl font-semibold bg-muted/50 px-4 rounded-t-lg"><Volume2 className="mr-4 text-primary"/>Обиходные выражения</AccordionTrigger>
                        <AccordionContent className="text-base md:text-lg text-foreground/90 space-y-4 px-6 py-4 border border-t-0 rounded-b-lg">
                           <div><InteractiveText analysis={dialogueAnalyses.wakarimashita} /></div>
                           <div><InteractiveText analysis={dialogueAnalyses.doumo_arigatou_gozaimashita} /></div>
                           <div><InteractiveText analysis={dialogueAnalyses.dou_itashimashite} /></div>
                        </AccordionContent>
                    </AccordionItem>
                     <AccordionItem value="item-commentary">
                        <AccordionTrigger className="text-lg md:text-2xl font-semibold bg-muted/50 px-4 rounded-t-lg"><BookOpen className="mr-4 text-primary"/>Комментарий</AccordionTrigger>
                         <AccordionContent className="text-base md:text-lg text-foreground/90 space-y-4 px-6 py-4 border border-t-0 rounded-b-lg">
                             <div>
                                <h4 className="font-bold text-xl mb-2">1. Речевой этикет</h4>
                                <div>Выражение благодарности. В японском языке словами благодарности служат слова ありがとう (Спасибо) или более вежливо - どうもありがとうございました (Большое спасибо). Ответной репликой обычно служит どういたしまして (Не стоит).</div>
                            </div>
                            <div>
                                <h4 className="font-bold text-xl mt-4 mb-2">2. Особенности употребления частиц</h4>
                                <div>Частица ね, произнесённая с интонацией удивления, передаёт значения непонимания, удивления, на русский язык может не переводиться, например: これは？ - Это?</div>
                                <div>Частица あ соответствует русской частице А!, имеющей значение Понятно!, например: あ、これはペンです。 - А, это ручка.</div>
                            </div>
                            <div>
                                <h4 className="font-bold text-xl mt-4 mb-2">3. Указание на предметы</h4>
                                <div>В некоторых случаях, когда собеседники находятся рядом с каким-либо предметом, то оба, указывая на него, могут сказать これ.</div>
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
                
                <h2 className="text-3xl font-bold text-foreground mb-8 mt-12 text-center">📝 Закрепление</h2>
                 <div className="space-y-6">
                    <ExerciseCard title="Упражнение 1: Интонация" description="Отработайте интонацию следующих предложений. (Самостоятельная практика)">
                        <div className="space-y-4">
                            <div><InteractiveText analysis={grammarAnalyses.kore_wa_hon_desu} /></div>
                            <div><InteractiveText analysis={dialogueAnalyses.kore_wa_nan_desuka} /></div>
                            <div><InteractiveText analysis={{ sentence: [{ word: 'あれ', furigana: 'あれ', translation: 'то', partOfSpeech: 'местоимение' }, { word: 'は', furigana: 'は', translation: 'частица (тема)', partOfSpeech: 'частица (тема)' }, { word: '図書館', furigana: 'としょかん', translation: 'библиотека', partOfSpeech: 'существительное' }, { word: 'です', furigana: 'です', translation: 'есть (связка)', partOfSpeech: 'связка' }], fullTranslation: 'То - библиотека.'}} /></div>
                            <div><InteractiveText analysis={{ sentence: [{ word: 'どれ', furigana: 'どれ', translation: 'который?', partOfSpeech: 'вопросительное местоимение' }, { word: 'が', furigana: 'が', translation: 'частица', partOfSpeech: 'частица' }, { word: '辞書', furigana: 'じしょ', translation: 'словарь', partOfSpeech: 'существительное' }, { word: 'です', furigana: 'です', translation: 'есть (связка)', partOfSpeech: 'связка' }, { word: 'か', furigana: 'か', translation: 'вопросительная частица', partOfSpeech: 'вопросительная частица' }], fullTranslation: 'Что (из этого) - словарь?'}} /></div>
                            <div><InteractiveText analysis={grammarAnalyses.anohito_wa_gakusei_dewa_arimasenka} /></div>
                        </div>
                    </ExerciseCard>

                    <ExerciseCard title="Упражнения 2-22" description="Выполните задания, используя поля для ввода. Автоматическая проверка для большинства этих упражнений будет добавлена в будущих обновлениях." onCheck={showNotImplementedToast} canCheck={false}>
                         <div className="flex items-center gap-2 p-3 bg-blue-500/10 rounded-lg mb-6">
                            <Lightbulb className="w-5 h-5 text-blue-500 shrink-0" />
                            <p className="text-sm text-blue-800">
                                <b>Примечание:</b> Интерактивная проверка для большинства упражнений этого урока находится в разработке. Вы можете выполнять задания в полях для ввода, но автоматическая оценка пока недоступна.
                            </p>
                        </div>
                        <div className="space-y-8">
                             <div>
                                <h4 className="font-semibold text-lg mb-2">Упражнение 2: Образование наук</h4>
                                <p>Образуйте с помощью суффикса 学 названия теоретических наук от следующих слов и переведите: 法 (закон), 語 (язык), 植物 (растение), 動物 (животное), 心理 (психика), 哲 (философия), 運動 (движение).</p>
                                <Textarea className="mt-2" placeholder="Ваши ответы..." />
                            </div>
                             <div>
                                <h4 className="font-semibold text-lg mb-2">Упражнение 3: Перевод слов с 学</h4>
                                <p>Переведите: 文学, 史学, 物理学, 化学, 数学, 語学, 植物学, 動物学, 心理学, 哲学, 運動学.</p>
                                <Textarea className="mt-2" placeholder="Ваши ответы..." />
                            </div>
                            <div>
                                <h4 className="font-semibold text-lg mb-2">Упражнение 4-5, 7-8, 17: Работа с рисунками</h4>
                                <p>Эти упражнения требуют визуальных материалов, которые будут добавлены позже. Вы можете их пока пропустить.</p>
                            </div>
                             <div>
                                <h4 className="font-semibold text-lg mb-2">Упражнение 6: Перевод предложений</h4>
                                <p>Переведите на японский:</p>
                                <ol className="list-decimal list-inside">
                                    <li>Это газета.</li>
                                    <li>То учебник.</li>
                                    <li>Это потолок.</li>
                                    <li>То аудитория.</li>
                                    <li>Это карандаш.</li>
                                    <li>Это книга.</li>
                                    <li>То окно.</li>
                                    <li>То стена.</li>
                                    <li>То карта.</li>
                                    <li>Это фотография.</li>
                                    <li>Это ручка.</li>
                                    <li>То полка.</li>
                                </ol>
                                <Textarea className="mt-2" placeholder="Ваш перевод..." />
                            </div>
                             <div>
                                <h4 className="font-semibold text-lg mb-2">Упражнение 9: Отрицательная форма</h4>
                                 <p>Скажите следующие предложения в отрицательной форме, дополнив вариантом правильного ответа, используя для этого слова, данные в скобках:</p>
                                <ul className="list-disc list-inside space-y-1 mt-2">
                                    <li>それはノートです。(本)</li>
                                    <li>あれは地図です。(絵)</li>
                                    <li>これはドアです。(壁)</li>
                                    <li>それはひらがなです。(カタカナ)</li>
                                </ul>
                                <Textarea className="mt-2" placeholder="Ваш перевод..." />
                            </div>
                             <div>
                                <h4 className="font-semibold text-lg mb-2">Упражнение 10: Перевод</h4>
                                <Textarea className="mt-2" placeholder="Переведите все 14 предложений..." />
                            </div>
                            <div>
                                <h4 className="font-semibold text-lg mb-2">Упражнение 11: Частица も</h4>
                                <Textarea className="mt-2" placeholder="Дополните предложения, используя も..." />
                            </div>
                             <div>
                                <h4 className="font-semibold text-lg mb-2">Упражнение 12: Перевод c частицей も</h4>
                                <Textarea className="mt-2" placeholder="Переведите все 12 предложений..." />
                            </div>
                            <div>
                                <h4 className="font-semibold text-lg mb-2">Упражнение 13: Вопросы с вопросительным словом</h4>
                                <Textarea className="mt-2" placeholder="Поставьте вопросы к предложениям..." />
                            </div>
                            <div>
                                <h4 className="font-semibold text-lg mb-2">Упражнение 14: Ответы на вопросы</h4>
                                <Textarea className="mt-2" placeholder="Ответьте на вопросы, используя слова в скобках..." />
                            </div>
                            <div>
                                <h4 className="font-semibold text-lg mb-2">Упражнение 15: Перевод</h4>
                                <Textarea className="mt-2" placeholder="Переведите все 12 предложений..." />
                            </div>
                             <div>
                                <h4 className="font-semibold text-lg mb-2">Упражнение 16: Диалоги</h4>
                                <Textarea className="mt-2" placeholder="Составьте диалоги по образцам..." />
                            </div>
                            <div>
                                <h4 className="font-semibold text-lg mb-2">Упражнение 18: Заполните пропуски</h4>
                                <Textarea className="mt-2" placeholder="Заполните все пропуски в подпунктах а, б, в, г..." />
                            </div>
                            <div>
                                <h4 className="font-semibold text-lg mb-2">Упражнение 19: Составьте вопросы</h4>
                                <Textarea className="mt-2" placeholder="Придумайте вопросы к данным ответам..." />
                            </div>
                             <div>
                                <h4 className="font-semibold text-lg mb-2">Упражнение 20: Составьте предложения</h4>
                                <Textarea className="mt-2" placeholder="Составьте предложения из данных слов..." />
                            </div>
                            <div>
                                <h4 className="font-semibold text-lg mb-2">Упражнение 21: Ответьте на вопросы</h4>
                                <Textarea className="mt-2" placeholder="Ответьте на вопросы..." />
                            </div>
                             <div>
                                <h4 className="font-semibold text-lg mb-2">Упражнение 22: Перевод</h4>
                                <Textarea className="mt-2" placeholder="Переведите все 13 предложений..." />
                            </div>
                        </div>
                    </ExerciseCard>
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
