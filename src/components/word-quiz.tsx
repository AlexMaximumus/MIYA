
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

interface AnswerRecord {
    question: Word;
    answer: string;
    isCorrect: boolean;
}

export default function WordQuiz({ onQuizEnd, words, questionType, quizLength, vocabSet }: WordQuizProps) {
  const [questions, setQuestions] = useState<Word[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [options, setOptions] = useState<Word[]>([]);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [selectedWord, setSelectedWord] = useState<Word | null>(null);
  const [answerHistory, setAnswerHistory] = useState<AnswerRecord[]>([]);

  const generateQuestions = (retryIncorrect = false) => {
    const incorrectWords = answerHistory.filter(a => !a.isCorrect).map(a => a.question);
    let questionPool = retryIncorrect ? incorrectWords : words;
    
    questionPool = shuffleArray(questionPool);
    
    if (quizLength === '25' && !retryIncorrect) {
      questionPool = questionPool.slice(0, 25);
    } else if (quizLength === '50' && !retryIncorrect) {
        questionPool = questionPool.slice(0, 50);
    }

    setQuestions(questionPool);
    setCurrentQuestionIndex(0);
    setScore(0);
    setIsFinished(false);
    setFeedback(null);
    setAnswerHistory([]);
  };
  
  useEffect(() => {
    generateQuestions();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [words, questionType, quizLength]);

  const generateOptions = (correctAnswerWord: Word) => {
    let wrongOptionsPool = words.filter(w => w.word !== correctAnswerWord.word);
    let wrongOptions = shuffleArray(wrongOptionsPool).slice(0, 3);

    const allOptions = shuffleArray([...wrongOptions, correctAnswerWord]);
    setOptions(allOptions);
  };

  useEffect(() => {
    if (questions.length > 0 && currentQuestionIndex < questions.length) {
      generateOptions(questions[currentQuestionIndex]);
    } else if (questions.length > 0 && currentQuestionIndex >= questions.length) {
        setIsFinished(true);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentQuestionIndex, questions]);


  const handleAnswer = (selectedOption: Word) => {
    if (feedback) return;

    setSelectedWord(selectedOption);
    const correctAnswer = questions[currentQuestionIndex];
    const isCorrect = selectedOption.word === correctAnswer.word;

    setAnswerHistory(prev => [...prev, {
        question: correctAnswer,
        answer: selectedOption.word,
        isCorrect
    }]);

    if (isCorrect) {
      setScore(score + 1);
      setFeedback('correct');
    } else {
      setFeedback('incorrect');
    }

    setTimeout(() => {
      setFeedback(null);
      setSelectedWord(null);
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }, 1200);
  };

  const downloadReport = () => {
    const incorrectAnswers = answerHistory.filter(a => !a.isCorrect);
    let report = `Отчёт по тесту: Словарь ${vocabSet}\n`;
    report += `=====================================\n\n`;
    report += `Результат: ${score} из ${questions.length} (${Math.round((score/questions.length)*100)}%)\n`;
    report += `Дата: ${new Date().toLocaleString('ru-RU')}\n\n`;
    
    report += `--- Все ответы ---\n`;
    answerHistory.forEach((rec, index) => {
        const questionText = questionType === 'jp_to_ru' ? rec.question.word : rec.question.translation;
        const correctAnswerText = questionType === 'jp_to_ru' ? rec.question.translation : rec.question.word;
        report += `${index + 1}. Вопрос: ${questionText}\n`;
        report += `   Ваш ответ: ${rec.answer} (${rec.isCorrect ? 'Верно' : 'Ошибка'})\n`;
        if(!rec.isCorrect) {
            report += `   Правильный ответ: ${correctAnswerText}\n`;
        }
    });

    if (incorrectAnswers.length > 0) {
        report += `\n--- Список ошибок ---\n`;
        incorrectAnswers.forEach(rec => {
            report += `- ${rec.question.word} (${rec.question.translation})\n`;
        });
    }

    const blob = new Blob([report], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `word_quiz_report_${vocabSet}_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  
  const incorrectAnswers = answerHistory.filter(a => !a.isCorrect).map(a => a.question);

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
                  {incorrectAnswers.map((word, i) => (
                    <span key={i} className="text-lg text-destructive">{word.word} ({word.translation})</span>
                  ))}
                </div>
              </div>
            )}
            <div className="flex flex-col sm:flex-row gap-2 mt-4 justify-center">
              <Button onClick={downloadReport}>Скачать отчёт</Button>
              {incorrectAnswers.length > 0 && (
                 <Button onClick={() => generateQuestions(true)}>Повторить ошибки</Button>
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
      <Card className="w-full max-w-lg">
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
                const isCorrectOption = option.word === currentQuestion.word;
                const isSelectedOption = selectedWord?.word === option.word;

                return (
                    <Button
                        key={option.word}
                        onClick={() => handleAnswer(option)}
                        className={cn(`h-auto min-h-16 text-lg transition-all duration-300 transform p-2 flex flex-col`,
                            feedback === 'correct' && isCorrectOption ? 'bg-green-500 hover:bg-green-600 text-white animate-pulse scale-105' : '',
                            feedback === 'incorrect' && isSelectedOption ? 'bg-destructive/80' : '',
                            feedback === 'incorrect' && isCorrectOption ? 'bg-green-500' : ''
                        )}
                        disabled={!!feedback}
                    >
                       {isJpToRu ? (
                           <span className="font-normal">{option.translation}</span>
                       ) : (
                           <div>
                               <span className="text-xs font-normal text-muted-foreground">{option.reading}</span>
                               <span className="block font-japanese text-2xl">{option.word}</span>
                           </div>
                       )}
                    </Button>
                );
            })}
          </div>
        </CardContent>
      </Card>
       <Button variant="link" onClick={onQuizEnd} className="mt-8">
          Выйти из теста
        </Button>
    </div>
  );
}
