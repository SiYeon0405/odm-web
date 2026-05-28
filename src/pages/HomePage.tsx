import Footer from "@/components/footer/Footer";
import HeroSection from "@/components/hero/HeroSection";
import HomeNavbar from "@/components/navbar/HomeNavbar";

export default function HomePage() {
  return (
    <>
      <main className="home-page min-h-[100svh] overflow-hidden bg-cream font-sans text-espresso lg:h-[100svh]">
        <div className="home-ambient" aria-hidden="true" />
        <HomeNavbar />
        <HeroSection />
      </main>
      <Footer />
    </>
  );
}
