import catalogData from "@/data/catalog.json";
import type { Catalog, Collection, Product, StorePage } from "./types";

/**
 * DATA LAYER — single swap point.
 *
 * Today this reads the typed local export of the LIVE Shopify catalog
 * (data/catalog.json, produced by scripts/export-catalog.py +
 * scripts/transform-catalog.py from the Shopify Admin GraphQL API).
 *
 * At cutover, replace the body of these accessors with Shopify Storefront
 * API calls (same return types). No page or component changes are needed —
 * everything in the app reads through this module only.
 */
const catalog = catalogData as unknown as Catalog;

export function getAllProducts(): Product[] {
  return catalog.products;
}

export function getProduct(handle: string): Product | undefined {
  return catalog.products.find((p) => p.handle === handle);
}

export function getAllCollections(): Collection[] {
  return catalog.collections;
}

export function getCollection(handle: string): Collection | undefined {
  return catalog.collections.find((c) => c.handle === handle);
}

export function getCollectionProducts(handle: string): Product[] {
  const c = getCollection(handle);
  if (!c) return [];
  return c.productHandles
    .map((h) => getProduct(h))
    .filter((p): p is Product => Boolean(p));
}

export function getPage(handle: string): StorePage | undefined {
  return catalog.pages[handle];
}

/** Products carrying a verified GSM fact (value stated in their own description). */
export function getVerifiedGsmProducts(gsm: number): Product[] {
  return catalog.products.filter((p) => p.gsm === gsm);
}

export function getRelatedProducts(product: Product, count = 4): Product[] {
  const scored = catalog.products
    .filter((p) => p.handle !== product.handle)
    .map((p) => ({
      p,
      score:
        p.collections.filter((c) => product.collections.includes(c)).length * 2 +
        (p.gsm === product.gsm && p.gsm !== null ? 1 : 0),
    }))
    .sort((a, b) => b.score - a.score);
  return scored.slice(0, count).map((s) => s.p);
}

export const SHOP_DOMAIN = "anchormedown.com";

/** The line that sits under every buy button on the live store, kept at parity. */
export const SHIPPING_LINE =
  "Free shipping on orders $200+ — four tees get you there · Single-tee US shipping $6–$9 · Ships in 1–3 days · 30-day returns · Nov 27–30: free shipping $75+";
