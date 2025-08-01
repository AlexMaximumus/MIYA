
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, CheckCircle, XCircle, Share2, HelpCircle } from 'lucide-react';
import Link from 'next/link';
import InteractiveText from '@/components/interactive-text';
import InteractiveFormula from '@/components/interactive-formula';
import { grammarAnalyses } from '@/ai/precomputed-analysis';
import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard';
import { useToast } from '@/hooks/use-toast';


type ExerciseType = 'multiple-choice' | 'construct' | 'select-correct' | 'fill-in-the-blank';

interface Exercise {
    id: string;
    type: ExerciseType;
    title: string;
    description: string;
    options: any[];
    correctAnswer: any;
}

const exercises: Exercise[] = [
    {
        id: 'q1',
        type: 'select-correct',
        title: 'Упражнение 1: Отметь вопрос с вопросительным словом',
        description: 'Какое из предложений содержит вопросительное слово?',
        options: ['あのひと は だれ です か。', 'あなた は がくせい ですか。'],
        correctAnswer: 'あのひと は だれ です か。',
    },
    {
        id: 'q2',
        type: 'construct',
        title: 'Упражнение 2: Построй общий вопрос',
        description: 'Соберите предложение: "Ты студент?"',
        options: ['あなた', 'は', 'がくせい', 'ですか'],
        correctAnswer: 'あなた は がくせい ですか',
    },
    {
        id: 'q3',
        type: 'fill-in-the-blank',
        title: 'Упражнение 3: Ответь утвердительно',
        description: 'Он врач? → はい、(　)。',
        options: ['そうです', '違います', 'です'],
        correctAnswer: 'そうです',
    },
    {
        id: 'q4',
        type: 'fill-in-the-blank',
        title: 'Упражнение 4: Ответь отрицательно',
        description: 'Он преподаватель? → いいえ、(　) です。',
        options: ['がくせい', 'はい', 'せんせい'],
        correctAnswer: 'がくせい',
    },
];

const LESSON_ID = 'lesson-2';

const ExerciseConstruct = ({ exercise, answers, handleConstructAnswer, resetConstructAnswer }: {
    exercise: Exercise,
    answers: Record<string, any>,
    handleConstructAnswer: (questionId: string, word: string) => void,
    resetConstructAnswer: (questionId: string) => void
}) => {
    const { id, options } = exercise;
    const [shuffledOptions, setShuffledOptions] = useState<string[]>([]);

    useEffect(() => {
        if (Array.isArray(options) && options.every(o => typeof o === 'string')) {
            setShuffledOptions([...(options as string[])].sort(() => Math.random() - 0.5));
        } else {
            setShuffledOptions(options as string[]);
        }
    }, [options]);

    return (
        <div className="space-y-4">
            <div className="border rounded-md p-4 min-h-[50px] bg-muted/50 text-xl font-japanese">
                {(answers[id] || []).join(' ')}
            </div>
            <div className="flex flex-wrap gap-2">
                {shuffledOptions.map((word, index) => (
                    <Button key={index} variant="outline" onClick={() => handleConstructAnswer(id, word)}>
                        {word}
                    </Button>
                ))}
            </div>
            <Button variant="ghost" size="sm" onClick={() => resetConstructAnswer(id)}>Сбросить</Button>
        </div>
    );
}


