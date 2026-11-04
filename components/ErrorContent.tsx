"use client";

import { useEffect } from "react";
import Link from "next/link";

/**
 * The error surface, shared by the root and storefront-group error
 * boundaries (each error.tsx is a thin client wrapper around this).
 */
export default function ErrorContent({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Surface the failure server-side via the structured logger's channel.
    console.error(JSON.stringify({ level: "error", scope: "app.error-boundary", message: error.message, digest: error.digest }));
  }, [error]);

  return (
    <section className="px-4 py-28 text-center sm:px-6">
      <div className="mx-auto max-w-xl">
        <p className="text-[11px] uppercase tracking-[0.35em] text-brass">Rough water</p>
        <h1 className="mt-4 font-display text-5xl uppercase leading-[0.95] text-bone sm:text-6xl">
          Something broke below deck.
        </h1>
        <p className="mt-4 text-sm text-ash">
          Not your fault, and not your order — the store itself hit a snag.
          Try the surface again, or head back to harbor.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <button
            onClick={reset}
            className="bg-bone px-8 py-4 font-display text-base uppercase tracking-[0.14em] text-ink transition-colors hover:bg-brass"
          >
            Try again
          </button>
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
