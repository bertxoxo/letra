import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

const COOKIE_NAME = "letra_anon_id";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

export function getOrCreateAnonymousId(req: NextRequest): { anonymousId: string; isNew: boolean } {
  const existing = req.cookies.get(COOKIE_NAME)?.value;
  if (existing) return { anonymousId: existing, isNew: false };
  return { anonymousId: uuidv4(), isNew: true };
}

export function setAnonymousIdCookie(response: NextResponse, anonymousId: string): void {
  response.cookies.set(COOKIE_NAME, anonymousId, {
    httpOnly: true,
    sameSite: "lax",
    maxAge: COOKIE_MAX_AGE,
    path: "/",
  });
}