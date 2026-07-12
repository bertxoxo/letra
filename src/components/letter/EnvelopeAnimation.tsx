"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface EnvelopeAnimationProps {
  /** Called once the open animation finishes, so the caller can reveal the full letter. */
  onOpened?: () => void;
  /** Skip straight to opened state (e.g. user already saw this letter before). */
  autoOpen?: boolean;
}

export function EnvelopeAnimation({ onOpened, autoOpen = false }: EnvelopeAnimationProps) {
  const [opened, setOpened] = useState(autoOpen);

  const handleOpen = () => {
    if (opened) return;
    setOpened(true);
    // Match the total flap + letter-slide duration below before telling the
    // parent to swap in the real content.
    setTimeout(() => onOpened?.(), 700);
  };

  return (
    <div className="flex flex-col items-center justify-center py-16">
      <button
        type="button"
        onClick={handleOpen}
        aria-label="Open letter"
        className="relative h-40 w-56 focus:outline-none"
        style={{ perspective: 800 }}
      >
        {/* Envelope body */}
        <div className="absolute inset-0 rounded-md border border-hairline bg-white shadow-sm" />

        {/* Letter sliding up out of the envelope once opened */}
        <AnimatePresence>
          {opened && (
            <motion.div
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: -46, opacity: 1 }}
              transition={{ delay: 0.35, duration: 0.45, ease: "easeOut" }}
              className="absolute left-1/2 top-2 h-32 w-44 -translate-x-1/2 rounded-sm border border-hairline bg-white shadow-md"
            >
              <div className="space-y-1.5 p-3">
                <div className="h-1.5 w-3/4 rounded bg-gray-200" />
                <div className="h-1.5 w-full rounded bg-gray-200" />
                <div className="h-1.5 w-2/3 rounded bg-gray-200" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Envelope flap — rotates open like a lid */}
        <motion.div
          animate={{ rotateX: opened ? 180 : 0 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          style={{ transformOrigin: "top center", transformStyle: "preserve-3d" }}
          className="absolute left-0 top-0 z-10 h-20 w-full origin-top"
        >
          <div
            className="h-full w-full bg-white"
            style={{
              clipPath: "polygon(0 0, 100% 0, 50% 100%)",
              border: "1px solid var(--color-hairline, #E7E4DC)",
              borderBottom: "none",
            }}
          />
        </motion.div>
      </button>

      {!opened && (
        <p className="mt-4 font-handwritten text-lg text-slate-muted">
          tap to open
        </p>
      )}
    </div>
  );
}
