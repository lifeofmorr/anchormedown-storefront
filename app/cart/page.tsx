"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/lib/cart";
import { money } from "@/lib/format";
import { SHIPPING_LINE } from "@/lib/catalog";

export default function CartPage() {
  const { lines, subtotal, setQuantity, remove, clear, checkoutUrl } = useCart();
  const shipping = subtotal >= 200 || subtotal === 0 ? 0 : null;

  return (
    <div className="mx-auto max-w-[1100px] px-5 pb-24 pt-36 md:px-10 md:pt-40">
      <h1 className="font-display text-6xl uppercase leading-[0.92] text-bone">
        Your bag
      </h1>

      {lines.length === 0 ? (
        <div className="mt-14 border border-seam bg-coal px-8 py-16 text-center">
          <p className="text-ash">Your bag is empty.</p>
          <Link
            href="/collections/best-sellers"
            className="mt-6 inline-block bg-bone px-9 py-4 font-display text-base uppercase tracking-[0.12em] text-ink transition-colors hover:bg-brass"
          >
            Shop best sellers
          </Link>
        </div>
      ) : (
        <>
          <ul className="mt-12 divide-y divide-seam border-y border-seam">
            {lines.map((l) => (
              <li key={l.variantId} className="flex gap-5 py-6">
                <div className="relative h-32 w-28 shrink-0 overflow-hidden bg-coal">
                  {l.image && (
                    <Image src={l.image} alt={l.title} fill sizes="112px" className="object-cover" />
                  )}
                </div>
                <div className="flex flex-1 flex-col">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <Link
                        href={`/products/${l.handle}`}
                        className="font-display text-2xl uppercase tracking-wide text-bone"
                      >
                        {l.title}
                      </Link>
                      <p className="mt-1 text-sm text-ash">{l.variantTitle}</p>
                      <p className="mt-1 text-sm text-ash">{money(l.price)} each</p>
                    </div>
                    <p className="text-lg text-bone">{money(l.price * l.quantity)}</p>
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

          <div className="mt-10 grid gap-8 md:grid-cols-[1fr_360px]">
            <div>
              <p className="text-sm leading-6 text-ash">{SHIPPING_LINE}</p>
              <button onClick={clear} className="mt-6 text-[11px] uppercase tracking-[0.2em] text-ash hover:text-bone">
                Clear bag
              </button>
            </div>
            <div className="border border-seam bg-coal p-6">
              <div className="flex justify-between text-sm text-bone">
                <span className="uppercase tracking-[0.18em] text-ash">Subtotal</span>
                <span className="font-semibold">{money(subtotal)}</span>
              </div>
              <div className="mt-3 flex justify-between text-sm text-bone">
                <span className="uppercase tracking-[0.18em] text-ash">Shipping</span>
                <span>{shipping === 0 ? "Free" : "At checkout"}</span>
              </div>
              <p className="mt-4 text-[11px] leading-5 text-ash">
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
