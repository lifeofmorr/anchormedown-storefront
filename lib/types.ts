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
