import Navbar from "@/components/layout/navbar";
import CourtBanner from "@/components/home/court-banner";
import Introduction from "@/components/home/introduction";
import Footer from "@/components/layout/footer";

export default function Home() {
  return (
    <main className="bg-white dark:bg-[#030712] min-h-screen transition-colors duration-300">
      <Navbar />

      <div id="home">
        <CourtBanner />
        <Introduction />
      </div>

      <Footer />
    </main>
  );
}