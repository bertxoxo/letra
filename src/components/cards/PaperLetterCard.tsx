"use client";

import { useState } from "react";
import Link from "next/link";
import type { LetterSummary } from "@/types";

interface PaperLetterCardProps {
  letter: Pick<LetterSummary, "slug" | "recipientName" | "message" | "category">;
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
          <div className="plc-card-fold" />
          <p className="plc-card-to">To {letter.recipientName},</p>
          <p className="plc-card-preview">{letter.message}</p>
          {letter.category && <span className="plc-card-tag">{letter.category}</span>}
          <div className="plc-card-corner" />
        </div>
      </Link>
    </>
  );
}

const STYLES = `
  .plc-card {
    position: relative;
    width: 100%;
    min-height: 180px;
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
  .plc-card-fold {
    position: absolute;
    top: 36px;
    left: 6%; right: 6%;
    height: 1px;
    background: linear-gradient(to right, transparent, rgba(0,0,0,0.07) 20%, rgba(0,0,0,0.07) 80%, transparent);
    pointer-events: none;
  }
  .plc-card-corner {
    position: absolute;
    top: 0; right: 0;
    width: 0; height: 0;
    border-style: solid;
    border-width: 0 18px 18px 0;
    border-color: transparent rgba(0,0,0,0.06) transparent transparent;
  }
  .plc-card-to {
    font-family: var(--font-hand, cursive);
    font-size: 0.8rem;
    color: #888;
    margin-bottom: 8px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .plc-card-preview {
    font-family: var(--font-hand, cursive);
    font-size: 1.05rem;
    line-height: 1.7;
    color: #2a2a2a;
    display: -webkit-box;
    -webkit-line-clamp: 5;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  .plc-card-tag {
    position: absolute;
    bottom: 10px; left: 22px;
    font-size: 0.62rem;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: #aaa;
  }
`;