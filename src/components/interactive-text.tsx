'use client';

import { useState, useEffect } from 'react';
import { analyzeJapaneseText, JapaneseAnalysisOutput } from '@/ai/flows/analyze-text-flow';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Skeleton } from '@/components/ui/skeleton';

interface InteractiveTextProps {
  text: string;
}

export default function InteractiveText({ text }: InteractiveTextProps) {
  const [analysis, setAnalysis] = useState<JapaneseAnalysisOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getAnalysis = async () => {
      try {
        setIsLoading(true);
        const result = await analyzeJapaneseText({ text });
        setAnalysis(result);
      } catch (e) {
        setError('Не удалось проанализировать текст.');
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };
    getAnalysis();
  }, [text]);

  if (isLoading) {
    return (
      <div className="flex items-center space-x-1">
        <Skeleton className="h-6 w-20" />
        <Skeleton className="h-6 w-12" />
        <Skeleton className="h-6 w-24" />
      </div>
    );
  }

  if (error) {
    return <span className="text-destructive">{error}</span>;
  }

  if (!analysis) {
    return <span>{text}</span>;
  }

  return (
    <TooltipProvider>
      <div className="flex flex-wrap items-end leading-loose cursor-pointer" lang="ja">
        {analysis.sentence.map((word, index) => (
          <Tooltip key={index}>
            <TooltipTrigger asChild>
              <span className="group inline-block transition-colors duration-200 hover:bg-primary/20 rounded-md px-1 py-2">
                <ruby className="text-3xl">
                  {word.word}
                  <rt className="text-sm text-foreground/80 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    {word.furigana}
                  </rt>
                </ruby>
              </span>
            </TooltipTrigger>
            <TooltipContent>
              <p className="font-bold">{word.translation}</p>
              <p className="text-muted-foreground">{word.partOfSpeech}</p>
            </TooltipContent>
          </Tooltip>
        ))}
      </div>
      <p className="text-muted-foreground mt-2 text-sm italic">
        {analysis.fullTranslation}
      </p>
    </TooltipProvider>
  );
}
