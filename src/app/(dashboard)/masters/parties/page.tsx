"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Users, Edit, Trash2, Building, Phone, Mail } from "lucide-react";
import { DataTable } from "@/components/ui/DataTable";
import { Modal } from "@/components/ui/Modal";
import { useAuthStore } from "@/store/authStore";
import axios from "axios";

const PARTY_TYPES = ["CONSIGNOR", "CONSIGNEE", "SUPPLIER", "CUSTOMER"];

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
  const [form, setForm] = useState({ name: "", type: "CONSIGNOR", gstin: "", pan: "", address: "", city: "", state: "", pincode: "", contactPerson: "", phone: "", email: "", creditLimit: 0, creditPeriod: 0 });
  const [states, setStates] = useState<any[]>([]);
  const [cities, setCities] = useState<any[]>([]);
  const [selectedStateId, setSelectedStateId] = useState<string>("");

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

  // Load states on mount
  useEffect(() => {
    if (!token) return;
    axios.get("/api/states", { headers })
      .then(({ data }) => setStates(data.states || []))
      .catch(() => {});
  }, [token]);

  // Load cities when state changes
  useEffect(() => {
    if (!token || !selectedStateId) {
      setCities([]);
      return;
    }
    axios.get(`/api/cities/${selectedStateId}`, { headers })
      .then(({ data }) => setCities(data.cities || []))
      .catch(() => {});
  }, [selectedStateId, token]);

  const handleStateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const stateId = e.target.value;
    setSelectedStateId(stateId);
    const matchedState = states.find(s => String(s.id) === stateId);
    setForm(f => ({
      ...f,
      state: matchedState ? matchedState.name : "",
      city: ""
    }));
  };

  const openModal = (party?: any) => {
    setEditParty(party || null);
    setError("");
    if (party) {
      setForm({
        name: party.name || "",
        type: party.type || "CONSIGNOR",
        gstin: party.gstin || "",
        pan: party.pan || "",
        address: party.address || "",
        city: party.city || "",
        state: party.state || "",
        pincode: party.pincode || "",
        contactPerson: party.contactPerson || "",
        phone: party.phone || "",
        email: party.email || "",
        creditLimit: party.creditLimit || 0,
        creditPeriod: party.creditPeriod || 0
      });
      // Match state ID
      const matchedState = states.find(s => s.name.toLowerCase() === (party.state || "").toLowerCase());
      if (matchedState) {
        setSelectedStateId(String(matchedState.id));
      } else {
        setSelectedStateId("");
      }
    } else {
      setForm({ name: "", type: "CONSIGNOR", gstin: "", pan: "", address: "", city: "", state: "", pincode: "", contactPerson: "", phone: "", email: "", creditLimit: 0, creditPeriod: 0 });
      setSelectedStateId("");
    }
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.type) {
      setError("Please select at least one party type");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const payload = { 
        ...form, 
        creditLimit: Number(form.creditLimit), 
        creditPeriod: Number(form.creditPeriod) || 0, 
        email: form.email || undefined 
      };
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
    {
      key: "type",
      label: "Type",
      render: (row: any) => (
        <div className="flex gap-1 flex-wrap">
          {(row.type || "").split(",").map((t: string) => (
            <span key={t} className="badge badge-blue text-[10px]">
              {t.trim()}
            </span>
          ))}
        </div>
      )
    },
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
          <p className="page-subtitle">Manage consignors, consignees, suppliers, and customers</p>
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
          <div className="col-span-2">
            <label className="label-base">Party Name *</label>
            <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Enter party name" className="input-base" required />
          </div>

          <div className="col-span-2">
            <label className="label-base mb-1.5">Party Type *</label>
            <div className="flex gap-4 flex-wrap p-3 rounded-xl bg-white/5 border border-white/10">
              {PARTY_TYPES.map((t) => {
                const checked = form.type.split(",").map(x => x.trim()).includes(t);
                return (
                  <label key={t} className="flex items-center gap-2 text-sm text-white/80 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={(e) => {
                        const activeTypes = form.type.split(",").map(x => x.trim()).filter(Boolean);
                        let nextTypes;
                        if (e.target.checked) {
                          nextTypes = [...activeTypes, t];
                        } else {
                          nextTypes = activeTypes.filter(x => x !== t);
                        }
                        setForm({ ...form, type: nextTypes.join(",") });
                      }}
                      className="w-4 h-4 accent-brand-500 rounded border-white/10"
                    />
                    {t}
                  </label>
                );
              })}
            </div>
          </div>

          <div>
            <label className="label-base">GSTIN</label>
            <input type="text" value={form.gstin} onChange={(e) => setForm({ ...form, gstin: e.target.value })} placeholder="22AAAAA0000A1Z5" className="input-base" />
          </div>

          <div>
            <label className="label-base">PAN</label>
            <input type="text" value={form.pan} onChange={(e) => setForm({ ...form, pan: e.target.value })} placeholder="ABCDE1234F" className="input-base" />
          </div>

          <div>
            <label className="label-base">Contact Person</label>
            <input type="text" value={form.contactPerson} onChange={(e) => setForm({ ...form, contactPerson: e.target.value })} placeholder="Contact Person Name" className="input-base" />
          </div>

          <div>
            <label className="label-base">Phone</label>
            <input type="text" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+91 98765 43210" className="input-base" />
          </div>

          <div className="col-span-2">
            <label className="label-base">Address</label>
            <input type="text" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} placeholder="Street address" className="input-base" />
          </div>

          <div>
            <label className="label-base">State</label>
            <select value={selectedStateId} onChange={handleStateChange} className="select-base">
              <option value="">Select State</option>
              {states.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="label-base">City</label>
            <select value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className="select-base">
              <option value="">Select City</option>
              {cities.map((c) => (
                <option key={c.id} value={c.name}>{c.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="label-base">Pincode</label>
            <input type="text" value={form.pincode} onChange={(e) => setForm({ ...form, pincode: e.target.value })} placeholder="110001" className="input-base" />
          </div>

          <div>
            <label className="label-base">Email</label>
            <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="email@example.com" className="input-base" />
          </div>

          <div>
            <label className="label-base">Credit Limit (₹)</label>
            <input type="number" value={form.creditLimit} onChange={(e) => setForm({ ...form, creditLimit: Number(e.target.value) })} placeholder="0" className="input-base" />
          </div>

          <div>
            <label className="label-base">Credit Period (Days)</label>
            <input type="number" value={form.creditPeriod} onChange={(e) => setForm({ ...form, creditPeriod: Number(e.target.value) })} placeholder="0" className="input-base" />
          </div>
        </div>
      </Modal>
    </div>
  );
}
