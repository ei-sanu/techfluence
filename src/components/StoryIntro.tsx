import { FastForward, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";

interface StoryIntroProps {
    onComplete: () => void;
}

// Human Figure SVG Component - Tech Leader/Scholar (Bose Sir)
const HumanFigure = ({
    className = "",
    animate = false,
    holdingScroll = false,
    speaking = false,
    size = "md"
}: {
    className?: string;
    animate?: boolean;
    holdingScroll?: boolean;
    speaking?: boolean;
    size?: "sm" | "md" | "lg";
}) => {
    const sizeClasses = {
        sm: "w-16 h-24",
        md: "w-24 h-36",
        lg: "w-32 h-48"
    };

    return (
        <svg
            viewBox="0 0 100 160"
            className={`${sizeClasses[size]} ${className} ${animate ? "animate-float-slow" : ""}`}
            style={{ filter: "drop-shadow(0 4px 20px rgba(0,0,0,0.5))" }}
        >
            {/* Head */}
            <ellipse cx="50" cy="22" rx="18" ry="20" fill="url(#skinGradient)" />

            {/* Face features */}
            <ellipse cx="42" cy="20" rx="3" ry="2" fill="#2d1f1a" /> {/* Left eye */}
            <ellipse cx="58" cy="20" rx="3" ry="2" fill="#2d1f1a" /> {/* Right eye */}
            <ellipse cx="50" cy="28" rx="2" ry="1.5" fill="#8b6b5a" /> {/* Nose */}

            {/* Mouth - speaking animation */}
            {speaking ? (
                <ellipse cx="50" cy="34" rx="5" ry="3" fill="#5a3d35" className="animate-pulse" />
            ) : (
                <path d="M45 33 Q50 37 55 33" stroke="#5a3d35" strokeWidth="1.5" fill="none" />
            )}

            {/* Hair/Turban */}
            <path
                d="M30 18 Q30 5 50 3 Q70 5 70 18 Q70 12 50 10 Q30 12 30 18"
                fill="url(#turbanGradient)"
            />
            <ellipse cx="50" cy="8" rx="12" ry="4" fill="url(#turbanGradient)" />

            {/* Crown/Headpiece */}
            <path
                d="M35 6 L40 -2 L45 4 L50 -4 L55 4 L60 -2 L65 6"
                stroke="url(#goldGradient)"
                strokeWidth="3"
                fill="none"
                strokeLinecap="round"
            />

            {/* Neck */}
            <rect x="44" y="40" width="12" height="8" fill="url(#skinGradient)" />

            {/* Body/Robe */}
            <path
                d="M30 48 Q25 50 20 150 L80 150 Q75 50 70 48 Q60 45 50 45 Q40 45 30 48"
                fill="url(#robeGradient)"
            />

            {/* Robe details - collar */}
            <path
                d="M35 48 Q50 55 65 48"
                stroke="url(#goldGradient)"
                strokeWidth="2"
                fill="none"
            />

            {/* Tech emblem on chest */}
            <circle cx="50" cy="70" r="8" fill="none" stroke="url(#goldGradient)" strokeWidth="1.5" />
            <path d="M46 70 L50 65 L54 70 L50 75 Z" fill="url(#goldGradient)" />

            {/* Arms */}
            {holdingScroll ? (
                <>
                    {/* Arms holding scroll */}
                    <path
                        d="M30 55 Q20 70 25 95 Q30 100 40 95"
                        fill="url(#robeGradient)"
                        stroke="url(#robeDarkGradient)"
                        strokeWidth="1"
                    />
                    <path
                        d="M70 55 Q80 70 75 95 Q70 100 60 95"
                        fill="url(#robeGradient)"
                        stroke="url(#robeDarkGradient)"
                        strokeWidth="1"
                    />
                    {/* Hands */}
                    <ellipse cx="40" cy="95" rx="6" ry="5" fill="url(#skinGradient)" />
                    <ellipse cx="60" cy="95" rx="6" ry="5" fill="url(#skinGradient)" />

                    {/* Scroll */}
                    <rect x="35" y="88" width="30" height="20" rx="3" fill="url(#scrollGradient)" />
                    <rect x="33" y="86" width="4" height="24" rx="2" fill="#8b7355" />
                    <rect x="63" y="86" width="4" height="24" rx="2" fill="#8b7355" />
                    <line x1="40" y1="93" x2="60" y2="93" stroke="#5a4535" strokeWidth="1" />
                    <line x1="40" y1="98" x2="55" y2="98" stroke="#5a4535" strokeWidth="1" />
                    <line x1="40" y1="103" x2="58" y2="103" stroke="#5a4535" strokeWidth="1" />
                </>
            ) : (
                <>
                    {/* Arms at rest */}
                    <path
                        d="M30 55 Q15 80 20 120"
                        fill="url(#robeGradient)"
                        stroke="url(#robeDarkGradient)"
                        strokeWidth="1"
                    />
                    <path
                        d="M70 55 Q85 80 80 120"
                        fill="url(#robeGradient)"
                        stroke="url(#robeDarkGradient)"
                        strokeWidth="1"
                    />
                    {/* Hands */}
                    <ellipse cx="20" cy="122" rx="5" ry="6" fill="url(#skinGradient)" />
                    <ellipse cx="80" cy="122" rx="5" ry="6" fill="url(#skinGradient)" />
                </>
            )}

            {/* Gradient definitions */}
            <defs>
                <linearGradient id="skinGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#d4a574" />
                    <stop offset="100%" stopColor="#b8956e" />
                </linearGradient>
                <linearGradient id="robeGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#8b2323" />
                    <stop offset="50%" stopColor="#6b1c1c" />
                    <stop offset="100%" stopColor="#4a1515" />
                </linearGradient>
                <linearGradient id="robeDarkGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#5a1818" />
                    <stop offset="100%" stopColor="#3a1010" />
                </linearGradient>
                <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#ffd700" />
                    <stop offset="50%" stopColor="#ffb347" />
                    <stop offset="100%" stopColor="#ffd700" />
                </linearGradient>
                <linearGradient id="turbanGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#2d2d2d" />
                    <stop offset="100%" stopColor="#1a1a1a" />
                </linearGradient>
                <linearGradient id="scrollGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#f5e6c8" />
                    <stop offset="100%" stopColor="#d4c4a8" />
                </linearGradient>
            </defs>
        </svg>
    );
};

// Student Figure SVG - Colored clothing for audience
const StudentFigure = ({
    className = "",
    color = "blue"
}: {
    className?: string;
    color?: "blue" | "green" | "purple" | "red";
}) => {
    const colors = {
        blue: { main: "#3b5998", dark: "#2d4373" },
        green: { main: "#4a7c59", dark: "#3a6149" },
        purple: { main: "#6b5b95", dark: "#574b7a" },
        red: { main: "#c0392b", dark: "#962d22" }
    };

    return (
        <svg viewBox="0 0 30 50" className={`w-4 h-6 md:w-6 md:h-9 ${className}`}>
            {/* Head */}
            <circle cx="15" cy="8" r="7" fill="#d4a574" />
            {/* Hair */}
            <ellipse cx="15" cy="5" rx="6" ry="4" fill="#2d2d2d" />
            {/* Body */}
            <path
                d="M8 15 Q5 20 5 50 L25 50 Q25 20 22 15 Q18 13 15 13 Q12 13 8 15"
                fill={colors[color].main}
            />
            {/* Collar */}
            <path d="M10 15 Q15 18 20 15" stroke="white" strokeWidth="1" fill="none" />
        </svg>
    );
};

// Speaker on Stage - Professional attire
const SpeakerFigure = ({ className = "" }: { className?: string }) => (
    <svg viewBox="0 0 60 100" className={`w-10 h-16 md:w-14 md:h-22 ${className}`}>
        {/* Head */}
        <circle cx="30" cy="15" r="12" fill="#d4a574" />
        {/* Hair */}
        <ellipse cx="30" cy="10" rx="10" ry="6" fill="#3d3d3d" />
        {/* Eyes */}
        <circle cx="26" cy="14" r="2" fill="#2d1f1a" />
        <circle cx="34" cy="14" r="2" fill="#2d1f1a" />
        {/* Smile */}
        <path d="M25 20 Q30 24 35 20" stroke="#5a3d35" strokeWidth="1.5" fill="none" />
        {/* Body - Formal attire */}
        <path
            d="M18 28 Q12 35 10 100 L50 100 Q48 35 42 28 Q36 25 30 25 Q24 25 18 28"
            fill="#1a1a2e"
        />
        {/* Tie */}
        <path d="M28 28 L30 45 L32 28" fill="#c0392b" />
        {/* Arms gesturing */}
        <path d="M18 35 Q5 50 15 65" fill="#1a1a2e" stroke="#0f0f1e" strokeWidth="1" />
        <path d="M42 35 Q55 50 45 65" fill="#1a1a2e" stroke="#0f0f1e" strokeWidth="1" />
        {/* Hands */}
        <circle cx="15" cy="67" r="4" fill="#d4a574" />
        <circle cx="45" cy="67" r="4" fill="#d4a574" />
    </svg>
);

const StoryIntro = ({ onComplete }: StoryIntroProps) => {
    const [currentScene, setCurrentScene] = useState(0);
    const [textVisible, setTextVisible] = useState(false);
    const [fadeOut, setFadeOut] = useState(false);
    const [speakerTalking, setSpeakerTalking] = useState(false);

    const scenes = [
        {
            id: 1,
            duration: 4000,
            title: "In the Halls of Innovation...",
            subtitle: "A legacy was born",
        },
        {
            id: 2,
            duration: 4000,
            title: "The Tech Proclamation",
            subtitle: "Bose Sir, Keeper of Knowledge",
        },
        {
            id: 3,
            duration: 4000,
            title: "The Grand Assembly",
            subtitle: "SDMA Auditorium, LPU",
        },
        {
            id: 4,
            duration: 3000,
            title: "TECH FLUENCE 6.0",
            subtitle: "The Legacy Continues...",
        },
    ];

    useEffect(() => {
        const textTimer = setTimeout(() => setTextVisible(true), 500);

        // Speaking animation toggle
        const speakInterval = setInterval(() => {
            setSpeakerTalking(prev => !prev);
        }, 500);

        let elapsed = 0;
        const timers: NodeJS.Timeout[] = [];

        scenes.forEach((scene, index) => {
            if (index > 0) {
                const timer = setTimeout(() => {
                    setTextVisible(false);
                    setTimeout(() => {
                        setCurrentScene(index);
                        setTextVisible(true);
                    }, 500);
                }, elapsed);
                timers.push(timer);
            }
            elapsed += scene.duration;
        });

        const completeTimer = setTimeout(() => {
            handleComplete();
        }, elapsed);
        timers.push(completeTimer);

        return () => {
            clearTimeout(textTimer);
            clearInterval(speakInterval);
            timers.forEach(clearTimeout);
        };
    }, []);

    const handleComplete = () => {
        setFadeOut(true);
        setTimeout(() => {
            onComplete();
        }, 800);
    };

    const handleSkip = () => {
        handleComplete();
    };

    const studentColors: Array<"blue" | "green" | "purple" | "red"> = ["blue", "green", "purple", "red"];

    return (
        <div
            className={`fixed inset-0 z-[100] transition-opacity duration-800 ${fadeOut ? "opacity-0" : "opacity-100"
                }`}
            style={{
                background: "linear-gradient(180deg, hsl(20, 12%, 6%) 0%, hsl(20, 10%, 10%) 100%)",
            }}
        >
            {/* Skip Button */}
            <Button
                onClick={handleSkip}
                variant="ghost"
                className="absolute top-6 right-6 z-50 font-cinzel text-primary/70 hover:text-primary hover:bg-primary/10 gap-2"
            >
                Skip Story
                <FastForward className="w-4 h-4" />
            </Button>

            {/* Progress Bar */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-secondary/30">
                <div
                    className="h-full bg-gradient-to-r from-primary/50 via-primary to-primary/50 transition-all duration-300"
                    style={{
                        width: `${((currentScene + 1) / scenes.length) * 100}%`,
                    }}
                />
            </div>

            {/* Scene Container */}
            <div className="relative w-full h-full overflow-hidden">
                {/* Scene 1: Castle Introduction with Guards */}
                {currentScene === 0 && (
                    <div className="absolute inset-0 flex items-center justify-center story-scene-enter">
                        {/* Castle Background */}
                        <div className="absolute inset-0">
                            <div
                                className="absolute inset-0 opacity-20"
                                style={{
                                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
                                }}
                            />
                            {/* Torch glow effects */}
                            <div className="absolute top-1/4 left-[15%] w-32 h-32 bg-orange-500/30 rounded-full blur-3xl animate-pulse" />
                            <div
                                className="absolute top-1/4 right-[15%] w-32 h-32 bg-orange-500/30 rounded-full blur-3xl animate-pulse"
                                style={{ animationDelay: "0.5s" }}
                            />
                            {/* Castle pillars */}
                            <div className="absolute left-8 md:left-16 top-0 bottom-0 w-16 md:w-24 bg-gradient-to-r from-stone-900 to-stone-800 opacity-60" />
                            <div className="absolute right-8 md:right-16 top-0 bottom-0 w-16 md:w-24 bg-gradient-to-l from-stone-900 to-stone-800 opacity-60" />
                        </div>

                        {/* Tech Guardians at pillars */}
                        <div className="absolute left-[12%] md:left-[15%] top-1/2 -translate-y-1/2 opacity-80">
                            <HumanFigure size="md" />
                        </div>
                        <div className="absolute right-[12%] md:right-[15%] top-1/2 -translate-y-1/2 opacity-80">
                            <HumanFigure size="md" />
                        </div>

                        {/* Central Focus */}
                        <div className="relative z-10 text-center px-4">
                            <div className="mb-8 flex justify-center">
                                <div className="relative">
                                    {/* Golden Crown */}
                                    <svg viewBox="0 0 100 60" className="w-24 h-14 md:w-32 md:h-20 animate-float-slow">
                                        <defs>
                                            <linearGradient id="crownGold" x1="0%" y1="0%" x2="100%" y2="100%">
                                                <stop offset="0%" stopColor="#ffd700" />
                                                <stop offset="50%" stopColor="#ffb347" />
                                                <stop offset="100%" stopColor="#ffd700" />
                                            </linearGradient>
                                        </defs>
                                        <path
                                            d="M10 55 L15 20 L30 35 L50 10 L70 35 L85 20 L90 55 Z"
                                            fill="url(#crownGold)"
                                            stroke="#b8860b"
                                            strokeWidth="2"
                                        />
                                        <circle cx="50" cy="18" r="5" fill="#ff0000" />
                                        <circle cx="30" cy="30" r="3" fill="#00ff00" />
                                        <circle cx="70" cy="30" r="3" fill="#0000ff" />
                                        <rect x="10" y="52" width="80" height="8" rx="2" fill="url(#crownGold)" />
                                    </svg>
                                    <Sparkles className="absolute -top-2 -right-4 w-8 h-8 text-primary/60 animate-sparkle" />
                                    <Sparkles
                                        className="absolute -bottom-2 -left-4 w-6 h-6 text-primary/40 animate-sparkle"
                                        style={{ animationDelay: "0.5s" }}
                                    />
                                </div>
                            </div>
                            <h1
                                className={`font-decorative text-3xl md:text-5xl lg:text-6xl tech-text-gradient mb-4 transition-all duration-1000 ${textVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                                    }`}
                            >
                                {scenes[0].title}
                            </h1>
                            <p
                                className={`font-cinzel text-lg md:text-xl text-muted-foreground tracking-widest transition-all duration-1000 ${textVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                                    }`}
                                style={{ transitionDelay: "300ms" }}
                            >
                                {scenes[0].subtitle}
                            </p>
                        </div>

                        {/* Floating particles */}
                        <div className="absolute inset-0 pointer-events-none overflow-hidden">
                            {Array.from({ length: 15 }).map((_, i) => (
                                <div
                                    key={i}
                                    className="absolute w-1 h-1 bg-primary/40 rounded-full animate-float"
                                    style={{
                                        left: `${10 + Math.random() * 80}%`,
                                        top: `${20 + Math.random() * 60}%`,
                                        animationDelay: `${Math.random() * 3}s`,
                                        animationDuration: `${3 + Math.random() * 2}s`,
                                    }}
                                />
                            ))}
                        </div>
                    </div>
                )}

                {/* Scene 2: Bose Sir with Scroll */}
                {currentScene === 1 && (
                    <div className="absolute inset-0 flex items-center justify-center story-scene-enter">
                        {/* Throne Room Background */}
                        <div className="absolute inset-0">
                            <div className="absolute inset-0 bg-gradient-to-b from-red-950/30 via-transparent to-transparent" />
                            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-48 bg-primary/10 rounded-t-full blur-3xl" />
                        </div>

                        {/* Bose Sir - Main Figure */}
                        <div className="relative z-10 flex flex-col items-center px-4">
                            <div className="relative mb-6 story-figure-appear">
                                <HumanFigure
                                    size="lg"
                                    animate
                                    holdingScroll
                                    speaking={speakerTalking}
                                />

                                {/* Glow behind figure */}
                                <div className="absolute -inset-8 bg-primary/10 rounded-full blur-2xl -z-10" />
                            </div>

                            {/* Podium */}
                            <div
                                className="w-40 md:w-56 h-6 bg-gradient-to-b from-stone-700 to-stone-900 rounded-t-lg mb-8"
                                style={{ boxShadow: "0 4px 20px rgba(0,0,0,0.5)" }}
                            />

                            {/* Text */}
                            <h2
                                className={`font-decorative text-2xl md:text-4xl lg:text-5xl tech-text-gradient mb-3 transition-all duration-1000 ${textVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                                    }`}
                            >
                                {scenes[1].title}
                            </h2>
                            <p
                                className={`font-cinzel text-base md:text-lg text-muted-foreground tracking-widest transition-all duration-1000 ${textVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                                    }`}
                                style={{ transitionDelay: "300ms" }}
                            >
                                {scenes[1].subtitle}
                            </p>

                            {/* Proclamation text */}
                            <div
                                className={`mt-6 max-w-md text-center transition-all duration-1000 ${textVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                                    }`}
                                style={{ transitionDelay: "500ms" }}
                            >
                                <p className="text-sm md:text-base text-primary/70 font-cinzel italic">
                                    "Hear ye, hear ye! Let it be known across all realms..."
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Scene 3: SDMA Auditorium with Students */}
                {currentScene === 2 && (
                    <div className="absolute inset-0 flex items-center justify-center story-scene-enter">
                        {/* Auditorium Background */}
                        <div className="absolute inset-0">
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-48 bg-gradient-to-b from-primary/20 via-primary/5 to-transparent" />
                            <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-blue-950/30 to-transparent" />
                        </div>

                        {/* Auditorium Structure */}
                        <div className="relative z-10 w-full max-w-4xl mx-auto px-4">
                            {/* Stage */}
                            <div className="relative mb-6">
                                <div className="relative mx-auto w-full max-w-2xl h-36 md:h-44 bg-gradient-to-b from-stone-800 to-stone-900 rounded-t-xl overflow-hidden">
                                    {/* Curtains */}
                                    <div className="absolute left-0 top-0 bottom-0 w-16 md:w-24 bg-gradient-to-r from-red-900 via-red-800 to-transparent animate-curtain-sway" />
                                    <div className="absolute right-0 top-0 bottom-0 w-16 md:w-24 bg-gradient-to-l from-red-900 via-red-800 to-transparent animate-curtain-sway" style={{ animationDelay: "0.5s" }} />

                                    {/* SDMA Banner */}
                                    <div className="absolute top-3 left-1/2 -translate-x-1/2 text-center">
                                        <div className="bg-primary/20 border border-primary/40 rounded-lg px-4 py-2">
                                            <p className="font-decorative text-xl md:text-2xl tech-text-gradient">SDMA</p>
                                            <p className="font-cinzel text-xs text-muted-foreground">Lovely Professional University</p>
                                        </div>
                                    </div>

                                    {/* Speakers on stage */}
                                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-8 md:gap-12">
                                        <SpeakerFigure className="opacity-80" />
                                        <SpeakerFigure className="scale-110" />
                                        <SpeakerFigure className="opacity-80" />
                                    </div>

                                    {/* Podium */}
                                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-14 h-10 md:w-18 md:h-12 bg-gradient-to-b from-amber-800 to-amber-950 rounded-t" />
                                </div>
                            </div>

                            {/* Audience Rows with Human Figures */}
                            <div className="relative space-y-2 md:space-y-3">
                                {[0, 1, 2, 3].map((row) => (
                                    <div
                                        key={row}
                                        className="flex justify-center gap-1 md:gap-2"
                                        style={{
                                            transform: `perspective(500px) rotateX(${8 - row * 2}deg)`,
                                        }}
                                    >
                                        {Array.from({ length: 10 + row * 3 }).map((_, seat) => (
                                            <StudentFigure
                                                key={seat}
                                                color={studentColors[(seat + row) % 4]}
                                                className={`transition-all duration-300 ${textVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
                                                    }`}
                                            />
                                        ))}
                                    </div>
                                ))}
                            </div>

                            {/* Text Overlay */}
                            <div className="text-center mt-6">
                                <h2
                                    className={`font-decorative text-2xl md:text-4xl lg:text-5xl tech-text-gradient mb-3 transition-all duration-1000 ${textVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                                        }`}
                                >
                                    {scenes[2].title}
                                </h2>
                                <p
                                    className={`font-cinzel text-base md:text-lg text-muted-foreground tracking-widest transition-all duration-1000 ${textVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                                        }`}
                                    style={{ transitionDelay: "300ms" }}
                                >
                                    {scenes[2].subtitle}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Scene 4: Final - Tech Fluence 6.0 Logo */}
                {currentScene === 3 && (
                    <div className="absolute inset-0 flex items-center justify-center story-scene-enter">
                        {/* Epic background */}
                        <div className="absolute inset-0">
                            <div
                                className="absolute inset-0 animate-pulse"
                                style={{
                                    background: "radial-gradient(circle at center, hsl(25, 95%, 55%, 0.15) 0%, transparent 50%)",
                                }}
                            />
                            {Array.from({ length: 3 }).map((_, ring) => (
                                <div
                                    key={ring}
                                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-primary/20"
                                    style={{
                                        width: `${200 + ring * 150}px`,
                                        height: `${200 + ring * 150}px`,
                                        animation: `pulse-glow ${2 + ring * 0.5}s ease-in-out infinite`,
                                        animationDelay: `${ring * 0.3}s`,
                                    }}
                                />
                            ))}
                        </div>

                        {/* Main Logo */}
                        <div className="relative z-10 text-center px-4">
                            <div className="mb-6 flex justify-center">
                                <div className="relative animate-float-slow">
                                    {/* Large Crown */}
                                    <svg viewBox="0 0 100 60" className="w-28 h-16 md:w-40 md:h-24">
                                        <defs>
                                            <linearGradient id="finalCrownGold" x1="0%" y1="0%" x2="100%" y2="100%">
                                                <stop offset="0%" stopColor="#ffd700" />
                                                <stop offset="50%" stopColor="#ffb347" />
                                                <stop offset="100%" stopColor="#ffd700" />
                                            </linearGradient>
                                        </defs>
                                        <path
                                            d="M10 55 L15 20 L30 35 L50 10 L70 35 L85 20 L90 55 Z"
                                            fill="url(#finalCrownGold)"
                                            stroke="#b8860b"
                                            strokeWidth="2"
                                        />
                                        <circle cx="50" cy="18" r="5" fill="#ff0000" />
                                        <circle cx="30" cy="30" r="3" fill="#00ff00" />
                                        <circle cx="70" cy="30" r="3" fill="#0000ff" />
                                        <rect x="10" y="52" width="80" height="8" rx="2" fill="url(#finalCrownGold)" />
                                    </svg>
                                    <div className="absolute inset-0 bg-primary/30 blur-2xl rounded-full" />
                                </div>
                            </div>
                            <h1
                                className={`font-decorative text-4xl md:text-6xl lg:text-8xl tech-text-gradient mb-4 transition-all duration-1000 ${textVisible ? "opacity-100 scale-100" : "opacity-0 scale-90"
                                    }`}
                            >
                                {scenes[3].title}
                            </h1>
                            <p
                                className={`font-cinzel text-lg md:text-2xl text-muted-foreground tracking-widest transition-all duration-1000 ${textVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                                    }`}
                                style={{ transitionDelay: "500ms" }}
                            >
                                {scenes[3].subtitle}
                            </p>
                            <p
                                className={`font-cinzel text-sm md:text-base text-primary/80 mt-6 transition-all duration-1000 ${textVisible ? "opacity-100" : "opacity-0"
                                    }`}
                                style={{ transitionDelay: "700ms" }}
                            >
                                Innovation Meets Excellence
                            </p>
                        </div>

                        {/* Sparkle burst */}
                        <div className="absolute inset-0 pointer-events-none">
                            {Array.from({ length: 20 }).map((_, i) => (
                                <div
                                    key={i}
                                    className="absolute animate-sparkle"
                                    style={{
                                        left: `${20 + Math.random() * 60}%`,
                                        top: `${20 + Math.random() * 60}%`,
                                        animationDelay: `${Math.random() * 2}s`,
                                    }}
                                >
                                    <Sparkles className="w-4 h-4 text-primary/60" />
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Scene indicator dots */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3">
                {scenes.map((_, index) => (
                    <div
                        key={index}
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${index === currentScene
                            ? "bg-primary scale-125"
                            : index < currentScene
                                ? "bg-primary/50"
                                : "bg-secondary"
                            }`}
                    />
                ))}
            </div>

            {/* Decorative corners */}
            <div className="absolute top-4 left-4 w-12 h-12 border-t-2 border-l-2 border-primary/30 rounded-tl-lg" />
            <div className="absolute top-4 right-4 w-12 h-12 border-t-2 border-r-2 border-primary/30 rounded-tr-lg" />
            <div className="absolute bottom-4 left-4 w-12 h-12 border-b-2 border-l-2 border-primary/30 rounded-bl-lg" />
            <div className="absolute bottom-4 right-4 w-12 h-12 border-b-2 border-r-2 border-primary/30 rounded-br-lg" />
        </div>
    );
};

export default StoryIntro;
