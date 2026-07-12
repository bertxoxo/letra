"use client";

import { motion, HTMLMotionProps } from "framer-motion";
import { ReactNode } from "react";

/**
 * Shared "falling note" variants. Anything animated with this metaphor
 * (grids, single cards, envelope reveals) should import these instead of
 * redefining its own spring numbers, so the motion feels consistent
 * everywhere in the app.
 */
export const fallingCardVariants = {
  hidden: { opacity: 0, y: -32, rotate: -4, scale: 0.98 },
  show: {
    opacity: 1,
    y: 0,
    rotate: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 260, damping: 22 },
  },
};

export const fallingContainerVariants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.08 },
  },
};

interface FallingCardProps extends Omit<HTMLMotionProps<"div">, "variants"> {
  children: ReactNode;
  /** Delay this specific card's fall, e.g. for a manual (non-staggered) sequence. */
  delay?: number;
}

export function FallingCard({ children, delay = 0, ...props }: FallingCardProps) {
  return (
    <motion.div
      variants={fallingCardVariants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
      transition={{ type: "spring", stiffness: 260, damping: 22, delay }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

/** Wraps a list of children and staggers each FallingCard's entrance. */
export function FallingCardGroup({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      variants={fallingContainerVariants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.15 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
