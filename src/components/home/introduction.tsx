"use client";

export default function Introduction() {
  return (
    <section className="py-20 bg-[#030712] border-b border-slate-800/60 relative overflow-hidden text-center">
      {/* Background Decorative Element */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-500/[0.01] rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-3xl mx-auto px-6 relative z-10 space-y-6">
        <h2 className="text-3xl md:text-4xl font-serif-legal font-extrabold text-white leading-tight">
          What is <span className="text-amber-500 font-sans">Living Law</span>?
        </h2>

        <p className="text-slate-300 text-base md:text-lg leading-relaxed font-light">
          Living Law is a hybrid LegalTech ecosystem and modern advocacy chamber designed to bridge the gap between traditional legal institutions and contemporary digital society.
        </p>

        <p className="text-slate-400 text-sm md:text-base leading-relaxed">
          We deliver complete institutional technology layers for business registrations, certified Aadhaar e-stamps, virtual dispute resolution rooms, and interactive resources for law students—all under one unified framework.
        </p>
      </div>
    </section>
  );
}
