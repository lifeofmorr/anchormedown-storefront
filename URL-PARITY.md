# URL Parity Map — live Shopify store → headless Next.js build

Verified against the live catalog export (2026-11-03). Every route below is
built and returns 200 from the production build (`npm run build` — 82 static
pages + 2 dynamic routes).

## Core routes

| Live path | Headless route | Status |
|---|---|---|
| `/` | `app/page.tsx` | ✅ Built — hero (425 story), 425 line, Anchor Standard feature, best sellers, hoodie feature, women's, BF capture, manifesto |
| `/cart` | `app/cart/page.tsx` | ✅ Built — working totals, free-shipping states, checkout handoff |
| Checkout | Shopify (unchanged) | ✅ Cart permalink `https://anchormedown.com/cart/<variantId>:<qty>,…` lands the same bag in real Shopify checkout |
| `/llms.txt` | `app/llms.txt/route.ts` | ✅ Built — served from `data/llms.txt` (was app-served via Arc) |

## Products — `/products/<handle>` (all 62)

`app/products/[handle]/page.tsx` generates one static page per live product —
62/62 handles at exact parity, including duplicate-title listings the store
keeps as separate colorways (e.g. `anchor-standard` + `anchor-standard-1`,
`bull-hoodie` / `bull-hoodie-1` / `bull-hoodie-2`, the `amd-full-zip` set).
Each page: full media gallery, color/size variant picker wired to real
variant IDs, verified-GSM panel only where the product's own live description
states a GSM (13 × 425, 9 × 400, 13 × 380, 1 × 190, 26 × no claim), the live
shipping line incl. "Nov 27–30: free shipping $75+", the product's own
description, related products, native Product JSON-LD.

## Collections — `/collections` + `/collections/<handle>` (all 10)

| Live handle | Products | Headless |
|---|---|---|
| best-sellers | 7 | ✅ |
| womens-collection | 14 (the corrected set) | ✅ |
| tops-women | 10 | ✅ |
| t-shirts-1 | 33 | ✅ (the main shop collection; linked as "Tees") |
| crop-tops | 8 | ✅ |
| sweatshirts | 3 | ✅ |
| hoodies | 14 | ✅ |
| new-arrivals | 9 | ✅ |
| mens-collection | 52 | ✅ |
| joggers | 5 | ✅ |

## Pages

| Live path | Headless route | Status |
|---|---|---|
| `/pages/black-friday` | `app/pages/black-friday/page.tsx` | ✅ Mirrors the live page body + working CaptureForm; **zero discount codes** (hard rule kept) |
| `/pages/giveaway` | `app/pages/giveaway/page.tsx` | ✅ Mirrors the live page body; verified zero ANCHORED15 |

## Known gaps (outside this pass's mandated set — wave-2 list)

- `/search` + predictive search (theme-side today; see APPS-AUDIT.md).
- `/pages/*` long tail (about, size-guide, shipping-returns, press, faq…):
  18 published pages exist on the live store; only black-friday + giveaway
  were mandated this pass. The data-layer pattern extends directly — each is
  one route rendering its exported body.
- `/blogs/news/*` — the store blog (~143 articles) is not in this pass.
- Customer accounts (`/account/*`) stay on Shopify-hosted pages at cutover
  via checkout/account links, or move to new customer accounts — a cutover
  decision for the gate list, not built here.
- Variant → gallery-image mapping: Shopify media exports flat (the Admin
  API's per-variant image field is deprecated/blocked), so the gallery does
  not auto-jump to the selected colorway's photo yet. The Storefront API
  swap exposes `selectedOptions`/media-per-variant cleanly — fix lands with
  that swap, no page redesign needed.
