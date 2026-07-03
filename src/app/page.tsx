import Navbar from "@/components/layout/navbar";
import CourtBanner from "@/components/home/court-banner";
import Introduction from "@/components/home/introduction";
import NotarySection from "@/components/home/notary-section";
import AcademySection from "@/components/home/academy-section";
import Footer from "@/components/layout/footer";

export default function Home() {
  return (
    <main className="bg-white dark:bg-[#030712] min-h-screen transition-colors duration-300">
      <Navbar />

      <div id="home">
        <CourtBanner />
        <Introduction />
      </div>

      <div id="notary" className="border-t border-amber-500/10">
        <NotarySection />
      </div>

      <div id="academy" className="border-t border-amber-500/10">
        <AcademySection />
      </div>

      <Footer />
    </main>
  );
}