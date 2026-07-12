import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createMagicLinkToken, verifyMagicLinkToken, SESSION_COOKIE } from "@/lib/auth";
import { z } from "zod";

const requestSchema = z.object({
  email: z.string().email(),
  redirectPath: z
    .string()
    .refine((p) => p.startsWith("/") && !p.startsWith("//"), "Must be a relative path")
    .optional(),
});

// POST /api/auth/magic-link  — { email, redirectPath? } -> creates a token + emails a sign-in link
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = requestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Valid email required." }, { status: 400 });
    }

    const { email, redirectPath } = parsed.data;
    const token = await createMagicLinkToken(prisma, email);

    const origin = req.nextUrl.origin;
    const url = `${origin}/api/auth/magic-link?token=${token}${
      redirectPath ? `&redirect=${encodeURIComponent(redirectPath)}` : ""
    }`;

    await fetch(`${origin}/api/email`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "magic_link", to: email, data: { url } }),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[POST /api/auth/magic-link]", error);
    return NextResponse.json({ error: "Failed to send magic link." }, { status: 500 });
  }
}

// GET /api/auth/magic-link?token=xxx&redirect=/some/path — verifies the token, starts a
// session, and sends the person back to wherever they came from.
export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");
  const redirect = req.nextUrl.searchParams.get("redirect");

  if (!token) {
    return NextResponse.json({ error: "Missing token." }, { status: 400 });
  }

  const safeRedirect = redirect && redirect.startsWith("/") && !redirect.startsWith("//")
    ? redirect
    : "/dashboard";

  try {
    const session = await verifyMagicLinkToken(prisma, token);

    if (!session) {
      return NextResponse.json({ error: "Link expired or invalid." }, { status: 401 });
    }

    const response = NextResponse.redirect(new URL(safeRedirect, req.nextUrl.origin));
    response.cookies.set(SESSION_COOKIE, session.sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    });

    return response;
  } catch (error) {
    console.error("[GET /api/auth/magic-link]", error);
    return NextResponse.json({ error: "Verification failed." }, { status: 500 });
  }
}