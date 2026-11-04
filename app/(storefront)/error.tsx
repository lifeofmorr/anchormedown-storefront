"use client";

import ErrorContent from "@/components/ErrorContent";

/** Storefront error boundary — the shared surface, inside the shop shell. */
export default function StorefrontError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return <ErrorContent error={error} reset={reset} />;
}
