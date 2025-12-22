import { Button } from "@/components/ui/button";
import { BookOpen, Crown, Lightbulb, Scroll, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

interface HeroSectionProps {
  onTriggerStory?: () => void;
}

const HeroSection = ({ onTriggerStory }: HeroSectionProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [lampOn, setLampOn] = useState(false);
  const [stringPulled, setStringPulled] = useState(false);
  const [elementsVisible, setElementsVisible] = useState({
    crown: false,
    title: false,
    subtitle: false,
    description: false,
    buttons: false,
    banner: false,
  });

  useEffect(() => {
    setIsVisible(true);
    const delays = [
      { key: "crown", delay: 200 },
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
  }, []);

  const handleStringPull = () => {
    setStringPulled(true);
    setTimeout(() => {
      setLampOn(!lampOn);
      setTimeout(() => {
        setStringPulled(false);
      }, 400);
    }, 500);
  };

  // Keyboard shortcut: Cmd+O (Mac) or Ctrl+O (Windows/Linux) to toggle lamp
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'o') {
        e.preventDefault();
        handleStringPull();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lampOn]);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background Effects */}
      <div className="absolute inset-0">
        {/* Lamp light effect when on - subtle warm glow */}
        <div
          className={`absolute inset-0 transition-all duration-1000 ease-in-out ${lampOn
            ? "bg-[radial-gradient(ellipse_at_center,rgba(251,191,36,0.12)_0%,transparent_60%)] dark:bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.08)_0%,transparent_60%)]"
            : ""}`}
        />

        {/* Subtle vignette effect - adjusted for light mode */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,hsl(38_30%_92%/0.4)_100%)] dark:bg-[radial-gradient(ellipse_at_center,transparent_0%,hsl(20_10%_8%/0.3)_100%)]" />

        {/* Enhanced animated particles */}
        <div className="absolute inset-0 overflow-hidden">
          {Array.from({ length: 30 }).map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full animate-sparkle"
              style={{
                width: `${2 + Math.random() * 3}px`,
                height: `${2 + Math.random() * 3}px`,
                background: `hsl(24, 100%, ${40 + Math.random() * 15}%)`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 4}s`,
                animationDuration: `${2 + Math.random() * 3}s`,
                opacity: lampOn ? 0.7 + Math.random() * 0.3 : 0.5 + Math.random() * 0.4,
                boxShadow: '0 0 4px hsl(24, 100%, 50%)',
              }}
            />
          ))}
        </div>

        {/* Floating light orbs when lamp is on */}
        {lampOn && (
          <div className="absolute inset-0 overflow-hidden">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={`orb-${i}`}
                className="absolute rounded-full animate-float-random"
                style={{
                  width: `${20 + Math.random() * 40}px`,
                  height: `${20 + Math.random() * 40}px`,
                  background: `radial-gradient(circle, hsl(35, 100%, 60%, 0.4) 0%, transparent 70%)`,
                  left: `${10 + Math.random() * 80}%`,
                  top: `${20 + Math.random() * 60}%`,
                  animationDelay: `${Math.random() * 2}s`,
                  animationDuration: `${3 + Math.random() * 4}s`,
                }}
              />
            ))}
          </div>
        )}

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
          {/* Crown with Pull String */}
          <div className={`mb-6 flex justify-center transition-all duration-700 ${elementsVisible.crown ? "opacity-100 translate-y-0 scale-100" : "opacity-0 -translate-y-8 scale-75"}`}>
            <div className="relative">
              {/* The Crown */}
              <div className="relative">
                <Crown
                  className={`w-16 h-16 md:w-24 md:h-24 text-primary relative z-10 transition-all duration-700 ease-in-out ${lampOn ? "" : "animate-float-slow"}`}
                />

                {/* Light emanating from the orange bar at bottom of crown */}
                <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 transition-all duration-700 ease-in-out ${lampOn ? "opacity-100" : "opacity-0"}`}>
                  {/* Orange bar glow source */}
                  <div className="w-12 md:w-20 h-1.5 bg-gradient-to-r from-orange-400 via-amber-300 to-orange-400 rounded-full blur-[2px]" />
                  {/* Bright core glow */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 md:w-28 h-4 bg-gradient-to-b from-orange-300/60 to-transparent rounded-full blur-md" />
                  {/* Wide expanding warm glow */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 md:w-64 h-12 bg-gradient-to-b from-amber-400/30 via-orange-300/15 to-transparent rounded-full blur-xl" />
                  {/* Large light cone covering title */}
                  <div className="absolute top-2 left-1/2 -translate-x-1/2 w-[280px] md:w-[500px] lg:w-[700px] h-48 md:h-64 bg-gradient-to-b from-amber-300/20 via-orange-200/10 to-transparent blur-2xl" style={{ clipPath: "polygon(35% 0%, 65% 0%, 100% 100%, 0% 100%)" }} />
                  {/* Side light spread - left */}
                  <div className="absolute top-4 -left-20 md:-left-32 w-32 md:w-48 h-20 bg-gradient-to-r from-transparent via-amber-300/15 to-transparent rounded-full blur-2xl" />
                  {/* Side light spread - right */}
                  <div className="absolute top-4 -right-20 md:-right-32 w-32 md:w-48 h-20 bg-gradient-to-l from-transparent via-amber-300/15 to-transparent rounded-full blur-2xl" />
                </div>

                <Sparkles
                  className={`absolute -top-2 -right-2 w-6 h-6 z-20 transition-all duration-500 text-primary/60 ${lampOn ? "animate-spin" : ""} ${elementsVisible.crown ? "opacity-100 scale-100" : "opacity-0 scale-0"}`}
                  style={{ transitionDelay: "300ms", animationDuration: "3s" }}
                />
                <Sparkles
                  className={`absolute -bottom-1 -left-3 w-4 h-4 z-20 transition-all duration-500 text-primary/40 ${lampOn ? "animate-pulse" : ""} ${elementsVisible.crown ? "opacity-100 scale-100" : "opacity-0 scale-0"}`}
                  style={{ transitionDelay: "500ms" }}
                />
              </div>
              {/* Pull String */}
              <div
                className={`absolute -right-10 md:-right-12 top-0 transition-all duration-700 ease-out cursor-pointer group ${elementsVisible.crown ? "opacity-100" : "opacity-0"}`}
                onClick={handleStringPull}
                title="Pull to toggle lamp! (⌘O / Ctrl+O)"
              >
                {/* String line */}
                <svg
                  width="30"
                  height="70"
                  viewBox="0 0 30 70"
                  className={`transition-all duration-500 ease-out ${stringPulled ? "translate-y-4" : ""}`}
                >
                  <path
                    d="M15 0 Q18 12 15 24 Q12 36 15 48 Q18 60 15 70"
                    fill="none"
                    stroke="url(#stringGradient)"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    className={`animate-string-sway ${stringPulled ? "!animate-none" : ""}`}
                  />
                  <defs>
                    <linearGradient id="stringGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="hsl(25, 60%, 50%)" />
                      <stop offset="100%" stopColor="hsl(25, 40%, 35%)" />
                    </linearGradient>
                  </defs>
                </svg>

                {/* Pull handle/bead */}
                <div
                  className={`absolute bottom-0 left-1/2 -translate-x-1/2 transition-all duration-500 ease-out ${stringPulled ? "translate-y-3 scale-110" : "group-hover:translate-y-1.5 group-hover:scale-110"}`}
                >
                  <div className="relative">
                    <div className={`absolute inset-0 rounded-full blur-md transition-all duration-500 bg-primary/40 group-hover:scale-150`} />
                    <div className={`w-4 h-4 md:w-5 md:h-5 rounded-full relative z-10 shadow-lg transition-all duration-500 bg-gradient-to-br from-primary via-primary to-primary/80 group-hover:shadow-xl group-hover:shadow-primary/50`}
                    >
                      <div className="absolute top-0.5 left-0.5 w-1.5 h-1.5 bg-white/50 rounded-full" />
                    </div>
                    <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      <span className="text-[10px] text-primary/80 font-cinzel">Pull!</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Title */}
          <h1 className={`font-decorative text-4xl md:text-6xl lg:text-8xl mb-4 transition-all duration-1000 tech-text-gradient ${elementsVisible.title ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-8 scale-95"} ${lampOn ? "drop-shadow-[0_0_25px_rgba(255,255,255,0.3)]" : ""}`}>
            TECH FLUENCE 6.0
          </h1>

          <p className={`font-cinzel text-lg md:text-xl mb-2 tracking-widest text-muted-foreground transition-all duration-700 ${elementsVisible.subtitle ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"} ${lampOn ? "drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]" : ""}`}>
            Innovation Meets Excellence
          </p>

          {/* Keyboard Shortcuts Section */}
          <div className={`hidden md:flex items-center justify-center gap-8 mt-4 mb-2 transition-all duration-700 ${elementsVisible.subtitle ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
            {/* Flash/Lamp Toggle Shortcut */}
            <div
              className="flex items-center gap-3 px-4 py-2 rounded-lg bg-slate-900/40 dark:bg-slate-800/40 border border-slate-700/30 hover:border-primary/30 transition-all cursor-pointer group"
              onClick={handleStringPull}
              title="Toggle the lamp effect"
            >
              <Lightbulb className={`w-4 h-4 transition-colors ${lampOn ? 'text-amber-400' : 'text-primary/60 group-hover:text-primary'}`} />
              <div className="flex items-center gap-1">
                <kbd className="px-2 py-1 text-[10px] font-mono bg-slate-800/80 dark:bg-slate-700/80 text-white rounded border border-slate-600/50 shadow-sm">
                  ⌘
                </kbd>
                <span className="text-[10px] text-muted-foreground">/</span>
                <kbd className="px-1.5 py-1 text-[9px] font-mono bg-slate-800/80 dark:bg-slate-700/80 text-white rounded border border-slate-600/50 shadow-sm">
                  Ctrl
                </kbd>
                <span className="text-[10px] text-muted-foreground">+</span>
                <kbd className="px-2 py-1 text-[10px] font-mono bg-slate-800/80 dark:bg-slate-700/80 text-white rounded border border-slate-600/50 shadow-sm">
                  O
                </kbd>
              </div>
              <span className="text-[10px] text-primary/70 font-mono tracking-wider">FLASH</span>
            </div>

            {/* Story Mode Shortcut */}
            <div
              className="flex items-center gap-3 px-4 py-2 rounded-lg bg-slate-900/40 dark:bg-slate-800/40 border border-slate-700/30 hover:border-primary/30 transition-all cursor-pointer group"
              onClick={onTriggerStory}
              title="Replay the story intro"
            >
              <BookOpen className="w-4 h-4 text-primary/60 group-hover:text-primary transition-colors" />
              <div className="flex items-center gap-1">
                <kbd className="px-2 py-1 text-[10px] font-mono bg-slate-800/80 dark:bg-slate-700/80 text-white rounded border border-slate-600/50 shadow-sm">
                  ⌘
                </kbd>
                <span className="text-[10px] text-muted-foreground">/</span>
                <kbd className="px-1.5 py-1 text-[9px] font-mono bg-slate-800/80 dark:bg-slate-700/80 text-white rounded border border-slate-600/50 shadow-sm">
                  Ctrl
                </kbd>
                <span className="text-[10px] text-muted-foreground">+</span>
                <kbd className="px-2 py-1 text-[10px] font-mono bg-slate-800/80 dark:bg-slate-700/80 text-white rounded border border-slate-600/50 shadow-sm">
                  S
                </kbd>
              </div>
              <span className="text-[10px] text-primary/70 font-mono tracking-wider">STORY</span>
            </div>
          </div>

          {/* Subtitle with scroll decoration */}
          <div className={`flex items-center justify-center gap-4 my-8 transition-all duration-700 ${elementsVisible.subtitle ? "opacity-100 scale-100" : "opacity-0 scale-90"}`}>
            <div className={`h-px w-12 md:w-24 bg-gradient-to-r from-transparent to-primary/50 transition-all duration-500 ${lampOn ? "shadow-[0_0_8px_rgba(255,255,255,0.3)]" : ""}`} />
            <Scroll className={`w-6 h-6 animate-pulse text-primary transition-all duration-500 ${lampOn ? "drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]" : ""}`} />
            <div className={`h-px w-12 md:w-24 bg-gradient-to-l from-transparent to-primary/50 transition-all duration-500 ${lampOn ? "shadow-[0_0_8px_rgba(255,255,255,0.3)]" : ""}`} />
          </div>

          <p className={`font-cinzel text-base md:text-lg max-w-2xl mx-auto mb-10 leading-relaxed text-foreground/80 transition-all duration-700 ${elementsVisible.description ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
            An immersive gathering of visionaries, innovators, and tech leaders.
            Join us for the ultimate tech experience.
          </p>

          {/* CTA Buttons */}
          <div className={`flex flex-col sm:flex-row gap-4 justify-center transition-all duration-700 ${elementsVisible.buttons ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            <Link to="/register">
              <Button
                size="lg"
                className={`font-cinzel text-lg px-8 py-6 transition-all duration-500 hover:scale-105 bg-primary text-primary-foreground hover:bg-primary/90 tech-glow animate-pulse-glow ${lampOn ? "shadow-lg shadow-white/20" : ""}`}
              >
                Register for the Event
              </Button>
            </Link>
            <a href="#about">
              <Button
                size="lg"
                variant="outline"
                className={`font-cinzel text-lg px-8 py-6 transition-all duration-500 hover:scale-105 border-primary text-primary hover:bg-primary/10 ${lampOn ? "shadow-md shadow-white/10" : ""}`}
              >
                Learn More
              </Button>
            </a>
          </div>

          {/* Event Date Banner */}
          <div className={`mt-16 inline-block transition-all duration-700 ${elementsVisible.banner ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-8 scale-95"}`}>
            <div className={`parchment-bg tech-border rounded-lg px-8 py-4 transition-all duration-500 hover:tech-glow ${lampOn ? "shadow-lg shadow-white/10" : ""}`}>
              <p className="font-medieval text-sm text-muted-foreground mb-1">Mark Your Calendar</p>
              <p className="font-cinzel text-xl text-primary">Coming Soon 2025</p>
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
