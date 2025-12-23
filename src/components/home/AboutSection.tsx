import { Lightbulb, Network, Rocket, Users } from "lucide-react";
import { useEffect, useRef, useState } from "react";

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

const aboutText = "TECH FLUENCE 6.0 is an immersive event designed to connect students with tech founders, influencers, and industry experts. Our gathering focuses on innovation, entrepreneurship, real-world insights, networking, and exposure to the latest modern trends shaping our world.";

const AboutSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollUnrolled, setScrollUnrolled] = useState(false);
  const [displayedText, setDisplayedText] = useState("");
  const [showCursor, setShowCursor] = useState(true);
  const [rodVisible, setRodVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          // Animate rods first, then unroll scroll
          setTimeout(() => setRodVisible(true), 400);
          setTimeout(() => setScrollUnrolled(true), 800);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Typewriter effect - slower for more dramatic effect
  useEffect(() => {
    if (!scrollUnrolled) return;

    // Wait for scroll to unroll before starting typewriter
    const startDelay = setTimeout(() => {
      let currentIndex = 0;
      const typingSpeed = 25; // ms per character (slower)

      const typeInterval = setInterval(() => {
        if (currentIndex < aboutText.length) {
          setDisplayedText(aboutText.slice(0, currentIndex + 1));
          currentIndex++;
        } else {
          clearInterval(typeInterval);
          // Keep cursor blinking for a bit then hide
          setTimeout(() => setShowCursor(false), 2000);
        }
      }, typingSpeed);

      return () => clearInterval(typeInterval);
    }, 1200); // Wait for scroll animation to complete

    return () => clearTimeout(startDelay);
  }, [scrollUnrolled]);

  // Cursor blink effect
  useEffect(() => {
    if (!scrollUnrolled) return;
    const blinkInterval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 530);
    return () => clearInterval(blinkInterval);
  }, [scrollUnrolled]);

  // Helper function to highlight keywords
  const renderTextWithHighlights = (text: string) => {
    const keywords = ["innovation", "entrepreneurship", "TECH FLUENCE 6.0"];
    let result = text;

    keywords.forEach(keyword => {
      const regex = new RegExp(`(${keyword})`, "gi");
      result = result.replace(regex, `<span class="text-red-800 font-bold">$1</span>`);
    });

    return result;
  };

  return (
    <section ref={sectionRef} className="py-20 md:py-32 relative" id="about">
      {/* Subtle section divider glow */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className={`text-center mb-16 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
          <h2 className="font-decorative text-3xl md:text-5xl tech-text-gradient mb-4">
            About TECH FLUENCE 6.0
          </h2>
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-primary/50" />
            <div className="w-3 h-3 bg-primary rotate-45" />
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-primary/50" />
          </div>
        </div>

        {/* Ancient Scroll Container */}
        <div className={`max-w-4xl mx-auto text-center mb-16 transition-all duration-1000 delay-300 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
          {/* Scroll Top Rod - Animates in first */}
          <div className={`relative mx-auto transition-all duration-700 ease-out ${rodVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}>
            <div className="h-6 bg-gradient-to-r from-amber-900 via-amber-700 to-amber-900 rounded-full shadow-lg relative">
              {/* Rod ends */}
              <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-8 bg-gradient-to-b from-amber-600 to-amber-900 rounded-full shadow-md" />
              <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-8 bg-gradient-to-b from-amber-600 to-amber-900 rounded-full shadow-md" />
              {/* Rod shine */}
              <div className="absolute inset-x-4 top-1 h-1.5 bg-gradient-to-r from-transparent via-amber-500/40 to-transparent rounded-full" />
            </div>
          </div>

          {/* The Scroll Paper - Slow elegant unrolling */}
          <div
            className={`relative overflow-hidden ${scrollUnrolled ? "animate-scroll-unroll" : "max-h-0 opacity-0"}`}
            style={{
              animationDuration: "1.8s",
              animationTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
            }}
          >
            {/* Ancient Paper Background */}
            <div
              className="relative mx-2 md:mx-4"
              style={{
                background: `
                  linear-gradient(135deg,
                    hsl(35, 40%, 82%) 0%,
                    hsl(38, 35%, 78%) 20%,
                    hsl(40, 38%, 85%) 40%,
                    hsl(36, 32%, 80%) 60%,
                    hsl(38, 36%, 76%) 80%,
                    hsl(35, 40%, 82%) 100%
                  )
                `,
                boxShadow: `
                  inset 0 0 50px rgba(139, 90, 43, 0.3),
                  inset 0 0 100px rgba(139, 90, 43, 0.1),
                  0 10px 30px rgba(0, 0, 0, 0.4)
                `,
              }}
            >
              {/* Paper texture overlay */}
              <div
                className="absolute inset-0 opacity-30"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%' height='100%' filter='url(%23noise)'/%3E%3C/svg%3E")`,
                }}
              />

              {/* Aged stain effects */}
              <div className="absolute top-10 left-10 w-32 h-32 bg-amber-900/10 rounded-full blur-2xl" />
              <div className="absolute bottom-20 right-16 w-40 h-40 bg-amber-800/10 rounded-full blur-3xl" />
              <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-amber-700/5 rounded-full blur-xl" />

              {/* Burnt/aged edges effect */}
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 left-0 w-full h-4 bg-gradient-to-b from-amber-900/20 to-transparent" />
                <div className="absolute bottom-0 left-0 w-full h-4 bg-gradient-to-t from-amber-900/20 to-transparent" />
                <div className="absolute top-0 left-0 h-full w-4 bg-gradient-to-r from-amber-900/20 to-transparent" />
                <div className="absolute top-0 right-0 h-full w-4 bg-gradient-to-l from-amber-900/20 to-transparent" />
              </div>

              {/* Corner decorations */}
              <div className="absolute top-4 left-4 w-12 h-12 border-t-2 border-l-2 border-amber-700/40 rounded-tl-lg" />
              <div className="absolute top-4 right-4 w-12 h-12 border-t-2 border-r-2 border-amber-700/40 rounded-tr-lg" />
              <div className="absolute bottom-4 left-4 w-12 h-12 border-b-2 border-l-2 border-amber-700/40 rounded-bl-lg" />
              <div className="absolute bottom-4 right-4 w-12 h-12 border-b-2 border-r-2 border-amber-700/40 rounded-br-lg" />

              {/* Content */}
              <div className="relative z-10 p-8 md:p-12">
                {/* Decorative header */}
                <div className="flex items-center justify-center gap-4 mb-6">
                  <div className="h-px w-12 md:w-20 bg-gradient-to-r from-transparent to-amber-700/60" />
                  <div className="text-amber-800/60 text-2xl">⚜</div>
                  <div className="h-px w-12 md:w-20 bg-gradient-to-l from-transparent to-amber-700/60" />
                </div>

                {/* Typewriter Text */}
                <p
                  className="font-serif text-lg md:text-xl leading-relaxed text-amber-950/90 min-h-[150px]"
                  style={{
                    fontFamily: "'Playfair Display', 'Times New Roman', serif",
                    textShadow: "0 1px 2px rgba(139, 90, 43, 0.1)"
                  }}
                >
                  <span
                    className="font-decorative text-3xl text-amber-800 float-left mr-2 mt-1"
                    style={{ lineHeight: "0.8" }}
                  >
                    {displayedText.charAt(0) || "T"}
                  </span>
                  <span
                    dangerouslySetInnerHTML={{
                      __html: renderTextWithHighlights(displayedText.slice(1))
                    }}
                  />
                  {displayedText.length < aboutText.length && (
                    <span
                      className={`inline-block w-0.5 h-5 bg-amber-800 ml-0.5 align-middle transition-opacity duration-100 ${showCursor ? "opacity-100" : "opacity-0"
                        }`}
                    />
                  )}
                </p>

                {/* Decorative footer */}
                <div className="flex items-center justify-center gap-4 mt-8">
                  <div className="h-px w-8 bg-gradient-to-r from-transparent to-amber-700/40" />
                  <div className="flex gap-2">
                    <div className="w-1.5 h-1.5 bg-amber-700/40 rotate-45" />
                    <div className="w-1.5 h-1.5 bg-amber-700/60 rotate-45" />
                    <div className="w-1.5 h-1.5 bg-amber-700/40 rotate-45" />
                  </div>
                  <div className="h-px w-8 bg-gradient-to-l from-transparent to-amber-700/40" />
                </div>

                {/* Wax seal decoration */}
                <div className="absolute bottom-6 right-8 w-16 h-16 rounded-full bg-gradient-to-br from-red-700 via-red-800 to-red-900 shadow-lg flex items-center justify-center opacity-80">
                  <div className="text-red-200/80 text-2xl font-decorative">TF</div>
                </div>
              </div>
            </div>
          </div>

          {/* Scroll Bottom Rod - Appears after unroll */}
          <div className={`relative mx-auto transition-all duration-700 ease-out ${scrollUnrolled ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}
            style={{ transitionDelay: scrollUnrolled ? "1.5s" : "0s" }}>
            <div className="h-6 bg-gradient-to-r from-amber-900 via-amber-700 to-amber-900 rounded-full shadow-lg relative">
              {/* Rod ends */}
              <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-8 bg-gradient-to-b from-amber-600 to-amber-900 rounded-full shadow-md" />
              <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-8 bg-gradient-to-b from-amber-600 to-amber-900 rounded-full shadow-md" />
              {/* Rod shine */}
              <div className="absolute inset-x-4 top-1 h-1.5 bg-gradient-to-r from-transparent via-amber-500/40 to-transparent rounded-full" />
            </div>
          </div>
        </div>

        {/* Feature Cards with staggered animations */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className={`group transition-all duration-700 ease-out ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-16"
                }`}
              style={{ transitionDelay: `${2200 + index * 200}ms` }}
            >
              <div className="h-full bg-card tech-border rounded-xl p-6 hover:bg-secondary/50 transition-shadow duration-300 hover:tech-glow hover:shadow-xl hover:ring-2 hover:ring-primary/40 group-hover:border-primary/50">
                <div className="w-14 h-14 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-all duration-500 group-hover:scale-110 group-hover:rotate-3">
                  <feature.icon className="w-7 h-7 text-primary transition-transform duration-500 group-hover:scale-110" />
                </div>
                <h3 className="font-cinzel text-xl text-foreground mb-2 transition-colors duration-300 group-hover:text-primary">
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
