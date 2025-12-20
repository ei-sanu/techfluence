import { useEffect, useRef, useState } from "react";
import { Scroll, ChevronDown } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "What is TechFluence?",
    answer: "TechFluence is a premier tech event that brings together students, founders, and industry experts. It's designed to inspire innovation, foster entrepreneurship, and provide real-world insights into the technology industry.",
  },
  {
    question: "Who can attend TechFluence?",
    answer: "TechFluence is open to students, professionals, entrepreneurs, and anyone passionate about technology and innovation. Whether you're just starting your journey or are an experienced professional, you'll find value in our sessions.",
  },
  {
    question: "What events are included?",
    answer: "TechFluence includes keynote sessions from industry leaders, panel discussions, networking opportunities, and a hackathon. Participants can choose to attend the main event, the hackathon, or both.",
  },
  {
    question: "How do I register for TechFluence?",
    answer: "Registration is simple! Click the 'Register Now' button, create an account or sign in, and fill out the registration form. Team registrations for the hackathon require all team member details.",
  },
  {
    question: "Is there a registration fee?",
    answer: "Please check our registration page for the most current pricing information. Early bird discounts and student rates may be available.",
  },
  {
    question: "Can I participate in both the event and hackathon?",
    answer: "Absolutely! When registering, you can select 'Both' as your participation option to gain access to the main TechFluence event and the hackathon.",
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
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/10 to-background" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className={`text-center mb-16 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
          <div className="flex items-center justify-center gap-3 mb-4">
            <Scroll className="w-8 h-8 text-primary" />
            <h2 className="font-decorative text-3xl md:text-5xl royal-text-gradient">
              Royal Decrees
            </h2>
            <Scroll className="w-8 h-8 text-primary transform scale-x-[-1]" />
          </div>
          <p className="font-cinzel text-muted-foreground tracking-wider">
            Frequently Asked Questions
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className={`max-w-3xl mx-auto transition-all duration-700 delay-200 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="parchment-bg royal-border rounded-xl px-6 border-none"
              >
                <AccordionTrigger className="font-cinzel text-left text-foreground hover:text-primary hover:no-underline py-5 [&[data-state=open]>svg]:rotate-180">
                  <span className="flex items-center gap-3">
                    <span className="text-primary font-decorative text-lg">Q.</span>
                    {faq.question}
                  </span>
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-5 pl-8 leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        {/* Decorative pins */}
        <div className="hidden md:block absolute top-32 left-1/4 w-4 h-4 bg-primary rounded-full shadow-lg" />
        <div className="hidden md:block absolute top-48 right-1/4 w-4 h-4 bg-primary rounded-full shadow-lg" />
      </div>
    </section>
  );
};

export default FAQSection;
