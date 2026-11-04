import { captureRepository } from "../repositories/capture-repository";
import {
  captureCreateSchema,
  entriesQuerySchema,
  type CaptureCreateInput,
  type EntriesQuery,
} from "../validations";

/**
 * Capture service — business logic over the capture repository.
 * Validation happens here (Zod) so every entry point (server action,
 * API route) gets identical rules; rate limiting happens at the entry
 * points, before the service is invoked.
 */
export const captureService = {
  async submit(raw: unknown) {
    const input: CaptureCreateInput = captureCreateSchema.parse(raw);
    const { capture, created } = await captureRepository.upsert(
      input.email,
      input.source,
      input.consent,
    );
    return { created, id: capture.id, source: capture.source };
  },

  async listEntries(rawQuery: Partial<EntriesQuery>) {
    const query = entriesQuerySchema.parse(rawQuery);
    const { rows, total } = await captureRepository.list(query);
    return {
      rows: rows.map((r) => ({
        id: r.id,
        email: r.email,
        source: r.source,
        consent: r.consent,
        createdAt: r.createdAt.toISOString(),
      })),
      total,
      page: query.page,
      pageSize: query.pageSize,
      totalPages: Math.max(1, Math.ceil(total / query.pageSize)),
      sort: query.sort,
      dir: query.dir,
      q: query.q,
      source: query.source ?? null,
    };
  },

  /**
   * Operator stats. Every number is a count of capture rows — signups
   * this app's own forms persisted. Nothing here is sales data.
   */
  async getStats(days: number) {
    const now = new Date();
    const start = new Date(now);
    start.setHours(0, 0, 0, 0);
    start.setDate(start.getDate() - (days - 1));
    const dayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const [total, last24h, last7d, bySourceRows, since] = await Promise.all([
      captureRepository.countAll(),
      captureRepository.countSince(dayAgo),
      captureRepository.countSince(weekAgo),
      captureRepository.countBySource(),
      captureRepository.findSince(start),
    ]);

    const bySource: Record<string, number> = {
      "bf-early-access": 0,
      giveaway: 0,
      newsletter: 0,
    };
    for (const row of bySourceRows) bySource[row.source] = row.count;

    // Per-day series, zero-filled, split by source for a stacked chart.
    const series: {
      date: string;
      label: string;
      total: number;
      "bf-early-access": number;
      giveaway: number;
      newsletter: number;
    }[] = [];
    const byDay = new Map<string, (typeof series)[number]>();
    for (let i = 0; i < days; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      const key = d.toISOString().slice(0, 10);
      const entry = {
        date: key,
        label: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        total: 0,
        "bf-early-access": 0,
        giveaway: 0,
        newsletter: 0,
      };
      series.push(entry);
      byDay.set(key, entry);
    }
    for (const row of since) {
      const key = row.createdAt.toISOString().slice(0, 10);
      const entry = byDay.get(key);
      if (!entry) continue;
      entry.total += 1;
      if (row.source === "bf-early-access") entry["bf-early-access"] += 1;
      else if (row.source === "giveaway") entry.giveaway += 1;
      else if (row.source === "newsletter") entry.newsletter += 1;
    }

    return { total, last24h, last7d, bySource, series, days };
  },
};
