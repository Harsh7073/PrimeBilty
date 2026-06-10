"use client";

import { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, ChevronLeft, ChevronRight, ChevronUp, ChevronDown, ChevronsUpDown, Download } from "lucide-react";
import { cn } from "@/lib/utils";

interface Column<T> {
  key: keyof T | string;
  label: string;
  render?: (row: T) => React.ReactNode;
  sortable?: boolean;
  width?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  searchable?: boolean;
  searchPlaceholder?: string;
  loading?: boolean;
  emptyText?: string;
  emptyIcon?: React.ReactNode;
  actions?: (row: T) => React.ReactNode;
  onExport?: () => void;
  total?: number;
  page?: number;
  pageSize?: number;
  onPageChange?: (page: number) => void;
  rowKey?: (row: T) => string;
}

export function DataTable<T extends Record<string, any>>({
  columns,
  data,
  searchable = true,
  searchPlaceholder = "Search...",
  loading = false,
  emptyText = "No data found",
  emptyIcon,
  actions,
  onExport,
  total,
  page = 1,
  pageSize = 20,
  onPageChange,
  rowKey,
}: DataTableProps<T>) {
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [internalPage, setInternalPage] = useState(1);

  // Reset page when search or sort parameters change
  useEffect(() => {
    if (onPageChange) {
      onPageChange(1);
    } else {
      setInternalPage(1);
    }
  }, [search, sortKey, sortDir, onPageChange]);

  const activePage = onPageChange ? page : internalPage;

  const handlePageChange = (p: number) => {
    if (onPageChange) {
      onPageChange(p);
    } else {
      setInternalPage(p);
    }
  };

  const filteredData = useMemo(() => {
    if (!searchable || !search) return data;
    const q = search.toLowerCase();
    return data.filter((row) =>
      Object.values(row).some((v) => String(v).toLowerCase().includes(q))
    );
  }, [data, search, searchable]);

  const sortedData = useMemo(() => {
    if (!sortKey) return filteredData;
    return [...filteredData].sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];
      if (av < bv) return sortDir === "asc" ? -1 : 1;
      if (av > bv) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
  }, [filteredData, sortKey, sortDir]);

  const paginatedData = useMemo(() => {
    if (total !== undefined) return sortedData;
    const start = (activePage - 1) * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [sortedData, activePage, pageSize, total]);

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const totalPages = total ? Math.ceil(total / pageSize) : Math.ceil(sortedData.length / pageSize);

  const SortIcon = ({ col }: { col: Column<T> }) => {
    if (!col.sortable) return null;
    const key = col.key as string;
    if (sortKey === key) {
      return sortDir === "asc" ? <ChevronUp className="w-3 h-3 text-brand-400" /> : <ChevronDown className="w-3 h-3 text-brand-400" />;
    }
    return <ChevronsUpDown className="w-3 h-3 text-white/20 group-hover:text-white/40" />;
  };

  const SkeletonRow = () => (
    <tr>
      {columns.map((_, i) => (
        <td key={i} className="tb-td">
          <div className="shimmer h-4 rounded" style={{ width: `${60 + Math.random() * 40}%` }} />
        </td>
      ))}
      {actions && <td className="tb-td"><div className="shimmer h-4 w-16 rounded" /></td>}
    </tr>
  );

  return (
    <div className="glass-card overflow-hidden">
      {/* Table Toolbar */}
      {(searchable || onExport) && (
        <div className="px-4 py-3 border-b border-white/10 flex items-center gap-3 flex-wrap">
          {searchable && (
            <div className="relative flex-1 min-w-48">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={searchPlaceholder}
                className="input-base pl-9 py-2 text-sm"
              />
            </div>
          )}
          {onExport && (
            <button onClick={onExport} className="btn-secondary text-xs gap-1.5 py-2">
              <Download className="w-3.5 h-3.5" />
              Export
            </button>
          )}
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="tb-table">
          <thead className="tb-thead">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key as string}
                  className={cn("tb-th group", col.sortable && "cursor-pointer hover:text-white/70 select-none")}
                  style={{ width: col.width }}
                  onClick={() => col.sortable && handleSort(col.key as string)}
                >
                  <div className="flex items-center gap-1.5">
                    {col.label}
                    <SortIcon col={col} />
                  </div>
                </th>
              ))}
              {actions && <th className="tb-th text-right">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
            ) : sortedData.length === 0 ? (
              <tr>
                <td colSpan={columns.length + (actions ? 1 : 0)} className="py-16 text-center">
                  <div className="flex flex-col items-center gap-3 text-white/30">
                    {emptyIcon || (
                      <div className="w-12 h-12 rounded-2xl bg-white/5 flex-center border border-white/10">
                        <Search className="w-5 h-5" />
                      </div>
                    )}
                    <p className="text-sm">{emptyText}</p>
                  </div>
                </td>
              </tr>
            ) : (
              paginatedData.map((row, i) => (
                <motion.tr
                  key={rowKey ? rowKey(row) : i}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.02 }}
                  className="tb-tr"
                >
                  {columns.map((col) => (
                    <td key={col.key as string} className="tb-td">
                      {col.render ? col.render(row) : String(row[col.key as string] ?? "—")}
                    </td>
                  ))}
                  {actions && (
                    <td className="tb-td text-right">
                      <div className="flex items-center justify-end gap-1.5">{actions(row)}</div>
                    </td>
                  )}
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="px-4 py-3 border-t border-white/10 flex items-center justify-between text-sm">
          <span className="text-white/40 text-xs">
            Page {activePage} of {totalPages} {total && `• ${total} total`}
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => handlePageChange(activePage - 1)}
              disabled={activePage <= 1}
              className="btn-icon disabled:opacity-30"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const p = i + Math.max(1, activePage - 2);
              if (p > totalPages) return null;
              return (
                <button
                  key={p}
                  onClick={() => handlePageChange(p)}
                  className={cn(
                    "w-8 h-8 rounded-lg text-xs font-medium transition-all",
                    p === activePage ? "bg-brand-500/20 text-brand-400 border border-brand-500/30" : "text-white/40 hover:text-white/70 hover:bg-white/5"
                  )}
                >
                  {p}
                </button>
              );
            })}
            <button
              onClick={() => handlePageChange(activePage + 1)}
              disabled={activePage >= totalPages}
              className="btn-icon disabled:opacity-30"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
