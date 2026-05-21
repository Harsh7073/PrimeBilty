"use client";

import { Building2, Search } from "lucide-react";
import { DataTable } from "@/components/ui/DataTable";
import { useState } from "react";

export default function CompaniesPage() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(false);

  const columns = [
    { key: "name", label: "Company Name", sortable: true },
    { key: "gstin", label: "GSTIN" },
    { key: "status", label: "Status" },
  ];

  return (
    <div className="space-y-5">
      <div>
        <h1 className="page-title flex items-center gap-2">
          <Building2 className="w-5 h-5 text-emerald-400" />
          Companies
        </h1>
        <p className="page-subtitle">Manage company profiles</p>
      </div>

      <DataTable
        columns={columns}
        data={companies}
        loading={loading}
        emptyText="No companies found. API integration pending."
        emptyIcon={<Search className="w-8 h-8" />}
      />
    </div>
  );
}
