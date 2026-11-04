"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import DataTable, { type DataTableColumn } from "@/components/ui/DataTable";
import { CAPTURE_SOURCES } from "@/lib/validations";

export interface EntryRow {
  id: string;
  email: string;
  source: string;
  consent: boolean;
  createdAt: string;
}

const SOURCE_LABELS: Record<string, string> = {
  "bf-early-access": "Black Friday early access",
  giveaway: "Giveaway",
  newsletter: "Newsletter",
};

const columns: DataTableColumn<EntryRow>[] = [
  { key: "email", header: "Email", sortable: true, render: (r) => r.email },
  {
    key: "source",
    header: "List",
    sortable: true,
    render: (r) => SOURCE_LABELS[r.source] ?? r.source,
  },
  {
    key: "consent",
    header: "Consent",
    render: (r) => (r.consent ? "Yes" : "No"),
  },
  {
    key: "createdAt",
    header: "Captured",
    sortable: true,
    render: (r) =>
      new Date(r.createdAt).toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
      }),
  },
];

export default function EntriesTable(props: {
  rows: EntryRow[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  sort: string;
  dir: "asc" | "desc";
  q: string;
  source: string | null;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const filterSlot = (
    <select
      value={props.source ?? ""}
      onChange={(e) => {
        const params = new URLSearchParams(searchParams.toString());
        if (e.target.value) params.set("source", e.target.value);
        else params.delete("source");
        params.set("page", "1");
        router.replace(`${pathname}?${params.toString()}`, { scroll: false });
      }}
      className="border border-seam bg-ink px-3 py-2.5 text-sm text-bone focus:border-brass focus:outline-none"
      aria-label="Filter by list"
    >
      <option value="">All lists</option>
      {CAPTURE_SOURCES.map((s) => (
        <option key={s} value={s}>
          {SOURCE_LABELS[s]}
        </option>
      ))}
    </select>
  );

  return (
    <DataTable
      columns={columns}
      rows={props.rows}
      rowKey={(r) => r.id}
      total={props.total}
      page={props.page}
      pageSize={props.pageSize}
      totalPages={props.totalPages}
      sort={props.sort}
      dir={props.dir}
      q={props.q}
      searchPlaceholder="Search by email…"
      filterSlot={filterSlot}
      emptyMessage="No captures match. When the forms take a signup, it lands here."
    />
  );
}
