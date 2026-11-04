import Image from "next/image";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import Reveal from "@/components/Reveal";
import CaptureForm from "@/components/CaptureForm";
import HeroWorlds from "@/components/HeroWorlds";
import CampaignFilms from "@/components/CampaignFilms";
import Runway from "@/components/Runway";
import WorldStory from "@/components/WorldStory";
import WeightRoom from "@/components/WeightRoom";
import BestSellerIndex from "@/components/BestSellerIndex";
import InStills from "@/components/InStills";
import Film from "@/components/Film";
import Parallax from "@/components/Parallax";
import { HERO_WORLDS } from "@/lib/campaign";
import { money } from "@/lib/format";
import {
  getCollectionProducts,
  getHeaviestProducts,
  getProduct,
} from "@/lib/catalog";

function optionValues(handle: string, name: string): string[] {
  const p = getProduct(handle);
  return p?.options.find((o) => o.name.toLowerCase() === name)?.values ?? [];
}

export default function HomePage() {
  const heaviestLine = getHeaviestProducts();
  const featuredHeavy = getProduct("college-special") ?? heaviestLine[0];
  const restHeavy = heaviestLine.filter((p) => p.handle !== featuredHeavy?.handle);
  const bestSellers = getCollectionProducts("best-sellers");
  const womens = getCollectionProducts("womens-collection");
  const standard = getProduct("anchor-standard");
  const hoodieFeature = getProduct("mini-anchor-hoodie");
  const standardColors = optionValues("anchor-standard", "color").length;

  return (
    <>
      {/* ——— HERO — the two world films, type set like a poster ——— */}
      <section className="grain relative flex min-h-[100svh] items-end overflow-hidden">
        <HeroWorlds />
        <span
          aria-hidden="true"
          className="text-stroke-faint pointer-events-none absolute -right-8 top-[13%] z-0 select-none font-display text-[23vw] leading-none"
        >
          HEAVY
        </span>
        <div className="relative z-10 mx-auto w-full max-w-[1440px] px-5 pb-36 pt-44 md:px-10">
          <Parallax speed={0.045}>
            <p className="text-[11px] font-semibold uppercase tracking-mega text-brass">
              Heavyweight Apparel — Iron × Water
            </p>
            <h1 className="mt-5 font-display uppercase leading-[0.88] text-bone text-[13vw] sm:text-[11vw] lg:text-[9.5rem]">
              The{" "}
              <span className="font-accent normal-case italic tracking-normal text-brass">
                heaviest
              </span>{" "}
              tee in the game.
            </h1>
            <p className="mt-7 max-w-xl text-base leading-7 text-bone/75">
              Built between the iron and the water. Garment-dyed, boxy, cut
              to be trained in and lived in — heavy enough that you feel it
              the second you pick it up.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href="/collections/t-shirts-1"
                className="bg-bone px-9 py-4 font-display text-lg uppercase tracking-[0.12em] text-ink transition-colors hover:bg-brass"
              >
                Shop the heavyweight line
              </Link>
              <Link
                href="/pages/black-friday"
                className="border border-bone/40 px-9 py-4 font-display text-lg uppercase tracking-[0.12em] text-bone backdrop-blur transition-colors hover:border-brass hover:text-brass"
              >
                Black Friday — Nov 27–30
              </Link>
            </div>
          </Parallax>
        </div>
        {/* Verified-facts strip along the hero's keel */}
        <div className="absolute inset-x-0 bottom-0 z-10 border-t border-bone/15 bg-ink/40 backdrop-blur-sm">
          <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-6 px-5 py-3.5 text-[10px] font-semibold uppercase tracking-[0.22em] text-bone/70 md:px-10">
            <span>13 tees — one heavy standard</span>
            <span className="hidden md:block">Built heavy, every one</span>
            <span className="hidden lg:block">Garment-dyed · Boxy · XS–2XL</span>
            <span>Iron × Water</span>
          </div>
        </div>
      </section>

      {/* ——— MARQUEE ——— */}
      <div className="overflow-hidden border-b border-seam bg-coal py-5">
        <div className="marquee-track flex w-max gap-12 whitespace-nowrap font-display text-2xl uppercase tracking-[0.25em] text-bone/60">
          {Array.from({ length: 2 }).map((_, dup) => (
            <span key={dup} className="flex gap-12">
              {[
                "Stay Anchored",
                "Built Heavy",
                "Iron × Water",
                "Heaviest Tee In The Game",
                "Free Shipping $200+",
                "Nov 27–30: Free Shipping $75+",
              ].map((t) => (
                <span key={t} className="flex items-center gap-12">
                  {t} <span className="text-brass">⚓</span>
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>

      {/* ——— THE WEIGHT ROOM — the interactive instrument ——— */}
      <WeightRoom line={heaviestLine} />

      {/* ——— CAMPAIGN FILMS (live position 2) ——— */}
      <CampaignFilms />

      {/* ——— THE HEAVY LINE — an editorial spread, not a grid ——— */}
      <section className="relative mx-auto max-w-[1440px] overflow-hidden px-5 py-24 md:px-10 md:py-36">
        <span
          aria-hidden="true"
          className="text-stroke-faint pointer-events-none absolute -left-4 top-6 select-none font-display text-[10rem] leading-none md:text-[16rem]"
        >
          HEAVY
        </span>
        <Reveal className="relative">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-mega text-brass">
                03 · The Heavyweights
              </p>
              <h2 className="mt-3 font-display text-6xl uppercase leading-[0.9] text-bone md:text-8xl">
                The heavy line
              </h2>
            </div>
            <p className="max-w-sm text-sm leading-6 text-ash">
              Thirteen tees. One standard: the heaviest garment-dyed cotton
              we could put on a frame. Most brands build light and hope you
              won&apos;t notice.
            </p>
          </div>
        </Reveal>

        {/* Featured spread — the hero of the line, full width */}
        {featuredHeavy?.images[0] && (
          <Reveal className="relative mt-14">
            <Link
              href={`/products/${featuredHeavy.handle}`}
              className="group relative block h-[68vh] min-h-[440px] overflow-hidden"
            >
              <Image
                src={featuredHeavy.images[0].url}
                alt={featuredHeavy.images[0].alt}
                fill
                sizes="100vw"
                className="hero-drift object-cover object-top transition-transform duration-[1400ms] group-hover:scale-[1.04]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/95 via-ink/25 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 flex flex-wrap items-end justify-between gap-6 p-7 md:p-10">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-mega text-brass">
                    No. 01 — The hero of the line
                  </p>
                  <h3 className="mt-3 font-display text-5xl uppercase leading-[0.9] text-bone md:text-7xl">
                    {featuredHeavy.title}
                  </h3>
                  <p className="mt-3 max-w-md text-sm leading-6 text-bone/75">
                    Garment-dyed cotton, cut boxy, XS–2XL —{" "}
                    {money(featuredHeavy.priceMin)}. The one the rest of the
                    line is measured against.
                  </p>
                </div>
                <span className="bg-bone px-8 py-4 font-display text-base uppercase tracking-[0.12em] text-ink transition-colors group-hover:bg-brass">
                  Shop {featuredHeavy.title}
                </span>
              </div>
            </Link>
          </Reveal>
        )}

        {/* The remaining twelve — staggered columns */}
        <div className="relative mt-16 grid grid-cols-2 gap-x-5 gap-y-12 lg:grid-cols-3">
          {restHeavy.map((p, i) => (
            <div key={p.handle} className={i % 3 === 1 ? "lg:mt-14" : ""}>
              <Reveal delay={(i % 3) * 80}>
                <p className="mb-3 text-[11px] uppercase tracking-[0.22em] text-ash">
                  No. {String(i + 2).padStart(2, "0")}
                </p>
                <ProductCard product={p} />
              </Reveal>
            </div>
          ))}
        </div>
        <Reveal className="relative mt-16 border-t border-seam pt-8 text-center">
          <p className="text-[12px] uppercase tracking-[0.22em] text-ash">
            Thirteen tees · One standard · $60 every one
          </p>
          <Link
            href="/collections/t-shirts-1"
            className="mt-6 inline-block border border-bone/30 px-9 py-4 font-display text-base uppercase tracking-[0.14em] text-bone transition-colors hover:border-brass hover:text-brass"
          >
            Shop all tees
          </Link>
        </Reveal>
      </section>

      {/* ——— FULL-BLEED FEATURE: ANCHOR STANDARD, with parallax ——— */}
      {standard?.images[0] && (
        <section className="relative overflow-hidden">
          <div className="relative h-[88vh] min-h-[560px]">
            <Parallax speed={0.1} className="absolute inset-x-0 -inset-y-24">
              <div className="relative h-full w-full">
                <Image
                  src={standard.images[0].url}
                  alt={standard.images[0].alt}
                  fill
                  sizes="100vw"
                  className="object-cover object-top"
                />
              </div>
            </Parallax>
            <div className="absolute inset-0 bg-gradient-to-r from-ink/85 via-ink/30 to-transparent" />
            <div className="absolute inset-0 flex items-center">
              <div className="mx-auto w-full max-w-[1440px] px-5 md:px-10">
                <Reveal>
                  <p className="text-[11px] font-semibold uppercase tracking-mega text-brass">
                    The Signature
                  </p>
                  <h2 className="mt-4 max-w-xl font-display text-6xl uppercase leading-[0.9] text-bone md:text-8xl">
                    Anchor
                    <br />
                    Standard
                  </h2>
                  <p className="mt-5 max-w-md text-base leading-7 text-bone/80">
                    The tee the whole line is built on. Garment-dyed
                    cotton, built heavy, boxy cut, XS–2XL — {`$60`}, and it
                    does not need a draw to be worth it.
                  </p>
                  <Link
                    href={`/products/${standard.handle}`}
                    className="mt-8 inline-block bg-bone px-9 py-4 font-display text-lg uppercase tracking-[0.12em] text-ink transition-colors hover:bg-brass"
                  >
                    Shop Anchor Standard
                  </Link>
                </Reveal>
              </div>
            </div>
            {/* Spec keel */}
            <div className="absolute inset-x-0 bottom-0 border-t border-bone/15 bg-ink/45 backdrop-blur-sm">
              <div className="mx-auto flex max-w-[1440px] flex-wrap gap-x-10 gap-y-2 px-5 py-3.5 text-[10px] font-semibold uppercase tracking-[0.22em] text-bone/75 md:px-10">
                <span>
                  Build — <span className="text-brass">The heaviest</span>
                </span>
                <span>Sizes — XS–2XL</span>
                {standardColors > 0 && <span>{standardColors} colorways</span>}
                <span>Price — $60</span>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ——— BEST SELLERS — the index ——— */}
      <section className="mx-auto max-w-[1440px] px-5 py-24 md:px-10 md:py-32">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-mega text-brass">
                04 · The Index
              </p>
              <h2 className="mt-3 font-display text-6xl uppercase leading-[0.9] text-bone md:text-7xl">
                Best sellers
              </h2>
            </div>
            <Link
              href="/collections/best-sellers"
              className="text-[12px] uppercase tracking-[0.2em] text-ash transition-colors hover:text-brass"
            >
              View the rack →
            </Link>
          </div>
        </Reveal>
        <Reveal className="mt-12">
          <BestSellerIndex products={bestSellers} />
        </Reveal>
      </section>

      {/* ——— SOCIAL RUNWAY (live position 4) ——— */}
      <Runway />

      {/* ——— IN STILLS — the campaign gallery ——— */}
      <InStills />

      {/* ——— HOODIE FEATURE ——— */}
      {hoodieFeature?.images[0] && (
        <section className="bg-coal">
          <div className="mx-auto grid max-w-[1440px] items-center gap-0 md:grid-cols-2">
            <div className="relative aspect-[4/5] overflow-hidden md:aspect-auto md:h-[760px]">
              <Parallax speed={0.07} className="absolute inset-x-0 -inset-y-16">
                <div className="relative h-full w-full">
                  <Image
                    src={hoodieFeature.images[0].url}
                    alt={hoodieFeature.images[0].alt}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover object-top"
                  />
                </div>
              </Parallax>
            </div>
            <div className="px-5 py-16 md:px-16">
              <Reveal>
                <p className="text-[11px] font-semibold uppercase tracking-mega text-brass">
                  Heavyweight Fleece
                </p>
                <h2 className="mt-4 font-display text-5xl uppercase leading-[0.92] text-bone md:text-7xl">
                  Heavy is a
                  <br />
                  standard,
                  <br />
                  <span className="font-accent normal-case italic tracking-normal text-brass">
                    not a style.
                  </span>
                </h2>
                <p className="mt-6 max-w-md text-base leading-7 text-ash">
                  The hoodie line carries the same discipline as the tees:
                  heavyweight fleece, built heavy — no thin layers. When the
                  session ends and the dock gets cold, this is the layer.
                </p>
                <div className="mt-8 flex flex-wrap gap-x-10 gap-y-3 border-t border-seam pt-6 text-[11px] font-semibold uppercase tracking-[0.22em] text-bone/75">
                  <span>
                    This piece — <span className="text-brass">Heavyweight</span>
                  </span>
                  <span>{money(hoodieFeature.priceMin)}</span>
                  <span>XS–2XL</span>
                </div>
                <Link
                  href="/collections/hoodies"
                  className="mt-9 inline-block border border-bone/30 px-9 py-4 font-display text-base uppercase tracking-[0.14em] text-bone transition-colors hover:border-brass hover:text-brass"
                >
                  Shop hoodies
                </Link>
              </Reveal>
            </div>
          </div>
        </section>
      )}

      {/* ——— WOMEN'S — asymmetric: one tall feature, then the rack ——— */}
      <section className="mx-auto max-w-[1440px] px-5 py-24 md:px-10 md:py-32">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <h2 className="font-display text-6xl uppercase leading-[0.9] text-bone md:text-7xl">
              Women&apos;s collection
            </h2>
            <Link
              href="/collections/womens-collection"
              className="text-[12px] uppercase tracking-[0.2em] text-ash transition-colors hover:text-brass"
            >
              Shop women&apos;s →
            </Link>
          </div>
        </Reveal>
        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          {womens[0]?.images[0] && (
            <Reveal className="h-full lg:row-span-2">
              <Link
                href={`/products/${womens[0].handle}`}
                className="group relative block h-full min-h-[420px] overflow-hidden"
              >
                <Image
                  src={womens[0].images[0].url}
                  alt={womens[0].images[0].alt}
                  fill
                  sizes="(max-width: 1024px) 100vw, 33vw"
                  className="hero-drift object-cover object-top transition-transform duration-[1400ms] group-hover:scale-[1.04]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-transparent to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-7">
                  <p className="text-[11px] font-semibold uppercase tracking-mega text-brass">
                    Featured
                  </p>
                  <h3 className="mt-2 font-display text-4xl uppercase leading-[0.95] text-bone">
                    {womens[0].title}
                  </h3>
                  <p className="mt-2 text-sm text-bone/80">
                    {money(womens[0].priceMin)}
                  </p>
                </div>
              </Link>
            </Reveal>
          )}
          {womens.slice(1, 4).map((p, i) => (
            <Reveal key={p.handle} delay={i * 80}>
              <ProductCard product={p} />
            </Reveal>
          ))}
          <Reveal delay={160}>
            <div className="flex h-full min-h-[240px] flex-col justify-between bg-brass p-7 text-ink">
              <p className="font-display text-4xl uppercase leading-[0.95]">
                {womens.length} pieces.
                <br />
                Same standard.
              </p>
              <Link
                href="/collections/womens-collection"
                className="mt-8 inline-block font-display text-base uppercase tracking-[0.12em] underline decoration-2 underline-offset-8"
              >
                Shop the full rack →
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ——— WORLD STORY (live world-experience film panel) ——— */}
      <WorldStory />

      {/* ——— BLACK FRIDAY CAPTURE — a poster over the Iron film ——— */}
      <section className="grain relative overflow-hidden border-y border-seam">
        <div className="absolute inset-0">
          <Film
            src={HERO_WORLDS[1].film}
            poster={HERO_WORLDS[1].poster}
            label="Black Friday"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-ink/85 via-ink/70 to-ink/90" />
        <span
          aria-hidden="true"
          className="text-stroke-brass pointer-events-none absolute -right-4 top-1/2 hidden -translate-y-1/2 select-none font-display text-[15rem] leading-none lg:block"
        >
          27–30
        </span>
        <div className="relative mx-auto max-w-[1440px] px-5 py-28 md:px-10 md:py-36">
          <Reveal>
            <p className="text-[11px] font-semibold uppercase tracking-mega text-brass">
              06 · November 27–30
            </p>
            <h2 className="mt-4 max-w-3xl font-display text-6xl uppercase leading-[0.9] text-bone md:text-8xl">
              Black Friday.
              <br />
              <span className="font-accent normal-case italic tracking-normal text-brass">
                The list hears first.
              </span>
            </h2>
            <p className="mt-6 max-w-xl text-base leading-7 text-bone/75">
              Four days. The heaviest tee in the game on the biggest weekend
              of the year. Leave your email and you are on it — first word
              when the drop opens, the Black Friday draw, and anything heavy
              we release between now and then. One list. No noise.
            </p>
            <div className="mt-10">
              <CaptureForm source="bf-early-access" />
            </div>
          </Reveal>
        </div>
      </section>

      {/* ——— MANIFESTO ——— */}
      <section className="mx-auto max-w-[1100px] px-5 py-32 text-center md:py-44">
        <Reveal>
          <p className="font-display text-5xl uppercase leading-[1.02] text-bone md:text-7xl">
            Some tees are bought.
            <br />
            Ours are{" "}
            <span className="font-accent normal-case italic tracking-normal text-brass">
              earned.
            </span>
          </p>
          <p className="mx-auto mt-8 max-w-xl text-base leading-7 text-ash">
            Forged under the bar and finished on the water — Anchor Me Down
            is built for the people who train before the sun is up and tie
            off after it goes down.
          </p>
          <p className="mt-12 text-[12px] uppercase tracking-mega text-ash">
            Stay Anchored
          </p>
        </Reveal>
      </section>
    </>
  );
}
