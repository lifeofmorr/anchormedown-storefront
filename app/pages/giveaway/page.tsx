import { notFound } from "next/navigation";
import ProductCard from "@/components/ProductCard";
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

  return (
    <div className="mx-auto max-w-[1100px] px-5 pb-24 pt-36 md:px-10 md:pt-40">
      <p className="text-[11px] font-semibold uppercase tracking-mega text-brass">
        Giveaway
      </p>
      <h1 className="mt-3 font-display text-6xl uppercase leading-[0.92] text-bone md:text-7xl">
        The 5 are named
      </h1>
      <div
        className="page-body mt-6"
        dangerouslySetInnerHTML={{ __html: page.bodyHtml }}
      />
      {featured.length > 0 && (
        <div className="mt-14 grid grid-cols-2 gap-x-5 gap-y-10 lg:grid-cols-3">
          {featured.map((p) => (
            <ProductCard key={p.handle} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
