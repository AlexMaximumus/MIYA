
'use client';

import { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Word } from '@/lib/dictionary-data';
import type { QuizLength, VocabSet, QuizQuestionTypeVocab } from '@/types/quiz-types';
import { cn } from '@/lib/utils';

interface WordQuizProps {
  onQuizEnd: () => void;
  words: Word[];
  questionType: QuizQuestionTypeVocab;
  quizLength: QuizLength;
  vocabSet: VocabSet;
}

const shuffleArray = <T,>(array: T[]): T[] => {
  return [...array].sort(() => Math.random() - 0.5);
};


export default function WordQuiz({ onQuizEnd, words, questionType, quizLength, vocabSet }: WordQuizProps) {
  const [questions, setQuestions] = useState<Word[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [options, setOptions] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [incorrectAnswers, setIncorrectAnswers] = useState<Word[]>([]);
  const [isFinished, setIsFinished] = useState(false);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);

  const generateQuestions = (retryIncorrect = false) => {
    let questionPool = retryIncorrect ? incorrectAnswers : words;
    questionPool = shuffleArray(questionPool);
    
    if (quizLength === '25') {
      questionPool = questionPool.slice(0, 25);
    } else if (quizLength === '50') {
        questionPool = questionPool.slice(0, 50);
    }

    setQuestions(questionPool);
    setCurrentQuestionIndex(0);
    setScore(0);
    setIncorrectAnswers([]);
    setIsFinished(false);
    setFeedback(null);
  };
  
  useEffect(() => {
    generateQuestions();
  }, [words, questionType, quizLength]);

  const generateOptions = (correctAnswer: Word) => {
    const isJpToRu = questionType === 'jp_to_ru';
    const correctOption = isJpToRu ? correctAnswer.translation : correctAnswer.word;
    
    let wrongOptions = words
      .filter((char) => char.word !== correctAnswer.word)
      .map((char) => isJpToRu ? char.translation : char.word);
    
    wrongOptions = shuffleArray(wrongOptions).slice(0, 3);
    const allOptions = shuffleArray([...wrongOptions, correctOption]);
    setOptions(allOptions);
  };

  useEffect(() => {
    if (questions.length > 0 && currentQuestionIndex < questions.length) {
      generateOptions(questions[currentQuestionIndex]);
    } else if (questions.length > 0 && currentQuestionIndex >= questions.length) {
        setIsFinished(true);
    }
  }, [currentQuestionIndex, questions]);


  const handleAnswer = (selectedOption: string) => {
    if (feedback) return;

    const correctAnswer = questions[currentQuestionIndex];
    const isCorrect = questionType === 'jp_to_ru' 
        ? selectedOption === correctAnswer.translation 
        : selectedOption === correctAnswer.word;

    if (isCorrect) {
      setScore(score + 1);
      setFeedback('correct');
    } else {
      setIncorrectAnswers([...incorrectAnswers, correctAnswer]);
      setFeedback('incorrect');
    }

    setTimeout(() => {
      setFeedback(null);
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }, 1200);
  };
  
  if (isFinished) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4 sm:p-8">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <CardTitle>Тест завершен!</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl mb-4">
              Ваш результат: {score} из {questions.length}
            </p>
            {incorrectAnswers.length > 0 && (
              <div className="mb-4">
                <h3 className="font-bold">Ошибки:</h3>
                <div className="flex flex-wrap justify-center gap-2 mt-2">
                  {incorrectAnswers.map((char, i) => (
                    <span key={i} className="text-lg text-destructive">{char.word} ({char.translation})</span>
                  ))}
                </div>
              </div>
            )}
            <div className="flex flex-col sm:flex-row gap-2 mt-4 justify-center">
              {incorrectAnswers.length > 0 && (
                 <Button onClick={() => generateQuestions(true)} className="btn-gradient">Повторить ошибки</Button>
              )}
              <Button onClick={() => generateQuestions()} className="btn-gradient">Начать заново</Button>
              <Button variant="outline" onClick={onQuizEnd}>
                Вернуться
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  if (!currentQuestion) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <p>Загрузка вопросов...</p>
        </div>
      );
  }

  const progress = ((currentQuestionIndex) / questions.length) * 100;
  
  const isJpToRu = questionType === 'jp_to_ru';

  const getQuizTitle = () => {
    const lengthLabel = { '25': ' (25)', '50': ' (50)', 'full': '' }[quizLength];
    return `Тест: Словарь ${vocabSet}${lengthLabel}`;
  }


  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4 sm:p-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-xl">
            {getQuizTitle()} ({currentQuestionIndex + 1} из {questions.length})
          </CardTitle>
           <Progress value={progress} className="mt-2" />
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-8">
            <div className="text-center p-8 rounded-lg w-full min-h-[160px] flex flex-col justify-center">
                {isJpToRu ? (
                    <>
                        <p className="text-muted-foreground mb-1">{currentQuestion.reading}</p>
                        <p className="text-6xl font-bold font-japanese">{currentQuestion.word}</p>
                    </>
                ) : (
                    <p className="text-4xl font-bold">{currentQuestion.translation}</p>
                )}
            </div>
          <div className="grid grid-cols-2 gap-4 w-full">
            {options.map((option) => {
              const isCorrectOption = isJpToRu
                ? option === currentQuestion.translation
                : option === currentQuestion.word;

              return (
              <Button
                key={option}
                onClick={() => handleAnswer(option)}
                className={cn(`h-16 text-xl transition-all duration-300 transform`,
                !isJpToRu && 'font-japanese text-2xl',
                feedback === 'correct' && isCorrectOption ? 'bg-green-500 hover:bg-green-600 text-white animate-pulse scale-105' : '',
                feedback === 'incorrect' && !isCorrectOption ? 'bg-destructive/80' : '',
                feedback === 'incorrect' && isCorrectOption ? 'bg-green-500' : ''
                )}
                disabled={!!feedback}
              >
                {option}
              </Button>
            )})}
          </div>
        </CardContent>
      </Card>
       <Button variant="link" onClick={onQuizEnd} className="mt-8">
          Выйти из теста
        </Button>
    </div>
  );
}

    
