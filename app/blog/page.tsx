import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import { getAllArticles } from "@/lib/blog";
import type { BlogArticle } from "@/lib/types";

export const metadata = {
  title: "The Journal — Anchor Me Down Apparel",
  description:
    "Dispatches from between the iron and the water: heavyweight fabric, training, dock life, and the Anchor Me Down standard.",
};

function fmtDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

function ArticleTile({
  article,
  ratio,
  sizes,
  big = false,
}: {
  article: BlogArticle;
  ratio: string;
  sizes: string;
  big?: boolean;
}) {
  return (
    <Link
      href={`/blog/${article.handle}`}
      className={`group relative block ${ratio} overflow-hidden bg-coal`}
    >
      {article.image ? (
        <Image
          src={article.image.url}
          alt={article.image.alt}
          fill
          sizes={sizes}
          className="object-cover opacity-80 transition-all duration-700 group-hover:scale-[1.05] group-hover:opacity-100"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-coal via-ink to-coal" />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-ink/95 via-ink/30 to-transparent" />
      <div className="absolute bottom-0 left-0 p-6 md:p-8">
        <p className="text-[11px] uppercase tracking-[0.2em] text-bone/70">
          {fmtDate(article.publishedAt)}
          {/* Display rule (brand language): a weight-spec tag from the
              live data never headlines a tile — show the first plain
              tag instead, or just the date. Data itself is untouched. */}
          {(() => {
            const tag = article.tags.find((t) => !/gsm/i.test(t) && !/^\d+$/.test(t));
            return tag ? ` · ${tag}` : "";
          })()}
        </p>
        <h2
          className={`mt-2 font-display uppercase leading-[0.95] text-bone ${
            big ? "text-4xl md:text-6xl" : "text-2xl md:text-3xl"
          }`}
        >
          {article.title}
        </h2>
        {big && article.excerpt && (
          <p className="mt-3 hidden max-w-xl text-sm leading-6 text-bone/75 md:block">
            {article.excerpt}
          </p>
        )}
      </div>
      <span className="absolute right-6 top-6 font-display text-lg text-bone/0 transition-all duration-500 group-hover:text-brass">
        →
      </span>
    </Link>
  );
}

function TextRow({ article }: { article: BlogArticle }) {
  return (
    <Link
      href={`/blog/${article.handle}`}
      className="group grid gap-2 border-b border-seam py-7 md:grid-cols-[180px_1fr_auto] md:items-baseline md:gap-8"
    >
      <p className="text-[11px] uppercase tracking-[0.2em] text-ash">
        {fmtDate(article.publishedAt)}
      </p>
      <div>
        <h3 className="font-display text-2xl uppercase leading-tight text-bone transition-colors group-hover:text-brass md:text-3xl">
          {article.title}
        </h3>
        {article.excerpt && (
          <p className="mt-2 max-w-2xl text-sm leading-6 text-ash">
            {article.excerpt}
          </p>
        )}
      </div>
      <span className="hidden font-display text-lg text-bone/30 transition-all group-hover:text-brass md:block">
        →
      </span>
    </Link>
  );
}

/**
 * The Journal — the full store blog, carried into the headless build.
 * Editorial rhythm: the newest piece takes a cinematic feature tile,
 * the next four fall into an offset photo grid, everything after that
 * runs as a typographic archive index. Photo-led throughout.
 */
export default function BlogIndex() {
  const articles = getAllArticles();
  // Feature rule (brand language ruling, 2026-11-03; visual pass,
  // 2026-11-04): the hero tile is the newest piece whose title does not
  // lead with the old numeric jargon AND that carries a hero image —
  // a 21/9 feature tile with no photography reads as a void. Pieces
  // passed over still run in the grid/archive below, in recency order.
  const feature =
    articles.find((a) => !/gsm/i.test(a.title) && a.image) ??
    articles.find((a) => !/gsm/i.test(a.title)) ??
    articles[0];
  const rest = feature
    ? articles.filter((a) => a.handle !== feature.handle)
    : [];
  const grid = rest.slice(0, 4);
  const archive = rest.slice(4);

  return (
    <div className="mx-auto max-w-[1440px] px-5 pb-24 pt-36 md:px-10 md:pt-40">
      <p className="text-[11px] font-semibold uppercase tracking-mega text-brass">
        The Journal
      </p>
      <h1 className="mt-3 font-display text-6xl uppercase leading-[0.9] text-bone md:text-9xl">
        Between the
        <br />
        iron <span className="font-accent normal-case italic tracking-normal text-brass">&amp;</span> water
      </h1>
      <p className="mt-6 max-w-2xl text-base leading-7 text-ash">
        {articles.length} dispatches on heavyweight fabric, training, dock
        life, and the standard the line is built to — published from the
        store, carried here in full.
      </p>

      {feature && (
        <Reveal className="mt-14">
          <ArticleTile
            article={feature}
            ratio="aspect-[4/3] md:aspect-[21/9]"
            sizes="100vw"
            big
          />
        </Reveal>
      )}

      {grid.length > 0 && (
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          {grid.map((a, i) => (
            <Reveal key={a.handle} delay={i * 80}>
              <ArticleTile
                article={a}
                ratio="aspect-[4/3]"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </Reveal>
          ))}
        </div>
      )}

      {archive.length > 0 && (
        <section className="mt-24">
          <h2 className="font-display text-4xl uppercase leading-[0.95] text-bone md:text-5xl">
            The archive
          </h2>
          <div className="mt-6 border-t border-seam">
            {archive.map((a) =>
              a.image ? (
                <div key={a.handle} className="border-b border-seam py-7">
                  <div className="grid gap-6 md:grid-cols-[260px_1fr]">
                    <Link
                      href={`/blog/${a.handle}`}
                      className="group relative block aspect-[16/10] overflow-hidden bg-coal"
                    >
                      <Image
                        src={a.image.url}
                        alt={a.image.alt}
                        fill
                        sizes="260px"
                        className="object-cover opacity-85 transition-all duration-700 group-hover:scale-[1.05] group-hover:opacity-100"
                      />
                    </Link>
                    <div>
                      <p className="text-[11px] uppercase tracking-[0.2em] text-ash">
                        {fmtDate(a.publishedAt)}
                        {a.tags[0] ? ` · ${a.tags[0]}` : ""}
                      </p>
                      <Link href={`/blog/${a.handle}`} className="group">
                        <h3 className="mt-2 font-display text-2xl uppercase leading-tight text-bone transition-colors group-hover:text-brass md:text-3xl">
                          {a.title}
                        </h3>
                      </Link>
                      {a.excerpt && (
                        <p className="mt-2 max-w-2xl text-sm leading-6 text-ash">
                          {a.excerpt}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <TextRow key={a.handle} article={a} />
              )
            )}
          </div>
        </section>
      )}
    </div>
  );
}
