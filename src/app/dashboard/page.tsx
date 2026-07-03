"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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
  const router = useRouter();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
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
    const initDataOnMount = async () => {
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

      if (!activeUserId) {
        router.push("/login");
      } else {
        setIsCheckingAuth(false);
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

    initDataOnMount();
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!currentUser) return;
      const activeUserId = currentUser.id;

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
    };

    fetchUserData();
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

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-[#030712] text-slate-100 flex flex-col justify-between">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center space-y-4">
          <div className="w-10 h-10 border-4 border-slate-800 border-t-amber-500 rounded-full animate-spin"></div>
          <span className="text-xs text-slate-500 font-mono tracking-widest uppercase">Securing litigation session...</span>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="bg-[#030712] min-h-screen text-slate-100 transition-colors duration-300">
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
                    window.location.href = "/login";
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

          </div>
        </div>
      </section>

      {/* Main Workspace Dashboard Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="space-y-6 animate-in fade-in duration-300">
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
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
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
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
                        <span className="text-sm font-semibold text-emerald-500">Complimentary</span>
                      </div>
                      <ul className="text-xs text-slate-500 dark:text-slate-400 space-y-2 list-disc list-inside">
                        <li>Living Law Academy full lectures access</li>
                        <li>Civil/Criminal draft formats library</li>
                        <li>Supreme Court Landmark summaries</li>
                        <li>AI Document summarize limits: 50/mo</li>
                      </ul>
                      <button 
                        onClick={() => handleBuySubscription("6-Month Academy Bundle", "Complimentary")}
                        className="w-full bg-white text-slate-950 hover:opacity-90 transition font-semibold py-2 rounded-xl text-xs"
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
                        <span className="text-sm font-semibold text-emerald-500">Complimentary</span>
                      </div>
                      <ul className="text-xs text-slate-500 dark:text-slate-400 space-y-2 list-disc list-inside">
                        <li>All features of 6-Month plan included</li>
                        <li>Advanced ODR mediation fee discounts</li>
                        <li>Unlimited AI Document summarize & drafts</li>
                        <li>Premium court-hearing diary planner</li>
                      </ul>
                      <button 
                        onClick={() => handleBuySubscription("1-Year Premium Bundle", "Complimentary")}
                        className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-2 rounded-xl text-xs shadow-md shadow-amber-500/10"
                      >
                        Activate Plan
                      </button>
                    </div>
                  </div>
                </div>
              </div>


        </div>
      </main>

      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} onSuccess={(user) => setCurrentUser(user)} />
      <Footer />
    </div>
  );
}
