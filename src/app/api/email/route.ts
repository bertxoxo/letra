import { NextRequest, NextResponse } from "next/server";
import { mailer } from "@/lib/mailer";
import { z } from "zod";

const emailSchema = z.object({
  type: z.enum(["letter_published", "new_reply", "magic_link", "letter_viewed"]),
  to: z.string().email(),
  data: z.record(z.string()).default({}),
});

const FROM = process.env.GMAIL_USER ?? "letra <noreply@letra.app>";

function renderTemplate(type: string, data: Record<string, string>) {
  switch (type) {
    case "letter_published":
      return {
        subject: "Your message is live",
        html: `<div style="font-family:Inter,Arial,sans-serif;color:#1C1C1C;max-width:480px;margin:auto"><p>Hi${data.recipientName ? ` ${data.recipientName}` : ""},</p><p>Your message has been published and is now live.</p><p><a href="${data.url}" style="color:#1C1C1C;font-weight:600">View it here</a></p></div>`,
      };
    case "new_reply":
      return {
        subject: "Someone replied to your message",
        html: `<div style="font-family:Inter,Arial,sans-serif;color:#1C1C1C;max-width:480px;margin:auto"><p>Your message just got a reply.</p><p><a href="${data.url}" style="color:#1C1C1C;font-weight:600">Read it here</a></p></div>`,
      };
    case "magic_link":
      return {
        subject: "Your sign-in link",
        html: `<div style="font-family:Inter,Arial,sans-serif;color:#1C1C1C;max-width:480px;margin:auto"><p>Click below to sign in. This link expires in 15 minutes.</p><p><a href="${data.url}" style="color:#1C1C1C;font-weight:600">Sign in</a></p></div>`,
      };
    case "letter_viewed":
      return {
        subject: "Your letter was just read",
        html: `<div style="font-family:Inter,Arial,sans-serif;color:#1C1C1C;max-width:480px;margin:auto"><p>${data.recipientName ? `${data.recipientName} opened` : "Someone opened"} your letter.</p><p><a href="${data.url}" style="color:#1C1C1C;font-weight:600">View it here</a></p></div>`,
      };
    default:
      return null;
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = emailSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input.", issues: parsed.error.flatten() }, { status: 400 });
    }

    const { type, to, data } = parsed.data;
    const template = renderTemplate(type, data);

    if (!template) {
      return NextResponse.json({ error: "Unknown email type." }, { status: 400 });
    }

    if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
      console.warn("[POST /api/email] Gmail credentials not set, skipping send.");
      return NextResponse.json({ skipped: true }, { status: 202 });
    }

    await mailer.sendMail({
      from: FROM,
      to,
      subject: template.subject,
      html: template.html,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[POST /api/email]", error);
    return NextResponse.json({ error: "Failed to send email." }, { status: 500 });
  }
}
