"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, Receipt, Truck, Plus, Check, Download, Share2, Eye } from "lucide-react";

export default function InteractiveShowcase() {
  const [activeTab, setActiveTab] = useState<"bilty" | "invoice" | "fleet">("bilty");

  const tabs = [
    { id: "bilty", label: "Bilty (LR) Generator", icon: FileText, desc: "Create, format, and share transport bilties in seconds. Fully compliant and customizable." },
    { id: "invoice", label: "GST Billing & Invoices", icon: Receipt, desc: "Generate professional invoices directly from your loading slips and bilties with automatically calculated GST." },
    { id: "fleet", label: "Fleet & Driver Tracking", icon: Truck, desc: "Manage your vehicles, log statuses, track maintenance, and handle driver assignments efficiently." },
  ];

  return (
    <div className="w-full">
      {/* Tab Switchers */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`text-left p-5 rounded-2xl border transition-all duration-300 ${
                isActive
                  ? "bg-brand-500/10 border-brand-500/30 shadow-lg shadow-brand-500/5"
                  : "bg-white/2 border-white/5 hover:border-white/10 hover:bg-white/3"
              }`}
            >
              <div className="flex items-center gap-3 mb-2">
                <div
                  className={`w-10 h-10 rounded-xl flex-center ${
                    isActive ? "bg-brand-500 text-white" : "bg-white/5 text-white/40"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className={`font-semibold text-sm ${isActive ? "text-white" : "text-white/60"}`}>
                  {tab.label}
                </h3>
              </div>
              <p className="text-xs text-white/40 leading-relaxed">{tab.desc}</p>
            </button>
          );
        })}
      </div>

      {/* Screen Frame Mockup */}
      <div className="relative glass-card rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
        {/* Mockup Header/Controls */}
        <div className="bg-dark-950/60 px-5 py-3.5 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-500/40" />
            <span className="w-3 h-3 rounded-full bg-amber-500/40" />
            <span className="w-3 h-3 rounded-full bg-green-500/40" />
            <span className="text-[11px] text-white/30 font-mono ml-3 bg-white/3 px-3 py-1 rounded border border-white/5">
              app.truckbilty.com/dashboard/{activeTab}
            </span>
          </div>
          <div className="flex gap-2">
            <div className="w-16 h-2 rounded-full bg-white/10" />
            <div className="w-8 h-2 rounded-full bg-white/10" />
          </div>
        </div>

        {/* Mockup Body Content with Animations */}
        <div className="p-6 md:p-8 bg-dark-900/50 min-h-[380px] flex items-center justify-center">
          <AnimatePresence mode="wait">
            {activeTab === "bilty" && (
              <motion.div
                key="bilty"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="w-full max-w-2xl bg-dark-950/80 border border-white/8 rounded-xl p-5 shadow-lg relative overflow-hidden"
              >
                {/* Visual grid watermark in background */}
                <div className="absolute inset-0 opacity-[0.02] bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

                {/* Bilty Form Simulation Header */}
                <div className="flex justify-between items-start border-b border-white/5 pb-4 mb-4">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider font-bold text-brand-400">Bilty #2026-0849</span>
                    <h4 className="text-base font-bold text-white mt-0.5">ABC Logistics Private Limited</h4>
                    <p className="text-[10px] text-white/30">Lorry Receipt / Consignment Note</p>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[9px] bg-green-500/10 border border-green-500/20 text-green-400 font-semibold uppercase tracking-wider">
                    Paid
                  </span>
                </div>

                {/* Simulated content fields */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-5">
                  <div className="bg-white/2 p-2.5 rounded-lg border border-white/3">
                    <p className="text-[9px] text-white/30">From (Source)</p>
                    <p className="text-xs font-semibold text-white mt-0.5">New Delhi</p>
                  </div>
                  <div className="bg-white/2 p-2.5 rounded-lg border border-white/3">
                    <p className="text-[9px] text-white/30">To (Destination)</p>
                    <p className="text-xs font-semibold text-white mt-0.5">Mumbai Port</p>
                  </div>
                  <div className="bg-white/2 p-2.5 rounded-lg border border-white/3">
                    <p className="text-[9px] text-white/30">Lorry Number</p>
                    <p className="text-xs font-semibold text-white mt-0.5">DL-01-GB-8204</p>
                  </div>
                  <div className="bg-white/2 p-2.5 rounded-lg border border-white/3">
                    <p className="text-[9px] text-white/30">Date</p>
                    <p className="text-xs font-semibold text-white mt-0.5">22 May 2026</p>
                  </div>
                </div>

                <div className="space-y-2 mb-5">
                  <div className="flex justify-between items-center text-[10px] text-white/30 border-b border-white/5 pb-1">
                    <span>Item / Cargo Description</span>
                    <div className="flex gap-12">
                      <span>Weight</span>
                      <span>Freight</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-medium text-white/80">Industrial Steel Coils (Grade-A)</span>
                    <div className="flex gap-8 font-semibold">
                      <span className="w-12 text-right">18.5 MT</span>
                      <span className="w-16 text-right text-brand-400">₹74,000</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-medium text-white/80">Machinery Spare Parts (Box #1-4)</span>
                    <div className="flex gap-8 font-semibold">
                      <span className="w-12 text-right">1.2 MT</span>
                      <span className="w-16 text-right text-brand-400">₹8,500</span>
                    </div>
                  </div>
                </div>

                <div className="border-t border-white/5 pt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex gap-4">
                    <div>
                      <p className="text-[9px] text-white/30">Consignor (Sender)</p>
                      <p className="text-xs font-semibold text-white">Tata Steel Ltd</p>
                    </div>
                    <div className="w-px h-6 bg-white/5" />
                    <div>
                      <p className="text-[9px] text-white/30">Consignee (Receiver)</p>
                      <p className="text-xs font-semibold text-white">Reliance Industries</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/8 hover:bg-white/10 hover:border-white/12 transition-colors text-[10px] font-semibold flex items-center gap-1.5">
                      <Download className="w-3.5 h-3.5" />
                      PDF
                    </button>
                    <button className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/8 hover:bg-white/10 hover:border-white/12 transition-colors text-[10px] font-semibold flex items-center gap-1.5">
                      <Share2 className="w-3.5 h-3.5" />
                      WhatsApp
                    </button>
                    <button className="px-3 py-1.5 rounded-lg bg-brand-500 hover:bg-brand-600 transition-colors text-[10px] font-semibold text-white flex items-center gap-1.5 shadow-md shadow-brand-500/10">
                      <Eye className="w-3.5 h-3.5" />
                      View Full
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "invoice" && (
              <motion.div
                key="invoice"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="w-full max-w-2xl bg-dark-950/80 border border-white/8 rounded-xl p-5 shadow-lg relative overflow-hidden"
              >
                {/* Background graphic */}
                <div className="absolute inset-0 opacity-[0.02] bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

                {/* Invoice Form Simulation Header */}
                <div className="flex justify-between items-start border-b border-white/5 pb-4 mb-4">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider font-bold text-purple-400">Tax Invoice</span>
                    <h4 className="text-base font-bold text-white mt-0.5">INV-2026-00482</h4>
                    <p className="text-[10px] text-white/30">GSTIN: 07AAAAA1111A1Z1</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[9px] text-white/30">Grand Total</p>
                    <p className="text-lg font-black text-purple-400">₹97,350</p>
                  </div>
                </div>

                {/* Main section */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div className="space-y-1.5">
                    <p className="text-[9px] text-white/30 uppercase tracking-wider">Bill To</p>
                    <p className="text-xs font-bold text-white">Adani Ports & SEZ Ltd</p>
                    <p className="text-[10px] text-white/40">Mundra, Kutch, Gujarat - 370421</p>
                    <p className="text-[10px] text-white/40">GSTIN: 24AAACA2222B2Z2</p>
                  </div>
                  <div className="bg-white/2 p-3 rounded-lg border border-white/3 flex flex-col justify-between">
                    <div className="flex justify-between text-[10px]">
                      <span className="text-white/40">Basic Amount:</span>
                      <span className="font-semibold text-white">₹82,500</span>
                    </div>
                    <div className="flex justify-between text-[10px] mt-1">
                      <span className="text-white/40">CGST (9%):</span>
                      <span className="font-semibold text-white">₹7,425</span>
                    </div>
                    <div className="flex justify-between text-[10px] mt-1">
                      <span className="text-white/40">SGST (9%):</span>
                      <span className="font-semibold text-white">₹7,425</span>
                    </div>
                    <div className="border-t border-white/5 mt-2 pt-2 flex justify-between text-xs font-bold">
                      <span className="text-purple-300">Total Taxable Amount:</span>
                      <span className="text-white">₹97,350</span>
                    </div>
                  </div>
                </div>

                {/* Details Table */}
                <div className="bg-white/1 border border-white/4 rounded-lg overflow-hidden mb-4 text-[10px]">
                  <div className="bg-white/2 px-3 py-1.5 border-b border-white/4 grid grid-cols-12 text-white/30">
                    <span className="col-span-5">LR No. & Date</span>
                    <span className="col-span-3 text-right">Lorry No.</span>
                    <span className="col-span-2 text-right">Basic</span>
                    <span className="col-span-2 text-right">Total GST</span>
                  </div>
                  <div className="px-3 py-2 grid grid-cols-12 border-b border-white/3 text-white/70">
                    <span className="col-span-5 font-medium">LR-8290 (12/05/2026)</span>
                    <span className="col-span-3 text-right font-mono">MH-43-Y-9284</span>
                    <span className="col-span-2 text-right font-semibold">₹42,500</span>
                    <span className="col-span-2 text-right text-purple-400">₹7,650</span>
                  </div>
                  <div className="px-3 py-2 grid grid-cols-12 text-white/70">
                    <span className="col-span-5 font-medium">LR-8302 (15/05/2026)</span>
                    <span className="col-span-3 text-right font-mono">GJ-01-ZZ-4012</span>
                    <span className="col-span-2 text-right font-semibold">₹40,000</span>
                    <span className="col-span-2 text-right text-purple-400">₹7,200</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex justify-between items-center">
                  <span className="text-[9px] text-white/20">Generated via TruckBilty Invoice Engine</span>
                  <div className="flex gap-2">
                    <button className="px-3.5 py-1.5 rounded-lg bg-purple-500 hover:bg-purple-600 transition-colors text-[10px] font-semibold text-white flex items-center gap-1.5 shadow-md shadow-purple-500/10">
                      <Download className="w-3.5 h-3.5" />
                      Download Invoice
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "fleet" && (
              <motion.div
                key="fleet"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="w-full max-w-2xl bg-dark-950/80 border border-white/8 rounded-xl p-5 shadow-lg relative overflow-hidden"
              >
                {/* Background grid */}
                <div className="absolute inset-0 opacity-[0.02] bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

                {/* Fleet Header */}
                <div className="flex justify-between items-center border-b border-white/5 pb-4 mb-4">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider font-bold text-amber-400">Fleet Operations</span>
                    <h4 className="text-base font-bold text-white mt-0.5">Active Fleet Registry</h4>
                  </div>
                  <button className="px-2.5 py-1.2 rounded-lg bg-white/5 border border-white/8 hover:bg-white/10 hover:border-white/12 transition-colors text-[10px] font-semibold flex items-center gap-1">
                    <Plus className="w-3.5 h-3.5 text-amber-400" /> Add Lorry
                  </button>
                </div>

                {/* Vehicles list */}
                <div className="space-y-2.5 mb-2">
                  {[
                    { reg: "HR-55-A-9012", type: "10 Wheeler Taurus", driver: "Satnam Singh", status: "En Route", statusColor: "text-brand-400 bg-brand-500/10 border-brand-500/20", loc: "Delhi-Jaipur Highway" },
                    { reg: "MH-04-GP-3841", type: "Container Multi-Axle", driver: "Ramesh Shinde", status: "Delivered", statusColor: "text-green-400 bg-green-500/10 border-green-500/20", loc: "Nhava Sheva Port, Navi Mumbai" },
                    { reg: "GJ-03-XX-7819", type: "6 Wheeler Open Truck", driver: "Mohan Patel", status: "Loading", statusColor: "text-amber-400 bg-amber-500/10 border-amber-500/20", loc: "GIDC Ahmedabad" },
                  ].map((vehicle, idx) => (
                    <div
                      key={vehicle.reg}
                      className="bg-white/2 p-3 rounded-lg border border-white/3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/8 flex-center text-white/50 font-bold">
                          {idx + 1}
                        </div>
                        <div>
                          <p className="font-mono font-bold text-white">{vehicle.reg}</p>
                          <p className="text-[10px] text-white/40">{vehicle.type} • Driver: <span className="text-white/60">{vehicle.driver}</span></p>
                        </div>
                      </div>
                      <div className="flex sm:flex-col sm:items-end justify-between items-center gap-1.5">
                        <span className={`px-2 py-0.5 rounded text-[9px] border font-bold uppercase ${vehicle.statusColor}`}>
                          {vehicle.status}
                        </span>
                        <p className="text-[10px] text-white/40">Loc: <span className="text-white/60">{vehicle.loc}</span></p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
