"use client";

import { Shield, Search } from "lucide-react";
import { DataTable } from "@/components/ui/DataTable";
import { useState } from "react";

export default function RolesPage() {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);

  const columns = [
    { key: "name", label: "Role Name", sortable: true },
    { key: "description", label: "Description" },
    { key: "permissions", label: "Permissions Count" },
  ];

  return (
    <div className="space-y-5">
      <div>
        <h1 className="page-title flex items-center gap-2">
          <Shield className="w-5 h-5 text-red-400" />
          Roles & Permissions
        </h1>
        <p className="page-subtitle">Manage access controls</p>
      </div>

      <DataTable
        columns={columns}
        data={roles}
        loading={loading}
        emptyText="No roles found. API integration pending."
        emptyIcon={<Search className="w-8 h-8" />}
      />
    </div>
  );
}
