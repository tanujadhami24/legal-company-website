"use client";

import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import NotarySection from "@/components/home/notary-section";

export default function NotaryPage() {
  return (
    <div className="bg-white dark:bg-[#030712] min-h-screen text-slate-900 dark:text-slate-100 transition-colors duration-300">
      <Navbar />
      <NotarySection />
      <Footer />
    </div>
  );
}
