import { Crown, Mail, MapPin, Phone } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  const [isVisible, setIsVisible] = useState(false);
  const footerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (footerRef.current) {
      observer.observe(footerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <footer ref={footerRef} className="border-t border-primary/20 py-12 md:py-16 relative">
      {/* Subtle top glow line */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
          {/* Brand */}
          <div className={`md:col-span-2 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            <div className="flex items-center gap-2 mb-4 group">
              <Crown className="w-8 h-8 text-primary transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12" />
              <span className="font-decorative text-2xl royal-text-gradient">
                TECH FLUENCE 6.0
              </span>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-md">
              Innovation meets excellence. Join us for an immersive experience
              connecting students with tech visionaries and industry leaders.
            </p>
          </div>

          {/* Quick Links */}
          <div className={`transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`} style={{ transitionDelay: "150ms" }}>
            <h3 className="font-cinzel text-foreground mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-muted-foreground hover:text-primary transition-all duration-300 text-sm hover:translate-x-1 inline-block">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/register" className="text-muted-foreground hover:text-primary transition-all duration-300 text-sm hover:translate-x-1 inline-block">
                  Register
                </Link>
              </li>
              <li>
                <Link to="/activity" className="text-muted-foreground hover:text-primary transition-all duration-300 text-sm hover:translate-x-1 inline-block">
                  Activity
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className={`transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`} style={{ transitionDelay: "300ms" }}>
            <h3 className="font-cinzel text-foreground mb-4">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-muted-foreground text-sm">
                <Mail className="w-4 h-4 text-primary" />
                info@techfluence.com
              </li>
              <li className="flex items-center gap-2 text-muted-foreground text-sm">
                <Phone className="w-4 h-4 text-primary" />
                +1 (555) 123-4567
              </li>
              <li className="flex items-start gap-2 text-muted-foreground text-sm">
                <MapPin className="w-4 h-4 text-primary mt-0.5" />
                Tech Campus, Innovation Hub
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className={`mt-12 pt-6 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`} style={{ transitionDelay: "450ms" }}>
          <p className="text-muted-foreground text-sm">
            © 2025 TECH FLUENCE 6.0. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <span className="text-muted-foreground text-xs font-cinzel tracking-widest hover:text-primary transition-colors duration-300 cursor-default">
              Built with Excellence
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
