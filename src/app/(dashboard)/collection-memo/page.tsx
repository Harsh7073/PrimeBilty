"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Wallet, Plus, FileText, CheckCircle, Clock, X } from "lucide-react";
import { DataTable } from "@/components/ui/DataTable";
import { Modal } from "@/components/ui/Modal";
import { formatCurrency, formatDate, getStatusColor } from "@/lib/utils";

const mockMemos = [
  { id: "1", memoNumber: "CM2400001", party: "Acme Transport", amount: 50000, collected: 30000, pending: 20000, status: "PARTIAL", date: "2024-05-01" },
  { id: "2", memoNumber: "CM2400002", party: "Star Logistics", amount: 25000, collected: 25000, pending: 0, status: "COLLECTED", date: "2024-05-03" },
  { id: "3", memoNumber: "CM2400003", party: "Fast Movers", amount: 75000, collected: 0, pending: 75000, status: "PENDING", date: "2024-05-05" },
];

export default function CollectionMemoPage() {
  const [modalOpen, setModalOpen] = useState(false);

  const columns = [
    { key: "memoNumber", label: "Memo No.", render: (row: any) => <span className="font-mono text-sm text-brand-400">{row.memoNumber}</span> },
    { key: "party", label: "Party", render: (row: any) => <span className="text-sm font-medium text-white">{row.party}</span> },
    { key: "amount", label: "Total", render: (row: any) => <span className="font-semibold text-white">{formatCurrency(row.amount)}</span> },
    { key: "collected", label: "Collected", render: (row: any) => <span className="text-emerald-400">{formatCurrency(row.collected)}</span> },
    { key: "pending", label: "Pending", render: (row: any) => <span className={row.pending > 0 ? "text-amber-400" : "text-white/30"}>{formatCurrency(row.pending)}</span> },
    { key: "status", label: "Status", render: (row: any) => <span className={`badge ${row.status === "COLLECTED" ? "badge-green" : row.status === "PARTIAL" ? "badge-yellow" : "badge-red"}`}>{row.status}</span> },
    { key: "date", label: "Date", render: (row: any) => <span className="text-xs text-white/40">{formatDate(row.date)}</span> },
  ];

  return (
    <div className="space-y-5">
      <div className="flex-between">
        <div>
          <h1 className="page-title flex items-center gap-2"><Wallet className="w-5 h-5 text-emerald-400" />Collection Memo</h1>
          <p className="page-subtitle">Track payment collections and customer dues</p>
        </div>
        <button onClick={() => setModalOpen(true)} className="btn-primary"><Plus className="w-4 h-4" />New Memo</button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total Outstanding", value: formatCurrency(mockMemos.reduce((s, m) => s + m.pending, 0)), color: "text-amber-400" },
          { label: "Collected Today", value: formatCurrency(55000), color: "text-emerald-400" },
          { label: "Pending Memos", value: mockMemos.filter(m => m.status === "PENDING").length, color: "text-red-400" },
        ].map(({ label, value, color }) => (
          <div key={label} className="glass-card p-4">
            <div className="text-xs text-muted mb-1">{label}</div>
            <div className={`text-xl font-bold ${color}`}>{value}</div>
          </div>
        ))}
      </div>

      <DataTable columns={columns} data={mockMemos} emptyText="No collection memos" rowKey={(r) => r.id}
        actions={(row) => (
          <>
            <button className="btn-icon" title="Mark collected"><CheckCircle className="w-3.5 h-3.5" /></button>
            <button className="btn-icon" title="Print"><FileText className="w-3.5 h-3.5" /></button>
          </>
        )}
      />

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Create Collection Memo" size="md"
        footer={<><button onClick={() => setModalOpen(false)} className="btn-secondary">Cancel</button><button className="btn-primary">Create Memo</button></>}>
        <div className="space-y-4">
          <div><label className="label-base">Party</label><select className="select-base"><option>Select party...</option></select></div>
          <div><label className="label-base">Amount (₹)</label><input type="number" className="input-base" placeholder="50000" /></div>
          <div><label className="label-base">Notes</label><textarea rows={2} className="input-base resize-none" /></div>
        </div>
      </Modal>
    </div>
  );
}
