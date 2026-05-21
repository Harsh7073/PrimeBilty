"use client";
import { useState } from "react";
import { ClipboardList, Plus } from "lucide-react";
import { DataTable } from "@/components/ui/DataTable";
import { Modal } from "@/components/ui/Modal";
import { formatDate } from "@/lib/utils";

const mockAdvice = [
  { id: "1", adviceNumber: "LA2400001", vehicleNo: "MH01AB1234", fromLocation: "Factory A", toLocation: "Warehouse B", material: "Steel Coils", quantity: 50, unit: "Ton", factory: "Tata Steel Plant", dispatchDate: "2024-05-10", status: "DISPATCHED" },
  { id: "2", adviceNumber: "LA2400002", vehicleNo: "DL09CD5678", fromLocation: "Factory C", toLocation: "Port Mumbai", material: "Auto Parts", quantity: 200, unit: "Box", factory: "Maruti Plant", dispatchDate: "2024-05-12", status: "PENDING" },
];

export default function LoadAdvicePage() {
  const [modalOpen, setModalOpen] = useState(false);
  const columns = [
    { key: "adviceNumber", label: "Advice No.", render: (r: any) => <span className="font-mono text-sm text-brand-400">{r.adviceNumber}</span> },
    { key: "vehicleNo", label: "Vehicle", render: (r: any) => <span className="font-mono badge badge-gray">{r.vehicleNo}</span> },
    { key: "route", label: "Route", render: (r: any) => <span className="text-sm text-white/70">{r.fromLocation} → {r.toLocation}</span> },
    { key: "material", label: "Material", render: (r: any) => <span className="text-sm text-white/70">{r.material}</span> },
    { key: "quantity", label: "Qty", render: (r: any) => <span className="text-sm text-white">{r.quantity} {r.unit}</span> },
    { key: "factory", label: "Factory", render: (r: any) => <span className="text-xs text-white/50">{r.factory}</span> },
    { key: "status", label: "Status", render: (r: any) => <span className={`badge ${r.status === "DISPATCHED" ? "badge-green" : "badge-yellow"}`}>{r.status}</span> },
    { key: "dispatchDate", label: "Dispatch Date", render: (r: any) => <span className="text-xs text-white/40">{formatDate(r.dispatchDate)}</span> },
  ];
  return (
    <div className="space-y-5">
      <div className="flex-between">
        <div><h1 className="page-title flex items-center gap-2"><ClipboardList className="w-5 h-5 text-teal-400" />Load Advice</h1><p className="page-subtitle">Create loading slips and track factory dispatches</p></div>
        <button onClick={() => setModalOpen(true)} className="btn-primary"><Plus className="w-4 h-4" />New Load Advice</button>
      </div>
      <DataTable columns={columns} data={mockAdvice} emptyText="No load advice found" rowKey={(r) => r.id} />
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="New Load Advice" size="md"
        footer={<><button onClick={() => setModalOpen(false)} className="btn-secondary">Cancel</button><button className="btn-primary">Create</button></>}>
        <div className="space-y-4">
          <div><label className="label-base">Vehicle Number</label><input className="input-base" placeholder="MH01AB1234" /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="label-base">From Location</label><input className="input-base" /></div>
            <div><label className="label-base">To Location</label><input className="input-base" /></div>
          </div>
          <div><label className="label-base">Material</label><input className="input-base" placeholder="Steel Coils, Auto Parts..." /></div>
          <div className="grid grid-cols-3 gap-3">
            <div><label className="label-base">Quantity</label><input type="number" className="input-base" /></div>
            <div><label className="label-base">Unit</label><input className="input-base" placeholder="Ton" /></div>
            <div><label className="label-base">Weight (MT)</label><input type="number" className="input-base" /></div>
          </div>
          <div><label className="label-base">Factory Name</label><input className="input-base" /></div>
          <div><label className="label-base">Dispatch Date</label><input type="date" className="input-base" /></div>
        </div>
      </Modal>
    </div>
  );
}
