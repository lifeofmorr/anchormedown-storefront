/**
 * Operator session for /admin — a single-operator gate (Don).
 *
 * The session token is an HMAC-SHA256 signed payload, issued only after
 * a timing-safe password check against ADMIN_PASSWORD, and carried in
 * an httpOnly cookie. Implemented on Web Crypto so the exact same code
 * verifies in middleware (Edge) and in Node route handlers/actions.
 *
 * This is deliberately NOT shopper auth — customer accounts stay with
 * Shopify. This gate protects only the operator surface.
 */
export const SESSION_COOKIE = "amd_admin_session";
const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

function adminPassword(): string {
  const pw = process.env.ADMIN_PASSWORD;
  if (!pw || pw.length < 8) {
    throw new Error("ADMIN_PASSWORD is not configured (min 8 characters).");
  }
  return pw;
}

async function hmacKey(): Promise<CryptoKey> {
  const digest = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(`amd-admin-session:${adminPassword()}`),
  );
  return crypto.subtle.importKey("raw", digest, { name: "HMAC", hash: "SHA-256" }, false, [
    "sign",
    "verify",
  ]);
}

function toBase64Url(bytes: Uint8Array): string {
  let bin = "";
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(s: string): Uint8Array {
  const b64 = s.replace(/-/g, "+").replace(/_/g, "/");
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes;
}

interface SessionPayload {
  role: "operator";
  exp: number;
}

export async function createSessionToken(): Promise<string> {
  const payload: SessionPayload = { role: "operator", exp: Date.now() + SESSION_TTL_MS };
  const body = toBase64Url(new TextEncoder().encode(JSON.stringify(payload)));
  const key = await hmacKey();
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(body));
  return `${body}.${toBase64Url(new Uint8Array(sig))}`;
}

export async function verifySessionToken(token: string | undefined | null): Promise<boolean> {
  if (!token) return false;
  const [body, sig] = token.split(".");
  if (!body || !sig) return false;
  try {
    const key = await hmacKey();
    const ok = await crypto.subtle.verify(
      "HMAC",
      key,
      fromBase64Url(sig) as BufferSource,
      new TextEncoder().encode(body),
    );
    if (!ok) return false;
    const payload = JSON.parse(
      new TextDecoder().decode(fromBase64Url(body)),
    ) as SessionPayload;
    return payload.role === "operator" && payload.exp > Date.now();
  } catch {
    return false;
  }
}

/** Constant-time password check: hash both sides, compare every byte. */
export async function passwordMatches(candidate: string): Promise<boolean> {
  const enc = new TextEncoder();
  const [a, b] = await Promise.all([
    crypto.subtle.digest("SHA-256", enc.encode(candidate)),
    crypto.subtle.digest("SHA-256", enc.encode(adminPassword())),
  ]);
  const av = new Uint8Array(a);
  const bv = new Uint8Array(b);
  let diff = 0;
  for (let i = 0; i < av.length; i++) diff |= av[i]! ^ bv[i]!;
  return diff === 0;
}

export const sessionCookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  path: "/",
  secure: process.env.NODE_ENV === "production",
  maxAge: Math.floor(SESSION_TTL_MS / 1000),
};
