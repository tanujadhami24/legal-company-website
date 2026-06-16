"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import AuthModal from "@/components/common/auth-modal";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { 
  LayoutDashboard, User, ShieldAlert, Award, FileText, Calendar, 
  Search, CheckCircle2, AlertTriangle, Briefcase, Plus, Send, 
  Trash2, Globe, Clock, MessageSquare, Download, Check, Sparkles, Building2,
  Copy
} from "lucide-react";

interface CourtHearing {
  id: string;
  title: string;
  date: string;
  time: string;
  court: string;
}

export default function DashboardPage() {
  const [activeRole, setActiveRole] = useState<"client" | "professional" | "neutral" | "admin">("client");

  // Global Persistence states
  const [clientRegs, setClientRegs] = useState<any[]>([]);
  const [clientNotaries, setClientNotaries] = useState<any[]>([]);
  const [odrCases, setOdrCases] = useState<any[]>([]);

  // Client Subscription Package
  const [clientSub, setClientSub] = useState<string>("None Active");

  // Professional Subscription Package
  const [profSub, setProfSub] = useState<string>("None Active");

  // Professional Verification Flow states
  const [barId, setBarId] = useState("");
  const [profName, setProfName] = useState("");
  const [profType, setProfType] = useState("Lawyer");
  const [profExp, setProfExp] = useState("5 Years");
  const [verifyStatus, setVerifyStatus] = useState<"not_applied" | "pending" | "verified">("not_applied");
  const [appliedLawyers, setAppliedLawyers] = useState<any[]>([]);

  // Professional Calendar/Diary states
  const [hearings, setHearings] = useState<CourtHearing[]>([]);
  const [newHearingTitle, setNewHearingTitle] = useState("");
  const [newHearingDate, setNewHearingDate] = useState("");
  const [newHearingTime, setNewHearingTime] = useState("");
  const [newHearingCourt, setNewHearingCourt] = useState("Delhi High Court");

  // CRM panel mock data
  const crmLeads = [
    { name: "Aman Gupta", type: "Pvt Ltd Registration Enquiry", email: "aman@gupta.com", date: "Just now" },
    { name: "Suresh Mehra", type: "Trademark Infringement Notice", email: "suresh@mehra.com", date: "3 hours ago" }
  ];

  // Social awareness post draft
  const [socialPrompt, setSocialPrompt] = useState("consumer rights under e-commerce laws");
  const [socialResult, setSocialResult] = useState("");
  const [isSocialDrafting, setIsSocialDrafting] = useState(false);

  // AI Assistant states
  const [aiActiveTab, setAiActiveTab] = useState<"summarize" | "draft" | "judgments" | "ecourts">("summarize");
  const [summaryInput, setSummaryInput] = useState("");
  const [summaryOutput, setSummaryOutput] = useState("");
  const [isSummarizing, setIsSummarizing] = useState(false);

  const [draftType, setDraftType] = useState("Default Notice (Rent)");
  const [draftPartyA, setDraftPartyA] = useState("");
  const [draftPartyB, setDraftPartyB] = useState("");
  const [draftDetails, setDraftDetails] = useState("");
  const [draftResult, setDraftResult] = useState("");

  const [judgmentQuery, setJudgmentQuery] = useState("");
  const [judgmentResult, setJudgmentResult] = useState<any>(null);
  
  const [ecourtState, setEcourtState] = useState("Delhi");
  const [ecourtNumber, setEcourtNumber] = useState("");
  const [ecourtResult, setEcourtResult] = useState<any>(null);
  const [isEcourtSearching, setIsEcourtSearching] = useState(false);

  // Auth state variables
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    const fetchUserAndData = async () => {
      let activeUserId = "";

      if (isSupabaseConfigured && supabase) {
        const { data } = await supabase.auth.getUser();
        if (data?.user) {
          const { data: profile } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", data.user.id)
            .single();
          setCurrentUser({ ...data.user, profile });
          activeUserId = data.user.id;
          if (profile?.role) {
            setActiveRole(profile.role as any);
          }
        }
      }

      if (!activeUserId) {
        const savedMock = localStorage.getItem("living_law_mock_user");
        if (savedMock) {
          const parsed = JSON.parse(savedMock);
          setCurrentUser(parsed);
          activeUserId = parsed.id;
        }
      }

      // Load local storage items as fallback/base
      const regs = localStorage.getItem("livinglaw_active_registrations");
      if (regs) setClientRegs(JSON.parse(regs));
      
      const notaries = localStorage.getItem("livinglaw_active_notaries");
      if (notaries) setClientNotaries(JSON.parse(notaries));

      const storedSub = localStorage.getItem("livinglaw_client_sub");
      if (storedSub) setClientSub(storedSub);

      const storedProfSub = localStorage.getItem("livinglaw_prof_sub");
      if (storedProfSub) setProfSub(storedProfSub);

      // Fetch dynamic cases from Supabase if connected
      if (isSupabaseConfigured && supabase && activeUserId && activeUserId !== "mock-user-123") {
        const { data: dbCases } = await supabase
          .from("cases")
          .select("*")
          .or(`client_id.eq.${activeUserId},neutral_id.eq.${activeUserId}`);
        
        if (dbCases) {
          const mappedCases = dbCases.map((c: any) => ({
            id: c.id,
            claimant: "You (Client)",
            respondent: "Counter Party",
            claimAmount: Number(c.claim_amount),
            type: "Mediation",
            desc: c.description || "",
            status: c.status === "active" ? "Neutral Appointed" : "Awaiting Neutral Appointment",
            neutralBooked: c.neutral_id ? "Assigned Mediator" : null,
            documents: [],
            messages: []
          }));

          const stored = localStorage.getItem("livinglaw_odr_cases");
          const localList = stored ? JSON.parse(stored) : [];
          setOdrCases([...mappedCases, ...localList]);
        }
      } else {
        const cases = localStorage.getItem("livinglaw_odr_cases");
        if (cases) setOdrCases(JSON.parse(cases));
      }

      // Verification states
      const profSaved = localStorage.getItem("livinglaw_prof_verification");
      if (profSaved) {
        const data = JSON.parse(profSaved);
        setVerifyStatus(data.status);
        setProfName(data.name || "");
        setBarId(data.barId || "");
        setProfType(data.type || "Lawyer");
        setProfExp(data.exp || "5 Years");
      }

      const allApplications = localStorage.getItem("livinglaw_admin_prof_applications");
      if (allApplications) {
        setAppliedLawyers(JSON.parse(allApplications));
      } else {
        const defaultApplications = [
          { name: "Adv. Karan Malhotra", type: "Lawyer", barId: "D/1092/2018", exp: "8 Years", status: "pending" }
        ];
        setAppliedLawyers(defaultApplications);
        localStorage.setItem("livinglaw_admin_prof_applications", JSON.stringify(defaultApplications));
      }

      // Default Agenda Schedulers
      const defaultHearings = [
        { id: "1", title: "Rahul Saxena Commercial Dispute Mediation", date: "2026-06-10", time: "11:00 AM", court: "Living Law ODR Room" },
        { id: "2", title: "Writ Petition - Environment Protection", date: "2026-06-15", time: "10:30 AM", court: "Supreme Court (Court Room 3)" }
      ];
      setHearings(defaultHearings);
    };

    fetchUserAndData();
  }, [currentUser]);

  // Professional profile verification form trigger
  const handleApplyVerification = (e: React.FormEvent) => {
    e.preventDefault();
    if (!profName || !barId) {
      alert("Name and Bar Registration ID are required.");
      return;
    }

    const applicationData = {
      name: profName,
      barId,
      type: profType,
      exp: profExp,
      status: "pending"
    };

    // Save prof status
    setVerifyStatus("pending");
    localStorage.setItem("livinglaw_prof_verification", JSON.stringify(applicationData));

    // Save to admin listing database
    const existingApps = localStorage.getItem("livinglaw_admin_prof_applications");
    const list = existingApps ? JSON.parse(existingApps) : [];
    // remove duplicates if any
    const filtered = list.filter((l: any) => l.barId !== barId);
    filtered.push(applicationData);
    localStorage.setItem("livinglaw_admin_prof_applications", JSON.stringify(filtered));
    setAppliedLawyers(filtered);

    alert("Your professional registration credentials have been sent to the Admin queue for verification.");
  };

  // Switch to admin and verify
  const handleAdminVerifyLawyer = (targetBarId: string) => {
    // Approve lawyer
    const updated = appliedLawyers.map(l => l.barId === targetBarId ? { ...l, status: "verified" } : l);
    setAppliedLawyers(updated);
    localStorage.setItem("livinglaw_admin_prof_applications", JSON.stringify(updated));

    // If matches current lawyer, change current profile state
    const currentProf = localStorage.getItem("livinglaw_prof_verification");
    if (currentProf) {
      const parsed = JSON.parse(currentProf);
      if (parsed.barId === targetBarId) {
        parsed.status = "verified";
        setVerifyStatus("verified");
        localStorage.setItem("livinglaw_prof_verification", JSON.stringify(parsed));
      }
    }
    alert(`Bar ID ${targetBarId} has been successfully verified! User status updated.`);
  };

  // Client Upgrade Purchase Flow
  const handleBuySubscription = (planName: string, amount: string) => {
    const confirmBuy = window.confirm(`Confirm purchase of ${planName} for ${amount}?`);
    if (confirmBuy) {
      localStorage.setItem("livinglaw_client_sub", planName);
      setClientSub(planName);
      alert(`${planName} purchased successfully. Living Law Academy & Premium AI assistant unlocked!`);
    }
  };

  // Professional Upgrade Purchase Flow
  const handleBuyProfSubscription = (planName: string, amount: string) => {
    const confirmBuy = window.confirm(`Confirm purchase of Professional ${planName} for ${amount}?`);
    if (confirmBuy) {
      localStorage.setItem("livinglaw_prof_sub", planName);
      setProfSub(planName);
      alert(`Professional subscription "${planName}" purchased successfully. Listing and ODR features unlocked!`);
    }
  };

  // Add Hearing
  const handleAddHearing = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHearingTitle || !newHearingDate || !newHearingTime) return;

    const hearing: CourtHearing = {
      id: Math.random().toString(),
      title: newHearingTitle,
      date: newHearingDate,
      time: newHearingTime,
      court: newHearingCourt
    };

    setHearings([...hearings, hearing]);
    setNewHearingTitle("");
    setNewHearingDate("");
    setNewHearingTime("");
    alert("Diary event added successfully.");
  };

  // Remove Agenda Item
  const handleRemoveHearing = (id: string) => {
    setHearings(hearings.filter(h => h.id !== id));
  };

  // AI Assistant: Summarize
  const handleSummarize = () => {
    if (!summaryInput) return;
    setIsSummarizing(true);
    setSummaryOutput("");

    setTimeout(() => {
      setSummaryOutput(
        `**Legal Document Summary Highlights (Living Law AI Analyzer):**\n\n` +
        `1. **Core Subject:** Agreement governs service levels, confidentiality covenants, and non-compete terms.\n` +
        `2. **Critical Obligations:** Party B must deliver monthly code audits, subject to 15-day rectification periods upon notification.\n` +
        `3. **Liability Capping:** Total liability of either party is capped at the total fee paid during the preceding 6 months, excluding breaches of privacy clauses.\n` +
        `4. **Jurisdiction & Dispute Resolution:** Governed by the laws of India. Disputes are subject to mandatory ODR arbitration in Delhi.`
      );
      setIsSummarizing(false);
    }, 1500);
  };

  // AI Assistant: Drafting
  const handleDraft = () => {
    if (!draftPartyA || !draftPartyB) {
      alert("Both party names are required to formulate draft.");
      return;
    }

    let text = "";
    if (draftType === "Default Notice (Rent)") {
      text = `**FORMAL NOTICE FOR DEFAULT IN RENT PAYMENT**\n\n` +
             `To: ${draftPartyB}\n` +
             `From: ${draftPartyA}\n` +
             `Date: ${new Date().toLocaleDateString("en-IN")}\n\n` +
             `Subject: Notice under Section 106 of the Transfer of Property Act, 1882 for default in rent payment.\n\n` +
             `Dear Sir/Madam,\n` +
             `You are hereby notified that you have defaulted on rent payments for the premises situated at [Premises Address] for the period ${draftDetails || "[Specify Period]"}. Total unpaid arrears sum to INR [Amount].\n\n` +
             `You are requested to clear all pending dues within 15 days of receipt of this notice, failing which I shall be constrained to initiate eviction proceedings and file a civil claim recovery suit.\n\n` +
             `Sincerely,\n` +
             `${draftPartyA}`;
    } else {
      text = `**NON-DISCLOSURE AGREEMENT (NDA)**\n\n` +
             `This Agreement is executed by and between:\n` +
             `1. ${draftPartyA} (Disclosing Party)\n` +
             `2. ${draftPartyB} (Receiving Party)\n\n` +
             `**1. Purpose:** The Disclosing Party intends to share proprietary details regarding: ${draftDetails || "Business Operations"}.\n` +
             `**2. Obligations:** The Receiving Party shall hold all Confidential Information in absolute trust and shall not disclose it to any third party without written consent. This obligation persists for a period of 3 years.\n\n` +
             `Signed, by the authorized representatives of both parties.`;
    }
    setDraftResult(text);
  };

  // AI Assistant: Case Law database
  const handleSearchCaseLaw = () => {
    if (!judgmentQuery) return;
    const q = judgmentQuery.toLowerCase();
    
    if (q.includes("kesavananda") || q.includes("structure")) {
      setJudgmentResult({
        title: "Kesavananda Bharati v. State of Kerala (1973)",
        citation: "AIR 1973 SC 1461",
        bench: "13-Judge Bench (Largest in SC History)",
        ratio: "Established the **Basic Structure Doctrine**. The Supreme Court ruled that while Parliament has wide powers to amend the Constitution under Article 368, it cannot amend or alter its 'Basic Structure' (e.g., secularism, federalism, judicial review, democracy)."
      });
    } else if (q.includes("maneka") || q.includes("gandhi") || q.includes("travel")) {
      setJudgmentResult({
        title: "Maneka Gandhi v. Union of India (1978)",
        citation: "AIR 1978 SC 597",
        bench: "7-Judge Bench",
        ratio: "Significantly expanded the scope of **Article 21 (Right to Life & Liberty)**. Held that procedure establishing deprivation of personal liberty must be 'reasonable, fair, and just' and not arbitrary. Introduced 'Due Process' concepts in constitutional interpretation."
      });
    } else {
      setJudgmentResult({
        title: "Simulated Indian Case Match on: " + judgmentQuery,
        citation: "2026 SC Online 8392",
        bench: "Division Bench",
        ratio: "The Court reaffirmed that administrative guidelines cannot override statutory rules. In cases concerning default, notice under standard CPC frameworks must be served with reasonable notice periods."
      });
    }
  };

  // eCourts status check
  const handleSearchEcourt = () => {
    if (!ecourtNumber) return;
    setIsEcourtSearching(true);
    setEcourtResult(null);

    setTimeout(() => {
      setEcourtResult({
        caseNumber: ecourtNumber,
        state: ecourtState,
        stage: "Pleadings & Replication Stage",
        nextHearing: "2026-07-22",
        judge: "Hon'ble Judge Amit Khare (District Commercial Court)",
        history: [
          { date: "2026-04-12", status: "Notice Issued" },
          { date: "2026-05-18", status: "Defendant Written Statement Submitted" }
        ]
      });
      setIsEcourtSearching(false);
    }, 1500);
  };

  // Draft Social Post
  const handleSocialDraft = () => {
    setIsSocialDrafting(true);
    setSocialResult("");
    setTimeout(() => {
      setSocialResult(
        `📢 **LEGAL AWARENESS POST:**\n\n` +
        `Did you know your rights as a digital consumer under Indian law? Under the Consumer Protection (E-Commerce) Rules, 2020:\n\n` +
        `✅ E-commerce entities must provide details of grievance officers prominently on their platforms.\n` +
        `✅ Return, refund, and product exchange parameters must be clearly specified.\n` +
        `✅ Misleading advertisements and fake reviews are subject to heavy penalties by the CCPA.\n\n` +
        `Knowledge is protection. Share this to raise legal awareness! #ConsumerRights #LivingLaw`
      );
      setIsSocialDrafting(false);
    }, 1500);
  };

  return (
    <div className="bg-white dark:bg-[#030712] min-h-screen text-slate-900 dark:text-slate-100 transition-colors duration-300">
      <Navbar />

      {/* Header Panel */}
      <section className="relative overflow-hidden py-10 bg-slate-950 text-white border-b border-amber-500/20">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[radial-gradient(#d4af37_1px,transparent_1px)] [background-size:16px_16px]"></div>
        <div className="max-w-7xl mx-auto px-6 relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-serif-legal font-bold">Living Law <span className="text-amber-400">Workspaces</span></h1>
            <p className="text-xs text-slate-400 mt-1">Configure and manage active filings, court agendas, and professional approvals.</p>
          </div>
          
          {/* User Role Selector & Login state */}
          <div className="flex flex-col items-end gap-2 shrink-0">
            {currentUser ? (
              <div className="text-xs text-slate-400 flex items-center gap-2">
                <span>Logged in as: <strong className="text-white">{currentUser.email}</strong></span>
                <button 
                  onClick={async () => {
                    if (supabase) await supabase.auth.signOut();
                    localStorage.removeItem("living_law_mock_user");
                    setCurrentUser(null);
                    window.location.reload();
                  }}
                  className="text-amber-500 hover:text-amber-400 underline font-semibold transition"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <button 
                onClick={() => setIsAuthOpen(true)}
                className="bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold px-4 py-2 rounded-xl transition shadow-lg shadow-amber-500/10"
              >
                Login / Register
              </button>
            )}

            <div className="flex bg-slate-900 border border-slate-800 p-1.5 rounded-xl text-xs gap-1.5 self-start md:self-auto shrink-0 mt-1">
              {(["client", "professional", "neutral", "admin"] as const).map((role) => (
                <button
                  key={role}
                  onClick={() => setActiveRole(role)}
                  className={`px-3 py-2 rounded-lg font-bold capitalize transition ${
                    activeRole === role
                      ? "bg-amber-500 text-white shadow"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  {role}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Main Workspace Dashboard Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Dashboard Left column: Role workspace panels */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* CLIENT WORKSPACE */}
            {activeRole === "client" && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
                  <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800/80 pb-4">
                    <h3 className="font-serif-legal font-bold text-xl flex items-center gap-2">
                      <User className="text-amber-500" size={20} />
                      <span>Client Dashboard</span>
                    </h3>
                    <span className="bg-amber-500/10 text-amber-500 dark:text-amber-400 text-xs px-2.5 py-1 rounded-md font-semibold">
                      Subscription: {clientSub}
                    </span>
                  </div>

                  {/* Client sub cards */}
                  <div className="grid md:grid-cols-2 gap-4">
                    {/* Active registrations */}
                    <div className="border border-slate-100 dark:border-slate-800 p-4 rounded-xl space-y-3">
                      <h4 className="font-semibold text-sm text-slate-500 flex items-center gap-1.5">
                        <Building2 size={16} />
                        <span>Corporate Registrations</span>
                      </h4>
                      {clientRegs.length > 0 ? (
                        <div className="space-y-2">
                          {clientRegs.map((reg, idx) => (
                            <div key={idx} className="flex justify-between text-xs p-2 bg-slate-50 dark:bg-slate-950 rounded-lg">
                              <span className="font-medium">{reg.entityName}</span>
                              <span className="text-amber-500 font-bold">{reg.status}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-slate-400">No active applications. Launch new e-filing in Marketplace.</p>
                      )}
                    </div>

                    {/* Active stamp paper */}
                    <div className="border border-slate-100 dark:border-slate-800 p-4 rounded-xl space-y-3">
                      <h4 className="font-semibold text-sm text-slate-500 flex items-center gap-1.5">
                        <FileText size={16} />
                        <span>Notary & e-Stamps</span>
                      </h4>
                      {clientNotaries.length > 0 ? (
                        <div className="space-y-2">
                          {clientNotaries.map((nt, idx) => (
                            <div key={idx} className="flex justify-between text-xs p-2 bg-slate-50 dark:bg-slate-950 rounded-lg">
                              <span className="font-medium">{nt.agreementType} ({nt.stateName})</span>
                              <span className="text-emerald-500 font-bold">Issued</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-slate-400">No stamps generated yet. Notarize in Notary Portal.</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Subscriptions purchase modules */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
                  <h4 className="font-serif-legal font-bold text-lg border-b border-slate-100 dark:border-slate-800 pb-3">
                    Bundled Onboarding Packages
                  </h4>

                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Plan 1 */}
                    <div className="border border-slate-200 dark:border-slate-800 p-5 rounded-2xl space-y-4 hover:border-amber-500/30 transition">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-xs text-amber-500 uppercase tracking-widest font-bold">Standard Academy Bundle</span>
                          <h5 className="font-bold text-base mt-1">6-Month Access</h5>
                        </div>
                        <span className="text-xl font-black text-slate-900 dark:text-slate-100">₹3,000</span>
                      </div>
                      <ul className="text-xs text-slate-500 dark:text-slate-400 space-y-2 list-disc list-inside">
                        <li>Living Law Academy full lectures access</li>
                        <li>Civil/Criminal draft formats library</li>
                        <li>Supreme Court Landmark summaries</li>
                        <li>AI Document summarize limits: 50/mo</li>
                      </ul>
                      <button 
                        onClick={() => handleBuySubscription("6-Month Academy Bundle", "₹3,000")}
                        className="w-full bg-slate-950 dark:bg-white text-white dark:text-black font-semibold py-2 rounded-xl text-xs"
                      >
                        Activate Plan
                      </button>
                    </div>

                    {/* Plan 2 */}
                    <div className="border-2 border-amber-500 p-5 rounded-2xl space-y-4 relative overflow-hidden bg-amber-500/5">
                      <div className="absolute top-2 right-2 bg-amber-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-md">BEST VALUE</div>
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-xs text-amber-500 uppercase tracking-widest font-bold">Premium Counsel Bundle</span>
                          <h5 className="font-bold text-base mt-1">1-Year Access</h5>
                        </div>
                        <span className="text-xl font-black text-slate-900 dark:text-slate-100">₹5,000</span>
                      </div>
                      <ul className="text-xs text-slate-500 dark:text-slate-400 space-y-2 list-disc list-inside">
                        <li>All features of 6-Month plan included</li>
                        <li>Advanced ODR mediation fee discounts</li>
                        <li>Unlimited AI Document summarize & drafts</li>
                        <li>Premium court-hearing diary planner</li>
                      </ul>
                      <button 
                        onClick={() => handleBuySubscription("1-Year Premium Bundle", "₹5,000")}
                        className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-2 rounded-xl text-xs shadow-md shadow-amber-500/10"
                      >
                        Activate Plan
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* PROFESSIONAL WORKSPACE */}
            {activeRole === "professional" && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
                  
                  {/* Verification Banner */}
                  {verifyStatus === "not_applied" && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 p-4 rounded-xl text-xs flex gap-3 items-center">
                      <AlertTriangle size={20} className="shrink-0 animate-bounce" />
                      <div className="flex-1">
                        <p className="font-bold">Bar Association ID Not Verified</p>
                        <p className="mt-0.5">Please submit your Bar Council registration ID to unlock full professional listings.</p>
                      </div>
                    </div>
                  )}

                  {verifyStatus === "pending" && (
                    <div className="bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 p-4 rounded-xl text-xs flex gap-3 items-center">
                      <Clock size={20} className="shrink-0 animate-pulse" />
                      <div className="flex-1">
                        <p className="font-bold">Credential Verification Pending Admin Approval</p>
                        <p className="mt-0.5">Our compliance admins are verifying your uploaded credentials. Check back soon.</p>
                      </div>
                    </div>
                  )}

                  {verifyStatus === "verified" && (
                    <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 p-4 rounded-xl text-xs flex gap-3 items-center">
                      <CheckCircle2 size={20} className="shrink-0" />
                      <div className="flex-1">
                        <p className="font-bold">Bar credentials Verified & Listing is Active</p>
                        <p className="mt-0.5">You appear in client search results as a verified professional. You can manage ODR invites.</p>
                      </div>
                    </div>
                  )}

                  {/* Profile setup form */}
                  {verifyStatus === "not_applied" && (
                    <form onSubmit={handleApplyVerification} className="space-y-4">
                      <h4 className="font-serif-legal font-bold text-lg border-b border-slate-100 dark:border-slate-800 pb-2">Apply for Professional Listing</h4>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] font-semibold text-slate-500 uppercase mb-2">Professional Name</label>
                          <input 
                            type="text" 
                            required
                            value={profName}
                            onChange={(e) => setProfName(e.target.value)}
                            placeholder="e.g. Adv. Karan Malhotra" 
                            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-amber-500"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-semibold text-slate-500 uppercase mb-2">Bar Association Registration ID</label>
                          <input 
                            type="text" 
                            required
                            value={barId}
                            onChange={(e) => setBarId(e.target.value)}
                            placeholder="e.g. D/1092/2018" 
                            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-amber-500"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-semibold text-slate-500 uppercase mb-2">Profession Type</label>
                          <select 
                            value={profType}
                            onChange={(e) => setProfType(e.target.value)}
                            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-amber-500"
                          >
                            <option>Lawyer</option>
                            <option>Chartered Accountant (CA)</option>
                            <option>Company Secretary (CS)</option>
                            <option>Arbitrator / Mediator</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-[10px] font-semibold text-slate-500 uppercase mb-2">Years of Experience</label>
                          <select 
                            value={profExp}
                            onChange={(e) => setProfExp(e.target.value)}
                            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-amber-500"
                          >
                            <option>1-3 Years</option>
                            <option>4-7 Years</option>
                            <option>8-15 Years</option>
                            <option>15+ Years</option>
                          </select>
                        </div>
                      </div>

                      <button 
                        type="submit" 
                        className="bg-amber-500 hover:bg-amber-600 text-white font-bold py-2.5 px-6 rounded-xl text-xs transition"
                      >
                        Submit Profile for Verification
                      </button>
                    </form>
                  )}
                </div>

                {/* Professional Schedulers Diary & CRM */}
                {verifyStatus === "verified" && (
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Court Agenda Schedulers */}
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
                      <h4 className="font-serif-legal font-bold text-base border-b border-slate-100 dark:border-slate-800 pb-2 flex items-center gap-1.5">
                        <Calendar size={18} className="text-amber-500" />
                        <span>Diary & Hearing Agenda</span>
                      </h4>

                      <form onSubmit={handleAddHearing} className="space-y-2 text-[10px] text-slate-500 uppercase tracking-wider font-semibold">
                        <input 
                          type="text" 
                          required
                          value={newHearingTitle}
                          onChange={(e) => setNewHearingTitle(e.target.value)}
                          placeholder="Hearing or consultation title"
                          className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs normal-case text-slate-900 dark:text-slate-100 focus:outline-none"
                        />
                        <div className="grid grid-cols-2 gap-2">
                          <input 
                            type="date" 
                            required
                            value={newHearingDate}
                            onChange={(e) => setNewHearingDate(e.target.value)}
                            className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-slate-100 focus:outline-none"
                          />
                          <input 
                            type="text" 
                            required
                            value={newHearingTime}
                            onChange={(e) => setNewHearingTime(e.target.value)}
                            placeholder="11:30 AM"
                            className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs normal-case text-slate-900 dark:text-slate-100 focus:outline-none"
                          />
                        </div>
                        <button 
                          type="submit" 
                          className="bg-slate-950 text-white dark:bg-white dark:text-black py-1.5 rounded-lg w-full text-[10px] font-bold"
                        >
                          Schedule Event
                        </button>
                      </form>

                      <div className="space-y-2 max-h-40 overflow-y-auto pt-2">
                        {hearings.map((h) => (
                          <div key={h.id} className="p-2.5 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-100 dark:border-slate-800 text-[11px] flex justify-between items-start gap-2">
                            <div>
                              <p className="font-semibold text-slate-800 dark:text-slate-200 leading-tight">{h.title}</p>
                              <p className="text-[9px] text-slate-400 mt-1">{h.date} at {h.time} • {h.court}</p>
                            </div>
                            <button onClick={() => handleRemoveHearing(h.id)} className="text-red-500 hover:text-red-600">
                              <Trash2 size={12} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* CRM Client Enquiry Leads */}
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
                      <h4 className="font-serif-legal font-bold text-base border-b border-slate-100 dark:border-slate-800 pb-2 flex items-center gap-1.5">
                        <Briefcase size={18} className="text-amber-500" />
                        <span>CRM Portal Client Leads</span>
                      </h4>

                      <div className="space-y-2">
                        {crmLeads.map((lead, idx) => (
                          <div key={idx} className="p-3 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-xl space-y-2">
                            <div className="flex justify-between text-[11px]">
                              <span className="font-semibold text-slate-800 dark:text-slate-200">{lead.name}</span>
                              <span className="text-[9px] text-slate-400">{lead.date}</span>
                            </div>
                            <p className="text-[10px] text-amber-500/90 leading-tight font-medium">{lead.type}</p>
                            <div className="flex justify-between items-center pt-1">
                              <span className="text-[9px] text-slate-400">{lead.email}</span>
                              <button 
                                onClick={() => alert(`Opening email drafter to respond to ${lead.email}...`)}
                                className="bg-slate-950 text-white dark:bg-white dark:text-black hover:bg-amber-500 text-[8px] font-bold px-2 py-1 rounded"
                              >
                                Reach Out
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Social post drafting helper */}
                      <div className="border-t border-slate-100 dark:border-slate-800/80 pt-4 space-y-2">
                        <h5 className="text-[11px] font-bold text-slate-500">Legal awareness post drafts:</h5>
                        <div className="flex gap-1.5">
                          <input 
                            type="text" 
                            value={socialPrompt}
                            onChange={(e) => setSocialPrompt(e.target.value)}
                            placeholder="Enter awareness topic..." 
                            className="flex-1 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-1.5 text-xs focus:outline-none"
                          />
                          <button 
                            onClick={handleSocialDraft}
                            disabled={isSocialDrafting}
                            className="bg-amber-500 text-white text-[10px] font-bold px-3 rounded-xl shrink-0"
                          >
                            Draft
                          </button>
                        </div>

                        {socialResult && (
                          <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-3 rounded-xl text-[10px] leading-relaxed whitespace-pre-line text-slate-400 relative">
                            <button 
                              onClick={() => {
                                navigator.clipboard.writeText(socialResult);
                                alert("Social post copied to clipboard!");
                              }}
                              className="absolute top-2 right-2 text-slate-500 hover:text-amber-500"
                            >
                              <Copy size={10} />
                            </button>
                            {socialResult}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Professional Subscription Plans */}
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6 mt-6">
                      <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3 flex-wrap gap-2">
                        <h4 className="font-serif-legal font-bold text-lg">
                          Professional Subscription Tiers
                        </h4>
                        <span className="text-xs bg-amber-500/10 text-amber-600 dark:text-amber-400 px-3 py-1 rounded-full font-bold">
                          Active Plan: {profSub}
                        </span>
                      </div>

                      <div className="grid md:grid-cols-4 gap-6">
                        {/* Tier 1 */}
                        <div className="border border-slate-200 dark:border-slate-800 p-5 rounded-2xl space-y-4 hover:border-amber-500/30 transition flex flex-col justify-between">
                          <div className="space-y-3">
                            <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold block">1 Month Tier</span>
                            <h5 className="font-bold text-base">ODR Access Only</h5>
                            <span className="text-xl font-black text-slate-900 dark:text-slate-100 block">₹1,999</span>
                            <p className="text-[10px] text-slate-500 dark:text-slate-400">Basic single-month ODR dispute resolution platform usage.</p>
                          </div>
                          <button 
                            onClick={() => handleBuyProfSubscription("1-Month ODR", "₹1,999")}
                            className="w-full bg-slate-950 dark:bg-white text-white dark:text-black font-semibold py-2.5 rounded-xl text-xs mt-4"
                          >
                            Activate Plan
                          </button>
                        </div>

                        {/* Tier 2 */}
                        <div className="border border-slate-200 dark:border-slate-800 p-5 rounded-2xl space-y-4 hover:border-amber-500/30 transition flex flex-col justify-between">
                          <div className="space-y-3">
                            <span className="text-[10px] text-amber-500 uppercase tracking-widest font-bold block">Basic Plan</span>
                            <h5 className="font-bold text-base">3 Months Access</h5>
                            <span className="text-xl font-black text-slate-900 dark:text-slate-100 block">₹3,000</span>
                            <p className="text-[10px] text-slate-500 dark:text-slate-400">Basic website built (at least 5 pages) + AI premium subscription for LL tools + full listing & ODR access.</p>
                          </div>
                          <button 
                            onClick={() => handleBuyProfSubscription("Basic 3-Month", "₹3,000")}
                            className="w-full bg-slate-950 dark:bg-white text-white dark:text-black font-semibold py-2.5 rounded-xl text-xs mt-4"
                          >
                            Activate Plan
                          </button>
                        </div>

                        {/* Tier 3 */}
                        <div className="border-2 border-amber-500 p-5 rounded-2xl space-y-4 relative overflow-hidden bg-amber-500/5 flex flex-col justify-between">
                          <div className="absolute top-2 right-2 bg-amber-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-md">POPULAR</div>
                          <div className="space-y-3">
                            <span className="text-[10px] text-amber-500 uppercase tracking-widest font-bold block">Standard Plan</span>
                            <h5 className="font-bold text-base">6 Months Access</h5>
                            <span className="text-xl font-black text-slate-900 dark:text-slate-100 block">₹6,000</span>
                            <p className="text-[10px] text-slate-500 dark:text-slate-400">10-page firm/lawyer website + all AI tools + full listing & ODR platform access.</p>
                          </div>
                          <button 
                            onClick={() => handleBuyProfSubscription("Standard 6-Month", "₹6,000")}
                            className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-2.5 rounded-xl text-xs mt-4 shadow-md shadow-amber-500/10"
                          >
                            Activate Plan
                          </button>
                        </div>

                        {/* Tier 4 */}
                        <div className="border border-slate-200 dark:border-slate-800 p-5 rounded-2xl space-y-4 hover:border-amber-500/30 transition flex flex-col justify-between">
                          <div className="space-y-3">
                            <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold block">Yearly Plan</span>
                            <h5 className="font-bold text-base">12 Months Access</h5>
                            <span className="text-xl font-black text-slate-900 dark:text-slate-100 block">₹11,000</span>
                            <p className="text-[10px] text-slate-500 dark:text-slate-400">15-page customized website + all AI tools + full listing & ODR access + 6 months extra subscription.</p>
                          </div>
                          <button 
                            onClick={() => handleBuyProfSubscription("Yearly 12-Month", "₹11,000")}
                            className="w-full bg-slate-950 dark:bg-white text-white dark:text-black font-semibold py-2.5 rounded-xl text-xs mt-4"
                          >
                            Activate Plan
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* NEUTRAL WORKSPACE */}
            {activeRole === "neutral" && (
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6 animate-in fade-in duration-300">
                <h3 className="font-serif-legal font-bold text-xl border-b border-slate-100 dark:border-slate-800 pb-4 flex items-center gap-2">
                  <ShieldAlert className="text-amber-500" size={20} />
                  <span>Neutral Resolution Workspace</span>
                </h3>

                <p className="text-xs text-slate-400">Manage pending arbitration / mediation dispute invites filed by corporate parties.</p>

                <div className="space-y-3">
                  {odrCases.map((c) => (
                    <div key={c.id} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 flex justify-between items-center gap-4 text-xs">
                      <div>
                        <div className="flex gap-2 items-center mb-1">
                          <span className="font-bold text-amber-500 font-mono">{c.id}</span>
                          <span className="bg-slate-200 dark:bg-slate-800 px-2 py-0.5 rounded text-[10px] font-semibold">{c.type}</span>
                        </div>
                        <h4 className="font-bold text-slate-800 dark:text-slate-200">{c.claimant} vs. {c.respondent}</h4>
                        <p className="text-[10px] text-slate-400 mt-1">Dispute Amount: ₹{c.claimAmount.toLocaleString("en-IN")}</p>
                      </div>

                      <div className="flex gap-2">
                        <button 
                          onClick={() => alert("Mediator invite accepted. Entering ODR Case hearing chamber.")}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-3 rounded-lg text-[10px]"
                        >
                          Accept Case
                        </button>
                        <button 
                          onClick={() => alert("Mediator invite declined.")}
                          className="bg-slate-200 dark:bg-slate-800 text-slate-400 hover:text-slate-200 py-2 px-3 rounded-lg text-[10px]"
                        >
                          Decline
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ADMIN WORKSPACE */}
            {activeRole === "admin" && (
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6 animate-in fade-in duration-300">
                <h3 className="font-serif-legal font-bold text-xl border-b border-slate-100 dark:border-slate-800 pb-4 flex items-center gap-2">
                  <Award className="text-amber-500" size={20} />
                  <span>Living Law Compliance Control Admin</span>
                </h3>

                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl">
                    <span className="text-[9px] uppercase tracking-wider text-slate-400 block font-semibold">Active ODR cases</span>
                    <span className="text-xl font-bold">{odrCases.length}</span>
                  </div>
                  <div className="p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl">
                    <span className="text-[9px] uppercase tracking-wider text-slate-400 block font-semibold">Filing Revenue</span>
                    <span className="text-xl font-bold text-emerald-500">₹{(clientRegs.reduce((a, b) => a + b.feePaid, 0)).toLocaleString("en-IN")}</span>
                  </div>
                  <div className="p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl">
                    <span className="text-[9px] uppercase tracking-wider text-slate-400 block font-semibold">Stamp Duty Orders</span>
                    <span className="text-xl font-bold">{clientNotaries.length}</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-serif-legal font-bold text-base border-b border-slate-100 dark:border-slate-800 pb-2">Pending Professional Verification Queue</h4>
                  
                  <div className="space-y-3">
                    {appliedLawyers.map((lawyer, idx) => (
                      <div key={idx} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 flex justify-between items-center gap-4 text-xs">
                        <div>
                          <h5 className="font-bold text-slate-800 dark:text-slate-200">{lawyer.name}</h5>
                          <p className="text-[10px] text-slate-400 mt-0.5">{lawyer.type} • Exp: {lawyer.exp} • Bar ID: <strong className="font-mono">{lawyer.barId}</strong></p>
                        </div>

                        {lawyer.status === "pending" ? (
                          <button 
                            onClick={() => handleAdminVerifyLawyer(lawyer.barId)}
                            className="bg-amber-500 hover:bg-amber-600 text-white font-bold py-1.5 px-3 rounded-lg text-[10px] shadow"
                          >
                            Approve Listing
                          </button>
                        ) : (
                          <span className="text-emerald-500 font-bold flex items-center gap-1 text-[10px]">
                            <CheckCircle2 size={12} />
                            <span>Verified</span>
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* Dashboard Right column: AI Legal Assistant Panel */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                <Sparkles className="text-amber-500 animate-pulse" size={20} />
                <h3 className="font-serif-legal font-bold text-base">
                  AI Legal Assistant Console
                </h3>
              </div>

              {/* AI Tab Selector */}
              <div className="grid grid-cols-4 gap-1 p-1 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-[10px] font-bold text-slate-500">
                <button 
                  onClick={() => setAiActiveTab("summarize")}
                  className={`py-1.5 rounded transition ${aiActiveTab === "summarize" ? "bg-amber-500 text-white shadow" : "hover:text-slate-200"}`}
                >
                  Summary
                </button>
                <button 
                  onClick={() => setAiActiveTab("draft")}
                  className={`py-1.5 rounded transition ${aiActiveTab === "draft" ? "bg-amber-500 text-white shadow" : "hover:text-slate-200"}`}
                >
                  Draft
                </button>
                <button 
                  onClick={() => setAiActiveTab("judgments")}
                  className={`py-1.5 rounded transition ${aiActiveTab === "judgments" ? "bg-amber-500 text-white shadow" : "hover:text-slate-200"}`}
                >
                  Judgments
                </button>
                <button 
                  onClick={() => setAiActiveTab("ecourts")}
                  className={`py-1.5 rounded transition ${aiActiveTab === "ecourts" ? "bg-amber-500 text-white shadow" : "hover:text-slate-200"}`}
                >
                  eCourts
                </button>
              </div>

              {/* SUMMARY TAB */}
              {aiActiveTab === "summarize" && (
                <div className="space-y-3 animate-in fade-in duration-200 text-xs">
                  <p className="text-slate-400 text-[10px]">Enter legal briefs or contract sections to summarize key parameters:</p>
                  <textarea 
                    value={summaryInput}
                    onChange={(e) => setSummaryInput(e.target.value)}
                    placeholder="Paste NDA clauses or petition details here..."
                    rows={4}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-3 focus:outline-none"
                  />
                  <button 
                    onClick={handleSummarize}
                    disabled={isSummarizing}
                    className="w-full bg-slate-950 text-white dark:bg-white dark:text-black py-2 rounded-xl font-bold flex items-center justify-center gap-1"
                  >
                    {isSummarizing ? "Processing Summary..." : "Summarize Document"}
                  </button>

                  {summaryOutput && (
                    <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-3 rounded-xl text-[11px] leading-relaxed whitespace-pre-line text-slate-400">
                      {summaryOutput}
                    </div>
                  )}
                </div>
              )}

              {/* DRAFT TAB */}
              {aiActiveTab === "draft" && (
                <div className="space-y-3 animate-in fade-in duration-200 text-xs">
                  <p className="text-slate-400 text-[10px]">Generate custom template filings dynamically:</p>
                  
                  <select 
                    value={draftType}
                    onChange={(e) => setDraftType(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs"
                  >
                    <option>Default Notice (Rent)</option>
                    <option>Non-Disclosure Agreement (NDA)</option>
                  </select>

                  <div className="grid grid-cols-2 gap-2">
                    <input 
                      type="text" 
                      value={draftPartyA}
                      onChange={(e) => setDraftPartyA(e.target.value)}
                      placeholder="Disclosing Party / Landlord" 
                      className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs"
                    />
                    <input 
                      type="text" 
                      value={draftPartyB}
                      onChange={(e) => setDraftPartyB(e.target.value)}
                      placeholder="Receiving Party / Tenant" 
                      className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs"
                    />
                  </div>

                  <input 
                    type="text" 
                    value={draftDetails}
                    onChange={(e) => setDraftDetails(e.target.value)}
                    placeholder="Specific items (e.g. rent overdue months)" 
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs"
                  />

                  <button 
                    onClick={handleDraft}
                    className="w-full bg-slate-950 text-white dark:bg-white dark:text-black py-2 rounded-xl font-bold"
                  >
                    Generate Legal Draft
                  </button>

                  {draftResult && (
                    <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-3 rounded-xl text-[11px] leading-relaxed whitespace-pre-line text-slate-400 relative">
                      <button 
                        onClick={() => {
                          navigator.clipboard.writeText(draftResult);
                          alert("Draft copied to clipboard!");
                        }}
                        className="absolute top-2 right-2 text-slate-500 hover:text-amber-500"
                      >
                        <Copy size={10} />
                      </button>
                      {draftResult}
                    </div>
                  )}
                </div>
              )}

              {/* JUDGMENTS TAB */}
              {aiActiveTab === "judgments" && (
                <div className="space-y-3 animate-in fade-in duration-200 text-xs">
                  <p className="text-slate-400 text-[10px]">Query Supreme Court Landmark Judgments database:</p>
                  
                  <div className="flex gap-1.5">
                    <input 
                      type="text" 
                      value={judgmentQuery}
                      onChange={(e) => setJudgmentQuery(e.target.value)}
                      placeholder="e.g. Kesavananda, basic structure..." 
                      className="flex-1 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs focus:outline-none"
                    />
                    <button 
                      onClick={handleSearchCaseLaw}
                      className="bg-amber-500 text-white text-xs font-bold px-3 rounded-xl"
                    >
                      Search
                    </button>
                  </div>

                  {judgmentResult && (
                    <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-3 rounded-xl text-[11px] leading-relaxed space-y-1.5 text-slate-400">
                      <h4 className="font-semibold text-slate-800 dark:text-slate-200">{judgmentResult.title}</h4>
                      <p><strong>Citation:</strong> {judgmentResult.citation}</p>
                      <p><strong>Bench:</strong> {judgmentResult.bench}</p>
                      <p className="whitespace-pre-line">{judgmentResult.ratio}</p>
                    </div>
                  )}
                </div>
              )}

              {/* ECOURTS STATUS TAB */}
              {aiActiveTab === "ecourts" && (
                <div className="space-y-3 animate-in fade-in duration-200 text-xs">
                  <p className="text-slate-400 text-[10px]">Retrieve live case status summaries from e-Courts:</p>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <select 
                      value={ecourtState}
                      onChange={(e) => setEcourtState(e.target.value)}
                      className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs"
                    >
                      <option>Delhi</option>
                      <option>Punjab</option>
                      <option>Rajasthan</option>
                    </select>

                    <input 
                      type="text" 
                      value={ecourtNumber}
                      onChange={(e) => setEcourtNumber(e.target.value)}
                      placeholder="Case Number (e.g. CS/2026/892)" 
                      className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs"
                    />
                  </div>

                  <button 
                    onClick={handleSearchEcourt}
                    disabled={isEcourtSearching}
                    className="w-full bg-slate-950 text-white dark:bg-white dark:text-black py-2 rounded-xl font-bold"
                  >
                    {isEcourtSearching ? "Scanning Court Registrar..." : "Search eCourts"}
                  </button>

                  {ecourtResult && (
                    <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-3 rounded-xl text-[11px] leading-relaxed space-y-1.5 text-slate-400">
                      <p><strong>Court:</strong> {ecourtResult.stage} at {ecourtResult.state}</p>
                      <p><strong>Judge:</strong> {ecourtResult.judge}</p>
                      <p className="text-amber-500 font-bold"><strong>Next Hearing:</strong> {ecourtResult.nextHearing}</p>
                      <hr className="border-slate-200 dark:border-slate-800 my-1" />
                      <p className="font-semibold text-slate-700 dark:text-slate-300">Case History Logs:</p>
                      <ul className="space-y-1">
                        {ecourtResult.history.map((h: any, idx: number) => (
                          <li key={idx} className="flex justify-between">
                            <span>{h.date}</span>
                            <span>{h.status}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

        </div>
      </main>

      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} onSuccess={(user) => setCurrentUser(user)} />
      <Footer />
    </div>
  );
}
