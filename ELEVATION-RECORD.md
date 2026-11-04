# ELEVATION RECORD — AMD Headless Storefront, Design-Elevation Pass

**Date:** Tue 2026-11-03 (ET) · **Scope:** the Vercel preview build only
(`anchormedown-storefront.vercel.app`, repo `lifeofmorr/anchormedown-storefront`).
No push, no deploy, no DNS, no live-Shopify change — anchormedown.com stays on
Shopify per Don's ruling of 2026-11-03 20:27 ET. This record is the push
manifest for the main session.

## Why this pass exists

Don judged the ExploreAwaits rebuild "does not look like a 50-100k website —
looks cheap" because it *migrated* the old design into a new engine. Standing
lesson: **migration ≠ redesign**. This pass therefore started from art
direction, not from the first-wave layout: the first-wave AMD preview kept a
uniform rhythm below the hero (section header + identical 4-column card grid,
four times). That rhythm is gone.

Mid-run, Don raised the bar twice more, and both raises are baked in:

- **Luxury floor (2026-11-03 20:36 ET):** "More luxury more photos more of
  everything to be the best" / "Every site needs to be luxury high
  standards." Luxury is the floor, not the flagship exception — more
  photography and film, larger and more frequent; more depth, motion, finish.
- **Art reference (2026-11-03 20:47 ET): Cigarette Racing
  (cigaretteracing.com)** is AMD's home-world reference — offshore
  performance luxury: dark cinematic fields, film-led, minimal confident
  copy, huge product presence, zero clutter. The grading test applied to
  every section: *would it sit on cigaretteracing.com? If it reads like a
  template store, it isn't at the bar.* The Higgsfield films/stills +
  verified catalog photography are the imagery pool (Higgsfield is AMD-only).

## Art direction — "Iron × Water, set like a magazine"

- **Type system:** Anton poster display (huge, tight, uppercase) against a
  new editorial voice — Instrument Serif italic (brass) for single accent
  words inside headlines ("the *heaviest* tee", "Front. *Back.* Proof.",
  "AS *shot.*"). Disciplined micro-type everywhere else: 10–11px,
  wide-tracked, uppercase.
- **Ghost numerals:** outlined display numerals set behind sections as
  architecture — 425 (hero + 425 line), 01–06 section indices in kickers,
  01/02 film plates, the product count on collection heroes (14), 27–30 on
  Black Friday, 05 on the giveaway, 0 on the empty bag.
- **Materials:** ink/coal fields, brass hairlines, film grain over poster
  surfaces, glass capture panel on the Black Friday poster, a verified-facts
  "keel" strip along the hero's bottom edge.
- **Motion:** the Higgsfield films lead; parallax drift on feature
  photography and the story film frame; slow ken-burns on the two feature
  tiles; scroll reveals retained; the marquee slowed and enlarged.
- **Rhythm:** no two adjacent sections share a layout — film hero →
  marquee → interactive instrument → full-viewport film panels → featured
  spread + staggered roster → parallax full-bleed feature → numbered index
  rows → film runway → front/back gallery plates → split feature →
  asymmetric women's spread → story film → film-backed poster → manifesto.

## The interactive piece — The Weight Room (homepage, position 01)

`components/WeightRoom.tsx` (client). The visitor sets the fabric weight of
"the tee in their drawer" on a machined brass slider (140–300 GSM — the range
ordinary tees live in; presets: Featherweight 150 / Standard tee 180 /
Premium standard 220 / Heavy streetwear 300). AMD's verified 425 column
stands fixed beside it. All logic is real and computed live:

- column heights are proportional to g/m² (scale max 450);
- the multiple is `425 ÷ theirs` (at 180 → 2.4×; at 220 → 1.9×);
- the surplus is `425 − theirs` grams per square meter;
- the verdict line is classed by range (tissue / standard / midweight /
  heavy-for-them);
- it ends in the conversion path: the real 425 line as shoppable cards with
  hover quick-add, plus the fleece classes (380/400) routed to hoodies.

Fact discipline: 425 is this catalog's verified weight (13 tees). The
"typical tee 160–220 GSM" band is presented only as a typical range — no
competitor named, nothing invented. Secondary interactivity: every product
card now carries a hover **quick-add** (first available variant → real cart),
and every collection page has a **printed-weight filter** built from the GSM
values actually present (a product with no verified GSM can never appear
under a weight chip; functionally verified: T-Shirts → 425 GSM shows exactly
the 13).

