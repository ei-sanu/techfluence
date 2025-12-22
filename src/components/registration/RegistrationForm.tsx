import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useUser } from "@clerk/clerk-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, ArrowRight, Calendar, CheckCircle, Code, Crown, Loader2, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useSearchParams } from "react-router-dom";
import { z } from "zod";
import AddressStep from "./AddressStep";
import CaptchaStep from "./CaptchaStep";
import EventSelectionStep from "./EventSelectionStep";
import PersonalInfoStep from "./PersonalInfoStep";
import StepIndicator from "./StepIndicator";
import SuccessAnimation from "./SuccessAnimation";
import TeamDetailsStep from "./TeamDetailsStep";

const personalInfoSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters").max(100),
  registrationNumber: z.string().min(1, "Registration number is required"),
  universityName: z.string().min(2, "University name is required"),
  email: z.string().email("Invalid email address"),
  contactNumber: z.string().min(10, "Contact number must be at least 10 digits"),
  course: z.string().min(1, "Course is required"),
  yearOfStudy: z.string().min(1, "Year of study is required"),
});

const eventSchema = z.object({
  eventType: z.enum(["event", "hackathon", "both"]),
});

const teamSchema = z.object({
  teamName: z.string().min(2, "Team name must be at least 2 characters").max(50, "Team name must be less than 50 characters"),
  teamSize: z.preprocess((val) => Number(val), z.number().min(1).max(4)),
  teamLeaderName: z.string().min(2, "Team leader name is required"),
  teamLeaderRegNo: z.string().min(1, "Registration number is required"),
  // member fields are optional; actual requiredness enforced by UI based on teamSize
  member1Name: z.string().optional(),
  member1RegNo: z.string().optional(),
  member2Name: z.string().optional(),
  member2RegNo: z.string().optional(),
  member3Name: z.string().optional(),
  member3RegNo: z.string().optional(),
});

const addressSchema = z.object({
  address: z.string().min(5, "Address is required"),
  city: z.string().min(2, "City is required"),
  pincode: z.string().min(5, "Pincode must be at least 5 characters"),
  technicalSkills: z.string().optional(),
});

export type FormData = {
  personalInfo: z.infer<typeof personalInfoSchema>;
  event: z.infer<typeof eventSchema>;
  team: z.infer<typeof teamSchema>;
  address: z.infer<typeof addressSchema>;
};

interface RegistrationFormProps {
  onBack?: () => void;
}

