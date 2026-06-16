import {
  Building2,
  FileText,
  ShieldCheck,
  Award,
  ArrowRight,
  Sparkles
} from "lucide-react";
import Link from "next/link";

export default function Services() {
  const serviceCards = [
    {
      icon: Building2,
      title: "Business & Compliance Registry",
      desc: "Complete registration intake forms for Pvt Ltd, LLP, Trademark, copyright, FSSAI, ITR filings, and corporate annual compliance.",
      href: "/#marketplace"
    },
    {
      icon: FileText,
      title: "Video KYC Stamp & Notary",
      desc: "Order certified stamp papers (up to 500 sheets) for legal agreements. Verified instantly via Aadhaar Video KYC camera scans.",
      href: "/#notary"
    },
    {
      icon: ShieldCheck,
      title: "Online Dispute Resolution (ODR)",
      desc: "Resolve disputes in secured private rooms. Includes litigation settlement estimates, court fee indices, and Hindi voice translators.",
      href: "/#odr"
    },
    {
      icon: Award,
      title: "Living Law Academy & AI",
      desc: "Law student resources featuring downloadable legal agreement drafts, landmark judgment searches, eCourts checks, and referral credits.",
      href: "/#academy"
    }
  ];

  return (
    <section className="py-24 bg-slate-50/50 dark:bg-[#030712]/10 border-t border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-6">

        {/* Heading */}
        <div className="text-center mb-16 space-y-4">
          <span className="text-xs uppercase tracking-widest text-amber-600 dark:text-amber-500 font-bold block">
            Core Chambers & Portals
          </span>

          <h2 className="text-3xl md:text-5xl font-serif-legal font-bold text-slate-900 dark:text-white">
            Digital Legal Infrastructure
          </h2>

          <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto text-sm leading-relaxed">
            A comprehensive suite of institutional technologies uniting corporate registrations, Aadhaar-verified notarizations, and secure ODR dispute chambers.
          </p>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {serviceCards.map((card, index) => {
            const Icon = card.icon;
            return (
              <div 
                key={index}
                className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col justify-between hover:border-amber-500/30 dark:hover:border-amber-500/40 transition-all duration-300 hover:-translate-y-1 shadow-sm hover:shadow-md relative overflow-hidden"
              >
                {/* Subtle side pillar highlight */}
                <div className="absolute top-0 left-0 w-1 h-full bg-amber-500/40 opacity-0 hover:opacity-100 transition-opacity"></div>
                
                <div>
                  <div className="p-3 bg-amber-500/10 rounded-2xl text-amber-700 dark:text-amber-500 w-fit mb-6">
                    <Icon size={24} />
                  </div>

                  <h3 className="text-lg font-bold font-serif-legal text-slate-900 dark:text-white">
                    {card.title}
                  </h3>

                  <p className="mt-4 text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-6">
                    {card.desc}
                  </p>
                </div>

                <Link href={card.href} className="text-xs font-bold text-amber-600 dark:text-amber-400 hover:text-amber-500 flex items-center gap-1 mt-auto self-start group">
                  <span>Enter Chamber</span>
                  <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}