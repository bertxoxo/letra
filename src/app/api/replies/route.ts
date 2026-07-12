import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { createReplySchema } from "@/lib/validators";
import { createMagicLinkToken, verifySessionToken, SESSION_COOKIE } from "@/lib/auth";
import { MAX_REPLIES_PER_SIDE } from "@/lib/constants";

// GET /api/replies?letterId=xxx
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const letterId = searchParams.get("letterId");

  if (!letterId) {
    return NextResponse.json({ error: "letterId is required." }, { status: 400 });
  }

  try {
    const replies = await prisma.reply.findMany({
      where: { letterId },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ replies });
  } catch (error) {
    console.error("[GET /api/replies]", error);
    return NextResponse.json({ error: "Failed to load replies." }, { status: 500 });
  }
}

// POST /api/replies — leave a reply on a letter.
// The author's role (SENDER/RECIPIENT) is derived from their verified session,
// never trusted from the request body. Capped at MAX_REPLIES_PER_SIDE each.
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = createReplySchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input.", issues: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const data = parsed.data;

    const letter = await prisma.letter.findUnique({ where: { id: data.letterId } });
    if (!letter) {
      return NextResponse.json({ error: "Letter not found." }, { status: 404 });
    }

    const sessionCookie = cookies().get(SESSION_COOKIE)?.value;
    const session = sessionCookie ? verifySessionToken(sessionCookie) : null;

    if (!session) {
      return NextResponse.json(
        { error: "You need to verify your email before replying." },
        { status: 401 }
      );
    }

    const email = session.email.toLowerCase();
    let authorRole: "SENDER" | "RECIPIENT" | null = null;
    if (letter.senderEmail?.toLowerCase() === email) authorRole = "SENDER";
    else if (letter.recipientEmail?.toLowerCase() === email) authorRole = "RECIPIENT";

    if (!authorRole) {
      return NextResponse.json(
        { error: "You're not a participant on this letter." },
        { status: 403 }
      );
    }

    const existingCount = await prisma.reply.count({
      where: { letterId: data.letterId, authorRole },
    });

    if (existingCount >= MAX_REPLIES_PER_SIDE) {
      return NextResponse.json(
        { error: `You've reached the ${MAX_REPLIES_PER_SIDE}-reply limit for this letter.` },
        { status: 403 }
      );
    }

    const reply = await prisma.reply.create({
      data: {
        letterId: data.letterId,
        message: data.message,
        authorRole,
      },
    });

    await prisma.letter.update({
      where: { id: data.letterId },
      data: { reactions: { increment: 1 } },
    });

    const notifyEmail = authorRole === "SENDER" ? letter.recipientEmail : letter.senderEmail;
    if (notifyEmail) {
      const origin = req.nextUrl.origin;
      createMagicLinkToken(prisma, notifyEmail)
        .then((notifyToken) => {
          const url = `${origin}/api/auth/magic-link?token=${notifyToken}&redirect=${encodeURIComponent(
            `/letter/${letter.slug}`
          )}`;
          return fetch(`${origin}/api/email`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ type: "new_reply", to: notifyEmail, data: { url } }),
          });
        })
        .catch((err) => console.error("[POST /api/replies] notify failed:", err));
    }

    return NextResponse.json({ reply }, { status: 201 });
  } catch (error) {
    console.error("[POST /api/replies]", error);
    return NextResponse.json({ error: "Failed to post reply." }, { status: 500 });
  }
}