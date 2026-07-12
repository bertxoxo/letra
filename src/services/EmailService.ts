import { mailer } from "@/lib/mailer";

export type EmailType = "letter_published" | "new_reply" | "magic_link" | "letter_viewed";

const FROM = process.env.GMAIL_USER ?? "letra <noreply@letra.app>";

function renderTemplate(type: EmailType, data: Record<string, string>) {
  switch (type) {
    case "letter_published":
      return {
        subject: "Someone sent you a message",
        html: `
          <div style="font-family:Inter,Arial,sans-serif;background-color:#FEFEFC;padding:40px 20px;max-width:480px;margin:auto;border-radius:12px;">
            <h1 style="font-size:22px;color:#1C1C1C;text-align:center;margin:0 0 8px;">
              Someone sent you a message
            </h1>
            <p style="color:#6B7285;text-align:center;font-size:14px;margin:0 0 32px;">
              A letter is waiting for you${data.recipientName ? `, ${data.recipientName}` : ""}.
            </p>
            <div style="text-align:center;">
              <a href="${data.url}" style="display:inline-block;background-color:#1C1C1C;color:#FEFEFC;text-decoration:none;padding:14px 28px;border-radius:8px;font-weight:600;font-size:15px;">
                Open your letter
              </a>
            </div>
          </div>`,
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
        html: `
          <div style="font-family:Inter,Arial,sans-serif;background-color:#FEFEFC;padding:40px 20px;max-width:480px;margin:auto;border-radius:12px;">
            <h1 style="font-size:22px;color:#1C1C1C;text-align:center;margin:0 0 8px;">
              Your letter was just read
            </h1>
            <p style="color:#6B7285;text-align:center;font-size:14px;margin:0 0 32px;">
              ${data.recipientName ? `${data.recipientName} opened` : "Someone opened"} the message you sent.
            </p>
            <div style="text-align:center;">
              <a href="${data.url}" style="display:inline-block;background-color:#1C1C1C;color:#FEFEFC;text-decoration:none;padding:14px 28px;border-radius:8px;font-weight:600;font-size:15px;">
                View your letter
              </a>
            </div>
          </div>`,
      };
    default:
      return null;
  }
}

export const EmailService = {
  async send(type: EmailType, to: string, data: Record<string, string> = {}) {
    const template = renderTemplate(type, data);
    if (!template) throw new Error(`Unknown email type: ${type}`);

    if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
      console.warn(`[EmailService] Gmail credentials not set, skipping "${type}" email.`);
      return { skipped: true as const };
    }

    await mailer.sendMail({
      from: FROM,
      to,
      subject: template.subject,
      html: template.html,
    });

    return { skipped: false as const };
  },
};
