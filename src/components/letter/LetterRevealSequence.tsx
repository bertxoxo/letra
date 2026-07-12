"use client";

import { useState } from "react";
import { EnvelopeAnimation } from "@/components/letter/EnvelopeAnimation";
import { LetterReveal } from "@/components/letter/LetterReveal";

export function LetterRevealSequence({ message }: { message: string }) {
  const [opened, setOpened] = useState(false);

  return (
    <div className="mt-10 w-full">
      <EnvelopeAnimation onOpened={() => setOpened(true)} />
      {opened && <LetterReveal message={message} startDelay={0.1} />}
    </div>
  );
}