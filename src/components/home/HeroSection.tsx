import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Crown, Scroll, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const HeroSection = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background Effects */}
      <div className="absolute inset-0">
        {/* Radial gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-secondary/20" />
        
        {/* Animated particles */}
        <div className="absolute inset-0 overflow-hidden">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-primary/30 rounded-full animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${3 + Math.random() * 2}s`,
              }}
            />
          ))}
        </div>

        {/* Decorative corners */}
        <div className="absolute top-20 left-4 md:left-10 opacity-20">
          <svg width="100" height="100" viewBox="0 0 100 100">
            <path
              d="M0 100 L0 20 Q0 0 20 0 L100 0"
              fill="none"
              stroke="hsl(43, 80%, 55%)"
              strokeWidth="2"
            />
          </svg>
        </div>
        <div className="absolute top-20 right-4 md:right-10 opacity-20 rotate-90">
          <svg width="100" height="100" viewBox="0 0 100 100">
            <path
              d="M0 100 L0 20 Q0 0 20 0 L100 0"
              fill="none"
              stroke="hsl(43, 80%, 55%)"
              strokeWidth="2"
            />
          </svg>
        </div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className={`text-center transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
          {/* Crown Icon */}
          <div className="mb-6 flex justify-center">
            <div className="relative">
              <Crown className="w-16 h-16 md:w-24 md:h-24 text-primary animate-float" />
              <Sparkles className="absolute -top-2 -right-2 w-6 h-6 text-primary/60" />
            </div>
          </div>

          {/* Main Title */}
          <h1 className="font-decorative text-4xl md:text-6xl lg:text-8xl mb-4 royal-text-gradient">
            TechFluence
          </h1>
          
          <p className="font-cinzel text-lg md:text-xl text-muted-foreground mb-2 tracking-widest">
            Where Ancient Wisdom Meets Modern Innovation
          </p>

          {/* Subtitle with scroll decoration */}
          <div className="flex items-center justify-center gap-4 my-8">
            <div className="h-px w-12 md:w-24 bg-gradient-to-r from-transparent to-primary/50" />
            <Scroll className="w-6 h-6 text-primary" />
            <div className="h-px w-12 md:w-24 bg-gradient-to-l from-transparent to-primary/50" />
          </div>

          <p className="font-cinzel text-base md:text-lg text-foreground/80 max-w-2xl mx-auto mb-10 leading-relaxed">
            An immersive gathering of visionaries, innovators, and tech leaders. 
            Join us for a royal proclamation of the future.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register">
              <Button 
                size="lg" 
                className="font-cinzel text-lg px-8 py-6 bg-primary text-primary-foreground hover:bg-primary/90 royal-glow transition-all duration-300 hover:scale-105"
              >
                Register for the Event
              </Button>
            </Link>
            <Link to="/about">
              <Button 
                size="lg" 
                variant="outline"
                className="font-cinzel text-lg px-8 py-6 border-primary text-primary hover:bg-primary/10 transition-all duration-300"
              >
                Learn More
              </Button>
            </Link>
          </div>

          {/* Event Date Banner */}
          <div className="mt-16 inline-block">
            <div className="parchment-bg royal-border rounded-lg px-8 py-4">
              <p className="font-medieval text-sm text-muted-foreground mb-1">Mark Your Calendar</p>
              <p className="font-cinzel text-xl text-primary">Coming Soon 2025</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-primary/50 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-primary/50 rounded-full mt-2 animate-pulse" />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
