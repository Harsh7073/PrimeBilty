"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  TrendingUp, TrendingDown, DollarSign, ArrowUpRight, ArrowDownRight,
  BarChart2, PieChart as PieChartIcon, BookOpen
} from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell
} from "recharts";
import { formatCurrency } from "@/lib/utils";
import { useAuthStore } from "@/store/authStore";
import axios from "axios";

const COLORS = ["#3b82f6", "#8b5cf6", "#10b981", "#f59e0b", "#ef4444"];

const mockMonthlyData = Array.from({ length: 6 }, (_, i) => ({
  month: ["Dec", "Jan", "Feb", "Mar", "Apr", "May"][i],
  income: Math.random() * 500000 + 200000,
  expense: Math.random() * 300000 + 100000,
}));

const expenseCategories = [
  { name: "Fuel", value: 35 },
  { name: "Driver Pay", value: 25 },
  { name: "Maintenance", value: 15 },
  { name: "Toll", value: 12 },
  { name: "Others", value: 13 },
];

export default function AccountingPage() {
  const { token } = useAuthStore();
  const [stats, setStats] = useState({ income: 0, expense: 0, profit: 0, outstanding: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading accounting data
    setTimeout(() => {
      setStats({ income: 1250000, expense: 680000, profit: 570000, outstanding: 340000 });
      setLoading(false);
    }, 800);
  }, []);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p className="text-xs text-white/50 mb-2">{label}</p>
          {payload.map((p: any, i: number) => (
            <p key={i} className="text-sm font-semibold" style={{ color: p.color }}>
              {p.name}: {formatCurrency(p.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      <div className="flex-between">
        <div>
          <h1 className="page-title flex items-center gap-2"><BookOpen className="w-5 h-5 text-emerald-400" />Accounting</h1>
          <p className="page-subtitle">Financial overview and P&L analysis</p>
        </div>
        <div className="flex gap-2">
          <select className="select-base py-2 text-sm">
            <option>This Month</option>
            <option>Last Month</option>
            <option>This Quarter</option>
            <option>This Year</option>
          </select>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Income", value: formatCurrency(stats.income), icon: TrendingUp, color: "text-emerald-400", bg: "bg-emerald-500/10", trend: 12 },
          { label: "Total Expense", value: formatCurrency(stats.expense), icon: TrendingDown, color: "text-red-400", bg: "bg-red-500/10", trend: -5 },
          { label: "Net Profit", value: formatCurrency(stats.profit), icon: DollarSign, color: "text-brand-400", bg: "bg-brand-500/10", trend: 18 },
          { label: "Outstanding", value: formatCurrency(stats.outstanding), icon: ArrowUpRight, color: "text-amber-400", bg: "bg-amber-500/10", trend: -8 },
        ].map(({ label, value, icon: Icon, color, bg, trend }) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-5"
          >
            <div className="flex items-start justify-between mb-3">
              <p className="text-xs text-muted uppercase tracking-wide">{label}</p>
              <div className={`w-9 h-9 rounded-lg ${bg} flex-center`}>
                <Icon className={`w-4 h-4 ${color}`} />
              </div>
            </div>
            <p className="text-xl font-bold text-white">{loading ? "—" : value}</p>
            <div className="flex items-center gap-1 mt-1.5">
              <span className={`text-xs font-semibold px-1.5 py-0.5 rounded ${trend > 0 ? "text-emerald-400 bg-emerald-500/10" : "text-red-400 bg-red-500/10"}`}>
                {trend > 0 ? "+" : ""}{trend}%
              </span>
              <span className="text-xs text-muted">vs last month</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Income vs Expense */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-5 lg:col-span-2"
        >
          <div className="flex-between mb-4">
            <div>
              <h3 className="font-semibold text-white">Income vs Expense</h3>
              <p className="text-xs text-muted mt-0.5">Last 6 months comparison</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5 text-xs text-white/40"><span className="w-2 h-2 rounded-full bg-emerald-500" />Income</span>
              <span className="flex items-center gap-1.5 text-xs text-white/40"><span className="w-2 h-2 rounded-full bg-red-500" />Expense</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={mockMonthlyData} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
              <defs>
                <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ef4444" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#ef4444" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `₹${(v/1000).toFixed(0)}K`} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="income" name="Income" stroke="#10b981" fill="url(#incomeGrad)" strokeWidth={2} />
              <Area type="monotone" dataKey="expense" name="Expense" stroke="#ef4444" fill="url(#expenseGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Expense Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card p-5"
        >
          <h3 className="font-semibold text-white mb-1">Expense Breakdown</h3>
          <p className="text-xs text-muted mb-4">By category</p>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={expenseCategories} cx="50%" cy="50%" innerRadius={40} outerRadius={60} paddingAngle={3} dataKey="value">
                {expenseCategories.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip formatter={(v) => `${v}%`} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-2">
            {expenseCategories.map((cat, i) => (
              <div key={cat.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-sm" style={{ background: COLORS[i] }} />
                  <span className="text-xs text-white/50">{cat.name}</span>
                </div>
                <span className="text-xs font-medium text-white/70">{cat.value}%</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Outstanding Table */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="glass-card p-5"
      >
        <div className="flex-between mb-4">
          <div>
            <h3 className="font-semibold text-white">Customer Outstanding</h3>
            <p className="text-xs text-muted mt-0.5">Pending receivables</p>
          </div>
          <button className="btn-secondary text-xs">Export</button>
        </div>
        <div className="overflow-x-auto">
          <table className="tb-table">
            <thead className="tb-thead">
              <tr>
                <th className="tb-th">Party Name</th>
                <th className="tb-th">Total Invoiced</th>
                <th className="tb-th">Paid</th>
                <th className="tb-th">Outstanding</th>
                <th className="tb-th">Overdue Days</th>
              </tr>
            </thead>
            <tbody>
              {[
                { name: "Acme Transport Co.", invoiced: 250000, paid: 150000, overdue: 45 },
                { name: "Global Freight Ltd.", invoiced: 180000, paid: 180000, overdue: 0 },
                { name: "Star Logistics", invoiced: 320000, paid: 200000, overdue: 12 },
                { name: "Fast Movers Pvt.", invoiced: 95000, paid: 0, overdue: 60 },
              ].map((row) => {
                const outstanding = row.invoiced - row.paid;
                return (
                  <tr key={row.name} className="tb-tr">
                    <td className="tb-td font-medium text-white">{row.name}</td>
                    <td className="tb-td">{formatCurrency(row.invoiced)}</td>
                    <td className="tb-td text-emerald-400">{formatCurrency(row.paid)}</td>
                    <td className="tb-td">
                      <span className={`font-semibold ${outstanding > 0 ? "text-amber-400" : "text-emerald-400"}`}>
                        {formatCurrency(outstanding)}
                      </span>
                    </td>
                    <td className="tb-td">
                      {row.overdue > 0 ? (
                        <span className={`badge ${row.overdue > 30 ? "badge-red" : "badge-yellow"}`}>{row.overdue}d overdue</span>
                      ) : (
                        <span className="badge badge-green">On time</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
