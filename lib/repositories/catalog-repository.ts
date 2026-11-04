import {
  getAllCollections,
  getAllProducts,
  getHeaviestGsm,
  getHeaviestProducts,
} from "../catalog";
import { getAllArticles } from "../blog";

/**
 * Catalog repository — the read side of the catalog for service-layer
 * consumers (the operator surface). Pages keep reading lib/catalog
 * directly; this wraps the same accessors so stats are computed in one
 * place and the swap point (Storefront API at cutover) stays singular.
 */
export const catalogRepository = {
  products: getAllProducts,
  collections: getAllCollections,
  articles: getAllArticles,
  heaviestProducts: getHeaviestProducts,
  heaviestGsm: getHeaviestGsm,
};
