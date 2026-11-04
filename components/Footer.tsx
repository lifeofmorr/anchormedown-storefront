import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-seam bg-coal">
      <div className="mx-auto max-w-[1440px] px-5 md:px-10 py-16 grid gap-12 md:grid-cols-4">
        <div className="md:col-span-2">
          <p className="font-display text-3xl uppercase tracking-[0.1em] text-bone">
            Anchor Me Down
          </p>
          <p className="mt-4 max-w-md text-sm leading-6 text-ash">
            The heaviest tee in the game. Built between the iron and
            the water. Stay Anchored.
          </p>
        </div>
        <div>
          <p className="text-[11px] tracking-mega uppercase text-ash">Shop</p>
          <ul className="mt-4 space-y-2.5 text-sm text-bone/80">
            <li><Link href="/collections/t-shirts-1" className="hover:text-brass">All T-Shirts</Link></li>
            <li><Link href="/collections/hoodies" className="hover:text-brass">Hoodies</Link></li>
            <li><Link href="/collections/womens-collection" className="hover:text-brass">Women&apos;s Collection</Link></li>
            <li><Link href="/collections/best-sellers" className="hover:text-brass">Best Sellers</Link></li>
            <li><Link href="/collections/new-arrivals" className="hover:text-brass">New Arrivals</Link></li>
          </ul>
        </div>
        <div>
          <p className="text-[11px] tracking-mega uppercase text-ash">The Season</p>
          <ul className="mt-4 space-y-2.5 text-sm text-bone/80">
            <li><Link href="/pages/black-friday" className="hover:text-brass">Black Friday</Link></li>
            <li><Link href="/pages/giveaway" className="hover:text-brass">Giveaway</Link></li>
            <li><Link href="/blog" className="hover:text-brass">The Journal</Link></li>
            <li><Link href="/search" className="hover:text-brass">Search</Link></li>
            <li><Link href="/cart" className="hover:text-brass">Your Bag</Link></li>
          </ul>
        </div>
      </div>
      <div className="overflow-hidden border-t border-seam py-8">
        <p
          aria-hidden="true"
          className="text-stroke-faint select-none whitespace-nowrap text-center font-display text-[11.5vw] uppercase leading-[0.85]"
        >
          Stay Anchored
        </p>
      </div>
      <div className="border-t border-seam py-6 text-center text-[11px] tracking-[0.2em] uppercase text-ash">
        Free shipping on orders $200+ · Nov 27–30: free shipping $75+
      </div>
    </footer>
  );
}
