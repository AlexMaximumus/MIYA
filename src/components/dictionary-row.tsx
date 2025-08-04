
'use client';

import { TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import type { Word } from '@/lib/dictionary-data';

interface DictionaryRowProps {
    word: Word;
}

export default function DictionaryRow({ word }: DictionaryRowProps) {
    if (!word) {
        return null; // Or a placeholder
    }
    return (
        <>
            <TableCell className="font-japanese text-lg font-medium">{word.word}</TableCell>
            <TableCell className="font-japanese text-muted-foreground">{word.reading}</TableCell>
            <TableCell>{word.translation}</TableCell>
            <TableCell className="text-center">
                <Badge variant="secondary">{word.jlpt}</Badge>
            </TableCell>
        </>
    );
}
