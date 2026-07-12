import { PaperLetterCard } from "@/components/cards/PaperLetterCard";
import type { LetterSummary } from "@/types";

interface PaperLetterGridProps {
  letters: LetterSummary[];
  emptyMessage?: string;
}

const ROTATIONS = [-2.2, 1.6, -1, 2.1, -1.6, 1.1, -2.4, 1.8];

export function PaperLetterGrid({
  letters,
  emptyMessage = "No messages here yet.",
}: PaperLetterGridProps) {
  if (letters.length === 0) {
    return (
      <p className="py-10 text-center text-[14px] text-slate-muted">
        {emptyMessage}
      </p>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {letters.map((letter, i) => (
        <PaperLetterCard
          key={letter.id}
          letter={letter}
          rotation={ROTATIONS[i % ROTATIONS.length]}
        />
      ))}
    </div>
  );
}