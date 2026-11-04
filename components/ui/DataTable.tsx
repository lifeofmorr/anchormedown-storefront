"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState, useTransition, type ReactNode } from "react";

/**
 * DataTable — reusable operator table with server-driven pagination,
 * sorting and search. State lives in the URL (?page, ?sort, ?dir, ?q,
 * ?source) so every view is shareable and the server component stays
 * the single source of the query. The parent owns the data fetch;
 * this component owns the controls.
 */
export interface DataTableColumn<Row> {
  key: string;
  header: string;
  sortable?: boolean;
  className?: string;
  render: (row: Row) => ReactNode;
}

interface DataTableProps<Row> {
  columns: DataTableColumn<Row>[];
  rows: Row[];
  rowKey: (row: Row) => string;
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  sort: string;
  dir: "asc" | "desc";
  q: string;
  searchPlaceholder?: string;
  filterSlot?: ReactNode;
  emptyMessage: string;
}

export default function DataTable<Row>(props: DataTableProps<Row>) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [search, setSearch] = useState(props.q);

  function update(patch: Record<string, string | null>) {
    const params = new URLSearchParams(searchParams.toString());
    for (const [k, v] of Object.entries(patch)) {
      if (v === null || v === "") params.delete(k);
      else params.set(k, v);
    }
    startTransition(() => {
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    });
  }

  // Debounced search → URL (resets to page 1).
  useEffect(() => {
    if (search === props.q) return;
    const t = setTimeout(() => update({ q: search || null, page: "1" }), 350);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  function toggleSort(key: string) {
    if (props.sort === key) {
      update({ dir: props.dir === "asc" ? "desc" : "asc", page: "1" });
    } else {
      update({ sort: key, dir: "desc", page: "1" });
    }
  }

  const from = props.total === 0 ? 0 : (props.page - 1) * props.pageSize + 1;
  const to = Math.min(props.total, props.page * props.pageSize);

  return (
    <div className="border border-seam bg-coal">
      <div className="flex flex-col gap-3 border-b border-seam p-4 sm:flex-row sm:items-center">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={props.searchPlaceholder ?? "Search…"}
          className="w-full max-w-sm border border-seam bg-ink px-4 py-2.5 text-sm text-bone placeholder:text-ash focus:border-brass focus:outline-none"
          aria-label="Search table"
        />
        {props.filterSlot}
        <p className="text-[11px] uppercase tracking-[0.2em] text-ash sm:ml-auto">
          {props.total} {props.total === 1 ? "row" : "rows"}
          {isPending ? " · loading" : ""}
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-seam text-[11px] uppercase tracking-[0.2em] text-ash">
              {props.columns.map((col) => (
                <th key={col.key} className={`px-4 py-3 font-medium ${col.className ?? ""}`}>
                  {col.sortable ? (
                    <button
                      onClick={() => toggleSort(col.key)}
                      className="inline-flex items-center gap-1.5 uppercase tracking-[0.2em] transition-colors hover:text-brass"
                    >
                      {col.header}
                      <span aria-hidden className="text-brass">
                        {props.sort === col.key ? (props.dir === "asc" ? "↑" : "↓") : "↕"}
                      </span>
                    </button>
                  ) : (
                    col.header
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className={isPending ? "opacity-50 transition-opacity" : "transition-opacity"}>
            {props.rows.map((row) => (
              <tr key={props.rowKey(row)} className="border-b border-seam/60 last:border-0 hover:bg-ink/60">
                {props.columns.map((col) => (
                  <td key={col.key} className={`px-4 py-3 text-bone ${col.className ?? ""}`}>
                    {col.render(row)}
                  </td>
                ))}
              </tr>
            ))}
            {props.rows.length === 0 && (
              <tr>
                <td colSpan={props.columns.length} className="px-4 py-10 text-center text-ash">
                  {props.emptyMessage}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between border-t border-seam px-4 py-3 text-[11px] uppercase tracking-[0.2em] text-ash">
        <span>
          {from}–{to} of {props.total}
        </span>
        <div className="flex items-center gap-2">
          <button
            disabled={props.page <= 1}
            onClick={() => update({ page: String(props.page - 1) })}
            className="border border-seam px-3 py-1.5 text-bone transition-colors hover:border-brass disabled:opacity-40"
          >
            Prev
          </button>
          <span>
            {props.page} / {props.totalPages}
          </span>
          <button
            disabled={props.page >= props.totalPages}
            onClick={() => update({ page: String(props.page + 1) })}
            className="border border-seam px-3 py-1.5 text-bone transition-colors hover:border-brass disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
