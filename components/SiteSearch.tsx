"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { priceLabel } from "@/lib/format";
import { displayTag } from "@/lib/display-tag";

export interface SearchProduct {
  handle: string;
  title: string;
  productType: string;
  tags: string[];
  /** Internal data plumbing for the silent legacy-token match — never rendered. */
  weightValue: number | null;
  /** True for the verified heaviest line — drives the word badge. */
  heaviest: boolean;
  collections: string[];
  priceMin: number;
  priceMax: number;
  image: string | null;
  haystack: string;
}

export interface SearchArticle {
  handle: string;
  title: string;
  tags: string[];
  excerpt: string;
  publishedAt: string;
  image: string | null;
  haystack: string;
}

function score(haystack: string, tokens: string[]): number {
  let s = 0;
  for (const t of tokens) if (haystack.includes(t)) s += 1;
  return s;
}

/**
 * Site search — real client-side search over the typed catalog + blog
 * exports. Token match across title, tags, weight class, collection,
 * type (and article title/tags/excerpt). Word queries ("heaviest")
 * find the heavy line through the index's word tokens; a bare legacy
 * number token also matches silently through the server-built index —
 * neither the number nor the unit is ever displayed (brand language
 * ruling, 2026-11-03). Results render as product and article cards.
 */
export default function SiteSearch({
  products,
  articles,
  initialQuery,
}: {
  products: SearchProduct[];
  articles: SearchArticle[];
  initialQuery: string;
}) {
  const [query, setQuery] = useState(initialQuery);

  const tokens = useMemo(
    () => query.toLowerCase().split(/[^a-z0-9]+/).filter(Boolean),
    [query]
  );

  const productHits = useMemo(() => {
    if (!tokens.length) return [];
    const numeric = tokens.map((t) => (/^\d+$/.test(t) ? parseInt(t, 10) : null));
    return products
      .map((p) => {
        let s = score(p.haystack, tokens);
        numeric.forEach((n) => {
          if (n !== null && p.weightValue === n) s += 2;
        });
        return { p, s };
      })
      .filter((x) => x.s >= Math.min(tokens.length, 1) && x.s > 0)
      .sort((a, b) => b.s - a.s || a.p.title.localeCompare(b.p.title))
      .map((x) => x.p);
  }, [products, tokens]);

  const articleHits = useMemo(() => {
    if (!tokens.length) return [];
    return articles
      .map((a) => ({ a, s: score(a.haystack, tokens) }))
      .filter((x) => x.s > 0)
      .sort((a, b) => b.s - a.s || b.a.publishedAt.localeCompare(a.a.publishedAt))
      .map((x) => x.a);
  }, [articles, tokens]);

  const searched = tokens.length > 0;

  return (
    <div>
      <form
        role="search"
        onSubmit={(e) => e.preventDefault()}
        className="mt-10 flex max-w-2xl items-center gap-3 border border-seam bg-coal px-5 py-4"
      >
        <span aria-hidden="true" className="font-display text-brass">⌕</span>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Try “heaviest”, “hoodie”, “giveaway”, “iron”…"
          aria-label="Search products and the journal"
          className="w-full bg-transparent text-base text-bone placeholder:text-ash focus:outline-none"
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery("")}
            className="text-[11px] uppercase tracking-[0.2em] text-ash hover:text-brass"
          >
            Clear
          </button>
        )}
      </form>

      {!searched && (
        <p className="mt-10 max-w-xl text-sm leading-6 text-ash">
          Search the whole rack and all {articles.length} journal dispatches
          — by product, collection, or story.
        </p>
      )}

      {searched && (
        <p className="mt-10 text-[11px] uppercase tracking-[0.2em] text-ash">
          {productHits.length} products · {articleHits.length} dispatches
          {productHits.length + articleHits.length === 0 &&
            " — nothing on the rack matches that. Try a garment, a collection, or a plainer word."}
        </p>
      )}

      {productHits.length > 0 && (
        <section className="mt-10">
          <h2 className="font-display text-3xl uppercase text-bone">Products</h2>
          <div className="mt-6 grid grid-cols-2 gap-5 lg:grid-cols-4">
            {productHits.map((p) => (
              <Link key={p.handle} href={`/products/${p.handle}`} className="group block">
                <div className="relative aspect-[4/5] overflow-hidden bg-coal">
                  {p.image && (
                    <Image
                      src={p.image}
                      alt={p.title}
                      fill
                      sizes="(max-width: 768px) 50vw, 25vw"
                      className="object-cover transition-all duration-700 group-hover:scale-[1.04]"
                    />
                  )}
                  {p.heaviest && (
                    <span className="absolute left-3 top-3 bg-ink/85 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-brass">
                      The Heaviest
                    </span>
                  )}
                </div>
                <h3 className="mt-3 text-sm font-semibold uppercase tracking-wide text-bone group-hover:text-brass">
                  {p.title}
                </h3>
                <p className="mt-1 text-sm text-ash">
                  {priceLabel(p.priceMin, p.priceMax)}
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {articleHits.length > 0 && (
        <section className="mt-16">
          <h2 className="font-display text-3xl uppercase text-bone">The Journal</h2>
          <div className="mt-4 border-t border-seam">
            {articleHits.map((a) => (
              <Link
                key={a.handle}
                href={`/blog/${a.handle}`}
                className="group grid gap-4 border-b border-seam py-6 md:grid-cols-[200px_1fr] md:gap-8"
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-coal">
                  {a.image ? (
                    <Image
                      src={a.image}
                      alt={a.title}
                      fill
                      sizes="200px"
                      className="object-cover opacity-85 transition-all duration-700 group-hover:scale-[1.05] group-hover:opacity-100"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-coal via-ink to-coal" />
                  )}
                </div>
                <div>
                  <p className="text-[11px] uppercase tracking-[0.2em] text-ash">
                    {new Date(a.publishedAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      timeZone: "UTC",
                    })}
                    {displayTag(a.tags) ? ` · ${displayTag(a.tags)}` : ""}
                  </p>
                  <h3 className="mt-1.5 font-display text-2xl uppercase leading-tight text-bone transition-colors group-hover:text-brass">
                    {a.title}
                  </h3>
                  {a.excerpt && (
                    <p className="mt-2 max-w-2xl text-sm leading-6 text-ash">{a.excerpt}</p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
