import { InfiniteMovingCards } from "@/components/ui/infinite-moving-cards";
import { Crown, Users } from "lucide-react";
import { useEffect, useRef, useState } from "react";

// Royal-themed avatar URLs using DiceBear API with different styles
const getRoyalAvatar = (seed: string, index: number) => {
    // Alternate between different royal-themed avatar styles
    const styles = ["adventurer", "avataaars", "bottts", "personas", "lorelei"];
    const style = styles[index % styles.length];
    return `https://api.dicebear.com/7.x/${style}/svg?seed=${encodeURIComponent(seed)}&backgroundColor=f97316,fb923c,fdba74&radius=50`;
};

const communityMembers = [
    {
        name: "Deepanshu Pathak",
        title: "Student at Lovely Professional University",
        quote: "Highly consistent and disciplined with a strong academic mindset. A true scholar of the royal court!",
    },
    {
        name: "Kasireddy Prasan Kumar",
        title: "Student at Lovely Professional University",
        quote: "Demonstrates strong learning focus and technical curiosity. A rising knight in our tech kingdom!",
    },
    {
        name: "Praveen Rajana",
        title: "Aspiring AI/ML Engineer",
        quote: "Impressive dedication towards AI, DSA, and continuous improvement. The future belongs to such warriors!",
    },
    {
        name: "Prachi Kumari",
        title: "Student at Lovely Professional University",
        quote: "Shows clarity, consistency, and commitment towards growth. A noble example for all!",
    },
    {
        name: "Abir Mahanta",
        title: "Cyber Operations Analyst | Web Developer",
        quote: "Strong cybersecurity mindset with real world problem solving skills. Guardian of our digital realm!",
    },
    {
        name: "Ankit Raj",
        title: "Student Entrepreneur | Author",
        quote: "Entrepreneurial thinking combined with strong execution mindset. A merchant prince of innovation!",
    },
    {
        name: "Jayachandran Ayush",
        title: "Full Stack Developer",
        quote: "Versatile developer with hands on full stack experience. Master craftsman of the code guild!",
    },
    {
        name: "Ayush Dwivedi",
        title: "CSE Undergraduate | Web Developer",
        quote: "Focused learner with practical web development skills. An apprentice destined for greatness!",
    },
    {
        name: "Anmol Gautam",
        title: "Full Stack Developer",
        quote: "Demonstrates excellent balance between learning and building. Architect of digital castles!",
    },
    {
        name: "Hameem Baba",
        title: "Student at Lovely Professional University",
        quote: "Consistent learner with positive technical attitude. A loyal squire on the path to mastery!",
    },
    {
        name: "Akshpreet Singh",
        title: "Student at Lovely Professional University",
        quote: "Strong fundamentals and disciplined approach to learning. Foundation of a great warrior!",
    },
    {
        name: "Divansh Sharma",
        title: "MCA Student",
        quote: "Methodical thinker with growing technical expertise. Strategist of the royal council!",
    },
    {
        name: "Pratyay Das",
        title: "Computer Science Undergraduate | Web Developer",
        quote: "Clean development practices with analytical thinking. Scribe of elegant solutions!",
    },
    {
        name: "Parakh Tyagi",
        title: "Student at Lovely Professional University",
        quote: "Enthusiastic learner with steady growth mindset. Rising star of the kingdom!",
    },
    {
        name: "Vanshika Singh Jaryal",
        title: "B.Tech CSE Student",
        quote: "Clear goals with strong academic focus. A noble with vision and purpose!",
    },
    {
        name: "Khushi Dwivedi",
        title: "Student at Lovely Professional University",
        quote: "Consistent efforts and strong learning discipline. Dedication worthy of the crown!",
    },
    {
        name: "Sanket Singh",
        title: "Student at Lovely Professional University",
        quote: "Demonstrates steady improvement and dedication. A knight in training!",
    },
    {
        name: "Vikas Rundla",
        title: "Student at Lovely Professional University",
        quote: "Focused academic approach with growing technical skills. Scholar of the royal academy!",
    },
    {
        name: "Vinayak Tiwari",
        title: "Attended Lovely Professional University",
        quote: "Shows maturity and strong foundational understanding. Wisdom beyond years!",
    },
    {
        name: "Piyush Rana",
        title: "Aspiring Full Stack Web Developer",
        quote: "Excellent grasp of full stack technologies and problem solving. Builder of digital empires!",
    },
    {
        name: "Sarthak Prakash",
        title: "AI & Cyber Law Enthusiast",
        quote: "Unique blend of law, AI, and cybersecurity interests. The royal judge of tech ethics!",
    },
    {
        name: "Harsh Raj",
        title: "Aspiring Software Engineer | Hackathon Winner",
        quote: "Exceptional consistency with competitive programming skills. Champion of code battles!",
    },
    {
        name: "Pavan Kumar Nedimineni",
        title: "DevSecOps Engineer",
        quote: "Strong automation and cloud security expertise. Guardian of the kingdom's infrastructure!",
    },
    {
        name: "Rishu Mahatha",
        title: "Full Stack Developer | MERN",
        quote: "Modern UI mindset with scalable development skills. Artisan of beautiful interfaces!",
    },
    {
        name: "Kartik Kala",
        title: "MCA | Full Stack Developer",
        quote: "Shows clarity, focus, and technical versatility. Renaissance mind of our era!",
    },
    {
        name: "Balaji Tummala",
        title: "Python & DSA Learner",
        quote: "Logic driven approach with scalable thinking. Mathematician of the royal court!",
    },
    {
        name: "Sneha Mishra",
        title: "Student at Lovely Professional University",
        quote: "Strong academic focus with disciplined learning. A noble scholar indeed!",
    },
    {
        name: "Paras Patil",
        title: "Software Engineer",
        quote: "Problem solver with practical engineering mindset. Engineer of solutions!",
    },
];

