import { LetterCard } from "@/components/cards/LetterCard";
import type { LetterSummary } from "@/types";

// Placeholder data — replaced by LetterService.getByAuthor(userId) once
// magic-link auth + Supabase are wired up.
const MY_LETTERS: LetterSummary[] = [
  {
    id: "1",
    slug: "our-random-drives",
    title: "Our random drives",
    message: "our random drives pas ujan still live in my mind rent free",
    category: "Friendship",
    recipientName: "clara",
    senderName: null,
    songName: null,
    artistName: null,
    albumCover: null,
    views: 128,
    reactions: 14,
    createdAt: new Date().toISOString(),
  },
  {
    id: "6",
    slug: "thank-you-for-staying",
    title: "Thank you for staying",
    message: "thank you for staying even when i gave you every reason to leave",
    category: "Gratitude",
    recipientName: "noah",
    senderName: null,
    songName: null,
    artistName: null,
    albumCover: null,
    views: 76,
    reactions: 21,
    createdAt: new Date().toISOString(),
  },
];

const STATS = [
  { label: "Letters sent", value: MY_LETTERS.length },
  {
    label: "Total views",
    value: MY_LETTERS.reduce((sum, l) => sum + l.views, 0),
  },
  {
    label: "Total reactions",
    value: MY_LETTERS.reduce((sum, l) => sum + l.reactions, 0),
  },
];

export default function DashboardPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <h1 className="font-hand text-4xl text-ink sm:text-5xl">
        Your letters
      </h1>
      <p className="mt-2 text-sm text-muted">
        Everything you've written, in one place.
      </p>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {STATS.map((stat) => (
          <div
            key={stat.label}
            className="rounded-card border border-hairline bg-paper p-5"
          >
            <p className="font-hand text-3xl text-ink">{stat.value}</p>
            <p className="mt-1 text-xs uppercase tracking-wide text-muted">
              {stat.label}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-12">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-medium uppercase tracking-wide text-muted">
            History
          </h2>
          <a
            href="/create"
            className="text-sm font-medium text-ink underline underline-offset-4 hover:no-underline"
          >
            + Write a new letter
          </a>
        </div>

        <div className="mt-4 space-y-4">
          {MY_LETTERS.length === 0 ? (
            <p className="text-sm text-muted">
              You haven't written a letter yet.
            </p>
          ) : (
            MY_LETTERS.map((letter) => (
              <LetterCard key={letter.id} letter={letter} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
