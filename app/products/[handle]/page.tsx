import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProductCard from "@/components/ProductCard";
import PurchasePanel from "@/components/PurchasePanel";
import Reveal from "@/components/Reveal";
import { getAllProducts, getProduct, getRelatedProducts } from "@/lib/catalog";

export function generateStaticParams() {
  return getAllProducts().map((p) => ({ handle: p.handle }));
}

export function generateMetadata({
  params,
}: {
  params: Promise<{ handle: string }>;
}): Promise<Metadata> {
  return params.then(({ handle }) => {
    const p = getProduct(handle);
    if (!p) return { title: "Anchor Me Down" };
    return {
      title: `${p.title} — Anchor Me Down Apparel`,
      description:
        p.description.slice(0, 155) ||
        "425 GSM. The heaviest tee in the game. Built between the iron and the water.",
    };
  });
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const { handle } = await params;
  const product = getProduct(handle);
  if (!product) notFound();
  const related = getRelatedProducts(product, 4);

  // Structured data parity: the live theme gets its product schema from
  // Avada SEO snippets; the headless build generates it natively.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.description.slice(0, 500),
    image: product.images.map((i) => i.url),
    brand: { "@type": "Brand", name: "Anchor Me Down Apparel" },
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "USD",
      lowPrice: product.priceMin.toFixed(2),
      highPrice: product.priceMax.toFixed(2),
      offerCount: product.variants.length,
      availability: product.variants.some((v) => v.availableForSale)
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
    },
  };

  return (
    <div className="mx-auto max-w-[1440px] px-5 pb-24 pt-36 md:px-10 md:pt-40">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PurchasePanel product={product} />

      {/* Description — the product's own live copy, incl. its fabric facts */}
      <div className="mt-20 grid gap-10 border-t border-seam pt-14 lg:grid-cols-[1fr_2fr]">
        <h2 className="font-display text-3xl uppercase tracking-wide text-bone">
          The details
        </h2>
        <div
          className="product-desc max-w-3xl"
          dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
        />
      </div>

      {related.length > 0 && (
        <section className="mt-24">
          <Reveal>
            <h2 className="font-display text-4xl uppercase text-bone">
              Complete the rotation
            </h2>
          </Reveal>
          <div className="mt-8 grid grid-cols-2 gap-x-5 gap-y-10 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.handle} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
