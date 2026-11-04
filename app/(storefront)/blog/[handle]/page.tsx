import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import ProductCard from "@/components/ProductCard";
import {
  displayTag,
  getAllArticles,
  getArticle,
  getArticleRelatedProducts,
  getRelatedArticles,
} from "@/lib/blog";

export function generateStaticParams() {
  return getAllArticles().map((a) => ({ handle: a.handle }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ handle: string }>;
}): Promise<Metadata> {
  const { handle } = await params;
  const article = getArticle(handle);
  if (!article) return {};
  return {
    title: `${article.title} — Anchor Me Down Apparel`,
    description: article.excerpt || undefined,
    openGraph: {
      title: article.title,
      description: article.excerpt || undefined,
      type: "article",
      publishedTime: article.publishedAt,
      modifiedTime: article.updatedAt,
      authors: [article.author],
      images: article.image ? [article.image.url] : undefined,
    },
  };
}

function fmtDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

/**
 * Journal article — full body HTML from the live store blog, a hero
 * image where the article carries one, the products the piece points
 * at (every rail ends in the conversion path), and Article JSON-LD.
 * URL parity: anchormedown.com/blogs/news/<handle> serves this same
 * article; /blogs/news/* rewrites to /blog/* (see next.config.mjs).
 */
export default async function ArticlePage({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const { handle } = await params;
  const article = getArticle(handle);
  if (!article) notFound();

  const related = getArticleRelatedProducts(article);
  const more = getRelatedArticles(article);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.excerpt || undefined,
    image: article.image ? [article.image.url] : undefined,
    datePublished: article.publishedAt,
    dateModified: article.updatedAt,
    author: { "@type": "Organization", name: article.author },
    publisher: {
      "@type": "Organization",
      name: "Anchor Me Down Apparel",
      url: "https://anchormedown.com",
    },
    mainEntityOfPage: `https://anchormedown.com/blogs/news/${article.handle}`,
  };

  return (
    <article className="mx-auto max-w-[1440px] px-5 pb-24 pt-36 md:px-10 md:pt-40">
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
        <Link href="/blog" className="transition-colors hover:text-brass">
          The Journal
        </Link>
        <span aria-hidden="true">/</span>
        <span className="text-bone">{article.title}</span>
      </nav>

      <header className="max-w-4xl">
        <p className="text-[11px] font-semibold uppercase tracking-mega text-brass">
          {fmtDate(article.publishedAt)}
          {displayTag(article.tags) ? ` · ${displayTag(article.tags)}` : ""}
        </p>
        <h1 className="mt-4 font-display text-5xl uppercase leading-[0.92] text-bone md:text-7xl">
          {article.title}
        </h1>
        {article.excerpt && (
          <p className="mt-6 max-w-2xl text-lg leading-8 text-ash">
            {article.excerpt}
          </p>
        )}
        <p className="mt-6 text-[11px] uppercase tracking-[0.2em] text-ash">
          By {article.author}
        </p>
      </header>

      {article.image && (
        <div className="relative mt-12 aspect-[16/8] overflow-hidden bg-coal">
          <Image
            src={article.image.url}
            alt={article.image.alt}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        </div>
      )}

      <div
        className="page-body mt-14 max-w-3xl"
        dangerouslySetInnerHTML={{ __html: article.bodyHtml }}
      />

      {related.length > 0 && (
        <section className="mt-24 border-t border-seam pt-16">
          <p className="text-[11px] font-semibold uppercase tracking-mega text-brass">
            From this dispatch
          </p>
          <h2 className="mt-3 font-display text-4xl uppercase leading-[0.95] text-bone md:text-6xl">
            Shop the <span className="font-accent normal-case italic tracking-normal text-brass">story.</span>
          </h2>
          <div className="mt-10 grid grid-cols-2 gap-5 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.handle} product={p} />
            ))}
          </div>
        </section>
      )}

      {more.length > 0 && (
        <section className="mt-24 border-t border-seam pt-16">
          <p className="text-[11px] font-semibold uppercase tracking-mega text-brass">
            Keep reading
          </p>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {more.map((a) => (
              <Link
                key={a.handle}
                href={`/blog/${a.handle}`}
                className="group relative block aspect-[4/3] overflow-hidden bg-coal"
              >
                {a.image ? (
                  <Image
                    src={a.image.url}
                    alt={a.image.alt}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover opacity-80 transition-all duration-700 group-hover:scale-[1.05] group-hover:opacity-100"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-coal via-ink to-coal" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-ink/95 via-ink/30 to-transparent" />
                <div className="absolute bottom-0 left-0 p-5">
                  <p className="text-[11px] uppercase tracking-[0.2em] text-bone/70">
                    {fmtDate(a.publishedAt)}
                  </p>
                  <h3 className="mt-1 font-display text-xl uppercase leading-tight text-bone">
                    {a.title}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
