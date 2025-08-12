
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
        const normalize = (str: string) => str.toLowerCase().replace(/[.,\s。]/g, '');
        
        const userAnswer = normalize(answers[id] || '');
        
        const isCorrect = Array.isArray(correctAnswer) 
            ? correctAnswer.map(c => normalize(c)).includes(userAnswer)
            : userAnswer === normalize(correctAnswer);

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
                                            <div className="font-semibold mt-4">Ответы на такой вопрос:</div>
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
                             <h4 className="font-bold text-xl mt-4 mb-2">Словарь к тексту 7-1</h4>
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
                                <p>В японском языке словами благодарности служат слова ありがとう (Спасибо) или более вежливо - どうもありがとうございました (Большое спасибо). Ответной репликой обычно служит どういたしまして (Не стоит). Выражение ありがとうございます употребляется, когда благодарят за то, что делают в данный момент. Благодарность за то, что было сделано в прошлом, передаётся выражением どうもありがとうございました.</p>
                            </div>
                            <div>
                                <h4 className="font-bold text-xl mt-4 mb-2">2. Особенности употребления частиц</h4>
                                <div>Частица ね, произнесённая с интонацией удивления, передаёт значения непонимания. Например: <InteractiveText analysis={{sentence: [{ word: 'これ', furigana: 'これ', translation: 'это', partOfSpeech: 'местоимение'}, { word: '？', furigana: '', translation: 'вопрос', partOfSpeech: 'знак препинания'}], fullTranslation: 'Это?'}} /></div>
                                <div className="mt-2">Частица あ соответствует русской частице А!, имеющей значение "Понятно!". Например: <InteractiveText analysis={{sentence: [{ word: 'あ', furigana: 'あ', translation: 'а!', partOfSpeech: 'междометие'}, { word: '、', furigana: '', translation: ',', partOfSpeech: 'знак препинания'}, { word: 'これ', furigana: 'これ', translation: 'это', partOfSpeech: 'местоимение'}, { word: 'は', furigana: 'は', translation: 'частица (тема)', partOfSpeech: 'частица (тема)'}, { word: 'ペン', furigana: 'ペン', translation: 'ручка', partOfSpeech: 'существительное'}, { word: 'です', furigana: 'です', translation: 'есть', partOfSpeech: 'связка'}, { word: '。', furigana: '', translation: '.', partOfSpeech: 'знак препинания'}], fullTranslation: 'А, это ручка.'}} /></div>
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
                    <p>Раздел в разработке...</p>
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
