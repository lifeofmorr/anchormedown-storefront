import Image from "next/image";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import Reveal from "@/components/Reveal";
import CaptureForm from "@/components/CaptureForm";
import HeroWorlds from "@/components/HeroWorlds";
import CampaignFilms from "@/components/CampaignFilms";
import Runway from "@/components/Runway";
import WorldStory from "@/components/WorldStory";
import {
  getCollectionProducts,
  getProduct,
  getVerifiedGsmProducts,
} from "@/lib/catalog";

export default function HomePage() {
  const heroes425 = getVerifiedGsmProducts(425);
  const bestSellers = getCollectionProducts("best-sellers");
  const womens = getCollectionProducts("womens-collection");
  const standard = getProduct("anchor-standard");
  const hoodieFeature = getProduct("mini-anchor-hoodie");

  return (
    <>
      {/* ——— HERO ——— */}
      <section className="relative flex min-h-[100svh] items-end overflow-hidden">
        <HeroWorlds />
        <div className="relative mx-auto w-full max-w-[1440px] px-5 pb-20 pt-44 md:px-10">
          <p className="text-[11px] font-semibold uppercase tracking-mega text-brass">
            Heavyweight Apparel — Iron × Water
          </p>
          <h1 className="mt-5 font-display uppercase leading-[0.88] text-bone text-[19vw] sm:text-[15vw] lg:text-[10.5rem]">
            425 GSM.
          </h1>
          <p className="mt-2 font-display text-[7.5vw] uppercase leading-[0.95] text-bone/90 sm:text-5xl lg:text-6xl">
            The heaviest tee in the game.
          </p>
          <p className="mt-6 max-w-xl text-base leading-7 text-bone/75">
            Built between the iron and the water. Garment-dyed, boxy, cut to be
            trained in and lived in — with the fabric weight printed on every
            page, because we don&apos;t hide ours.
          </p>
          <div className="mt-9 flex flex-wrap gap-4">
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
        </div>
      </section>

      {/* ——— MARQUEE ——— */}
      <div className="overflow-hidden border-y border-seam bg-coal py-4">
        <div className="marquee-track flex w-max gap-10 whitespace-nowrap font-display text-lg uppercase tracking-[0.25em] text-bone/60">
          {Array.from({ length: 2 }).map((_, dup) => (
            <span key={dup} className="flex gap-10">
              {[
                "Stay Anchored",
                "425 GSM",
                "Iron × Water",
                "Heaviest Tee In The Game",
                "Free Shipping $200+",
                "Nov 27–30: Free Shipping $75+",
              ].map((t) => (
                <span key={t} className="flex items-center gap-10">
                  {t} <span className="text-brass">⚓</span>
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>

      {/* ——— CAMPAIGN FILMS (live position 2) ——— */}
      <CampaignFilms />

      {/* ——— THE 425 LINE ——— */}
      <section className="mx-auto max-w-[1440px] px-5 py-24 md:px-10 md:py-32">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-mega text-brass">
                The Verified Heavyweights
              </p>
              <h2 className="mt-3 font-display text-5xl uppercase leading-[0.95] text-bone md:text-7xl">
                The 425 line
              </h2>
            </div>
            <p className="max-w-sm text-sm leading-6 text-ash">
              Thirteen tees. One fabric weight, printed on every product page:
              425 grams per square meter of garment-dyed cotton. Most brands
              won&apos;t tell you theirs.
            </p>
          </div>
        </Reveal>
        <div className="mt-12 grid grid-cols-2 gap-x-5 gap-y-10 lg:grid-cols-4">
          {heroes425.slice(0, 8).map((p, i) => (
            <Reveal key={p.handle} delay={(i % 4) * 80}>
              <ProductCard product={p} />
            </Reveal>
          ))}
        </div>
        <Reveal className="mt-12 text-center">
          <Link
            href="/collections/t-shirts-1"
            className="inline-block border border-bone/30 px-9 py-4 font-display text-base uppercase tracking-[0.14em] text-bone transition-colors hover:border-brass hover:text-brass"
          >
            Shop all tees
          </Link>
        </Reveal>
      </section>

      {/* ——— FULL-BLEED FEATURE: ANCHOR STANDARD ——— */}
      {standard?.images[0] && (
        <section className="relative overflow-hidden">
          <div className="relative h-[80vh] min-h-[540px]">
            <Image
              src={standard.images[0].url}
              alt={standard.images[0].alt}
              fill
              sizes="100vw"
              className="object-cover object-top"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-ink/85 via-ink/30 to-transparent" />
            <div className="absolute inset-0 flex items-center">
              <div className="mx-auto w-full max-w-[1440px] px-5 md:px-10">
                <Reveal>
                  <p className="text-[11px] font-semibold uppercase tracking-mega text-brass">
                    The Signature
                  </p>
                  <h2 className="mt-4 max-w-xl font-display text-6xl uppercase leading-[0.92] text-bone md:text-8xl">
                    Anchor
                    <br />
                    Standard
                  </h2>
                  <p className="mt-5 max-w-md text-base leading-7 text-bone/80">
                    The tee the whole line is built on. 425 GSM garment-dyed
                    cotton, boxy cut, XS–2XL — {`$60`}, and it does not need a
                    draw to be worth it.
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
          </div>
        </section>
      )}

      {/* ——— BEST SELLERS ——— */}
      <section className="mx-auto max-w-[1440px] px-5 py-24 md:px-10">
        <Reveal>
          <div className="flex items-end justify-between gap-6">
            <h2 className="font-display text-5xl uppercase leading-[0.95] text-bone md:text-6xl">
              Best sellers
            </h2>
            <Link
              href="/collections/best-sellers"
              className="hidden text-[12px] uppercase tracking-[0.2em] text-ash hover:text-brass sm:block"
            >
              View the rack →
            </Link>
          </div>
        </Reveal>
        <div className="mt-10 grid grid-cols-2 gap-x-5 gap-y-10 lg:grid-cols-4">
          {bestSellers.slice(0, 4).map((p, i) => (
            <Reveal key={p.handle} delay={(i % 4) * 80}>
              <ProductCard product={p} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* ——— SOCIAL RUNWAY (live position 4) ——— */}
      <Runway />

      {/* ——— HOODIE FEATURE ——— */}
      {hoodieFeature?.images[0] && (
        <section className="bg-coal">
          <div className="mx-auto grid max-w-[1440px] items-center gap-0 md:grid-cols-2">
            <div className="relative aspect-[4/5] md:aspect-auto md:h-[720px]">
              <Image
                src={hoodieFeature.images[0].url}
                alt={hoodieFeature.images[0].alt}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover object-top"
              />
            </div>
            <div className="px-5 py-16 md:px-16">
              <Reveal>
                <p className="text-[11px] font-semibold uppercase tracking-mega text-brass">
                  400 GSM — Verified
                </p>
                <h2 className="mt-4 font-display text-5xl uppercase leading-[0.95] text-bone md:text-7xl">
                  Heavy is a
                  <br />
                  standard,
                  <br />
                  not a style.
                </h2>
                <p className="mt-6 max-w-md text-base leading-7 text-ash">
                  The hoodie line carries the same discipline as the tees:
                  380–400 GSM fleece, weights printed on the page. When the
                  session ends and the dock gets cold, this is the layer.
                </p>
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

      {/* ——— WOMEN'S ——— */}
      <section className="mx-auto max-w-[1440px] px-5 py-24 md:px-10">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <h2 className="font-display text-5xl uppercase leading-[0.95] text-bone md:text-6xl">
              Women&apos;s collection
            </h2>
            <Link
              href="/collections/womens-collection"
              className="text-[12px] uppercase tracking-[0.2em] text-ash hover:text-brass"
            >
              Shop women&apos;s →
            </Link>
          </div>
        </Reveal>
        <div className="mt-10 grid grid-cols-2 gap-x-5 gap-y-10 lg:grid-cols-4">
          {womens.slice(0, 4).map((p, i) => (
            <Reveal key={p.handle} delay={(i % 4) * 80}>
              <ProductCard product={p} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* ——— WORLD STORY (live world-experience film panel) ——— */}
      <WorldStory />

      {/* ——— BLACK FRIDAY CAPTURE ——— */}
      <section className="relative overflow-hidden border-y border-seam bg-harbor/25">
        <div className="mx-auto max-w-[1440px] px-5 py-24 md:px-10">
          <Reveal>
            <p className="text-[11px] font-semibold uppercase tracking-mega text-brass">
              November 27–30
            </p>
            <h2 className="mt-4 max-w-3xl font-display text-5xl uppercase leading-[0.95] text-bone md:text-7xl">
              Black Friday.
              <br />
              The list hears first.
            </h2>
            <p className="mt-5 max-w-xl text-base leading-7 text-bone/75">
              Four days. The heaviest tee in the game on the biggest weekend of
              the year. Leave your email and you are on it — first word when
              the drop opens, the Black Friday draw, and anything heavy we
              release between now and then. One list. No noise.
            </p>
            <div className="mt-9">
              <CaptureForm source="homepage" />
            </div>
          </Reveal>
        </div>
      </section>

      {/* ——— MANIFESTO ——— */}
      <section className="mx-auto max-w-[1100px] px-5 py-28 text-center md:py-36">
        <Reveal>
          <p className="font-display text-4xl uppercase leading-[1.05] text-bone md:text-6xl">
            Some tees are bought.
            <br />
            <span className="text-brass">Ours are earned.</span>
          </p>
          <p className="mx-auto mt-7 max-w-xl text-base leading-7 text-ash">
            Forged under the bar and finished on the water — Anchor Me Down is
            built for the people who train before the sun is up and tie off
            after it goes down.
          </p>
          <p className="mt-10 text-[12px] uppercase tracking-mega text-ash">
            Stay Anchored
          </p>
        </Reveal>
      </section>
    </>
  );
}
