
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, Share2, Volume2, BookOpen, CheckCircle, XCircle, Lightbulb, Check, HelpCircle, Repeat } from 'lucide-react';
import Link from 'next/link';
import InteractiveText from '@/components/interactive-text';
import InteractiveFormula from '@/components/interactive-formula';
import { grammarAnalyses, dialogueAnalyses } from '@/ai/precomputed-analysis';
import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard';
import { useToast } from '@/hooks/use-toast';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { Reorder } from 'framer-motion';


const LESSON_ID = 'grammar-lesson-2'; // Changed to lesson-2

const katakanaRows = {
    a: [{ kana: 'ア', romaji: 'a' }, { kana: 'イ', romaji: 'i' }, { kana: 'ウ', romaji: 'u' }, { kana: 'エ', romaji: 'e' }, { kana: 'オ', romaji: 'o' }],
    ka: [{ kana: 'カ', romaji: 'ka' }, { kana: 'キ', romaji: 'ki' }, { kana: 'ク', romaji: 'ku' }, { kana: 'ケ', romaji: 'ke' }, { kana: 'コ', romaji: 'ko' }],
    sa: [{ kana: 'サ', romaji: 'sa' }, { kana: 'シ', romaji: 'shi' }, { kana: 'ス', romaji: 'su' }, { kana: 'セ', romaji: 'se' }, { kana: 'ソ', romaji: 'so' }],
    na: [{ kana: 'ナ', romaji: 'na' }, { kana: 'ニ', romaji: 'ni' }, { kana: 'ヌ', romaji: 'nu' }, { kana: 'ネ', romaji: 'ne' }, { kana: 'ノ', romaji: 'no' }],
    ta: [{ kana: 'タ', romaji: 'ta' }, { kana: 'チ', romaji: 'chi' }, { kana: 'ツ', romaji: 'tsu' }, { kana: 'テ', romaji: 'te' }, { kana: 'ト', romaji: 'to' }],
    ha: [{ kana: 'ハ', romaji: 'ha' }, { kana: 'ヒ', romaji: 'hi' }, { kana: 'フ', romaji: 'fu' }, { kana: 'ヘ', romaji: 'he' }, { kana: 'ホ', romaji: 'ho' }],
};

const kanjiList = [
    { kanji: '一', kun: 'ひと', on: 'イチ, イツ', meaning: 'один' },
    { kanji: '二', kun: 'ふた', on: 'ニ', meaning: 'два' },
    { kanji: '三', kun: 'み', on: 'サン', meaning: 'три' },
    { kanji: '四', kun: 'よん, よ', on: 'シ', meaning: 'четыре' },
    { kanji: '室', kun: 'しつ', on: 'シツ', meaning: 'комната' },
    { kanji: '教', kun: 'おしえる', on: 'キョウ', meaning: 'вера, учение / преподавать' },
    { kanji: '習', kun: 'ならう', on: 'シュウ', meaning: 'учиться, обучаться' },
];

const KanaRowDisplay = ({ rowData }: { rowData: { kana: string; romaji: string }[] }) => (
    <div className='flex flex-wrap gap-4 mt-2 justify-center'>
       {rowData.map(char => (
           <Card key={char.kana} className="p-4 flex flex-col items-center justify-center w-24 h-24"><span className="text-4xl font-japanese">{char.kana}</span><span className="text-muted-foreground">{char.romaji}</span></Card>
       ))}
   </div>
);

