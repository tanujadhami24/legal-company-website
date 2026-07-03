"use client";

import { Landmark, ShieldCheck } from "lucide-react";

export default function CourtBanner() {
  return (
    <section className="relative w-full overflow-hidden bg-[#030712]">
      
      {/* Background Image of Supreme Court with dark overlay */}
      <div className="relative h-[300px] md:h-[400px] w-full">
        <img 
          src="/supreme_court_india.png" 
          alt="Supreme Court of India"
          className="w-full h-full object-cover object-center opacity-45 scale-105 transition-transform duration-10000 hover:scale-100"
        />
        
        {/* Gradients blending into the page sections */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#030712] via-transparent to-[#030712] opacity-100"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#030712]/50 via-transparent to-[#030712]/50"></div>
        
        {/* Centered Institutional Text Overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 space-y-4">
          <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-full text-amber-500 backdrop-blur-xs shadow-lg shadow-amber-500/5 animate-pulse">
            <Landmark size={28} />
          </div>
          
          <div className="space-y-2 max-w-2xl bg-slate-950/80 dark:bg-slate-950/95 backdrop-blur-md px-8 py-5 rounded-2xl border border-amber-500/10 shadow-2xl">
            <span className="text-[10px] md:text-xs tracking-widest text-slate-400 font-mono uppercase block font-bold">
              Institutional Infrastructure of Justice
            </span>
            <h2 className="text-xl md:text-3xl font-serif-legal font-extrabold text-white tracking-wide">
              Supreme Court of India
            </h2>
            <p className="text-[10px] md:text-xs text-amber-500/90 font-serif-legal italic font-semibold max-w-md mx-auto">
              "Yato Dharmastato Jayah" — Where there is righteousness, there is victory.
            </p>
          </div>
        </div>
        
      </div>
      
    </section>
  );
}
