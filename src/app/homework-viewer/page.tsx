
'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';

// Set up the worker for pdfjs
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

// Function to parse page ranges (e.g., "1,3,5-7")
const parsePageString = (pageStr: string): number[] => {
    if (!pageStr) return [];
    const pages: number[] = [];
    const parts = pageStr.split(',');

    parts.forEach(part => {
        if (part.includes('-')) {
            const [start, end] = part.split('-').map(Number);
            if (!isNaN(start) && !isNaN(end)) {
                for (let i = start; i <= end; i++) {
                    pages.push(i);
                }
            }
        } else {
            const pageNum = Number(part);
            if (!isNaN(pageNum)) {
                pages.push(pageNum);
            }
        }
    });

    return [...new Set(pages)].sort((a, b) => a - b); // Return unique, sorted pages
};


function HomeworkViewerContent() {
    const searchParams = useSearchParams();
    const [numPages, setNumPages] = useState<number | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageNumbers, setPageNumbers] = useState<number[]>([]);
    
    useEffect(() => {
        const pagesParam = searchParams.get('pages');
        if (pagesParam) {
            setPageNumbers(parsePageString(pagesParam));
        }
    }, [searchParams]);

    function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
        setNumPages(numPages);
        // If no specific pages are requested, show all pages
        if(pageNumbers.length === 0) {
            setPageNumbers(Array.from({ length: numPages }, (_, i) => i + 1));
        }
    }

    const goToPrevPage = () => {
        const currentIndex = pageNumbers.indexOf(currentPage);
        if (currentIndex > 0) {
            setCurrentPage(pageNumbers[currentIndex - 1]);
        }
    };

    const goToNextPage = () => {
        const currentIndex = pageNumbers.indexOf(currentPage);
        if (currentIndex < pageNumbers.length - 1) {
            setCurrentPage(pageNumbers[currentIndex + 1]);
        }
    };

    useEffect(() => {
        // Set initial page to the first available page number
        if(pageNumbers.length > 0) {
            setCurrentPage(pageNumbers[0]);
        }
    }, [pageNumbers]);

    const pdfPath = '/textbook.pdf';

    return (
        <div className="flex flex-col items-center justify-start min-h-screen bg-background p-4 sm:p-8 pt-16 sm:pt-24 animate-fade-in">
            <div className="w-full max-w-4xl">
                <Button asChild variant="ghost" className="mb-4">
                    <Link href="/">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Назад на главную
                    </Link>
                </Button>
                
                <Card className="w-full shadow-lg">
                    <CardHeader>
                        <CardTitle>Домашнее задание</CardTitle>
                        <CardDescription>Просмотрите страницы, назначенные вашим учителем.</CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center gap-4">
                        <div className="w-full border rounded-lg overflow-hidden">
                             <Document
                                file={pdfPath}
                                onLoadSuccess={onDocumentLoadSuccess}
                                loading={<Skeleton className="w-full h-[800px]" />}
                                error={<p className="p-4 text-destructive text-center">Не удалось загрузить PDF. Убедитесь, что файл <code className="font-mono">textbook.pdf</code> находится в папке <code className="font-mono">public</code>.</p>}
                            >
                                <Page 
                                    pageNumber={currentPage} 
                                    renderTextLayer={false}
                                    renderAnnotationLayer={false}
                                />
                            </Document>
                        </div>
                        {numPages && pageNumbers.length > 0 && (
                            <div className="flex items-center gap-4">
                                <Button onClick={goToPrevPage} disabled={pageNumbers.indexOf(currentPage) === 0} variant="outline" size="icon">
                                    <ChevronLeft />
                                </Button>
                                <span>
                                    Страница {currentPage}
                                </span>
                                <Button onClick={goToNextPage} disabled={pageNumbers.indexOf(currentPage) === pageNumbers.length - 1} variant="outline" size="icon">
                                    <ChevronRight />
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

export default function HomeworkViewerPage() {
    return (
      <Suspense fallback={<div className="flex items-center justify-center h-screen">Загрузка задания...</div>}>
        <HomeworkViewerContent />
      </Suspense>
    );
}
