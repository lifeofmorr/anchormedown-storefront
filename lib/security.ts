import { errors } from "./errors";

/**
 * CSRF origin check for mutation surfaces. A state-changing request is
 * only honored when its Origin (or Referer fallback) is this site's own
 * host. Next.js already origin-checks Server Actions; route handlers
 * and defense-in-depth call this explicitly.
 */
export function assertSameOrigin(headers: Headers): void {
  const host = headers.get("host");
  if (!host) throw errors.forbidden();
  const origin = headers.get("origin");
  if (origin) {
    let originHost: string;
    try {
      originHost = new URL(origin).host;
    } catch {
      throw errors.forbidden();
    }
    if (originHost !== host) throw errors.forbidden();
    return;
  }
  const referer = headers.get("referer");
  if (referer) {
    try {
      if (new URL(referer).host !== host) throw errors.forbidden();
    } catch {
      throw errors.forbidden();
    }
  }
  // No Origin and no Referer (e.g. a same-origin form post from an older
  // browser, or a server-side call): allow — the rate limiter and the
  // payload validation still apply.
}

/** Client IP from proxy headers, for rate-limit bucketing. */
export function ipFromHeaders(headers: Headers): string {
  const fwd = headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0]!.trim();
  return headers.get("x-real-ip") ?? "unknown";
}
