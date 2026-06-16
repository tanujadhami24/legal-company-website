"use client";

import { useState } from "react";
import { 
  Award, FileText, Search, BookOpen, Download, Share2, 
  Send, Copy, Check, HelpCircle, Sparkles 
} from "lucide-react";

interface Ebook {
  title: string;
  author: string;
  size: string;
  downloads: string;
  cover?: string;
}

interface Article {
  title: string;
  category: string;
  readTime: string;
  summary: string;
}

export default function AcademySection() {
  const [walletBalance, setWalletBalance] = useState(0);
  const [referralEmail, setReferralEmail] = useState("");
  const [copiedLink, setCopiedLink] = useState(false);
  const [inviteSent, setInviteSent] = useState(false);

  // Student AI Research
  const [researchQuery, setResearchQuery] = useState("");
  const [researchResult, setResearchResult] = useState<string | null>(null);
  const [isResearching, setIsResearching] = useState(false);

  const ebooks: Ebook[] = [
    { title: "Introduction to Indian Cyber Jurisprudence", author: "Dr. A. Sen, LL.M.", size: "4.8 MB", downloads: "2.4k", cover: "/law_ebook_cyber.png" },
    { title: "Principles of Commercial Contracts & Drafting", author: "Hon. Justice M. Rao", size: "6.2 MB", downloads: "5.1k", cover: "/law_ebook_contracts.png" },
    { title: "IPR and Patent Frameworks in the Global South", author: "Adv. Neha Sharma", size: "3.5 MB", downloads: "1.8k" },
    { title: "Alternative Dispute Resolution (ADR) Handbook", author: "Prof. Rajesh Kumar", size: "7.1 MB", downloads: "3.9k" }
  ];

  const articles: Article[] = [
    { title: "Decoding Section 66A of the IT Act: Key Landmark Judgments", category: "Cyber Law", readTime: "8 min read", summary: "A comprehensive look at online free expression, landmark rulings, and legislative responses in Indian cyber regulation." },
    { title: "Essential Clauses for Formulating Water-Tight NDAs", category: "Contracts", readTime: "12 min read", summary: "Understanding liquidated damages, jurisdiction limits, non-solicit, and defining proprietary parameters securely." },
    { title: "The Evolving Landscape of Patentability of AI Inventions", category: "Intellectual Property", readTime: "10 min read", summary: "An analysis of Section 3(k) under the Indian Patent Act and matching trends across EPO and USPTO." },
    { title: "Mediation Act 2023: Resolving Commercial Disputes Faster", category: "Arbitration & ODR", readTime: "15 min read", summary: "How the newly codified rules mandate pre-litigation mediation and impact professional legal practices." }
  ];

  const handleDownloadSample = (docType: string) => {
    alert(`Downloading sample standard ${docType}...`);
    
    let content = "";
    if (docType === "Non-Disclosure Agreement (NDA)") {
      content = "MUTUAL NON-DISCLOSURE AGREEMENT\n\nThis NDA is entered into on this day by and between the parties to protect confidential business info. Under Indian Contract Act, 1872...";
    } else if (docType === "Standard Rent Agreement") {
      content = "RENT AGREEMENT / LEASE DEED\n\nThis Deed of Lease is executed on Delhi between Landlord and Tenant for residential tenancy. Monthly Rent: INR 15,000...";
    } else {
      content = "PARTNERSHIP DEED\n\nThis Deed of Partnership is executed under Indian Partnership Act, 1932. Capital contribution, profit-loss sharing ratio is established...";
    }

    const element = document.createElement("a");
    const file = new Blob([content], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `${docType.toLowerCase().replace(/[^a-z0-9]/g, "_")}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText("https://livinglaw.in/academy/join?ref=STUDENT2026");
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleSendReferral = (e: React.FormEvent) => {
    e.preventDefault();
    if (!referralEmail) return;

    setInviteSent(true);
    setTimeout(() => {
      setWalletBalance((prev) => prev + 500);
      setReferralEmail("");
      setInviteSent(false);
      alert("Referral invitation sent! Mock student signed up. ₹500 credit added to your wallet.");
    }, 1500);
  };

  const handleResearchQuery = () => {
    if (!researchQuery) return;
    setIsResearching(true);
    setResearchResult(null);

    setTimeout(() => {
      // Custom mocked responses based on user query
      let answer = "";
      const q = researchQuery.toLowerCase();
      if (q.includes("privacy") || q.includes("puttaswamy") || q.includes("right")) {
        answer = "**Landmark Judgment: K.S. Puttaswamy v. Union of India (2017)**\n\n- **Ratio Decidendi:** The Supreme Court held that the Right to Privacy is protected as an intrinsic part of the Right to Life and Personal Liberty under Article 21 of the Indian Constitution.\n- **Application to Digital Data:** Privacy extends to informational privacy, establishing that any government surveillance or data processing must satisfy a three-fold test of (1) legality, (2) legitimate state interest, and (3) proportionality.";
      } else if (q.includes("contract") || q.includes("consideration") || q.includes("section 2")) {
        answer = "**Indian Contract Act, 1872 - Section 2(d): Consideration**\n\n- **Rule:** Consideration must move at the desire of the promisor. It need not be adequate but must have real value in the eyes of law.\n- **Landmark Case:** *Chinnaya v. Ramayya (1882)* - established that consideration may move from a third party (privity of consideration is not applicable in India, though privity of contract is strictly maintained).";
      } else {
        answer = `**AI Academy Research Summary on "${researchQuery}":**\n\n- **Legal Overview:** Under the relevant acts of the Constitution and Civil Procedure, this topic concerns regulatory standards. In cases involving digital actions, provisions are governed under the IT Act (Section 43A) and the newer Digital Personal Data Protection (DPDP) Act, 2023.\n- **Standard Precedents:** Courts evaluate balance of convenience, prima facie merits, and irreparable loss parameters before issuing interlocutory injunctions. Refer to Civil Procedure Code Order 39 Rules 1 and 2.`;
      }
      setResearchResult(answer);
      setIsResearching(false);
    }, 1800);
  };

  return (
    <section className="bg-[#003e5c] py-20 text-white transition-colors duration-300 border-t border-amber-500/10">
      {/* Hero Header Section */}
      <div className="relative overflow-hidden pb-12">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[radial-gradient(#e99e24_1px,transparent_1px)] [background-size:16px_16px]"></div>
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <span className="text-[#e99e24] font-semibold tracking-widest text-xs uppercase block mb-3">Living Law Academy</span>
          <h2 className="text-3xl md:text-5xl font-serif-legal font-bold mb-4">
            Legal Education & <span className="text-[#e99e24]">Research Console</span>
          </h2>
          <p className="text-sky-100/70 max-w-2xl text-sm md:text-base leading-relaxed">
            Access free academic law templates, premium legal ebooks, and consult our AI Research system. Share references to unlock advanced corporate materials.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Main Content Column */}
          <div className="lg:col-span-2 space-y-10">
            
            {/* AI Research Section */}
            <div className="bg-[#002f45]/50 border border-[#004d73]/40 rounded-2xl p-6 md:p-8 shadow-sm space-y-6">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-[#e99e24]/15 rounded-xl text-[#e99e24]">
                  <Sparkles size={20} className="animate-pulse" />
                </div>
                <div>
                  <h3 className="font-serif-legal font-bold text-xl text-white">AI Legal Researcher</h3>
                  <p className="text-xs text-sky-100/70">Ask case laws, section interpretation or constitution article summaries.</p>
                </div>
              </div>

              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={researchQuery}
                  onChange={(e) => setResearchQuery(e.target.value)}
                  placeholder="e.g. Right to privacy article 21 puttaswamy case details..." 
                  className="flex-1 bg-[#001f30] border border-[#004d73]/60 rounded-xl px-4 py-3 text-sm focus:border-[#e99e24] focus:outline-none focus:ring-1 focus:ring-[#e99e24] text-white placeholder-sky-200/40"
                  onKeyDown={(e) => e.key === "Enter" && handleResearchQuery()}
                />
                <button 
                  onClick={handleResearchQuery}
                  disabled={isResearching}
                  className="bg-[#e99e24] hover:bg-[#d68b12] text-white px-5 rounded-xl text-sm font-semibold transition flex items-center gap-2"
                >
                  <Search size={16} />
                  <span>Research</span>
                </button>
              </div>

              {isResearching && (
                <div className="bg-[#001f30] border border-[#004d73]/40 p-6 rounded-xl animate-pulse flex flex-col gap-3">
                  <div className="w-1/3 bg-[#002e45] h-4 rounded"></div>
                  <div className="w-full bg-[#002e45] h-3 rounded"></div>
                  <div className="w-5/6 bg-[#002e45] h-3 rounded"></div>
                  <div className="w-2/3 bg-[#002e45] h-3 rounded"></div>
                </div>
              )}

              {researchResult && (
                <div className="bg-[#001f30] border border-[#004d73]/40 p-6 rounded-xl text-sm leading-relaxed prose prose-amber dark:prose-invert">
                  <div className="flex justify-between items-center border-b border-[#004d73]/30 pb-2 mb-3">
                    <span className="text-[10px] text-[#e99e24] uppercase tracking-widest font-semibold">AI Generated Research Notes</span>
                    <button 
                      onClick={() => {
                        navigator.clipboard.writeText(researchResult);
                        alert("Research notes copied to clipboard!");
                      }} 
                      className="text-sky-200/60 hover:text-[#e99e24] flex items-center gap-1 text-[11px]"
                    >
                      <Copy size={12} />
                      <span>Copy Notes</span>
                    </button>
                  </div>
                  <div className="whitespace-pre-line text-sky-100/95">
                    {researchResult}
                  </div>
                </div>
              )}
            </div>

            {/* Articles and Journals Section */}
            <div className="space-y-6">
              <h3 className="font-serif-legal font-bold text-2xl border-b border-[#004d73]/40 pb-2 text-white">
                Featured Law Articles & Blogs
              </h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                {articles.map((art, idx) => (
                  <div key={idx} className="bg-[#002f45]/50 border border-[#004d73]/40 rounded-2xl p-6 flex flex-col justify-between shadow-sm hover:border-[#e99e24]/40 hover:bg-[#002f45]/70 transition-all duration-350">
                    <div>
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-[10px] uppercase font-bold text-[#e99e24] tracking-wider">
                          {art.category}
                        </span>
                        <span className="text-sky-200/60 text-xs">{art.readTime}</span>
                      </div>
                      <h4 className="font-serif-legal font-bold text-lg mb-2 leading-tight hover:text-[#e99e24] transition-colors text-white">
                        {art.title}
                      </h4>
                      <p className="text-xs text-sky-100/70 leading-relaxed mb-6">
                        {art.summary}
                      </p>
                    </div>
                    <button className="text-xs font-semibold text-[#e99e24] hover:text-[#d68b12] flex items-center gap-1 self-start">
                      <span>Read Article</span>
                      <BookOpen size={12} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Ebook Library Section */}
            <div className="space-y-6">
              <h3 className="font-serif-legal font-bold text-2xl border-b border-[#004d73]/40 pb-2 text-white">
                Downloadable Academic Ebooks
              </h3>

              <div className="bg-[#002f45]/50 border border-[#004d73]/40 rounded-2xl divide-y divide-[#004d73]/30 shadow-sm">
                {ebooks.map((eb, idx) => (
                  <div key={idx} className="p-4 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex gap-4 items-center">
                      {eb.cover ? (
                        <div className="w-12 h-16 rounded-md overflow-hidden border border-[#004d73]/60 shrink-0 shadow-md">
                          <img src={eb.cover} alt={eb.title} className="w-full h-full object-cover" />
                        </div>
                      ) : (
                        <div className="p-3 bg-[#001f30] border border-[#004d73]/60 rounded-xl text-[#e99e24] shrink-0">
                          <BookOpen size={20} />
                        </div>
                      )}
                      <div>
                        <h4 className="font-semibold text-sm md:text-base leading-tight text-white">{eb.title}</h4>
                        <p className="text-xs text-sky-100/70 mt-1">Author: {eb.author} • Size: {eb.size}</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => alert(`Initiating eBook download: ${eb.title}`)}
                      className="bg-[#001f30] hover:bg-[#001520] border border-[#004d73]/60 text-xs px-4 py-2.5 rounded-xl font-bold flex items-center gap-1.5 self-start md:self-auto shrink-0 transition text-slate-200"
                    >
                      <Download size={14} />
                      <span>Download PDF ({eb.downloads})</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right Sidebar Column */}
          <div className="space-y-6">
            
            {/* Student Wallet & Referral credit */}
            <div className="bg-gradient-to-br from-[#d48416] to-[#af680a] text-white rounded-2xl p-6 shadow-md space-y-4 relative overflow-hidden">
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/5 rounded-full blur-xl"></div>
              
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-amber-100">Academy Referral Credits</span>
                <Award size={18} className="text-amber-100" />
              </div>

              <div>
                <span className="text-[10px] text-amber-100 uppercase block">Wallet Balance</span>
                <span className="text-3xl font-extrabold tracking-wide font-sans">
                  ₹{walletBalance.toLocaleString("en-IN")}
                </span>
              </div>

              <div className="border-t border-white/10 pt-4 mt-2">
                <p className="text-[11px] text-amber-50 leading-relaxed mb-3">
                  Earn ₹500 wallet credits for every law school student you invite. Credits can be used to purchase certification courses.
                </p>
                <form onSubmit={handleSendReferral} className="flex gap-1.5">
                  <input 
                    type="email" 
                    required
                    value={referralEmail}
                    onChange={(e) => setReferralEmail(e.target.value)}
                    placeholder="student@lawschool.edu" 
                    className="flex-1 bg-white/10 border border-white/15 text-white placeholder-white/50 text-xs rounded-xl px-3 py-2.5 focus:bg-white/15 focus:outline-none"
                  />
                  <button 
                    type="submit" 
                    disabled={inviteSent}
                    className="bg-white text-amber-900 hover:bg-amber-100 p-2.5 rounded-xl transition flex items-center justify-center shrink-0"
                  >
                    <Send size={14} />
                  </button>
                </form>
              </div>

              <button 
                onClick={handleCopyLink}
                className="w-full bg-white/10 hover:bg-white/15 border border-white/10 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition"
              >
                {copiedLink ? <Check size={14} /> : <Share2 size={14} />}
                <span>{copiedLink ? "Link Copied" : "Copy Student Invite Link"}</span>
              </button>
            </div>

            {/* Document Draft Downloads */}
            <div className="bg-[#002f45]/50 border border-[#004d73]/40 rounded-2xl p-6 shadow-sm space-y-4">
              <h3 className="font-serif-legal font-bold text-lg border-b border-[#004d73]/30 pb-3 text-white">
                Free Sample Agreements
              </h3>
              
              <div className="space-y-3">
                <button 
                  onClick={() => handleDownloadSample("Non-Disclosure Agreement (NDA)")}
                  className="w-full p-3 rounded-xl border border-[#004d73]/40 bg-[#001f30] text-left flex justify-between items-center hover:border-[#e99e24]/40 hover:bg-[#002f45]/70 transition text-xs font-semibold text-slate-200"
                >
                  <span className="flex items-center gap-2">
                    <FileText size={16} className="text-[#e99e24]" />
                    <span>Non-Disclosure Agreement (NDA)</span>
                  </span>
                  <Download size={14} className="text-sky-200/50" />
                </button>

                <button 
                  onClick={() => handleDownloadSample("Standard Rent Agreement")}
                  className="w-full p-3 rounded-xl border border-[#004d73]/40 bg-[#001f30] text-left flex justify-between items-center hover:border-[#e99e24]/40 hover:bg-[#002f45]/70 transition text-xs font-semibold text-slate-200"
                >
                  <span className="flex items-center gap-2">
                    <FileText size={16} className="text-[#e99e24]" />
                    <span>Standard Rent Agreement</span>
                  </span>
                  <Download size={14} className="text-sky-200/50" />
                </button>

                <button 
                  onClick={() => handleDownloadSample("Partnership Agreement")}
                  className="w-full p-3 rounded-xl border border-[#004d73]/40 bg-[#001f30] text-left flex justify-between items-center hover:border-[#e99e24]/40 hover:bg-[#002f45]/70 transition text-xs font-semibold text-slate-200"
                >
                  <span className="flex items-center gap-2">
                    <FileText size={16} className="text-[#e99e24]" />
                    <span>Partnership Deed Agreement</span>
                  </span>
                  <Download size={14} className="text-sky-200/50" />
                </button>
              </div>
            </div>

            {/* Help Widget */}
            <div className="bg-[#002f45]/30 border border-[#004d73]/40 p-5 rounded-2xl text-xs space-y-2">
              <div className="flex gap-2 text-sky-200/40">
                <HelpCircle size={16} />
                <h4 className="font-semibold text-sky-100/80">Need Academic Support?</h4>
              </div>
              <p className="text-[11px] text-sky-200/60 leading-relaxed">
                Living Law Academy bridges theory with practical filings. Get involved in our ODR clinic internship program by contacting support.
              </p>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
