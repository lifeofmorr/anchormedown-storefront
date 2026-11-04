"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/lib/cart";
import { money } from "@/lib/format";
import { SHIPPING_LINE } from "@/lib/catalog";

const STANDARD_THRESHOLD = 200;
const BF_THRESHOLD = 75;

export default function CartPage() {
  const { lines, count, subtotal, setQuantity, remove, clear, checkoutUrl } =
    useCart();
  const shipping = subtotal >= 200 || subtotal === 0 ? 0 : null;
  const pct = Math.min(100, (subtotal / STANDARD_THRESHOLD) * 100);
  const remaining = STANDARD_THRESHOLD - subtotal;

  return (
    <div className="mx-auto max-w-[1240px] px-5 pb-24 pt-36 md:px-10 md:pt-44">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <h1 className="font-display text-7xl uppercase leading-[0.88] text-bone md:text-9xl">
          Your bag
        </h1>
        <p className="pb-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-ash">
          {count === 0 ? "Nothing in it — yet" : `${count} item${count === 1 ? "" : "s"} · ${money(subtotal)}`}
        </p>
      </div>

      {lines.length === 0 ? (
        <div className="relative mt-14 overflow-hidden border border-seam bg-coal px-8 py-20 text-center">
          <span
            aria-hidden="true"
            className="text-stroke-faint pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 select-none font-display text-[16rem] leading-none"
          >
            0
          </span>
          <div className="relative">
            <p className="font-display text-3xl uppercase text-bone">
              Your bag is empty.
            </p>
            <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-ash">
              The heaviest tee in the game is one click from being in it.
            </p>
            <Link
              href="/collections/best-sellers"
              className="mt-8 inline-block bg-bone px-9 py-4 font-display text-base uppercase tracking-[0.12em] text-ink transition-colors hover:bg-brass"
            >
              Shop best sellers
            </Link>
          </div>
        </div>
      ) : (
        <>
          {/* Free-shipping meter — the same thresholds as the drawer */}
          <div className="mt-12 border border-seam bg-coal px-6 py-5">
            <p className="text-sm text-ash">
              {remaining > 0 ? (
                <>
                  You are{" "}
                  <span className="font-semibold text-bone">
                    {money(remaining)}
                  </span>{" "}
                  from free shipping at $200+. Nov 27–30: free shipping starts
                  at $75.
                </>
              ) : (
                "Free shipping unlocked — your order ships free."
              )}
            </p>
            <div className="relative mt-4 h-1 bg-seam">
              <div
                className="h-full bg-brass transition-all duration-500"
                style={{ width: `${pct}%` }}
              />
              <span
                className="absolute top-1/2 h-3 w-px bg-bone/50"
                style={{ left: `${(BF_THRESHOLD / STANDARD_THRESHOLD) * 100}%` }}
                aria-hidden="true"
              />
            </div>
            <div className="mt-2 flex justify-between text-[10px] uppercase tracking-[0.18em] text-ash">
              <span>BF weekend threshold: {money(BF_THRESHOLD)}</span>
              <span>Free shipping: {money(STANDARD_THRESHOLD)}+</span>
            </div>
          </div>

          <ul className="mt-10 divide-y divide-seam border-y border-seam">
            {lines.map((l) => (
              <li key={l.variantId} className="flex gap-6 py-7">
                <div className="relative h-40 w-32 shrink-0 overflow-hidden bg-coal">
                  {l.image && (
                    <Image src={l.image} alt={l.title} fill sizes="128px" className="object-cover" />
                  )}
                </div>
                <div className="flex flex-1 flex-col">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <Link
                        href={`/products/${l.handle}`}
                        className="font-display text-2xl uppercase leading-tight tracking-wide text-bone transition-colors hover:text-brass md:text-3xl"
                      >
                        {l.title}
                      </Link>
                      <p className="mt-1.5 text-sm text-ash">{l.variantTitle}</p>
                      <p className="mt-1 text-sm text-ash">{money(l.price)} each</p>
                    </div>
                    <p className="font-display text-2xl text-bone">{money(l.price * l.quantity)}</p>
                  </div>
                  <div className="mt-auto flex items-center justify-between pt-4">
                    <div className="flex items-center border border-seam">
                      <button className="px-4 py-2 text-bone" onClick={() => setQuantity(l.variantId, l.quantity - 1)} aria-label="Decrease quantity">−</button>
                      <span className="w-10 text-center text-bone">{l.quantity}</span>
                      <button className="px-4 py-2 text-bone" onClick={() => setQuantity(l.variantId, l.quantity + 1)} aria-label="Increase quantity">+</button>
                    </div>
                    <button onClick={() => remove(l.variantId)} className="text-[11px] uppercase tracking-[0.2em] text-ash hover:text-bone">
                      Remove
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-12 grid gap-10 md:grid-cols-[1fr_380px]">
            <div>
              <p className="max-w-md text-sm leading-6 text-ash">{SHIPPING_LINE}</p>
              <button onClick={clear} className="mt-6 text-[11px] uppercase tracking-[0.2em] text-ash hover:text-bone">
                Clear bag
              </button>
            </div>
            <div className="h-fit border border-seam bg-coal p-7 md:sticky md:top-36">
              <div className="flex justify-between text-sm text-bone">
                <span className="uppercase tracking-[0.18em] text-ash">Subtotal</span>
                <span className="font-semibold">{money(subtotal)}</span>
              </div>
              <div className="mt-3 flex justify-between text-sm text-bone">
                <span className="uppercase tracking-[0.18em] text-ash">Shipping</span>
                <span>{shipping === 0 ? "Free" : "At checkout"}</span>
              </div>
              <p className="mt-5 border-t border-seam pt-5 text-[11px] leading-5 text-ash">
                Nov 27–30: free shipping on orders $75+. Taxes calculated at
                checkout. Checkout runs on Shopify — the same bag, the same
                order, fulfilled the same way.
              </p>
              <a
                href={checkoutUrl}
                className="mt-5 block bg-bone py-4 text-center font-display text-xl uppercase tracking-[0.12em] text-ink transition-colors hover:bg-brass"
              >
                Checkout
              </a>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
