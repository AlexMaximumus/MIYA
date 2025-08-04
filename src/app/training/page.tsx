
'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, Check, X, RotateCcw, BrainCircuit } from 'lucide-react';
import { useWordProgress } from '@/hooks/use-word-progress';
import { vocabularyData } from '@/lib/dictionary-data';
import type { Word } from '@/lib/dictionary-data';
import { cn } from '@/lib/utils';

const allWords = [...vocabularyData.n5, ...vocabularyData.n4, ...vocabularyData.n3, ...vocabularyData.n2, ...vocabularyData.n1];

const shuffleArray = <T,>(array: T[]): T[] => {
    return [...array].sort(() => Math.random() - 0.5);
};


export default function TrainingPage() {
    const { getReviewQueue, updateWordProgress, resetProgress } = useWordProgress();
    const [dailyQueue, setDailyQueue] = useState<string[]>([]);
    const [wordMap, setWordMap] = useState<Map<string, Word>>(new Map());
    
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [options, setOptions] = useState<string[]>([]);
    const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
    const [isFinished, setIsFinished] = useState(false);
    const [correctCount, setCorrectCount] = useState(0);
    
    const [isClient, setIsClient] = useState(false);

    const initializeSession = useCallback(() => {
        const queue = getReviewQueue(allWords, 10);
        setDailyQueue(queue);
        setCurrentQuestionIndex(0);
        setIsFinished(false);
        setCorrectCount(0);
        setFeedback(null);
    }, [getReviewQueue]);
    
    useEffect(() => {
        setIsClient(true);
        // Create a map for quick word lookups
        const map = new Map<string, Word>();
        allWords.forEach(word => map.set(word.word, word));
        setWordMap(map);
        initializeSession();
    }, [initializeSession]);

    const generateOptions = useCallback((correctWord: Word) => {
        const wrongAnswers = allWords
            .filter(w => w.word !== correctWord.word)
            .map(w => w.translation);
        
        const shuffledWrong = shuffleArray(wrongAnswers).slice(0, 3);
        const allOptions = shuffleArray([...shuffledWrong, correctWord.translation]);
        setOptions(allOptions);
    }, []);

    useEffect(() => {
        if (dailyQueue.length > 0 && currentQuestionIndex < dailyQueue.length) {
            const currentWordKey = dailyQueue[currentQuestionIndex];
            const currentWord = wordMap.get(currentWordKey);
            if (currentWord) {
                generateOptions(currentWord);
            }
        } else if (dailyQueue.length > 0 && currentQuestionIndex >= dailyQueue.length) {
            setIsFinished(true);
        }
    }, [currentQuestionIndex, dailyQueue, generateOptions, wordMap]);


    const handleAnswer = (selectedTranslation: string) => {
        if (feedback) return;

        const currentWordKey = dailyQueue[currentQuestionIndex];
        const correctWord = wordMap.get(currentWordKey);

        if (!correctWord) return;

        const isCorrect = selectedTranslation === correctWord.translation;

        if (isCorrect) {
            setFeedback('correct');
            setCorrectCount(prev => prev + 1);
        } else {
            setFeedback('incorrect');
        }

        updateWordProgress(currentWord.word, isCorrect);

        setTimeout(() => {
            setFeedback(null);
            setCurrentQuestionIndex(prev => prev + 1);
        }, 1500);
    };

    if (!isClient) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4 sm:p-8">
                <BrainCircuit className="w-16 h-16 text-primary animate-pulse" />
                <p className="mt-4 text-lg text-muted-foreground">Загрузка тренировки...</p>
            </div>
        );
    }
    
    if (dailyQueue.length === 0 && !isFinished) {
        return (
             <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4 sm:p-8">
                <Card className="w-full max-w-lg text-center">
                     <CardHeader>
                        <CardTitle className="text-2xl">Отличная работа!</CardTitle>
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

    const currentWordKey = dailyQueue[currentQuestionIndex];
    const currentWord = wordMap.get(currentWordKey);
    const progress = (currentQuestionIndex / dailyQueue.length) * 100;

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4 sm:p-8 animate-fade-in">
             <Card className="w-full max-w-2xl">
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <CardTitle className="text-xl">Тренировка дня</CardTitle>
                        {!isFinished && currentWord && (
                            <span className="text-sm text-muted-foreground">
                                {currentQuestionIndex + 1} / {dailyQueue.length}
                            </span>
                        )}
                    </div>
                    <Progress value={progress} className="mt-2" />
                </CardHeader>
                <CardContent className="flex flex-col items-center gap-8 min-h-[350px] justify-center">
                     {isFinished ? (
                         <div className="text-center">
                            <h2 className="text-2xl font-bold mb-4">Тренировка завершена!</h2>
                            <p className="text-xl mb-6">Ваш результат: {correctCount} из {dailyQueue.length}</p>
                            <div className="flex gap-4 justify-center">
                                <Button onClick={initializeSession} className="btn-gradient">
                                    <RotateCcw className="mr-2"/>
                                    Начать заново
                                </Button>
                                <Button asChild variant="outline">
                                    <Link href="/">Вернуться на главную</Link>
                                </Button>
                            </div>
                        </div>
                     ) : currentWord ? (
                        <>
                            <div className="text-center">
                                <p className="text-muted-foreground mb-1">{currentWord.reading}</p>
                                <p className="text-6xl font-bold font-japanese">{currentWord.word}</p>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                                {options.map((option, index) => {
                                    const isCorrectAnswer = option === currentWord.translation;
                                    let buttonClass = '';

                                    if (feedback) {
                                        if (isCorrectAnswer) {
                                            buttonClass = 'bg-green-500 hover:bg-green-600 text-white animate-pulse';
                                        } else {
                                            buttonClass = 'bg-destructive/80';
                                        }
                                    }

                                    return (
                                        <Button
                                            key={index}
                                            onClick={() => handleAnswer(option)}
                                            className={cn("h-16 text-lg transition-all duration-300 transform", buttonClass)}
                                            disabled={!!feedback}
                                        >
                                            {option}
                                            {feedback && isCorrectAnswer && <Check className="ml-2" />}
                                            {feedback === 'incorrect' && !isCorrectAnswer && <X className="ml-2" />}
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
            <Button variant="link" asChild className="mt-4">
                <Link href="/">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Выйти из тренировки
                </Link>
            </Button>
        </div>
    );
}
