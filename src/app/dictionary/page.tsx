
'use client';

import { useState, useMemo, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, BookText, Filter } from 'lucide-react';
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

const allWords = [...vocabularyData.n5, ...vocabularyData.n4, ...vocabularyData.n3, ...vocabularyData.n2, ...vocabularyData.n1];
const partsOfSpeech = [...new Set(allWords.map(word => word.pos))].sort();
const jlptLevels = ['N5', 'N4', 'N3', 'N2', 'N1'];


export default function DictionaryPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [jlptLevel, setJlptLevel] = useState('all');
    const [partOfSpeech, setPartOfSpeech] = useState('all');
    
    const parentRef = useRef<HTMLDivElement>(null);

    const filteredWords = useMemo(() => {
        return allWords.filter(word => {
            const searchTermLower = searchTerm.toLowerCase();
            const matchesSearch = 
                word.word.includes(searchTerm) || 
                word.reading.includes(searchTerm) || 
                word.translation.toLowerCase().includes(searchTermLower);
            
            const matchesJlpt = jlptLevel === 'all' || word.jlpt === jlptLevel;
            const matchesPos = partOfSpeech === 'all' || word.pos === partOfSpeech;

            return matchesSearch && matchesJlpt && matchesPos;
        });
    }, [searchTerm, jlptLevel, partOfSpeech]);

    const rowVirtualizer = useVirtualizer({
        count: filteredWords.length,
        getScrollElement: () => parentRef.current,
        estimateSize: () => 61, // Estimated height of a row in pixels
        overscan: 5,
    });


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
                        <CardDescription>Ищите, фильтруйте и изучайте японскую лексику.</CardDescription>
                    </div>
                </div>
            </CardHeader>
        </Card>

        <Card className="w-full mb-8">
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Filter className="w-5 h-5" /> Фильтры</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
                 <Input
                    placeholder="Поиск по слову, чтению или переводу..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="md:col-span-3"
                />
                 <Select value={jlptLevel} onValueChange={setJlptLevel}>
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
