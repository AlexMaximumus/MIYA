
'use client';

import { TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import type { Word } from '@/lib/dictionary-data';
import { useWordProgress } from '@/hooks/use-word-progress';
import { CheckCircle2 } from 'lucide-react';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
  } from '@/components/ui/tooltip';

interface DictionaryRowProps {
    word: Word;
}

export default function DictionaryRow({ word }: DictionaryRowProps) {
    const { getWordStatus } = useWordProgress();

    if (!word) {
        return null; // Or a placeholder
    }
    const status = getWordStatus(word.word);

    return (
        <>
            <TableCell className="font-japanese text-lg font-medium flex items-center gap-2">
                {status === 'mastered' && (
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger>
                                <CheckCircle2 className="h-5 w-5 text-green-500" />
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Выучено!</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                )}
                {word.word}
            </TableCell>
            <TableCell className="font-japanese text-muted-foreground">{word.reading}</TableCell>
            <TableCell>{word.translation}</TableCell>
            <TableCell className="text-center">
                <Badge variant="secondary">{word.jlpt}</Badge>
            </TableCell>
        </>
    );
}
