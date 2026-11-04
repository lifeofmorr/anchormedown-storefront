"use server";

import { headers } from "next/headers";
import { withErrorHandling, errors, type ActionResult } from "@/lib/errors";
import { rateLimit, LIMITS } from "@/lib/rate-limiter";
import { assertSameOrigin, ipFromHeaders } from "@/lib/security";
import { captureService } from "@/lib/services/capture-service";

/**
 * Email capture — the storefront forms' server action.
 * Flow: CSRF origin check → Zod validation (service) → token-bucket
 * rate limit → Prisma persistence. Returns the typed ActionResult
 * contract; the form renders success/error from it directly.
 */
export async function submitCaptureAction(
  input: unknown,
): Promise<ActionResult<{ created: boolean; source: string }>> {
  return withErrorHandling("capture.submit", async () => {
    const h = await headers();
    assertSameOrigin(h);
    const rl = await rateLimit(`capture:${ipFromHeaders(h)}`, LIMITS.capture);
    if (!rl.success) throw errors.rateLimited(rl.retryAfterMs);
    const result = await captureService.submit(input);
    return { created: result.created, source: result.source };
  });
}
