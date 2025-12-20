import { useEffect, useRef, useState } from "react";
import { Lightbulb, Users, Rocket, Network } from "lucide-react";

const features = [
  {
    icon: Lightbulb,
    title: "Innovation",
    description: "Discover cutting-edge technologies and groundbreaking ideas from industry pioneers.",
  },
  {
    icon: Users,
    title: "Entrepreneurship",
    description: "Learn from successful founders and gain insights into building world-changing companies.",
  },
  {
    icon: Rocket,
    title: "Real-World Insights",
    description: "Get practical knowledge from experts who have navigated the tech industry's challenges.",
  },
  {
    icon: Network,
    title: "Networking",
    description: "Connect with like-minded individuals, mentors, and potential collaborators.",
  },
];

const AboutSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="py-20 md:py-32 relative" id="about">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-b from-secondary/20 via-background to-secondary/10" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className={`text-center mb-16 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
          <h2 className="font-decorative text-3xl md:text-5xl royal-text-gradient mb-4">
            About TechFluence
          </h2>
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-primary/50" />
            <div className="w-3 h-3 bg-primary rotate-45" />
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-primary/50" />
          </div>
        </div>

        {/* Main Description */}
        <div className={`max-w-4xl mx-auto text-center mb-16 transition-all duration-700 delay-200 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
          <div className="parchment-bg royal-border rounded-xl p-8 md:p-12">
            <p className="font-cinzel text-lg md:text-xl text-foreground/90 leading-relaxed">
              <span className="font-decorative text-2xl text-primary">T</span>echFluence is an immersive event 
              designed to connect students with tech founders, influencers, and industry experts. 
              Our gathering focuses on <span className="text-primary">innovation</span>, <span className="text-primary">entrepreneurship</span>, 
              real-world insights, networking, and exposure to the latest modern trends shaping our world.
            </p>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className={`group transition-all duration-700 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              }`}
              style={{ transitionDelay: `${300 + index * 100}ms` }}
            >
              <div className="h-full bg-card royal-border rounded-xl p-6 hover:bg-secondary/50 transition-all duration-300 hover:scale-105 hover:royal-glow">
                <div className="w-14 h-14 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <feature.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-cinzel text-xl text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
