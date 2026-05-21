import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, currency = "INR"): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(date: string | Date, format = "dd MMM yyyy"): string {
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, "0");
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const month = months[d.getMonth()];
  const year = d.getFullYear();
  return `${day} ${month} ${year}`;
}

export function formatDateTime(date: string | Date): string {
  const d = new Date(date);
  return d.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function generateLRNumber(): string {
  const prefix = "LR";
  const year = new Date().getFullYear().toString().slice(-2);
  const random = Math.floor(Math.random() * 900000) + 100000;
  return `${prefix}${year}${random}`;
}

export function getStatusColor(status: string): string {
  const map: Record<string, string> = {
    ACTIVE: "badge-blue",
    "IN_TRANSIT": "badge-yellow",
    DELIVERED: "badge-green",
    INVOICED: "badge-purple",
    CANCELLED: "badge-red",
    PENDING: "badge-yellow",
    PAID: "badge-green",
    UNPAID: "badge-red",
    PARTIAL: "badge-yellow",
    OPEN: "badge-blue",
    CLOSED: "badge-green",
    PLANNED: "badge-gray",
    COMPLETED: "badge-green",
  };
  return map[status] ?? "badge-gray";
}

export function getStatusDot(status: string): string {
  const map: Record<string, string> = {
    ACTIVE: "status-dot-green",
    "IN_TRANSIT": "status-dot-yellow",
    DELIVERED: "status-dot-green",
    CANCELLED: "status-dot-red",
    PENDING: "status-dot-yellow",
    PAID: "status-dot-green",
    UNPAID: "status-dot-red",
    OPEN: "status-dot-blue",
  };
  return map[status] ?? "status-dot-gray";
}

export function truncate(str: string, n: number): string {
  return str.length > n ? str.slice(0, n) + "..." : str;
}

export function slugify(str: string): string {
  return str.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]/g, "");
}

export function calculateGST(
  amount: number,
  gstRate: number,
  sameState = true
): { cgst: number; sgst: number; igst: number; total: number } {
  if (sameState) {
    const half = (amount * gstRate) / 200;
    return { cgst: half, sgst: half, igst: 0, total: half * 2 };
  }
  const igst = (amount * gstRate) / 100;
  return { cgst: 0, sgst: 0, igst, total: igst };
}

export function percentChange(current: number, previous: number): number {
  if (previous === 0) return 0;
  return Math.round(((current - previous) / previous) * 100);
}
