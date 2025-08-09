
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
        {onCheck && canCheck && (
            <CardFooter className="flex flex-col items-start gap-4">
                <Button onClick={onCheck}>Проверить</Button>
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
                                <div>Некоторые корни китайского происхождения обладают словообразовательной функцией, то есть в сочетании с каким-либо корнем имеют значение лексико-грамматических суффиксов, кроме того, в сочетании с другим корнем могут образовывать новые слова.</div>
                                <div className="inline-flex flex-wrap items-center gap-x-2">Например, корень <b>学</b> в сочетании с другими корнями образует новые слова: <InteractiveText analysis={grammarAnalyses.gakusei} />, <InteractiveText analysis={grammarAnalyses.daigaku} />.</div>
                                <div className="inline-flex flex-wrap items-center gap-x-2">Вместе с тем <b>学</b> используется как суффикс для обозначения теоретических наук: <InteractiveText analysis={grammarAnalyses.bungaku} />, <InteractiveText analysis={grammarAnalyses.shigaku} />.</div>
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
                        <AccordionTrigger className="text-lg md:text-2xl font-semibold bg-muted/50 px-4 rounded-t-lg"><BookOpen className="mr-4 text-primary"/>Тексты, словари и выражения</AccordionTrigger>
                         <AccordionContent className="text-base md:text-lg text-foreground/90 space-y-4 px-6 py-4 border border-t-0 rounded-b-lg">
                            <h4 className="font-bold text-xl mb-2">ТЕКСТ 7-1</h4>
                            <div className="space-y-2">
                                <div><InteractiveText analysis={grammarAnalyses.kore_wa_note_desu} /></div>
                                <div><InteractiveText analysis={grammarAnalyses.sore_wa_pen_desu} /></div>
                                <div><InteractiveText analysis={grammarAnalyses.are_wa_hondana_desu} /></div>
                                <div><InteractiveText analysis={grammarAnalyses.doa_wa_doko_desu_ka} /></div>
                                <div><InteractiveText analysis={grammarAnalyses.enpitsu_wa_dore_desu_ka} /></div>
                            </div>
                             <h4 className="font-bold text-xl mt-4 mb-2">Словарь к тексту 7-1</h4>
                            <div className="space-y-1 text-sm">
                                <div><b>ノート</b> - тетрадь</div>
                                <div><b>これ</b> - это, то</div>
                                <div><b>ペン</b> - ручка</div>
                                <div><b>それ</b> - то</div>
                                <div><b>本棚 (ほんだな)</b> - полка</div>
                                <div><b>あれ</b> - то</div>
                                <div><b>ドア</b> - дверь</div>
                                <div><b>どこ</b> - где?</div>
                                <div><b>鉛筆 (えんぴつ)</b> - карандаш</div>
                                <div><b>どれ</b> - который?</div>
                                <div><b>辞書 (じしょ)</b> - словарь (фонетический)</div>
                                <div><b>図書館 (としょかん)</b> - библиотека</div>
                                <div><b>文学部 (ぶんがくぶ)</b> - филологический факультет</div>
                                <div><b>時計 (とけい)</b> - часы</div>
                                <div><b>大学生 (だいがくせい)</b> - студент университета</div>
                                <div><b>電気 (でんき)</b> - электричество, электрическая лампа</div>
                            </div>
                            <h4 className="font-bold text-xl mt-4 mb-2">ТЕКСТ 7-2</h4>
                            <div className="space-y-2">
                                <div><b>Танака:</b> <InteractiveText analysis={dialogueAnalyses.kore_wa_nan_desuka} /></div>
                                <div><b>Анна:</b> <InteractiveText analysis={dialogueAnalyses.sore_wa_jisho_desu} /></div>
                                <div><b>Танака:</b> <InteractiveText analysis={dialogueAnalyses.nihongo_no_jisho_desuka} /></div>
                                <div><b>Анна:</b> <InteractiveText analysis={dialogueAnalyses.hai_soudesu} /></div>
                            </div>
                             <h4 className="font-bold text-xl mt-4 mb-2">Словарь к тексту 7-2</h4>
                            <div className="space-y-1 text-sm">
                                <div><b>何 (なに/なん)</b> - что?</div>
                                <div><b>そう</b> - так</div>
                                <div><b>天井 (てんじょう)</b> - потолок</div>
                            </div>
                             <h4 className="font-bold text-xl mt-4 mb-2">Словарь к упражнениям</h4>
                            <div className="space-y-1 text-sm">
                                <div><b>チョーク</b> - мел</div>
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
                                <div>Выражение благодарности. В японском языке словами благодарности служат слова ありがとう (Спасибо) или более вежливо - どうもありがとうございました (Большое спасибо). Ответной репликой обычно служит どういたしまして (Не стоит). При выражении благодарности преподавателю, человеку, старше по возрасту или выше по положению, употребляется どうもありがとうございました. Выражение ありがとうございます употребляется в том случае, когда благодарят за то, что делают или дают в данный момент или будет сделано в будущем. Благодарность за то, что сделали или дали в прошлом, передаётся выражением どうもありがとうございました. Кроме того, существует ещё несколько вариантов выражения благодарности, употребляющиеся в разговорной речи - どうも (Спасибо).</div>
                            </div>
                            <div>
                                <h4 className="font-bold text-xl mt-4 mb-2">2. Особенности употребления частиц</h4>
                                <div className="space-y-2">
                                    <div>Частица ね, произнесённая с интонацией удивления, передаёт значения непонимания, удивления, на русский язык может не переводиться, например: <InteractiveText analysis={{sentence: [{ word: 'これ', furigana: 'これ', translation: 'это', partOfSpeech: 'местоимение'}, { word: 'は', furigana: 'は', translation: 'частица (тема)', partOfSpeech: 'частица (тема)'}, { word: '？', furigana: '', translation: 'вопрос', partOfSpeech: 'знак препинания'}], fullTranslation: 'Это?'}} /></div>
                                    <div>Частица あ соответствует русской частице А!, имеющей значение Понятно!, например: <InteractiveText analysis={{sentence: [{ word: 'あ', furigana: 'あ', translation: 'а!', partOfSpeech: 'междометие'}, { word: '、', furigana: '', translation: ',', partOfSpeech: 'знак препинания'}, { word: 'これ', furigana: 'これ', translation: 'это', partOfSpeech: 'местоимение'}, { word: 'は', furigana: 'は', translation: 'частица (тема)', partOfSpeech: 'частица (тема)'}, { word: 'ペン', furigana: 'ペン', translation: 'ручка', partOfSpeech: 'существительное'}, { word: 'です', furigana: 'です', translation: 'есть', partOfSpeech: 'связка'}, { word: '。', furigana: '', translation: '.', partOfSpeech: 'знак препинания'}], fullTranslation: 'А, это ручка.'}} /></div>
                                </div>
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
                    <ExerciseCard title="Упражнение 1: Интонация" description="Отработайте интонацию следующих предложений. (Самостоятельная практика)" canCheck={false}>
                        <div className="space-y-4">
                            <div><InteractiveText analysis={grammarAnalyses.kore_wa_hon_desu} /></div>
                            <div><InteractiveText analysis={dialogueAnalyses.kore_wa_nan_desuka} /></div>
                            <div><InteractiveText analysis={{ sentence: [{ word: 'あれ', furigana: 'あれ', translation: 'то', partOfSpeech: 'местоимение' }, { word: 'は', furigana: 'は', translation: 'частица (тема)', partOfSpeech: 'частица (тема)' }, { word: '図書館', furigana: 'としょかん', translation: 'библиотека', partOfSpeech: 'существительное' }, { word: 'です', furigana: 'です', translation: 'есть (связка)', partOfSpeech: 'связка' }], fullTranslation: 'То - библиотека.'}} /></div>
                            <div><InteractiveText analysis={{ sentence: [{ word: 'どれ', furigana: 'どれ', translation: 'который?', partOfSpeech: 'вопросительное местоимение' }, { word: 'が', furigana: 'が', translation: 'частица', partOfSpeech: 'частица' }, { word: '辞書', furigana: 'じしょ', translation: 'словарь', partOfSpeech: 'существительное' }, { word: 'です', furigana: 'です', translation: 'есть (связка)', partOfSpeech: 'связка' }, { word: 'か', furigana: 'か', translation: 'вопросительная частица', partOfSpeech: 'вопросительная частица' }], fullTranslation: 'Что (из этого) - словарь?'}} /></div>
                            <div><InteractiveText analysis={grammarAnalyses.anohito_wa_gakusei_dewa_arimasenka} /></div>
                        </div>
                    </ExerciseCard>

                    <ExerciseCard title="Упражнение 2: Образование наук" onCheck={showNotImplementedToast} description="Образуйте с помощью суффикса 学 названия теоретических наук от следующих слов и переведите: 法 (закон природы), 語 (слово, язык), 植物 (растение), 動物 (животное), 心理 (душевное состояние), 哲 (мудрец), 運動 (движение).">
                        <p className="text-sm mb-2"><b>Пример:</b> 地 + 学 = 地学 (геология).</p>
                        <Textarea className="mt-2" placeholder="Ваши ответы..." />
                    </ExerciseCard>
                    
                    <ExerciseCard title="Упражнение 3: Перевод" onCheck={showNotImplementedToast} description="Переведите следующие слова, зная значение основы и суффикса 学: 文学, 史学, 物理学, 化学, 数学, 語学, 植物学, 動物学, 心理学, 哲学, 運動学.">
                         <Textarea className="mt-2" placeholder="Ваши ответы..." />
                    </ExerciseCard>

                    <ExerciseCard title="Упражнения 4, 5, 7, 8, 17: Работа с рисунками" canCheck={false}>
                        <div className="flex items-center gap-2 p-3 bg-blue-500/10 rounded-lg">
                            <Lightbulb className="w-5 h-5 text-blue-500 shrink-0" />
                            <p className="text-sm text-blue-800">
                                <b>Примечание:</b> Эти упражнения требуют визуальных материалов (рисунков), которые будут добавлены позже. Пока их можно пропустить.
                            </p>
                        </div>
                    </ExerciseCard>

                    <ExerciseCard title="Упражнение 6: Перевод на японский" onCheck={showNotImplementedToast}>
                        <p>1. Это газета. 2. То учебник. 3. Это потолок. 4. То аудитория. 5. Это карандаш. 6. Это книга. 7. То окно. 8. То стена. 9. То карта. 10. Это фотография. 11. Это ручка. 12. То полка.</p>
                        <Textarea className="mt-2" placeholder="Ваш перевод..." />
                    </ExerciseCard>

                     <ExerciseCard title="Упражнение 9: Отрицательная форма" onCheck={showNotImplementedToast}>
                        <p className='mb-2'>Скажите следующие предложения в отрицательной форме, дополнив вариантом правильного ответа, используя для этого слова, данные в скобках. Переведите.</p>
                        <p className='text-sm mb-4'><b>Пример:</b> Это библиотека. (Университет) → これは図書館ではありません。大学です。</p>
                        <ul className="list-disc list-inside space-y-2">
                            <li>それはノートです。(本)</li>
                            <li>あれは地図です。(絵)</li>
                            <li>これはドアです。(壁)</li>
                            <li>それはひらがなです。(カタカナ)</li>
                        </ul>
                        <Textarea className="mt-2" placeholder="Ваши ответы..." />
                    </ExerciseCard>

                    <ExerciseCard title="Упражнение 10: Перевод на японский" onCheck={showNotImplementedToast}>
                        <p>1. Что это? - Это - стол. 2. Это что? - Это книга. 3. То - что? - То - дверь. 4. Это бумага? - Нет, это не бумага, это газета. 5. То - карта? - Нет, то не карта, то - картина. 6. То - тетрадь, это книга. 8. Это не дверь? - Нет, это не дверь, это стена. 9. Это не хирагана? - Нет, это не хирагана, это катакана. 10. Это не цветок? - Да, это не цветок. 11. Это не коробка? - Да, коробка. 12. Это не телефон? - Да, это телефон. 13. Танака-сан не студент? - Нет, Танака-сан не студент. 14. (Ваш) преподаватель не Ямада-сан? - Да, преподаватель - Ямада-сан.</p>
                        <Textarea className="mt-2" placeholder="Ваши ответы..." />
                    </ExerciseCard>

                    <ExerciseCard title="Упражнение 11: Частица も" onCheck={showNotImplementedToast}>
                        <p className='mb-2'>Дополните следующие предложения словами, данными в скобках, употребив частицу も.</p>
                        <p className='text-sm mb-4'><b>Пример:</b> これはかばんです。(それ) → これはかばんです。それもかばんです。</p>
                        <ul className="list-disc list-inside space-y-2">
                           <li>これは椅子です。(それ)</li>
                           <li>あれは電灯です。(これ)</li>
                           <li>田中さんは学生です。(山田さん)</li>
                           <li>わたしは先生です。(あの人)</li>
                        </ul>
                        <Textarea className="mt-2" placeholder="Ваши ответы..." />
                    </ExerciseCard>

                     <ExerciseCard title="Упражнение 12: Перевод c частицей も" onCheck={showNotImplementedToast}>
                        <p>1. Это коробка. И это коробка. 2. Это стул. И то - стул. 3. Это дверь. И то - дверь. 4. Это лампа. И то - лампа. 5. И это, и то - газеты. 6. И это, и это - фотографии. 7. И то, и это - аудитории. 8. И Анна, и Инна - студентки университета. 9. И я, и он - студенты. 10. И Ямада, и Ямамото - преподаватели. 11. Ни я, ни он не врачи. 12. Ни то, ни это не картины.</p>
                        <Textarea className="mt-2" placeholder="Ваши ответы..." />
                    </ExerciseCard>

                    <ExerciseCard title="Упражнение 13: Вопросы с вопросительным словом" onCheck={showNotImplementedToast}>
                         <p className='mb-2'>Поставьте к следующим предложениям вопросы с вопросительным словом.</p>
                        <p className='text-sm mb-4'><b>Пример:</b> これは本です。→ これは何ですか。</p>
                        <ul className="list-disc list-inside space-y-2">
                           <li>それは鉛筆です。</li>
                           <li>あれは時計です。</li>
                           <li>これは教室です。</li>
                           <li>田中さんが学生です。</li>
                        </ul>
                        <Textarea className="mt-2" placeholder="Ваши вопросы..." />
                    </ExerciseCard>

                    <ExerciseCard title="Упражнение 14: Ответы на вопросы" onCheck={showNotImplementedToast}>
                        <p className='mb-2'>Ответьте на вопросы, имея в виду, что вариант правильного ответа содержит слово, заключённое в скобки.</p>
                        <p className='text-sm mb-4'><b>Пример:</b> どれが本ですか。(これ) → これが本です。</p>
                        <ul className="list-disc list-inside space-y-2">
                           <li>どれが辞書ですか。(それ)</li>
                           <li>どれが地図ですか。(あれ)</li>
                           <li>だれが先生ですか。(山田さん)</li>
                           <li>だれが医者ですか。(田中さん)</li>
                        </ul>
                        <Textarea className="mt-2" placeholder="Ваши ответы..." />
                    </ExerciseCard>

                    <ExerciseCard title="Упражнение 15: Перевод на японский" onCheck={showNotImplementedToast}>
                        <p>1. Кто преподаватель? - Ямада преподаватель. 2. Кто студент? - Танин студент. 3. Что (из имеющихся предметов) - полка? - То - полка. 4. Что (из имеющихся предметов) - часы? - Это - часы. 5. Что (из имеющихся предметов) - классная доска? - Это - классная доска. 6. Какая (у Вас) специальность? - История. 7. Как (Ваше) имя? - Яманака. 8. (Ваш) друг - кто? - (Мой) друг - Сонин. 9. Учебник - что (из имеющихся предметов)? - Учебник - это. 10. Карандаш - что (из имеющихся предметов)? - Карандаш - это. 11. Преподаватель - кто? - Преподаватель - Накада. 12. Студент - кто? - Студент - Санин.</p>
                        <Textarea className="mt-2" placeholder="Ваши ответы..." />
                    </ExerciseCard>
                    
                    <ExerciseCard title="Упражнение 16: Составьте диалоги" onCheck={showNotImplementedToast}>
                         <p className='mb-2'>Составьте диалоги по следующим образцам, заменяя подчёркнутые слова на слова из данного ниже списка. Переведите.</p>
                        <div className='p-2 bg-muted rounded'>
                            <p><b>A:</b> これは何ですか。</p>
                            <p><b>Б:</b> それは<u>時計</u>です。</p>
                            <p><b>A:</b> あ、<u>時計</u>ですね。ありがとうございました。</p>
                            <p><b>Б:</b> どういたしまして。</p>
                        </div>
                        <p className='mt-2'><b>Слова для замены:</b> 鉛筆, ペン, ノート, 辞書, 本, 教科書</p>
                        <Textarea className="mt-2" placeholder="Ваши диалоги..." />
                    </ExerciseCard>

                    <ExerciseCard title="Упражнение 18: Заполните пропуски" onCheck={showNotImplementedToast}>
                        <div className="space-y-4">
                            <div>
                                <h4 className="font-semibold">а) частицы は или も:</h4>
                                <ul className="list-disc list-inside">
                                    <li>これ（　）本です。</li>
                                    <li>それ（　）本です。</li>
                                    <li>田中さん（　）学生です。</li>
                                    <li>山田さん（　）学生です。</li>
                                </ul>
                            </div>
                             <div>
                                <h4 className="font-semibold">б) частицу は или показатель именительного падежа が:</h4>
                                <ul className="list-disc list-inside">
                                    <li>これ（　）何ですか。</li>
                                    <li>どれ（　）辞書ですか。</li>
                                    <li>だれ（　）先生ですか。</li>
                                    <li>田中さん（　）学生です。</li>
                                </ul>
                            </div>
                             <div>
                                <h4 className="font-semibold">в) указательные местоимения これ, それ, あれ:</h4>
                                 <ul className="list-disc list-inside">
                                    <li>（　）は本です。 (рядом с вами)</li>
                                    <li>（　）は何ですか。 (рядом с собеседником)</li>
                                    <li>（　）が図書館です。 (далеко от обоих)</li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="font-semibold">г) вопросительные местоимения だれ, なに, どれ:</h4>
                                 <ul className="list-disc list-inside">
                                    <li>（　）が学生ですか。</li>
                                    <li>（　）がペンですか。</li>
                                    <li>これは（　）ですか。</li>
                                </ul>
                            </div>
                        </div>
                         <Textarea className="mt-4" placeholder="Введите ответы для всех пунктов..." />
                    </ExerciseCard>
                    
                     <ExerciseCard title="Упражнение 19: Составьте вопросы" onCheck={showNotImplementedToast}>
                        <p>Составьте так вопросы, чтобы ответами были следующие предложения.</p>
                        <ul className="list-disc list-inside my-2">
                           <li>これが辞書です。</li>
                           <li>それは時計です。</li>
                           <li>田中さんが先生です。</li>
                           <li>はい、学生です。</li>
                           <li>いいえ、本ではありません。ノートです。</li>
                        </ul>
                        <Textarea className="mt-2" placeholder="Ваши вопросы..." />
                    </ExerciseCard>

                    <ExerciseCard title="Упражнение 20: Составьте предложения" onCheck={showNotImplementedToast}>
                        <p>Составьте предложения, используя следующие слова и грамматические показатели.</p>
                         <ul className="list-disc list-inside my-2">
                           <li>これ, は, 何, ですか</li>
                           <li>どれ, が, 本, ですか</li>
                           <li>それ, も, 辞書, です</li>
                           <li>田中さん, は, 学生, ではありません</li>
                        </ul>
                        <Textarea className="mt-2" placeholder="Ваши предложения..." />
                    </ExerciseCard>

                     <ExerciseCard title="Упражнение 21: Ответьте на вопросы" canCheck={false}>
                        <p>Ответьте на следующие вопросы (самостоятельная практика).</p>
                        <ul className="list-disc list-inside my-2">
                           <li>これは何ですか。</li>
                           <li>どれが時計ですか。</li>
                           <li>だれが先生ですか。</li>
                           <li>あなたは学生ですか。</li>
                           <li>図書館はどこですか。</li>
                        </ul>
                    </ExerciseCard>

                     <ExerciseCard title="Упражнение 22: Перевод на японский" onCheck={showNotImplementedToast}>
                        <p>1. Это книга, то - учебник. 2. Это что? - Это лампа. 3. Это стена? - Нет, это не стена, это дверь. 4. Что (из имеющихся предметов) - кимоно? - Это - кимоно. 5. Что (из имеющихся предметов) учебник? - Это - учебник. 6. Кто Анна? - Я - Анна. 7. Кто врач? - Танин врач. 8. Кто преподаватель? - Ямада преподаватель. 9. Кто студент? - Танака студент университета. 10. Это портфель. - То - тоже портфель? - Нет, то не портфель. 11. Это газета? - Да, и это газета, и то - газета. 12. Накаяма тоже студент? - Да, он тоже студент. 13.</p>
                        <Textarea className="mt-2" placeholder="Ваш перевод..." />
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


    