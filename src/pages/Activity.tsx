import Navbar from "@/components/Navbar";
import NotAuthenticated from "@/components/NotAuthenticated";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { SignedIn, SignedOut, useUser } from "@clerk/clerk-react";
import { Calendar, Code, Download, GraduationCap, Loader2, MapPin, Plus, Scroll, ShieldCheck, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";

// Admin email(s) that can download data - add your admin emails here
const ADMIN_EMAILS = ["someshranjanbiswal13678@gmail.com", "biswalranjansomesh@gmail.com"];

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
  team_name: string | null;
  check_in_code: string | null;
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
  const navigate = useNavigate();
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [teamMembers, setTeamMembers] = useState<Record<string, TeamMember[]>>({});
  const [loading, setLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);

  const isAdmin = user?.primaryEmailAddress?.emailAddress &&
    ADMIN_EMAILS.includes(user.primaryEmailAddress.emailAddress);

  const downloadRegistrations = async () => {
    if (!isAdmin) {
      toast({
        title: "Access Denied",
        description: "You don't have permission to download registrations.",
        variant: "destructive",
      });
      return;
    }

    setIsDownloading(true);

    try {
      // Fetch all registrations
      const { data: allRegistrations, error: regError } = await supabase
        .from("registrations")
        .select("*")
        .order("created_at", { ascending: false });

      if (regError) throw regError;

      if (!allRegistrations || allRegistrations.length === 0) {
        toast({
          title: "No Data",
          description: "No registrations found in the database.",
          variant: "destructive",
        });
        setIsDownloading(false);
        return;
      }

      // Fetch all team members
      const { data: allTeamMembers, error: teamError } = await supabase
        .from("team_members")
        .select("*");

      if (teamError) throw teamError;

      // Create a map of team members by registration_id
      const teamMembersByReg: Record<string, any[]> = {};
      allTeamMembers?.forEach((member) => {
        if (!teamMembersByReg[member.registration_id]) {
          teamMembersByReg[member.registration_id] = [];
        }
        teamMembersByReg[member.registration_id].push(member);
      });

      // Format data for Excel
      const excelData = allRegistrations.map((reg) => {
        const teamData = teamMembersByReg[reg.id] || [];
        const leader = teamData.find((m) => m.member_type === "leader");
        const member1 = teamData.find((m) => m.member_type === "member1");
        const member2 = teamData.find((m) => m.member_type === "member2");
        const member3 = teamData.find((m) => m.member_type === "member3");

        return {
          "Full Name": reg.full_name,
          "Registration Number": reg.registration_number,
          "University": reg.university_name,
          "Email": reg.email,
          "Contact Number": reg.contact_number,
          "Course": reg.course,
          "Year of Study": reg.year_of_study,
          "Event Type": reg.event_type,
          "Address": reg.address,
          "City": reg.city,
          "Pincode": reg.pincode,
          "Technical Skills": reg.technical_skills || "",
          "Team Name": reg.team_name || "",
          "Team Code": reg.check_in_code || "",
          "Registered On": new Date(reg.created_at).toLocaleString("en-IN"),
          "Team Leader Name": leader?.name || "",
          "Team Leader Reg No": leader?.registration_number || "",
          "Member 1 Name": member1?.name || "",
          "Member 1 Reg No": member1?.registration_number || "",
          "Member 2 Name": member2?.name || "",
          "Member 2 Reg No": member2?.registration_number || "",
          "Member 3 Name": member3?.name || "",
          "Member 3 Reg No": member3?.registration_number || "",
        };
      });

      // Create workbook and worksheet
      const worksheet = XLSX.utils.json_to_sheet(excelData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Registrations");

      // Auto-size columns
      const maxWidth = 30;
      const colWidths = Object.keys(excelData[0] || {}).map((key) => ({
        wch: Math.min(maxWidth, Math.max(key.length, 15)),
      }));
      worksheet["!cols"] = colWidths;

      // Generate filename with date
      const date = new Date().toISOString().split("T")[0];
      const filename = `TechFluence_Registrations_${date}.xlsx`;

      // Download file
      XLSX.writeFile(workbook, filename);

      toast({
        title: "Download Complete",
        description: `${allRegistrations.length} registrations exported successfully.`,
      });
    } catch (error) {
      console.error("Download error:", error);
      toast({
        title: "Download Failed",
        description: "Failed to download registrations. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDownloading(false);
    }
  };

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
        <NotAuthenticated
          title="Sign In to View Activity"
          description="You need to be authenticated to view your registrations and activity. Sign in or create an account to access your dashboard!"
        />
      </SignedOut>
      <SignedIn>
        <div className="min-h-screen bg-background">
          <Navbar />
          <main className="pt-24 pb-16 px-4">
            <div className="container mx-auto max-w-4xl">
              <div className="text-center mb-12">
                <Scroll className="w-16 h-16 text-primary mx-auto mb-4" />
                <h1 className="font-decorative text-4xl royal-text-gradient mb-2">Your Registrations</h1>
                <p className="text-muted-foreground font-cinzel">Registration History</p>
              </div>

              {loading ? (
                <div className="parchment-bg royal-border rounded-xl p-8 text-center">
                  <p className="text-muted-foreground">Loading your registrations...</p>
                </div>
              ) : registrations.length === 0 ? (
                <div className="parchment-bg royal-border rounded-xl p-8 text-center">
                  <p className="text-muted-foreground mb-6">
                    You have not registered for any TECH FLUENCE 6.0 events yet.
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
                        {/* Team Code Display */}
                        {reg.check_in_code && (
                          <div className="bg-primary/10 royal-border rounded-lg p-4 flex items-center justify-between">
                            <div>
                              <p className="text-xs text-muted-foreground font-sans mb-1">Team Code</p>
                              <p className="text-2xl font-bold text-primary tracking-widest font-mono">{reg.check_in_code}</p>
                            </div>
                            {reg.team_name && (
                              <div className="text-right">
                                <p className="text-xs text-muted-foreground font-sans mb-1">Team Name</p>
                                <p className="text-lg font-semibold text-foreground font-sans">{reg.team_name}</p>
                              </div>
                            )}
                          </div>
                        )}

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

                        {/* Upgrade option for partial registrations */}
                        {reg.event_type !== "both" && (
                          <div className="pt-4 border-t border-border">
                            <div className="bg-primary/10 rounded-lg p-4 border border-primary/30">
                              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                                <div className="text-center sm:text-left">
                                  <p className="font-sans text-sm text-foreground">
                                    {reg.event_type === "event" ? (
                                      <>
                                        <Code className="w-4 h-4 inline mr-1 text-purple-500" />
                                        Also interested in the <strong>Hackathon</strong>?
                                      </>
                                    ) : (
                                      <>
                                        <Calendar className="w-4 h-4 inline mr-1 text-blue-500" />
                                        Also interested in the <strong>Event</strong>?
                                      </>
                                    )}
                                  </p>
                                </div>
                                <Button
                                  onClick={() => navigate(`/register?upgrade=${reg.event_type === "event" ? "hackathon" : "event"}`)}
                                  size="sm"
                                  className="font-sans font-semibold gap-2"
                                >
                                  <Plus className="w-4 h-4" />
                                  Add {reg.event_type === "event" ? "Hackathon" : "Event"}
                                </Button>
                              </div>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {/* Admin Panel */}
              {isAdmin && (
                <div className="mt-12 parchment-bg royal-border rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <ShieldCheck className="w-6 h-6 text-primary" />
                    <h2 className="font-cinzel text-xl text-primary">Admin Panel</h2>
                  </div>
                  <p className="text-muted-foreground mb-4">
                    As an admin, you can download all registrations as an Excel file.
                  </p>
                  <Button
                    onClick={downloadRegistrations}
                    disabled={isDownloading}
                    className="font-cinzel"
                  >
                    {isDownloading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Downloading...
                      </>
                    ) : (
                      <>
                        <Download className="w-4 h-4 mr-2" />
                        Download All Registrations
                      </>
                    )}
                  </Button>
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
