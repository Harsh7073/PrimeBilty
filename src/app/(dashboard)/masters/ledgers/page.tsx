"use client";

import { BookOpen, Search } from "lucide-react";
import { DataTable } from "@/components/ui/DataTable";
import { useState, useEffect } from "react";
import axios from "axios";
import { useAuthStore } from "@/store/authStore";

export default function LedgersPage() {
  const { token } = useAuthStore();
  const [ledgers, setLedgers] = useState([]);
  const [loading, setLoading] = useState(false); // set to false for mock data

  const columns = [
    { key: "name", label: "Ledger Name", sortable: true },
    { key: "group", label: "Group" },
    { key: "balance", label: "Opening Balance" },
  ];

  return (
    <div className="space-y-5">
      <div>
        <h1 className="page-title flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-amber-400" />
          Ledgers
        </h1>
        <p className="page-subtitle">Manage financial ledgers and accounts</p>
      </div>

      <DataTable
        columns={columns}
        data={ledgers}
        loading={loading}
        emptyText="No ledgers found. API integration pending."
        emptyIcon={<Search className="w-8 h-8" />}
      />
    </div>
  );
}
