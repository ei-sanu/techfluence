import { Button } from "@/components/ui/button";
import { ChevronRight, Sparkles } from "lucide-react";
import { useEffect, useRef, useState } from "react";

// Season data with speakers
const seasonData = {
  1: {
    title: "Season 01",
    speakers: [
      {
        name: "MOHAMMAD FRAZ",
        image: "/guestimages/mhd_f.png",
        role: "Software Engineer, YouTuber",
        founder: "Founder LearnYard",
        companies: [
          { name: "SAP", logo: "/logos/sap.png" },
          { name: "Google", logo: "/logos/gfg.avif" },
          { name: "Cure.fit", logo: "/logos/cf.png" }
        ],
        stats: [
          { label: "Subscribers on YouTube", value: "496K+" },
          { label: "Followers on LinkedIn", value: "254K+" }
        ],
        linkedin: "https://linkedin.com/in/mohammadfraz?originalSubdomain=ae",
        highlights: [
          "Worked at Google, SAP Labs, and Cure.fit, contributing to scalable software solutions.",
          "Delivered TEDx talks on coding, career growth, and tech innovations."
        ]
      },
      {
        name: "Abhishek Kumar",
        image: "/guestimages/abhishek_kumar.png",
        role: "Engineer Manager at Google",
        companies: [
          { name: "Google", logo: "/logos/gfg.avif" }
        ],
        stats: [
          { label: "Followers on LinkedIn", value: "140K+" }
        ],
        linkedin: "https://www.linkedin.com/in/abhishekkumar/",
        highlights: [
          "Specializes in scalable distributed systems.",
          "Actively mentors students and professionals."
        ]
      },
      {
        name: "Shashank Mishra",
        image: "/guestimages/sashank_mishra.png",
        role: "Data Engineer, YouTuber, Public Speaker",
        companies: [
          { name: "Microsoft", logo: "/logos/ms.png" }
        ],
        stats: [
          { label: "Subscribers on YouTube", value: "178K+" },
          { label: "Followers on LinkedIn", value: "177K+" }
        ],
        linkedin: "https://www.linkedin.com/in/shashank-mishra/",
        highlights: [
          "Developed scalable data solutions for enterprise clients.",
          "Actively contributes to the data engineering community through blogs and webinars.",
          "Mentors aspiring data professionals."
        ]
      },
      {
        name: "Rocky Bhatia",
        image: "/guestimages/rocky_b.png",
        role: "Architect/SCS at Adobe",
        companies: [
          { name: "Adobe", logo: "/logos/cs.png" }
        ],
        stats: [
          { label: "Subscribers on YouTube", value: "6.32K+" },
          { label: "Followers on LinkedIn", value: "171K+" }
        ],
        linkedin: "https://www.linkedin.com/in/rockybhatia/",
        highlights: [
          "AI Research Scientist @DeepMind",
          "520K+ ML YouTube Community",
          "Published ML Researcher",
          "Stanford CS Guest Lecturer"
        ]
      },
      {
        name: "Rahul Maheshwari",
        image: "/guestimages/rahul_m.png",
        role: "Founder-LinuxSocials",
        companies: [
          { name: "Linux", logo: "/logos/linux.png" }
        ],
        stats: [
          { label: "Subscribers on YouTube", value: "25K+" },
          { label: "Followers on LinkedIn", value: "93K+" }
        ],
        linkedin: "https://www.linkedin.com/in/rahul-maheshwari/",
        highlights: [
          "Founded LinuxSocials, promoting Linux and open-source technologies.",
          "Conducts workshops and seminars to educate students and professionals on Linux.",
          "Develops tutorials and guides to help beginners navigate Linux systems."
        ]
      },
      {
        name: "Deepak Goyal",
        image: "/guestimages/deepak_g.png",
        role: "Founder- Crewsphere",
        companies: [
          { name: "Crewsphere", logo: "/logos/cs.png" }
        ],
        linkedin: "https://www.linkedin.com/in/deepak-goyal/",
        highlights: [
          "Founded Crewsphere, a collaboration and project management platform.",
          "Developed innovative remote work solutions for efficient team coordination.",
          "Leads a tech-driven startup, focusing on improving workplace productivity."
        ]
      }
    ]
  },
  2: {
    title: "Season 02",
    speakers: [
      {
        name: "Vivek Sridhar",
        image: "/guestimages/sirdhar.png",
        role: "CTO - Microsoft Startup",
        companies: [
          { name: "Microsoft", logo: "/logos/ms.png" }
        ],
        linkedin: "https://www.linkedin.com/in/vivek-sridhar/",
        highlights: [
          "Promotes cloud adoption among developers and IT professionals.",
          "Conducts workshops and seminars on cloud technologies",
          "Contributes to open-source cloud projects."
        ]
      }
    ]
  },
  3: {
    title: "Season 03",
    speakers: [
      {
        name: "Saumya Singh",
        image: "/guestimages/saumya_singh.png",
        role: "Software Engineer, Public Speaker",
        stats: [
          { label: "Subscribers on YouTube", value: "27K+" },
          { label: "Followers on LinkedIn", value: "235K+" }
        ],
        linkedin: "https://www.linkedin.com/in/saumya-singh/",
        highlights: [
          "Helps individuals monetize their online presence.",
          "Supports entrepreneurs in scaling their businesses.",
          "Won the International Women in Open Source Academic Award (2020)"
        ]
      },
      {
        name: "Sandeep Jain",
        image: "/guestimages/sandeep_j.png",
        role: "Founder, CEO of GFG",
        companies: [
          { name: "GeeksforGeeks", logo: "/logos/gfg.avif" }
        ],
        stats: [
          { label: "Subscribers on YouTube", value: "936K+" },
          { label: "Followers on LinkedIn", value: "329K+" }
        ],
        linkedin: "https://www.linkedin.com/in/sandeep-jain/",
        highlights: [
          "Created one of the largest coding platforms.",
          "Provides educational content for programmers.",
          "Helps students and professionals with DSA & interview prep."
        ]
      },
      {
        name: "Darika Jain",
        image: "/guestimages/darika_j.png",
        role: "LinkedIn Content Creator",
        stats: [
          { label: "Followers on LinkedIn", value: "800K+" }
        ],
        linkedin: "https://www.linkedin.com/in/darika-jain/",
        highlights: [
          "Content creator with 800K+ followers.",
          "Inspires and guides students in tech and career growth."
        ]
      },
      {
        name: "Hina Arora",
        image: "/guestimages/hina_a.png",
        role: "Public Speaker",
        stats: [
          { label: "Followers on LinkedIn", value: "254K+" }
        ],
        linkedin: "https://www.linkedin.com/in/hina-arora/",
        highlights: [
          "Guides students in career planning.",
          "Offers job preparation tips and mentorship."
        ]
      },
      {
        name: "Dr. Deeksha Sharma",
        image: "/guestimages/deeksha_sm.png",
        role: "Founder Enso Life- NeuroArt",
        companies: [
          { name: "Enso Life", logo: "/logos/na.png" }
        ],
        linkedin: "https://www.linkedin.com/in/dr-deeksha-sharma/",
        highlights: [
          "Raises awareness about mental well-being in tech.",
          "Provides resources and support for stress management."
        ]
      },
      {
        name: "Nishant Chahar",
        image: "/guestimages/nishant_c.png",
        role: "Founder of Tayyari, Ex- Microsoft",
        companies: [
          { name: "YouTube", logo: "/logos/yt.png" }
        ],
        stats: [
          { label: "Subscribers on YouTube", value: "476K+" },
          { label: "Followers on LinkedIn", value: "496K+" }
        ],
        linkedin: "https://www.linkedin.com/in/nishant-chahar/",
        highlights: [
          "Creates coding and interview prep content.",
          "Influences thousands through YouTube tutorials."
        ]
      },
      {
        name: "M.V. Karan",
        image: "/guestimages/karan_mv.png",
        role: "Head, Director DevRel next",
        companies: [
          { name: "Linux", logo: "/logos/linux.png" }
        ],
        linkedin: "https://www.linkedin.com/in/mv-karan/",
        highlights: [
          "Promotes open-source development.",
          "Encourages developer collaboration.",
          "Supports tech communities through GitHub initiatives."
        ]
      }
    ]
  },
  4: {
    title: "Season 04",
    speakers: [
      {
        name: "Coming Soon",
        image: "https://media.licdn.com/dms/image/D4D03AQFJwKQwQwQwQw/profile-displayphoto-shrink_400_400/0/1660000000000?e=1700000000&v=beta&t=xxxx",
        role: "Stay Tuned for Updates",
        linkedin: "#"
      }
    ]
  }
};

