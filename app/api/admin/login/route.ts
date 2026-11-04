import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { toAppError, logError, errors } from "@/lib/errors";
import { rateLimit, LIMITS, clientIp } from "@/lib/rate-limiter";
import { assertSameOrigin } from "@/lib/security";
import { adminLoginSchema } from "@/lib/validations";
import { createSessionToken, passwordMatches, SESSION_COOKIE, sessionCookieOptions } from "@/lib/session";

/**
 * Operator login. Rate-limited hard (5 attempts / 15 min per IP),
 * timing-safe password compare, httpOnly signed session cookie.
 */
export async function POST(req: Request) {
  try {
    assertSameOrigin(req.headers);
    const rl = await rateLimit(`admin-login:${clientIp(req)}`, LIMITS.adminLogin);
    if (!rl.success) throw errors.rateLimited(rl.retryAfterMs);
    const body = await req.json().catch(() => null);
    const { password } = adminLoginSchema.parse(body);
    if (!(await passwordMatches(password))) {
      return NextResponse.json(
        { ok: false, error: { code: "UNAUTHORIZED", message: "That password does not open this door." } },
        { status: 401 },
      );
    }
    const token = await createSessionToken();
    const store = await cookies();
    store.set(SESSION_COOKIE, token, sessionCookieOptions);
    return NextResponse.json({ ok: true });
  } catch (err) {
    const appErr = toAppError(err);
    if (appErr.code === "INTERNAL") logError("admin.login", err);
    return NextResponse.json({ ok: false, error: appErr.toPayload() }, { status: appErr.status });
  }
}
