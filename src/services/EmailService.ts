import { mailer } from "@/lib/mailer";

export type EmailType = "letter_published" | "new_reply" | "magic_link" | "letter_viewed";

const FROM = process.env.GMAIL_USER ?? "letra <noreply@letra.app>";

function renderTemplate(type: EmailType, data: Record<string, string>) {
  switch (type) {
    case "letter_published": {
      const songBlock = data.songName
        ? `
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 28px;background-color:#1C1C1C;border-radius:12px;overflow:hidden;">
            <tr>
              <td style="padding:16px;">
                <table role="presentation" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="padding-right:14px;">
                      ${
                        data.albumCover
                          ? `<img src="${data.albumCover}" width="56" height="56" style="border-radius:6px;display:block;" alt="${data.songName}" />`
                          : `<div style="width:56px;height:56px;border-radius:6px;background-color:#333;"></div>`
                      }
                    </td>
                    <td style="vertical-align:middle;">
                      <p style="margin:0 0 3px;color:#FEFEFC;font-size:15px;font-weight:600;">${data.songName}</p>
                      ${data.artistName ? `<p style="margin:0;color:#9CA3AF;font-size:13px;">${data.artistName}</p>` : ""}
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>`
        : "";

      return {
        subject: "Someone sent you a message",
        html: `
          <div style="font-family:Inter,Arial,sans-serif;background-color:#F7F4EC;padding:48px 20px;">
            <div style="max-width:480px;margin:auto;background:linear-gradient(145deg,#fffef9 0%,#faf7ee 60%,#f2eedf 100%);border-radius:14px;padding:40px 32px;box-shadow:0 4px 20px rgba(0,0,0,0.06);">
              <p style="text-align:center;font-family:Georgia,serif;font-size:20px;color:#1C1C1C;letter-spacing:0.02em;margin:0 0 28px;">letra</p>
              <h1 style="font-size:22px;color:#1C1C1C;text-align:center;margin:0 0 8px;">
                Someone sent you a message
              </h1>
              <p style="color:#6B7285;text-align:center;font-size:14px;margin:0 0 28px;">
                Hello${data.recipientName ? `, ${data.recipientName}` : ""} — a letter is waiting for you.
              </p>
              ${songBlock}
              <div style="text-align:center;">
                <a href="${data.url}" style="display:inline-block;background-color:#1C1C1C;color:#FEFEFC;text-decoration:none;padding:14px 30px;border-radius:8px;font-weight:600;font-size:15px;">
                  Open your letter
                </a>
              </div>
              <p style="text-align:center;color:#B0AFA8;font-size:11px;margin:32px 0 0;">
                Sent with letra — express it with a song
              </p>
            </div>
          </div>`,
      };
    }
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
      replyTo: process.env.GMAIL_USER,
      from: FROM,
      to,
      subject: template.subject,
      html: template.html,
    });
    return { skipped: false as const };
  },
};