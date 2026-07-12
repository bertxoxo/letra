import { cookies } from "next/headers";
import { verifySessionToken, SESSION_COOKIE } from "@/lib/auth";

export type ViewerRole = "SENDER" | "RECIPIENT" | null;

interface LetterEmails {
  senderEmail: string;
  recipientEmail: string | null;
}

// Reads the session cookie (set after clicking a magic link) and figures out
// whether the current visitor is the sender, the recipient, or neither.
export function getViewerRole(letter: LetterEmails): ViewerRole {
  const token = cookies().get(SESSION_COOKIE)?.value;
  if (!token) return null;

  const session = verifySessionToken(token);
  if (!session) return null;

  const email = session.email.toLowerCase();
  if (letter.senderEmail?.toLowerCase() === email) return "SENDER";
  if (letter.recipientEmail?.toLowerCase() === email) return "RECIPIENT";
  return null;
}