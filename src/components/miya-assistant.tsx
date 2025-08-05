
'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Send, X, CornerDownLeft, Loader2, Heart } from 'lucide-react';
import { askMiya, MiyaOutput } from '@/ai/flows/miya-assistant-flow';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import Image from 'next/image';


type Message = {
  id: number;
  text: string;
  sender: 'user' | 'miya';
  status?: 'read';
  stickerUrl?: string;
  isLiked?: boolean;
};

const miyaTaunts = [
    'И чего ты ждешь?',
    'Учиться пришел или смотреть на меня?',
    'Ты там не заскучал?',
    'Нажми уже, не бойся, пон.',
    'Давай, решайся. Время не ждет.',
    'Вопросы сами себя не зададут.',
    'Хватит медитировать, пора заниматься.',
    'Думаешь, я не вижу, что ты бездельничаешь?',
    'У меня есть для тебя пара заданий... если осмелишься.',
    'Пон... Может, хватит прокрастинировать?',
    'Хочу мороженое...',
    'コーヒー飲みたいな...', // "Хочу кофе..."
    'Спать хочу... zzz',
    'Может, ну его, это обучение? Пойдем тусить!',
];

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
  const [isKoseiMode, setIsKoseiMode] = useState(false);
  const [activeTaunt, setActiveTaunt] = useState<string | null>(null);
  const [isFlipping, setIsFlipping] = useState(false);
  const pathname = usePathname();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const tauntTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const messageIdCounter = useRef(0);

  useEffect(() => {
    // This is needed to correctly wire up the audioRef on the client
    if (typeof Audio !== "undefined") {
        const audio = new Audio('/sounds/0801.MP3');
        audio.preload = 'auto';
        audioRef.current = audio;
    }
  }, []);

  useEffect(() => {
    const scheduleTaunt = () => {
        if (isOpen || document.hidden) {
            // Don't show taunts if chat is open or tab is not active
            if(tauntTimeoutRef.current) clearTimeout(tauntTimeoutRef.current);
            tauntTimeoutRef.current = setTimeout(scheduleTaunt, 10000);
            return;
        }

        const randomDelay = Math.random() * 15000 + 15000; // 15-30 seconds
        tauntTimeoutRef.current = setTimeout(() => {
            const taunt = miyaTaunts[Math.floor(Math.random() * miyaTaunts.length)];
            setActiveTaunt(taunt);
            // Hide taunt after 5 seconds
            setTimeout(() => {
                setActiveTaunt(null);
                scheduleTaunt(); // Schedule the next one
            }, 5000);
        }, randomDelay);
    };

    scheduleTaunt();

    return () => {
        if(tauntTimeoutRef.current) clearTimeout(tauntTimeoutRef.current);
    };
  }, [isOpen]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const toggleChat = () => {
    setIsOpen(!isOpen)
    if (isOpen) {
        setAffectionMode(false); // Reset on close
        setIsKoseiMode(false);
    } else {
        // When opening chat, clear any active taunt
        setActiveTaunt(null);
        if(tauntTimeoutRef.current) clearTimeout(tauntTimeoutRef.current);
    }
  };

  const getContextFromPath = () => {
    if (pathname.includes('/kana')) return 'Kana tables/quiz';
    if (pathname.includes('/dictionary')) return 'Vocabulary and tests section';
    if (pathname.includes('/training')) return 'Spaced repetition training';
    if (pathname.includes('/grammar/lesson-1')) return 'Grammar lesson 1: Basics';
    if (pathname.includes('/grammar/lesson-2')) return 'Grammar lesson 2: Questions';
    if (pathname.includes('/grammar')) return 'Grammar section';
    if (pathname.includes('/word-formation/lesson-1')) return 'Word Formation lesson 1: Affixes';
    if (pathname.includes('/word-formation')) return 'Word Formation section';
    if (pathname.includes('/vocabulary')) return 'Vocabulary by lesson section';
    return 'Main screen';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    if (inputValue.toLowerCase().includes('сальтуха')) {
        setIsFlipping(true);
        if (audioRef.current) {
            audioRef.current.play();
        }
        setTimeout(() => setIsFlipping(false), 1000); // Animation duration
    }

    const newMessageId = messageIdCounter.current++;
    const userMessage: Message = { id: newMessageId, text: inputValue, sender: 'user' };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInputValue('');
    setIsLoading(true);

    const history = newMessages.slice(0, -1).map(msg => ({
        role: (msg.sender === 'user' ? 'user' : 'miya') as 'user' | 'miya',
        message: msg.text,
      }));

    try {
      const response: MiyaOutput = await askMiya({
        question: inputValue,
        currentContext: getContextFromPath(),
        history: history,
      });

      if (response.affectionMode) {
        setAffectionMode(true);
      }
      if (response.koseiMode) {
        setIsKoseiMode(true);
      }
      
      if (response.reply === '[LIKE]') {
        setMessages(prev => prev.map(msg => 
            msg.id === newMessageId ? { ...msg, isLiked: true } : msg
        ));
      } else if (response.reply && response.reply.trim() !== '[IGNORE]') {
        const miyaMessage: Message = { 
          id: messageIdCounter.current++,
          text: response.reply, 
          sender: 'miya',
          stickerUrl: response.stickerUrl,
        };
        setMessages((prev) => [...prev, miyaMessage]);
      } else {
        // If response is [IGNORE]
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === newMessageId ? { ...msg, status: 'read' } : msg
          )
        );
      }
    } catch (error) {
      console.error('Error asking Miya:', error);
      const errorMessage: Message = {
        id: messageIdCounter.current++,
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
        {activeTaunt && (
            <div className="absolute bottom-full right-0 mb-2 w-max max-w-xs p-2 bg-popover text-popover-foreground rounded-lg shadow-lg animate-float-and-fade">
                {activeTaunt}
            </div>
        )}
        <Button 
          onClick={toggleChat} 
          size="icon" 
          className={cn(
            "rounded-full w-16 h-16 shadow-lg transition-all duration-300 p-0 overflow-hidden group bg-card",
            affectionMode && 'bg-gradient-to-br from-pink-400 to-rose-400'
            )}
        >
          {isOpen ? <X className="w-8 h-8"/> : 
            <div className="relative w-full h-full">
                <Image 
                    src="/miya-pixel-art.png"
                    alt="Miya Assistant"
                    fill
                    className={cn(
                        "object-cover transition-transform duration-300 group-hover:scale-110",
                        affectionMode && 'animate-pulse'
                    )}
                />
            </div>
          }
        </Button>
      </div>

      {isOpen && (
        <div className={cn("fixed bottom-24 right-6 z-50 w-[calc(100%-3rem)] max-w-sm animate-fade-in", isFlipping && 'animate-flip', isKoseiMode && 'animate-grayscale-in pointer-events-none')}>
          <Card className={cn("shadow-2xl bg-card/80 backdrop-blur-lg border-primary/30 transition-all duration-500", affectionMode && 'border-pink-300/50')}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className={cn("transition-colors duration-500", affectionMode && 'text-rose-500')}>
                {affectionMode ? 'Мия-тян ♡' : 'Мия-сенсей'}
              </CardTitle>
              <p className="text-xs text-muted-foreground">{isKoseiMode ? "5 минут назад..." : "На связи"}</p>
            </CardHeader>
            <CardContent className="relative overflow-hidden">
             {affectionMode && (
                <div className="absolute inset-0 pointer-events-none">
                    {Array.from({ length: 15 }).map((_, i) => <FloatingHeart key={i} />)}
                </div>
             )}
              <div className="h-80 overflow-y-auto pr-2 space-y-4 mb-4 relative z-10">
                {messages.map((msg, index) => (
                  <div key={index} className={`flex items-end gap-2 group ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                    {msg.sender === 'miya' && (
                        <div className="relative w-8 h-8 shrink-0 rounded-full overflow-hidden self-start">
                            <Image src="/miya-pixel-art.png" alt="Miya Avatar" fill className="object-cover"/>
                        </div>
                    )}
                    <div className="flex flex-col gap-1 w-full max-w-[85%]">
                      <div className={cn('rounded-lg px-3 py-2 relative',
                          msg.sender === 'user'
                            ? 'bg-primary text-primary-foreground self-end'
                            : 'bg-muted text-muted-foreground self-start',
                          affectionMode && msg.sender === 'user' && 'bg-rose-500',
                          affectionMode && msg.sender === 'miya' && 'bg-pink-100 text-rose-800'
                        )}
                      >
                        {msg.text}
                         {msg.isLiked && (
                           <div className="absolute -bottom-3 -left-3 bg-card p-1 rounded-full shadow-md">
                                <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
                           </div>
                         )}
                      </div>
                      {msg.stickerUrl && msg.sender === 'miya' && (
                        <div className="relative w-32 h-32 mt-2 rounded-lg overflow-hidden self-start">
                            <Image src={msg.stickerUrl} alt="Miya sticker" fill className="object-contain" />
                        </div>
                      )}
                      {msg.sender === 'user' && msg.status === 'read' && !msg.isLiked && (
                         <p className="text-xs text-muted-foreground/70 text-right w-full">Прочитано</p>
                      )}
                    </div>
                  </div>
                ))}
                 {isLoading && (
                    <div className="flex items-end gap-2">
                        <div className="relative w-8 h-8 shrink-0 rounded-full overflow-hidden self-start">
                             <Image src="/miya-pixel-art.png" alt="Miya Avatar" fill className="object-cover"/>
                        </div>
                        <div className={cn("rounded-lg px-3 py-2 bg-muted text-muted-foreground flex items-center gap-2", affectionMode && 'bg-pink-100 text-rose-800')}>
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
