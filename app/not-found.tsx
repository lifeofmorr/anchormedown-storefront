import NotFoundContent from "@/components/NotFoundContent";

/**
 * Root 404 — unmatched routes and anything under /admin land here,
 * bare of the storefront shell. Storefront misses use the group's
 * own not-found (same shared surface, shell-wrapped).
 */
export default function NotFound() {
  return <NotFoundContent />;
}
