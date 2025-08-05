
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Clipboard, Send, BookOpen } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
  } from "@/components/ui/dialog"
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
    type CarouselApi,
} from "@/components/ui/carousel"
import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { useTeacherMode } from '@/hooks/use-teacher-mode';
import type { QuizLength, VocabSet, QuizQuestionTypeVocab, KanaSet, QuizQuestionTypeKana } from '@/types/quiz-types';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

type QuizType = 'dictionary' | 'kana' | 'grammar' | 'word-formation' | 'textbook';

const TOTAL_TEXTBOOK_PAGES = 339;
const textbookPages = Array.from({ length: TOTAL_TEXTBOOK_PAGES }, (_, i) => i + 1);


const formatPageNumber = (num: number): string => {
    return num.toString().padStart(4, '0');
};


export default function HomeworkGeneratorPage() {
    const [quizType, setQuizType] = useState<QuizType>('textbook');
    
    // Dictionary state
    const [vocabSet, setVocabSet] = useState<VocabSet>('N5');
    const [questionTypeVocab, setQuestionTypeVocab] = useState<QuizQuestionTypeVocab>('jp_to_ru');
    const [quizLengthVocab, setQuizLengthVocab] = useState<QuizLength>('25');
    
    // Kana state
    const [kanaSet, setKanaSet] = useState<KanaSet>('hiragana');
    const [questionTypeKana, setQuestionTypeKana] = useState<QuizQuestionTypeKana>('kana-to-romaji');
    const [quizLengthKana, setQuizLengthKana] = useState<QuizLength>('full');

    // Grammar/Word-Formation state
    const [lesson, setLesson] = useState('1');

    // Textbook state
    const [pages, setPages] = useState('');
    const [api, setApi] = useState<CarouselApi>()
    const [currentSlide, setCurrentSlide] = useState(0)

    const [generatedUrl, setGeneratedUrl] = useState('');
    const [telegramLink, setTelegramLink] = useState('');

    const [_, copy] = useCopyToClipboard();
    const { toast } = useToast();
    const router = useRouter();
    const { isTeacherMode } = useTeacherMode();
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
        // Redirect if not in teacher mode
        if (isTeacherMode === false) { // check for explicit false, as initial state can be undefined
             router.push('/');
        }
    }, [isTeacherMode, router]);
    
    useEffect(() => {
        if (!api) {
          return
        }
     
        setCurrentSlide(api.selectedScrollSnap())
     
        api.on("select", () => {
          setCurrentSlide(api.selectedScrollSnap())
        })
      }, [api])


    const addPageToSelection = (pageNumber: number) => {
        const currentPages = pages.split(',').filter(p => p.trim() !== '');
        const pageStr = String(pageNumber);
        if (!currentPages.includes(pageStr)) {
            const newPages = [...currentPages, pageStr];
            // Sort pages numerically
            newPages.sort((a, b) => Number(a) - Number(b));
            setPages(newPages.join(', '));
            toast({ title: `Страница ${pageNumber} добавлена!`})
        } else {
            toast({ title: `Страница ${pageNumber} уже добавлена.`, variant: "destructive"})
        }
    }


    const generateLink = () => {
        if (typeof window !== 'undefined') {
            const baseUrl = window.location.origin;
            let path = '';
            const params = new URLSearchParams();

            switch(quizType) {
                case 'dictionary':
                    path = '/dictionary';
                    params.append('quiz', 'true');
                    params.append('vocabSet', vocabSet);
                    params.append('questionType', questionTypeVocab);
                    params.append('quizLength', quizLengthVocab);
                    break;
                case 'kana':
                    path = '/kana';
                    params.append('quiz', 'true');
                    params.append('kanaSet', kanaSet);
                    params.append('questionType', questionTypeKana);
                    params.append('quizLength', quizLengthKana);
                    break;
                case 'grammar':
                    path = `/grammar/lesson-${lesson}`;
                    break;
                case 'word-formation':
                    path = `/word-formation/lesson-${lesson}`;
                    break;
                case 'textbook':
                    path = '/homework-viewer';
                    params.append('pages', pages.replace(/\s/g, ''));
                    break;
            }
            
            const fullUrl = `${baseUrl}${path}?${params.toString()}`;
            setGeneratedUrl(fullUrl);

            const shareText = encodeURIComponent('Привет! Вот твое домашнее задание:');
            const shareUrl = encodeURIComponent(fullUrl);
            setTelegramLink(`https://t.me/share/url?url=${shareUrl}&text=${shareText}`);
        }
    };

    const handleCopy = () => {
        copy(generatedUrl)
            .then(() => toast({ title: 'Ссылка скопирована!', description: 'Теперь вы можете отправить ее ученику.' }))
            .catch(() => toast({ title: 'Ошибка', description: 'Не удалось скопировать ссылку.', variant: 'destructive' }));
    };
    
    const renderOptions = () => {
        switch(quizType) {
            case 'dictionary':
                return (
                    <>
                        <Select value={vocabSet} onValueChange={(v) => setVocabSet(v as VocabSet)}>
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

                        <Select value={questionTypeVocab} onValueChange={(v) => setQuestionTypeVocab(v as QuizQuestionTypeVocab)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Тип вопросов" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="jp_to_ru">Слово → Перевод</SelectItem>
                                <SelectItem value="ru_to_jp">Перевод → Слово</SelectItem>
                            </SelectContent>
                        </Select>

                        <Select value={quizLengthVocab} onValueChange={(v) => setQuizLengthVocab(v as QuizLength)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Количество вопросов" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="25">25 вопросов</SelectItem>
                                <SelectItem value="50">50 вопросов</SelectItem>
                                <SelectItem value="full">Все слова уровня</SelectItem>
                            </SelectContent>
                        </Select>
                    </>
                );
            case 'kana':
                 return (
                    <>
                        <Select value={kanaSet} onValueChange={(v) => setKanaSet(v as KanaSet)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Азбука" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="hiragana">Хирагана</SelectItem>
                                <SelectItem value="katakana">Катакана</SelectItem>
                                <SelectItem value="all">Смешанный</SelectItem>
                            </SelectContent>
                        </Select>

                        <Select value={questionTypeKana} onValueChange={(v) => setQuestionTypeKana(v as QuizQuestionTypeKana)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Тип вопросов" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="kana-to-romaji">Символ → Ромадзи</SelectItem>
                                <SelectItem value="romaji-to-kana">Ромадзи → Символ</SelectItem>
                            </SelectContent>
                        </Select>

                        <Select value={quizLengthKana} onValueChange={(v) => setQuizLengthKana(v as QuizLength)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Количество вопросов" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="25">25 вопросов</SelectItem>
                                <SelectItem value="50">50 вопросов</SelectItem>
                                <SelectItem value="full">Полный тест</SelectItem>
                            </SelectContent>
                        </Select>
                    </>
                );
            case 'grammar':
            case 'word-formation':
                 return (
                    <Select value={lesson} onValueChange={setLesson}>
                        <SelectTrigger>
                            <SelectValue placeholder="Урок" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="1">Урок 1</SelectItem>
                            {quizType === 'grammar' && <SelectItem value="2">Урок 2</SelectItem>}
                            <SelectItem value="3" disabled>Урок 3 (скоро)</SelectItem>
                        </SelectContent>
                    </Select>
                );
            case 'textbook':
                return (
                    <div className="md:col-span-2 space-y-2">
                        <Label htmlFor="pages">Номера страниц (через запятую или диапазоны)</Label>
                        <div className="flex gap-2">
                            <Input
                                id="pages"
                                placeholder="Например: 5, 8, 12-15"
                                value={pages}
                                onChange={(e) => setPages(e.target.value)}
                            />
                             <Dialog>
                                <DialogTrigger asChild>
                                    <Button variant="outline"><BookOpen className="mr-2 h-4 w-4" />Просмотр</Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-4xl h-[90vh] flex flex-col">
                                    <DialogHeader>
                                    <DialogTitle>Просмотр учебника</DialogTitle>
                                    <CardDescription>
                                        Выберите нужные страницы для домашнего задания.
                                    </CardDescription>
                                    </DialogHeader>
                                    <div className="flex-grow rounded-lg overflow-hidden border relative flex items-center justify-center">
                                       <Carousel setApi={setApi} className="w-full max-w-sm">
                                            <CarouselContent>
                                            {textbookPages.map(pageNumber => (
                                                <CarouselItem key={pageNumber}>
                                                    <div className="p-1">
                                                        <Dialog>
                                                            <DialogTrigger asChild>
                                                                <Card className="border-none shadow-none cursor-zoom-in">
                                                                    <CardContent className="flex aspect-square items-center justify-center p-0 relative">
                                                                        <Image
                                                                            src={`/textbook/textbook_page-${formatPageNumber(pageNumber)}.jpg`}
                                                                            alt={`Страница учебника ${pageNumber}`}
                                                                            width={800}
                                                                            height={1131}
                                                                            className={cn("w-full h-full object-contain transition-transform duration-300",
                                                                                currentSlide + 1 === pageNumber ? "scale-105" : "scale-75 opacity-50"
                                                                            )}
                                                                        />
                                                                    </CardContent>
                                                                </Card>
                                                            </DialogTrigger>
                                                            <DialogContent className="max-w-5xl h-[95vh] p-2">
                                                                <Image
                                                                    src={`/textbook/textbook_page-${formatPageNumber(pageNumber)}.jpg`}
                                                                    alt={`Страница учебника ${pageNumber} - увеличено`}
                                                                    width={1200}
                                                                    height={1697}
                                                                    className="w-full h-full object-contain"
                                                                />
                                                            </DialogContent>
                                                        </Dialog>
                                                    </div>
                                                </CarouselItem>
                                            ))}
                                            </CarouselContent>
                                            <CarouselPrevious />
                                            <CarouselNext />
                                        </Carousel>
                                    </div>
                                    <DialogFooter className="flex-row justify-between items-center pt-4">
                                        <div className="text-lg font-semibold">
                                            Страница {currentSlide + 1}
                                        </div>
                                        <Button onClick={() => addPageToSelection(currentSlide + 1)}>Добавить страницу в Д/З</Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        </div>
                    </div>
                )
            default: return null;
        }
    }

    if (!isClient || isTeacherMode === false) {
        // Render nothing or a loading spinner while redirecting
        return null;
    }


    return (
        <div className="flex flex-col items-center justify-start min-h-screen bg-background p-4 sm:p-8 pt-16 sm:pt-24 animate-fade-in pb-24">
            <div className="w-full max-w-2xl">
                <div className="flex justify-between items-center mb-4">
                    <Button asChild variant="ghost">
                        <Link href="/">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Назад на главную
                        </Link>
                    </Button>
                </div>
                <Card className="w-full mb-8 shadow-lg border-primary/50">
                    <CardHeader>
                        <CardTitle className="text-2xl md:text-3xl">Конструктор домашних заданий</CardTitle>
                        <CardDescription>Создайте тест для ученика и поделитесь ссылкой.</CardDescription>
                    </CardHeader>
                </Card>

                <Card className="w-full">
                    <CardHeader>
                        <CardTitle>Параметры теста</CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Select value={quizType} onValueChange={(v) => setQuizType(v as QuizType)}>
                            <SelectTrigger className="md:col-span-2">
                                <SelectValue placeholder="Тип задания" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="dictionary">Тест по словарю</SelectItem>
                                <SelectItem value="kana">Тест по Кане</SelectItem>
                                <SelectItem value="grammar">Урок грамматики</SelectItem>
                                <SelectItem value="word-formation">Урок словообразования</SelectItem>
                                <SelectItem value="textbook">Задание по учебнику (Изображения)</SelectItem>
                            </SelectContent>
                        </Select>
                        
                        {renderOptions()}
                        
                        <Button size="lg" onClick={generateLink} className="md:col-span-2 btn-gradient">
                            Сгенерировать ссылку
                        </Button>
                    </CardContent>
                </Card>
                
                {generatedUrl && (
                    <Card className="mt-8 animate-fade-in">
                        <CardHeader>
                            <CardTitle>Готовая ссылка</CardTitle>
                        </CardHeader>
                        <CardContent className="flex items-center gap-2">
                            <Input value={generatedUrl} readOnly className="text-muted-foreground"/>
                            <Button onClick={handleCopy} size="icon" variant="outline">
                                <Clipboard className="w-5 h-5"/>
                            </Button>
                            <Button asChild size="icon" variant="outline">
                                <a href={telegramLink} target="_blank" rel="noopener noreferrer">
                                    <Send className="w-5 h-5" />
                                </a>
                            </Button>
                        </CardContent>
                    </Card>
                )}

            </div>
        </div>
    );
}
