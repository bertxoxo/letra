"use client";

import { useState } from "react";

type FeedbackType = "BUG" | "SUGGESTION" | "OTHER";

export function FeedbackButton() {
  const [open, setOpen] = useState(false);
  const [type, setType] = useState<FeedbackType>("SUGGESTION");
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!message.trim()) return;

    setStatus("submitting");
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type,
          message,
          email: email || undefined,
          pageUrl: typeof window !== "undefined" ? window.location.pathname : undefined,
        }),
      });

      if (!res.ok) throw new Error("Failed to submit");

      setStatus("success");
      setMessage("");
      setEmail("");
      setTimeout(() => {
        setOpen(false);
        setStatus("idle");
      }, 1500);
    } catch (err) {
      setStatus("error");
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="hover:text-ink transition-colors"
      >
        Feedback
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-lg">
            {status === "success" ? (
              <p className="text-center text-sm text-slate-700">Thanks for the feedback!</p>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-semibold text-ink">Send feedback</h2>
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="text-slate-muted hover:text-ink"
                  >
                    X
                  </button>
                </div>

                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as FeedbackType)}
                  className="rounded-md border border-hairline px-3 py-2 text-sm"
                >
                  <option value="BUG">Bug</option>
                  <option value="SUGGESTION">Suggestion</option>
                  <option value="OTHER">Something else</option>
                </select>

                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="What's on your mind?"
                  rows={4}
                  required
                  className="rounded-md border border-hairline px-3 py-2 text-sm"
                />

                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email (optional, if you want a reply)"
                  className="rounded-md border border-hairline px-3 py-2 text-sm"
                />

                {status === "error" && (
                  <p className="text-sm text-red-500">Something went wrong. Please try again.</p>
                )}

                <button
                  type="submit"
                  disabled={status === "submitting"}
                  className="rounded-md bg-ink px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-ink/90 disabled:opacity-50"
                >
                  {status === "submitting" ? "Sending..." : "Send feedback"}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}