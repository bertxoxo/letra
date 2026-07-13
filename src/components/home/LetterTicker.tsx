"use client";

import { useState } from "react";
import Link from "next/link";

interface LetterCard {
  id: string;
  slug: string;
  recipientName: string;
  message: string;
  category?: string | null;
  songName?: string | null;
  artistName?: string | null;
  albumCover?: string | null;
}

interface Props {
  letters: LetterCard[];
}

const SPEEDS = [38, 52, 44];
const DIRECTIONS = ["left", "right", "left"] as const;
const ROTATIONS = [
  [0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0],
];

export function LetterTicker({ letters }: Props) {
  const lanes = [0, 1, 2].map((i) => {
    const base = letters.filter((_, idx) => idx % 3 === i);
    return [...base, ...base, ...base];
  });

  return (
    <>
      <style>{STYLES}</style>
      <div className="lt-root">
        {lanes.map((lane, li) => (
          <Lane
            key={li}
            cards={lane}
            speed={SPEEDS[li]}
            direction={DIRECTIONS[li]}
            rotations={ROTATIONS[li]}
            laneIndex={li}
          />
        ))}
      </div>
    </>
  );
}

function Lane({
  cards,
  speed,
  direction,
  rotations,
  laneIndex,
}: {
  cards: LetterCard[];
  speed: number;
  direction: "left" | "right";
  rotations: number[];
  laneIndex: number;
}) {
  const [paused, setPaused] = useState(false);

  return (
    <div
      className="lt-lane"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div
        className={`lt-track lt-track--${direction}`}
        style={{
          animationDuration: `${speed}s`,
          animationPlayState: paused ? "paused" : "running",
        }}
      >
        {cards.map((card, ci) => (
          <Card
            key={`${card.id}-${ci}`}
            card={card}
            rotation={rotations[ci % rotations.length]}
            paused={paused}
          />
        ))}
      </div>
    </div>
  );
}

function Card({
  card,
  rotation,
  paused,
}: {
  card: LetterCard;
  rotation: number;
  paused: boolean;
}) {
  const [hovered, setHovered] = useState(false);
  const preview = card.message.slice(0, 100).trim();

  return (
    <Link href={`/letter/${card.slug}`}>
      <div
        className={`lt-card ${hovered ? "lt-card--hovered" : ""} ${paused && !hovered ? "lt-card--lane-paused" : ""}`}
        style={{
          "--rot": `${rotation}deg`,
          "--lift-rot": `${rotation * 0.3}deg`,
        } as React.CSSProperties}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <div className="lt-card-fold" />
        <div className="lt-card-corner" />

       <div className="lt-card-body">
  <div className="lt-card-top-row">
    <span className="lt-card-to-pill">To: {card.recipientName}</span>
    {card.category && (
      <span className="lt-card-tag">{card.category}</span>
    )}
  </div>
          <p className="lt-card-preview">
            {preview}
            {card.message.length > 100 ? "\u2026" : ""}
          </p>
          </div>
        {card.songName && (
          <div className="lt-song-row">
            {card.albumCover ? (
              <img src={card.albumCover} alt={card.songName} className="lt-song-cover" />
            ) : (
              <div className="lt-song-cover lt-song-cover--empty" />
            )}
            <div className="lt-song-info">
              <p className="lt-song-name">{card.songName}</p>
              {card.artistName && (
                <p className="lt-song-artist">{card.artistName}</p>
              )}
            </div>
            <svg className="lt-spotify-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
            </svg>
          </div>
        )}
      </div>
    </Link>
  );
}

