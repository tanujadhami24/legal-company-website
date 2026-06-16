"use client";

import { useState, useEffect } from "react";
import { Scale, AlertTriangle, ShieldCheck } from "lucide-react";

export default function DisclaimerModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [declined, setDeclined] = useState(false);

  useEffect(() => {
    // Check if the disclaimer has already been accepted
    const accepted = localStorage.getItem("livinglaw_disclaimer_accepted");
    if (accepted !== "true") {
      setIsOpen(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("livinglaw_disclaimer_accepted", "true");
    setIsOpen(false);
  };

  const handleDecline = () => {
    setDeclined(true);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-fade-in">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-amber-500/30 rounded-2xl shadow-2xl flex flex-col max-h-[85vh] overflow-hidden">
        
        {/* Header */}
        <div className="px-8 py-6 border-b border-slate-800 bg-slate-950/50 flex flex-col items-center text-center">
          <div className="w-12 h-12 bg-amber-500/10 border border-amber-500/20 rounded-full flex items-center justify-center text-amber-500 mb-3">
            <Scale size={24} />
          </div>
          <h2 className="text-2xl md:text-3xl font-serif-legal font-extrabold text-white tracking-wide">
            Legal Disclaimer & Terms of Use
          </h2>
          <div className="w-16 h-0.5 bg-amber-500/50 mt-2 rounded-full"></div>
        </div>

        {/* Modal content or Decline view */}
        {declined ? (
          <div className="p-8 flex-1 overflow-y-auto flex flex-col items-center justify-center text-center space-y-4">
            <div className="w-12 h-12 bg-amber-500/10 border border-amber-500/20 rounded-full flex items-center justify-center text-amber-500">
              <AlertTriangle size={24} />
            </div>
            <h3 className="text-xl font-serif-legal font-bold text-white">Access Deferred</h3>
            <p className="text-sm text-slate-400 max-w-sm">
              You will continue after agreeing terms and conditions.
            </p>
            <button 
              onClick={() => setDeclined(false)}
              className="mt-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white px-5 py-2.5 rounded-xl text-xs font-bold transition duration-200"
            >
              Review Terms Again
            </button>
          </div>
        ) : (
          <>
            {/* Scrollable Terms */}
            <div className="p-8 flex-1 overflow-y-auto space-y-6 text-sm text-slate-300 leading-relaxed scrollbar-thin scrollbar-thumb-slate-800">
              <p className="text-slate-400 italic">
                Welcome to <strong>Living Law Chambers</strong>. By accessing or using this platform, you acknowledge that you have read, understood, and agreed to the following terms and conditions.
              </p>

              <div className="space-y-2">
                <h4 className="font-serif-legal font-bold text-amber-400 text-base flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                  1. Information Purposes Only
                </h4>
                <p className="text-slate-400 pl-3.5">
                  The content, resources, templates, AI-generated responses, and materials available on this platform are provided solely for general informational and educational purposes. Nothing on this website should be construed as legal advice, legal opinion, or a substitute for consultation with a qualified legal professional regarding your specific circumstances.
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="font-serif-legal font-bold text-amber-400 text-base flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                  2. No Lawyer–Client Relationship
                </h4>
                <p className="text-slate-400 pl-3.5">
                  Accessing this platform, browsing its content, submitting inquiries, or using any of its services does not establish a lawyer–client relationship between you and Living Law Chambers or any listed legal professional. Such a relationship arises only upon the execution of a formal engagement agreement between the user and the concerned advocate or legal professional.
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="font-serif-legal font-bold text-amber-400 text-base flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                  3. Professional Directory & Listings
                </h4>
                <p className="text-slate-400 pl-3.5">
                  Living Law Chambers serves as a technology-enabled platform that allows advocates, mediators, arbitrators, and other legal professionals to present their professional profiles and credentials. We do not endorse, rank, recommend, guarantee, or promote any individual professional. Users are solely responsible for evaluating and selecting legal representation based on their own independent assessment and due diligence.
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="font-serif-legal font-bold text-amber-400 text-base flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                  4. Regulatory Compliance
                </h4>
                <p className="text-slate-400 pl-3.5">
                  Living Law Chambers operates in accordance with the applicable rules, regulations, and professional standards prescribed by the Bar Council of India. The platform does not advertise, solicit, or market legal services and does not engage in the practice of law. Its role is limited to facilitating access to legal information, technology tools, and professional connections.
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="font-serif-legal font-bold text-amber-400 text-base flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                  5. Accuracy and Limitation of Liability
                </h4>
                <p className="text-slate-400 pl-3.5">
                  While we strive to maintain accurate, current, and reliable information on the platform, Living Law Chambers makes no representations or warranties, whether express or implied, regarding the accuracy, completeness, reliability, availability, or suitability of any content, tools, templates, or services provided. Users rely on such information at their own discretion and risk.
                </p>
              </div>

              <div className="space-y-2 border-t border-slate-800 pt-4 mt-6">
                <h4 className="font-serif-legal font-bold text-amber-400 text-base flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                  6. User Acknowledgement
                </h4>
                <p className="text-slate-400 pl-3.5">
                  By selecting <strong>"Accept & Continue"</strong>, you confirm that:
                </p>
                <ul className="list-disc list-inside text-slate-400 pl-6 space-y-1 text-xs">
                  <li>You have read and understood this disclaimer.</li>
                  <li>You acknowledge that the platform does not provide legal advice.</li>
                  <li>You understand that no lawyer–client relationship is created through your use of the platform.</li>
                  <li>You agree to use the platform in accordance with these terms.</li>
                </ul>
                <p className="text-slate-400 text-xs italic mt-2 pl-3.5">
                  If you do not agree to these terms, please select "Decline" and discontinue use of the platform.
                </p>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="px-8 py-5 border-t border-slate-800 bg-slate-950/40 flex justify-end gap-4">
              <button 
                onClick={handleDecline}
                className="px-5 py-2.5 rounded-xl border border-slate-700 text-slate-400 text-sm font-semibold hover:bg-slate-800 hover:text-white transition duration-200"
              >
                Decline
              </button>
              <button 
                onClick={handleAccept}
                className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white px-7 py-2.5 rounded-xl text-sm font-bold flex items-center gap-1.5 transition duration-200 shadow-lg shadow-amber-500/10"
              >
                <ShieldCheck size={16} />
                <span>Accept & Continue</span>
              </button>
            </div>
          </>
        )}

      </div>
    </div>
  );
}
