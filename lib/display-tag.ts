/**
 * Display rule (brand language ruling, 2026-11-03): the first tag that
 * may be shown to a customer. Live data carries internal weight-spec
 * tags ("425 gsm", "425") that are metadata, never copy — every render
 * site goes through this helper so the spec never headlines a surface.
 * Returns undefined when no tag qualifies (show the date alone).
 *
 * Standalone module (no data imports) so client components can use it
 * without bundling the catalog/blog exports.
 */
export function displayTag(tags: string[]): string | undefined {
  return tags.find((t) => !/gsm/i.test(t) && !/^\d+$/.test(t));
}
