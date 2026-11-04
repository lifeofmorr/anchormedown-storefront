import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/types";
import { priceLabel } from "@/lib/format";

/**
 * Best sellers as an editorial index — numbered rows in display type
 * instead of a fourth identical card grid. The photograph lives inside
 * the row and scales on hover; the whole row is the link.
 */
export default function BestSellerIndex({ products }: { products: Product[] }) {
  return (
    <div className="border-b border-seam">
      {products.map((p, i) => (
        <Link
          key={p.handle}
          href={`/products/${p.handle}`}
          className="group grid grid-cols-[auto_1fr_auto] items-center gap-5 border-t border-seam py-6 transition-colors first:border-t-0 hover:bg-coal/60 md:grid-cols-[90px_1fr_auto_150px] md:gap-8 md:px-4"
        >
          <span
            aria-hidden="true"
            className="text-stroke-bone font-display text-4xl leading-none md:text-6xl"
          >
            {String(i + 1).padStart(2, "0")}
          </span>
          <span>
            <span className="block font-display text-3xl uppercase leading-[0.95] text-bone transition-colors group-hover:text-brass md:text-5xl">
              {p.title}
            </span>
            <span className="mt-2 block text-[11px] uppercase tracking-[0.2em] text-ash">
              {p.productType}
              {p.gsm !== null && (
                <span className="text-brass"> · {p.gsm} GSM verified</span>
              )}
            </span>
          </span>
          <span className="text-right font-display text-xl text-bone/90 md:text-2xl">
            {priceLabel(p.priceMin, p.priceMax)}
          </span>
          <span className="relative hidden aspect-[4/5] w-[150px] overflow-hidden bg-coal md:block">
            {p.images[0] && (
              <Image
                src={p.images[0].url}
                alt=""
                fill
                sizes="150px"
                className={`object-cover transition-all duration-700 group-hover:scale-110 ${
                  p.images[1] ? "group-hover:opacity-0" : ""
                }`}
              />
            )}
            {p.images[1] && (
              <Image
                src={p.images[1].url}
                alt=""
                fill
                sizes="150px"
                className="object-cover opacity-0 transition-all duration-700 group-hover:scale-110 group-hover:opacity-100"
              />
            )}
          </span>
        </Link>
      ))}
    </div>
  );
}
