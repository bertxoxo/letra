"use client";

import { useEffect, useState, ReactNode } from "react";
import { Input } from "@/components/ui/Input";
import { useDebounce } from "@/hooks/useDebounce";

interface SearchBarProps<T> {
  placeholder?: string;
  onQueryChange: (query: string) => Promise<T[]> | T[];
  renderResult: (result: T, close: () => void) => ReactNode;
  emptyLabel?: string;
}

export function SearchBar<T>({
  placeholder = "Search...",
  onQueryChange,
  renderResult,
  emptyLabel = "No results.",
}: SearchBarProps<T>) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<T[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const debounced = useDebounce(query, 300);

  useEffect(() => {
    if (!debounced.trim()) {
      setResults([]);
      return;
    }

    let cancelled = false;
    setLoading(true);

    Promise.resolve(onQueryChange(debounced))
      .then((res) => {
        if (!cancelled) setResults(res);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [debounced, onQueryChange]);

  return (
    <div className="relative">
      <Input
        value={query}
        placeholder={placeholder}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 120)}
      />

      {open && query.trim() && (
        <div className="absolute z-20 mt-1.5 max-h-72 w-full overflow-y-auto rounded-md border border-hairline bg-white shadow-md">
          {loading && (
            <p className="px-3.5 py-2.5 text-[13px] text-slate-muted">Searching…</p>
          )}
          {!loading && results.length === 0 && (
            <p className="px-3.5 py-2.5 text-[13px] text-slate-muted">{emptyLabel}</p>
          )}
          {!loading &&
            results.map((result, i) => (
              <div key={i}>{renderResult(result, () => setOpen(false))}</div>
            ))}
        </div>
      )}
    </div>
  );
}
