"use client";

import { Scale, ShieldCheck, FileText, Award, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function Introduction() {
  const pillars = [
    {
      icon: Scale,
      title: "Chamber & Corporate Advocacy",
      desc: "Vetted corporate representation, dynamic legal portfolios, and senior counsel support.",
      href: "/marketplace"
    },
    {
      icon: ShieldCheck,
      title: "Online Dispute Resolution",
      desc: "Fast-tracked civil and commercial settlements via secure digital mediation chambers.",
      href: "/odr"
    },
    {
      icon: FileText,
      title: "Verified e-Stamps & Notary",
      desc: "Aadhaar e-Signatures and instant Video KYC notary services in compliance with legal standards.",
      href: "/notary"
    },
    {
      icon: Award,
      title: "Living Law Academy",
      desc: "Comprehensive curriculum resources, legal document drafting templates, and research tools.",
      href: "/academy"
    }
  ];

  return (
    <section className="py-20 bg-slate-50/60 dark:bg-slate-900/10 border-b border-amber-500/10 relative overflow-hidden">
      {/* Background Decorative Element */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-500/[0.015] dark:bg-amber-500/[0.01] rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-12 gap-12 items-center relative z-10">
        
        {/* Left Column: Heading & Description */}
        <div className="lg:col-span-5 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-400 rounded-lg text-xs font-semibold uppercase tracking-wider">
            <Scale size={12} />
            <span>Introduction</span>
          </div>

          <h2 className="text-3xl md:text-4xl font-serif-legal font-extrabold text-slate-950 dark:text-white leading-tight">
            What is <span className="text-amber-600 dark:text-amber-400 font-sans">Living Law</span>?
          </h2>

          <p className="text-slate-600 dark:text-slate-400 text-sm md:text-base leading-relaxed">
            Living Law is a hybrid LegalTech ecosystem and modern advocacy chamber designed to bridge the gap between traditional legal institutions and contemporary digital society.
          </p>

          <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
            We deliver complete institutional technology layers for business registrations, certified Aadhaar e-stamps, virtual dispute resolution rooms, and interactive resources for law students—all under one unified framework.
          </p>

          <div className="pt-2">
            <Link 
              href="/dashboard"
              className="inline-flex items-center gap-2 text-xs font-bold text-amber-600 dark:text-amber-400 hover:text-amber-500 dark:hover:text-amber-300 transition-colors group"
            >
              <span>Explore workspace panels</span>
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Right Column: Pillars Grid */}
        <div className="lg:col-span-7 grid sm:grid-cols-2 gap-6">
          {pillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <div 
                key={idx}
                className="p-6 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 hover:border-amber-500/30 dark:hover:border-amber-500/30 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 group"
              >
                <div className="p-2.5 bg-amber-500/10 rounded-xl text-amber-600 dark:text-amber-400 w-fit mb-4 group-hover:bg-amber-600 group-hover:text-white transition-colors duration-300">
                  <Icon size={20} />
                </div>
                <h3 className="font-serif-legal font-bold text-sm text-slate-950 dark:text-white mb-2">
                  {pillar.title}
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed mb-4">
                  {pillar.desc}
                </p>
                <Link 
                  href={pillar.href} 
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-700 dark:text-slate-350 hover:text-amber-500 dark:hover:text-amber-400 transition-colors"
                >
                  <span>Enter Chamber</span>
                  <ArrowRight size={10} />
                </Link>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
