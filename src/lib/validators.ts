import { z } from "zod";

export const LETTER_CATEGORIES = [
  "Love",
  "Friendship",
  "Family",
  "Apology",
  "Gratitude",
  "Grief",
  "Other",
] as const;

export const createLetterSchema = z.object({
  title: z.string().min(2).max(80),
  message: z.string().min(1).max(3000),
  category: z.enum(LETTER_CATEGORIES).default("Other"),
  recipientName: z.string().min(1).max(60),
  recipientEmail: z.string().email().optional().nullable(),
  senderName: z.string().max(60).optional(),
  senderEmail: z.string().email(),
  songName: z.string().max(120).optional(),
  artistName: z.string().max(120).optional(),
  albumCover: z.string().url().optional(),
  visibility: z.enum(["PUBLIC", "PRIVATE"]).default("PUBLIC"),
  publishType: z.enum(["PUBLISH_ONLY", "PUBLISH_AND_EMAIL"]).default("PUBLISH_ONLY"),
});

export type CreateLetterInput = z.infer<typeof createLetterSchema>;

export const createReplySchema = z.object({
  letterId: z.string().min(1),
  message: z.string().min(1).max(1000),
});

export type CreateReplyInput = z.infer<typeof createReplySchema>;

export const magicLinkRequestSchema = z.object({
  email: z.string().email(),
});
