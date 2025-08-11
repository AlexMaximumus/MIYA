
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
    const [answers, setAnswers] = useState<Record<string, any>>({});
    const [results, setResults] = useState<Record<string, boolean | null>>({});

    const handleShare = () => {
        copy(window.location.href)
            .then(() => toast({ title: 'Ссылка скопирована!', description: 'Вы можете поделиться этим уроком с кем угодно.' }))
            .catch(() => toast({ title: 'Ошибка', description: 'Не удалось скопировать ссылку.', variant: 'destructive' }));
    }
    
    const handleInputChange = (id: string, value: string) => {
        setAnswers(prev => ({ ...prev, [id]: value }));
        setResults(prev => ({...prev, [id]: null}));
    };

    const checkAnswer = (id: string, correctAnswer: string | string[]) => {
        const userAnswer = (answers[id] || '').trim().replace(/[.\s。]/g, '');
        const isCorrect = Array.isArray(correctAnswer) 
            ? correctAnswer.map(c => c.replace(/[.\s。]/g, '')).includes(userAnswer)
            : userAnswer === correctAnswer.replace(/[.\s。]/g, '');
        setResults(prev => ({ ...prev, [id]: isCorrect }));
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
                        <p className="text-sm text-primary font-semibold">Урок 3 — Грамматика</p>
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
                                        <p>Предметно-указательные местоимения これ (это), それ (это, то), あれ (то) замещают названия предметов и животных. Между собой они различаются по степени удаления от говорящего:</p>
                                        <ul className="list-disc list-inside space-y-2 mt-2">
                                            <li><b>これ:</b> Предмет у говорящего.</li>
                                            <li><b>それ:</b> Предмет у собеседника.</li>
                                            <li><b>あれ:</b> Предмет далеко от обоих.</li>
                                        </ul>
                                        <p>Например, если у говорящего в руках книга, он скажет <b>これ</b>. Если книга у собеседника — <b>それ</b>. Если они оба смотрят на далёкое здание — <b>あれ</b>.</p>
                                        <p>Эти местоимения могут быть подлежащим или дополнением, но не могут быть определением. Они изменяются по падежам, как существительные, но не имеют формы родительного падежа.</p>
                                    </AccordionContent>
                                </AccordionItem>
                                <AccordionItem value="g-2">
                                     <AccordionTrigger className="text-base md:text-xl font-semibold">§2. Вопросительное местоимение どれ</AccordionTrigger>
                                     <AccordionContent className="text-base md:text-lg text-foreground/90 space-y-4 px-2">
                                        <div>Вопросительным местоимением, соответствующим これ, それ, あれ, является どれ. Оно означает "какой?", "что?" (из имеющихся).</div>
                                        <div className="mt-2">
                                            <InteractiveText analysis={grammarAnalyses.kyoukasho_wa_dore_desuka} />
                                        </div>
                                        <div className="mt-2">
                                            <b>Ответ:</b>
                                            <div className="mt-1"><InteractiveText analysis={grammarAnalyses.kyoukasho_wa_kore_desu} /></div>
                                        </div>
                                     </AccordionContent>
                                </AccordionItem>
                                <AccordionItem value="g-3">
                                     <AccordionTrigger className="text-base md:text-xl font-semibold">§3. Именительный падеж (частица が)</AccordionTrigger>
                                     <AccordionContent className="text-base md:text-lg text-foreground/90 space-y-4 px-2">
                                        <p>Показателем именительного падежа является суффикс <b>が</b>. Он ставится после подлежащего, когда на него падает логическое ударение (новая информация).</p>
                                        <div className="mt-2">
                                            <InteractiveText analysis={grammarAnalyses.kore_ga_hon_desu} />
                                        </div>
                                        <p>Вопросительные слова (<b>だれ</b>, <b>どれ</b>) в роли подлежащего всегда используются с <b>が</b>.</p>
                                        <div className="mt-2"><b>Вопрос:</b> <InteractiveText analysis={grammarAnalyses.daregagakuseidesuka} /></div>
                                        <div className="mt-2"><b>Ответ:</b> <InteractiveText analysis={grammarAnalyses.yamadasan_ga_sensei_desu} /></div>
                                        <div className="mt-4 font-semibold">Сравните:</div>
                                        <ul className="list-disc list-inside space-y-2 mt-2">
                                            <li><div><InteractiveText analysis={grammarAnalyses.kore_wa_hon_desu} /> (Ответ на вопрос "Что это?")</div></li>
                                            <li><div><InteractiveText analysis={grammarAnalyses.kore_ga_hon_desu} /> (Ответ на вопрос "Что из этого книга?")</div></li>
                                        </ul>
                                     </AccordionContent>
                                </AccordionItem>
                                <AccordionItem value="g-4">
                                     <AccordionTrigger className="text-base md:text-xl font-semibold">§4. Частица も</AccordionTrigger>
                                     <AccordionContent className="text-base md:text-lg text-foreground/90 space-y-4 px-2">
                                        <p>Частица <b>も</b> имеет присоединительное значение "тоже", "и... и...". В отрицательных предложениях — "ни... ни...".</p>
                                        <div className="mt-2"><InteractiveText analysis={grammarAnalyses.yamadasan_mo_sensei_desu} /></div>
                                        <div className="mt-2"><InteractiveText analysis={grammarAnalyses.anna_mo_tanakasan_mo_sensei_dewa_arimasen} /></div>
                                     </AccordionContent>
                                </AccordionItem>
                                <AccordionItem value="g-5">
                                     <AccordionTrigger className="text-base md:text-xl font-semibold">§5. Вопросительное предложение в отрицательной форме</AccordionTrigger>
                                     <AccordionContent className="text-base md:text-lg text-foreground/90 space-y-4 px-2">
                                        <p>Задается, когда говорящий ожидает подтверждения своего предположения.</p>
                                        <InteractiveFormula formula="N は N ではありませんか 。" />
                                        <div className="mt-2"><InteractiveText analysis={grammarAnalyses.anohito_wa_gakusei_dewa_arimasenka} /></div>
                                        <div>
                                            <p className="font-semibold mt-4">Ответы на такой вопрос:</p>
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
                               <p>Некоторые корни китайского происхождения обладают словообразовательной функцией. Например, корень <b>学</b> в сочетании с другими корнями образует новые слова, а также может использоваться как суффикс для обозначения теоретических наук.</p>
                                <div className="space-y-2 mt-2">
                                    <div><b>Примеры слов:</b> <InteractiveText analysis={grammarAnalyses.gakusei} />, <InteractiveText analysis={grammarAnalyses.daigaku} />.</div>
                                    <div><b>Примеры наук:</b> <InteractiveText analysis={grammarAnalyses.bungaku} />, <InteractiveText analysis={grammarAnalyses.shigaku} />.</div>
                                </div>
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
                            <h4 className="font-bold text-xl mt-4 mb-2">Иероглифы урока 3</h4>
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
                            <h4 className="font-bold text-xl mb-2">ТЕКСТ 3-1</h4>
                            <div className="space-y-2">
                                <div><InteractiveText analysis={grammarAnalyses.kore_wa_note_desu} /></div>
                                <div><InteractiveText analysis={grammarAnalyses.sore_wa_pen_desu} /></div>
                                <div><InteractiveText analysis={grammarAnalyses.are_wa_hondana_desu} /></div>
                                <div><InteractiveText analysis={grammarAnalyses.doa_wa_doko_desu_ka} /></div>
                                <div><InteractiveText analysis={grammarAnalyses.enpitsu_wa_dore_desu_ka} /></div>
                            </div>
                             <h4 className="font-bold text-xl mt-4 mb-2">Словарь к тексту 3-1</h4>
                            <div className="space-y-1 text-sm columns-2">
                                <div><b>ノート</b> - тетрадь</div>
                                <div><b>これ</b> - это</div>
                                <div><b>ペン</b> - ручка</div>
                                <div><b>それ</b> - то</div>
                                <div><b>本棚 (ほんだな)</b> - книжная полка</div>
                                <div><b>あれ</b> - то (далеко)</div>
                                <div><b>ドア</b> - дверь</div>
                                <div><b>どこ</b> - где?</div>
                                <div><b>鉛筆 (えんぴつ)</b> - карандаш</div>
                                <div><b>どれ</b> - который?</div>
                                <div><b>辞書 (じしょ)</b> - словарь</div>
                                <div><b>図書館 (としょかん)</b> - библиотека</div>
                                <div><b>文学部 (ぶんがくぶ)</b> - филологический факультет</div>
                                <div><b>時計 (とけい)</b> - часы</div>
                                <div><b>大学生 (だいがくせい)</b> - студент университета</div>
                                <div><b>電気 (でんき)</b> - электричество, лампа</div>
                            </div>
                            <h4 className="font-bold text-xl mt-4 mb-2">ТЕКСТ 3-2</h4>
                            <div className="space-y-2">
                                <div><b>Танака:</b> <InteractiveText analysis={dialogueAnalyses.kore_wa_nan_desuka} /></div>
                                <div><b>Анна:</b> <InteractiveText analysis={dialogueAnalyses.sore_wa_jisho_desu} /></div>
                                <div><b>Танака:</b> <InteractiveText analysis={dialogueAnalyses.nihongo_no_jisho_desuka} /></div>
                                <div><b>Анна:</b> <InteractiveText analysis={dialogueAnalyses.hai_soudesu} /></div>
                            </div>
                             <h4 className="font-bold text-xl mt-4 mb-2">Словарь к тексту 3-2</h4>
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
                                <p>В японском языке словами благодарности служат слова ありがとう (Спасибо) или более вежливо - どうもありがとうございました (Большое спасибо). Ответной репликой обычно служит どういたしまして (Не стоит). Выражение ありがとうございます употребляется, когда благодарят за то, что делают в данный момент. Благодарность за то, что было сделано в прошлом, передаётся выражением どうもありがとうございました.</p>
                            </div>
                            <div>
                                <h4 className="font-bold text-xl mt-4 mb-2">2. Особенности употребления частиц</h4>
                                <div className="space-y-2">
                                    <div className="flex flex-wrap items-center gap-x-2">Частица ね, произнесённая с интонацией удивления, передаёт значение непонимания. Например: <InteractiveText analysis={{sentence: [{ word: 'これ', furigana: 'これ', translation: 'это', partOfSpeech: 'местоимение'}, { word: '？', furigana: '', translation: 'вопрос', partOfSpeech: 'знак препинания'}], fullTranslation: 'Это?'}} /></div>
                                    <div className="flex flex-wrap items-center gap-x-2">Частица あ соответствует русской частице А!, имеющей значение "Понятно!". Например: <InteractiveText analysis={{sentence: [{ word: 'あ', furigana: 'あ', translation: 'а!', partOfSpeech: 'междометие'}, { word: '、', furigana: '', translation: ',', partOfSpeech: 'знак препинания'}, { word: 'これ', furigana: 'これ', translation: 'это', partOfSpeech: 'местоимение'}, { word: 'は', furigana: 'は', translation: 'частица (тема)', partOfSpeech: 'частица (тема)'}, { word: 'ペン', furigana: 'ペン', translation: 'ручка', partOfSpeech: 'существительное'}, { word: 'です', furigana: 'です', translation: 'есть', partOfSpeech: 'связка'}, { word: '。', furigana: '', translation: '.', partOfSpeech: 'знак препинания'}], fullTranslation: 'А, это ручка.'}} /></div>
                                </div>
                            </div>
                            <div>
                                <h4 className="font-bold text-xl mt-4 mb-2">3. Указание на предметы</h4>
                                <p>В некоторых случаях, когда собеседники находятся рядом с каким-либо предметом, то оба, указывая на него, могут сказать これ.</p>
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
                
                <h2 className="text-3xl font-bold text-foreground mb-8 mt-12 text-center">📝 Закрепление</h2>
                 <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Упражнение 1: Интонация</CardTitle>
                            <CardDescription>Прочтите вслух, обращая внимание на интонацию. (Самостоятельная практика)</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                           <InteractiveText analysis={grammarAnalyses.kore_wa_hon_desu} />
                           <InteractiveText analysis={dialogueAnalyses.kore_wa_nan_desuka} />
                           <InteractiveText analysis={{ sentence: [{ word: 'あれ', furigana: 'あれ', translation: 'то', partOfSpeech: 'местоимение' }, { word: 'は', furigana: 'は', translation: 'частица (тема)', partOfSpeech: 'частица (тема)' }, { word: '図書館', furigana: 'としょかん', translation: 'библиотека', partOfSpeech: 'существительное' }, { word: 'です', furigana: 'です', translation: 'есть (связка)', partOfSpeech: 'связка' }], fullTranslation: 'То - библиотека.'}} />
                           <InteractiveText analysis={{ sentence: [{ word: 'どれ', furigana: 'どれ', translation: 'который?', partOfSpeech: 'вопросительное местоимение' }, { word: 'が', furigana: 'が', translation: 'частица', partOfSpeech: 'частица' }, { word: '辞書', furigana: 'じしょ', translation: 'словарь', partOfSpeech: 'существительное' }, { word: 'です', furigana: 'です', translation: 'есть (связка)', partOfSpeech: 'связка' }, { word: 'か', furigana: 'か', translation: 'вопросительная частица', partOfSpeech: 'вопросительная частица' }], fullTranslation: 'Что (из этого) - словарь?'}} />
                           <InteractiveText analysis={grammarAnalyses.anohito_wa_gakusei_dewa_arimasenka} />
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Упражнение 2 и 3</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
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
                        </CardContent>
                        <CardFooter>
                            <Button disabled>Проверить (в разработке)</Button>
                        </CardFooter>
                    </Card>

                     <Card>
                        <CardHeader>
                            <CardTitle>Упражнения 4, 5, 7, 8, 17: Работа с рисунками</CardTitle>
                        </CardHeader>
                         <CardContent>
                            <div className="flex items-center gap-2 p-3 bg-blue-500/10 rounded-lg mt-2">
                                <Lightbulb className="w-5 h-5 text-blue-500 shrink-0" />
                                <div className="text-sm text-blue-800">
                                    <b>Примечание:</b> Эти упражнения требуют визуальных материалов (рисунков), которые будут добавлены позже. Пока их можно пропустить.
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Упражнение 9: Отрицательная форма</CardTitle>
                            <CardDescription>Скажите предложения в отрицательной форме, дополнив правильным ответом из скобок.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {[
                                { id: 'ex9-1', question: 'それはノートです。(本)', answer: 'それはノートではありません。本です。' },
                                { id: 'ex9-2', question: 'あれは地図です。(絵)', answer: 'あれは地図ではありません。絵です。' },
                                { id: 'ex9-3', question: 'これはドアです。(壁)', answer: 'これはドアではありません。壁です。' },
                                { id: 'ex9-4', question: 'それはひらがなです。(カタカナ)', answer: 'それはひらがなではありません。カタカナです。' },
                            ].map(item => (
                                <div key={item.id}>
                                    <Label htmlFor={item.id}>{item.question}</Label>
                                    <Input id={item.id} className="font-japanese mt-1" value={answers[item.id] || ''} onChange={e => handleInputChange(item.id, e.target.value)} />
                                     <Button size="sm" className="mt-2" onClick={() => checkAnswer(item.id, item.answer)}>Проверить</Button>
                                     {results[item.id] !== null && (results[item.id] ? <CheckCircle className="text-green-500 inline-block ml-2" /> : <XCircle className="text-destructive inline-block ml-2" />)}
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    <Card>
                         <CardHeader><CardTitle>Упражнения на перевод (6, 10, 12, 15, 22)</CardTitle><CardDescription>Переведите предложения на японский язык.</CardDescription></CardHeader>
                         <CardContent>
                            <Textarea placeholder="Введите здесь перевод для всех предложений..." className="min-h-[200px]" />
                            <div className="text-xs text-muted-foreground mt-2">Проверка для этих упражнений будет добавлена позже.</div>
                         </CardContent>
                    </Card>
                    
                    <Card>
                        <CardHeader><CardTitle>Упражнение 11: Частица も</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                            {[
                                { id: 'ex11-1', question: 'これは椅子です。(それ)', answer: 'これは椅子です。それも椅子です。' },
                                { id: 'ex11-2', question: 'あれは電灯です。(これ)', answer: 'あれは電灯です。これも電灯です。' },
                                { id: 'ex11-3', question: '田中さんは学生です。(山田さん)', answer: '田中さんは学生です。山田さんも学生です。' },
                                { id: 'ex11-4', question: 'わたしは先生です。(あの人)', answer: 'わたしは先生です。あの人も先生です。' },
                            ].map(item => (
                                <div key={item.id}>
                                    <Label htmlFor={item.id}>{item.question}</Label>
                                    <Input id={item.id} className="font-japanese mt-1" value={answers[item.id] || ''} onChange={e => handleInputChange(item.id, e.target.value)} />
                                    <Button size="sm" className="mt-2" onClick={() => checkAnswer(item.id, item.answer)}>Проверить</Button>
                                    {results[item.id] !== null && (results[item.id] ? <CheckCircle className="text-green-500 inline-block ml-2" /> : <XCircle className="text-destructive inline-block ml-2" />)}
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                     <Card>
                        <CardHeader><CardTitle>Упражнение 13: Вопросы с вопросительным словом</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                             {[
                                { id: 'ex13-1', question: 'それは鉛筆です。', answer: 'それは何ですか。' },
                                { id: 'ex13-2', question: 'あれは時計です。', answer: 'あれは何ですか。' },
                                { id: 'ex13-3', question: 'これは教室です。', answer: 'これは何ですか。' },
                                { id: 'ex13-4', question: '田中さんが学生です。', answer: 'だれが学生ですか。' },
                            ].map(item => (
                                <div key={item.id}>
                                    <Label htmlFor={item.id}>Дано: {item.question}</Label>
                                    <Input id={item.id} placeholder="Ваш вопрос..." className="font-japanese mt-1" value={answers[item.id] || ''} onChange={e => handleInputChange(item.id, e.target.value)} />
                                    <Button size="sm" className="mt-2" onClick={() => checkAnswer(item.id, item.answer)}>Проверить</Button>
                                    {results[item.id] !== null && (results[item.id] ? <CheckCircle className="text-green-500 inline-block ml-2" /> : <XCircle className="text-destructive inline-block ml-2" />)}
                                </div>
                             ))}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader><CardTitle>Упражнение 14: Ответы на вопросы</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                            {[
                                 { id: 'ex14-1', question: 'どれが辞書ですか。(それ)', answer: 'それが辞書です。' },
                                 { id: 'ex14-2', question: 'どれが地図ですか。(あれ)', answer: 'あれが地図です。' },
                                 { id: 'ex14-3', question: 'だれが先生ですか。(山田さん)', answer: '山田さんが先生です。' },
                                 { id: 'ex14-4', question: 'だれが医者ですか。(田中さん)', answer: '田中さんが医者です。' },
                            ].map(item => (
                                <div key={item.id}>
                                    <Label htmlFor={item.id}>{item.question}</Label>
                                    <Input id={item.id} className="font-japanese mt-1" value={answers[item.id] || ''} onChange={e => handleInputChange(item.id, e.target.value)} />
                                    <Button size="sm" className="mt-2" onClick={() => checkAnswer(item.id, item.answer)}>Проверить</Button>
                                    {results[item.id] !== null && (results[item.id] ? <CheckCircle className="text-green-500 inline-block ml-2" /> : <XCircle className="text-destructive inline-block ml-2" />)}
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                    
                    <Card>
                        <CardHeader><CardTitle>Упражнение 16: Составьте диалоги</CardTitle></CardHeader>
                        <CardContent><p className="text-muted-foreground">В разработке...</p></CardContent>
                    </Card>
    
                    <Card>
                        <CardHeader><CardTitle>Упражнение 18: Заполните пропуски</CardTitle></CardHeader>
                        <CardContent className="space-y-6">
                             <div>
                                <h4 className="font-semibold mb-2">а) частицы は или も:</h4>
                                {[
                                    { id: 'ex18a-1', text: ['これ', '本です。'], answer: 'は' },
                                    { id: 'ex18a-2', text: ['それ', '本です。'], answer: 'も' },
                                    { id: 'ex18a-3', text: ['田中さん', '学生です。'], answer: 'は' },
                                    { id: 'ex18a-4', text: ['山田さん', '学生です。'], answer: 'も' },
                                ].map(item => (
                                    <div key={item.id} className="flex items-center gap-1 flex-wrap">
                                        <Label htmlFor={item.id}>{item.text[0]}</Label>
                                        <Input id={item.id} className="w-16 font-japanese" value={answers[item.id] || ''} onChange={e => handleInputChange(item.id, e.target.value)} />
                                        <Label>{item.text[1]}</Label>
                                        <Button variant="ghost" size="sm" onClick={() => checkAnswer(item.id, item.answer)}>✔️</Button>
                                        {results[item.id] !== null && (results[item.id] ? <CheckCircle className="text-green-500 inline-block ml-2" /> : <XCircle className="text-destructive inline-block ml-2" />)}
                                    </div>
                                ))}
                             </div>
                             <div>
                                <h4 className="font-semibold mb-2">б) частицу は или が:</h4>
                                 {[
                                    { id: 'ex18b-1', text: ['これ', '何ですか。'], answer: 'は' },
                                    { id: 'ex18b-2', text: ['どれ', '辞書ですか。'], answer: 'が' },
                                    { id: 'ex18b-3', text: ['だれ', '先生ですか。'], answer: 'が' },
                                    { id: 'ex18b-4', text: ['田中さん', '学生です。'], answer: 'は' },
                                ].map(item => (
                                    <div key={item.id} className="flex items-center gap-1 flex-wrap">
                                        <Label htmlFor={item.id}>{item.text[0]}</Label>
                                        <Input id={item.id} className="w-16 font-japanese" value={answers[item.id] || ''} onChange={e => handleInputChange(item.id, e.target.value)} />
                                        <Label>{item.text[1]}</Label>
                                        <Button variant="ghost" size="sm" onClick={() => checkAnswer(item.id, item.answer)}>✔️</Button>
                                        {results[item.id] !== null && (results[item.id] ? <CheckCircle className="text-green-500 inline-block ml-2" /> : <XCircle className="text-destructive inline-block ml-2" />)}
                                    </div>
                                ))}
                             </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader><CardTitle>Упражнения 19, 20, 21</CardTitle></CardHeader>
                        <CardContent><p className="text-muted-foreground">В разработке...</p></CardContent>
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
