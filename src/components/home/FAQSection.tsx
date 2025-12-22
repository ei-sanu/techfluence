import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Scroll } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const faqs = [
  {
    question: "What is TECH FLUENCE 6.0?",
    answer: "TECH FLUENCE 6.0 is a premier tech event that brings together students, founders, and industry experts. It's designed to inspire innovation, foster entrepreneurship, and provide real-world insights into the technology industry.",
  },
  {
    question: "Who can attend TECH FLUENCE 6.0?",
    answer: "TECH FLUENCE 6.0 is open to students, professionals, entrepreneurs, and anyone passionate about technology and innovation. Whether you're just starting your journey or are an experienced professional, you'll find value in our sessions.",
  },
  {
    question: "What events are included?",
    answer: "TECH FLUENCE 6.0 includes keynote sessions from industry leaders, panel discussions, networking opportunities, and a hackathon. Participants can choose to attend the main event, the hackathon, or both.",
  },
  {
    question: "How do I register for TECH FLUENCE 6.0?",
    answer: "Registration is simple! Click the 'Register Now' button, create an account or sign in, and fill out the registration form. Team registrations for the hackathon require all team member details.",
  },
  {
    question: "Is there a registration fee?",
    answer: "Please check our registration page for the most current pricing information. Early bird discounts and student rates may be available.",
  },
  {
    question: "Can I participate in both the event and hackathon?",
    answer: "Absolutely! When registering, you can select 'Both' as your participation option to gain access to both the main event and the hackathon.",
  },
];

const FAQSection = () => {
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
    <section ref={sectionRef} className="py-20 md:py-32 relative" id="faq">
      {/* Subtle section divider glow */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className={`text-center mb-16 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
          <div className="flex items-center justify-center gap-3 mb-4">
            <Scroll className={`w-8 h-8 text-primary transition-all duration-700 ${isVisible ? "opacity-100 rotate-0" : "opacity-0 -rotate-45"}`} />
            <h2 className="font-decorative text-3xl md:text-5xl tech-text-gradient">
              FAQs
            </h2>
            <Scroll className={`w-8 h-8 text-primary transform scale-x-[-1] transition-all duration-700 ${isVisible ? "opacity-100 rotate-0" : "opacity-0 rotate-45"}`} />
          </div>
          <p className="font-cinzel text-muted-foreground tracking-wider">
            Frequently Asked Questions
          </p>
        </div>

        {/* FAQ Accordion with staggered animations */}
        <div className={`max-w-3xl mx-auto transition-all duration-700 delay-200 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className={`parchment-bg tech-border rounded-xl px-6 border-none transition-all duration-500 hover:tech-glow hover:scale-[1.02] ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"}`}
                style={{ transitionDelay: `${300 + index * 100}ms` }}
              >
                <AccordionTrigger className="font-cinzel text-left text-foreground hover:text-primary hover:no-underline py-5 [&[data-state=open]>svg]:rotate-180 transition-colors duration-300">
                  <span className="flex items-center gap-3">
                    <span className="text-primary font-decorative text-lg">Q.</span>
                    {faq.question}
                  </span>
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-5 pl-8 leading-relaxed animate-fade-in">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        {/* Decorative pins with animation */}
        <div className={`hidden md:block absolute top-32 left-1/4 w-4 h-4 bg-primary rounded-full shadow-lg transition-all duration-700 ${isVisible ? "opacity-100 scale-100" : "opacity-0 scale-0"}`} style={{ transitionDelay: "500ms" }} />
        <div className={`hidden md:block absolute top-48 right-1/4 w-4 h-4 bg-primary rounded-full shadow-lg transition-all duration-700 ${isVisible ? "opacity-100 scale-100" : "opacity-0 scale-0"}`} style={{ transitionDelay: "700ms" }} />
      </div>
    </section>
  );
};

export default FAQSection;
