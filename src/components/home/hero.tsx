"use client";

import { useState } from "react";
import Link from "next/link";
import { Scale, ShieldAlert, Award, Calculator, ChevronRight } from "lucide-react";

export default function Hero() {
  const [claim, setClaim] = useState(100000);
  const [courtFee, setCourtFee] = useState<number | null>(null);

  const calculateQuickFee = () => {
    // Quick estimation formula for the landing page widget
    const fee = claim <= 50000 ? claim * 0.04 : 2000 + (claim - 50000) * 0.025;
    setCourtFee(Math.round(fee));
  };

  return (
    <section className="min-h-[90vh] flex items-center relative overflow-hidden bg-white dark:bg-[#030712] py-16">
      
      {/* Background radial glow */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-amber-500/[0.03] dark:bg-amber-500/[0.02] rounded-full blur-3xl opacity-40"></div>
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-amber-600/[0.03] dark:bg-amber-600/[0.02] rounded-full blur-3xl opacity-30"></div>
      
      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center w-full relative z-10">

        {/* Left Content */}
        <div className="space-y-6 pl-4 border-l-4 border-amber-500/80">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-400 rounded-lg text-xs font-semibold uppercase tracking-wider">
            <Scale size={14} />
            <span>Chamber & Institutional Infrastructure</span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif-legal font-bold leading-tight text-slate-950 dark:text-white">
            Corporate Counsel, <span className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-amber-700 dark:from-amber-400 dark:to-amber-500 font-sans">Arbitration & ODR</span>
          </h1>

          {/* Legal Maxim quote */}
          <p className="text-sm font-serif-legal italic text-amber-700 dark:text-amber-400/80 font-semibold tracking-wide">
            "Fiat justitia, ruat caelum" — Let justice be done though the heavens fall.
          </p>

          <p className="text-base text-slate-600 dark:text-slate-400 max-w-xl leading-relaxed">
            Living Law delivers next-generation corporate registration portfolios, Aadhaar-verified notary deeds, digital dispute resolution chambers, and advanced AI-assisted case note research.
          </p>

          {/* Buttons */}
          <div className="flex flex-wrap gap-4 pt-2">
            <Link href="/marketplace">
              <button className="bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white px-7 py-3.5 rounded-xl font-bold hover:opacity-95 transition shadow-lg shadow-amber-500/10 flex items-center gap-1.5 text-sm">
                <span>Access Chambers</span>
                <ChevronRight size={16} />
              </button>
            </Link>

            <Link href="/dashboard">
              <button className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 px-7 py-3.5 rounded-xl font-bold transition text-sm flex items-center gap-1.5">
                <span>Workspace Access</span>
              </button>
            </Link>
          </div>
        </div>

        {/* Right Side - Interactive Plaque Calculator */}
        <div className="flex justify-center w-full">
          <div className="w-full max-w-md bg-white dark:bg-slate-950 border-2 border-slate-200 dark:border-amber-500/20 rounded-3xl p-6 md:p-8 shadow-2xl relative">
            {/* Plaque styling details */}
            <div className="absolute top-2 left-2 right-2 bottom-2 border border-slate-100 dark:border-amber-500/10 rounded-2xl pointer-events-none"></div>
            
            <div className="absolute top-3 right-3 text-amber-500 opacity-10">
              <Scale size={80} />
            </div>

            <div className="relative z-10 space-y-5">
              <div className="flex items-center gap-2.5 border-b border-slate-100 dark:border-slate-800 pb-3">
                <Calculator className="text-amber-500" size={20} />
                <h3 className="font-serif-legal font-bold text-lg dark:text-white">
                  Quick Court Fee Estimator
                </h3>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Enter Claim Value (INR)</label>
                  <input 
                    type="number"
                    value={claim}
                    onChange={(e) => setClaim(Number(e.target.value))}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-xl px-4 py-2.5 text-xs font-semibold focus:outline-none focus:border-amber-500 focus:bg-white"
                  />
                </div>

                <button 
                  onClick={calculateQuickFee}
                  className="w-full bg-slate-950 hover:bg-amber-600 text-white dark:bg-white dark:text-black dark:hover:bg-amber-400 dark:hover:text-black font-bold py-2.5 rounded-xl text-xs transition"
                >
                  Estimate Civil Court Fee
                </button>
              </div>

              {courtFee !== null && (
                <div className="p-4 bg-amber-500/5 border border-amber-500/10 rounded-xl text-center animate-in fade-in zoom-in duration-200">
                  <span className="text-[10px] text-slate-400 uppercase tracking-widest block font-semibold">Estimated Payable Stamp Fee</span>
                  <span className="text-2xl font-black text-amber-500 block mt-1">₹{courtFee.toLocaleString("en-IN")}</span>
                  <Link href="/odr" className="text-[10px] text-amber-500 hover:underline mt-2 inline-flex items-center gap-1 font-semibold">
                    <span>Try litigation settlement calculator</span>
                    <ChevronRight size={10} />
                  </Link>
                </div>
              )}

              <div className="border-t border-slate-100 dark:border-slate-800/80 pt-4 text-center">
                <p className="text-[10px] text-slate-400 leading-relaxed">
                  Indian Civil Procedure Code (CPC) ad-valorem estimate. Launch the complete portal to estimate state-specific registry fees.
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>

    </section>
  );
}