# AMD Theme + Apps Dependency Audit — for the headless cutover

Audited 2026-11-03 via the Shopify connector (Admin GraphQL) against the LIVE
store. Nothing was changed. Live theme (MAIN): **AMD v34 Round-2 sticky ATC -
STAGED** (id 131741483066), 449 files; 19 other themes sit unpublished in the
library (cap).

Verdict key: **(a)** reproduce in the Next.js front end · **(b)** backend-side,
unaffected by a front-end cutover · **(c)** breaks at cutover unless the named
replacement is done.

## How the live storefront is actually assembled (evidence)

- `config/settings_data.json` contains only an accent color (#ddb85d) and
  social URLs. **There are no app-embed blocks anywhere in the theme.**
- Template scan (index / product / collection / page / header-group /
  footer-group): section types are the custom `amd-*` sections plus stock
  Dawn sections. **Zero `@app` blocks** — no app renders through theme app
  extensions on the pages that matter.
- The custom shell section references the TrustedSite widget by name; the
  social-runway section is hand-built (no third-party feed embed, no external
  script domains in shell / social / main-product sections).
- SEO structured data in the theme comes from Avada snippet files
  (`avada-seo-*`, 8 snippets).

## Installed apps (22, via `appInstallations`)

### Storefront-facing

| App | What it does here | Verdict |
|---|---|---|
| TrustedSite | Trust badge injected storewide via script tags (the app holds script-tag scopes; the custom shell section carries its hook). Script-tag injection dies with the theme. | **(c) → (a)** Re-embed the TrustedSite script in the Next root layout at cutover (same account, their standard embed). Without this step the badge silently disappears. |
| Klaviyo: Email Marketing & SMS | List sync / flows backend. Any Klaviyo onsite forms would need an app embed — v34 has none active. | **(b)** for sync/flows. Onsite capture is already reproduced natively by the app's CaptureForm + `/api/capture`. If a Klaviyo popup is switched on later, it will NOT carry to headless — use the native form. |
| Klaviyo Reviews | Installed, but the product template renders no review blocks and the product section carries no review widget. Reviews are not live on the current storefront. | **(c)-dormant** Nothing to reproduce today. If reviews launch, use Klaviyo's API-driven/headless widgets — do not resurrect the theme-block version. |
| Instafeed | Installed, but the live homepage renders its social content through the custom-built runway section, not an Instafeed embed. | **(b)** Not load-bearing. No reproduction needed; the Next build's photography sections cover the slot. |
| Search & Discovery (Shopify) | Shopify's search/filter backend. The Next pass has no `/search` route (outside this pass's mandated parity set). | **(a) wave-2** Add `/search` (+ collection filtering) against the data layer / Storefront API before cutover if search traffic matters; the theme's predictive search does not carry. |
| Tabs Studio | Product-page tabs via app blocks — none are placed in the product template. | **(b)** Not load-bearing on the live storefront. |
| Theme Sections & AI Pages | Theme-building tool; writes sections into themes only. | **(b)** No runtime dependency. Its output dies with the theme; nothing customer-facing calls it. |
| TinySEO SEO & Speed + Avada snippets | Theme-side SEO meta/structured-data injection (Avada snippet set lives in the theme). | **(a) DONE in this build** — Next generates per-page metadata natively, and product pages now emit native Product JSON-LD (name, images, USD offers, availability). Remaining parity micro-item: OG/Twitter image tags per template (small follow-up, not a blocker). |
| Translate & Adapt | Translation management (storefront is EN-only). | **(b)** |

### Backend / commerce — all (b), unaffected by the front-end cutover

| App | Role |
|---|---|
| PODpartner: Print On Demand | Fulfillment for AMD orders — flows from Shopify checkout regardless of front end. |
| Art of Where — Print on Demand | POD catalog/fulfillment backend. |
| Tapstitch — Dropshipping | Supplier backend. |
| Flow | Shopify automation (order/customer workflows). |
| Messaging (Shopify) | Shopify Email/Messaging campaigns — the Tue/Thu/Sat email lane lives here, not in the theme. |
| Mobile App | The AMD iOS app channel — separate surface, untouched. |
| Arc: llms.txt | Serves `/llms.txt` through Shopify. **(a) DONE** — the Next build serves `/llms.txt` itself from `data/llms.txt` (extracted from the live store's llms-txt page), so the file survives a DNS cutover. |
| Supermetrics | Reporting export connector. |
| Headless Storefront · Anchor Me Down Storefront | Headless-channel apps already installed on the store — these are the enablers for the Storefront API token at cutover. |
| Shopify ChatGPT MCP · Shopify CLI Connector · Shopify Muse Connector | Agent/admin tooling connections. |

## Tracking pixels

- **No channel pixel apps are installed**: the installation inventory contains
  no Facebook/Meta, Google & YouTube, or TikTok channel app — so there are no
  channel-managed ad pixels to carry over.
- Shopify's own analytics rides `content_for_header` and follows the Shopify
  checkout, which stays Shopify-hosted — order/attribution on the checkout
  side is unaffected.
- **Not API-readable (cutover gate):** custom pixels under Admin → Settings →
  Customer events, and legacy script tags (the connector's grant was denied
  `scriptTags` read access). Before DNS moves, someone with Admin access
  confirms that list; anything found there is re-implemented as a Next-side
  tag (a single analytics component in the root layout). Class **(c)
  conditional** — probably empty, must be eyeballed once.

## Storefront widgets — disposition

- Reviews: not live today (see Klaviyo Reviews) — nothing to port.
- Search: theme predictive search dies with the theme — wave-2 `/search`
  route (above).
- Chat: **no chat widget exists** on the store (no chat app installed, no
  embed) — nothing to port.
- Popups/capture: no app popup is active in v34; capture = native Shopify
  customer form (BF page + footer). Reproduced natively in this build
  (CaptureForm → `/api/capture`, tags `newsletter, bf-first-to-know`).
- Sticky add-to-cart (the v34 "Round-2 sticky ATC" behavior): theme-side
  today. The Next product page keeps the buy column in view on desktop;
  a mobile sticky bar is a named wave-2 refinement, not a cutover blocker.

## Bottom line for the cutover gate

Only two hard actions: **(1)** re-embed TrustedSite in the Next layout, and
**(2)** eyeball Admin → Settings → Customer events + script tags once for
custom pixels. Everything else is either already reproduced natively in this
build (SEO schema, llms.txt, capture) or lives behind Shopify checkout where
the front end never touches it (PODpartner, Flow, Shopify Email, GMC feed).
