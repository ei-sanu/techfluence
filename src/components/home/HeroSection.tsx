import ParticleSystem3D from "@/components/ParticleSystem3D";
import { Button } from "@/components/ui/button";
import { Scroll } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

interface HeroSectionProps {
  onTriggerStory?: () => void;
  handGesture?: boolean;
  scrollProgress?: number;
}

const HeroSection = ({ onTriggerStory, handGesture, scrollProgress }: HeroSectionProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [elementsVisible, setElementsVisible] = useState({
    title: false,
    subtitle: false,
    description: false,
    buttons: false,
    banner: false,
  });
  const [scrollY, setScrollY] = useState(0);
  const [handOpen, setHandOpen] = useState(true);
  const particleRef = useRef<{ triggerScatter: () => void; triggerReturn: () => void } | null>(null);

  useEffect(() => {
    setIsVisible(true);
    const delays = [
      { key: "title", delay: 500 },
      { key: "subtitle", delay: 800 },
      { key: "description", delay: 1100 },
      { key: "buttons", delay: 1400 },
      { key: "banner", delay: 1700 },
    ];

    delays.forEach(({ key, delay }) => {
      setTimeout(() => {
        setElementsVisible(prev => ({ ...prev, [key]: true }));
      }, delay);
    });

    // Listen for hand gesture events
    const handleHandGesture = (e: Event) => {
      const customEvent = e as CustomEvent<{ isOpen: boolean }>;
      setHandOpen(customEvent.detail.isOpen);
    };
    window.addEventListener('handGesture', handleHandGesture);

    let lastScrollY = 0;
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrollY(currentScrollY);

      // Trigger scatter on scroll down past threshold
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        particleRef.current?.triggerScatter();
      }
      // Trigger return on scroll up past threshold
      else if (currentScrollY < lastScrollY && currentScrollY < 50) {
        particleRef.current?.triggerReturn();
      }

      lastScrollY = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('handGesture', handleHandGesture);
    };
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background Effects */}
      <div className="absolute inset-0">
        {/* Subtle background layer (lamp effect removed) */}
        <div className="absolute inset-0 transition-all duration-1000 ease-in-out" />

        {/* Subtle vignette effect - adjusted for light mode */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,hsl(38_30%_92%/0.4)_100%)] dark:bg-[radial-gradient(ellipse_at_center,transparent_0%,hsl(20_10%_8%/0.3)_100%)]" />

        {/* Decorative corners */}
        <div className={`absolute top-20 left-4 md:left-10 transition-all duration-1000 ${isVisible ? "opacity-30 dark:opacity-20 translate-x-0" : "opacity-0 -translate-x-10"}`}>
          <svg width="100" height="100" viewBox="0 0 100 100">
            <path d="M0 100 L0 20 Q0 0 20 0 L100 0" fill="none" stroke="hsl(24, 100%, 48%)" strokeWidth="2" />
          </svg>
        </div>
        <div className={`absolute top-20 right-4 md:right-10 rotate-90 transition-all duration-1000 ${isVisible ? "opacity-30 dark:opacity-20 translate-x-0" : "opacity-0 translate-x-10"}`}>
          <svg width="100" height="100" viewBox="0 0 100 100">
            <path d="M0 100 L0 20 Q0 0 20 0 L100 0" fill="none" stroke="hsl(24, 100%, 48%)" strokeWidth="2" />
          </svg>
        </div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center">
          {/* crown removed - moved to navbar per request */}

          {/* Main Title */}
          <h1 className={`font-decorative text-4xl md:text-6xl lg:text-8xl mb-4 transition-all duration-1000 tech-text-gradient ${elementsVisible.title ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-8 scale-95"}`}>
            TECH FLUENCE 6
          </h1>

          <p className={`font-cinzel text-lg md:text-xl mb-2 tracking-widest text-muted-foreground transition-all duration-700 ${elementsVisible.subtitle ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
            Innovation Meets Excellence
          </p>

          {/* keyboard shortcuts removed from hero (moved to navbar) */}

          {/* Subtitle with scroll decoration */}
          <div className={`flex items-center justify-center gap-4 my-8 transition-all duration-700 ${elementsVisible.subtitle ? "opacity-100 scale-100" : "opacity-0 scale-90"}`}>
            <div className={`h-px w-12 md:w-24 bg-gradient-to-r from-transparent to-primary/50 transition-all duration-500`} />
            <Scroll className={`w-6 h-6 animate-pulse text-primary transition-all duration-500`} />
            <div className={`h-px w-12 md:w-24 bg-gradient-to-l from-transparent to-primary/50 transition-all duration-500`} />
          </div>

          {/* Description with 3D Particle Background */}
          <div className="relative my-12">
            {/* 3D Particle System Background */}
            <div className="absolute inset-0 h-[300px] md:h-[400px] -mx-4 md:-mx-8 pointer-events-none">
              <ParticleSystem3D
                ref={particleRef}
                handGesture={handOpen}
                scrollProgress={scrollY}
              />
            </div>

            {/* Text Content with Blur Background */}
            <div className={`relative z-10 transition-all duration-700 ${elementsVisible.description ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
              <div className="backdrop-blur-md bg-background/60 dark:bg-background/40 rounded-2xl p-8 md:p-10 max-w-3xl mx-auto border border-primary/20 shadow-2xl">
                <p className="font-cinzel text-base md:text-lg leading-relaxed text-foreground">
                  An Immersive large-scale technology and innovation conference bringing together industry leaders, startup founders, developers, creators, and students for high-impact talks, panels, workshops, and networking—focused on real-world technology and future careers.
                </p>
              </div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className={`relative z-20 flex flex-col sm:flex-row gap-4 justify-center mt-10 transition-all duration-700 ${elementsVisible.buttons ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            <Link to="/register">
              <Button
                size="lg"
                className={`font-cinzel text-lg px-8 py-6 transition-all duration-500 hover:scale-105 bg-primary text-primary-foreground hover:bg-primary/90 tech-glow animate-pulse-glow shadow-lg`}
              >
                Register for the Event
              </Button>
            </Link>
            <a href="#about">
              <Button
                size="lg"
                variant="outline"
                className={`font-cinzel text-lg px-8 py-6 transition-all duration-500 hover:scale-105 border-primary text-primary hover:bg-primary/10 shadow-lg`}
              >
                Learn More
              </Button>
            </a>
          </div>

          {/* Event Date Banner */}
          <div className={`mt-16 inline-block transition-all duration-700 ${elementsVisible.banner ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-8 scale-95"}`}>
            <div className={`parchment-bg tech-border rounded-lg px-8 py-4 transition-all duration-500 hover:tech-glow`}>
              <p className="font-medieval text-sm text-muted-foreground mb-1">Mark Your Calendar</p>
              <p className="font-cinzel text-xl text-primary">30 Jan & 2 Feb 2026</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom scroll indicator */}
      <div
        className={`absolute bottom-8 left-1/2 -translate-x-1/2 transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
        style={{ transitionDelay: "2000ms" }}
      >
        <div className="w-6 h-10 border-2 border-primary/50 rounded-full flex justify-center animate-bounce">
          <div className="w-1 h-3 rounded-full mt-2 animate-pulse bg-primary/50" />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