## What changed, per page

**Global** — `app/layout.tsx` (Instrument Serif added), `tailwind.config.ts`
(accent family), `app/globals.css` (ghost-stroke type, film grain, machined
range-slider styling, weight-column transitions, slower marquee, dark
scrollbar), `components/Footer.tsx` (giant outlined STAY ANCHORED wordmark),
`components/ProductCard.tsx` (now client; hover quick-add; preserved look).

**Home** (`app/page.tsx`) — hero restaged: larger type (13.5rem), serif
accent, ghost 425, parallax on the type block, verified-facts keel strip;
marquee enlarged; **Weight Room** inserted at position 2; Campaign Films
scaled to full-viewport panels with ghost plate numerals (copy verbatim);
the 425 line rebuilt as an editorial spread — College Special full-width
featured tile (ken-burns) + the other twelve as a numbered, staggered
roster (previously 8 in a flat grid); Anchor Standard feature gains parallax
and a spec keel (425 verified / XS–2XL / 12 colorways / $60 — all computed);
Best Sellers rebuilt as a numbered editorial index (all 7, front/back hover
swap, larger plates) via new `components/BestSellerIndex.tsx`; Runway
retained (already at standard from the Higgsfield pass); new **In Stills**
gallery (`components/InStills.tsx`) — front/back campaign diptychs for
Weighted, Anchor Flower, AMD Bull Stitch, Scripted, alternating direction,
plate numerals, shop links; hoodie feature gains parallax + a computed spec
row; Women's rebuilt asymmetric (tall feature + three cards + brass count
tile, 14 pieces); World Story gains a parallax film frame and a serif
pull-quote; Black Friday capture rebuilt as a poster over the Iron film
with ghost 27–30 (was a flat tinted band); manifesto enlarged with serif
accent. Section kickers carry editorial indices 01–06.

**Product** (`app/products/[handle]/page.tsx`, `components/PurchasePanel.tsx`)
— breadcrumb; gallery at 4/5 with an image counter (01/25); buy column
sticky on desktop; the GSM panel rebuilt as a **weight certificate**:
oversized numeral, verified mark, and proportional bars (this piece vs a
typical 180 tee) — rendered only when the product's own GSM is verified;
details section rebuilt as "Measured, *not marketed.*" with a spec sheet
computed from the product's own data (fabric weight, price, sizes,
colorways, variant count); a **campaign band** ("AS *shot.*") shows the
colorway's front/back plates or film from the live manifest where the
manifest carries them; related products staggered.

**Collections** — detail page gains a poster hero band: parallax campaign
model still (editorial priority order, women's campaign pieces lead;
fallback collection image → first product photo), oversized title, ghost
product count, printed-weight count; the grid is the new
`components/CollectionGrid.tsx` (stagger + honest GSM filter). Index page:
wide 21/9 feature tile + offset rhythm tiles (was a uniform 4/3 grid).

**Black Friday** (`app/pages/black-friday/page.tsx`) — full-viewport poster
over the Iron film with grain, ghost 27–30, and the capture form in a glass
panel (film toggle offset below the fixed header); the live page body kept
verbatim in a two-column editorial layout with a sticky rail heading; hero
products staggered. Zero discount codes — verified (see below).

**Giveaway** (`app/pages/giveaway/page.tsx`) — poster header over the
Weighted campaign still with ghost 05 and serif accent; live page body
verbatim; featured products staggered.

**Cart** (`app/cart/page.tsx`) — oversized "Your bag" with a live count
line; the free-shipping meter from the drawer brought onto the page ($200
threshold with the $75 BF-weekend marker at its true 37.5% position);
larger editorial line rows; sticky summary; empty state rebuilt as a poster
with a ghost 0. Checkout handoff unchanged (see verification).

## Preservation verification (production build, measured — not asserted)

- **Build:** `npm run build` passes; **82 static pages** — identical route
  table to the pre-pass baseline (62 products, 10 collections, `/`,
  `/cart`, `/pages/black-friday`, `/pages/giveaway`, `/api/capture`,
  `/llms.txt`).
