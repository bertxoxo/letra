"use client";

import { useState } from "react";
import { PaperLetterGrid } from "@/components/cards/PaperLetterGrid";
import { DiscoverSearch } from "@/components/search/DiscoverSearch";
import type { LetterSummary } from "@/types";

const NEWEST: LetterSummary[] = [
  { id: "5", slug: "wish-i-could-forget", title: "Wish I could forget", message: "wish i could forget but honestly i don't want to", category: "Heartbreak", recipientName: "emil", senderName: null, songName: null, artistName: null, albumCover: null, views: 58, reactions: 9, createdAt: new Date().toISOString() },
  { id: "6", slug: "thank-you-for-staying", title: "Thank you for staying", message: "thank you for staying even when i gave you every reason to leave", category: "Gratitude", recipientName: "noah", senderName: null, songName: null, artistName: null, albumCover: null, views: 76, reactions: 21, createdAt: new Date().toISOString() },
];

const TRENDING: LetterSummary[] = [
  { id: "2", slug: "someday-ill-be-brave", title: "Someday", message: "i hope someday i'll be brave enough to tell u how much u meant to me", category: "Heartbreak", recipientName: "axel", senderName: null, songName: null, artistName: null, albumCover: null, views: 342, reactions: 51, createdAt: new Date().toISOString() },
  { id: "4", slug: "how-your-smile", title: "Your smile", message: "masih inget how your smile made everything feel okay, i miss that feeling", category: "Love", recipientName: "tara", senderName: null, songName: null, artistName: null, albumCover: null, views: 402, reactions: 67, createdAt: new Date().toISOString() },
];

const RANDOM: LetterSummary[] = [
  { id: "3", slug: "everything-reminds-me", title: "Everything reminds me", message: "everything reminds me of u, even that warteg tempat kita first hangout", category: "Missing Someone", recipientName: "lyra", senderName: null, songName: null, artistName: null, albumCover: null, views: 210, reactions: 33, createdAt: new Date().toISOString() },
  { id: "1", slug: "our-random-drives", title: "Our random drives", message: "our random drives pas ujan still live in my mind rent free", category: "Friendship", recipientName: "clara", senderName: null, songName: null, artistName: null, albumCover: null, views: 128, reactions: 14, createdAt: new Date().toISOString() },
];

export default function DiscoverPage() {
  const [searching, setSearching] = useState(false);

  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <h1 className="font-hand text-4xl text-ink sm:text-5xl">
        Discover letters
      </h1>
      <p className="mt-2 max-w-lg text-sm text-muted">
        Browse the untold words others have finally sent — newest first,
        what's trending, or just something random.
      </p>

      <DiscoverSearch onActiveChange={setSearching} />

      {!searching && (
        <div className="mt-14 space-y-14">
          <section>
            <h2 className="font-hand text-2xl text-ink">Newest</h2>
            <div className="mt-4"><PaperLetterGrid letters={NEWEST} /></div>
          </section>
          <section>
            <h2 className="font-hand text-2xl text-ink">Trending</h2>
            <div className="mt-4"><PaperLetterGrid letters={TRENDING} /></div>
          </section>
          <section>
            <h2 className="font-hand text-2xl text-ink">Random</h2>
            <div className="mt-4"><PaperLetterGrid letters={RANDOM} /></div>
          </section>
        </div>
      )}
    </div>
  );
}