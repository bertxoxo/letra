import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

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

    return NextResponse.json({ letter });
  } catch (error) {
    console.error("[GET /api/letters/:slug]", error);
    return NextResponse.json({ error: "Letter not found." }, { status: 404 });
  }
}

// DELETE /api/letters/[slug] — remove a letter (author-only, auth check TODO
// once magic-link session is wired up in /lib/auth.ts)
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
