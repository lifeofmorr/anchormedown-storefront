"use client";

import { useState, type ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";

/**
 * App providers.
 *
 * - TanStack Query: server-state cache for the operator surface (the
 *   /admin stats feed). Storefront pages are server-rendered from the
 *   catalog export and need no client fetching.
 * - Theme: next-themes is wired, with dark locked as the brand's single
 *   cinematic theme — Anchor Me Down has one art direction (ink, bone,
 *   brass); there is no light edition of this storefront by design.
 */
export default function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: { staleTime: 30_000, refetchOnWindowFocus: false, retry: 1 },
        },
      }),
  );
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" forcedTheme="dark" enableSystem={false}>
        {children}
      </ThemeProvider>
    </QueryClientProvider>
  );
}
