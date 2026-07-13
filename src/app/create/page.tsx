"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Label } from "@/components/ui/Label";
import { Alert } from "@/components/ui/Alert";
import { Checkbox } from "@/components/ui/Checkbox";
import { Button } from "@/components/ui/Button";
import { SpotifySearchModal, SpotifyTrack } from "@/components/spotify/SpotifySearchModal";

const CATEGORIES = [
  "Love",
  "Friendship",
  "Family",
  "Apology",
  "Gratitude",
  "Grief",
  "Other",
] as const;

export default function CreateLetterPage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [category, setCategory] = useState<(typeof CATEGORIES)[number]>("Other");
  const [recipientName, setRecipientName] = useState("");
  const [recipientEmail, setRecipientEmail] = useState("");
  const [senderName, setSenderName] = useState("");
  const [senderEmail, setSenderEmail] = useState("");
  const [confirmedHuman, setConfirmedHuman] = useState(false);

  const [spotifyOpen, setSpotifyOpen] = useState(false);
  const [track, setTrack] = useState<SpotifyTrack | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!confirmedHuman) {
      setError("Please confirm you're not a robot.");
      return;
    }

    setLoading(true);
    setError("");

  const body = {
  title,
  message,
  category,
  recipientName,
  recipientEmail: recipientEmail || undefined,
  senderName: senderName || undefined,
  senderEmail,
  songName: track?.name,
  artistName: track?.artist,
  albumCover: track?.albumCover,
  spotifyTrackId: track?.id,
  publishType: recipientEmail ? "PUBLISH_AND_EMAIL" : "PUBLISH_ONLY",
};;

    try {
      const res = await fetch("/api/letters", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error ?? "Something went wrong. Please try again.");
      }

      router.push(`/letter/${data.letter.slug}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-6 py-16">
      <h1 className="font-hand text-4xl text-ink sm:text-5xl">Tell your story</h1>
      <p className="mt-2 text-sm text-muted">
        Write your untold message, pick a category, and attach the song that
        captures the feeling.
      </p>

      {error && (
        <Alert title="Something went wrong" variant="warning" className="mt-6">
          {error}
        </Alert>
      )}

      <form className="mt-10 space-y-6" onSubmit={handleSubmit}>
        <div>
          <Label htmlFor="recipient">To</Label>
          <Input
            id="recipient"
            placeholder="Who is this for?"
            value={recipientName}
            onChange={(e) => setRecipientName(e.target.value)}
            required
          />
        </div>

        <div>
          <Label htmlFor="recipientEmail">Their email (optional)</Label>
          <Input
            id="recipientEmail"
            type="email"
            placeholder="So we can notify them â€” leave blank to just share the link yourself"
            value={recipientEmail}
            onChange={(e) => setRecipientEmail(e.target.value)}
          />
        </div>

        <div>
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            placeholder="Give your letter a short title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div>
          <Label htmlFor="message">Your message</Label>
          <Textarea
            id="message"
            rows={6}
            value={message}
            onChange={(e) => setMessage(e.target.value.slice(0, 3000))}
            placeholder="Write what you never got to say..."
            className="font-hand text-lg leading-relaxed"
            required
          />
          <p className="mt-1 text-right text-xs text-muted">
            {message.length}/3000
          </p>
        </div>

        <div>
          <Label htmlFor="category">Category</Label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value as (typeof CATEGORIES)[number])}
            className="input"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div className="rounded-card border border-dashed border-hairline p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-ink">Attach a song</p>
              {track ? (
                <div className="mt-2 flex items-center gap-2.5">
                  <img src={track.albumCover} alt={track.name} className="h-9 w-9 rounded" />
                  <div className="min-w-0">
                    <p className="truncate text-xs font-medium text-ink">{track.name}</p>
                    <p className="truncate text-xs text-muted">{track.artist}</p>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-muted">
                  Search Spotify and attach the track with your letter.
                </p>
              )}
            </div>
            <Button type="button" variant="outline" onClick={() => setSpotifyOpen(true)}>
              {track ? "Change song" : "Pick a song"}
            </Button>
          </div>
        </div>

        <div>
          <Label htmlFor="sender">From (optional display name)</Label>
          <Input
            id="sender"
            placeholder="Leave blank to stay anonymous"
            value={senderName}
            onChange={(e) => setSenderName(e.target.value)}
          />
        </div>

        <div>
          <Label htmlFor="senderEmail">Your email</Label>
          <Input
            id="senderEmail"
            type="email"
            placeholder="We'll never show this publicly"
            value={senderEmail}
            onChange={(e) => setSenderEmail(e.target.value)}
            required
          />
        </div>

        <div className="flex items-center gap-2">
          <Checkbox
            id="confirmHuman"
            checked={confirmedHuman}
            onChange={(e) => setConfirmedHuman(e.target.checked)}
          />
          <Label htmlFor="confirmHuman" className="!mb-0 font-normal">
            I confirm I'm not a robot
          </Label>
        </div>

        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Sending..." : "Send it into the world"}
        </Button>
      </form>

      <SpotifySearchModal
        open={spotifyOpen}
        onClose={() => setSpotifyOpen(false)}
        onSelect={(t) => {
          setTrack(t);
          setSpotifyOpen(false);
        }}
      />
    </div>
  );
}
