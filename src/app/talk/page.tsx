"use client";

import { useState } from "react";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { 
  Scale, Phone, CheckCircle2, ChevronDown, X, Info, 
  Mail, Landmark, ShieldAlert, Award, FileText, ArrowRight, Loader2
} from "lucide-react";

interface CategoryMap {
  [key: string]: string[];
}

export default function TalkToLawyerPage() {
  // Form fields
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [language, setLanguage] = useState("English");
  const [selectedCategory, setSelectedCategory] = useState("Legal Notices");
  const [selectedSubCategory, setSelectedSubCategory] = useState("Demand notice drafting");
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [tempCategory, setTempCategory] = useState("Legal Notices");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const categories: CategoryMap = {
    "Legal Notices": [
      "Demand notice drafting",
      "Reply to legal notice",
      "Statutory / compliance notices",
      "Recovery of dues notice"
    ],
    "Property Lawyer": [
      "Property title verification",
      "Builder dispute resolution",
      "Land dispute litigation",
      "Tenant eviction issue"
    ],
    "Family Lawyer": [
      "Mutual divorce filing",
      "Child custody dispute",
      "Maintenance & alimony claim",
      "Partition deed drafting"
    ],
    "Civil Lawyer": [
      "Money recovery suit",
      "Injunction suit filing",
      "Property damage claim",
      "Breach of contract dispute"
    ],
    "Criminal Lawyer": [
      "Bail application",
      "Cheque bounce issue",
      "FIR quashing petition",
      "Cyber crime complaint"
    ],
    "Consumer Lawyer": [
      "Consumer court complaint",
      "Deficient product refund",
      "Insurance claim denial",
      "Medical negligence claim"
    ],
    "Company Law Matters": [
      "Director dispute resolution",
      "Shareholder agreement breach",
      "Startup equity structuring",
      "Insolvency & bankruptcy filing"
    ],
    "Constitutional Lawyer": [
      "Writ petition filing",
      "Fundamental rights dispute",
      "Public interest litigation (PIL)",
      "Appeal to High Court / SC"
    ]
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !mobileNumber) {
      alert("Please fill in all input fields.");
      return;
    }

    setSubmitting(true);

    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);

      // Trigger standard email client mailto link as a direct option
      const emailSubject = encodeURIComponent(`Consultation Request: ${fullName}`);
      const emailBody = encodeURIComponent(
        `New consultation details:\n\n` +
        `Name: ${fullName}\n` +
        `Email: ${email}\n` +
        `Mobile: ${mobileNumber}\n` +
        `Language: ${language}\n` +
        `Category: ${selectedCategory}\n` +
        `Issue: ${selectedSubCategory}\n`
      );
      
      const mailtoUrl = `mailto:livinglaw01@gmail.com?subject=${emailSubject}&body=${emailBody}`;
      window.open(mailtoUrl, "_blank");
    }, 2000);
  };

  return (
    <div className="bg-[#030712] min-h-screen text-slate-100 flex flex-col justify-between">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-6 py-16 w-full relative">
        <div className="absolute top-0 left-0 w-full h-full opacity-5 bg-[radial-gradient(#d4af37_1px,transparent_1px)] [background-size:16px_16px]"></div>

        <div className="grid md:grid-cols-2 gap-12 items-center relative z-10">
          {/* Left panel: Info */}
          <div className="space-y-6">
            <h1 className="text-4xl md:text-5xl font-serif-legal font-bold text-white leading-tight">
              Online lawyer <br />consultation
            </h1>

            <ul className="space-y-4 text-slate-300">
              <li className="flex gap-3">
                <CheckCircle2 className="text-amber-500 shrink-0 mt-0.5" size={18} />
                <span className="text-sm">Tailored guidance from vetted senior advocates – available round the clock. <span className="text-amber-500 underline font-semibold cursor-pointer">T&C apply</span></span>
              </li>
              <li className="flex gap-3">
                <CheckCircle2 className="text-amber-500 shrink-0 mt-0.5" size={18} />
                <span className="text-sm">Private, secure sessions – we treat your matter with discretion and care.</span>
              </li>
              <li className="flex gap-3">
                <CheckCircle2 className="text-amber-500 shrink-0 mt-0.5" size={18} />
                <span className="text-sm">Fair-service focus: if the session does not go ahead due to our side, we work with you on relief as per policy.</span>
              </li>
            </ul>

            <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-2xl flex items-center gap-4 mt-6">
              <div className="p-3 bg-amber-500/10 border border-amber-500/20 text-amber-500 rounded-full">
                <Phone size={24} className="animate-pulse" />
              </div>
              <div>
                <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold block">Chambers Direct Line</span>
                <a href="tel:+917505375151" className="text-lg font-bold text-white hover:text-amber-500 transition font-mono">
                  +91 7505375151
                </a>
              </div>
            </div>
          </div>

          {/* Right panel: Consultation Form */}
          <div className="bg-slate-900/80 text-white p-8 rounded-3xl border border-slate-800 shadow-2xl relative overflow-hidden">
            {submitted ? (
              <div className="py-12 text-center space-y-6 animate-in fade-in duration-300">
                <div className="mx-auto w-16 h-16 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center text-emerald-500">
                  <CheckCircle2 size={36} />
                </div>
                <div className="space-y-2">
                  <h3 className="font-serif-legal font-bold text-2xl">Request Dispatched!</h3>
                  <p className="text-sm text-slate-400 max-w-sm mx-auto leading-relaxed">
                    Consultation details have been compiled and sent to <strong className="text-white font-mono">livinglaw01@gmail.com</strong>. SMS alert has been dispatched to <strong className="text-white font-mono">+91 7505375151</strong>.
                  </p>
                </div>
                <button 
                  onClick={() => {
                    setSubmitted(false);
                    setFullName("");
                    setEmail("");
                    setMobileNumber("");
                  }}
                  className="px-6 py-2.5 rounded-xl border border-slate-800 text-xs font-bold hover:bg-slate-800 transition text-slate-350"
                >
                  Submit Another Consultation
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-serif-legal font-bold text-white">
                    Get expert <br />legal consultation
                  </h3>
                </div>

                <div className="space-y-3">
                  <input 
                    type="text" 
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Full name"
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-amber-500/50 text-white placeholder-slate-600"
                  />

                  <input 
                    type="email" 
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-amber-500/50 text-white placeholder-slate-600"
                  />

                  <input 
                    type="tel" 
                    required
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value)}
                    placeholder="Mobile number"
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-amber-500/50 text-white placeholder-slate-600"
                  />

                  <select 
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-amber-500/50 text-white"
                  >
                    <option className="bg-slate-900">English</option>
                    <option className="bg-slate-900">Hindi</option>
                    <option className="bg-slate-900">Punjabi</option>
                    <option className="bg-slate-900">Bengali</option>
                  </select>

                  <button 
                    type="button"
                    onClick={() => {
                      setTempCategory(selectedCategory);
                      setShowCategoryModal(true);
                    }}
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 text-sm flex justify-between items-center text-slate-400 focus:outline-none hover:border-slate-700"
                  >
                    <span className="text-slate-200 font-medium">
                      {selectedCategory} • {selectedSubCategory}
                    </span>
                    <ChevronDown size={16} />
                  </button>
                </div>

                <button 
                  type="submit"
                  disabled={submitting}
                  className="w-full mt-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white rounded-2xl py-3.5 text-sm font-semibold flex items-center justify-center gap-2 transition disabled:opacity-50 shadow-lg shadow-amber-500/10"
                >
                  {submitting ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <>
                      <span>Submit Request</span>
                      <ArrowRight size={14} />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </main>

      {/* Category Selection Modal */}
      {showCategoryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl bg-slate-900 text-white rounded-3xl overflow-hidden shadow-2xl border border-slate-800 flex flex-col h-[480px]">
            
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/40">
              <h3 className="text-xl font-serif-legal font-bold text-white">Select your category</h3>
              <button 
                onClick={() => setShowCategoryModal(false)}
                className="p-1.5 hover:bg-slate-800 rounded-full transition text-slate-400 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            {/* Columns split */}
            <div className="flex-1 flex overflow-hidden">
              {/* Left Column: Categories */}
              <div className="w-1/2 border-r border-slate-800 overflow-y-auto bg-slate-950/20">
                {Object.keys(categories).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setTempCategory(cat)}
                    className={`w-full text-left px-6 py-4 text-xs font-semibold flex justify-between items-center transition border-b border-slate-800/40 ${
                      tempCategory === cat 
                        ? "bg-slate-950/85 text-amber-500 border-l-4 border-l-amber-500 font-bold" 
                        : "hover:bg-slate-800/40 text-slate-350"
                    }`}
                  >
                    <span>{cat}</span>
                    <ArrowRight size={12} className={tempCategory === cat ? "translate-x-1 transition" : ""} />
                  </button>
                ))}
              </div>

              {/* Right Column: Subcategories */}
              <div className="w-1/2 overflow-y-auto p-4 space-y-1 bg-slate-900">
                {categories[tempCategory]?.map((sub) => (
                  <button
                    key={sub}
                    onClick={() => {
                      setSelectedCategory(tempCategory);
                      setSelectedSubCategory(sub);
                      setShowCategoryModal(false);
                    }}
                    className={`w-full text-left px-4 py-3 text-xs rounded-xl transition ${
                      selectedCategory === tempCategory && selectedSubCategory === sub
                        ? "bg-amber-500/10 text-amber-400 font-bold border border-amber-500/20"
                        : "hover:bg-slate-800/40 text-slate-400 hover:text-white"
                    }`}
                  >
                    {sub}
                  </button>
                ))}
              </div>
            </div>

            {/* Modal footer */}
            <div className="px-6 py-4 border-t border-slate-800 bg-slate-950/40 flex justify-end">
              <button 
                onClick={() => setShowCategoryModal(false)}
                className="bg-amber-500 hover:bg-amber-600 text-white px-5 py-2 rounded-xl text-xs font-semibold shadow-md shadow-amber-500/10"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
