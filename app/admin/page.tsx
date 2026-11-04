import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import CapturesChart from "@/components/admin/CapturesChart";
import EntriesTable from "@/components/admin/EntriesTable";
import LogoutButton from "@/components/admin/LogoutButton";
import { captureService } from "@/lib/services/capture-service";
import { catalogService } from "@/lib/services/catalog-service";
import { entriesQuerySchema } from "@/lib/validations";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/session";
import { money } from "@/lib/format";

export const metadata: Metadata = {
  title: "Operator — Anchor Me Down",
  robots: { index: false, follow: false },
};
export const dynamic = "force-dynamic";

/**
 * Operator surface. Middleware gates it; the page re-verifies the
 * session before reading anything (defense in depth).
 *
 * Every number on this page is exactly what its label says: capture
 * rows are email signups this app's own forms persisted; catalog stats
 * are computed from the same export the storefront renders. There is
 * no sales or revenue data in this app — Shopify holds that record.
 */
export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const store = await cookies();
  const authed = await verifySessionToken(store.get(SESSION_COOKIE)?.value);
  if (!authed) redirect("/admin/login");

  const sp = await searchParams;
  const query = entriesQuerySchema.parse({
    page: typeof sp.page === "string" ? sp.page : undefined,
    pageSize: typeof sp.pageSize === "string" ? sp.pageSize : undefined,
    sort: typeof sp.sort === "string" ? sp.sort : undefined,
    dir: typeof sp.dir === "string" ? sp.dir : undefined,
    q: typeof sp.q === "string" ? sp.q : undefined,
    source: typeof sp.source === "string" ? sp.source : undefined,
  });

  const [stats, entries, catalog] = await Promise.all([
    captureService.getStats(30),
    captureService.listEntries(query),
    Promise.resolve(catalogService.getComposition()),
  ]);

  const kpis = [
    { label: "Total email captures", note: "Rows in this app's captures database — all lists, all time.", value: stats.total },
    { label: "Captured in 24 hours", note: "New signups persisted in the last 24 hours.", value: stats.last24h },
    { label: "Captured in 7 days", note: "New signups persisted in the last 7 days.", value: stats.last7d },
    { label: "Black Friday early access", note: "Signups on the BF early-access list, all time.", value: stats.bySource["bf-early-access"] ?? 0 },
  ];

  return (
    <section className="mx-auto w-full max-w-7xl px-4 pb-10 pt-36 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[11px] uppercase tracking-[0.35em] text-brass">Anchor Me Down · Operator</p>
          <h1 className="mt-2 font-display text-4xl uppercase leading-none text-bone sm:text-5xl">
            The desk
          </h1>
          <p className="mt-3 max-w-2xl text-sm text-ash">
            What this app itself knows: the email lists its forms have built, and what the
            catalog is made of. Orders and revenue live in Shopify — this surface never
            invents them.
          </p>
        </div>
        <LogoutButton />
      </div>

      <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {kpis.map((kpi) => (
          <div key={kpi.label} className="border border-seam bg-coal p-5">
            <p className="font-display text-4xl text-bone">{kpi.value}</p>
            <p className="mt-2 text-[11px] uppercase tracking-[0.2em] text-brass">{kpi.label}</p>
            <p className="mt-1 text-xs text-ash">{kpi.note}</p>
          </div>
        ))}
      </div>

      <div className="mb-8">
        <CapturesChart initialSeries={stats.series} />
      </div>

      <div className="mb-8 grid gap-4 lg:grid-cols-2">
        <div className="border border-seam bg-coal p-5">
          <h2 className="font-display text-lg uppercase tracking-[0.08em] text-bone">
            Catalog composition
          </h2>
          <p className="mb-4 text-xs text-ash">
            Computed live from the same catalog export the storefront renders.
          </p>
          <dl className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
            <div><dt className="text-ash">Products</dt><dd className="text-bone">{catalog.productCount}</dd></div>
            <div><dt className="text-ash">Variants</dt><dd className="text-bone">{catalog.variantCount}</dd></div>
            <div><dt className="text-ash">Collections</dt><dd className="text-bone">{catalog.collectionCount}</dd></div>
            <div><dt className="text-ash">Journal articles</dt><dd className="text-bone">{catalog.articleCount}</dd></div>
            <div>
              <dt className="text-ash">Price span</dt>
              <dd className="text-bone">{money(catalog.priceMin)} – {money(catalog.priceMax)}</dd>
            </div>
            <div><dt className="text-ash">Average price</dt><dd className="text-bone">{money(catalog.priceAvg)}</dd></div>
            <div><dt className="text-ash">Products with photography</dt><dd className="text-bone">{catalog.withImages} of {catalog.productCount}</dd></div>
          </dl>
          <h3 className="mt-6 text-[11px] uppercase tracking-[0.2em] text-brass">Weight classes, in words</h3>
          <ul className="mt-2 space-y-1.5 text-sm">
            {catalog.weightClasses.map((w) => (
              <li key={w.label} className="flex justify-between border-b border-seam/60 pb-1.5">
                <span className="text-bone">{w.label}</span>
                <span className="text-ash">{w.count} products</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="border border-seam bg-coal p-5">
          <h2 className="font-display text-lg uppercase tracking-[0.08em] text-bone">
            Collections
          </h2>
          <p className="mb-4 text-xs text-ash">Product counts per collection, from the catalog export.</p>
          <ul className="space-y-1.5 text-sm">
            {catalog.perCollection.map((c) => (
              <li key={c.handle} className="flex justify-between border-b border-seam/60 pb-1.5">
                <span className="text-bone">{c.title}</span>
                <span className="text-ash">{c.count} products</span>
              </li>
            ))}
          </ul>
          <h3 className="mt-6 text-[11px] uppercase tracking-[0.2em] text-brass">Lists</h3>
          <ul className="mt-2 space-y-1.5 text-sm">
            <li className="flex justify-between border-b border-seam/60 pb-1.5">
              <span className="text-bone">Black Friday early access</span>
              <span className="text-ash">{stats.bySource["bf-early-access"] ?? 0} captures</span>
            </li>
            <li className="flex justify-between border-b border-seam/60 pb-1.5">
              <span className="text-bone">Giveaway</span>
              <span className="text-ash">{stats.bySource.giveaway ?? 0} captures</span>
            </li>
            <li className="flex justify-between border-b border-seam/60 pb-1.5">
              <span className="text-bone">Newsletter</span>
              <span className="text-ash">{stats.bySource.newsletter ?? 0} captures</span>
            </li>
          </ul>
        </div>
      </div>

      <div>
        <h2 className="mb-3 font-display text-lg uppercase tracking-[0.08em] text-bone">
          Captures
        </h2>
        <EntriesTable
          rows={entries.rows}
          total={entries.total}
          page={entries.page}
          pageSize={entries.pageSize}
          totalPages={entries.totalPages}
          sort={entries.sort}
          dir={entries.dir}
          q={entries.q}
          source={entries.source}
        />
      </div>
    </section>
  );
}
