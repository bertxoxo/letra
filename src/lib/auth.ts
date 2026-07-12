import crypto from "crypto";
import type { PrismaClient } from "@prisma/client";

export const SESSION_COOKIE = "letra_session";

const MAGIC_LINK_TTL_MS = 15 * 60 * 1000; // 15 minutes
const SESSION_TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

function getSecret(): string {
  const secret = process.env.AUTH_SECRET;
  if (!secret) {
    throw new Error(
      "AUTH_SECRET is not set. Add a long random string to .env for signing sessions."
    );
  }
  return secret;
}

function sign(payload: string): string {
  return crypto.createHmac("sha256", getSecret()).update(payload).digest("base64url");
}

/**
 * Requires a prisma model roughly like:
 *   model MagicLink {
 *     id        String   @id @default(cuid())
 *     email     String
 *     token     String   @unique
 *     expiresAt DateTime
 *     usedAt    DateTime?
 *     createdAt DateTime @default(now())
 *   }
 * Add this to schema.prisma if it isn't there yet.
 */

// Step 1 — request: create a one-time token tied to the email, stored server-side.
export async function createMagicLinkToken(prisma: PrismaClient, email: string): Promise<string> {
  const token = crypto.randomBytes(24).toString("base64url");

  await prisma.magicLink.create({
    data: {
      email,
      token,
      expiresAt: new Date(Date.now() + MAGIC_LINK_TTL_MS),
    },
  });

  return token;
}

// Step 2 — verify: consume the token once, then hand back a signed, stateless session token.
export async function verifyMagicLinkToken(
  prisma: PrismaClient,
  token: string
): Promise<{ sessionToken: string; email: string } | null> {
  const record = await prisma.magicLink.findUnique({ where: { token } });

  if (!record || record.usedAt || record.expiresAt < new Date()) {
    return null;
  }

  await prisma.magicLink.update({
    where: { token },
    data: { usedAt: new Date() },
  });

  return { sessionToken: createSessionToken(record.email), email: record.email };
}

// Stateless session: "email.expiry.signature" — no DB table needed to check it.
export function createSessionToken(email: string): string {
  const expiresAt = Date.now() + SESSION_TTL_MS;
  const payload = `${email}.${expiresAt}`;
  return `${payload}.${sign(payload)}`;
}

export function verifySessionToken(sessionToken: string): { email: string } | null {
  const parts = sessionToken.split(".");
  if (parts.length !== 3) return null;

  const [email, expiresAtStr, signature] = parts;
  const payload = `${email}.${expiresAtStr}`;

  const expected = sign(payload);
  const valid =
    expected.length === signature.length &&
    crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature));

  if (!valid) return null;
  if (Number(expiresAtStr) < Date.now()) return null;

  return { email };
}
