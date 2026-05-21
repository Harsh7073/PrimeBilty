"use client";

import { GitBranch, Search } from "lucide-react";
import { DataTable } from "@/components/ui/DataTable";
import { useState } from "react";

export default function BranchesPage() {
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(false);

  const columns = [
    { key: "name", label: "Branch Name", sortable: true },
    { key: "city", label: "City" },
    { key: "status", label: "Status" },
  ];

  return (
    <div className="space-y-5">
      <div>
        <h1 className="page-title flex items-center gap-2">
          <GitBranch className="w-5 h-5 text-indigo-400" />
          Branches
        </h1>
        <p className="page-subtitle">Manage regional branches and offices</p>
      </div>

      <DataTable
        columns={columns}
        data={branches}
        loading={loading}
        emptyText="No branches found. API integration pending."
        emptyIcon={<Search className="w-8 h-8" />}
      />
    </div>
  );
}
