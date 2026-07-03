"use client";

import { useState, useEffect } from "react";
import AuthModal from "@/components/common/auth-modal";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { 
  ShieldAlert, Calculator, Landmark, Plus, Scale, Play,
  Upload, Send, Globe, Video, UserPlus, FileText, CheckCircle2,
  Mic, Check, MessageSquare 
} from "lucide-react";

interface OdrCase {
  id: string;
  claimant: string;
  respondent: string;
  claimAmount: number;
  type: string; // Mediation / Arbitration
  desc: string;
  status: string;
  neutralBooked: string | null;
  messages: Array<{ sender: string; text: string; time: string; textHindi?: string }>;
  documents: string[];
}

export default function OdrSection() {
  const [cases, setCases] = useState<OdrCase[]>([]);
  const [selectedCase, setSelectedCase] = useState<OdrCase | null>(null);
  
  // Auth state variables
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    const fetchUser = async () => {
      if (isSupabaseConfigured && supabase) {
        const { data } = await supabase.auth.getUser();
        if (data?.user) {
          const { data: profile } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", data.user.id)
            .single();
          setCurrentUser({ ...data.user, profile });
          return;
        }
      }

      const savedMock = localStorage.getItem("living_law_mock_user");
      if (savedMock) {
        setCurrentUser(JSON.parse(savedMock));
      }
    };
    fetchUser();
  }, []);
  
  // Tabs
  const [activeTab, setActiveTab] = useState<"rooms" | "settlement" | "courtfee" | "new">("rooms");

  // New Case form
  const [claimant, setClaimant] = useState("");
  const [respondent, setRespondent] = useState("");
  const [claimAmount, setClaimAmount] = useState(50000);
  const [disputeType, setDisputeType] = useState("Mediation");
  const [disputeDesc, setDisputeDesc] = useState("");

  // Calculators
  const [calcClaim, setCalcClaim] = useState(500000);
  const [calcSuccess, setCalcSuccess] = useState(65);
  const [calcLegalFees, setCalcLegalFees] = useState(80000);
  const [calcYears, setCalcYears] = useState(3);
  const [settlementResult, setSettlementResult] = useState<any>(null);

  const [feeState, setFeeState] = useState("Delhi");
  const [feeCourt, setFeeCourt] = useState("District Court");
  const [feeMatter, setFeeMatter] = useState("Commercial Civil Suit");
  const [feeValue, setFeeValue] = useState(100000);
  const [computedCourtFee, setComputedCourtFee] = useState<number | null>(null);

  // Chat Room state
  const [chatInput, setChatInput] = useState("");
  const [hindiTranslate, setHindiTranslate] = useState(false);
  const [showVideoCall, setShowVideoCall] = useState(false);
  const [showNeutralModal, setShowNeutralModal] = useState(false);
  const [uploadedDocName, setUploadedDocName] = useState<string | null>(null);

  const neutralsList = [
    { name: "Hon. Retired Justice S. Kapoor", role: "Arbitrator", exp: "22 Years", fee: "Contact Chambers" },
    { name: "Advocate Meera Chawla", role: "Conciliator / Mediator", exp: "15 Years", fee: "Contact Chambers" },
    { name: "Dr. Alok Varma (CA)", role: "Commercial Mediator", exp: "18 Years", fee: "Contact Chambers" }
  ];

  useEffect(() => {
    const fetchCases = async () => {
      if (isSupabaseConfigured && supabase) {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data: dbCases, error } = await supabase
            .from("cases")
            .select("*")
            .or(`client_id.eq.${user.id},neutral_id.eq.${user.id}`);
          
          if (dbCases && !error) {
            const mappedCases: OdrCase[] = dbCases.map((c: any) => ({
              id: c.id,
              claimant: "You (Client)",
              respondent: "Counter Party",
              claimAmount: Number(c.claim_amount),
              type: "Mediation",
              desc: c.description || "",
              status: c.status === "active" ? "Neutral Appointed" : "Awaiting Neutral Appointment",
              neutralBooked: c.neutral_id ? "Assigned Mediator" : null,
              documents: [],
              messages: [
                { sender: "System", text: c.description || "Case Room Active", textHindi: "केस रूम सक्रिय है।", time: "12:00 PM" }
              ]
            }));
            
            const stored = localStorage.getItem("livinglaw_odr_cases");
            const localList = stored ? JSON.parse(stored) : [];
            setCases([...mappedCases, ...localList]);
            return;
          }
        }
      }

      const stored = localStorage.getItem("livinglaw_odr_cases");
      if (stored) {
        setCases(JSON.parse(stored));
      } else {
        const defaultCases: OdrCase[] = [
          {
            id: "ODR-88392",
            claimant: "Rahul Saxena (MSME Retail)",
            respondent: "Vardhaman Distributors",
            claimAmount: 180000,
            type: "Mediation",
            desc: "Unpaid commercial invoices regarding logistical delays and defective electronics stock.",
            status: "Neutral Appointed",
            neutralBooked: "Advocate Meera Chawla",
            documents: ["Invoice_884.pdf", "Delivery_Receipt_Signed.pdf"],
            messages: [
              { sender: "Rahul Saxena", text: "We have waited for over 90 days. The stock was partially damaged.", textHindi: "हम 90 से अधिक दिनों से प्रतीक्षा कर रहे हैं। स्टॉक आंशिक रूप से क्षतिग्रस्त था।", time: "10:15 AM" },
              { sender: "Vardhaman Distributors", text: "Logistical delays were force majeure. We can offer a 10% credit note.", textHindi: "लॉजिस्टिकल देरी अपरिहार्य परिस्थितियों के कारण थी। हम 10% क्रेडिट नोट की पेशकश कर सकते हैं।", time: "10:20 AM" },
              { sender: "Advocate Meera Chawla", text: "Welcome both parties. Let us review the contract clause on shipping damages.", textHindi: "दोनों पक्षों का स्वागत है। आइए शिपिंग नुकसान पर अनुबंध खंड की समीक्षा करें।", time: "10:25 AM" }
            ]
          }
        ];
        setCases(defaultCases);
        localStorage.setItem("livinglaw_odr_cases", JSON.stringify(defaultCases));
      }
    };
    
    fetchCases();
  }, [currentUser]);

  const handleCreateCase = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!claimant || !respondent || !disputeDesc) {
      alert("Please fill out all case filing parameters.");
      return;
    }

    if (!currentUser) {
      setIsAuthOpen(true);
      return;
    }

    const caseId = "ODR-" + Math.floor(10000 + Math.random() * 90000);

    if (isSupabaseConfigured && supabase && currentUser.id !== "mock-user-123") {
      const { error } = await supabase
        .from("cases")
        .insert({
          title: `ODR: ${disputeType} - ${claimant} vs ${respondent}`,
          client_id: currentUser.id,
          status: "pending",
          claim_amount: claimAmount,
          description: disputeDesc
        });
      if (error) {
        console.error("Failed to sync case to Supabase DB:", error);
      }
    }

    const newCase: OdrCase = {
      id: caseId,
      claimant,
      respondent,
      claimAmount,
      type: disputeType,
      desc: disputeDesc,
      status: "Awaiting Neutral Appointment",
      neutralBooked: null,
      documents: [],
      messages: [
        { sender: "System", text: "Dispute room initialized. Please upload case materials or appoint a mediator.", textHindi: "विवाद कक्ष प्रारंभ हुआ। कृपया मामला सामग्री अपलोड करें या मध्यस्थ नियुक्त करें।", time: "12:00 PM" }
      ]
    };

    const updated = [newCase, ...cases];
    setCases(updated);
    localStorage.setItem("livinglaw_odr_cases", JSON.stringify(updated));
    
    setClaimant("");
    setRespondent("");
    setDisputeDesc("");
    setActiveTab("rooms");
    alert("New Online Dispute Resolution Room has been filed!");
  };

  const handleSendChat = () => {
    if (!chatInput || !selectedCase) return;

    // Simulate simple Hindi translation (mocked rule-based translation)
    const translateMock = (txt: string) => {
      const lower = txt.toLowerCase();
      if (lower.includes("hello")) return "नमस्ते";
      if (lower.includes("agree")) return "मैं सहमत हूँ";
      if (lower.includes("document")) return "दस्तावेज़";
      if (lower.includes("payment")) return "भुगतान";
      if (lower.includes("wait")) return "कृपया प्रतीक्षा करें";
      return "यह संदेश ODR ट्रांसलेटर द्वारा अनुवादित है: " + txt;
    };

    const newMsg = {
      sender: "Rahul Saxena (You)",
      text: chatInput,
      textHindi: translateMock(chatInput),
      time: new Date().toLocaleTimeString("en-IN", { hour: '2-digit', minute: '2-digit' })
    };

    const updatedMessages = [...selectedCase.messages, newMsg];
    const updatedCase = { ...selectedCase, messages: updatedMessages };
    
    // Update state & localstorage
    const updatedCases = cases.map(c => c.id === selectedCase.id ? updatedCase : c);
    setCases(updatedCases);
    setSelectedCase(updatedCase);
    localStorage.setItem("livinglaw_odr_cases", JSON.stringify(updatedCases));
    setChatInput("");

    // Simulate dynamic arbitrator/respondent response
    setTimeout(() => {
      const responseMsg = {
        sender: selectedCase.neutralBooked || "System Bot",
        text: "Understood. Let's document this point in our tentative draft terms.",
        textHindi: "समझ गया। आइए इस बिंदु को हमारे अनंतिम मसौदा शर्तों में दर्ज करें।",
        time: new Date().toLocaleTimeString("en-IN", { hour: '2-digit', minute: '2-digit' })
      };
      const doubleUpdated = [...updatedMessages, responseMsg];
      const doubleCase = { ...updatedCase, messages: doubleUpdated };
      const doubleCases = cases.map(c => c.id === selectedCase.id ? doubleCase : c);
      setCases(doubleCases);
      setSelectedCase(doubleCase);
      localStorage.setItem("livinglaw_odr_cases", JSON.stringify(doubleCases));
    }, 1500);
  };

  // Settlement Calculation
  const handleCalcSettlement = () => {
    const probability = calcSuccess / 100;
    const litigationExpValue = calcClaim * probability - calcLegalFees;
    
    // Cost of time delay (inflation, interest loss, administrative friction)
    const delayCost = Math.round(calcClaim * 0.08 * calcYears);
    const timeAdjustedValue = litigationExpValue - delayCost;

    // Recommended settlement range
    const lowerBound = Math.round(timeAdjustedValue * 0.85);
    const upperBound = Math.round(timeAdjustedValue * 1.1);

    setSettlementResult({
      litigationExpValue,
      delayCost,
      timeAdjustedValue,
      recommendedRange: `₹${Math.max(0, lowerBound).toLocaleString("en-IN")} - ₹${Math.max(0, upperBound).toLocaleString("en-IN")}`
    });
  };

  // Court Fee Calculation
  const handleCalcCourtFee = () => {
    let fee = 0;
    if (feeCourt === "District Court") {
      if (feeValue <= 50000) {
        fee = feeValue * 0.04;
      } else if (feeValue <= 200000) {
        fee = 2000 + (feeValue - 50000) * 0.03;
      } else {
        fee = 6500 + (feeValue - 200000) * 0.015;
      }
    } else { // High Court
      fee = 10000 + (feeValue * 0.01);
    }
    
    if (feeState === "Rajasthan" || feeState === "Punjab") {
      fee = fee * 0.95; // Slight state variation discount
    }

    setComputedCourtFee(Math.round(fee));
  };

  const handleBookNeutral = (name: string) => {
    if (!selectedCase) return;

    const updatedCase = {
      ...selectedCase,
      neutralBooked: name,
      status: "Neutral Appointed",
      messages: [
        ...selectedCase.messages,
        { sender: "System", text: `Arbitrator/Mediator ${name} has joined the room.`, textHindi: `मध्यस्थ ${name} कक्ष में शामिल हो गए हैं।`, time: "Just Now" }
      ]
    };

    const updatedCases = cases.map(c => c.id === selectedCase.id ? updatedCase : c);
    setCases(updatedCases);
    setSelectedCase(updatedCase);
    localStorage.setItem("livinglaw_odr_cases", JSON.stringify(updatedCases));
    setShowNeutralModal(false);
  };

  const handleDocUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0] && selectedCase) {
      const fileName = e.target.files[0].name;
      setUploadedDocName(fileName);

      setTimeout(() => {
        const updatedCase = {
          ...selectedCase,
          documents: [...selectedCase.documents, fileName],
          messages: [
            ...selectedCase.messages,
            { sender: "System", text: `Rahul Saxena uploaded document: ${fileName}`, textHindi: `राहुल सक्सेना ने दस्तावेज़ अपलोड किया: ${fileName}`, time: "Just Now" }
          ]
        };
        const updatedCases = cases.map(c => c.id === selectedCase.id ? updatedCase : c);
        setCases(updatedCases);
        setSelectedCase(updatedCase);
        localStorage.setItem("livinglaw_odr_cases", JSON.stringify(updatedCases));
        setUploadedDocName(null);
      }, 1000);
    }
  };

  return (
    <section className="bg-[#022c22] py-20 text-white transition-colors duration-300">
      {/* Header banner */}
      <div className="relative overflow-hidden pb-12 border-b border-emerald-800/40 mb-12">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:16px_16px]"></div>
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <span className="text-emerald-400 font-semibold tracking-widest text-xs uppercase block mb-3">Online Dispute Resolution Portal</span>
          <h2 className="text-3xl md:text-5xl font-serif-legal font-bold mb-4 text-white">
            Advanced ODR & <span className="text-emerald-400">Settlement Workspace</span>
          </h2>
          <p className="text-emerald-100/70 max-w-2xl text-sm md:text-base leading-relaxed">
            Settle corporate contract, landlord-tenant, or IP disputes completely online. Harness smart court calculators and certified professional mediators.
          </p>
        </div>
      </div>

      {/* Main ODR Workspace Container */}
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-wrap gap-2 border-b border-emerald-800/40 pb-4 mb-8">
          <button 
            onClick={() => { setActiveTab("rooms"); setSelectedCase(null); }}
            className={`px-5 py-3 rounded-xl text-sm font-semibold transition ${
              activeTab === "rooms" 
                ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20" 
                : "bg-emerald-950/40 border border-emerald-800/40 text-emerald-100/80 hover:border-emerald-700"
            }`}
          >
            Dispute Hearing Rooms
          </button>
          
          <button 
            onClick={() => setActiveTab("settlement")}
            className={`px-5 py-3 rounded-xl text-sm font-semibold transition ${
              activeTab === "settlement" 
                ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20" 
                : "bg-emerald-950/40 border border-emerald-800/40 text-emerald-100/80 hover:border-emerald-700"
            }`}
          >
            Settlement Calculator
          </button>

          <button 
            onClick={() => setActiveTab("courtfee")}
            className={`px-5 py-3 rounded-xl text-sm font-semibold transition ${
              activeTab === "courtfee" 
                ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20" 
                : "bg-emerald-950/40 border border-emerald-800/40 text-emerald-100/80 hover:border-emerald-700"
            }`}
          >
            Court Fee Calculator
          </button>

          <button 
            onClick={() => setActiveTab("new")}
            className={`px-5 py-3 rounded-xl text-sm font-semibold text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 transition flex items-center gap-1.5`}
          >
            <Plus size={16} />
            <span>File New ODR Case</span>
          </button>
        </div>

        {/* --- TABS --- */}
        
        {/* Dispute Hearing Rooms List or Active Chat */}
        {activeTab === "rooms" && (
          <div>
            {!selectedCase ? (
              <div className="grid md:grid-cols-2 gap-6">
                {cases.map((c) => (
                  <div key={c.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl flex flex-col justify-between shadow-sm hover:border-amber-500/20 transition-all duration-350">
                    <div>
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-[10px] font-mono font-bold text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded">
                          {c.id}
                        </span>
                        <span className="bg-slate-100 dark:bg-slate-800 text-xs px-2 py-1 rounded font-medium">
                          {c.type}
                        </span>
                      </div>
                      <h4 className="font-serif-legal font-bold text-lg mb-2">
                        {c.claimant} vs. {c.respondent}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed mb-4">
                        {c.desc}
                      </p>
                      <div className="flex justify-between text-xs text-slate-400 border-t border-slate-100 dark:border-slate-800/80 pt-3">
                        <span>Claim Amount: <strong>₹{c.claimAmount.toLocaleString("en-IN")}</strong></span>
                        <span>Neutral: <strong>{c.neutralBooked || "Pending"}</strong></span>
                      </div>
                    </div>

                    <button 
                      onClick={() => setSelectedCase(c)}
                      className="bg-slate-950 dark:bg-white text-white dark:text-black py-2.5 rounded-xl text-xs font-bold mt-6 hover:opacity-90 transition flex items-center justify-center gap-1.5"
                    >
                      <Play size={12} />
                      <span>Enter Secure Dispute Room</span>
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              /* ACTIVE ODR ROOM INTERFACE */
              <div className="grid lg:grid-cols-4 gap-6 h-[600px]">
                
                {/* Room Left sidebar: Info and Docs */}
                <div className="lg:col-span-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 flex flex-col justify-between overflow-y-auto space-y-6">
                  <div>
                    <h4 className="font-serif-legal font-bold text-base border-b border-slate-100 dark:border-slate-800 pb-2 mb-3">
                      Case Details
                    </h4>
                    <div className="space-y-3 text-xs">
                      <p><strong>Claimant:</strong> {selectedCase.claimant}</p>
                      <p><strong>Respondent:</strong> {selectedCase.respondent}</p>
                      <p><strong>Neutral:</strong> {selectedCase.neutralBooked || "None Appointed"}</p>
                      <p><strong>Dispute Value:</strong> ₹{selectedCase.claimAmount.toLocaleString("en-IN")}</p>
                    </div>

                    {!selectedCase.neutralBooked && (
                      <button 
                        onClick={() => setShowNeutralModal(true)}
                        className="w-full bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 border border-amber-500/20 py-2 rounded-xl text-xs font-bold mt-4 flex items-center justify-center gap-1.5 transition"
                      >
                        <UserPlus size={14} />
                        <span>Book Mediator</span>
                      </button>
                    )}
                  </div>

                  <div className="flex-1 border-t border-slate-100 dark:border-slate-800 pt-4">
                    <h4 className="font-serif-legal font-bold text-xs uppercase tracking-wider text-slate-400 mb-3 flex items-center justify-between">
                      <span>Shared Evidence</span>
                      <label className="text-amber-500 cursor-pointer hover:underline text-[10px] lowercase flex items-center gap-0.5">
                        <Upload size={10} />
                        <span>upload</span>
                        <input type="file" onChange={handleDocUpload} className="hidden" />
                      </label>
                    </h4>

                    {uploadedDocName && (
                      <div className="text-[10px] text-amber-500 animate-pulse mb-2">
                        Uploading {uploadedDocName}...
                      </div>
                    )}

                    <div className="space-y-2">
                      {selectedCase.documents.map((doc, idx) => (
                        <div key={idx} className="flex items-center justify-between bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 text-[11px] font-medium text-slate-600 dark:text-slate-300">
                          <span className="flex items-center gap-1.5 truncate">
                            <FileText size={12} className="text-amber-500 shrink-0" />
                            <span className="truncate">{doc}</span>
                          </span>
                          <CheckCircle2 size={12} className="text-emerald-500" />
                        </div>
                      ))}
                    </div>
                  </div>

                  <button 
                    onClick={() => setSelectedCase(null)}
                    className="w-full text-slate-400 hover:text-slate-200 text-xs border border-slate-200 dark:border-slate-800 py-2.5 rounded-xl"
                  >
                    Exit Case Room
                  </button>
                </div>

                {/* Room Center: Chat interface */}
                <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl flex flex-col justify-between overflow-hidden relative">
                  
                  {/* Chat header */}
                  <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></div>
                      <span className="text-sm font-semibold">Active ODR Mediation Hearing Room</span>
                    </div>

                    <div className="flex gap-2">
                      <button 
                        onClick={() => setHindiTranslate(!hindiTranslate)}
                        className={`p-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1 transition ${
                          hindiTranslate 
                            ? "bg-amber-500 text-white border-amber-500" 
                            : "border-slate-200 dark:border-slate-800 text-slate-400 hover:text-slate-300"
                        }`}
                      >
                        <Globe size={14} />
                        <span>Hindi Audio Transcribe</span>
                      </button>

                      <button 
                        onClick={() => setShowVideoCall(!showVideoCall)}
                        className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-400 hover:text-slate-300"
                      >
                        <Video size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Chat message history logs */}
                  <div className="p-5 flex-1 overflow-y-auto space-y-4">
                    {selectedCase.messages.map((m, idx) => (
                      <div 
                        key={idx} 
                        className={`flex flex-col max-w-[80%] ${
                          m.sender.includes("You") 
                            ? "ml-auto items-end" 
                            : m.sender === "System" 
                            ? "mx-auto items-center" 
                            : "items-start"
                        }`}
                      >
                        {m.sender !== "System" && (
                          <span className="text-[10px] text-slate-400 font-semibold mb-1">{m.sender}</span>
                        )}
                        
                        <div className={`p-3 rounded-2xl text-xs leading-relaxed ${
                          m.sender === "System"
                            ? "bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 px-4 text-center rounded-xl font-medium"
                            : m.sender.includes("You")
                            ? "bg-amber-500 text-white rounded-br-none"
                            : "bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 rounded-bl-none"
                        }`}>
                          {hindiTranslate && m.textHindi ? m.textHindi : m.text}
                        </div>
                        <span className="text-[9px] text-slate-400 mt-1">{m.time}</span>
                      </div>
                    ))}
                  </div>

                  {/* Chat message input actions */}
                  <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex gap-2 items-center bg-slate-50/50 dark:bg-slate-900/50">
                    <input 
                      type="text" 
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      placeholder="Type response and send securely to dispute vault..." 
                      className="flex-1 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs focus:border-amber-500 focus:outline-none"
                      onKeyDown={(e) => e.key === "Enter" && handleSendChat()}
                    />
                    <button 
                      onClick={() => setChatInput("Accepting the settlement proposal.")}
                      className="p-2 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-400 hover:text-slate-200"
                      title="Insert Auto Phrase"
                    >
                      <MessageSquare size={14} />
                    </button>
                    <button 
                      onClick={handleSendChat}
                      className="bg-amber-500 hover:bg-amber-600 text-white p-2.5 rounded-xl transition"
                    >
                      <Send size={14} />
                    </button>
                  </div>

                  {/* Simulated Video Call Screen Toggled Overlay */}
                  {showVideoCall && (
                    <div className="absolute inset-0 bg-slate-950/90 z-20 flex flex-col justify-between p-4 text-white">
                      <div className="flex justify-between items-center text-xs font-semibold">
                        <span>Video Conference ODR Room #{selectedCase.id}</span>
                        <div className="flex items-center gap-1 text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded">
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></div>
                          <span>Secured Recording On</span>
                        </div>
                      </div>

                      {/* Video blocks grid */}
                      <div className="grid grid-cols-2 gap-4 flex-1 my-4">
                        <div className="bg-slate-900 rounded-xl border border-slate-800 flex items-center justify-center relative overflow-hidden">
                          <span className="text-xs font-semibold text-slate-400">Claimant: Rahul Saxena</span>
                          <div className="absolute bottom-2 left-2 bg-black/60 px-2 py-0.5 rounded text-[9px]">Webcam Feed</div>
                        </div>
                        <div className="bg-slate-900 rounded-xl border border-slate-800 flex items-center justify-center relative overflow-hidden">
                          <span className="text-xs font-semibold text-slate-400">Neutral: {selectedCase.neutralBooked || "Awaiting Joining"}</span>
                          <div className="absolute bottom-2 left-2 bg-black/60 px-2 py-0.5 rounded text-[9px]">Encrypted Stream</div>
                        </div>
                      </div>

                      {/* Video settings control bar */}
                      <div className="flex justify-center gap-3">
                        <button 
                          onClick={() => alert("Muted mic.")}
                          className="p-2.5 bg-slate-800 hover:bg-slate-700 rounded-full"
                        >
                          <Mic size={16} />
                        </button>
                        <button 
                          onClick={() => setShowVideoCall(false)}
                          className="bg-red-600 hover:bg-red-700 px-6 py-2 rounded-xl text-xs font-semibold"
                        >
                          Disconnect Call
                        </button>
                      </div>
                    </div>
                  )}

                </div>

                {/* Room Right sidebar: Dispute Timeline */}
                <div className="lg:col-span-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 overflow-y-auto space-y-4">
                  <h4 className="font-serif-legal font-bold text-base border-b border-slate-100 dark:border-slate-800 pb-2">
                    Timeline Progress
                  </h4>

                  <div className="relative border-l border-slate-200 dark:border-slate-800 pl-4 space-y-6 text-xs">
                    <div className="relative">
                      <div className="absolute -left-[21px] top-1 bg-amber-500 rounded-full w-2.5 h-2.5 border-2 border-white dark:border-slate-950"></div>
                      <p className="font-semibold">ODR Suit Filed</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">Rahul Saxena initialized dispute ledger.</p>
                    </div>

                    <div className="relative">
                      <div className={`absolute -left-[21px] top-1 rounded-full w-2.5 h-2.5 border-2 border-white dark:border-slate-950 ${
                        selectedCase.neutralBooked ? "bg-amber-500" : "bg-slate-300"
                      }`}></div>
                      <p className="font-semibold text-slate-600 dark:text-slate-300">Neutral Appointment</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">
                        {selectedCase.neutralBooked ? `Approved: ${selectedCase.neutralBooked}` : "Awaiting booking confirmation."}
                      </p>
                    </div>

                    <div className="relative">
                      <div className="absolute -left-[21px] top-1 bg-slate-300 rounded-full w-2.5 h-2.5 border-2 border-white dark:border-slate-950"></div>
                      <p className="font-semibold text-slate-400">Written Pleadings & Evidence</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">Review of files and statement response.</p>
                    </div>

                    <div className="relative">
                      <div className="absolute -left-[21px] top-1 bg-slate-300 rounded-full w-2.5 h-2.5 border-2 border-white dark:border-slate-950"></div>
                      <p className="font-semibold text-slate-400">Award / Terms Signed</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">Execution of final settlement decree.</p>
                    </div>
                  </div>
                </div>

              </div>
            )}
          </div>
        )}

        {/* Litigation Settlement Calculator Tab */}
        {activeTab === "settlement" && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 md:p-8 rounded-2xl shadow-sm space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="p-2.5 bg-amber-500/10 rounded-xl text-amber-500">
                <Calculator size={20} />
              </div>
              <div>
                <h3 className="font-serif-legal font-bold text-xl">Litigation Settlement Calculator</h3>
                <p className="text-xs text-slate-400">Compare the Expected Value of Trial litigation against instant mediation settlements.</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider mb-2 text-slate-500">Claim Dispute Value (INR)</label>
                  <input 
                    type="number" 
                    value={calcClaim}
                    onChange={(e) => setCalcClaim(Number(e.target.value))}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider mb-2 text-slate-500">Estimated Trial Win Probability ({calcSuccess}%)</label>
                  <input 
                    type="range" 
                    min="10" 
                    max="100" 
                    value={calcSuccess}
                    onChange={(e) => setCalcSuccess(Number(e.target.value))}
                    className="w-full accent-amber-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider mb-2 text-slate-500">Anticipated Legal Fees</label>
                    <input 
                      type="number" 
                      value={calcLegalFees}
                      onChange={(e) => setCalcLegalFees(Number(e.target.value))}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm focus:border-amber-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider mb-2 text-slate-500">Years to Resolution</label>
                    <input 
                      type="number" 
                      value={calcYears}
                      onChange={(e) => setCalcYears(Number(e.target.value))}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm focus:border-amber-500 focus:outline-none"
                    />
                  </div>
                </div>

                <button 
                  onClick={handleCalcSettlement}
                  className="w-full bg-slate-950 text-white dark:bg-white dark:text-black font-bold py-3.5 rounded-xl hover:opacity-90 transition text-sm flex items-center justify-center gap-1.5"
                >
                  <Calculator size={16} />
                  <span>Compute Expected Litigation Value</span>
                </button>
              </div>

              {/* Settlement Results */}
              <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 flex flex-col justify-center space-y-4">
                {settlementResult ? (
                  <div className="space-y-4">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold block">Expected Value of Litigation (EVL)</span>
                      <span className="text-3xl font-extrabold text-amber-500">
                        ₹{settlementResult.litigationExpValue.toLocaleString("en-IN")}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold block">Estimated Delay Opportunity Cost</span>
                      <span className="text-sm font-semibold text-red-500">
                        - ₹{settlementResult.delayCost.toLocaleString("en-IN")} (at 8% p.a.)
                      </span>
                    </div>

                    <hr className="border-slate-200 dark:border-slate-800" />

                    <div>
                      <span className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold block">Time-Adjusted Settlement Goal</span>
                      <span className="text-base font-bold text-slate-800 dark:text-slate-200">
                        ₹{settlementResult.timeAdjustedValue.toLocaleString("en-IN")}
                      </span>
                    </div>

                    <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-xl text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                      <span className="block font-bold uppercase tracking-wider text-[9px] mb-1">Recommended Settlement Range (Mediation)</span>
                      {settlementResult.recommendedRange}
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-slate-400 text-xs py-8">
                    <Scale className="mx-auto text-amber-500/30 mb-2" size={32} />
                    <p>Enter details and click calculate to review litigation probability charts.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Court Fee Calculator Tab */}
        {activeTab === "courtfee" && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 md:p-8 rounded-2xl shadow-sm space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="p-2.5 bg-amber-500/10 rounded-xl text-amber-500">
                <Landmark size={20} />
              </div>
              <div>
                <h3 className="font-serif-legal font-bold text-xl">Court Fee Calculator</h3>
                <p className="text-xs text-slate-400">Compute structural ad-valorem civil court fees dynamically across Indian jurisdictions.</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider mb-2 text-slate-500">Jurisdiction State</label>
                    <select 
                      value={feeState}
                      onChange={(e) => setFeeState(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm focus:border-amber-500 focus:outline-none"
                    >
                      <option>Delhi</option>
                      <option>Punjab</option>
                      <option>Rajasthan</option>
                      <option>Uttarakhand</option>
                      <option>Uttar Pradesh</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider mb-2 text-slate-500">Court Jurisdiction</label>
                    <select 
                      value={feeCourt}
                      onChange={(e) => setFeeCourt(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm focus:border-amber-500 focus:outline-none"
                    >
                      <option>District Court</option>
                      <option>High Court (Original Side)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider mb-2 text-slate-500">Matter Type</label>
                  <select 
                    value={feeMatter}
                    onChange={(e) => setFeeMatter(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm focus:border-amber-500 focus:outline-none"
                  >
                    <option>Commercial Civil Suit</option>
                    <option>Summary Suit (Order 37 CPC)</option>
                    <option>Partition Suit</option>
                    <option>Injunction Application</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider mb-2 text-slate-500">Dispute Claim / Valuation Amount (INR)</label>
                  <input 
                    type="number" 
                    value={feeValue}
                    onChange={(e) => setFeeValue(Number(e.target.value))}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <button 
                  onClick={handleCalcCourtFee}
                  className="w-full bg-slate-950 text-white dark:bg-white dark:text-black font-bold py-3.5 rounded-xl hover:opacity-90 transition text-sm flex items-center justify-center gap-1.5"
                >
                  <Calculator size={16} />
                  <span>Estimate Court Fee</span>
                </button>
              </div>

              <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 flex flex-col justify-center space-y-4 text-center">
                {computedCourtFee !== null ? (
                  <div className="space-y-4">
                    <Landmark size={32} className="mx-auto text-amber-500" />
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold block">Estimated Court Fee Payable</span>
                      <span className="text-3xl font-extrabold text-amber-500">
                        ₹{computedCourtFee.toLocaleString("en-IN")}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 max-w-xs mx-auto leading-relaxed">
                      Ad-valorem computation computed based on the state court fees stamp act amendments for {feeState}. Additional court registry processing fees may apply.
                    </p>
                  </div>
                ) : (
                  <div className="text-slate-400 text-xs py-8">
                    <Scale className="mx-auto text-amber-500/30 mb-2" size={32} />
                    <p>Select state parameters and click calculate to estimate legal filing fees.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* File New Case Tab */}
        {activeTab === "new" && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 md:p-8 rounded-2xl shadow-sm space-y-6 max-w-2xl mx-auto">
            <h3 className="font-serif-legal font-bold text-xl border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center gap-2">
              <Plus className="text-amber-500" size={20} />
              <span>Register Dispute on ODR Ledger</span>
            </h3>

            <form onSubmit={handleCreateCase} className="space-y-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-2">Claimant Name (You / Co.)</label>
                  <input 
                    type="text" 
                    required
                    value={claimant}
                    onChange={(e) => setClaimant(e.target.value)}
                    placeholder="Company or Individual legal name" 
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm normal-case text-slate-900 dark:text-slate-100 focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block mb-2">Respondent / Counter Party Name</label>
                  <input 
                    type="text" 
                    required
                    value={respondent}
                    onChange={(e) => setRespondent(e.target.value)}
                    placeholder="Defendant legal name" 
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm normal-case text-slate-900 dark:text-slate-100 focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-2">ODR Dispute Mechanism</label>
                  <select 
                    value={disputeType}
                    onChange={(e) => setDisputeType(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm normal-case text-slate-900 dark:text-slate-100 focus:border-amber-500 focus:outline-none"
                  >
                    <option>Mediation</option>
                    <option>Arbitration</option>
                    <option>Conciliators Panel</option>
                  </select>
                </div>

                <div>
                  <label className="block mb-2">Claim Disputed Amount (INR)</label>
                  <input 
                    type="number" 
                    required
                    value={claimAmount}
                    onChange={(e) => setClaimAmount(Number(e.target.value))}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm normal-case text-slate-900 dark:text-slate-100 focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block mb-2">Brief Summary of Dispute Facts</label>
                <textarea 
                  required
                  value={disputeDesc}
                  onChange={(e) => setDisputeDesc(e.target.value)}
                  placeholder="Detail contract default dates, delivery delays or unpaid invoices clearly..." 
                  rows={4}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm normal-case text-slate-900 dark:text-slate-100 focus:border-amber-500 focus:outline-none"
                />
              </div>

              <button 
                type="submit"
                className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-3.5 rounded-xl transition text-sm normal-case tracking-normal shadow-lg shadow-amber-500/15"
              >
                File Dispute & Launch Secure Room
              </button>
            </form>
          </div>
        )}

      </div>

      {/* Booking neutral pop up modal */}
      {showNeutralModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-md p-6 space-y-6">
            <h3 className="font-serif-legal font-bold text-xl border-b border-slate-100 dark:border-slate-800 pb-3 flex justify-between items-center text-slate-900 dark:text-white">
              <span>Appoint Neutral Arbiter</span>
              <button onClick={() => setShowNeutralModal(false)} className="text-xs text-slate-400 hover:text-slate-200 uppercase font-semibold">close</button>
            </h3>

            <div className="space-y-4">
              {neutralsList.map((n, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800/80 flex flex-col justify-between gap-3">
                  <div>
                    <h4 className="font-semibold text-sm text-slate-900 dark:text-white">{n.name}</h4>
                    <p className="text-[10px] text-slate-400 mt-0.5">{n.role} • {n.exp} Exp • Fee: {n.fee}</p>
                  </div>
                  <button 
                    onClick={() => handleBookNeutral(n.name)}
                    className="bg-emerald-500 hover:bg-emerald-600 text-white text-[11px] font-bold py-1.5 px-3 rounded-lg self-end"
                  >
                    Confirm Appointment
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} onSuccess={(user) => setCurrentUser(user)} />
    </section>
  );
}
