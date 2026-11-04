# ELEVATION V2 RECORD — AMD Headless Storefront, Full-Stack Pass

**Date:** Tue 2026-11-03 night → Wed 2026-11-04 ~03:40 ET · **Approved by Don**
2026-11-03 22:03 ET ("Build it — AMD storefront elevation").
**Scope:** the headless preview/design app only (repo
`lifeofmorr/anchormedown-storefront`). No live-Shopify change, no DNS —
anchormedown.com stays on Shopify. This record + PUSH-MANIFEST.md are the
handoff for the main session's push.

## What this pass did

Adapted Don's pasted $100K full-stack template (Next.js App Router + TS +
Tailwind + Zod + Prisma + TanStack Query + Framer Motion + rate limiting +
error boundaries) onto the REAL existing codebase, under Don's standing
architecture corrections. Every phase below is complete files with real
logic — no placeholders, no TODOs (`tsc --noEmit` clean; production build
passing; smoke tests measured, §7).

### Phase 1 — ENV
- `lib/env.ts` — strict Zod env validation (DATABASE_URL, ADMIN_PASSWORD
  ≥8, NEXT_PUBLIC_SITE_URL, optional UPSTASH_REDIS_URL/TOKEN), cached,
  failing loudly with named variables.
- `.env.example` committed with all variables documented; the real `.env`
  is gitignored and never staged.

### Phase 2 — DATA (app-owned only)
- `prisma/schema.prisma` — one model, `Capture` (id, email, source,
  consent, createdAt; unique [email, source]; indexes on createdAt,
  source, email). SQLite datasource for local/staging; **no SQLite-only
  types** — move to Postgres by flipping the provider + DATABASE_URL.
  `source` is a validated string (bf-early-access | giveaway |
  newsletter), not a DB enum, for the same portability.
- `prisma/migrations/20261104…_init` — initial migration, applied.
- `prisma/seed.ts` — 37 realistic sample captures over 21 days
  (newsletter base, giveaway bump, BF ramp), idempotent upserts.
  **Staging-only sample data** so /admin can be verified; production
  starts empty.
- Repository layer: `lib/repositories/capture-repository.ts` (only module
  speaking Prisma for captures), `lib/repositories/catalog-repository.ts`.
- Service layer: `lib/services/capture-service.ts` (validate → persist;
  entries listing; operator stats), `lib/services/catalog-service.ts`
  (composition stats computed live from the catalog/blog exports).

### Phase 3 — SECURITY
- `lib/rate-limiter.ts` — token bucket, one interface, two backends:
  Upstash Redis via an atomic Lua script when UPSTASH_* is set;
  in-memory fallback otherwise (Redis outage falls back, never fails the
  storefront). Named limits: capture 10/min/IP, admin login 5/15min/IP.
- `lib/session.ts` — operator session: HMAC-SHA256 signed token
  (Web Crypto, identical verification in Edge middleware and Node),
  httpOnly cookie, 7-day expiry, timing-safe password compare.
