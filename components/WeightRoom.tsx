"use client";

import { useState } from "react";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import type { Product } from "@/lib/types";

/**
 * THE WEIGHT ROOM — the homepage's interactive instrument.
 *
 * The visitor picks the class of "the tee in their drawer" — Featherweight,
 * Standard tee, Premium standard, or Heavy streetwear — on a machined
 * slider. Ours stands fixed beside it: the heaviest. Column heights are
 * proportional to each class's real fabric weight, but no number is ever
 * shown (brand language ruling, 2026-11-03: weight is sold in human
 * words — "the heaviest tee in the game" — never in figures). The verdict
 * is computed live from the chosen class, and the piece ends in the
 * conversion path — the actual heavy line, shoppable, with quick add.
 *
 * Fact discipline: the four classes are the honest classes ordinary tees
 * fall into; ours is the catalog's verified heaviest line (lib/catalog).
 * No competitor is named, nothing is invented.
 */
interface WeightClass {
  label: string;
  /** Column height as a fraction of ours — proportional, never displayed. */
  height: number;
  /** The gap, stated in words. */
  measure: string;
  verdict: string;
}

const CLASSES: WeightClass[] = [
  {
    label: "Featherweight",
    height: 0.36,
    measure: "Almost three times the cloth",
    verdict: "Tissue class. It drapes because there is nothing there.",
  },
  {
    label: "Standard tee",
    height: 0.44,
    measure: "Well over twice the cloth",
    verdict: "The industry default. Fine — until you pick up something heavy.",
  },
  {
    label: "Premium standard",
    height: 0.55,
    measure: "Nearly twice the cloth",
    verdict: "Better than most. Still a class below.",
  },
  {
    label: "Heavy streetwear",
    height: 0.71,
    measure: "A clear class above",
    verdict: "Heavy — for them. Ours is heavier.",
  },
];

const OURS_HEIGHT = 0.96;

export default function WeightRoom({ line }: { line: Product[] }) {
  const [idx, setIdx] = useState(1);
  const theirs = CLASSES[idx];

  return (
    <section className="relative overflow-hidden border-b border-seam bg-coal">
      <span
        aria-hidden="true"
        className="text-stroke-faint pointer-events-none absolute -right-6 top-10 select-none font-display text-[10rem] leading-none md:text-[16rem]"
      >
        HEAVY
      </span>
      <div className="relative mx-auto max-w-[1440px] px-5 py-24 md:px-10 md:py-32">
        <div className="max-w-3xl">
          <p className="text-[11px] font-semibold uppercase tracking-mega text-brass">
            The Weight Room — an instrument, not an ad · 01
          </p>
          <h2 className="mt-4 font-display text-5xl uppercase leading-[0.92] text-bone md:text-7xl">
            Weigh your tee
            <br />
            against <span className="font-accent normal-case italic tracking-normal text-brass">ours.</span>
          </h2>
          <p className="mt-5 max-w-xl text-base leading-7 text-ash">
            Most tees are built light and priced like they aren&apos;t. Pick
            the class of the tee in your drawer — then look at the column
            next to it.
          </p>
        </div>

        <div className="mt-16 grid gap-14 lg:grid-cols-[1fr_420px] lg:gap-20">
          {/* ——— The instrument ——— */}
          <div>
            <div className="flex h-[340px] items-end gap-6 sm:gap-10">
              {/* Their column */}
              <div className="flex h-full flex-1 flex-col items-center justify-end">
                <p className="mb-3 text-center font-display text-3xl uppercase leading-none text-bone/85 md:text-4xl">
                  {theirs.label}
                </p>
                <div
                  className="weight-col w-full max-w-[220px] bg-gradient-to-t from-bone/10 to-bone/30"
                  style={{ height: `${theirs.height * 100}%` }}
                />
                <p className="mt-4 text-center text-[11px] uppercase tracking-[0.22em] text-ash">
                  The tee in your drawer
                </p>
              </div>
              {/* AMD column */}
              <div className="flex h-full flex-1 flex-col items-center justify-end">
                <p className="mb-3 text-center font-display text-3xl uppercase leading-none text-brass md:text-4xl">
                  The Heaviest
                </p>
                <div
                  className="weight-col w-full max-w-[220px] bg-gradient-to-t from-brass/40 to-brass"
                  style={{ height: `${OURS_HEIGHT * 100}%` }}
                />
                <p className="mt-4 text-center text-[11px] uppercase tracking-[0.22em] text-bone">
                  Ours — Anchor Me Down
                </p>
              </div>
            </div>

            <div className="mt-10 border-t border-seam pt-8">
              <label
                htmlFor="weight-slider"
                className="text-[11px] uppercase tracking-[0.22em] text-ash"
              >
                Set their class — {theirs.label}
              </label>
              <input
                id="weight-slider"
                type="range"
                min={0}
                max={CLASSES.length - 1}
                step={1}
                value={idx}
                onChange={(e) => setIdx(Number(e.target.value))}
                className="weight-slider mt-2"
                aria-valuetext={theirs.label}
              />
              <div className="mt-3 flex flex-wrap gap-2">
                {CLASSES.map((c, i) => (
                  <button
                    key={c.label}
                    type="button"
                    onClick={() => setIdx(i)}
                    aria-pressed={idx === i}
                    className={`border px-4 py-2 text-[11px] uppercase tracking-[0.18em] transition-colors ${
                      idx === i
                        ? "border-brass bg-brass/10 text-bone"
                        : "border-seam text-ash hover:border-bone/40 hover:text-bone"
                    }`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* ——— The verdict ——— */}
          <div className="flex flex-col justify-center border border-seam border-t-2 border-t-brass bg-ink px-7 py-9">
            <p className="text-[11px] uppercase tracking-[0.22em] text-ash">
              The verdict
            </p>
            <p className="mt-4 font-display text-6xl uppercase leading-[0.95] text-bone md:text-7xl">
              Ours —<br />
              the <span className="text-brass">heaviest</span>
            </p>
            <p className="mt-4 text-sm leading-6 text-ash">
              <span className="text-bone">{theirs.measure}</span> of a{" "}
              {theirs.label.toLowerCase()} — in every part of the shirt, not
              just the print.
            </p>
            <p className="mt-6 border-t border-seam pt-6 font-accent text-2xl italic leading-snug text-bone/90">
              {theirs.verdict}
            </p>
            <p className="mt-6 text-sm leading-6 text-ash">
              This isn&apos;t a claim in an ad. Pick one up — the weight is
              the argument. Thirteen tees, one standard, $60 each.
            </p>
            <Link
              href="/collections/t-shirts-1"
              className="mt-8 inline-block bg-bone px-8 py-4 text-center font-display text-base uppercase tracking-[0.12em] text-ink transition-colors hover:bg-brass"
            >
              Shop the heaviest line
            </Link>
            <Link
              href="/collections/hoodies"
              className="mt-4 text-center text-[11px] uppercase tracking-[0.2em] text-ash transition-colors hover:text-brass"
            >
              Layers built heavy too — shop hoodies →
            </Link>
          </div>
        </div>

        {/* ——— The answer, in product form ——— */}
        <div className="mt-20">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h3 className="font-display text-3xl uppercase text-bone md:text-4xl">
              The answer, in product form
            </h3>
            <p className="text-[11px] uppercase tracking-[0.22em] text-ash">
              The heaviest tees we make — hover to quick-add
            </p>
          </div>
          <div className="mt-8 grid grid-cols-2 gap-x-5 gap-y-10 lg:grid-cols-4">
            {line.slice(0, 4).map((p) => (
              <ProductCard key={p.handle} product={p} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
