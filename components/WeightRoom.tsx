"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import type { Product } from "@/lib/types";

/**
 * THE WEIGHT ROOM — the homepage's interactive instrument.
 *
 * The visitor sets the fabric weight of "the tee in their drawer" on a
 * machined slider (140–300 GSM, the range ordinary tees actually live in;
 * presets name the classes honestly). AMD's verified 425 stands fixed
 * beside it. All math is real and computed live: column heights are
 * proportional to grams per square meter, the multiple is 425 ÷ theirs,
 * the surplus is 425 − theirs. The piece ends in the conversion path —
 * the actual 425 line, shoppable, with quick add.
 *
 * Fact discipline: 425 is this catalog's verified weight for the thirteen
 * tees (lib/catalog). The "typical tee" band (160–220 GSM) is presented
 * only as a typical range — no competitor is named, nothing is invented.
 */
const AMD_GSM = 425;
const SCALE_MAX = 450;

const PRESETS = [
  { label: "Featherweight", gsm: 150 },
  { label: "Standard tee", gsm: 180 },
  { label: "Premium standard", gsm: 220 },
  { label: "Heavy streetwear", gsm: 300 },
];

function verdictFor(gsm: number): string {
  if (gsm <= 170) return "Tissue class. It drapes because there is nothing there.";
  if (gsm <= 220) return "Standard class — the industry default, and the weight almost nobody prints.";
  if (gsm <= 270) return "Midweight. Respectable — and still a class below.";
  return "Heavy for them. Still not 425.";
}

export default function WeightRoom({ line }: { line: Product[] }) {
  const [theirs, setTheirs] = useState(180);
  const ratio = useMemo(() => AMD_GSM / theirs, [theirs]);
  const surplus = AMD_GSM - theirs;

  return (
    <section className="relative overflow-hidden border-b border-seam bg-coal">
      <span
        aria-hidden="true"
        className="text-stroke-faint pointer-events-none absolute -right-6 top-10 select-none font-display text-[16rem] leading-none md:text-[24rem]"
      >
        425
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
            GSM is grams per square meter of fabric — the number most brands
            won&apos;t print. Set the weight of the tee in your drawer. A
            typical tee runs 160–220. Then look at the column next to it.
          </p>
        </div>

        <div className="mt-16 grid gap-14 lg:grid-cols-[1fr_420px] lg:gap-20">
          {/* ——— The instrument ——— */}
          <div>
            <div className="flex h-[340px] items-end gap-6 sm:gap-10">
              {/* Their column */}
              <div className="flex h-full flex-1 flex-col items-center justify-end">
                <p className="mb-3 text-center">
                  <span className="font-display text-4xl text-bone/85 md:text-5xl">
                    {theirs}
                  </span>
                  <span className="ml-1 text-[11px] uppercase tracking-[0.2em] text-ash">
                    GSM
                  </span>
                </p>
                <div
                  className="weight-col w-full max-w-[220px] bg-gradient-to-t from-bone/10 to-bone/30"
                  style={{ height: `${(theirs / SCALE_MAX) * 100}%` }}
                />
                <p className="mt-4 text-center text-[11px] uppercase tracking-[0.22em] text-ash">
                  The tee in your drawer
                </p>
              </div>
              {/* AMD column */}
              <div className="flex h-full flex-1 flex-col items-center justify-end">
                <p className="mb-3 text-center">
                  <span className="font-display text-4xl text-brass md:text-5xl">
                    {AMD_GSM}
                  </span>
                  <span className="ml-1 text-[11px] uppercase tracking-[0.2em] text-ash">
                    GSM — verified
                  </span>
                </p>
                <div
                  className="weight-col w-full max-w-[220px] bg-gradient-to-t from-brass/40 to-brass"
                  style={{ height: `${(AMD_GSM / SCALE_MAX) * 100}%` }}
                />
                <p className="mt-4 text-center text-[11px] uppercase tracking-[0.22em] text-bone">
                  The 425 line — Anchor Me Down
                </p>
              </div>
            </div>

            <div className="mt-10 border-t border-seam pt-8">
              <label
                htmlFor="weight-slider"
                className="text-[11px] uppercase tracking-[0.22em] text-ash"
              >
                Set their weight — {theirs} GSM
              </label>
              <input
                id="weight-slider"
                type="range"
                min={140}
                max={300}
                step={5}
                value={theirs}
                onChange={(e) => setTheirs(Number(e.target.value))}
                className="weight-slider mt-2"
                aria-valuetext={`${theirs} grams per square meter`}
              />
              <div className="mt-3 flex flex-wrap gap-2">
                {PRESETS.map((p) => (
                  <button
                    key={p.gsm}
                    type="button"
                    onClick={() => setTheirs(p.gsm)}
                    aria-pressed={theirs === p.gsm}
                    className={`border px-4 py-2 text-[11px] uppercase tracking-[0.18em] transition-colors ${
                      theirs === p.gsm
                        ? "border-brass bg-brass/10 text-bone"
                        : "border-seam text-ash hover:border-bone/40 hover:text-bone"
                    }`}
                  >
                    {p.label} · {p.gsm}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* ——— The verdict ——— */}
          <div className="flex flex-col justify-center border border-seam border-t-2 border-t-brass bg-ink px-7 py-9">
            <p className="text-[11px] uppercase tracking-[0.22em] text-ash">
              The measurement
            </p>
            <p className="mt-4 font-display text-8xl leading-none text-bone md:text-9xl">
              {ratio.toFixed(1)}×
            </p>
            <p className="mt-3 text-sm leading-6 text-ash">
              the fabric per square meter —{" "}
              <span className="text-bone">
                +{surplus} grams in every square meter
              </span>{" "}
              over the tee you set.
            </p>
            <p className="mt-6 border-t border-seam pt-6 font-accent text-2xl italic leading-snug text-bone/90">
              {verdictFor(theirs)}
            </p>
            <p className="mt-6 text-sm leading-6 text-ash">
              Ours is not a claim in an ad. The weight is printed on every
              425 product page, next to the price — thirteen tees, one
              fabric, $60 each.
            </p>
            <Link
              href="/collections/t-shirts-1"
              className="mt-8 inline-block bg-bone px-8 py-4 text-center font-display text-base uppercase tracking-[0.12em] text-ink transition-colors hover:bg-brass"
            >
              Shop the 425 line
            </Link>
            <Link
              href="/collections/hoodies"
              className="mt-4 text-center text-[11px] uppercase tracking-[0.2em] text-ash transition-colors hover:text-brass"
            >
              Layers print theirs too — 380 / 400 GSM fleece →
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
              All verified 425 GSM — hover to quick-add
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
