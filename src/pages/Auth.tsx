import { Button } from "@/components/ui/button";
import { SignIn as ClerkSignIn, SignUp as ClerkSignUp } from "@clerk/clerk-react";
import {
    Calendar,
    CheckCircle,
    Code,
    Crown,
    Shield,
    Sparkles,
    Trophy,
    Users,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

const quotes = [
    "Where Innovation Meets Tradition",
    "Forge Your Legacy in Tech",
    "Join the Royal Court of Innovators",
    "Unlock Your Potential",
];

const accessFeatures = [
    {
        icon: Calendar,
        title: "Exclusive Event Access",
        description: "Get priority access to all TECH FLUENCE sessions and workshops",
    },
    {
        icon: Code,
        title: "Hackathon Participation",
        description: "Join our 24-hour hackathon with amazing prizes and mentorship",
    },
    {
        icon: Users,
        title: "Networking Opportunities",
        description: "Connect with industry leaders, founders, and fellow innovators",
    },
    {
        icon: Trophy,
        title: "Certificates & Recognition",
        description: "Earn certificates and recognition for your participation",
    },
    {
        icon: Shield,
        title: "Activity Dashboard",
        description: "Track your registrations and manage your event participation",
    },
];

const Auth = () => {
    const location = useLocation();
    const isSignUpRoute = location.pathname === "/sign-up";
    const [isSignUp, setIsSignUp] = useState(isSignUpRoute);
    const [currentQuote, setCurrentQuote] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);
    const [visibleFeatures, setVisibleFeatures] = useState<number[]>([]);

    // Rotate quotes
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentQuote((prev) => (prev + 1) % quotes.length);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    // Animate features on mount
    useEffect(() => {
        accessFeatures.forEach((_, index) => {
            setTimeout(() => {
                setVisibleFeatures((prev) => [...prev, index]);
            }, 200 + index * 150);
        });
    }, []);

    // Sync with route
    useEffect(() => {
        setIsSignUp(isSignUpRoute);
    }, [isSignUpRoute]);

    const handleToggle = () => {
        setIsAnimating(true);
        setTimeout(() => {
            setIsSignUp(!isSignUp);
            setIsAnimating(false);
        }, 300);
    };

    return (
        <div className="min-h-screen bg-background flex overflow-x-hidden">
            {/* Left Side - Branding & Features */}
            <div className="hidden lg:flex lg:w-1/2 xl:w-[55%] relative overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-primary/5" />
                <div className="absolute inset-0 opacity-5">
                    <div
                        className="absolute inset-0"
                        style={{
                            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23f97316' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                        }}
                    />
                </div>

                {/* Animated Glow Orbs */}
                <div className="absolute top-20 left-20 w-64 h-64 bg-primary/20 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-20 right-20 w-48 h-48 bg-primary/15 rounded-full blur-3xl animate-pulse delay-1000" />

                <div className="relative z-10 flex flex-col justify-center px-8 lg:px-12 xl:px-16 w-full py-8">
                    {/* Logo */}
                    <Link to="/" className="inline-flex items-center gap-4 mb-8 group">
                        <div className="relative">
                            <Crown className="w-16 h-16 text-primary transition-transform group-hover:scale-110" />
                            <Sparkles className="absolute -top-1 -right-1 w-5 h-5 text-primary animate-pulse" />
                        </div>
                        <div>
                            <span className="font-decorative text-4xl xl:text-5xl royal-text-gradient block">
                                TECH FLUENCE
                            </span>
                            <span className="text-primary font-bold text-2xl">6.0</span>
                        </div>
                    </Link>

                    {/* Animated Quote */}
                    <div className="mb-8 h-12">
                        <p
                            key={currentQuote}
                            className="text-xl xl:text-2xl font-sans font-light text-foreground/80 animate-fade-in"
                        >
                            {quotes[currentQuote]}
                        </p>
                    </div>

                    {/* Access Features */}
                    <div className="space-y-3">
                        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">
                            What you'll unlock
                        </h3>
                        {accessFeatures.map((feature, index) => (
                            <div
                                key={index}
                                className={`flex items-start gap-3 p-3 rounded-xl bg-card/50 border border-border/50 transition-all duration-500 ${visibleFeatures.includes(index)
                                    ? "opacity-100 translate-x-0"
                                    : "opacity-0 -translate-x-8"
                                    } hover:bg-card hover:border-primary/30 hover:shadow-lg`}
                            >
                                <div className="p-2 rounded-lg bg-primary/10 flex-shrink-0">
                                    <feature.icon className="w-4 h-4 text-primary" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <h4 className="font-semibold text-foreground text-sm">
                                        {feature.title}
                                    </h4>
                                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                                        {feature.description}
                                    </p>
                                </div>
                                <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Right Side - Auth Form */}
            <div className="w-full lg:w-1/2 xl:w-[45%] flex items-center justify-center p-4 sm:p-6 lg:p-8 overflow-y-auto">
                <div className="w-full max-w-sm sm:max-w-md">
                    {/* Mobile Logo */}
                    <div className="lg:hidden text-center mb-6">
                        <Link to="/" className="inline-flex flex-col items-center gap-1 mb-2">
                            <Crown className="w-12 h-12 text-primary" />
                            <div className="text-center">
                                <span className="font-decorative text-2xl sm:text-3xl royal-text-gradient block">
                                    TECH FLUENCE
                                </span>
                                <span className="text-primary font-bold text-lg">6.0</span>
                            </div>
                        </Link>
                    </div>

                    {/* Toggle Buttons */}
                    <div className="flex p-1 mb-6 bg-secondary/50 rounded-xl">
                        <button
                            onClick={() => !isSignUp || handleToggle()}
                            className={`flex-1 py-2.5 px-3 rounded-lg font-semibold text-sm transition-all duration-300 ${!isSignUp
                                ? "bg-primary text-primary-foreground shadow-lg"
                                : "text-muted-foreground hover:text-foreground"
                                }`}
                        >
                            Sign In
                        </button>
                        <button
                            onClick={() => isSignUp || handleToggle()}
                            className={`flex-1 py-2.5 px-3 rounded-lg font-semibold text-sm transition-all duration-300 ${isSignUp
                                ? "bg-primary text-primary-foreground shadow-lg"
                                : "text-muted-foreground hover:text-foreground"
                                }`}
                        >
                            Sign Up
                        </button>
                    </div>

                    {/* Form Header */}
                    <div className="text-center mb-4">
                        <h1 className="font-decorative text-xl sm:text-2xl text-foreground mb-1">
                            {isSignUp ? "Join the Kingdom" : "Welcome Back"}
                        </h1>
                        <p className="text-muted-foreground text-xs sm:text-sm">
                            {isSignUp
                                ? "Create your account to begin your journey"
                                : "Sign in to continue your journey"}
                        </p>
                    </div>

                    {/* Auth Form with Animation */}
                    <div
                        className={`parchment-bg royal-border rounded-xl p-3 sm:p-5 transition-all duration-300 overflow-hidden ${isAnimating
                            ? "opacity-0 scale-95 rotate-1"
                            : "opacity-100 scale-100 rotate-0"
                            }`}
                    >
                        {isSignUp ? (
                            <ClerkSignUp
                                afterSignUpUrl="/"
                                appearance={{
                                    elements: {
                                        rootBox: "w-full max-w-full overflow-hidden",
                                        card: "bg-transparent shadow-none p-0 w-full max-w-full",
                                        main: "w-full max-w-full",
                                        form: "w-full max-w-full",
                                        headerTitle: "hidden",
                                        headerSubtitle: "hidden",
                                        socialButtonsBlockButton:
                                            "border-border bg-background hover:bg-secondary text-foreground font-medium w-full",
                                        socialButtonsBlockButtonText: "text-foreground text-sm",
                                        socialButtonsProviderIcon: "w-4 h-4",
                                        dividerLine: "bg-border",
                                        dividerText: "text-muted-foreground text-xs",
                                        formFieldLabel: "text-foreground font-medium text-sm",
                                        formFieldInput:
                                            "bg-input border-border text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary w-full max-w-full text-base",
                                        formFieldRow: "w-full max-w-full",
                                        formButtonPrimary:
                                            "bg-primary hover:bg-primary/90 text-primary-foreground font-semibold w-full",
                                        footerActionLink: "text-primary hover:text-primary/80 text-sm",
                                        footerActionText: "text-muted-foreground text-sm",
                                        footer: "w-full",
                                        identityPreviewText: "text-foreground text-sm",
                                        identityPreviewEditButton: "text-primary text-sm",
                                        formFieldAction: "text-primary text-sm",
                                        formFieldInputShowPasswordButton: "text-muted-foreground",
                                        otpCodeFieldInput: "border-border text-foreground w-10 h-10",
                                        formResendCodeLink: "text-primary text-sm",
                                        alert: "bg-destructive/10 border-destructive text-destructive w-full",
                                        alertText: "text-destructive text-sm",
                                    },
                                }}
                            />
                        ) : (
                            <ClerkSignIn
                                afterSignInUrl="/"
                                appearance={{
                                    elements: {
                                        rootBox: "w-full max-w-full overflow-hidden",
                                        card: "bg-transparent shadow-none p-0 w-full max-w-full",
                                        main: "w-full max-w-full",
                                        form: "w-full max-w-full",
                                        headerTitle: "hidden",
                                        headerSubtitle: "hidden",
                                        socialButtonsBlockButton:
                                            "border-border bg-background hover:bg-secondary text-foreground font-medium w-full",
                                        socialButtonsBlockButtonText: "text-foreground text-sm",
                                        socialButtonsProviderIcon: "w-4 h-4",
                                        dividerLine: "bg-border",
                                        dividerText: "text-muted-foreground text-xs",
                                        formFieldLabel: "text-foreground font-medium text-sm",
                                        formFieldInput:
                                            "bg-input border-border text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary w-full max-w-full text-base",
                                        formFieldRow: "w-full max-w-full",
                                        formButtonPrimary:
                                            "bg-primary hover:bg-primary/90 text-primary-foreground font-semibold w-full",
                                        footerActionLink: "text-primary hover:text-primary/80 text-sm",
                                        footerActionText: "text-muted-foreground text-sm",
                                        footer: "w-full",
                                        identityPreviewText: "text-foreground text-sm",
                                        identityPreviewEditButton: "text-primary text-sm",
                                        formFieldAction: "text-primary text-sm",
                                        formFieldInputShowPasswordButton: "text-muted-foreground",
                                        otpCodeFieldInput: "border-border text-foreground w-10 h-10",
                                        formResendCodeLink: "text-primary text-sm",
                                        alternativeMethodsBlockButton: "text-primary text-sm",
                                        alert: "bg-destructive/10 border-destructive text-destructive w-full",
                                        alertText: "text-destructive text-sm",
                                    },
                                }}
                            />
                        )}
                    </div>

                    {/* Terms */}
                    <p className="text-center text-xs text-muted-foreground mt-4 px-2">
                        By continuing, you agree to our{" "}
                        <Link
                            to="/terms-and-conditions"
                            className="text-primary hover:underline"
                        >
                            Terms & Conditions
                        </Link>{" "}
                        and{" "}
                        <Link to="/privacy-policy" className="text-primary hover:underline">
                            Privacy Policy
                        </Link>
                    </p>

                    {/* Back to Home */}
                    <div className="mt-4 text-center pb-4">
                        <Link to="/">
                            <Button variant="ghost" className="text-muted-foreground text-xs sm:text-sm">
                                ← Back to Home
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Auth;
