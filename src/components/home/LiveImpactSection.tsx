import { Eye, Heart, MessageCircle, Users } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const stats = [
  { icon: Eye, value: 240000, label: "Views", suffix: "+" },
  { icon: MessageCircle, value: 6800000, label: "Comments", suffix: "+" },
  { icon: Users, value: 30000, label: "Audience", suffix: "+" },
  { icon: Heart, value: 15000, label: "Engagements", suffix: "+" },
];

const formatNumber = (num: number) => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + "M";
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(0) + "K";
  }
  return num.toLocaleString();
};

const AnimatedCounter = ({
  value,
  suffix,
  isVisible
}: {
  value: number;
  suffix: string;
  isVisible: boolean;
}) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isVisible) return;

    const duration = 2000;
    const steps = 60;
    const increment = value / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [value, isVisible]);

  return (
    <span className="font-decorative text-3xl md:text-5xl royal-text-gradient">
      {formatNumber(count)}{suffix}
    </span>
  );
};

const LiveImpactSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="py-20 md:py-32 relative overflow-hidden">
      {/* Subtle section divider glow */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className={`text-center mb-16 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
          <h2 className="font-decorative text-3xl md:text-5xl royal-text-gradient mb-4">
            Live Impact
          </h2>
          <p className="font-cinzel text-muted-foreground tracking-wider">
            Still Counting...
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className={`text-center transition-all duration-700 ease-out ${isVisible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-12 scale-95"
                }`}
              style={{ transitionDelay: `${200 + index * 150}ms` }}
            >
              <div className="group bg-card royal-border rounded-xl p-6 md:p-8 hover:royal-glow transition-all duration-500 hover:scale-105 hover:-translate-y-2 hover:border-primary/40">
                <div className={`w-12 h-12 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center transition-all duration-500 group-hover:bg-primary/20 group-hover:scale-110 ${isVisible ? "rotate-0" : "rotate-180"}`}
                  style={{ transitionDelay: `${300 + index * 150}ms` }}>
                  <stat.icon className="w-6 h-6 text-primary transition-transform duration-300 group-hover:scale-110" />
                </div>
                <AnimatedCounter
                  value={stat.value}
                  suffix={stat.suffix}
                  isVisible={isVisible}
                />
                <p className="font-cinzel text-sm md:text-base text-muted-foreground mt-2 tracking-wider transition-colors duration-300 group-hover:text-foreground">
                  {stat.label}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LiveImpactSection;
