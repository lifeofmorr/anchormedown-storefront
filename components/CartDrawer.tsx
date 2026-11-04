"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/lib/cart";
import { money } from "@/lib/format";

const STANDARD_THRESHOLD = 200;
const BF_THRESHOLD = 75;

export default function CartDrawer() {
  const { lines, subtotal, isOpen, setOpen, setQuantity, remove, checkoutUrl } =
    useCart();

  if (!isOpen) return null;

  const pct = Math.min(100, (subtotal / STANDARD_THRESHOLD) * 100);
  const remaining = STANDARD_THRESHOLD - subtotal;

  return (
    <div className="fixed inset-0 z-50">
      <div
        className="absolute inset-0 bg-ink/70 backdrop-blur-sm"
        onClick={() => setOpen(false)}
      />
      <aside className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-coal border-l border-seam drawer-in">
        <div className="flex items-center justify-between border-b border-seam px-6 py-5">
          <h2 className="font-display text-xl uppercase tracking-wider text-bone">
            Your Bag
          </h2>
          <button
            onClick={() => setOpen(false)}
            className="text-ash hover:text-bone text-sm tracking-[0.2em] uppercase"
          >
            Close
          </button>
        </div>

        <div className="border-b border-seam px-6 py-4">
          <p className="text-xs text-ash leading-5">
            {remaining > 0 ? (
              <>
                You are{" "}
                <span className="text-bone font-semibold">
                  {money(remaining)}
                </span>{" "}
                from free shipping at $200+. Nov 27–30: free shipping starts at
                $75.
              </>
            ) : (
              "Free shipping unlocked — your order ships free."
            )}
          </p>
          <div className="mt-3 h-1 bg-seam">
            <div
              className="h-full bg-brass transition-all duration-500"
              style={{ width: `${pct}%` }}
            />
          </div>
          <p className="mt-2 text-[10px] tracking-[0.18em] uppercase text-ash">
            BF weekend threshold: {money(BF_THRESHOLD)}
          </p>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5">
          {lines.length === 0 ? (
            <div className="pt-10 text-center">
              <p className="text-ash text-sm">Your bag is empty.</p>
              <Link
                href="/collections/best-sellers"
                onClick={() => setOpen(false)}
                className="mt-5 inline-block border border-bone/30 px-6 py-3 text-[12px] tracking-[0.2em] uppercase text-bone hover:border-brass hover:text-brass transition-colors"
              >
                Shop best sellers
              </Link>
            </div>
          ) : (
            <ul className="space-y-5">
              {lines.map((l) => (
                <li key={l.variantId} className="flex gap-4">
                  <div className="relative h-24 w-20 shrink-0 overflow-hidden bg-ink">
                    {l.image && (
                      <Image
                        src={l.image}
                        alt={l.title}
                        fill
                        sizes="80px"
                        className="object-cover"
                      />
                    )}
                  </div>
                  <div className="flex flex-1 flex-col">
                    <div className="flex justify-between gap-2">
                      <Link
                        href={`/products/${l.handle}`}
                        onClick={() => setOpen(false)}
                        className="font-display uppercase tracking-wide text-bone leading-tight"
                      >
                        {l.title}
                      </Link>
                      <span className="text-sm text-bone/90">
                        {money(l.price * l.quantity)}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-ash">{l.variantTitle}</p>
                    <div className="mt-auto flex items-center justify-between pt-2">
                      <div className="flex items-center border border-seam">
                        <button
                          className="px-3 py-1.5 text-bone"
                          onClick={() => setQuantity(l.variantId, l.quantity - 1)}
                          aria-label="Decrease quantity"
                        >
                          −
                        </button>
                        <span className="w-8 text-center text-sm text-bone">
                          {l.quantity}
                        </span>
                        <button
                          className="px-3 py-1.5 text-bone"
                          onClick={() => setQuantity(l.variantId, l.quantity + 1)}
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>
                      <button
                        onClick={() => remove(l.variantId)}
                        className="text-[11px] tracking-[0.18em] uppercase text-ash hover:text-bone"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {lines.length > 0 && (
          <div className="border-t border-seam px-6 py-5">
            <div className="flex justify-between text-sm text-bone">
              <span className="tracking-[0.18em] uppercase text-ash">Subtotal</span>
              <span className="font-semibold">{money(subtotal)}</span>
            </div>
            <p className="mt-2 text-[11px] leading-4 text-ash">
              Shipping and taxes calculated at checkout. Checkout runs on
              Shopify — the same bag, the same order.
            </p>
            <a
              href={checkoutUrl}
              className="mt-4 block bg-bone py-4 text-center font-display text-lg uppercase tracking-[0.14em] text-ink transition-colors hover:bg-brass"
            >
              Checkout
            </a>
            <Link
              href="/cart"
              onClick={() => setOpen(false)}
              className="mt-3 block text-center text-[11px] tracking-[0.2em] uppercase text-ash hover:text-bone"
            >
              View bag
            </Link>
          </div>
        )}
      </aside>
    </div>
  );
}
