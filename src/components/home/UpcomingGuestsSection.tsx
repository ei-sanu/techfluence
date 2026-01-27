import { Sparkles } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const upcomingGuests = [
    {
        name: "Mahima Hans",
        image: "/guestimages/mahimahans.png",
        role: "Software Engineer at Salesforce | Ex-Microsoft",
        companies: [
            { name: "Salesforce", logo: "/logos/salesforce.png" },
            { name: "Microsoft", logo: "/logos/microsoft.jpg" }
        ],
        stats: [
            { label: "LinkedIn", value: "308K+", platform: "linkedin" },
            { label: "Instagram", value: "52.5K+", platform: "instagram" }
        ],
        linkedin: "https://www.linkedin.com/in/mahimahans/",
        highlights: [
            "Technical Interview Coach & Public Speaker with 300K+ community",
            "6+ years of experience in software engineering"
        ]
    },
    {
        name: "Vanshika Pandey",
        image: "/guestimages/vanshikapandey.png",
        role: "SDE II | National Award Holding Creator",
        companies: [
            { name: "JP Morgan", logo: "/logos/jpmorgan.png" }
        ],
        stats: [
            { label: "Total Followers", value: "500K+", platform: "instagram" }
        ],
        linkedin: "https://www.linkedin.com/in/vanshikapandeyy/",
        highlights: [
            "Featured on Entrepreneurs of India & EatMyNews",
            "Top 25 Unstop Creator Awardee | GDSC Lead '21"
        ]
    },
    {
        name: "Abhishek Kumar",
        image: "/guestimages/abhishekkumar.png",
        role: "Engineering Manager at Walmart Global Tech India",
        companies: [
            { name: "Walmart", logo: "/logos/wallmart.jpg" },
            { name: "Google", logo: "/logos/gfg.avif" }
        ],
        stats: [
            { label: "Total Followers", value: "170K+", platform: "linkedin" }
        ],
        linkedin: "https://www.linkedin.com/in/abhishek0647/",
        highlights: [
            "$1B+ Revenue Impact | 11+ years experience",
            "Ex-Startup Founder | Stanford GSB – LEAD Business Program"
        ]
    },
    {
        name: "Radhakrishnan Ramasamy",
        image: "/guestimages/radhakrishnan.png",
        role: "Senior Engineering Manager – Walmart",
        companies: [
            { name: "Walmart", logo: "/logos/wallmart.jpg" },
            { name: "Amazon", logo: "/logos/amazon.jpg" }
        ],
        linkedin: "https://www.linkedin.com/in/radhakrishnan-ramasamy/",
        highlights: [
            "13+ years experience scaling products & platforms",
            "Ex-PayPal, Amazon, Caterpillar | AI & Leadership Learner"
        ]
    },
    {
        name: "Nancy Solanki",
        image: "/guestimages/nancysolanki.png",
        role: "Software Engineer at Microsoft",
        companies: [
            { name: "Microsoft", logo: "/logos/microsoft.jpg" },

        ],
        stats: [
            { label: "YouTube", value: "50K+", platform: "youtube" },
            { label: "Total Followers", value: "100K+", platform: "instagram" }
        ],
        linkedin: "https://www.linkedin.com/in/nancy-solanki/",
        highlights: [
            "Ex-Goldman Sachs | Speaker & Educator",
            "GHC Scholar | YouTube Creator"
        ]
    },
    {
        name: "Prasant Kumar",
        image: "/guestimages/prasantkumar.png",
        role: "Head of Commercial Digital – India & Asia, Volvo",
        companies: [
            { name: "Volvo", logo: "/logos/volvo.jpg" }
        ],
        linkedin: "https://www.linkedin.com/in/prashanth-kumar-3ab702a/",
        highlights: [
            "Built & Scaled Volvo Cars India Tech Hub | 25+ years experience",
            "Ex-GE, Ex-Monsanto | AI & GenAI-Driven Enterprise Value"
        ]
    }
];

