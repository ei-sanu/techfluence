import { Button } from "@/components/ui/button";
import { Crown, Lock, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

interface NotAuthenticatedProps {
    title?: string;
    description?: string;
}

const NotAuthenticated = ({
    title = "Authentication Required",
    description = "You need to sign in to access this page. Join TECH FLUENCE 6.0 and unlock exclusive features!"
}: NotAuthenticatedProps) => {
    return (
        <div className="min-h-screen flex items-center justify-center px-4">
            <div className="max-w-md w-full text-center">
                {/* Animated Lock Icon */}
                <div className="relative inline-block mb-8">
                    <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center animate-pulse">
                        <Lock className="w-12 h-12 text-primary" />
                    </div>
                    <Sparkles className="absolute -top-2 -right-2 w-6 h-6 text-primary animate-bounce" />
                </div>

                {/* Crown Logo */}
                <div className="flex items-center justify-center gap-2 mb-6">
                    <Crown className="w-8 h-8 text-primary" />
                    <span className="font-decorative text-2xl tech-text-gradient">
                        TECH FLUENCE 6.0
                    </span>
                </div>

                {/* Title */}
                <h1 className="font-decorative text-3xl md:text-4xl text-foreground mb-4">
                    {title}
                </h1>

                {/* Description */}
                <p className="text-muted-foreground font-cinzel mb-8 leading-relaxed">
                    {description}
                </p>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link to="/auth">
                        <Button
                            size="lg"
                            className="w-full sm:w-auto font-cinzel bg-primary text-primary-foreground hover:bg-primary/90 gap-2"
                        >
                            <Lock className="w-4 h-4" />
                            Sign In / Sign Up
                        </Button>
                    </Link>
                    <Link to="/">
                        <Button
                            size="lg"
                            variant="outline"
                            className="w-full sm:w-auto font-cinzel border-primary/30 hover:bg-primary/10"
                        >
                            Back to Home
                        </Button>
                    </Link>
                </div>

                {/* Decorative Border */}
                <div className="mt-12 pt-8 border-t border-border">
                    <p className="text-xs text-muted-foreground font-cinzel">
                        Your tech journey awaits beyond these gates
                    </p>
                </div>
            </div>
        </div>
    );
};

export default NotAuthenticated;
