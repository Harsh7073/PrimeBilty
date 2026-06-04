"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Truck, Shield, Zap, Globe, FileText, CheckCircle, TrendingUp, Users,
  Check, ArrowRight, Clock, Smartphone, Play, Building2, MapPin, Receipt,
  Search, Mail, Phone, Send, AlertCircle, Loader2, Building, Package, CheckCircle2, User, Star, Quote
} from "lucide-react";
import { motion, Variants, AnimatePresence } from "framer-motion";
import Navbar from "@/components/landing/Navbar";
import InteractiveShowcase from "@/components/landing/InteractiveShowcase";

export default function HomePage() {
  const [isAnnual, setIsAnnual] = useState(false);

  // Tracking State
  const [lrNumber, setLrNumber] = useState("");
  const [trackingData, setTrackingData] = useState<any>(null);
  const [trackLoading, setTrackLoading] = useState(false);
  const [trackError, setTrackError] = useState<string | null>(null);

  // Inquiry State
  const [inquiryForm, setInquiryForm] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    message: "",
  });
  const [inquiryLoading, setInquiryLoading] = useState(false);
  const [inquirySuccess, setInquirySuccess] = useState(false);
  const [inquiryError, setInquiryError] = useState<string | null>(null);

  const handleTrackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lrNumber.trim()) return;

    setTrackLoading(true);
    setTrackError(null);
    setTrackingData(null);

    try {
      const res = await fetch(`/api/public/track?lrNumber=${encodeURIComponent(lrNumber.trim())}`);
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to find Bilty / LR Number");
      }
      setTrackingData(data);
    } catch (err: any) {
      setTrackError(err.message || "An unexpected error occurred");
    } finally {
      setTrackLoading(false);
    }
  };

  const handleInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setInquiryLoading(true);
    setInquiryError(null);
    setInquirySuccess(false);

    try {
      const res = await fetch("/api/public/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(inquiryForm),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to submit inquiry");
      }
      setInquirySuccess(true);
      setInquiryForm({ name: "", email: "", phone: "", company: "", message: "" });
    } catch (err: any) {
      setInquiryError(err.message || "Something went wrong. Please try again.");
    } finally {
      setInquiryLoading(false);
    }
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 selection:bg-indigo-500/20 overflow-x-hidden" id="home">
      {/* Background Gradients & Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-[-10%] left-[20%] w-[500px] h-[500px] bg-indigo-200/30 rounded-full blur-[120px]" />
        <div className="absolute top-[10%] right-[10%] w-[400px] h-[400px] bg-amber-100/30 rounded-full blur-[100px]" />
      </div>

      {/* Navigation Header */}
      <Navbar />

      {/* ── HERO SECTION ── */}
      <section className="relative pt-36 pb-20 md:pt-44 md:pb-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Hero Left Content */}
          <div className="lg:col-span-6 flex flex-col items-center lg:items-start text-center lg:text-left space-y-6">
            {/* Promo Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-indigo-100 bg-indigo-50 text-indigo-700 text-xs font-bold"
            >
              <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500 animate-pulse" />
              Next-Gen Transport Management System (TMS)
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1] text-slate-900"
            >
              Digitize Your Fleet.<br />
              <span className="text-indigo-600">Streamline Logistics.</span>
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-slate-600 text-base sm:text-lg max-w-xl leading-relaxed font-medium"
            >
              Create Bilties (LR), GST invoices, loading slips, and track fleet operations in seconds. Share documents via WhatsApp instantly from any device.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
            >
              <Link
                href="/register"
                className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 px-8 text-base rounded-xl transition-all shadow-lg shadow-indigo-600/20 hover:shadow-indigo-600/35 flex items-center justify-center gap-2 hover:-translate-y-0.5"
              >
                <span>Get Started Free</span>
                <ArrowRight className="w-4.5 h-4.5" />
              </Link>
              <a
                href="#features"
                className="w-full sm:w-auto bg-white border border-slate-200 text-slate-700 font-bold py-3.5 px-8 text-base rounded-xl transition-all hover:bg-slate-50 flex items-center justify-center gap-2"
              >
                <Play className="w-4.5 h-4.5 text-indigo-600 fill-indigo-600" />
                <span>See Features</span>
              </a>
            </motion.div>

            {/* Trust Mini stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex items-center gap-8 pt-6 border-t border-slate-200 w-full justify-center lg:justify-start"
            >
              {[
                { value: "10K+", label: "Transporters" },
                { value: "500K+", label: "Bilties Created" },
                { value: "99.9%", label: "System Uptime" },
              ].map((stat, i) => (
                <div key={i} className="text-center lg:text-left">
                  <div className="text-xl font-extrabold text-slate-900">{stat.value}</div>
                  <div className="text-xs text-slate-400 mt-0.5 font-semibold uppercase tracking-wider">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Hero Right Visuals: Animated Mockups & Badges */}
          <div className="lg:col-span-6 relative flex items-center justify-center lg:justify-end">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative w-full max-w-lg aspect-square lg:aspect-auto lg:h-[420px]"
            >
              {/* Core Screen Mockup */}
              <div className="w-full h-full bg-white border border-slate-200 rounded-2xl p-4 shadow-2xl relative overflow-hidden flex flex-col">
                {/* Background layout mock elements */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                    <span className="w-2.5 h-2.5 rounded-full bg-green-400" />
                  </div>
                  <div className="w-32 h-3.5 rounded bg-slate-100" />
                  <div className="w-8 h-3.5 rounded bg-slate-100" />
                </div>
                {/* Simulated charts/metrics grid */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-slate-50 border border-slate-150 p-4 rounded-xl flex flex-col justify-between h-28 relative overflow-hidden">
                    <div className="text-[10px] text-slate-400 uppercase font-bold">Active Trips</div>
                    <div className="text-2xl font-black text-slate-800 mt-1">142</div>
                    <div className="text-[9px] text-green-600 mt-1 flex items-center gap-0.5 font-bold">
                      <span>↑ 12.4% vs last week</span>
                    </div>
                  </div>
                  <div className="bg-slate-50 border border-slate-150 p-4 rounded-xl flex flex-col justify-between h-28 relative overflow-hidden">
                    <div className="text-[10px] text-slate-400 uppercase font-bold">Pending PODs</div>
                    <div className="text-2xl font-black text-amber-600 mt-1">18</div>
                    <div className="text-[9px] text-slate-500 mt-1 font-semibold">Needs verification</div>
                  </div>
                </div>
                {/* Bottom detail card */}
                <div className="flex-1 bg-slate-50 border border-slate-150 p-4 rounded-xl flex flex-col justify-between relative overflow-hidden">
                  <div className="flex justify-between items-center text-xs border-b border-slate-150 pb-2">
                    <span className="font-bold text-slate-800">Live Lorry Locations</span>
                    <span className="text-[10px] text-indigo-600 font-bold">Map View</span>
                  </div>
                  <div className="flex-1 flex flex-col justify-center gap-2.5 mt-2">
                    {[
                      { reg: "DL-01-GB-8204", route: "New Delhi → Mumbai", progress: 75, status: "On Time" },
                      { reg: "HR-55-A-9012", route: "Delhi → Jaipur", progress: 40, status: "Delayed" },
                    ].map((v) => (
                      <div key={v.reg} className="space-y-1">
                        <div className="flex justify-between text-[10px]">
                          <span className="font-mono font-bold text-slate-700">{v.reg} ({v.route})</span>
                          <span className={`font-bold ${v.status === "On Time" ? "text-green-600" : "text-amber-600"}`}>{v.status}</span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full bg-gradient-to-r ${
                              v.status === "On Time" ? "from-indigo-500 to-indigo-600" : "from-amber-400 to-amber-500"
                            }`}
                            style={{ width: `${v.progress}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Floating Badge 1: Instant Whatsapp */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-6 -left-6 bg-white border border-slate-250/80 p-3.5 rounded-2xl shadow-xl flex items-center gap-3 z-10"
              >
                <div className="w-8 h-8 rounded-lg bg-green-50 border border-green-200 flex items-center justify-center">
                  <Globe className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">Instant WhatsApp</div>
                  <div className="text-[9px] text-slate-400 font-semibold">1-click Bilty Share</div>
                </div>
              </motion.div>

              {/* Floating Badge 2: Revenue */}
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute -bottom-6 -right-6 bg-white border border-slate-250/80 p-3.5 rounded-2xl shadow-xl flex items-center gap-3 z-10"
              >
                <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-200 flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-indigo-600" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">₹12.4L Invoiced</div>
                  <div className="text-[9px] text-slate-400 font-semibold">This Month Sales</div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── CONSIGNMENT TRACKING SECTION ── */}
      <section id="tracking" className="py-16 md:py-24 border-t border-slate-200 relative bg-slate-100/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-10">
            <span className="text-[10px] tracking-widest font-black uppercase text-indigo-650 bg-indigo-50 px-3.5 py-1.5 rounded-full border border-indigo-200">
              Live Database Lookup
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900">
              Track Your <span className="text-indigo-600">LR / Bilty Status</span>
            </h2>
            <p className="text-slate-500 text-sm max-w-lg mx-auto font-medium">
              Enter your Lorry Receipt (LR) number to track vehicle location, consignment loading info, and proof of delivery in real-time.
            </p>
          </div>

          {/* Tracking Search Box */}
          <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-full blur-[80px] pointer-events-none" />
            <form onSubmit={handleTrackSubmit} className="flex flex-col sm:flex-row gap-3 relative z-10">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Enter LR / Bilty Number (e.g. LR-1001)"
                  value={lrNumber}
                  onChange={(e) => setLrNumber(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 focus:border-indigo-600 rounded-xl text-slate-800 placeholder-slate-400 text-sm focus:outline-none focus:bg-white transition-colors"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={trackLoading}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 px-6 rounded-xl flex items-center justify-center gap-2 text-sm sm:w-auto w-full disabled:opacity-75 shadow-md shadow-indigo-600/10 cursor-pointer"
              >
                {trackLoading ? (
                  <>
                    <Loader2 className="w-4.5 h-4.5 animate-spin" />
                    <span>Searching...</span>
                  </>
                ) : (
                  <>
                    <span>Track Consignment</span>
                    <ArrowRight className="w-4.5 h-4.5" />
                  </>
                )}
              </button>
            </form>

            {/* Tracking Results Area */}
            <AnimatePresence mode="wait">
              {trackError && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mt-6 p-4 rounded-xl border border-red-200 bg-red-50 text-red-700 text-xs flex items-center gap-3 font-semibold"
                >
                  <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                  <div>
                    <span className="font-bold">Error:</span> {trackError}
                  </div>
                </motion.div>
              )}

              {trackingData && (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mt-8 pt-6 border-t border-slate-100 space-y-6"
                >
                  {/* Trip details grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                    <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-150">
                      <span className="text-slate-400 block mb-0.5 font-bold uppercase tracking-wide text-[9px]">LR Number</span>
                      <span className="font-black text-slate-800 font-mono">{trackingData.lrNumber}</span>
                    </div>
                    <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-150">
                      <span className="text-slate-400 block mb-0.5 font-bold uppercase tracking-wide text-[9px]">Booking Date</span>
                      <span className="font-bold text-slate-800">
                        {new Date(trackingData.lrDate).toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                    <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-150">
                      <span className="text-slate-400 block mb-0.5 font-bold uppercase tracking-wide text-[9px]">Vehicle Number</span>
                      <span className="font-bold text-indigo-650 font-mono">{trackingData.vehicleNumber}</span>
                    </div>
                    <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-150">
                      <span className="text-slate-400 block mb-0.5 font-bold uppercase tracking-wide text-[9px]">Carrier Agency</span>
                      <span className="font-bold text-slate-800 truncate block">{trackingData.companyName}</span>
                    </div>
                  </div>

                  {/* Route details */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-xl border border-slate-150 bg-slate-50 text-xs">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-200 flex items-center justify-center">
                        <MapPin className="w-4 h-4 text-indigo-600" />
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px] font-bold uppercase tracking-wide">Route Path</span>
                        <span className="font-extrabold text-slate-800 text-sm">
                          {trackingData.fromCity} → {trackingData.toCity}
                          {trackingData.via && <span className="text-slate-500 font-medium text-xs"> (via {trackingData.via})</span>}
                        </span>
                      </div>
                    </div>
                    {trackingData.goodsDescription && (
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-purple-50 border border-purple-200 flex items-center justify-center">
                          <Package className="w-4 h-4 text-purple-600" />
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px] font-bold uppercase tracking-wide">Consignment Load</span>
                          <span className="font-extrabold text-slate-800 text-sm">
                            {trackingData.goodsDescription} {trackingData.quantity && `(${trackingData.quantity} ${trackingData.unit || "Bale"})`}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Tracking Timeline Stepper */}
                  <div className="space-y-4 pt-2">
                    <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Consignment Progress</h4>
                    <div className="relative">
                      {/* Timeline bar line */}
                      <div className="absolute left-6 top-4 bottom-4 w-0.5 bg-slate-200" />

                      {/* Steppers */}
                      {[
                        {
                          title: "LR Booked & Document Generated",
                          desc: `Consignment registered in ${trackingData.companyName} local office database.`,
                          time: new Date(trackingData.lrDate).toLocaleTimeString("en-IN", { hour: '2-digit', minute: '2-digit' }),
                          active: true,
                        },
                        {
                          title: "In Transit",
                          desc: `Consignment is loaded on truck ${trackingData.vehicleNumber} and is currently in transit.`,
                          time: "Running",
                          active: trackingData.status === "ACTIVE" || trackingData.status === "DELIVERED",
                        },
                        {
                          title: "Consignment Delivered",
                          desc: trackingData.deliveredAt 
                            ? `Delivered and verified on ${new Date(trackingData.deliveredAt).toLocaleDateString("en-IN")}.`
                            : "Awaiting delivery confirmation from receiving branch.",
                          time: trackingData.deliveredAt 
                            ? new Date(trackingData.deliveredAt).toLocaleTimeString("en-IN", { hour: '2-digit', minute: '2-digit' })
                            : "Pending",
                          active: trackingData.status === "DELIVERED" || !!trackingData.deliveredAt,
                        },
                      ].map((step, idx) => (
                        <div key={idx} className="flex gap-4 relative pb-6 last:pb-0">
                          {/* Stepper Dot */}
                          <div className={`w-12 h-12 rounded-full border flex items-center justify-center flex-shrink-0 z-10 transition-all ${
                            step.active 
                              ? "bg-indigo-50 border-indigo-300 text-indigo-600" 
                              : "bg-white border-slate-200 text-slate-400"
                          }`}>
                            <CheckCircle2 className="w-5 h-5" />
                          </div>
                          {/* Stepper details */}
                          <div className="pt-2 flex-1">
                            <div className="flex items-center justify-between text-xs gap-4">
                              <h5 className={`font-bold ${step.active ? "text-slate-800" : "text-slate-400"}`}>{step.title}</h5>
                              <span className="text-[10px] text-slate-400 font-semibold whitespace-nowrap">{step.time}</span>
                            </div>
                            <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed font-medium">{step.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* ── HOW TRUCKBILTY FIXES IT (PROBLEM / SOLUTION) ── */}
      <section id="details" className="py-20 md:py-28 border-t border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-20">
            <span className="text-[10px] tracking-widest font-black uppercase text-indigo-650 bg-indigo-50 px-3.5 py-1.5 rounded-full border border-indigo-200">
              Problems vs Solutions
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
              How TruckBilty <span className="text-indigo-600">Fixes It</span>
            </h2>
            <p className="text-slate-500 text-base font-medium">
              We replace outdated paper registries and manual calculations with smart, automated digital logs.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 md:gap-16">
            {[
              {
                problemTitle: "LR / Bilty Paperwork Errors",
                problemDesc: "Writing lorry receipts by hand leads to typos in weight, rate, and GSTINs. Lost papers take days to replace.",
                solutionTitle: "10-Second Digital LRs",
                solutionDesc: "Select customer, source, and lorry from dropdowns. Auto-fill names and addresses using GSTIN lookup. Save, print, or WhatsApp instantly.",
                icon: FileText,
                accentColor: "border-indigo-200 bg-indigo-50/50"
              },
              {
                problemTitle: "Complex Accounts & Advances",
                problemDesc: "Keeping track of driver advance payments, diesel coupons, loading slips, and commissions leads to settlement delays and billing conflicts.",
                solutionTitle: "Automated Ledger Tracking",
                solutionDesc: "Log every advance payment and fuel charge directly under the Bilty. Watch the final outstanding balance auto-calculate in real-time.",
                icon: TrendingUp,
                accentColor: "border-emerald-200 bg-emerald-50/30"
              },
              {
                problemTitle: "Delayed Invoicing & Auditing",
                problemDesc: "Transporters wait weeks to gather all paper LRs and PODs to create one customer invoice, resulting in delayed payments.",
                solutionTitle: "1-Click Bulk GST Invoices",
                solutionDesc: "Select multiple loading slips or bilties for a consignor, and watch the system compile a professional GST-compliant invoice in 1 click.",
                icon: Receipt,
                accentColor: "border-purple-200 bg-purple-50/30"
              },
              {
                problemTitle: "Manual Report Compilation",
                problemDesc: "Generating monthly outstanding ledgers, tax reports, or vehicle trip registers means spending weekends copy-pasting into Excel.",
                solutionTitle: "Instant Excel & PDF Reports",
                solutionDesc: "Get instant downloads of tax registers, branch-wise bilty summaries, outstanding ledger books, and driver balance reports in real-time.",
                icon: Shield,
                accentColor: "border-amber-200 bg-amber-50/40"
              }
            ].map((item, idx) => (
              <div key={idx} className="flex gap-4 md:gap-6">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-650 font-bold shadow-sm">
                    <item.icon className="w-6 h-6" />
                  </div>
                </div>
                <div className="space-y-4 flex-1">
                  <div className="border-l-4 border-red-400 pl-4">
                    <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wide">{item.problemTitle}</h4>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">{item.problemDesc}</p>
                  </div>
                  <div className={`border-l-4 border-green-500 pl-4 py-2.5 pr-3 rounded-r-lg border ${item.accentColor}`}>
                    <h4 className="text-sm font-extrabold text-slate-900 flex items-center gap-1.5">
                      <Check className="w-4 h-4 text-green-600 stroke-[3]" />
                      <span>{item.solutionTitle}</span>
                    </h4>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed font-medium">{item.solutionDesc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES SECTION ── */}
      <section id="features" className="py-20 md:py-28 border-t border-slate-200 relative bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
              Powerful Features built for <span className="text-indigo-600">Modern Transporters</span>
            </h2>
            <p className="text-slate-500 text-base font-medium">
              Everything you need to run, track, and scale your logistics and transport company without messy paperwork.
            </p>
          </div>

          {/* Features Grid */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {[
              {
                icon: FileText,
                title: "Lorry Receipt (Bilty)",
                desc: "Create GST-compliant Lorries Receipt (LR) with automated weight, quantity, consignee details, and print options.",
                color: "text-indigo-600 bg-indigo-50 border-indigo-100",
              },
              {
                icon: Receipt,
                title: "GST Invoicing",
                desc: "Generate professional tax invoices instantly from bilties. Auto-calculates CGST, SGST, IGST, and freight settings.",
                color: "text-purple-600 bg-purple-50 border-purple-100",
              },
              {
                icon: Truck,
                title: "Loading Slip & Advices",
                desc: "Generate Loading Slips by entering Truck number, Rate, and advance details. Print or WhatsApp to drivers.",
                color: "text-amber-600 bg-amber-50 border-amber-100",
              },
              {
                icon: Shield,
                title: "Role-Based Access & Branches",
                desc: "Add multiple branches and set custom user roles. Allow employees to access specific billing or fleet data.",
                color: "text-emerald-600 bg-emerald-50 border-emerald-100",
              },
              {
                icon: Clock,
                title: "Real-time Tracking",
                desc: "Add tracking statuses to your vehicles. Keep consignors updated about exact location and ETA automatically.",
                color: "text-rose-600 bg-rose-50 border-rose-100",
              },
              {
                icon: Smartphone,
                title: "Mobile Friendly Layout",
                desc: "Access your dashboard from your phone, laptop, or tablet. Easy-to-use layouts built for on-the-go transport managers.",
                color: "text-cyan-600 bg-cyan-50 border-cyan-100",
              },
              {
                icon: Users,
                title: "Party Ledger Book",
                desc: "Maintain neat accounts for your regular clients (consignors and consignees) with printable outstanding bills.",
                color: "text-teal-600 bg-teal-50 border-teal-100",
              },
              {
                icon: Building2,
                title: "GST Auto-fill Masters",
                desc: "Add consignors and consignees simply by typing their GSTIN. The software automatically fills in names and addresses.",
                color: "text-blue-600 bg-blue-50 border-blue-100",
              },
              {
                icon: MapPin,
                title: "Collection Memos",
                desc: "Create and track collection memos with comprehensive advance payment, discount, and settlement summaries.",
                color: "text-indigo-600 bg-indigo-50 border-indigo-100",
              }
            ].map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={idx}
                  variants={itemVariants}
                  className="bg-white p-6 border border-slate-200 rounded-2xl flex flex-col justify-between hover:scale-[1.02] hover:border-indigo-150 transition-all duration-300 shadow-sm"
                >
                  <div className="space-y-4">
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center border ${feature.color}`}>
                      <Icon className="w-5.5 h-5.5" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-800">{feature.title}</h3>
                    <p className="text-xs text-slate-500 leading-relaxed font-semibold">{feature.desc}</p>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* ── INTERACTIVE WORK SHOWCASE SECTION ── */}
      <section className="py-20 md:py-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-slate-200">
        <div className="text-center max-w-2xl mx-auto space-y-4 mb-14">
          <span className="text-[10px] tracking-widest font-black uppercase text-indigo-650 bg-indigo-50 px-3.5 py-1.5 rounded-full border border-indigo-200">
            Interactive Tour
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
            See TruckBilty in <span className="text-indigo-600">Action</span>
          </h2>
          <p className="text-slate-500 text-sm font-medium">
            Toggle between core modules below to explore our clean, high-performance web interface.
          </p>
        </div>
        <InteractiveShowcase />
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how-it-works" className="py-20 md:py-28 border-t border-slate-200 bg-slate-50 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-20">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
              Get Started in <span className="text-indigo-600">3 Simple Steps</span>
            </h2>
            <p className="text-slate-500 text-base font-medium">
              Say goodbye to registry books and manual typing. Get set up in less than 5 minutes.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12 md:gap-8 relative">
            {/* Timeline connection bar (Desktop only) */}
            <div className="hidden md:block absolute top-12 left-[15%] right-[15%] h-0.5 bg-gradient-to-r from-indigo-500 to-purple-600 opacity-20 -z-10" />

            {[
              {
                step: "01",
                title: "Register Your Account",
                desc: "Create your free business account. Enter your company name, email, and GSTIN details to configure billing.",
              },
              {
                step: "02",
                title: "Load Fleet & Parties",
                desc: "Upload vehicle registration numbers, driver info, and details of regular consignors or consignees to save typing later.",
              },
              {
                step: "03",
                title: "Generate LR & Invoices",
                desc: "Select details from drop-downs to issue bilties in seconds. Share PDF files with clients via automated WhatsApp triggers.",
              },
            ].map((stepItem, idx) => (
              <div key={idx} className="flex flex-col items-center text-center space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center font-black text-xl text-white shadow-xl shadow-indigo-600/10 border border-slate-200 relative">
                  {stepItem.step}
                  <div className="absolute -inset-1 rounded-2xl bg-indigo-500/5 -z-10 blur" />
                </div>
                <h3 className="text-lg font-bold text-slate-800 pt-2">{stepItem.title}</h3>
                <p className="text-xs text-slate-500 max-w-xs leading-relaxed font-semibold">{stepItem.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING SECTION ── */}
      <section id="pricing" className="py-20 md:py-28 border-t border-slate-200 bg-white max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-5 mb-16">
          <span className="text-[10px] tracking-widest font-black uppercase text-indigo-650 bg-indigo-50 px-3.5 py-1.5 rounded-full border border-indigo-200">
            Choose Your Plan
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
            Simple, Transparent <span className="text-indigo-600">Pricing</span>
          </h2>
          <p className="text-slate-500 text-base font-semibold">
            Truck Bilty offers a 7-day free trial with full access to all features for new registrations. Experience the full benefits before choosing a paid plan.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid md:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {[
            {
              name: "Starter",
              price: "₹699",
              period: "/ 84 Days",
              desc: "Perfect for single user cargo brokers and owner operations.",
              features: [
                "Users: Up to 1",
                "Companies: Up to 1",
                "Branches: Up to 1",
                "Bilties: 300",
                "Invoices: 150",
                "Loading Slips: 300",
                "Collection Memos: 300",
              ],
              popular: false,
              addons: false,
              color: "border-slate-200 bg-slate-50/80 hover:bg-slate-50",
              btnStyle: "bg-slate-100 hover:bg-slate-200 text-slate-800",
            },
            {
              name: "Standard",
              price: "₹1,299",
              period: "/ 180 Days",
              desc: "Great value for small sized fleet operators.",
              features: [
                "Users: Up to 1",
                "Companies: Up to 1",
                "Branches: Up to 1",
                "Bilties: 300",
                "Invoices: 150",
                "Loading Slips: 300",
                "Collection Memos: 300",
              ],
              popular: false,
              addons: true,
              color: "border-slate-200 bg-slate-50/80 hover:bg-slate-50",
              btnStyle: "bg-slate-100 hover:bg-slate-200 text-slate-800",
            },
            {
              name: "Advanced",
              price: "₹2,399",
              period: "/ 365 Days",
              desc: "Best choice for active transport and logistics businesses.",
              features: [
                "Users: Up to 1",
                "Companies: Up to 1",
                "Branches: Up to 1",
                "Bilties: 300",
                "Invoices: 150",
                "Loading Slips: 300",
                "Collection Memos: 300",
              ],
              popular: true,
              addons: true,
              color: "border-indigo-300 bg-indigo-50/30",
              btnStyle: "bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/10",
            },
            {
              name: "Enterprise",
              price: "₹5,999",
              period: "/ 365 Days",
              desc: "For full scale logistics and bulk transport management.",
              features: [
                "Users: Up to 1",
                "Companies: Up to 1",
                "Branches: Up to 1",
                "Bilties: 300",
                "Invoices: 150",
                "Loading Slips: 300",
                "Collection Memos: 300",
              ],
              popular: false,
              addons: true,
              color: "border-slate-200 bg-slate-50/80 hover:bg-slate-50",
              btnStyle: "bg-slate-100 hover:bg-slate-200 text-slate-800",
            },
          ].map((plan) => (
            <div
              key={plan.name}
              className={`border p-6 rounded-2xl flex flex-col justify-between relative transition-all duration-300 hover:scale-[1.02] shadow-sm ${plan.color}`}
            >
              {plan.popular && (
                <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-[9px] bg-indigo-600 text-white font-bold tracking-widest uppercase border border-indigo-400/20 shadow-md">
                  Most Popular
                </span>
              )}
              <div className="space-y-5">
                <div>
                  <h3 className="text-lg font-bold text-slate-800">{plan.name}</h3>
                  <p className="text-[11px] text-slate-500 mt-1 font-semibold leading-snug">{plan.desc}</p>
                </div>
                <div className="flex items-baseline">
                  <span className="text-3xl font-black text-slate-900">{plan.price}</span>
                  <span className="text-xs text-slate-500 font-bold ml-1">{plan.period}</span>
                </div>
                <div className="w-full h-px bg-slate-200" />
                <ul className="space-y-2.5">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-slate-700 font-semibold">
                      <Check className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5 stroke-[3]" />
                      <span>{feature}</span>
                    </li>
                  ))}
                  {plan.addons && (
                    <li className="pt-2 border-t border-dashed border-slate-200 text-[10px] text-indigo-700 font-bold">
                      ✦ Add-ons Available
                      <span className="block text-[9px] text-slate-500 font-medium font-sans mt-0.5">
                        * Additional users, companies & branches can be added at extra cost
                      </span>
                    </li>
                  )}
                </ul>
              </div>
              <div className="pt-6">
                <Link
                  href="/register"
                  className={`w-full py-2.5 text-xs font-bold transition-all duration-300 text-center rounded-xl flex items-center justify-center ${plan.btnStyle}`}
                >
                  Register Now
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── TESTIMONIALS SECTION ── */}
      <section id="reviews" className="py-20 md:py-24 border-t border-slate-200 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <span className="text-[10px] tracking-widest font-black uppercase text-indigo-650 bg-indigo-50 px-3.5 py-1.5 rounded-full border border-indigo-200">
            Reviews
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900">
            Loved By <span className="text-indigo-600">Transporters</span>
          </h2>
          
          <div className="bg-white p-8 md:p-10 rounded-3xl border border-slate-200 shadow-xl relative max-w-3xl mx-auto">
            <Quote className="absolute top-6 left-6 w-12 h-12 text-slate-100 -z-0 pointer-events-none" />
            <div className="relative z-10 space-y-6">
              <div className="flex justify-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-amber-500 fill-amber-500" />
                ))}
              </div>
              
              <p className="text-slate-700 italic text-base md:text-lg leading-relaxed font-semibold max-w-2xl mx-auto">
                "TruckBilty has simplified our bilty and invoice creation process completely. The interface is clean and easy to use, even for first-time users. It has reduced paperwork errors and improved our overall workflow efficiency."
              </p>
              
              <div className="pt-4 border-t border-slate-100 flex items-center justify-center gap-3">
                <div className="w-10 h-10 rounded-full bg-indigo-50 border border-indigo-200 flex items-center justify-center font-black text-indigo-600">
                  GT
                </div>
                <div className="text-left">
                  <div className="text-sm font-bold text-slate-800">Gujarat Transporters Association</div>
                  <div className="text-[10px] text-slate-400 font-semibold uppercase">Verified Transporter Business</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── BOTTOM CALL TO ACTION & INQUIRY FORM ── */}
      <section className="py-20 md:py-28 border-t border-slate-200 relative overflow-hidden bg-white" id="contact">
        <div className="absolute inset-0 bg-[radial-gradient(#4f46e5_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.02] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            
            {/* CTA Copy (Left side) */}
            <div className="lg:col-span-5 space-y-6 text-center lg:text-left">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 leading-[1.1]">
                Stop Typing,<br />
                Start <span className="text-indigo-600">Transporting.</span>
              </h2>
              <p className="text-slate-650 text-base font-semibold leading-relaxed max-w-lg mx-auto lg:mx-0">
                Join thousands of transport managers who save hours every week using TruckBilty. Sign up for a free account or get in touch for custom enterprise needs.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
                <Link
                  href="/register"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 px-8 text-sm rounded-xl transition-all shadow-xl shadow-indigo-600/10 hover:-translate-y-0.5 flex items-center gap-2 w-full sm:w-auto justify-center"
                >
                  <span>Launch Free Trial</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <a
                  href="tel:+919680706799"
                  className="bg-slate-100 hover:bg-slate-250 border border-slate-200 hover:border-slate-300 text-slate-800 font-bold py-3.5 px-8 text-sm rounded-xl transition-all flex items-center gap-2 w-full sm:w-auto justify-center"
                >
                  <Phone className="w-4 h-4 text-indigo-600" />
                  <span>Call Support</span>
                </a>
              </div>
              
              <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row gap-4 items-center justify-center lg:justify-start text-xs text-slate-400 font-bold">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 stroke-[3]" />
                  <span>7-Day Free Trial</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 stroke-[3]" />
                  <span>No Credit Card Required</span>
                </div>
              </div>
            </div>

            {/* Public CRM / Contact Form (Right side) */}
            <div className="lg:col-span-7">
              <div className="bg-slate-50 p-6 md:p-8 rounded-2xl border border-slate-200 shadow-xl relative">
                <h3 className="text-lg font-bold text-slate-800 mb-2">Request a Call Back / Demo</h3>
                <p className="text-xs text-slate-400 mb-6 font-semibold">Have questions or want a walkthrough? Fill out this quick form and our transport specialists will connect with you.</p>
                
                <form onSubmit={handleInquirySubmit} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Your Name</label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                          type="text"
                          required
                          placeholder="John Doe"
                          value={inquiryForm.name}
                          onChange={(e) => setInquiryForm({ ...inquiryForm, name: e.target.value })}
                          className="w-full pl-9 pr-3 py-2.5 bg-white border border-slate-200 focus:border-indigo-600 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none transition-colors"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Phone Number</label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                          type="tel"
                          required
                          placeholder="e.g. 9876543210"
                          value={inquiryForm.phone}
                          onChange={(e) => setInquiryForm({ ...inquiryForm, phone: e.target.value })}
                          className="w-full pl-9 pr-3 py-2.5 bg-white border border-slate-200 focus:border-indigo-600 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none transition-colors"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Email Address</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                          type="email"
                          required
                          placeholder="john@company.com"
                          value={inquiryForm.email}
                          onChange={(e) => setInquiryForm({ ...inquiryForm, email: e.target.value })}
                          className="w-full pl-9 pr-3 py-2.5 bg-white border border-slate-200 focus:border-indigo-600 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none transition-colors"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Company Name</label>
                      <div className="relative">
                        <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                          type="text"
                          placeholder="e.g. Acme Logistics"
                          value={inquiryForm.company}
                          onChange={(e) => setInquiryForm({ ...inquiryForm, company: e.target.value })}
                          className="w-full pl-9 pr-3 py-2.5 bg-white border border-slate-200 focus:border-indigo-600 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none transition-colors"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Your Message / Requirements</label>
                    <textarea
                      required
                      rows={3}
                      placeholder="Tell us about your fleet operations or key features you need..."
                      value={inquiryForm.message}
                      onChange={(e) => setInquiryForm({ ...inquiryForm, message: e.target.value })}
                      className="w-full p-3 bg-white border border-slate-200 focus:border-indigo-600 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none resize-none transition-colors"
                    />
                  </div>

                  {inquiryError && (
                    <div className="p-3.5 rounded-xl border border-red-200 bg-red-50 text-red-700 text-xs flex items-center gap-2.5 font-semibold">
                      <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                      <span>{inquiryError}</span>
                    </div>
                  )}

                  {inquirySuccess && (
                    <div className="p-3.5 rounded-xl border border-green-200 bg-green-50 text-green-700 text-xs flex items-center gap-2.5 font-bold animate-fade-in">
                      <CheckCircle className="w-4 h-4 text-green-600 stroke-[3] flex-shrink-0" />
                      <span>Inquiry submitted! We'll call you shortly.</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={inquiryLoading}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold w-full py-3.5 rounded-xl text-xs flex items-center justify-center gap-2 disabled:opacity-75 cursor-pointer shadow-md shadow-indigo-600/10"
                  >
                    {inquiryLoading ? (
                      <>
                        <Loader2 className="w-4.5 h-4.5 animate-spin" />
                        <span>Submitting Request...</span>
                      </>
                    ) : (
                      <>
                        <span>Submit Inquiry</span>
                        <Send className="w-4.5 h-4.5" />
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-slate-800 py-16 bg-slate-950 text-slate-400 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="grid md:grid-cols-12 gap-8 md:gap-12">
            {/* Logo and Tagline */}
            <div className="md:col-span-5 space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center">
                  <Truck className="w-4.5 h-4.5 text-white" />
                </div>
                <span className="font-extrabold text-white text-base">
                  Truck<span className="text-indigo-400">Bilty</span>
                </span>
              </div>
              <p className="text-slate-500 font-semibold leading-relaxed max-w-sm">
                Easy-to-use cloud software for transporters, fleet owners, and brokers to create Lorry Receipts (LR), Tax Invoices, Loading Slips, and track deliveries.
              </p>
            </div>

            {/* Links Section */}
            <div className="md:col-span-3 space-y-4">
              <h4 className="text-white font-bold uppercase tracking-wider text-[10px]">Reach out us at</h4>
              <div className="space-y-2 text-slate-400 font-semibold">
                <a href="mailto:info@truckbilty.com" className="block hover:text-white transition-colors">info@truckbilty.com</a>
                <a href="tel:+919680706799" className="block hover:text-white transition-colors">Sales: +91 96807 06799</a>
                <a href="tel:+919998060916" className="block hover:text-white transition-colors">Support: +91 99980 60916</a>
              </div>
            </div>

            {/* Addresses */}
            <div className="md:col-span-4 space-y-4">
              <h4 className="text-white font-bold uppercase tracking-wider text-[10px]">Office Locations</h4>
              <div className="space-y-3.5 text-slate-500 font-semibold leading-relaxed">
                <div>
                  <span className="text-[10px] text-indigo-400 font-bold block uppercase mb-0.5">Gandhidham Office</span>
                  <a 
                    href="https://share.google/Eey8RK54WfCW36XL5" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="hover:text-slate-350 transition-colors"
                  >
                    10, Keshar Arcade, Sector -8, Gandhidham, Kutch - 370201, Gujarat
                  </a>
                </div>
                <div>
                  <span className="text-[10px] text-indigo-400 font-bold block uppercase mb-0.5">Ahmedabad Office</span>
                  <a 
                    href="https://share.google/V1ozFFeQqr1lLo6pd" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="hover:text-slate-350 transition-colors"
                  >
                    916, City Centre 2, Science City Rd, Sola, Ahmedabad, Gujarat 380060
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full h-px bg-slate-850" />

          {/* Footer Bottom Links */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-slate-500 font-semibold">
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
              <a href="#home" className="hover:text-white transition-colors">Home</a>
              <a href="#features" className="hover:text-white transition-colors">Features</a>
              <a href="#details" className="hover:text-white transition-colors">How It Works</a>
              <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
              <a href="#reviews" className="hover:text-white transition-colors">Reviews</a>
            </div>
            
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[10px]">
              <a href="https://www.truckbilty.com/terms-and-conditions" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Terms & Conditions</a>
              <a href="https://www.truckbilty.com/privacy-policy" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="https://www.truckbilty.com/refund-policy" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Refund Policy</a>
              <a href="https://www.truckbilty.com/account-deletion" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Account Deletion</a>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-900 text-[10px] text-slate-650 font-semibold">
            <p>© {new Date().getFullYear()} TruckBilty. All rights reserved.</p>
            <p>Designed and Developed by <a href="https://challengetechnolabs.com/" target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:text-indigo-300">Challenge Technolabs</a></p>
          </div>
        </div>
      </footer>
    </div>
  );
}
