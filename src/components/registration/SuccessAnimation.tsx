import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { Check, Copy, Crown, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

interface SuccessAnimationProps {
  checkInCode?: string | null;
  teamName?: string | null;
}

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
          <stop offset="0%" stopColor="hsl(25, 95%, 55%)" />
          <stop offset="50%" stopColor="hsl(25, 85%, 70%)" />
          <stop offset="100%" stopColor="hsl(25, 100%, 35%)" />
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
      <circle r="8" fill="hsl(25, 95%, 55%)" />
    </svg>
  );
};

const SuccessAnimation = ({ checkInCode, teamName }: SuccessAnimationProps) => {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setStage(1), 500),
      setTimeout(() => setStage(2), 2000),
      setTimeout(() => setStage(3), 3000),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  const copyCheckInCode = () => {
    if (checkInCode) {
      navigator.clipboard.writeText(checkInCode);
      toast({
        title: "Copied!",
        description: "Team Code copied to clipboard.",
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-background/95 z-50 overflow-y-auto">
      <div className="min-h-screen flex items-center justify-center py-8 px-4">
        <div className="text-center w-full max-w-md">
          {/* Gears Animation */}
          <div className={`relative w-48 h-48 mx-auto mb-6 transition-opacity duration-500 ${stage >= 2 ? "opacity-0 absolute" : "opacity-100"}`}>
            <div className="absolute top-0 left-1/2 -translate-x-1/2">
              <Gear size={64} delay={0} />
            </div>
            <div className="absolute bottom-6 left-2">
              <Gear size={48} delay={200} />
            </div>
            <div className="absolute bottom-6 right-2">
              <Gear size={48} delay={400} />
            </div>
          </div>

          {/* Success Seal */}
          <div className={`transition-all duration-700 ${stage >= 2 ? "opacity-100 scale-100" : "opacity-0 scale-50"}`}>
            <div className="relative inline-block">
              {/* Seal Circle */}
              <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-primary via-primary to-accent flex items-center justify-center royal-glow animate-scale-in">
                <div className="w-20 h-20 rounded-full bg-background flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                    {stage >= 3 ? (
                      <Check className="w-8 h-8 text-primary-foreground animate-scale-in" />
                    ) : (
                      <Crown className="w-7 h-7 text-primary-foreground" />
                    )}
                  </div>
                </div>
              </div>

              {/* Sparkles */}
              <Sparkles className="absolute -top-1 -right-1 w-5 h-5 text-primary animate-pulse" />
              <Sparkles className="absolute -bottom-1 -left-1 w-5 h-5 text-primary animate-pulse" />
            </div>
          </div>

          {/* Success Message */}
          <div className={`mt-6 transition-all duration-500 ${stage >= 3 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
            <h2 className="font-decorative text-2xl md:text-3xl royal-text-gradient mb-3">
              Registration Complete!
            </h2>
            <p className="text-muted-foreground font-sans text-sm mb-4 max-w-sm mx-auto">
              Your royal decree has been sealed and recorded. Welcome to TechFluence!
            </p>

            {/* Team Code Display */}
            {checkInCode && (
              <div className="bg-secondary/30 royal-border rounded-xl p-4 mb-5 max-w-xs mx-auto">
                {teamName && (
                  <div className="mb-3">
                    <p className="text-xs text-muted-foreground font-sans mb-1">Team Name</p>
                    <p className="text-base font-bold text-primary font-sans">{teamName}</p>
                  </div>
                )}
                <p className="text-xs text-muted-foreground font-sans mb-1">Your Team Code</p>
                <div className="flex items-center justify-center gap-2">
                  <span className="text-3xl font-bold text-primary tracking-widest font-mono">
                    {checkInCode}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={copyCheckInCode}
                    className="hover:bg-primary/10 h-8 w-8"
                  >
                    <Copy className="w-4 h-4 text-primary" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground font-sans mt-2">
                  Save this code! You'll need it during check-in.
                </p>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/activity">
                <Button className="font-sans font-semibold px-6 w-full sm:w-auto">
                  View My Registrations
                </Button>
              </Link>
              <Link to="/">
                <Button variant="outline" className="font-sans font-semibold px-6 w-full sm:w-auto">
                  Return to Home
                </Button>
              </Link>
            </div>
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
