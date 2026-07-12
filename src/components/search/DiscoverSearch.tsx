"use client";

import { useState, type FormEvent } from "react";
import { PaperLetterGrid } from "@/components/cards/PaperLetterGrid";
import type { LetterSummary } from "@/types";

interface DiscoverSearchProps {
  onActiveChange?: (active: boolean) => void;
}

export function DiscoverSearch({ onActiveChange }: DiscoverSearchProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<LetterSummary[] | null>(null);
  const [loading, setLoading] = useState(false);

  async function runSearch(q: string) {
    const trimmed = q.trim();
    if (!trimmed) {
      setResults(null);
      onActiveChange?.(false);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(trimmed)}`);
      const data = await res.json();
      setResults(data.results ?? []);
      onActiveChange?.(true);
    } catch (error) {
      console.error("[DiscoverSearch]", error);
      setResults([]);
      onActiveChange?.(true);
    } finally {
      setLoading(false);
    }
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    runSearch(query);
  }

  function handleClear() {
    setQuery("");
    setResults(null);
    onActiveChange?.(false);
  }

  return (
    <div className="mt-8">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by recipient name..."
          className="w-full max-w-xs rounded-md border border-hairline bg-white px-3.5 py-2 text-sm text-ink placeholder:text-slate-muted focus:outline-none focus:ring-2 focus:ring-ink/10"
        />
        <button
          type="submit"
          disabled={loading}
          className="rounded-md bg-ink px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {loading ? "Searching..." : "Search"}
        </button>
        {results !== null && (
          <button
            type="button"
            onClick={handleClear}
            className="rounded-md border border-hairline px-4 py-2 text-sm text-slate-muted transition-colors hover:text-ink"
          >
            Clear
          </button>
        )}
      </form>

      {results !== null && (
        <div className="mt-10">
          <h2 className="font-hand text-2xl text-ink">
            Results for &ldquo;{query}&rdquo;
          </h2>
          <div className="mt-4">
            <PaperLetterGrid
              letters={results}
              emptyMessage={`No letters found addressed to "${query}".`}
            />
          </div>
        </div>
      )}
    </div>
  );
}