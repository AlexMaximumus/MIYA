
'use client';

import { useState } from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface InteractiveFormulaProps {
  formula: string;
  className?: string;
}

const termExplanations: Record<string, string> = {
    'N': 'Существительное (Noun), местоимение или числительное.',
    'は': 'Частица «ва». Указывает на тему предложения.',
    'です': 'Вежливая связка в настоящем-будущем времени. Аналог "есть", "является".',
    'か': 'Вопросительная частица. Ставится в конце предложения, чтобы сделать его вопросительным.',
    '。': 'Японская точка (кутэн). Завершает предложение.',
    'では': 'Отрицательная частица, более формальный вариант.',
    'じゃ': 'Отрицательная частица, разговорный вариант (сокращение от では).',
    'ありません': 'Вспомогательный глагол для образования вежливого отрицания. Аналог "не является".',
    'QW': 'Question Word. Вопросительное слово (например, 何, 誰, どこ).',
};

export default function InteractiveFormula({ formula, className }: InteractiveFormulaProps) {
  const parts = formula.split(/(\s+|(?=[^\w\s])|(?<=[^\w\s]))/).filter(Boolean);
  const [openPopover, setOpenPopover] = useState<string | null>(null);

  const handleTriggerClick = (part: string, explanation?: string) => {
    if (explanation) {
        setOpenPopover(openPopover === part ? null : part);
    }
  };

  return (
    <TooltipProvider delayDuration={100}>
        <code className={cn("font-mono bg-muted p-2 rounded-md inline-block text-lg", className)}>
            {parts.map((part, index) => {
                const cleanPart = part.replace(/[()]/g, '');
                const explanation = termExplanations[cleanPart];
                
                if (part.trim() === '') {
                    return <span key={index}>&nbsp;</span>;
                }

                if (explanation) {
                    return (
                        <Popover key={index} open={openPopover === part} onOpenChange={(isOpen) => setOpenPopover(isOpen ? part : null)}>
                            <PopoverTrigger asChild>
                            <span 
                                className="underline decoration-dotted cursor-pointer transition-colors hover:bg-primary/20 rounded px-1"
                                onClick={() => handleTriggerClick(part, explanation)}
                            >
                                {part}
                            </span>
                            </PopoverTrigger>
                            <PopoverContent side="bottom" className="w-auto max-w-xs p-2">
                                <p>{explanation}</p>
                            </PopoverContent>
                        </Popover>
                    );
                }

                return <span key={index}>{part}</span>;
            })}
        </code>
    </TooltipProvider>
  );
}
