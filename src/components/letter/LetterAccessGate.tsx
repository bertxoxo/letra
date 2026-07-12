"use client";

import { useState } from "react";

export function LetterAccessGate({ slug }: { slug: string }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("/api/auth/magic-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, redirectPath: `/letter/${slug}` }),
      });
      if (!res.ok) throw new Error();
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  };

  if (status === "sent") {
    return (
      <p className="text-sm text-muted">
        Check your email — we sent you a link back to this letter.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <p className="text-sm text-muted">
        If this letter is yours (sent or received), enter your email to unlock replies.
      </p>
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@email.com"
        className="w-full rounded-md border border-hairline px-3 py-2 text-sm"
        disabled={status === "sending"}
      />
      <button
        type="submit"
        disabled={status === "sending"}
        className="rounded-md bg-ink px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
      >
        {status === "sending" ? "Sending..." : "Send me a link"}
      </button>
      {status === "error" && (
        <p className="text-[13px] text-red-600">Something went wrong. Try again.</p>
      )}
    </form>
  );
}