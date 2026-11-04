"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useCart } from "@/lib/cart";

const NAV = [
  { href: "/collections/t-shirts-1", label: "Tees" },
  { href: "/collections/hoodies", label: "Hoodies" },
  { href: "/collections/womens-collection", label: "Women" },
  { href: "/collections/best-sellers", label: "Best Sellers" },
  { href: "/collections", label: "Collections" },
  { href: "/pages/black-friday", label: "Black Friday" },
];

export default function Header() {
  const { count, setOpen } = useCart();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-all duration-500 ${
        scrolled
          ? "bg-ink/90 backdrop-blur-md border-b border-seam"
          : "bg-gradient-to-b from-ink/80 to-transparent"
      }`}
    >
      <div className="bg-brass text-ink text-center text-[11px] font-semibold tracking-[0.22em] uppercase py-2 px-4">
        Black Friday — November 27–30 · Free shipping on orders $75+
      </div>
      <div className="mx-auto flex max-w-[1440px] items-center justify-between px-5 md:px-10 h-16">
        <nav className="hidden lg:flex items-center gap-7 flex-1">
          {NAV.slice(0, 3).map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className="text-[12px] tracking-[0.18em] uppercase text-bone/80 hover:text-bone transition-colors"
            >
              {n.label}
            </Link>
          ))}
        </nav>
        <Link
          href="/"
          className="font-display text-[22px] md:text-2xl tracking-[0.14em] uppercase text-bone text-center leading-none"
        >
          Anchor Me Down
        </Link>
        <div className="flex items-center justify-end gap-7 flex-1">
          <nav className="hidden lg:flex items-center gap-7">
            {NAV.slice(3).map((n) => (
              <Link
                key={n.href}
                href={n.href}
                className="text-[12px] tracking-[0.18em] uppercase text-bone/80 hover:text-bone transition-colors"
              >
                {n.label}
              </Link>
            ))}
          </nav>
          <button
            onClick={() => setOpen(true)}
            className="text-[12px] tracking-[0.18em] uppercase text-bone hover:text-brass transition-colors"
            aria-label="Open bag"
          >
            Bag{count > 0 ? ` (${count})` : ""}
          </button>
        </div>
      </div>
    </header>
  );
}
