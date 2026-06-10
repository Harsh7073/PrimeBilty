"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard, Truck, FileText, Receipt, Users, Building2,
  BarChart3, Settings, ChevronDown, ChevronRight, Package,
  BookOpen, Wallet, CreditCard, HelpCircle, GitBranch,
  Layers, Map, TrendingUp, Shield, Bell, ClipboardList,
  UserCheck, X, Menu, Zap, LogOut, Printer
} from "lucide-react";
import { useState } from "react";
import { useAuthStore } from "@/store/authStore";

const navGroups = [
  {
    label: "Overview",
    items: [
      { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    ],
  },
  {
    label: "Operations",
    items: [
      { href: "/bilty", icon: FileText, label: "Bilty (LR)", badge: "Core" },
      { href: "/invoices", icon: Receipt, label: "Invoices" },
      { href: "/collection-memo", icon: Wallet, label: "Collection Memo" },
      { href: "/hiring-settlement", icon: UserCheck, label: "Hiring Settlement" },
      { href: "/load-advice", icon: ClipboardList, label: "Load Advice" },
    ],
  },
  {
    label: "Masters",
    items: [
      { href: "/masters/vehicles", icon: Truck, label: "Vehicles" },
      { href: "/masters/parties", icon: Users, label: "Parties" },
      { href: "/masters/vehicle-types", icon: Layers, label: "Vehicle Types" },
      { href: "/masters/units", icon: Package, label: "Units" },
      { href: "/masters/ledgers", icon: BookOpen, label: "Ledgers" },
    ],
  },
  {
    label: "Finance",
    items: [
      { href: "/accounting", icon: TrendingUp, label: "Accounting" },
      { href: "/reports", icon: BarChart3, label: "Reports" },
    ],
  },
  {
    label: "Administration",
    items: [
      { href: "/admin/users", icon: Users, label: "Users" },
      { href: "/admin/roles", icon: Shield, label: "Roles" },
      { href: "/admin/companies", icon: Building2, label: "Companies" },
      { href: "/admin/branches", icon: GitBranch, label: "Branches" },
      { href: "/admin/print-templates", icon: Printer, label: "Print Designer" },
    ],
  },
  {
    label: "Account",
    items: [
      { href: "/subscription", icon: CreditCard, label: "Subscription" },
      { href: "/support", icon: HelpCircle, label: "Support" },
      { href: "/settings", icon: Settings, label: "Settings" },
    ],
  },
];

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
}

export function Sidebar({ collapsed, onToggle, mobileOpen, onMobileClose }: SidebarProps) {
  const pathname = usePathname();
  const { user, logout } = useAuthStore();

  const isActive = (href: string) => {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-slate-200">
        <div className="w-8 h-8 flex items-center justify-center flex-shrink-0">
          <img src="/logo.png" alt="PrimeBilty Logo" className="w-8 h-8 object-contain" />
        </div>
        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: "auto" }}
              exit={{ opacity: 0, width: 0 }}
              className="overflow-hidden"
            >
              <span className="font-bold text-brand-500 text-base whitespace-nowrap">Prime<span className="text-purple-500">Bilty</span></span>
              <div className="text-[10px] text-slate-400 font-medium -mt-0.5">Enterprise TMS</div>
            </motion.div>
          )}
        </AnimatePresence>
        <button
          onClick={onToggle}
          className="ml-auto btn-icon hidden lg:flex"
          aria-label="Toggle sidebar"
        >
          <Menu className="w-4 h-4" />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 scroll-area">
        {navGroups.map((group) => (
          <div key={group.label} className="mb-4">
            {!collapsed && (
              <div className="sidebar-section-label">{group.label}</div>
            )}
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const active = isActive(item.href);
                return (
                  <Link key={item.href} href={item.href} onClick={onMobileClose}>
                    <div className={cn("sidebar-link", active && "active")} title={collapsed ? item.label : undefined}>
                      <item.icon className={cn("w-4 h-4 flex-shrink-0 sidebar-icon", active ? "text-brand-500" : "text-slate-400")} />
                      <AnimatePresence>
                        {!collapsed && (
                          <motion.span
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex-1 whitespace-nowrap"
                          >
                            {item.label}
                          </motion.span>
                        )}
                      </AnimatePresence>
                      {!collapsed && (item as any).badge && (
                        <span className="badge badge-blue text-[10px] px-1.5 py-0 h-4">{(item as any).badge}</span>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* User Footer */}
      <div className="border-t border-slate-200 p-3">
        <div className={cn("flex items-center gap-3 px-2 py-2 rounded-xl", !collapsed && "")}>
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-500 to-purple-500 flex-center flex-shrink-0 text-xs font-bold text-white">
            {user?.name?.charAt(0)?.toUpperCase() || "U"}
          </div>
          <AnimatePresence>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 overflow-hidden"
              >
                <div className="text-sm font-medium text-slate-800 truncate">{user?.name}</div>
                <div className="text-xs text-slate-400 truncate">{user?.roleName}</div>
              </motion.div>
            )}
          </AnimatePresence>
          {!collapsed && (
            <button
              onClick={logout}
              className="btn-icon flex-shrink-0"
              title="Logout"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Designer Credit */}
      <AnimatePresence>
        {!collapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="px-4 pb-3 text-center"
          >
            <p className="text-[10px] text-slate-400 leading-tight">
              Designed &amp; Built by{" "}
              <span className="font-semibold bg-gradient-to-r from-brand-500 to-purple-500 bg-clip-text text-transparent">
                Harsh Suthar
              </span>
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <motion.aside
        animate={{ width: collapsed ? 64 : 260 }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
        className="hidden lg:flex flex-col fixed left-0 top-0 h-screen z-30 border-r border-slate-200 bg-dark-900 overflow-hidden"
        style={{ boxShadow: "1px 0 10px rgba(15, 23, 42, 0.04)" }}
      >
        <SidebarContent />
      </motion.aside>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="lg:hidden fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
              onClick={onMobileClose}
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="lg:hidden fixed left-0 top-0 h-screen w-64 z-50 border-r border-slate-200 bg-dark-900"
            >
              <button
                onClick={onMobileClose}
                className="absolute top-4 right-3 btn-icon"
              >
                <X className="w-4 h-4" />
              </button>
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
