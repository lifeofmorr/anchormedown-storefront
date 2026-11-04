import SiteSearch, {
  type SearchArticle,
  type SearchProduct,
} from "@/components/SiteSearch";
import { getAllArticles } from "@/lib/blog";
import { getAllCollections, getAllProducts } from "@/lib/catalog";

export const metadata = {
  title: "Search — Anchor Me Down Apparel",
  description:
    "Search every Anchor Me Down product and journal dispatch — by name, fabric weight, collection, or story.",
};

/**
 * /search — server-built slim index over the typed catalog + blog
 * exports, searched client-side in components/SiteSearch.tsx.
 * Accepts ?q= so links like /search?q=425 land on live results.
 */
export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const collectionTitles = new Map(
    getAllCollections().map((c) => [c.handle, c.title])
  );

  const products: SearchProduct[] = getAllProducts().map((p) => {
    const collectionNames = p.collections
      .map((h) => collectionTitles.get(h) ?? h)
      .join(" ");
    return {
      handle: p.handle,
      title: p.title,
      productType: p.productType,
      tags: p.tags,
      gsm: p.gsm,
      collections: p.collections,
      priceMin: p.priceMin,
      priceMax: p.priceMax,
      image: p.images[0]?.url ?? null,
      haystack: [
        p.title,
        p.productType,
        p.tags.join(" "),
        collectionNames,
        p.gsm !== null ? `${p.gsm} gsm ${p.gsm}gsm` : "",
      ]
        .join(" ")
        .toLowerCase(),
    };
  });

  const articles: SearchArticle[] = getAllArticles().map((a) => ({
    handle: a.handle,
    title: a.title,
    tags: a.tags,
    excerpt: a.excerpt,
    publishedAt: a.publishedAt,
    image: a.image?.url ?? null,
    haystack: [a.title, a.tags.join(" "), a.excerpt].join(" ").toLowerCase(),
  }));

  return (
    <div className="mx-auto max-w-[1440px] px-5 pb-24 pt-36 md:px-10 md:pt-40">
      <p className="text-[11px] font-semibold uppercase tracking-mega text-brass">
        Search
      </p>
      <h1 className="mt-3 font-display text-6xl uppercase leading-[0.9] text-bone md:text-8xl">
        Find your heavy
      </h1>
      <SiteSearch products={products} articles={articles} initialQuery={q ?? ""} />
    </div>
  );
}
