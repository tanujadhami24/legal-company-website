"use client";

import { useState } from "react";
import { X, Mail, Phone, MapPin, Send, CheckCircle2 } from "lucide-react";

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ContactModal({ isOpen, onClose }: ContactModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "Legal Consultation Inquiry",
    message: "",
  });
  
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");

    try {
      // Simulate API submit delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Construct mailto link as a robust client-side fallback
      const mailtoSubject = encodeURIComponent(`[Living Law Inquiry] ${formData.subject}`);
      const mailtoBody = encodeURIComponent(
        `Name: ${formData.name}\n` +
        `Email: ${formData.email}\n` +
        `Phone: ${formData.phone}\n\n` +
        `Message:\n${formData.message}`
      );
      
      // Open mailto link so it directly pre-fills user's email client
      window.location.href = `mailto:livinglaw01@gmail.com?subject=${mailtoSubject}&body=${mailtoBody}`;
      
      setStatus("success");
      setFormData({ name: "", email: "", phone: "", subject: "Legal Consultation Inquiry", message: "" });
    } catch (err) {
      setStatus("error");
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-[#020617]/80 backdrop-blur-md transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-3xl bg-white dark:bg-[#002f45] rounded-3xl overflow-hidden shadow-2xl border border-slate-200 dark:border-[#004d73]/40 flex flex-col md:flex-row transform scale-100 transition-all duration-300 z-10">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white p-2 rounded-full hover:bg-slate-100 dark:hover:bg-[#003e5c] transition-all z-20"
        >
          <X size={20} />
        </button>

        {/* Left Side: Contact Information Panel */}
        <div className="w-full md:w-[40%] bg-gradient-to-br from-[#003e5c] to-[#002f45] p-8 md:p-10 text-white flex flex-col justify-between relative overflow-hidden">
          {/* Subtle Glow Art */}
          <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-amber-500/10 rounded-full blur-3xl" />
          
          <div className="relative z-10">
            <span className="text-[10px] font-mono tracking-widest text-amber-400 uppercase font-bold">
              Contact Desk
            </span>
            <h3 className="text-3xl font-serif-legal font-bold mt-2 text-white">
              Living Law
            </h3>
            <p className="mt-4 text-sm text-slate-300 leading-relaxed">
              Reach out directly to our chambers for legal representation, notary services, or student academy consultations.
            </p>
          </div>

          <div className="mt-12 space-y-6 relative z-10">
            {/* Email Contact */}
            <a 
              href="mailto:livinglaw01@gmail.com" 
              className="flex items-center gap-4 group p-2 -m-2 rounded-xl hover:bg-white/5 transition-all"
            >
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 group-hover:bg-amber-500 group-hover:text-black transition-all">
                <Mail size={18} />
              </div>
              <div>
                <span className="text-xs text-slate-400 block">Email Us</span>
                <span className="text-sm font-semibold truncate block max-w-[180px] md:max-w-none">
                  livinglaw01@gmail.com
                </span>
              </div>
            </a>

            {/* Phone Contact */}
            <a 
              href="tel:+917505375151" 
              className="flex items-center gap-4 group p-2 -m-2 rounded-xl hover:bg-white/5 transition-all"
            >
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 group-hover:bg-amber-500 group-hover:text-black transition-all">
                <Phone size={18} />
              </div>
              <div>
                <span className="text-xs text-slate-400 block">Call Us</span>
                <span className="text-sm font-semibold">
                  +91 7505375151
                </span>
              </div>
            </a>

            {/* Location */}
            <div className="flex items-center gap-4 p-2 -m-2">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                <MapPin size={18} />
              </div>
              <div>
                <span className="text-xs text-slate-400 block">Location</span>
                <span className="text-sm font-semibold">
                  Delhi, India
                </span>
              </div>
            </div>
          </div>

          <div className="mt-12 text-[10px] text-slate-500 font-mono">
            © 2026 Living Law Chambers.
          </div>
        </div>

        {/* Right Side: Message Form */}
        <div className="w-full md:w-[60%] p-8 md:p-10 flex flex-col justify-center">
          {status === "success" ? (
            <div className="text-center py-10">
              <div className="w-16 h-16 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 border border-emerald-500/20 animate-bounce">
                <CheckCircle2 size={36} />
              </div>
              <h4 className="text-2xl font-bold text-slate-800 dark:text-white">
                Message Compiled!
              </h4>
              <p className="mt-4 text-slate-600 dark:text-slate-300 text-sm leading-relaxed max-w-sm mx-auto">
                Opening your email client to send your message directly to <strong>livinglaw01@gmail.com</strong>. Please hit send in your email client to complete transmission!
              </p>
              <button 
                onClick={() => setStatus("idle")}
                className="mt-8 px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-black text-sm font-semibold rounded-xl transition duration-200"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <h4 className="text-xl font-bold text-slate-800 dark:text-white">
                  Send a Message
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Fill in the fields below. We will respond within 24 hours.
                </p>
              </div>

              <div className="space-y-4">
                {/* Name */}
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5">
                    Your Name
                  </label>
                  <input 
                    type="text" 
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter your full name"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#002538] text-slate-800 dark:text-white focus:outline-none focus:border-amber-500 transition"
                  />
                </div>

                {/* Email & Phone grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5">
                      Email Address
                    </label>
                    <input 
                      type="email" 
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="name@example.com"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#002538] text-slate-800 dark:text-white focus:outline-none focus:border-amber-500 transition"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5">
                      Phone Number
                    </label>
                    <input 
                      type="tel" 
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+91 00000 00000"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#002538] text-slate-800 dark:text-white focus:outline-none focus:border-amber-500 transition"
                    />
                  </div>
                </div>

                {/* Subject Select */}
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5">
                    Subject / Area of Inquiry
                  </label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#002538] text-slate-800 dark:text-white focus:outline-none focus:border-amber-500 transition cursor-pointer"
                  >
                    <option value="Legal Consultation Inquiry">Legal Consultation</option>
                    <option value="Notary & Stamp Duty Inquiry">Notary & Stamp Duty</option>
                    <option value="Corporate/IP Registration">Corporate & IP Filing</option>
                    <option value="ODR/Dispute Resolution">ODR & Dispute Arbitration</option>
                    <option value="Student Academy Support">Student Academy / E-Books</option>
                  </select>
                </div>

                {/* Message */}
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5">
                    Message
                  </label>
                  <textarea 
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Write details of your legal query..."
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#002538] text-slate-800 dark:text-white focus:outline-none focus:border-amber-500 transition resize-none"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button 
                type="submit"
                disabled={status === "submitting"}
                className="w-full bg-[#e99e24] hover:opacity-90 disabled:opacity-50 text-slate-900 py-3 px-6 rounded-xl font-semibold flex items-center justify-center gap-2 shadow-lg shadow-amber-500/10 transition-all duration-300"
              >
                {status === "submitting" ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-slate-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Preparing Mail client...</span>
                  </>
                ) : (
                  <>
                    <Send size={16} />
                    <span>Send Message</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
