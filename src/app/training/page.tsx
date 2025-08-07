
'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, Check, X, RotateCcw, BrainCircuit, CheckCircle2 } from 'lucide-react';
import { useWordProgress } from '@/hooks/use-word-progress';
import { vocabularyData } from '@/lib/dictionary-data';
import type { Word } from '@/lib/dictionary-data';
import type { QueueItem } from '@/hooks/use-word-progress';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';

const allWords = [...vocabularyData.n5, ...vocabularyData.n4, ...vocabularyData.n3, ...vocabularyData.n2, ...vocabularyData.n1];

const shuffleArray = <T,>(array: T[]): T[] => {
    return [...array].sort(() => Math.random() - 0.5);
};

type QuestionType = 'jp_to_ru' | 'ru_to_jp';

const getStreakColor = (streak: number) => {
    if (streak === 0) return 'bg-pink-100/60';
    if (streak === 1) return 'bg-yellow-100/60';
    if (streak <= 3) return 'bg-blue-100/60';
    if (streak > 3) return 'bg-green-200/60';
    return 'bg-card';
}

export default function TrainingPage() {
    const { 
        getReviewQueue, 
        updateWordProgress, 
        getStreak,
        startNewSession,
        activeSessionQueue,
        completedInSession,
        advanceSession,
        requeueIncorrectAnswer
    } = useWordProgress();
    
    const [wordMap, setWordMap] = useState<Map<string, Word>>(new Map());
    const [options, setOptions] = useState<string[]>([]);
    const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [questionType, setQuestionType] = useState<QuestionType>('jp_to_ru');
    
    const [isClient, setIsClient] = useState(false);
    
    const totalInitialCount = useWordProgress(state => state.activeSessionTotal);
    const isSessionFinished = totalInitialCount > 0 && activeSessionQueue.length === 0;

    // Build word map on client mount
    useEffect(() => {
        setIsClient(true);
        const map = new Map<string, Word>();
        allWords.forEach(word => map.set(word.word, word));
        setWordMap(map);
    }, []);

    // Initialize a new session if none is active on mount
    useEffect(() => {
        if (isClient && totalInitialCount === 0) {
            startNewSession(allWords);
        }
    }, [isClient, totalInitialCount, startNewSession]);

    const generateOptions = useCallback((correctWord: Word, type: QuestionType) => {
        if (type === 'jp_to_ru') {
            const wrongAnswers = allWords
                .filter(w => w.word !== correctWord.word)
                .map(w => w.translation);
            const shuffledWrong = shuffleArray(wrongAnswers).slice(0, 3);
            setOptions(shuffleArray([...shuffledWrong, correctWord.translation]));
        } else { // ru_to_jp
            const wrongAnswers = allWords
                .filter(w => w.word !== correctWord.word)
                .map(w => w.word);
            const shuffledWrong = shuffleArray(wrongAnswers).slice(0, 3);
            setOptions(shuffleArray([...shuffledWrong, correctWord.word]));
        }
    }, []);
    
    // Generate new options when the active word changes
    useEffect(() => {
        if (activeSessionQueue.length > 0) {
            const currentWordKey = activeSessionQueue[0].word;
            const currentWord = wordMap.get(currentWordKey);
            if (currentWord) {
                const newQuestionType = Math.random() > 0.5 ? 'jp_to_ru' : 'ru_to_jp';
                setQuestionType(newQuestionType);
                generateOptions(currentWord, newQuestionType);
            }
        }
    }, [activeSessionQueue, generateOptions, wordMap]);


    const handleAnswer = (selectedOption: string) => {
        if (feedback) return;

        const currentQueueItem = activeSessionQueue[0];
        const correctWord = wordMap.get(currentQueueItem.word);
        if (!correctWord) return;
        
        setSelectedAnswer(selectedOption);

        const isCorrect = questionType === 'jp_to_ru' 
            ? selectedOption === correctWord.translation
            : selectedOption === correctWord.word;

        updateWordProgress(correctWord.word, isCorrect);

        if (isCorrect) {
            setFeedback('correct');
            setTimeout(() => {
                advanceSession(); // Move word from active to completed
                setFeedback(null);
                setSelectedAnswer(null);
            }, 1200);
        } else {
            setFeedback('incorrect');
            setTimeout(() => {
                requeueIncorrectAnswer(); // Move incorrect card to the back
                setFeedback(null);
                setSelectedAnswer(null);
            }, 1200);
        }
    };

    if (!isClient) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4 sm:p-8">
                <BrainCircuit className="w-16 h-16 text-primary animate-pulse" />
                <p className="mt-4 text-lg text-muted-foreground">Загрузка тренировки...</p>
            </div>
        );
    }
    
    if (isSessionFinished) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4 sm:p-8 animate-fade-in">
                 <Card className="w-full max-w-lg text-center p-6">
                     <CardHeader>
                        <CheckCircle2 className="w-16 h-16 mx-auto text-green-500 mb-4" />
                        <CardTitle className="text-2xl">Тренировка завершена!</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-lg text-muted-foreground mb-6">Вы прошли все слова на сегодня. Отличная работа! <br/> За новой порцией слов возвращайтесь завтра.</p>
                        <div className="flex gap-4 justify-center">
                            <Button onClick={() => startNewSession(allWords)} className="btn-gradient">
                                <RotateCcw className="mr-2"/>
                                Еще одна сессия
                            </Button>
                            <Button asChild variant="outline">
                                <Link href="/">Вернуться на главную</Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        )
    }

    if (totalInitialCount === 0 && activeSessionQueue.length === 0) {
         return (
             <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4 sm:p-8">
                <Card className="w-full max-w-lg text-center p-6">
                     <CardHeader>
                        <CheckCircle2 className="w-16 h-16 mx-auto text-green-500 mb-4" />
                        <CardTitle className="text-2xl">Все сделано!</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-lg text-muted-foreground mb-6">Вы прошли все доступные на сегодня слова. Загляните завтра за новой порцией!</p>
                        <Button asChild>
                            <Link href="/">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                На главную
                            </Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        )
    }

    const currentQueueItem = activeSessionQueue[0];
    const currentWord = currentQueueItem ? wordMap.get(currentQueueItem.word) : null;
    const progress = totalInitialCount > 0 ? (completedInSession.length / totalInitialCount) * 100 : 0;
    
    const isJpToRu = questionType === 'jp_to_ru';
    const streak = currentWord ? getStreak(currentWord.word) : 0;

    return (
        <div className="flex flex-col items-center justify-start min-h-screen bg-background p-4 sm:p-8 animate-fade-in pt-12">
             <Card className="w-full max-w-2xl mb-8">
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <CardTitle className="text-xl">Тренировка дня</CardTitle>
                        <span className="text-sm text-muted-foreground">
                            {completedInSession.length} / {totalInitialCount}
                        </span>
                    </div>
                    <Progress value={progress} className="mt-2" />
                </CardHeader>
                <CardContent className="flex flex-col items-center gap-6 min-h-[380px] justify-center">
                     {currentWord ? (
                        <>
                            <div className={cn("text-center p-4 rounded-lg w-full transition-colors duration-300 relative", getStreakColor(streak))}>
                               <span className="absolute top-2 left-2 text-xs font-bold text-muted-foreground bg-background/50 px-2 py-1 rounded-full">
                                    {currentQueueItem.type === 'new' ? 'Новое слово' : `На повторении (серия: ${streak})`}
                                </span>
                                {isJpToRu ? (
                                    <>
                                        <p className="text-muted-foreground mb-1">{currentWord.reading}</p>
                                        <p className="text-6xl font-bold font-japanese">{currentWord.word}</p>
                                    </>
                                ) : (
                                    <p className="text-4xl font-bold">{currentWord.translation}</p>
                                )}
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                                {options.map((option, index) => {
                                    const correctAnswer = isJpToRu ? currentWord.translation : currentWord.word;
                                    const isCorrectAnswer = option === correctAnswer;
                                    const isSelectedAnswer = option === selectedAnswer;

                                    let buttonClass = '';
                                    if (feedback) {
                                        if (isCorrectAnswer) {
                                            buttonClass = 'bg-green-500 hover:bg-green-600 text-white animate-pulse';
                                        } else if (isSelectedAnswer && feedback === 'incorrect') {
                                            buttonClass = 'bg-destructive/80';
                                        }
                                    }

                                    return (
                                        <Button
                                            key={index}
                                            onClick={() => handleAnswer(option)}
                                            className={cn("h-16 text-lg transition-all duration-300 transform", !isJpToRu && 'font-japanese', buttonClass)}
                                            disabled={!!feedback}
                                        >
                                            {option}
                                            {feedback === 'correct' && isCorrectAnswer && <Check className="ml-2" />}
                                            {feedback === 'incorrect' && isSelectedAnswer && <X className="ml-2" />}
                                        </Button>
                                    );
                                })}
                            </div>
                        </>
                     ) : (
                        <p>Загрузка слова...</p>
                     )}
                </CardContent>
            </Card>

            {completedInSession.length > 0 && (
                <div className="w-full max-w-2xl">
                    <h3 className="text-lg font-semibold mb-4 text-center">Прогресс за сессию</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                        <AnimatePresence>
                            {completedInSession.map((item) => {
                                const word = wordMap.get(item.word);
                                if (!word) return null;
                                return (
                                    <motion.div
                                        key={word.word}
                                        layoutId={word.word}
                                        initial={{ opacity: 0, scale: 0.5 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.5 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <Card className="p-2 text-center border-green-500/50 bg-green-500/10">
                                            <p className="font-japanese font-semibold">{word.word}</p>
                                            <p className="text-xs text-muted-foreground">{word.translation}</p>
                                        </Card>
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>
                    </div>
                </div>
            )}
            
            <Button variant="link" asChild className="mt-8">
                <Link href="/">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Выйти из тренировки
                </Link>
            </Button>
        </div>
    );
}
