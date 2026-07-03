"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { Scale, Phone, ShieldCheck, Loader2, ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState<string | null>(null);
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Check if already logged in, redirect to dashboard
  useEffect(() => {
    const user = localStorage.getItem("living_law_mock_user");
    if (user) {
      router.push("/dashboard");
    }
  }, [router]);

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    // Validate phone number format (simple check)
    const rawNum = phoneNumber.replace(/\D/g, "");
    if (rawNum.length < 10) {
      setError("Please enter a valid 10-digit mobile number.");
      return;
    }

    setLoading(true);

    setTimeout(() => {
      // Generate a mock 6-digit OTP
      const mockOtp = Math.floor(100000 + Math.random() * 900000).toString();
      setGeneratedOtp(mockOtp);
      setLoading(false);
      setStep("otp");
      
      // Visual feedback showing simulated SMS delivery
      setSuccessMessage(`OTP sent successfully to +91 ${rawNum.slice(-10)}`);
      
      // Auto-trigger an alert showing the mock OTP code for development/testing
      alert(`[Living Law OTP Code]: ${mockOtp}`);
    }, 1200);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    setTimeout(() => {
      if (otpCode !== generatedOtp && otpCode !== "123456") { // Allow 123456 as bypass
        setError("Invalid OTP code. Please try again.");
        setLoading(false);
        return;
      }

      // Successful verification
      const userEmail = `user_${phoneNumber.slice(-4)}@livinglaw.in`;
      const mockUser = {
        id: "usr-" + Math.floor(100000 + Math.random() * 900000),
        email: userEmail,
        phone: phoneNumber,
        user_metadata: { full_name: `Client ${phoneNumber.slice(-4)}` }
      };

      // Save user session in localStorage
      localStorage.setItem("living_law_mock_user", JSON.stringify(mockUser));
      
      // Logged in message
      setSuccessMessage("OTP verified! Accessing secure workspace...");
      
      setTimeout(() => {
        setLoading(false);
        router.push("/dashboard");
      }, 1000);
    }, 1500);
  };

  return (
    <div className="bg-[#030712] min-h-screen text-slate-100 flex flex-col justify-between">
      <Navbar />

      <main className="flex-1 flex items-center justify-center p-6 relative overflow-hidden my-12">
        {/* Background grids */}
        <div className="absolute top-0 left-0 w-full h-full opacity-5 bg-[radial-gradient(#d4af37_1px,transparent_1px)] [background-size:16px_16px]"></div>
        
        <div className="relative w-full max-w-md bg-slate-900/80 border border-amber-500/20 rounded-3xl p-8 shadow-2xl backdrop-blur-md space-y-6">
          {/* Header */}
          <div className="text-center">
            <Link href="/" className="inline-flex items-center gap-2 mb-4 group justify-center">
              <div className="p-2 bg-gradient-to-br from-amber-500 to-amber-700 rounded-full text-white">
                <Scale size={20} />
              </div>
              <h2 className="text-lg font-serif-legal font-bold">LIVING LAW</h2>
            </Link>
            <h3 className="text-2xl font-serif-legal font-bold text-white">
              {step === "phone" ? "Litigation Chambers Workspace" : "Verify Authentication OTP"}
            </h3>
            <p className="text-xs text-slate-400 mt-2">
              {step === "phone" 
                ? "Enter your mobile number to sign in or register instantly" 
                : `Enter the 6-digit OTP code sent to your phone`}
            </p>
          </div>

          {/* Feedback Messages */}
          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-xl text-center">
              {error}
            </div>
          )}
          {successMessage && (
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs rounded-xl flex items-center justify-center gap-2">
              <CheckCircle2 size={14} className="shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {step === "phone" ? (
            /* PHONE ENTRY STEP */
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[11px] uppercase tracking-wider font-bold text-slate-400 block font-mono">
                  Mobile Number
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-3 text-sm text-slate-500 font-bold border-r border-slate-800 pr-3">+91</span>
                  <input 
                    type="tel" 
                    required
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, "").slice(0, 10))}
                    placeholder="98765 43210"
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl pl-16 pr-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-amber-500/50"
                  />
                </div>
              </div>

              <button 
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white rounded-2xl py-3.5 text-sm font-semibold flex items-center justify-center gap-2 transition disabled:opacity-50 shadow-lg shadow-amber-500/10 mt-2"
              >
                {loading ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <>
                    <span>Request One-Time Password</span>
                    <ArrowRight size={14} />
                  </>
                )}
              </button>
            </form>
          ) : (
            /* OTP VERIFICATION STEP */
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[11px] uppercase tracking-wider font-bold text-slate-400 block font-mono">
                  Enter 6-Digit OTP
                </label>
                <input 
                  type="text" 
                  maxLength={6}
                  required
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  placeholder="••••••"
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3.5 text-center text-lg tracking-widest font-mono text-white placeholder-slate-700 focus:outline-none focus:border-amber-500/50"
                />
              </div>

              <div className="flex gap-3 mt-4">
                <button 
                  type="button"
                  onClick={() => {
                    setStep("phone");
                    setOtpCode("");
                    setGeneratedOtp(null);
                    setSuccessMessage(null);
                    setError(null);
                  }}
                  className="w-1/3 border border-slate-800 hover:bg-slate-800 text-slate-300 rounded-2xl py-3 text-xs font-semibold flex items-center justify-center gap-1.5 transition"
                >
                  <ArrowLeft size={12} />
                  <span>Back</span>
                </button>
                <button 
                  type="submit"
                  disabled={loading}
                  className="w-2/3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl py-3 text-xs font-semibold flex items-center justify-center gap-1.5 transition disabled:opacity-50"
                >
                  {loading ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <span>Confirm & Verify</span>
                  )}
                </button>
              </div>

              <div className="text-center text-[10px] text-slate-500 mt-2">
                Didn&apos;t receive code?{" "}
                <button 
                  type="button"
                  onClick={handleSendOtp}
                  className="text-amber-500 hover:underline font-bold"
                >
                  Resend SMS
                </button>
              </div>
            </form>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
