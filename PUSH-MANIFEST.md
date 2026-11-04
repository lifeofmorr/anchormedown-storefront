# PUSH MANIFEST — Elevation V2 (full-stack pass) — for the MAIN session to push

Subagents do not push (approval cards can't be collected in subagent
sessions). Everything below is built, verified, and committed locally.

- **Repo:** `lifeofmorr/anchormedown-storefront`
- **Branch:** `main`
- **Local staging:** git initialized in this directory 2026-11-04 with a
  single commit of the full current tree (the pre-v2 state exists only
  on the remote). The push that matters is the DELTA list below — the
  same text files the previous passes shipped, plus the v2 additions.
  If the main session pushes from its own checkout, apply the delta;
  the local commit here is the byte-exact staging copy.
- **Suggested commit message:** `Elevation v2: full-stack pass — Prisma captures DB, operator /admin, rate limiting, typed errors, real form backend`
- **Full record:** `ELEVATION-V2-RECORD.md` (phases, deviations,
  smoke-test evidence, visual scores, Vercel env flags).

## Vercel (auto-deploys from main on push)
Expected preview: https://anchormedown-storefront.vercel.app
**Set these project env vars** (see ELEVATION-V2-RECORD.md for detail):
`DATABASE_URL` (Postgres for durable captures — SQLite file resets on
Vercel), `ADMIN_PASSWORD`, `NEXT_PUBLIC_SITE_URL`; optional
`UPSTASH_REDIS_URL` + `UPSTASH_REDIS_TOKEN`.

## NEW files (text — push-files route)
- `.env.example`
- `vercel.json`
- `middleware.ts`
- `prisma/schema.prisma`
- `prisma/seed.ts`
- `prisma/migrations/migration_lock.toml`
- `prisma/migrations/*/migration.sql` (the `*_init` migration)
- `lib/env.ts`
- `lib/db.ts`
- `lib/rate-limiter.ts`
- `lib/errors.ts`
- `lib/security.ts`
- `lib/session.ts`
- `lib/validations/index.ts`
- `lib/repositories/capture-repository.ts`
- `lib/repositories/catalog-repository.ts`
- `lib/services/capture-service.ts`
- `lib/services/catalog-service.ts`
- `app/actions/capture.ts`
- `app/api/admin/login/route.ts`
- `app/api/admin/logout/route.ts`
- `app/api/admin/stats/route.ts`
- `app/admin/page.tsx`
- `app/admin/login/page.tsx`
- `app/admin/loading.tsx`
- `app/not-found.tsx`
- `app/error.tsx`
- `app/blog/loading.tsx`
- `app/search/loading.tsx`
- `app/template.tsx`
- `components/Providers.tsx`
- `components/Skeletons.tsx`
- `components/ui/DataTable.tsx`
- `components/admin/EntriesTable.tsx`
- `components/admin/CapturesChart.tsx`
- `components/admin/LogoutButton.tsx`
- `ELEVATION-V2-RECORD.md`

## MODIFIED files (text — push-files route)
- `package.json` (deps: zod, prisma + @prisma/client, @tanstack/react-query,
  framer-motion, recharts, @upstash/redis, next-themes; devDeps: tsx,
  playwright-core; scripts: postinstall/db:*)
- `package-lock.json` (regenerated; registry URLs normalized to npmjs)
- `.gitignore` (.env, *.db, .vercel added)
- `next.config.mjs` (security headers added; images/rewrites untouched)
- `app/layout.tsx` (Providers wrap)
- `tailwind.config.ts` (unused blue `harbor` token removed)
- `app/api/capture/route.ts` (rewritten onto the service stack)
- `components/CaptureForm.tsx` (server action + consent + new success copy)
- `app/page.tsx` (CaptureForm source → bf-early-access)
- `app/pages/black-friday/page.tsx` (CaptureForm source → bf-early-access)
- `app/blog/page.tsx` (feature rule prefers an imaged article; tile meta
  skips weight-spec tags)
- `PUSH-MANIFEST.md` (this file)

## Binary (GitHub web-UI route, or omit — proof artifacts)
- `screenshots/home-hero-v2.png`, `screenshots/weight-room-v2.png`,
  `screenshots/product-v2.png`, `screenshots/black-friday-v2.png`,
  `screenshots/blog-index-v2.png`, `screenshots/blog-feature-v2.png`,
  `screenshots/admin-v2.png`, `screenshots/admin-entries-v2.png`

## NEVER push
- `.env` (real values), `prisma/dev.db` (local database),
  `data/captures.local.json` (legacy capture file) — all gitignored.
