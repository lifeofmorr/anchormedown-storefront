"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface SeriesPoint {
  date: string;
  label: string;
  total: number;
  "bf-early-access": number;
  giveaway: number;
  newsletter: number;
}

interface StatsResponse {
  ok: boolean;
  data: { series: SeriesPoint[]; days: number };
}

const RANGES = [7, 30, 90] as const;

/**
 * Captures-over-time chart for /admin. Data is the app's own capture
 * rows, bucketed per day and split by list — signups, nothing else.
 * Range switching refetches through TanStack Query.
 */
export default function CapturesChart({ initialSeries }: { initialSeries: SeriesPoint[] }) {
  const [days, setDays] = useState<number>(30);
  const { data, isFetching } = useQuery<StatsResponse>({
    queryKey: ["admin-stats", days],
    queryFn: async () => {
      const res = await fetch(`/api/admin/stats?days=${days}`);
      if (!res.ok) throw new Error("stats failed");
      return res.json();
    },
    initialData:
      days === 30 ? { ok: true, data: { series: initialSeries, days: 30 } } : undefined,
  });

  const series = data?.data.series ?? initialSeries;

  return (
    <div className="border border-seam bg-coal p-5">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-lg uppercase tracking-[0.08em] text-bone">
            Captures over time
          </h2>
          <p className="text-xs text-ash">
            Email signups persisted by this app&apos;s forms, per day, by list.
            {isFetching ? " Updating…" : ""}
          </p>
        </div>
        <div className="flex gap-2" role="group" aria-label="Chart range">
          {RANGES.map((r) => (
            <button
              key={r}
              onClick={() => setDays(r)}
              className={`border px-3 py-1.5 text-[11px] uppercase tracking-[0.2em] transition-colors ${
                days === r
                  ? "border-brass bg-brass/10 text-brass"
                  : "border-seam text-ash hover:border-brass hover:text-bone"
              }`}
            >
              {r}d
            </button>
          ))}
        </div>
      </div>
      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={series} margin={{ top: 8, right: 8, bottom: 0, left: -18 }}>
            <defs>
              <linearGradient id="gBf" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#C8A24B" stopOpacity={0.55} />
                <stop offset="100%" stopColor="#C8A24B" stopOpacity={0.05} />
              </linearGradient>
              <linearGradient id="gGive" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#EDEAE3" stopOpacity={0.4} />
                <stop offset="100%" stopColor="#EDEAE3" stopOpacity={0.04} />
              </linearGradient>
              <linearGradient id="gNews" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#9BA0A6" stopOpacity={0.4} />
                <stop offset="100%" stopColor="#9BA0A6" stopOpacity={0.04} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="#1D2026" vertical={false} />
            <XAxis dataKey="label" tick={{ fill: "#9BA0A6", fontSize: 11 }} tickLine={false} axisLine={{ stroke: "#1D2026" }} minTickGap={24} />
            <YAxis tick={{ fill: "#9BA0A6", fontSize: 11 }} tickLine={false} axisLine={false} allowDecimals={false} />
            <Tooltip
              contentStyle={{ background: "#08090B", border: "1px solid #1D2026", color: "#EDEAE3", fontSize: 12 }}
              labelStyle={{ color: "#C8A24B" }}
            />
            <Legend wrapperStyle={{ fontSize: 11, color: "#9BA0A6" }} />
            <Area type="monotone" dataKey="bf-early-access" name="Black Friday early access" stackId="1" stroke="#C8A24B" fill="url(#gBf)" strokeWidth={2} />
            <Area type="monotone" dataKey="giveaway" name="Giveaway" stackId="1" stroke="#EDEAE3" fill="url(#gGive)" strokeWidth={2} />
            <Area type="monotone" dataKey="newsletter" name="Newsletter" stackId="1" stroke="#9BA0A6" fill="url(#gNews)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
