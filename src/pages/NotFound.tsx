import { Button } from "@/components/ui/button";
import { Code, Home, Search, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();
  const [glitchText, setGlitchText] = useState("404");

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);

    const glitchChars = "404ERROR!@#$%^&*";
    let glitchInterval: NodeJS.Timeout;

    const startGlitch = () => {
      let iterations = 0;
      glitchInterval = setInterval(() => {
        setGlitchText((prev) => {
          if (iterations >= 6) {
            clearInterval(glitchInterval);
            return "404";
          }
          iterations++;
          return prev
            .split("")
            .map((char, index) => {
              if (Math.random() < 0.3) {
                return glitchChars[Math.floor(Math.random() * glitchChars.length)];
              }
              return char;
            })
            .join("");
        });
      }, 100);
    };

    const glitchTimeout = setInterval(startGlitch, 3000);

    return () => {
      clearInterval(glitchInterval);
      clearInterval(glitchTimeout);
    };
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-background">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-primary/5" />
      <div className="absolute top-20 left-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse delay-1000" />

      {/* Grid Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23f97316' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-2xl mx-auto px-4 text-center">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            <Code className="w-20 h-20 text-primary animate-pulse" />
            <Sparkles className="absolute -top-2 -right-2 w-6 h-6 text-primary animate-bounce" />
          </div>
        </div>

        {/* 404 Text with Glitch Effect */}
        <div className="mb-6">
          <h1 className="font-decorative text-9xl md:text-[12rem] tech-text-gradient mb-2 tracking-tight font-bold">
            {glitchText}
          </h1>
          <div className="h-1 w-32 mx-auto bg-gradient-to-r from-transparent via-primary to-transparent" />
        </div>

        {/* Error Message */}
        <div className="mb-8 space-y-3">
          <h2 className="font-cinzel text-2xl md:text-3xl font-bold text-foreground">
            Page Not Found
          </h2>
          <p className="text-muted-foreground text-lg max-w-md mx-auto">
            The page you're looking for seems to have disappeared into the digital void.
          </p>
          <p className="text-sm text-muted-foreground/70">
            Attempted path: <code className="px-2 py-1 bg-muted rounded text-primary">{location.pathname}</code>
          </p>
        </div>

        {/* Quick Links */}
        <div className="mb-8">
          <p className="text-sm text-muted-foreground mb-4">Try one of these instead:</p>
          <div className="flex flex-wrap gap-2 justify-center">
            {[
              { path: "/", label: "Home" },
              { path: "/register", label: "Register" },
              { path: "/activity", label: "Activity" },
              { path: "/contact", label: "Contact" },
              { path: "/gallery", label: "Gallery" },
            ].map((link) => (
              <Link key={link.path} to={link.path}>
                <Button
                  variant="outline"
                  size="sm"
                  className="font-cinzel border-border/50 hover:border-primary/50 hover:bg-primary/5"
                >
                  {link.label}
                </Button>
              </Link>
            ))}
          </div>
        </div>

        {/* Main Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link to="/">
            <Button className="gap-2 h-12 px-8 font-cinzel shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all group">
              <Home className="w-5 h-5 group-hover:scale-110 transition-transform" />
              Back to Home
            </Button>
          </Link>
          <Link to="/contact">
            <Button variant="outline" className="gap-2 h-12 px-8 font-cinzel group">
              <Search className="w-5 h-5 group-hover:rotate-12 transition-transform" />
              Report Issue
            </Button>
          </Link>
        </div>

        {/* Tech Quote */}
        <div className="mt-12 p-4 rounded-lg bg-card/50 border border-border/50 backdrop-blur-sm">
          <p className="text-sm text-muted-foreground italic">
            "The only thing we have to fear is a broken link... and 404 errors."
          </p>
          <p className="text-xs text-muted-foreground/70 mt-2">- TECH FLUENCE 6.0</p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
