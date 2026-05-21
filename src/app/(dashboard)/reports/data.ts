import { BarChart2, FileText, Truck, Users, Receipt, MapPin } from "lucide-react";

export const REPORT_TYPES = [
  { id: "bilty", label: "Bilty Report", icon: FileText, color: "text-brand-400", bg: "bg-brand-500/10" },
  { id: "bilty-summary", label: "Bilty Summary", icon: FileText, color: "text-blue-400", bg: "bg-blue-500/10" },
  { id: "vehicle", label: "Vehicle Utilization", icon: Truck, color: "text-purple-400", bg: "bg-purple-500/10" },
  { id: "customer", label: "Customer Report", icon: Users, color: "text-cyan-400", bg: "bg-cyan-500/10" },
  { id: "invoice", label: "Invoice Report", icon: Receipt, color: "text-emerald-400", bg: "bg-emerald-500/10" },
  { id: "payment", label: "Payment History", icon: Receipt, color: "text-amber-400", bg: "bg-amber-500/10" },
  { id: "route", label: "Route Report", icon: MapPin, color: "text-pink-400", bg: "bg-pink-500/10" },
  { id: "profit-loss", label: "Profit & Loss", icon: BarChart2, color: "text-red-400", bg: "bg-red-500/10" },
  { id: "consigner", label: "Consigner Report", icon: Users, color: "text-indigo-400", bg: "bg-indigo-500/10" },
  { id: "consignee", label: "Consignee Report", icon: Users, color: "text-violet-400", bg: "bg-violet-500/10" },
  { id: "truck-wise", label: "Truck Wise Report", icon: Truck, color: "text-sky-400", bg: "bg-sky-500/10" },
  { id: "trip-wise", label: "Trip Wise Report", icon: MapPin, color: "text-teal-400", bg: "bg-teal-500/10" },
];

export const mockBiltyData = [
  { lrNumber: "LR2400001", fromCity: "Delhi", toCity: "Mumbai", vehicle: "MH01AB1234", party: "Acme Corp", freight: 15000, status: "DELIVERED", date: "2024-05-01" },
  { lrNumber: "LR2400002", fromCity: "Pune", toCity: "Chennai", vehicle: "TN05CD5678", party: "Star Ltd", freight: 22000, status: "IN_TRANSIT", date: "2024-05-03" },
  { lrNumber: "LR2400003", fromCity: "Bangalore", toCity: "Hyderabad", vehicle: "KA12EF9012", party: "Fast Move", freight: 8500, status: "ACTIVE", date: "2024-05-05" },
  { lrNumber: "LR2400004", fromCity: "Kolkata", toCity: "Delhi", vehicle: "DL01GH3456", party: "Quick Ship", freight: 31000, status: "INVOICED", date: "2024-05-07" },
  { lrNumber: "LR2400005", fromCity: "Mumbai", toCity: "Pune", vehicle: "MH04IJ7890", party: "Rapid Cargo", freight: 4500, status: "DELIVERED", date: "2024-05-10" },
];
