import { notFound } from "next/navigation";
import Image from "next/image";
import ProductCard from "@/components/ProductCard";
import Reveal from "@/components/Reveal";
import { getCampaignEntry } from "@/lib/campaign";
import { getPage, getProduct } from "@/lib/catalog";

export const metadata = {
  title: "Giveaway — Anchor Me Down Apparel",
  description:
    "The 5 are named. The giveaway is closed. The heavyweight standard is $60.",
};

const FEATURED = ["anchor-standard", "strength", "weighted"];

export default function GiveawayPage() {
  const page = getPage("giveaway");
  if (!page) notFound();
  const featured = FEATURED.map((h) => getProduct(h)).filter(
    (p): p is NonNullable<typeof p> => Boolean(p)
  );
  // The Weighted campaign still (live manifest) backs the poster header.
  const poster =
    getCampaignEntry("weighted")?.front ?? featured[0]?.images[0]?.url;

  return (
    <div className="pb-24">
      {/* ——— Poster header ——— */}
      <section className="relative flex min-h-[68svh] items-end overflow-hidden">
        {poster && (
          <Image
            src={poster}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover object-top opacity-45"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/50 to-ink/30" />
        <span
          aria-hidden="true"
          className="text-stroke-faint pointer-events-none absolute -right-4 top-24 select-none font-display text-[11rem] leading-none md:text-[16rem]"
        >
          05
        </span>
        <div className="relative mx-auto w-full max-w-[1440px] px-5 pb-16 pt-48 md:px-10">
          <p className="text-[11px] font-semibold uppercase tracking-mega text-brass">
            Giveaway — Closed
          </p>
          <h1 className="mt-4 font-display uppercase leading-[0.88] text-bone text-[14vw] sm:text-7xl lg:text-9xl">
            The 5 are{" "}
            <span className="font-accent normal-case italic tracking-normal text-brass">
              named
            </span>
          </h1>
        </div>
      </section>

      {/* ——— The record — the live page body, verbatim ——— */}
      <section className="mx-auto max-w-[1100px] px-5 pt-16 md:px-10">
        <div
          className="page-body"
          dangerouslySetInnerHTML={{ __html: page.bodyHtml }}
        />
        {featured.length > 0 && (
          <>
            <Reveal className="mt-20">
              <h2 className="font-display text-4xl uppercase leading-[0.95] text-bone md:text-5xl">
                The standard they won
              </h2>
              <p className="mt-3 max-w-xl text-sm leading-6 text-ash">
                The draw is closed — the shirts are not. The same heaviest
                line, at the standard $60.
              </p>
            </Reveal>
            <div className="mt-10 grid grid-cols-2 gap-x-5 gap-y-12 lg:grid-cols-3">
              {featured.map((p, i) => (
                <div key={p.handle} className={i === 1 ? "lg:mt-10" : ""}>
                  <ProductCard product={p} />
                </div>
              ))}
            </div>
          </>
        )}
      </section>
    </div>
  );
}
