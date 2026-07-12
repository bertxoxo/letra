import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-hairline bg-white">
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-3 px-6 py-6 text-[13px] text-slate-muted sm:flex-row">
        <p>© {new Date().getFullYear()} letra. Made for free, kept free.</p>
        <div className="flex gap-5">
          <Link href="/support" className="hover:text-ink transition-colors">
            Support
          </Link>
          <Link href="/discover" className="hover:text-ink transition-colors">
            Browse
          </Link>
          <a
            href="mailto:hello@letra.app"
            className="hover:text-ink transition-colors"
          >
            Contact
          </a>
        </div>
      </div>
    </footer>
  );
}
