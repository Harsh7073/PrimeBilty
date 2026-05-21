"use client";

import { Package, Search } from "lucide-react";
import { DataTable } from "@/components/ui/DataTable";
import { useState, useEffect } from "react";
import axios from "axios";
import { useAuthStore } from "@/store/authStore";

export default function UnitsPage() {
  const { token } = useAuthStore();
  const [units, setUnits] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUnits = async () => {
      try {
        const { data } = await axios.get("/api/units", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUnits(data.units || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchUnits();
  }, [token]);

  const columns = [
    { key: "name", label: "Unit Name", sortable: true },
    { key: "description", label: "Description" },
  ];

  return (
    <div className="space-y-5">
      <div>
        <h1 className="page-title flex items-center gap-2">
          <Package className="w-5 h-5 text-purple-400" />
          Units
        </h1>
        <p className="page-subtitle">Manage measurement units</p>
      </div>

      <DataTable
        columns={columns}
        data={units}
        loading={loading}
        emptyText="No units found."
        emptyIcon={<Search className="w-8 h-8" />}
      />
    </div>
  );
}
