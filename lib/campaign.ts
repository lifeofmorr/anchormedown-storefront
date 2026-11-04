/**
 * AMD campaign media — the website's Higgsfield campaign layer.
 *
 * Mirrors the live Shopify theme v34 (AMD v34 Round-2, theme 131741483066):
 *  - snippets/amd-colorway-campaign-media.liquid — the immutable colorway
 *    allowlist (front / back / film / poster per exact product colorway).
 *  - sections/amd-hero.liquid — dual "world" hero films (Water / Iron).
 *  - sections/amd-campaign-films.liquid — the two campaign film panels.
 *  - sections/amd-social-runway.liquid — runway card order.
 *  - sections/amd-world-experience.liquid — story panel film (Water).
 *
 * Assets are referenced at their live CDN URLs — nothing is re-hosted.
 * `source` records where each asset is served from:
 *  - "higgsfield-cdn": Higgsfield account CDN
 *    (d2ol7oe51mr4n9.cloudfront.net, account user_3IVtMrVI7IjvqOS7jg3pC8kY9oz)
 *  - "shopify-cdn": uploaded copy on Shopify's CDN (Files / video CDN)
 *  - "theme-asset": bundled theme asset filename (no stable public URL —
 *    recorded for completeness, never rendered)
 *
 * Website-only content. Product/collection pages keep real catalog
 * photography from lib/catalog — this layer never replaces it.
 */

export type MediaSource = "higgsfield-cdn" | "shopify-cdn" | "theme-asset";

export interface CampaignEntry {
  handle: string;
  colorway: string;
  /** Campaign model front still. */
  front?: string;
  frontSource: MediaSource;
  /** Campaign model back still, when the live manifest carries one. */
  back?: string;
  /** Campaign film (mp4), when the colorway has one. */
  film?: string;
  filmSource?: MediaSource;
}

const HF = "https://d2ol7oe51mr4n9.cloudfront.net/user_3IVtMrVI7IjvqOS7jg3pC8kY9oz";
const SF = "https://cdn.shopify.com/s/files/1/1250/4869/files";

/** Film 01 · The Water — roses boxy tank film, hosted on Shopify's video CDN. */
export const WATER_FILM =
  "https://cdn.shopify.com/videos/c/vp/a3914469c03a4674837057d291dc9e3f/a3914469c03a4674837057d291dc9e3f.HD-1080p-7.2Mbps-93995277.mp4";

/** Film 02 · The Iron — snow wash lite film, served from the Higgsfield CDN. */
export const IRON_FILM = `${HF}/ae624303-18b9-4517-82c0-3b48b980dad4.mp4`;

export interface HeroWorld {
  id: "water" | "iron";
  label: string;
  film: string;
  filmSource: MediaSource;
  poster: string;
  productHandle: string;
  productTitle: string;
}

/** Hero worlds, in live order — Water is the default active world. */
export const HERO_WORLDS: HeroWorld[] = [
  {
    id: "water",
    label: "Water",
    film: WATER_FILM,
    filmSource: "shopify-cdn",
    poster: `${SF}/amd-v32-roses-boxy-tank-light-beige-front.jpg?v=1789028433&width=1600`,
    productHandle: "roses-boxy-tank",
    productTitle: "Roses Boxy Tank",
  },
  {
    id: "iron",
    label: "Iron",
    film: IRON_FILM,
    filmSource: "higgsfield-cdn",
    poster: `${SF}/AMD-Snow-Wash-Lite-Rifle-Green-front-approved.jpg?v=1788935706&width=1600`,
    productHandle: "snow-wash-lite",
    productTitle: "Snow Wash Lite",
  },
];

/**
 * The live colorway allowlist, transcribed 1:1 from
 * snippets/amd-colorway-campaign-media.liquid (theme v34).
 * Entries gated on a specific variant featured-image on the live store are
 * recorded against their colorway; the poster on the live site is always
 * the model front still.
 */
