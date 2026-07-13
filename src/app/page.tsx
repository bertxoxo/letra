import { Hero } from "@/components/hero/Hero";
import { LetterTicker } from "@/components/home/LetterTicker";
import { prisma } from "@/lib/prisma";

export default async function HomePage() {
  const letters = await prisma.letter.findMany({
    where: { visibility: "PUBLIC" },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      slug: true,
      recipientName: true,
      message: true,
      category: true,
      songName: true,
      artistName: true,
      albumCover: true,
      spotifyUrl: true,
    },
  });

  return (
    <>
      <Hero />
      <LetterTicker letters={letters} />
    </>
  );
}