const STYLES = `
  .lt-root {
  
    width: 100%;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    gap: 1.6rem;
    padding: 2rem 0;
    mask-image: linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%);
    -webkit-mask-image: linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%);
  }
  .lt-lane { width: 100%; overflow: hidden; }
  .lt-track {
    display: flex;
    gap: 1.4rem;
    width: max-content;
    will-change: transform;
  }
  .lt-track--left {
    animation: ltScrollLeft linear infinite;
  }
  .lt-track--right {
    animation: ltScrollRight linear infinite;
  }
  @keyframes ltScrollLeft {
    0%   { transform: translateX(0); }
    100% { transform: translateX(-33.333%); }
  }
  @keyframes ltScrollRight {
    0%   { transform: translateX(-33.333%); }
    100% { transform: translateX(0); }
  }
  .lt-card {
    position: relative;
    width: 250px;
    min-height: 170px;
    background: linear-gradient(145deg, #fffef9 0%, #faf7ee 60%, #f2eedf 100%);
    border-radius: 2px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    box-shadow: 2px 4px 12px rgba(0,0,0,0.10), 0 1px 3px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.7);
    transform: rotate(var(--rot));
    transition: transform 0.35s cubic-bezier(0.34, 1.4, 0.64, 1), box-shadow 0.35s ease, filter 0.35s ease;
    cursor: pointer;
    flex-shrink: 0;
    animation: ltBreathe 3.5s ease-in-out infinite;
  }
  @keyframes ltBreathe {
    0%, 100% { transform: rotate(var(--rot)) scale(1); }
    50%       { transform: rotate(var(--rot)) scale(1.015); }
  }
  .lt-card--hovered {
    transform: rotate(var(--lift-rot)) translateY(-10px) scale(1.06) !important;
    box-shadow: 6px 20px 40px rgba(0,0,0,0.18), 0 4px 10px rgba(0,0,0,0.10), inset 0 1px 0 rgba(255,255,255,0.8) !important;
    filter: brightness(1.02);
    animation-play-state: paused !important;
    z-index: 10;
  }
  .lt-card--lane-paused { animation-play-state: paused; }
  .lt-card-fold {
    position: absolute;
    top: 32px;
    left: 6%; right: 6%;
    height: 1px;
    background: linear-gradient(to right, transparent, rgba(0,0,0,0.07) 20%, rgba(0,0,0,0.07) 80%, transparent);
    pointer-events: none;
  }
  .lt-card-corner {
    position: absolute;
    top: 0; right: 0;
    width: 0; height: 0;
    border-style: solid;
    border-width: 0 18px 18px 0;
    border-color: transparent rgba(0,0,0,0.06) transparent transparent;
  }
  .lt-card-body {
    flex: 1;
    padding: 18px 20px 14px;
    display: flex;
    flex-direction: column;
  }
    .lt-card-top-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 8px;
  }
  .lt-card-to-pill {
    display: inline-block;
    background: rgba(0,0,0,0.06);
    color: #888;
    font-family: var(--font-body, system-ui);
    font-size: 0.62rem;
    font-weight: 600;
    letter-spacing: 0.02em;
    padding: 3px 9px;
    border-radius: 999px;
    margin-bottom: 8px;
    align-self: flex-start;
  }
  .lt-card-preview {
    font-family: var(--font-hand, cursive);
    font-size: 0.95rem;
    line-height: 1.65;
    color: #2a2a2a;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
    flex: 1;
  }
  .lt-card-tag {
    font-size: 0.6rem;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: #aaa;
    margin-top: 6px;
  }
  .lt-song-row {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 9px 12px;
    background: rgba(0,0,0,0.045);
    border-top: 1px solid rgba(0,0,0,0.07);
  }
  .lt-song-cover {
    width: 32px;
    height: 32px;
    border-radius: 4px;
    object-fit: cover;
    flex-shrink: 0;
    background: #eee;
  }
  .lt-song-cover--empty { background: #e5e2d8; }
  .lt-song-info {
    flex: 1;
    min-width: 0;
  }
  .lt-song-name {
    font-family: var(--font-body, system-ui);
    font-size: 0.72rem;
    font-weight: 600;
    color: #333;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    line-height: 1.3;
  }
  .lt-song-artist {
    font-family: var(--font-body, system-ui);
    font-size: 0.63rem;
    color: #888;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    line-height: 1.3;
    margin-top: 1px;
  }
  .lt-spotify-icon {
    width: 16px;
    height: 16px;
    color: #1DB954;
    flex-shrink: 0;
  }
`;
