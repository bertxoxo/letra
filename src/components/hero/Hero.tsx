import Link from "next/link";
import { Button } from "@/components/ui/Button";

const features = [
  {
    title: "Write it in words",
    body: "Say what you mean, no character limit, no pressure to sound clever.",
  },
  {
    title: "Attach a song",
    body: "Pair your message with the track that says the rest of it for you.",
  },
  {
    title: "Send it anywhere",
    body: "Share a link, or let them find it Ã¢â‚¬â€ every message gets its own page.",
  },
];

export function Hero() {
  return (
    <section className="mx-auto max-w-5xl px-6 pb-16 pt-14 text-center">
      <h1 className="font-handwritten text-5xl leading-tight text-ink sm:text-6xl">
        Express it with a song
      </h1>
      <p className="mx-auto mt-4 max-w-lg text-[16px] text-slate-muted">
        Write a message, attach the song that fits, and send it to someone who
        needs to hear it.
      </p>

      <div className="mt-7 flex items-center justify-center gap-3">
        <Link href="/create">
          <Button variant="solid">Write a message</Button>
        </Link>
        <Link href="/discover">
          <Button variant="outline">Browse messages</Button>
        </Link>
      </div>

      <div className="mt-14 grid gap-4 sm:grid-cols-3">
        {features.map((f) => (
          <div
            key={f.title}
            className="rounded-lg border border-hairline bg-white p-5 text-left"
          >
            <p className="text-[15px] font-semibold text-ink">{f.title}</p>
            <p className="mt-1.5 text-[14px] leading-relaxed text-slate-muted">
              {f.body}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
