import Navbar from "@/components/layout/navbar";
import CourtBanner from "@/components/home/court-banner";
import Hero from "@/components/home/hero";
import MarketplaceSection from "@/components/home/marketplace-section";
import NotarySection from "@/components/home/notary-section";
import AcademySection from "@/components/home/academy-section";
import OdrSection from "@/components/home/odr-section";
import Footer from "@/components/layout/footer";

export default function Home() {
  return (
    <main className="bg-white dark:bg-[#030712] min-h-screen transition-colors duration-300">
      <Navbar />

      <div id="home">
        <CourtBanner />
        <Hero />
      </div>

      <div id="marketplace" className="border-t border-amber-500/10">
        <MarketplaceSection />
      </div>

      <div id="notary" className="border-t border-amber-500/10">
        <NotarySection />
      </div>

      <div id="academy" className="border-t border-amber-500/10">
        <AcademySection />
      </div>

      <div id="odr" className="border-t border-amber-500/10">
        <OdrSection />
      </div>

      <Footer />
    </main>
  );
}