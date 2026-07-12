"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const links = [
  { href: "/create", label: "Submit" },
  { href: "/discover", label: "Browse" },
  { href: "/dashboard", label: "History" },
  { href: "/support", label: "Support" },
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40">
      {/* Thin brand-blue accent bar across the very top, like the reference */}
      <div className="h-1.5 bg-blue-600" />
      <nav className="border-b border-hairline bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-3.5">
          <Link href="/" className="font-hand text-2xl text-ink">
            letra
          </Link>

          <ul className="flex items-center gap-6">
            {links.map((link) => {
              const active = pathname?.startsWith(link.href);
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={cn(
                      "text-[15px] transition-colors",
                      active
                        ? "font-semibold text-ink underline underline-offset-4"
                        : "text-slate-muted hover:text-ink"
                    )}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </nav>
    </header>
  );
}
