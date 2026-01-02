import { Eye, Heart, Instagram, Sparkles } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const instagramReels = [
    { url: "https://www.instagram.com/reel/DIqVfUeRx7u/", views: "3.1K", likes: 37, title: "" },
    { url: "https://www.instagram.com/reel/DIggO5csP-p/", views: "4.2K", likes: 68, title: "" },
    { url: "https://www.instagram.com/reel/DIWVNXLgeHP/", views: "4.0K", likes: 55, title: "" },
    { url: "https://www.instagram.com/reel/DIOJ5tcuy7w/", views: "4.4K", likes: 81, title: "" },
    { url: "https://www.instagram.com/reel/DHp1eBfxRzs/", views: "6.8K", likes: 154, title: "Tech Fluence 4.0" },
    { url: "https://www.instagram.com/reel/DHYUDNWTc2O/", views: "2.6K", likes: 42, title: "" },
    { url: "https://www.instagram.com/reel/DHI2t9Ov2Jz/", views: "80.5K", likes: 1542, title: "" },
    { url: "https://www.instagram.com/reel/DG-duHPRw2E/", views: "6.7K", likes: 136, title: "" },
    { url: "https://www.instagram.com/reel/DG5TJdkzN9d/", views: "4.7K", likes: 125, title: "" },
    { url: "https://www.instagram.com/reel/DGkMDWtzrYI/", views: "20.6K", likes: 368, title: "" },
    { url: "https://www.instagram.com/reel/DGktb6dgdKo/", views: "23.1K", likes: 74, title: "" },
    { url: "https://www.instagram.com/reel/DCLyBZoJjhU/", views: "43.2K", likes: 252, title: "" },
    { url: "https://www.instagram.com/reel/DB_WE8YMVoV/", views: "34.6K", likes: 318, title: "" },
    { url: "https://www.instagram.com/reel/DBoK5FvoEat/", views: "42.7K", likes: 256, title: "" },
    { url: "https://www.instagram.com/reel/DBB1YJ0sxuW/", views: "19.6K", likes: 169, title: "Tech Fluence 3.0" },
    { url: "https://www.instagram.com/reel/DAp7fItssnR/", views: "32K", likes: 416, title: "" },
    { url: "https://www.instagram.com/reel/DAix_8jA-HP/", views: "181K", likes: 25800, title: "" },
    { url: "https://www.instagram.com/reel/DAQsPxcMUrz/", views: "97.4K", likes: 241, title: "" },
    { url: "https://www.instagram.com/reel/C_LekhLyLhE/", views: "73.6K", likes: 455, title: "" },
    { url: "https://www.instagram.com/reel/C2e_-6Qvo7b/", views: "", likes: 6851, title: "" },
    { url: "https://www.instagram.com/p/C2jHHuzv45f/", views: "", likes: 1429, title: "" },
    { url: "https://www.instagram.com/reel/C291MhjPFi5/", views: "", likes: 931, title: "Tech Fluence 2.0" },
    { url: "https://www.instagram.com/reel/C3HoI3JvFzC/", views: "", likes: 720, title: "" },
    { url: "https://www.instagram.com/reel/C3HvS0YNfxX/", views: "", likes: 495, title: "" }
];

