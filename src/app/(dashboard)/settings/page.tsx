"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Settings, User, Lock, Bell, Mail, Phone, Globe, Shield, Palette, Webhook } from "lucide-react";
import { useAuthStore } from "@/store/authStore";

const TABS = [
  { id: "profile", label: "Profile", icon: User },
  { id: "security", label: "Security", icon: Lock },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "company", label: "Company", icon: Globe },
  { id: "integrations", label: "Integrations", icon: Webhook },
  { id: "theme", label: "Theme", icon: Palette },
];

export default function SettingsPage() {
  const { user } = useAuthStore();
  const [tab, setTab] = useState("profile");
  const [saved, setSaved] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState("theme-neon");

  useEffect(() => {
    const savedTheme = localStorage.getItem("tb_theme");
    if (savedTheme) setSelectedTheme(savedTheme);
  }, []);

  const handleSave = () => {
    if (tab === "theme") {
      localStorage.setItem("tb_theme", selectedTheme);
      document.body.className = `bg-dark-900 text-white antialiased ${selectedTheme}`;
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="page-title flex items-center gap-2"><Settings className="w-5 h-5 text-white/60" />Settings</h1>
        <p className="page-subtitle">Manage your account and platform settings</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
        {/* Sidebar */}
        <div className="glass-card p-3 h-fit">
          <nav className="space-y-0.5">
            {TABS.map(({ id, label, icon: Icon }) => (
              <button key={id} onClick={() => setTab(id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${tab === id ? "bg-brand-500/15 text-brand-300 border border-brand-500/20" : "text-white/40 hover:text-white/70 hover:bg-white/5"}`}>
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          <motion.div key={tab} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="glass-card p-6">
            {tab === "profile" && (
              <div className="space-y-5">
                <div>
                  <h3 className="font-semibold text-white mb-1">Profile Information</h3>
                  <p className="text-sm text-white/40">Update your personal details</p>
                </div>
                {/* Avatar */}
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-500 to-purple-600 flex-center text-2xl font-bold">
                    {user?.name?.charAt(0)?.toUpperCase()}
                  </div>
                  <div>
                    <button className="btn-secondary text-xs py-1.5">Change Avatar</button>
                    <p className="text-xs text-white/30 mt-1">JPG, PNG max 2MB</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label-base">Full Name</label>
                    <input defaultValue={user?.name} className="input-base" />
                  </div>
                  <div>
                    <label className="label-base">Email</label>
                    <input defaultValue={user?.email} type="email" className="input-base" />
                  </div>
                  <div>
                    <label className="label-base">Phone</label>
                    <input defaultValue={user?.phone || ""} type="tel" placeholder="+91 98765 43210" className="input-base" />
                  </div>
                  <div>
                    <label className="label-base">Role</label>
                    <input value={user?.roleName || ""} className="input-base opacity-50" readOnly />
                  </div>
                </div>
              </div>
            )}

            {tab === "security" && (
              <div className="space-y-5">
                <div>
                  <h3 className="font-semibold text-white mb-1">Security Settings</h3>
                  <p className="text-sm text-white/40">Manage your password and security preferences</p>
                </div>
                <div className="space-y-4 max-w-sm">
                  <div>
                    <label className="label-base">Current Password</label>
                    <input type="password" placeholder="Enter current password" className="input-base" />
                  </div>
                  <div>
                    <label className="label-base">New Password</label>
                    <input type="password" placeholder="Min. 6 characters" className="input-base" />
                  </div>
                  <div>
                    <label className="label-base">Confirm New Password</label>
                    <input type="password" placeholder="Repeat new password" className="input-base" />
                  </div>
                </div>
                <div className="divider" />
                <div>
                  <h4 className="text-sm font-medium text-white mb-3">Two-Factor Authentication</h4>
                  <div className="flex items-center justify-between p-4 rounded-xl border border-white/10 bg-white/5">
                    <div>
                      <div className="text-sm text-white/80">Enable 2FA</div>
                      <div className="text-xs text-white/30">Add extra layer of security via authenticator app</div>
                    </div>
                    <button className="btn-secondary text-xs">Enable</button>
                  </div>
                </div>
              </div>
            )}

            {tab === "notifications" && (
              <div className="space-y-5">
                <div>
                  <h3 className="font-semibold text-white mb-1">Notification Preferences</h3>
                  <p className="text-sm text-white/40">Control how and when you receive alerts</p>
                </div>
                <div className="space-y-3">
                  {[
                    { label: "New Bilty Created", desc: "When a new LR is created", key: "bilty" },
                    { label: "Invoice Due Reminder", desc: "3 days before invoice due date", key: "invoice" },
                    { label: "Vehicle Document Expiry", desc: "30 days before expiry", key: "vehicle" },
                    { label: "Payment Received", desc: "When payment is recorded", key: "payment" },
                    { label: "New User Added", desc: "When a team member joins", key: "user" },
                    { label: "System Alerts", desc: "Important system notifications", key: "system" },
                  ].map(({ label, desc, key }) => (
                    <div key={key} className="flex items-center justify-between p-4 rounded-xl border border-white/10 bg-white/5">
                      <div>
                        <div className="text-sm text-white/80">{label}</div>
                        <div className="text-xs text-white/30">{desc}</div>
                      </div>
                      <div className="flex gap-3">
                        {["Email", "SMS"].map((type) => (
                          <label key={type} className="flex items-center gap-1.5 text-xs text-white/40 cursor-pointer">
                            <input type="checkbox" defaultChecked className="w-3.5 h-3.5 accent-brand-500" />
                            {type}
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {tab === "company" && (
              <div className="space-y-5">
                <div>
                  <h3 className="font-semibold text-white mb-1">Company Settings</h3>
                  <p className="text-sm text-white/40">Update your company details</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2"><label className="label-base">Company Name</label><input defaultValue="My Transport Company" className="input-base" /></div>
                  <div><label className="label-base">GSTIN</label><input placeholder="22AAAAA0000A1Z5" className="input-base" /></div>
                  <div><label className="label-base">PAN</label><input placeholder="ABCDE1234F" className="input-base" /></div>
                  <div><label className="label-base">Phone</label><input type="tel" placeholder="+91 98765 43210" className="input-base" /></div>
                  <div><label className="label-base">Email</label><input type="email" placeholder="info@company.com" className="input-base" /></div>
                  <div className="col-span-2"><label className="label-base">Address</label><textarea rows={2} placeholder="Full address..." className="input-base resize-none" /></div>
                  <div><label className="label-base">City</label><input placeholder="Mumbai" className="input-base" /></div>
                  <div><label className="label-base">State</label><input placeholder="Maharashtra" className="input-base" /></div>
                </div>
              </div>
            )}

            {tab === "integrations" && (
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-white mb-1">Integrations</h3>
                  <p className="text-sm text-white/40">Connect third-party services</p>
                </div>
                {[
                  { name: "WhatsApp Business API", icon: "💬", desc: "Send notifications via WhatsApp", connected: false },
                  { name: "SMS Gateway", icon: "📱", desc: "SMS alerts via Twilio/TextLocal", connected: false },
                  { name: "SMTP Email", icon: "📧", desc: "Custom email sender configuration", connected: true },
                  { name: "Razorpay", icon: "💳", desc: "Payment gateway for subscriptions", connected: false },
                  { name: "Google Maps", icon: "🗺️", desc: "Route distance and GPS tracking", connected: false },
                  { name: "AWS S3", icon: "☁️", desc: "Cloud storage for documents", connected: false },
                ].map(({ name, icon, desc, connected }) => (
                  <div key={name} className="flex items-center justify-between p-4 rounded-xl border border-white/10 bg-white/5">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{icon}</span>
                      <div>
                        <div className="text-sm font-medium text-white">{name}</div>
                        <div className="text-xs text-white/30">{desc}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {connected && <span className="badge badge-green text-xs">Connected</span>}
                      <button className={connected ? "btn-secondary text-xs py-1.5" : "btn-primary text-xs py-1.5"}>{connected ? "Configure" : "Connect"}</button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {tab === "theme" && (
              <div className="space-y-5">
                <div>
                  <h3 className="font-semibold text-white mb-1">Theme Settings</h3>
                  <p className="text-sm text-white/40">Currently dark mode only. Light mode coming soon!</p>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: "theme-neon", name: "Dark Neon", preview: "bg-dark-900", accent: "bg-brand-500" },
                    { id: "theme-purple", name: "Dark Purple", preview: "bg-dark-900", accent: "bg-purple-500" },
                    { id: "theme-cyan", name: "Dark Cyan", preview: "bg-dark-900", accent: "bg-cyan-500" },
                  ].map(({ id, name, preview, accent }) => (
                    <div 
                      key={id} 
                      onClick={() => setSelectedTheme(id)}
                      className={`p-3 rounded-xl border cursor-pointer transition-all ${selectedTheme === id ? "border-brand-500/40 bg-brand-500/10" : "border-white/10 hover:border-white/10"}`}
                    >
                      <div className={`h-20 ${preview} rounded-lg mb-2 border border-white/10 p-2 flex flex-col gap-1`}>
                        <div className={`h-1.5 ${accent} rounded-full w-1/2`} />
                        <div className="h-1.5 bg-white/10 rounded-full w-3/4" />
                        <div className="h-1.5 bg-white/5 rounded-full w-2/3" />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-white/70">{name}</span>
                        {selectedTheme === id && <span className="badge badge-blue text-[10px]">Active</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Save Button */}
            <div className="flex items-center justify-end gap-3 mt-6 pt-5 border-t border-white/10">
              {saved && <span className="text-sm text-emerald-400 animate-fade-in">✓ Settings saved!</span>}
              <button onClick={handleSave} className="btn-primary">Save Changes</button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
