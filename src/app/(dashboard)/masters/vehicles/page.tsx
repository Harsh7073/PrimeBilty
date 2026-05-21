"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Plus, Truck, Edit, Trash2, AlertTriangle, CheckCircle, Search, Filter } from "lucide-react";
import { DataTable } from "@/components/ui/DataTable";
import { Modal } from "@/components/ui/Modal";
import { formatDate, getStatusColor } from "@/lib/utils";
import { useAuthStore } from "@/store/authStore";
import axios from "axios";

const STATUS_COLORS: Record<string, string> = {
  ACTIVE: "badge-green",
  INACTIVE: "badge-gray",
  MAINTENANCE: "badge-yellow",
};

export default function VehiclesPage() {
  const { token } = useAuthStore();
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [vehicleTypes, setVehicleTypes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [editVehicle, setEditVehicle] = useState<any>(null);
  const [form, setForm] = useState({
    vehicleNumber: "", vehicleTypeId: "", make: "", model: "", year: "",
    capacity: "", capacityUnit: "Ton", rcNumber: "", rcExpiry: "",
    insuranceNumber: "", insuranceExpiry: "", fitnessExpiry: "",
    gpsEnabled: false, status: "ACTIVE", notes: "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const headers = { Authorization: `Bearer ${token}` };

  const fetchVehicles = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`/api/vehicles?page=${page}`, { headers });
      setVehicles(data.vehicles);
      setTotal(data.pagination.total);
    } catch {}
    finally { setLoading(false); }
  }, [token, page]);

  useEffect(() => { fetchVehicles(); }, [fetchVehicles]);

  useEffect(() => {
    axios.get("/api/vehicle-types", { headers }).then(({ data }) => setVehicleTypes(data.types || [])).catch(() => {});
  }, [token]);

  const openModal = (vehicle?: any) => {
    setEditVehicle(vehicle || null);
    setError("");
    if (vehicle) {
      setForm({
        vehicleNumber: vehicle.vehicleNumber || "",
        vehicleTypeId: vehicle.vehicleTypeId || "",
        make: vehicle.make || "", model: vehicle.model || "",
        year: String(vehicle.year || ""), capacity: String(vehicle.capacity || ""),
        capacityUnit: vehicle.capacityUnit || "Ton",
        rcNumber: vehicle.rcNumber || "",
        rcExpiry: vehicle.rcExpiry ? vehicle.rcExpiry.split("T")[0] : "",
        insuranceNumber: vehicle.insuranceNumber || "",
        insuranceExpiry: vehicle.insuranceExpiry ? vehicle.insuranceExpiry.split("T")[0] : "",
        fitnessExpiry: vehicle.fitnessExpiry ? vehicle.fitnessExpiry.split("T")[0] : "",
        gpsEnabled: vehicle.gpsEnabled || false,
        status: vehicle.status || "ACTIVE",
        notes: vehicle.notes || "",
      });
    } else {
      setForm({ vehicleNumber: "", vehicleTypeId: "", make: "", model: "", year: "", capacity: "", capacityUnit: "Ton", rcNumber: "", rcExpiry: "", insuranceNumber: "", insuranceExpiry: "", fitnessExpiry: "", gpsEnabled: false, status: "ACTIVE", notes: "" });
    }
    setModalOpen(true);
  };

  const handleSave = async () => {
    setSaving(true);
    setError("");
    try {
      const payload = {
        ...form,
        year: form.year ? Number(form.year) : undefined,
        capacity: form.capacity ? Number(form.capacity) : undefined,
      };
      if (editVehicle) {
        await axios.patch(`/api/vehicles/${editVehicle.id}`, payload, { headers });
      } else {
        await axios.post("/api/vehicles", payload, { headers });
      }
      setModalOpen(false);
      fetchVehicles();
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to save vehicle");
    } finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this vehicle?")) return;
    await axios.delete(`/api/vehicles/${id}`, { headers });
    fetchVehicles();
  };

  // Check expiry
  const isExpiringSoon = (date: string) => {
    if (!date) return false;
    const d = new Date(date);
    const diff = (d.getTime() - Date.now()) / (1000 * 60 * 60 * 24);
    return diff > 0 && diff <= 30;
  };
  const isExpired = (date: string) => {
    if (!date) return false;
    return new Date(date) < new Date();
  };

  const columns = [
    {
      key: "vehicleNumber", label: "Vehicle No.", sortable: true,
      render: (row: any) => (
        <div>
          <span className="font-mono font-semibold text-white bg-white/5 px-2 py-0.5 rounded border border-white/10">{row.vehicleNumber}</span>
          {row.gpsEnabled && <span className="ml-2 badge badge-blue text-[10px]">GPS</span>}
        </div>
      ),
    },
    {
      key: "type", label: "Type",
      render: (row: any) => <span className="text-sm text-white/60">{row.type?.name}</span>,
    },
    {
      key: "make", label: "Make/Model",
      render: (row: any) => <span className="text-sm text-white/60">{[row.make, row.model, row.year].filter(Boolean).join(" ")}</span>,
    },
    {
      key: "driver", label: "Driver",
      render: (row: any) => {
        const d = row.driverAssignments?.[0]?.driver;
        return d ? <span className="text-sm text-white/60">{d.name}</span> : <span className="text-xs text-white/20">Unassigned</span>;
      },
    },
    {
      key: "insuranceExpiry", label: "Insurance",
      render: (row: any) => {
        const exp = row.insuranceExpiry;
        if (!exp) return <span className="text-xs text-white/20">—</span>;
        const expired = isExpired(exp);
        const soon = isExpiringSoon(exp);
        return (
          <div className="flex items-center gap-1.5">
            {expired ? <AlertTriangle className="w-3.5 h-3.5 text-red-400" /> : soon ? <AlertTriangle className="w-3.5 h-3.5 text-amber-400" /> : <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />}
            <span className={`text-xs ${expired ? "text-red-400" : soon ? "text-amber-400" : "text-white/40"}`}>{formatDate(exp)}</span>
          </div>
        );
      },
    },
    {
      key: "status", label: "Status",
      render: (row: any) => <span className={`badge ${STATUS_COLORS[row.status] || "badge-gray"}`}>{row.status}</span>,
    },
  ];

  return (
    <div className="space-y-5">
      <div className="flex-between">
        <div>
          <h1 className="page-title flex items-center gap-2"><Truck className="w-5 h-5 text-purple-400" />Vehicles</h1>
          <p className="page-subtitle">Manage your fleet of vehicles</p>
        </div>
        <button onClick={() => openModal()} className="btn-primary">
          <Plus className="w-4 h-4" /> Add Vehicle
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Total", value: total, color: "text-white" },
          { label: "Active", value: vehicles.filter(v => v.status === "ACTIVE").length, color: "text-emerald-400" },
          { label: "Maintenance", value: vehicles.filter(v => v.status === "MAINTENANCE").length, color: "text-amber-400" },
          { label: "Inactive", value: vehicles.filter(v => v.status === "INACTIVE").length, color: "text-white/40" },
        ].map(({ label, value, color }) => (
          <div key={label} className="glass-card px-4 py-3 flex items-center gap-3">
            <div className={`text-xl font-bold ${color}`}>{value}</div>
            <div className="text-xs text-muted">{label}</div>
          </div>
        ))}
      </div>

      <DataTable
        columns={columns}
        data={vehicles}
        loading={loading}
        emptyText="No vehicles yet. Add your first vehicle!"
        emptyIcon={<Truck className="w-8 h-8" />}
        total={total}
        page={page}
        pageSize={20}
        onPageChange={setPage}
        rowKey={(row) => row.id}
        onExport={() => alert("Export coming soon!")}
        actions={(row) => (
          <>
            <button onClick={() => openModal(row)} className="btn-icon" title="Edit"><Edit className="w-3.5 h-3.5" /></button>
            <button onClick={() => handleDelete(row.id)} className="btn-icon hover:text-red-400" title="Delete"><Trash2 className="w-3.5 h-3.5" /></button>
          </>
        )}
      />

      {/* Vehicle Modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editVehicle ? "Edit Vehicle" : "Add New Vehicle"}
        subtitle="Enter vehicle registration details"
        size="lg"
        footer={
          <>
            <button onClick={() => setModalOpen(false)} className="btn-secondary">Cancel</button>
            <button onClick={handleSave} disabled={saving} className="btn-primary disabled:opacity-60">
              {saving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : editVehicle ? "Update" : "Add Vehicle"}
            </button>
          </>
        }
      >
        {error && <div className="mb-4 px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{error}</div>}
        <div className="grid grid-cols-2 gap-4">
          {[
            { label: "Vehicle Number *", key: "vehicleNumber", placeholder: "MH12AB1234" },
            { label: "Make", key: "make", placeholder: "Tata" },
            { label: "Model", key: "model", placeholder: "LPT 2518" },
            { label: "Year", key: "year", placeholder: "2022", type: "number" },
            { label: "Capacity", key: "capacity", placeholder: "25", type: "number" },
            { label: "Capacity Unit", key: "capacityUnit", placeholder: "Ton" },
            { label: "RC Number", key: "rcNumber", placeholder: "MH12..." },
            { label: "RC Expiry", key: "rcExpiry", type: "date" },
            { label: "Insurance No.", key: "insuranceNumber", placeholder: "INS..." },
            { label: "Insurance Expiry", key: "insuranceExpiry", type: "date" },
            { label: "Fitness Expiry", key: "fitnessExpiry", type: "date" },
          ].map(({ label, key, placeholder, type = "text" }) => (
            <div key={key}>
              <label className="label-base">{label}</label>
              <input type={type} value={(form as any)[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} placeholder={placeholder} className="input-base" />
            </div>
          ))}
          <div>
            <label className="label-base">Vehicle Type *</label>
            <select value={form.vehicleTypeId} onChange={(e) => setForm({ ...form, vehicleTypeId: e.target.value })} className="select-base">
              <option value="">Select type...</option>
              {vehicleTypes.map((t: any) => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
          </div>
          <div>
            <label className="label-base">Status</label>
            <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="select-base">
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
              <option value="MAINTENANCE">Maintenance</option>
            </select>
          </div>
          <div className="col-span-2 flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10">
            <input type="checkbox" id="gpsEnabled" checked={form.gpsEnabled} onChange={(e) => setForm({ ...form, gpsEnabled: e.target.checked })} className="w-4 h-4 accent-brand-500" />
            <label htmlFor="gpsEnabled" className="text-sm text-white/60 cursor-pointer">GPS Tracking Enabled</label>
          </div>
          <div className="col-span-2">
            <label className="label-base">Notes</label>
            <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} rows={2} placeholder="Any additional notes..." className="input-base resize-none" />
          </div>
        </div>
      </Modal>
    </div>
  );
}
