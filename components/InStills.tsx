import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import { getCampaignEntry } from "@/lib/campaign";
import { getProduct } from "@/lib/catalog";

/**
 * IN STILLS — the campaign gallery. Front/back diptychs from the live
 * colorway manifest (lib/campaign.ts), set like gallery plates: big
 * photography, plate numbers, the colorway named, the product one tap
 * away. This is the website's Higgsfield campaign layer in still form —
 * the same assets the live theme runs, given room to breathe.
 */
const PLATES = ["weighted", "anchor-flower", "amd-bull-stitch", "scripted"];

export default function InStills() {
  const plates = PLATES.map((handle, i) => ({
    handle,
    entry: getCampaignEntry(handle),
    product: getProduct(handle),
    n: i + 1,
  })).filter((p) => p.entry?.front && p.product);

  if (plates.length === 0) return null;

  return (
    <section className="border-y border-seam bg-ink py-24 md:py-36">
      <div className="mx-auto max-w-[1440px] px-5 md:px-10">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-mega text-brass">
                05 · The Campaign — In Stills
              </p>
              <h2 className="mt-3 font-display text-6xl uppercase leading-[0.9] text-bone md:text-7xl">
                Front. <span className="font-accent normal-case italic tracking-normal text-brass">Back.</span> Proof.
              </h2>
            </div>
            <p className="max-w-sm text-sm leading-6 text-ash">
              The campaign plates, exactly as shot for the colorways — the
              print on the back is the point of the garment, so it gets its
              own frame.
            </p>
          </div>
        </Reveal>

        <div className="mt-16 space-y-20 md:space-y-28">
          {plates.map(({ handle, entry, product, n }, i) => (
            <Reveal key={handle}>
              <article
                className={`grid items-end gap-6 md:grid-cols-[1fr_300px] ${
                  i % 2 === 1 ? "md:[direction:rtl]" : ""
                }`}
              >
                <div className="grid grid-cols-2 gap-4 [direction:ltr]">
                  <figure className="relative aspect-[4/5] overflow-hidden bg-coal">
                    <Image
                      src={entry!.front!}
                      alt={`${product!.title} — campaign front, ${entry!.colorway}`}
                      fill
                      sizes="(max-width: 768px) 50vw, 36vw"
                      className="object-cover"
                    />
                    <figcaption className="absolute bottom-3 left-3 bg-ink/75 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-bone backdrop-blur">
                      Front
                    </figcaption>
                  </figure>
                  {entry!.back ? (
                    <figure className="relative mt-10 aspect-[4/5] overflow-hidden bg-coal md:mt-16">
                      <Image
                        src={entry!.back}
                        alt={`${product!.title} — campaign back, ${entry!.colorway}`}
                        fill
                        sizes="(max-width: 768px) 50vw, 36vw"
                        className="object-cover"
                      />
                      <figcaption className="absolute bottom-3 left-3 bg-ink/75 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-bone backdrop-blur">
                        Back — the print
                      </figcaption>
                    </figure>
                  ) : (
                    <div className="mt-10 flex aspect-[4/5] items-center justify-center border border-seam md:mt-16">
                      <p className="max-w-[180px] text-center text-[11px] uppercase leading-5 tracking-[0.2em] text-ash">
                        Back plate withheld — same as live
                      </p>
                    </div>
                  )}
                </div>
                <div className="[direction:ltr] md:pb-4">
                  <p className="text-stroke-bone font-display text-6xl leading-none">
                    {String(n).padStart(2, "0")}
                  </p>
                  <h3 className="mt-4 font-display text-3xl uppercase leading-[0.95] text-bone">
                    {product!.title}
                  </h3>
                  <p className="mt-2 text-[11px] uppercase tracking-[0.2em] text-ash">
                    Colorway — {entry!.colorway}
                    {product!.gsm !== null && (
                      <span className="text-brass"> · {product!.gsm} GSM</span>
                    )}
                  </p>
                  <Link
                    href={`/products/${handle}`}
                    className="mt-6 inline-block border border-bone/30 px-7 py-3.5 font-display text-sm uppercase tracking-[0.14em] text-bone transition-colors hover:border-brass hover:text-brass"
                  >
                    Shop the piece ↗
                  </Link>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
