"use client";

import { useRef, useState } from "react";
import Link from "next/link";

interface LetterCard {
  id: string;
  slug: string;
  recipientName: string;
  message: string;
  category?: string | null;
}

interface Props {
  letters: LetterCard[];
}

const SPEEDS = [38, 52, 44];
const DIRECTIONS = ["left", "right", "left"] as const;
const ROTATIONS = [
  [-2.5, 1.8, -1.2, 2.1, -0.8, 1.5],
  [1.2, -2.0, 0.9, -1.7, 2.3, -0.6],
  [-1.0, 2.2, -1.8, 0.7, -2.4, 1.3],
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
  const preview = card.message.slice(0, 120).trim();

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
        <p className="lt-card-to">To {card.recipientName},</p>
        <p className="lt-card-preview">
          {preview}
          {card.message.length > 120 ? "\u2026" : ""}
        </p>
        {card.category && (
          <span className="lt-card-tag">{card.category}</span>
        )}
        <div className="lt-card-corner" />
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
    width: 240px;
    min-height: 160px;
    background: linear-gradient(145deg, #fffef9 0%, #faf7ee 60%, #f2eedf 100%);
    border-radius: 2px;
    padding: 20px 22px 28px;
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
    top: 36px;
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
  .lt-card-to {
    font-family: var(--font-hand, cursive);
    font-size: 0.78rem;
    color: #888;
    margin-bottom: 8px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .lt-card-preview {
    font-family: var(--font-hand, cursive);
    font-size: 0.95rem;
    line-height: 1.7;
    color: #2a2a2a;
    display: -webkit-box;
    -webkit-line-clamp: 4;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  .lt-card-tag {
    position: absolute;
    bottom: 10px; left: 22px;
    font-size: 0.62rem;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: #aaa;
  }
`;