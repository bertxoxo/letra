import { prisma } from "@/lib/prisma";
import type { CreateReplyInput } from "@/lib/validators";

export const ReplyService = {
  async listForLetter(letterId: string) {
    return prisma.reply.findMany({
      where: { letterId },
      orderBy: { createdAt: "desc" },
    });
  },

  /**
   * Creates the reply and bumps the parent letter's reaction count in one
   * transaction, so the two never drift out of sync if one write fails.
   */
  async create(data: CreateReplyInput) {
    const [reply] = await prisma.$transaction([
      prisma.reply.create({
        data: {
          letterId: data.letterId,
          message: data.message,
          authorRole: data.authorRole,
        },
      }),
      prisma.letter.update({
        where: { id: data.letterId },
        data: { reactions: { increment: 1 } },
      }),
    ]);

    return reply;
  },
};
