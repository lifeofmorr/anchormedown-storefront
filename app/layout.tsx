import type { Metadata } from "next";
import { Anton, Instrument_Serif, Inter } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";

const display = Anton({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-display",
});
const body = Inter({
  subsets: ["latin"],
  variable: "--font-body",
});
/** Editorial serif italic — the accent voice against the Anton display type. */
const accent = Instrument_Serif({
  weight: "400",
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-accent",
});

export const metadata: Metadata = {
  title: "Anchor Me Down Apparel — The Heaviest Tee in the Game.",
  description:
    "The heaviest tee in the game. Built between the iron and the water. Stay Anchored.",
};

/**
 * Root layout — document shell only: fonts, global CSS, providers.
 * The storefront chrome lives in (storefront)/layout.tsx and the
 * operator chrome in admin/layout.tsx, so /admin never inherits the
 * shop's header, footer, or cart.
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${body.variable} ${accent.variable}`}
    >
      <body className="bg-ink font-body text-bone antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
