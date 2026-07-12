import { prisma } from "@/lib/prisma";

const searchSelect = {
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
} as const;

export const SearchService = {
  async searchLetters(query: string, limit = 30) {
    const trimmed = query.trim();
    if (!trimmed) return [];

    return prisma.letter.findMany({
      where: {
        visibility: "PUBLIC",
        OR: [
          { recipientName: { contains: trimmed, mode: "insensitive" } },
          { title: { contains: trimmed, mode: "insensitive" } },
          { message: { contains: trimmed, mode: "insensitive" } },
        ],
      },
      orderBy: { createdAt: "desc" },
      take: limit,
      select: searchSelect,
    });
  },
};
