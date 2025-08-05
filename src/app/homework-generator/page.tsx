
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Clipboard, Send, BookOpen, PlusCircle, Trash2, GripVertical, Settings, FileText, Image as ImageIcon } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
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
    DialogDescription,
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
import { AnimatePresence, Reorder } from 'framer-motion';
import { Textarea } from '@/components/ui/textarea';

type TaskType = 'textbook' | 'dictionary' | 'kana' | 'grammar' | 'instructions';
interface Task {
    id: string;
    type: TaskType;
    title: string;
    settings: any;
}

const TOTAL_TEXTBOOK_PAGES = 339;
const textbookPages = Array.from({ length: TOTAL_TEXTBOOK_PAGES }, (_, i) => i + 1);

const formatPageNumber = (num: number): string => {
    return num.toString().padStart(4, '0');
};


export default function HomeworkGeneratorPage() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [generatedUrl, setGeneratedUrl] = useState('');
    const [telegramLink, setTelegramLink] = useState('');
    const [homeworkTitle, setHomeworkTitle] = useState('');

    const [_, copy] = useCopyToClipboard();
    const { toast } = useToast();
    const router = useRouter();
    const { isTeacherMode } = useTeacherMode();
    const [isClient, setIsClient] = useState(false);

    // Textbook viewer state
    const [api, setApi] = useState<CarouselApi>()
    const [currentSlide, setCurrentSlide] = useState(0)


    useEffect(() => {
        setIsClient(true);
        if (isTeacherMode === false) {
             router.push('/');
        }
    }, [isTeacherMode, router]);
    
    useEffect(() => {
        if (!api) return;
        setCurrentSlide(api.selectedScrollSnap());
        api.on("select", () => setCurrentSlide(api.selectedScrollSnap()));
    }, [api]);

    const addTask = (type: TaskType) => {
        const newTask: Task = {
            id: `${type}-${Date.now()}`,
            type,
            title: getTaskTitle(type),
            settings: getDefaultSettings(type)
        };
        setTasks([...tasks, newTask]);
    };

    const removeTask = (id: string) => {
        setTasks(tasks.filter(task => task.id !== id));
    };

    const updateTaskSettings = (id: string, newSettings: any) => {
        setTasks(tasks.map(task => task.id === id ? { ...task, settings: { ...task.settings, ...newSettings } } : task));
    };

    const getTaskTitle = (type: TaskType) => {
        switch(type) {
            case 'textbook': return 'Страницы из учебника';
            case 'dictionary': return 'Тест по словарю';
            case 'kana': return 'Тест по Кане';
            case 'grammar': return 'Урок грамматики';
            case 'instructions': return 'Блок с инструкциями';
            default: return 'Новое задание';
        }
    }

    const getDefaultSettings = (type: TaskType) => {
        switch(type) {
            case 'textbook': return { pages: '' };
            case 'dictionary': return { vocabSet: 'N5', questionType: 'jp_to_ru', quizLength: '25' };
            case 'kana': return { kanaSet: 'hiragana', questionType: 'kana-to-romaji', quizLength: 'full' };
            case 'grammar': return { lesson: '1' };
            case 'instructions': return { text: '' };
            default: return {};
        }
    }
    
    const generateLink = () => {
        if (!homeworkTitle.trim() || tasks.length === 0) {
            toast({
                title: 'Не все поля заполнены',
                description: 'Пожалуйста, укажите название работы и добавьте хотя бы одно задание.',
                variant: 'destructive',
            });
            return;
        }

        const assignmentData = {
            title: homeworkTitle,
            tasks: tasks,
        };

        try {
            const jsonString = JSON.stringify(assignmentData);
            const encodedData = btoa(encodeURIComponent(jsonString));
            
            const url = `${window.location.origin}/homework?assignment=${encodedData}`;
            setGeneratedUrl(url);

            const tgMessage = `Домашнее задание: ${homeworkTitle}\n\n${url}`;
            setTelegramLink(`https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(`Домашнее задание: ${homeworkTitle}`)}`);
            
            toast({
                title: 'Ссылка успешно сгенерирована!',
                description: 'Теперь вы можете скопировать её или отправить в Telegram.',
            });

        } catch (error) {
            console.error("Failed to generate link:", error);
            toast({
                title: 'Ошибка при генерации ссылки',
                description: 'Не удалось создать ссылку. Пожалуйста, попробуйте снова.',
                variant: 'destructive',
            });
        }
    };

    const handleCopy = () => {
        copy(generatedUrl)
            .then(() => toast({ title: 'Ссылка скопирована!' }))
            .catch(() => toast({ title: 'Ошибка', variant: 'destructive' }));
    };

    const renderTaskSettings = (task: Task) => {
        const { id, type, settings } = task;

        const addPageToSelection = (pageNumber: number) => {
            const currentPages = settings.pages.split(',').filter((p: string) => p.trim() !== '');
            const pageStr = String(pageNumber);
            if (!currentPages.includes(pageStr)) {
                const newPages = [...currentPages, pageStr];
                newPages.sort((a, b) => Number(a) - Number(b));
                updateTaskSettings(id, { pages: newPages.join(', ') });
                toast({ title: `Страница ${pageNumber} добавлена!`})
            } else {
                toast({ title: `Страница ${pageNumber} уже добавлена.`, variant: "destructive"})
            }
        }

        switch(type) {
            case 'textbook':
                return (
                    <div className="space-y-2 mt-2">
                        <Label htmlFor={`pages-${id}`}>Номера страниц (через запятую или диапазоны)</Label>
                        <div className="flex gap-2">
                            <Input
                                id={`pages-${id}`}
                                placeholder="Например: 5, 8, 12-15"
                                value={settings.pages}
                                onChange={(e) => updateTaskSettings(id, { pages: e.target.value })}
                            />
                            <Dialog>
                                <DialogTrigger asChild><Button variant="outline" size="icon"><BookOpen /></Button></DialogTrigger>
                                <DialogContent className="max-w-4xl h-[90vh] flex flex-col">
                                    <DialogHeader>
                                        <DialogTitle>Просмотр учебника</DialogTitle>
                                        <DialogDescription>Выберите нужные страницы для домашнего задания.</DialogDescription>
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
                                                                        <Image src={`/textbook/textbook_page-${formatPageNumber(pageNumber)}.jpg`} alt={`Страница ${pageNumber}`} width={800} height={1131} className={cn("w-full h-full object-contain transition-transform duration-300", currentSlide + 1 === pageNumber ? "scale-105" : "scale-75 opacity-50")} unoptimized />
                                                                    </CardContent>
                                                                </Card>
                                                            </DialogTrigger>
                                                            <DialogContent className="max-w-5xl h-[95vh] p-2">
                                                                <Image src={`/textbook/textbook_page-${formatPageNumber(pageNumber)}.jpg`} alt={`Страница ${pageNumber}`} width={1200} height={1697} className="w-full h-full object-contain" unoptimized />
                                                            </DialogContent>
                                                        </Dialog>
                                                    </div>
                                                </CarouselItem>
                                            ))}
                                            </CarouselContent>
                                            <CarouselPrevious /><CarouselNext />
                                        </Carousel>
                                    </div>
                                    <DialogFooter className="flex-row justify-between items-center pt-4">
                                        <div className="text-lg font-semibold">Страница {currentSlide + 1}</div>
                                        <Button onClick={() => addPageToSelection(currentSlide + 1)}>Добавить страницу в Д/З</Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        </div>
                    </div>
                );
            case 'dictionary':
                return (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-2">
                        <Select value={settings.vocabSet} onValueChange={(v) => updateTaskSettings(id, { vocabSet: v })}>
                            <SelectTrigger><SelectValue placeholder="Уровень" /></SelectTrigger>
                            <SelectContent><SelectItem value="N5">N5</SelectItem><SelectItem value="N4">N4</SelectItem></SelectContent>
                        </Select>
                        <Select value={settings.questionType} onValueChange={(v) => updateTaskSettings(id, { questionType: v })}>
                            <SelectTrigger><SelectValue placeholder="Тип" /></SelectTrigger>
                            <SelectContent><SelectItem value="jp_to_ru">Слово → Перевод</SelectItem><SelectItem value="ru_to_jp">Перевод → Слово</SelectItem></SelectContent>
                        </Select>
                        <Select value={settings.quizLength} onValueChange={(v) => updateTaskSettings(id, { quizLength: v })}>
                            <SelectTrigger><SelectValue placeholder="Длина" /></SelectTrigger>
                            <SelectContent><SelectItem value="25">25</SelectItem><SelectItem value="50">50</SelectItem><SelectItem value="full">Все</SelectItem></SelectContent>
                        </Select>
                    </div>
                );
            case 'kana':
                 return (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                        <Select value={settings.kanaSet} onValueChange={(v) => updateTaskSettings(id, { kanaSet: v })}>
                            <SelectTrigger><SelectValue placeholder="Азбука" /></SelectTrigger>
                            <SelectContent><SelectItem value="hiragana">Хирагана</SelectItem><SelectItem value="katakana">Катакана</SelectItem><SelectItem value="all">Все</SelectItem></SelectContent>
                        </Select>
                        <Select value={settings.questionType} onValueChange={(v) => updateTaskSettings(id, { questionType: v })}>
                            <SelectTrigger><SelectValue placeholder="Тип" /></SelectTrigger>
                            <SelectContent><SelectItem value="kana-to-romaji">Кана → Ромадзи</SelectItem><SelectItem value="romaji-to-kana">Ромадзи → Кана</SelectItem></SelectContent>
                        </Select>
                    </div>
                );
            case 'grammar':
                 return (
                    <div className="mt-2">
                        <Select value={settings.lesson} onValueChange={(v) => updateTaskSettings(id, { lesson: v })}>
                            <SelectTrigger><SelectValue placeholder="Урок" /></SelectTrigger>
                            <SelectContent><SelectItem value="1">Урок 1</SelectItem><SelectItem value="2">Урок 2</SelectItem></SelectContent>
                        </Select>
                    </div>
                );
            case 'instructions':
                 return (
                    <div className="space-y-2 mt-2">
                        <Label htmlFor={`instr-text-${id}`}>Текст задания</Label>
                        <Textarea
                            id={`instr-text-${id}`}
                            placeholder="Например: Прочитайте статью по ссылке https://... и ответьте на вопросы."
                            value={settings.text}
                            onChange={(e) => updateTaskSettings(id, { text: e.target.value })}
                        />
                    </div>
                );
            default: return null;
        }
    }

    if (!isClient || isTeacherMode === false) return null;


    return (
        <div className="flex flex-col items-center justify-start min-h-screen bg-background p-4 sm:p-8 pt-16 sm:pt-24 animate-fade-in pb-24">
            <div className="w-full max-w-2xl">
                <div className="flex justify-between items-center mb-4">
                    <Button asChild variant="ghost"><Link href="/"><ArrowLeft />Назад</Link></Button>
                </div>
                <Card className="w-full mb-8 shadow-lg border-primary/50">
                    <CardHeader>
                        <CardTitle className="text-2xl md:text-3xl">Комбо-конструктор заданий</CardTitle>
                        <CardDescription>Соберите комплексное домашнее задание из нескольких частей.</CardDescription>
                    </CardHeader>
                </Card>

                <Card className="w-full">
                    <CardHeader>
                        <Label htmlFor='homework-title' className='text-lg font-bold'>Название домашнего задания</Label>
                        <Input id='homework-title' value={homeworkTitle} onChange={(e) => setHomeworkTitle(e.target.value)} placeholder='Например: "Домашка на выходные"' className='mt-2'/>
                    </CardHeader>
                    <CardContent>
                        <Reorder.Group axis="y" values={tasks} onReorder={setTasks} className="space-y-4">
                            <AnimatePresence>
                                {tasks.map((task, index) => (
                                    <Reorder.Item key={task.id} value={task} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                        <Card className='p-4 bg-muted/50 relative group'>
                                            <div className='flex items-start justify-between'>
                                                <div className='flex items-center gap-2'>
                                                    <GripVertical className="h-5 w-5 text-muted-foreground cursor-grab group-hover:opacity-100 opacity-50 transition-opacity" />
                                                    <h4 className='font-semibold'>{index + 1}. {task.title}</h4>
                                                </div>
                                                <Button variant="ghost" size="icon" onClick={() => removeTask(task.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                                            </div>
                                            {renderTaskSettings(task)}
                                        </Card>
                                    </Reorder.Item>
                                ))}
                            </AnimatePresence>
                        </Reorder.Group>

                        <Dialog>
                            <DialogTrigger asChild>
                                <Button variant="outline" className="w-full mt-6"><PlusCircle className="mr-2"/>Добавить блок задания</Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader><DialogTitle>Выберите тип задания</DialogTitle></DialogHeader>
                                <div className='grid grid-cols-2 gap-4 py-4'>
                                    <DialogTrigger asChild><Button variant='outline' onClick={() => addTask('textbook')}><BookOpen className='mr-2'/>Учебник</Button></DialogTrigger>
                                    <DialogTrigger asChild><Button variant='outline' onClick={() => addTask('dictionary')}><FileText className='mr-2'/>Тест по словарю</Button></DialogTrigger>
                                    <DialogTrigger asChild><Button variant='outline' onClick={() => addTask('kana')}><FileText className='mr-2'/>Тест по Кане</Button></DialogTrigger>
                                    <DialogTrigger asChild><Button variant='outline' onClick={() => addTask('grammar')}><FileText className='mr-2'/>Урок грамматики</Button></DialogTrigger>
                                    <DialogTrigger asChild><Button variant='outline' onClick={() => addTask('instructions')}><FileText className='mr-2'/>Блок инструкций</Button></DialogTrigger>
                                </div>
                            </DialogContent>
                        </Dialog>
                    </CardContent>
                    <CardFooter>
                        <Button size="lg" onClick={generateLink} className="w-full btn-gradient" disabled={tasks.length === 0}>
                            Сгенерировать ссылку на Д/З
                        </Button>
                    </CardFooter>
                </Card>
                
                {generatedUrl && (
                    <Card className="mt-8 animate-fade-in">
                        <CardHeader><CardTitle>Готовая ссылка</CardTitle></CardHeader>
                        <CardContent className="flex items-center gap-2">
                            <Input value={generatedUrl} readOnly className="text-muted-foreground"/>
                            <Button onClick={handleCopy} size="icon" variant="outline"><Clipboard /></Button>
                            <Button asChild size="icon" variant="outline"><a href={telegramLink} target="_blank" rel="noopener noreferrer"><Send /></a></Button>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}

    