"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import type { Product } from "@/lib/types";
import { money } from "@/lib/format";
import { useCart } from "@/lib/cart";
import { SHIPPING_LINE } from "@/lib/catalog";

export default function PurchasePanel({ product }: { product: Product }) {
  const { add } = useCart();
  const [activeImg, setActiveImg] = useState(0);
  const [qty, setQty] = useState(1);
  const [selection, setSelection] = useState<Record<string, string>>(() => {
    const first = product.variants.find((v) => v.availableForSale) ?? product.variants[0];
    return first ? { ...first.options } : {};
  });

  const variant = useMemo(
    () =>
      product.variants.find((v) =>
        Object.entries(selection).every(([k, val]) => v.options[k] === val)
      ) ?? product.variants[0],
    [product, selection]
  );

  const main = product.images[activeImg] ?? product.images[0];

  return (
    <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
      {/* Gallery */}
      <div>
        <div className="relative aspect-square overflow-hidden bg-coal">
          {main && (
            <Image
              key={main.url}
              src={main.url}
              alt={main.alt}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          )}
          {product.gsm !== null && (
            <span className="absolute left-4 top-4 bg-ink/85 px-3 py-1.5 text-[11px] font-semibold tracking-[0.22em] text-brass uppercase backdrop-blur">
              {product.gsm} GSM — Verified Weight
            </span>
          )}
        </div>
        {product.images.length > 1 && (
          <div className="mt-3 grid grid-cols-5 gap-3">
            {product.images.slice(0, 10).map((img, i) => (
              <button
                key={img.url + i}
                onClick={() => setActiveImg(i)}
                className={`relative aspect-square overflow-hidden bg-coal transition-opacity ${
                  i === activeImg ? "ring-2 ring-brass" : "opacity-60 hover:opacity-100"
                }`}
                aria-label={`View image ${i + 1}`}
              >
                <Image src={img.url} alt={img.alt} fill sizes="120px" className="object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Buy column */}
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-mega text-brass">
          {product.productType}
        </p>
        <h1 className="mt-3 font-display text-5xl uppercase leading-[0.95] text-bone md:text-6xl">
          {product.title}
        </h1>
        <p className="mt-4 text-2xl text-bone">
          {variant ? money(variant.price) : money(product.priceMin)}
          {variant?.compareAtPrice && (
            <span className="ml-3 text-lg text-ash line-through">
              {money(variant.compareAtPrice)}
            </span>
          )}
        </p>

        {product.gsm !== null ? (
          <div className="mt-6 border border-brass/40 bg-brass/5 px-5 py-4">
            <p className="font-display text-xl uppercase tracking-wide text-bone">
              {product.gsm} GSM fabric
            </p>
            <p className="mt-1 text-sm leading-6 text-ash">
              The fabric weight is printed here because we don&apos;t hide
              ours. Most brands won&apos;t tell you theirs.
            </p>
          </div>
        ) : null}

        {product.options.map((opt) => (
          <div key={opt.name} className="mt-7">
            <p className="text-[11px] uppercase tracking-[0.22em] text-ash">
              {opt.name}
              {selection[opt.name] && (
                <span className="ml-2 text-bone normal-case tracking-normal">
                  — {selection[opt.name]}
                </span>
              )}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {opt.values.map((val) => {
                const selected = selection[opt.name] === val;
                const exists = product.variants.some(
                  (v) =>
                    v.options[opt.name] === val &&
                    Object.entries(selection).every(
                      ([k, sv]) => k === opt.name || v.options[k] === sv
                    )
                );
                return (
                  <button
                    key={val}
                    disabled={!exists}
                    onClick={() =>
                      setSelection((s) => ({ ...s, [opt.name]: val }))
                    }
                    className={`border px-4 py-2.5 text-sm transition-colors ${
                      selected
                        ? "border-brass bg-brass/10 text-bone"
                        : exists
                          ? "border-seam text-bone/80 hover:border-bone/50"
                          : "border-seam/50 text-ash/40 line-through cursor-not-allowed"
                    }`}
                  >
                    {val}
                  </button>
                );
              })}
            </div>
          </div>
        ))}

        <div className="mt-8 flex gap-3">
          <div className="flex items-center border border-seam">
            <button
              className="px-4 py-3.5 text-bone"
              onClick={() => setQty(Math.max(1, qty - 1))}
              aria-label="Decrease quantity"
            >
              −
            </button>
            <span className="w-10 text-center text-bone">{qty}</span>
            <button
              className="px-4 py-3.5 text-bone"
              onClick={() => setQty(qty + 1)}
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>
          <button
            disabled={!variant || !variant.availableForSale}
            onClick={() => variant && add(variant.id, qty)}
            className="flex-1 bg-bone py-3.5 font-display text-xl uppercase tracking-[0.12em] text-ink transition-colors hover:bg-brass disabled:cursor-not-allowed disabled:opacity-50"
          >
            {variant && !variant.availableForSale ? "Sold out" : "Add to bag"}
          </button>
        </div>

        <p className="mt-5 border-t border-seam pt-5 text-[13px] leading-6 text-ash">
          {SHIPPING_LINE}
        </p>
      </div>
    </div>
  );
}
