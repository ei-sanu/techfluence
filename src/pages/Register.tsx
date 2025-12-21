import Footer from "@/components/Footer";
import GearLoader from "@/components/GearLoader";
import Navbar from "@/components/Navbar";
import NotAuthenticated from "@/components/NotAuthenticated";
import RegistrationForm from "@/components/registration/RegistrationForm";
import { SignedIn, SignedOut } from "@clerk/clerk-react";
import { Crown } from "lucide-react";
import { useEffect, useState } from "react";

const Register = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <SignedOut>
        <NotAuthenticated
          title="Sign In to Register"
          description="You need to be authenticated to register for TECH FLUENCE 6.0 events. Sign in or create an account to continue your royal journey!"
        />
      </SignedOut>
      <SignedIn>
        <GearLoader isLoading={isLoading} minDuration={1500} />
        <div className="min-h-screen bg-background">
          <Navbar />
          <main className="pt-24 pb-16 px-4">
            <div className="container mx-auto">
              {/* Header */}
              <div className="text-center mb-12">
                <Crown className="w-16 h-16 text-primary mx-auto mb-4 animate-float" />
                <h1 className="font-decorative text-4xl md:text-5xl royal-text-gradient mb-4">
                  Event Registration
                </h1>
                <p className="text-muted-foreground font-cinzel max-w-xl mx-auto">
                  Complete your registration to join TECH FLUENCE 6.0.
                  Your journey to innovation begins here.
                </p>
              </div>

              {/* Registration Form */}
              <RegistrationForm />
            </div>
          </main>
          <Footer />
        </div>
      </SignedIn>
    </>
  );
};

export default Register;
