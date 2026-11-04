import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import CollectionGrid from "@/components/CollectionGrid";
import Parallax from "@/components/Parallax";
import { getCampaignEntry } from "@/lib/campaign";
import {
  getAllCollections,
  getCollection,
  getCollectionProducts,
} from "@/lib/catalog";

export function generateStaticParams() {
  return getAllCollections().map((c) => ({ handle: c.handle }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ handle: string }>;
}): Promise<Metadata> {
  const { handle } = await params;
  const c = getCollection(handle);
  return { title: c ? `${c.title} — Anchor Me Down Apparel` : "Anchor Me Down" };
}

export default async function CollectionPage({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const { handle } = await params;
  const collection = getCollection(handle);
  if (!collection) notFound();
  const products = getCollectionProducts(handle);
  // Hero art: the collection's own campaign model still when one exists
  // (luxury layer — model photography over flat product shots), else the
  // collection image, else the first product's photograph. Candidates are
  // tried in an editorial priority order first (the women's campaign
  // pieces lead), then in collection order.
  const HERO_PRIORITY = [
    "roses-boxy-tank",
    "womens-amd-joggers-2",
    "amd-circle-baby-tee",
    "amd-circle-baby-tee-1",
    "roses-boxy-tank-1",
    "anchor-down-hoodie",
    "weighted",
    "scripted",
    "anchor-flower",
    "snow-wash-lite",
  ];
  const frontOf = (h: string) => getCampaignEntry(h)?.front;
  const inCollection = new Set(products.map((p) => p.handle));
  const campaignHero =
    HERO_PRIORITY.filter((h) => inCollection.has(h))
      .map(frontOf)
      .find((f): f is string => Boolean(f)) ??
    products
      .map((p) => frontOf(p.handle))
      .find((f): f is string => Boolean(f));
  const heroImg =
    campaignHero ?? collection.image ?? products[0]?.images[0]?.url;
  const printed = products.filter((p) => p.gsm !== null).length;

  return (
    <div className="pb-24">
      {/* ——— Hero band: the collection as a poster ——— */}
      <section className="relative flex min-h-[72svh] items-end overflow-hidden">
        {heroImg && (
          <Parallax speed={0.09} className="absolute inset-x-0 -inset-y-20">
            <div className="relative h-full w-full">
              <Image
                src={heroImg}
                alt=""
                fill
                priority
                sizes="100vw"
                className="object-cover object-top"
              />
            </div>
          </Parallax>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/55 to-ink/30" />
        <span
          aria-hidden="true"
          className="text-stroke-faint pointer-events-none absolute -right-4 top-24 select-none font-display text-[10rem] leading-none md:text-[15rem]"
        >
          {String(products.length).padStart(2, "0")}
        </span>
        <div className="relative mx-auto w-full max-w-[1440px] px-5 pb-16 pt-48 md:px-10">
          <p className="text-[11px] font-semibold uppercase tracking-mega text-brass">
            Collection
          </p>
          <h1 className="mt-4 font-display text-[15vw] uppercase leading-[0.88] text-bone sm:text-7xl lg:text-9xl">
            {collection.title}
          </h1>
          <div className="mt-6 flex flex-wrap items-end justify-between gap-6">
            {collection.description ? (
              <p className="max-w-2xl text-base leading-7 text-bone/80">
                {collection.description}
              </p>
            ) : (
              <span />
            )}
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-bone/70">
              {products.length} products
              {printed > 0 && (
                <span className="text-brass">
                  {" "}
                  · {printed} with a printed weight
                </span>
              )}
            </p>
          </div>
        </div>
      </section>

      {/* ——— The rack: filterable, staggered ——— */}
      <section className="mx-auto max-w-[1440px] px-5 pt-16 md:px-10">
        <CollectionGrid products={products} />
      </section>
    </div>
  );
}
