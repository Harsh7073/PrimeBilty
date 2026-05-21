"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Truck, FileText, Receipt, TrendingUp, TrendingDown, Activity,
  AlertCircle, CheckCircle, Clock, Plus, ArrowRight, RefreshCw,
  BarChart2, Layers, Users
} from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from "recharts";
import { StatCard, StatCardSkeleton } from "@/components/ui/StatCard";
import { formatCurrency, formatDate, getStatusColor } from "@/lib/utils";
import Link from "next/link";
import axios from "axios";
import { useAuthStore } from "@/store/authStore";

const COLORS = ["#3b82f6", "#8b5cf6", "#06b6d4", "#10b981", "#f59e0b"];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip">
        <p className="text-xs text-white/50 mb-1">{label}</p>
        {payload.map((p: any, i: number) => (
          <p key={i} className="text-sm font-semibold" style={{ color: p.color }}>
            {p.name}: {p.name === "revenue" ? formatCurrency(p.value) : p.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function DashboardPage() {
  const { token } = useAuthStore();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchDashboard = async (refresh = false) => {
    if (refresh) setRefreshing(true);
    try {
      const res = await axios.get("/api/dashboard", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setData(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { fetchDashboard(); }, []);

  const stats = data?.stats;
  const chartData = data?.chartData || [];
  const recentBilties = data?.recentBilties || [];

  // Pie chart data for vehicle status
  const vehiclePieData = stats ? [
    { name: "Active", value: stats.activeVehicles },
    { name: "Others", value: stats.totalVehicles - stats.activeVehicles },
  ] : [];

  const biltyStatusData = stats ? [
    { name: "Active", value: stats.activeBilties },
    { name: "In Transit", value: stats.inTransitBilties },
    { name: "Delivered", value: stats.deliveredBilties },
  ] : [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex-between">
        <div>
          <h1 className="page-title flex items-center gap-2">
            Dashboard
            {data?.isSuperAdmin && (
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-brand-500/20 border border-brand-500/30 text-brand-400 uppercase tracking-wider animate-pulse">
                Super Admin
              </span>
            )}
          </h1>
          <p className="page-subtitle">
            {data?.isSuperAdmin 
              ? "System-wide metrics, revenue, and usage logs across all registered companies" 
              : "Real-time overview of your transport operations"}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => fetchDashboard(true)}
            className={`btn-icon ${refreshing ? "animate-spin" : ""}`}
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <Link href="/bilty/create" className="btn-primary">
            <Plus className="w-4 h-4" /> New Bilty
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => <StatCardSkeleton key={i} />)
        ) : (
          <>
            <StatCard
              title="Total Bilties"
              value={stats?.totalBilties ?? 0}
              trend={stats?.biltyGrowth}
              trendLabel="vs last month"
              icon={<FileText className="w-5 h-5 text-brand-400" />}
              gradient="bg-brand-500/15"
              delay={0}
            />
            {data?.isSuperAdmin ? (
              <>
                <StatCard
                  title="Total Companies"
                  value={stats?.totalCompanies ?? 0}
                  subtitle="System partners"
                  icon={<Layers className="w-5 h-5 text-cyan-400" />}
                  gradient="bg-cyan-500/15"
                  delay={0.05}
                />
                <StatCard
                  title="Total Active Users"
                  value={stats?.totalUsers ?? 0}
                  subtitle="All accounts"
                  icon={<Users className="w-5 h-5 text-purple-400" />}
                  gradient="bg-purple-500/15"
                  delay={0.1}
                />
              </>
            ) : (
              <>
                <StatCard
                  title="Active Trips"
                  value={stats?.activeBilties ?? 0}
                  subtitle={`${stats?.inTransitBilties ?? 0} in transit`}
                  icon={<Activity className="w-5 h-5 text-cyan-400" />}
                  gradient="bg-cyan-500/15"
                  delay={0.05}
                />
                <StatCard
                  title="Total Vehicles"
                  value={stats?.totalVehicles ?? 0}
                  subtitle={`${stats?.vehicleUtilization ?? 0}% utilization`}
                  icon={<Truck className="w-5 h-5 text-purple-400" />}
                  gradient="bg-purple-500/15"
                  delay={0.1}
                />
              </>
            )}
            <StatCard
              title="Pending Invoices"
              value={stats?.pendingInvoices ?? 0}
              icon={<Clock className="w-5 h-5 text-amber-400" />}
              gradient="bg-amber-500/15"
              delay={0.15}
            />
            <StatCard
              title="Monthly Revenue"
              value={formatCurrency(stats?.monthlyRevenue ?? 0)}
              trend={stats?.revenueGrowth}
              trendLabel="vs last month"
              icon={<TrendingUp className="w-5 h-5 text-emerald-400" />}
              gradient="bg-emerald-500/15"
              delay={0.2}
            />
            <StatCard
              title="Total Revenue"
              value={formatCurrency(stats?.totalRevenue ?? 0)}
              subtitle="All time"
              icon={<Receipt className="w-5 h-5 text-pink-400" />}
              gradient="bg-pink-500/15"
              delay={0.25}
            />
          </>
        )}
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Revenue Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card p-5 lg:col-span-2"
        >
          <div className="flex-between mb-5">
            <div>
              <h3 className="font-semibold text-white">Revenue & Bilties</h3>
              <p className="text-xs text-muted mt-0.5">Last 6 months performance</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1.5 text-xs text-white/40">
                <span className="w-2 h-2 rounded-full bg-brand-500" />Revenue
              </span>
              <span className="flex items-center gap-1.5 text-xs text-white/40">
                <span className="w-2 h-2 rounded-full bg-purple-500" />Bilties
              </span>
            </div>
          </div>
          {loading ? (
            <div className="shimmer h-48 rounded-xl" />
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={chartData} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
                <defs>
                  <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="biltyGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="revenue" name="revenue" stroke="#3b82f6" fill="url(#revGrad)" strokeWidth={2} />
                <Area type="monotone" dataKey="bilties" name="bilties" stroke="#8b5cf6" fill="url(#biltyGrad)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </motion.div>

        {/* Vehicle Utilization Pie */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="glass-card p-5"
        >
          <div className="mb-4">
            <h3 className="font-semibold text-white">Fleet Status</h3>
            <p className="text-xs text-muted mt-0.5">Vehicle utilization</p>
          </div>
          {loading ? (
            <div className="shimmer h-40 rounded-xl" />
          ) : (
            <div className="flex flex-col items-center">
              <ResponsiveContainer width="100%" height={160}>
                <PieChart>
                  <Pie
                    data={vehiclePieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={70}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {vehiclePieData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="text-center -mt-2">
                <div className="text-2xl font-bold gradient-text">{stats?.vehicleUtilization ?? 0}%</div>
                <div className="text-xs text-muted">Fleet Active</div>
              </div>
              <div className="flex gap-3 mt-3">
                {vehiclePieData.map((entry, i) => (
                  <div key={entry.name} className="flex items-center gap-1.5 text-xs text-white/40">
                    <span className="w-2 h-2 rounded-full" style={{ background: COLORS[i] }} />
                    {entry.name}: {entry.value}
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Monthly Bilty Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-card p-5"
        >
          <div className="mb-4">
            <h3 className="font-semibold text-white">Monthly Bilty Trend</h3>
            <p className="text-xs text-muted mt-0.5">LR count by month</p>
          </div>
          {loading ? <div className="shimmer h-48 rounded-xl" /> : (
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={chartData} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="bilties" name="bilties" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </motion.div>

        {/* Bilty Status Donut */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="glass-card p-5"
        >
          <div className="mb-4">
            <h3 className="font-semibold text-white">Bilty Status Breakdown</h3>
            <p className="text-xs text-muted mt-0.5">Current bilty states</p>
          </div>
          {loading ? <div className="shimmer h-48 rounded-xl" /> : (
            <div className="flex items-center gap-6">
              <ResponsiveContainer width="50%" height={180}>
                <PieChart>
                  <Pie data={biltyStatusData} cx="50%" cy="50%" innerRadius={45} outerRadius={65} paddingAngle={3} dataKey="value">
                    {biltyStatusData.map((_, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-3">
                {biltyStatusData.map((entry, i) => (
                  <div key={entry.name} className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-sm" style={{ background: COLORS[i] }} />
                    <div>
                      <div className="text-xs text-white/50">{entry.name}</div>
                      <div className="text-sm font-semibold text-white">{entry.value}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Recent Bilties */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass-card p-5 lg:col-span-2"
        >
          <div className="flex-between mb-4">
            <div>
              <h3 className="font-semibold text-white">Recent Bilties</h3>
              <p className="text-xs text-muted mt-0.5">Latest LR entries</p>
            </div>
            <Link href="/bilty" className="text-xs text-brand-400 hover:text-brand-300 flex items-center gap-1">
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="shimmer h-14 rounded-xl" />
              ))}
            </div>
          ) : recentBilties.length === 0 ? (
            <div className="flex flex-col items-center py-10 text-white/30 gap-2">
              <FileText className="w-8 h-8" />
              <p className="text-sm">No bilties yet. <Link href="/bilty/create" className="text-brand-400">Create one</Link></p>
            </div>
          ) : (
            <div className="space-y-2">
              {recentBilties.map((bilty: any) => (
                <Link key={bilty.id} href={`/bilty/${bilty.id}`}>
                  <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors cursor-pointer border border-transparent hover:border-white/10">
                    <div className="w-8 h-8 rounded-lg bg-brand-500/10 border border-brand-500/20 flex-center flex-shrink-0">
                      <FileText className="w-4 h-4 text-brand-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-white">{bilty.lrNumber}</span>
                        <span className={`badge text-xs ${getStatusColor(bilty.status)}`}>{bilty.status.replace("_", " ")}</span>
                      </div>
                      <div className="text-xs text-muted truncate">
                        {bilty.fromCity} → {bilty.toCity} • {bilty.vehicle?.vehicleNumber}
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="text-sm font-semibold text-white">{formatCurrency(bilty.totalAmount)}</div>
                      <div className="text-xs text-muted">{formatDate(bilty.createdAt)}</div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55 }}
          className="glass-card p-5"
        >
          <h3 className="font-semibold text-white mb-4">Quick Actions</h3>
          <div className="space-y-2">
            {[
              { href: "/bilty/create", icon: FileText, label: "Create Bilty", color: "text-brand-400", bg: "bg-brand-500/10" },
              { href: "/invoices/create", icon: Receipt, label: "New Invoice", color: "text-purple-400", bg: "bg-purple-500/10" },
              { href: "/masters/vehicles", icon: Truck, label: "Add Vehicle", color: "text-cyan-400", bg: "bg-cyan-500/10" },
              { href: "/masters/parties", icon: Activity, label: "Add Party", color: "text-emerald-400", bg: "bg-emerald-500/10" },
              { href: "/reports", icon: BarChart2, label: "View Reports", color: "text-amber-400", bg: "bg-amber-500/10" },
              { href: "/accounting", icon: TrendingUp, label: "Accounting", color: "text-pink-400", bg: "bg-pink-500/10" },
            ].map(({ href, icon: Icon, label, color, bg }) => (
              <Link key={href} href={href}>
                <div className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/5 transition-all group cursor-pointer">
                  <div className={`w-8 h-8 rounded-lg ${bg} flex-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                    <Icon className={`w-4 h-4 ${color}`} />
                  </div>
                  <span className="text-sm text-white/60 group-hover:text-white/90 transition-colors">{label}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-white/20 ml-auto group-hover:text-white/40 group-hover:translate-x-0.5 transition-all" />
                </div>
              </Link>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
