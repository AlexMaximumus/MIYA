
'use client';

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

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
                        <Tooltip key={index}>
                            <TooltipTrigger asChild>
                            <span className="underline decoration-dotted cursor-pointer transition-colors hover:bg-primary/20 rounded px-1">
                                {part}
                            </span>
                            </TooltipTrigger>
                            <TooltipContent side="bottom">
                            <p>{explanation}</p>
                            </TooltipContent>
                        </Tooltip>
                    );
                }

                return <span key={index}>{part}</span>;
            })}
        </code>
    </TooltipProvider>
  );
}
