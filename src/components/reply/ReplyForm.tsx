"use client";

import { useState } from "react";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";

interface ReplyFormProps {
  letterId: string;
  remaining?: number;
  onReplied?: () => void;
}

export function ReplyForm({ letterId, remaining, onReplied }: ReplyFormProps) {
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/replies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ letterId, message: message.trim() }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error ?? "Failed to post reply.");
      }

      setMessage("");
      setSent(true);
      onReplied?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <Alert title="Replies can't be edited or deleted">
        Once posted, a reply is permanent. Take a moment before sending.
        {typeof remaining === "number" && (
          <> You have {remaining} repl{remaining === 1 ? "y" : "ies"} left on this letter.</>
        )}
      </Alert>

      <Textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Write a reply..."
        rows={4}
        disabled={submitting}
      />

      {error && <p className="text-[13px] text-red-600">{error}</p>}
      {sent && <p className="text-[13px] text-green-700">Reply sent.</p>}

      <Button type="submit" variant="solid" disabled={submitting || !message.trim()}>
        {submitting ? "Sending..." : "Send reply"}
      </Button>
    </form>
  );
}