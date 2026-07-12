import type { PrismaClient } from "@prisma/client";

function toSlugBase(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 60)
    .replace(/^-|-$/g, "") || "message";
}

function randomSuffix(length = 5): string {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
}

/**
 * Generates a URL-safe slug from the title and guarantees uniqueness by
 * checking the DB and appending a short random suffix on collision (retries
 * a few times before giving up, which would mean extraordinarily bad luck).
 */
export async function slugify(title: string, prisma: PrismaClient): Promise<string> {
  const base = toSlugBase(title);
  let candidate = base;
  let attempts = 0;

  while (attempts < 5) {
    const existing = await prisma.letter.findUnique({ where: { slug: candidate } });
    if (!existing) return candidate;

    candidate = `${base}-${randomSuffix()}`;
    attempts += 1;
  }

  // Fallback: timestamp guarantees uniqueness even in a pathological race.
  return `${base}-${Date.now().toString(36)}`;
}