export const CAMPAIGN_MEDIA: CampaignEntry[] = [
  {
    handle: "bull-hoodie",
    colorway: "Black",
    front: `${SF}/AMD-Bull-Hoodie-Black-front-approved.jpg?v=1788935558&width=1600`,
    frontSource: "shopify-cdn",
    back: `${SF}/AMD-Bull-Hoodie-Black-back-approved.jpg?v=1788935499&width=1600`,
  },
  {
    handle: "modern-anchor",
    colorway: "White",
    front: `${SF}/AMD-Modern-Anchor-White-front-approved.jpg?v=1788935523&width=1600`,
    frontSource: "shopify-cdn",
  },
  {
    handle: "anchor-script",
    colorway: "Snow Wash",
    front: `${SF}/AMD-Anchor-Script-Snow-Wash-front-approved.jpg?v=1788935610&width=1600`,
    frontSource: "shopify-cdn",
  },
  {
    handle: "snow-wash-lite",
    colorway: "Rifle Green",
    front: `${SF}/AMD-Snow-Wash-Lite-Rifle-Green-front-approved.jpg?v=1788935706&width=1600`,
    frontSource: "shopify-cdn",
    back: `${SF}/AMD-Snow-Wash-Lite-Rifle-Green-back-approved.jpg?v=1788935671&width=1600`,
    film: IRON_FILM,
    filmSource: "higgsfield-cdn",
  },
  {
    handle: "roses-boxy-tank-1",
    colorway: "Light Beige",
    front: `${SF}/AMD-Roses-Boxy-Tank-Light-Beige-front-4k.png?v=1788932489&width=1600`,
    frontSource: "shopify-cdn",
    back: `${SF}/AMD-Roses-Boxy-Tank-Light-Beige-back-4k.png?v=1788932525&width=1600`,
  },
  {
    handle: "amd-full-zip-1",
    colorway: "White",
    front: `${SF}/AMD-Full-Zip-1-White-front-4k.png?v=1788932537&width=1600`,
    frontSource: "shopify-cdn",
  },
  {
    handle: "weighted",
    colorway: "Black",
    front: `${SF}/AMD-Weighted-Black-front-4k.png?v=1788932556&width=1600`,
    frontSource: "shopify-cdn",
    back: `${SF}/AMD-Weighted-Black-back-4k.png?v=1788932568&width=1600`,
  },
  {
    handle: "womens-amd-joggers-2",
    colorway: "Rice Apricot",
    front: `${SF}/AMD-Womens-Joggers-Rice-Apricot-front-4k.png?v=1788932356&width=1600`,
    frontSource: "shopify-cdn",
    back: `${SF}/AMD-Womens-Joggers-Rice-Apricot-back-4k.png?v=1788932367&width=1600`,
    film: `${HF}/a7b63f57-9034-469b-97b5-582955d6b675.mp4`,
    filmSource: "higgsfield-cdn",
  },
  {
    handle: "amd-full-zip-2",
    colorway: "White",
    front: `${SF}/AMD-Full-Zip-White-front-4k.png?v=1788932377&width=1600`,
    frontSource: "shopify-cdn",
  },
  {
    handle: "amd-circle-baby-tee",
    colorway: "Vanilla Cream",
    front: `${SF}/AMD-Circle-Baby-Tee-Vanilla-Cream-front-4k.png?v=1788932400&width=1600`,
    frontSource: "shopify-cdn",
    back: `${SF}/AMD-Circle-Baby-Tee-Vanilla-Cream-back-4k.png?v=1788932414&width=1600`,
    film: `${HF}/99e3e14c-193e-40e3-9da3-ee1df209c142.mp4`,
    filmSource: "higgsfield-cdn",
  },
  {
    handle: "bullish",
    colorway: "White",
    front: `${SF}/AMD-Bullish-White-front-4k.png?v=1788933013&width=1600`,
    frontSource: "shopify-cdn",
  },
  {
    handle: "fire",
    colorway: "White",
    front: `${SF}/AMD-Fire-White-front-4k.png?v=1788933033&width=1600`,
    frontSource: "shopify-cdn",
  },
  {
    handle: "amd-bull-stitch",
    colorway: "White Rock",
    front: `${HF}/134a3330-7c2e-480c-86dc-2dd7a3256794_resize.jpg`,
    frontSource: "higgsfield-cdn",
    back: `${HF}/d3d2080e-bd34-41db-b6a9-e55010e63999_resize.jpg`,
  },
  {
    handle: "amd-circle-baby-tee-1",
    colorway: "Pink",
    front: `${HF}/c0b07dcb-142e-4744-8cb3-d86f42daaf40_resize.jpg`,
    frontSource: "higgsfield-cdn",
    back: `${HF}/6b3a7dbe-bb9f-45d0-97b8-19a2cafddf2b_resize.jpg`,
    film: `${HF}/9e1cf05d-2226-4a47-a74c-4a930683cb33.mp4`,
    filmSource: "higgsfield-cdn",
  },
  {
    handle: "amd-full-zip-3",
    colorway: "White",
    front: `${HF}/9ccdd883-a389-49ed-a86f-fa01bc05126f_resize.jpg`,
    frontSource: "higgsfield-cdn",
  },
  {
    handle: "new-wave",
    colorway: "Black",
    front: `${SF}/amd-v32-new-wave-black-model-front.jpg?v=1789037219&width=1600`,
    frontSource: "shopify-cdn",
    back: `${SF}/amd-v32-new-wave-black-model-back.jpg?v=1789037210&width=1600`,
  },
  {
    // Live manifest references a bundled theme asset filename
    // (amd-v31-model-college-special-black-front-1600x2000.jpg) — no stable
    // public URL, so it is recorded but never rendered.
    handle: "college-special",
    colorway: "Black",
    frontSource: "theme-asset",
  },
  {
    handle: "anchor-flower",
    colorway: "Carbon Gray",
    front: `${HF}/25aa208c-881e-4e95-903a-24b30ac80ade.jpg`,
    frontSource: "higgsfield-cdn",
    back: `${HF}/c2677df8-5590-4ce8-baa1-a38f9470e48c.jpg`,
  },
  {
    handle: "roses-boxy-tank",
    colorway: "Light Beige",
    front: `${SF}/amd-v32-roses-boxy-tank-light-beige-front.jpg?v=1789028433&width=1600`,
    frontSource: "shopify-cdn",
    back: `${SF}/amd-v32-roses-boxy-tank-light-beige-back.jpg?v=1789028337&width=1600`,
    film: WATER_FILM,
    filmSource: "shopify-cdn",
  },
  {
    handle: "scripted",
    colorway: "Carbon Gray",
    front: `${SF}/amd-v32-scripted-carbon-gray-front.jpg?v=1789027155&width=1600`,
    frontSource: "shopify-cdn",
    back: `${SF}/amd-v32-scripted-carbon-gray-back.jpg?v=1789027161&width=1600`,
  },
  {
    handle: "anchor-down-hoodie",
    colorway: "Light Blue",
    front: `${SF}/amd-v32-anchor-down-hoodie-light-blue-front.jpg?v=1789025651&width=1600`,
    frontSource: "shopify-cdn",
    back: `${SF}/amd-v32-anchor-down-hoodie-light-blue-back.jpg?v=1789025311&width=1600`,
  },
  {
    // Live manifest withholds the back still for this colorway until its
    // exact rear source is verified — front only, same as live.
    handle: "strength",
    colorway: "Carbon Gray",
    front: `${SF}/amd-v32-strength-carbon-gray-front.jpg?v=1789027353&width=1600`,
    frontSource: "shopify-cdn",
  },
  {
    handle: "anchor-zip",
    colorway: "Rice Apricot",
    front: `${SF}/amd-v32-anchor-zip-rice-apricot-front.jpg?v=1789025734&width=1600`,
    frontSource: "shopify-cdn",
  },
  {
    handle: "anchor-zip-1",
    colorway: "Black",
    front: `${SF}/amd-v32-anchor-zip-1-black-front.jpg?v=1789025517&width=1600`,
    frontSource: "shopify-cdn",
  },
  {
    handle: "sleeveless-hoodie-amd",
    colorway: "Brown",
    front: `${SF}/amd-v32-sleeveless-hoodie-amd-brown-front.jpg?v=1789027178&width=1600`,
    frontSource: "shopify-cdn",
  },
  {
    handle: "anchor-3d",
    colorway: "Cerulean Blue",
    front: `${SF}/amd-anchor-3d-cerulean-blue-approved-model-front-20260922.png?v=1790081828&format=jpg&width=1600`,
    frontSource: "shopify-cdn",
  },
];

/** Runway card order on the live homepage (amd-social-runway). */
export const RUNWAY_HANDLES = [
  "anchor-down-hoodie",
  "snow-wash-lite",
  "anchor-script",
  "roses-boxy-tank",
  "amd-circle-baby-tee",
  "amd-circle-baby-tee-1",
  "womens-amd-joggers-2",
] as const;

export function getCampaignEntry(handle: string): CampaignEntry | undefined {
  return CAMPAIGN_MEDIA.find((e) => e.handle === handle);
}
