import Navbar from "@/components/Navbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
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
    team_size?: number;
    checked_in?: boolean;
    created_at: string;
}

interface TeamMember {
    id: string;
    member_type: string;
    name: string;
    registration_number: string;
    present?: boolean;
    registration_id?: string;
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
    const [checkedInCount, setCheckedInCount] = useState(0);
    const [checkedInBreakdown, setCheckedInBreakdown] = useState<Record<number, number>>({ 1: 0, 2: 0, 3: 0, 4: 0 });
    const [checkedInTeams, setCheckedInTeams] = useState<any[]>([]);
    const [showCheckedInModal, setShowCheckedInModal] = useState(false);
    const [checkedInFilterSize, setCheckedInFilterSize] = useState<number | null>(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [detailsResult, setDetailsResult] = useState<SearchResult | null>(null);

    // Search states
    const [teamCodeSearch, setTeamCodeSearch] = useState("");
    const [regNumberSearch, setRegNumberSearch] = useState("");
    const [teamCodeResult, setTeamCodeResult] = useState<SearchResult | null>(null);
    const [regNumberResult, setRegNumberResult] = useState<SearchResult | null>(null);
    const [searchingTeamCode, setSearchingTeamCode] = useState(false);
    const [searchingRegNumber, setSearchingRegNumber] = useState(false);
    // Check-in modal states
    const [showCheckinModal, setShowCheckinModal] = useState(false);
    const [checkinPassword, setCheckinPassword] = useState("");
    const [passVerified, setPassVerified] = useState(false);
    const [checkinTeamCode, setCheckinTeamCode] = useState("");
    const [checkinResult, setCheckinResult] = useState<SearchResult | null>(null);
    const [updatingCheckin, setUpdatingCheckin] = useState(false);

    // Clear search functions
    const clearTeamCodeSearch = () => {
        setTeamCodeSearch("");
        setTeamCodeResult(null);
    };

    const clearRegNumberSearch = () => {
        setRegNumberSearch("");
        setRegNumberResult(null);
    };

    const openCheckinModal = () => {
        setCheckinPassword("");
        setPassVerified(false);
        setCheckinTeamCode("");
        setCheckinResult(null);
        setShowCheckinModal(true);
    };

    const closeCheckinModal = () => {
        setShowCheckinModal(false);
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

            // fetch checkin stats
            try {
                const { data: rcData, error: rcErr } = await supabase.from("registration_checkins").select("*");
                if (rcErr) {
                    console.warn("registration_checkins read error:", rcErr);
                }

                const checked = (rcData || []).filter((r: any) => r.checked_in);
                setCheckedInCount(checked.length);

                // breakdown
                const breakdown: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0 };
                const teamsList: any[] = [];

                for (const rc of checked) {
                    const teamSize = rc.team_size || 1;
                    if (teamSize >= 1 && teamSize <= 4) breakdown[teamSize] = (breakdown[teamSize] || 0) + 1;

                    // fetch registration details for this rc
                    const reg = (registrations || []).find((r) => r.id === rc.registration_id);
                    teamsList.push({ rc, registration: reg });
                }

                setCheckedInBreakdown(breakdown);
                setCheckedInTeams(teamsList);
            } catch (e) {
                console.warn("fetch checkin stats failed:", e);
            }
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

    // Open a read-only details modal for a registration id
    const openDetailsForReg = async (registrationId?: string) => {
        if (!registrationId) {
            toast({ title: "Error", description: "Missing registration id", variant: "destructive" });
            return;
        }

        try {
            // fetch registration
            const { data: registration, error: regErr } = await supabase
                .from("registrations")
                .select("*")
                .eq("id", registrationId)
                .maybeSingle();

            if (regErr || !registration) {
                toast({ title: "Not Found", description: "Registration not found.", variant: "destructive" });
                return;
            }

            // fetch team members
            const { data: members, error: membersErr } = await supabase
                .from("team_members")
                .select("*")
                .eq("registration_id", registrationId);

            if (membersErr) {
                console.warn("team_members fetch error:", membersErr);
            }

            const memberIds = (members || []).map((m: any) => m.id);

            // fetch checkin entries for these members
            const { data: memberCheckins, error: tmcErr } = await supabase
                .from("team_member_checkins")
                .select("*")
                .in("team_member_id", memberIds || []);

            if (tmcErr) {
                console.warn("team_member_checkins fetch error:", tmcErr);
            }

            // fetch registration_checkin row
            const { data: rcRow } = await supabase
                .from("registration_checkins")
                .select("*")
                .eq("registration_id", registrationId)
                .maybeSingle();

            // merge present flag into members
            const membersWithPresent = (members || []).map((m: any) => {
                const mc = (memberCheckins || []).find((c: any) => c.team_member_id === m.id);
                return { ...m, present: mc ? !!mc.present : !!m.present };
            });

            setDetailsResult({ registration, teamMembers: membersWithPresent, teamLeader: membersWithPresent.find((m: any) => m.member_type === 'leader') });
            setShowDetailsModal(true);
        } catch (err) {
            console.error("openDetailsForReg error:", err);
            toast({ title: "Error", description: "Failed to load team details.", variant: "destructive" });
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

    // Check-in flow: fetch by code for admin check-in
    const fetchForCheckin = async (code: string) => {
        if (!code.trim()) return;
        setCheckinResult(null);
        try {
            const { data: registration, error } = await supabase
                .from("registrations")
                .select("*")
                .eq("check_in_code", code.trim().toUpperCase())
                .single();

            if (error || !registration) {
                toast({ title: "Not Found", description: "No registration found with this team code.", variant: "destructive" });
                return;
            }

            // If already checked in, inform admin
            if (registration.checked_in) {
                toast({ title: "Already Checked In", description: `Team \"${registration.team_name || "Individual"}\" has already been checked in.`, variant: "default" });
            }

            const { data: teamMembers } = await supabase
                .from("team_members")
                .select("*")
                .eq("registration_id", registration.id);

            const leader = teamMembers?.find((m) => m.member_type === "leader");

            setCheckinResult({ registration, teamMembers: teamMembers || [], teamLeader: leader });
        } catch (err) {
            console.error("Checkin fetch error:", err);
            toast({ title: "Error", description: "Failed to fetch team.", variant: "destructive" });
        }
    };

    const verifyPassAndProceed = (pw: string) => {
        if (pw === "2511") {
            setPassVerified(true);
            toast({ title: "Pass Verified", description: "You can now enter a team code to check in." });
        } else {
            toast({ title: "Invalid Pass", description: "Incorrect passcode.", variant: "destructive" });
        }
    };

    const toggleMemberPresence = (id: string, present: boolean) => {
        if (!checkinResult) return;
        const updated = (checkinResult.teamMembers || []).map((m) => (m.id === id ? { ...m, present } : m));
        setCheckinResult({ ...checkinResult, teamMembers: updated });
    };

    const submitCheckin = async () => {
        if (!checkinResult || !checkinResult.registration) return;
        const reg = checkinResult.registration;
        setUpdatingCheckin(true);
        try {
            // Ensure there's a registration_checkins row for this registration (insert or update)
            let rcId: string | null = null;

            const { data: existingRC, error: existingRcErr } = await supabase
                .from("registration_checkins")
                .select("*")
                .eq("registration_id", reg.id)
                .maybeSingle();

            if (existingRcErr) {
                console.warn("Could not read registration_checkins:", existingRcErr);
            }

            const nowIso = new Date().toISOString();

            if (existingRC && existingRC.id) {
                rcId = existingRC.id;
                await supabase
                    .from("registration_checkins")
                    .update({ checked_in: true, checked_in_at: nowIso, updated_at: nowIso })
                    .eq("id", rcId);
            } else {
                const { data: insertedRC, error: insertRcErr } = await supabase
                    .from("registration_checkins")
                    .insert([
                        {
                            registration_id: reg.id,
                            check_in_code: reg.check_in_code,
                            checked_in: true,
                            checked_in_at: nowIso,
                            team_size: reg.team_size || 1,
                            created_at: nowIso,
                            updated_at: nowIso,
                        },
                    ])
                    .select()
                    .maybeSingle();

                if (insertRcErr) throw insertRcErr;
                rcId = insertedRC?.id || null;
            }

            // Upsert team_member_checkins for each member
            for (const m of checkinResult.teamMembers) {
                try {
                    const { data: existingTMc } = await supabase
                        .from("team_member_checkins")
                        .select("*")
                        .eq("team_member_id", m.id)
                        .maybeSingle();

                    if (existingTMc && existingTMc.id) {
                        await supabase
                            .from("team_member_checkins")
                            .update({ present: !!m.present, present_at: m.present ? nowIso : null, registration_checkin_id: rcId, updated_at: nowIso })
                            .eq("id", existingTMc.id);
                    } else {
                        await supabase.from("team_member_checkins").insert([
                            {
                                team_member_id: m.id,
                                registration_checkin_id: rcId,
                                present: !!m.present,
                                present_at: m.present ? nowIso : null,
                                created_at: nowIso,
                                updated_at: nowIso,
                            },
                        ]);
                    }
                } catch (innerErr) {
                    console.warn("team_member_checkins upsert error:", innerErr);
                }
            }

            // Also update legacy columns for compatibility (if present)
            try {
                await supabase.from("team_members").update({ present: true }).in("id", checkinResult.teamMembers.filter(m => m.present).map(m => m.id));
            } catch (e) {
                // ignore
            }

            try {
                await supabase.from("registrations").update({ checked_in: true }).eq("id", reg.id);
            } catch (e) {
                // ignore
            }

            toast({ title: "Checked In", description: `Team \"${reg.team_name || "Individual"}\" checked in.` });
            // refresh data
            fetchAllRegistrations();
            setShowCheckinModal(false);
        } catch (err) {
            console.error("Submit checkin error:", err);
            toast({ title: "Error", description: "Failed to update check-in.", variant: "destructive" });
        } finally {
            setUpdatingCheckin(false);
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

    const downloadCheckedIn = async () => {
        setIsDownloading(true);
        try {
            // fetch checked-in registration_checkins
            const { data: rcData, error: rcError } = await supabase
                .from("registration_checkins")
                .select("*")
                .eq("checked_in", true);

            if (rcError) throw rcError;

            if (!rcData || rcData.length === 0) {
                toast({ title: "No Checked-In Teams", description: "No teams have been checked in yet.", variant: "destructive" });
                setIsDownloading(false);
                return;
            }

            const registrationIds = rcData.map((r) => r.registration_id).filter(Boolean);

            // fetch registrations for those ids
            const { data: regs } = await supabase.from("registrations").select("*").in("id", registrationIds);

            // fetch present member checkins for these registration_checkin ids
            const rcIds = rcData.map((r) => r.id);
            const { data: tmCheckins } = await supabase
                .from("team_member_checkins")
                .select("*")
                .in("registration_checkin_id", rcIds)
                .eq("present", true);

            const memberIds = (tmCheckins || []).map((t) => t.team_member_id).filter(Boolean);

            const { data: presentMembers } = await supabase
                .from("team_members")
                .select("*")
                .in("id", memberIds);

            // create map for rcData by registration_id
            const rcByReg: Record<string, any> = {};
            for (const rc of rcData) rcByReg[rc.registration_id] = rc;

            // assemble rows: one row per checked-in registration, listing present members and team size
            const date = new Date().toISOString().split("T")[0];

            const rows = (regs || []).map((reg) => {
                const rc = rcByReg[reg.id] || {};
                const membersForReg = (presentMembers || []).filter((m) => m.registration_id === reg.id);
                const leader = membersForReg.find((m) => m.member_type === "leader");
                const others = membersForReg.filter((m) => m.member_type !== "leader");
                const teamSize = rc.team_size || reg.team_size || 1;

                return {
                    "Team Code": reg.check_in_code || "",
                    "Team Name": reg.team_name || "",
                    "Team Size": teamSize === 1 ? 'Solo' : teamSize === 2 ? 'Duo' : teamSize === 3 ? 'Trio' : 'Quadra',
                    "Event Type": reg.event_type,
                    "Leader Name": leader?.name || "",
                    "Leader Reg No": leader?.registration_number || "",
                    "Leader Email": reg.email,
                    "Leader Phone": reg.contact_number,
                    "Leader University": reg.university_name,
                    "Member 1 Name": others[0]?.name || "",
                    "Member 1 Reg No": others[0]?.registration_number || "",
                    "Member 2 Name": others[1]?.name || "",
                    "Member 2 Reg No": others[1]?.registration_number || "",
                    "Member 3 Name": others[2]?.name || "",
                    "Member 3 Reg No": others[2]?.registration_number || "",
                    "Checked In At": rc.checked_in_at ? new Date(rc.checked_in_at).toLocaleString() : "",
                };
            });

            if (rows.length === 0) {
                toast({ title: "No Data", description: "No present participants found for checked-in teams.", variant: "destructive" });
                setIsDownloading(false);
                return;
            }

            const worksheet = XLSX.utils.json_to_sheet(rows);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "Checked-In Teams");
            XLSX.writeFile(workbook, `techfluence_checked_in_${date}.xlsx`);

            toast({ title: "Downloaded!", description: `${rows.length} checked-in teams exported.` });
        } catch (error) {
            console.error("Checked-in download error:", error);
            toast({ title: "Error", description: "Failed to download checked-in teams.", variant: "destructive" });
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
                                    <h1 className="font-decorative text-3xl md:text-4xl tech-text-gradient mb-2">
                                        Admin Panel
                                    </h1>
                                    <p className="text-muted-foreground font-cinzel">
                                        Manage registrations and search participants
                                    </p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button onClick={openCheckinModal} variant="ghost" className="gap-2">
                                        <ShieldCheck className="w-4 h-4" />
                                        Check-In
                                    </Button>
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
                                            <DropdownMenuItem
                                                onClick={async () => {
                                                    // call the new checked-in download
                                                    await downloadCheckedIn();
                                                }}
                                                className="gap-2 cursor-pointer"
                                            >
                                                <FileSpreadsheet className="w-4 h-4" />
                                                <div>
                                                    <p className="font-medium">Checked-In Teams</p>
                                                    <p className="text-xs text-muted-foreground">Only teams/participants who were checked in</p>
                                                </div>
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
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
                                <Card>
                                    <CardContent className="pt-6">
                                        <div className="flex items-center gap-4">
                                            <div className="p-3 bg-emerald-500/10 rounded-lg">
                                                <ShieldCheck className="w-6 h-6 text-emerald-500" />
                                            </div>
                                            <div>
                                                <p className="text-sm text-muted-foreground">Checked-In Teams</p>
                                                <p className="text-2xl font-bold">{checkedInCount}</p>
                                                <div className="mt-2 flex gap-2">
                                                    <Button size="sm" onClick={() => setShowCheckedInModal(true)}>View</Button>
                                                    <Button size="sm" variant="outline" onClick={() => {
                                                        setCheckedInFilterSize(null);
                                                        setShowCheckedInModal(true);
                                                    }}>Breakdown</Button>
                                                </div>
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

                                {/* Checked-in Breakdown / Teams Modal */}
                                <Dialog open={showCheckedInModal} onOpenChange={(v) => setShowCheckedInModal(v)}>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>Checked-In Teams</DialogTitle>
                                            <DialogDescription>Breakdown by team size and team details.</DialogDescription>
                                        </DialogHeader>

                                        <div className="mt-4 space-y-4">
                                            <div className="flex gap-2">
                                                <Button onClick={() => setCheckedInFilterSize(1)}>Solo ({checkedInBreakdown[1] || 0})</Button>
                                                <Button onClick={() => setCheckedInFilterSize(2)}>Duo ({checkedInBreakdown[2] || 0})</Button>
                                                <Button onClick={() => setCheckedInFilterSize(3)}>Trio ({checkedInBreakdown[3] || 0})</Button>
                                                <Button onClick={() => setCheckedInFilterSize(4)}>Quadra ({checkedInBreakdown[4] || 0})</Button>
                                                <Button variant="outline" onClick={() => setCheckedInFilterSize(null)}>All ({checkedInCount})</Button>
                                            </div>

                                            <div>
                                                <p className="text-sm text-muted-foreground">Teams</p>
                                                <div className="space-y-2 mt-2 max-h-72 overflow-auto">
                                                    {(checkedInTeams || []).filter(t => !checkedInFilterSize || (t.rc.team_size || 1) === checkedInFilterSize).map((t, idx) => (
                                                        <div key={t.registration?.id || idx} className="p-3 bg-muted/30 rounded">
                                                            <div className="flex items-center justify-between">
                                                                <div>
                                                                    <p className="font-semibold">{t.registration?.team_name || t.registration?.full_name}</p>
                                                                    <p className="text-xs text-muted-foreground">Code: <span className="font-mono">{t.rc?.check_in_code}</span> — Size: {(() => { const s = t.rc?.team_size || t.registration?.team_size || 1; return s === 1 ? 'Solo' : s === 2 ? 'Duo' : s === 3 ? 'Trio' : 'Quadra'; })()}</p>
                                                                </div>
                                                                <div className="flex gap-2">
                                                                    <Button size="sm" onClick={() => openDetailsForReg(t.registration?.id)}>Details</Button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        <DialogFooter>
                                            <div className="flex gap-2 w-full">
                                                <Button variant="outline" onClick={() => setShowCheckedInModal(false)} className="flex-1">Close</Button>
                                            </div>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>

                                {/* Read-only Details Modal */}
                                <Dialog open={showDetailsModal} onOpenChange={(v) => setShowDetailsModal(v)}>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>Team Details</DialogTitle>
                                            <DialogDescription>View presence for each participant</DialogDescription>
                                        </DialogHeader>

                                        <div className="mt-4 space-y-4">
                                            {detailsResult ? (
                                                <div className="space-y-3">
                                                    <div className="flex items-center justify-between">
                                                        <div>
                                                            <p className="font-semibold">{detailsResult.registration.team_name || detailsResult.registration.full_name}</p>
                                                            <p className="text-xs text-muted-foreground">Code: <span className="font-mono">{detailsResult.registration.check_in_code}</span></p>
                                                        </div>
                                                        <div className="text-sm text-muted-foreground">Size: {(detailsResult.registration.team_size || 1) === 1 ? 'Solo' : (detailsResult.registration.team_size || 1) === 2 ? 'Duo' : (detailsResult.registration.team_size || 1) === 3 ? 'Trio' : 'Quadra'}</div>
                                                    </div>

                                                    <Separator />

                                                    <div className="space-y-2">
                                                        {(detailsResult.teamMembers || []).map((m) => (
                                                            <div key={m.id} className="flex items-center justify-between bg-muted/20 p-2 rounded">
                                                                <div>
                                                                    <p className="font-medium">{m.name}</p>
                                                                    <p className="text-xs text-muted-foreground">{m.registration_number}</p>
                                                                </div>
                                                                <div className={`text-sm font-medium ${m.present ? 'text-emerald-500' : 'text-red-500'}`}>
                                                                    {m.present ? 'Present' : 'Absent'}
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="text-center py-6">No details</div>
                                            )}
                                        </div>

                                        <DialogFooter>
                                            <div className="flex gap-2 w-full">
                                                <Button variant="outline" onClick={() => setShowDetailsModal(false)} className="flex-1">Close</Button>
                                            </div>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>

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

                            {/* Check-In Dialog */}
                            <Dialog open={showCheckinModal} onOpenChange={(open) => setShowCheckinModal(open)}>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>Admin Check-In</DialogTitle>
                                        <DialogDescription>Enter admin pass to begin check-in.</DialogDescription>
                                    </DialogHeader>

                                    <div className="mt-4 space-y-4">
                                        {!passVerified ? (
                                            <div className="space-y-2">
                                                <p className="text-sm text-muted-foreground">Enter admin pass</p>
                                                <div className="flex gap-2">
                                                    <Input
                                                        type="password"
                                                        placeholder="Admin Pass"
                                                        value={checkinPassword}
                                                        onChange={(e) => setCheckinPassword(e.target.value)}
                                                        onKeyDown={(e) => e.key === "Enter" && verifyPassAndProceed(checkinPassword)}
                                                    />
                                                    <Button onClick={() => verifyPassAndProceed(checkinPassword)}>Verify</Button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="space-y-2">
                                                <p className="text-sm text-muted-foreground">Enter Team Code to fetch registration</p>
                                                <div className="flex gap-2">
                                                    <Input
                                                        placeholder="Team Code (e.g., AB123)"
                                                        value={checkinTeamCode}
                                                        onChange={(e) => setCheckinTeamCode(e.target.value.toUpperCase())}
                                                        onKeyDown={(e) => e.key === "Enter" && fetchForCheckin(checkinTeamCode)}
                                                        className="font-mono uppercase"
                                                    />
                                                    <Button onClick={() => fetchForCheckin(checkinTeamCode)} disabled={!checkinTeamCode.trim()}>
                                                        Fetch
                                                    </Button>
                                                </div>

                                                {checkinResult && (
                                                    <div className="mt-3 space-y-3">
                                                        <div className="flex items-center justify-between">
                                                            <div>
                                                                <p className="font-semibold">{checkinResult.registration.team_name || checkinResult.registration.full_name}</p>
                                                                <p className="text-xs text-muted-foreground">Code: <span className="font-mono">{checkinResult.registration.check_in_code}</span></p>
                                                            </div>
                                                            <div className="text-sm text-muted-foreground">{checkinResult.registration.university_name}</div>
                                                        </div>

                                                        <Separator />

                                                        <div className="space-y-2">
                                                            <p className="text-sm text-muted-foreground">Members</p>
                                                            <div className="space-y-1">
                                                                {(checkinResult.teamMembers || []).map((m) => (
                                                                    <div key={m.id} className="flex items-center justify-between bg-muted/20 p-2 rounded">
                                                                        <div>
                                                                            <p className="font-medium">{m.name}</p>
                                                                            <p className="text-xs text-muted-foreground">{m.registration_number}</p>
                                                                        </div>
                                                                        <div className="flex items-center gap-2">
                                                                            <span className="text-xs text-muted-foreground">Present</span>
                                                                            <Switch
                                                                                checked={!!m.present}
                                                                                onCheckedChange={(val) => toggleMemberPresence(m.id, !!val)}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    <DialogFooter>
                                        <div className="flex gap-2 w-full">
                                            <Button variant="outline" onClick={() => setShowCheckinModal(false)} className="flex-1">Cancel</Button>
                                            <Button onClick={submitCheckin} disabled={!passVerified || !checkinResult || updatingCheckin} className="flex-1">
                                                {updatingCheckin ? <Loader2 className="w-4 h-4 animate-spin" /> : "Submit Check-In"}
                                            </Button>
                                        </div>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>

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
