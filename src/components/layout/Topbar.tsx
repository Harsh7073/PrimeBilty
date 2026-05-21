"use client";

import { Bell, Search, Menu, Command, ChevronRight } from "lucide-react";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthStore } from "@/store/authStore";
import Link from "next/link";

const breadcrumbMap: Record<string, string> = {
  dashboard: "Dashboard",
  bilty: "Bilty (LR)",
  invoices: "Invoices",
  vehicles: "Vehicles",
  parties: "Parties",
  accounting: "Accounting",
  reports: "Reports",
  settings: "Settings",
  subscription: "Subscription",
  support: "Support",
  admin: "Administration",
  users: "Users",
  roles: "Roles",
  companies: "Companies",
  branches: "Branches",
  masters: "Masters",
  "vehicle-types": "Vehicle Types",
  units: "Units",
  ledgers: "Ledgers",
  "collection-memo": "Collection Memo",
  "hiring-settlement": "Hiring Settlement",
  "load-advice": "Load Advice",
};

interface TopbarProps {
  onMenuClick: () => void;
  sidebarCollapsed: boolean;
}

export function Topbar({ onMenuClick, sidebarCollapsed }: TopbarProps) {
  const pathname = usePathname();
  const { user } = useAuthStore();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchVal, setSearchVal] = useState("");
  const [notifOpen, setNotifOpen] = useState(false);

  const crumbs = pathname.split("/").filter(Boolean);

  const mockNotifications = [
    { id: "1", title: "New bilty created", message: "LR2024001 from Delhi to Mumbai", time: "2 min ago", read: false },
    { id: "2", title: "Invoice due", message: "INV2024055 due in 3 days", time: "1 hr ago", read: false },
    { id: "3", title: "Vehicle insurance expiring", message: "MH12AB1234 expires in 7 days", time: "3 hr ago", read: true },
  ];

  return (
    <header
      className="fixed top-0 right-0 z-20 h-16 border-b border-white/10 bg-dark-900/80 backdrop-blur-md flex items-center px-4 gap-3"
      style={{ left: sidebarCollapsed ? 64 : 260, transition: "left 0.2s ease" }}
    >
      {/* Mobile menu */}
      <button onClick={onMenuClick} className="btn-icon lg:hidden">
        <Menu className="w-4 h-4" />
      </button>

      {/* Breadcrumb */}
      <nav className="hidden sm:flex items-center gap-1.5 text-sm flex-1">
        <Link href="/dashboard" className="text-white/30 hover:text-white/60 transition-colors">Home</Link>
        {crumbs.map((crumb, i) => (
          <span key={crumb} className="flex items-center gap-1.5">
            <ChevronRight className="w-3.5 h-3.5 text-white/20" />
            <span className={i === crumbs.length - 1 ? "text-white/80 font-medium" : "text-white/40"}>
              {breadcrumbMap[crumb] || crumb}
            </span>
          </span>
        ))}
      </nav>

      <div className="flex items-center gap-2 ml-auto">
        {/* Search */}
        <div className="relative">
          <AnimatePresence>
            {searchOpen ? (
              <motion.div
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 240, opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                  <input
                    autoFocus
                    value={searchVal}
                    onChange={(e) => setSearchVal(e.target.value)}
                    onBlur={() => { setSearchOpen(false); setSearchVal(""); }}
                    placeholder="Search bilty, parties..."
                    className="input-base pl-9 py-1.5 text-sm h-9"
                  />
                </div>
              </motion.div>
            ) : (
              <button onClick={() => setSearchOpen(true)} className="btn-icon">
                <Search className="w-4 h-4" />
              </button>
            )}
          </AnimatePresence>
        </div>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            className="btn-icon relative"
          >
            <Bell className="w-4 h-4" />
            <span className="notif-dot" />
          </button>

          <AnimatePresence>
            {notifOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setNotifOpen(false)} />
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-10 z-20 glass-card w-80 p-0 overflow-hidden"
                >
                  <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between">
                    <span className="font-semibold text-sm text-white">Notifications</span>
                    <span className="badge badge-blue text-xs">2 new</span>
                  </div>
                  <div className="divide-y divide-white/5">
                    {mockNotifications.map((n) => (
                      <div key={n.id} className={`px-4 py-3 hover:bg-white/5 transition-colors cursor-pointer ${!n.read ? "bg-brand-500/5" : ""}`}>
                        <div className="flex items-start gap-3">
                          <div className={`mt-1.5 ${!n.read ? "status-dot-blue" : "status-dot-gray"} status-dot flex-shrink-0`} />
                          <div>
                            <div className="text-sm font-medium text-white/90">{n.title}</div>
                            <div className="text-xs text-white/40 mt-0.5">{n.message}</div>
                            <div className="text-xs text-white/25 mt-1">{n.time}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="px-4 py-2.5 border-t border-white/10">
                    <button className="text-xs text-brand-400 hover:text-brand-300 transition-colors">View all notifications</button>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

        {/* User Avatar */}
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-500 to-purple-600 flex-center text-xs font-bold cursor-pointer hover:ring-2 hover:ring-brand-500/40 transition-all">
          {user?.name?.charAt(0)?.toUpperCase() || "U"}
        </div>
      </div>
    </header>
  );
}
