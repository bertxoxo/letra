"use client";

import { motion } from "framer-motion";

interface LetterRevealProps {
  message: string;
  /** Delay before the first line starts, e.g. to wait for EnvelopeAnimation to finish. */
  startDelay?: number;
  className?: string;
}

const container = {
  hidden: {},
  show: (startDelay: number) => ({
    transition: { delayChildren: startDelay, staggerChildren: 0.22 },
  }),
};

const line = {
  hidden: { opacity: 0, y: 14 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: "easeOut" },
  },
};

export function LetterReveal({ message, startDelay = 0, className }: LetterRevealProps) {
  // Split on real newlines first; if the message is one big paragraph,
  // fall back to sentence-ish breaks so it still reveals in readable chunks.
  const rawLines = message.includes("\n")
    ? message.split("\n")
    : message.match(/[^.!?]+[.!?]*/g) ?? [message];

  const lines = rawLines.map((l) => l.trim()).filter(Boolean);

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      custom={startDelay}
      className={className}
    >
      {lines.map((text, i) => (
        <motion.p
          key={i}
          variants={line}
          className="font-handwritten text-[22px] leading-relaxed text-ink"
        >
          {text}
        </motion.p>
      ))}
    </motion.div>
  );
}
