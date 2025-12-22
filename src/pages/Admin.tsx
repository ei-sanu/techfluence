import Navbar from "@/components/Navbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { SignedIn, SignedOut, useUser } from "@clerk/clerk-react";
import {
    Calendar,
    ChevronDown,
    Code,
    Download,
    FileSpreadsheet,
    GraduationCap,
    Hash,
    Loader2,
    Lock,
    Mail,
    Phone,
    Search,
    ShieldCheck,
    User,
    Users,
    X
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";

// Admin email(s) that can access this panel
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

interface SearchResult {
    registration: Registration;
    teamMembers: TeamMember[];
    teamLeader?: TeamMember;
}

const Admin = () => {
    const { user, isLoaded } = useUser();
    const navigate = useNavigate();
    const [allRegistrations, setAllRegistrations] = useState<Registration[]>([]);
    const [allTeamMembers, setAllTeamMembers] = useState<Record<string, TeamMember[]>>({});
    const [loading, setLoading] = useState(true);
    const [isDownloading, setIsDownloading] = useState(false);

    // Search states
    const [teamCodeSearch, setTeamCodeSearch] = useState("");
    const [regNumberSearch, setRegNumberSearch] = useState("");
    const [teamCodeResult, setTeamCodeResult] = useState<SearchResult | null>(null);
    const [regNumberResult, setRegNumberResult] = useState<SearchResult | null>(null);
    const [searchingTeamCode, setSearchingTeamCode] = useState(false);
    const [searchingRegNumber, setSearchingRegNumber] = useState(false);

    // Clear search functions
    const clearTeamCodeSearch = () => {
        setTeamCodeSearch("");
        setTeamCodeResult(null);
    };

    const clearRegNumberSearch = () => {
        setRegNumberSearch("");
        setRegNumberResult(null);
    };

    const isAdmin =
        user?.primaryEmailAddress?.emailAddress &&
        ADMIN_EMAILS.includes(user.primaryEmailAddress.emailAddress);

    useEffect(() => {
        if (isLoaded && user && isAdmin) {
            fetchAllRegistrations();
        } else if (isLoaded && (!user || !isAdmin)) {
            setLoading(false);
        }
    }, [isLoaded, user, isAdmin]);

    const fetchAllRegistrations = async () => {
        try {
            setLoading(true);

            // Fetch all registrations
            const { data: registrations, error: regError } = await supabase
                .from("registrations")
                .select("*")
                .order("created_at", { ascending: false });

            if (regError) throw regError;

            setAllRegistrations(registrations || []);

            // Fetch all team members
            const { data: teamMembers, error: teamError } = await supabase
                .from("team_members")
                .select("*");

            if (teamError) throw teamError;

            // Group team members by registration_id
            const teamMembersByReg: Record<string, TeamMember[]> = {};
            teamMembers?.forEach((member) => {
                if (!teamMembersByReg[member.registration_id]) {
                    teamMembersByReg[member.registration_id] = [];
                }
                teamMembersByReg[member.registration_id].push(member);
            });

            setAllTeamMembers(teamMembersByReg);
        } catch (error) {
            console.error("Error fetching registrations:", error);
            toast({
                title: "Error",
                description: "Failed to fetch registrations.",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    const searchByTeamCode = async () => {
        if (!teamCodeSearch.trim()) {
            toast({
                title: "Enter Team Code",
                description: "Please enter a team code to search.",
                variant: "destructive",
            });
            return;
        }

        setSearchingTeamCode(true);
        setTeamCodeResult(null);

        try {
            const { data: registration, error } = await supabase
                .from("registrations")
                .select("*")
                .eq("check_in_code", teamCodeSearch.trim().toUpperCase())
                .single();

            if (error || !registration) {
                toast({
                    title: "Not Found",
                    description: "No registration found with this team code.",
                    variant: "destructive",
                });
                setSearchingTeamCode(false);
                return;
            }

            // Fetch team members
            const { data: teamMembers } = await supabase
                .from("team_members")
                .select("*")
                .eq("registration_id", registration.id);

            const leader = teamMembers?.find((m) => m.member_type === "leader");

            setTeamCodeResult({
                registration,
                teamMembers: teamMembers || [],
                teamLeader: leader,
            });

            toast({
                title: "Found!",
                description: `Team "${registration.team_name || "Individual"}" found.`,
            });
        } catch (error) {
            console.error("Search error:", error);
            toast({
                title: "Error",
                description: "Failed to search. Please try again.",
                variant: "destructive",
            });
        } finally {
            setSearchingTeamCode(false);
        }
    };

    const searchByRegNumber = async () => {
        if (!regNumberSearch.trim()) {
            toast({
                title: "Enter Registration Number",
                description: "Please enter a registration number to search.",
                variant: "destructive",
            });
            return;
        }

        setSearchingRegNumber(true);
        setRegNumberResult(null);

        try {
            // First search in registrations table
            const { data: directReg } = await supabase
                .from("registrations")
                .select("*")
                .eq("registration_number", regNumberSearch.trim().toUpperCase())
                .single();

            if (directReg) {
                // Found as main registrant
                const { data: teamMembers } = await supabase
                    .from("team_members")
                    .select("*")
                    .eq("registration_id", directReg.id);

                const leader = teamMembers?.find((m) => m.member_type === "leader");

                setRegNumberResult({
                    registration: directReg,
                    teamMembers: teamMembers || [],
                    teamLeader: leader,
                });

                toast({
                    title: "Found!",
                    description: `Participant "${directReg.full_name}" found.`,
                });
                setSearchingRegNumber(false);
                return;
            }

            // Search in team_members table
            const { data: teamMember, error: teamError } = await supabase
                .from("team_members")
                .select("*")
                .eq("registration_number", regNumberSearch.trim().toUpperCase())
                .single();

            if (teamError || !teamMember) {
                toast({
                    title: "Not Found",
                    description: "No participant found with this registration number.",
                    variant: "destructive",
                });
                setSearchingRegNumber(false);
                return;
            }

            // Get the registration this team member belongs to
            const { data: registration } = await supabase
                .from("registrations")
                .select("*")
                .eq("id", teamMember.registration_id)
                .single();

            if (!registration) {
                toast({
                    title: "Error",
                    description: "Could not find associated registration.",
                    variant: "destructive",
                });
                setSearchingRegNumber(false);
                return;
            }

            // Get all team members
            const { data: allMembers } = await supabase
                .from("team_members")
                .select("*")
                .eq("registration_id", registration.id);

            const leader = allMembers?.find((m) => m.member_type === "leader");

            setRegNumberResult({
                registration,
                teamMembers: allMembers || [],
                teamLeader: leader,
            });

            toast({
                title: "Found!",
                description: `Participant "${teamMember.name}" found in team "${registration.team_name}".`,
            });
        } catch (error) {
            console.error("Search error:", error);
            toast({
                title: "Error",
                description: "Failed to search. Please try again.",
                variant: "destructive",
            });
        } finally {
            setSearchingRegNumber(false);
        }
    };

    const downloadRegistrations = async (type: "full" | "teams") => {
        setIsDownloading(true);

        try {
            if (!allRegistrations || allRegistrations.length === 0) {
                toast({
                    title: "No Data",
                    description: "No registrations found in the database.",
                    variant: "destructive",
                });
                setIsDownloading(false);
                return;
            }

            const date = new Date().toISOString().split("T")[0];

            if (type === "teams") {
                // Team Details Only - Filter to hackathon/both registrations with teams
                const teamRegistrations = allRegistrations.filter(
                    (reg) => (reg.event_type === "hackathon" || reg.event_type === "both") && reg.team_name
                );

                if (teamRegistrations.length === 0) {
                    toast({
                        title: "No Teams Found",
                        description: "No team registrations found in the database.",
                        variant: "destructive",
                    });
                    setIsDownloading(false);
                    return;
                }

                const teamData = teamRegistrations.map((reg) => {
                    const members = allTeamMembers[reg.id] || [];
                    const leader = members.find((m) => m.member_type === "leader");
                    const otherMembers = members.filter((m) => m.member_type !== "leader");

                    return {
                        "Team Code": reg.check_in_code || "",
                        "Team Name": reg.team_name || "",
                        "Event Type": reg.event_type,
                        "Leader Name": leader?.name || "",
                        "Leader Reg No": leader?.registration_number || "",
                        "Leader Email": reg.email,
                        "Leader Phone": reg.contact_number,
                        "Leader University": reg.university_name,
                        "Leader Course": reg.course,
                        "Leader Year": reg.year_of_study,
                        "Member 1 Name": otherMembers[0]?.name || "",
                        "Member 1 Reg No": otherMembers[0]?.registration_number || "",
                        "Member 2 Name": otherMembers[1]?.name || "",
                        "Member 2 Reg No": otherMembers[1]?.registration_number || "",
                        "Member 3 Name": otherMembers[2]?.name || "",
                        "Member 3 Reg No": otherMembers[2]?.registration_number || "",
                        "Registered At": new Date(reg.created_at).toLocaleString(),
                    };
                });

                const worksheet = XLSX.utils.json_to_sheet(teamData);
                const workbook = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(workbook, worksheet, "Team Details");
                XLSX.writeFile(workbook, `techfluence_team_details_${date}.xlsx`);

                toast({
                    title: "Downloaded!",
                    description: `${teamRegistrations.length} team details exported successfully.`,
                });
            } else {
                // Full Registration Sheet
                const excelData = allRegistrations.map((reg) => {
                    const members = allTeamMembers[reg.id] || [];
                    const leader = members.find((m) => m.member_type === "leader");
                    const otherMembers = members.filter((m) => m.member_type !== "leader");

                    return {
                        "Team Code": reg.check_in_code || "",
                        "Full Name": reg.full_name,
                        "Registration Number": reg.registration_number,
                        University: reg.university_name,
                        Email: reg.email,
                        "Contact Number": reg.contact_number,
                        Course: reg.course,
                        "Year of Study": reg.year_of_study,
                        "Event Type": reg.event_type,
                        Address: reg.address,
                        City: reg.city,
                        Pincode: reg.pincode,
                        "Technical Skills": reg.technical_skills || "",
                        "Team Name": reg.team_name || "",
                        "Team Leader": leader?.name || "",
                        "Team Leader Reg No": leader?.registration_number || "",
                        "Member 1": otherMembers[0]?.name || "",
                        "Member 1 Reg No": otherMembers[0]?.registration_number || "",
                        "Member 2": otherMembers[1]?.name || "",
                        "Member 2 Reg No": otherMembers[1]?.registration_number || "",
                        "Member 3": otherMembers[2]?.name || "",
                        "Member 3 Reg No": otherMembers[2]?.registration_number || "",
                        "Registered At": new Date(reg.created_at).toLocaleString(),
                    };
                });

                const worksheet = XLSX.utils.json_to_sheet(excelData);
                const workbook = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(workbook, worksheet, "Registrations");
                XLSX.writeFile(workbook, `techfluence_registrations_${date}.xlsx`);

                toast({
                    title: "Downloaded!",
                    description: `${allRegistrations.length} registrations exported successfully.`,
                });
            }
        } catch (error) {
            console.error("Download error:", error);
            toast({
                title: "Error",
                description: "Failed to download registrations.",
                variant: "destructive",
            });
        } finally {
            setIsDownloading(false);
        }
    };

    const getMemberTypeLabel = (type: string) => {
        switch (type) {
            case "leader":
                return "Team Leader";
            case "member1":
                return "Member 1";
            case "member2":
                return "Member 2";
            case "member3":
                return "Member 3";
            default:
                return type;
        }
    };

    const getEventBadge = (eventType: string) => {
        switch (eventType) {
            case "hackathon":
                return <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">Hackathon</Badge>;
            case "event":
                return <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">Events Only</Badge>;
            case "both":
                return <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Both</Badge>;
            default:
                return <Badge variant="outline">{eventType}</Badge>;
        }
    };

    // Not authenticated
    if (!isLoaded) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <>
            <Navbar />
            <SignedOut>
                <div className="min-h-screen flex items-center justify-center pt-20 px-4">
                    <Card className="max-w-md w-full">
                        <CardContent className="pt-6 text-center">
                            <Lock className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                            <h2 className="font-cinzel text-2xl mb-2">Admin Access Required</h2>
                            <p className="text-muted-foreground mb-6">Please sign in to access the admin panel.</p>
                            <Link to="/auth">
                                <Button className="w-full">Sign In</Button>
                            </Link>
                        </CardContent>
                    </Card>
                </div>
            </SignedOut>

            <SignedIn>
                {!isAdmin ? (
                    <div className="min-h-screen flex items-center justify-center pt-20 px-4">
                        <Card className="max-w-md w-full">
                            <CardContent className="pt-6 text-center">
                                <ShieldCheck className="w-16 h-16 mx-auto text-red-500 mb-4" />
                                <h2 className="font-cinzel text-2xl mb-2">Access Denied</h2>
                                <p className="text-muted-foreground mb-6">
                                    You don't have permission to access the admin panel.
                                </p>
                                <Link to="/">
                                    <Button variant="outline">Go Back Home</Button>
                                </Link>
                            </CardContent>
                        </Card>
                    </div>
                ) : (
                    <div className="min-h-screen pt-24 pb-16 px-4">
                        <div className="container mx-auto max-w-6xl">
                            {/* Header */}
                            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
                                <div>
                                    <h1 className="font-decorative text-3xl md:text-4xl royal-text-gradient mb-2">
                                        Admin Panel
                                    </h1>
                                    <p className="text-muted-foreground font-cinzel">
                                        Manage registrations and search participants
                                    </p>
                                </div>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button
                                            disabled={isDownloading || loading}
                                            className="gap-2"
                                        >
                                            {isDownloading ? (
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                            ) : (
                                                <Download className="w-4 h-4" />
                                            )}
                                            Download
                                            <ChevronDown className="w-4 h-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-56">
                                        <DropdownMenuItem
                                            onClick={() => downloadRegistrations("full")}
                                            className="gap-2 cursor-pointer"
                                        >
                                            <FileSpreadsheet className="w-4 h-4" />
                                            <div>
                                                <p className="font-medium">Entire Registration Sheet</p>
                                                <p className="text-xs text-muted-foreground">
                                                    All {allRegistrations.length} registrations
                                                </p>
                                            </div>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            onClick={() => downloadRegistrations("teams")}
                                            className="gap-2 cursor-pointer"
                                        >
                                            <Users className="w-4 h-4" />
                                            <div>
                                                <p className="font-medium">Team Details Only</p>
                                                <p className="text-xs text-muted-foreground">
                                                    Team name, code, leader & members
                                                </p>
                                            </div>
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>

                            {/* Stats Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                                <Card>
                                    <CardContent className="pt-6">
                                        <div className="flex items-center gap-4">
                                            <div className="p-3 bg-primary/10 rounded-lg">
                                                <Users className="w-6 h-6 text-primary" />
                                            </div>
                                            <div>
                                                <p className="text-sm text-muted-foreground">Total Registrations</p>
                                                <p className="text-2xl font-bold">{allRegistrations.length}</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardContent className="pt-6">
                                        <div className="flex items-center gap-4">
                                            <div className="p-3 bg-purple-500/10 rounded-lg">
                                                <Code className="w-6 h-6 text-purple-500" />
                                            </div>
                                            <div>
                                                <p className="text-sm text-muted-foreground">Hackathon</p>
                                                <p className="text-2xl font-bold">
                                                    {allRegistrations.filter((r) => r.event_type === "hackathon" || r.event_type === "both").length}
                                                </p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardContent className="pt-6">
                                        <div className="flex items-center gap-4">
                                            <div className="p-3 bg-blue-500/10 rounded-lg">
                                                <Calendar className="w-6 h-6 text-blue-500" />
                                            </div>
                                            <div>
                                                <p className="text-sm text-muted-foreground">Events Only</p>
                                                <p className="text-2xl font-bold">
                                                    {allRegistrations.filter((r) => r.event_type === "event").length}
                                                </p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardContent className="pt-6">
                                        <div className="flex items-center gap-4">
                                            <div className="p-3 bg-green-500/10 rounded-lg">
                                                <GraduationCap className="w-6 h-6 text-green-500" />
                                            </div>
                                            <div>
                                                <p className="text-sm text-muted-foreground">Both Events</p>
                                                <p className="text-2xl font-bold">
                                                    {allRegistrations.filter((r) => r.event_type === "both").length}
                                                </p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Search Section */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                                {/* Search by Team Code */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2 font-cinzel">
                                            <Hash className="w-5 h-5 text-primary" />
                                            Search by Team Code
                                        </CardTitle>
                                        <CardDescription>
                                            Enter the 5-digit team code to find team details
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="flex gap-2">
                                            <div className="relative flex-1">
                                                <Input
                                                    placeholder="Enter Team Code (e.g., AB123)"
                                                    value={teamCodeSearch}
                                                    onChange={(e) => setTeamCodeSearch(e.target.value.toUpperCase())}
                                                    onKeyDown={(e) => e.key === "Enter" && searchByTeamCode()}
                                                    className="font-mono uppercase pr-8"
                                                />
                                                {(teamCodeSearch || teamCodeResult) && (
                                                    <button
                                                        onClick={clearTeamCodeSearch}
                                                        className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                                    >
                                                        <X className="w-4 h-4" />
                                                    </button>
                                                )}
                                            </div>
                                            <Button onClick={searchByTeamCode} disabled={searchingTeamCode}>
                                                {searchingTeamCode ? (
                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                ) : (
                                                    <Search className="w-4 h-4" />
                                                )}
                                            </Button>
                                        </div>

                                        {/* Team Code Result */}
                                        {teamCodeResult && (
                                            <div className="mt-4 p-4 bg-muted/50 rounded-lg space-y-3">
                                                <div className="flex items-center justify-between">
                                                    <h4 className="font-semibold">{teamCodeResult.registration.team_name || "Individual Registration"}</h4>
                                                    {getEventBadge(teamCodeResult.registration.event_type)}
                                                </div>
                                                <Separator />
                                                <div className="grid grid-cols-2 gap-2 text-sm">
                                                    <div>
                                                        <p className="text-muted-foreground">Team Code</p>
                                                        <p className="font-mono font-bold text-primary">{teamCodeResult.registration.check_in_code}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-muted-foreground">University</p>
                                                        <p>{teamCodeResult.registration.university_name}</p>
                                                    </div>
                                                </div>
                                                {teamCodeResult.teamLeader && (
                                                    <div className="bg-primary/10 p-3 rounded-lg">
                                                        <p className="text-xs text-muted-foreground mb-1">Team Leader</p>
                                                        <p className="font-semibold">{teamCodeResult.teamLeader.name}</p>
                                                        <p className="text-sm text-muted-foreground">Reg: {teamCodeResult.teamLeader.registration_number}</p>
                                                        <div className="flex items-center gap-2 mt-2 text-sm">
                                                            <Phone className="w-3 h-3" />
                                                            <span>{teamCodeResult.registration.contact_number}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2 text-sm">
                                                            <Mail className="w-3 h-3" />
                                                            <span>{teamCodeResult.registration.email}</span>
                                                        </div>
                                                    </div>
                                                )}
                                                {teamCodeResult.teamMembers.filter(m => m.member_type !== "leader").length > 0 && (
                                                    <div>
                                                        <p className="text-xs text-muted-foreground mb-2">Team Members</p>
                                                        <div className="space-y-1">
                                                            {teamCodeResult.teamMembers
                                                                .filter((m) => m.member_type !== "leader")
                                                                .map((member) => (
                                                                    <div key={member.id} className="flex justify-between text-sm bg-muted/30 p-2 rounded">
                                                                        <span>{member.name}</span>
                                                                        <span className="text-muted-foreground">{member.registration_number}</span>
                                                                    </div>
                                                                ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>

                                {/* Search by Registration Number */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2 font-cinzel">
                                            <User className="w-5 h-5 text-primary" />
                                            Search by Registration Number
                                        </CardTitle>
                                        <CardDescription>
                                            Enter participant's registration number to find their details
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="flex gap-2">
                                            <div className="relative flex-1">
                                                <Input
                                                    placeholder="Enter Registration Number"
                                                    value={regNumberSearch}
                                                    onChange={(e) => setRegNumberSearch(e.target.value.toUpperCase())}
                                                    onKeyDown={(e) => e.key === "Enter" && searchByRegNumber()}
                                                    className="font-mono uppercase pr-8"
                                                />
                                                {(regNumberSearch || regNumberResult) && (
                                                    <button
                                                        onClick={clearRegNumberSearch}
                                                        className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                                    >
                                                        <X className="w-4 h-4" />
                                                    </button>
                                                )}
                                            </div>
                                            <Button onClick={searchByRegNumber} disabled={searchingRegNumber}>
                                                {searchingRegNumber ? (
                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                ) : (
                                                    <Search className="w-4 h-4" />
                                                )}
                                            </Button>
                                        </div>

                                        {/* Registration Number Result */}
                                        {regNumberResult && (
                                            <div className="mt-4 p-4 bg-muted/50 rounded-lg space-y-3">
                                                <div className="flex items-center justify-between">
                                                    <h4 className="font-semibold">{regNumberResult.registration.full_name}</h4>
                                                    {getEventBadge(regNumberResult.registration.event_type)}
                                                </div>
                                                <Separator />
                                                <div className="grid grid-cols-2 gap-2 text-sm">
                                                    <div>
                                                        <p className="text-muted-foreground">Registration No</p>
                                                        <p className="font-mono">{regNumberResult.registration.registration_number}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-muted-foreground">Team Code</p>
                                                        <p className="font-mono font-bold text-primary">{regNumberResult.registration.check_in_code}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-muted-foreground">Team Name</p>
                                                        <p>{regNumberResult.registration.team_name || "Individual"}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-muted-foreground">University</p>
                                                        <p>{regNumberResult.registration.university_name}</p>
                                                    </div>
                                                </div>
                                                {regNumberResult.teamLeader && (
                                                    <div className="bg-primary/10 p-3 rounded-lg">
                                                        <p className="text-xs text-muted-foreground mb-1">Team Leader Contact</p>
                                                        <p className="font-semibold">{regNumberResult.teamLeader.name}</p>
                                                        <div className="flex items-center gap-2 mt-2 text-sm">
                                                            <Phone className="w-3 h-3" />
                                                            <span>{regNumberResult.registration.contact_number}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2 text-sm">
                                                            <Mail className="w-3 h-3" />
                                                            <span>{regNumberResult.registration.email}</span>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            </div>

                            {/* All Registrations Table */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="font-cinzel">All Registrations</CardTitle>
                                    <CardDescription>
                                        Complete list of all registered participants
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    {loading ? (
                                        <div className="flex items-center justify-center py-12">
                                            <Loader2 className="w-8 h-8 animate-spin text-primary" />
                                        </div>
                                    ) : allRegistrations.length === 0 ? (
                                        <div className="text-center py-12">
                                            <Users className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                                            <p className="text-muted-foreground">No registrations found</p>
                                        </div>
                                    ) : (
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-sm">
                                                <thead>
                                                    <tr className="border-b">
                                                        <th className="text-left py-3 px-2">Team Code</th>
                                                        <th className="text-left py-3 px-2">Name</th>
                                                        <th className="text-left py-3 px-2">Team</th>
                                                        <th className="text-left py-3 px-2">University</th>
                                                        <th className="text-left py-3 px-2">Event</th>
                                                        <th className="text-left py-3 px-2">Contact</th>
                                                        <th className="text-left py-3 px-2">Date</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {allRegistrations.map((reg) => (
                                                        <tr key={reg.id} className="border-b hover:bg-muted/50 transition-colors">
                                                            <td className="py-3 px-2">
                                                                <span className="font-mono font-bold text-primary">{reg.check_in_code}</span>
                                                            </td>
                                                            <td className="py-3 px-2">
                                                                <div>
                                                                    <p className="font-medium">{reg.full_name}</p>
                                                                    <p className="text-xs text-muted-foreground">{reg.registration_number}</p>
                                                                </div>
                                                            </td>
                                                            <td className="py-3 px-2">{reg.team_name || "-"}</td>
                                                            <td className="py-3 px-2">
                                                                <p className="max-w-[150px] truncate">{reg.university_name}</p>
                                                            </td>
                                                            <td className="py-3 px-2">{getEventBadge(reg.event_type)}</td>
                                                            <td className="py-3 px-2">
                                                                <p className="text-xs">{reg.contact_number}</p>
                                                                <p className="text-xs text-muted-foreground truncate max-w-[120px]">{reg.email}</p>
                                                            </td>
                                                            <td className="py-3 px-2 text-xs text-muted-foreground">
                                                                {new Date(reg.created_at).toLocaleDateString()}
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                )}
            </SignedIn>
        </>
    );
};

export default Admin;
