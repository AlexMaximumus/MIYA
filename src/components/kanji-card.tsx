
'use client';

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
  } from '@/components/ui/popover';
  
  interface KanjiCardProps {
    kanji: string;
    on: string[];
    kun: string[];
    translation: string;
  }
  
  export default function KanjiCard({ kanji, on, kun, translation }: KanjiCardProps) {
    return (
      <Popover>
        <PopoverTrigger asChild>
          <div className="relative aspect-square flex flex-col items-center justify-center bg-card/80 rounded-lg p-2 cursor-pointer transition-all duration-200 hover:bg-primary/20 hover:shadow-md transform hover:-translate-y-1 group">
            <span className="text-4xl sm:text-5xl md:text-6xl font-japanese">{kanji}</span>
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-4">
          <p className="font-bold text-lg text-center mb-2">{translation}</p>
          {on.length > 0 && (
              <div className="text-sm">
                  <span className="font-semibold text-muted-foreground">On: </span>
                  <span className="font-japanese">{on.join(', ')}</span>
              </div>
          )}
           {kun.length > 0 && (
              <div className="text-sm">
                  <span className="font-semibold text-muted-foreground">Kun: </span>
                  <span className="font-japanese">{kun.join(', ')}</span>
              </div>
          )}
        </PopoverContent>
      </Popover>
    );
  }
  
