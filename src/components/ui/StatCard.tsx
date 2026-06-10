"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: number;
  trendLabel?: string;
  icon: React.ReactNode;
  gradient?: string;
  delay?: number;
}

export function StatCard({ title, value, subtitle, trend, trendLabel, icon, gradient, delay = 0 }: StatCardProps) {
  const trendPositive = trend && trend > 0;
  const trendNegative = trend && trend < 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: "easeOut" }}
      className="stat-card group"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">{title}</p>
          <p className="text-2xl font-bold text-slate-800 mt-1 tracking-tight">{value}</p>
          {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
        </div>
        <div
          className={cn(
            "w-10 h-10 rounded-xl flex-center flex-shrink-0 transition-transform duration-300 group-hover:scale-110",
            gradient || "bg-brand-500/10"
          )}
        >
          {icon}
        </div>
      </div>

      {trend !== undefined && (
        <div className="flex items-center gap-1.5 mt-1">
          <div className={cn(
            "flex items-center gap-1 text-xs font-semibold px-1.5 py-0.5 rounded-md",
            trendPositive ? "text-brand-500 bg-brand-50" : trendNegative ? "text-purple-500 bg-purple-50" : "text-slate-400 bg-slate-100"
          )}>
            {trendPositive ? <TrendingUp className="w-3 h-3" /> : trendNegative ? <TrendingDown className="w-3 h-3" /> : <Minus className="w-3 h-3" />}
            {Math.abs(trend)}%
          </div>
          {trendLabel && <span className="text-xs text-slate-400">{trendLabel}</span>}
        </div>
      )}
    </motion.div>
  );
}

// Loading skeleton
export function StatCardSkeleton() {
  return (
    <div className="stat-card">
      <div className="flex items-start justify-between">
        <div className="space-y-2 flex-1">
          <div className="shimmer h-3 w-20 rounded" />
          <div className="shimmer h-7 w-32 rounded" />
          <div className="shimmer h-3 w-16 rounded" />
        </div>
        <div className="shimmer w-10 h-10 rounded-xl" />
      </div>
      <div className="shimmer h-5 w-24 rounded mt-1" />
    </div>
  );
}
