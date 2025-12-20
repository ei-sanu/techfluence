import Footer from "@/components/Footer";
import AboutSection from "@/components/home/AboutSection";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useUser } from "@clerk/clerk-react";
import { Download, Loader2, ShieldCheck } from "lucide-react";
import { useState } from "react";
import * as XLSX from "xlsx";

// Admin email(s) that can download data - add your admin emails here
const ADMIN_EMAILS = ["someshranjanbiswal13678@gmail.com", "biswalranjansomesh@gmail.com"]; // Update with actual admin emails

const About = () => {
  const { user } = useUser();
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
      const { data: registrations, error: regError } = await supabase
        .from("registrations")
        .select("*")
        .order("created_at", { ascending: false });

      if (regError) throw regError;

      if (!registrations || registrations.length === 0) {
        toast({
          title: "No Data",
          description: "No registrations found in the database.",
          variant: "destructive",
        });
        setIsDownloading(false);
        return;
      }

      // Fetch all team members
      const { data: teamMembers, error: teamError } = await supabase
        .from("team_members")
        .select("*");

      if (teamError) throw teamError;

      // Create a map of team members by registration_id
      const teamMembersByReg: Record<string, any[]> = {};
      teamMembers?.forEach((member) => {
        if (!teamMembersByReg[member.registration_id]) {
          teamMembersByReg[member.registration_id] = [];
        }
        teamMembersByReg[member.registration_id].push(member);
      });

      // Format data for Excel
      const excelData = registrations.map((reg) => {
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
          "Registered On": new Date(reg.created_at).toLocaleString("en-IN"),
          // Team details (for hackathon registrations)
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
        description: `${registrations.length} registrations exported successfully.`,
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

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-20">
        <AboutSection />

        {/* Admin Download Section */}
        {isAdmin && (
          <div className="container mx-auto px-4 py-12">
            <div className="max-w-md mx-auto parchment-bg royal-border rounded-xl p-6 text-center">
              <div className="flex items-center justify-center gap-2 mb-4">
                <ShieldCheck className="w-6 h-6 text-primary" />
                <h3 className="font-cinzel text-lg font-semibold">Admin Panel</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Download all registration data as an Excel file.
              </p>
              <Button
                onClick={downloadRegistrations}
                disabled={isDownloading}
                className="font-cinzel gap-2"
              >
                {isDownloading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Downloading...
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    Download Registrations
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default About;
