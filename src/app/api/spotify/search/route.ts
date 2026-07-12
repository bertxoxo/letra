import { NextRequest, NextResponse } from "next/server";
import { SpotifyService } from "@/services/SpotifyService";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q");

  if (!query) {
    return NextResponse.json(
      { error: "Query param 'q' is required." },
      { status: 400 }
    );
  }

  if (!SpotifyService.isConfigured()) {
    return NextResponse.json(
      { error: "Spotify integration is not configured yet.", results: [] },
      { status: 501 }
    );
  }

  const results = await SpotifyService.search(query);
  return NextResponse.json({ results });
}