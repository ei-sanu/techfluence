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
        image: "https://media.licdn.com/dms/image/D4D03AQFJwKQwQwQwQw/profile-displayphoto-shrink_400_400/0/1660000000000?e=1700000000&v=beta&t=xxxx",
        role: "Software Engineer, YouTuber",
        founder: "Founder LearnYard",
        companies: [
          { name: "SAP", logo: "/public/logos/sap.png" },
          { name: "Google", logo: "/public/logos/gfg.avif" },
          { name: "Cure.fit", logo: "/public/logos/cf.png" }
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
        image: "https://media.licdn.com/dms/image/D4D03AQFJwKQwQwQwQw/profile-displayphoto-shrink_400_400/0/1660000000000?e=1700000000&v=beta&t=xxxx",
        role: "Engineer Manager at Google",
        companies: [
          { name: "Google", logo: "/public/logos/gfg.avif" }
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
        image: "https://media.licdn.com/dms/image/D4D03AQFJwKQwQwQwQw/profile-displayphoto-shrink_400_400/0/1660000000000?e=1700000000&v=beta&t=xxxx",
        role: "Data Engineer, YouTuber, Public Speaker",
        companies: [
          { name: "Microsoft", logo: "/public/logos/ms.png" }
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
        image: "https://media.licdn.com/dms/image/D4D03AQFJwKQwQwQwQw/profile-displayphoto-shrink_400_400/0/1660000000000?e=1700000000&v=beta&t=xxxx",
        role: "Architect/SCS at Adobe",
        companies: [
          { name: "Adobe", logo: "/public/logos/cs.png" }
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
        image: "https://media.licdn.com/dms/image/D4D03AQFJwKQwQwQwQw/profile-displayphoto-shrink_400_400/0/1660000000000?e=1700000000&v=beta&t=xxxx",
        role: "Founder-LinuxSocials",
        companies: [
          { name: "Linux", logo: "/public/logos/linux.png" }
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
        image: "https://media.licdn.com/dms/image/D4D03AQFJwKQwQwQwQw/profile-displayphoto-shrink_400_400/0/1660000000000?e=1700000000&v=beta&t=xxxx",
        role: "Founder- Crewsphere",
        companies: [
          { name: "Crewsphere", logo: "/public/logos/cs.png" }
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
        image: "https://media.licdn.com/dms/image/D4D03AQFJwKQwQwQwQw/profile-displayphoto-shrink_400_400/0/1660000000000?e=1700000000&v=beta&t=xxxx",
        role: "CTO - Microsoft Startup",
        companies: [
          { name: "Microsoft", logo: "/public/logos/ms.png" }
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
        image: "https://media.licdn.com/dms/image/D4D03AQFJwKQwQwQwQw/profile-displayphoto-shrink_400_400/0/1660000000000?e=1700000000&v=beta&t=xxxx",
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
        image: "https://media.licdn.com/dms/image/D4D03AQFJwKQwQwQwQw/profile-displayphoto-shrink_400_400/0/1660000000000?e=1700000000&v=beta&t=xxxx",
        role: "Founder, CEO of GFG",
        companies: [
          { name: "GeeksforGeeks", logo: "/public/logos/gfg.avif" }
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
        image: "https://media.licdn.com/dms/image/D4D03AQFJwKQwQwQwQw/profile-displayphoto-shrink_400_400/0/1660000000000?e=1700000000&v=beta&t=xxxx",
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
        image: "https://media.licdn.com/dms/image/D4D03AQFJwKQwQwQwQw/profile-displayphoto-shrink_400_400/0/1660000000000?e=1700000000&v=beta&t=xxxx",
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
        image: "https://media.licdn.com/dms/image/D4D03AQFJwKQwQwQwQw/profile-displayphoto-shrink_400_400/0/1660000000000?e=1700000000&v=beta&t=xxxx",
        role: "Founder Enso Life- NeuroArt",
        companies: [
          { name: "Enso Life", logo: "/public/logos/na.png" }
        ],
        linkedin: "https://www.linkedin.com/in/dr-deeksha-sharma/",
        highlights: [
          "Raises awareness about mental well-being in tech.",
          "Provides resources and support for stress management."
        ]
      },
      {
        name: "Nishant Chahar",
        image: "https://media.licdn.com/dms/image/D4D03AQFJwKQwQwQwQw/profile-displayphoto-shrink_400_400/0/1660000000000?e=1700000000&v=beta&t=xxxx",
        role: "Founder of Tayyari, Ex- Microsoft",
        companies: [
          { name: "YouTube", logo: "/public/logos/yt.png" }
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
        image: "https://media.licdn.com/dms/image/D4D03AQFJwKQwQwQwQw/profile-displayphoto-shrink_400_400/0/1660000000000?e=1700000000&v=beta&t=xxxx",
        role: "Head, Director DevRel next",
        companies: [
          { name: "Linux", logo: "/public/logos/linux.png" }
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
      <div className="bg-card tech-border rounded-xl overflow-hidden transition-shadow duration-300 hover:tech-glow hover:shadow-xl hover:ring-2 hover:ring-primary/40 group-hover:border-primary/40 flex flex-col md:w-[340px] w-full mx-auto h-[480px]">
        {/* Image and Content Side by Side, Equal Height */}
        <div className="flex flex-col h-full">
          <div className="relative w-full h-[200px] flex-shrink-0">
            <img
              src={speaker.image}
              alt={speaker.name}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              style={{ height: '100%', objectFit: 'cover' }}
            />
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent transition-opacity duration-500 group-hover:opacity-80" />

            {/* LinkedIn Badge */}
            {speaker.linkedin && (
              <a href={speaker.linkedin} target="_blank" rel="noopener noreferrer" className="absolute top-4 right-4 w-10 h-10 bg-primary/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 group-hover:scale-110 group-hover:rotate-12">
                <img src="/public/logos/linkedin.png" alt="LinkedIn" className="w-5 h-5" />
              </a>
            )}

            {/* Shine effect on hover */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 translate-x-[-100%] group-hover:translate-x-[100%]"
              style={{ transition: "transform 0.7s ease-out, opacity 0.3s ease" }} />
          </div>
          {/* Content */}
          <div className="p-6 text-center flex-1 flex flex-col justify-start overflow-hidden">
            <h3 className="font-cinzel text-xl text-foreground mb-2 transition-colors duration-300 group-hover:text-primary font-bold">
              {speaker.name}
            </h3>
            <p className="text-base text-muted-foreground mb-3">
              {speaker.role}
            </p>
            {speaker.founder && (
              <p className="text-sm text-primary font-semibold mb-3">{speaker.founder}</p>
            )}
            {/* Company Logos */}
            {speaker.companies && (
              <div className="flex items-center justify-center gap-2 mb-3">
                {speaker.companies.map((company: any, idx: number) => (
                  <img key={company.name + idx} src={company.logo} alt={company.name} className="w-9 h-9 rounded-full border" />
                ))}
              </div>
            )}
            {/* Social Stats with Logo Icons */}
            {speaker.stats && (
              <div className="flex flex-col items-center gap-2 mb-3">
                {speaker.stats.map((stat: any, idx: number) => (
                  <div key={stat.label + idx} className="flex items-center gap-2">
                    {stat.label.includes('YouTube') ? (
                      <img src="/public/logos/yt.png" alt="YouTube" className="w-5 h-5" />
                    ) : (
                      <img src="/public/logos/linkedin.png" alt="LinkedIn" className="w-5 h-5" />
                    )}
                    <span className="text-sm text-foreground font-bold">{stat.value}</span>
                  </div>
                ))}
              </div>
            )}
            {/* Highlights */}
            {speaker.highlights && (
              <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1 text-left">
                {speaker.highlights.slice(0, 3).map((hl: string, idx: number) => (
                  <li key={hl + idx} className="truncate">{hl}</li>
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

        {/* Speaker Cards - Functional Slider, Arrow on Right, Mouse Drag, Animation */}
        <div className="w-full max-w-5xl mx-auto px-2 md:px-8 flex flex-row items-center justify-center relative" style={{ minHeight: '500px' }}>
          <div
            id="speakers-slider"
            data-index="0"
            className="flex gap-16 justify-center items-center py-2 transition-transform duration-500 ease-in-out"
            style={{ minHeight: '500px', cursor: 'grab', userSelect: 'none' }}
            onMouseDown={e => {
              const slider = e.currentTarget;
              let startX = e.pageX;
              let scrollStart = Number(slider.getAttribute('data-index')) || 0;
              let dragging = true;
              slider.style.cursor = 'grabbing';
              let direction = 0;
              const onMove = (ev: MouseEvent) => {
                if (!dragging) return;
                const dx = ev.pageX - startX;
                if (Math.abs(dx) > 80) {
                  direction = dx < 0 ? 1 : -1;
                  slider.style.transform = `translateX(${direction > 0 ? '-400px' : '400px'})`;
                  dragging = false;
                  window.removeEventListener('mousemove', onMove);
                  window.removeEventListener('mouseup', onUp);
                  setTimeout(() => {
                    let current = scrollStart;
                    if (direction > 0) current = (current + 3) % currentSpeakers.length;
                    else current = (current - 3 + currentSpeakers.length) % currentSpeakers.length;
                    slider.setAttribute('data-index', String(current));
                    slider.style.transform = 'translateX(0)';
                  }, 400);
                }
              };
              const onUp = () => {
                dragging = false;
                slider.style.cursor = 'grab';
                window.removeEventListener('mousemove', onMove);
                window.removeEventListener('mouseup', onUp);
              };
              window.addEventListener('mousemove', onMove);
              window.addEventListener('mouseup', onUp);
            }}
          >
            {currentSpeakers.slice(0, 3).map((speaker, index) => (
              <div className="speaker-card" key={speaker.name + activeSeason} style={{ width: '340px', minWidth: '340px', maxWidth: '340px', height: '480px', display: 'flex', alignItems: 'stretch' }}>
                <SpeakerCard speaker={speaker} index={index} isVisible={isVisible} />
              </div>
            ))}
          </div>
          {currentSpeakers.length > 3 && (
            <button
              className="absolute right-[-60px] top-1/2 -translate-y-1/2 bg-orange-500 rounded-full p-4 shadow-lg hover:bg-orange-600 transition z-10 border-2 border-primary"
              aria-label="Next"
              onClick={() => {
                const container = document.getElementById('speakers-slider');
                if (!container) return;
                let current = Number(container.getAttribute('data-index')) || 0;
                current = (current + 3) % currentSpeakers.length;
                container.setAttribute('data-index', String(current));
                container.style.transform = 'translateX(-60px)';
                setTimeout(() => {
                  container.style.transform = 'translateX(0)';
                }, 400);
              }}
            >
              <svg width="36" height="36" fill="none" stroke="white" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" /></svg>
            </button>
          )}
        </div>

      </div>
    </section>
  );
};

export default SpeakersSection;
