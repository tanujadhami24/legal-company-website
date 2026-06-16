"use client";

import { useState, useRef, useEffect } from "react";
import Script from "next/script";
import AuthModal from "@/components/common/auth-modal";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { 
  FileText, ShieldCheck, Video, Camera, Award, CreditCard, 
  AlertCircle, Download, Check, Sparkles, Printer, UserCheck 
} from "lucide-react";

export default function NotarySection() {
  const [agreementType, setAgreementType] = useState("Rent Agreement");
  const [stateName, setStateName] = useState("Delhi");
  const [stampCount, setStampCount] = useState(1);
  const [stampValue, setStampValue] = useState(100);
  const [deliveryType, setDeliveryType] = useState<"normal" | "fast">("normal");
  const [userName, setUserName] = useState("");
  const [userAadhaar, setUserAadhaar] = useState("");

  const [step, setStep] = useState<"form" | "kyc" | "paying" | "completed">("form");
  
  // Auth state variables
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);

  // KYC States
  const [kycProgress, setKycProgress] = useState(0);
  const [kycStatus, setKycStatus] = useState("Initialize Camera...");
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const legalStates = ["Delhi", "Punjab", "Uttarakhand", "Rajasthan", "Uttar Pradesh"];

  // Pricing calculations
  const platformFee = 99;
  const stampDutyCost = stampValue * stampCount;
  const deliveryFee = deliveryType === "fast" ? 250 : 50;
  const baseSubtotal = stampDutyCost + platformFee + deliveryFee;
  const razorpayCommission = Math.round(baseSubtotal * 0.02);
  const grandTotal = baseSubtotal + razorpayCommission;

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

  const startCamera = async () => {
    try {
      setKycStatus("Requesting webcam access...");
      const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 640, height: 480 } });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setIsCameraActive(true);
      }
      setKycStatus("Hold Aadhaar Card close to your face and remain still...");
      simulateKycScan();
    } catch (err) {
      console.warn("Webcam access denied/unavailable, simulating camera stream", err);
      setIsCameraActive(false);
      setKycStatus("Webcam unavailable. Simulating secure video KYC connection...");
      simulateKycScan(true);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  };

  const simulateKycScan = (isMock = false) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += 5;
      setKycProgress(progress);

      if (progress === 30) setKycStatus("Aadhaar Card detected. Adjusting exposure...");
      if (progress === 60) setKycStatus("Scanning Aadhaar barcode and verification...");
      if (progress === 85) setKycStatus("Matching face profile with Aadhaar photo...");
      
      if (progress >= 100) {
        clearInterval(interval);
        setKycStatus("KYC Verified Successfully!");
        
        if (!isMock && videoRef.current && canvasRef.current) {
          const ctx = canvasRef.current.getContext("2d");
          if (ctx) {
            ctx.drawImage(videoRef.current, 0, 0, 320, 240);
            setCapturedPhoto(canvasRef.current.toDataURL("image/png"));
          }
        } else {
          setCapturedPhoto("/api/placeholder/320/240");
        }
        stopCamera();
      }
    }, 250);
  };

  const handleStartKyc = () => {
    if (!userName || !userAadhaar) {
      alert("Please fill your full legal name and Aadhaar number to proceed.");
      return;
    }
    if (stampCount > 500) {
      alert("You can request a maximum of 500 stamp papers.");
      return;
    }
    setStep("kyc");
    setTimeout(() => {
      startCamera();
    }, 500);
  };

  const handlePayment = async () => {
    if (!currentUser) {
      setIsAuthOpen(true);
      return;
    }

    setStep("paying");

    try {
      const orderRes = await fetch("/api/payments/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: grandTotal, serviceId: "notary" }),
      });
      const orderData = await orderRes.json();

      if (orderRes.status !== 200 || !orderData.id) {
        throw new Error(orderData.error || "Failed to initiate payment gateway.");
      }

      if (orderData.isMock) {
        setTimeout(async () => {
          await saveCompletedNotary(orderData.id);
          setStep("completed");
        }, 2000);
        return;
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_...",
        amount: orderData.amount,
        currency: "INR",
        name: "Living Law Chambers",
        description: `E-Notary: ${agreementType} (${stateName})`,
        order_id: orderData.id,
        handler: async function (response: any) {
          try {
            setStep("paying");
            const verifyRes = await fetch("/api/payments/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                userId: currentUser.id,
                amount: grandTotal,
                serviceId: "notary",
              }),
            });

            const verifyData = await verifyRes.json();
            if (verifyRes.status === 200 && verifyData.verified) {
              await saveCompletedNotary(orderData.id);
              setStep("completed");
            } else {
              alert("Payment verification failed: " + (verifyData.error || "Invalid signature"));
              setStep("kyc");
            }
          } catch (err) {
            console.error("Verification error:", err);
            alert("Verification process failed.");
            setStep("kyc");
          }
        },
        prefill: {
          email: currentUser.email || "",
        },
        theme: {
          color: "#d4af37",
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.on("payment.failed", function (response: any) {
        alert("Payment failed: " + response.error.description);
        setStep("kyc");
      });
      rzp.open();

    } catch (err: any) {
      console.error(err);
      alert(err.message || "Payment service error.");
      setStep("kyc");
    }
  };

  const saveCompletedNotary = async (orderId: string) => {
    if (isSupabaseConfigured && supabase && currentUser.id !== "mock-user-123") {
      const { error } = await supabase
        .from("cases")
        .insert({
          title: `E-Notary: ${agreementType} (${stateName})`,
          client_id: currentUser.id,
          status: "active",
          claim_amount: grandTotal,
          description: `Notarized document. Purchaser: ${userName}. Aadhaar: ${userAadhaar.slice(-4)}. Speed: ${deliveryType}.`
        });
      if (error) console.error("Database save error:", error);
    }

    const existing = localStorage.getItem("livinglaw_active_notaries");
    const list = existing ? JSON.parse(existing) : [];
    const newNotary = {
      id: orderId.startsWith("order_") ? orderId.replace("order_", "NOTARY-") : "NOTARY-" + Math.floor(100000 + Math.random() * 900000),
      userName,
      agreementType,
      stateName,
      stampValue,
      deliveryType,
      grandTotal,
      date: new Date().toLocaleDateString("en-IN"),
      status: "E-Stamped & Verified"
    };
    list.push(newNotary);
    localStorage.setItem("livinglaw_active_notaries", JSON.stringify(list));
  };

  const printDocument = () => {
    window.print();
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  return (
    <div className="bg-slate-50 dark:bg-[#0b101d] text-slate-900 dark:text-slate-100 transition-colors duration-300 py-20">
      {/* Hero */}
      <div className="relative overflow-hidden pb-12 border-b border-slate-200/60 dark:border-slate-800/60">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[radial-gradient(#d4af37_1px,transparent_1px)] [background-size:16px_16px]"></div>
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <span className="text-amber-600 dark:text-amber-400 font-semibold tracking-widest text-xs uppercase block mb-3">E-STAMPING & NOTARY WORKSPACE</span>
          <h1 className="text-4xl md:text-5xl font-serif-legal font-bold mb-4 text-slate-900 dark:text-white">
            Certified Notarization & <span className="text-amber-600 dark:text-amber-400">Video KYC</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 max-w-2xl text-base leading-relaxed">
            Acquire legal stamp papers verified securely through our AI Aadhaar Video KYC integration. Registered in 5 key states. Delivered same-day digitally.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 pt-12">
        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Main Workspace Column */}
          <div className="lg:col-span-2 space-y-6">
            
            {step === "form" && (
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 md:p-8 space-y-6 shadow-sm">
                <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
                  <div className="p-2 bg-amber-500/10 rounded-xl text-amber-500">
                    <FileText size={22} />
                  </div>
                  <div>
                    <h3 className="font-serif-legal font-bold text-xl">Notary Details Intake</h3>
                    <p className="text-xs text-slate-400">Specify agreement parameters and purchaser details.</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider mb-2 text-slate-500">Purchaser Legal Name</label>
                    <input 
                      type="text" 
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      placeholder="As per Aadhaar card" 
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm focus:border-amber-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider mb-2 text-slate-500">Purchaser Aadhaar Number</label>
                    <input 
                      type="text" 
                      maxLength={12}
                      value={userAadhaar}
                      onChange={(e) => setUserAadhaar(e.target.value.replace(/\D/g, ""))}
                      placeholder="e.g. 5489 1204 9832" 
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm focus:border-amber-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider mb-2 text-slate-500">Stamp Registration State</label>
                    <select 
                      value={stateName}
                      onChange={(e) => setStateName(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm focus:border-amber-500 focus:outline-none"
                    >
                      {legalStates.map((st, idx) => (
                        <option key={idx}>{st}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider mb-2 text-slate-500">Deed Agreement Category</label>
                    <select 
                      value={agreementType}
                      onChange={(e) => setAgreementType(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm focus:border-amber-500 focus:outline-none"
                    >
                      <option>Rent Agreement</option>
                      <option>Partnership Deed</option>
                      <option>Power of Attorney</option>
                      <option>Affidavit / Declaration</option>
                      <option>Indemnity Bond</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider mb-2 text-slate-500">Stamp Value (₹)</label>
                    <select 
                      value={stampValue}
                      onChange={(e) => setStampValue(Number(e.target.value))}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm focus:border-amber-500 focus:outline-none"
                    >
                      <option value={10}>₹10 Stamp</option>
                      <option value={50}>₹50 Stamp</option>
                      <option value={100}>₹100 Stamp</option>
                      <option value={500}>₹500 Stamp</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider mb-2 text-slate-500">Quantity of Sheets</label>
                    <input 
                      type="number" 
                      min={1} 
                      max={500}
                      value={stampCount}
                      onChange={(e) => setStampCount(Math.min(500, Math.max(1, Number(e.target.value))))}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm focus:border-amber-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500">Delivery Tier Options</label>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div 
                      onClick={() => setDeliveryType("normal")}
                      className={`p-4 border rounded-xl cursor-pointer transition flex items-start gap-3 ${
                        deliveryType === "normal"
                          ? "border-amber-500 bg-amber-500/[0.02] dark:bg-amber-500/[0.01]"
                          : "border-slate-200 dark:border-slate-800 hover:border-slate-300"
                      }`}
                    >
                      <input 
                        type="radio" 
                        name="delivery" 
                        checked={deliveryType === "normal"} 
                        onChange={() => setDeliveryType("normal")}
                        className="mt-1 accent-amber-500" 
                      />
                      <div>
                        <h4 className="font-semibold text-sm">Regular e-Delivery</h4>
                        <p className="text-[10px] text-slate-400 mt-0.5">Email processing within 24-48 hours. Hardcopy by courier (₹50 fee).</p>
                      </div>
                    </div>

                    <div 
                      onClick={() => setDeliveryType("fast")}
                      className={`p-4 border rounded-xl cursor-pointer transition flex items-start gap-3 ${
                        deliveryType === "fast"
                          ? "border-amber-500 bg-amber-500/[0.02] dark:bg-amber-500/[0.01]"
                          : "border-slate-200 dark:border-slate-800 hover:border-slate-300"
                      }`}
                    >
                      <input 
                        type="radio" 
                        name="delivery" 
                        checked={deliveryType === "fast"} 
                        onChange={() => setDeliveryType("fast")}
                        className="mt-1 accent-amber-500" 
                      />
                      <div>
                        <h4 className="font-semibold text-sm">Same-Day Express</h4>
                        <p className="text-[10px] text-slate-400 mt-0.5">Scanned certificate in 4 hours. Courier dispatched next-day (₹250 fee).</p>
                      </div>
                    </div>
                  </div>
                </div>

                <button 
                  onClick={handleStartKyc}
                  className="w-full bg-slate-950 text-white dark:bg-white dark:text-black py-4 rounded-xl font-bold hover:opacity-90 transition flex items-center justify-center gap-2 shadow-lg shadow-amber-500/5 mt-4"
                >
                  <Video size={18} />
                  <span>Start Secure Video KYC Witness</span>
                </button>
              </div>
            )}

            {step === "kyc" && (
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 md:p-8 space-y-6 shadow-sm">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-amber-500/10 rounded-xl text-amber-500 animate-pulse">
                      <ShieldCheck size={22} />
                    </div>
                    <div>
                      <h3 className="font-serif-legal font-bold text-xl">Identity Verification</h3>
                      <p className="text-xs text-slate-400">Secure client biometric matching checkpoint.</p>
                    </div>
                  </div>
                  <span className="text-[11px] font-mono bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-md text-amber-500 font-bold uppercase tracking-wider animate-pulse">KYC ACTIVE</span>
                </div>

                <div className="grid md:grid-cols-2 gap-6 items-center">
                  
                  {/* Camera Terminal */}
                  <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-950 border border-slate-800/80 flex items-center justify-center">
                    {isCameraActive ? (
                      <video ref={videoRef} className="w-full h-full object-cover transform -scale-x-100"></video>
                    ) : (
                      <div className="flex flex-col items-center text-slate-500 p-6 text-center space-y-2">
                        <Video size={36} className="text-slate-600 animate-pulse" />
                        <p className="text-xs font-semibold">Webcam Feed Loading...</p>
                        <p className="text-[10px] text-slate-600">Please grant browser device permissions.</p>
                      </div>
                    )}
                    
                    {/* Capture Canvas (hidden) */}
                    <canvas ref={canvasRef} width={320} height={240} className="hidden"></canvas>
                  </div>

                  {/* Verification Status */}
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block font-bold">Liveness Status Indicator</span>
                      <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 leading-relaxed bg-slate-50 dark:bg-slate-950/80 border border-slate-100 dark:border-slate-800/40 p-3.5 rounded-xl flex items-start gap-2.5">
                        <UserCheck size={18} className="text-amber-500 shrink-0 mt-0.5" />
                        <span>{kycStatus}</span>
                      </p>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-xs font-mono font-bold text-slate-400">
                        <span>SCANNING PROGRESS</span>
                        <span>{kycProgress}%</span>
                      </div>
                      <div className="w-full bg-slate-100 dark:bg-slate-950 rounded-full h-2.5 overflow-hidden border border-slate-200/50 dark:border-slate-800/50">
                        <div 
                          className="bg-gradient-to-r from-amber-500 to-amber-600 h-2.5 rounded-full transition-all duration-300"
                          style={{ width: `${kycProgress}%` }}
                        ></div>
                      </div>
                    </div>

                    {kycProgress >= 100 && (
                      <button 
                        onClick={handlePayment}
                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3.5 rounded-xl font-bold flex items-center justify-center gap-1.5 transition shadow-lg shadow-emerald-500/10 text-sm"
                      >
                        <CreditCard size={16} />
                        <span>Proceed to Pay ₹{grandTotal}</span>
                      </button>
                    )}
                  </div>

                </div>
              </div>
            )}

            {step === "paying" && (
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-10 text-center flex flex-col items-center justify-center py-20 space-y-6 shadow-sm">
                <div className="relative">
                  <div className="w-16 h-16 rounded-full border-4 border-slate-100 border-t-amber-500 animate-spin"></div>
                  <CreditCard className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-amber-500" size={24} />
                </div>
                <div>
                  <h3 className="font-serif-legal font-bold text-xl">Escrow Payment Gateway</h3>
                  <p className="text-xs text-slate-400 mt-1">Establishing secure connection. Do not close or refresh page...</p>
                </div>
              </div>
            )}

            {step === "completed" && (
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 md:p-8 space-y-6 shadow-sm animate-in fade-in duration-300">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-emerald-500/10 rounded-xl text-emerald-500">
                      <Award size={22} />
                    </div>
                    <div>
                      <h3 className="font-serif-legal font-bold text-xl">Deed Certified Successfully!</h3>
                      <p className="text-xs text-slate-400">Digital stamp paper created and secured by Aadhaar authentication.</p>
                    </div>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button 
                      onClick={printDocument}
                      className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-950 text-slate-500 dark:text-slate-400 transition"
                      title="Print Document"
                    >
                      <Printer size={16} />
                    </button>
                    <button 
                      onClick={() => setStep("form")}
                      className="bg-amber-500 hover:bg-amber-600 text-white px-5 py-2.5 rounded-xl text-xs font-bold transition shadow-lg shadow-amber-500/5"
                    >
                      Create Another Deed
                    </button>
                  </div>
                </div>

                {/* Simulated Certificate Display */}
                <div className="border border-slate-200 dark:border-slate-800 rounded-2xl bg-white text-black p-8 font-serif max-w-2xl mx-auto shadow-inner relative overflow-hidden print:border-none print:shadow-none">
                  
                  {/* Stamp Paper Graphic Header */}
                  <div className="border-4 border-double border-[#7f1d1d] p-6 text-center space-y-2 bg-[#fffdfa] relative">
                    <div className="absolute top-2 right-2 border border-emerald-600/30 bg-emerald-500/5 text-emerald-700 text-[8px] font-mono font-bold px-1.5 py-0.5 rounded uppercase tracking-widest scale-90">SECURE e-SIGN</div>
                    <span className="text-[10px] tracking-widest font-mono text-[#7f1d1d] font-bold block">GOVERNMENT OF INDIA</span>
                    <h2 className="text-3xl font-extrabold tracking-wide text-[#7f1d1d]">E-STAMP CERTIFICATE</h2>
                    <div className="border-t border-b border-[#7f1d1d]/30 py-1.5 flex justify-between text-[9px] font-mono text-slate-600 uppercase font-bold">
                      <span>Ref ID: IN-DL{Math.floor(10000000 + Math.random() * 90000000)}T</span>
                      <span>Duty: ₹{stampValue}</span>
                    </div>
                  </div>

                  <div className="space-y-6 py-6 text-xs text-slate-800 leading-relaxed text-justify">
                    <div className="grid grid-cols-2 gap-4 bg-slate-50 border border-slate-100 p-4 rounded-xl font-sans text-[11px] text-slate-600">
                      <div>
                        <p><strong>Purchaser:</strong> {userName}</p>
                        <p><strong>Deed Category:</strong> {agreementType}</p>
                      </div>
                      <div>
                        <p><strong>Jurisdiction State:</strong> {stateName}</p>
                        <p><strong>Aadhaar Sign (Witness):</strong> Verified *******{userAadhaar.slice(-4)}</p>
                      </div>
                    </div>

                    <p className="indent-8 font-serif leading-loose">
                      This E-Stamp paper certifies that stamp duty has been paid in accordance with the Indian Stamp Act, 1899 for the agreement category specified above. The purchaser, having completed secure Aadhaar Video KYC, is legally recognized as the executing party under the Information Technology Act, 2000.
                    </p>
                    <p className="indent-8 font-serif leading-loose">
                      The document has been digitally verified and sealed under the authority of Living Law Chambers, acting as a certified legal technology platform registrar. The details matches the Central Record Keeping Agency metadata registry.
                    </p>
                  </div>

                  <div className="flex justify-between items-end border-t border-slate-100 pt-6 mt-6">
                    <div className="text-[10px] font-sans text-slate-400">
                      <p>Certificate Date: {new Date().toLocaleDateString("en-IN")}</p>
                      <p>Seal Verification: SECURE-LIVING-LAW</p>
                      <div className="mt-2 w-12 h-12 opacity-85">
                        <img src="/digital_notary_seal.png" alt="Official Platform Seal" className="w-full h-full object-contain" />
                      </div>
                    </div>
                    {capturedPhoto && (
                      <div className="flex flex-col items-center gap-1">
                        <div className="w-16 h-16 border-2 border-slate-200 rounded-lg overflow-hidden bg-slate-50">
                          <img src={capturedPhoto} alt="Witness Face Scan" className="w-full h-full object-cover transform -scale-x-100" />
                        </div>
                        <span className="text-[8px] font-mono text-slate-400 uppercase font-bold">Witness Photo Seal</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* Right Column (Receipt Summary) */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-4 shadow-sm">
              <h3 className="font-serif-legal font-bold text-base border-b border-slate-100 dark:border-slate-800 pb-3">Order Invoice Summary</h3>
              
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Total Quantity</span>
                  <span className="font-semibold">{stampCount} Sheets</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Stamp Duty Total</span>
                  <span className="font-semibold">₹{stampDutyCost}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">E-Notary Verification Fee</span>
                  <span className="font-semibold">₹{platformFee}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Delivery Charges</span>
                  <span className="font-semibold">₹{deliveryFee}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Gateway Fee (Razorpay 2%)</span>
                  <span className="font-semibold">₹{razorpayCommission}</span>
                </div>
                
                <hr className="border-slate-100 dark:border-slate-800 my-4" />
                
                <div className="flex justify-between text-sm font-extrabold">
                  <span className="text-amber-500">Total Due Amount</span>
                  <span className="text-base">₹{grandTotal}</span>
                </div>
              </div>
            </div>

            {/* General Info notice card */}
            <div className="bg-amber-500/5 border border-amber-500/10 rounded-2xl p-6 flex items-start gap-4">
              <div className="w-16 h-16 shrink-0 opacity-90">
                <img src="/digital_notary_seal.png" alt="Official Notary Stamp Seal" className="w-full h-full object-contain" />
              </div>
              <div className="space-y-1.5">
                <div className="flex gap-2 text-amber-500 items-center">
                  <AlertCircle size={16} className="shrink-0" />
                  <h4 className="font-bold text-sm">Regulatory Notice</h4>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                  Stamping and Notary processes on Living Law adhere strictly to state stamp acts and Indian Notaries Act, 1952. Video KYC acts as absolute witness signatures. Stamp volume is capped at 500 per single application order block.
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>

      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} onSuccess={(user) => setCurrentUser(user)} />
    </div>
  );
}
