import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { EmailService } from "@/services/EmailService";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { type, message, email, pageUrl, anonymousId } = body;

    if (!message || typeof message !== "string" || message.trim().length === 0) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    const feedback = await prisma.feedback.create({
      data: {
        type: type ?? "SUGGESTION",
        message: message.trim(),
        email: email || null,
        pageUrl: pageUrl || null,
        userAgent: req.headers.get("user-agent") || null,
        anonymousId: anonymousId || null,
      },
    });

    try {
      await EmailService.send("feedback_notification", process.env.GMAIL_USER ?? "", {
        type: feedback.type,
        message: feedback.message,
        pageUrl: feedback.pageUrl ?? "",
        email: feedback.email ?? "",
      });
    } catch (emailErr) {
      console.error("Feedback email notification failed:", emailErr);
    }

    return NextResponse.json({ success: true, id: feedback.id }, { status: 201 });
  } catch (err) {
    console.error("Feedback submission error:", err);
    return NextResponse.json({ error: "Failed to submit feedback" }, { status: 500 });
  }
}