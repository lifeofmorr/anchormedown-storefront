import type { Capture, Prisma } from "@prisma/client";
import { prisma } from "../db";
import type { EntriesQuery } from "../validations";

/**
 * Capture repository — the only module that speaks Prisma for captures.
 * Services call these; routes/actions never touch the client directly.
 */
export const captureRepository = {
  /** Insert or return the existing row (one row per email+source). */
  async upsert(email: string, source: string, consent: boolean): Promise<{ capture: Capture; created: boolean }> {
    const existing = await prisma.capture.findUnique({
      where: { email_source: { email, source } },
    });
    if (existing) return { capture: existing, created: false };
    const capture = await prisma.capture.create({ data: { email, source, consent } });
    return { capture, created: true };
  },

  async countAll(): Promise<number> {
    return prisma.capture.count();
  },

  async countSince(since: Date): Promise<number> {
    return prisma.capture.count({ where: { createdAt: { gte: since } } });
  },

  async countBySource(): Promise<{ source: string; count: number }[]> {
    const grouped = await prisma.capture.groupBy({
      by: ["source"],
      _count: { _all: true },
    });
    return grouped.map((g) => ({ source: g.source, count: g._count._all }));
  },

  /** Raw rows since a date — the service buckets them by day/source. */
  async findSince(since: Date): Promise<Pick<Capture, "source" | "createdAt">[]> {
    return prisma.capture.findMany({
      where: { createdAt: { gte: since } },
      select: { source: true, createdAt: true },
      orderBy: { createdAt: "asc" },
    });
  },

  async list(query: EntriesQuery): Promise<{ rows: Capture[]; total: number }> {
    const where: Prisma.CaptureWhereInput = {};
    if (query.q) where.email = { contains: query.q.toLowerCase() };
    if (query.source) where.source = query.source;
    const [rows, total] = await Promise.all([
      prisma.capture.findMany({
        where,
        orderBy: { [query.sort]: query.dir },
        skip: (query.page - 1) * query.pageSize,
        take: query.pageSize,
      }),
      prisma.capture.count({ where }),
    ]);
    return { rows, total };
  },
};
