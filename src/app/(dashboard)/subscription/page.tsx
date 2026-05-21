"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Zap, Crown, Star, Shield, Building2, CreditCard, History } from "lucide-react";

const PLANS = [
  {
    id: "starter", name: "Starter", icon: Zap, price: 999, yearlyPrice: 9990,
    description: "Perfect for small transport businesses",
    color: "brand", gradient: "from-blue-500/20 to-blue-600/10",
    features: ["Up to 10 Vehicles", "2 User Accounts", "Bilty Management", "Basic Reports", "Email Support"],
    maxVehicles: 10, maxUsers: 2,
  },
  {
    id: "standard", name: "Standard", icon: Star, price: 1999, yearlyPrice: 19990,
    description: "Ideal for growing fleet operators",
    color: "purple", gradient: "from-purple-500/20 to-purple-600/10",
    features: ["Up to 50 Vehicles", "5 User Accounts", "All Modules", "Advanced Reports", "Invoice Module", "Priority Support"],
    maxVehicles: 50, maxUsers: 5, popular: true,
  },
  {
    id: "advanced", name: "Advanced", icon: Crown, price: 3999, yearlyPrice: 39990,
    description: "For established transport companies",
    color: "amber", gradient: "from-amber-500/20 to-amber-600/10",
    features: ["Up to 200 Vehicles", "15 User Accounts", "Multi-Branch", "Custom Reports", "API Access", "WhatsApp Integration", "Dedicated Support"],
    maxVehicles: 200, maxUsers: 15,
  },
  {
    id: "enterprise", name: "Enterprise", icon: Building2, price: 9999, yearlyPrice: 99990,
    description: "Built for large logistics operations",
    color: "emerald", gradient: "from-emerald-500/20 to-emerald-600/10",
    features: ["Unlimited Vehicles", "Unlimited Users", "Unlimited Branches", "Custom Development", "SLA", "Dedicated Account Manager", "On-boarding Support"],
    maxVehicles: 9999, maxUsers: 999,
  },
];

const COLOR_MAP: Record<string, { badge: string, glow: string, border: string, bg: string }> = {
  brand: { badge: "badge-blue", glow: "glow-card-blue", border: "border-brand-500/30", bg: "bg-brand-500" },
  purple: { badge: "badge-purple", glow: "glow-card-purple", border: "border-purple-500/30", bg: "bg-purple-500" },
  amber: { badge: "badge-yellow", glow: "", border: "border-amber-500/30", bg: "bg-amber-500" },
  emerald: { badge: "badge-green", glow: "", border: "border-emerald-500/30", bg: "bg-emerald-500" },
};

