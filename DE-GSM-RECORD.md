# DE-GSM RECORD — AMD Headless Storefront, Brand-Language Pass

**Date:** Tue 2026-11-03 night (ET) · **Scope:** the Vercel preview build only
(repo `lifeofmorr/anchormedown-storefront`, on top of push 670a270). No push,
no deploy, no DNS, no live-Shopify change — anchormedown.com stays on Shopify
per Don's ruling. This record is the push manifest for the main session.

## Why this pass exists

Don's brand-language ruling (2026-11-03 20:58 ET): **"425 GSM" is removed
from all customer-facing copy** — nobody knows what GSM means. Weight is sold
in human words only: *"the heaviest tee in the game," "heavyweight," "built
heavy."* More human, less AI. This pass applies the ruling to the headless
build's **display layer only**: `data/catalog.json` and `data/blog.json`
contents are internal data at live-store parity and stayed byte-untouched;
`lib/campaign.ts` untouched.

## The one design rule that governed every edit

A weight claim in **words** may appear only where the underlying verified
fact supports it:

- **"THE HEAVIEST"** (badge / panel / chip / search badge) renders **only**
  for the catalog's verified heaviest line — the 13 tees at the maximum
  verified weight, computed from data (`lib/catalog.getHeaviestGsm()` /
  `getHeaviestProducts()`; client components use the mirrored constant +
  `isHeaviest()` in `lib/types.ts`). Previously the numeric badge rendered
  for *every* product with a verified weight — including a 190-class piece,
  which under the new language would have been a false superlative. Those
  products now carry **no badge and no weight panel**; the verified heavy
  fleece class (380/400) is framed as **"Heavyweight"** (collection chip,
  homepage fleece feature) — a true claim, not the superlative.
- No-claim products (26, weight unverified) show no weight language at all,
  exactly as before — the conditions stayed data-driven throughout.

## What changed, per surface

