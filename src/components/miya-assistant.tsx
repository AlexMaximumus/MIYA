'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageSquare, Send, X, CornerDownLeft, MessageCircle } from 'lucide-react';
import { askMiya, MiyaOutput } from '@/ai/flows/miya-assistant-flow';
import { usePathname } from 'next/navigation';

type Message = {
  text: string;
  sender: 'user' | 'miya';
  status?: 'read';
};

export default function MiyaAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const pathname = usePathname();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const toggleChat = () => setIsOpen(!isOpen);

  const getContextFromPath = () => {
    if (pathname.includes('/kana')) return 'Kana tables/quiz';
    if (pathname.includes('/vocabulary')) return 'Vocabulary section';
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
        <Button onClick={toggleChat} size="icon" className="rounded-full w-16 h-16 btn-gradient shadow-lg">
          {isOpen ? <X /> : <MessageCircle className="w-8 h-8"/>}
        </Button>
      </div>

      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-[calc(100%-3rem)] max-w-sm animate-fade-in">
          <Card className="shadow-2xl bg-card/80 backdrop-blur-lg border-primary/30">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle>Мия-сенсей</CardTitle>
              <p className="text-xs text-muted-foreground">На связи</p>
            </CardHeader>
            <CardContent>
              <div className="h-80 overflow-y-auto pr-2 space-y-4 mb-4">
                {messages.map((msg, index) => (
                  <div key={index} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                    <div className={`rounded-lg px-3 py-2 max-w-[80%] ${
                        msg.sender === 'user'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted text-muted-foreground'
                      }`}
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
                        <div className="rounded-lg px-3 py-2 max-w-[80%] bg-muted text-muted-foreground animate-pulse">
                            ...
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
              </div>
              <form onSubmit={handleSubmit} className="flex items-center gap-2">
                <Textarea
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Спроси что-нибудь..."
                  className="min-h-[40px] resize-none"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSubmit(e);
                    }
                  }}
                  disabled={isLoading}
                />
                <Button type="submit" size="icon" disabled={isLoading}>
                  <Send />
                </Button>
              </form>
              <p className="text-xs text-muted-foreground/70 text-center mt-2">
                <CornerDownLeft className="inline-block w-3 h-3"/> + Shift для новой строки
              </p>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}