const ExerciseCard = ({ title, description, children, result, onCheck, canCheck = true }: { title: string; description?: React.ReactNode; children: React.ReactNode; result?: boolean | null; onCheck?: () => void, canCheck?: boolean }) => (
    <Card>
        <CardHeader>
            <CardTitle>{title}</CardTitle>
            {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
        <CardContent>{children}</CardContent>
        {onCheck && (
            <CardFooter className="flex flex-col items-start gap-4">
                {canCheck && <Button onClick={onCheck}>Проверить</Button>}
                {result === true && <span className="flex items-center gap-2 text-green-600"><CheckCircle/> Верно!</span>}
                {result === false && <span className="flex items-center gap-2 text-destructive"><XCircle/> Ошибка. Попробуйте снова.</span>}
            </CardFooter>
        )}
    </Card>
);


export default function GrammarLesson2Page() { // Changed name
    const [progress, setProgress] = useState(0);
    const [answers, setAnswers] = useState<Record<string, any>>({});
    const [results, setResults] = useState<Record<string, boolean | null>>({});

    const [_, copy] = useCopyToClipboard();
    const { toast } = useToast();

    const handleShare = () => {
        copy(window.location.href)
            .then(() => toast({ title: 'Ссылка скопирована!', description: 'Вы можете поделиться этим уроком с кем угодно.' }))
            .catch(() => toast({ title: 'Ошибка', description: 'Не удалось скопировать ссылку.', variant: 'destructive' }));
    }

    const handleInputChange = (id: string, value: string) => {
        setAnswers(prev => ({ ...prev, [id]: value }));
        setResults(prev => ({...prev, [id]: null}));
    };

    const checkAnswer = (id: string, correctAnswer: string) => {
        const userAnswer = (answers[id] || '').trim().replace(/[.\s。]/g, '');
        const isCorrect = userAnswer === correctAnswer.replace(/[.\s。]/g, '');
        setResults(prev => ({ ...prev, [id]: isCorrect }));
    };
    
    const checkAll = () => {
        const newResults: Record<string, boolean> = {};
        
        // Ex 2
        Object.entries(correctAnswersEx2).forEach(([key, value]) => {
            const id = `ex2_${key}`;
            newResults[id] = (answers[id] || '').trim().replace(/[.\s。]/g, '') === value.replace(/[.\s。]/g, '');
        });
        
        // Ex 4
        Object.entries(correctAnswersEx4).forEach(([key, value]) => {
            const id = `ex4_${key}`;
            newResults[id] = (answers[id] || '').trim().replace(/[.\s。]/g, '') === value.replace(/[.\s。]/g, '');
        });

        // Ex 6
        Object.entries(correctAnswersEx6).forEach(([key, value]) => {
            const id = `ex6_${key}`;
            newResults[id] = (answers[id] || '') === value;
        });

        // Ex 7
         Object.entries(correctAnswersEx7).forEach(([key, value]) => {
            const id = `ex7_${key}`;
            newResults[id] = (answers[id] || '').trim().replace(/[.\s。]/g, '') === value.replace(/[.\s。]/g, '');
        });

        // Ex 11
        Object.entries(correctAnswersEx11).forEach(([key, value]) => {
            const id = `ex11_${key}`;
            newResults[id] = (answers[id] || '').trim().replace(/[.\s。]/g, '') === value.replace(/[.\s。]/g, '');
        });
        
        // Ex 13
        Object.entries(correctAnswersEx13).forEach(([key, value]) => {
            const id = `ex13_${key}`;
            newResults[id] = (answers[id] || '') === value;
        });

        setResults(prev => ({...prev, ...newResults}));
    }

    const correctAnswersEx2 = {
        '1': 'わたしは先生ではありません。学生です。',
        '2': '田中さんは医者ではありません。技師です。',
        '3': 'あのかたは学生ではありません。先生です。',
        '4': '山田さんは先生ではありません。学生です。'
    };
    
    const correctAnswersEx4 = {
        '1': 'わたしは先生ですか。はい、先生です。',
        '2': '田中さんは医者ですか。はい、医者です。',
        '3': 'あのかたは学生ですか。はい、学生です。',
        '4': '山田さんは技師ですか。はい、技師です。',
    };
    
    const correctAnswersEx6 = {
        '1': 'だれ', '2': 'なん', '3': 'なん', '4': 'だれ', '5': 'なに'
    };
    
    const correctAnswersEx7 = {
        '1': '山田さんが先生です。',
        '2': '中山さんが医者です。',
        '3': '山本さんが技師です。',
        '4': 'ご専門は文学です。',
        '5': 'お名前はアンナです。',
    };

    const correctAnswersEx11 = {
        '1': 'わたしは医者ですか、先生ですか。',
        '2': '田中さんは技師ですか、医者ですか。',
        '3': 'ご専門は文学ですか、歴史ですか。',
        '4': '山田さんは先生ですか、学生ですか。'
    };

    const correctAnswersEx13 = {
        '1': 'は', '2': 'が', '3': 'は', '4': 'は', '5': 'は', '6': 'は', '7a': 'ですか', '7b': 'ですか', '8': 'はい'
    };


  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-background p-4 sm:p-8 pt-16 sm:pt-24 animate-fade-in">
        <div className="w-full max-w-4xl">
            <div className="flex justify-between items-center mb-4">
                <Button asChild variant="ghost">
                    <Link href="/grammar">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        К списку уроков
                    </Link>
                </Button>
                <Button variant="outline" onClick={handleShare}>
                    <Share2 className="mr-2 h-4 w-4" />
                    Поделиться уроком
                </Button>
            </div>
            <Card className="w-full mb-8">
                <CardHeader>
                    <p className="text-sm text-primary font-semibold">Урок 2 — Грамматика</p>
                    <CardTitle className="text-2xl md:text-3xl">Тема в разработке...</CardTitle>
                    <CardDescription>Содержимое этого урока будет добавлено в следующих обновлениях.</CardDescription>
                    <Progress value={0} className="mt-2" />
                </CardHeader>
            </Card>

            <div className="mt-12 text-center flex flex-col items-center gap-4">
                <Button size="lg" asChild className="btn-gradient w-full max-w-xs">
                    <Link href="/grammar/lesson-3">Перейти к Уроку 3 →</Link>
                </Button>
            </div>
        </div>
    </div>
  );
}