const SpeakerCard = ({ speaker, index, isVisible }: { speaker: any; index: number; isVisible: boolean }) => {
  return (
    <div
      className={`group relative transition-all duration-700 ease-out ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}
      style={{ transitionDelay: `${300 + index * 200}ms` }}
    >
      <div className="bg-card tech-border rounded-xl overflow-hidden transition-shadow duration-300 hover:tech-glow hover:shadow-xl hover:ring-2 hover:ring-primary/40 group-hover:border-primary/40 flex flex-col md:w-[340px] w-full mx-auto h-[520px]">
        <div className="flex flex-col h-full p-6">
          {/* Circular Image at Top */}
          <div className="flex justify-center mb-4">
            <div className="relative">
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-primary/30 transition-all duration-300 group-hover:border-primary group-hover:shadow-lg group-hover:shadow-primary/30">
                <img
                  src={speaker.image}
                  alt={speaker.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>
              {/* Glow effect */}
              <div className="absolute -inset-1 bg-primary/20 rounded-full blur-md -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          </div>

          {/* Content */}
          <div className="text-center flex-1 flex flex-col">
            <h3 className="font-cinzel text-xl text-foreground mb-2 transition-colors duration-300 group-hover:text-primary font-bold">
              {speaker.name}
            </h3>
            <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
              {speaker.role}
            </p>
            {speaker.founder && (
              <p className="text-sm text-primary font-semibold mb-3">{speaker.founder}</p>
            )}

            {/* Company Logos */}
            {speaker.companies && (
              <div className="flex items-center justify-center gap-2 mb-4">
                {speaker.companies.map((company: any, idx: number) => (
                  <img key={company.name + idx} src={company.logo} alt={company.name} className="w-8 h-8 rounded-full border border-border" />
                ))}
              </div>
            )}

            {/* Social Stats with Logo Icons */}
            {speaker.stats && (
              <div className="flex flex-col items-center gap-2 mb-4 bg-secondary/30 rounded-lg p-3">
                {speaker.stats.map((stat: any, idx: number) => (
                  <div key={stat.label + idx} className="flex items-center gap-3 w-full justify-center">
                    {stat.label.includes('YouTube') ? (
                      <>
                        <svg className="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                        </svg>
                        <span className="text-sm text-foreground font-bold">{stat.value}</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                        </svg>
                        <span className="text-sm text-foreground font-bold">{stat.value}</span>
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Highlights - Now directly after stats */}
            {speaker.highlights && (
              <ul className="text-xs text-muted-foreground space-y-1 text-left">
                {speaker.highlights.slice(0, 2).map((hl: string, idx: number) => (
                  <li key={hl + idx} className="line-clamp-2 flex items-start gap-2">
                    <span className="text-primary mt-1 flex-shrink-0">•</span>
                    <span>{hl}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
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
  const [activeSeason, setActiveSeason] = useState(1);
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

  const currentSpeakers = seasonData[activeSeason as keyof typeof seasonData]?.speakers || [];
  const currentSeasonTitle = seasonData[activeSeason as keyof typeof seasonData]?.title || "";

  return (
    <section ref={sectionRef} className="py-20 md:py-32 relative" id="speakers">
      {/* Subtle section divider glow */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className={`text-center mb-12 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
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

        {/* Season Tabs */}
        <div className={`flex flex-wrap items-center justify-center gap-3 mb-8 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`} style={{ transitionDelay: "200ms" }}>
          {[1, 2, 3, 4].map((seasonNum) => (
            <button
              key={seasonNum}
              onClick={() => setActiveSeason(seasonNum)}
              className={`px-6 py-3 rounded-lg font-cinzel text-sm md:text-base transition-all duration-300 tech-border ${activeSeason === seasonNum
                ? "bg-primary text-primary-foreground shadow-lg scale-105"
                : "bg-card hover:bg-primary/10 text-muted-foreground hover:text-foreground hover:border-primary/40"
                }`}
            >
              Season {seasonNum}
            </button>
          ))}

          {/* Season 5+ Button */}
          <Button
            onClick={() => window.location.href = '#register'}
            className="px-6 py-3 rounded-lg font-cinzel text-sm md:text-base bg-gradient-to-r from-primary to-orange-600 hover:from-primary/90 hover:to-orange-500 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group"
          >
            More Seasons
            <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>

        {/* Current Season Title */}
        <div className={`text-center mb-8 transition-all duration-500 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`} style={{ transitionDelay: "400ms" }}>
          <h3 className="text-xl md:text-2xl font-cinzel text-foreground/80">
            {currentSeasonTitle}
          </h3>
        </div>

        {/* Speaker Cards - Horizontal Scroll */}
        <div className="w-full max-w-6xl mx-auto px-4 relative">
          {currentSpeakers.length > 3 && (
            <p className="text-center text-sm text-muted-foreground mb-4">
              Scroll horizontally to see more speakers →
            </p>
          )}
          <div
            className="overflow-x-auto overflow-y-hidden pb-4"
            style={{
              scrollBehavior: 'smooth',
              WebkitOverflowScrolling: 'touch'
            }}
          >
            <div className="flex gap-8 w-max py-2">
              {currentSpeakers.map((speaker, index) => (
                <div key={speaker.name + activeSeason} style={{ width: '340px', minWidth: '340px', maxWidth: '340px' }}>
                  <SpeakerCard speaker={speaker} index={index} isVisible={isVisible} />
                </div>
              ))}
            </div>
          </div>
        </div>

        <style>{`
          .overflow-x-auto::-webkit-scrollbar {
            height: 8px;
          }
          .overflow-x-auto::-webkit-scrollbar-track {
            background: transparent;
            border-radius: 10px;
          }
          .overflow-x-auto::-webkit-scrollbar-thumb {
            background: hsl(25, 95%, 55%);
            border-radius: 10px;
          }
          .overflow-x-auto::-webkit-scrollbar-thumb:hover {
            background: hsl(25, 95%, 45%);
          }
        `}</style>

      </div>
    </section>
  );
};

export default SpeakersSection;
