"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HelpCircle, Search, ChevronDown, MessageSquare, Video, BookOpen, AlertTriangle, Ticket, Plus } from "lucide-react";

const FAQ_DATA = [
  { q: "How do I create a bilty?", a: "Go to Bilty → Create Bilty. Fill in the route, vehicle, parties, and freight details in the 4-step wizard.", cat: "Bilty" },
  { q: "How to generate a GST invoice?", a: "Navigate to Invoices → New Invoice. Select FREIGHT type, add the bilties, and the system will calculate GST automatically.", cat: "Invoice" },
  { q: "Can I add multiple branches?", a: "Yes! Go to Admin → Branches. You can create unlimited branches based on your subscription plan.", cat: "Administration" },
  { q: "How to export reports to Excel?", a: "In the Reports section, apply your filters and click the 'Export Excel' button in the top right.", cat: "Reports" },
  { q: "How do I track vehicle insurance expiry?", a: "The Vehicles master shows insurance expiry dates with color-coded alerts. Red = expired, Yellow = expiring in 30 days.", cat: "Vehicles" },
  { q: "Can multiple users access the system?", a: "Yes, you can add multiple users with different roles (Admin, Manager, Staff) from Admin → Users.", cat: "Users" },
  { q: "How to upload POD documents?", a: "Open any bilty and click 'Upload POD'. The document will be stored and linked to the bilty.", cat: "Bilty" },
];

export default function SupportPage() {
  const [tab, setTab] = useState<"faq" | "ticket" | "tutorials">("faq");
  const [search, setSearch] = useState("");
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  const [ticketForm, setTicketForm] = useState({ subject: "", category: "General", priority: "MEDIUM", description: "" });
  const [ticketSubmitted, setTicketSubmitted] = useState(false);

  const filteredFAQs = FAQ_DATA.filter(f =>
    !search || f.q.toLowerCase().includes(search.toLowerCase()) || f.a.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex-between">
        <div>
          <h1 className="page-title flex items-center gap-2"><HelpCircle className="w-5 h-5 text-cyan-400" />Support Center</h1>
          <p className="page-subtitle">Get help, tutorials, and contact support</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-white/5 rounded-xl border border-white/10 w-fit">
        {[
          { id: "faq", label: "FAQ", icon: HelpCircle },
          { id: "tutorials", label: "Tutorials", icon: Video },
          { id: "ticket", label: "Open Ticket", icon: Ticket },
        ].map(({ id, label, icon: Icon }) => (
          <button key={id} onClick={() => setTab(id as any)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${tab === id ? "bg-white/10 text-white" : "text-white/40 hover:text-white/60"}`}>
            <Icon className="w-3.5 h-3.5" />{label}
          </button>
        ))}
      </div>

      {tab === "faq" && (
        <div className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search FAQs..." className="input-base pl-9" />
          </div>

          {/* FAQ Accordion */}
          <div className="space-y-2">
            {filteredFAQs.map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.04 }}
                className="glass-card overflow-hidden"
              >
                <button
                  onClick={() => setOpenFAQ(openFAQ === i ? null : i)}
                  className="w-full flex items-start justify-between gap-4 p-4 text-left"
                >
                  <div className="flex items-start gap-3 flex-1">
                    <span className="badge badge-blue text-[10px] mt-0.5 flex-shrink-0">{faq.cat}</span>
                    <span className="font-medium text-white/90 text-sm">{faq.q}</span>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-white/30 flex-shrink-0 mt-0.5 transition-transform ${openFAQ === i ? "rotate-180" : ""}`} />
                </button>
                <AnimatePresence>
                  {openFAQ === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 pb-4 ml-[72px] text-sm text-white/50 leading-relaxed">{faq.a}</div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {tab === "tutorials" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { title: "Getting Started with TruckBilty", duration: "5:24", thumb: "🚛", desc: "Complete setup and first bilty creation" },
            { title: "Creating and Managing Bilties", duration: "8:12", thumb: "📋", desc: "Learn the full bilty workflow" },
            { title: "Invoice Generation with GST", duration: "6:45", thumb: "🧾", desc: "Generate GST compliant invoices" },
            { title: "Fleet Management & Vehicle Alerts", duration: "4:30", thumb: "🚚", desc: "Track vehicles and expiry dates" },
            { title: "Reports & Analytics Deep Dive", duration: "10:15", thumb: "📊", desc: "Generate and export reports" },
            { title: "User Management & Roles", duration: "3:55", thumb: "👥", desc: "Set up users and permissions" },
          ].map((video, i) => (
            <motion.div
              key={video.title}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className="glass-card overflow-hidden group cursor-pointer hover:border-brand-500/20 transition-all"
            >
              <div className="h-36 bg-gradient-to-br from-brand-900/50 to-dark-800 flex-center text-5xl border-b border-white/10 relative">
                {video.thumb}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex-center">
                  <div className="w-12 h-12 rounded-full bg-white/10 opacity-0 group-hover:opacity-100 transition-all flex-center border border-white/20">
                    <Video className="w-5 h-5 text-white" />
                  </div>
                </div>
                <span className="absolute bottom-2 right-2 text-xs bg-black/60 text-white px-2 py-0.5 rounded">{video.duration}</span>
              </div>
              <div className="p-4">
                <h4 className="font-semibold text-white text-sm group-hover:text-brand-300 transition-colors">{video.title}</h4>
                <p className="text-xs text-white/40 mt-1">{video.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {tab === "ticket" && (
        <div className="glass-card p-6 max-w-2xl">
          {ticketSubmitted ? (
            <div className="text-center py-10">
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex-center mx-auto mb-4">
                <Ticket className="w-8 h-8 text-emerald-400" />
              </div>
              <h3 className="font-semibold text-white text-lg mb-2">Ticket Submitted!</h3>
              <p className="text-white/40 text-sm">We'll respond to your ticket within 24 hours. You'll receive an email notification.</p>
              <button onClick={() => setTicketSubmitted(false)} className="btn-secondary mt-4">Submit Another</button>
            </div>
          ) : (
            <>
              <h3 className="font-semibold text-white mb-1">Open Support Ticket</h3>
              <p className="text-sm text-white/40 mb-5">Describe your issue and our team will get back to you</p>
              <div className="space-y-4">
                <div>
                  <label className="label-base">Subject *</label>
                  <input value={ticketForm.subject} onChange={(e) => setTicketForm({ ...ticketForm, subject: e.target.value })} placeholder="Brief description of your issue" className="input-base" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label-base">Category</label>
                    <select value={ticketForm.category} onChange={(e) => setTicketForm({ ...ticketForm, category: e.target.value })} className="select-base">
                      {["General", "Billing", "Technical", "Feature Request", "Bug Report"].map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="label-base">Priority</label>
                    <select value={ticketForm.priority} onChange={(e) => setTicketForm({ ...ticketForm, priority: e.target.value })} className="select-base">
                      {["LOW", "MEDIUM", "HIGH", "URGENT"].map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="label-base">Description *</label>
                  <textarea value={ticketForm.description} onChange={(e) => setTicketForm({ ...ticketForm, description: e.target.value })} rows={5} placeholder="Please describe your issue in detail..." className="input-base resize-none" />
                </div>
                <button
                  onClick={() => { if (ticketForm.subject && ticketForm.description) setTicketSubmitted(true); }}
                  className="btn-primary w-full py-3"
                >
                  <MessageSquare className="w-4 h-4" /> Submit Ticket
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
