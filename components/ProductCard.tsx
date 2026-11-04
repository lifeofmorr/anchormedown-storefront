import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/types";
import { priceLabel } from "@/lib/format";

export default function ProductCard({ product }: { product: Product }) {
  const img = product.images[0];
  const hover = product.images[1];
  return (
    <Link href={`/products/${product.handle}`} className="group block">
      <div className="relative overflow-hidden bg-coal aspect-[4/5]">
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
            className="object-cover opacity-0 transition-all duration-700 group-hover:opacity-100 group-hover:scale-[1.04]"
          />
        )}
        {product.gsm !== null && (
          <span className="absolute left-3 top-3 bg-ink/85 backdrop-blur px-2.5 py-1 text-[10px] font-semibold tracking-[0.2em] text-brass uppercase">
            {product.gsm} GSM
          </span>
        )}
      </div>
      <div className="pt-4 flex items-start justify-between gap-3">
        <div>
          <h3 className="font-display text-lg uppercase tracking-wide text-bone leading-tight">
            {product.title}
          </h3>
          <p className="mt-1 text-[11px] tracking-[0.18em] uppercase text-ash">
            {product.productType}
          </p>
        </div>
        <p className="text-sm text-bone/90 whitespace-nowrap">
          {priceLabel(product.priceMin, product.priceMax)}
        </p>
      </div>
    </Link>
  );
}
