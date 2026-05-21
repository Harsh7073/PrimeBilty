"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Printer, Plus, Edit, Trash2, Users, FileText, Layout, Check, X, ArrowRight } from "lucide-react";
import { DataTable } from "@/components/ui/DataTable";
import { Modal } from "@/components/ui/Modal";
import { useAuthStore } from "@/store/authStore";
import axios from "axios";
import Link from "next/link";

export default function PrintTemplatesPage() {
  const { token } = useAuthStore();
  const [templates, setTemplates] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"templates" | "assignments">("templates");
  
  // Create template modal state
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [designNo, setDesignNo] = useState("");
  const [designName, setDesignName] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const headers = { Authorization: `Bearer ${token}` };

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [tRes, uRes] = await Promise.all([
        axios.get("/api/print-templates", { headers }),
        axios.get("/api/admin/users", { headers }),
      ]);
      setTemplates(tRes.data.templates || []);
      setUsers(uRes.data.users || []);
    } catch (e) {
      console.error("Failed to load templates/users data:", e);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (token) fetchData();
  }, [token, fetchData]);

  const handleCreateTemplate = async () => {
    if (!designNo || !designName) {
      setError("Please fill in all fields.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const { data } = await axios.post("/api/print-templates", {
        designNo,
        designName,
        jsonLayout: "[]"
      }, { headers });
      
      setCreateModalOpen(false);
      setDesignNo("");
      setDesignName("");
      fetchData();
      
      // Redirect to the newly created template designer
      window.location.href = `/admin/print-templates/designer?id=${data.template.id}`;
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to create template.");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteTemplate = async (id: string) => {
    if (!confirm("Are you sure you want to delete this template? Any users assigned to it will revert to standard layouts.")) return;
    try {
      await axios.delete(`/api/print-templates/${id}`, { headers });
      fetchData();
    } catch (err) {
      console.error("Failed to delete template", err);
    }
  };

  const handleAssignTemplate = async (userId: string, templateId: string) => {
    try {
      await axios.patch(`/api/admin/users/${userId}`, {
        printTemplateId: templateId || null
      }, { headers });
      fetchData();
    } catch (err) {
      console.error("Failed to assign template", err);
    }
  };

  const templateColumns = [
    { key: "designNo", label: "Design No", render: (row: any) => <span className="font-mono font-semibold text-brand-400">{row.designNo}</span> },
    { key: "designName", label: "Design Name", render: (row: any) => <span className="text-white font-medium">{row.designName}</span> },
    { key: "layoutSize", label: "Layout Elements", render: (row: any) => {
        try {
          const elements = JSON.parse(row.jsonLayout || "[]");
          return <span className="text-xs text-white/50">{elements.length} elements</span>;
        } catch {
          return <span className="text-xs text-red-400">Invalid layout JSON</span>;
        }
      } 
    },
    { key: "createdAt", label: "Created At", render: (row: any) => <span className="text-xs text-white/30">{new Date(row.createdAt).toLocaleDateString()}</span> }
  ];

  const userColumns = [
    { key: "name", label: "User Name", render: (row: any) => (
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs flex-center font-bold">
            {row.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="text-sm font-medium text-white">{row.name}</div>
            <div className="text-[10px] text-white/40">{row.email}</div>
          </div>
        </div>
      ) 
    },
    { key: "role", label: "Role", render: (row: any) => <span className="badge badge-purple">{row.role?.name || "User"}</span> },
    { key: "assignment", label: "Assigned Print Template", render: (row: any) => (
        <select
          value={row.printTemplateId || ""}
          onChange={(e) => handleAssignTemplate(row.id, e.target.value)}
          className="select-base text-xs py-1.5 min-w-48 bg-dark-900 border-white/10"
        >
          <option value="">Default System Template</option>
          {templates.map(t => (
            <option key={t.id} value={t.id}>{t.designNo} - {t.designName}</option>
          ))}
        </select>
      ) 
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex-between">
        <div>
          <h1 className="page-title flex items-center gap-2">
            <Printer className="w-5 h-5 text-brand-400" />
            Print Template Designer
          </h1>
          <p className="page-subtitle">Configure pixel-perfect dynamic print layouts for Bilties and bills</p>
        </div>
        <button 
          onClick={() => setCreateModalOpen(true)}
          className="btn-primary gap-1.5"
        >
          <Plus className="w-4 h-4" /> Create Design
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-white/10 gap-6">
        <button
          onClick={() => setActiveTab("templates")}
          className={`pb-3 text-sm font-medium transition-all relative ${
            activeTab === "templates" ? "text-brand-400 font-semibold" : "text-white/40 hover:text-white/60"
          }`}
        >
          Templates
          {activeTab === "templates" && (
            <motion.div layoutId="activeTabUnderline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-500" />
          )}
        </button>
        <button
          onClick={() => setActiveTab("assignments")}
          className={`pb-3 text-sm font-medium transition-all relative ${
            activeTab === "assignments" ? "text-brand-400 font-semibold" : "text-white/40 hover:text-white/60"
          }`}
        >
          User Profile Assignments
          {activeTab === "assignments" && (
            <motion.div layoutId="activeTabUnderline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-500" />
          )}
        </button>
      </div>

      {/* Content */}
      <div className="space-y-4">
        {activeTab === "templates" ? (
          <DataTable
            columns={templateColumns}
            data={templates}
            loading={loading}
            emptyText="No print templates configured. Get started by creating one!"
            emptyIcon={<Layout className="w-8 h-8" />}
            rowKey={(row) => row.id}
            actions={(row) => (
              <>
                <Link href={`/admin/print-templates/designer?id=${row.id}`}>
                  <button className="btn-icon text-brand-400 hover:text-brand-300" title="Open Designer">
                    <Edit className="w-3.5 h-3.5" />
                  </button>
                </Link>
                <button 
                  onClick={() => handleDeleteTemplate(row.id)} 
                  className="btn-icon hover:text-red-400" 
                  title="Delete Design"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </>
            )}
          />
        ) : (
          <DataTable
            columns={userColumns}
            data={users}
            loading={loading}
            emptyText="No users found."
            emptyIcon={<Users className="w-8 h-8" />}
            rowKey={(row) => row.id}
          />
        )}
      </div>

      {/* Create Modal */}
      <Modal
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        title="Create New Print Template"
        size="md"
        footer={
          <>
            <button onClick={() => setCreateModalOpen(false)} className="btn-secondary">Cancel</button>
            <button onClick={handleCreateTemplate} disabled={saving} className="btn-primary">
              {saving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : "Create & Design"}
            </button>
          </>
        }
      >
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
            {error}
          </div>
        )}
        <div className="space-y-4">
          <div>
            <label className="label-base">Design Number / Unique Code *</label>
            <input
              value={designNo}
              onChange={(e) => setDesignNo(e.target.value.toUpperCase())}
              placeholder="e.g. DESIGN-001"
              className="input-base font-mono"
            />
          </div>
          <div>
            <label className="label-base">Design Name *</label>
            <input
              value={designName}
              onChange={(e) => setDesignName(e.target.value)}
              placeholder="e.g. Standard Bilty A4 Layout"
              className="input-base"
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}
