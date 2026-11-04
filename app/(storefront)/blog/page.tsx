import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import { displayTag, getAllArticles } from "@/lib/blog";
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

function MetaLine({ article, tone = "text-bone/70" }: { article: BlogArticle; tone?: string }) {
  const tag = displayTag(article.tags);
  return (
    <p className={`text-[11px] uppercase tracking-[0.2em] ${tone}`}>
      {fmtDate(article.publishedAt)}
      {tag ? ` · ${tag}` : ""}
    </p>
  );
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
        <MetaLine article={article} />
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
      {big && (
        <span className="absolute left-6 top-6 border border-bone/30 px-3 py-1.5 text-[10px] uppercase tracking-[0.3em] text-bone/85 backdrop-blur-sm md:left-8 md:top-8">
          Featured dispatch
        </span>
      )}
      <span className="absolute right-6 top-6 font-display text-lg text-bone/0 transition-all duration-500 group-hover:text-brass">
        →
      </span>
    </Link>
  );
}

function PhotoRow({ article }: { article: BlogArticle }) {
  return (
    <div className="grid gap-6 border-b border-seam py-7 md:grid-cols-[300px_1fr] md:gap-10">
      <Link
        href={`/blog/${article.handle}`}
        className="group relative block aspect-[16/10] overflow-hidden bg-coal"
      >
        <Image
          src={article.image!.url}
          alt={article.image!.alt}
          fill
          sizes="300px"
          className="object-cover opacity-85 transition-all duration-700 group-hover:scale-[1.05] group-hover:opacity-100"
        />
      </Link>
      <div className="min-w-0">
        <MetaLine article={article} tone="text-ash" />
        <Link href={`/blog/${article.handle}`} className="group">
          <h3 className="mt-2 font-display text-2xl uppercase leading-tight text-bone transition-colors group-hover:text-brass md:text-[2rem]">
            {article.title}
          </h3>
        </Link>
        {article.excerpt && (
          <p className="mt-2 line-clamp-3 max-w-2xl text-sm leading-6 text-ash">
            {article.excerpt}
          </p>
        )}
      </div>
    </div>
  );
}

function TextRow({ article }: { article: BlogArticle }) {
  return (
    <Link
      href={`/blog/${article.handle}`}
      className="group grid gap-2 border-b border-seam py-7 md:grid-cols-[220px_1fr_auto] md:items-baseline md:gap-8"
    >
      <MetaLine article={article} tone="text-ash" />
      <div>
        <h3 className="font-display text-2xl uppercase leading-tight text-bone transition-colors group-hover:text-brass md:text-3xl">
          {article.title}
        </h3>
        {article.excerpt && (
          <p className="mt-2 line-clamp-2 max-w-2xl text-sm leading-6 text-ash">
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

/** Archive grouped by month, newest first — the index's table of contents. */
function groupByMonth(articles: BlogArticle[]): { key: string; label: string; items: BlogArticle[] }[] {
  const groups: { key: string; label: string; items: BlogArticle[] }[] = [];
  for (const a of articles) {
    const d = new Date(a.publishedAt);
    const key = `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}`;
    const last = groups[groups.length - 1];
    if (last && last.key === key) {
      last.items.push(a);
    } else {
      const label = d.toLocaleDateString("en-US", { month: "long", year: "numeric", timeZone: "UTC" });
      groups.push({ key, label, items: [a] });
    }
  }
  return groups;
}

/**
 * The Journal — the full store blog, carried into the headless build.
 * Editorial rhythm: a cinematic feature tile, four recent pieces in an
 * offset photo grid, then the archive — grouped by month under huge
 * display headers so 150 pieces read as a table of contents, not a feed.
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
  const archiveGroups = groupByMonth(archive);

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
        <div className="mt-6 grid gap-6 md:grid-cols-2 md:pb-16">
          {grid.map((a, i) => (
            <Reveal key={a.handle} delay={i * 80} className={i % 2 === 1 ? "md:mt-16" : ""}>
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
        <section className="mt-16 md:mt-24">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 className="font-display text-4xl uppercase leading-[0.95] text-bone md:text-5xl">
              The archive
            </h2>
            <p className="text-[11px] uppercase tracking-[0.2em] text-ash">
              {archive.length} dispatches · {archiveGroups.length} months
            </p>
          </div>

          {archiveGroups.map((group) => (
            <div key={group.key} className="mt-16 first:mt-12">
              <div className="flex flex-wrap items-baseline gap-x-5 gap-y-1 border-b-2 border-bone/70 pb-4">
                <h3 className="font-display text-3xl uppercase leading-none text-bone md:text-4xl">
                  {group.label}
                </h3>
                <p className="text-[11px] uppercase tracking-[0.25em] text-brass">
                  {group.items.length} {group.items.length === 1 ? "dispatch" : "dispatches"}
                </p>
              </div>
              <div>
                {group.items.map((a) =>
                  a.image ? (
                    <PhotoRow key={a.handle} article={a} />
                  ) : (
                    <TextRow key={a.handle} article={a} />
                  )
                )}
              </div>
            </div>
          ))}
        </section>
      )}

      <section className="relative mt-28 overflow-hidden border-t border-seam pt-16 text-center">
        <span
          aria-hidden
          className="text-stroke-bone pointer-events-none absolute inset-x-0 -top-4 select-none font-display text-[13vw] leading-none opacity-15"
        >
          ANCHORED
        </span>
        <div className="relative">
          <p className="font-display text-4xl uppercase leading-[0.95] text-bone md:text-6xl">
            Read enough.
            <br />
            <span className="font-accent normal-case italic tracking-normal text-brass">Wear</span> the standard.
          </p>
          <Link
            href="/collections"
            className="mt-8 inline-block bg-bone px-8 py-4 font-display text-base uppercase tracking-[0.14em] text-ink transition-colors hover:bg-brass"
          >
            Shop the heavy line
          </Link>
        </div>
      </section>
    </div>
  );
}
