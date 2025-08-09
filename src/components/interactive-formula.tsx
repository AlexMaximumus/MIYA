
'use client';

import { useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
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
    '、': 'Японская запятая (тотэн). Используется для разделения частей предложения.',
};

export default function InteractiveFormula({ formula, className }: InteractiveFormulaProps) {
  const parts = formula.split(/(\s+)/).filter(Boolean); // Split by spaces, keeping them

  return (
    <div className={cn("font-mono bg-muted p-3 rounded-md inline-block text-lg md:text-xl", className)}>
        {parts.map((part, index) => {
            if (part.trim() === '') {
                return <span key={index}>&nbsp;</span>;
            }
            
            const explanation = termExplanations[part];

            if (explanation) {
                return (
                    <Popover key={index}>
                        <PopoverTrigger asChild>
                        <span 
                            className="underline decoration-dotted cursor-pointer transition-colors hover:bg-primary/20 rounded px-1"
                        >
                            {part}
                        </span>
                        </PopoverTrigger>
                        <PopoverContent side="bottom" className="w-auto max-w-xs p-2 text-sm">
                            <p>{explanation}</p>
                        </PopoverContent>
                    </Popover>
                );
            }
            
            return <span key={index}>{part}</span>;
        })}
    </div>
  );
}
