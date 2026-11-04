import Image from "next/image";
import Link from "next/link";
import Film from "@/components/Film";
import Reveal from "@/components/Reveal";
import { getCampaignEntry, RUNWAY_HANDLES } from "@/lib/campaign";
import { getProduct } from "@/lib/catalog";

/**
 * Social runway — the live theme's amd-social-runway section: a rail of
 * shoppable campaign looks in the live order. Each card carries the
 * colorway's campaign model still from the live allowlist
 * (lib/campaign.ts); looks with a campaign film get the film surface
 * with its Play/Pause toggle, exactly as live. Product facts and prices
 * stay on the product pages — this rail is site content, not a catalog.
 */
const SOCIALS = [
  { label: "Instagram", href: "https://instagram.com/anchormedownapparel" },
  { label: "TikTok", href: "https://tiktok.com/@anchormedownapparel" },
  { label: "Facebook", href: "https://facebook.com/anchormedownapparel" },
  { label: "Pinterest", href: "https://pinterest.com/anchormedownapparel" },
];

export default function Runway() {
  const cards = RUNWAY_HANDLES.map((handle, i) => {
    const entry = getCampaignEntry(handle);
    const product = getProduct(handle);
    return { handle, entry, product, n: i + 1 };
  }).filter((c) => c.entry?.front && c.product);

  return (
    <section className="overflow-hidden border-y border-seam bg-coal/60 py-24">
      <div className="mx-auto max-w-[1440px] px-5 md:px-10">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-mega text-brass">
                The live current · @anchormedownapparel
              </p>
              <h2 className="mt-3 font-display text-5xl uppercase leading-[0.95] text-bone md:text-7xl">
                Out there. <span className="text-brass">Holding.</span>
              </h2>
              <p className="mt-5 max-w-xl text-base leading-7 text-ash">
                New drops, boat days, gym nights and the people moving between
                them. Play each look, shop the piece and follow Anchor Me Down
                where the current stays live.
              </p>
            </div>
            <nav
              aria-label="Follow Anchor Me Down on social media"
              className="flex flex-wrap gap-x-5 gap-y-2"
            >
              {SOCIALS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[12px] uppercase tracking-[0.2em] text-ash transition-colors hover:text-brass"
                >
                  {s.label} ↗
                </a>
              ))}
            </nav>
          </div>
        </Reveal>
      </div>

      <div
        className="mt-12 flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 pb-4 md:px-10"
        role="list"
        aria-label="Shoppable Anchor Me Down campaign films"
      >
        {cards.map(({ handle, entry, product, n }) => {
          const hasFilm = Boolean(entry!.film);
          return (
            <article
              key={handle}
              role="listitem"
              className="w-[78vw] max-w-[380px] shrink-0 snap-start"
            >
              <div className="relative aspect-[4/5] overflow-hidden bg-ink">
                {hasFilm ? (
                  <Film
                    src={entry!.film!}
                    poster={entry!.front!}
                    label={`${product!.title} campaign`}
                    autoplayInView={false}
                    sizes="(max-width: 768px) 78vw, 380px"
                  />
                ) : (
                  <Image
                    src={entry!.front!}
                    alt={`Model wearing ${product!.title} in the Anchor Me Down campaign`}
                    fill
                    sizes="(max-width: 768px) 78vw, 380px"
                    className="object-cover"
                  />
                )}
                <span className="absolute bottom-4 left-4 z-10 bg-ink/70 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-bone backdrop-blur">
                  {hasFilm ? `Film ${n}` : `Look ${n}`}
                </span>
              </div>
              <div className="flex items-start justify-between gap-4 pt-4">
                <div>
                  <h3 className="font-display text-xl uppercase leading-tight text-bone">
                    {product!.title}
                  </h3>
                  <p className="mt-1 text-[12px] uppercase tracking-[0.18em] text-ash">
                    {entry!.colorway}
                  </p>
                </div>
                <Link
                  href={`/products/${handle}`}
                  aria-label={`Shop look: ${product!.title}`}
                  className="shrink-0 text-[12px] uppercase tracking-[0.2em] text-bone transition-colors hover:text-brass"
                >
                  Shop look ↗
                </Link>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
