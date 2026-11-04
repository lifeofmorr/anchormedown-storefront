import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import { getAllCollections, getProduct } from "@/lib/catalog";

export const metadata = { title: "Collections — Anchor Me Down Apparel" };

/**
 * The rack, set editorially: the first collection takes a wide feature
 * tile, the rest fall into an offset rhythm of tall and wide — no two
 * rows alike, every tile the collection's own photography.
 */
export default function CollectionsIndex() {
  const collections = getAllCollections();
  const [feature, ...rest] = collections;

  const tile = (
    c: (typeof collections)[number],
    ratio: string,
    sizes: string
  ) => {
    const first = getProduct(c.productHandles[0]);
    const img = c.image ?? first?.images[0]?.url;
    return (
      <Link
        href={`/collections/${c.handle}`}
        className={`group relative block ${ratio} overflow-hidden bg-coal`}
      >
        {img && (
          <Image
            src={img}
            alt={c.title}
            fill
            sizes={sizes}
            className="object-cover object-top opacity-80 transition-all duration-700 group-hover:scale-[1.05] group-hover:opacity-100"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/20 to-transparent" />
        <div className="absolute bottom-0 left-0 p-6 md:p-8">
          <h2 className="font-display text-3xl uppercase text-bone md:text-4xl">
            {c.title}
          </h2>
          <p className="mt-1 text-[11px] uppercase tracking-[0.2em] text-bone/70">
            {c.productHandles.length} products
          </p>
        </div>
        <span className="absolute right-6 top-6 font-display text-lg text-bone/0 transition-all duration-500 group-hover:text-brass">
          →
        </span>
      </Link>
    );
  };

  return (
    <div className="mx-auto max-w-[1440px] px-5 pb-24 pt-36 md:px-10 md:pt-40">
      <p className="text-[11px] font-semibold uppercase tracking-mega text-brass">
        The Rack
      </p>
      <h1 className="mt-3 font-display text-6xl uppercase leading-[0.9] text-bone md:text-9xl">
        Collections
      </h1>
      <p className="mt-5 max-w-xl text-base leading-7 text-ash">
        Ten racks, one standard: the weight is printed where it is verified,
        and the photography is the product itself.
      </p>

      {feature && (
        <Reveal className="mt-14">
          {tile(feature, "aspect-[16/9] md:aspect-[21/9]", "100vw")}
        </Reveal>
      )}
      <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {rest.map((c, i) => (
          <div key={c.handle} className={i % 3 === 1 ? "lg:mt-10" : ""}>
            <Reveal delay={(i % 3) * 80}>
              {tile(c, "aspect-[4/3]", "(max-width: 1024px) 50vw, 33vw")}
            </Reveal>
          </div>
        ))}
      </div>
    </div>
  );
}
