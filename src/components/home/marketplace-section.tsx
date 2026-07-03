"use client";

import { useState, useEffect } from "react";
import Script from "next/script";
import AuthModal from "@/components/common/auth-modal";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { 
  Building2, ShieldCheck, ClipboardCheck, Scale, CheckCircle2, 
  ArrowRight, Upload, X, Landmark, FileText, Check, CreditCard 
} from "lucide-react";

interface ServiceItem {
  id: string;
  name: string;
  desc: string;
  price: number;
  duration: string;
  docs: string[];
}

interface MarketplaceSectionProps {
  initialTab?: "business" | "ip" | "compliance";
  hideTabs?: boolean;
}

export default function MarketplaceSection({
  initialTab = "business",
  hideTabs = false
}: MarketplaceSectionProps) {
  const [activeTab, setActiveTab] = useState<"business" | "ip" | "compliance">(initialTab);
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);
  const [step, setStep] = useState<"details" | "upload" | "checkout" | "paying" | "success">("details");

  const getThemeData = () => {
    const commonTheme = {
      bg: "bg-slate-50 dark:bg-[#030712] text-slate-900 dark:text-slate-100",
      accentText: "text-amber-600 dark:text-amber-400",
      accentBg: "bg-amber-500",
      patternColor: "bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] dark:bg-[radial-gradient(#1e293b_1px,transparent_1px)]",
      cardBg: "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800",
      cardHover: "hover:border-amber-500/40 dark:hover:border-amber-500/30 hover:shadow-lg",
      btnHover: "hover:bg-amber-600 dark:hover:bg-amber-500",
      descText: "text-slate-600 dark:text-slate-400",
      pillBg: "bg-slate-100 dark:bg-slate-950 text-slate-600 dark:text-slate-400",
    };

    switch (activeTab) {
      case "business":
        return {
          ...commonTheme,
          tag: "Living Law Corporate Console",
          title: "Business Registration Portal",
          desc: "Incorporate your Private Limited Company, LLP, or Partnership. Instant documentation preparation and government filing with direct legal oversight.",
        };
      case "ip":
        return {
          ...commonTheme,
          accentText: "text-teal-600 dark:text-teal-400",
          accentBg: "bg-teal-500",
          cardHover: "hover:border-teal-500/40 dark:hover:border-teal-500/30 hover:shadow-lg",
          btnHover: "hover:bg-teal-600 dark:hover:bg-teal-500",
          tag: "Living Law IP Registry",
          title: "Trademark & Intellectual Property Portal",
          desc: "Secure your brand name, logos, and inventions. Rapid online trademark searches and copyright/patent filing services managed by IP attorneys.",
        };
      case "compliance":
        return {
          ...commonTheme,
          accentText: "text-rose-600 dark:text-rose-400",
          accentBg: "bg-rose-500",
          cardHover: "hover:border-rose-500/40 dark:hover:border-rose-500/30 hover:shadow-lg",
          btnHover: "hover:bg-rose-600 dark:hover:bg-rose-500",
          tag: "Living Law Compliance Console",
          title: "GST, Tax & Compliance Desk",
          desc: "Keep your legal entity fully compliant. Get GST registrations, file monthly/quarterly returns, and manage annual corporate filings effortlessly.",
        };
    }
  };
  
  // Auth state variables
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);

  // Intake form state
  const [entityName, setEntityName] = useState("");
  const [directorCount, setDirectorCount] = useState("2");
  const [businessState, setBusinessState] = useState("Delhi");
  const [contactEmail, setContactEmail] = useState("");
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

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

  const businessServices: ServiceItem[] = [
    { id: "pvt-ltd", name: "Pvt Ltd Registration", desc: "Most popular business structure for startups looking to raise capital.", price: 6999, duration: "7-10 Days", docs: ["Pan Card of Directors", "Aadhaar Card", "Utility Bill of Registered Office"] },
    { id: "llp", name: "Limited Liability Partnership (LLP)", desc: "Perfect for professional services and partnerships with limited liability.", price: 4999, duration: "8-12 Days", docs: ["Partners PAN", "Aadhaar", "Partnership Agreement Draft"] },
    { id: "opc", name: "One Person Company (OPC)", desc: "Sole proprietorship with corporate status and limited liability advantages.", price: 5999, duration: "7-10 Days", docs: ["Pan Card", "Aadhaar", "Nominee Consent Form"] },
    { id: "sole-prop", name: "Sole Proprietorship", desc: "Simple structure for single owners to start their business operations.", price: 1999, duration: "3-5 Days", docs: ["PAN Card", "Shop Establishment Certificate"] },
    { id: "partnership", name: "Partnership Deed Draft & Reg", desc: "Traditional structure governed by Indian Partnership Act, 1932.", price: 2999, duration: "4-6 Days", docs: ["Partnership Deed", "Address Proof of Partners"] },
    { id: "sec-8", name: "Section 8 Company", desc: "Non-profit organization registration for charitable or social causes.", price: 9999, duration: "15-20 Days", docs: ["Charity Mission Draft", "Director details", "Digital Signature"] },
    { id: "ngo", name: "NGO & Society Registration", desc: "Form a public trust or society to manage welfare activities.", price: 5499, duration: "10-15 Days", docs: ["Society Rules & Regulations", "Member details"] }
  ];

  const ipServices: ServiceItem[] = [
    { id: "tm", name: "Trademark Registration", desc: "Secure your brand name, logo, or slogan with complete brand protection.", price: 1999, duration: "3-5 Days (Form TM-A)", docs: ["Logo copy", "Authorization letter (signed)"] },
    { id: "patent", name: "Patent Filing (Provisional)", desc: "Protect your technological invention or process innovation legally.", price: 8999, duration: "15-20 Days", docs: ["Technical description", "Drawings/Flowcharts"] },
    { id: "copyright", name: "Copyright Registration", desc: "Secure creative works, source codes, books, music, and artworks.", price: 2499, duration: "5-7 Days", docs: ["Work Copy/Code file", "No Objection Certificate"] },
    { id: "design", name: "Industrial Design Protection", desc: "Protect the unique visual or aesthetic design of a physical product.", price: 4499, duration: "10-12 Days", docs: ["Aesthetic photos from 6 views", "Design description"] }
  ];

  const complianceServices: ServiceItem[] = [
    { id: "gst-reg", name: "GST Registration & Setup", desc: "Mandatory tax registration for businesses with turnover > ₹20L/₹40L.", price: 1499, duration: "3-5 Days", docs: ["PAN", "Electricity Bill", "Bank Statement"] },
    { id: "itr", name: "Income Tax & ITR Filing", desc: "Annual income tax return filing for businesses, LLPs, or directors.", price: 1999, duration: "2-4 Days", docs: ["Form 16 / Balance Sheet", "Bank Statement"] },
    { id: "msme", name: "MSME / Udyam Registration", desc: "Get government subsidy benefits, priority lending, and MSME perks.", price: 999, duration: "1-2 Days", docs: ["Aadhaar", "PAN of entity"] },
    { id: "fssai", name: "FSSAI Food License", desc: "Mandatory license for food manufacturers, traders, cafes, and hotels.", price: 2999, duration: "5-7 Days", docs: ["Food safety declaration", "Premises layout blueprint"] },
    { id: "startup-india", name: "Startup India Recognition", desc: "DPIIT registration to get tax exemptions and fast-track patents.", price: 3999, duration: "7-10 Days", docs: ["Pitch Deck", "DPIIT declaration", "Patent details (optional)"] },
    { id: "posh", name: "POSH Law Implementation", desc: "Set up Internal Complaints Committee (ICC) as per POSH Act guidelines.", price: 4999, duration: "10-15 Days", docs: ["Employee count details", "HR policy handbook draft"] }
  ];

  const getServices = () => {
    switch (activeTab) {
      case "business": return businessServices;
      case "ip": return ipServices;
      case "compliance": return complianceServices;
    }
  };

  const handleSelectService = (service: ServiceItem) => {
    setSelectedService(service);
    setStep("details");
    setEntityName("");
    setContactEmail("");
    setUploadedFile(null);
  };

  const simulateFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setIsUploading(true);
      setTimeout(() => {
        setUploadedFile(e.target.files![0].name);
        setIsUploading(false);
      }, 1200);
    }
  };

  const handleCheckout = () => {
    if (!entityName || !contactEmail) {
      alert("Please fill in all details.");
      return;
    }
    setStep("upload");
  };

  const handleGoToPayment = () => {
    if (!uploadedFile) {
      alert("Please upload at least one supporting document.");
      return;
    }
    setStep("checkout");
  };
  const handlePayment = async () => {
    if (!currentUser) {
      setIsAuthOpen(true);
      return;
    }

    setStep("paying");
    setTimeout(async () => {
      const mockOrderId = "REG-" + Math.floor(100000 + Math.random() * 900000);
      await saveCompletedRegistration(mockOrderId, 0);
      setStep("success");
    }, 2000);
  };

  const saveCompletedRegistration = async (orderId: string, fee: number) => {
    if (isSupabaseConfigured && supabase && currentUser.id !== "mock-user-123") {
      const { error } = await supabase
        .from("cases")
        .insert({
          title: `${selectedService?.name} - ${entityName}`,
          client_id: currentUser.id,
          status: "pending",
          claim_amount: fee,
          description: `Business registration application state: ${businessState}. Directors: ${directorCount}. Contact: ${contactEmail}.`
        });
      if (error) console.error("Database save error:", error);
    }

    const existing = localStorage.getItem("livinglaw_active_registrations");
    const list = existing ? JSON.parse(existing) : [];
    const newOrder = {
      id: orderId.startsWith("order_") ? orderId.replace("order_", "REG-") : "REG-" + Math.floor(100000 + Math.random() * 900000),
      serviceName: selectedService?.name,
      entityName,
      status: "Documents Under Review",
      date: new Date().toLocaleDateString("en-IN"),
      feePaid: fee
    };
    list.push(newOrder);
    localStorage.setItem("livinglaw_active_registrations", JSON.stringify(list));
  };

  return (
    <div className={`transition-colors duration-500 py-16 border-t border-slate-200 dark:border-slate-800 ${getThemeData().bg}`}>
      {/* Hero Header */}
      <div className="relative overflow-hidden pb-12">
        <div className={`absolute top-0 left-0 w-full h-full opacity-10 [background-size:16px_16px] ${getThemeData().patternColor}`}></div>
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <span className={`font-semibold tracking-widest text-xs uppercase block mb-3 ${getThemeData().accentText}`}>
            {getThemeData().tag}
          </span>
          <h2 className="text-4xl md:text-5xl font-serif-legal font-bold mb-4">
            {getThemeData().title}
          </h2>
          <p className={`max-w-2xl text-sm md:text-base leading-relaxed ${getThemeData().descText}`}>
            {getThemeData().desc}
          </p>
        </div>
      </div>

      {/* Main Directory Area */}
      <main className="max-w-7xl mx-auto px-6 py-4">
        {/* Navigation Tabs */}
        {!hideTabs && (
          <div className="flex flex-wrap gap-2 border-b border-slate-200 dark:border-slate-800 pb-4 mb-8">
            <button
              onClick={() => setActiveTab("business")}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium text-sm transition-all duration-200 ${
                activeTab === "business"
                  ? "bg-amber-500 text-white shadow-lg shadow-amber-500/20"
                  : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-600 dark:text-slate-300"
              }`}
            >
              <Building2 size={18} />
              <span>Business Registration</span>
            </button>
            
            <button
              onClick={() => setActiveTab("ip")}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium text-sm transition-all duration-200 ${
                activeTab === "ip"
                  ? "bg-teal-500 text-white shadow-lg shadow-teal-500/20"
                  : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-600 dark:text-slate-300"
              }`}
            >
              <ShieldCheck size={18} />
              <span>Trademark & IP</span>
            </button>

            <button
              onClick={() => setActiveTab("compliance")}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium text-sm transition-all duration-200 ${
                activeTab === "compliance"
                  ? "bg-rose-500 text-white shadow-lg shadow-rose-500/20"
                  : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-600 dark:text-slate-300"
              }`}
            >
              <ClipboardCheck size={18} />
              <span>Compliances & Government</span>
            </button>
          </div>
        )}

        {/* Directory Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {getServices().map((service) => (
            <div 
              key={service.id} 
              className={`rounded-2xl p-6 flex flex-col justify-between transition-all duration-300 shadow-sm border ${getThemeData().cardBg} ${getThemeData().cardHover}`}
            >
              <div>
                <div className="flex justify-between items-start mb-4">
                  <h3 className={`font-serif-legal text-xl font-bold ${getThemeData().accentText}`}>
                    {service.name}
                  </h3>
                  <span className={`text-xs px-2.5 py-1 rounded-md font-medium ${getThemeData().pillBg}`}>
                    {service.duration}
                  </span>
                </div>
                <p className={`text-sm leading-relaxed mb-6 ${getThemeData().descText}`}>
                  {service.desc}
                </p>
              </div>

              <div className="border-t border-slate-100 dark:border-slate-800/80 pt-4 mt-4 flex items-center justify-end">
                <button 
                  onClick={() => handleSelectService(service)}
                  className={`bg-slate-950 text-white dark:bg-white dark:text-black hover:opacity-90 px-5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all duration-200`}
                >
                  <span>Apply Now</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Intake Drawer Modal */}
      {selectedService && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex justify-end">
          <div className="bg-white dark:bg-slate-950 w-full max-w-xl h-full flex flex-col justify-between shadow-2xl animate-in slide-in-from-right duration-300">
            {/* Modal Header */}
            <div className="px-6 py-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-900">
              <div>
                <span className="text-xs uppercase tracking-widest text-amber-500 font-semibold">Service Intake Form</span>
                <h2 className="text-xl font-serif-legal font-bold dark:text-white">{selectedService.name}</h2>
              </div>
              <button 
                onClick={() => setSelectedService(null)}
                className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-400"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body / Steps */}
            <div className="p-6 flex-1 overflow-y-auto">
              {step === "details" && (
                <div className="space-y-6">
                  <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-950 p-4 rounded-xl text-sm flex gap-3 text-amber-800 dark:text-amber-300">
                    <Scale size={20} className="shrink-0" />
                    <div>
                      <h4 className="font-semibold mb-1">Required Documents to Initiate:</h4>
                      <ul className="list-disc list-inside space-y-1 text-xs text-amber-700 dark:text-amber-400">
                        {selectedService.docs.map((doc, idx) => (
                          <li key={idx}>{doc}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider mb-2 text-slate-500">Proposed Entity / Brand Name</label>
                      <input 
                        type="text" 
                        value={entityName} 
                        onChange={(e) => setEntityName(e.target.value)} 
                        placeholder="e.g. Acme Legaltech Private Limited" 
                        className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm focus:border-amber-500 focus:outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider mb-2 text-slate-500">Registered Office State</label>
                        <select 
                          value={businessState} 
                          onChange={(e) => setBusinessState(e.target.value)} 
                          className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm focus:border-amber-500 focus:outline-none"
                        >
                          <option>Delhi</option>
                          <option>Punjab</option>
                          <option>Uttarakhand</option>
                          <option>Rajasthan</option>
                          <option>Maharashtra</option>
                          <option>Karnataka</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider mb-2 text-slate-500">Authorized Persons / Directors</label>
                        <select 
                          value={directorCount} 
                          onChange={(e) => setDirectorCount(e.target.value)}
                          className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm focus:border-amber-500 focus:outline-none"
                        >
                          <option>1 (One Person)</option>
                          <option>2 (Minimum Co-founding)</option>
                          <option>3 or More</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider mb-2 text-slate-500">Primary Contact Email</label>
                      <input 
                        type="email" 
                        value={contactEmail} 
                        onChange={(e) => setContactEmail(e.target.value)}
                        placeholder="contact@entity.com" 
                        className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm focus:border-amber-500 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {step === "upload" && (
                <div className="space-y-6">
                  <h3 className="font-serif-legal font-semibold text-lg">Upload Onboarding Documents</h3>
                  <p className="text-xs text-slate-400">Please upload a combined PDF containing self-attested ID proof and address details for processing.</p>

                  <div className="border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl p-8 flex flex-col items-center justify-center bg-slate-50/50 dark:bg-slate-900/30">
                    <Upload size={32} className="text-amber-500 mb-3" />
                    
                    {uploadedFile ? (
                      <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 px-4 py-2 rounded-xl text-sm font-semibold">
                        <CheckCircle2 size={16} />
                        <span>{uploadedFile}</span>
                      </div>
                    ) : (
                      <div className="text-center">
                        <label className="bg-slate-950 dark:bg-white text-white dark:text-black text-xs font-bold px-4 py-2.5 rounded-xl cursor-pointer hover:opacity-90 transition">
                          Select Document file
                          <input type="file" onChange={simulateFileUpload} className="hidden" accept=".pdf,.doc,.docx" />
                        </label>
                        <span className="block text-[10px] text-slate-400 mt-2">PDF, DOC, DOCX up to 15MB</span>
                      </div>
                    )}

                    {isUploading && (
                      <div className="mt-4 flex items-center gap-2 text-xs text-amber-500 animate-pulse">
                        <div className="w-2 h-2 rounded-full bg-amber-500 animate-ping"></div>
                        <span>Scanning & running OCR analysis...</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {step === "checkout" && (
                <div className="space-y-6">
                  <h3 className="font-serif-legal font-semibold text-lg">Application Details</h3>
                  
                  <div className="bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-xl p-5 space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Filing Category</span>
                      <span>{selectedService.name}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Estimated Processing Time</span>
                      <span>{selectedService.duration}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Document Upload Status</span>
                      <span className="text-emerald-500 font-medium">All Uploaded</span>
                    </div>
                    <hr className="border-slate-200 dark:border-slate-800" />
                    <div className="flex justify-between font-bold text-base">
                      <span className="text-slate-500">Service Fee</span>
                      <span className="text-emerald-500">Complimentary / Review Mode</span>
                    </div>
                  </div>

                  <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 text-xs flex gap-2 text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2 size={16} className="shrink-0" />
                    <span>Your documents are safe under encrypted client workspace storage. Average attorney response time is {selectedService.duration}.</span>
                  </div>
                </div>
              )}

              {step === "paying" && (
                <div className="h-full flex flex-col items-center justify-center py-20 space-y-6">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-full border-4 border-slate-100 border-t-amber-500 animate-spin"></div>
                    <CreditCard className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-amber-500" size={24} />
                  </div>
                  <div className="text-center">
                    <h3 className="font-semibold text-lg">Submitting Application</h3>
                    <p className="text-xs text-slate-400 mt-1">Encrypting documents and verifying active credentials. Do not close or refresh this drawer...</p>
                  </div>
                </div>
              )}

              {step === "success" && (
                <div className="h-full flex flex-col items-center justify-center py-20 space-y-6">
                  <div className="p-4 bg-emerald-500/10 dark:bg-emerald-950/20 text-emerald-500 rounded-full">
                    <Check size={48} className="animate-bounce" />
                  </div>
                  <div className="text-center max-w-xs">
                    <h3 className="font-serif-legal font-bold text-2xl mb-2">Application Submitted!</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                      Your business registration application has been submitted successfully for legal review. You can track its status inside your professional dashboard.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer Controls */}
            {step !== "paying" && step !== "success" && (
              <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 flex justify-between gap-4">
                <button 
                  onClick={() => {
                    if (step === "details") setSelectedService(null);
                    if (step === "upload") setStep("details");
                    if (step === "checkout") setStep("upload");
                  }}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-sm font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                >
                  {step === "details" ? "Cancel" : "Back"}
                </button>

                {step === "details" && (
                  <button 
                    onClick={handleCheckout}
                    className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-1.5 transition shadow-lg shadow-amber-500/15"
                  >
                    <span>Save & Next</span>
                    <ArrowRight size={14} />
                  </button>
                )}

                {step === "upload" && (
                  <button 
                    onClick={handleGoToPayment}
                    disabled={!uploadedFile}
                    className={`px-6 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-1.5 transition ${
                      uploadedFile 
                        ? "bg-amber-500 hover:bg-amber-600 text-white shadow-lg shadow-amber-500/15" 
                        : "bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed"
                    }`}
                  >
                    <span>Review Application</span>
                    <ArrowRight size={14} />
                  </button>
                )}

                {step === "checkout" && (
                  <button 
                    onClick={handlePayment}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-1.5 transition shadow-lg shadow-emerald-500/15 w-full justify-center"
                  >
                    <CheckCircle2 size={16} />
                    <span>Submit Application for Review</span>
                  </button>
                )}
              </div>
            )}

            {step === "success" && (
              <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60">
                <button 
                  onClick={() => {
                    setSelectedService(null);
                    setStep("details");
                  }}
                  className="w-full bg-slate-950 text-white dark:bg-white dark:text-black py-3 rounded-xl font-semibold text-sm hover:opacity-90 transition"
                >
                  Close Marketplace Portal
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} onSuccess={(user) => setCurrentUser(user)} />
    </div>
  );
}
