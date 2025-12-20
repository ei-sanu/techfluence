import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/clerk-react";
import Navbar from "@/components/Navbar";
import { Scroll } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Activity = () => {
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
                <Scroll className="w-16 h-16 text-primary mx-auto mb-4" />
                <h1 className="font-decorative text-4xl royal-text-gradient mb-2">Your Royal Decrees</h1>
                <p className="text-muted-foreground font-cinzel">Registration History</p>
              </div>
              <div className="parchment-bg royal-border rounded-xl p-8 text-center">
                <p className="text-muted-foreground mb-6">
                  You have not registered for any TechFluence events yet.
                </p>
                <Link to="/register">
                  <Button className="font-cinzel">Register Now</Button>
                </Link>
              </div>
            </div>
          </main>
        </div>
      </SignedIn>
    </>
  );
};

export default Activity;
