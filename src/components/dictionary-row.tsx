
'use client';

import { useState } from 'react';
import { TableCell, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Volume2, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type { Word } from '@/lib/dictionary-data';
import { generateAudio } from '@/ai/flows/tts-flow';

interface DictionaryRowProps {
    word: Word;
}

export default function DictionaryRow({ word }: DictionaryRowProps) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [audioData, setAudioData] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handlePlayAudio = async () => {
        if (isPlaying) return;

        if (audioData) {
            const audio = new Audio(audioData);
            audio.play();
            setIsPlaying(true);
            audio.onended = () => setIsPlaying(false);
            return;
        }

        setIsLoading(true);
        try {
            const response = await generateAudio(word.word);
            if (response.media) {
                setAudioData(response.media);
                const audio = new Audio(response.media);
                audio.play();
                setIsPlaying(true);
                audio.onended = () => setIsPlaying(false);
            }
        } catch (error) {
            console.error("Failed to generate audio:", error);
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <TableRow>
            <TableCell className="font-japanese text-lg font-medium">{word.word}</TableCell>
            <TableCell className="font-japanese text-muted-foreground">{word.reading}</TableCell>
            <TableCell>{word.translation}</TableCell>
            <TableCell className="text-center">
                <Badge variant="secondary">{word.jlpt}</Badge>
            </TableCell>
            <TableCell className="text-right">
                <Button variant="ghost" size="icon" onClick={handlePlayAudio} disabled={isLoading || isPlaying}>
                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Volume2 className="w-4 h-4" />}
                </Button>
            </TableCell>
        </TableRow>
    );
}
