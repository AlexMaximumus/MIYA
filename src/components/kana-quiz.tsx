
'use client';

import { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { KanaCharacter, hiraganaData, katakanaData } from '@/lib/kana-data';
import type { KanaSet, QuizLength, QuizQuestionTypeKana } from '@/types/quiz-types';

interface KanaQuizProps {
  onQuizEnd: () => void;
  kanaSet: KanaSet;
  quizLength: QuizLength;
  questionType: QuizQuestionTypeKana;
}

const shuffleArray = <T,>(array: T[]): T[] => {
  return [...array].sort(() => Math.random() - 0.5);
};

const flattenKana = (data: (KanaCharacter | null)[][]): KanaCharacter[] => {
    return data.flat().filter((c): c is KanaCharacter => c !== null);
}

export default function KanaQuiz({ onQuizEnd, kanaSet, quizLength, questionType }: KanaQuizProps) {
  const allChars = useMemo(() => {
    if (kanaSet === 'hiragana') return flattenKana(hiraganaData);
    if (kanaSet === 'katakana') return flattenKana(katakanaData);
    return [...flattenKana(hiraganaData), ...flattenKana(katakanaData)];
  }, [kanaSet]);

  const [questions, setQuestions] = useState<KanaCharacter[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [options, setOptions] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [incorrectAnswers, setIncorrectAnswers] = useState<KanaCharacter[]>([]);
  const [isFinished, setIsFinished] = useState(false);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);

  const generateQuestions = (retryIncorrect = false) => {
    let questionPool = retryIncorrect ? incorrectAnswers : allChars;
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
  }, [allChars, questionType, quizLength]);

  const generateOptions = (correctAnswer: KanaCharacter) => {
    const isKanaToRomaji = questionType === 'kana-to-romaji';
    const correctOption = isKanaToRomaji ? correctAnswer.romaji : correctAnswer.kana;
    
    let wrongOptions = allChars
      .filter((char) => char.romaji !== correctAnswer.romaji)
      .map((char) => isKanaToRomaji ? char.romaji : char.kana);
    
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
    const isCorrect = questionType === 'kana-to-romaji' 
        ? selectedOption === correctAnswer.romaji 
        : selectedOption === correctAnswer.kana;

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
                    <span key={i} className="text-lg text-destructive">{char.kana} ({char.romaji})</span>
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
  
  const questionText = questionType === 'kana-to-romaji' ? currentQuestion.kana : currentQuestion.romaji;
  const optionIsKana = questionType === 'romaji-to-kana';

  const getQuizTitle = () => {
    const setLabel = { hiragana: 'Хирагана', katakana: 'Катакана', all: 'Смешанный' }[kanaSet];
    const lengthLabel = { '25': ' (25)', '50': ' (50)', 'full': '' }[quizLength];
    return `Тест: ${setLabel}${lengthLabel}`;
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
          <div className={`rounded-lg bg-card-foreground/5 p-8 ${optionIsKana ? "text-6xl" : "text-8xl font-japanese"}`}>
            {questionText}
          </div>
          <div className="grid grid-cols-2 gap-4 w-full">
            {options.map((option) => {
              const isCorrectOption = questionType === 'kana-to-romaji' 
                ? option === currentQuestion.romaji 
                : option === currentQuestion.kana;

              return (
              <Button
                key={option}
                onClick={() => handleAnswer(option)}
                className={`h-16 text-2xl transition-all duration-300 transform 
                ${optionIsKana ? 'font-japanese text-4xl' : ''}
                ${feedback === 'correct' && isCorrectOption ? 'bg-green-500 hover:bg-green-600 text-white animate-pulse scale-105' : ''}
                ${feedback === 'incorrect' && !isCorrectOption ? 'bg-destructive/80' : ''}
                ${feedback === 'incorrect' && isCorrectOption ? 'bg-green-500' : ''}
                `}
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
