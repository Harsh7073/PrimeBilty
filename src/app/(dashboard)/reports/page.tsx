import { BarChart2 } from "lucide-react";
import Link from "next/link";
import { REPORT_TYPES } from "./data";

export default function ReportsHubPage() {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="page-title flex items-center gap-2">
          <BarChart2 className="w-5 h-5 text-amber-400" />
          Reports
        </h1>
        <p className="page-subtitle">Select a report module to view details and export data</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
        {REPORT_TYPES.map((report) => (
          <Link
            href={`/reports/${report.id}`}
            key={report.id}
            className="flex flex-col items-center gap-2 p-4 rounded-xl border border-white/10 bg-white/5 hover:border-brand-500/30 hover:bg-white/10 text-center transition-all group"
          >
            <div className={`w-10 h-10 rounded-xl ${report.bg} flex-center group-hover:scale-110 transition-transform`}>
              <report.icon className={`w-5 h-5 ${report.color}`} />
            </div>
            <span className="text-sm font-medium leading-tight text-white/70 group-hover:text-white mt-1">
              {report.label}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
