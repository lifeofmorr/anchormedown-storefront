import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/session";

/**
 * Edge middleware — the /admin gate.
 *
 * /admin and the /api/admin/* data routes require the operator session
 * cookie; everything else on the storefront is public. Login/logout are
 * the only admin routes reachable without a session. Verification is
 * the same Web Crypto HMAC check the login route issues against.
 */
export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isAdminSurface = pathname.startsWith("/admin") || pathname.startsWith("/api/admin");
  if (!isAdminSurface) return NextResponse.next();

  const isAuthRoute =
    pathname === "/admin/login" ||
    pathname === "/api/admin/login" ||
    pathname === "/api/admin/logout";
  if (isAuthRoute) return NextResponse.next();

  const token = req.cookies.get(SESSION_COOKIE)?.value;
  const ok = await verifySessionToken(token);
  if (ok) return NextResponse.next();

  if (pathname.startsWith("/api/")) {
    return NextResponse.json(
      { ok: false, error: { code: "UNAUTHORIZED", message: "Sign in required." } },
      { status: 401 },
    );
  }
  const loginUrl = new URL("/admin/login", req.url);
  loginUrl.searchParams.set("from", pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
