"use client";
import { useState } from "react";
import { UserCheck, Plus, FileText } from "lucide-react";
import { DataTable } from "@/components/ui/DataTable";
import { Modal } from "@/components/ui/Modal";
import { formatCurrency, formatDate } from "@/lib/utils";

const mockSettlements = [
  { id: "1", settlementNo: "HS2400001", vendor: "Ramesh Trucks", vehicleNo: "DL09AA1234", hireAmount: 45000, advancePaid: 20000, deductions: 2000, netPayable: 43000, paidAmount: 43000, balance: 0, status: "SETTLED", fromDate: "2024-05-01", toDate: "2024-05-10" },
  { id: "2", settlementNo: "HS2400002", vendor: "Suresh Transport", vehicleNo: "HR26CB5678", hireAmount: 62000, advancePaid: 30000, deductions: 0, netPayable: 62000, paidAmount: 30000, balance: 32000, status: "PARTIAL", fromDate: "2024-05-05", toDate: "2024-05-15" },
];

export default function HiringSettlementPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const columns = [
    { key: "settlementNo", label: "Settlement No.", render: (r: any) => <span className="font-mono text-sm text-brand-400">{r.settlementNo}</span> },
    { key: "vendor", label: "Vendor", render: (r: any) => <span className="font-medium text-white">{r.vendor}</span> },
    { key: "vehicleNo", label: "Vehicle", render: (r: any) => <span className="font-mono text-sm badge badge-gray">{r.vehicleNo}</span> },
    { key: "hireAmount", label: "Hire Amount", render: (r: any) => <span className="font-semibold text-white">{formatCurrency(r.hireAmount)}</span> },
    { key: "paidAmount", label: "Paid", render: (r: any) => <span className="text-emerald-400">{formatCurrency(r.paidAmount)}</span> },
    { key: "balance", label: "Balance", render: (r: any) => <span className={r.balance > 0 ? "text-amber-400 font-semibold" : "text-white/30"}>{formatCurrency(r.balance)}</span> },
    { key: "status", label: "Status", render: (r: any) => <span className={`badge ${r.status === "SETTLED" ? "badge-green" : "badge-yellow"}`}>{r.status}</span> },
  ];
  return (
    <div className="space-y-5">
      <div className="flex-between">
        <div><h1 className="page-title flex items-center gap-2"><UserCheck className="w-5 h-5 text-indigo-400" />Hiring Settlement</h1><p className="page-subtitle">Manage vendor freight and truck hiring payments</p></div>
        <button onClick={() => setModalOpen(true)} className="btn-primary"><Plus className="w-4 h-4" />New Settlement</button>
      </div>
      <DataTable columns={columns} data={mockSettlements} emptyText="No settlements found" rowKey={(r) => r.id}
        actions={(row) => <><button className="btn-icon"><FileText className="w-3.5 h-3.5" /></button></>} />
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="New Hiring Settlement" size="md"
        footer={<><button onClick={() => setModalOpen(false)} className="btn-secondary">Cancel</button><button className="btn-primary">Create</button></>}>
        <div className="space-y-4">
          <div><label className="label-base">Vendor Name</label><input className="input-base" placeholder="Transport vendor name" /></div>
          <div><label className="label-base">Vehicle Number</label><input className="input-base" placeholder="DL01AB1234" /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="label-base">From Date</label><input type="date" className="input-base" /></div>
            <div><label className="label-base">To Date</label><input type="date" className="input-base" /></div>
          </div>
          <div><label className="label-base">Hire Amount (₹)</label><input type="number" className="input-base" /></div>
          <div><label className="label-base">Advance Paid (₹)</label><input type="number" className="input-base" /></div>
          <div><label className="label-base">Deductions (₹)</label><input type="number" className="input-base" /></div>
        </div>
      </Modal>
    </div>
  );
}
