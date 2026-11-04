import { z } from "zod";

/**
 * Strict environment validation (Zod). Every server module that needs
 * configuration reads it through here, so a misconfigured deployment
 * fails loudly at first use with a named variable — never silently.
 */
const envSchema = z.object({
  DATABASE_URL: z
    .string()
    .min(1, "DATABASE_URL is required (e.g. file:./dev.db or postgresql://…)"),
  ADMIN_PASSWORD: z
    .string()
    .min(8, "ADMIN_PASSWORD must be at least 8 characters"),
  NEXT_PUBLIC_SITE_URL: z
    .string()
    .url("NEXT_PUBLIC_SITE_URL must be a valid URL")
    .default("http://localhost:3000"),
  UPSTASH_REDIS_URL: z.string().optional().default(""),
  UPSTASH_REDIS_TOKEN: z.string().optional().default(""),
});

export type Env = z.infer<typeof envSchema>;

let cached: Env | null = null;

export function getEnv(): Env {
  if (cached) return cached;
  const parsed = envSchema.safeParse(process.env);
  if (!parsed.success) {
    const issues = parsed.error.issues
      .map((i) => `${i.path.join(".")}: ${i.message}`)
      .join("; ");
    throw new Error(`Invalid environment configuration — ${issues}`);
  }
  cached = parsed.data;
  return cached;
}

/** True when the Upstash Redis rate-limiter backend is configured. */
export function hasRedis(): boolean {
  const e = getEnv();
  return e.UPSTASH_REDIS_URL.length > 0 && e.UPSTASH_REDIS_TOKEN.length > 0;
}
