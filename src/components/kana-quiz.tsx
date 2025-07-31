
'use client';

import { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { hiraganaData, katakanaData } from '@/lib/kana-data';
import type { KanaCharacter } from '@/lib/kana-data';

interface KanaQuizProps {
  data: (KanaCharacter | null)[][];
  onQuizEnd: () => void;
  quizType: 'hiragana' | 'katakana';
}

const shuffleArray = <T,>(array: T[]): T[] => {
  return [...array].sort(() => Math.random() - 0.5);
};

export default function KanaQuiz({ data, onQuizEnd, quizType }: KanaQuizProps) {
  const allChars = useMemo(() => data.flat().filter((c): c is KanaCharacter => c !== null), [data]);
  const [questions, setQuestions] = useState<KanaCharacter[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [options, setOptions] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [incorrectAnswers, setIncorrectAnswers] = useState<KanaCharacter[]>([]);
  const [isFinished, setIsFinished] = useState(false);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);

  const generateQuestions = (retryIncorrect = false) => {
    const questionPool = retryIncorrect ? incorrectAnswers : allChars;
    setQuestions(shuffleArray(questionPool).slice(0, 10));
    setCurrentQuestionIndex(0);
    setScore(0);
    setIncorrectAnswers([]);
    setIsFinished(false);
  };
  
  useEffect(() => {
    generateQuestions();
  }, [allChars]);


  const generateOptions = (correctAnswer: KanaCharacter) => {
    let wrongOptions = allChars
      .filter((char) => char.romaji !== correctAnswer.romaji)
      .map((char) => char.romaji);
    
    wrongOptions = shuffleArray(wrongOptions).slice(0, 3);
    const allOptions = shuffleArray([...wrongOptions, correctAnswer.romaji]);
    setOptions(allOptions);
  };

  useEffect(() => {
    if (questions.length > 0 && currentQuestionIndex < questions.length) {
      generateOptions(questions[currentQuestionIndex]);
    } else if (questions.length > 0 && currentQuestionIndex >= questions.length) {
        setIsFinished(true);
    }
  }, [currentQuestionIndex, questions]);


  const handleAnswer = (selectedRomaji: string) => {
    if (feedback) return; // Prevent multiple clicks

    const correctAnswer = questions[currentQuestionIndex];
    if (selectedRomaji === correctAnswer.romaji) {
      setScore(score + 1);
      setFeedback('correct');
    } else {
      setIncorrectAnswers([...incorrectAnswers, correctAnswer]);
      setFeedback('incorrect');
    }

    setTimeout(() => {
      setFeedback(null);
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }, 1000);
  };
  
  if (questions.length === 0) {
      return <div>Loading quiz...</div>
  }

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
                    <span key={i} className="text-lg text-destructive">{char.kana} ({char.romaji})</span>
                  ))}
                </div>
              </div>
            )}
            <div className="flex flex-col sm:flex-row gap-2 justify-center">
              {incorrectAnswers.length > 0 && (
                 <Button onClick={() => generateQuestions(true)}>Повторить ошибки</Button>
              )}
              <Button onClick={() => generateQuestions()}>Начать заново</Button>
              <Button variant="outline" onClick={onQuizEnd}>
                Вернуться к таблицам
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex) / questions.length) * 100;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4 sm:p-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-xl">
            Тест: {quizType === 'hiragana' ? 'Хирагана' : 'Катакана'} ({currentQuestionIndex + 1} из {questions.length})
          </CardTitle>
           <Progress value={progress} className="mt-2" />
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-8">
          <div className="text-8xl font-japanese rounded-lg bg-card-foreground/5 p-8">
            {currentQuestion.kana}
          </div>
          <div className="grid grid-cols-2 gap-4 w-full">
            {options.map((romaji) => (
              <Button
                key={romaji}
                onClick={() => handleAnswer(romaji)}
                variant={
                    feedback && romaji === currentQuestion.romaji ? 'default' :
                    feedback === 'incorrect' && romaji !== currentQuestion.romaji ? 'destructive' :
                    'outline'
                }
                className={`h-16 text-2xl transition-all duration-300 ${
                  feedback && romaji === currentQuestion.romaji ? 'bg-green-500 hover:bg-green-600 text-white animate-pulse' : ''
                } ${
                  feedback === 'incorrect' && romaji !== currentQuestion.romaji ? '' : ''
                }`}
                disabled={!!feedback}
              >
                {romaji}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
       <Button variant="link" onClick={onQuizEnd} className="mt-8">
          Выйти из теста
        </Button>
    </div>
  );
}
