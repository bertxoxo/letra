import type { SpotifyTrack } from "@/components/spotify/SpotifySearchModal";

const TOKEN_URL = "https://accounts.spotify.com/api/token";
const SEARCH_URL = "https://api.spotify.com/v1/search";

let cachedToken: { value: string; expiresAt: number } | null = null;

async function getAccessToken(): Promise<string | null> {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  if (!clientId || !clientSecret) return null;

  if (cachedToken && cachedToken.expiresAt > Date.now()) {
    return cachedToken.value;
  }

  const basic = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: {
      Authorization: `Basic ${basic}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });

  if (!res.ok) {
    console.error("Spotify token request failed:", res.status, await res.text());
    return null;
  }

  const data = await res.json();
  cachedToken = {
    value: data.access_token,
    expiresAt: Date.now() + (data.expires_in - 60) * 1000,
  };
  return cachedToken.value;
}

export const SpotifyService = {
  async search(query: string, limit = 8): Promise<SpotifyTrack[]> {
    const token = await getAccessToken();
    if (!token) return [];

    const params = new URLSearchParams({ q: query, type: "track", limit: String(limit) });
    const res = await fetch(`${SEARCH_URL}?${params}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) {
      console.error("Spotify search request failed:", res.status, await res.text());
      return [];
    }

    const data = await res.json();
    return (data.tracks?.items ?? []).map((track: any) => ({
      id: track.id,
      name: track.name,
      artist: track.artists?.map((a: any) => a.name).join(", ") ?? "",
      albumCover: track.album?.images?.[1]?.url ?? track.album?.images?.[0]?.url ?? "",
      spotifyUrl: track.external_urls?.spotify ?? "",
    }));
  },
  isConfigured(): boolean {
    return Boolean(process.env.SPOTIFY_CLIENT_ID && process.env.SPOTIFY_CLIENT_SECRET);
  },
};