const RegistrationForm = ({ onBack }: RegistrationFormProps) => {
  const { user } = useUser();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const upgradeMode = searchParams.get("upgrade"); // 'event' or 'hackathon'

  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [formData, setFormData] = useState<Partial<FormData>>({});
  const [checkInCode, setCheckInCode] = useState<string | null>(null);
  const [isAlreadyRegistered, setIsAlreadyRegistered] = useState(false);
  const [isCheckingRegistration, setIsCheckingRegistration] = useState(true);
  const [existingRegistration, setExistingRegistration] = useState<{
    id: string;
    event_type: string;
  } | null>(null);
  const [isUpgrading, setIsUpgrading] = useState(false);

  // Check if user is already registered
  useEffect(() => {
    const checkExistingRegistration = async () => {
      if (!user) {
        setIsCheckingRegistration(false);
        return;
      }

      try {
        // Check if user has a profile with existing registration
        const { data: profile } = await supabase
          .from("profiles")
          .select("id")
          .eq("clerk_user_id", user.id)
          .maybeSingle();

        if (profile) {
          // Check if this profile has any registrations
          const { data: registration } = await supabase
            .from("registrations")
            .select("id, event_type")
            .eq("profile_id", profile.id)
            .maybeSingle();

          if (registration) {
            setExistingRegistration(registration);
            // Only mark as fully registered if they have "both" or if not in upgrade mode
            if (registration.event_type === "both") {
              setIsAlreadyRegistered(true);
            } else if (!upgradeMode) {
              // User has partial registration and not in upgrade mode
              setIsAlreadyRegistered(true);
            }
            // If in upgrade mode and they don't have "both", allow upgrade flow
          }
        }
      } catch (error) {
        console.error("Error checking registration:", error);
      } finally {
        setIsCheckingRegistration(false);
      }
    };

    checkExistingRegistration();
  }, [user, upgradeMode]);

  const personalForm = useForm<z.infer<typeof personalInfoSchema>>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: {
      fullName: "",
      registrationNumber: "",
      universityName: "",
      email: user?.primaryEmailAddress?.emailAddress || "",
      contactNumber: "",
      course: "",
      yearOfStudy: "",
    },
  });

  const eventForm = useForm<z.infer<typeof eventSchema>>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      eventType: "event",
    },
  });

  const teamForm = useForm<z.infer<typeof teamSchema>>({
    resolver: zodResolver(teamSchema),
    defaultValues: {
      teamName: "",
      teamSize: 1,
      teamLeaderName: "",
      teamLeaderRegNo: "",
      member1Name: "",
      member1RegNo: "",
      member2Name: "",
      member2RegNo: "",
      member3Name: "",
      member3RegNo: "",
    },
  });

  const addressForm = useForm<z.infer<typeof addressSchema>>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      address: "",
      city: "",
      pincode: "",
      technicalSkills: "",
    },
  });

  const totalSteps = formData.event?.eventType === "event" ? 4 : 5;

  // Helper function to generate unique 5-digit Team Code
  const generateUniqueCheckInCode = async (): Promise<string> => {
    let code: string;
    let isUnique = false;

    while (!isUnique) {
      // Generate random 5-digit number (10000-99999)
      code = Math.floor(10000 + Math.random() * 90000).toString();

      // Check if code already exists
      const { data: existingCode } = await supabase
        .from("registrations")
        .select("id")
        .eq("check_in_code", code)
        .maybeSingle();

      if (!existingCode) {
        isUnique = true;
      }
    }

    return code!;
  };

  // Helper function to check if a registration number is already used
  const checkDuplicateRegistrationNumber = async (regNumber: string): Promise<boolean> => {
    // Check in registrations table
    const { data: existingReg } = await supabase
      .from("registrations")
      .select("id")
      .eq("registration_number", regNumber)
      .maybeSingle();

    if (existingReg) return true;

    // Check in team_members table
    const { data: existingTeamMember } = await supabase
      .from("team_members")
      .select("id")
      .eq("registration_number", regNumber)
      .maybeSingle();

    if (existingTeamMember) return true;

    return false;
  };

  const handleNextStep = async (step: number, data: any) => {
    // If moving from personal info step, check if the registration number is already used
    if (step === 1 && data.personalInfo) {
      const isDuplicate = await checkDuplicateRegistrationNumber(data.personalInfo.registrationNumber);
      if (isDuplicate) {
        toast({
          title: "Already Registered",
          description: "This registration number is already registered for the event.",
          variant: "destructive",
        });
        return;
      }
    }

    // If moving from team details step, check team members according to selected team size
    if (step === 3 && data.team) {
      const size = Number(data.team.teamSize) || 1;
      const teamRegNumbers: string[] = [];

      // leader always included
      if (data.team.teamLeaderRegNo) teamRegNumbers.push(data.team.teamLeaderRegNo);

      // include member reg nos up to size-1
      for (let i = 1; i <= Math.max(0, size - 1); i++) {
        const regField = data.team[`member${i}RegNo`];
        if (regField) teamRegNumbers.push(regField);
      }

      // Check for duplicates within the provided team registration numbers
      const uniqueRegNumbers = new Set(teamRegNumbers);
      if (uniqueRegNumbers.size !== teamRegNumbers.length) {
        toast({
          title: "Duplicate Registration Numbers",
          description: "Each team member must have a unique registration number.",
          variant: "destructive",
        });
        return;
      }

      // Check each provided registration number against existing registrations
      for (const regNo of teamRegNumbers) {
        const isDuplicate = await checkDuplicateRegistrationNumber(regNo);
        if (isDuplicate) {
          toast({
            title: "Member Already Registered",
            description: `Registration number ${regNo} is already registered for an event.`,
            variant: "destructive",
          });
          return;
        }
      }
    }

    setFormData((prev) => ({ ...prev, ...data }));
    setCurrentStep(step + 1);
  };

  const handlePrevStep = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const handleSubmit = async (captchaVerified: boolean) => {
    if (!captchaVerified) {
      toast({
        title: "Verification Failed",
        description: "Please complete the CAPTCHA correctly.",
        variant: "destructive",
      });
      return;
    }

    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to register.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Generate unique Team Code
      const generatedCode = await generateUniqueCheckInCode();
      setCheckInCode(generatedCode);

      // First, ensure profile exists
      const { data: existingProfile } = await supabase
        .from("profiles")
        .select("id")
        .eq("clerk_user_id", user.id)
        .maybeSingle();

      let profileId = existingProfile?.id;

      if (!profileId) {
        const { data: newProfile, error: profileError } = await supabase
          .from("profiles")
          .insert({
            clerk_user_id: user.id,
            email: user.primaryEmailAddress?.emailAddress,
            full_name: formData.personalInfo?.fullName,
          })
          .select("id")
          .single();

        if (profileError) throw profileError;
        profileId = newProfile.id;
      }

      // Create registration
      const { data: registration, error: regError } = await supabase
        .from("registrations")
        .insert({
          profile_id: profileId,
          full_name: formData.personalInfo?.fullName,
          registration_number: formData.personalInfo?.registrationNumber,
          university_name: formData.personalInfo?.universityName,
          email: formData.personalInfo?.email,
          contact_number: formData.personalInfo?.contactNumber,
          course: formData.personalInfo?.course,
          year_of_study: formData.personalInfo?.yearOfStudy,
          event_type: formData.event?.eventType,
          address: formData.address?.address,
          city: formData.address?.city,
          pincode: formData.address?.pincode,
          technical_skills: formData.address?.technicalSkills,
          team_name: formData.team?.teamName || null,
          team_size: formData.team?.teamSize || 1,
          check_in_code: generatedCode,
        })
        .select("id")
        .single();

      if (regError) throw regError;

      // If hackathon or both, add team members according to selected team size
      if (formData.event?.eventType !== "event" && formData.team) {
        const size = Number(formData.team.teamSize) || 1;
        const membersToInsert: any[] = [];

        // leader
        membersToInsert.push({ member_type: "leader", name: formData.team.teamLeaderName, registration_number: formData.team.teamLeaderRegNo });

        // add other members if provided (up to size - 1)
        for (let i = 1; i <= Math.max(0, size - 1); i++) {
          const name = formData.team[`member${i}Name`];
          const reg = formData.team[`member${i}RegNo`];
          if (name && reg) {
            membersToInsert.push({ member_type: `member${i}`, name, registration_number: reg });
          }
        }

        if (membersToInsert.length > 0) {
          const { error: teamError } = await supabase
            .from("team_members")
            .insert(
              membersToInsert.map((member) => ({
                registration_id: registration.id,
                ...member,
              }))
            );

          if (teamError) throw teamError;
        }
      }

      setShowSuccess(true);
    } catch (error: any) {
      console.error("Registration error:", error);
      toast({
        title: "Registration Failed",
        description: error.message || "An error occurred during registration.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle upgrade from event to both (needs team details)
  const handleUpgradeToHackathon = async () => {
    if (!existingRegistration) return;

    // Need to collect team details - show team form
    setIsAlreadyRegistered(false);
    setFormData({ event: { eventType: "both" } });
    setCurrentStep(3); // Jump to team details step
  };

  // Handle upgrade from hackathon to both (just update DB)
  const handleUpgradeToEvent = async () => {
    if (!existingRegistration) return;

    setIsUpgrading(true);
    try {
      const { error } = await supabase
        .from("registrations")
        .update({ event_type: "both" })
        .eq("id", existingRegistration.id);

      if (error) throw error;

      toast({
        title: "Registration Updated!",
        description: "You are now registered for both Event and Hackathon.",
      });

      setShowSuccess(true);
    } catch (error: any) {
      console.error("Upgrade error:", error);
      toast({
        title: "Upgrade Failed",
        description: error.message || "Failed to upgrade registration.",
        variant: "destructive",
      });
    } finally {
      setIsUpgrading(false);
    }
  };

  // Handle team submission for upgrade (event -> both)
  const handleUpgradeTeamSubmit = async (teamData: any) => {
    if (!existingRegistration) return;

    setIsSubmitting(true);
    try {
      // Check for duplicate registration numbers in team according to teamSize
      const size = Number(teamData.teamSize) || 1;
      const teamRegNumbers: string[] = [];

      if (teamData.teamLeaderRegNo) teamRegNumbers.push(teamData.teamLeaderRegNo);
      for (let i = 1; i <= Math.max(0, size - 1); i++) {
        const reg = teamData[`member${i}RegNo`];
        if (reg) teamRegNumbers.push(reg);
      }

      // Check for duplicates within the provided numbers
      const uniqueRegNumbers = new Set(teamRegNumbers);
      if (uniqueRegNumbers.size !== teamRegNumbers.length) {
        toast({
          title: "Duplicate Registration Numbers",
          description: "Each team member must have a unique registration number.",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }

      // Check each provided team member against existing registrations
      for (const regNo of teamRegNumbers) {
        const isDuplicate = await checkDuplicateRegistrationNumber(regNo);
        if (isDuplicate) {
          toast({
            title: "Member Already Registered",
            description: `Registration number ${regNo} is already registered for an event.`,
            variant: "destructive",
          });
          setIsSubmitting(false);
          return;
        }
      }

      // Add team members
      const teamMembers: any[] = [];
      teamMembers.push({ member_type: "leader", name: teamData.teamLeaderName, registration_number: teamData.teamLeaderRegNo });
      for (let i = 1; i <= Math.max(0, size - 1); i++) {
        const name = teamData[`member${i}Name`];
        const reg = teamData[`member${i}RegNo`];
        if (name && reg) teamMembers.push({ member_type: `member${i}`, name, registration_number: reg });
      }

      if (teamMembers.length > 0) {
        const { error: teamError } = await supabase
          .from("team_members")
          .insert(
            teamMembers.map((member) => ({
              registration_id: existingRegistration.id,
              ...member,
            }))
          );

        if (teamError) throw teamError;
      }

      // Update registration to "both" with team_name
      const { error: updateError } = await supabase
        .from("registrations")
        .update({ event_type: "both", team_name: teamData.teamName, team_size: teamData.teamSize || 1 })
        .eq("id", existingRegistration.id);

      if (updateError) throw updateError;

      toast({
        title: "Registration Updated!",
        description: "You are now registered for both Event and Hackathon.",
      });

      setShowSuccess(true);
    } catch (error: any) {
      console.error("Upgrade error:", error);
      toast({
        title: "Upgrade Failed",
        description: error.message || "Failed to upgrade registration.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (showSuccess) {
    return <SuccessAnimation checkInCode={checkInCode} teamName={formData.team?.teamName} />;
  }

  // Show loading state while checking registration
  if (isCheckingRegistration) {
    return (
      <div className="w-full max-w-2xl mx-auto">
        <div className="parchment-bg tech-border rounded-xl p-8 text-center">
          <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
          <p className="font-cinzel text-muted-foreground">Checking registration status...</p>
        </div>
      </div>
    );
  }

  // Show upgrade UI for users registered for only one type
  if (upgradeMode && existingRegistration && existingRegistration.event_type !== "both") {
    const isRegisteredForEvent = existingRegistration.event_type === "event";
    const isRegisteredForHackathon = existingRegistration.event_type === "hackathon";

    // If upgrading from event to hackathon and we're at step 3 (team details)
    if (isRegisteredForEvent && currentStep === 3) {
      return (
        <div className="w-full max-w-2xl mx-auto">
          <div className="parchment-bg tech-border rounded-xl p-6 mb-6 text-center">
            <Plus className="w-10 h-10 text-primary mx-auto mb-3" />
            <h2 className="font-decorative text-2xl text-primary mb-2">Add Hackathon Registration</h2>
            <p className="text-muted-foreground font-sans">
              Complete your team details to join the hackathon as well.
            </p>
          </div>
          <TeamDetailsStep
            form={teamForm}
            onNext={(data) => handleUpgradeTeamSubmit(data)}
            onPrev={() => navigate("/activity")}
          />
          {isSubmitting && (
            <div className="fixed inset-0 bg-background/80 flex items-center justify-center z-50">
              <div className="parchment-bg tech-border rounded-xl p-8 text-center">
                <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
                <p className="font-sans text-foreground">Upgrading your registration...</p>
              </div>
            </div>
          )}
        </div>
      );
    }

    return (
      <div className="w-full max-w-2xl mx-auto">
        <div className="parchment-bg tech-border rounded-xl p-8 md:p-12 text-center">
          <div className="relative inline-block mb-6">
            <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl animate-pulse" />
            <CheckCircle className="w-16 h-16 text-primary relative" />
          </div>

          <h2 className="font-decorative text-2xl md:text-3xl tech-text-gradient mb-4">
            Upgrade Your Registration
          </h2>

          <div className="bg-secondary/30 rounded-lg p-4 mb-6">
            <p className="font-sans text-foreground mb-2">
              <strong>Current Registration:</strong>
            </p>
            <div className="flex items-center justify-center gap-2">
              {isRegisteredForEvent ? (
                <>
                  <Calendar className="w-5 h-5 text-blue-500" />
                  <span className="font-semibold text-blue-500">Event Only</span>
                </>
              ) : (
                <>
                  <Code className="w-5 h-5 text-purple-500" />
                  <span className="font-semibold text-purple-500">Hackathon Only</span>
                </>
              )}
            </div>
          </div>

          {isRegisteredForEvent ? (
            <div className="space-y-4">
              <p className="font-sans text-muted-foreground">
                You are registered for the <strong>Event</strong> but not the <strong>Hackathon</strong>.
                Would you like to also join the hackathon?
              </p>
              <Button
                onClick={handleUpgradeToHackathon}
                className="font-sans font-semibold gap-2 px-8 py-6 text-lg"
              >
                <Plus className="w-5 h-5" />
                Add Hackathon Registration
              </Button>
              <p className="text-sm text-muted-foreground">
                You'll need to provide your team details to join the hackathon.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="font-sans text-muted-foreground">
                You are registered for the <strong>Hackathon</strong> but not the <strong>Event</strong>.
                Would you like to also join the event?
              </p>
              <Button
                onClick={handleUpgradeToEvent}
                disabled={isUpgrading}
                className="font-sans font-semibold gap-2 px-8 py-6 text-lg"
              >
                {isUpgrading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Upgrading...
                  </>
                ) : (
                  <>
                    <Plus className="w-5 h-5" />
                    Add Event Registration
                  </>
                )}
              </Button>
            </div>
          )}

          <div className="mt-8 pt-6 border-t border-border">
            <Button
              variant="outline"
              onClick={() => navigate("/activity")}
              className="font-sans"
            >
              Back to Activity
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Show already registered message
  if (isAlreadyRegistered) {
    const canUpgrade = existingRegistration && existingRegistration.event_type !== "both";
    const isRegisteredForEvent = existingRegistration?.event_type === "event";
    const isRegisteredForHackathon = existingRegistration?.event_type === "hackathon";

    return (
      <div className="w-full max-w-2xl mx-auto">
        <div className="parchment-bg tech-border rounded-xl p-8 md:p-12 text-center">
          <div className="relative inline-block mb-6">
            <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl animate-pulse" />
            <CheckCircle className="w-20 h-20 text-primary relative" />
          </div>

          <Crown className="w-12 h-12 text-primary mx-auto mb-4" />

          <h2 className="font-decorative text-3xl md:text-4xl tech-text-gradient mb-4">
            {existingRegistration?.event_type === "both" ? "Fully Registered!" : "Already Registered!"}
          </h2>

          {existingRegistration?.event_type === "both" ? (
            <p className="font-sans text-muted-foreground text-lg mb-8 max-w-md mx-auto">
              You are registered for both the Event and Hackathon.
              See you at TECH FLUENCE 6.0!
            </p>
          ) : (
            <div className="mb-8">
              <p className="font-sans text-muted-foreground text-lg mb-4 max-w-md mx-auto">
                You are registered for the{" "}
                <strong className={isRegisteredForEvent ? "text-blue-500" : "text-purple-500"}>
                  {isRegisteredForEvent ? "Event" : "Hackathon"}
                </strong>
                .
              </p>
              {canUpgrade && (
                <div className="bg-primary/10 rounded-lg p-4 border border-primary/30">
                  <p className="font-sans text-foreground mb-3">
                    Want to also register for the{" "}
                    <strong>{isRegisteredForEvent ? "Hackathon" : "Event"}</strong>?
                  </p>
                  <Button
                    onClick={() => navigate(`/register?upgrade=${isRegisteredForEvent ? "hackathon" : "event"}`)}
                    variant="outline"
                    className="font-sans font-semibold gap-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                  >
                    <Plus className="w-4 h-4" />
                    Register for {isRegisteredForEvent ? "Hackathon" : "Event"}
                  </Button>
                </div>
              )}
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => navigate("/activity")}
              className="font-sans font-semibold gap-2 px-8 py-6 text-lg"
            >
              View Your Activity
              <ArrowRight className="w-5 h-5" />
            </Button>
          </div>

          <p className="font-sans text-sm text-muted-foreground mt-6">
            Need help? Contact our support team for assistance.
          </p>
        </div>
      </div>
    );
  }

  const needsTeamDetails = formData.event?.eventType === "hackathon" || formData.event?.eventType === "both";

  return (
    <div className="w-full max-w-2xl mx-auto">
      {onBack && (
        <Button
          variant="ghost"
          onClick={onBack}
          className="mb-6 gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Options
        </Button>
      )}

      <StepIndicator currentStep={currentStep} totalSteps={totalSteps} needsTeam={needsTeamDetails} />

      <div className="mt-8">
        {currentStep === 1 && (
          <PersonalInfoStep
            form={personalForm}
            onNext={(data) => handleNextStep(1, { personalInfo: data })}
          />
        )}

        {currentStep === 2 && (
          <EventSelectionStep
            form={eventForm}
            onNext={(data) => handleNextStep(2, { event: data })}
            onPrev={handlePrevStep}
          />
        )}

        {currentStep === 3 && needsTeamDetails && (
          <TeamDetailsStep
            form={teamForm}
            onNext={(data) => handleNextStep(3, { team: data })}
            onPrev={handlePrevStep}
          />
        )}

        {((currentStep === 3 && !needsTeamDetails) || (currentStep === 4 && needsTeamDetails)) && (
          <AddressStep
            form={addressForm}
            onNext={(data) => handleNextStep(needsTeamDetails ? 4 : 3, { address: data })}
            onPrev={handlePrevStep}
          />
        )}

        {currentStep === totalSteps && (
          <CaptchaStep
            onSubmit={handleSubmit}
            onPrev={handlePrevStep}
            isSubmitting={isSubmitting}
          />
        )}
      </div>
    </div>
  );
};

export default RegistrationForm;
