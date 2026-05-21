"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { motion } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Truck, ShieldCheck, ArrowLeft, RefreshCw, Mail, CheckCircle2 } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import axios from "axios";

function VerifyOtpForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailParam = searchParams.get("email") || "";
  const phoneParam = searchParams.get("phone") || "";
  const { login } = useAuthStore();

  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const [email, setEmail] = useState(emailParam);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);

  const inputRefs = useRef<HTMLInputElement[]>([]);

  // Count down timer for OTP Resend
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else {
      setCanResend(true);
    }
  }, [timer]);

  // Handle typing inside 6 OTP boxes
  const handleChange = (index: number, value: string) => {
    if (isNaN(Number(value))) return;
    const newOtp = [...otp];
    // Keep only the last character if pasted/typed multiple
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      // Focus previous input on backspace if current is empty
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").trim();
    if (pastedData.length === 6 && !isNaN(Number(pastedData))) {
      const newOtp = pastedData.split("");
      setOtp(newOtp);
      inputRefs.current[5]?.focus();
    }
  };

  const handleResend = async () => {
    if (!canResend) return;
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      await axios.post("/api/auth/send-otp", { email });
      setSuccess("A new verification code has been sent!");
      setTimer(60);
      setCanResend(false);
      setOtp(Array(6).fill(""));
      inputRefs.current[0]?.focus();
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to resend code.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpCode = otp.join("");
    if (otpCode.length < 6) {
      setError("Please enter the full 6-digit code.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const { data } = await axios.post("/api/auth/verify-otp", {
        email,
        otp: otpCode,
      });

      setSuccess("Account verified successfully! Redirecting...");
      setTimeout(() => {
        login(data.user, data.token);
        router.replace("/dashboard");
      }, 1500);
    } catch (err: any) {
      setError(err.response?.data?.error || "Invalid verification code.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-card p-8">
      <div className="mb-6 text-center">
        <div className="w-12 h-12 rounded-full bg-brand-500/10 border border-brand-500/20 flex-center mx-auto mb-4">
          <ShieldCheck className="w-6 h-6 text-brand-400" />
        </div>
        <h2 className="text-xl font-bold text-white">Security Verification</h2>
        <p className="text-white/40 text-sm mt-1">
          We have sent a 6-digit verification code to your mobile number
        </p>
        <p className="text-brand-400 text-sm font-medium mt-0.5">
          {phoneParam ? `+91 ${phoneParam.replace(/\D/g, "").slice(-10)}` : "your registered phone"}
        </p>
      </div>

      {error && (
        <div className="p-3.5 rounded-xl border border-red-500/20 bg-red-500/10 text-red-400 text-sm mb-6">
          {error}
        </div>
      )}

      {success && (
        <div className="p-3.5 rounded-xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-400 text-sm mb-6 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* OTP Input Fields */}
        <div className="flex justify-between gap-2.5">
          {otp.map((digit, idx) => (
            <input
              key={idx}
              ref={(el) => {
                if (el) inputRefs.current[idx] = el;
              }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(idx, e.target.value)}
              onKeyDown={(e) => handleKeyDown(idx, e)}
              onPaste={idx === 0 ? handlePaste : undefined}
              className="w-12 h-14 bg-white/5 border border-white/10 rounded-xl text-center text-xl font-bold text-white focus:outline-none focus:border-brand-500 focus:bg-brand-500/5 transition-all"
            />
          ))}
        </div>

        <button
          type="submit"
          disabled={loading || otp.join("").length < 6}
          className="btn-primary w-full py-3 text-sm font-semibold rounded-xl"
        >
          {loading ? "Verifying..." : "Verify Code"}
        </button>
      </form>

      <div className="mt-6 text-center space-y-4">
        <div className="text-xs text-white/40">
          Didn't receive the code?{" "}
          {canResend ? (
            <button
              onClick={handleResend}
              disabled={loading}
              className="text-brand-400 hover:text-brand-300 font-semibold transition-colors inline-flex items-center gap-1 focus:outline-none"
            >
              <RefreshCw className="w-3 h-3" /> Resend Code
            </button>
          ) : (
            <span>
              Resend in <strong className="text-white/60 font-semibold">{timer}s</strong>
            </span>
          )}
        </div>

        <Link
          href="/login"
          className="inline-flex items-center gap-1.5 text-xs text-white/30 hover:text-white/50 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Login
        </Link>
      </div>
    </div>
  );
}

export default function VerifyOtpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-dark-900">
      <div
        className="absolute inset-0 opacity-20 animate-pulse-slow"
        style={{
          backgroundImage: `radial-gradient(circle at 30% 20%, rgba(59,130,246,0.3) 0%, transparent 50%),
                            radial-gradient(circle at 70% 80%, rgba(139,92,246,0.2) 0%, transparent 50%)`,
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

        <Suspense fallback={
          <div className="glass-card p-8 flex-center flex-col gap-4">
            <RefreshCw className="w-8 h-8 text-brand-500 animate-spin" />
            <p className="text-white/40 text-sm">Loading security verification...</p>
          </div>
        }>
          <VerifyOtpForm />
        </Suspense>
      </motion.div>
    </div>
  );
}