**The Weight Room (`components/WeightRoom.tsx`) — rebuilt in words.**
The numeric instrument is now a class instrument: the visitor drags a
machined slider across four plain classes — **Featherweight / Standard tee /
Premium standard / Heavy streetwear** — while the AMD column stands fixed,
labeled **"The Heaviest — Ours, Anchor Me Down."** Column heights remain
proportional to each class's real fabric weight (internal fractions, never
displayed); the slider snaps class to class. The old numeric readouts (the
figure itself, the ×-multiple, the "+grams" surplus) are gone; the verdict
panel now computes a **word measure** per class ("Almost three times the
cloth" / "Well over twice the cloth" / "Nearly twice the cloth" / "A clear
class above") plus the class verdict line, and still ends in the real heavy
line with hover quick-add. Ghost numeral → ghost word **HEAVY**. CTAs:
"Shop the heaviest line"; the fleece link reads "Layers built heavy too."

**Badges (ProductCard, PurchasePanel gallery, BestSellerIndex, InStills,
SiteSearch results).** `{number} GSM` / `GSM verified` → **"The Heaviest"**,
rendered only for the verified heaviest line (see rule above).

**Product page (`components/PurchasePanel.tsx`, `app/products/[handle]/page.tsx`).**
The weight certificate is rebuilt as a plain-words panel, heaviest line
only: display word **"THE HEAVIEST"**, side label **"Our heaviest cotton"**,
proportional bars labeled in words — **"This tee / The heaviest we make"**
(full bar) vs **"A typical tee / Built light"** (short bar) — and copy "You
feel it the second you pick it up…" The spec sheet **drops the fabric-weight
row entirely** (all products); Price / Sizes / Colorways / Variants remain.
Metadata fallback description is now the word line.

**Homepage (`app/page.tsx`).** Hero: ghost "425" → **HEAVY**; the H1 is now
"The *heaviest* tee in the game." (the numeric H1 and its duplicate sub-line
merged); hero copy and facts keel in words ("13 tees — one heavy standard",
"Built heavy, every one"); marquee "425 GSM" → "Built Heavy". The line
section: ghost HEAVY, kicker "03 · The Heavyweights", H2 "The heavy line",
intro rewritten in words, roster numbers no longer carry a weight tag,
closing strip "Thirteen tees · One standard · $60 every one". Anchor
Standard feature: copy + spec keel ("Build — The heaviest"). Hoodie feature:
kicker "Heavyweight Fleece", copy and spec row in words. Women's feature:
the numeric weight span removed. Internal variables renamed
(`heroes425` → `heaviestLine`, sourced from `getHeaviestProducts()`).

**Collections (`app/collections/[handle]/page.tsx`, `components/CollectionGrid.tsx`).**
Hero count line: "· N with a printed weight" → **"· N from the heaviest
line"** (count computed from data). The filter chips are now word chips —
**All N / The Heaviest · n / Heavyweight · n** — shown only for classes
present in the collection, counts computed from the products' verified
weights; the heaviest threshold arrives as a server-computed prop
(`heaviestGsm={getHeaviestGsm()}`), so the chip shows **exactly** the
verified heaviest set and a no-weight product can never appear under a
weight chip. Status lines in words ("…the heaviest we make." /
"…heavyweight, built heavy." / "The heavy ones say so — the rest don't
need to.").

**Search (`app/search/page.tsx`, `components/SiteSearch.tsx`).** UI copy in
words: placeholder "Try "heaviest", "hoodie", "giveaway", "iron"…", metadata
and helper lines speak of weight class, result badges are "The Heaviest"
(heaviest line only). The index keeps the **silent legacy-token mapping**:
the server-built haystack still carries each product's numeric token and
the client still boosts an exact bare-number query — never displayed,
never labeled — and now also carries word tokens so **"heaviest" finds the
heavy line**. The `SearchProduct.gsm` field was renamed `weightValue`
(internal plumbing) plus a `heaviest` boolean for the badge.

**Global / pages.** `app/layout.tsx` metadata and `components/Footer.tsx`
tagline: the word line only. Black Friday page: poster line and hero copy in
words (zero codes, dates/thresholds untouched; the live page body — data —
is verbatim as before). Giveaway page: "The same heaviest line, at the
standard $60."

**Blog (`app/blog/page.tsx`).** Article bodies and titles stay at parity
(data), but the index feature rule changed: **the hero tile is the newest
article whose title does not contain the jargon term** (currently the Nov 3
giveaway-deadline piece — so the tile is unchanged in practice, now by rule
rather than luck); the excluded article falls back into the grid/archive in
recency order.

## Blog inventory — for the follow-up (live-store) pass

Counted from `data/blog.json` (150 published articles):

- **Titles containing "GSM": 13** — including "What Is GSM in T-Shirts and
  Why Does It Matter?", "425 GSM Explained…", "The Ultimate Guide to
  Heavyweight T-Shirts: GSM Explained", "Best Gym Shirts for Men, Ranked by
  Fabric Weight (GSM)", "Best Heavyweight Hoodies: A GSM-by-GSM Buying
  Guide", and 8 more.
- **Bodies containing "GSM": 150 of 150** — every article body carries the
  standing tagline in its closing block ("425 GSM. The heaviest tee in the
  game…"), most carry further fabric copy.
- **Excerpts/summaries containing "GSM": 53.**

These live in the live store's blog copy (data parity here). Rewriting them
is the live-store sweep's follow-up, not this build's — flagged, not touched.

## Final grep — survivors and justifications

`grep -rn -i "gsm" app components` and `grep -rn "425" app components` after
the pass:

- **"425": ZERO occurrences** in `app/` + `components/`. (The BF425 code
  name does not appear anywhere in the build's code — nothing to exempt. It
  must never render; it doesn't.)
- **"gsm" survivors — none rendered, all internal plumbing:**
  1. `app/search/page.tsx` — the silent legacy-token mapping in the
     server-built haystack (allowed survivor (b)) + the `p.gsm` data-field
     reads that feed it and the word tokens.
  2. `components/CollectionGrid.tsx` + `app/collections/[handle]/page.tsx` —
     the `gsm` **data field** and the `heaviestGsm` prop/identifier: class
     computation only, never a rendered string.
  3. `app/blog/page.tsx` — the `/gsm/i` title test implementing the feature
     rule: logic, never rendered.
- **Served-HTML note (measured, not hidden):** production pages still
  contain the jargon inside **serialized product/article data** — product
  descriptions and image alt text from the live catalog export, article
  bodies — because those are data at live-store parity (out of this pass's
  scope, owned by the live-store sweep). Zero occurrences exist in any UI
  markup, label, badge, heading, or copy string this build renders.
- `data/llms.txt` (served at /llms.txt) contains the term (10 hits): it is
  an extracted live-store **data file** (allowed survivor (a)), not build
  copy — flagged for the same follow-up pass.

## Verification (production build + `next start`, measured)

- **Build passes** — 234 static pages (route table unchanged in shape:
  62 products, 10 collections, 150 blog paths, /search dynamic).
- **Homepage:** Weight Room renders in words (screenshot-verified: class
  slider, "OURS — THE HEAVIEST" verdict, word measure, class chips, product
  rail badged "THE HEAVIEST").
- **Heavy product (College Special):** gallery badge "THE HEAVIEST",
  plain-words panel present with word-labeled bars (screenshot-verified);
  spec sheet has no fabric-weight row (the only "Fabric weight" strings on
  the served page are inside the product's own live description — data).
- **No-claim product (Snow Wash):** zero badge, zero panel, zero weight
  copy in UI — verified by served-HTML grep (0 / 0 / 0).
- **Collection (T-Shirts):** chip renders **"The Heaviest · 13"**, hero line
  "· 13 from the heaviest line", filter label "Weight class".
- **Search:** `/search?q=heaviest` returns **exactly the 13** verified
  heaviest products (unique product links counted in served HTML), badged
  in words.
- **Screenshots (1440×900, production server):**
  `screenshots/weight-room-human.png`, `screenshots/product-human.png` —
  both eyeballed: zero numbers, zero jargon, luxury composition intact.

## Push list for the main session

Text files (push-files route), repo `lifeofmorr/anchormedown-storefront`,
branch `main`:

- NEW: `DE-GSM-RECORD.md`
- MODIFIED: `lib/types.ts`, `lib/catalog.ts`,
  `components/WeightRoom.tsx`, `components/ProductCard.tsx`,
  `components/PurchasePanel.tsx`, `components/BestSellerIndex.tsx`,
  `components/InStills.tsx`, `components/CollectionGrid.tsx`,
  `components/SiteSearch.tsx`, `components/Footer.tsx`,
  `app/layout.tsx`, `app/page.tsx`, `app/products/[handle]/page.tsx`,
  `app/collections/[handle]/page.tsx`, `app/pages/black-friday/page.tsx`,
  `app/pages/giveaway/page.tsx`, `app/blog/page.tsx`, `app/search/page.tsx`

Binary (GitHub web-UI route, or omit — proof artifacts already verified):
`screenshots/weight-room-human.png`, `screenshots/product-human.png`.

Nothing else in the project changed: `data/*`, `lib/campaign.ts`,
`lib/cart.tsx`, `lib/format.ts`, `lib/blog.ts`, the API routes and
`next.config.mjs` are untouched.