- **Routes:** all 62 product URLs and all 10 collection URLs return 200.
- **GSM discipline:** catalog distribution unchanged — 425×13, 400×9,
  380×13, 190×1, 26×none. The verified-weight badge renders iff the
  product's GSM is non-null (confirmed in served HTML: React SSR emits
  `425<!-- --> GSM — Verified Weight`; an early literal-string check false-
  flagged this and was corrected against source). No GSM copy was added to
  any no-claim product; collection filter counts are computed from data
  (Women's: 380×5 + 190×1 = "6 with a printed weight").
- **Prices:** spot-check of every product page against catalog priceMin —
  zero failures. `data/catalog.json`, `lib/catalog.ts`, `lib/cart.tsx`,
  `lib/campaign.ts`, `lib/types.ts`, `lib/format.ts` are **untouched**.
- **Black Friday:** zero occurrences of ANCHORED15 / BF425 / TRIPLEHEAVY /
  BLACKFRIDAY20 / SHIP75 on the page; the Nov 27–30 free-shipping-$75 note
  present. Giveaway: zero ANCHORED15.
- **Shipping lines:** `SHIPPING_LINE` verbatim on product pages (incl. the
  Nov 27–30 $75 note); drawer/cart thresholds unchanged ($200 standard,
  $75 BF).
- **Checkout handoff (functional, browser):** Add to Bag on College Special
  → `/cart` checkout href is exactly
  `https://anchormedown.com/cart/41299416645690:1` — the real first
  available variant ID via the Shopify cart permalink. Quick-add wrote a
  real variant (41296968482874) to the cart store.
- **Capture (functional):** POST `/api/capture` returned `{"ok":true}` and
  stored the signup with tags `["newsletter", "bf-first-to-know"]`; the test
  row was removed afterward (file back to 0 rows). Route file untouched.
- **Interactive logic (functional, browser):** slider set to 220 → ratio
  renders 1.9×, surplus +205, verdict "Standard class". Collection filter:
  T-Shirts → 425 GSM → "13 products at a verified 425 GSM", 13 links.
- **Higgsfield placements + live locale copy:** hero worlds, campaign film
  panels, runway, and world story are the same components/assets/copy as
  the verified Higgsfield pass — restyled in scale only, never re-worded;
  `lib/campaign.ts` untouched.
- **/llms.txt:** 200, 2,849 chars, route untouched.

## Screenshots (1440×900, production server; "before" = existing set)

After (this pass): `home-hero-elevated.png`, `home-full-elevated.png`
(22,332px tall vs 6,939 before), `weight-room-elevated.png`,
`home-stills-elevated.png`, `product-elevated.png` (College Special),
`product-campaign-elevated.png` (Weighted campaign band),
`collection-elevated.png` + `collection-full-elevated.png` (Women's),
`black-friday-hero-elevated.png`, `black-friday-elevated.png`,
`giveaway-elevated.png`. Before: the existing `home-hero.png`,
`home-full.png`, `product-college-special.png`, `collection-womens.png`,
`black-friday.png`, `cart-empty.png`, and the `*-higgsfield.png` set.
Note: the campaign plates are 4K PNGs — headless full-page stitches can
paint them blank on a cold image-optimizer cache; the delivered viewport
shots were taken after cache-warming + image-complete waits and show them
rendered.

## Push list for the main session

Text files (push-files route), repo `lifeofmorr/anchormedown-storefront`,
branch `main`:

- NEW: `components/Parallax.tsx`, `components/WeightRoom.tsx`,
  `components/BestSellerIndex.tsx`, `components/CollectionGrid.tsx`,
  `components/InStills.tsx`, `ELEVATION-RECORD.md`
- MODIFIED: `app/layout.tsx`, `app/globals.css`, `tailwind.config.ts`,
  `app/page.tsx`, `app/products/[handle]/page.tsx`,
  `app/collections/page.tsx`, `app/collections/[handle]/page.tsx`,
  `app/pages/black-friday/page.tsx`, `app/pages/giveaway/page.tsx`,
  `app/cart/page.tsx`, `components/ProductCard.tsx`,
  `components/PurchasePanel.tsx`, `components/CampaignFilms.tsx`,
  `components/WorldStory.tsx`, `components/Footer.tsx`

The 11 `screenshots/*-elevated.png` files are binary — per the standing
fleet lesson they cannot ride push-files; send them via the GitHub web UI
in the same batch, or omit them (they are proof artifacts, already shown in
the AMD chat). Nothing else in the project changed; `data/catalog.json`,
`lib/*`, the API routes, and `next.config.mjs` are byte-identical to the
deployed build.
