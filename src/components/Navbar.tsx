import { Button } from "@/components/ui/button";
import { SignedIn, SignedOut, UserButton, useUser } from "@clerk/clerk-react";
import { Crown, Settings, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";

// Admin emails that can access admin panel
const ADMIN_EMAILS = ["someshranjanbiswal13678@gmail.com", "biswalranjansomesh@gmail.com"];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [rotationDegree, setRotationDegree] = useState(0);
  const location = useLocation();
  const { user } = useUser();

  const isAdmin =
    user?.primaryEmailAddress?.emailAddress &&
    ADMIN_EMAILS.includes(user.primaryEmailAddress.emailAddress);

  const navLinks = [
    { path: "/", label: "Home" },
    { path: "/register", label: "Register Now" },
    { path: "/activity", label: "Activity" },
    { path: "/contact", label: "Contact" },
    { path: "/gallery", label: "Gallery", shortcut: true },
    { path: "/story", label: "Story Mode", shortcut: true, storyOnly: true },
  ];

  const isActive = (path: string) => location.pathname === path;

  const handleMenuToggle = () => {
    setIsOpen(!isOpen);
    // Rotate 180 degrees alternating clockwise and anticlockwise
    setRotationDegree((prev) => prev + (isOpen ? -180 : 180));
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 bg-background/90 backdrop-blur-md border-b border-border/50 shadow-sm transition-all duration-300">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo - Left */}
          <Link to="/" className="flex items-center gap-2 group flex-shrink-0">
            <div className="relative">
              <Crown className="w-7 h-7 md:w-8 md:h-8 text-primary transition-all duration-300 group-hover:scale-110 group-hover:rotate-12" />
              <div className="absolute inset-0 bg-primary/20 blur-lg rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
            <span className="font-decorative text-lg md:text-2xl tech-text-gradient transition-all duration-300 group-hover:tracking-wider">
              TECH FLUENCE 6.0
            </span>
          </Link>

          {/* Desktop Navigation - Center */}
          <div className="hidden md:flex items-center justify-center absolute left-1/2 -translate-x-1/2">
            <div className="flex items-center gap-8">
              {navLinks.filter(link => !link.shortcut).map((link, index) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="relative group"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <span
                    className={`font-cinzel text-sm tracking-wider transition-all duration-300 group-hover:text-primary ${isActive(link.path)
                      ? "text-primary"
                      : "text-foreground/80"
                      }`}
                  >
                    {link.label}
                  </span>
                  {/* Animated underline */}
                  <span
                    className={`absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-primary via-primary/80 to-primary transition-all duration-300 ${isActive(link.path) ? "w-full" : "w-0 group-hover:w-full"
                      }`}
                  />
                  {/* Glow effect on hover */}
                  <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-primary/50 blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </Link>
              ))}
              {/* Shortcut buttons */}
              {navLinks.filter(link => link.shortcut && (!link.storyOnly || true)).map((link, index) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="relative group px-3 py-1.5 rounded bg-primary/10 border border-primary/30 text-primary font-cinzel text-xs tracking-wider hover:bg-primary/20 transition-all duration-200"
                  style={{ animationDelay: `${(navLinks.length + index) * 100}ms` }}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Auth Buttons & Theme Toggle - Desktop - Right */}
          <div className="hidden md:flex items-center gap-3 flex-shrink-0">
            <ThemeToggle />
            <SignedOut>
              <Link to="/auth">
                <Button
                  variant="ghost"
                  className="font-cinzel relative overflow-hidden group"
                >
                  <span className="relative z-10">Sign In</span>
                  <span className="absolute inset-0 bg-primary/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                </Button>
              </Link>
              <Link to="/auth">
                <Button className="font-cinzel bg-primary text-primary-foreground hover:bg-primary/90 relative overflow-hidden group shadow-md hover:shadow-lg hover:shadow-primary/25 transition-all duration-300">
                  <span className="relative z-10">Sign Up</span>
                  <span className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                </Button>
              </Link>
            </SignedOut>
            <SignedIn>
              {isAdmin && (
                <Link to="/admin">
                  <Button
                    variant="outline"
                    size="sm"
                    className={`font-cinzel gap-2 border-primary/50 hover:bg-primary/10 hover:border-primary transition-all duration-300 ${isActive("/admin") ? "bg-primary/10 border-primary" : ""
                      }`}
                  >
                    <ShieldCheck className="w-4 h-4" />
                    Admin
                  </Button>
                </Link>
              )}
              <UserButton
                afterSignOutUrl="/"
                appearance={{
                  elements: {
                    avatarBox: "w-10 h-10 border-2 border-primary shadow-md hover:shadow-lg hover:shadow-primary/25 transition-all duration-300"
                  }
                }}
              />
            </SignedIn>
          </div>

          {/* Mobile Right Side - Theme, User, Menu */}
          <div className="md:hidden flex items-center gap-2">
            <ThemeToggle />
            <SignedIn>
              <UserButton
                afterSignOutUrl="/"
                appearance={{
                  elements: {
                    avatarBox: "w-8 h-8 border-2 border-primary"
                  }
                }}
              />
            </SignedIn>
            <button
              className="p-2 text-foreground hover:text-primary transition-colors duration-300 relative"
              onClick={handleMenuToggle}
              aria-label="Toggle menu"
            >
              <Settings
                className="w-6 h-6 transition-transform duration-500 ease-in-out"
                style={{ transform: `rotate(${rotationDegree}deg)` }}
              />
              {/* Glow effect when open */}
              {isOpen && (
                <span className="absolute inset-0 bg-primary/20 blur-md rounded-full animate-pulse" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation - Animated Dropdown */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
            }`}
        >
          <div className="py-4 border-t border-border/50">
            <div className="flex flex-col gap-2">
              {navLinks.map((link, index) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => {
                    setIsOpen(false);
                    setRotationDegree((prev) => prev - 180);
                  }}
                  className={`font-cinzel text-sm tracking-wider py-3 px-4 rounded-lg transition-all duration-300 transform ${isOpen
                    ? "translate-x-0 opacity-100"
                    : "-translate-x-4 opacity-0"
                    } ${isActive(link.path)
                      ? "text-primary bg-primary/10 border-l-2 border-primary"
                      : "text-foreground/80 hover:text-primary hover:bg-primary/5"
                    }`}
                  style={{
                    transitionDelay: isOpen ? `${index * 75}ms` : "0ms",
                  }}
                >
                  {link.label}
                </Link>
              ))}

              {/* Admin Link - Mobile */}
              {isAdmin && (
                <Link
                  to="/admin"
                  onClick={() => {
                    setIsOpen(false);
                    setRotationDegree((prev) => prev - 180);
                  }}
                  className={`font-cinzel text-sm tracking-wider py-3 px-4 rounded-lg transition-all duration-300 transform flex items-center gap-2 ${isOpen
                    ? "translate-x-0 opacity-100"
                    : "-translate-x-4 opacity-0"
                    } ${isActive("/admin")
                      ? "text-primary bg-primary/10 border-l-2 border-primary"
                      : "text-foreground/80 hover:text-primary hover:bg-primary/5"
                    }`}
                  style={{
                    transitionDelay: isOpen ? `${navLinks.length * 75}ms` : "0ms",
                  }}
                >
                  <ShieldCheck className="w-4 h-4" />
                  Admin Panel
                </Link>
              )}

              {/* Mobile Auth Buttons */}
              <SignedOut>
                <div
                  className={`flex flex-col gap-2 pt-4 mt-2 border-t border-border/50 transition-all duration-300 transform ${isOpen
                    ? "translate-x-0 opacity-100"
                    : "-translate-x-4 opacity-0"
                    }`}
                  style={{
                    transitionDelay: isOpen ? `${navLinks.length * 75}ms` : "0ms",
                  }}
                >
                  <Link
                    to="/auth"
                    onClick={() => {
                      setIsOpen(false);
                      setRotationDegree((prev) => prev - 180);
                    }}
                  >
                    <Button
                      variant="ghost"
                      className="w-full font-cinzel justify-center"
                    >
                      Sign In
                    </Button>
                  </Link>
                  <Link
                    to="/auth"
                    onClick={() => {
                      setIsOpen(false);
                      setRotationDegree((prev) => prev - 180);
                    }}
                  >
                    <Button className="w-full font-cinzel justify-center bg-primary hover:bg-primary/90">
                      Sign Up
                    </Button>
                  </Link>
                </div>
              </SignedOut>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
