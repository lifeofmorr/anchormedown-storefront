# HIGGSFIELD INTEGRATION — AMD Headless Storefront

Run: 2026-11-03 (evening ET). Directive: Don, AMD chat — "Higgsfield was only
for our website content and we already have a created." The already-created
Higgsfield website assets are carried into the headless rebuild at their live
placements. Website-only; Instagram/email stay real-photography-only.
**Staged locally only — NOT pushed, NOT deployed.**

---

## 1. Inventory — what exists and where it lives

Sources checked:
- **Live Shopify theme v34** — "AMD v34 Round-2 sticky ATC - STAGED",
  `gid://shopify/OnlineStoreTheme/131741483066` (MAIN). Read via Shopify
  GraphQL: `templates/index.json`, `config/settings_data.json`,
  sections `amd-hero`, `amd-campaign-films`, `amd-social-runway`,
  `amd-world-experience`, `amd-collection`; snippets
  `amd-colorway-campaign-media`, `amd-campaign-media-url`,
  `amd-campaign-color`, `amd-product-media-map`; `locales/en.default.json`.
- **Shopify Files** — `files(first: 250)`: 249 images + 1 video (the video is
  a 2024 upload, unrelated). The campaign stills below are Files uploads.
- **Higgsfield connector** — `show_generations` (image + video, 100 each):
  the account `user_3IVtMrVI7IjvqOS7jg3pC8kY9oz` holds 100+ completed
  generations (kling3_0 / seedance_2_0 / gpt_image_2_5, Sept–Oct 2026).
  The website assets are served from the same account on a second CloudFront
  distribution (`d2ol7oe51mr4n9.cloudfront.net`) in the older plain-UUID
  delivery format; they predate the first 100-item generations page, so
  per-asset generation records were not individually matched — provenance is
  the same-account CDN + their embedding as the live theme's campaign films.
- **Local disk** — no Higgsfield media files exist anywhere under
  `~/workspace` (filename search: only the connector directory; text mentions
  are docs/notes). Nothing in the goal `files/` or `content-studio/`.

### 1a. Films (5)

| # | Asset | Served from | Live placement(s) |
|---|-------|-------------|-------------------|
| F1 | `ae624303-18b9-4517-82c0-3b48b980dad4.mp4` — "Iron" film | Higgsfield CDN | Hero world film 02 · campaign-films panel 2 · runway film (Snow Wash Lite) · manifest film for snow-wash-lite / Rifle Green |
| F2 | `a3914469c03a4674837057d291dc9e3f.HD-1080p-7.2Mbps-93995277.mp4` — "Water" film | Shopify video CDN (`cdn.shopify.com/videos/c/vp/…`) | Hero world film 01 (default) · campaign-films panel 1 · world-experience story film · runway film (Roses Boxy Tank) · manifest film for roses-boxy-tank / Light Beige |
| F3 | `a7b63f57-9034-469b-97b5-582955d6b675.mp4` | Higgsfield CDN | Manifest film — womens-amd-joggers-2 / Rice Apricot · runway film |
| F4 | `99e3e14c-193e-40e3-9da3-ee1df209c142.mp4` | Higgsfield CDN | Manifest film — amd-circle-baby-tee / Vanilla Cream · runway film |
| F5 | `9e1cf05d-2226-4a47-a74c-4a930683cb33.mp4` | Higgsfield CDN | Manifest film — amd-circle-baby-tee-1 / Pink · runway film |

Higgsfield CDN base: `https://d2ol7oe51mr4n9.cloudfront.net/user_3IVtMrVI7IjvqOS7jg3pC8kY9oz/`

### 1b. Stills served from the Higgsfield CDN (7)

| Asset | Manifest entry |
|-------|---------------|
| `134a3330-7c2e-480c-86dc-2dd7a3256794_resize.jpg` | amd-bull-stitch / White Rock — front |
| `d3d2080e-bd34-41db-b6a9-e55010e63999_resize.jpg` | amd-bull-stitch / White Rock — back |
| `c0b07dcb-142e-4744-8cb3-d86f42daaf40_resize.jpg` | amd-circle-baby-tee-1 / Pink — front (runway card 6) |
| `6b3a7dbe-bb9f-45d0-97b8-19a2cafddf2b_resize.jpg` | amd-circle-baby-tee-1 / Pink — back |
| `9ccdd883-a389-49ed-a86f-fa01bc05126f_resize.jpg` | amd-full-zip-3 / White — front |
| `25aa208c-881e-4e95-903a-24b30ac80ade.jpg` | anchor-flower / Carbon Gray — front |
| `c2677df8-5590-4ce8-baa1-a38f9470e48c.jpg` | anchor-flower / Carbon Gray — back |

### 1c. Campaign stills hosted on Shopify CDN (same v31/v32 campaign program)

Uploaded copies in Shopify Files (`cdn.shopify.com/s/files/1/1250/4869/files/…`),
transcribed 1:1 into `lib/campaign.ts` from the live manifest: bull-hoodie
Black front/back · modern-anchor White front · anchor-script Snow Wash front ·
snow-wash-lite Rifle Green front/back (front = Iron hero poster) ·
roses-boxy-tank-1 Light Beige front/back · amd-full-zip-1 White front ·
weighted Black front/back · womens-amd-joggers-2 Rice Apricot front/back ·
amd-full-zip-2 White front · amd-circle-baby-tee Vanilla Cream front/back ·
bullish White front · fire White front · new-wave Black front/back ·
roses-boxy-tank Light Beige front/back (front = Water hero poster) ·
scripted Carbon Gray front/back · anchor-down-hoodie Light Blue front/back ·
strength Carbon Gray front (back withheld on live, same here) ·
anchor-zip Rice Apricot front · anchor-zip-1 Black front ·
sleeveless-hoodie-amd Brown front · anchor-3d Cerulean Blue front.
Per-asset generation provenance is not individually verifiable from the
connector; they are the live site's campaign layer and are carried as such.

