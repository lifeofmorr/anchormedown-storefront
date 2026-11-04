import { notFound } from "next/navigation";
import CaptureForm from "@/components/CaptureForm";
import ProductCard from "@/components/ProductCard";
import Reveal from "@/components/Reveal";
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

  return (
    <div className="pt-32 md:pt-36">
      <section className="border-b border-seam bg-harbor/25">
        <div className="mx-auto max-w-[1440px] px-5 py-20 md:px-10">
          <Reveal>
            <p className="text-[11px] font-semibold uppercase tracking-mega text-brass">
              Friday Nov 27 — Monday Nov 30
            </p>
            <h1 className="mt-4 font-display text-[16vw] uppercase leading-[0.88] text-bone sm:text-8xl lg:text-9xl">
              Black Friday
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-bone/80">
              Four days. The heaviest tee in the game, on the biggest weekend
              of the year — and the list hears first.
            </p>
            <p className="mt-3 font-display text-xl uppercase tracking-wide text-brass">
              425 GSM. The heaviest tee in the game. Built between the iron
              and the water.
            </p>
            <div className="mt-10">
              <p className="mb-4 text-[12px] uppercase tracking-[0.22em] text-bone/70">
                First to know: the Black Friday drop
              </p>
              <CaptureForm source="black-friday-page" />
              <p className="mt-3 text-xs text-ash">
                First word when the drop opens, the Black Friday draw, and
                anything heavy we release between now and then. One list. No
                noise. Unsubscribe anytime.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-[1100px] px-5 py-16 md:px-10">
        <div
          className="page-body"
          dangerouslySetInnerHTML={{ __html: page.bodyHtml }}
        />
      </section>

      {heroes.length > 0 && (
        <section className="mx-auto max-w-[1440px] px-5 pb-24 md:px-10">
          <Reveal>
            <h2 className="font-display text-5xl uppercase text-bone">
              The heavyweight line
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-6 text-ash">
              Every hero tee below is 425 GSM garment-dyed cotton, cut boxy,
              XS–2XL, $60 — the fabric weight printed on every product page,
              because we don&apos;t hide ours.
            </p>
          </Reveal>
          <div className="mt-10 grid grid-cols-2 gap-x-5 gap-y-10 lg:grid-cols-4">
            {heroes.slice(0, 4).map((p) => (
              <ProductCard key={p.handle} product={p} />
            ))}
          </div>
          <p className="mt-10 text-center text-[12px] uppercase tracking-[0.2em] text-ash">
            Nov 27–30: free shipping on orders $75+ · Standing: free shipping $200+
          </p>
        </section>
      )}
    </div>
  );
}