- `middleware.ts` — gates /admin + /api/admin/* (login/logout exempt);
  API → 401 JSON, pages → redirect to /admin/login?from=…
- `lib/security.ts` — CSRF origin checks on mutations; security headers
  via next.config (nosniff, DENY framing, referrer policy, permissions
  policy, HSTS).

### Phase 4 — VALIDATION + ERRORS
- `lib/validations/index.ts` — Zod schemas for every mutation payload:
  capture create (email normalize + legacy source mapping), admin login,
  entries query, stats query.
- `lib/errors.ts` — typed error contract
  `{ ok:false, error:{ code, message, fields? } }`, AppError taxonomy,
  `withErrorHandling` wrapper, structured JSON error logging (stacks
  logged server-side, never returned to clients).

### Phase 5 — FORMS WIRED REAL
- `components/CaptureForm.tsx` — now submits through the server action
  `app/actions/capture.ts` (origin check → rate limit → Zod → Prisma),
  with an explicit consent checkbox recorded on the row. Success state:
  **"You are on the list. Stay anchored."** (+ the Nov 27 line on the BF
  list). Both call sites (homepage BF section, BF page) now pass the
  canonical source `bf-early-access`.
- `app/api/capture/route.ts` — rewritten onto the same service stack;
  the legacy `{ ok: true }` success contract is unchanged.

### Phase 6 — PROVIDERS, DESIGN SYSTEM, OPERATOR SURFACE
- `components/Providers.tsx` — TanStack Query (used for real: the /admin
  chart's range feed) + next-themes (dark locked — the brand has one
  cinematic theme; there is no light edition by design).
- `app/template.tsx` — Framer Motion route transitions on every route.
- `components/Skeletons.tsx` + loading.tsx for /admin, /blog, /search.
- `app/not-found.tsx` / `app/error.tsx` — brand-voice boundaries.
- `app/admin/` — the operator desk (session-gated):
  - KPI cards: total captures, 24h, 7d, BF-list size — **every card
    labeled with exactly what it counts** (capture rows in this app's
    database). No sales/revenue numbers exist in this app; the page says
    so, in writing, under the title.
  - `components/admin/CapturesChart.tsx` — Recharts stacked area of
    captures/day by list, 7/30/90-day ranges via React Query against
    `/api/admin/stats`.
  - Catalog composition: products/variants/collections/articles, price
    span/average, photography coverage, weight classes **in words**,
    per-collection counts — computed from the same exports the
    storefront renders.
  - `components/ui/DataTable.tsx` — reusable table (server-driven
    pagination/sorting/search via URL params), used by
    `components/admin/EntriesTable.tsx` with a list filter.
- Tailwind: removed the unused `harbor` token (a blue) from the palette —
  it was defined but never rendered; the palette is now strictly
  ink/coal/seam/bone/ash/brass.

### Template deviations (each deliberate, with rationale)
1. **No Prisma product/order DB, no NextAuth/Clerk for shoppers** —
   Don's correction: Shopify is the system of record for catalog,
   inventory, orders and customer accounts. The template's RBAC becomes
   the truthful equivalent here: a single-operator password gate.
2. **No `src/` tree** — the codebase lives at the repo root
   (`app/`, `components/`, `lib/` with `@/*` → `./`). The template's
   `src/lib/…` paths map to `lib/…`; restructuring the tree would churn
   every verified file for zero gain.
3. **No file-upload component** — no upload surface exists in a
   storefront; inventing one would be scope fiction ("no dead
   components" rule).
4. **No seed/demo sales data anywhere** — the only seeded rows are
   clearly-staging email captures (the template's own Phase-1 ask);
   every admin metric is labeled with what it actually measures.
5. **Tags column dropped** from the old JSON capture file — `source`
   supersedes it (the legacy strings "homepage"/"black-friday-page"
   are mapped to canonical sources by the Zod schema).

## Phase 7 — Verification (measured, not asserted)

- **Build:** `npm run build` PASS (twice, incl. after visual fixes).
  Route table: 62 products, 10 collections, 150 blog paths, /search,
  /admin (dynamic), /admin/login, /api/capture, /api/admin/*, middleware.
- **tsc:** `npx tsc --noEmit` — 0 errors.
- **(a) Capture persistence:** POST /api/capture → `{"ok":true}`; row read
  back from SQLite via Prisma with correct email/source/consent/
  createdAt. (Server-action path shares the same service; the form's
  rendered consent gate + success copy screenshot-verified on the BF
  page.)
- **(b) Admin gate:** GET /admin unauthenticated → 307 →
  /admin/login?from=%2Fadmin. GET /api/admin/stats unauthenticated →
  401 typed. Wrong password → 401. Correct password → 200 + httpOnly
  cookie; /admin renders 200 ("The desk"); login also completed through
  the real UI in the screenshot run.
- **(c) Rate limit:** after a full refill wait, 15 rapid captures from
  one IP → exactly 10 × 200, then 5 × 429. (An earlier spaced burst
  tripped at request 12 — continuous refill at 1 token/6s during the
  test sequence; the tight burst is the clean proof.)
- **(d) Typed errors:** invalid email → 422
  `{code:"VALIDATION_ERROR", fields:{email:"Enter a valid email
  address."}}`; foreign Origin → 403 FORBIDDEN; malformed JSON → 400.
- **(e) Parity spot-checks (production server):** / 200; College Special
  200 with THE HEAVIEST badge + word panel and $60; Bull Hoodie $78;
  Snow Wash carries **no** product-level weight claim (its only "the
  heaviest" hits are the site-wide brand line); /blog 200; 
  /collections/t-shirts-1 200 (the live handle; /collections/t-shirts
  404s here exactly as it would against the live URL map);
  /search?q=heaviest → exactly 13 product links; BF page → 0 discount
  codes; security headers present on /.
- **Smoke rows cleaned:** all 22 `@anchormedown.test` rows deleted;
  database back to the 37 seeded rows.

### Visual pass — screenshot-measured scores (Cigarette rubric)

Screenshots: `screenshots/{home-hero,weight-room,product,black-friday,
blog-index,blog-feature,admin,admin-entries}-v2.png` (1440×900,
production server).

| Surface | Score | Basis |
|---|---|---|
| Homepage hero | 9.5 | Film-led, huge type, serif accent, ghost HEAVY, facts keel. Held from 10: hero is a film portrait (product = the worn tee), not a giant product plate — inherent to the Water film. |
| Weight Room | 9.5 | Real class instrument, brass column, word verdict + measure, conversion CTA. |
| Black Friday page | 9.5 | Film poster, ghost 27–30, glass capture panel; the real form + consent render live. |
| Product page | 9 | Badge + word panel + spec discipline. Gallery leads with flat catalog photography on white (Shopify catalog data) showing the primary image — data-bound, not layout. |
| Blog index | 8.5 | Headline block is a 10. Two defects found & fixed (below). Archive photography is standard article imagery; 42/150 articles have none and render gradient tiles. |
| /admin | 8.5 | Clean, honest, legible; chart + table proven with real rows. Held from 10 by the inherited storefront shell (shop nav frames the desk — removing it needs a route-group restructure) and deliberately flat operator styling. |

**Defects found by the screenshots and FIXED in this pass:**
1. /admin content slid under the fixed storefront header (title/kicker
   collided with the nav) → header clearance added (page, login,
   loading skeleton); re-shot clean.
2. Blog feature tile was a photographic void — the feature rule picked
   the newest non-jargon article, which has no hero image → rule now
   prefers the newest non-jargon article **with** an image; re-shot
   with photography filling the 21/9 tile.
3. The feature tile's meta line rendered the article's first data tag —
   "425 GSM" — as a label → display rule now skips weight-spec tags
   (meta reads "October 28, 2026 · Bodybuilders"); data untouched.

**Named remainders (not fixable inside this pass):**
- **Data exports predate the live store's de-GSM sweep.** The only
  remaining jargon in served pages lives inside `data/catalog.json` /
  `data/blog.json` contents (product descriptions, article bodies/
  titles/tags, image alts) — data at parity with the export, exactly as
  the DE-GSM record scoped it. The live store has since been cleaned at
  the source; the fix here is a **catalog + blog re-export**
  (`scripts/export-*.py` + transforms), a separate verified data step —
  flagged as the follow-up, not silently folded into this pass.
- Product galleries render Shopify catalog photography as-is; on-model
  campaign photography for every product is a photography/money
  decision, not a code change.

## Vercel readiness (steering 2026-11-03 22:04–22:06 ET)

- `vercel.json` committed (`framework: nextjs`); `postinstall` runs
  `prisma generate`; production build is clean with no local-only
  assumptions. Expected preview URL: the existing project —
  **https://anchormedown-storefront.vercel.app** (auto-deploys from
  `main` on push).
- **Project env vars that MUST be set in Vercel for the deployment to
  run the full stack** (flag for the main session):
  - `DATABASE_URL` — ⚠️ Vercel's filesystem is ephemeral: a `file:`
    SQLite URL works per-instance but captures reset on redeploy/scale.
    For durable preview captures, point this at a Postgres (schema is
    portable; flip the datasource provider to `postgresql` in the same
    change) — e.g. a Neon free project per the fleet free-lane plan.
    Without it, the build still succeeds (Prisma connects lazily) but
    capture/admin-stats calls fail at runtime.
  - `ADMIN_PASSWORD` — required; /admin login + middleware read it.
  - `NEXT_PUBLIC_SITE_URL` — set to the preview/production URL.
  - `UPSTASH_REDIS_URL` / `UPSTASH_REDIS_TOKEN` — optional; when unset
    the limiter runs in-memory per instance (fine for a preview).
- Hosting note (Don 22:11 ET, no new spend): everything above runs on
  the free lanes — Vercel Hobby + a free Postgres; nothing in this pass
  requires a paid tier.

## Environment findings (for the record)

- The VM's `/tmp` tmpfs (512M) was at 100% from other lanes' scratch —
  it broke Prisma's engine extraction with ENOSPC until TMPDIR was
  pointed at the home volume. Worth a fleet-wide note.
- npm registry egress reset repeatedly on the large Prisma tarballs;
  installs completed via the npmmirror registry. The committed
  `package-lock.json` was normalized back to registry.npmjs.org URLs
  (integrity hashes are registry-independent; JSON re-validated).
- Prisma pinned to v6 (6.19.3): v7 moves connection config out of the
  schema and requires driver adapters — churn this app doesn't need;
  v6 is the stable pairing for Next 15 + this schema.

---

## PASS 2 — COMPLETE (finisher run, 2026-11-04 ~07:15–07:40 ET)

**The sandbox write wall is DOWN.** Probes (first actions of the
finisher session, the exact operations the wall refused at 23:15 on
2026-11-03 and again ~04:08): `git hash-object -w` → object written,
rc=0; ffmpeg frame extraction from a content-studio reel
(`ready/reel-anchor3d-squat.mp4`, 1 frame at 1s) → 70,074-byte JPEG
written under the goal's `hidden_files/wall-probe/`, rc=0.

**Commits (all LOCAL — the main session pushes):**
- WS1 `d145aea` + WS2 `da4f83c` (pre-wall, unchanged).
- WS3 `0aee9a8` — "Pass 2 WS3: blog index elevation + displayTag
  everywhere" (5 files, +147/−66): `lib/display-tag.ts` (new),
  `lib/blog.ts`, `app/(storefront)/blog/page.tsx`,
  `app/(storefront)/blog/[handle]/page.tsx`,
  `components/SiteSearch.tsx`.
- Docs commit — this record, the PUSH-MANIFEST delta, and the v3
  screenshot set.

**Build + types:** `next build` (TMPDIR on the home volume) PASS —
compiled successfully, 239/239 static pages generated; route table
complete (63 products, 150 blog paths, 10 collections, /search,
/admin dynamic, /api/capture, /api/admin/*, middleware 34.5 kB).
`tsc --noEmit` — 0 errors.

**Smoke (production server, this build) — all green:**
- Parity: / 200; /search?q=heaviest → exactly 13 unique product
  links; /products/the-heavy-set → 200 with $180 present; /blog →
  7 month-group headers + "145 DISPATCHES · 7 MONTHS" archive
  header; article /blog/best-t-shirts-for-bodybuilders → 200,
  meta line via displayTag ("OCTOBER 28, 2026 · BODYBUILDERS" —
  no weight-spec label).
- Capture persist: POST /api/capture → `{"ok":true}`; the row was
  read back from SQLite via Prisma with correct email / source /
  consent / createdAt.
- Admin gate: /admin unauthenticated → 307 →
  /admin/login?from=%2Fadmin; /api/admin/stats unauthenticated →
  401; wrong password → 401; correct password → 200 + httpOnly
  session cookie; authed /admin → 200 with "Operator desk" + "The
  desk" present and the storefront chrome (bag button, footer
  shipping line) ABSENT — the WS2 shell split proven on the WS3
  build. Login also completed through the real UI in the
  screenshot run.
- Rate limit: fresh server, 15 rapid captures from one IP →
  exactly 10 × 200, then 5 × 429.
- Cleanup: all 11 smoke rows deleted; captures back to exactly
  the 37 seeded rows.

**Screenshots (production server, 1440×900) — honest scores:**

Files: `screenshots/{home,blog-index,blog-archive,blog-feature,
blog-grid,blog-article,admin}-v3.png`.

| Surface | Score | Basis |
|---|---|---|
| Homepage hero | 9.5 (holds) | Same discipline as v2: ghost HEAVY, serif accent, facts keel ("13 TEES — ONE HEAVY STANDARD"). Held from 10 on the unchanged basis — the hero is type/film-led and the product is the worn tee, not a giant product plate; the film frame reads near-black in a still capture. |
| Blog index | 9 (was 8.5) | WS3 proven in the shots: huge month-group archive headers with dispatch counts, displayTag meta everywhere (no weight-spec labels), "Featured dispatch" marker, offset grid. Held from 9.5 by data, not code: the newest dispatches carry no article imagery, so their grid tiles render as large dark gradient panels, and the feature tile's hero is the article's own flat product shot. |
| Article page | 8.5 (first v3 measure) | Breadcrumb + displayTag meta + huge display title are the 9+ pattern; the hero region below the header is the article's own (weak, dark) imagery — data-bound, same remainder class as the product galleries. |
| /admin | 9 (was 8.5) | The v2 cap is gone and proven gone: the desk renders in its own slim operator shell — no storefront nav, banner, or bag. KPI cards live off the real rows (37 / 4 / 24 / 13 = the seeds), every card labeled with what it counts. Held from 9.5 by the deliberately flat operator styling and a chart whose series read faint at a glance. |
| Product page | 9 (not re-shot this pass) | Last measured score stands; nothing in WS1–WS3 changed the product layout. |

Capture note: a straight full-page capture of /blog initially
showed the feature tile and grid tiles as voids — a lazy-media
artifact (images load on scroll into view). After a scroll pass
the feature tile fills with its article photography and the grid
renders as designed; the scored shots are the post-scroll set.

**Named remainders (unchanged in kind):** article/product imagery
is Shopify catalog data as exported — campaign photography is a
photography/money decision, not code. Everything else in the
pass-2 scope is verified above.

**Remaining for the main session (unchanged gates):**
1. Push `d145aea` + `da4f83c` + `0aee9a8` + the docs commit via
   the connector snapshot route (exact delta in PUSH-MANIFEST.md).
2. Vercel env vars: `DATABASE_URL` (point at the fleet Neon
   Postgres), `ADMIN_PASSWORD`, `NEXT_PUBLIC_SITE_URL`;
   `UPSTASH_*` optional.
3. Nothing else. anchormedown.com stays on Shopify — no DNS.
