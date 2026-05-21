"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Plus, FileText, Eye, Edit, X, Filter, Download, Truck, MapPin, IndianRupee } from "lucide-react";
import Link from "next/link";
import { DataTable } from "@/components/ui/DataTable";
import { Modal } from "@/components/ui/Modal";
import { formatCurrency, formatDate, getStatusColor } from "@/lib/utils";
import { useAuthStore } from "@/store/authStore";
import axios from "axios";

const STATUS_OPTIONS = ["", "ACTIVE", "IN_TRANSIT", "DELIVERED", "INVOICED", "CANCELLED"];

export default function BiltyPage() {
  const { token } = useAuthStore();
  const [bilties, setBilties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [status, setStatus] = useState("");
  const [search, setSearch] = useState("");

  const fetchBilties = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: "20" });
      if (status) params.set("status", status);
      if (search) params.set("search", search);
      const { data } = await axios.get(`/api/bilties?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBilties(data.bilties);
      setTotal(data.pagination.total);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [token, page, status, search]);

  useEffect(() => { fetchBilties(); }, [fetchBilties]);

  const handleCancel = async (id: string) => {
    if (!confirm("Cancel this bilty?")) return;
    await axios.delete(`/api/bilties/${id}`, { headers: { Authorization: `Bearer ${token}` } });
    fetchBilties();
  };

  const columns = [
    {
      key: "lrNumber",
      label: "LR Number",
      sortable: true,
      render: (row: any) => (
        <Link href={`/bilty/${row.id}`} className="text-brand-400 hover:text-brand-300 font-mono font-semibold text-sm">
          {row.lrNumber}
        </Link>
      ),
    },
    {
      key: "route",
      label: "Route",
      render: (row: any) => (
        <div className="flex items-center gap-1.5 text-sm">
          <MapPin className="w-3.5 h-3.5 text-white/30 flex-shrink-0" />
          <span className="text-white/70">{row.fromCity}</span>
          <span className="text-white/20">→</span>
          <span className="text-white/70">{row.toCity}</span>
        </div>
      ),
    },
    {
      key: "vehicleNumber",
      label: "Vehicle",
      render: (row: any) => (
        <span className="font-mono text-sm text-white/70 badge badge-gray">{row.vehicle?.vehicleNumber}</span>
      ),
    },
    {
      key: "consignor",
      label: "Consignor",
      render: (row: any) => <span className="text-sm text-white/70">{row.consignor?.name}</span>,
    },
    {
      key: "consignee",
      label: "Consignee",
      render: (row: any) => <span className="text-sm text-white/70">{row.consignee?.name}</span>,
    },
    {
      key: "totalAmount",
      label: "Freight",
      sortable: true,
      render: (row: any) => (
        <div>
          <div className="text-sm font-semibold text-white">{formatCurrency(row.totalAmount)}</div>
          <div className="text-xs text-white/30">Adv: {formatCurrency(row.advanceAmount)}</div>
        </div>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (row: any) => (
        <span className={`badge ${getStatusColor(row.status)}`}>
          {row.status.replace("_", " ")}
        </span>
      ),
    },
    {
      key: "createdAt",
      label: "Date",
      sortable: true,
      render: (row: any) => <span className="text-xs text-white/40">{formatDate(row.createdAt)}</span>,
    },
  ];

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex-between">
        <div>
          <h1 className="page-title flex items-center gap-2">
            <FileText className="w-5 h-5 text-brand-400" />
            Bilty (LR Management)
          </h1>
          <p className="page-subtitle">Manage loading receipts and freight documents</p>
        </div>
        <Link href="/bilty/create" className="btn-primary">
          <Plus className="w-4 h-4" /> Create Bilty
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-48">
          <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
          <input
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search LR number, city, vehicle..."
            className="input-base pl-9 py-2 text-sm"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-white/30" />
          <select
            value={status}
            onChange={(e) => { setStatus(e.target.value); setPage(1); }}
            className="select-base py-2 text-sm min-w-36"
          >
            <option value="">All Status</option>
            {STATUS_OPTIONS.filter(Boolean).map((s) => (
              <option key={s} value={s}>{s.replace("_", " ")}</option>
            ))}
          </select>
        </div>
        <button className="btn-secondary text-xs gap-1.5 py-2">
          <Download className="w-3.5 h-3.5" /> Export
        </button>
      </div>

      {/* Summary Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Total", value: total, color: "text-white" },
          { label: "Active", value: bilties.filter(b => b.status === "ACTIVE").length, color: "text-brand-400" },
          { label: "In Transit", value: bilties.filter(b => b.status === "IN_TRANSIT").length, color: "text-amber-400" },
          { label: "Delivered", value: bilties.filter(b => b.status === "DELIVERED").length, color: "text-emerald-400" },
        ].map(({ label, value, color }) => (
          <div key={label} className="glass-card px-4 py-3 flex items-center gap-3">
            <div className={`text-xl font-bold ${color}`}>{value}</div>
            <div className="text-xs text-muted">{label}</div>
          </div>
        ))}
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={bilties}
        loading={loading}
        searchable={false}
        emptyText="No bilties found. Create your first bilty!"
        emptyIcon={<FileText className="w-8 h-8" />}
        total={total}
        page={page}
        pageSize={20}
        onPageChange={setPage}
        rowKey={(row) => row.id}
        actions={(row) => (
          <>
            <Link href={`/bilty/${row.id}`}>
              <button className="btn-icon" title="View">
                <Eye className="w-3.5 h-3.5" />
              </button>
            </Link>
            <Link href={`/bilty/${row.id}/edit`}>
              <button className="btn-icon" title="Edit">
                <Edit className="w-3.5 h-3.5" />
              </button>
            </Link>
            {row.status !== "CANCELLED" && (
              <button onClick={() => handleCancel(row.id)} className="btn-icon hover:text-red-400" title="Cancel">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </>
        )}
      />
    </div>
  );
}
