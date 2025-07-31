'use client';

import type { JapaneseAnalysisOutput } from '@/ai/precomputed-analysis';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface InteractiveTextProps {
  analysis: JapaneseAnalysisOutput | null;
}

export default function InteractiveText({ analysis }: InteractiveTextProps) {

  if (!analysis) {
    return <span className="text-destructive">Ошибка: нет данных для анализа.</span>;
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
