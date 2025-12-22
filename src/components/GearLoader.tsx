import { useEffect, useState } from "react";

interface GearLoaderProps {
  isLoading?: boolean;
  onComplete?: () => void;
  minDuration?: number;
}

// Realistic interlocking gear with proper tooth geometry
const Gear = ({
  size,
  teeth,
  className,
  style,
  id,
}: {
  size: number;
  teeth: number;
  className?: string;
  style?: React.CSSProperties;
  id: string;
}) => {
  const innerRadius = size * 0.28;
  const outerRadius = size * 0.4;
  const toothHeight = size * 0.1;

  // Create gear path with proper involute-like tooth profile
  const createGearPath = () => {
    const points: string[] = [];

    for (let i = 0; i < teeth; i++) {
      const baseAngle = (i * 360) / teeth;
      const toothAngle = 360 / teeth;

      // Angles in radians
      const startAngle = ((baseAngle - toothAngle * 0.2) * Math.PI) / 180;
      const toothStartAngle = ((baseAngle - toothAngle * 0.1) * Math.PI) / 180;
      const toothPeakStartAngle = ((baseAngle + toothAngle * 0.1) * Math.PI) / 180;
      const toothPeakEndAngle = ((baseAngle + toothAngle * 0.25) * Math.PI) / 180;
      const toothEndAngle = ((baseAngle + toothAngle * 0.35) * Math.PI) / 180;
      const endAngle = ((baseAngle + toothAngle * 0.5) * Math.PI) / 180;

      // Base circle point
      const x1 = Math.cos(startAngle) * outerRadius;
      const y1 = Math.sin(startAngle) * outerRadius;

      // Tooth base start
      const x2 = Math.cos(toothStartAngle) * outerRadius;
      const y2 = Math.sin(toothStartAngle) * outerRadius;

      // Tooth peak start
      const x3 = Math.cos(toothPeakStartAngle) * (outerRadius + toothHeight);
      const y3 = Math.sin(toothPeakStartAngle) * (outerRadius + toothHeight);

      // Tooth peak end
      const x4 = Math.cos(toothPeakEndAngle) * (outerRadius + toothHeight);
      const y4 = Math.sin(toothPeakEndAngle) * (outerRadius + toothHeight);

      // Tooth base end
      const x5 = Math.cos(toothEndAngle) * outerRadius;
      const y5 = Math.sin(toothEndAngle) * outerRadius;

      // End of gap
      const x6 = Math.cos(endAngle) * outerRadius;
      const y6 = Math.sin(endAngle) * outerRadius;

      if (i === 0) {
        points.push(`M ${x1} ${y1}`);
      }

      points.push(`L ${x2} ${y2}`);
      points.push(`L ${x3} ${y3}`);
      points.push(`L ${x4} ${y4}`);
      points.push(`L ${x5} ${y5}`);
      points.push(`L ${x6} ${y6}`);
    }

    points.push("Z");
    return points.join(" ");
  };

  return (
    <svg
      width={size}
      height={size}
      viewBox={`${-size / 2} ${-size / 2} ${size} ${size}`}
      className={className}
      style={style}
    >
      <defs>
        <linearGradient id={`gear-gradient-${id}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="hsl(24, 95%, 50%)" />
          <stop offset="30%" stopColor="hsl(26, 100%, 58%)" />
          <stop offset="50%" stopColor="hsl(24, 90%, 48%)" />
          <stop offset="70%" stopColor="hsl(26, 95%, 55%)" />
          <stop offset="100%" stopColor="hsl(22, 90%, 42%)" />
        </linearGradient>
        <linearGradient id={`gear-inner-${id}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="hsl(22, 55%, 30%)" />
          <stop offset="100%" stopColor="hsl(20, 45%, 22%)" />
        </linearGradient>
        <filter id={`gear-shadow-${id}`}>
          <feDropShadow dx="2" dy="3" stdDeviation="4" floodColor="hsl(22, 80%, 25%)" floodOpacity="0.4" />
        </filter>
      </defs>

      {/* Gear body with teeth */}
      <path
        d={createGearPath()}
        fill={`url(#gear-gradient-${id})`}
        filter={`url(#gear-shadow-${id})`}
        stroke="hsl(22, 80%, 38%)"
        strokeWidth="1.5"
      />

      {/* Inner decorative ring */}
      <circle
        r={innerRadius + 5}
        fill="none"
        stroke="hsl(25, 65%, 50%)"
        strokeWidth="2"
        opacity="0.6"
      />

      {/* Inner circle (hub) */}
      <circle
        r={innerRadius}
        fill={`url(#gear-inner-${id})`}
        stroke="hsl(25, 75%, 45%)"
        strokeWidth="2"
      />

      {/* Decorative spokes */}
      {Array.from({ length: 6 }, (_, i) => {
        const angle = (i * 60 * Math.PI) / 180;
        const innerR = size * 0.1;
        const outerR = innerRadius - 3;
        return (
          <line
            key={i}
            x1={Math.cos(angle) * innerR}
            y1={Math.sin(angle) * innerR}
            x2={Math.cos(angle) * outerR}
            y2={Math.sin(angle) * outerR}
            stroke="hsl(25, 70%, 50%)"
            strokeWidth="4"
            strokeLinecap="round"
          />
        );
      })}

      {/* Center axle */}
      <circle r={size * 0.08} fill="hsl(25, 85%, 55%)" stroke="hsl(25, 65%, 40%)" strokeWidth="2" />

      {/* Center highlight */}
      <circle r={size * 0.04} fill="hsl(25, 95%, 70%)" />
    </svg>
  );
};

const GearLoader = ({ isLoading = true, onComplete, minDuration = 2000 }: GearLoaderProps) => {
  const [visible, setVisible] = useState(isLoading);
  const [fadeOut, setFadeOut] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (isLoading) {
      setVisible(true);
      setFadeOut(false);
      setProgress(0);

      // Animate progress
      const startTime = Date.now();
      const interval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const newProgress = Math.min((elapsed / minDuration) * 100, 100);
        setProgress(newProgress);

        if (newProgress >= 100) {
          clearInterval(interval);
          // Start fade out after progress completes
          setFadeOut(true);
          setTimeout(() => {
            setVisible(false);
            onComplete?.();
          }, 600);
        }
      }, 50);

      return () => clearInterval(interval);
    } else {
      // If not loading, fade out immediately
      setFadeOut(true);
      const timer = setTimeout(() => {
        setVisible(false);
        onComplete?.();
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [isLoading, minDuration, onComplete]);

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center transition-opacity duration-600 ${fadeOut ? "opacity-0" : "opacity-100"
        } bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100 dark:from-transparent dark:via-transparent dark:to-transparent`}
      style={{
        background: `
          radial-gradient(ellipse at center, hsl(38, 45%, 96%) 0%, hsl(35, 50%, 90%) 100%)
        `,
      }}
    >
      {/* Dark mode background override */}
      <div className="absolute inset-0 hidden dark:block" style={{
        background: `radial-gradient(ellipse at center, hsl(20, 12%, 12%) 0%, hsl(20, 10%, 6%) 100%)`
      }} />

      {/* Ambient glow effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-30 dark:opacity-20"
          style={{
            background: "radial-gradient(circle, hsl(24, 100%, 50%) 0%, transparent 70%)",
          }}
        />
      </div>

      {/* Interlocking gears system - properly aligned and meshing */}
      <div className="relative w-80 h-72">
        {/* Main large gear (center-left) - 16 teeth */}
        <div
          className="absolute gear-spin-main"
          style={{
            top: "50%",
            left: "30%",
            transform: "translate(-50%, -50%)",
          }}
        >
          <Gear size={140} teeth={16} id="main" />
        </div>

        {/* Second gear (right) - 12 teeth, meshes with main gear */}
        <div
          className="absolute gear-spin-secondary"
          style={{
            top: "45%",
            left: "68%",
            transform: "translate(-50%, -50%)",
          }}
        >
          <Gear size={105} teeth={12} id="secondary" />
        </div>

        {/* Third gear (bottom) - 10 teeth, meshes with main gear */}
        <div
          className="absolute gear-spin-tertiary"
          style={{
            top: "90%",
            left: "42%",
            transform: "translate(-50%, -50%)",
          }}
        >
          <Gear size={85} teeth={10} id="tertiary" />
        </div>

        {/* Fourth small gear (top) - 8 teeth, meshes with main gear */}
        <div
          className="absolute gear-spin-quaternary"
          style={{
            top: "8%",
            left: "22%",
            transform: "translate(-50%, -50%)",
          }}
        >
          <Gear size={65} teeth={8} id="quaternary" />
        </div>

        {/* Fifth tiny gear - connects secondary and a visual element */}
        <div
          className="absolute gear-spin-quinary"
          style={{
            top: "15%",
            left: "75%",
            transform: "translate(-50%, -50%)",
          }}
        >
          <Gear size={50} teeth={8} id="quinary" />
        </div>
      </div>

      {/* Branding and loading text */}
      <div className="mt-10 text-center relative z-10">
        <h2 className="font-decorative text-3xl md:text-4xl tech-text-gradient mb-3 tracking-wider">
          TECH FLUENCE 6.0
        </h2>
        <p className="text-muted-foreground font-cinzel text-sm tracking-[0.3em] uppercase">
          Initializing Experience
        </p>
      </div>

      {/* Elegant progress bar */}
      <div className="mt-8 w-64 relative">
        <div className="h-1.5 bg-secondary/50 rounded-full overflow-hidden backdrop-blur-sm">
          <div
            className="h-full rounded-full transition-all duration-100 ease-out"
            style={{
              width: `${progress}%`,
              background: "linear-gradient(90deg, hsl(25, 100%, 35%), hsl(25, 95%, 55%), hsl(25, 85%, 65%))",
              boxShadow: "0 0 10px hsl(25, 95%, 55%, 0.5)",
            }}
          />
        </div>
        <p className="text-center text-xs text-muted-foreground mt-2 font-cinzel">{Math.round(progress)}%</p>
      </div>

      {/* Decorative corner elements */}
      <div className="absolute top-8 left-8 w-16 h-16 border-t-2 border-l-2 border-primary/30 rounded-tl-lg" />
      <div className="absolute top-8 right-8 w-16 h-16 border-t-2 border-r-2 border-primary/30 rounded-tr-lg" />
      <div className="absolute bottom-8 left-8 w-16 h-16 border-b-2 border-l-2 border-primary/30 rounded-bl-lg" />
      <div className="absolute bottom-8 right-8 w-16 h-16 border-b-2 border-r-2 border-primary/30 rounded-br-lg" />
    </div>
  );
};

export default GearLoader;
