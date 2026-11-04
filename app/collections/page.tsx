import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import { getAllCollections, getProduct } from "@/lib/catalog";

export const metadata = { title: "Collections — Anchor Me Down Apparel" };

export default function CollectionsIndex() {
  const collections = getAllCollections();
  return (
    <div className="mx-auto max-w-[1440px] px-5 pb-24 pt-36 md:px-10 md:pt-40">
      <p className="text-[11px] font-semibold uppercase tracking-mega text-brass">
        The Rack
      </p>
      <h1 className="mt-3 font-display text-6xl uppercase leading-[0.92] text-bone md:text-8xl">
        Collections
      </h1>
      <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {collections.map((c, i) => {
          const first = getProduct(c.productHandles[0]);
          const img = c.image ?? first?.images[0]?.url;
          return (
            <Reveal key={c.handle} delay={(i % 3) * 80}>
              <Link
                href={`/collections/${c.handle}`}
                className="group relative block aspect-[4/3] overflow-hidden bg-coal"
              >
                {img && (
                  <Image
                    src={img}
                    alt={c.title}
                    fill
                    sizes="(max-width: 1024px) 50vw, 33vw"
                    className="object-cover object-top opacity-80 transition-all duration-700 group-hover:scale-[1.05] group-hover:opacity-100"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/20 to-transparent" />
                <div className="absolute bottom-0 left-0 p-6">
                  <h2 className="font-display text-3xl uppercase text-bone">
                    {c.title}
                  </h2>
                  <p className="mt-1 text-[11px] uppercase tracking-[0.2em] text-bone/70">
                    {c.productHandles.length} products
                  </p>
                </div>
              </Link>
            </Reveal>
          );
        })}
      </div>
    </div>
  );
}
