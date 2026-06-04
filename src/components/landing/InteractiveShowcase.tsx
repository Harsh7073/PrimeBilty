"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, Receipt, Truck, Plus, Check, Download, Share2, Eye } from "lucide-react";

export default function InteractiveShowcase() {
  const [activeTab, setActiveTab] = useState<"bilty" | "invoice" | "fleet">("bilty");

  const tabs = [
    { 
      id: "bilty", 
      label: "Bilty (LR) Generator", 
      icon: FileText, 
      desc: "Create, format, and share transport bilties in seconds. Fully compliant and customizable." 
    },
    { 
      id: "invoice", 
      label: "GST Billing & Invoices", 
      icon: Receipt, 
      desc: "Generate professional invoices directly from your loading slips and bilties with automatically calculated GST." 
    },
    { 
      id: "fleet", 
      label: "Fleet & Driver Tracking", 
      icon: Truck, 
      desc: "Manage your vehicles, log statuses, track maintenance, and handle driver assignments efficiently." 
    },
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
              className={`text-left p-5 rounded-2xl border transition-all duration-300 cursor-pointer ${
                isActive
                  ? "bg-indigo-50 border-indigo-200 shadow-md shadow-indigo-600/5"
                  : "bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50"
              }`}
            >
              <div className="flex items-center gap-3 mb-2">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                    isActive ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-500"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className={`font-bold text-sm ${isActive ? "text-slate-900" : "text-slate-600"}`}>
                  {tab.label}
                </h3>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">{tab.desc}</p>
            </button>
          );
        })}
      </div>

      {/* Screen Frame Mockup */}
      <div className="relative bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-2xl">
        {/* Mockup Header/Controls */}
        <div className="bg-slate-50 px-5 py-3.5 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-400" />
            <span className="w-3 h-3 rounded-full bg-amber-400" />
            <span className="w-3 h-3 rounded-full bg-green-400" />
            <span className="text-[11px] text-slate-400 font-mono ml-3 bg-slate-100 px-3 py-1 rounded border border-slate-200">
              app.truckbilty.com/dashboard/{activeTab}
            </span>
          </div>
          <div className="flex gap-2">
            <div className="w-16 h-2 rounded-full bg-slate-200" />
            <div className="w-8 h-2 rounded-full bg-slate-200" />
          </div>
        </div>

        {/* Mockup Body Content with Animations */}
        <div className="p-6 md:p-8 bg-slate-50/50 min-h-[380px] flex items-center justify-center">
          <AnimatePresence mode="wait">
            {activeTab === "bilty" && (
              <motion.div
                key="bilty"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="w-full max-w-2xl bg-white border border-slate-200 rounded-xl p-5 shadow-lg relative overflow-hidden"
              >
                {/* Visual grid watermark in background */}
                <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#6366f1_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

                {/* Bilty Form Simulation Header */}
                <div className="flex justify-between items-start border-b border-slate-100 pb-4 mb-4">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider font-bold text-indigo-600">Bilty #2026-0849</span>
                    <h4 className="text-base font-bold text-slate-900 mt-0.5">ABC Logistics Private Limited</h4>
                    <p className="text-[10px] text-slate-400">Lorry Receipt / Consignment Note</p>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[9px] bg-green-50 border border-green-200 text-green-700 font-semibold uppercase tracking-wider">
                    Paid
                  </span>
                </div>

                {/* Simulated content fields */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-5">
                  <div className="bg-slate-50/80 p-2.5 rounded-lg border border-slate-100">
                    <p className="text-[9px] text-slate-400">From (Source)</p>
                    <p className="text-xs font-bold text-slate-800 mt-0.5">New Delhi</p>
                  </div>
                  <div className="bg-slate-50/80 p-2.5 rounded-lg border border-slate-100">
                    <p className="text-[9px] text-slate-400">To (Destination)</p>
                    <p className="text-xs font-bold text-slate-800 mt-0.5">Mumbai Port</p>
                  </div>
                  <div className="bg-slate-50/80 p-2.5 rounded-lg border border-slate-100">
                    <p className="text-[9px] text-slate-400">Lorry Number</p>
                    <p className="text-xs font-bold text-slate-800 mt-0.5 font-mono">DL-01-GB-8204</p>
                  </div>
                  <div className="bg-slate-50/80 p-2.5 rounded-lg border border-slate-100">
                    <p className="text-[9px] text-slate-400">Date</p>
                    <p className="text-xs font-bold text-slate-800 mt-0.5">22 May 2026</p>
                  </div>
                </div>

                <div className="space-y-2 mb-5">
                  <div className="flex justify-between items-center text-[10px] text-slate-400 border-b border-slate-100 pb-1">
                    <span>Item / Cargo Description</span>
                    <div className="flex gap-12">
                      <span className="w-12 text-right">Weight</span>
                      <span className="w-16 text-right">Freight</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-slate-700">Industrial Steel Coils (Grade-A)</span>
                    <div className="flex gap-8 font-bold">
                      <span className="w-12 text-right text-slate-600">18.5 MT</span>
                      <span className="w-16 text-right text-indigo-600">₹74,000</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-slate-700">Machinery Spare Parts (Box #1-4)</span>
                    <div className="flex gap-8 font-bold">
                      <span className="w-12 text-right text-slate-600">1.2 MT</span>
                      <span className="w-16 text-right text-indigo-600">₹8,500</span>
                    </div>
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex gap-4">
                    <div>
                      <p className="text-[9px] text-slate-400">Consignor (Sender)</p>
                      <p className="text-xs font-bold text-slate-800">Tata Steel Ltd</p>
                    </div>
                    <div className="w-px h-6 bg-slate-100" />
                    <div>
                      <p className="text-[9px] text-slate-400">Consignee (Receiver)</p>
                      <p className="text-xs font-bold text-slate-800">Reliance Industries</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-200 hover:border-slate-300 transition-colors text-[10px] font-bold text-slate-700 flex items-center gap-1.5 cursor-pointer">
                      <Download className="w-3.5 h-3.5" />
                      PDF
                    </button>
                    <button className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-200 hover:border-slate-300 transition-colors text-[10px] font-bold text-slate-700 flex items-center gap-1.5 cursor-pointer">
                      <Share2 className="w-3.5 h-3.5" />
                      WhatsApp
                    </button>
                    <button className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 transition-colors text-[10px] font-bold text-white flex items-center gap-1.5 shadow-md shadow-indigo-600/10 cursor-pointer">
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
                className="w-full max-w-2xl bg-white border border-slate-200 rounded-xl p-5 shadow-lg relative overflow-hidden"
              >
                {/* Background graphic */}
                <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#6366f1_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

                {/* Invoice Form Simulation Header */}
                <div className="flex justify-between items-start border-b border-slate-100 pb-4 mb-4">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider font-bold text-purple-600">Tax Invoice</span>
                    <h4 className="text-base font-bold text-slate-900 mt-0.5 font-mono">INV-2026-00482</h4>
                    <p className="text-[10px] text-slate-400">GSTIN: 07AAAAA1111A1Z1</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[9px] text-slate-400">Grand Total</p>
                    <p className="text-lg font-extrabold text-purple-600 font-mono">₹97,350</p>
                  </div>
                </div>

                {/* Main section */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div className="space-y-1.5">
                    <p className="text-[9px] text-slate-400 uppercase tracking-wider">Bill To</p>
                    <p className="text-xs font-bold text-slate-900">Adani Ports & SEZ Ltd</p>
                    <p className="text-[10px] text-slate-500">Mundra, Kutch, Gujarat - 370421</p>
                    <p className="text-[10px] text-slate-500 font-mono">GSTIN: 24AAACA2222B2Z2</p>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 flex flex-col justify-between">
                    <div className="flex justify-between text-[10px] text-slate-600">
                      <span>Basic Amount:</span>
                      <span className="font-bold text-slate-800">₹82,500</span>
                    </div>
                    <div className="flex justify-between text-[10px] text-slate-600 mt-1">
                      <span>CGST (9%):</span>
                      <span className="font-bold text-slate-800">₹7,425</span>
                    </div>
                    <div className="flex justify-between text-[10px] text-slate-600 mt-1">
                      <span>SGST (9%):</span>
                      <span className="font-bold text-slate-800">₹7,425</span>
                    </div>
                    <div className="border-t border-slate-200 mt-2 pt-2 flex justify-between text-xs font-bold">
                      <span className="text-purple-700">Total Taxable Amount:</span>
                      <span className="text-slate-900 font-mono">₹97,350</span>
                    </div>
                  </div>
                </div>

                {/* Details Table */}
                <div className="bg-white border border-slate-200 rounded-lg overflow-hidden mb-4 text-[10px]">
                  <div className="bg-slate-50 px-3 py-1.5 border-b border-slate-200 grid grid-cols-12 text-slate-500 font-bold">
                    <span className="col-span-5">LR No. & Date</span>
                    <span className="col-span-3 text-right">Lorry No.</span>
                    <span className="col-span-2 text-right">Basic</span>
                    <span className="col-span-2 text-right">Total GST</span>
                  </div>
                  <div className="px-3 py-2 grid grid-cols-12 border-b border-slate-100 text-slate-700">
                    <span className="col-span-5 font-bold">LR-8290 (12/05/2026)</span>
                    <span className="col-span-3 text-right font-mono">MH-43-Y-9284</span>
                    <span className="col-span-2 text-right font-bold text-slate-800">₹42,500</span>
                    <span className="col-span-2 text-right font-bold text-purple-600">₹7,650</span>
                  </div>
                  <div className="px-3 py-2 grid grid-cols-12 text-slate-700">
                    <span className="col-span-5 font-bold">LR-8302 (15/05/2026)</span>
                    <span className="col-span-3 text-right font-mono">GJ-01-ZZ-4012</span>
                    <span className="col-span-2 text-right font-bold text-slate-800">₹40,000</span>
                    <span className="col-span-2 text-right font-bold text-purple-600">₹7,200</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex justify-between items-center">
                  <span className="text-[9px] text-slate-400">Generated via TruckBilty Invoice Engine</span>
                  <button className="px-3.5 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-700 transition-colors text-[10px] font-bold text-white flex items-center gap-1.5 shadow-md shadow-purple-500/10 cursor-pointer">
                    <Download className="w-3.5 h-3.5" />
                    Download Invoice
                  </button>
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
                className="w-full max-w-2xl bg-white border border-slate-200 rounded-xl p-5 shadow-lg relative overflow-hidden"
              >
                {/* Background grid */}
                <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#6366f1_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

                {/* Fleet Header */}
                <div className="flex justify-between items-center border-b border-slate-100 pb-4 mb-4">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider font-bold text-amber-600">Fleet Operations</span>
                    <h4 className="text-base font-bold text-slate-900 mt-0.5">Active Fleet Registry</h4>
                  </div>
                  <button className="px-2.5 py-1.2 rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-200 hover:border-slate-300 transition-colors text-[10px] font-bold text-slate-700 flex items-center gap-1 cursor-pointer">
                    <Plus className="w-3.5 h-3.5 text-amber-600" /> Add Lorry
                  </button>
                </div>

                {/* Vehicles list */}
                <div className="space-y-2.5 mb-2">
                  {[
                    { reg: "HR-55-A-9012", type: "10 Wheeler Taurus", driver: "Satnam Singh", status: "En Route", statusColor: "text-indigo-700 bg-indigo-50 border-indigo-200", loc: "Delhi-Jaipur Highway" },
                    { reg: "MH-04-GP-3841", type: "Container Multi-Axle", driver: "Ramesh Shinde", status: "Delivered", statusColor: "text-green-700 bg-green-50 border-green-200", loc: "Nhava Sheva Port, Navi Mumbai" },
                    { reg: "GJ-03-XX-7819", type: "6 Wheeler Open Truck", driver: "Mohan Patel", status: "Loading", statusColor: "text-amber-700 bg-amber-50 border-amber-200", loc: "GIDC Ahmedabad" },
                  ].map((vehicle, idx) => (
                    <div
                      key={vehicle.reg}
                      className="bg-slate-50 p-3 rounded-lg border border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-slate-200 border border-slate-300 flex items-center justify-center text-slate-600 font-bold">
                          {idx + 1}
                        </div>
                        <div>
                          <p className="font-mono font-bold text-slate-800">{vehicle.reg}</p>
                          <p className="text-[10px] text-slate-500">{vehicle.type} • Driver: <span className="text-slate-700 font-semibold">{vehicle.driver}</span></p>
                        </div>
                      </div>
                      <div className="flex sm:flex-col sm:items-end justify-between items-center gap-1.5">
                        <span className={`px-2 py-0.5 rounded text-[9px] border font-bold uppercase ${vehicle.statusColor}`}>
                          {vehicle.status}
                        </span>
                        <p className="text-[10px] text-slate-500">Loc: <span className="text-slate-700 font-semibold">{vehicle.loc}</span></p>
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
