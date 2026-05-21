"use client";

import { useState } from "react";
import { Download, Filter, Search, Calendar, Printer, ArrowLeft } from "lucide-react";
import { DataTable } from "@/components/ui/DataTable";
import { formatCurrency, formatDate, getStatusColor } from "@/lib/utils";
import Link from "next/link";
import { REPORT_TYPES, mockBiltyData } from "../data";
import { useParams } from "next/navigation";

// Specialized mock data for different report types
const mockVehicleData = [
  { vehicleNo: "MH01AB1234", type: "Open Body", driver: "Raj Kumar", trips: 12, revenue: 150000, status: "ACTIVE", lastMaintenance: "2024-04-15" },
  { vehicleNo: "TN05CD5678", type: "Container", driver: "Suresh", trips: 8, revenue: 220000, status: "IN_TRANSIT", lastMaintenance: "2024-05-01" },
  { vehicleNo: "KA12EF9012", type: "Trailer", driver: "Ramesh", trips: 5, revenue: 85000, status: "MAINTENANCE", lastMaintenance: "2024-05-18" },
];

const mockCustomerData = [
  { name: "Acme Corp", type: "Consignor", totalBilties: 45, totalRevenue: 550000, outstanding: 45000, status: "ACTIVE" },
  { name: "Star Ltd", type: "Consignee", totalBilties: 32, totalRevenue: 320000, outstanding: 0, status: "ACTIVE" },
  { name: "Fast Move", type: "Broker", totalBilties: 12, totalRevenue: 85000, outstanding: 12000, status: "INACTIVE" },
];

const mockFinanceData = [
  { invoiceNo: "INV-24001", party: "Acme Corp", amount: 45000, date: "2024-05-01", dueDate: "2024-05-15", status: "PAID" },
  { invoiceNo: "INV-24002", party: "Star Ltd", amount: 22000, date: "2024-05-05", dueDate: "2024-05-20", status: "UNPAID" },
  { invoiceNo: "INV-24003", party: "Fast Move", amount: 15000, date: "2024-05-10", dueDate: "2024-05-25", status: "PARTIAL" },
];

