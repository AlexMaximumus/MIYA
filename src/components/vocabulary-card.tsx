import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
  } from '@/components/ui/tooltip';
  
  interface VocabularyCardProps {
    kanji: string;
    furigana: string;
    translation: string;
  }
  
  export default function VocabularyCard({ kanji, furigana, translation }: VocabularyCardProps) {
    // A word might not have a distinct kanji form (e.g., hiragana/katakana only words)
    const hasKanji = kanji !== furigana;
  
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="relative aspect-video flex flex-col items-center justify-center bg-card/80 rounded-lg p-2 cursor-pointer transition-all duration-200 hover:bg-primary/20 hover:shadow-md transform hover:-translate-y-1 group">
              <span className="text-3xl md:text-4xl font-japanese text-center">{kanji}</span>
              {hasKanji && (
                <span className="absolute -top-1 text-sm text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {furigana}
                </span>
              )}
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p className="font-bold text-center">{translation}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }
  