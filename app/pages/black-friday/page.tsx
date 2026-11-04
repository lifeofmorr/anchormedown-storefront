import { notFound } from "next/navigation";
import CaptureForm from "@/components/CaptureForm";
import Film from "@/components/Film";
import ProductCard from "@/components/ProductCard";
import Reveal from "@/components/Reveal";
import { HERO_WORLDS } from "@/lib/campaign";
import { getPage, getProduct } from "@/lib/catalog";

export const metadata = {
  title: "Black Friday — Anchor Me Down Apparel",
  description:
    "Black Friday, November 27–30. The heaviest tee in the game on the biggest weekend of the year. The list hears first.",
};

/** Hero products named on the live Black Friday page. */
const HERO_HANDLES = ["college-special", "anchor-standard", "strength", "weighted", "lake-days"];

export default function BlackFridayPage() {
  const page = getPage("black-friday");
  if (!page) notFound();
  const heroes = HERO_HANDLES.map((h) => getProduct(h)).filter(
    (p): p is NonNullable<typeof p> => Boolean(p)
  );
  const iron = HERO_WORLDS[1];

  return (
    <div>
      {/* ——— The poster: the Iron film, full viewport ——— */}
      <section className="grain relative flex min-h-[100svh] items-end overflow-hidden">
        <div className="absolute inset-0 [&_button]:!top-[112px]">
          <Film src={iron.film} poster={iron.poster} label="Black Friday" />
        </div>
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-ink/30" />
        <span
          aria-hidden="true"
          className="text-stroke-brass pointer-events-none absolute -right-4 top-28 select-none font-display text-[11rem] leading-none md:text-[16rem]"
        >
          27–30
        </span>
        <div className="relative mx-auto w-full max-w-[1440px] px-5 pb-20 pt-48 md:px-10">
          <Reveal>
            <p className="text-[11px] font-semibold uppercase tracking-mega text-brass">
              Friday Nov 27 — Monday Nov 30
            </p>
            <h1 className="mt-4 font-display uppercase leading-[0.85] text-bone text-[19vw] sm:text-8xl lg:text-[11rem]">
              Black
              <br />
              Friday
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-bone/85">
              Four days. The heaviest tee in the game, on the biggest weekend
              of the year — and the list hears first.
            </p>
            <p className="mt-3 font-display text-xl uppercase tracking-wide text-brass">
              The heaviest tee in the game. Built between the iron
              and the water.
            </p>
            <div className="mt-10 max-w-xl border border-bone/20 bg-ink/60 p-6 backdrop-blur-md">
              <p className="mb-4 text-[12px] uppercase tracking-[0.22em] text-bone/80">
                First to know: the Black Friday drop
              </p>
              <CaptureForm source="bf-early-access" />
              <p className="mt-3 text-xs leading-5 text-ash">
                First word when the drop opens, the Black Friday draw, and
                anything heavy we release between now and then. One list. No
                noise. Unsubscribe anytime.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ——— The weekend, in writing — the live page body, verbatim ——— */}
      <section className="mx-auto max-w-[1440px] px-5 py-20 md:px-10 md:py-24">
        <div className="grid gap-10 lg:grid-cols-[320px_1fr] lg:gap-20">
          <Reveal>
            <div className="lg:sticky lg:top-36">
              <p className="text-[11px] font-semibold uppercase tracking-mega text-brass">
                In Writing
              </p>
              <h2 className="mt-3 font-display text-4xl uppercase leading-[0.95] text-bone md:text-5xl">
                The weekend,
                <br />
                <span className="font-accent normal-case italic tracking-normal text-brass">
                  on the record.
                </span>
              </h2>
            </div>
          </Reveal>
          <div
            className="page-body max-w-[760px]"
            dangerouslySetInnerHTML={{ __html: page.bodyHtml }}
          />
        </div>
      </section>

      {heroes.length > 0 && (
        <section className="mx-auto max-w-[1440px] px-5 pb-28 md:px-10">
          <Reveal>
            <h2 className="font-display text-5xl uppercase leading-[0.92] text-bone md:text-6xl">
              The heavyweight line
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-6 text-ash">
              Every hero tee below is garment-dyed cotton, cut boxy,
              XS–2XL, $60 — built the heaviest in the game, and you feel
              it the second you pick it up.
            </p>
          </Reveal>
          <div className="mt-12 grid grid-cols-2 gap-x-5 gap-y-12 lg:grid-cols-4">
            {heroes.slice(0, 4).map((p, i) => (
              <div key={p.handle} className={i % 4 === 1 || i % 4 === 3 ? "lg:mt-10" : ""}>
                <ProductCard product={p} />
              </div>
            ))}
          </div>
          <p className="mt-14 border-t border-seam pt-8 text-center text-[12px] uppercase tracking-[0.2em] text-ash">
            Nov 27–30: free shipping on orders $75+ · Standing: free shipping $200+
          </p>
        </section>
      )}
    </div>
  );
}
