import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Crown, Sparkles, Star } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const sessions = {
  session1: [
    { name: "Alexander Sterling", role: "Founder, TechVentures", image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop" },
    { name: "Victoria Blackwood", role: "CEO, InnovateTech", image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop" },
    { name: "Sebastian Moore", role: "CTO, FutureTech", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop" },
  ],
  session2: [
    { name: "Elena Rosewood", role: "VP Engineering, NexusAI", image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop" },
    { name: "William Thornton", role: "Founder, ScaleLabs", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop" },
    { name: "Sophia Martinez", role: "CEO, Quantum Ventures", image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop" },
  ],
  session3: [
    { name: "James Whitmore", role: "CIO, CloudNexus", image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=400&fit=crop" },
    { name: "Isabella Chen", role: "Founder, Phoenix Labs", image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop" },
    { name: "Robert Hayes", role: "Partner, Tech Capital", image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop" },
  ],
};

const SpeakerCard = ({ speaker, index, isVisible }: { speaker: typeof sessions.session1[0]; index: number; isVisible: boolean }) => {
  return (
    <div
      className={`group relative transition-all duration-700 ease-out ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}
      style={{ transitionDelay: `${300 + index * 200}ms` }}
    >
      <div className="bg-card tech-border rounded-xl overflow-hidden transition-all duration-500 hover:scale-105 hover:-translate-y-2 hover:tech-glow group-hover:border-primary/40">
        {/* Image Container */}
        <div className="relative aspect-square overflow-hidden">
          <img
            src={speaker.image}
            alt={speaker.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent transition-opacity duration-500 group-hover:opacity-80" />

          {/* Crown Badge */}
          <div className="absolute top-4 right-4 w-10 h-10 bg-primary/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 group-hover:scale-110 group-hover:rotate-12">
            <Crown className="w-5 h-5 text-primary-foreground" />
          </div>

          {/* Shine effect on hover */}
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 translate-x-[-100%] group-hover:translate-x-[100%]"
            style={{ transition: "transform 0.7s ease-out, opacity 0.3s ease" }} />
        </div>

        {/* Content */}
        <div className="p-6 text-center">
          <div className="flex items-center justify-center gap-1 mb-2">
            {[0, 1, 2].map((starIndex) => (
              <Star
                key={starIndex}
                className={`w-4 h-4 text-primary fill-primary transition-all duration-300 ${isVisible ? "opacity-100 scale-100" : "opacity-0 scale-0"}`}
                style={{ transitionDelay: `${600 + index * 200 + starIndex * 100}ms` }}
              />
            ))}
          </div>
          <h3 className="font-cinzel text-lg text-foreground mb-1 transition-colors duration-300 group-hover:text-primary">
            {speaker.name}
          </h3>
          <p className="text-sm text-muted-foreground">
            {speaker.role}
          </p>
        </div>

        {/* Decorative corner */}
        <div className="absolute bottom-0 left-0 w-16 h-16 opacity-20 transition-opacity duration-300 group-hover:opacity-40">
          <svg viewBox="0 0 64 64">
            <path
              d="M0 64 L0 48 Q0 32 16 32 L32 32 Q48 32 48 16 L48 0"
              fill="none"
              stroke="hsl(25, 95%, 55%)"
              strokeWidth="2"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

const SpeakersSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="py-20 md:py-32 relative" id="speakers">
      {/* Subtle section divider glow */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className={`text-center mb-16 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="w-6 h-6 text-primary" />
            <h2 className="font-decorative text-3xl md:text-5xl tech-text-gradient">
              Inspiring Voices
            </h2>
            <Sparkles className="w-6 h-6 text-primary" />
          </div>
          <p className="font-cinzel text-muted-foreground tracking-wider">
            The Council of Tech Visionaries
          </p>
        </div>

        {/* Session Tabs */}
        <Tabs defaultValue="session1" className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-3 mb-12 bg-secondary/50 p-1 rounded-lg">
            <TabsTrigger
              value="session1"
              className="font-cinzel text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              Session 1
            </TabsTrigger>
            <TabsTrigger
              value="session2"
              className="font-cinzel text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              Session 2
            </TabsTrigger>
            <TabsTrigger
              value="session3"
              className="font-cinzel text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              Session 3
            </TabsTrigger>
          </TabsList>

          {Object.entries(sessions).map(([key, speakers]) => (
            <TabsContent key={key} value={key}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {speakers.map((speaker, index) => (
                  <SpeakerCard key={speaker.name} speaker={speaker} index={index} isVisible={isVisible} />
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  );
};

export default SpeakersSection;
