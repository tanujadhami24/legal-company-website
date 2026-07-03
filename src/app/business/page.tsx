"use client";

import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import MarketplaceSection from "@/components/home/marketplace-section";

export default function BusinessPage() {
  return (
    <div className="bg-[#030712] min-h-screen text-slate-100 transition-colors duration-300">
      <Navbar />
      <MarketplaceSection initialTab="business" hideTabs={true} />
      <Footer />
    </div>
  );
}
