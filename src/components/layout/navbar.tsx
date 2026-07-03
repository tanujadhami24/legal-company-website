"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Scale, ShieldAlert, Award, FileText, LayoutDashboard, ShoppingBag, PhoneCall, Mail, X, Phone, Building2, ShieldCheck, ClipboardCheck } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [isContactOpen, setIsContactOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (pathname !== "/") {
      return;
    }

    const handleScrollSpy = () => {
      const sections = ["home", "marketplace", "notary", "academy", "odr"];
      const triggerY = 200; // Trigger line 200px from the top (just below navbar)

      let found = false;
      for (const id of sections) {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= triggerY && rect.bottom >= triggerY) {
            setActiveSection(id);
            found = true;
            break;
          }
        }
      }

      // Fallback: if trigger line doesn't intersect any section, pick the closest one
      if (!found) {
        let closestId = "home";
        let minDistance = Infinity;
        for (const id of sections) {
          const el = document.getElementById(id);
          if (el) {
            const rect = el.getBoundingClientRect();
            const elementCenter = rect.top + rect.height / 2;
            const dist = Math.abs(elementCenter - triggerY);
            if (dist < minDistance) {
              minDistance = dist;
              closestId = id;
            }
          }
        }
        setActiveSection(closestId);
      }
    };

    window.addEventListener("scroll", handleScrollSpy, { passive: true });
    // Run once on load
    handleScrollSpy();

    return () => window.removeEventListener("scroll", handleScrollSpy);
  }, [pathname]);

  const navLinks = [
    { href: "/business", label: "Business Registration", id: "business", icon: Building2 },
    { href: "/trademark", label: "Trademark & IP", id: "trademark", icon: ShieldCheck },
    { href: "/compliance", label: "Compliances", id: "compliance", icon: ClipboardCheck },
    { href: "/odr", label: "ODR & Dispute", id: "odr", icon: ShieldAlert },
    { href: "/talk", label: "Talk to Lawyer", id: "talk", icon: PhoneCall },
    { href: "#contact", label: "Contact Us", id: "contact", icon: Mail },
  ];

  const handleNavLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string, id: string) => {
    if (id === "contact") {
      e.preventDefault();
      setIsContactOpen(true);
      return;
    }
    if (pathname === "/") {
      if (href.startsWith("/#")) {
        e.preventDefault();
        const targetEl = document.getElementById(id);
        if (targetEl) {
          targetEl.scrollIntoView({ behavior: "smooth" });
          window.history.pushState(null, "", href);
          setActiveSection(id);
        }
      } else if (href === "/") {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: "smooth" });
        window.history.pushState(null, "", "/");
        setActiveSection("home");
      }
    } else {
      if (href.startsWith("/#") || href === "/" || href === "/#home") {
        e.preventDefault();
        window.location.href = href;
      }
    }
  };

  return (
    <>
      <header className={`w-full sticky top-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? "bg-white/60 dark:bg-[#030712]/60 backdrop-blur-md shadow-xs border-b border-gray-200/50 dark:border-gray-800/50" 
          : "bg-white/90 dark:bg-[#030712]/90 backdrop-blur-xs border-b border-gray-200/80 dark:border-gray-800/80"
      }`}>
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">

          <Link href="/" onClick={(e) => handleNavLinkClick(e, "/", "home")} className="flex items-center gap-2.5 group">
            <div className="p-2 bg-gradient-to-br from-amber-500 to-amber-700 rounded-full border border-amber-400/30 text-white shadow-md shadow-amber-500/5">
              <Scale size={20} className="group-hover:rotate-12 transition-transform duration-300" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-black dark:text-white font-serif-legal tracking-wide leading-none">
                LIVING <span className="text-amber-500 dark:text-amber-400 font-sans">LAW</span>
              </h1>
              <span className="text-[9px] font-mono tracking-widest text-slate-400 uppercase block mt-1 font-bold">
                Chambers & LegalTech
              </span>
            </div>
          </Link>

          {/* Nav Links */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === "/" 
                ? activeSection === link.id
                : (link.href.startsWith("/") && pathname.startsWith(link.href.split("#")[0]));

              return (
                <Link
                  key={link.id}
                  href={link.href}
                  onClick={(e) => handleNavLinkClick(e, link.href, link.id)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-all duration-200 hover:text-amber-500 dark:hover:text-amber-400 ${
                    isActive 
                      ? "text-amber-600 dark:text-amber-400 bg-amber-50/50 dark:bg-amber-950/20 border-b border-amber-500" 
                      : "text-gray-600 dark:text-gray-300"
                  }`}
                >
                  <Icon size={16} />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right Side */}
          <div className="flex items-center gap-4">
            <Link href="/login">
              <button className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 dark:from-amber-600 dark:to-amber-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition hover:opacity-90 shadow-md hover:shadow-amber-500/10">
                <LayoutDashboard size={16} />
                <span>Workspace Login</span>
              </button>
            </Link>
          </div>
        </div>
      </header>

      {/* Contact Us Modal */}
      {isContactOpen && (
        <div 
          className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setIsContactOpen(false)}
        >
          <div 
            className="bg-white dark:bg-slate-900 rounded-3xl p-8 max-w-sm w-full relative shadow-2xl border border-slate-100 dark:border-slate-800 flex flex-col items-center text-center animate-in scale-in duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button 
              onClick={() => setIsContactOpen(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
              aria-label="Close contact modal"
            >
              <X size={18} />
            </button>

            {/* Icon */}
            <div className="p-4 bg-amber-500/10 rounded-full text-amber-600 dark:text-amber-400 mb-4">
              <PhoneCall size={28} className="animate-pulse" />
            </div>

            {/* Headings */}
            <h3 className="font-serif-legal font-bold text-xl text-slate-900 dark:text-white">Contact Living Law</h3>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 mb-6">Chambers & LegalTech Support Hotline</p>

            {/* Info details */}
            <div className="w-full space-y-4">
              <a 
                href="tel:+917505375151" 
                className="w-full flex items-center gap-3.5 p-3.5 bg-slate-50 dark:bg-slate-800/40 hover:bg-amber-50/40 dark:hover:bg-amber-950/20 border border-slate-100 dark:border-slate-800 hover:border-amber-500/20 rounded-2xl transition duration-200 group text-slate-800 dark:text-slate-200 text-sm font-semibold"
              >
                <div className="p-2 bg-amber-500/10 rounded-xl text-amber-600 dark:text-amber-400 group-hover:bg-amber-500 group-hover:text-white transition-colors">
                  <Phone size={16} />
                </div>
                <div className="text-left">
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono block font-bold leading-none mb-1">CALL US</span>
                  <span>+91 7505375151</span>
                </div>
              </a>

              <a 
                href="mailto:livinglaw01@gmail.com" 
                className="w-full flex items-center gap-3.5 p-3.5 bg-slate-50 dark:bg-slate-800/40 hover:bg-amber-50/40 dark:hover:bg-amber-950/20 border border-slate-100 dark:border-slate-800 hover:border-amber-500/20 rounded-2xl transition duration-200 group text-slate-800 dark:text-slate-200 text-sm font-semibold"
              >
                <div className="p-2 bg-amber-500/10 rounded-xl text-amber-600 dark:text-amber-400 group-hover:bg-amber-500 group-hover:text-white transition-colors">
                  <Mail size={16} />
                </div>
                <div className="text-left">
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono block font-bold leading-none mb-1">EMAIL US</span>
                  <span>livinglaw01@gmail.com</span>
                </div>
              </a>
            </div>

            <p className="text-[10px] text-slate-400 dark:text-slate-500 leading-relaxed mt-6">
              Our legal advisors are available Mon-Sat, 9:00 AM - 7:00 PM IST.
            </p>
          </div>
        </div>
      )}
    </>
  );
}