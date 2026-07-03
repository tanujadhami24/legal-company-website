"use client";

import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import OdrSection from "@/components/home/odr-section";

export default function OdrPage() {
  return (
    <div className="bg-[#030712] min-h-screen text-slate-100 transition-colors duration-300">
      <Navbar />
      <OdrSection />
      <Footer />
    </div>
  );
}