export default function GrammarLesson2Page() {
    const [progress, setProgress] = useState(0);
    const [answers, setAnswers] = useState<Record<string, any>>(() => {
        const initialAnswers: Record<string, any> = {};
        exercises.forEach(ex => {
            if (ex.type === 'construct') {
                initialAnswers[ex.id] = [];
            }
        });
        return initialAnswers;
    });
    const [results, setResults] = useState<Record<string, boolean | null>>({});
    const [_, copy] = useCopyToClipboard();
    const { toast } = useToast();
    const [answerType, setAnswerType] = useState<'affirmative' | 'negative'>('affirmative');

    useEffect(() => {
        const storedProgress = localStorage.getItem(`${LESSON_ID}-progress`);
        const storedResults = localStorage.getItem(`${LESSON_ID}-results`);
        const storedAnswers = localStorage.getItem(`${LESSON_ID}-answers`);

        if (storedProgress) setProgress(JSON.parse(storedProgress));
        if (storedResults) setResults(JSON.parse(storedResults));
        if (storedAnswers) setAnswers(JSON.parse(storedAnswers));
    }, []);

    const updateProgress = (newResults: Record<string, boolean | null>) => {
        const answeredCorrectly = Object.values(newResults).filter(r => r === true).length;
        const totalQuestions = exercises.length;
        const newProgress = Math.floor((answeredCorrectly / totalQuestions) * 100);
        
        setProgress(newProgress);
        setResults(newResults);
        localStorage.setItem(`${LESSON_ID}-progress`, JSON.stringify(newProgress));
        localStorage.setItem(`${LESSON_ID}-results`, JSON.stringify(newResults));
        localStorage.setItem(`${LESSON_ID}-answers`, JSON.stringify(answers));
    };
    
    const handleShare = () => {
        copy(window.location.href)
            .then(() => toast({ title: 'Ссылка скопирована!', description: 'Вы можете поделиться этим уроком с кем угодно.' }))
            .catch(() => toast({ title: 'Ошибка', description: 'Не удалось скопировать ссылку.', variant: 'destructive' }));
    }

    const handleAnswer = (questionId: string, answer: any) => {
        setAnswers(prev => ({ ...prev, [questionId]: answer }));
    };

    const handleConstructAnswer = (questionId: string, word: string) => {
        setAnswers(prev => {
            const currentAnswer = prev[questionId] || [];
            return { ...prev, [questionId]: [...currentAnswer, word] };
        });
    }

    const resetConstructAnswer = (questionId: string) => {
        setAnswers(prev => ({ ...prev, [questionId]: [] }));
    }

    const checkAnswers = () => {
        const newResults: Record<string, boolean | null> = {};
        
        exercises.forEach(ex => {
            let isCorrect = false;
            if (ex.type === 'construct') {
                const userAnswer = (answers[ex.id] || []).join(' ');
                isCorrect = userAnswer === ex.correctAnswer;
            } else {
                isCorrect = answers[ex.id] === ex.correctAnswer;
            }
            newResults[ex.id] = isCorrect;
        });
        
        updateProgress(newResults);
        localStorage.setItem(`${LESSON_ID}-answers`, JSON.stringify(answers));
    };

    const renderExercise = (exercise: Exercise) => {
        const { id, type, title, description, options } = exercise;
        const result = results[id];

        const baseCard = (content: React.ReactNode) => (
            <Card key={id} className="w-full">
                <CardHeader>
                    <CardTitle>{title}</CardTitle>
                    <CardDescription>{description}</CardDescription>
                </CardHeader>
                <CardContent>{content}</CardContent>
                <CardFooter>
                     {result === true && <span className="flex items-center gap-2 text-green-600"><CheckCircle/> Верно!</span>}
                     {result === false && <span className="flex items-center gap-2 text-destructive"><XCircle/> Ошибка</span>}
                </CardFooter>
            </Card>
        );

        switch (type) {
            case 'fill-in-the-blank':
            case 'select-correct':
                 return baseCard(
                    <RadioGroup value={answers[id]} onValueChange={(val) => handleAnswer(id, val)} className="flex flex-col gap-4">
                        {(options as string[]).map(option => (
                            <div key={option} className="flex items-center space-x-2">
                                <RadioGroupItem value={option} id={`${id}-${option}`} />
                                <Label htmlFor={`${id}-${option}`} className="font-japanese text-lg">{option}</Label>
                            </div>
                        ))}
                    </RadioGroup>
                );
            case 'multiple-choice':
                return baseCard(
                    <RadioGroup value={answers[id]} onValueChange={(val) => handleAnswer(id, val)} className="flex flex-col gap-4">
                        {(options as string[]).map(option => (
                            <div key={option} className="flex items-center space-x-2">
                                <RadioGroupItem value={option} id={`${id}-${option}`} />
                                <Label htmlFor={`${id}-${option}`}>{option}</Label>
                            </div>
                        ))}
                    </RadioGroup>
                );
            case 'construct':
                return baseCard(
                   <ExerciseConstruct
                        exercise={exercise}
                        answers={answers}
                        handleConstructAnswer={handleConstructAnswer}
                        resetConstructAnswer={resetConstructAnswer}
                   />
                );
            default:
                return null;
        }
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
                        <p className="text-sm text-primary font-semibold">Урок 2 — Грамматика</p>
                        <CardTitle className="text-2xl md:text-3xl">Тема: Вопросительные предложения</CardTitle>
                        <CardDescription>Прогресс по теме:</CardDescription>
                        <Progress value={progress} className="mt-2" />
                    </CardHeader>
                </Card>

                <h2 className="text-3xl font-bold text-foreground mb-6 text-center">🧠 Теория</h2>
                <Accordion type="single" collapsible className="w-full max-w-4xl mb-12" defaultValue="item-1">
                    <AccordionItem value="item-1">
                        <AccordionTrigger className="text-xl font-semibold">§8. Вопросительное предложение</AccordionTrigger>
                        <AccordionContent className="text-lg text-foreground/90 space-y-4 px-2">
                            <p>В японском языке вопрос формируется очень просто. Порядок слов не меняется, а в конце предложения ставится частица <b className="text-primary font-japanese">か</b>. Вопросительный знак (?) обычно не используется, так как частица か уже указывает на вопрос.</p>
                            
                            <Card className="mt-4">
                                <CardHeader><CardTitle className="text-lg flex items-center gap-2"><HelpCircle className="text-primary"/>Типы вопросительных предложений</CardTitle></CardHeader>
                                <CardContent className="space-y-4">
                                    <div>
                                        <h4 className="font-semibold text-lg">1. С вопросительным словом (специальный вопрос)</h4>
                                        <p className="text-muted-foreground text-base">Такие вопросы требуют конкретного ответа (кто, что, где и т.д.).</p>
                                        <p className="mt-2">Схема: <InteractiveFormula formula="N は QW です か 。" /></p>
                                        <div className="my-4">
                                            <InteractiveText analysis={grammarAnalyses.anokatawadonatadesuka} />
                                        </div>
                                    </div>
                                    <div className="border-t pt-4">
                                        <h4 className="font-semibold text-lg">2. Без вопросительного слова (общий вопрос)</h4>
                                        <p className="text-muted-foreground text-base">На такие вопросы можно ответить "да" или "нет".</p>
                                        <p className="mt-2">Схема: <InteractiveFormula formula="N は N です か 。" /></p>
                                        <div className="my-4">
                                            <InteractiveText analysis={grammarAnalyses.anokatawagakuseidesuka} />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="mt-4">
                                <CardHeader><CardTitle className="text-lg">Ответы на общий вопрос</CardTitle></CardHeader>
                                <CardContent>
                                    <div className="flex items-center space-x-2 my-4">
                                        <Label>Тип ответа:</Label>
                                        <Button variant={answerType === 'affirmative' ? 'default' : 'outline'} size="sm" onClick={() => setAnswerType('affirmative')}>Утвердительный (はい)</Button>
                                        <Button variant={answerType === 'negative' ? 'default' : 'outline'} size="sm" onClick={() => setAnswerType('negative')}>Отрицательный (いいえ)</Button>
                                    </div>
                                    <div className="space-y-4">
                                        {answerType === 'affirmative' ? (
                                            <>
                                                <InteractiveText analysis={grammarAnalyses.hai_anokatawagakuseidesu} />
                                                <InteractiveText analysis={grammarAnalyses.hai_soudesu} />
                                            </>
                                        ) : (
                                            <>
                                                <InteractiveText analysis={grammarAnalyses.iie_anokatawagakuseidehaarimasen} />
                                                <InteractiveText analysis={grammarAnalyses.iie_anokatahasenseidesu} />
                                                <InteractiveText analysis={grammarAnalyses.iie_senseidesu} />
                                            </>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>

                <h2 className="text-3xl font-bold text-foreground mb-8 mt-12 text-center">📝 Закрепление</h2>
                <div className="space-y-4">
                    <Card><CardHeader><CardTitle className="text-center">Примеры (文例)</CardTitle></CardHeader>
                    <CardContent className="space-y-6">
                        <InteractiveText analysis={grammarAnalyses.anohitohadaredesuka_tanakasandesu} />
                        <InteractiveText analysis={grammarAnalyses.soujisanhagishidesuka_haisoudesu} />
                        <InteractiveText analysis={grammarAnalyses.yamadasanhagakuseidesuka_iiesenseidesu} />
                        <InteractiveText analysis={grammarAnalyses.anohitohasenseidesuka_iiedewaarimasen} />
                    </CardContent>
                    </Card>
                </div>
                <div className="w-full max-w-4xl space-y-8 mt-8">
                    {exercises.map(renderExercise)}
                </div>
                <div className="mt-12 text-center flex flex-col sm:flex-row justify-center items-center gap-4">
                    <Button size="lg" variant="default" onClick={checkAnswers}>Проверить все</Button>
                    <Button size="lg" asChild className="btn-gradient">
                        <Link href="#">Перейти к проверочному тесту →</Link>
                    </Button>
                </div>
            </div>
        </div>
    );
}

