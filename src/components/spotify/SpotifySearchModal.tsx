"use client";

import { SearchBar } from "@/components/search/SearchBar";

export interface SpotifyTrack {
  id: string;
  name: string;
  artist: string;
  albumCover: string;
  spotifyUrl: string;
}

interface SpotifySearchModalProps {
  open: boolean;
  onClose: () => void;
  onSelect: (track: SpotifyTrack) => void;
}

async function searchTracks(query: string): Promise<SpotifyTrack[]> {
  const res = await fetch(`/api/spotify/search?q=${encodeURIComponent(query)}`);
  if (!res.ok) return [];
  const data = await res.json();
  return data.results ?? [];
}

export function SpotifySearchModal({ open, onClose, onSelect }: SpotifySearchModalProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/30 px-4 pt-24"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-lg border border-hairline bg-white p-5 shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-3 flex items-center justify-between">
          <p className="text-[15px] font-semibold text-ink">Choose a song</p>
          <button
            onClick={onClose}
            className="text-[13px] text-slate-muted hover:text-ink"
          >
            Close
          </button>
        </div>

        <SearchBar<SpotifyTrack>
          placeholder="Search and select your song"
          onQueryChange={searchTracks}
          emptyLabel="No tracks found."
          renderResult={(track) => (
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => {
                onSelect(track);
                onClose();
              }}
              className="flex w-full items-center gap-3 px-3.5 py-2.5 text-left hover:bg-gray-50"
            >
              <img src={track.albumCover} alt={track.name} className="h-9 w-9 rounded" />
              <div className="min-w-0">
                <p className="truncate text-[14px] font-medium text-ink">{track.name}</p>
                <p className="truncate text-[12px] text-slate-muted">{track.artist}</p>
              </div>
            </button>
          )}
        />
      </div>
    </div>
  );
}