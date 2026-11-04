"use client";

import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/types";
import { priceLabel } from "@/lib/format";
import { useCart } from "@/lib/cart";

/**
 * Product card — elevated in the design pass: the image carries a
 * hover quick-add (the first available variant, wired to the real cart)
 * so every rail on the site ends in the conversion path, not a dead end.
 */
export default function ProductCard({ product }: { product: Product }) {
  const { add } = useCart();
  const img = product.images[0];
  const hover = product.images[1];
  const firstAvailable =
    product.variants.find((v) => v.availableForSale) ?? null;

  return (
    <div className="group relative">
      <Link href={`/products/${product.handle}`} className="block">
        <div className="relative aspect-[4/5] overflow-hidden bg-coal">
          {img && (
            <Image
              src={img.url}
              alt={img.alt}
              fill
              sizes="(max-width: 768px) 50vw, 25vw"
              className={`object-cover transition-all duration-700 group-hover:scale-[1.04] ${
                hover ? "group-hover:opacity-0" : ""
              }`}
            />
          )}
          {hover && (
            <Image
              src={hover.url}
              alt={hover.alt}
              fill
              sizes="(max-width: 768px) 50vw, 25vw"
              className="object-cover opacity-0 transition-all duration-700 group-hover:scale-[1.04] group-hover:opacity-100"
            />
          )}
          {product.gsm !== null && (
            <span className="absolute left-3 top-3 bg-ink/85 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-brass backdrop-blur">
              {product.gsm} GSM
            </span>
          )}
        </div>
        <div className="flex items-start justify-between gap-3 pt-4">
          <div>
            <h3 className="font-display text-lg uppercase leading-tight tracking-wide text-bone">
              {product.title}
            </h3>
            <p className="mt-1 text-[11px] uppercase tracking-[0.18em] text-ash">
              {product.productType}
            </p>
          </div>
          <p className="whitespace-nowrap text-sm text-bone/90">
            {priceLabel(product.priceMin, product.priceMax)}
          </p>
        </div>
      </Link>
      {firstAvailable && (
        <button
          type="button"
          onClick={() => add(firstAvailable.id, 1)}
          aria-label={`Quick add ${product.title} — ${firstAvailable.title} — to bag`}
          className="absolute bottom-[76px] right-3 border border-bone/25 bg-ink/85 px-4 py-2.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-bone opacity-0 backdrop-blur transition-all duration-300 hover:border-brass hover:text-brass focus:opacity-100 group-hover:opacity-100 max-lg:hidden"
        >
          + Quick add
        </button>
      )}
    </div>
  );
}
