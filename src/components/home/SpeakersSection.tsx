import { Sparkles, Star } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const speakers = [
  {
    name: "MOHAMMAD FRAZ",
    image: "https://media.licdn.com/dms/image/D4D03AQFJwKQwQwQwQw/profile-displayphoto-shrink_400_400/0/1660000000000?e=1700000000&v=beta&t=xxxx", // Replace with actual image URL
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
    name: "Keerti Purshwani",
    image: "https://media.licdn.com/dms/image/D4D03AQFJwKQwQwQwQw/profile-displayphoto-shrink_400_400/0/1660000000000?e=1700000000&v=beta&t=xxxx", // Replace with actual image URL
    role: "Speaker",
    linkedin: "https://www.linkedin.com/in/keertipurswani/"
  },
  {
    name: "Nancy Solanki",
    image: "https://media.licdn.com/dms/image/D4D03AQFJwKQwQwQwQw/profile-displayphoto-shrink_400_400/0/1660000000000?e=1700000000&v=beta&t=xxxx", // Replace with actual image URL
    role: "Speaker",
    linkedin: "https://www.linkedin.com/in/nancy-solanki/?originalSubdomain=in"
  },
  {
    name: "Prashant Kumar",
    image: "https://media.licdn.com/dms/image/D4D03AQFJwKQwQwQwQw/profile-displayphoto-shrink_400_400/0/1660000000000?e=1700000000&v=beta&t=xxxx", // Replace with actual image URL
    role: "Speaker",
    linkedin: "https://www.linkedin.com/in/prashanth-kumar-3ab702a/?originalSubdomain=in"
  },
  {
    name: "Vanshika Pandey",
    image: "https://media.licdn.com/dms/image/D4D03AQFJwKQwQwQwQw/profile-displayphoto-shrink_400_400/0/1660000000000?e=1700000000&v=beta&t=xxxx", // Replace with actual image URL
    role: "Speaker",
    linkedin: "https://www.linkedin.com/in/vanshikapandeyy/"
  },
  {
    name: "Mahima Hans",
    image: "https://media.licdn.com/dms/image/D4D03AQFJwKQwQwQwQw/profile-displayphoto-shrink_400_400/0/1660000000000?e=1700000000&v=beta&t=xxxx", // Replace with actual image URL
    role: "Speaker",
    linkedin: "https://www.linkedin.com/in/mahimahans/?originalSubdomain=in"
  }
];

const SpeakerCard = ({ speaker, index, isVisible }: { speaker: any; index: number; isVisible: boolean }) => {
  return (
    <div
      className={`group relative transition-all duration-700 ease-out ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}
      style={{ transitionDelay: `${300 + index * 200}ms` }}
    >
      <div className="bg-card tech-border rounded-xl overflow-hidden transition-shadow duration-300 hover:tech-glow hover:shadow-xl hover:ring-2 hover:ring-primary/40 group-hover:border-primary/40 flex flex-col md:w-[320px] w-full mx-auto" style={{ minHeight: '420px', maxWidth: '340px' }}>
        {/* Image and Content Side by Side, Equal Height */}
        <div className="flex flex-col h-full">
          <div className="relative w-full h-[180px] flex-shrink-0">
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
          <div className="p-5 text-center flex-1 flex flex-col justify-center" style={{ minHeight: '180px' }}>
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
            <p className="text-sm text-muted-foreground mb-2">
              {speaker.role}
            </p>
            {speaker.founder && (
              <p className="text-xs text-primary font-semibold mb-2">{speaker.founder}</p>
            )}
            {/* Company Logos */}
            {speaker.companies && (
              <div className="flex items-center justify-center gap-2 mb-2">
                {speaker.companies.map((company: any, idx: number) => (
                  <img key={company.name + idx} src={company.logo} alt={company.name} className="w-8 h-8 rounded-full border" />
                ))}
              </div>
            )}
            {/* Social Stats */}
            {speaker.stats && (
              <div className="flex flex-col items-center gap-1 mb-2">
                {speaker.stats.map((stat: any, idx: number) => (
                  <span key={stat.label + idx} className="text-xs text-muted-foreground font-medium">
                    <span className="font-bold text-primary mr-1">{stat.value}</span>{stat.label}
                  </span>
                ))}
              </div>
            )}
            {/* Highlights */}
            {speaker.highlights && (
              <ul className="text-xs text-muted-foreground list-disc list-inside mb-2">
                {speaker.highlights.map((hl: string, idx: number) => (
                  <li key={hl + idx}>{hl}</li>
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

        {/* Speaker Cards - Functional Slider, Arrow on Right, Mouse Drag, Animation */}
        <div className="w-full max-w-5xl mx-auto px-2 md:px-8 flex flex-row items-center justify-center relative" style={{ minHeight: '440px' }}>
          <div
            id="speakers-slider"
            data-index="0"
            className="flex gap-16 justify-center items-center py-2 transition-transform duration-500 ease-in-out"
            style={{ minHeight: '440px', cursor: 'grab', userSelect: 'none' }}
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
                    if (direction > 0) current = (current + 3) % speakers.length;
                    else current = (current - 3 + speakers.length) % speakers.length;
                    slider.setAttribute('data-index', String(current));
                    slider.style.transform = 'translateX(0)';
                    // Replace cards
                    const cards = slider.querySelectorAll('.speaker-card');
                    cards.forEach((card, i) => {
                      const idx = (current + i) % speakers.length;
                      const speaker = speakers[idx];
                      card.querySelector('h3').textContent = speaker.name;
                      card.querySelector('img').src = speaker.image;
                      card.querySelector('img').alt = speaker.name;
                      card.querySelector('p').textContent = speaker.role;
                    });
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
            {speakers.slice(0, 3).map((speaker, index) => (
              <div className="speaker-card" key={speaker.name} style={{ width: '340px', minWidth: '340px', maxWidth: '340px', height: '440px', display: 'flex', alignItems: 'stretch' }}>
                <SpeakerCard speaker={speaker} index={index} isVisible={isVisible} />
              </div>
            ))}
          </div>
          <button
            className="absolute right-[-60px] top-1/2 -translate-y-1/2 bg-orange-500 rounded-full p-4 shadow-lg hover:bg-orange-600 transition z-10 border-2 border-primary"
            aria-label="Next"
            onClick={() => {
              const container = document.getElementById('speakers-slider');
              if (!container) return;
              let current = Number(container.getAttribute('data-index')) || 0;
              current = (current + 3) % speakers.length;
              container.setAttribute('data-index', String(current));
              container.style.transform = 'translateX(-60px)';
              setTimeout(() => {
                container.style.transform = 'translateX(0)';
              }, 400);
              // Replace cards
              const cards = container.querySelectorAll('.speaker-card');
              cards.forEach((card, i) => {
                const idx = (current + i) % speakers.length;
                const speaker = speakers[idx];
                card.querySelector('h3').textContent = speaker.name;
                card.querySelector('img').src = speaker.image;
                card.querySelector('img').alt = speaker.name;
                card.querySelector('p').textContent = speaker.role;
              });
            }}
          >
            <svg width="36" height="36" fill="none" stroke="white" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" /></svg>
          </button>
        </div>
      </div>
    </section>
  );
};

export default SpeakersSection;