// Add avatars to members
const membersWithAvatars = communityMembers.map((member, index) => ({
    ...member,
    avatar: getRoyalAvatar(member.name, index),
}));

const CommunityVoicesSection = () => {
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
        <section
            ref={sectionRef}
            className="py-20 md:py-32 relative overflow-hidden"
            id="community"
        >
            {/* Subtle section divider glow */}
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

            <div className="container mx-auto px-4 relative z-10">
                {/* Section Header */}
                <div
                    className={`text-center mb-12 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                        }`}
                >
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <Users
                            className={`w-8 h-8 text-primary transition-all duration-700 ${isVisible ? "opacity-100 rotate-0" : "opacity-0 -rotate-45"
                                }`}
                        />
                        <h2 className="font-decorative text-3xl md:text-5xl royal-text-gradient">
                            Voice of Our Attendees
                        </h2>
                        <Crown
                            className={`w-8 h-8 text-primary transition-all duration-700 ${isVisible ? "opacity-100 rotate-0" : "opacity-0 rotate-45"
                                }`}
                        />
                    </div>
                    <p className="font-sans text-muted-foreground tracking-wider max-w-2xl mx-auto">
                        Trusted by scholars, warriors, and innovators across the kingdom
                    </p>
                </div>

                {/* Infinite Moving Cards */}
                <div
                    className={`transition-all duration-700 delay-200 ${isVisible ? "opacity-100" : "opacity-0"
                        }`}
                >
                    <InfiniteMovingCards
                        items={membersWithAvatars.slice(0, 14)}
                        direction="left"
                        speed="slow"
                        pauseOnHover={true}
                    />
                </div>

                {/* Second row moving in opposite direction */}
                <div
                    className={`mt-4 transition-all duration-700 delay-400 ${isVisible ? "opacity-100" : "opacity-0"
                        }`}
                >
                    <InfiniteMovingCards
                        items={membersWithAvatars.slice(14)}
                        direction="right"
                        speed="slow"
                        pauseOnHover={true}
                    />
                </div>

                {/* Decorative accent line */}
                <div
                    className={`mx-auto mt-12 h-1 bg-gradient-to-r from-transparent via-primary to-transparent transition-all duration-1000 delay-600 ${isVisible ? "w-24 opacity-100" : "w-0 opacity-0"
                        }`}
                />
            </div>
        </section>
    );
};

export default CommunityVoicesSection;