const UpcomingGuestsSection = () => {
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

    const getSocialIcon = (platform: string) => {
        switch (platform) {
            case 'linkedin':
                return (
                    <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                );
            case 'instagram':
                return (
                    <svg className="w-5 h-5 text-pink-600" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                    </svg>
                );
            case 'youtube':
                return (
                    <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                    </svg>
                );
            default:
                return null;
        }
    };

    return (
        <section ref={sectionRef} className="py-20 md:py-32 relative bg-gradient-to-b from-background to-primary/5">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

            <div className="container mx-auto px-4">
                {/* Section Header */}
                <div className={`text-center mb-16 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
                    <div className="flex items-center justify-center gap-2 mb-4">
                        <Sparkles className="w-6 h-6 text-primary" />
                        <h2 className="font-decorative text-3xl md:text-5xl tech-text-gradient">
                            Upcoming Guests
                        </h2>
                        <Sparkles className="w-6 h-6 text-primary" />
                    </div>
                    <p className="font-cinzel text-muted-foreground tracking-wider">
                        Meet the Industry Leaders Joining TECH FLUENCE 6
                    </p>
                </div>

                {/* Guest Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {upcomingGuests.map((guest, index) => (
                        <div
                            key={guest.name}
                            className={`group relative transition-all duration-700 ease-out ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
                                }`}
                            style={{ transitionDelay: `${300 + index * 150}ms` }}
                        >
                            <div className="bg-card tech-border rounded-xl overflow-hidden transition-shadow duration-300 hover:tech-glow hover:shadow-xl hover:ring-2 hover:ring-primary/40 group-hover:border-primary/40 flex flex-col h-full">
                                <div className="flex flex-col h-full p-6">
                                    {/* Circular Image */}
                                    <div className="flex justify-center mb-4">
                                        <div className="relative">
                                            <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-primary/30 transition-all duration-300 group-hover:border-primary group-hover:shadow-lg group-hover:shadow-primary/30">
                                                <img
                                                    src={guest.image}
                                                    alt={guest.name}
                                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                                />
                                            </div>
                                            <div className="absolute -inset-1 bg-primary/20 rounded-full blur-md -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="text-center flex-1 flex flex-col">
                                        <h3 className="font-cinzel text-xl text-foreground mb-2 transition-colors duration-300 group-hover:text-primary font-bold">
                                            {guest.name}
                                        </h3>
                                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                                            {guest.role}
                                        </p>

                                        {/* Company Logos - Only show if logos exist */}
                                        {guest.companies && guest.companies.length > 0 && guest.companies.some(c => c.logo) && (
                                            <div className="flex items-center justify-center gap-2 mb-3">
                                                {guest.companies.filter(c => c.logo).map((company, idx) => (
                                                    <img
                                                        key={company.name + idx}
                                                        src={company.logo}
                                                        alt={company.name}
                                                        className="w-8 h-8 rounded-full border border-border object-contain"
                                                    />
                                                ))}
                                            </div>
                                        )}

                                        {/* Social Stats with Icons */}
                                        {guest.stats && (
                                            <div className="flex flex-col items-center gap-2 mb-3 bg-secondary/30 rounded-lg p-3">
                                                {guest.stats.map((stat, idx) => (
                                                    <div key={stat.label + idx} className="flex items-center gap-3 w-full justify-center">
                                                        {getSocialIcon(stat.platform)}
                                                        <span className="text-sm text-foreground font-bold">{stat.value}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        {/* Highlights - Now directly below social stats/company logos */}
                                        {guest.highlights && (
                                            <ul className="text-xs text-muted-foreground space-y-1.5 text-left bg-secondary/20 rounded-lg p-3">
                                                {guest.highlights.slice(0, 2).map((hl, idx) => (
                                                    <li key={hl + idx} className="line-clamp-2 flex items-start gap-2">
                                                        <span className="text-primary mt-0.5 flex-shrink-0">•</span>
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
                    ))}
                </div>
            </div>
        </section>
    );
};

export default UpcomingGuestsSection;
