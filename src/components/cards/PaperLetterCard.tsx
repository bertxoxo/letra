"use client";

import { useState } from "react";
import Link from "next/link";
import type { LetterSummary } from "@/types";

interface PaperLetterCardProps {
  letter: Pick<
    LetterSummary,
    "slug" | "recipientName" | "message" | "category" | "songName" | "artistName" | "albumCover"
  >;
  rotation?: number;
}

export function PaperLetterCard({ letter, rotation = 0 }: PaperLetterCardProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <>
      <style>{STYLES}</style>
      <Link href={`/letter/${letter.slug}`}>
        <div
          className={`plc-card ${hovered ? "plc-card--hovered" : ""}`}
          style={
            {
              "--rot": `${rotation}deg`,
              "--lift-rot": `${rotation * 0.3}deg`,
            } as React.CSSProperties
          }
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          <span className="plc-to-pill">To: {letter.recipientName}</span>
          <p className="plc-card-preview">{letter.message}</p>

          {letter.songName && (
            <div className="plc-song-row">
              {letter.albumCover ? (
                <img src={letter.albumCover} alt={letter.songName} className="plc-song-cover" />
              ) : (
                <div className="plc-song-cover plc-song-cover--empty" />
              )}
              <div className="plc-song-info">
                <p className="plc-song-name">{letter.songName}</p>
                {letter.artistName && <p className="plc-song-artist">{letter.artistName}</p>}
              </div>
              <SpotifyMark />
            </div>
          )}

          {letter.category && <span className="plc-card-tag">{letter.category}</span>}
        </div>
      </Link>
    </>
  );
}

function SpotifyMark() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" className="plc-spotify-icon" fill="currentColor">
      <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141 4.32-1.32 9.72-.66 13.439 1.62.361.181.54.78.302 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.72-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
    </svg>
  );
}

const STYLES = `
  .plc-card {
    position: relative;
    width: 100%;
    min-height: 200px;
    background: linear-gradient(145deg, #fffef9 0%, #faf7ee 60%, #f2eedf 100%);
    border-radius: 2px;
    padding: 20px 22px 28px;
    box-shadow: 2px 4px 12px rgba(0,0,0,0.10), 0 1px 3px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.7);
    transform: rotate(var(--rot));
    transition: transform 0.35s cubic-bezier(0.34, 1.4, 0.64, 1), box-shadow 0.35s ease, filter 0.35s ease;
    cursor: pointer;
  }
  .plc-card--hovered {
    transform: rotate(var(--lift-rot)) translateY(-10px) scale(1.04);
    box-shadow: 6px 20px 40px rgba(0,0,0,0.18), 0 4px 10px rgba(0,0,0,0.10), inset 0 1px 0 rgba(255,255,255,0.8);
    filter: brightness(1.02);
    z-index: 10;
  }
  .plc-to-pill {
    display: inline-block;
    background: rgba(0,0,0,0.06);
    color: #555;
    font-family: var(--font-body, system-ui);
    font-size: 0.68rem;
    font-weight: 600;
    letter-spacing: 0.02em;
    padding: 4px 11px;
    border-radius: 999px;
    margin-bottom: 14px;
  }
  .plc-card-preview {
    font-family: var(--font-hand, cursive);
    font-size: 1.05rem;
    line-height: 1.7;
    color: #2a2a2a;
    display: -webkit-box;
    -webkit-line-clamp: 4;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  .plc-song-row {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-top: 16px;
    padding-top: 14px;
    border-top: 1px solid rgba(0,0,0,0.08);
  }
  .plc-song-cover {
    width: 40px;
    height: 40px;
    border-radius: 6px;
    object-fit: cover;
    flex-shrink: 0;
    background: #eee;
  }
  .plc-song-cover--empty { background: #e5e2d8; }
  .plc-song-info { flex: 1; min-width: 0; }
  .plc-song-name {
    font-family: var(--font-body, system-ui);
    font-size: 0.82rem;
    font-weight: 600;
    color: #222;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .plc-song-artist {
    font-family: var(--font-body, system-ui);
    font-size: 0.72rem;
    color: #888;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .plc-spotify-icon { flex-shrink: 0; color: #1DB954; }
  .plc-card-tag {
    display: inline-block;
    margin-top: 12px;
    font-size: 0.62rem;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: #aaa;
  }
`;