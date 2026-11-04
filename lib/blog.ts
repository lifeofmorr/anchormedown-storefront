import blogData from "@/data/blog.json";
import type { Blog, BlogArticle, Product } from "./types";
import { getAllProducts, getProduct } from "./catalog";

/**
 * BLOG DATA LAYER — typed local export of the LIVE store blog
 * (data/blog.json, produced by scripts/export-blog.py +
 * scripts/transform-blog.py from blog gid://shopify/Blog/57294787).
 * Same swap pattern as lib/catalog.ts: at cutover these accessors can
 * be replaced with live API calls without touching any page.
 */
const blog = blogData as unknown as Blog;

export function getAllArticles(): BlogArticle[] {
  return blog.articles;
}

export function getArticle(handle: string): BlogArticle | undefined {
  return blog.articles.find((a) => a.handle === handle);
}

/** See lib/display-tag.ts — the customer-safe tag display rule. */
export { displayTag } from "./display-tag";

/**
 * Products an article points at: first, products linked in the body
 * (/products/<handle>); then products whose title/tags match the
 * article's tags or title words. Capped, de-duplicated, order stable.
 */
export function getArticleRelatedProducts(
  article: BlogArticle,
  count = 4
): Product[] {
  const found: Product[] = [];
  const seen = new Set<string>();
  const add = (p?: Product) => {
    if (p && !seen.has(p.handle) && found.length < count) {
      seen.add(p.handle);
      found.push(p);
    }
  };
  const linkRe = /\/products\/([a-z0-9-]+)/g;
  let m: RegExpExecArray | null;
  while ((m = linkRe.exec(article.bodyHtml)) !== null) add(getProduct(m[1]));
  if (found.length < count) {
    const needles = new Set<string>();
    article.tags.forEach((t) => needles.add(t.toLowerCase()));
    article.title
      .toLowerCase()
      .split(/[^a-z0-9]+/)
      .filter((w) => w.length > 4)
      .forEach((w) => needles.add(w));
    const scored = getAllProducts()
      .filter((p) => !seen.has(p.handle))
      .map((p) => {
        const hay = (p.title + " " + p.tags.join(" ") + " " + p.productType).toLowerCase();
        return { p, score: [...needles].filter((n) => hay.includes(n)).length };
      })
      .filter((s) => s.score > 0)
      .sort((a, b) => b.score - a.score);
    scored.forEach((s) => add(s.p));
  }
  return found;
}

/** Other articles sharing tags with this one, newest first. */
export function getRelatedArticles(article: BlogArticle, count = 3): BlogArticle[] {
  const tags = new Set(article.tags.map((t) => t.toLowerCase()));
  return blog.articles
    .filter((a) => a.handle !== article.handle)
    .map((a) => ({
      a,
      score: a.tags.filter((t) => tags.has(t.toLowerCase())).length,
    }))
    .sort((x, y) => y.score - x.score)
    .slice(0, count)
    .map((s) => s.a);
}
