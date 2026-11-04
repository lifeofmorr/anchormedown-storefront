"use client";

import ErrorContent from "@/components/ErrorContent";

/** Root error boundary — the shared surface, bare of the shop shell. */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return <ErrorContent error={error} reset={reset} />;
}
