import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/clerk-react";
import Navbar from "@/components/Navbar";
import { Crown } from "lucide-react";

const Register = () => {
  return (
    <>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
      <SignedIn>
        <div className="min-h-screen bg-background">
          <Navbar />
          <main className="pt-24 pb-16 px-4">
            <div className="container mx-auto max-w-2xl">
              <div className="text-center mb-12">
                <Crown className="w-16 h-16 text-primary mx-auto mb-4" />
                <h1 className="font-decorative text-4xl royal-text-gradient mb-2">Royal Registration</h1>
                <p className="text-muted-foreground font-cinzel">Complete your enrollment decree</p>
              </div>
              <div className="parchment-bg royal-border rounded-xl p-8">
                <p className="text-center text-muted-foreground">
                  Registration form will be connected to Supabase database. 
                  Please run the SQL schema to set up the tables first.
                </p>
              </div>
            </div>
          </main>
        </div>
      </SignedIn>
    </>
  );
};

export default Register;
