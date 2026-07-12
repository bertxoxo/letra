interface SpotifyEmbedPlayerProps {
  /** Spotify track ID, e.g. "3n3Ppam7vgaVa1iaRUc9Lp" */
  trackId: string;
  compact?: boolean;
}

// Uses Spotify's free embeddable player (open.spotify.com/embed/...). This
// needs no API key or auth — only track search (SpotifySearchModal) needs
// the client-credentials flow, which stays deferred until later.
export function SpotifyEmbedPlayer({ trackId, compact = true }: SpotifyEmbedPlayerProps) {
  return (
    <iframe
      title="Spotify player"
      src={`https://open.spotify.com/embed/track/${trackId}?utm_source=generator`}
      width="100%"
      height={compact ? 80 : 152}
      style={{ borderRadius: 8, border: "none" }}
      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
      loading="lazy"
    />
  );
}
