import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/search?q=clara
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q")?.trim();

  if (!query) {
    return NextResponse.json({ results: [] });
  }

  try {
    const results = await prisma.letter.findMany({
      where: {
        visibility: "PUBLIC",
        recipientName: { contains: query, mode: "insensitive" },
      },
      orderBy: { createdAt: "desc" },
      take: 30,
      select: {
        id: true,
        slug: true,
        title: true,
        message: true,
        category: true,
        recipientName: true,
        songName: true,
        artistName: true,
        albumCover: true,
        views: true,
        reactions: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ results });
  } catch (error) {
    console.error("[GET /api/search]", error);
    return NextResponse.json(
      { error: "Search failed." },
      { status: 500 }
    );
  }
}