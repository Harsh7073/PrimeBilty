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
      // If the email/phone verification is pending (status 403), redirect to the OTP page
      if (err.response?.status === 403 && err.response?.data?.verified === false) {
        const unverifiedEmail = err.response.data.email || form.email;
        const unverifiedPhone = err.response.data.phone || "";
        router.push(`/verify-otp?email=${encodeURIComponent(unverifiedEmail)}&phone=${encodeURIComponent(unverifiedPhone)}`);
        return;
      }
      setError(err.response?.data?.error || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setForm({ email: "admin@truckbilty.com", password: "demo123456" });
    setLoading(true);
    try {
      const { data } = await axios.post("/api/auth/login", { email: "admin@truckbilty.com", password: "demo123456" });
      login(data.user, data.token);
      router.push("/dashboard");
    } catch {
      // Demo user doesn't exist yet - redirect to register
      router.push("/register?demo=true");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex flex-col w-[52%] relative overflow-hidden bg-dark-950 p-12">
        {/* Background gradient */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-500/30 to-transparent" />
          <div
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage: `radial-gradient(circle at 30% 20%, rgba(59,130,246,0.3) 0%, transparent 50%),
                                radial-gradient(circle at 70% 80%, rgba(139,92,246,0.2) 0%, transparent 50%)`,
            }}
          />
          {/* Grid pattern */}
          <div
            className="absolute inset-0 opacity-5"
            style={{
              backgroundImage: `linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)`,
              backgroundSize: "48px 48px",
            }}
          />
        </div>

        <div className="relative z-10 flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl flex-center" style={{ background: "linear-gradient(135deg, #3b82f6, #6366f1)" }}>
              <Truck className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="font-bold text-white text-lg">TruckBilty</div>
              <div className="text-xs text-white/30">Enterprise TMS</div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 flex flex-col justify-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-brand-500/20 bg-brand-500/10 text-brand-300 text-xs font-medium mb-6">
                <Zap className="w-3 h-3" />
                Enterprise Transport Management
              </div>
              <h1 className="text-4xl font-bold text-white leading-tight mb-4">
                Manage your fleet.<br />
                <span className="gradient-text">Scale your business.</span>
              </h1>
              <p className="text-white/40 text-base leading-relaxed max-w-sm">
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
                  <div className="w-7 h-7 rounded-lg bg-brand-500/10 border border-brand-500/20 flex-center flex-shrink-0">
                    <Icon className="w-3.5 h-3.5 text-brand-400" />
                  </div>
                  <span className="text-sm text-white/50">{text}</span>
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
              <div key={label} className="glass-card p-3 text-center">
                <div className="text-lg font-bold gradient-text">{value}</div>
                <div className="text-xs text-white/30 mt-0.5">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex-1 flex items-center justify-center p-6 bg-dark-900">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="w-9 h-9 rounded-xl flex-center" style={{ background: "linear-gradient(135deg, #3b82f6, #6366f1)" }}>
              <Truck className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-white text-lg">TruckBilty</span>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white">Welcome back</h2>
            <p className="text-white/40 text-sm mt-1">Sign in to your TruckBilty account</p>
          </div>

          {/* Error */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm"
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
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <div className="flex justify-end mt-1.5">
                <Link href="/forgot-password" className="text-xs text-brand-400 hover:text-brand-300 transition-colors">
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
              <div className="w-full border-t border-white/10" />
            </div>
            <div className="relative flex justify-center">
              <span className="px-3 text-xs text-white/25 bg-dark-900">or</span>
            </div>
          </div>

          <button
            onClick={handleDemoLogin}
            className="btn-secondary w-full py-3"
          >
            <Zap className="w-4 h-4 text-amber-400" />
            Try Demo Account
          </button>

          <p className="text-center text-sm text-white/40 mt-6">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-brand-400 hover:text-brand-300 font-medium transition-colors">
              Create free account
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
