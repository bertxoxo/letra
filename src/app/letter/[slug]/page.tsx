import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { SpotifyEmbedPlayer } from "@/components/spotify/SpotifyEmbedPlayer";

export default async function LetterPage({
  params,
}: {
  params: { slug: string };
}) {
  const letter = await prisma.letter.findUnique({
    where: { slug: params.slug },
  });

  if (!letter || letter.visibility === "PRIVATE") {
    notFound();
  }

  prisma.letter
    .update({
      where: { id: letter.id },
      data: { views: { increment: 1 } },
    })
    .catch((err) => console.error("Failed to increment views:", err));

  return (
    <div className="mx-auto flex max-w-lg flex-col items-center px-6 py-16">
      <h1 className="font-hand text-4xl text-ink text-center sm:text-5xl">
        Hello, {letter.recipientName}
      </h1>
      <p className="mt-3 max-w-sm text-center text-sm text-muted">
        There's someone sending you a song, they want you to hear this song
        that maybe you'll like :)
      </p>

      {letter.spotifyTrackId && (
        <div className="mt-8 w-full">
          <SpotifyEmbedPlayer trackId={letter.spotifyTrackId} compact={false} />
        </div>
      )}

      <p className="mt-10 text-sm text-muted">
        Also, here's a message from the sender:
      </p>
      <p className="mt-4 whitespace-pre-line text-center font-hand text-xl leading-relaxed text-ink">
        {letter.message}
      </p>
      {letter.senderName && (
        <p className="mt-6 font-hand text-lg italic text-ink">
          — {letter.senderName}
        </p>
      )}

      <div className="mt-10 flex items-center gap-4 text-xs text-muted">
        <span>{letter.views} views</span>
        <span>·</span>
        <span>{letter.reactions} reactions</span>
        <span>·</span>
        <span>{letter.category}</span>
      </div>
    </div>
  );
}