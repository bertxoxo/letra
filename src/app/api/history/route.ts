import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getOrCreateAnonymousId } from "@/lib/anonymousId";

export async function GET(req: NextRequest) {
  const { anonymousId } = getOrCreateAnonymousId(req);

  try {
    const letters = await prisma.letter.findMany({
      where: { anonymousId },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        slug: true,
        title: true,
        message: true,
        category: true,
        recipientName: true,
        senderName: true,
        songName: true,
        artistName: true,
        albumCover: true,
        views: true,
        reactions: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ letters });
  } catch (error) {
    console.error("[GET /api/history]", error);
    return NextResponse.json({ error: "Failed to load history." }, { status: 500 });
  }
}