const ReelCard = ({ reel }: { reel: any }) => {
    // Extract reel ID from URL for embed
    const getReelId = (url: string) => {
        const match = url.match(/reel\/([^/?]+)/);
        return match ? match[1] : null;
    };

    const reelId = getReelId(reel.url);

    return (
        <div className="flex-shrink-0 w-[280px] h-[400px]">
            <a
                href={reel.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block bg-card tech-border rounded-xl overflow-hidden transition-shadow duration-300 hover:tech-glow hover:shadow-xl hover:ring-2 hover:ring-primary/40 h-full group"
            >
                {/* Instagram Embed Preview */}
                <div className="relative h-[320px] overflow-hidden bg-gradient-to-br from-purple-900/20 via-pink-900/20 to-orange-900/20">
                    {reelId ? (
                        <iframe
                            src={`https://www.instagram.com/reel/${reelId}/embed`}
                            className="w-full h-full"
                            frameBorder="0"
                            scrolling="no"
                            allowTransparency={true}
                            style={{ pointerEvents: 'none' }}
                        />
                    ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <Instagram className="w-16 h-16 text-primary/40" />
                        </div>
                    )}

                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center p-4">
                        <div className="text-white text-center">
                            <p className="font-cinzel text-sm mb-2">View on Instagram</p>
                            <Instagram className="w-6 h-6 mx-auto" />
                        </div>
                    </div>
                </div>

                {/* Stats Section */}
                <div className="p-4 bg-card/50 backdrop-blur-sm h-[80px]">
                    {reel.title && (
                        <h4 className="font-cinzel text-sm text-foreground mb-2 font-semibold truncate">
                            {reel.title}
                        </h4>
                    )}
                    <div className="flex items-center justify-around gap-4">
                        {reel.views && (
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <Eye className="w-4 h-4 text-primary" />
                                <span className="text-xs font-medium">{reel.views}</span>
                            </div>
                        )}
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <Heart className="w-4 h-4 text-primary fill-primary" />
                            <span className="text-xs font-medium">{reel.likes.toLocaleString()}</span>
                        </div>
                    </div>
                </div>

                {/* Decorative corner */}
                <div className="absolute top-0 right-0 w-12 h-12 opacity-20 transition-opacity duration-300 group-hover:opacity-40">
                    <svg viewBox="0 0 64 64">
                        <path
                            d="M64 0 L48 0 Q32 0 32 16 L32 32 Q32 48 16 48 L0 48"
                            fill="none"
                            stroke="hsl(25, 95%, 55%)"
                            strokeWidth="2"
                        />
                    </svg>
                </div>
            </a>
        </div>
    );
};

const SocialActivitySection = () => {
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
        <section ref={sectionRef} className="py-12 md:py-16 relative bg-gradient-to-b from-background to-background/50 overflow-hidden" id="social-activity">
            {/* Subtle section divider glow */}
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

            <div className="container mx-auto px-4">
                {/* Section Header */}
                <div className={`text-center mb-8 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
                    <div className="flex items-center justify-center gap-2 mb-4">
                        <Instagram className="w-6 h-6 text-primary" />
                        <h2 className="font-decorative text-3xl md:text-5xl tech-text-gradient">
                            Social Activity
                        </h2>
                        <Instagram className="w-6 h-6 text-primary" />
                    </div>
                    <p className="font-cinzel text-muted-foreground tracking-wider">
                        Experience the Energy of TechFluence
                    </p>
                </div>
            </div>

            {/* Marquee Container */}
            <div className="relative">
                {/* Gradient Overlays for fade effect */}
                <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
                <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

                {/* Scrolling Reels */}
                <div className="flex gap-6 animate-marquee hover:pause-marquee">
                    {/* First set of reels */}
                    {instagramReels.map((reel, index) => (
                        <ReelCard key={`reel-1-${index}`} reel={reel} />
                    ))}
                    {/* Duplicate set for seamless loop */}
                    {instagramReels.map((reel, index) => (
                        <ReelCard key={`reel-2-${index}`} reel={reel} />
                    ))}
                </div>
            </div>

            {/* Follow CTA */}
            <div className={`text-center mt-8 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`} style={{ transitionDelay: "400ms" }}>
                <a
                    href="https://www.instagram.com/lpuuniversity"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 hover:from-purple-500 hover:via-pink-500 hover:to-orange-500 text-white rounded-lg font-cinzel shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300"
                >
                    <Instagram className="w-5 h-5" />
                    Follow Us on Instagram
                    <Sparkles className="w-5 h-5" />
                </a>
            </div>

            <style>{`
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        .animate-marquee {
          animation: marquee 60s linear infinite;
        }

        .pause-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>
        </section>
    );
};

export default SocialActivitySection;
