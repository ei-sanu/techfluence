import { Sparkles } from 'lucide-react';
import React from 'react';

// Curated images for marquee row 1 (Left to Right)
const marqueeRow1 = [
    '/eventimages/Img1.jpeg',
    '/eventimages/IMG_2034.JPG',
    '/eventimages/Img3.jpeg',
    '/eventimages/IMG_2161.JPG',
    '/eventimages/Img5.jpeg',
    '/eventimages/IMG_2229.JPG',
    '/eventimages/Img7.jpeg',
    '/eventimages/IMG_9765.JPG',
    '/eventimages/s3_1c.jpeg',
    '/eventimages/IMG_2207.JPG',
    '/eventimages/s3_3c.jpeg',
    '/eventimages/IMG_5401.JPG',
];

// Curated images for marquee row 2 (Right to Left)
const marqueeRow2 = [
    '/eventimages/Img2.jpeg',
    '/eventimages/IMG_2047.JPG',
    '/eventimages/Img4.jpeg',
    '/eventimages/IMG_2171.JPG',
    '/eventimages/Img6.jpeg',
    '/eventimages/IMG_2242.JPG',
    '/eventimages/2T8A3007.JPG',
    '/eventimages/IMG_9972.JPG',
    '/eventimages/s3_2c.jpeg',
    '/eventimages/IMG_2266.JPG',
    '/eventimages/s3_5c.jpeg',
    '/eventimages/IMG_5404.JPG',
];

// Stable past season images (Season 1, 2, 3)
const pastSeasonImages = [
    { src: '/sp1_1c.JPG', season: 1 },
    { src: '/s2.jpg', season: 2 },
    { src: '/s3_1c.jpeg', season: 3 }
];

const GlimpseSection: React.FC = () => {
    return (
        <section className="glimpse-section py-12 md:py-20 bg-gradient-to-b from-background via-background to-primary/5 relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl" />
            </div>

            <div className="relative z-10">
                {/* Section Header */}
                <div className="text-center mb-12">
                    <div className="flex items-center justify-center gap-2 mb-4">
                        <Sparkles className="w-6 h-6 text-amber-300" />
                        <h3 className="text-2xl md:text-4xl lg:text-5xl font-extrabold tracking-widest text-amber-300 leading-tight">
                            TECHFLUENCE
                        </h3>
                        <Sparkles className="w-6 h-6 text-amber-300" />
                    </div>
                    <h2 className="text-4xl md:text-6xl lg:text-7xl font-display font-black tech-text-gradient mb-4 leading-tight">
                        GLIMPSE
                    </h2>
                    <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto px-4">
                        Relive the unforgettable moments from our previous events
                    </p>
                </div>

                {/* Marquee Animations */}
                <div className="mb-16 space-y-6">
                    {/* Marquee Row 1 - Left to Right */}
                    <div className="relative overflow-hidden py-4">
                        <div className="flex gap-6 animate-marquee-left">
                            {[...marqueeRow1, ...marqueeRow1].map((src, index) => (
                                <div
                                    key={`row1-${index}`}
                                    className="flex-shrink-0 group relative"
                                >
                                    <div className="w-64 h-40 md:w-80 md:h-52 rounded-xl overflow-hidden tech-border transition-all duration-300 hover:tech-glow hover:scale-105 hover:shadow-2xl hover:shadow-primary/20">
                                        <img
                                            src={src}
                                            alt={`Event moment ${index + 1}`}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                            loading="lazy"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Marquee Row 2 - Right to Left */}
                    <div className="relative overflow-hidden py-4">
                        <div className="flex gap-6 animate-marquee-right">
                            {[...marqueeRow2, ...marqueeRow2].map((src, index) => (
                                <div
                                    key={`row2-${index}`}
                                    className="flex-shrink-0 group relative"
                                >
                                    <div className="w-64 h-40 md:w-80 md:h-52 rounded-xl overflow-hidden tech-border transition-all duration-300 hover:tech-glow hover:scale-105 hover:shadow-2xl hover:shadow-primary/20">
                                        <img
                                            src={src}
                                            alt={`Event moment ${index + 1}`}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                            loading="lazy"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Past seasons — stable cards */}
                <div className="container mx-auto px-4">
                    <h3 className="text-2xl md:text-3xl font-bold text-center mb-8 tech-text-gradient">
                        Past Seasons Highlights
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-8 max-w-5xl mx-auto mb-12">
                        {pastSeasonImages.map((item, i) => (
                            <div
                                key={`past-${i}`}
                                className="group relative bg-card tech-border rounded-xl overflow-hidden transition-all duration-300 hover:tech-glow hover:shadow-xl hover:shadow-primary/20"
                            >
                                <div className="aspect-video overflow-hidden">
                                    <img
                                        loading="lazy"
                                        src={item.src}
                                        alt={`Season ${item.season} highlights`}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                </div>
                                <div className="p-4 text-center bg-gradient-to-t from-card/95 to-card/80 backdrop-blur-sm">
                                    <p className="text-sm text-amber-400 font-semibold tracking-wider mb-1">PAST SEASON</p>
                                    <p className="text-lg font-bold text-foreground">Season {item.season}</p>
                                </div>
                                <div className="absolute inset-0 bg-gradient-to-t from-primary/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            </div>
                        ))}
                    </div>

                    {/* Gallery redirect button and caption */}
                    <div className="flex flex-col items-center">
                        <p className="text-base text-muted-foreground mb-4 text-center">
                            Want to see more moments? Explore the full event gallery!
                        </p>
                        <a
                            href="/gallery"
                            className="group inline-flex items-center gap-2 px-8 py-3 rounded-lg bg-gradient-to-r from-primary to-amber-500 text-white font-semibold shadow-lg hover:shadow-xl hover:shadow-primary/30 transition-all duration-300 hover:scale-105"
                        >
                            <span>View Gallery</span>
                            <svg
                                className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                        </a>
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes marquee-left {
                    0% {
                        transform: translateX(0);
                    }
                    100% {
                        transform: translateX(-50%);
                    }
                }

                @keyframes marquee-right {
                    0% {
                        transform: translateX(-50%);
                    }
                    100% {
                        transform: translateX(0);
                    }
                }

                .animate-marquee-left {
                    animation: marquee-left 40s linear infinite;
                    width: max-content;
                }

                .animate-marquee-right {
                    animation: marquee-right 40s linear infinite;
                    width: max-content;
                }

                .animate-marquee-left:hover,
                .animate-marquee-right:hover {
                    animation-play-state: paused;
                }
            `}</style>
        </section>
    );
};

export default GlimpseSection;
