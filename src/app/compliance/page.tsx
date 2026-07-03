"use client";

import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import MarketplaceSection from "@/components/home/marketplace-section";

export default function CompliancePage() {
  return (
    <div className="bg-white dark:bg-[#030712] min-h-screen text-slate-900 dark:text-slate-100 transition-colors duration-300">
      <Navbar />
      <MarketplaceSection initialTab="compliance" hideTabs={true} />
      <Footer />
    </div>
  );
}