export default function DynamicReportPage() {
  const params = useParams();
  const reportType = params.type as string;
  
  const reportDef = REPORT_TYPES.find(r => r.id === reportType);

  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [search, setSearch] = useState("");

  // Determine which dataset and columns to use based on reportType
  let rawData: any[] = mockBiltyData;
  let columns: any[] = [];
  let summaryStats: any[] = [];

  // Default Bilty Columns
  const biltyColumns = [
    { key: "lrNumber", label: "LR Number", sortable: true, render: (row: any) => <span className="font-mono text-sm text-brand-400">{row.lrNumber}</span> },
    { key: "route", label: "Route", render: (row: any) => <span className="text-sm text-white/70">{row.fromCity} → {row.toCity}</span> },
    { key: "vehicle", label: "Vehicle", render: (row: any) => <span className="font-mono text-sm text-white/60">{row.vehicle}</span> },
    { key: "party", label: "Party", render: (row: any) => <span className="text-sm text-white/70">{row.party}</span> },
    { key: "freight", label: "Freight", sortable: true, render: (row: any) => <span className="text-sm font-semibold text-white">{formatCurrency(row.freight)}</span> },
    { key: "status", label: "Status", render: (row: any) => <span className={`badge ${getStatusColor(row.status)}`}>{row.status.replace("_", " ")}</span> },
    { key: "date", label: "Date", sortable: true, render: (row: any) => <span className="text-xs text-white/40">{formatDate(row.date)}</span> },
  ];

  // Configure Data & Columns
  if (reportType === "vehicle") {
    rawData = mockVehicleData;
    columns = [
      { key: "vehicleNo", label: "Vehicle No", sortable: true, render: (row: any) => <span className="font-mono font-semibold text-brand-400">{row.vehicleNo}</span> },
      { key: "type", label: "Type" },
      { key: "driver", label: "Driver" },
      { key: "trips", label: "Total Trips", sortable: true },
      { key: "revenue", label: "Revenue generated", sortable: true, render: (row: any) => <span className="text-emerald-400">{formatCurrency(row.revenue)}</span> },
      { key: "status", label: "Status", render: (row: any) => <span className={`badge ${getStatusColor(row.status)}`}>{row.status.replace("_", " ")}</span> },
    ];
  } else if (reportType === "customer" || reportType === "consigner" || reportType === "consignee") {
    rawData = mockCustomerData;
    columns = [
      { key: "name", label: "Party Name", sortable: true, render: (row: any) => <span className="font-semibold text-white">{row.name}</span> },
      { key: "type", label: "Type" },
      { key: "totalBilties", label: "Total Bilties", sortable: true },
      { key: "totalRevenue", label: "Total Business", sortable: true, render: (row: any) => <span>{formatCurrency(row.totalRevenue)}</span> },
      { key: "outstanding", label: "Outstanding", sortable: true, render: (row: any) => <span className="text-red-400">{formatCurrency(row.outstanding)}</span> },
      { key: "status", label: "Status", render: (row: any) => <span className={`badge ${getStatusColor(row.status)}`}>{row.status}</span> },
    ];
  } else if (reportType === "invoice" || reportType === "payment" || reportType === "profit-loss") {
    rawData = mockFinanceData;
    columns = [
      { key: "invoiceNo", label: "Invoice No", sortable: true, render: (row: any) => <span className="font-mono text-emerald-400">{row.invoiceNo}</span> },
      { key: "party", label: "Party Name" },
      { key: "amount", label: "Amount", sortable: true, render: (row: any) => <span className="font-bold text-white">{formatCurrency(row.amount)}</span> },
      { key: "date", label: "Date", render: (row: any) => <span className="text-white/60">{formatDate(row.date)}</span> },
      { key: "dueDate", label: "Due Date", render: (row: any) => <span className="text-amber-400/80">{formatDate(row.dueDate)}</span> },
      { key: "status", label: "Status", render: (row: any) => <span className={`badge ${getStatusColor(row.status)}`}>{row.status}</span> },
    ];
  } else {
    // Default to Bilty data
    columns = biltyColumns;
  }

  const filteredData = rawData.filter(row =>
    !search || Object.values(row).some(v => String(v).toLowerCase().includes(search.toLowerCase()))
  );

  // Configure Summary Stats based on type
  if (reportType === "vehicle") {
    summaryStats = [
      { label: "Total Vehicles", value: filteredData.length },
      { label: "Active on Trip", value: filteredData.filter(r => r.status === "IN_TRANSIT").length },
      { label: "Total Revenue", value: formatCurrency(filteredData.reduce((s, r) => s + r.revenue, 0)) },
      { label: "In Maintenance", value: filteredData.filter(r => r.status === "MAINTENANCE").length },
    ];
  } else if (reportType === "customer" || reportType === "consigner" || reportType === "consignee") {
    summaryStats = [
      { label: "Total Parties", value: filteredData.length },
      { label: "Total Business", value: formatCurrency(filteredData.reduce((s, r) => s + r.totalRevenue, 0)) },
      { label: "Total Outstanding", value: formatCurrency(filteredData.reduce((s, r) => s + r.outstanding, 0)) },
      { label: "Active Parties", value: filteredData.filter(r => r.status === "ACTIVE").length },
    ];
  } else if (reportType === "invoice" || reportType === "payment" || reportType === "profit-loss") {
    summaryStats = [
      { label: "Total Invoices", value: filteredData.length },
      { label: "Total Value", value: formatCurrency(filteredData.reduce((s, r) => s + r.amount, 0)) },
      { label: "Paid", value: filteredData.filter(r => r.status === "PAID").length },
      { label: "Unpaid", value: filteredData.filter(r => r.status === "UNPAID").length },
    ];
  } else {
    // Default Bilty stats
    summaryStats = [
      { label: "Total Records", value: filteredData.length },
      { label: "Total Value", value: formatCurrency(filteredData.reduce((s, r) => s + r.freight, 0)) },
      { label: "Completed", value: filteredData.filter(r => r.status === "DELIVERED").length },
      { label: "Pending", value: filteredData.filter(r => r.status === "IN_TRANSIT" || r.status === "ACTIVE").length },
    ];
  }

  const handleExportExcel = () => {
    if (filteredData.length === 0) return alert("No data to export");

    const exportColumns = columns.filter(c => c.key !== "actions");
    const headers = exportColumns.map(c => c.label).join(",");
    
    const rows = filteredData.map(row => {
      return exportColumns.map(col => {
        let val = row[col.key as keyof typeof row];
        if (col.key === "route" && row.fromCity) val = `${row.fromCity} - ${row.toCity}`;
        if (val === undefined || val === null) val = "";
        const strVal = String(val).replace(/"/g, '""');
        return `"${strVal}"`;
      }).join(",");
    });

    const csvContent = [headers, ...rows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `TruckBilty_${reportType}_report.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!reportDef) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <h2 className="text-xl font-bold text-white mb-2">Report Not Found</h2>
        <p className="text-white/50 mb-6">The requested report type does not exist.</p>
        <Link href="/reports" className="btn-primary">Back to Reports</Link>
      </div>
    );
  }

  const Icon = reportDef.icon;

  return (
    <div className="space-y-5">
      <div className="flex-between">
        <div className="flex items-center gap-4">
          <Link href="/reports" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex-center hover:bg-white/10 transition-colors">
            <ArrowLeft className="w-5 h-5 text-white/70" />
          </Link>
          <div>
            <h1 className="page-title flex items-center gap-2">
              <div className={`w-8 h-8 rounded-lg ${reportDef.bg} flex-center`}>
                <Icon className={`w-4 h-4 ${reportDef.color}`} />
              </div>
              {reportDef.label}
            </h1>
            <p className="page-subtitle">Detailed view and analytics</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={() => window.print()} className="btn-secondary gap-1.5"><Printer className="w-4 h-4" />Print</button>
          <button onClick={handleExportExcel} className="btn-primary gap-1.5"><Download className="w-4 h-4" />Export Excel</button>
        </div>
      </div>

      {/* Filters */}
      <div className="glass-card p-4 flex flex-wrap gap-3 items-center">
        <div className="flex items-center gap-2 text-sm text-white/40">
          <Filter className="w-4 h-4" /> Filters:
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-white/30" />
          <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className="input-base py-1.5 text-sm w-36" />
          <span className="text-white/30 text-sm">to</span>
          <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} className="input-base py-1.5 text-sm w-36" />
        </div>
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search in report..." className="input-base pl-9 py-1.5 text-sm" />
        </div>
        <button className="btn-secondary text-xs py-1.5">Apply</button>
        <button className="text-xs text-white/30 hover:text-white/60" onClick={() => { setDateFrom(""); setDateTo(""); setSearch(""); }}>Clear</button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {summaryStats.map(({ label, value }) => (
          <div key={label} className="glass-card px-4 py-3">
            <div className="text-xs text-muted mb-1">{label}</div>
            <div className="text-lg font-bold text-white">{value}</div>
          </div>
        ))}
      </div>

      {/* Report Table */}
      <div>
        <DataTable
          columns={columns}
          data={filteredData}
          searchable={false}
          emptyText="No data for selected filters"
          rowKey={(row) => row.lrNumber || row.vehicleNo || row.name || row.invoiceNo}
          onExport={handleExportExcel}
        />
      </div>
    </div>
  );
}
