# PUSH MANIFEST — AMD Headless Storefront (for the MAIN session to push)

Subagents do not push (approval cards can't be collected in subagent
sessions). Everything below is built, verified, and staged locally.

## STATUS — refreshed Tue 2026-11-03 ~19:40 ET (preview-deploy run)

- **Production build RE-VERIFIED PASSING tonight** (`npm run build`, exit 0):
  full route table — `/`, `/cart`, 10 collection pages, 62 product pages,
  `/pages/black-friday`, `/pages/giveaway`, `/api/capture`, `/llms.txt`.
- **No Vercel CLI/MCP auth exists on this VM** — checked 2026-11-03:
  `vercel status` → `not_connected`, no refresh token, no `VERCEL_TOKEN`
  anywhere in the workspace, no `.vercel/` link in the project. The
  subagent therefore could NOT deploy directly. (Optional fix for later:
  connect the Vercel connector at https://agent.meta.ai/connectors/connect/vercel
  — separate from the browser session below.)
- **The working route is the one ExploreAwaits proved today:** main-session
  GitHub push (below) → browser Vercel import under the signed-in Team
  Hobby account (team-c29c835d, user donmondemorrison-5143), which deployed
  ExploreAwaits' Next.js app in 38s. Same pattern, one batch:

### One-batch steps for the main session

1. Create repo `lifeofmorr/anchormedown-storefront` and push this folder
   per the inventory below (message + exclusions as listed).
2. Browser (signed-in Vercel session): Add New → Project → Import
   `lifeofmorr/anchormedown-storefront`. Settings: Framework Preset
   **Next.js**, Root Directory `./`, Production branch `main`,
   **no environment variables** (catalog is the static snapshot in
   `data/catalog.json`; `lib/catalog.ts` reads it — no Shopify token
   needed for the preview). Project name: `anchormedown-storefront`.
   **No custom domain** — anchormedown.com stays on Shopify until Don's
   DNS word.
3. Verify on the returned `*.vercel.app` URL: `/`, one `/products/` page,
   `/pages/black-friday`, `/cart` — all 200 with real content.
4. Report the URL to Don in the AMD chat ("Let me see the AMD").

## Suggested repo

- **Name:** `lifeofmorr/anchormedown-storefront` (new repo, private or public
  at Don's standing GitHub pattern)
- **Branch:** `main`
- **Commit message:** `AMD headless storefront — Next.js build (first wave, full-stack standard)`
- **Source dir:** this folder
  (`~/workspace/goals/scale-anchor-me-down-to-1m-month/files/headless-storefront/`)

## File inventory (what to push)

```
package.json  package-lock.json  next.config.mjs  tsconfig.json
postcss.config.mjs  tailwind.config.ts  next-env.d.ts
app/            layout.tsx · globals.css · page.tsx (home)
                products/[handle]/page.tsx · collections/page.tsx
                collections/[handle]/page.tsx · pages/black-friday/page.tsx
                pages/giveaway/page.tsx · cart/page.tsx
                api/capture/route.ts · llms.txt/route.ts
components/     Header · Footer · ProductCard · PurchasePanel
                CartDrawer · CaptureForm · Reveal
lib/            types.ts · catalog.ts · cart.tsx · format.ts
data/           catalog.json (live export, typed) · llms.txt
scripts/        export-catalog.py · transform-catalog.py
                catalog-raw.json · meta-raw.json (raw export evidence)
screenshots/    home-hero · home-full · product-college-special
                collection-womens · black-friday · cart-empty (PNG proof)
APPS-AUDIT.md   URL-PARITY.md   PUSH-MANIFEST.md (this file)
```

## Do NOT push

- `node_modules/`, `.next/` (build output) — add a `.gitignore` at push time
  if the main session wants one; both are regenerable (`npm install`,
  `npm run build`).
- `data/captures.local.json` — runtime capture store, created on first
  signup; never commit customer emails.

## Verification the pusher can re-run

- `npm install && npm run build` → 82 pages, clean compile (Next 15.5.7,
  patched line — do not downgrade to 15.1.x, it carries CVE-2025-66478).
- `npm run start` → `/`, `/products/college-special`, `/collections`,
  `/pages/black-friday`, `/pages/giveaway`, `/cart`, `/llms.txt` all 200.
- POST `/api/capture` with a test email → `{"ok":true}` + a row in
  `data/captures.local.json` tagged `newsletter, bf-first-to-know`.

## After the push (cutover chain — NOT part of this push)

1. Connect the repo in Vercel (browser import under Team Hobby
   team-c29c835d — proven route, see STATUS at top) → deploy on a
   `*.vercel.app` URL → live re-measure.
2. Create the Shopify Storefront API token (headless channel apps are
   already installed) → swap `lib/catalog.ts` to live data.
3. Swap `/api/capture` to the Shopify customer-create/consent flow.
4. Re-embed TrustedSite; eyeball Admin → Customer events for custom pixels
   (see APPS-AUDIT.md).
5. Only then: DNS decision — and never inside Nov 27–30 Black Friday
   weekend without Don's explicit word.
