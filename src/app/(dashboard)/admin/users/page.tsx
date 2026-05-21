"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Users, Plus, Edit, Trash2, Shield, UserCheck, UserX, Activity } from "lucide-react";
import { DataTable } from "@/components/ui/DataTable";
import { Modal } from "@/components/ui/Modal";
import { formatDateTime } from "@/lib/utils";
import { useAuthStore } from "@/store/authStore";
import axios from "axios";

export default function AdminUsersPage() {
  const { token } = useAuthStore();
  const [users, setUsers] = useState<any[]>([]);
  const [roles, setRoles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [editUser, setEditUser] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "", roleId: "", isActive: true });

  const headers = { Authorization: `Bearer ${token}` };

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await axios.get("/api/admin/users", { headers });
      setUsers(data.users || []);
      setTotal(data.total || 0);
    } catch (e) {
      // Mock data for display
      setUsers([
        { id: "1", name: "Admin User", email: "admin@co.com", phone: "+91 98765 43210", role: { name: "ADMIN" }, isActive: true, createdAt: new Date().toISOString() },
        { id: "2", name: "Manager", email: "mgr@co.com", phone: "+91 87654 32109", role: { name: "MANAGER" }, isActive: true, createdAt: new Date().toISOString() },
      ]);
      setTotal(2);
    } finally { setLoading(false); }
  }, [token]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);
  useEffect(() => {
    axios.get("/api/roles", { headers }).then(({ data }) => setRoles(data.roles || [])).catch(() => {
      setRoles([{ id: "admin-role", name: "ADMIN" }, { id: "mgr-role", name: "MANAGER" }, { id: "staff-role", name: "STAFF" }]);
    });
  }, [token]);

  const openModal = (user?: any) => {
    setEditUser(user || null);
    setError("");
    setForm(user ? { name: user.name, email: user.email, phone: user.phone || "", password: "", roleId: user.roleId || "", isActive: user.isActive } : { name: "", email: "", phone: "", password: "", roleId: "", isActive: true });
    setModalOpen(true);
  };

  const handleSave = async () => {
    setSaving(true);
    setError("");
    try {
      if (editUser) {
        await axios.patch(`/api/admin/users/${editUser.id}`, { name: form.name, phone: form.phone, roleId: form.roleId, isActive: form.isActive }, { headers });
      } else {
        await axios.post("/api/admin/users", form, { headers });
      }
      setModalOpen(false);
      fetchUsers();
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to save user");
    } finally { setSaving(false); }
  };

  const columns = [
    {
      key: "name", label: "Name",
      render: (row: any) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-500 to-purple-600 flex-center text-xs font-bold flex-shrink-0">
            {row.name?.charAt(0)?.toUpperCase()}
          </div>
          <div>
            <div className="text-sm font-medium text-white">{row.name}</div>
            <div className="text-xs text-white/40">{row.email}</div>
          </div>
        </div>
      ),
    },
    { key: "phone", label: "Phone", render: (row: any) => <span className="text-sm text-white/60">{row.phone || "—"}</span> },
    { key: "role", label: "Role", render: (row: any) => <span className="badge badge-purple">{row.role?.name}</span> },
    { key: "isActive", label: "Status", render: (row: any) => row.isActive ? <span className="badge badge-green">Active</span> : <span className="badge badge-red">Inactive</span> },
    { key: "createdAt", label: "Joined", render: (row: any) => <span className="text-xs text-white/40">{formatDateTime(row.createdAt)}</span> },
  ];

  return (
    <div className="space-y-5">
      <div className="flex-between">
        <div>
          <h1 className="page-title flex items-center gap-2"><Users className="w-5 h-5 text-brand-400" />User Management</h1>
          <p className="page-subtitle">Manage team members and their access</p>
        </div>
        <button onClick={() => openModal()} className="btn-primary"><Plus className="w-4 h-4" />Add User</button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total Users", value: total, icon: Users, color: "text-brand-400", bg: "bg-brand-500/10" },
          { label: "Active", value: users.filter(u => u.isActive).length, icon: UserCheck, color: "text-emerald-400", bg: "bg-emerald-500/10" },
          { label: "Inactive", value: users.filter(u => !u.isActive).length, icon: UserX, color: "text-red-400", bg: "bg-red-500/10" },
        ].map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="glass-card p-4 flex items-center gap-4">
            <div className={`w-10 h-10 rounded-xl ${bg} flex-center`}><Icon className={`w-5 h-5 ${color}`} /></div>
            <div><div className="text-xl font-bold text-white">{value}</div><div className="text-xs text-muted">{label}</div></div>
          </div>
        ))}
      </div>

      <DataTable
        columns={columns}
        data={users}
        loading={loading}
        emptyText="No users found"
        rowKey={(row) => row.id}
        actions={(row) => (
          <>
            <button onClick={() => openModal(row)} className="btn-icon"><Edit className="w-3.5 h-3.5" /></button>
            <button className="btn-icon hover:text-red-400"><Trash2 className="w-3.5 h-3.5" /></button>
          </>
        )}
      />

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editUser ? "Edit User" : "Add New User"}
        size="md"
        footer={<>
          <button onClick={() => setModalOpen(false)} className="btn-secondary">Cancel</button>
          <button onClick={handleSave} disabled={saving} className="btn-primary disabled:opacity-60">
            {saving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : editUser ? "Update" : "Create User"}
          </button>
        </>}
      >
        {error && <div className="mb-3 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{error}</div>}
        <div className="space-y-4">
          <div><label className="label-base">Full Name *</label><input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-base" /></div>
          <div><label className="label-base">Email *</label><input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="input-base" disabled={!!editUser} /></div>
          <div><label className="label-base">Phone</label><input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="input-base" /></div>
          {!editUser && <div><label className="label-base">Password *</label><input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Min 6 chars" className="input-base" /></div>}
          <div>
            <label className="label-base">Role</label>
            <select value={form.roleId} onChange={(e) => setForm({ ...form, roleId: e.target.value })} className="select-base">
              <option value="">Select role...</option>
              {roles.map((r: any) => <option key={r.id} value={r.id}>{r.name}</option>)}
            </select>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-xl border border-white/10 bg-white/5">
            <input type="checkbox" id="isActive" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} className="w-4 h-4 accent-brand-500" />
            <label htmlFor="isActive" className="text-sm text-white/60 cursor-pointer">Account is Active</label>
          </div>
        </div>
      </Modal>
    </div>
  );
}
