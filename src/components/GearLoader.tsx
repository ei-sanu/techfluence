import { useEffect, useState } from "react";

interface GearLoaderProps {
  isLoading?: boolean;
  onComplete?: () => void;
  minDuration?: number;
}

const Gear = ({ 
  size, 
  teeth, 
  className, 
  style 
}: { 
  size: number; 
  teeth: number; 
  className?: string; 
  style?: React.CSSProperties;
}) => {
  const innerRadius = size * 0.3;
  const outerRadius = size * 0.45;
  const toothHeight = size * 0.12;
  
  const toothPath = Array.from({ length: teeth }, (_, i) => {
    const angle = (i * 360) / teeth;
    const nextAngle = ((i + 0.5) * 360) / teeth;
    const rad = (angle * Math.PI) / 180;
    const nextRad = (nextAngle * Math.PI) / 180;
    
    const x1 = Math.cos(rad) * outerRadius;
    const y1 = Math.sin(rad) * outerRadius;
    const x2 = Math.cos(rad) * (outerRadius + toothHeight);
    const y2 = Math.sin(rad) * (outerRadius + toothHeight);
    const x3 = Math.cos(nextRad) * (outerRadius + toothHeight);
    const y3 = Math.sin(nextRad) * (outerRadius + toothHeight);
    const x4 = Math.cos(nextRad) * outerRadius;
    const y4 = Math.sin(nextRad) * outerRadius;
    
    return `M ${x1} ${y1} L ${x2} ${y2} L ${x3} ${y3} L ${x4} ${y4}`;
  }).join(" ");

  return (
    <svg
      width={size}
      height={size}
      viewBox={`${-size/2} ${-size/2} ${size} ${size}`}
      className={className}
      style={style}
    >
      <defs>
        <linearGradient id={`gear-gradient-${size}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="hsl(43, 80%, 55%)" />
          <stop offset="50%" stopColor="hsl(43, 70%, 70%)" />
          <stop offset="100%" stopColor="hsl(43, 85%, 35%)" />
        </linearGradient>
        <filter id="gear-glow">
          <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      
      {/* Main gear body */}
      <circle
        r={outerRadius}
        fill={`url(#gear-gradient-${size})`}
        filter="url(#gear-glow)"
      />
      
      {/* Teeth */}
      <path
        d={toothPath}
        fill={`url(#gear-gradient-${size})`}
        filter="url(#gear-glow)"
      />
      
      {/* Inner circle */}
      <circle
        r={innerRadius}
        fill="hsl(20, 10%, 8%)"
        stroke="hsl(43, 80%, 55%)"
        strokeWidth="2"
      />
      
      {/* Center hole */}
      <circle
        r={size * 0.08}
        fill="hsl(43, 80%, 55%)"
      />
      
      {/* Decorative spokes */}
      {Array.from({ length: 6 }, (_, i) => {
        const angle = (i * 60 * Math.PI) / 180;
        return (
          <line
            key={i}
            x1={Math.cos(angle) * (innerRadius + 5)}
            y1={Math.sin(angle) * (innerRadius + 5)}
            x2={Math.cos(angle) * (size * 0.12)}
            y2={Math.sin(angle) * (size * 0.12)}
            stroke="hsl(43, 60%, 45%)"
            strokeWidth="3"
          />
        );
      })}
    </svg>
  );
};

const GearLoader = ({ isLoading = true, onComplete, minDuration = 1500 }: GearLoaderProps) => {
  const [visible, setVisible] = useState(isLoading);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    if (isLoading) {
      setVisible(true);
      setFadeOut(false);
    } else {
      const timer = setTimeout(() => {
        setFadeOut(true);
        setTimeout(() => {
          setVisible(false);
          onComplete?.();
        }, 500);
      }, minDuration);
      return () => clearTimeout(timer);
    }
  }, [isLoading, minDuration, onComplete]);

  if (!visible) return null;

  return (
    <div 
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-background transition-opacity duration-500 ${
        fadeOut ? "opacity-0" : "opacity-100"
      }`}
    >
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, hsl(43, 80%, 55%, 0.1) 0%, transparent 50%),
                           radial-gradient(circle at 75% 75%, hsl(43, 80%, 55%, 0.1) 0%, transparent 50%)`
        }} />
      </div>

      {/* Gears container */}
      <div className="relative w-64 h-64">
        {/* Large gear - top left */}
        <div className="absolute top-0 left-0">
          <Gear size={100} teeth={12} className="gear-spin" />
        </div>
        
        {/* Medium gear - right, interlocked */}
        <div className="absolute top-8 right-4">
          <Gear size={80} teeth={10} className="gear-spin-reverse" />
        </div>
        
        {/* Small gear - bottom center */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
          <Gear size={60} teeth={8} className="gear-spin" />
        </div>
        
        {/* Tiny gear - connector */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <Gear size={45} teeth={6} className="gear-spin-slow" />
        </div>
      </div>

      {/* Loading text */}
      <div className="mt-8 text-center">
        <h2 className="font-decorative text-2xl md:text-3xl royal-text-gradient mb-2">
          TechFluence
        </h2>
        <p className="text-muted-foreground font-cinzel text-sm tracking-widest animate-pulse">
          Initializing Royal Archives...
        </p>
      </div>

      {/* Progress bar */}
      <div className="mt-6 w-48 h-1 bg-secondary rounded-full overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-royal-gold-dark via-primary to-royal-gold-light animate-shimmer"
          style={{ width: "100%" }}
        />
      </div>
    </div>
  );
};

export default GearLoader;
