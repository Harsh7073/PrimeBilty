"use client";

import { Truck, Search } from "lucide-react";
import { DataTable } from "@/components/ui/DataTable";
import { useState, useEffect } from "react";
import axios from "axios";
import { useAuthStore } from "@/store/authStore";

export default function VehicleTypesPage() {
  const { token } = useAuthStore();
  const [types, setTypes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTypes = async () => {
      try {
        const { data } = await axios.get("/api/vehicle-types", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setTypes(data.types || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchTypes();
  }, [token]);

  const columns = [
    { key: "name", label: "Type Name", sortable: true },
    { key: "description", label: "Description" },
    { key: "status", label: "Status", render: (row: any) => (
      <span className="badge badge-green">ACTIVE</span>
    )},
  ];

  return (
    <div className="space-y-5">
      <div>
        <h1 className="page-title flex items-center gap-2">
          <Truck className="w-5 h-5 text-purple-400" />
          Vehicle Types
        </h1>
        <p className="page-subtitle">Manage vehicle classifications</p>
      </div>

      <DataTable
        columns={columns}
        data={types}
        loading={loading}
        emptyText="No vehicle types found."
        emptyIcon={<Search className="w-8 h-8" />}
      />
    </div>
  );
}
