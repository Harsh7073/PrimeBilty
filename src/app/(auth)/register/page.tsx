"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Truck, Eye, EyeOff, ArrowRight, Building2, User, Mail, Phone } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import axios from "axios";

export default function RegisterPage() {
  const router = useRouter();
  const { login, isAuthenticated } = useAuthStore();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "", confirmPassword: "", companyName: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isAuthenticated) router.replace("/dashboard");
  }, [isAuthenticated, router]);

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setError("");
    setStep(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const { data } = await axios.post("/api/auth/register", {
        name: form.name,
        email: form.email,
        phone: form.phone,
        password: form.password,
        companyName: form.companyName,
      });
      // Redirect to OTP verification page instead of logging in directly
      router.push(`/verify-otp?email=${encodeURIComponent(data.email || form.email)}&phone=${encodeURIComponent(data.phone || form.phone || "")}`);
    } catch (err: any) {
      setError(err.response?.data?.error || "Registration failed.");
      setStep(1);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-dark-900">
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `radial-gradient(circle at 30% 20%, rgba(59,130,246,0.4) 0%, transparent 50%),
                            radial-gradient(circle at 70% 80%, rgba(139,92,246,0.3) 0%, transparent 50%)`,
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-md"
      >
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-2xl flex-center" style={{ background: "linear-gradient(135deg, #3b82f6, #6366f1)" }}>
            <Truck className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-white text-xl">TruckBilty</span>
        </div>

        <div className="glass-card p-8">
          {/* Progress */}
          <div className="flex items-center gap-2 mb-6">
            {[1, 2].map((s) => (
              <div key={s} className="flex items-center gap-2 flex-1">
                <div className={`w-6 h-6 rounded-full flex-center text-xs font-bold transition-all ${s <= step ? "bg-brand-500 text-white" : "bg-white/10 text-white/30"}`}>{s}</div>
                <div className={`flex-1 h-0.5 rounded transition-all ${s < step ? "bg-brand-500" : "bg-white/10"}`} />
              </div>
            ))}
            <div className={`w-6 h-6 rounded-full flex-center text-xs font-bold transition-all ${2 <= step ? "bg-brand-500 text-white" : "bg-white/10 text-white/30"}`}>✓</div>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-bold text-white">
              {step === 1 ? "Create your account" : "Your company"}
            </h2>
            <p className="text-white/40 text-sm mt-1">
              {step === 1 ? "Fill in your personal details" : "Tell us about your transport company"}
            </p>
          </div>

          {error && (
            <div className="mb-4 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              {error}
            </div>
          )}

          {step === 1 ? (
            <form onSubmit={handleNext} className="space-y-4">
              <div>
                <label className="label-base">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                  <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="John Doe" className="input-base pl-9" required />
                </div>
              </div>
              <div>
                <label className="label-base">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                  <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="you@company.com" className="input-base pl-9" required />
                </div>
              </div>
              <div>
                <label className="label-base">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                  <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="+91 98765 43210" className="input-base pl-9" />
                </div>
              </div>
              <div>
                <label className="label-base">Password</label>
                <div className="relative">
                  <input type={showPassword ? "text" : "password"} value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    placeholder="Min. 6 characters" className="input-base pr-10" required minLength={6} />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div>
                <label className="label-base">Confirm Password</label>
                <input type="password" value={form.confirmPassword}
                  onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                  placeholder="Repeat password" className="input-base" required />
              </div>
              <button type="submit" className="btn-primary w-full py-3">
                Continue <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="label-base">Company Name</label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                  <input type="text" value={form.companyName} onChange={(e) => setForm({ ...form, companyName: e.target.value })}
                    placeholder="Your Transport Company" className="input-base pl-9" required />
                </div>
              </div>
              <div className="p-4 rounded-xl bg-brand-500/10 border border-brand-500/20">
                <p className="text-xs text-brand-300">🎉 You'll start with a <strong>14-day free trial</strong> with all features unlocked. No credit card required.</p>
              </div>
              <div className="flex gap-3">
                <button type="button" onClick={() => setStep(1)} className="btn-secondary flex-1 py-3">Back</button>
                <button type="submit" disabled={loading} className="btn-primary flex-1 py-3 disabled:opacity-60">
                  {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : "Create Account"}
                </button>
              </div>
            </form>
          )}

          <p className="text-center text-sm text-white/40 mt-6">
            Already have an account?{" "}
            <Link href="/login" className="text-brand-400 hover:text-brand-300 font-medium">Sign in</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
