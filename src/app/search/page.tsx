"use client";

import { useMemo, useState } from "react";
import { LetterCard } from "@/components/cards/LetterCard";
import type { LetterSummary } from "@/types";

// Placeholder dataset â€” replaced by /api/search once Supabase full-text
// search (or a simple ilike query) is wired up.
const ALL_LETTERS: LetterSummary[] = [
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
    id: "2",
    slug: "someday-ill-be-brave",
    title: "Someday",
    message: "i hope someday i'll be brave enough to tell u how much u meant to me",
    category: "Heartbreak",
    recipientName: "axel",
    senderName: null,
    songName: null,
    artistName: null,
    albumCover: null,
    views: 342,
    reactions: 51,
    createdAt: new Date().toISOString(),
  },
  {
    id: "4",
    slug: "how-your-smile",
    title: "Your smile",
    message: "masih inget how your smile made everything feel okay, i miss that feeling",
    category: "Love",
    recipientName: "tara",
    senderName: null,
    songName: null,
    artistName: null,
    albumCover: null,
    views: 402,
    reactions: 67,
    createdAt: new Date().toISOString(),
  },
];

export default function SearchPage() {
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return ALL_LETTERS.filter(
      (letter) =>
        letter.recipientName?.toLowerCase().includes(q) ||
        letter.title.toLowerCase().includes(q) ||
        letter.message.toLowerCase().includes(q)
    );
  }, [query]);

  return (
    <div className="mx-auto max-w-2xl px-6 py-16">
      <h1 className="font-hand text-4xl text-ink sm:text-5xl">
        Find a letter
      </h1>
      <p className="mt-2 text-sm text-muted">
        Search by name and uncover heartfelt messages written just for you.
      </p>

      <div className="mt-8">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search a name, title, or word..."
          className="input"
          autoFocus
        />
      </div>

      <div className="mt-8 space-y-4">
        {query.trim() === "" && (
          <p className="text-sm text-muted">
            Start typing to search through every letter on letra.
          </p>
        )}

        {query.trim() !== "" && results.length === 0 && (
          <p className="text-sm text-muted">
            No letters found for &ldquo;{query}&rdquo;.
          </p>
        )}

        {results.map((letter) => (
          <LetterCard key={letter.id} letter={letter} />
        ))}
      </div>
    </div>
  );
}
