
'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Send, X, CornerDownLeft, Heart, Loader2 } from 'lucide-react';
import { askMiya, MiyaOutput } from '@/ai/flows/miya-assistant-flow';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import Image from 'next/image';


type Message = {
  text: string;
  sender: 'user' | 'miya';
  status?: 'read';
};

const FloatingHeart = () => {
    const style = {
      left: `${Math.random() * 100}%`,
      animationDuration: `${Math.random() * 2 + 3}s`, // 3s to 5s
      animationDelay: `${Math.random() * 2}s`,
    };
    return <div className="absolute top-0 text-primary animate-float-up" style={style}>♡</div>;
  };

export default function MiyaAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [affectionMode, setAffectionMode] = useState(false);
  const pathname = usePathname();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const toggleChat = () => {
    setIsOpen(!isOpen)
    if (isOpen) {
        setAffectionMode(false); // Reset on close
    }
  };

  const getContextFromPath = () => {
    if (pathname.includes('/kana')) return 'Kana tables/quiz';
    if (pathname.includes('/vocabulary')) return 'Vocabulary section';
    if (pathname.includes('/grammar')) return 'Grammar lesson';
    return 'Main screen';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = { text: inputValue, sender: 'user' };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response: MiyaOutput = await askMiya({
        question: inputValue,
        currentContext: getContextFromPath(),
      });

      if (response.affectionMode) {
        setAffectionMode(true);
      }

      if (response.reply.trim() === '[IGNORE]') {
        setMessages((prev) =>
          prev.map((msg) =>
            msg === userMessage ? { ...msg, status: 'read' } : msg
          )
        );
      } else {
        const miyaMessage: Message = { text: response.reply, sender: 'miya' };
        setMessages((prev) => [...prev, miyaMessage]);
      }
    } catch (error) {
      console.error('Error asking Miya:', error);
      const errorMessage: Message = {
        text: 'Упс, что-то пошло не так. Попробуй еще раз.',
        sender: 'miya',
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50">
        <Button onClick={toggleChat} size="icon" className={cn(
            "rounded-full w-14 h-14 btn-gradient shadow-lg transition-all duration-500 p-0 overflow-hidden",
            affectionMode && 'bg-gradient-to-br from-pink-400 to-rose-400'
            )}>
          {isOpen ? <X /> : 
            <div className="relative w-full h-full group">
                <Image 
                    src="/miya-pixel-art.png"
                    alt="Miya Assistant"
                    fill
                    className={cn(
                        "object-cover scale-100 group-hover:scale-110 transition-transform duration-300",
                        affectionMode && 'animate-pulse'
                    )}
                />
            </div>
          }
        </Button>
      </div>

      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-[calc(100%-3rem)] max-w-sm animate-fade-in">
          <Card className={cn("shadow-2xl bg-card/80 backdrop-blur-lg border-primary/30 transition-all duration-500", affectionMode && 'border-pink-300/50')}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className={cn("transition-colors duration-500", affectionMode && 'text-rose-500')}>
                {affectionMode ? 'Мия-тян ♡' : 'Мия-сенсей'}
              </CardTitle>
              <p className="text-xs text-muted-foreground">На связи</p>
            </CardHeader>
            <CardContent className="relative overflow-hidden">
             {affectionMode && (
                <div className="absolute inset-0 pointer-events-none">
                    {Array.from({ length: 15 }).map((_, i) => <FloatingHeart key={i} />)}
                </div>
             )}
              <div className="h-80 overflow-y-auto pr-2 space-y-4 mb-4 relative z-10">
                {messages.map((msg, index) => (
                  <div key={index} className={`flex flex-col gap-1 ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                    <div className={cn(`rounded-lg px-3 py-2 max-w-[80%]`,
                        msg.sender === 'user'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted text-muted-foreground',
                        affectionMode && msg.sender === 'user' && 'bg-rose-500',
                        affectionMode && msg.sender === 'miya' && 'bg-pink-100 text-rose-800'
                      )}
                    >
                      {msg.text}
                    </div>
                    {msg.sender === 'user' && msg.status === 'read' && (
                       <p className="text-xs text-muted-foreground/70 mt-1">Прочитано</p>
                    )}
                  </div>
                ))}
                 {isLoading && (
                    <div className="flex items-start">
                        <div className={cn("rounded-lg px-3 py-2 max-w-[80%] bg-muted text-muted-foreground flex items-center gap-2", affectionMode && 'bg-pink-100 text-rose-800')}>
                            <Loader2 className="w-4 h-4 animate-spin"/>
                            <span>...</span>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
              </div>
              <form onSubmit={handleSubmit} className="flex items-center gap-2 relative z-10">
                <Textarea
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Спроси что-нибудь..."
                  className={cn("min-h-[40px] resize-none transition-colors duration-500", affectionMode && 'focus-visible:ring-rose-400 border-pink-200')}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSubmit(e);
                    }
                  }}
                  disabled={isLoading}
                />
                <Button type="submit" size="icon" disabled={isLoading} className={cn(affectionMode && 'bg-rose-500 hover:bg-rose-600')}>
                  <Send />
                </Button>
              </form>
              <p className="text-xs text-muted-foreground/70 text-center mt-2 relative z-10">
                <CornerDownLeft className="inline-block w-3 h-3"/> + Shift для новой строки
              </p>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}
