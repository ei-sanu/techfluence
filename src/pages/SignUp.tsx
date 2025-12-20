import { SignUp as ClerkSignUp } from "@clerk/clerk-react";
import { Crown } from "lucide-react";
import { Link } from "react-router-dom";

const SignUp = () => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <Crown className="w-10 h-10 text-primary" />
            <span className="font-decorative text-3xl royal-text-gradient">TechFluence</span>
          </Link>
          <h1 className="font-cinzel text-2xl text-foreground mb-2">Join the Kingdom</h1>
          <p className="text-muted-foreground">Create your royal account</p>
        </div>
        
        <div className="parchment-bg royal-border rounded-xl p-6">
          <ClerkSignUp 
            afterSignUpUrl="/"
            appearance={{
              elements: {
                formButtonPrimary: "bg-primary hover:bg-primary/90 text-primary-foreground",
                card: "bg-transparent shadow-none",
                headerTitle: "hidden",
                headerSubtitle: "hidden",
                socialButtonsBlockButton: "border-border hover:bg-secondary",
                formFieldInput: "bg-input border-border text-foreground",
                footerActionLink: "text-primary hover:text-primary/80",
              }
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default SignUp;
