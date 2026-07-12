import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { PaperLetterReveal } from "@/components/letter/PaperLetterReveal";
import { SpotifyEmbedPlayer } from "@/components/spotify/SpotifyEmbedPlayer";
import { EmailService } from "@/services/EmailService";

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

  // Increment views and send "letter viewed" email to sender only once (on first view)
  const isFirstView = letter.views === 0;

  prisma.letter
    .update({
      where: { id: letter.id },
      data: { views: { increment: 1 } },
    })
    .catch((err) => console.error("Failed to increment views:", err));

  if (isFirstView && letter.senderEmail) {
    const url = `${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/letter/${letter.slug}`;
    EmailService.send("letter_viewed", letter.senderEmail, {
      recipientName: letter.recipientName,
      url,
    })
      .then(() => console.log("[letter_viewed] Sent to sender:", letter.senderEmail))
      .catch((err) => console.error("[letter_viewed] Failed:", err));
  }

  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center px-6 py-16">
      <p className="text-sm text-muted">A letter to</p>
      <h1 className="mt-1 font-hand text-4xl text-ink sm:text-5xl">
        {letter.recipientName}
      </h1>
      <PaperLetterReveal
        message={letter.message}
        recipientName={letter.recipientName}
        senderName={letter.senderName ?? null}
      />
      {letter.songName && (
        <div className="mt-8 w-full">
          <SpotifyEmbedPlayer trackId={letter.spotifyTrackId!} />
        </div>
      )}
      <div className="mt-4 flex items-center gap-4 text-xs text-muted">
        <span>{letter.views} views</span>
        <span>·</span>
        <span>{letter.reactions} reactions</span>
        <span>·</span>
        <span>{letter.category}</span>
      </div>
    </div>
  );
}