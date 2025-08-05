
'use client';

import { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowLeft, Check, X, Repeat, Award } from 'lucide-react';
import Link from 'next/link';
import { grammarAnalyses } from '@/ai/precomputed-analysis';
import type { JapaneseAnalysisOutput } from '@/ai/precomputed-analysis';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

const shuffleArray = <T,>(array: T[]): T[] => {
    return [...array].sort(() => Math.random() - 0.5);
};

const sentencePool: JapaneseAnalysisOutput[] = Object.values(grammarAnalyses);

export default function SentenceScramblePage() {
    const [sentences, setSentences] = useState<JapaneseAnalysisOutput[]>([]);
    const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);
    const [shuffledWords, setShuffledWords] = useState<string[]>([]);
    const [constructedSentence, setConstructedSentence] = useState<string[]>([]);
    const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
    const [score, setScore] = useState(0);

    const initializeGame = () => {
        const gameSentences = shuffleArray(sentencePool).slice(0, 10);
        setSentences(gameSentences);
        setCurrentSentenceIndex(0);
        setScore(0);
        setFeedback(null);
        setConstructedSentence([]);
    };

    useEffect(() => {
        initializeGame();
    }, []);

    useEffect(() => {
        if (sentences.length > 0 && currentSentenceIndex < sentences.length) {
            const currentWords = sentences[currentSentenceIndex].sentence.map(s => s.word);
            setShuffledWords(shuffleArray(currentWords));
            setConstructedSentence([]);
        }
    }, [currentSentenceIndex, sentences]);

    const handleWordClick = (word: string, index: number) => {
        setConstructedSentence(prev => [...prev, word]);
        setShuffledWords(prev => prev.filter((_, i) => i !== index));
    };
    
    const handleReset = () => {
        const currentWords = sentences[currentSentenceIndex].sentence.map(s => s.word);
        setShuffledWords(shuffleArray(currentWords));
        setConstructedSentence([]);
    };
    
    const checkAnswer = () => {
        if (feedback) return;

        const correctAnswer = sentences[currentSentenceIndex].sentence.map(s => s.word).join(' ');
        const userAnswer = constructedSentence.join(' ');
        
        if (userAnswer === correctAnswer) {
            setFeedback('correct');
            setScore(prev => prev + 1);
            setTimeout(() => {
                setFeedback(null);
                setCurrentSentenceIndex(prev => prev + 1);
            }, 1500);
        } else {
            setFeedback('incorrect');
            setTimeout(() => {
                setFeedback(null);
                handleReset();
            }, 1500);
        }
    };
    
    if (sentences.length === 0) {
        return <div>Загрузка игры...</div>;
    }

    if (currentSentenceIndex >= sentences.length) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4 sm:p-8 animate-fade-in">
                <Card className="w-full max-w-lg text-center p-8">
                    <CardHeader>
                        <Award className="w-16 h-16 mx-auto text-yellow-500" />
                        <CardTitle className="text-3xl mt-4">Игра окончена!</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-xl text-muted-foreground mb-6">Ваш счет: {score} из {sentences.length}</p>
                        <div className="flex gap-4 justify-center">
                            <Button onClick={initializeGame} className="btn-gradient">
                                <Repeat className="mr-2 h-4 w-4" />
                                Играть снова
                            </Button>
                            <Button asChild variant="outline">
                                <Link href="/">На главную</Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }
    
    const currentSentence = sentences[currentSentenceIndex];

    return (
        <div className="flex flex-col items-center justify-start min-h-screen bg-background p-4 sm:p-8 pt-16 sm:pt-24 animate-fade-in">
            <div className="w-full max-w-3xl">
                <Button asChild variant="ghost" className="mb-4">
                    <Link href="/">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Назад на главную
                    </Link>
                </Button>
                
                <Card className="w-full shadow-lg">
                    <CardHeader>
                        <CardTitle className="text-2xl text-center">Собери фразу!</CardTitle>
                        <CardDescription className="text-center">
                            Переведите это предложение: <br/> <b className="text-foreground">{currentSentence.fullTranslation}</b>
                        </CardDescription>
                         <div className="flex justify-between items-center pt-2">
                             <p className="text-sm font-medium">Счет: {score}</p>
                             <p className="text-sm text-muted-foreground">Вопрос {currentSentenceIndex + 1} / {sentences.length}</p>
                         </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className={cn(
                            "flex items-center justify-center flex-wrap gap-2 border rounded-md p-4 min-h-[70px] text-2xl font-japanese bg-muted/30 transition-all duration-300",
                            feedback === 'correct' && 'border-green-500 bg-green-500/10',
                            feedback === 'incorrect' && 'border-destructive bg-destructive/10 animate-shake'
                        )}>
                            {constructedSentence.length > 0 ? constructedSentence.map((word, index) => (
                                <motion.span key={`${word}-${index}`} layoutId={`${word}-${index}`}>{word}</motion.span>
                            )) : (
                                <span className="text-muted-foreground text-base">...</span>
                            )}
                             {feedback && (
                                <div className="ml-2">
                                    {feedback === 'correct' ? <Check className="text-green-500" /> : <X className="text-destructive" />}
                                </div>
                            )}
                        </div>

                        <div className="flex items-center justify-center flex-wrap gap-2 min-h-[50px]">
                             <AnimatePresence>
                                {shuffledWords.map((word, index) => (
                                    <motion.div
                                        key={`${word}-${index}`}
                                        layout
                                        initial={{ opacity: 0, y: -20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 20 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <Button
                                            variant="outline"
                                            size="lg"
                                            className="font-japanese text-xl"
                                            onClick={() => handleWordClick(word, index)}
                                            disabled={!!feedback}
                                        >
                                            {word}
                                        </Button>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                        
                        <div className="flex justify-center gap-4 pt-4">
                            <Button onClick={checkAnswer} disabled={constructedSentence.length === 0 || !!feedback}>Проверить</Button>
                            <Button variant="ghost" onClick={handleReset} disabled={!!feedback}>Сбросить</Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
