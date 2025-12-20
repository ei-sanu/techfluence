import Navbar from "@/components/Navbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { RedirectToSignIn, SignedIn, SignedOut, useUser } from "@clerk/clerk-react";
import { Calendar, GraduationCap, MapPin, Scroll, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

interface Registration {
  id: string;
  full_name: string;
  registration_number: string;
  university_name: string;
  email: string;
  contact_number: string;
  course: string;
  year_of_study: string;
  event_type: string;
  address: string;
  city: string;
  pincode: string;
  technical_skills: string | null;
  created_at: string;
}

interface TeamMember {
  id: string;
  member_type: string;
  name: string;
  registration_number: string;
}

const Activity = () => {
  const { user } = useUser();
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [teamMembers, setTeamMembers] = useState<Record<string, TeamMember[]>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRegistrations = async () => {
      if (!user?.id) return;

      try {
        // First get the profile
        const { data: profile } = await supabase
          .from("profiles")
          .select("id")
          .eq("clerk_user_id", user.id)
          .single();

        if (!profile) {
          setLoading(false);
          return;
        }

        // Then get registrations for this profile
        const { data: regs, error } = await supabase
          .from("registrations")
          .select("*")
          .eq("profile_id", profile.id)
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Error fetching registrations:", error);
          setLoading(false);
          return;
        }

        setRegistrations(regs || []);

        // Fetch team members for hackathon/both registrations
        if (regs && regs.length > 0) {
          const hackathonRegs = regs.filter(r => r.event_type === "hackathon" || r.event_type === "both");

          if (hackathonRegs.length > 0) {
            const { data: members } = await supabase
              .from("team_members")
              .select("*")
              .in("registration_id", hackathonRegs.map(r => r.id));

            if (members) {
              const membersByReg: Record<string, TeamMember[]> = {};
              members.forEach(m => {
                if (!membersByReg[m.registration_id]) {
                  membersByReg[m.registration_id] = [];
                }
                membersByReg[m.registration_id].push(m);
              });
              setTeamMembers(membersByReg);
            }
          }
        }
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRegistrations();
  }, [user?.id]);

  const getEventTypeBadge = (type: string) => {
    switch (type) {
      case "event":
        return <Badge className="bg-blue-600">Event Only</Badge>;
      case "hackathon":
        return <Badge className="bg-purple-600">Hackathon Only</Badge>;
      case "both":
        return <Badge className="bg-green-600">Event + Hackathon</Badge>;
      default:
        return null;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
      <SignedIn>
        <div className="min-h-screen bg-background">
          <Navbar />
          <main className="pt-24 pb-16 px-4">
            <div className="container mx-auto max-w-4xl">
              <div className="text-center mb-12">
                <Scroll className="w-16 h-16 text-primary mx-auto mb-4" />
                <h1 className="font-decorative text-4xl royal-text-gradient mb-2">Your Royal Decrees</h1>
                <p className="text-muted-foreground font-cinzel">Registration History</p>
              </div>

              {loading ? (
                <div className="parchment-bg royal-border rounded-xl p-8 text-center">
                  <p className="text-muted-foreground">Loading your registrations...</p>
                </div>
              ) : registrations.length === 0 ? (
                <div className="parchment-bg royal-border rounded-xl p-8 text-center">
                  <p className="text-muted-foreground mb-6">
                    You have not registered for any TechFluence events yet.
                  </p>
                  <Link to="/register">
                    <Button className="font-cinzel">Register Now</Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-6">
                  {registrations.map((reg) => (
                    <Card key={reg.id} className="parchment-bg royal-border">
                      <CardHeader>
                        <div className="flex justify-between items-start flex-wrap gap-4">
                          <div>
                            <CardTitle className="font-cinzel text-xl text-primary">
                              {reg.full_name}
                            </CardTitle>
                            <p className="text-sm text-muted-foreground mt-1">
                              Reg. No: {reg.registration_number}
                            </p>
                          </div>
                          {getEventTypeBadge(reg.event_type)}
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="flex items-center gap-2 text-sm">
                            <GraduationCap className="w-4 h-4 text-primary" />
                            <span>{reg.university_name}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <span className="text-muted-foreground">
                              {reg.course} - {reg.year_of_study}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <MapPin className="w-4 h-4 text-primary" />
                            <span>{reg.city}, {reg.pincode}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Calendar className="w-4 h-4 text-primary" />
                            <span>{formatDate(reg.created_at)}</span>
                          </div>
                        </div>

                        {reg.technical_skills && (
                          <div className="pt-2 border-t border-border">
                            <p className="text-sm text-muted-foreground">
                              <strong>Skills:</strong> {reg.technical_skills}
                            </p>
                          </div>
                        )}

                        {(reg.event_type === "hackathon" || reg.event_type === "both") &&
                          teamMembers[reg.id] && teamMembers[reg.id].length > 0 && (
                            <div className="pt-4 border-t border-border">
                              <div className="flex items-center gap-2 mb-3">
                                <Users className="w-4 h-4 text-primary" />
                                <span className="font-cinzel font-semibold">Team Members</span>
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                {teamMembers[reg.id].map((member) => (
                                  <div key={member.id} className="text-sm bg-background/50 p-2 rounded">
                                    <span className="capitalize text-muted-foreground">
                                      {member.member_type.replace(/(\d)/, ' $1')}:
                                    </span>{" "}
                                    {member.name} ({member.registration_number})
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                      </CardContent>
                    </Card>
                  ))}

                  <div className="text-center pt-4">
                    <Link to="/register">
                      <Button variant="outline" className="font-cinzel">
                        Register for Another Event
                      </Button>
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </main>
        </div>
      </SignedIn>
    </>
  );
};

export default Activity;
