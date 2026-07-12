import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { EmailService } from "@/services/EmailService";

// GET /api/letters/[slug] — fetch one letter and bump its view count
export async function GET(
  _req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const letter = await prisma.letter.update({
      where: { slug: params.slug },
      data: { views: { increment: 1 } },
      include: {
        replies: {
          orderBy: { createdAt: "desc" },
          take: 20,
        },
      },
    });

    // Notify sender that their letter was viewed
    if (letter.senderEmail) {
      const url = `${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/letter/${letter.slug}`;
      try {
        await EmailService.send("letter_viewed", letter.senderEmail, {
          recipientName: letter.recipientName,
          url,
        });
        console.log("[letter_viewed] Notification sent to sender:", letter.senderEmail);
      } catch (err) {
        console.error("[letter_viewed] Failed to notify sender:", err);
      }
    }

    return NextResponse.json({ letter });
  } catch (error) {
    console.error("[GET /api/letters/:slug]", error);
    return NextResponse.json({ error: "Letter not found." }, { status: 404 });
  }
}

// DELETE /api/letters/[slug] — remove a letter
export async function DELETE(
  _req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    await prisma.letter.delete({ where: { slug: params.slug } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[DELETE /api/letters/:slug]", error);
    return NextResponse.json(
      { error: "Failed to delete letter." },
      { status: 404 }
    );
  }
}