"use client";

import { motion } from "framer-motion";
import { LetterCard } from "@/components/cards/LetterCard";
import type { Letter } from "@/types";

interface LetterGridProps {
  letters: Letter[];
  /** "grid" for a responsive wrap grid, "row" for the horizontal scrolling row from the reference. */
  layout?: "grid" | "row";
}

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.08 },
  },
};

// Each card "falls" into place — starts above and slightly rotated, settles
// flat. This is the product's own metaphor (a letter arriving) rather than a
// generic fade, but kept subtle so it still reads as clean/professional.
const item = {
  hidden: { opacity: 0, y: -28, rotate: -3 },
  show: {
    opacity: 1,
    y: 0,
    rotate: 0,
    transition: { type: "spring", stiffness: 260, damping: 22 },
  },
};

export function LetterGrid({ letters, layout = "grid" }: LetterGridProps) {
  if (letters.length === 0) {
    return (
      <p className="py-10 text-center text-[14px] text-slate-muted">
        No messages here yet.
      </p>
    );
  }

  return (
    <motion.div
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.15 }}
      className={
        layout === "row"
          ? "flex gap-4 overflow-x-auto pb-3 [scrollbar-width:thin]"
          : "grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
      }
    >
      {letters.map((letter) => (
        <motion.div
          key={letter.id}
          variants={item}
          className={layout === "row" ? "w-72 flex-shrink-0" : ""}
        >
          <LetterCard letter={letter} />
        </motion.div>
      ))}
    </motion.div>
  );
}
