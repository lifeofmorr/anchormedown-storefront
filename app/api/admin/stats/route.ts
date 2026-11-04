import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { statsQuerySchema } from "@/lib/validations";
import { captureService } from "@/lib/services/capture-service";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/session";

/**
 * Operator stats feed for the /admin chart (TanStack Query client).
 * Session-gated in the handler as well as in middleware.
 */
export async function GET(req: Request) {
  const store = await cookies();
  const ok = await verifySessionToken(store.get(SESSION_COOKIE)?.value);
  if (!ok) {
    return NextResponse.json(
      { ok: false, error: { code: "UNAUTHORIZED", message: "Sign in required." } },
      { status: 401 },
    );
  }
  const { searchParams } = new URL(req.url);
  const { days } = statsQuerySchema.parse({ days: searchParams.get("days") ?? 30 });
  const stats = await captureService.getStats(days);
  return NextResponse.json({ ok: true, data: stats });
}
