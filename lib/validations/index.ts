import { z } from "zod";

/**
 * Zod schemas for every mutation payload in the app. Server actions and
 * route handlers parse through these — nothing reaches the service
 * layer unvalidated.
 */

export const CAPTURE_SOURCES = ["bf-early-access", "giveaway", "newsletter"] as const;
export type CaptureSource = (typeof CAPTURE_SOURCES)[number];

/** Legacy source strings the first-wave forms sent, mapped to canonical. */
const LEGACY_SOURCES: Record<string, CaptureSource> = {
  "black-friday": "bf-early-access",
  "black-friday-page": "bf-early-access",
  homepage: "newsletter",
  home: "newsletter",
};

export const captureCreateSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .pipe(z.email("Enter a valid email address."))
    .refine((e) => e.length <= 254, "That email is too long."),
  source: z
    .string()
    .trim()
    .toLowerCase()
    .transform((s): CaptureSource => {
      if ((CAPTURE_SOURCES as readonly string[]).includes(s)) return s as CaptureSource;
      return LEGACY_SOURCES[s] ?? "newsletter";
    }),
  consent: z.boolean().default(true),
});
export type CaptureCreateInput = z.infer<typeof captureCreateSchema>;

export const adminLoginSchema = z.object({
  password: z.string().min(1, "Enter the operator password.").max(256),
});
export type AdminLoginInput = z.infer<typeof adminLoginSchema>;

export const entriesQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(5).max(100).default(20),
  sort: z.enum(["createdAt", "email", "source"]).default("createdAt"),
  dir: z.enum(["asc", "desc"]).default("desc"),
  q: z.string().trim().max(100).optional().default(""),
  source: z.enum(CAPTURE_SOURCES).optional(),
});
export type EntriesQuery = z.infer<typeof entriesQuerySchema>;

export const statsQuerySchema = z.object({
  days: z.coerce.number().int().min(7).max(90).default(30),
});
export type StatsQuery = z.infer<typeof statsQuerySchema>;
