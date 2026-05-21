"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Users, Edit, Trash2, Building, Phone, Mail } from "lucide-react";
import { DataTable } from "@/components/ui/DataTable";
import { Modal } from "@/components/ui/Modal";
import { useAuthStore } from "@/store/authStore";
import axios from "axios";

const PARTY_TYPES = ["CONSIGNOR", "CONSIGNEE", "BILLING", "SUPPLIER", "CUSTOMER"];

export default function PartiesPage() {
  const { token } = useAuthStore();
  const [parties, setParties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [filterType, setFilterType] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editParty, setEditParty] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ name: "", type: "CONSIGNOR", gstin: "", pan: "", address: "", city: "", state: "", pincode: "", contactPerson: "", phone: "", email: "", creditLimit: 0 });

  const headers = { Authorization: `Bearer ${token}` };

  const fetchParties = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page) });
      if (filterType) params.set("type", filterType);
      const { data } = await axios.get(`/api/parties?${params}`, { headers });
      setParties(data.parties);
      setTotal(data.pagination.total);
    } catch {} finally { setLoading(false); }
  }, [token, page, filterType]);

  useEffect(() => { fetchParties(); }, [fetchParties]);

  const openModal = (party?: any) => {
    setEditParty(party || null);
    setError("");
    if (party) {
      setForm({ name: party.name || "", type: party.type || "CONSIGNOR", gstin: party.gstin || "", pan: party.pan || "", address: party.address || "", city: party.city || "", state: party.state || "", pincode: party.pincode || "", contactPerson: party.contactPerson || "", phone: party.phone || "", email: party.email || "", creditLimit: party.creditLimit || 0 });
    } else {
      setForm({ name: "", type: "CONSIGNOR", gstin: "", pan: "", address: "", city: "", state: "", pincode: "", contactPerson: "", phone: "", email: "", creditLimit: 0 });
    }
    setModalOpen(true);
  };

  const handleSave = async () => {
    setSaving(true);
    setError("");
    try {
      const payload = { ...form, creditLimit: Number(form.creditLimit), email: form.email || undefined };
      if (editParty) {
        await axios.patch(`/api/parties/${editParty.id}`, payload, { headers });
      } else {
        await axios.post("/api/parties", payload, { headers });
      }
      setModalOpen(false);
      fetchParties();
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to save");
    } finally { setSaving(false); }
  };

  const columns = [
    { key: "name", label: "Party Name", sortable: true, render: (row: any) => <span className="font-medium text-white">{row.name}</span> },
    { key: "type", label: "Type", render: (row: any) => <span className="badge badge-blue text-xs">{row.type}</span> },
    { key: "city", label: "City", render: (row: any) => <span className="text-sm text-white/60">{row.city || "—"}</span> },
    { key: "phone", label: "Phone", render: (row: any) => <span className="text-sm text-white/60">{row.phone || "—"}</span> },
    { key: "gstin", label: "GSTIN", render: (row: any) => <span className="font-mono text-xs text-white/40">{row.gstin || "—"}</span> },
    { key: "outstanding", label: "Outstanding", render: (row: any) => <span className={`text-sm font-medium ${row.outstanding > 0 ? "text-amber-400" : "text-white/40"}`}>₹{row.outstanding?.toFixed(0) || 0}</span> },
  ];

  return (
    <div className="space-y-5">
      <div className="flex-between">
        <div>
          <h1 className="page-title flex items-center gap-2"><Users className="w-5 h-5 text-cyan-400" />Parties</h1>
          <p className="page-subtitle">Manage consignors, consignees, and billing parties</p>
        </div>
        <button onClick={() => openModal()} className="btn-primary"><Plus className="w-4 h-4" />Add Party</button>
      </div>

      {/* Type Filter */}
      <div className="flex gap-2 flex-wrap">
        {["", ...PARTY_TYPES].map((t) => (
          <button key={t} onClick={() => { setFilterType(t); setPage(1); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${filterType === t ? "bg-brand-500/20 text-brand-300 border border-brand-500/30" : "bg-white/5 text-white/40 border border-white/10 hover:text-white/60"}`}>
            {t || "All"}
          </button>
        ))}
      </div>

      <DataTable
        columns={columns}
        data={parties}
        loading={loading}
        emptyText="No parties found. Add your first party!"
        emptyIcon={<Users className="w-8 h-8" />}
        total={total}
        page={page}
        pageSize={50}
        onPageChange={setPage}
        rowKey={(row) => row.id}
        actions={(row) => (
          <>
            <button onClick={() => openModal(row)} className="btn-icon"><Edit className="w-3.5 h-3.5" /></button>
            <button onClick={async () => { if (confirm("Delete?")) { await axios.delete(`/api/parties/${row.id}`, { headers }); fetchParties(); } }} className="btn-icon hover:text-red-400"><Trash2 className="w-3.5 h-3.5" /></button>
          </>
        )}
      />

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editParty ? "Edit Party" : "Add New Party"}
        size="lg"
        footer={<>
          <button onClick={() => setModalOpen(false)} className="btn-secondary">Cancel</button>
          <button onClick={handleSave} disabled={saving} className="btn-primary disabled:opacity-60">
            {saving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : editParty ? "Update" : "Add Party"}
          </button>
        </>}
      >
        {error && <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{error}</div>}
        <div className="grid grid-cols-2 gap-4">
          {([
            { label: "Party Name *", key: "name", col: 2 },
            { label: "Type", key: "type", type: "select", options: PARTY_TYPES },
            { label: "GSTIN", key: "gstin", placeholder: "22AAAAA0000A1Z5" },
            { label: "PAN", key: "pan", placeholder: "ABCDE1234F" },
            { label: "Contact Person", key: "contactPerson" },
            { label: "Phone", key: "phone", placeholder: "+91 98765 43210" },
            { label: "Email", key: "email", type: "email" },
            { label: "Credit Limit (₹)", key: "creditLimit", type: "number" },
            { label: "Address", key: "address", col: 2 },
            { label: "City", key: "city" },
            { label: "State", key: "state" },
            { label: "Pincode", key: "pincode" },
          ] as any[]).map(({ label, key, type, options, col, placeholder }) => (
            <div key={key} className={col === 2 ? "col-span-2" : ""}>
              <label className="label-base">{label}</label>
              {type === "select" ? (
                <select value={(form as any)[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} className="select-base">
                  {options.map((o: string) => <option key={o} value={o}>{o}</option>)}
                </select>
              ) : (
                <input type={type || "text"} value={(form as any)[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} placeholder={placeholder} className="input-base" />
              )}
            </div>
          ))}
        </div>
      </Modal>
    </div>
  );
}
