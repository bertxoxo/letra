import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/slug";
import { createLetterSchema } from "@/lib/validators";
import { EmailService } from "@/services/EmailService";
import { getOrCreateAnonymousId, setAnonymousIdCookie } from "@/lib/anonymousId";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");
  const sort = searchParams.get("sort") ?? "newest";
  const page = Math.max(1, Number(searchParams.get("page") ?? 1));
  const limit = Math.min(50, Number(searchParams.get("limit") ?? 12));

  try {
    const where = {
      visibility: "PUBLIC" as const,
      ...(category ? { category } : {}),
    };

    const orderBy =
      sort === "trending"
        ? [{ reactions: "desc" as const }, { views: "desc" as const }]
        : [{ createdAt: "desc" as const }];

    const letters = await prisma.letter.findMany({
      where,
      orderBy,
      skip: (page - 1) * limit,
      take: limit,
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

    return NextResponse.json({ letters, page, limit });
  } catch (error) {
    console.error("[GET /api/letters]", error);
    return NextResponse.json({ error: "Failed to load letters." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = createLetterSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input.", issues: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const data = parsed.data;
    const slug = await slugify(data.title, prisma);
    const { anonymousId, isNew } = getOrCreateAnonymousId(req);

    const letter = await prisma.letter.create({
      data: {
        slug,
        title: data.title,
        message: data.message,
        category: data.category,
        recipientName: data.recipientName,
        recipientEmail: data.recipientEmail ?? null,
        senderName: data.senderName ?? null,
        senderEmail: data.senderEmail,
        visibility: data.visibility ?? "PUBLIC",
        publishType: data.publishType ?? "PUBLISH_ONLY",
        anonymousId,
      },
    });

    if (letter.publishType === "PUBLISH_AND_EMAIL" && letter.recipientEmail) {
      const url = `${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/letter/${letter.slug}`;
      try {
        const result = await EmailService.send("letter_published", letter.recipientEmail, {
          recipientName: letter.recipientName,
          url,
        });
        console.log("Email send result:", result);
      } catch (err) {
        console.error("Failed to send publish email:", err);
      }
    } else {
      console.log("Email not sent — publishType:", letter.publishType, "recipientEmail:", letter.recipientEmail);
    }

    const response = NextResponse.json({ letter }, { status: 201 });
    if (isNew) setAnonymousIdCookie(response, anonymousId);
    return response;
  } catch (error) {
    console.error("[POST /api/letters]", error);
    return NextResponse.json({ error: "Failed to create letter." }, { status: 500 });
  }
}