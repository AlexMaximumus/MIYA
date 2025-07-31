
'use client';

import type { JapaneseAnalysisOutput } from '@/ai/precomputed-analysis';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { termExplanations } from '@/ai/precomputed-analysis';

interface InteractiveTextProps {
  analysis: JapaneseAnalysisOutput | null;
}

const TermTooltip = ({ term }: { term: string }) => {
    const explanation = termExplanations[term as keyof typeof termExplanations] || "Нет объяснения.";
  
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="underline decoration-dotted cursor-pointer">{term}</span>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="max-w-xs">
          <p>{explanation}</p>
        </TooltipContent>
      </Tooltip>
    );
};

export default function InteractiveText({ analysis }: InteractiveTextProps) {

  if (!analysis) {
    return <span className="text-destructive">Ошибка: нет данных для анализа.</span>;
  }

  return (
    <TooltipProvider delayDuration={100}>
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
              <div className="text-muted-foreground">
                <TermTooltip term={word.partOfSpeech} />
              </div>
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
