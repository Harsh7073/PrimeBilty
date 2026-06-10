"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Truck, Eye, EyeOff, ArrowRight, Shield, Zap, Globe } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import axios from "axios";

export default function LoginPage() {
  const router = useRouter();
  const { login, isAuthenticated } = useAuthStore();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isAuthenticated) router.replace("/dashboard");
  }, [isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const { data } = await axios.post("/api/auth/login", form);
      login(data.user, data.token);
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.response?.data?.error || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = () => {
    router.push("/register");
  };

  return (
    <div className="min-h-screen flex relative overflow-hidden bg-dark-950">
      {/* Full-Screen Truck Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-60"
        style={{
          backgroundImage: `url('/login_bg_truck.png')`,
        }}
      />
      {/* Ambient gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-r from-slate-50/90 via-slate-50/85 to-slate-50/90" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(11,67,149,0.12)_0%,transparent_50%)]" />

      {/* Left Panel - Branding */}
      <div className="hidden lg:flex flex-col w-[52%] relative z-10 p-12 justify-between bg-transparent">
        <div className="flex flex-col h-full">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity cursor-pointer group">
            <div className="w-10 h-10 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
              <img src="/logo.png" alt="PrimeBilty Logo" className="w-10 h-10 object-contain" />
            </div>
            <div>
              <div className="font-bold text-brand-500 text-lg">Prime<span className="text-purple-500">Bilty</span></div>
              <div className="text-xs text-slate-400">Enterprise TMS</div>
            </div>
          </Link>

          {/* Main Content */}
          <div className="flex-1 flex flex-col justify-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-brand-500/10 bg-brand-50 text-brand-500 text-xs font-medium mb-6">
                <Zap className="w-3 h-3" />
                Enterprise Transport Management
              </div>
              <h1 className="text-4xl font-bold text-slate-800 leading-tight mb-4">
                Manage your fleet.<br />
                <span className="bg-gradient-to-r from-brand-500 to-purple-500 bg-clip-text text-transparent">Scale your business.</span>
              </h1>
              <p className="text-slate-600 text-base leading-relaxed max-w-sm">
                The complete SaaS platform for transport companies. Create bilties, manage vehicles, generate invoices, and track everything in real-time.
              </p>
            </motion.div>

            {/* Feature Highlights */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-10 space-y-3"
            >
              {[
                { icon: Shield, text: "Role-based access control & multi-branch" },
                { icon: Globe, text: "GST compliant invoicing & bilty management" },
                { icon: Zap, text: "Real-time analytics & reporting dashboard" },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-lg bg-brand-50 border border-brand-100 flex-center flex-shrink-0">
                    <Icon className="w-3.5 h-3.5 text-brand-500" />
                  </div>
                  <span className="text-sm text-slate-600">{text}</span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: "Companies", value: "10K+" },
              { label: "Bilties/day", value: "50K+" },
              { label: "Uptime", value: "99.9%" },
            ].map(({ label, value }) => (
              <div key={label} className="backdrop-blur-md bg-white/60 border border-slate-200/60 p-3 text-center rounded-xl">
                <div className="text-lg font-bold bg-gradient-to-r from-brand-500 to-purple-500 bg-clip-text text-transparent">{value}</div>
                <div className="text-xs text-slate-400 mt-0.5">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex-1 flex items-center justify-center p-6 relative z-10 bg-transparent">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md backdrop-blur-xl bg-white/80 border border-slate-200/60 p-8 rounded-2xl shadow-xl"
        >
          {/* Mobile logo */}
          <Link href="/" className="lg:hidden flex items-center gap-3 mb-8 hover:opacity-90 transition-opacity cursor-pointer group">
            <div className="w-9 h-9 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
              <img src="/logo.png" alt="PrimeBilty Logo" className="w-9 h-9 object-contain" />
            </div>
            <span className="font-bold text-brand-500 text-lg">Prime<span className="text-purple-500">Bilty</span></span>
          </Link>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-slate-800">Welcome back</h2>
            <p className="text-slate-500 text-sm mt-1">Sign in to your PrimeBilty account</p>
          </div>

          {/* Error */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-500 text-sm"
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label-base">Email or Mobile Number</label>
              <input
                type="text"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="Enter email or mobile number"
                className="input-base"
                required
              />
            </div>

            <div>
              <label className="label-base">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="Enter your password"
                  className="input-base pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <div className="flex justify-end mt-1.5">
                <Link href="/forgot-password" className="text-xs text-brand-500 hover:text-brand-600 transition-colors">
                  Forgot password?
                </Link>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>Sign In <ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </form>

          <div className="relative my-5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center">
              <span className="px-3 text-xs text-slate-400 bg-white">or</span>
            </div>
          </div>

          <button
            onClick={handleDemoLogin}
            className="btn-secondary w-full py-3 bg-white/80 border border-slate-200 hover:bg-slate-50 text-slate-800"
          >
            <Zap className="w-4 h-4 text-purple-500" />
            Try Demo Account
          </button>

          <p className="text-center text-sm text-slate-500 mt-6">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-brand-500 hover:text-brand-600 font-medium transition-colors">
              Create free account
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
