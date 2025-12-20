import Footer from "@/components/Footer";
import AboutSection from "@/components/home/AboutSection";
import FAQSection from "@/components/home/FAQSection";
import HeroSection from "@/components/home/HeroSection";
import LiveImpactSection from "@/components/home/LiveImpactSection";
import SpeakersSection from "@/components/home/SpeakersSection";
import Navbar from "@/components/Navbar";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <HeroSection />
        <AboutSection />
        <SpeakersSection />
        <LiveImpactSection />
        <FAQSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
