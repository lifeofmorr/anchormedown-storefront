import { catalogRepository } from "../repositories/catalog-repository";

/**
 * Catalog composition stats for the operator surface.
 *
 * Everything is computed live from data/catalog.json + data/blog.json —
 * the same exports the storefront renders — so what the operator sees
 * can never drift from what the site shows. These are composition
 * numbers (what the catalog IS), never sales numbers.
 */
export const catalogService = {
  getComposition() {
    const products = catalogRepository.products();
    const collections = catalogRepository.collections();
    const articles = catalogRepository.articles();
    const heaviest = catalogRepository.heaviestProducts();

    const prices = products.map((p) => p.priceMin);
    const priceMin = Math.min(...prices);
    const priceMax = Math.max(...prices);
    const priceAvg = prices.reduce((a, b) => a + b, 0) / prices.length;

    // Weight classes in words — the same classes the storefront renders.
    // Internal values decide the class; only the word ever displays.
    const heaviestCount = heaviest.length;
    const heavyweightCount = products.filter(
      (p) => p.gsm !== null && p.gsm !== undefined && p.gsm >= 300 && !heaviest.includes(p),
    ).length;
    const noClaimCount = products.filter((p) => p.gsm === null || p.gsm === undefined).length;
    const standardCount = products.length - heaviestCount - heavyweightCount - noClaimCount;

    const withImages = products.filter((p) => p.images.length > 0).length;
    const totalVariants = products.reduce((n, p) => n + p.variants.length, 0);

    const perCollection = collections
      .map((c) => ({
        handle: c.handle,
        title: c.title,
        count: c.productHandles.length,
      }))
      .sort((a, b) => b.count - a.count);

    return {
      productCount: products.length,
      collectionCount: collections.length,
      articleCount: articles.length,
      variantCount: totalVariants,
      priceMin,
      priceMax,
      priceAvg: Math.round(priceAvg * 100) / 100,
      withImages,
      weightClasses: [
        { label: "The Heaviest line", count: heaviestCount },
        { label: "Heavyweight", count: heavyweightCount },
        { label: "Standard build", count: standardCount },
        { label: "No weight claim", count: noClaimCount },
      ],
      perCollection,
    };
  },
};
