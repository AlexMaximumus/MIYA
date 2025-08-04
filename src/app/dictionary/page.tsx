
'use client';

import { useState, useMemo } from 'react';
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
import { vocabularyData, type Word } from '@/lib/dictionary-data';
import DictionaryRow from '@/components/dictionary-row';

const allWords = Object.values(vocabularyData).flat();
const partsOfSpeech = [...new Set(allWords.map(word => word.pos))];

export default function DictionaryPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [jlptLevel, setJlptLevel] = useState('all');
    const [partOfSpeech, setPartOfSpeech] = useState('all');

    const filteredWords = useMemo(() => {
        return allWords.filter(word => {
            const matchesSearch = 
                word.word.includes(searchTerm) || 
                word.reading.includes(searchTerm) || 
                word.translation.toLowerCase().includes(searchTerm.toLowerCase());
            
            const matchesJlpt = jlptLevel === 'all' || word.jlpt === jlptLevel;
            const matchesPos = partOfSpeech === 'all' || word.pos === partOfSpeech;

            return matchesSearch && matchesJlpt && matchesPos;
        });
    }, [searchTerm, jlptLevel, partOfSpeech]);

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
                        <CardTitle className="text-2xl md:text-3xl">Словарь</CardTitle>
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
                        <SelectItem value="N5">JLPT N5</SelectItem>
                        <SelectItem value="N4">JLPT N4 (скоро)</SelectItem>
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
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[150px]">Слово</TableHead>
                        <TableHead className="w-[150px]">Чтение</TableHead>
                        <TableHead>Перевод</TableHead>
                        <TableHead className="w-[100px] text-center">Уровень</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {filteredWords.length > 0 ? (
                        filteredWords.map((word, index) => <DictionaryRow key={index} word={word} />)
                    ) : (
                        <TableRow>
                            <TableCell colSpan={4} className="text-center h-24">
                                Ничего не найдено. Попробуйте изменить фильтры.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </Card>
      </div>
    </div>
  );
}
