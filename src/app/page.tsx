"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Truck, Shield, Zap, Globe, FileText, CheckCircle, TrendingUp, Users,
  Check, ArrowRight, Clock, Smartphone, Play, Building2, MapPin, Receipt
} from "lucide-react";
import { motion, Variants } from "framer-motion";
import Navbar from "@/components/landing/Navbar";
import InteractiveShowcase from "@/components/landing/InteractiveShowcase";

export default function HomePage() {
  const [isAnnual, setIsAnnual] = useState(false);

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
    <div className="min-h-screen bg-dark-950 text-white selection:bg-brand-500/30 overflow-x-hidden" id="home">
      {/* Background Gradients & Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-[-10%] left-[20%] w-[500px] h-[500px] bg-brand-500/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute top-[10%] right-[10%] w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: "2s" }} />
      </div>

      {/* Navigation Header */}
      <Navbar />

      {/* ── HERO SECTION ── */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Hero Left Content */}
          <div className="lg:col-span-6 flex flex-col items-center lg:items-start text-center lg:text-left space-y-6">
            {/* Promo Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-brand-500/20 bg-brand-500/5 text-brand-300 text-xs font-semibold"
            >
              <Zap className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              Next-Gen Transport Management System (TMS)
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1] text-white"
            >
              Digitize Your Fleet.<br />
              <span className="gradient-text">Streamline Logistics.</span>
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-white/50 text-base sm:text-lg max-w-xl leading-relaxed"
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
                className="w-full sm:w-auto btn-primary py-3.5 px-8 text-base shadow-lg shadow-brand-500/20 flex items-center justify-center gap-2"
              >
                <span>Get Started Free</span>
                <ArrowRight className="w-4.5 h-4.5" />
              </Link>
              <a
                href="#features"
                className="w-full sm:w-auto btn-secondary py-3.5 px-8 text-base flex items-center justify-center gap-2 hover:bg-white/5"
              >
                <Play className="w-4.5 h-4.5 text-brand-400" />
                <span>See Features</span>
              </a>
            </motion.div>

            {/* Trust Mini stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex items-center gap-6 pt-4 border-t border-white/5 w-full justify-center lg:justify-start"
            >
              {[
                { value: "10K+", label: "Transporters" },
                { value: "500K+", label: "Bilties Created" },
                { value: "99.9%", label: "System Uptime" },
              ].map((stat, i) => (
                <div key={i} className="text-center lg:text-left">
                  <div className="text-lg font-bold text-white">{stat.value}</div>
                  <div className="text-xs text-white/30 mt-0.5">{stat.label}</div>
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
              className="relative w-full max-w-lg aspect-square lg:aspect-auto lg:h-[450px]"
            >
              {/* Core Screen Mockup */}
              <div className="w-full h-full bg-gradient-to-tr from-dark-900 to-dark-950 border border-white/10 rounded-2xl p-4 shadow-2xl relative overflow-hidden flex flex-col">
                {/* Background layout mock elements */}
                <div className="flex items-center justify-between border-b border-white/5 pb-3 mb-4">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-white/10" />
                    <span className="w-2.5 h-2.5 rounded-full bg-white/10" />
                    <span className="w-2.5 h-2.5 rounded-full bg-white/10" />
                  </div>
                  <div className="w-32 h-3.5 rounded bg-white/5" />
                  <div className="w-8 h-3.5 rounded bg-white/5" />
                </div>
                {/* Simulated charts/metrics grid */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-white/2 border border-white/5 p-4 rounded-xl flex flex-col justify-between h-28 relative overflow-hidden">
                    <div className="text-[10px] text-white/40 uppercase font-semibold">Active Trips</div>
                    <div className="text-2xl font-black text-white mt-1">142</div>
                    <div className="text-[9px] text-green-400 mt-1 flex items-center gap-0.5">
                      <span>↑ 12.4% vs last week</span>
                    </div>
                  </div>
                  <div className="bg-white/2 border border-white/5 p-4 rounded-xl flex flex-col justify-between h-28 relative overflow-hidden">
                    <div className="text-[10px] text-white/40 uppercase font-semibold">Pending PODs</div>
                    <div className="text-2xl font-black text-amber-400 mt-1">18</div>
                    <div className="text-[9px] text-white/30 mt-1">Needs verification</div>
                  </div>
                </div>
                {/* Bottom detail card */}
                <div className="flex-1 bg-white/2 border border-white/5 p-4 rounded-xl flex flex-col justify-between relative overflow-hidden">
                  <div className="flex justify-between items-center text-xs border-b border-white/5 pb-2">
                    <span className="font-semibold text-white">Live Lorry Locations</span>
                    <span className="text-[10px] text-brand-400 font-bold">Map View</span>
                  </div>
                  <div className="flex-1 flex flex-col justify-center gap-2.5 mt-2">
                    {[
                      { reg: "DL-01-GB-8204", route: "New Delhi → Mumbai", progress: 75, status: "On Time" },
                      { reg: "HR-55-A-9012", route: "Delhi → Jaipur", progress: 40, status: "Delayed" },
                    ].map((v) => (
                      <div key={v.reg} className="space-y-1">
                        <div className="flex justify-between text-[10px]">
                          <span className="font-mono text-white/80">{v.reg} ({v.route})</span>
                          <span className={v.status === "On Time" ? "text-green-400" : "text-amber-400"}>{v.status}</span>
                        </div>
                        <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full bg-gradient-to-r ${
                              v.status === "On Time" ? "from-brand-500 to-neon-blue" : "from-amber-500 to-amber-600"
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
                className="absolute -top-6 -left-6 bg-dark-900 border border-white/10 p-3.5 rounded-2xl shadow-xl flex items-center gap-3 z-10"
              >
                <div className="w-8 h-8 rounded-lg bg-green-500/10 border border-green-500/20 flex-center">
                  <Globe className="w-4 h-4 text-green-400" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">Instant WhatsApp</div>
                  <div className="text-[9px] text-white/40">1-click Bilty Share</div>
                </div>
              </motion.div>

              {/* Floating Badge 2: Revenue */}
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute -bottom-6 -right-6 bg-dark-900 border border-white/10 p-3.5 rounded-2xl shadow-xl flex items-center gap-3 z-10"
              >
                <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/20 flex-center">
                  <TrendingUp className="w-4 h-4 text-purple-400" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">₹12.4L Invoiced</div>
                  <div className="text-[9px] text-white/40">This Month Sales</div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── FEATURES SECTION ── */}
      <section id="features" className="py-20 md:py-28 border-t border-white/5 relative bg-dark-900/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
              Powerful Features built for <span className="gradient-text">Modern Transporters</span>
            </h2>
            <p className="text-white/50 text-base">
              Everything you need to run, track, and scale your logistics and transport company without messy paperwork.
            </p>
          </div>

          {/* Features Grid */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {[
              {
                icon: FileText,
                title: "Lorry Receipt (Bilty)",
                desc: "Create GST-compliant Lorries Receipt (LR) with automated weight, quantity, consignee details, and print options.",
                color: "text-brand-400 bg-brand-500/10 border-brand-500/20",
              },
              {
                icon: Receipt,
                title: "GST Invoicing",
                desc: "Generate professional tax invoices instantly from bilties. Auto-calculates CGST, SGST, IGST, and freight settings.",
                color: "text-purple-400 bg-purple-500/10 border-purple-500/20",
              },
              {
                icon: Truck,
                title: "Fleet Operations",
                desc: "Monitor vehicle records, registration renewal alerts, driver licensing information, and loading availability.",
                color: "text-amber-400 bg-amber-500/10 border-amber-500/20",
              },
              {
                icon: Shield,
                title: "Role-Based Access",
                desc: "Add multiple branches and set custom user roles. Allow employees to access specific billing or fleet data.",
                color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
              },
              {
                icon: Clock,
                title: "Real-time Tracking",
                desc: "Add tracking statuses to your vehicles. Keep consignors updated about exact location and ETA automatically.",
                color: "text-rose-400 bg-rose-500/10 border-rose-500/20",
              },
              {
                icon: Smartphone,
                title: "Mobile Friendly Layout",
                desc: "Access your dashboard from your phone, laptop, or tablet. Easy-to-use layouts built for on-the-go transport managers.",
                color: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20",
              },
              {
                icon: Building2,
                title: "Multi-Company & Branch",
                desc: "Manage multiple transportation business entities and remote branch offices under one subscription.",
                color: "text-indigo-400 bg-indigo-500/10 border-indigo-500/20",
              },
              {
                icon: Users,
                title: "Party Ledger Book",
                desc: "Maintain neat accounts for your regular clients (consignors and consignees) with printable outstanding bills.",
                color: "text-teal-400 bg-teal-500/10 border-teal-500/20",
              },
            ].map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={idx}
                  variants={itemVariants}
                  className="glass-card p-6 border border-white/5 rounded-2xl flex flex-col justify-between hover:scale-[1.02] transition-all duration-300"
                >
                  <div className="space-y-4">
                    <div className={`w-11 h-11 rounded-xl flex-center border ${feature.color}`}>
                      <Icon className="w-5.5 h-5.5" />
                    </div>
                    <h3 className="text-lg font-bold text-white">{feature.title}</h3>
                    <p className="text-xs text-white/40 leading-relaxed">{feature.desc}</p>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* ── INTERACTIVE WORK SHOWCASE SECTION ── */}
      <section className="py-20 md:py-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-white/5">
        <div className="text-center max-w-2xl mx-auto space-y-4 mb-14">
          <span className="text-[10px] tracking-widest font-black uppercase text-brand-400 bg-brand-500/10 px-3 py-1 rounded-full border border-brand-500/20">
            Interactive Tour
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
            See TruckBilty in <span className="gradient-text">Action</span>
          </h2>
          <p className="text-white/50 text-sm">
            Toggle between core modules below to explore our clean, high-performance web interface.
          </p>
        </div>
        <InteractiveShowcase />
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how-it-works" className="py-20 md:py-28 border-t border-white/5 bg-dark-900/40 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-20">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
              Get Started in <span className="gradient-text">3 Simple Steps</span>
            </h2>
            <p className="text-white/50 text-base">
              Say goodbye to registry books and manual typing. Get set up in less than 5 minutes.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12 md:gap-8 relative">
            {/* Timeline connection bar (Desktop only) */}
            <div className="hidden md:block absolute top-12 left-1/6 right-1/6 h-0.5 bg-gradient-to-r from-brand-500 to-purple-600 opacity-20 -z-10" />

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
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-500 to-purple-600 flex-center font-black text-xl text-white shadow-xl shadow-brand-500/10 border border-white/10 relative">
                  {stepItem.step}
                  <div className="absolute -inset-1 rounded-2xl bg-white/5 -z-10 blur" />
                </div>
                <h3 className="text-lg font-bold text-white pt-2">{stepItem.title}</h3>
                <p className="text-xs text-white/40 max-w-xs leading-relaxed">{stepItem.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING SECTION ── */}
      <section id="pricing" className="py-20 md:py-28 border-t border-white/5 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-5 mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white font-black">
            Simple, Transparent <span className="gradient-text">Pricing</span>
          </h2>
          <p className="text-white/50 text-base">
            No hidden setup fees. All plans include standard Bilty and Invoice modules.
          </p>

          {/* Pricing Toggle */}
          <div className="flex items-center justify-center gap-3 pt-3">
            <span className={`text-xs font-semibold ${!isAnnual ? "text-white" : "text-white/40"}`}>Monthly</span>
            <button
              onClick={() => setIsAnnual(!isAnnual)}
              className="w-11 h-6 rounded-full bg-white/10 hover:bg-white/15 p-1 transition-colors relative flex items-center"
              aria-label="Toggle pricing structure"
            >
              <div
                className={`w-4 h-4 rounded-full bg-brand-500 transition-all duration-300 ${
                  isAnnual ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
            <span className={`text-xs font-semibold ${isAnnual ? "text-white" : "text-white/40"} flex items-center gap-1.5`}>
              Annual <span className="px-2 py-0.5 rounded-full text-[9px] bg-green-500/10 border border-green-500/20 text-green-400 font-bold uppercase">Save 20%</span>
            </span>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {[
            {
              name: "Starter",
              price: isAnnual ? "₹799" : "₹999",
              period: "/month",
              desc: "Great for single-truck owners and small cargo brokers.",
              features: [
                "Up to 20 Bilties/month",
                "Up to 10 Tax Invoices/month",
                "1 User Account",
                "Single Branch Office",
                "WhatsApp Sharing",
                "Standard Email Support",
              ],
              popular: false,
              color: "border-white/5",
              btnStyle: "btn-secondary text-white",
            },
            {
              name: "Growth",
              price: isAnnual ? "₹1,999" : "₹2,499",
              period: "/month",
              desc: "Perfect for active transporters and growing logistics firms.",
              features: [
                "Unlimited Bilties & LRs",
                "Unlimited GST Invoices",
                "Up to 5 User Accounts",
                "Up to 3 Branches",
                "Complete Fleet Registry",
                "Driver Licensing Alerts",
                "Priority WhatsApp Support",
              ],
              popular: true,
              color: "border-brand-500/30 bg-gradient-to-b from-brand-500/5 to-transparent",
              btnStyle: "btn-primary",
            },
            {
              name: "Enterprise",
              price: "Custom",
              period: "",
              desc: "For large scale third-party logistics (3PL) organizations.",
              features: [
                "Everything in Growth",
                "Unlimited User Accounts",
                "Unlimited Branches & Hubs",
                "API Integrations for ERP",
                "Custom Print Out Templates",
                "Dedicated Account Manager",
                "99.9% Uptime SLA",
              ],
              popular: false,
              color: "border-white/5",
              btnStyle: "btn-secondary text-white",
            },
          ].map((plan) => (
            <div
              key={plan.name}
              className={`glass-card p-8 border rounded-2xl flex flex-col justify-between relative ${plan.color}`}
            >
              {plan.popular && (
                <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-[9px] bg-brand-500 text-white font-bold tracking-widest uppercase border border-brand-400/20 shadow-md">
                  Most Popular
                </span>
              )}
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-white">{plan.name}</h3>
                  <p className="text-xs text-white/40 mt-1">{plan.desc}</p>
                </div>
                <div className="flex items-baseline">
                  <span className="text-3xl font-black text-white">{plan.price}</span>
                  <span className="text-xs text-white/30 ml-1">{plan.period}</span>
                </div>
                <div className="w-full h-px bg-white/5" />
                <ul className="space-y-3.5">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-xs text-white/70">
                      <Check className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="pt-8">
                <Link
                  href="/register"
                  className={`w-full py-3 text-xs font-semibold ${plan.btnStyle} transition-all duration-300 text-center rounded-xl flex items-center justify-center`}
                >
                  {plan.name === "Enterprise" ? "Contact Sales" : "Start Free 7-Day Trial"}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── BOTTOM CALL TO ACTION (CTA) ── */}
      <section className="py-20 border-t border-white/5 relative overflow-hidden bg-gradient-to-b from-transparent to-dark-900">
        <div className="absolute inset-0 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.02] pointer-events-none" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6 relative z-10">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight">
            Stop Typing, Start <span className="gradient-text">Transporting</span>
          </h2>
          <p className="text-white/50 text-base max-w-xl mx-auto leading-relaxed">
            Join thousands of transport managers who save up to 12 hours a week using TruckBilty for documentation and billing.
          </p>
          <div className="flex justify-center pt-2">
            <Link
              href="/register"
              className="btn-primary py-4 px-8 text-base shadow-xl shadow-brand-500/25 hover:-translate-y-0.5 transition-all flex items-center gap-2"
            >
              <span>Launch Your Account</span>
              <ArrowRight className="w-4.5 h-4.5" />
            </Link>
          </div>
          <p className="text-[11px] text-white/30 font-medium">No credit card required • Instant setup</p>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-white/5 py-12 bg-dark-950 text-white/50 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center">
              <Truck className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-bold text-white text-sm">
              Truck<span className="gradient-text">Bilty</span>
            </span>
          </div>
          <div className="flex items-center gap-6">
            <a href="#home" className="hover:text-white transition-colors">Home</a>
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
          </div>
          <div>
            <p className="text-white/20">© {new Date().getFullYear()} TruckBilty. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
