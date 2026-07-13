import type { Metadata } from "next";
import { Caveat, Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/navbar/Navbar";
import { Footer } from "@/components/footer/Footer";

// Handwritten display face ï¿½fÂ¢Ã¢ï¿½?sÂ¬Ã¢ï¿½,ï¿½Â used for the hero headline and letter message text.
// Free, self-hosted via next/font (no external requests at runtime).
const caveat = Caveat({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-hand",
  display: "swap",
});

// Clean UI face ï¿½fÂ¢Ã¢ï¿½?sÂ¬Ã¢ï¿½,ï¿½Â nav, buttons, labels, meta text.
const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: "letra — every letter tells a story",
  description:
    "Write meaningful digital letters, attach a Spotify song, and share unforgettable moments.",
  icons: {
    icon: "/Letra.png",
  },
  };

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${caveat.variable} ${inter.variable}`}>
      <body className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
