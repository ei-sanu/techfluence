import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Crown, Check, Sparkles } from "lucide-react";

const Gear = ({ 
  size, 
  className, 
  delay = 0 
}: { 
  size: number; 
  className?: string; 
  delay?: number;
}) => {
  const [aligned, setAligned] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setAligned(true), 1500 + delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <svg
      width={size}
      height={size}
      viewBox="-50 -50 100 100"
      className={`transition-all duration-1000 ${className} ${aligned ? "" : "opacity-50"}`}
      style={{
        animation: aligned ? "none" : `spin ${2 + delay / 500}s linear infinite`,
      }}
    >
      <defs>
        <linearGradient id="gear-success-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="hsl(43, 80%, 55%)" />
          <stop offset="50%" stopColor="hsl(43, 70%, 70%)" />
          <stop offset="100%" stopColor="hsl(43, 85%, 35%)" />
        </linearGradient>
      </defs>
      
      {/* Gear teeth */}
      {Array.from({ length: 8 }).map((_, i) => {
        const angle = (i * 45 * Math.PI) / 180;
        return (
          <rect
            key={i}
            x="-8"
            y="-45"
            width="16"
            height="15"
            rx="2"
            fill="url(#gear-success-gradient)"
            transform={`rotate(${i * 45})`}
          />
        );
      })}
      
      {/* Main body */}
      <circle r="35" fill="url(#gear-success-gradient)" />
      <circle r="20" fill="hsl(20, 10%, 8%)" />
      <circle r="8" fill="hsl(43, 80%, 55%)" />
    </svg>
  );
};

const SuccessAnimation = () => {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setStage(1), 500),
      setTimeout(() => setStage(2), 2000),
      setTimeout(() => setStage(3), 3000),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className="fixed inset-0 bg-background/95 flex items-center justify-center z-50">
      <div className="text-center px-4">
        {/* Gears Animation */}
        <div className={`relative w-64 h-64 mx-auto mb-8 transition-opacity duration-500 ${stage >= 2 ? "opacity-0" : "opacity-100"}`}>
          <div className="absolute top-0 left-1/2 -translate-x-1/2">
            <Gear size={80} delay={0} />
          </div>
          <div className="absolute bottom-8 left-4">
            <Gear size={60} delay={200} />
          </div>
          <div className="absolute bottom-8 right-4">
            <Gear size={60} delay={400} />
          </div>
        </div>

        {/* Success Seal */}
        <div className={`transition-all duration-700 ${stage >= 2 ? "opacity-100 scale-100" : "opacity-0 scale-50"}`}>
          <div className="relative inline-block">
            {/* Seal Circle */}
            <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-primary via-primary to-accent flex items-center justify-center royal-glow animate-scale-in">
              <div className="w-28 h-28 rounded-full bg-background flex items-center justify-center">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                  {stage >= 3 ? (
                    <Check className="w-12 h-12 text-primary-foreground animate-scale-in" />
                  ) : (
                    <Crown className="w-10 h-10 text-primary-foreground" />
                  )}
                </div>
              </div>
            </div>

            {/* Sparkles */}
            <Sparkles className="absolute -top-2 -right-2 w-6 h-6 text-primary animate-pulse" />
            <Sparkles className="absolute -bottom-2 -left-2 w-6 h-6 text-primary animate-pulse" />
          </div>
        </div>

        {/* Success Message */}
        <div className={`mt-8 transition-all duration-500 ${stage >= 3 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
          <h2 className="font-decorative text-3xl md:text-4xl royal-text-gradient mb-4">
            Registration Complete!
          </h2>
          <p className="text-muted-foreground font-cinzel mb-8 max-w-md mx-auto">
            Your royal decree has been sealed and recorded. Welcome to TechFluence!
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/activity">
              <Button className="font-cinzel px-8">
                View My Registrations
              </Button>
            </Link>
            <Link to="/">
              <Button variant="outline" className="font-cinzel px-8">
                Return to Home
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default SuccessAnimation;
