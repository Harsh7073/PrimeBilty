"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Receipt, Plus, Eye, Download, Filter, Search, IndianRupee, Edit } from "lucide-react";
import Link from "next/link";
import { DataTable } from "@/components/ui/DataTable";
import { formatCurrency, formatDate, getStatusColor } from "@/lib/utils";
import { useAuthStore } from "@/store/authStore";
import axios from "axios";

export default function InvoicesPage() {
  const { token } = useAuthStore();
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("");

  const headers = { Authorization: `Bearer ${token}` };

  const fetchInvoices = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page) });
      if (status) params.set("status", status);
      const { data } = await axios.get(`/api/invoices?${params}`, { headers });
      setInvoices(data.invoices);
      setTotal(data.pagination.total);
    } catch {} finally { setLoading(false); }
  }, [token, page, status]);

  useEffect(() => { fetchInvoices(); }, [fetchInvoices]);

  // Revenue summary
  const totalRevenue = invoices.reduce((s, i) => s + i.totalAmount, 0);
  const paidRevenue = invoices.filter(i => i.status === "PAID").reduce((s, i) => s + i.totalAmount, 0);
  const pendingRevenue = invoices.filter(i => i.status === "UNPAID").reduce((s, i) => s + i.totalAmount, 0);

  const columns = [
    {
      key: "invoiceNumber", label: "Invoice No.", sortable: true,
      render: (row: any) => (
        <Link href={`/invoices/${row.id}`} className="font-mono font-semibold text-brand-400 hover:text-brand-300 text-sm">
          {row.invoiceNumber}
        </Link>
      ),
    },
    { key: "type", label: "Type", render: (row: any) => <span className="badge badge-purple text-xs">{row.type}</span> },
    { key: "partyName", label: "Party", render: (row: any) => <span className="text-sm text-white/70 font-medium">{row.partyName}</span> },
    {
      key: "totalAmount", label: "Amount", sortable: true,
      render: (row: any) => (
        <div>
          <div className="text-sm font-semibold text-white">{formatCurrency(row.totalAmount)}</div>
          {row.paidAmount > 0 && <div className="text-xs text-emerald-400">Paid: {formatCurrency(row.paidAmount)}</div>}
        </div>
      ),
    },
    {
      key: "status", label: "Status",
      render: (row: any) => <span className={`badge ${getStatusColor(row.status)}`}>{row.status}</span>,
    },
    {
      key: "dueDate", label: "Due Date",
      render: (row: any) => {
        if (!row.dueDate) return <span className="text-xs text-white/20">—</span>;
        const isOverdue = new Date(row.dueDate) < new Date() && row.status !== "PAID";
        return <span className={`text-xs ${isOverdue ? "text-red-400 font-medium" : "text-white/40"}`}>{formatDate(row.dueDate)}</span>;
      },
    },
    { key: "createdAt", label: "Date", sortable: true, render: (row: any) => <span className="text-xs text-white/40">{formatDate(row.createdAt)}</span> },
  ];

  return (
    <div className="space-y-5">
      <div className="flex-between">
        <div>
          <h1 className="page-title flex items-center gap-2"><Receipt className="w-5 h-5 text-purple-400" />Invoices</h1>
          <p className="page-subtitle">Manage freight and general invoices</p>
        </div>
        <Link href="/invoices/create" className="btn-primary">
          <Plus className="w-4 h-4" />New Invoice
        </Link>
      </div>

      {/* Revenue Summary */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total Invoiced", value: formatCurrency(totalRevenue), color: "text-white" },
          { label: "Collected", value: formatCurrency(paidRevenue), color: "text-emerald-400" },
          { label: "Pending", value: formatCurrency(pendingRevenue), color: "text-amber-400" },
        ].map(({ label, value, color }) => (
          <div key={label} className="glass-card px-5 py-4">
            <div className="text-xs text-muted mb-1">{label}</div>
            <div className={`text-xl font-bold ${color}`}>{value}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-3">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-white/30" />
          <select value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }} className="select-base py-2 text-sm min-w-36">
            <option value="">All Status</option>
            {["UNPAID", "PAID", "PARTIAL", "CANCELLED"].map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={invoices}
        loading={loading}
        emptyText="No invoices found. Create your first invoice!"
        emptyIcon={<Receipt className="w-8 h-8" />}
        total={total}
        page={page}
        pageSize={20}
        onPageChange={setPage}
        rowKey={(row) => row.id}
        onExport={() => alert("Export coming soon!")}
        actions={(row) => (
          <>
            <Link href={`/invoices/${row.id}`}><button className="btn-icon" title="View"><Eye className="w-3.5 h-3.5" /></button></Link>
            <Link href={`/invoices/${row.id}/edit`}><button className="btn-icon" title="Edit"><Edit className="w-3.5 h-3.5" /></button></Link>
            <button className="btn-icon" title="Download PDF"><Download className="w-3.5 h-3.5" /></button>
          </>
        )}
      />
    </div>
  );
}
