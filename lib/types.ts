export interface ProductImage {
  url: string;
  width: number | null;
  height: number | null;
  alt: string;
}

export interface ProductVariant {
  /** Numeric Shopify variant id — used to build the checkout permalink. */
  id: string;
  title: string;
  price: number;
  compareAtPrice: number | null;
  availableForSale: boolean;
  options: Record<string, string>;
}

export interface ProductOption {
  name: string;
  values: string[];
}

export interface Product {
  id: string;
  handle: string;
  title: string;
  productType: string;
  tags: string[];
  description: string;
  descriptionHtml: string;
  /**
   * Fabric weight in GSM — populated ONLY when the value appears in the
   * product's own live Shopify description. Null means: make no GSM claim.
   */
  gsm: number | null;
  priceMin: number;
  priceMax: number;
  options: ProductOption[];
  images: ProductImage[];
  variants: ProductVariant[];
  collections: string[];
}

/**
 * Internal data value — the heaviest verified fabric weight in the
 * catalog (the thirteen-tee heavy line). Used ONLY to decide which
 * products may carry the "THE HEAVIEST" badge/panel in the UI; the
 * value itself is never rendered (brand language ruling, 2026-11-03:
 * weight is sold in human words, never in numbers). Mirror of the
 * data-computed maximum in lib/catalog (getHeaviestGsm) — keep in sync
 * if the catalog's verified weights ever change.
 */
export const HEAVIEST_GSM = 425;

/** True when the product belongs to the verified heaviest line. */
export function isHeaviest(p: Pick<Product, "gsm">): boolean {
  return p.gsm !== null && p.gsm === HEAVIEST_GSM;
}

export interface Collection {
  handle: string;
  title: string;
  description: string;
  image: string | null;
  productHandles: string[];
}

export interface StorePage {
  title: string;
  handle: string;
  bodyHtml: string;
  isPublished: boolean;
}

export interface Catalog {
  products: Product[];
  collections: Collection[];
  pages: Record<string, StorePage>;
  exportedFrom: string;
}

export interface BlogArticleImage {
  url: string;
  width: number | null;
  height: number | null;
  alt: string;
}

export interface BlogArticle {
  id: string;
  handle: string;
  title: string;
  excerpt: string;
  summaryHtml: string;
  bodyHtml: string;
  publishedAt: string;
  updatedAt: string;
  tags: string[];
  author: string;
  image: BlogArticleImage | null;
}

export interface Blog {
  blogHandle: string;
  blogTitle: string;
  articles: BlogArticle[];
  exportedFrom: string;
}
