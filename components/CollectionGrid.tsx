"use client";

import { useMemo, useState } from "react";
import ProductCard from "@/components/ProductCard";
import Reveal from "@/components/Reveal";
import type { Product } from "@/lib/types";

/**
 * Collection grid, elevated: staggered editorial rhythm (alternating
 * columns drop on desktop) plus a real filter — "printed weight" chips
 * built from the GSM values actually present in this collection.
 * Filtering is honest by construction: a product with no verified GSM
 * never appears under a weight chip.
 */
export default function CollectionGrid({ products }: { products: Product[] }) {
  const tiers = useMemo(
    () =>
      Array.from(
        new Set(
          products
            .map((p) => p.gsm)
            .filter((g): g is number => g !== null)
        )
      ).sort((a, b) => b - a),
    [products]
  );
  const [filter, setFilter] = useState<number | "all">("all");
  const shown = useMemo(
    () => (filter === "all" ? products : products.filter((p) => p.gsm === filter)),
    [products, filter]
  );

  return (
    <div>
      {tiers.length > 0 && (
        <div
          className="flex flex-wrap items-center gap-2"
          role="group"
          aria-label="Filter by printed fabric weight"
        >
          <span className="mr-2 text-[11px] uppercase tracking-[0.22em] text-ash">
            Printed weight
          </span>
          <button
            type="button"
            onClick={() => setFilter("all")}
            aria-pressed={filter === "all"}
            className={`border px-4 py-2 text-[11px] uppercase tracking-[0.18em] transition-colors ${
              filter === "all"
                ? "border-brass bg-brass/10 text-bone"
                : "border-seam text-ash hover:border-bone/40 hover:text-bone"
            }`}
          >
            All {products.length}
          </button>
          {tiers.map((g) => {
            const n = products.filter((p) => p.gsm === g).length;
            return (
              <button
                key={g}
                type="button"
                onClick={() => setFilter(g)}
                aria-pressed={filter === g}
                className={`border px-4 py-2 text-[11px] uppercase tracking-[0.18em] transition-colors ${
                  filter === g
                    ? "border-brass bg-brass/10 text-bone"
                    : "border-seam text-ash hover:border-bone/40 hover:text-bone"
                }`}
              >
                {g} GSM · {n}
              </button>
            );
          })}
        </div>
      )}
      <p className="mt-4 text-[12px] leading-5 text-ash" aria-live="polite">
        {filter === "all"
          ? `${shown.length} products. Weights are printed only where verified — the rest stay unprinted, on purpose.`
          : `${shown.length} products at a verified ${filter} GSM.`}
      </p>
      <div className="mt-10 grid grid-cols-2 gap-x-5 gap-y-12 lg:grid-cols-4">
        {shown.map((p, i) => (
          <div
            key={p.handle}
            className={i % 4 === 1 || i % 4 === 3 ? "lg:mt-12" : ""}
          >
            <Reveal delay={(i % 4) * 60}>
              <ProductCard product={p} />
            </Reveal>
          </div>
        ))}
      </div>
    </div>
  );
}
