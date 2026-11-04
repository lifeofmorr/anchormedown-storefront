import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import ProductCard from "@/components/ProductCard";
import PurchasePanel from "@/components/PurchasePanel";
import Reveal from "@/components/Reveal";
import Film from "@/components/Film";
import { getCampaignEntry } from "@/lib/campaign";
import { priceLabel } from "@/lib/format";
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
        "The heaviest tee in the game. Built between the iron and the water.",
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

  // Spec sheet — every value computed from the product's own catalog data.
  const sizeOpt = product.options.find((o) => o.name.toLowerCase().includes("size"));
  const colorOpt = product.options.find((o) => o.name.toLowerCase().includes("color"));
  const specs: Array<[string, string]> = [
    ["Price", priceLabel(product.priceMin, product.priceMax)],
    ...(sizeOpt ? [["Sizes", sizeOpt.values.join(" · ")] as [string, string]] : []),
    ...(colorOpt
      ? [[
          "Colorways",
          `${colorOpt.values.length} — ${colorOpt.values.slice(0, 4).join(", ")}${colorOpt.values.length > 4 ? "…" : ""}`,
        ] as [string, string]]
      : []),
    ["Variants", `${product.variants.length} — real Shopify variant IDs at checkout`],
  ];

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
      <nav
        aria-label="Breadcrumb"
        className="mb-10 flex flex-wrap items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-ash"
      >
        <Link href="/" className="transition-colors hover:text-brass">
          Home
        </Link>
        <span aria-hidden="true">/</span>
        <Link href="/collections" className="transition-colors hover:text-brass">
          Collections
        </Link>
        <span aria-hidden="true">/</span>
        <span className="text-bone">{product.title}</span>
      </nav>

      <PurchasePanel product={product} />

      {/* Details — the product's own live copy beside its measured spec sheet */}
      <div className="mt-24 border-t border-seam pt-16">
        <Reveal>
          <p className="text-[11px] font-semibold uppercase tracking-mega text-brass">
            The Details
          </p>
          <h2 className="mt-3 max-w-2xl font-display text-4xl uppercase leading-[0.95] text-bone md:text-6xl">
            Measured, <span className="font-accent normal-case italic tracking-normal text-brass">not marketed.</span>
          </h2>
        </Reveal>
        <div className="mt-12 grid gap-12 lg:grid-cols-[1fr_400px] lg:gap-20">
          <div
            className="product-desc max-w-3xl"
            dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
          />
          <div>
            <dl className="border-t border-seam">
              {specs.map(([k, v]) => (
                <div
                  key={k}
                  className="grid grid-cols-[110px_1fr] gap-4 border-b border-seam py-4"
                >
                  <dt className="text-[11px] uppercase tracking-[0.2em] text-ash">
                    {k}
                  </dt>
                  <dd className="text-sm leading-6 text-bone">{v}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-5 text-[12px] leading-5 text-ash">
              Every number on this page comes off the product itself — its
              own description, its own variants, its own price.
            </p>
          </div>
        </div>
      </div>

      {/* The campaign band — this colorway's plates/film from the live
          campaign manifest, where the manifest carries them. */}
      {(() => {
        const entry = getCampaignEntry(product.handle);
        if (!entry?.front) return null;
        return (
          <section className="mt-24 border-t border-seam pt-16">
            <Reveal>
              <p className="text-[11px] font-semibold uppercase tracking-mega text-brass">
                The Campaign — {entry.colorway}
              </p>
              <h2 className="mt-3 font-display text-4xl uppercase leading-[0.95] text-bone md:text-6xl">
                As <span className="font-accent normal-case italic tracking-normal text-brass">shot.</span>
              </h2>
            </Reveal>
            <div className="mt-10 grid gap-5 md:grid-cols-2">
              <figure className="relative aspect-[4/5] overflow-hidden bg-coal">
                <Image
                  src={entry.front}
                  alt={`${product.title} — campaign front, ${entry.colorway}`}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                />
                <figcaption className="absolute bottom-3 left-3 bg-ink/75 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-bone backdrop-blur">
                  Front
                </figcaption>
              </figure>
              {entry.film ? (
                <div className="relative aspect-[4/5] overflow-hidden bg-coal">
                  <Film
                    src={entry.film}
                    poster={entry.front}
                    label={`${product.title} campaign`}
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
              ) : entry.back ? (
                <figure className="relative aspect-[4/5] overflow-hidden bg-coal md:mt-14">
                  <Image
                    src={entry.back}
                    alt={`${product.title} — campaign back, ${entry.colorway}`}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover"
                  />
                  <figcaption className="absolute bottom-3 left-3 bg-ink/75 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-bone backdrop-blur">
                    Back — the print
                  </figcaption>
                </figure>
              ) : null}
            </div>
            <p className="mt-5 text-[12px] leading-5 text-ash">
              Campaign plate — {product.title} in {entry.colorway}, from the
              live campaign manifest. The gallery above is the garment
              itself; this is the garment in the world.
            </p>
          </section>
        );
      })()}

      {related.length > 0 && (
        <section className="mt-28">
          <Reveal>
            <p className="text-[11px] font-semibold uppercase tracking-mega text-brass">
              Keep Going
            </p>
            <h2 className="mt-3 font-display text-4xl uppercase text-bone md:text-5xl">
              Complete the rotation
            </h2>
          </Reveal>
          <div className="mt-10 grid grid-cols-2 gap-x-5 gap-y-12 lg:grid-cols-4">
            {related.map((p, i) => (
              <div key={p.handle} className={i % 4 === 1 || i % 4 === 3 ? "lg:mt-10" : ""}>
                <ProductCard product={p} />
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
