
'use client';

import { useState, useMemo, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, BookText, Filter, TestTubeDiagonal } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { vocabularyData } from '@/lib/dictionary-data';
import DictionaryRow from '@/components/dictionary-row';
import { useVirtualizer } from '@tanstack/react-virtual';
import * as wanakana from 'wanakana';
import WordQuiz from '@/components/word-quiz';
import type { QuizLength, VocabSet, QuizQuestionTypeVocab } from '@/types/quiz-types';

const allWords = [...vocabularyData.n5, ...vocabularyData.n4, ...vocabularyData.n3, ...vocabularyData.n2, ...vocabularyData.n1];
const partsOfSpeech = [...new Set(allWords.map(word => word.pos))].sort();
const jlptLevels: VocabSet[] = ['N5', 'N4', 'N3', 'N2', 'N1'];


export default function DictionaryPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [jlptLevel, setJlptLevel] = useState<VocabSet | 'all'>('all');
    const [partOfSpeech, setPartOfSpeech] = useState('all');
    
    // Quiz state
    const [isQuizActive, setQuizActive] = useState(false);
    const [quizJlptLevel, setQuizJlptLevel] = useState<VocabSet>('N5');
    const [quizLength, setQuizLength] = useState<QuizLength>('25');
    const [quizQuestionType, setQuizQuestionType] = useState<QuizQuestionTypeVocab>('jp_to_ru');

    const parentRef = useRef<HTMLDivElement>(null);

    const filteredWords = useMemo(() => {
        return allWords.filter(word => {
            const matchesJlpt = jlptLevel === 'all' || word.jlpt === jlptLevel;
            const matchesPos = partOfSpeech === 'all' || word.pos === partOfSpeech;

            if (!matchesJlpt || !matchesPos) return false;
            
            if (searchTerm.trim() === '') return true;

            const lowerSearchTerm = searchTerm.toLowerCase();

            const translationWords = word.translation.toLowerCase().split(/[\s,]+/);
            const wholeWordMatch = translationWords.includes(lowerSearchTerm);
            const partialTranslationMatch = word.translation.toLowerCase().includes(lowerSearchTerm);

            const romajiSearchTerm = wanakana.toRomaji(lowerSearchTerm);
            const hiraganaSearchTerm = wanakana.toHiragana(lowerSearchTerm);
            const katakanaSearchTerm = wanakana.toKatakana(lowerSearchTerm);

            const matchesWord = word.word.includes(hiraganaSearchTerm) || word.word.includes(katakanaSearchTerm);
            const matchesReading = word.reading.includes(hiraganaSearchTerm) || word.reading.includes(katakanaSearchTerm);
            
            const readingAsRomaji = wanakana.toRomaji(word.reading);
            const matchesRomaji = readingAsRomaji.includes(romajiSearchTerm);
            
            return wholeWordMatch || partialTranslationMatch || matchesWord || matchesReading || matchesRomaji;
        });
    }, [searchTerm, jlptLevel, partOfSpeech]);

    const rowVirtualizer = useVirtualizer({
        count: filteredWords.length,
        getScrollElement: () => parentRef.current,
        estimateSize: () => 61,
        overscan: 5,
    });
    
    const startQuiz = () => {
        setQuizActive(true);
    };

    const endQuiz = () => {
        setQuizActive(false);
    };

    if (isQuizActive) {
        const wordsForQuiz = vocabularyData[quizJlptLevel.toLowerCase() as 'n5' | 'n4' | 'n3' | 'n2' | 'n1'];
        return <WordQuiz
            onQuizEnd={endQuiz}
            words={wordsForQuiz}
            questionType={quizQuestionType}
            quizLength={quizLength}
            vocabSet={quizJlptLevel}
        />
    }


  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-background p-4 sm:p-8 pt-16 sm:pt-24 animate-fade-in">
      <div className="w-full max-w-6xl">
        <div className="flex justify-between items-center mb-4">
          <Button asChild variant="ghost">
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Назад на главную
            </Link>
          </Button>
        </div>
        <Card className="w-full mb-8">
            <CardHeader>
                <div className="flex items-center gap-4">
                    <BookText className="w-10 h-10 text-primary" />
                    <div>
                        <CardTitle className="text-2xl md:text-3xl">Словарь ({allWords.length.toLocaleString('ru-RU')} слов)</CardTitle>
                        <CardDescription>Ищите слова, фильтруйте списки и проверяйте свои знания.</CardDescription>
                    </div>
                </div>
            </CardHeader>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <Card className="w-full">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Filter className="w-5 h-5" /> Фильтры поиска</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <Input
                        placeholder="Поиск (рус, kana, romaji)..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="md:col-span-2"
                    />
                     <Select value={jlptLevel} onValueChange={(val) => setJlptLevel(val as VocabSet | 'all')}>
                        <SelectTrigger>
                            <SelectValue placeholder="Уровень JLPT" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Все уровни JLPT</SelectItem>
                            {jlptLevels.map(level => (
                                 <SelectItem key={level} value={level}>JLPT {level}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                     <Select value={partOfSpeech} onValueChange={setPartOfSpeech}>
                        <SelectTrigger>
                            <SelectValue placeholder="Часть речи" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Все части речи</SelectItem>
                            {partsOfSpeech.map(pos => (
                                <SelectItem key={pos} value={pos}>{pos}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </CardContent>
            </Card>

            <Card className="w-full">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><TestTubeDiagonal className="w-5 h-5" /> Тест по словарю</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Select value={quizJlptLevel} onValueChange={(v) => setQuizJlptLevel(v as VocabSet)}>
                        <SelectTrigger>
                            <SelectValue placeholder="Уровень слов" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="N5">Словарь N5</SelectItem>
                            <SelectItem value="N4">Словарь N4</SelectItem>
                            <SelectItem value="N3">Словарь N3</SelectItem>
                            <SelectItem value="N2">Словарь N2</SelectItem>
                            <SelectItem value="N1">Словарь N1</SelectItem>
                        </SelectContent>
                    </Select>
                    <Select value={quizQuestionType} onValueChange={(v) => setQuizQuestionType(v as QuizQuestionTypeVocab)}>
                        <SelectTrigger>
                            <SelectValue placeholder="Тип теста" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="jp_to_ru">Слово → Перевод</SelectItem>
                            <SelectItem value="ru_to_jp">Перевод → Слово</SelectItem>
                        </SelectContent>
                    </Select>
                    <Select value={quizLength} onValueChange={(v) => setQuizLength(v as QuizLength)}>
                        <SelectTrigger>
                            <SelectValue placeholder="Длина теста" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="25">Случайные 25</SelectItem>
                            <SelectItem value="50">Случайные 50</SelectItem>
                            <SelectItem value="full">Полный тест</SelectItem>
                        </SelectContent>
                    </Select>
                     <Button size="lg" onClick={startQuiz} className="btn-gradient md:col-span-2">
                        Начать тест
                    </Button>
                </CardContent>
            </Card>
        </div>


        <Card>
            <div ref={parentRef} className="h-[600px] overflow-auto">
                <Table style={{ height: `${rowVirtualizer.getTotalSize()}px` }}>
                    <TableHeader className="sticky top-0 bg-card z-10">
                        <TableRow>
                            <TableHead className="w-[150px]">Слово</TableHead>
                            <TableHead className="w-[150px]">Чтение</TableHead>
                            <TableHead>Перевод</TableHead>
                            <TableHead className="w-[100px] text-center">Уровень</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {rowVirtualizer.getVirtualItems().length > 0 ? (
                             rowVirtualizer.getVirtualItems().map(virtualRow => {
                                const word = filteredWords[virtualRow.index];
                                return (
                                    <TableRow
                                        key={virtualRow.key}
                                        style={{
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            width: '100%',
                                            height: `${virtualRow.size}px`,
                                            transform: `translateY(${virtualRow.start}px)`,
                                        }}
                                    >
                                        <DictionaryRow word={word} />
                                    </TableRow>
                                );
                            })
                        ) : (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center h-24">
                                    Ничего не найдено. Попробуйте изменить фильтры.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </Card>
      </div>
    </div>
  );
}
