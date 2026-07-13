"use client";

import { useState } from "react";
import { DiscoverSearch } from "@/components/search/DiscoverSearch";

export default function DiscoverPage() {
  const [searching, setSearching] = useState(false);

  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <h1 className="font-hand text-4xl text-ink sm:text-5xl">
        Discover letters
      </h1>
      <p className="mt-2 max-w-lg text-sm text-muted">
        Start typing a recipient name to find messages sent to them.
      </p>
      <DiscoverSearch onActiveChange={setSearching} />
    </div>
  );
}