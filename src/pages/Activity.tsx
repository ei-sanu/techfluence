import Navbar from "@/components/Navbar";
import NotAuthenticated from "@/components/NotAuthenticated";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { SignedIn, SignedOut, useUser } from "@clerk/clerk-react";
import { Calendar, Check, Code, GraduationCap, Loader2, MapPin, Plus, RotateCcw, Scroll, Ticket, UserPlus, Users, X, XCircle } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import QRCode from "react-qr-code";
import { Link, useNavigate } from "react-router-dom";

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

interface JoinRequest {
  id: string;
  team_code: string;
  requester_name: string;
  requester_registration_number: string;
  requester_email: string;
  status: "pending" | "accepted" | "rejected";
  created_at: string;
  leader_registration_id: string;
  // For user's own requests
  team_name?: string;
  leader_name?: string;
}

// Ticket Modal Component
const TicketModal = ({
  registration,
  teamMembers,
  isOpen,
  onClose,
}: {
  registration: Registration;
  teamMembers: TeamMember[];
  isOpen: boolean;
  onClose: () => void;
}) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      setIsFlipped(false);
      onClose();
    }, 300);
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (cardRef.current && !cardRef.current.contains(e.target as Node)) {
      handleClose();
    }
  };

  const formatIssueDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  if (!isOpen) return null;

  const leader = teamMembers.find((m) => m.member_type === "leader");
  const members = teamMembers.filter((m) => m.member_type !== "leader");

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300 ${isClosing ? "opacity-0" : "opacity-100"
        }`}
      onClick={handleBackdropClick}
    >
      {/* Blurred Background */}
      <div className="absolute inset-0 bg-background/80 backdrop-blur-md" />

      {/* Card Container */}
      <div
        ref={cardRef}
        className={`relative w-full max-w-lg transition-all duration-500 transform ${isClosing ? "scale-75 opacity-0 rotate-12" : "scale-100 opacity-100 rotate-0"
          } ${!isClosing && isOpen ? "animate-ticket-pop" : ""}`}
        style={{
          perspective: "1000px",
        }}
      >
        {/* Flip Container */}
        <div
          className="relative w-full transition-transform duration-700 ease-in-out"
          style={{
            transformStyle: "preserve-3d",
            transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
          }}
        >
          {/* Front Side */}
          <div
            className="w-full rounded-2xl overflow-hidden shadow-2xl"
            style={{
              backfaceVisibility: "hidden",
            }}
          >
            <div className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-1">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-transparent to-primary/20" />
              <div className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-xl overflow-hidden">
                {/* Card Header */}
                <div className="bg-gradient-to-r from-primary/30 via-primary/20 to-primary/30 px-6 py-4 border-b border-primary/30">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-decorative text-xl text-white dark:text-primary tracking-wide">TECH FLUENCE</h3>
                      <p className="text-xs text-white/70 dark:text-white/70 font-sans tracking-widest">6.0 • EVENT PASS</p>
                    </div>
                    <div className="text-right">
                      <Ticket className="w-8 h-8 text-white dark:text-primary" />
                    </div>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-4 sm:p-6 flex flex-col sm:flex-row gap-4 sm:gap-6">
                  {/* Left - Details */}
                  <div className="flex-1 space-y-3 sm:space-y-4">
                    <div>
                      <p className="text-xs text-white/60 dark:text-muted-foreground uppercase tracking-widest mb-1">Team Name</p>
                      <p className="font-cinzel text-base sm:text-lg text-white dark:text-foreground font-semibold">
                        {registration.team_name || "Individual"}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-white/60 dark:text-muted-foreground uppercase tracking-widest mb-1">Team Code</p>
                      <p className="font-mono text-xl sm:text-2xl text-orange-400 dark:text-primary font-bold tracking-[0.2em] sm:tracking-[0.3em]">
                        {registration.check_in_code || "N/A"}
                      </p>
                    </div>

                    <div className="flex gap-4">
                      <div>
                        <p className="text-xs text-white/60 dark:text-muted-foreground uppercase tracking-widest mb-1">Event</p>
                        <p className="text-sm text-white dark:text-foreground capitalize">
                          {registration.event_type === "both" ? "Event + Hackathon" : registration.event_type}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-white/60 dark:text-muted-foreground uppercase tracking-widest mb-1">Seat</p>
                        <p className="text-sm text-orange-400 dark:text-primary font-bold">P E N D I N G !!</p>
                      </div>
                    </div>
                  </div>

                  {/* Right - QR Code */}
                  <div className="flex flex-row sm:flex-col items-center justify-center sm:justify-start gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-primary/20">
                    <div className="bg-white p-2 sm:p-3 rounded-xl shadow-inner">
                      <QRCode
                        value={JSON.stringify({
                          code: registration.check_in_code,
                          team: registration.team_name,
                          name: registration.full_name,
                          event: registration.event_type,
                        })}
                        size={80}
                        level="M"
                      />
                    </div>
                    <p className="text-xs text-white/60 dark:text-muted-foreground text-center">Scan at Entry</p>
                  </div>
                </div>

                {/* Card Footer */}
                <div className="px-6 py-4 bg-gradient-to-r from-primary/10 via-transparent to-primary/10 border-t border-primary/20 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-white/60 dark:text-muted-foreground">Valid until</p>
                    <p className="text-sm text-white dark:text-foreground font-semibold">05 Feb 2026</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsFlipped(true)}
                    className="gap-2 text-white dark:text-primary hover:text-white dark:hover:text-primary hover:bg-white/10 dark:hover:bg-primary/10"
                  >
                    <RotateCcw className="w-4 h-4" />
                    View Team
                  </Button>
                </div>

                {/* Decorative Elements */}
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-8 bg-background rounded-r-full" />
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-8 bg-background rounded-l-full" />
              </div>
            </div>
          </div>

          {/* Back Side - Futuristic Design */}
          <div
            className="absolute inset-0 w-full rounded-2xl overflow-hidden shadow-2xl"
            style={{
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
            }}
          >
            <div className="relative bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-1 h-full">
              {/* Futuristic grid overlay */}
              <div className="absolute inset-0 opacity-10" style={{
                backgroundImage: `linear-gradient(rgba(249,115,22,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(249,115,22,0.3) 1px, transparent 1px)`,
                backgroundSize: '20px 20px'
              }} />
              <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-primary/10" />

              <div className="relative bg-gradient-to-br from-slate-950/90 via-slate-900/90 to-slate-950/90 rounded-xl overflow-hidden h-full flex flex-col">
                {/* Back Header */}
                <div className="bg-gradient-to-r from-primary/40 via-primary/20 to-primary/40 px-6 py-3 border-b border-primary/40 flex-shrink-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                      <div>
                        <h3 className="font-decorative text-lg text-primary tracking-widest">PASS DETAILS</h3>
                        <p className="text-xs text-white font-mono">{registration.team_name || "Individual"}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                      <span className="text-xs text-green-500 font-mono">ACTIVE</span>
                    </div>
                  </div>
                </div>

                {/* Team Members Grid - No Scroll */}
                <div className="flex-1 p-4">
                  <div className="grid grid-cols-2 gap-3 h-full">
                    {/* Leader Card */}
                    {leader && (
                      <div className="relative bg-gradient-to-br from-primary/20 to-primary/5 rounded-lg p-3 border border-primary/40 overflow-hidden">
                        <div className="absolute top-0 right-0 w-16 h-16 bg-primary/10 rounded-full -translate-y-1/2 translate-x-1/2" />
                        <div className="relative">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-6 h-6 rounded-full bg-primary/30 flex items-center justify-center">
                              <span className="text-xs font-bold text-primary">L</span>
                            </div>
                            <span className="text-[10px] text-primary font-mono tracking-wider">LEADER</span>
                          </div>
                          <p className="font-semibold text-white text-sm truncate">{leader.name}</p>
                          <p className="text-[10px] text-white/60 dark:text-muted-foreground font-mono">{leader.registration_number}</p>
                        </div>
                      </div>
                    )}

                    {/* Member Cards */}
                    {members.slice(0, 3).map((member, index) => (
                      <div key={member.id} className="relative bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-lg p-3 border border-slate-700/50 overflow-hidden">
                        <div className="absolute top-0 right-0 w-12 h-12 bg-slate-700/20 rounded-full -translate-y-1/2 translate-x-1/2" />
                        <div className="relative">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-6 h-6 rounded-full bg-slate-700/50 flex items-center justify-center">
                              <span className="text-xs font-bold text-white/60 dark:text-muted-foreground">{index + 1}</span>
                            </div>
                            <span className="text-[10px] text-white/60 dark:text-muted-foreground font-mono tracking-wider">MEMBER</span>
                          </div>
                          <p className="font-semibold text-white dark:text-foreground text-sm truncate">{member.name}</p>
                          <p className="text-[10px] text-white/60 dark:text-muted-foreground font-mono">{member.registration_number}</p>
                        </div>
                      </div>
                    ))}

                    {/* Individual Registration */}
                    {teamMembers.length === 0 && (
                      <div className="col-span-2 flex flex-col items-center justify-center py-4 text-white/60 dark:text-muted-foreground">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                          <Users className="w-6 h-6 text-orange-400/50 dark:text-primary/50" />
                        </div>
                        <p className="text-sm">Individual Registration</p>
                        <p className="text-xs text-orange-400 dark:text-primary font-semibold">{registration.full_name}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Back Footer with Dates */}
                <div className="px-4 py-3 bg-gradient-to-r from-slate-800/50 via-slate-900/50 to-slate-800/50 border-t border-slate-700/50 flex items-center justify-between flex-shrink-0">
                  <div className="flex gap-6">
                    <div>
                      <p className="text-[10px] text-white/50 dark:text-muted-foreground font-mono uppercase tracking-wider">Issue</p>
                      <p className="text-xs text-white dark:text-foreground font-semibold">{formatIssueDate(registration.created_at)}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-white/50 dark:text-muted-foreground font-mono uppercase tracking-wider">Expiry</p>
                      <p className="text-xs text-white dark:text-foreground font-semibold">05 Feb 2026</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsFlipped(false)}
                    className="gap-1.5 text-white dark:text-primary hover:text-white dark:hover:text-primary hover:bg-white/10 dark:hover:bg-primary/10 text-xs h-8"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    Flip
                  </Button>
                </div>

                {/* Decorative Elements */}
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-8 bg-background rounded-r-full" />
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-8 bg-background rounded-l-full" />
              </div>
            </div>
          </div>
        </div>

        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute -top-12 right-0 p-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      <style>{`
        @keyframes ticket-pop {
          0% {
            transform: scale(0.3) rotateZ(-15deg);
            opacity: 0;
          }
          50% {
            transform: scale(1.05) rotateZ(2deg);
          }
          75% {
            transform: scale(0.95) rotateZ(-1deg);
          }
          100% {
            transform: scale(1) rotateZ(0deg);
            opacity: 1;
          }
        }
        .animate-ticket-pop {
          animation: ticket-pop 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
      `}</style>
    </div>
  );
};

// Landscape Event Pass Component for inline display
const LandscapeEventPass = ({
  registration,
  teamMembers,
  onViewTicket,
}: {
  registration: Registration;
  teamMembers: TeamMember[];
  onViewTicket: () => void;
}) => {
  const leader = teamMembers.find((m) => m.member_type === "leader");

  return (
    <div className="relative mt-4 rounded-xl overflow-hidden bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 p-[2px]">
      {/* Gradient border effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/50 via-primary/20 to-primary/50 opacity-50" />

      <div className="relative bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-[10px] overflow-hidden">
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: `linear-gradient(rgba(249,115,22,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(249,115,22,0.5) 1px, transparent 1px)`,
          backgroundSize: '30px 30px'
        }} />

        {/* Mobile Layout (stacked) */}
        <div className="relative flex flex-col sm:hidden">
          {/* Top Section - Event Pass Label */}
          <div className="bg-gradient-to-r from-primary/30 to-primary/10 px-4 py-3 flex items-center justify-between border-b border-primary/30">
            <div className="flex items-center gap-2">
              <Ticket className="w-5 h-5 text-orange-400 dark:text-primary" />
              <p className="text-xs text-white dark:text-primary font-mono tracking-widest">EVENT PASS</p>
            </div>
            <div className="flex items-center gap-2 text-xs text-white/60 dark:text-slate-400">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
              <span>Active</span>
            </div>
          </div>

          {/* Middle Section - Details */}
          <div className="p-4 flex items-center gap-4">
            <div className="flex-1 space-y-2">
              <div>
                <p className="text-[10px] text-white/60 dark:text-slate-400 uppercase tracking-widest">Team</p>
                <p className="font-cinzel text-base text-white dark:text-white font-semibold">{registration.team_name || "Individual"}</p>
              </div>
              <div>
                <p className="text-[10px] text-white/60 dark:text-slate-400 uppercase tracking-widest">Code</p>
                <p className="font-mono text-lg text-orange-400 dark:text-primary font-bold tracking-widest">{registration.check_in_code}</p>
              </div>
              <div className="text-xs text-white/60 dark:text-slate-400 space-y-1">
                <p>Valid until 05 Feb 2026</p>
                {leader && <p>Leader: {leader.name}</p>}
              </div>
            </div>

            {/* Barcode */}
            <div className="bg-white px-2 py-3 rounded-lg shadow-lg shrink-0 flex flex-col items-center">
              <div className="flex gap-[2px] h-12">
                {(registration.check_in_code || "TECH2026").split('').map((char, i) => (
                  <div
                    key={i}
                    className="bg-black"
                    style={{
                      width: (char.charCodeAt(0) % 3) + 2 + 'px',
                      height: '100%',
                    }}
                  />
                ))}
                {[...Array(8)].map((_, i) => (
                  <div
                    key={`extra-${i}`}
                    className="bg-black"
                    style={{
                      width: ((i * 7) % 3) + 1 + 'px',
                      height: '100%',
                    }}
                  />
                ))}
              </div>
              <p className="text-[8px] font-mono text-black mt-1 tracking-widest">{registration.check_in_code}</p>
            </div>
          </div>

          {/* Bottom Section - View Button */}
          <div className="bg-gradient-to-r from-primary/20 to-primary/5 px-4 py-2 border-t border-primary/30">
            <Button
              onClick={onViewTicket}
              variant="ghost"
              size="sm"
              className="w-full gap-2 text-white dark:text-primary hover:text-white dark:hover:text-primary hover:bg-white/10 dark:hover:bg-primary/20"
            >
              <Ticket className="w-4 h-4" />
              <span className="text-xs font-mono">VIEW FULL TICKET</span>
            </Button>
          </div>
        </div>

        {/* Desktop Layout (horizontal) */}
        <div className="relative hidden sm:flex items-stretch">
          {/* Left Section - Event Pass Label */}
          <div className="bg-gradient-to-b from-primary/30 to-primary/10 px-4 py-3 flex flex-col items-center justify-center border-r border-primary/30 min-w-[100px]">
            <Ticket className="w-6 h-6 text-orange-400 dark:text-primary mb-1" />
            <p className="text-[10px] text-white dark:text-primary font-mono tracking-widest">EVENT</p>
            <p className="text-[10px] text-white dark:text-primary font-mono tracking-widest">PASS</p>
          </div>

          {/* Middle Section - Details */}
          <div className="flex-1 p-4 flex items-center gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <div>
                  <p className="text-[10px] text-white/60 dark:text-slate-400 uppercase tracking-widest">Team</p>
                  <p className="font-cinzel text-base text-white dark:text-white font-semibold">{registration.team_name || "Individual"}</p>
                </div>
                <div className="h-8 w-px bg-slate-700" />
                <div>
                  <p className="text-[10px] text-white/60 dark:text-slate-400 uppercase tracking-widest">Code</p>
                  <p className="font-mono text-lg text-orange-400 dark:text-primary font-bold tracking-widest">{registration.check_in_code}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-xs text-white/60 dark:text-slate-400">
                <span className="flex items-center gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                  Active
                </span>
                <span>Valid until 05 Feb 2026</span>
                {leader && <span>Leader: {leader.name}</span>}
              </div>
            </div>

            {/* Barcode */}
            <div className="bg-white px-3 py-2 rounded-lg shadow-lg flex flex-col items-center">
              <div className="flex gap-[2px] h-10">
                {(registration.check_in_code || "TECH2026").split('').map((char, i) => (
                  <div
                    key={i}
                    className="bg-black"
                    style={{
                      width: (char.charCodeAt(0) % 3) + 2 + 'px',
                      height: '100%',
                    }}
                  />
                ))}
                {[...Array(8)].map((_, i) => (
                  <div
                    key={`extra-${i}`}
                    className="bg-black"
                    style={{
                      width: ((i * 7) % 3) + 1 + 'px',
                      height: '100%',
                    }}
                  />
                ))}
              </div>
              <p className="text-[7px] font-mono text-black mt-1 tracking-wider">{registration.check_in_code}</p>
            </div>
          </div>

          {/* Right Section - View Button */}
          <div className="bg-gradient-to-b from-primary/20 to-primary/5 px-4 flex items-center border-l border-primary/30">
            <Button
              onClick={onViewTicket}
              variant="ghost"
              size="sm"
              className="gap-2 text-white dark:text-primary hover:text-white dark:hover:text-primary hover:bg-white/10 dark:hover:bg-primary/20 flex-col h-auto py-3"
            >
              <Ticket className="w-5 h-5" />
              <span className="text-[10px] font-mono">VIEW</span>
            </Button>
          </div>

          {/* Decorative notches - only on desktop */}
          <div className="absolute left-[100px] top-0 w-6 h-3 bg-background rounded-b-full" />
          <div className="absolute left-[100px] bottom-0 w-6 h-3 bg-background rounded-t-full" />
          <div className="absolute right-[72px] top-0 w-6 h-3 bg-background rounded-b-full" />
          <div className="absolute right-[72px] bottom-0 w-6 h-3 bg-background rounded-t-full" />
        </div>
      </div>
    </div>
  );
};

const Activity = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [joinedTeamRegistrations, setJoinedTeamRegistrations] = useState<Registration[]>([]);
  const [teamMembers, setTeamMembers] = useState<Record<string, TeamMember[]>>({});
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState<Registration | null>(null);
  const [joinRequests, setJoinRequests] = useState<JoinRequest[]>([]);
  const [myJoinRequests, setMyJoinRequests] = useState<JoinRequest[]>([]);
  const [processingRequest, setProcessingRequest] = useState<string | null>(null);
  const [userMemberInfo, setUserMemberInfo] = useState<{ regNumber: string } | null>(null);

  const fetchJoinRequests = async (profileId: string, registrationIds: string[]) => {
    // Fetch join requests for teams I lead
    if (registrationIds.length > 0) {
      const { data: requests } = await supabase
        .from("team_join_requests")
        .select("*")
        .in("leader_registration_id", registrationIds)
        .eq("status", "pending")
        .order("created_at", { ascending: false });

      if (requests) {
        setJoinRequests(requests);
      }
    }

    // Fetch my own join requests
    const { data: myRequests } = await supabase
      .from("team_join_requests")
      .select("*")
      .eq("requester_profile_id", profileId)
      .order("created_at", { ascending: false });

    if (myRequests) {
      // Enrich with team info
      const enrichedRequests = await Promise.all(
        myRequests.map(async (req) => {
          const { data: regData } = await supabase
            .from("registrations")
            .select("team_name, full_name")
            .eq("check_in_code", req.team_code)
            .single();

          return {
            ...req,
            team_name: regData?.team_name || "Unknown Team",
            leader_name: regData?.full_name || "Unknown",
          };
        })
      );
      setMyJoinRequests(enrichedRequests);
    }
  };

  const handleAcceptRequest = async (requestId: string, registrationId: string) => {
    setProcessingRequest(requestId);
    try {
      // Get request details
      const request = joinRequests.find(r => r.id === requestId);
      if (!request) return;
      // Fetch registration to get team_size limit
      const { data: registration } = await supabase
        .from("registrations")
        .select("id, team_size")
        .eq("id", registrationId)
        .single();

      const teamSizeLimit = registration?.team_size || 1;

      // Fetch existing team members for this registration
      const { data: existingMembers } = await supabase
        .from("team_members")
        .select("*")
        .eq("registration_id", registrationId);

      const membersArr = existingMembers || [];

      // Prevent duplicate: check if a member with same registration_number already exists
      const alreadyMember = membersArr.find(m => m.registration_number === request.requester_registration_number);
      if (alreadyMember) {
        // Update request as accepted but do not insert duplicate
        const { error: updateError } = await supabase
          .from("team_join_requests")
          .update({ status: "accepted", updated_at: new Date().toISOString() })
          .eq("id", requestId);

        if (updateError) throw updateError;

        setJoinRequests(prev => prev.filter(r => r.id !== requestId));
        toast({ title: "Already Member", description: `${request.requester_name} is already part of this team.` });
        return;
      }

      // Enforce team size limit (count includes leader)
      if (membersArr.length >= teamSizeLimit) {
        toast({ title: "Team Full", description: "Your team already has the maximum number of members.", variant: "destructive" });
        return;
      }

      // Determine member_type by finding available slot (member1..member3)
      const usedSlots = new Set(membersArr.map(m => m.member_type));
      let memberType = "member1";
      for (const slot of ["member1", "member2", "member3"]) {
        if (!usedSlots.has(slot)) {
          memberType = slot;
          break;
        }
      }

      // Insert new team member
      const { error: memberError } = await supabase
        .from("team_members")
        .insert({
          registration_id: registrationId,
          member_type: memberType,
          name: request.requester_name,
          registration_number: request.requester_registration_number,
          created_at: new Date().toISOString(),
        });

      if (memberError) throw memberError;

      // Update request status
      const { error: updateError } = await supabase
        .from("team_join_requests")
        .update({ status: "accepted", updated_at: new Date().toISOString() })
        .eq("id", requestId);

      if (updateError) throw updateError;

      // Remove from local state
      setJoinRequests(prev => prev.filter(r => r.id !== requestId));

      // Refresh team members
      const { data: members } = await supabase
        .from("team_members")
        .select("*")
        .eq("registration_id", registrationId);

      if (members) {
        setTeamMembers(prev => ({ ...prev, [registrationId]: members }));
      }

      toast({
        title: "Request Accepted",
        description: `${request.requester_name} has been added to your team.`,
      });
    } catch (error) {
      console.error("Accept error:", error);
      toast({
        title: "Error",
        description: "Failed to accept request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setProcessingRequest(null);
    }
  };

  const handleRejectRequest = async (requestId: string) => {
    setProcessingRequest(requestId);
    try {
      const request = joinRequests.find(r => r.id === requestId);

      const { error } = await supabase
        .from("team_join_requests")
        .update({ status: "rejected", updated_at: new Date().toISOString() })
        .eq("id", requestId);

      if (error) throw error;

      setJoinRequests(prev => prev.filter(r => r.id !== requestId));

      toast({
        title: "Request Declined",
        description: `Join request from ${request?.requester_name} has been declined.`,
      });
    } catch (error) {
      console.error("Reject error:", error);
      toast({
        title: "Error",
        description: "Failed to decline request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setProcessingRequest(null);
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

        // Fetch teams where user is an accepted member (via join requests)
        const { data: acceptedRequests } = await supabase
          .from("team_join_requests")
          .select("*, leader_registration_id")
          .eq("requester_profile_id", profile.id)
          .eq("status", "accepted");

        if (acceptedRequests && acceptedRequests.length > 0) {
          // Store user's registration number from accepted requests
          if (acceptedRequests[0]) {
            setUserMemberInfo({ regNumber: acceptedRequests[0].requester_registration_number });
          }

          // Get the registration details for teams user has joined
          const leaderRegIds = acceptedRequests.map(r => r.leader_registration_id);
          const { data: joinedRegs } = await supabase
            .from("registrations")
            .select("*")
            .in("id", leaderRegIds);

          if (joinedRegs) {
            setJoinedTeamRegistrations(joinedRegs);

            // Fetch team members for joined teams
            const { data: joinedMembers } = await supabase
              .from("team_members")
              .select("*")
              .in("registration_id", leaderRegIds);

            if (joinedMembers) {
              const membersByReg: Record<string, TeamMember[]> = {};
              joinedMembers.forEach(m => {
                if (!membersByReg[m.registration_id]) {
                  membersByReg[m.registration_id] = [];
                }
                membersByReg[m.registration_id].push(m);
              });
              setTeamMembers(prev => ({ ...prev, ...membersByReg }));
            }
          }
        }

        // Fetch team members for hackathon/both registrations (user's own)
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
              setTeamMembers(prev => ({ ...prev, ...membersByReg }));
            }
          }

          // Fetch join requests
          await fetchJoinRequests(profile.id, regs.map(r => r.id));
        } else {
          // Still fetch my join requests even without registrations
          await fetchJoinRequests(profile.id, []);
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
        <div className="min-h-screen">
          <Navbar />
          <main className="pt-24 pb-16 px-4">
            <div className="container mx-auto max-w-4xl">
              <div className="text-center mb-12">
                <Scroll className="w-16 h-16 text-primary mx-auto mb-4" />
                <h1 className="font-decorative text-4xl tech-text-gradient mb-2">Your Registrations</h1>
                <p className="text-muted-foreground font-cinzel">Registration History</p>
              </div>

              {loading ? (
                <div className="parchment-bg tech-border rounded-xl p-8 text-center">
                  <p className="text-muted-foreground">Loading your registrations...</p>
                </div>
              ) : registrations.length === 0 && joinedTeamRegistrations.length === 0 && myJoinRequests.filter(r => r.status === "pending").length === 0 ? (
                <div className="parchment-bg tech-border rounded-xl p-8 text-center">
                  <p className="text-muted-foreground mb-6">
                    You have not registered for any TECH FLUENCE 6.0 events yet.
                  </p>
                  <Link to="/register">
                    <Button className="font-cinzel">Register Now</Button>
                  </Link>
                </div>
              ) : (
                <>
                  {/* Own Registrations */}
                  {registrations.length > 0 && (
                    <div className="space-y-6">
                      {registrations.map((reg) => (
                        <Card key={reg.id} className="parchment-bg tech-border">
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
                              <div className="bg-primary/10 tech-border rounded-lg p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                                <div>
                                  <p className="text-xs text-muted-foreground font-sans mb-1">Team Code</p>
                                  <p className="text-xl sm:text-2xl font-bold text-primary tracking-widest font-mono">{reg.check_in_code}</p>
                                </div>
                                {reg.team_name && (
                                  <div className="sm:text-right">
                                    <p className="text-xs text-muted-foreground font-sans mb-1">Team Name</p>
                                    <p className="text-base sm:text-lg font-semibold text-foreground font-sans">{reg.team_name}</p>
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

                            {/* Landscape Event Pass */}
                            {reg.check_in_code && (
                              <LandscapeEventPass
                                registration={reg}
                                teamMembers={teamMembers[reg.id] || []}
                                onViewTicket={() => setSelectedTicket(reg)}
                              />
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

                  {/* Joined Teams Section */}
                  {joinedTeamRegistrations.length > 0 && (
                    <div className="mt-12">
                      <div className="text-center mb-6">
                        <Users className="w-12 h-12 text-primary mx-auto mb-3" />
                        <h2 className="font-decorative text-2xl tech-text-gradient mb-1">Team You've Joined</h2>
                        <p className="text-muted-foreground font-cinzel text-sm">You are a member of this team</p>
                      </div>
                      <div className="space-y-6">
                        {joinedTeamRegistrations.map((reg) => (
                          <Card key={reg.id} className="parchment-bg tech-border border-green-500/30">
                            <CardHeader>
                              <div className="flex justify-between items-start flex-wrap gap-4">
                                <div>
                                  <div className="flex items-center gap-2">
                                    <Badge className="bg-green-600 text-white text-xs">Team Member</Badge>
                                  </div>
                                  <CardTitle className="font-cinzel text-xl text-primary mt-2">
                                    {reg.team_name || "Team"}
                                  </CardTitle>
                                  <p className="text-sm text-muted-foreground mt-1">
                                    Leader: {reg.full_name} ({reg.registration_number})
                                  </p>
                                </div>
                                {getEventTypeBadge(reg.event_type)}
                              </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                              {/* Team Code Display */}
                              {reg.check_in_code && (
                                <div className="bg-primary/10 tech-border rounded-lg p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                                  <div>
                                    <p className="text-xs text-muted-foreground font-sans mb-1">Team Code</p>
                                    <p className="text-xl sm:text-2xl font-bold text-primary tracking-widest font-mono">{reg.check_in_code}</p>
                                  </div>
                                  {reg.team_name && (
                                    <div className="sm:text-right">
                                      <p className="text-xs text-muted-foreground font-sans mb-1">Team Name</p>
                                      <p className="text-base sm:text-lg font-semibold text-foreground font-sans">{reg.team_name}</p>
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

                              {/* Team Members */}
                              {teamMembers[reg.id] && teamMembers[reg.id].length > 0 && (
                                <div className="pt-4 border-t border-border">
                                  <div className="flex items-center gap-2 mb-3">
                                    <Users className="w-4 h-4 text-primary" />
                                    <span className="font-cinzel font-semibold">Team Members</span>
                                  </div>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                    {teamMembers[reg.id].map((member) => (
                                      <div
                                        key={member.id}
                                        className={`text-sm p-2 rounded ${userMemberInfo && member.registration_number === userMemberInfo.regNumber
                                          ? "bg-green-500/20 border border-green-500/50"
                                          : "bg-background/50"
                                          }`}
                                      >
                                        <span className="capitalize text-muted-foreground">
                                          {member.member_type.replace(/(\d)/, ' $1')}:
                                        </span>{" "}
                                        {member.name} ({member.registration_number})
                                        {userMemberInfo && member.registration_number === userMemberInfo.regNumber && (
                                          <span className="ml-2 text-xs text-green-600">(You)</span>
                                        )}
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {/* Event Pass for joined team members */}
                              {reg.check_in_code && (
                                <LandscapeEventPass
                                  registration={reg}
                                  teamMembers={teamMembers[reg.id] || []}
                                  onViewTicket={() => setSelectedTicket(reg)}
                                />
                              )}
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* My Pending Join Requests Section */}
                  {myJoinRequests.filter(r => r.status === "pending").length > 0 && (
                    <div className="mt-12">
                      <div className="text-center mb-6">
                        <Loader2 className="w-12 h-12 text-yellow-500 mx-auto mb-3" />
                        <h2 className="font-decorative text-2xl tech-text-gradient mb-1">Pending Requests</h2>
                        <p className="text-muted-foreground font-cinzel text-sm">Waiting for team leader approval</p>
                      </div>
                      <div className="space-y-4">
                        {myJoinRequests.filter(r => r.status === "pending").map((request) => (
                          <Card key={request.id} className="parchment-bg tech-border border-yellow-500/50">
                            <CardContent className="p-4">
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div className="space-y-1">
                                  <div className="flex items-center gap-2">
                                    <Users className="w-4 h-4 text-primary" />
                                    <span className="font-semibold text-foreground">{request.team_name}</span>
                                  </div>
                                  <p className="text-sm text-muted-foreground">
                                    Team Code: {request.team_code}
                                  </p>
                                  <p className="text-sm text-muted-foreground">
                                    Leader: {request.leader_name}
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    Requested: {new Date(request.created_at).toLocaleDateString("en-IN", {
                                      day: "2-digit",
                                      month: "short",
                                      year: "numeric",
                                    })}
                                  </p>
                                </div>
                                <Badge className="bg-yellow-600 text-white gap-1">
                                  <Loader2 className="w-3 h-3 animate-spin" />
                                  Pending Approval
                                </Badge>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* My Rejected Join Requests Section */}
                  {myJoinRequests.filter(r => r.status === "rejected").length > 0 && (
                    <div className="mt-12">
                      <div className="text-center mb-6">
                        <XCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
                        <h2 className="font-decorative text-2xl tech-text-gradient mb-1">Declined Requests</h2>
                        <p className="text-muted-foreground font-cinzel text-sm">These requests were not approved</p>
                      </div>
                      <div className="space-y-4">
                        {myJoinRequests.filter(r => r.status === "rejected").map((request) => (
                          <Card key={request.id} className="parchment-bg tech-border border-red-500/50">
                            <CardContent className="p-4">
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div className="space-y-1">
                                  <div className="flex items-center gap-2">
                                    <Users className="w-4 h-4 text-primary" />
                                    <span className="font-semibold text-foreground">{request.team_name}</span>
                                  </div>
                                  <p className="text-sm text-muted-foreground">
                                    Team Code: {request.team_code}
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    Requested: {new Date(request.created_at).toLocaleDateString("en-IN", {
                                      day: "2-digit",
                                      month: "short",
                                      year: "numeric",
                                    })}
                                  </p>
                                </div>
                                <Badge className="bg-red-600 text-white gap-1">
                                  <XCircle className="w-3 h-3" />
                                  Declined
                                </Badge>
                              </div>
                              <div className="mt-3 pt-3 border-t border-red-500/30">
                                <p className="text-sm text-muted-foreground">
                                  Your request was declined. You can try joining another team or{" "}
                                  <Link to="/register" className="text-primary underline">create your own team</Link>.
                                </p>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* Incoming Join Requests Section (for team leaders) */}
              {joinRequests.length > 0 && (
                <div className="mt-12">
                  <div className="text-center mb-6">
                    <UserPlus className="w-12 h-12 text-primary mx-auto mb-3" />
                    <h2 className="font-decorative text-2xl tech-text-gradient mb-1">Team Join Requests</h2>
                    <p className="text-muted-foreground font-cinzel text-sm">People want to join your team</p>
                  </div>
                  <div className="space-y-4">
                    {joinRequests.map((request) => {
                      const relatedReg = registrations.find(r => r.id === request.leader_registration_id);
                      const currentTeamCount = relatedReg ? (teamMembers[relatedReg.id]?.length || 0) : 0;
                      const isFull = currentTeamCount >= 4;

                      return (
                        <Card key={request.id} className="parchment-bg tech-border border-primary/50">
                          <CardContent className="p-4">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                              <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                  <Users className="w-4 h-4 text-primary" />
                                  <span className="font-semibold text-foreground">{request.requester_name}</span>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                  Reg. No: {request.requester_registration_number}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  Email: {request.requester_email}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  Requested: {new Date(request.created_at).toLocaleDateString("en-IN", {
                                    day: "2-digit",
                                    month: "short",
                                    year: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
                                </p>
                                {relatedReg && (
                                  <p className="text-xs text-primary">
                                    For team: {relatedReg.team_name || relatedReg.check_in_code}
                                  </p>
                                )}
                              </div>
                              <div className="flex gap-2">
                                {isFull ? (
                                  <Badge variant="destructive">Team Full</Badge>
                                ) : (
                                  <>
                                    <Button
                                      size="sm"
                                      onClick={() => handleAcceptRequest(request.id, request.leader_registration_id)}
                                      disabled={processingRequest === request.id}
                                      className="gap-1 bg-green-600 hover:bg-green-700"
                                    >
                                      {processingRequest === request.id ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                      ) : (
                                        <Check className="w-4 h-4" />
                                      )}
                                      Accept
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="destructive"
                                      onClick={() => handleRejectRequest(request.id)}
                                      disabled={processingRequest === request.id}
                                      className="gap-1"
                                    >
                                      {processingRequest === request.id ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                      ) : (
                                        <X className="w-4 h-4" />
                                      )}
                                      Decline
                                    </Button>
                                  </>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Ticket Modal */}
              {selectedTicket && (
                <TicketModal
                  registration={selectedTicket}
                  teamMembers={teamMembers[selectedTicket.id] || []}
                  isOpen={!!selectedTicket}
                  onClose={() => setSelectedTicket(null)}
                />
              )}
            </div>
          </main>
        </div>
      </SignedIn>
    </>
  );
};

export default Activity;
