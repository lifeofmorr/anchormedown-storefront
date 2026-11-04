# WAVE 2 — Blog + Search (2026-11-03 night run)

Full content library + search carried into the headless build, as NEW
routes/files only. No existing page was restyled (the design-elevation
pass owns composition). Nothing pushed, nothing deployed, no DNS, no
live-store changes, no discount codes anywhere.

## Blog

- Export: `scripts/export-blog.py` (Shopify MCP graphql_query, blog
  `gid://shopify/Blog/57294787`, paginated) → `scripts/blog-raw.json`;
  `scripts/transform-blog.py` → `data/blog.json`.
- **150 published articles** exported (the live count tonight — the
  "~143" figure in earlier docs was stale). All published, 108 with a
  hero image, 42 without.
- Routes:
  - `app/blog/page.tsx` — `/blog` index: editorial, photo-led
    (feature tile → 4-up photo grid → archive with thumbnails/rows).
  - `app/blog/[handle]/page.tsx` — `/blog/<handle>` for EVERY article:
    full body HTML (`.page-body` styles), hero image where present,
    related-products rail (products linked in the body first, then
    tag/title match via `lib/blog.ts`), related-article tiles,
    Article JSON-LD + OG metadata.
- Data layer: `lib/blog.ts` (same swap-point pattern as
  `lib/catalog.ts`); `BlogArticle`/`Blog` types appended to
  `lib/types.ts`.

## URL parity (recorded in URL-PARITY.md)

| Live | Headless |
|---|---|
| `/blogs/news` | `/blog` (+ rewrite) |
| `/blogs/news/<handle>` | `/blog/<handle>` (+ rewrite) |

Handles are 1:1 with the live store. `next.config.mjs` gained a
`rewrites()` block (the only config change):
`/blogs/news` → `/blog`, `/blogs/news/:handle` → `/blog/:handle` —
verified byte-identical responses (154,464B both paths).

## Search

- `app/search/page.tsx` — `/search`; server builds a slim index over
  the catalog + blog exports and passes it to
  `components/SiteSearch.tsx` (client): tokenized matching over title,
  tags, GSM, collection names, product type, article excerpts; a bare
  number boosts an exact verified-GSM match. Results render as product
  cards (with GSM badge + price) and article rows. Accepts `?q=` so
  `/search?q=425` lands on live results (SSR renders them too).
- Header exposes no search entry and is owned by the elevation pass,
  so the route is linked from the footer instead ("The Journal" +
  "Search" links added to `components/Footer.tsx` — minimal edit).

## Verification (production build + `next start`, 2026-11-04 ~01:50 ET)

- `npm run build` PASS — route table shows `/blog/[handle]` SSG with
  150 paths ("[+147 more]"), `/blog` static, `/search` dynamic.
- Spot checks, all HTTP 200: `/blog`; oldest article
  (`staying-grounded-in-a-world-that-never-slows-down`); mid
  (`why-do-t-shirt-collars-stretch-out-and-what-fixes-it`); newest
  (`what-happens-in-the-last-two-hours-before-a-giveaway-deadline-closes`);
  `/blogs/news/<mid handle>` rewrite (byte-identical to `/blog/<handle>`).
- `/search?q=425` → **13 products** (exactly the verified 425 GSM set)
  + journal hits; `/search?q=hoodie` → Bull Hoodie / Mini Anchor
  Hoodie / Sleeveless Hoodie AMD + more products and dispatches.
- Article pages carry `application/ld+json` (Article schema).
- Screenshots: `screenshots/blog-index-wave2.png`,
  `screenshots/blog-article-wave2.png` (Playwright/Chromium; the
  feature tile's dim text in the index shot is the scroll-reveal
  mid-fade, not a render defect — the newest article has no hero
  image, so its tile renders on the gradient).

## File list for the main session's push

NEW:
- `app/blog/page.tsx`
- `app/blog/[handle]/page.tsx`
- `app/search/page.tsx`
- `components/SiteSearch.tsx`
- `lib/blog.ts`
- `data/blog.json`
- `scripts/export-blog.py`
- `scripts/transform-blog.py`
- `scripts/blog-raw.json` (raw export evidence, same as catalog-raw)
- `screenshots/blog-index-wave2.png`, `screenshots/blog-article-wave2.png` (binary — web-UI route or skip, per the text-only push rule)
- `WAVE2-RECORD.md` (this file)

MODIFIED (minimal):
- `lib/types.ts` — appended `BlogArticleImage`, `BlogArticle`, `Blog` interfaces only
- `next.config.mjs` — appended `rewrites()` for `/blogs/news*` parity only
- `components/Footer.tsx` — two links (Journal, Search) in "The Season" list
- `URL-PARITY.md` — journal + search rows; blog/search removed from known gaps
