import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useUser } from "@clerk/clerk-react";
import { ArrowLeft, CheckCircle, Loader2, Search, Send, Users, XCircle } from "lucide-react";
import { useState } from "react";

interface JoinTeamFormProps {
    onBack: () => void;
}

interface TeamInfo {
    team_name: string;
    check_in_code: string;
    leader_name: string;
    event_type: string;
    registration_id: string;
}

const JoinTeamForm = ({ onBack }: JoinTeamFormProps) => {
    const { user } = useUser();
    const [step, setStep] = useState<"search" | "confirm" | "success" | "already-requested">("search");
    const [isLoading, setIsLoading] = useState(false);
    const [teamCode, setTeamCode] = useState("");
    const [registrationNumber, setRegistrationNumber] = useState("");
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState(user?.primaryEmailAddress?.emailAddress || "");
    const [teamInfo, setTeamInfo] = useState<TeamInfo | null>(null);
    const [existingRequest, setExistingRequest] = useState<{ status: string } | null>(null);

    const searchTeam = async () => {
        if (!teamCode.trim()) {
            toast({
                title: "Team Code Required",
                description: "Please enter the team code to search.",
                variant: "destructive",
            });
            return;
        }

        setIsLoading(true);

        try {
            // Check if user already has a profile
            const { data: profile } = await supabase
                .from("profiles")
                .select("id")
                .eq("clerk_user_id", user?.id)
                .single();

            // Check if user already sent a request for this team
            if (profile) {
                const { data: existingReq } = await supabase
                    .from("team_join_requests")
                    .select("status")
                    .eq("team_code", teamCode.toUpperCase())
                    .eq("requester_profile_id", profile.id)
                    .single();

                if (existingReq) {
                    setExistingRequest(existingReq);
                    setStep("already-requested");
                    setIsLoading(false);
                    return;
                }
            }

            // Search for the team
            const { data: registration, error } = await supabase
                .from("registrations")
                .select("id, team_name, check_in_code, full_name, event_type")
                .eq("check_in_code", teamCode.toUpperCase())
                .single();

            if (error || !registration) {
                toast({
                    title: "Team Not Found",
                    description: "No team found with this code. Please check and try again.",
                    variant: "destructive",
                });
                setIsLoading(false);
                return;
            }

            // Get team member count
            const { count } = await supabase
                .from("team_members")
                .select("*", { count: "exact", head: true })
                .eq("registration_id", registration.id);

            if (count && count >= 4) {
                toast({
                    title: "Team Full",
                    description: "This team already has the maximum number of members (4).",
                    variant: "destructive",
                });
                setIsLoading(false);
                return;
            }

            setTeamInfo({
                team_name: registration.team_name || "Unnamed Team",
                check_in_code: registration.check_in_code || "",
                leader_name: registration.full_name,
                event_type: registration.event_type,
                registration_id: registration.id,
            });
            setStep("confirm");
        } catch (error) {
            console.error("Search error:", error);
            toast({
                title: "Error",
                description: "Failed to search for team. Please try again.",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const sendJoinRequest = async () => {
        if (!fullName.trim() || !registrationNumber.trim() || !email.trim()) {
            toast({
                title: "All Fields Required",
                description: "Please fill in all the required fields.",
                variant: "destructive",
            });
            return;
        }

        if (!teamInfo) return;

        setIsLoading(true);

        try {
            // Get or create profile
            let profileId: string;

            const { data: existingProfile } = await supabase
                .from("profiles")
                .select("id")
                .eq("clerk_user_id", user?.id)
                .single();

            if (existingProfile) {
                profileId = existingProfile.id;
            } else {
                const { data: newProfile, error: profileError } = await supabase
                    .from("profiles")
                    .insert({
                        clerk_user_id: user?.id,
                        email: email,
                        full_name: fullName,
                    })
                    .select("id")
                    .single();

                if (profileError) throw profileError;
                profileId = newProfile.id;
            }

            // Create join request
            const { error: requestError } = await supabase
                .from("team_join_requests")
                .insert({
                    team_code: teamInfo.check_in_code,
                    requester_profile_id: profileId,
                    requester_name: fullName,
                    requester_registration_number: registrationNumber,
                    requester_email: email,
                    leader_registration_id: teamInfo.registration_id,
                    status: "pending",
                });

            if (requestError) throw requestError;

            setStep("success");
            toast({
                title: "Request Sent!",
                description: "Your join request has been sent to the team leader.",
            });
        } catch (error) {
            console.error("Request error:", error);
            toast({
                title: "Error",
                description: "Failed to send join request. Please try again.",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-xl mx-auto">
            <Button
                variant="ghost"
                onClick={onBack}
                className="mb-6 gap-2"
            >
                <ArrowLeft className="w-4 h-4" />
                Back to Options
            </Button>

            <Card className="tech-border">
                <CardHeader>
                    <CardTitle className="font-cinzel text-xl text-primary flex items-center gap-2">
                        <Users className="w-5 h-5" />
                        Join Existing Team
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {step === "search" && (
                        <div className="space-y-6">
                            <p className="text-muted-foreground text-sm">
                                Enter the team code shared by your team leader to send a join request.
                            </p>

                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="teamCode">Team Code</Label>
                                    <Input
                                        id="teamCode"
                                        placeholder="Enter 6-character team code"
                                        value={teamCode}
                                        onChange={(e) => setTeamCode(e.target.value.toUpperCase())}
                                        maxLength={6}
                                        className="font-mono text-lg tracking-widest uppercase"
                                    />
                                </div>

                                <Button
                                    onClick={searchTeam}
                                    disabled={isLoading || !teamCode.trim()}
                                    className="w-full gap-2"
                                >
                                    {isLoading ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                        <Search className="w-4 h-4" />
                                    )}
                                    Search Team
                                </Button>
                            </div>
                        </div>
                    )}

                    {step === "confirm" && teamInfo && (
                        <div className="space-y-6">
                            {/* Team Info Card */}
                            <div className="bg-primary/10 rounded-lg p-4 border border-primary/30">
                                <h4 className="font-cinzel font-semibold text-lg mb-2">{teamInfo.team_name}</h4>
                                <div className="space-y-1 text-sm">
                                    <p><span className="text-muted-foreground">Team Code:</span> <span className="font-mono text-primary">{teamInfo.check_in_code}</span></p>
                                    <p><span className="text-muted-foreground">Leader:</span> {teamInfo.leader_name}</p>
                                    <p><span className="text-muted-foreground">Event:</span> <span className="capitalize">{teamInfo.event_type === "both" ? "Event + Hackathon" : teamInfo.event_type}</span></p>
                                </div>
                            </div>

                            <p className="text-muted-foreground text-sm">
                                Fill in your details to send a join request to the team leader.
                            </p>

                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="fullName">Full Name *</Label>
                                    <Input
                                        id="fullName"
                                        placeholder="Enter your full name"
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="registrationNumber">Registration Number *</Label>
                                    <Input
                                        id="registrationNumber"
                                        placeholder="Enter your registration number"
                                        value={registrationNumber}
                                        onChange={(e) => setRegistrationNumber(e.target.value)}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="email">Email *</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="Enter your email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>

                                <div className="flex gap-3">
                                    <Button
                                        variant="outline"
                                        onClick={() => setStep("search")}
                                        className="flex-1"
                                    >
                                        Back
                                    </Button>
                                    <Button
                                        onClick={sendJoinRequest}
                                        disabled={isLoading}
                                        className="flex-1 gap-2"
                                    >
                                        {isLoading ? (
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                        ) : (
                                            <Send className="w-4 h-4" />
                                        )}
                                        Send Request
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}

                    {step === "success" && (
                        <div className="text-center py-8 space-y-4">
                            <div className="w-16 h-16 mx-auto rounded-full bg-green-500/20 flex items-center justify-center">
                                <CheckCircle className="w-8 h-8 text-green-500" />
                            </div>
                            <h3 className="font-cinzel text-xl text-foreground">Request Sent!</h3>
                            <p className="text-muted-foreground">
                                Your join request has been sent to <strong>{teamInfo?.leader_name}</strong>.
                                You will be notified once the team leader responds to your request.
                            </p>
                            <p className="text-sm text-muted-foreground">
                                Check your Activity page for updates.
                            </p>
                            <Button onClick={onBack} variant="outline" className="mt-4">
                                Back to Registration
                            </Button>
                        </div>
                    )}

                    {step === "already-requested" && (
                        <div className="text-center py-8 space-y-4">
                            <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center ${existingRequest?.status === "pending"
                                    ? "bg-yellow-500/20"
                                    : existingRequest?.status === "accepted"
                                        ? "bg-green-500/20"
                                        : "bg-red-500/20"
                                }`}>
                                {existingRequest?.status === "pending" ? (
                                    <Loader2 className="w-8 h-8 text-yellow-500" />
                                ) : existingRequest?.status === "accepted" ? (
                                    <CheckCircle className="w-8 h-8 text-green-500" />
                                ) : (
                                    <XCircle className="w-8 h-8 text-red-500" />
                                )}
                            </div>
                            <h3 className="font-cinzel text-xl text-foreground">
                                {existingRequest?.status === "pending"
                                    ? "Request Pending"
                                    : existingRequest?.status === "accepted"
                                        ? "Request Accepted"
                                        : "Request Declined"}
                            </h3>
                            <p className="text-muted-foreground">
                                {existingRequest?.status === "pending"
                                    ? "You have already sent a join request to this team. Please wait for the team leader to respond."
                                    : existingRequest?.status === "accepted"
                                        ? "Your request to join this team has been accepted! Check your Activity page for details."
                                        : "Unfortunately, the team leader has declined your join request."}
                            </p>
                            <Button onClick={onBack} variant="outline" className="mt-4">
                                Back to Registration
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default JoinTeamForm;
