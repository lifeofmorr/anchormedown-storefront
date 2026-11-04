import { ZodError } from "zod";

/**
 * Standardized error contracts for every mutation surface.
 *
 * Server actions and route handlers return (or throw) through here, so
 * the client always sees the same typed shape:
 *   { ok: false, error: { code, message, fields? } }
 * Stacks and driver messages are logged server-side, never leaked.
 */
export type ErrorCode =
  | "VALIDATION_ERROR"
  | "RATE_LIMITED"
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "INTERNAL";

export interface ErrorPayload {
  code: ErrorCode;
  message: string;
  /** Per-field messages when code is VALIDATION_ERROR. */
  fields?: Record<string, string>;
}

export type ActionResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: ErrorPayload };

export class AppError extends Error {
  readonly code: ErrorCode;
  readonly status: number;
  readonly fields?: Record<string, string>;

  constructor(
    code: ErrorCode,
    message: string,
    status: number,
    fields?: Record<string, string>,
  ) {
    super(message);
    this.name = "AppError";
    this.code = code;
    this.status = status;
    this.fields = fields;
  }

  toPayload(): ErrorPayload {
    return { code: this.code, message: this.message, fields: this.fields };
  }
}

export const errors = {
  validation: (fields: Record<string, string>) =>
    new AppError("VALIDATION_ERROR", "Check the highlighted fields.", 422, fields),
  rateLimited: (retryAfterMs: number) =>
    new AppError(
      "RATE_LIMITED",
      `Too many attempts — try again in ${Math.max(1, Math.ceil(retryAfterMs / 1000))} seconds.`,
      429,
    ),
  unauthorized: () => new AppError("UNAUTHORIZED", "Sign in required.", 401),
  forbidden: () => new AppError("FORBIDDEN", "That request is not allowed from here.", 403),
  internal: () => new AppError("INTERNAL", "Something went wrong on our side — try again.", 500),
};

/** Structured, Sentry-shaped server log line. No secrets, no stacks to clients. */
export function logError(scope: string, err: unknown, context?: Record<string, unknown>) {
  const payload = {
    ts: new Date().toISOString(),
    level: "error",
    scope,
    name: err instanceof Error ? err.name : "UnknownError",
    message: err instanceof Error ? err.message : String(err),
    code: err instanceof AppError ? err.code : undefined,
    stack: err instanceof Error ? err.stack : undefined,
    ...context,
  };
  console.error(JSON.stringify(payload));
}

/** Convert any thrown value into the canonical AppError. */
export function toAppError(err: unknown): AppError {
  if (err instanceof AppError) return err;
  if (err instanceof ZodError) {
    const fields: Record<string, string> = {};
    for (const issue of err.issues) {
      const key = issue.path.join(".") || "_";
      if (!fields[key]) fields[key] = issue.message;
    }
    return errors.validation(fields);
  }
  return errors.internal();
}

/**
 * Wrap an async server action / handler body: success passes through as
 * data; anything thrown becomes a typed ActionResult and is logged.
 */
export async function withErrorHandling<T>(
  scope: string,
  fn: () => Promise<T>,
): Promise<ActionResult<T>> {
  try {
    return { ok: true, data: await fn() };
  } catch (err) {
    const appErr = toAppError(err);
    if (appErr.code === "INTERNAL") logError(scope, err);
    return { ok: false, error: appErr.toPayload() };
  }
}
