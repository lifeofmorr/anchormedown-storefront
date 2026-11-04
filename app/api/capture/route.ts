import { NextResponse } from "next/server";
import { toAppError, logError } from "@/lib/errors";
import { rateLimit, LIMITS, clientIp } from "@/lib/rate-limiter";
import { assertSameOrigin } from "@/lib/security";
import { captureService } from "@/lib/services/capture-service";

/**
 * CAPTURE API — the programmatic twin of the capture server action,
 * kept for the { email, source } contract the first-wave forms shipped
 * with. Same pipeline: CSRF origin check → rate limit → Zod validation
 * → Prisma persistence (app-owned captures DB). Success contract is
 * unchanged: { ok: true }.
 */
export async function POST(req: Request) {
  try {
    assertSameOrigin(req.headers);
    const rl = await rateLimit(`capture:${clientIp(req)}`, LIMITS.capture);
    if (!rl.success) {
      return NextResponse.json(
        { ok: false, error: { code: "RATE_LIMITED", message: "Too many attempts — try again shortly." } },
        { status: 429, headers: { "Retry-After": String(Math.ceil(rl.retryAfterMs / 1000)) } },
      );
    }
    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { ok: false, error: { code: "VALIDATION_ERROR", message: "Invalid request body." } },
        { status: 400 },
      );
    }
    await captureService.submit(body);
    return NextResponse.json({ ok: true });
  } catch (err) {
    const appErr = toAppError(err);
    if (appErr.code === "INTERNAL") logError("capture.api", err);
    return NextResponse.json(
      { ok: false, error: appErr.toPayload() },
      { status: appErr.status },
    );
  }
}