export default function SubscriptionPage() {
  const [annual, setAnnual] = useState(false);
  const [currentPlan] = useState("standard");
  const [tab, setTab] = useState<"plans" | "history" | "billing">("plans");

  return (
    <div className="space-y-6">
      <div className="flex-between">
        <div>
          <h1 className="page-title flex items-center gap-2"><CreditCard className="w-5 h-5 text-brand-400" />Subscription</h1>
          <p className="page-subtitle">Manage your TruckBilty plan and billing</p>
        </div>
      </div>

      {/* Current Plan Banner */}
      <div className="glass-card p-5 border border-brand-500/20" style={{ background: "linear-gradient(135deg, rgba(59,130,246,0.08) 0%, rgba(99,102,241,0.05) 100%)" }}>
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-brand-500/15 border border-brand-500/25 flex-center">
              <Star className="w-6 h-6 text-brand-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-white text-base">Standard Plan</h3>
                <span className="badge badge-blue">Active</span>
              </div>
              <p className="text-sm text-white/40 mt-0.5">Renews on June 19, 2025 • 50 vehicles, 5 users</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-lg font-bold text-white">₹1,999/mo</div>
              <div className="text-xs text-white/30">Billed monthly</div>
            </div>
            <button className="btn-primary">Upgrade Plan</button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-white/5 rounded-xl border border-white/10 w-fit">
        {[{ id: "plans", label: "Plans" }, { id: "history", label: "Invoice History" }, { id: "billing", label: "Billing Details" }].map((t) => (
          <button key={t.id} onClick={() => setTab(t.id as any)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${tab === t.id ? "bg-white/10 text-white" : "text-white/40 hover:text-white/60"}`}>
            {t.label}
          </button>
        ))}
      </div>

      {tab === "plans" && (
        <>
          {/* Annual Toggle */}
          <div className="flex items-center justify-center gap-3">
            <span className={`text-sm ${!annual ? "text-white" : "text-white/40"}`}>Monthly</span>
            <button
              onClick={() => setAnnual(!annual)}
              className={`w-12 h-6 rounded-full border transition-all ${annual ? "bg-brand-500 border-brand-400" : "bg-white/10 border-white/10"}`}
            >
              <div className={`w-4 h-4 rounded-full bg-white transition-transform mx-1 ${annual ? "translate-x-6" : "translate-x-0"}`} />
            </button>
            <span className={`text-sm ${annual ? "text-white" : "text-white/40"}`}>Annual</span>
            {annual && <span className="badge badge-green text-xs">Save 20%</span>}
          </div>

          {/* Plan Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {PLANS.map((plan) => {
              const colors = COLOR_MAP[plan.color];
              const isCurrentPlan = plan.id === currentPlan;
              const displayPrice = annual ? Math.round(plan.yearlyPrice / 12) : plan.price;

              return (
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`glass-card p-5 relative flex flex-col ${isCurrentPlan ? `border ${colors.border}` : ""} ${(plan as any).popular ? "ring-1 ring-purple-500/30" : ""}`}
                >
                  {(plan as any).popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="badge badge-purple text-xs px-3 py-1">Most Popular</span>
                    </div>
                  )}
                  {isCurrentPlan && (
                    <div className="absolute top-3 right-3">
                      <span className="badge badge-green text-[10px]">Current</span>
                    </div>
                  )}

                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${plan.gradient} border border-white/10 flex-center`}>
                      <plan.icon className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">{plan.name}</h3>
                      <p className="text-[11px] text-white/35">{plan.description}</p>
                    </div>
                  </div>

                  <div className="mb-5">
                    <div className="flex items-end gap-1">
                      <span className="text-2xl font-bold text-white">₹{displayPrice.toLocaleString("en-IN")}</span>
                      <span className="text-white/30 text-sm mb-1">/mo</span>
                    </div>
                    {annual && <div className="text-xs text-emerald-400 mt-0.5">Billed ₹{plan.yearlyPrice.toLocaleString("en-IN")}/yr</div>}
                  </div>

                  <div className="space-y-2 flex-1">
                    {plan.features.map((feat) => (
                      <div key={feat} className="flex items-start gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                        <span className="text-xs text-white/55">{feat}</span>
                      </div>
                    ))}
                  </div>

                  <button
                    className={`mt-5 w-full py-2.5 rounded-xl text-sm font-medium transition-all ${
                      isCurrentPlan
                        ? "bg-white/5 text-white/40 border border-white/10 cursor-default"
                        : "btn-primary"
                    }`}
                    disabled={isCurrentPlan}
                  >
                    {isCurrentPlan ? "Current Plan" : plan.price > 1999 ? "Upgrade" : "Downgrade"}
                  </button>
                </motion.div>
              );
            })}
          </div>

          {/* Add-ons */}
          <div className="glass-card p-5">
            <h3 className="font-semibold text-white mb-4">Add-ons</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { name: "Extra GST API Calls", desc: "1000 additional calls/month", price: "₹299/mo" },
                { name: "WhatsApp Notifications", desc: "10K messages/month", price: "₹499/mo" },
                { name: "Extra Storage", desc: "100GB additional storage", price: "₹199/mo" },
              ].map(({ name, desc, price }) => (
                <div key={name} className="flex items-center justify-between p-3 rounded-xl border border-white/10 bg-white/5">
                  <div>
                    <div className="text-sm font-medium text-white">{name}</div>
                    <div className="text-xs text-white/35">{desc}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-brand-300">{price}</div>
                    <button className="text-xs text-brand-400 hover:text-brand-300 mt-0.5">Add</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {tab === "history" && (
        <div className="glass-card overflow-hidden">
          <div className="p-4 border-b border-white/10">
            <h3 className="font-semibold text-white">Invoice History</h3>
          </div>
          <table className="tb-table">
            <thead className="tb-thead">
              <tr>
                <th className="tb-th">Invoice</th>
                <th className="tb-th">Date</th>
                <th className="tb-th">Plan</th>
                <th className="tb-th">Amount</th>
                <th className="tb-th">Status</th>
                <th className="tb-th">Action</th>
              </tr>
            </thead>
            <tbody>
              {[
                { inv: "SUB-2024-005", date: "May 1, 2024", plan: "Standard", amount: "₹1,999", status: "PAID" },
                { inv: "SUB-2024-004", date: "Apr 1, 2024", plan: "Standard", amount: "₹1,999", status: "PAID" },
                { inv: "SUB-2024-003", date: "Mar 1, 2024", plan: "Starter", amount: "₹999", status: "PAID" },
              ].map((row) => (
                <tr key={row.inv} className="tb-tr">
                  <td className="tb-td font-mono text-sm text-brand-400">{row.inv}</td>
                  <td className="tb-td text-white/60">{row.date}</td>
                  <td className="tb-td"><span className="badge badge-blue">{row.plan}</span></td>
                  <td className="tb-td font-semibold text-white">{row.amount}</td>
                  <td className="tb-td"><span className="badge badge-green">{row.status}</span></td>
                  <td className="tb-td"><button className="text-xs text-brand-400 hover:text-brand-300">Download PDF</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
