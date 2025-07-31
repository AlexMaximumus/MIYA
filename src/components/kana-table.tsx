import { Card } from '@/components/ui/card';

interface KanaCharacter {
  kana: string;
  romaji: string;
}

interface KanaTableProps {
  data: (KanaCharacter | null)[][];
}

export default function KanaTable({ data }: KanaTableProps) {
  return (
    <Card className="p-4 bg-card/60">
      <div className="grid grid-cols-5 gap-2 md:gap-4 text-center">
        {data.flat().map((char, index) =>
          char ? (
            <div
              key={index}
              className="relative aspect-square flex flex-col items-center justify-center bg-card/80 rounded-lg p-2 cursor-pointer transition-all duration-200 hover:bg-primary/20 hover:shadow-md transform hover:-translate-y-1"
            >
              <span className="text-3xl md:text-4xl font-japanese">{char.kana}</span>
              <span className="text-sm text-muted-foreground">{char.romaji}</span>
            </div>
          ) : (
            <div key={index} className="aspect-square"></div>
          )
        )}
      </div>
    </Card>
  );
}
