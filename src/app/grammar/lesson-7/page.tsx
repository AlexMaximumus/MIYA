
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowLeft, Share2, Volume2, BookOpen, CheckCircle, XCircle, Lightbulb, HelpCircle } from 'lucide-react';
import Link from 'next/link';
import InteractiveText from '@/components/interactive-text';
import InteractiveFormula from '@/components/interactive-formula';
import { grammarAnalyses, dialogueAnalyses, phoneticsAnalyses } from '@/ai/precomputed-analysis';
import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

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

const ExerciseCard = ({ title, children }: { title: string; children: React.ReactNode; }) => (
    <Card>
        <CardHeader>
            <CardTitle className="text-lg md:text-xl">{title}</CardTitle>
        </CardHeader>
        <CardContent>{children}</CardContent>
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

    const createExerciseCheckButton = (id: string, correctAnswer: string | string[]) => (
        <div className='flex items-center mt-2'>
            <Button size="sm" onClick={() => checkAnswer(id, correctAnswer)}>Проверить</Button>
            {results[id] === true && <CheckCircle className="text-green-500 ml-2"/>}
            {results[id] === false && <XCircle className="text-destructive ml-2"/>}
        </div>
    );
    

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
                            <div className="space-y-1 text-sm columns-2">
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
                                <div><b>辞書 (じしょ)</b> - словарь</div>
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
                            <h4 className="font-bold text-xl mt-4 mb-2">ОБИХОДНЫЕ ВЫРАЖЕНИЯ</h4>
                             <div className="space-y-2">
                                <div><InteractiveText analysis={dialogueAnalyses.wakarimashita} /></div>
                                <div><InteractiveText analysis={dialogueAnalyses.doumo_arigatou_gozaimashita} /></div>
                                <div><InteractiveText analysis={dialogueAnalyses.dou_itashimashite} /></div>
                             </div>
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
                                    <p>Частица ね, произнесённая с интонацией удивления, передаёт значения непонимания, удивления, на русский язык может не переводиться, например: <InteractiveText analysis={{sentence: [{ word: 'これ', furigana: 'これ', translation: 'это', partOfSpeech: 'местоимение'}, { word: '？', furigana: '', translation: 'вопрос', partOfSpeech: 'знак препинания'}], fullTranslation: 'Это?'}} /></p>
                                    <p>Частица あ соответствует русской частице А!, имеющей значение "Понятно!". Например: <InteractiveText analysis={{sentence: [{ word: 'あ', furigana: 'あ', translation: 'а!', partOfSpeech: 'междометие'}, { word: '、', furigana: '', translation: ',', partOfSpeech: 'знак препинания'}, { word: 'これ', furigana: 'これ', translation: 'это', partOfSpeech: 'местоимение'}, { word: 'は', furigana: 'は', translation: 'частица (тема)', partOfSpeech: 'частица (тема)'}, { word: 'ペン', furigana: 'ペン', translation: 'ручка', partOfSpeech: 'существительное'}, { word: 'です', furigana: 'です', translation: 'есть', partOfSpeech: 'связка'}, { word: '。', furigana: '', translation: '.', partOfSpeech: 'знак препинания'}], fullTranslation: 'А, это ручка.'}} /></p>
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
                    <ExerciseCard title="Упражнение 1: Интонация">
                        <p>Отработайте интонацию следующих предложений (самостоятельная практика).</p>
                        <div className="space-y-2 mt-2">
                            <InteractiveText analysis={grammarAnalyses.kore_wa_hon_desu} />
                            <InteractiveText analysis={dialogueAnalyses.kore_wa_nan_desuka} />
                            <InteractiveText analysis={{ sentence: [{ word: 'あれ', furigana: 'あれ', translation: 'то', partOfSpeech: 'местоимение' }, { word: 'は', furigana: 'は', translation: 'частица', partOfSpeech: 'частица' }, { word: '図書館', furigana: 'としょかん', translation: 'библиотека', partOfSpeech: 'существительное' }, { word: 'です', furigana: 'です', translation: 'есть', partOfSpeech: 'связка' }], fullTranslation: 'То — библиотека.' }} />
                            <InteractiveText analysis={{ sentence: [{ word: 'どれ', furigana: 'どれ', translation: 'который', partOfSpeech: 'местоимение' }, { word: 'が', furigana: 'が', translation: 'частица', partOfSpeech: 'частица' }, { word: '辞書', furigana: 'じしょ', translation: 'словарь', partOfSpeech: 'существительное' }, { word: 'です', furigana: 'です', translation: 'есть', partOfSpeech: 'связка' }, { word: 'か', furigana: 'か', translation: 'вопрос', partOfSpeech: 'частица' }], fullTranslation: 'Который из них словарь?' }} />
                            <InteractiveText analysis={grammarAnalyses.anohito_wa_gakusei_dewa_arimasenka} />
                        </div>
                    </ExerciseCard>

                    <ExerciseCard title="Упражнение 2 и 3: Словообразование с 学">
                         <div className="space-y-4">
                            <div>
                                <Label>Образуйте и переведите науки: 法 (закон), 語 (язык), 植物 (растение), 動物 (животное), 心理 (психика), 哲 (философия), 運動 (движение).</Label>
                                <Textarea id="ex2" value={answers['ex2'] || ''} onChange={(e) => handleInputChange('ex2', e.target.value)} className="mt-2" placeholder="Например: 地学 - геология, ..."/>
                            </div>
                             <div>
                                <Label>Переведите: 文学, 史学, 物理学, 化学, 数学, 語学, 植物学, 動物学, 心理学, 哲学, 運動学.</Label>
                                <Textarea id="ex3" value={answers['ex3'] || ''} onChange={(e) => handleInputChange('ex3', e.target.value)} className="mt-2" placeholder="Например: литература, ..."/>
                            </div>
                         </div>
                    </ExerciseCard>

                    <ExerciseCard title="Упражнение 4, 5, 7, 8: Работа с предметами">
                        <div className="flex items-start gap-2 p-3 bg-blue-500/10 rounded-lg">
                            <HelpCircle className="w-8 h-8 text-blue-500 shrink-0 mt-1" />
                            <div className="text-sm text-blue-800">
                                <p><b>Примечание:</b> Эти упражнения требуют визуальных материалов (рисунков), которые пока отсутствуют. Поэтому задания упрощены. Представьте, что перед вами <b>книга (本)</b>, у собеседника <b>ручка (ペン)</b>, а вдалеке <b>библиотека (図書館)</b>.</p>
                            </div>
                        </div>
                        <div className="space-y-4 mt-4">
                             <div>
                                <Label htmlFor='ex4-1'>Вставьте слово: これは ( ... ) です。</Label>
                                <Input id="ex4-1" value={answers['ex4-1'] || ''} onChange={e => handleInputChange('ex4-1', e.target.value)} className="font-japanese" />
                                {createExerciseCheckButton('ex4-1', '本')}
                            </div>
                             <div>
                                <Label htmlFor='ex6'>Переведите: 1. Это газета. 2. То учебник. 3. Это потолок. 4. То аудитория.</Label>
                                <Textarea id="ex6" value={answers['ex6'] || ''} onChange={e => handleInputChange('ex6', e.target.value)} className="font-japanese" placeholder="1. これは新聞です。..." />
                            </div>
                        </div>
                    </ExerciseCard>
                    
                     <ExerciseCard title="Упражнение 9: Отрицание и дополнение">
                        <div className="space-y-4">
                            {[
                                { id: 'ex9-1', sentence: 'それはノートです。', option: '(本)', answer: 'それはノートではありません。本です。' },
                                { id: 'ex9-2', sentence: 'あれは地図です。', option: '(絵)', answer: 'あれは地図ではありません。絵です。' },
                                { id: 'ex9-3', sentence: 'これはドアです。', option: '(壁)', answer: 'これはドアではありません。壁です。' },
                                { id: 'ex9-4', sentence: 'それはひらがなです。', option: '(カタカナ)', answer: 'それはひらがなではありません。カタカナです。' },
                            ].map(q => (
                                <div key={q.id}>
                                    <Label htmlFor={q.id}>{q.sentence} {q.option}</Label>
                                    <Input id={q.id} value={answers[q.id] || ''} onChange={e => handleInputChange(q.id, e.target.value)} className="font-japanese mt-1" />
                                    {createExerciseCheckButton(q.id, q.answer)}
                                </div>
                            ))}
                        </div>
                    </ExerciseCard>

                    <ExerciseCard title="Упражнение 10: Перевод на японский">
                        <div className="space-y-2">
                             <Label>Переведите предложения:</Label>
                             <ul className='list-decimal list-inside text-sm text-muted-foreground'>
                                 <li>Что это? - Это - стол.</li>
                                 <li>Это бумага? - Нет, это не бумага, это газета.</li>
                                 <li>То - карта? - Нет, то не карта, то - картина.</li>
                                 <li>Это не дверь? - Нет, это не дверь, это стена.</li>
                                 <li>Это не цветок? - Да, это не цветок.</li>
                                 <li>Это не коробка? - Да, коробка.</li>
                             </ul>
                             <Textarea id="ex10" value={answers['ex10'] || ''} onChange={e => handleInputChange('ex10', e.target.value)} placeholder="Введите переводы через точку..." className="font-japanese"/>
                        </div>
                    </ExerciseCard>

                    <ExerciseCard title="Упражнение 11 и 12: Частица も">
                         <div className="space-y-4">
                            <div>
                                <Label>Дополните, используя も: これは椅子です。(それ)</Label>
                                <Input id="ex11-1" value={answers['ex11-1'] || ''} onChange={e => handleInputChange('ex11-1', e.target.value)} className="font-japanese" />
                                {createExerciseCheckButton('ex11-1', 'これは椅子です。それも椅子です。')}
                            </div>
                            <div>
                                <Label>Переведите: 1. Это коробка. И это коробка. 2. И Анна, и Инна - студентки. 3. Ни я, ни он не врачи.</Label>
                                <Textarea id="ex12" value={answers['ex12'] || ''} onChange={e => handleInputChange('ex12', e.target.value)} className="font-japanese"/>
                            </div>
                         </div>
                    </ExerciseCard>

                    <ExerciseCard title="Упражнение 13, 14, 15: Вопросы и ответы">
                        <div className="space-y-4">
                            <div>
                                <Label htmlFor="ex13-1">Поставьте вопрос: それは鉛筆です。</Label>
                                <Input id="ex13-1" value={answers['ex13-1'] || ''} onChange={e => handleInputChange('ex13-1', e.target.value)} className="font-japanese"/>
                                {createExerciseCheckButton('ex13-1', 'それは何ですか。')}
                            </div>
                             <div>
                                <Label htmlFor="ex14-1">Ответьте на вопрос: どれが辞書ですか。(それ)</Label>
                                <Input id="ex14-1" value={answers['ex14-1'] || ''} onChange={e => handleInputChange('ex14-1', e.target.value)} className="font-japanese"/>
                                {createExerciseCheckButton('ex14-1', 'それが辞書です。')}
                            </div>
                             <div>
                                <Label htmlFor="ex15-1">Переведите: Кто преподаватель? - Ямада преподаватель.</Label>
                                <Input id="ex15-1" value={answers['ex15-1'] || ''} onChange={e => handleInputChange('ex15-1', e.target.value)} className="font-japanese"/>
                                {createExerciseCheckButton('ex15-1', 'だれが先生ですか。山田さんが先生です。')}
                            </div>
                        </div>
                    </ExerciseCard>

                    <ExerciseCard title="Упражнение 16: Составьте диалог">
                         <div>
                            <p className='text-sm text-muted-foreground mb-2'>Составьте диалог по образцу, используя слово <b>鉛筆 (карандаш)</b>.</p>
                            <div className='p-2 bg-muted rounded-md'>
                                <p>А: これは何ですか。</p>
                                <p>Б: それは時計です。</p>
                                <p>А: あ、時計ですね。ありがとうございました。</p>
                                <p>Б: どういたしまして。</p>
                            </div>
                             <Textarea id="ex16" value={answers['ex16'] || ''} onChange={e => handleInputChange('ex16', e.target.value)} className="font-japanese mt-2" placeholder="A: ..."/>
                         </div>
                    </ExerciseCard>

                     <ExerciseCard title="Упражнение 18: Заполните пропуски">
                        <div className="space-y-4">
                            <div>
                                <p>а) Вставьте は или も:</p>
                                <div className='flex items-center gap-1 flex-wrap font-japanese text-lg'>
                                    <span>これ</span><Input id="ex18-a1" value={answers['ex18-a1'] || ''} onChange={e=>handleInputChange('ex18-a1', e.target.value)} className="w-12 text-center" /><span>本です。</span>
                                    <span>それ</span><Input id="ex18-a2" value={answers['ex18-a2'] || ''} onChange={e=>handleInputChange('ex18-a2', e.target.value)} className="w-12 text-center" /><span>本です。</span>
                                </div>
                                {createExerciseCheckButton('ex18-a1', 'は')}
                                {createExerciseCheckButton('ex18-a2', 'も')}
                            </div>
                            <div>
                                <p>б) Вставьте は или が:</p>
                                <div className='flex items-center gap-1 flex-wrap font-japanese text-lg'>
                                    <span>これ</span><Input id="ex18-b1" value={answers['ex18-b1'] || ''} onChange={e=>handleInputChange('ex18-b1', e.target.value)} className="w-12 text-center" /><span>何ですか。</span>
                                    <span>どれ</span><Input id="ex18-b2" value={answers['ex18-b2'] || ''} onChange={e=>handleInputChange('ex18-b2', e.target.value)} className="w-12 text-center" /><span>辞書ですか。</span>
                                </div>
                                {createExerciseCheckButton('ex18-b1', 'は')}
                                {createExerciseCheckButton('ex18-b2', 'が')}
                            </div>
                            <div>
                                <p>в) Вставьте これ, それ, или あれ:</p>
                                <div className='flex items-center gap-1 flex-wrap font-japanese text-lg'>
                                    <span>( ... )</span><Input id="ex18-c1" value={answers['ex18-c1'] || ''} onChange={e=>handleInputChange('ex18-c1', e.target.value)} className="w-20 text-center" /><span>は本です。(рядом с вами)</span>
                                </div>
                                {createExerciseCheckButton('ex18-c1', 'これ')}
                            </div>
                        </div>
                    </ExerciseCard>

                    <ExerciseCard title="Упражнение 19, 20, 21, 22: Итоговая практика">
                        <div className="space-y-4">
                             <div>
                                <Label htmlFor="ex19">Составьте вопрос к ответу: これが辞書です。</Label>
                                <Input id="ex19" value={answers['ex19'] || ''} onChange={e => handleInputChange('ex19', e.target.value)} className="font-japanese mt-1" />
                                {createExerciseCheckButton('ex19', 'どれが辞書ですか')}
                             </div>
                              <div>
                                <Label htmlFor="ex20">Составьте предложение из слов: これ, は, 何, ですか</Label>
                                <Input id="ex20" value={answers['ex20'] || ''} onChange={e => handleInputChange('ex20', e.target.value)} className="font-japanese mt-1" />
                                {createExerciseCheckButton('ex20', 'これは何ですか')}
                             </div>
                             <div>
                                <Label htmlFor="ex22">Переведите: Это книга, то - учебник.</Label>
                                <Input id="ex22" value={answers['ex22'] || ''} onChange={e => handleInputChange('ex22', e.target.value)} className="font-japanese mt-1" />
                                {createExerciseCheckButton('ex22', 'これは本です、それは教科書です')}
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

