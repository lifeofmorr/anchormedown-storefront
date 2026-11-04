"use client";

import { useMemo, useState } from "react";
import ProductCard from "@/components/ProductCard";
import Reveal from "@/components/Reveal";
import type { Product } from "@/lib/types";

/**
 * Collection grid, elevated: staggered editorial rhythm (alternating
 * columns drop on desktop) plus a real filter — weight-class chips in
 * plain words (brand language ruling, 2026-11-03: weight is sold in
 * human words, never in figures). Classes are computed from the
 * products' verified weights: "The Heaviest" is exactly the catalog's
 * heaviest line (its value arrives as a prop from the server page,
 * computed from data); "Heavyweight" is the verified heavy fleece
 * class. Filtering is honest by construction: a product with no
 * verified weight never appears under a weight chip.
 */
type WeightFilter = "all" | "heaviest" | "heavyweight";

const HEAVYWEIGHT_FLOOR = 300;

export default function CollectionGrid({
  products,
  heaviestGsm,
}: {
  products: Product[];
  heaviestGsm: number;
}) {
  const classOf = (p: Product): Exclude<WeightFilter, "all"> | null => {
    if (p.gsm === null) return null;
    if (p.gsm === heaviestGsm) return "heaviest";
    if (p.gsm >= HEAVYWEIGHT_FLOOR) return "heavyweight";
    return null;
  };
  const counts = useMemo(
    () => ({
      heaviest: products.filter((p) => classOf(p) === "heaviest").length,
      heavyweight: products.filter((p) => classOf(p) === "heavyweight").length,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [products, heaviestGsm]
  );
  const [filter, setFilter] = useState<WeightFilter>("all");
  const shown = useMemo(
    () =>
      filter === "all"
        ? products
        : products.filter((p) => classOf(p) === filter),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [products, filter, heaviestGsm]
  );
  const hasChips = counts.heaviest > 0 || counts.heavyweight > 0;

  const chipClass = (active: boolean) =>
    `border px-4 py-2 text-[11px] uppercase tracking-[0.18em] transition-colors ${
      active
        ? "border-brass bg-brass/10 text-bone"
        : "border-seam text-ash hover:border-bone/40 hover:text-bone"
    }`;

  return (
    <div>
      {hasChips && (
        <div
          className="flex flex-wrap items-center gap-2"
          role="group"
          aria-label="Filter by weight class"
        >
          <span className="mr-2 text-[11px] uppercase tracking-[0.22em] text-ash">
            Weight class
          </span>
          <button
            type="button"
            onClick={() => setFilter("all")}
            aria-pressed={filter === "all"}
            className={chipClass(filter === "all")}
          >
            All {products.length}
          </button>
          {counts.heaviest > 0 && (
            <button
              type="button"
              onClick={() => setFilter("heaviest")}
              aria-pressed={filter === "heaviest"}
              className={chipClass(filter === "heaviest")}
            >
              The Heaviest · {counts.heaviest}
            </button>
          )}
          {counts.heavyweight > 0 && (
            <button
              type="button"
              onClick={() => setFilter("heavyweight")}
              aria-pressed={filter === "heavyweight"}
              className={chipClass(filter === "heavyweight")}
            >
              Heavyweight · {counts.heavyweight}
            </button>
          )}
        </div>
      )}
      <p className="mt-4 text-[12px] leading-5 text-ash" aria-live="polite">
        {filter === "all"
          ? `${shown.length} products. The heavy ones say so — the rest don't need to.`
          : filter === "heaviest"
            ? `${shown.length} products — the heaviest we make.`
            : `${shown.length} products — heavyweight, built heavy.`}
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
