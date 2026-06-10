"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Truck, Eye, EyeOff, ArrowRight, ShieldCheck, Mail, KeyRound } from "lucide-react";
import axios from "axios";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [identifier, setIdentifier] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleRequestOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim()) {
      setError("Please enter your email or phone number.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await axios.post("/api/auth/forgot-password/request", { identifier });
      setStep(2);
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to send verification code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp.trim()) {
      setError("Please enter the 6-digit OTP code.");
      return;
    }
    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const { data } = await axios.post("/api/auth/forgot-password/reset", {
        identifier,
        otp,
        newPassword,
      });
      setSuccessMsg(data.message || "Your password has been reset successfully.");
      setStep(3);
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to reset password. Please verify the code and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-dark-900">
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage: `radial-gradient(circle at 30% 20%, rgba(11,67,149,0.06) 0%, transparent 50%),
                            radial-gradient(circle at 70% 80%, rgba(244,115,33,0.03) 0%, transparent 50%)`,
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-md"
      >
        {/* Logo */}
        <Link href="/" className="flex items-center justify-center gap-3 mb-8 hover:opacity-90 transition-opacity cursor-pointer group">
          <div className="w-10 h-10 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
            <img src="/logo.png" alt="PrimeBilty Logo" className="w-10 h-10 object-contain" />
          </div>
          <span className="font-bold text-brand-500 text-xl">Prime<span className="text-purple-500">Bilty</span></span>
        </Link>

        <div className="glass-card p-8">
          {/* Progress / Step indicator */}
          <div className="flex items-center gap-2 mb-6">
            {[1, 2].map((s) => (
              <div key={s} className="flex items-center gap-2 flex-1">
                <div className={`w-6 h-6 rounded-full flex-center text-xs font-bold transition-all ${s <= step ? "bg-brand-500 text-white" : "bg-slate-100 text-slate-400"}`}>{s}</div>
                <div className={`flex-1 h-0.5 rounded transition-all ${s < step ? "bg-brand-500" : "bg-slate-100"}`} />
              </div>
            ))}
            <div className={`w-6 h-6 rounded-full flex-center text-xs font-bold transition-all ${step === 3 ? "bg-brand-500 text-white" : "bg-slate-100 text-slate-400"}`}>✓</div>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-bold text-slate-800">
              {step === 1 && "Forgot Password?"}
              {step === 2 && "Reset Password"}
              {step === 3 && "All Done!"}
            </h2>
            <p className="text-slate-500 text-sm mt-1">
              {step === 1 && "Enter your email or phone number and we'll send you an OTP code to reset your password."}
              {step === 2 && `We've sent a 6-digit OTP code to your registered details.`}
              {step === 3 && "Your password has been updated. You can now log in."}
            </p>
          </div>

          {error && (
            <div className="mb-4 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-500 text-sm">
              {error}
            </div>
          )}

          {step === 1 && (
            <form onSubmit={handleRequestOTP} className="space-y-4">
              <div>
                <label className="label-base">Email or Phone Number</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="Enter email or mobile number"
                    className="input-base pl-9"
                    required
                  />
                </div>
              </div>
              <button type="submit" disabled={loading} className="btn-primary w-full py-3 disabled:opacity-60">
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>Send OTP Code <ArrowRight className="w-4 h-4" /></>
                )}
              </button>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div>
                <label className="label-base">6-Digit OTP Code</label>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.slice(0, 6))}
                    placeholder="Enter 6-digit OTP"
                    className="input-base pl-9 tracking-widest font-semibold"
                    required
                    maxLength={6}
                  />
                </div>
              </div>

              <div>
                <label className="label-base">New Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Min. 6 characters"
                    className="input-base pr-10"
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="label-base">Confirm New Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat new password"
                  className="input-base"
                  required
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="btn-secondary flex-1 py-3"
                  disabled={loading}
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary flex-1 py-3 disabled:opacity-60"
                >
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    "Reset Password"
                  )}
                </button>
              </div>
            </form>
          )}

          {step === 3 && (
            <div className="space-y-6 text-center">
              <div className="flex justify-center">
                <div className="w-16 h-16 rounded-full bg-brand-50 border border-brand-100 flex items-center justify-center">
                  <ShieldCheck className="w-8 h-8 text-brand-500" />
                </div>
              </div>
              <p className="text-brand-500 font-medium text-sm">{successMsg}</p>
              <button
                onClick={() => router.push("/login")}
                className="btn-primary w-full py-3"
              >
                Go to Sign In
              </button>
            </div>
          )}

          <p className="text-center text-sm text-slate-500 mt-6">
            Remembered your password?{" "}
            <Link href="/login" className="text-brand-500 hover:text-brand-600 font-medium transition-colors">
              Sign In
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
