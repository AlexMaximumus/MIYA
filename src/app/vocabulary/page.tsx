'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Check, X } from 'lucide-react';
import Link from 'next/link';
import VocabularyCard from '@/components/vocabulary-card';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

// Mock data, to be replaced with user's content
const lessonData = {
  title: 'Урок 1: Приветствия и знакомство',
  theory: 'В этом уроке мы изучим базовые фразы для приветствия и знакомства.',
  vocabulary: [
    { kanji: '今日は', furigana: 'こんにちは', translation: 'Добрый день' },
    { kanji: 'はじめまして', furigana: 'はじめまして', translation: 'Приятно познакомиться' },
    { kanji: '私', furigana: 'わたし', translation: 'Я' },
    { kanji: 'です', furigana: 'です', translation: 'есть (связка)' },
  ],
  quiz: [
    { question: 'Как сказать "Добрый день"?', options: ['こんにちは', 'さようなら', 'ありがとう'], answer: 'こんにちは' },
    { question: 'Что означает "はじめまして"?', options: ['Приятно познакомиться', 'Спасибо', 'Извините'], answer: 'Приятно познакомиться' },
  ]
};


export default function VocabularyLessonPage() {
    const [isQuizActive, setQuizActive] = useState(false);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
    const [isFinished, setIsFinished] = useState(false);

    const handleAnswer = (selectedOption: string) => {
        if (feedback) return;

        const isCorrect = selectedOption === lessonData.quiz[currentQuestionIndex].answer;
        if (isCorrect) {
            setScore(score + 1);
            setFeedback('correct');
        } else {
            setFeedback('incorrect');
        }

        setTimeout(() => {
            setFeedback(null);
            if (currentQuestionIndex < lessonData.quiz.length - 1) {
                setCurrentQuestionIndex(currentQuestionIndex + 1);
            } else {
                setIsFinished(true);
            }
        }, 1500);
    };

    const restartQuiz = () => {
        setQuizActive(true);
        setCurrentQuestionIndex(0);
        setScore(0);
        setFeedback(null);
        setIsFinished(false);
    }
  
    if (isQuizActive) {
        const currentQuestion = lessonData.quiz[currentQuestionIndex];
        const progress = ((currentQuestionIndex + (isFinished ? 1 : 0)) / lessonData.quiz.length) * 100;

        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4 sm:p-8 animate-fade-in">
                <Card className="w-full max-w-2xl">
                    <CardHeader>
                        <CardTitle className="text-center text-xl">Тест: {lessonData.title}</CardTitle>
                        <Progress value={progress} className="mt-2" />
                    </CardHeader>
                    <CardContent className="flex flex-col items-center gap-8">
                        {isFinished ? (
                             <div className="text-center">
                                <h2 className="text-2xl font-bold mb-4">Тест завершен!</h2>
                                <p className="text-xl mb-6">Ваш результат: {score} из {lessonData.quiz.length}</p>
                                <div className="flex gap-4 justify-center">
                                    <Button onClick={restartQuiz} className="btn-gradient">Попробовать снова</Button>
                                    <Button variant="outline" onClick={() => setQuizActive(false)}>Вернуться к уроку</Button>
                                </div>
                            </div>
                        ) : (
                            <>
                                <p className="text-2xl text-center">{currentQuestion.question}</p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                                    {currentQuestion.options.map((option, index) => {
                                        const isCorrectAnswer = option === currentQuestion.answer;
                                        const isSelected = feedback && option === currentQuestion.options.find(o => o === (feedback === 'correct' ? currentQuestion.answer : '')); // Complicated logic to find the selected one
                                        
                                        return (
                                            <Button
                                                key={index}
                                                onClick={() => handleAnswer(option)}
                                                className={`h-16 text-xl transition-all duration-300 transform font-japanese
                                                    ${feedback && isCorrectAnswer ? 'bg-green-500 hover:bg-green-600 text-white animate-pulse' : ''}
                                                    ${feedback === 'incorrect' && !isCorrectAnswer && 'opacity-50'}
                                                `}
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
                        )}
                    </CardContent>
                </Card>
            </div>
        );
    }

  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-background p-4 sm:p-8 pt-16 sm:pt-24 animate-fade-in">
      <div className="w-full max-w-5xl mb-4">
        <Button asChild variant="ghost">
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Назад на главную
          </Link>
        </Button>
      </div>
      <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 font-headline text-center">
        {lessonData.title}
      </h1>
      <p className="text-muted-foreground text-lg mb-12 text-center max-w-3xl">
        {lessonData.theory}
      </p>

      <div className="w-full max-w-5xl mb-12">
        <h2 className="text-2xl font-bold text-foreground mb-6">Слова урока:</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {lessonData.vocabulary.map((word, index) => (
            <VocabularyCard key={index} {...word} />
          ))}
        </div>
      </div>
      
      <Card className="w-full max-w-5xl p-6 bg-card/70 shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Закрепление материала</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="mb-6">Готовы проверить свои знания? Начните короткий тест по словам из этого урока.</p>
          <Button size="lg" onClick={() => setQuizActive(true)} className="btn-gradient">
            Начать тест
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
