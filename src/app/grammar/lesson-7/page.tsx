
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
import { cn } from '@/lib/utils';

const LESSON_ID = 'grammar-lesson-7';


const ExerciseCard = ({ title, description, children, result, onCheck, canCheck = true }: { title: string; description?: React.ReactNode; children: React.ReactNode; result?: boolean | null; onCheck?: () => void, canCheck?: boolean }) => (
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
        const normalize = (str: string) => str.toLowerCase().replace(/[.,\s。、]/g, '');
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
                    <Card>
                        <CardHeader>
                            <CardTitle>Упражнение 1: Интонация</CardTitle>
                            <CardDescription>Отработайте интонацию следующих предложений (самостоятельная практика).</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2">
                           <InteractiveText analysis={grammarAnalyses.ex_7_1_1} />
                           <InteractiveText analysis={grammarAnalyses.ex_7_1_2} />
                           <InteractiveText analysis={grammarAnalyses.ex_7_1_3} />
                           <InteractiveText analysis={grammarAnalyses.ex_7_1_4} />
                           <InteractiveText analysis={grammarAnalyses.ex_7_1_5} />
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Упражнение 2 и 3: Словообразование</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label htmlFor="ex2" className="mb-2 block"><b>Упражнение 2:</b> Образуйте с помощью суффикса 学 названия наук от слов: 法 (закон), 語 (язык), 植物 (растение), 動物 (животное), 心理 (психика), 哲 (мудрец), 運動 (движение).</Label>
                                <Textarea id="ex2" placeholder="法学 - юриспруденция, ..." value={answers['ex2'] || ''} onChange={(e) => handleInputChange('ex2', e.target.value)} />
                                {createExerciseCheckButton('ex2', "法学,語学,植物学,動物学,心理学,哲学,運動学")}
                            </div>
                            <div>
                                <Label htmlFor="ex3" className="mb-2 block"><b>Упражнение 3:</b> Переведите: 文学, 史学, 物理学, 化学, 数学, 語学, 植物学, 動物学, 心理学, 哲学, 運動学.</Label>
                                <Textarea id="ex3" placeholder="литература, история, ..." value={answers['ex3'] || ''} onChange={(e) => handleInputChange('ex3', e.target.value)} />
                                {createExerciseCheckButton('ex3', "литература,история,физика,химия,математика,лингвистика,ботаника,зоология,психология,философия,кинематика")}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                         <CardHeader>
                             <CardTitle>Упражнения 4, 5, 7, 8: Работа с предметами</CardTitle>
                         </CardHeader>
                         <CardContent>
                             <div className="flex items-start gap-2 p-3 bg-blue-500/10 rounded-lg">
                                <Lightbulb className="w-5 h-5 text-blue-500 shrink-0 mt-1" />
                                <div className="text-sm text-blue-800">
                                    <b>Примечание:</b> Эти упражнения требуют визуальных материалов (рисунков), которые будут добавлены позже. Пока их можно пропустить.
                                </div>
                            </div>
                         </CardContent>
                    </Card>
                    
                     <Card>
                        <CardHeader>
                            <CardTitle>Упражнение 6: Перевод предложений</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Label htmlFor="ex6">Переведите на японский: 1. Это газета. 2. То учебник. 3. Это потолок. 4. То аудитория. 5. Это карандаш. 6. Это книга. 7. То окно. 8. То стена. 9. То карта. 10. Это фотография. 11. Это ручка. 12. То полка.</Label>
                            <Textarea id="ex6" value={answers['ex6'] || ''} onChange={e => handleInputChange('ex6', e.target.value)} className="font-japanese mt-2" placeholder="1. これは新聞です。..." />
                            {createExerciseCheckButton('ex6', ['これは新聞です。それは教科書です。これは天井です。あれは教室です。これは鉛筆です。これは本です。あれは窓です。あれは壁です。あれは地図です。これは写真です。これはペンです。あれは棚です。'])}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Упражнение 9: Отрицание и дополнение</CardTitle>
                            <CardDescription>Скажите предложения в отрицательной форме, дополнив правильным вариантом из скобок.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {[
                                { id: 'ex9-1', sentence: grammarAnalyses.ex_9_1, option: '(本)', answer: 'それはノートではありません。本です。' },
                                { id: 'ex9-2', sentence: grammarAnalyses.ex_9_2, option: '(絵)', answer: 'あれは地図ではありません。絵です。' },
                                { id: 'ex9-3', sentence: grammarAnalyses.ex_9_3, option: '(壁)', answer: 'これはドアではありません。壁です。' },
                                { id: 'ex9-4', sentence: grammarAnalyses.ex_9_4, option: '(カタカナ)', answer: 'それはひらがなではありません。カタカナです。' },
                            ].map(q => (
                                <div key={q.id}>
                                    <Label htmlFor={q.id}><InteractiveText analysis={q.sentence} /> {q.option}</Label>
                                    <Input id={q.id} value={answers[q.id] || ''} onChange={e => handleInputChange(q.id, e.target.value)} className="font-japanese mt-1" />
                                    {createExerciseCheckButton(q.id, q.answer)}
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                    
                    <Card>
                        <CardHeader>
                             <CardTitle>Упражнение 10: Перевод на японский</CardTitle>
                        </CardHeader>
                        <CardContent>
                             <Label htmlFor="ex10">Переведите предложения:</Label>
                             <ul className='list-decimal list-inside text-sm text-muted-foreground my-2'>
                                 <li>Что это? - Это - стол.</li>
                                 <li>Это что? - Это книга.</li>
                                 <li>То - что? - То - дверь.</li>
                                 <li>Это бумага? - Нет, это не бумага, это газета.</li>
                                 <li>То - карта? - Нет, то не карта, то - картина.</li>
                                 <li>То - тетрадь, это книга.</li>
                                 <li>Это не дверь? - Нет, это не дверь, это стена.</li>
                                 <li>Это не хирагана? - Нет, это не хирагана, это катакана.</li>
                                 <li>Это не цветок? - Да, это не цветок.</li>
                                 <li>Это не коробка? - Да, коробка.</li>
                                 <li>Это не телефон? - Да, это телефон.</li>
                                 <li>Танака-сан не студент? - Нет, Танака-сан не студент.</li>
                                 <li>(Ваш) преподаватель не Ямада-сан? - Да, преподаватель - Ямада-сан.</li>
                             </ul>
                             <Textarea id="ex10" value={answers['ex10'] || ''} onChange={e => handleInputChange('ex10', e.target.value)} placeholder="Введите переводы через точку..." className="font-japanese"/>
                             {createExerciseCheckButton('ex10', ['これは何ですか。机です。','これは何ですか。本です。','あれは何ですか。ドアです。','これは紙ですか。いいえ、紙ではありません。新聞です。','あれは地図ですか。いいえ、地図ではありません。絵です。','それはノートです、これは本です。','これはドアではありませんか。いいえ、ドアではありません。壁です。','これはひらがなではありませんか。いいえ、ひらがなではありません。カタカナです。','これは花ではありませんか。はい、花ではありません。','これは箱ではありませんか。はい、箱です。','これは電話ではありませんか。はい、電話です。','田中さんは学生ではありませんか。いいえ、学生ではありません。','先生は山田さんではありませんか。はい、山田さんです。'])}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Упражнение 11: Частица も</CardTitle>
                            <CardDescription>Дополните предложения словами в скобках, используя частицу も.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {[
                                { id: 'ex11-1', sentence: 'これは椅子です。', option: '(それ)', answer: 'これは椅子です。それも椅子です。' },
                                { id: 'ex11-2', sentence: 'あれは電灯です。', option: '(これ)', answer: 'あれは電灯です。これも電灯です。' },
                                { id: 'ex11-3', sentence: '田中さんは学生です。', option: '(山田さん)', answer: '田中さんは学生です。山田さんも学生です。' },
                                { id: 'ex11-4', sentence: 'わたしは先生です。', option: '(あの人)', answer: 'わたしは先生です。あの人も先生です。' },
                            ].map(q => (
                                <div key={q.id}>
                                    <Label htmlFor={q.id}>{q.sentence} {q.option}</Label>
                                    <Input id={q.id} value={answers[q.id] || ''} onChange={e => handleInputChange(q.id, e.target.value)} className="font-japanese mt-1" />
                                    {createExerciseCheckButton(q.id, q.answer)}
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                    
                    <Card>
                        <CardHeader>
                            <CardTitle>Упражнение 12: Перевод с частицей も</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Label htmlFor="ex12">Переведите:</Label>
                             <ul className='list-decimal list-inside text-sm text-muted-foreground my-2'>
                                <li>Это коробка. И это коробка.</li>
                                <li>Это стул. И то - стул.</li>
                                <li>И это, и то - газеты.</li>
                                <li>И Анна, и Инна - студентки университета.</li>
                                <li>Ни я, ни он не врачи.</li>
                             </ul>
                            <Textarea id="ex12" value={answers['ex12'] || ''} onChange={e => handleInputChange('ex12', e.target.value)} className="font-japanese mt-1" />
                             {createExerciseCheckButton('ex12', ['これは箱です。それも箱です。', 'これは椅子です。あれも椅子です。', 'これもあれも新聞です。', 'アンナさんもインナさんも大学生です。', 'わたしも彼も医者ではありません。'])}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Упражнение 13: Вопросы с 何</CardTitle>
                            <CardDescription>Поставьте к предложениям вопросы с вопросительным словом.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {[
                                { id: 'ex13-1', sentence: 'それは鉛筆です。', answer: 'それは何ですか。' },
                                { id: 'ex13-2', sentence: 'あれは時計です。', answer: 'あれは何ですか。' },
                                { id: 'ex13-3', sentence: 'これは教室です。', answer: 'これは何ですか。' },
                                { id: 'ex13-4', sentence: '田中さんが学生です。', answer: '学生は誰ですか。' },
                            ].map(q => (
                                <div key={q.id}>
                                    <Label htmlFor={q.id}>{q.sentence}</Label>
                                    <Input id={q.id} value={answers[q.id] || ''} onChange={e => handleInputChange(q.id, e.target.value)} className="font-japanese mt-1" />
                                    {createExerciseCheckButton(q.id, q.answer)}
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Упражнение 14: Ответы на вопросы</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                           {[
                                { id: 'ex14-1', question: 'どれが辞書ですか。', option: '(それ)', answer: 'それが辞書です。' },
                                { id: 'ex14-2', question: 'どれが地図ですか。', option: '(あれ)', answer: 'あれが地図です。' },
                                { id: 'ex14-3', question: 'だれが先生ですか。', option: '(山田さん)', answer: '山田さんが先生です。' },
                                { id: 'ex14-4', question: 'だれが医者ですか。', option: '(田中さん)', answer: '田中さんが医者です。' },
                           ].map(q => (
                               <div key={q.id}>
                                   <Label htmlFor={q.id}>{q.question} {q.option}</Label>
                                   <Input id={q.id} value={answers[q.id] || ''} onChange={e => handleInputChange(q.id, e.target.value)} className="font-japanese mt-1" />
                                   {createExerciseCheckButton(q.id, q.answer)}
                               </div>
                           ))}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader><CardTitle>Упражнения 15, 16, 17, 21, 22</CardTitle></CardHeader>
                        <CardContent>
                            <div className="flex items-start gap-2 p-3 bg-blue-500/10 rounded-lg">
                                <Lightbulb className="w-5 h-5 text-blue-500 shrink-0 mt-1" />
                                <div className="text-sm text-blue-800">
                                    Эти упражнения требуют более сложной логики (диалоги, работа с изображениями) или повторяют предыдущие. Они будут реализованы в будущих обновлениях.
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                     <Card>
                        <CardHeader>
                            <CardTitle>Упражнение 18: Заполните пропуски</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
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
                                   <span>（</span><Input id="ex18-c1" value={answers['ex18-c1'] || ''} onChange={e=>handleInputChange('ex18-c1', e.target.value)} className="w-20 text-center" /><span>）は本です。(рядом с вами)</span>
                                </div>
                                {createExerciseCheckButton('ex18-c1', 'これ')}
                            </div>
                             <div>
                                <p>г) Вставьте だれ, なに, どれ:</p>
                                <div className='flex items-center gap-1 flex-wrap font-japanese text-lg'>
                                   <span>（</span><Input id="ex18-d1" value={answers['ex18-d1'] || ''} onChange={e=>handleInputChange('ex18-d1', e.target.value)} className="w-12 text-center" /><span>）が学生ですか。</span>
                                </div>
                                 {createExerciseCheckButton('ex18-d1', 'だれ')}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Упражнение 19: Составьте вопросы</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                           {[
                               { id: 'ex19-1', answer: 'これが辞書です。', question: 'どれが辞書ですか。' },
                               { id: 'ex19-2', answer: 'それは時計です。', question: 'それは何ですか。' },
                               { id: 'ex19-3', answer: '田中さんが先生です。', question: 'だれが先生ですか。' },
                               { id: 'ex19-4', answer: 'はい、学生です。', question: 'あなたは学生ですか。' },
                               { id: 'ex19-5', answer: 'いいえ、本ではありません。ノートです。', question: 'これは本ですか。' },
                           ].map(q => (
                               <div key={q.id}>
                                   <Label htmlFor={q.id}>Ответ: {q.answer}</Label>
                                   <Input id={q.id} value={answers[q.id] || ''} onChange={e => handleInputChange(q.id, e.target.value)} className="font-japanese mt-1" />
                                   {createExerciseCheckButton(q.id, q.question)}
                               </div>
                           ))}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Упражнение 20: Составьте предложения</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                           {[
                               { id: 'ex20-1', words: 'これ, は, 何, ですか', answer: 'これは何ですか。' },
                               { id: 'ex20-2', words: 'どれ, が, 本, ですか', answer: 'どれが本ですか。' },
                               { id: 'ex20-3', words: 'それ, も, 辞書, です', answer: 'それも辞書です。' },
                               { id: 'ex20-4', words: '田中さん, は, 学生, ではありません', answer: '田中さんは学生ではありません。' },
                           ].map(q => (
                               <div key={q.id}>
                                   <Label htmlFor={q.id}>Слова: {q.words}</Label>
                                   <Input id={q.id} value={answers[q.id] || ''} onChange={e => handleInputChange(q.id, e.target.value)} className="font-japanese mt-1" />
                                   {createExerciseCheckButton(q.id, q.answer)}
                               </div>
                           ))}
                        </CardContent>
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