### 1d. Recorded, not rendered

- college-special / Black front — live manifest references a bundled theme
  asset (`amd-v31-model-college-special-black-front-1600x2000.jpg` via
  `asset_url`); theme-asset URLs are not stable/public, so it is recorded in
  `lib/campaign.ts` with `frontSource: "theme-asset"` and never rendered.
- Back stills — the live homepage sections never render backs; they are in
  the data module for future use, unused by this integration.
- `amd-product-media-map` snippet — indexes **real catalog photos**
  (front/back) on live product pages; not Higgsfield, not touched.

### 1e. Live homepage placements (templates/index.json order)

hero → campaign_films → collection → social_runway → world_experience →
newsletter. Hero: dual world films with 01 Water / 02 Iron toggle, motion
play/pause, background links to the active film's product (Water → Roses
Boxy Tank variant 41297201168442; Iron → Snow Wash Lite variant
40567915511866 — both are the products' first variants in the headless
catalog too). Runway order: anchor-down-hoodie, snow-wash-lite,
anchor-script, roses-boxy-tank, amd-circle-baby-tee, amd-circle-baby-tee-1,
womens-amd-joggers-2. All section copy below is the live store's own text
(locales/en.default.json), used verbatim.

Every URL in §1a–1c was verified reachable on 2026-11-03 (HTTP 200/206).

---

## 2. What was placed where (headless homepage, `app/page.tsx`)

| Live placement | Headless implementation |
|---|---|
| Hero dual world films | `components/HeroWorlds.tsx` — replaces the static "embraced" product-photo hero background. Same films, posters, toggle (01 Water / 02 Iron), motion play/pause, and shop-the-look background link. Hero copy/CTAs unchanged from the wave-1 build. |
| Campaign films (position 2) | `components/CampaignFilms.tsx` — new section after the marquee: intro + both full-bleed film panels with live copy ("Full throttle. Still anchored." / "Made to move. Built to hold.") and product CTAs. |
| Social runway (position 4) | `components/Runway.tsx` — new section after Best Sellers: live header copy + social links, 7 cards in live order with campaign stills, Film/Look numbering, per-card Play film toggle where the colorway has a film, Shop look links. |
| World experience story film | `components/WorldStory.tsx` — new section before the Black Friday capture: Water film in a 4:5 frame beside the live story copy ("The anchor does not mean stand still." / "It means hold."), CTA to Roses Boxy Tank. (The live section's proof-stats and FAQ blocks are copy-only and were not ported.) |
| Film behavior | `components/Film.tsx` — poster still as a real image layer (the live theme's layering), mp4 over it, plays in view / pauses off-screen, Play/Pause toggle, honors prefers-reduced-motion. |
| Data | `lib/campaign.ts` — the full 26-entry live colorway manifest + hero worlds + runway order, each asset tagged with its serving source. Referenced at live CDN URLs — nothing re-hosted, no binaries added. |

Product and collection pages are **untouched** — real catalog photography
(lib/catalog) exactly as wave 1. No prices, products, GSM facts, or discount
codes changed anywhere.

## 3. Build + verification

- `npm run build` — **PASS** (all routes; `/` 3.05 kB, 113 kB first load).
- Production server (`npm run start`, port 3100) — homepage 200; served HTML
  references all five films and the Higgsfield-CDN stills.
- Screenshots (Playwright, 1440×900, in `screenshots/`):
  - `home-hero-higgsfield.png` — Water film playing in hero, toggles visible.
  - `home-hero-iron-higgsfield.png` — after clicking 02 Iron: Iron film
    (Snow Wash Lite, Rifle Green) playing — toggle verified working.
  - `home-films-higgsfield.png` — Campaign Films intro + Water panel.
  - `home-runway-higgsfield.png` — runway rail (Look 1 / Film 2 / Look 3 /
    Film 4 cards with campaign stills).
  - `home-full-higgsfield.png` — full page.
- Fix during verification: headless Chromium did not paint `<video>`
  posters, so `Film` renders the poster as an image layer under the video —
  the same layering the live theme uses.

## 4. Exact changed-file list (for the main session's follow-up push)

New:
- `lib/campaign.ts`
- `components/Film.tsx`
- `components/HeroWorlds.tsx`
- `components/CampaignFilms.tsx`
- `components/Runway.tsx`
- `components/WorldStory.tsx`
- `HIGGSFIELD-INTEGRATION.md` (this file)
- `screenshots/home-hero-higgsfield.png`, `screenshots/home-hero-iron-higgsfield.png`,
  `screenshots/home-films-higgsfield.png`, `screenshots/home-runway-higgsfield.png`,
  `screenshots/home-full-higgsfield.png` — **PNG binaries: push-files is
  text-only; route via GitHub web UI upload if wanted, or skip (proof only).**

Modified:
- `app/page.tsx` (hero background → HeroWorlds; +CampaignFilms, +Runway, +WorldStory)
- `next.config.mjs` (images.remotePatterns += `d2ol7oe51mr4n9.cloudfront.net`)

Nothing else changed. No push, no deploy performed by this run.
