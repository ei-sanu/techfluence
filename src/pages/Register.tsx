import Footer from "@/components/Footer";
import GearLoader from "@/components/GearLoader";
import Navbar from "@/components/Navbar";
import NotAuthenticated from "@/components/NotAuthenticated";
import JoinTeamForm from "@/components/registration/JoinTeamForm";
import RegistrationForm from "@/components/registration/RegistrationForm";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { SignedIn, SignedOut, useUser } from "@clerk/clerk-react";
import { CheckCircle, Crown, PartyPopper, PlusCircle, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

type RegistrationMode = "select" | "new" | "join";

interface RegistrationStatus {
  type: "leader" | "member";
  team_name: string;
  team_code: string;
  leader_name: string;
  event_type?: string;
}

const Register = () => {
  const { user } = useUser();
  const [isLoading, setIsLoading] = useState(true);
  const [mode, setMode] = useState<RegistrationMode>("select");
  const [registrationStatus, setRegistrationStatus] = useState<RegistrationStatus | null>(null);
  const [checkingStatus, setCheckingStatus] = useState(true);
  const [hackathonControl, setHackathonControl] = useState<string | null>(null); // 'active'|'paused'|'ended'

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  // Check if user has already registered or joined a team
  useEffect(() => {
    const checkRegistrationStatus = async () => {
      if (!user?.id) {
        setCheckingStatus(false);
        return;
      }

      try {
        // Get user's profile
        const { data: profile } = await supabase
          .from("profiles")
          .select("id")
          .eq("clerk_user_id", user.id)
          .single();

        if (!profile) {
          setCheckingStatus(false);
          return;
        }

        // First, check if user has their own registration (is a leader)
        const { data: ownRegistration } = await supabase
          .from("registrations")
          .select("team_name, full_name, check_in_code, event_type")
          .eq("profile_id", profile.id)
          .order("created_at", { ascending: false })
          .limit(1)
          .single();

        if (ownRegistration) {
          setRegistrationStatus({
            type: "leader",
            team_name: ownRegistration.team_name || "Your Team",
            team_code: ownRegistration.check_in_code || "",
            leader_name: ownRegistration.full_name,
            event_type: ownRegistration.event_type,
          });
          setCheckingStatus(false);
          return;
        }

        // If no own registration, check for accepted join requests (is a member)
        const { data: acceptedRequest } = await supabase
          .from("team_join_requests")
          .select("team_code, leader_registration_id")
          .eq("requester_profile_id", profile.id)
          .eq("status", "accepted")
          .order("created_at", { ascending: false })
          .limit(1)
          .single();

        if (acceptedRequest) {
          // Get team details
          const { data: registration } = await supabase
            .from("registrations")
            .select("team_name, full_name, check_in_code, event_type")
            .eq("id", acceptedRequest.leader_registration_id)
            .single();

          if (registration) {
            setRegistrationStatus({
              type: "member",
              team_name: registration.team_name || "Team",
              team_code: registration.check_in_code || acceptedRequest.team_code,
              leader_name: registration.full_name,
              event_type: registration.event_type,
            });
          }
        }
      } catch (error) {
        console.error("Error checking registration status:", error);
      } finally {
        setCheckingStatus(false);
      }
    };

    checkRegistrationStatus();
  }, [user?.id]);

  // fetch hackathon registration control status
  useEffect(() => {
    const fetchControl = async () => {
      try {
        const { data: ev } = await supabase.from('event_controls').select('*').eq('key', 'hackathon_registration').maybeSingle();
        if (ev && ev.value) setHackathonControl(ev.value);
      } catch (err) {
        // ignore if table doesn't exist
      }
    };
    fetchControl();
  }, []);

  return (
    <>
      <SignedOut>
        <NotAuthenticated
          title="Sign In to Register"
          description="You need to be authenticated to register for TECH FLUENCE 6.0 events. Sign in or create an account to continue your tech journey!"
        />
      </SignedOut>
      <SignedIn>
        <GearLoader isLoading={isLoading} minDuration={1500} />
        <div className="min-h-screen">
          <Navbar />
          <main className="pt-24 pb-16 px-4">
            <div className="container mx-auto">
              {/* Header */}
              <div className="text-center mb-12">
                <Crown className="w-16 h-16 text-primary mx-auto mb-4 animate-float" />
                <h1 className="font-decorative text-4xl md:text-5xl tech-text-gradient mb-4">
                  Event Registration
                </h1>
                <p className="text-muted-foreground font-cinzel max-w-xl mx-auto">
                  Complete your registration to join TECH FLUENCE 6.0.
                  Your journey to innovation begins here.
                </p>
              </div>

              {/* Loading Status Check */}
              {checkingStatus ? (
                <div className="max-w-md mx-auto parchment-bg tech-border rounded-xl p-8 text-center">
                  <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4" />
                  <p className="text-muted-foreground">Checking your registration status...</p>
                </div>
              ) : registrationStatus ? (
                /* Already Registered/Joined Message */
                <div className="max-w-lg mx-auto">
                  <Card className="parchment-bg tech-border border-green-500/30 overflow-hidden">
                    <div className="bg-gradient-to-r from-green-500/20 via-green-500/10 to-green-500/20 p-6 text-center border-b border-green-500/20">
                      <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-green-500/20 flex items-center justify-center">
                        <PartyPopper className="w-10 h-10 text-green-500" />
                      </div>
                      <h2 className="font-decorative text-2xl text-green-600 dark:text-green-400 mb-2">
                        Congratulations!
                      </h2>
                      <p className="text-muted-foreground text-sm">
                        {registrationStatus.type === "leader"
                          ? "You have successfully registered for the event"
                          : "You have successfully joined the event"}
                      </p>
                    </div>
                    <CardContent className="p-6 space-y-4">
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground mb-1">
                          {registrationStatus.type === "leader" ? "Your team Name" : "You are now a member of"}
                        </p>
                        <h3 className="font-cinzel text-2xl text-primary font-bold">{registrationStatus.team_name}</h3>
                      </div>

                      <div className="bg-primary/10 rounded-lg p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Team Code</span>
                          <span className="font-mono text-lg font-bold text-primary">{registrationStatus.team_code}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">
                            {registrationStatus.type === "leader" ? "Team Leader" : "Team Leader"}
                          </span>
                          <span className="font-semibold text-foreground">
                            {registrationStatus.leader_name}
                            {registrationStatus.type === "leader" && " (You)"}
                          </span>
                        </div>
                        {registrationStatus.event_type && (
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Event Type</span>
                            <span className="font-semibold text-foreground capitalize">
                              {registrationStatus.event_type === "both"
                                ? "Event + Hackathon"
                                : registrationStatus.event_type}
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400 bg-green-500/10 rounded-lg p-3">
                        <CheckCircle className="w-5 h-5 flex-shrink-0" />
                        <span>Your team details and event pass are available in the Activity page.</span>
                      </div>

                      <Link to="/activity" className="block">
                        <Button className="w-full gap-2 font-cinzel" size="lg">
                          <Users className="w-5 h-5" />
                          View Activity & Team Details
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                </div>
              ) : (
                <>
                  {/* Mode Selection */}
                  {mode === "select" && (
                    <div className="max-w-3xl mx-auto">
                      <div className="grid md:grid-cols-2 gap-6">
                        {/* New Registration Card (disabled when hackathon paused/ended) */}
                        <Card
                          className={`tech-border transition-all duration-300 ${hackathonControl === 'paused' || hackathonControl === 'ended' ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer hover:scale-[1.02] hover:shadow-xl hover:shadow-primary/10 group'}`}
                          onClick={() => { if (hackathonControl !== 'paused' && hackathonControl !== 'ended') setMode("new"); }}
                        >
                          <CardContent className="p-8 text-center">
                            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                              <PlusCircle className="w-10 h-10 text-primary" />
                            </div>
                            <h3 className="font-cinzel text-xl font-semibold mb-3">New Registration</h3>
                            <p className="text-muted-foreground text-sm">
                              Register as a new participant for TECH FLUENCE 6.0. Create your own team or participate individually.
                            </p>
                            <div className="mt-6 py-2 px-4 rounded-full text-sm font-medium inline-block" style={{ background: hackathonControl === 'paused' || hackathonControl === 'ended' ? 'transparent' : undefined }}>
                              {hackathonControl === 'paused' ? 'Hackathon Registrations Paused' : hackathonControl === 'ended' ? 'Registrations Ended' : 'Create New Team'}
                            </div>
                          </CardContent>
                        </Card>

                        {/* Join Team Card (disabled when hackathon paused/ended) */}
                        <Card
                          className={`tech-border transition-all duration-300 ${hackathonControl === 'paused' || hackathonControl === 'ended' ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer hover:scale-[1.02] hover:shadow-xl hover:shadow-primary/10 group'}`}
                          onClick={() => { if (hackathonControl !== 'paused' && hackathonControl !== 'ended') setMode("join"); }}
                        >
                          <CardContent className="p-8 text-center">
                            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-blue-500/20 to-blue-500/5 flex items-center justify-center">
                              <Users className="w-10 h-10 text-blue-500" />
                            </div>
                            <h3 className="font-cinzel text-xl font-semibold mb-3">Join Existing Team</h3>
                            <p className="text-muted-foreground text-sm">
                              Already have a team code? Join an existing team created by your team leader.
                            </p>
                            <div className="mt-6 py-2 px-4 rounded-full text-sm font-medium inline-block">
                              {hackathonControl === 'paused' ? 'Joining Paused' : hackathonControl === 'ended' ? 'Registrations Ended' : 'Enter Team Code'}
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  )}

                  {/* New Registration Form */}
                  {mode === "new" && (
                    <RegistrationForm onBack={() => setMode("select")} />
                  )}

                  {/* Join Team Form */}
                  {mode === "join" && (
                    <JoinTeamForm onBack={() => setMode("select")} />
                  )}
                </>
              )}
            </div>
          </main>
          <Footer />
        </div>
      </SignedIn>
    </>
  );
};

export default Register;
