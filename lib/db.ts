import { PrismaClient } from "@prisma/client";

/**
 * Prisma singleton. Next.js dev hot-reloads would otherwise spawn a new
 * client (and a new connection pool) per reload; the global cache keeps
 * exactly one.
 */
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
