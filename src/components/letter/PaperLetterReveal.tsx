"use client";

import { useState } from "react";

interface Props {
  message: string;
  recipientName: string;
  senderName?: string | null;
}

type Phase = "folded" | "unfolding" | "open";

const CHAR_MS = 20;
const PAUSE_MS = CHAR_MS * 8;

export function PaperLetterReveal({ message, recipientName, senderName }: Props) {
  const [phase, setPhase] = useState<Phase>("folded");

  const handleClick = () => {
    if (phase !== "folded") return;
    setPhase("unfolding");
    setTimeout(() => setPhase("open"), 950);
  };

  return (
    <>
      <style>{STYLES}</style>
      <div className="plr-outer">
        <div className={`plr-paper plr-paper--${phase}`} onClick={handleClick}>
          {phase !== "open" && (
            <>
              <div className="plr-fold plr-fold--t" />
              <div className="plr-fold plr-fold--m" />
              <div className="plr-fold plr-fold--b" />
              {phase === "folded" && (
                <span className="plr-hint">tap to open</span>
              )}
            </>
          )}
          {phase === "open" && (
            <Letter
              recipientName={recipientName}
              message={message}
              senderName={senderName}
            />
          )}
        </div>
      </div>
    </>
  );
}

function Letter({
  recipientName,
  message,
  senderName,
}: {
  recipientName: string;
  message: string;
  senderName?: string | null;
}) {
  let d = 0;

  const renderChars = (text: string, cls: string, si: number) => {
    const chars = text.split("").map((ch: string, ci: number) => {
      const delay = d;
      d += CHAR_MS;
      return (
        <span key={ci} className="plr-char" style={{ animationDelay: `${delay}ms` }}>
          {ch === " " ? "\u00a0" : ch}
        </span>
      );
    });
    return (
      <div key={si} className={`plr-line ${cls}`}>
        {chars}
      </div>
    );
  };

  // Build greeting: "To [name],"
  const greeting = renderChars(`To ${recipientName},`, "plr-to", 0);
  d += PAUSE_MS;

  // Build body paragraphs
  const paragraphs = message.split("\n").map((line, i) => {
    const el = renderChars(line || " ", "plr-body", i + 10);
    d += CHAR_MS * 2; // small gap between lines
    return el;
  });

  // Build from section (delay starts after body)
  d += PAUSE_MS;
  const fromLabel = senderName ? renderChars("From,", "plr-from", 90) : null;
  d += CHAR_MS * 2;
  const fromName = senderName ? renderChars(senderName, "plr-from-name", 91) : null;

  return (
    <div className="plr-letter">
      {greeting}
      <div className="plr-spacer-lg" />
      <div className="plr-body-block">
        {paragraphs}
      </div>
      {senderName && (
        <div className="plr-from-block">
          {fromLabel}
          {fromName}
        </div>
      )}
    </div>
  );
}

const STYLES = `
  .plr-outer { margin-top: 2.5rem; width: 100%; display: flex; justify-content: center; }

  .plr-paper {
    position: relative;
    width: min(540px, 92vw);
    background: linear-gradient(158deg, #fffef9 0%, #faf8f0 55%, #f3f0e4 100%);
    border-radius: 1px;
    padding: 52px 56px;
    transform-origin: center center;
    will-change: transform, filter;
  }

  .plr-paper--folded {
    transform: scaleY(0.14) scaleX(0.55) rotate(-2deg);
    filter: brightness(0.82) contrast(1.04);
    box-shadow: 5px 5px 18px rgba(0,0,0,0.28);
    cursor: pointer;
    transition: transform 0.18s ease, filter 0.18s ease;
  }
  .plr-paper--folded:hover {
    transform: scaleY(0.18) scaleX(0.58) rotate(-0.8deg);
    filter: brightness(0.9);
  }
  .plr-paper--unfolding {
    animation: plrUnfold 0.95s cubic-bezier(0.34, 1.18, 0.64, 1) forwards;
    pointer-events: none;
  }
  @keyframes plrUnfold {
    0%   { transform: scaleY(0.14) scaleX(0.55) rotate(-2deg);   filter: brightness(0.82); }
    25%  { transform: scaleY(0.42) scaleX(0.78) rotate(-1deg);   filter: brightness(0.9);  }
    55%  { transform: scaleY(0.82) scaleX(0.96) rotate(-0.2deg); filter: brightness(0.97); }
    80%  { transform: scaleY(1.04) scaleX(1.01) rotate(0.3deg);  filter: brightness(1.01); }
    100% { transform: scaleY(1) scaleX(1) rotate(0deg); filter: brightness(1); box-shadow: 0 10px 48px rgba(0,0,0,0.07); }
  }
  .plr-paper--open {
    box-shadow: 0 10px 48px rgba(0,0,0,0.07), 0 2px 8px rgba(0,0,0,0.04);
  }

  .plr-fold { position: absolute; left: 4%; right: 4%; height: 1px; background: linear-gradient(to right, transparent, rgba(0,0,0,0.1) 12%, rgba(0,0,0,0.1) 88%, transparent); pointer-events: none; }
  .plr-fold--t { top: 28%; }
  .plr-fold--m { top: 50%; }
  .plr-fold--b { top: 72%; }

  .plr-hint { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; font-size: 0.62rem; letter-spacing: 0.18em; text-transform: uppercase; color: rgba(0,0,0,0.2); pointer-events: none; }

  /* Letter layout */
  .plr-letter {
    font-family: var(--font-hand, cursive);
    font-size: 1.1rem;
    line-height: 1.9;
    color: #1a1a1a;
    display: flex;
    flex-direction: column;
  }

  .plr-line { min-height: 1.9em; }

  .plr-spacer-lg { height: 1.2em; }

  /* Greeting: left aligned */
  .plr-to {
    font-size: 1.12rem;
    color: #222;
    text-align: left;
  }

  /* Body: only the very first line of the letter gets the classic indent */
  .plr-body-block {
    padding-left: 0;
  }
  .plr-body {
    font-size: 1.18rem;
    text-align: left;
    word-wrap: break-word;
    overflow-wrap: break-word;
    word-break: break-word;
  }
  .plr-body:first-child {
    text-indent: 2em;
  }

  /* From: pushed to the bottom right */
  .plr-from-block {
    margin-top: 1.6em;
    text-align: right;
    align-self: flex-end;
  }
  .plr-from {
    font-size: 1rem;
    color: #2a2a2a;
  }
  .plr-from-name {
    font-size: 1.08rem;
    font-style: italic;
  }

  /* Char animation */
  .plr-char { display: inline; opacity: 0; animation: plrChar 0.04s ease-out forwards; }
  @keyframes plrChar {
    from { opacity: 0; transform: translateY(2px); }
    to   { opacity: 1; transform: translateY(0); }
  }
`;