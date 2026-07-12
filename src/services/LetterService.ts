import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/slug";
import type { CreateLetterInput } from "@/lib/validators";

export type LetterSort = "newest" | "trending" | "random";

const listSelect = {
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
} as const;

export const LetterService = {
  /** Public feed: discover page, home page rows, search fallback listing. */
  async list({
    category,
    sort = "newest",
    page = 1,
    limit = 12,
  }: {
    category?: string | null;
    sort?: LetterSort;
    page?: number;
    limit?: number;
  }) {
    const where = {
      visibility: "PUBLIC" as const,
      ...(category ? { category } : {}),
    };

    const orderBy =
      sort === "trending"
        ? [{ reactions: "desc" as const }, { views: "desc" as const }]
        : [{ createdAt: "desc" as const }];

    const safeLimit = Math.min(50, limit);

    const [letters, total] = await Promise.all([
      prisma.letter.findMany({
        where,
        orderBy,
        skip: (page - 1) * safeLimit,
        take: safeLimit,
        select: listSelect,
      }),
      prisma.letter.count({ where }),
    ]);

    // "random" sort is done in memory since Postgres RANDOM() ordering
    // doesn't paginate well — fine at this scale, revisit if it grows.
    const ordered =
      sort === "random" ? [...letters].sort(() => Math.random() - 0.5) : letters;

    return { letters: ordered, total, page, limit: safeLimit };
  },

  /** Single letter by slug — bumps the view counter and includes recent replies. */
  async getBySlug(slug: string) {
    return prisma.letter.update({
      where: { slug },
      data: { views: { increment: 1 } },
      include: {
        replies: { orderBy: { createdAt: "desc" }, take: 20 },
      },
    });
  },

  async create(data: CreateLetterInput) {
    const slug = await slugify(data.title, prisma);

    return prisma.letter.create({
      data: {
        slug,
        title: data.title,
        message: data.message,
        category: data.category,
        recipientName: data.recipientName,
        recipientEmail: data.recipientEmail ?? null,
        senderName: data.senderName ?? null,
        senderEmail: data.senderEmail,
        songName: data.songName ?? null,
        artistName: data.artistName ?? null,
        albumCover: data.albumCover ?? null,
        visibility: data.visibility ?? "PUBLIC",
        publishType: data.publishType ?? "PUBLISH_ONLY",
      },
    });
  },

  async delete(slug: string) {
    return prisma.letter.delete({ where: { slug } });
  },

  async incrementReactions(id: string) {
    return prisma.letter.update({
      where: { id },
      data: { reactions: { increment: 1 } },
    });
  },
};
