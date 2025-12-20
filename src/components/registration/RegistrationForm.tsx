import { useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import StepIndicator from "./StepIndicator";
import PersonalInfoStep from "./PersonalInfoStep";
import EventSelectionStep from "./EventSelectionStep";
import TeamDetailsStep from "./TeamDetailsStep";
import AddressStep from "./AddressStep";
import CaptchaStep from "./CaptchaStep";
import SuccessAnimation from "./SuccessAnimation";

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
  teamLeaderName: z.string().min(2, "Team leader name is required"),
  teamLeaderRegNo: z.string().min(1, "Registration number is required"),
  member1Name: z.string().min(2, "Member 1 name is required"),
  member1RegNo: z.string().min(1, "Registration number is required"),
  member2Name: z.string().min(2, "Member 2 name is required"),
  member2RegNo: z.string().min(1, "Registration number is required"),
  member3Name: z.string().min(2, "Member 3 name is required"),
  member3RegNo: z.string().min(1, "Registration number is required"),
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

const RegistrationForm = () => {
  const { user } = useUser();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [formData, setFormData] = useState<Partial<FormData>>({});

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

  const handleNextStep = async (step: number, data: any) => {
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
        })
        .select("id")
        .single();

      if (regError) throw regError;

      // If hackathon or both, add team members
      if (formData.event?.eventType !== "event" && formData.team) {
        const teamMembers = [
          { member_type: "leader", name: formData.team.teamLeaderName, registration_number: formData.team.teamLeaderRegNo },
          { member_type: "member1", name: formData.team.member1Name, registration_number: formData.team.member1RegNo },
          { member_type: "member2", name: formData.team.member2Name, registration_number: formData.team.member2RegNo },
          { member_type: "member3", name: formData.team.member3Name, registration_number: formData.team.member3RegNo },
        ];

        const { error: teamError } = await supabase
          .from("team_members")
          .insert(
            teamMembers.map((member) => ({
              registration_id: registration.id,
              ...member,
            }))
          );

        if (teamError) throw teamError;
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

  if (showSuccess) {
    return <SuccessAnimation />;
  }

  const needsTeamDetails = formData.event?.eventType === "hackathon" || formData.event?.eventType === "both";

  return (
    <div className="w-full max-w-2xl mx-auto">
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
