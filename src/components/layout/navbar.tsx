"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Scale, ShieldAlert, Award, FileText, LayoutDashboard, ShoppingBag, Phone } from "lucide-react";
import ContactModal from "./contact-modal";

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
      const sections = ["home", "marketplace", "notary", "academy", "odr", "contact"];
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
    { href: "/#home", label: "Home", id: "home", icon: Scale },
    { href: "/#marketplace", label: "Marketplace", id: "marketplace", icon: ShoppingBag },
    { href: "/#notary", label: "Notary & Stamp", id: "notary", icon: FileText },
    { href: "/#academy", label: "Academy", id: "academy", icon: Award },
    { href: "/#odr", label: "ODR & Dispute", id: "odr", icon: ShieldAlert },
    { href: "/#contact", label: "Contact Us", id: "contact", icon: Phone },
  ];

  const handleNavLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string, id: string) => {
    if (id === "contact") {
      e.preventDefault();
      setIsContactOpen(true);
      return;
    }
    if (pathname === "/" && href.startsWith("/#")) {
      e.preventDefault();
      const targetEl = document.getElementById(id);
      if (targetEl) {
        targetEl.scrollIntoView({ behavior: "smooth" });
        window.history.pushState(null, "", href);
        setActiveSection(id);
      }
    }
  };

  return (
    <header className={`w-full sticky top-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? "bg-white/60 dark:bg-[#030712]/60 backdrop-blur-md shadow-xs border-b border-gray-200/50 dark:border-gray-800/50" 
        : "bg-white/90 dark:bg-[#030712]/90 backdrop-blur-xs border-b border-gray-200/80 dark:border-gray-800/80"
    }`}>
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">

        <Link href="/#home" onClick={(e) => handleNavLinkClick(e, "/#home", "home")} className="flex items-center gap-2.5 group">
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
              : pathname.startsWith(link.href.split("#")[0]);

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
          <Link href="/dashboard">
            <button className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 dark:from-amber-600 dark:to-amber-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition hover:opacity-90 shadow-md hover:shadow-amber-500/10">
              <LayoutDashboard size={16} />
              <span>Workspace Login</span>
            </button>
          </Link>
        </div>
      </div>
      <ContactModal isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />
    </header>
  );
}