"use client";

import { useState } from "react";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { cn } from "@/lib/utils";

export function AppShell({ children }: { children: React.ReactNode }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-dark-900">
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />
      <Topbar
        onMenuClick={() => setMobileOpen(true)}
        sidebarCollapsed={sidebarCollapsed}
      />
      <main
        className={cn(
          "min-h-screen pt-16 transition-[padding] duration-200 pl-0",
          sidebarCollapsed ? "lg:pl-[64px]" : "lg:pl-[260px]"
        )}
      >
        <div className="p-4 lg:p-6">{children}</div>
      </main>
    </div>
  );
}
