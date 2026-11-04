import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProductCard from "@/components/ProductCard";
import Reveal from "@/components/Reveal";
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

  return (
    <div className="mx-auto max-w-[1440px] px-5 pb-24 pt-36 md:px-10 md:pt-40">
      <Reveal>
        <p className="text-[11px] font-semibold uppercase tracking-mega text-brass">
          Collection
        </p>
        <h1 className="mt-3 font-display text-6xl uppercase leading-[0.92] text-bone md:text-8xl">
          {collection.title}
        </h1>
        {collection.description && (
          <p className="mt-5 max-w-2xl text-base leading-7 text-ash">
            {collection.description}
          </p>
        )}
        <p className="mt-4 text-[12px] uppercase tracking-[0.2em] text-ash">
          {products.length} products
        </p>
      </Reveal>
      <div className="mt-12 grid grid-cols-2 gap-x-5 gap-y-10 lg:grid-cols-4">
        {products.map((p, i) => (
          <Reveal key={p.handle} delay={(i % 4) * 60}>
            <ProductCard product={p} />
          </Reveal>
        ))}
      </div>
    </div>
  );
}
