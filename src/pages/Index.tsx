import Footer from "@/components/Footer";
import GearLoader from "@/components/GearLoader";
import AboutSection from "@/components/home/AboutSection";
import CommunityVoicesSection from "@/components/home/CommunityVoicesSection";
import FAQSection from "@/components/home/FAQSection";
import GlimpseSection from "@/components/home/GlimpseSection";
import HeroSection from "@/components/home/HeroSection";
import LiveImpactSection from "@/components/home/LiveImpactSection";
import SpeakersSection from "@/components/home/SpeakersSection";
import Navbar from "@/components/Navbar";
import StoryIntro from "@/components/StoryIntro";
import { useEffect, useState } from "react";

const Index = () => {
  // Check if story was already shown in this session
  const hasSeenStory = sessionStorage.getItem("techfluence_story_shown") === "true";

  const [showStory, setShowStory] = useState(!hasSeenStory);
  const [showLoader, setShowLoader] = useState(hasSeenStory);
  const [contentVisible, setContentVisible] = useState(false);

  const handleStoryComplete = () => {
    // Mark story as shown in session storage
    sessionStorage.setItem("techfluence_story_shown", "true");
    setShowStory(false);
    setTimeout(() => setContentVisible(true), 100);
  };

  const handleLoaderComplete = () => {
    setShowLoader(false);
    setTimeout(() => setContentVisible(true), 100);
  };

  // Function to replay the story intro
  const handleTriggerStory = () => {
    setContentVisible(false);
    sessionStorage.removeItem("techfluence_story_shown");
    setTimeout(() => setShowStory(true), 300);
  };

  // Keyboard shortcut: Cmd+S (Mac) or Ctrl+S (Windows/Linux) to trigger story
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 's') {
        e.preventDefault();
        if (contentVisible && !showStory && !showLoader) {
          handleTriggerStory();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [contentVisible, showStory, showLoader]);

  // If returning from another page, show loader instead of story
  useEffect(() => {
    if (hasSeenStory && showLoader) {
      // Loader will auto-complete via onComplete
    }
  }, [hasSeenStory, showLoader]);

  return (
    <div className="min-h-screen">
      {showStory && <StoryIntro onComplete={handleStoryComplete} />}

      {showLoader && (
        <GearLoader
          isLoading={true}
          onComplete={handleLoaderComplete}
          minDuration={1500}
        />
      )}

      <div
        className={`transition-opacity duration-1000 ${contentVisible ? "opacity-100" : "opacity-0"
          }`}
      >
        <Navbar />
        <main>
          <HeroSection onTriggerStory={handleTriggerStory} />
          <AboutSection />
          <SpeakersSection />
          <GlimpseSection />
          <LiveImpactSection />
          <CommunityVoicesSection />
          <FAQSection />
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default Index;
