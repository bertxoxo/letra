import Link from "next/link";
import type { Letter } from "@/types";

interface LetterCardProps {
  letter: Pick<
    Letter,
    "slug" | "recipientName" | "message" | "songName" | "artistName" | "albumCover" | "reactions"
  >;
}

export function LetterCard({ letter }: LetterCardProps) {
  return (
    <Link
      href={`/letter/${letter.slug}`}
      className="block rounded-lg border border-hairline bg-white p-5 transition-shadow hover:shadow-sm"
    >
      <p className="text-[13px] font-semibold uppercase tracking-wide text-slate-muted">
        To: <span className="text-ink normal-case">{letter.recipientName}</span>
      </p>

      <p className="mt-3 font-handwritten text-[22px] leading-snug text-ink line-clamp-4">
        {letter.message}
      </p>

      {letter.songName && (
        <div className="mt-4 flex items-center gap-2.5 border-t border-hairline pt-3">
          {letter.albumCover ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={letter.albumCover}
              alt={letter.songName}
              className="h-8 w-8 rounded"
            />
          ) : (
            <div className="h-8 w-8 rounded bg-gray-100" />
          )}
          <div className="min-w-0">
            <p className="truncate text-[13px] font-medium text-ink">
              {letter.songName}
            </p>
            <p className="truncate text-[12px] text-slate-muted">
              {letter.artistName}
            </p>
          </div>
        </div>
      )}

      {typeof letter.reactions === "number" && (
        <p className="mt-3 text-[12px] text-slate-muted">
          {letter.reactions} reaction{letter.reactions === 1 ? "" : "s"}
        </p>
      )}
    </Link>
  );
}
