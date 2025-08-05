
'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Lightbulb } from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import * as wanakana from 'wanakana';
import { Card, CardContent } from '@/components/ui/card';
import InteractiveText from './interactive-text';
import { type JapaneseAnalysisOutput, dialogueAnalyses } from '@/ai/precomputed-analysis';

type Message = {
    sender: 'user' | 'yuki';
    text: string;
    analysis?: JapaneseAnalysisOutput;
    isHint?: boolean;
};

type DialogueStep = {
    type: 'message';
    sender: 'yuki';
    analysis: JapaneseAnalysisOutput;
} | {
    type: 'prompt';
    expected: string; // The full phrase in kana/kanji for display in hints
    expectedRomaji: string[]; // The romaji versions for validation
};

const dialogueScript: DialogueStep[] = [
    { type: 'message', sender: 'yuki', analysis: dialogueAnalyses.konnichiwa },
    { type: 'prompt', expected: 'こんにちは', expectedRomaji: ['konnichiwa', 'konnitiwa'] },
    { type: 'message', sender: 'yuki', analysis: dialogueAnalyses.hajimemashite },
    { type: 'message', sender: 'yuki', analysis: dialogueAnalyses.anatanonamaewa },
    { type: 'prompt', expected: '私[ваше имя]です', expectedRomaji: ['watashi wa ... desu'] }, // Special case
    { type: 'message', sender: 'yuki', analysis: dialogueAnalyses.hajimemashite_name },
    { type: 'message', sender: 'yuki', analysis: dialogueAnalyses.yoroshiku },
    { type: 'prompt', expected: 'こちらこそよろしくお願いします', expectedRomaji: ['kochirakosoyoroshikuonegaishimasu'] },
    { type: 'message', sender: 'yuki', analysis: dialogueAnalyses.yokudekimashita },
];


export default function DialogueChat() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [currentStep, setCurrentStep] = useState(0);
    const [isWaitingForUser, setIsWaitingForUser] = useState(false);
    const [showHint, setShowHint] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const initialDialogueScript = useRef(JSON.parse(JSON.stringify(dialogueScript))); // Deep copy for reset

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(scrollToBottom, [messages]);
    
    useEffect(() => {
        const processStep = () => {
            if (currentStep >= initialDialogueScript.current.length) {
                setIsWaitingForUser(false);
                return;
            }
    
            const step = initialDialogueScript.current[currentStep];
    
            if (step.type === 'message') {
                setTimeout(() => {
                    setMessages(prev => [...prev, { sender: 'yuki', text: '...', analysis: step.analysis }]);
                    setCurrentStep(prev => prev + 1);
                }, 800);
            } else if (step.type === 'prompt') {
                setIsWaitingForUser(true);
            }
        };
    
        processStep();
    }, [currentStep]);

    const handleUserInput = (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputValue.trim() || !isWaitingForUser) return;

        const romajiInput = wanakana.toRomaji(inputValue, { customKanaMapping: { は: 'wa' } }).replace(/\s/g, '');
        const step = initialDialogueScript.current[currentStep];

        if (step.type !== 'prompt') return;
        
        const isNamePrompt = step.expectedRomaji.includes('watashi wa ... desu');
        let isCorrect = false;
        
        if (isNamePrompt) {
            const namePartRegex = /watashiwa(.*)desu/;
            const match = romajiInput.match(namePartRegex);
            if (match && match[1]) {
                isCorrect = true;
                const nameInRomaji = match[1];
                const userName = wanakana.toKana(nameInRomaji);
                
                // Update the script for this session
                initialDialogueScript.current.forEach(s => {
                    if (s.type === 'message' && s.analysis.fullTranslation.includes('[name]')) {
                       s.analysis.sentence.forEach(word => {
                           if (word.word === '[name]') {
                               word.word = userName;
                               word.furigana = wanakana.toHiragana(userName);
                           }
                       });
                    }
                });
            }
        } else {
            isCorrect = step.expectedRomaji.some(variant => variant === romajiInput);
        }
        
        if (isCorrect) {
            setMessages(prev => [...prev, { sender: 'user', text: inputValue }]);
            setInputValue('');
            setShowHint(false);
            setIsWaitingForUser(false);
            setCurrentStep(prev => prev + 1);
        } else {
            setMessages(prev => [...prev, { sender: 'user', text: `😕 ${inputValue}` }]);
            setShowHint(true);
        }
    };
    
    const handleShowHint = () => {
        const step = initialDialogueScript.current[currentStep];
        if (step.type === 'prompt') {
            setMessages(prev => [...prev, { sender: 'yuki', text: `Попробуй сказать: "${step.expected.replace('[ваше имя]', '...')}"`, isHint: true }]);
        }
    }


    return (
        <Card className="w-full">
            <CardContent className="p-4">
                <div className="h-96 overflow-y-auto pr-2 space-y-4 mb-4 bg-muted/30 rounded-lg p-4">
                    {messages.map((msg, index) => (
                        <div
                            key={index}
                            className={cn('flex items-end gap-2 group', msg.sender === 'user' ? 'justify-end' : 'justify-start')}
                        >
                            {msg.sender === 'yuki' && (
                                <div className="relative w-10 h-10 shrink-0 rounded-full overflow-hidden self-start">
                                    <Image src="/yuki-pixel.png" alt="Yuki Avatar" fill className="object-cover" />
                                </div>
                            )}
                            <div className={cn('rounded-lg px-3 py-2 max-w-[85%]', 
                                msg.sender === 'user' ? 'bg-primary text-primary-foreground' : 'bg-card',
                                msg.isHint && 'bg-amber-100 text-amber-900 border border-amber-300',
                                msg.text.startsWith('😕') && 'bg-destructive/20 text-destructive-foreground'
                            )}>
                                {msg.analysis ? (
                                    <InteractiveText analysis={msg.analysis} />
                                ) : (
                                    <p className="font-japanese text-lg">{msg.text.replace('😕 ', '')}</p>
                                )}
                            </div>
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>
                <form onSubmit={handleUserInput} className="flex items-center gap-2">
                    <div className="relative w-full">
                        <Input
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder={isWaitingForUser ? 'Ваш ответ...' : 'Юки печатает...'}
                            className="text-lg pr-10 font-japanese"
                            disabled={!isWaitingForUser}
                            onFocus={() => setShowHint(false)}
                        />
                        {showHint && isWaitingForUser && (
                             <Button type="button" size="icon" variant="ghost" className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8" onClick={handleShowHint}>
                                <Lightbulb className="w-5 h-5 text-yellow-500"/>
                            </Button>
                        )}
                    </div>

                    <Button type="submit" size="icon" disabled={!isWaitingForUser || !inputValue}>
                        <Send />
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}
