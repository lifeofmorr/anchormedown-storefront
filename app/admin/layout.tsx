import Link from "next/link";

/**
 * Operator shell — /admin and /admin/login render here, never inside
 * the storefront's header/footer/cart. One slim bar, one rule at the
 * foot: a working surface, deliberately quieter than the shop.
 */
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-ink">
      <header className="border-b border-seam bg-ink">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-baseline gap-3">
            <span className="font-display text-lg uppercase tracking-[0.08em] text-bone">
              Anchor Me Down
            </span>
            <span className="text-[11px] uppercase tracking-[0.35em] text-brass">
              Operator desk
            </span>
          </div>
          <Link
            href="/"
            className="text-[11px] uppercase tracking-[0.2em] text-ash transition-colors hover:text-bone"
          >
            View storefront
          </Link>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="border-t border-seam">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-4 text-[11px] uppercase tracking-[0.2em] text-ash sm:px-6 lg:px-8">
          <span>Operator surface — one password, one operator</span>
          <span>Orders &amp; revenue live in Shopify</span>
        </div>
      </footer>
    </div>
  );
}
