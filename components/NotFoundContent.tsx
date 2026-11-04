import Link from "next/link";

/**
 * The 404 surface, shared: rendered bare by the root not-found (admin
 * paths, unmatched routes) and shell-wrapped by the storefront group's
 * not-found, so a missed URL looks the same wherever it happens.
 */
export default function NotFoundContent() {
  return (
    <section className="relative overflow-hidden px-4 py-28 text-center sm:px-6">
      <span
        aria-hidden
        className="text-stroke-bone pointer-events-none absolute inset-x-0 top-6 select-none font-display text-[22vw] leading-none opacity-20"
      >
        404
      </span>
      <div className="relative mx-auto max-w-xl">
        <p className="text-[11px] uppercase tracking-[0.35em] text-brass">Off course</p>
        <h1 className="mt-4 font-display text-5xl uppercase leading-[0.95] text-bone sm:text-6xl">
          Nothing anchored here.
        </h1>
        <p className="mt-4 text-sm text-ash">
          The page you came for has drifted off the chart. The heavy line is
          still where you left it.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            href="/collections"
            className="bg-bone px-8 py-4 font-display text-base uppercase tracking-[0.14em] text-ink transition-colors hover:bg-brass"
          >
            Shop the line
          </Link>
          <Link
            href="/"
            className="border border-seam px-8 py-4 font-display text-base uppercase tracking-[0.14em] text-bone transition-colors hover:border-brass"
          >
            Back to harbor
          </Link>
        </div>
      </div>
    </section>
  );
}
