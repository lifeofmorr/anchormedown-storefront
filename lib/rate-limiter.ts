import { Redis } from "@upstash/redis";
import { getEnv, hasRedis } from "./env";

/**
 * Token-bucket rate limiter.
 *
 * One interface, two backends:
 *  - Upstash Redis (when UPSTASH_REDIS_URL/TOKEN are set): an atomic Lua
 *    token bucket, correct across serverless instances.
 *  - In-memory (fallback): identical semantics per process — right for
 *    local/staging and a single-instance deployment.
 *
 * A bucket holds up to `limit` tokens and refills continuously at
 * limit/windowMs tokens per millisecond. Each check costs one token.
 */
export interface RateLimitResult {
  success: boolean;
  /** Tokens left in the bucket after this check. */
  remaining: number;
  /** Milliseconds until the bucket is full again. */
  resetMs: number;
  /** Milliseconds to wait before one token is available (0 on success). */
  retryAfterMs: number;
}

export interface RateLimitOptions {
  /** Bucket capacity — max burst. */
  limit: number;
  /** Refill window in milliseconds. */
  windowMs: number;
}

/* ---------------- In-memory backend ---------------- */

interface Bucket {
  tokens: number;
  updatedAt: number;
}

const buckets = new Map<string, Bucket>();

function memoryCheck(
  key: string,
  { limit, windowMs }: RateLimitOptions,
  now: number,
): RateLimitResult {
  const refillPerMs = limit / windowMs;
  const existing = buckets.get(key);
  const elapsed = existing ? now - existing.updatedAt : 0;
  const tokens = Math.min(
    limit,
    (existing ? existing.tokens : limit) + elapsed * refillPerMs,
  );
  if (tokens >= 1) {
    const next = tokens - 1;
    buckets.set(key, { tokens: next, updatedAt: now });
    return {
      success: true,
      remaining: Math.floor(next),
      resetMs: Math.ceil((limit - next) / refillPerMs),
      retryAfterMs: 0,
    };
  }
  buckets.set(key, { tokens, updatedAt: now });
  return {
    success: false,
    remaining: 0,
    resetMs: Math.ceil((limit - tokens) / refillPerMs),
    retryAfterMs: Math.ceil((1 - tokens) / refillPerMs),
  };
}

/* ---------------- Redis backend (Lua token bucket) ---------------- */

const TOKEN_BUCKET_LUA = `
local capacity = tonumber(ARGV[1])
local refill_per_ms = tonumber(ARGV[2])
local now = tonumber(ARGV[3])
local data = redis.call('HMGET', KEYS[1], 'tokens', 'ts')
local tokens = tonumber(data[1])
local ts = tonumber(data[2])
if tokens == nil then
  tokens = capacity
  ts = now
end
tokens = math.min(capacity, tokens + (now - ts) * refill_per_ms)
if tokens >= 1 then
  tokens = tokens - 1
  redis.call('HMSET', KEYS[1], 'tokens', tokens, 'ts', now)
  redis.call('PEXPIRE', KEYS[1], math.ceil((capacity - tokens) / refill_per_ms) + 1000)
  return {1, math.floor(tokens), math.ceil((capacity - tokens) / refill_per_ms), 0}
else
  redis.call('HMSET', KEYS[1], 'tokens', tokens, 'ts', now)
  redis.call('PEXPIRE', KEYS[1], math.ceil((capacity - tokens) / refill_per_ms) + 1000)
  return {0, 0, math.ceil((capacity - tokens) / refill_per_ms), math.ceil((1 - tokens) / refill_per_ms)}
end
`;

let redisClient: Redis | null = null;

function getRedis(): Redis {
  if (!redisClient) {
    const env = getEnv();
    redisClient = new Redis({ url: env.UPSTASH_REDIS_URL, token: env.UPSTASH_REDIS_TOKEN });
  }
  return redisClient;
}

async function redisCheck(
  key: string,
  { limit, windowMs }: RateLimitOptions,
  now: number,
): Promise<RateLimitResult> {
  const refillPerMs = limit / windowMs;
  const res = (await getRedis().eval(TOKEN_BUCKET_LUA, [`ratelimit:${key}`], [
    String(limit),
    String(refillPerMs),
    String(now),
  ])) as [number, number, number, number];
  return {
    success: res[0] === 1,
    remaining: res[1],
    resetMs: res[2],
    retryAfterMs: res[3],
  };
}

/* ---------------- Public API ---------------- */

export async function rateLimit(
  key: string,
  options: RateLimitOptions,
): Promise<RateLimitResult> {
  const now = Date.now();
  if (hasRedis()) {
    try {
      return await redisCheck(key, options, now);
    } catch {
      // A Redis outage must never take the storefront down with it —
      // fall back to the local bucket for this check.
      return memoryCheck(key, options, now);
    }
  }
  return memoryCheck(key, options, now);
}

/** Named limits for the app's mutation surfaces. */
export const LIMITS = {
  /** Public email capture: generous for a human, useless for a bot. */
  capture: { limit: 10, windowMs: 60_000 } satisfies RateLimitOptions,
  /** Operator login: slow enough to make guessing pointless. */
  adminLogin: { limit: 5, windowMs: 15 * 60_000 } satisfies RateLimitOptions,
} as const;

/** Best-effort client IP for bucket keying (proxy-aware). */
export function clientIp(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0]!.trim();
  return req.headers.get("x-real-ip") ?? "unknown";
}
