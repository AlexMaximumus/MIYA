
'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Lightbulb } from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import * as wanakana from 'wanakana';
import { Card, CardContent } from '@/components/ui/card';

type Message = {
    sender: 'user' | 'yuki';
    text: string;
    isHint?: boolean;
};

const dialogueScript = [
    { type: 'message', sender: 'yuki', text: 'こんにちは！' },
    { type: 'prompt', expected: 'こんにちは' },
    { type: 'message', sender: 'yuki', text: 'はじめまして。わたしはゆきです。' },
    { type: 'message', sender: 'yuki', text: 'あなたのおなまえは？' },
    { type: 'prompt', expected: 'わたしは[name]です' }, // User can insert their name
    { type: 'message', sender: 'yuki', text: '[name]さん、はじめまして！' },
    { type: 'message', sender: 'yuki', text: 'どうぞよろしくおねがいします。' },
    { type: 'prompt', expected: 'こちらこそよろしくおねがいします' },
    { type: 'message', sender: 'yuki', text: 'よくできました！🎉' },
];


export default function DialogueChat() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [currentStep, setCurrentStep] = useState(0);
    const [isWaitingForUser, setIsWaitingForUser] = useState(false);
    const [showHint, setShowHint] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(scrollToBottom, [messages]);
    
    useEffect(() => {
        const processStep = () => {
            if (currentStep >= dialogueScript.length) {
                setIsWaitingForUser(false);
                return;
            }
    
            const step = dialogueScript[currentStep];
    
            if (step.type === 'message') {
                setTimeout(() => {
                    setMessages(prev => [...prev, { sender: step.sender as 'yuki', text: step.text }]);
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

        const romajiInput = wanakana.toRomaji(inputValue.toLowerCase());
        const step = dialogueScript[currentStep];

        if (step.type !== 'prompt') return;

        // Special handling for name insertion
        const isNamePrompt = step.expected.includes('[name]');
        let isCorrect = false;
        let userName = 'User';

        if (isNamePrompt) {
            const pattern = step.expected.replace('[name]', '(.+)').replace(/\s/g, '\\s*');
            const regex = new RegExp(wanakana.toRomaji(pattern));
            const match = romajiInput.match(regex);
            if (match && match[1]) {
                isCorrect = true;
                userName = wanakana.toHiragana(match[1]); // Keep user name in hiragana
            }
        } else {
            isCorrect = romajiInput === wanakana.toRomaji(step.expected);
        }
        
        if (isCorrect) {
            setMessages(prev => [...prev, { sender: 'user', text: inputValue }]);
            setInputValue('');
            setShowHint(false);
            setIsWaitingForUser(false);

            // Replace [name] in subsequent messages
            if (isNamePrompt) {
                dialogueScript.forEach(s => {
                    if (s.type === 'message' && s.text.includes('[name]')) {
                        s.text = s.text.replace('[name]', userName);
                    }
                });
            }

            setCurrentStep(prev => prev + 1);
        } else {
            // Show incorrect feedback (e.g., shake input)
             setMessages(prev => [...prev, { sender: 'user', text: `😕 ${inputValue}` }]);
             setShowHint(true);
        }
    };
    
    const handleShowHint = () => {
        const step = dialogueScript[currentStep];
        if (step.type === 'prompt') {
            setMessages(prev => [...prev, { sender: 'yuki', text: `Попробуй сказать: "${step.expected.replace('[name]', 'ваше имя')}"`, isHint: true }]);
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
                            <div className={cn('rounded-lg px-3 py-2 max-w-[85%] font-japanese text-lg', 
                                msg.sender === 'user' ? 'bg-primary text-primary-foreground' : 'bg-card',
                                msg.isHint && 'bg-amber-100 text-amber-900 border border-amber-300',
                                msg.text.startsWith('😕') && 'bg-destructive/20 text-destructive-foreground'
                            )}>
                                {msg.text.replace('😕 ', '')}
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
                            className="text-lg pr-10"
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
