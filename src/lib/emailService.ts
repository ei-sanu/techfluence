import { supabase } from "@/integrations/supabase/client";

interface RegistrationDetails {
  fullName: string;
  registrationNumber: string;
  universityName: string;
  email: string;
  contactNumber: string;
  course: string;
  yearOfStudy: string;
  eventType: string;
  address: string;
  city: string;
  pincode: string;
  technicalSkills?: string;
  teamName?: string;
  teamCode: string;
  teamMembers?: Array<{
    name: string;
    registrationNumber: string;
    memberType: string;
  }>;
}

/**
 * Generates HTML email template with registration details
 */
export const generateRegistrationEmail = (details: RegistrationDetails): string => {
  const eventTypeDisplay =
    details.eventType === "both"
      ? "Event + Hackathon"
      : details.eventType.charAt(0).toUpperCase() + details.eventType.slice(1);

  const teamMembersHTML =
    details.teamMembers && details.teamMembers.length > 0
      ? `
    <div style="margin: 30px 0; padding: 20px; background: #f8fafc; border-radius: 8px;">
      <h3 style="color: #ea580c; margin-bottom: 15px; font-size: 18px;">🎯 Team Members</h3>
      ${details.teamMembers
        .map(
          (member) => `
        <div style="padding: 10px 0; border-bottom: 1px solid #e2e8f0;">
          <strong style="color: #334155;">${member.memberType === "leader" ? "👑 Leader" : "👤 Member"}:</strong>
          <span style="color: #64748b;">${member.name}</span>
          <span style="color: #94a3b8; font-size: 14px;">(${member.registrationNumber})</span>
        </div>
      `
        )
        .join("")}
    </div>
  `
      : "";

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>TECH FLUENCE 6.0 - Registration Confirmation</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background: #f1f5f9; line-height: 1.6;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background: #f1f5f9; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">

          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #ea580c 0%, #fb923c 100%); padding: 40px 30px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 32px; font-weight: bold; text-transform: uppercase; letter-spacing: 2px;">
                TECH FLUENCE
              </h1>
              <p style="margin: 10px 0 0; color: #fef3c7; font-size: 16px; letter-spacing: 1px;">
                6.0 • EVENT REGISTRATION
              </p>
            </td>
          </tr>

          <!-- Success Message -->
          <tr>
            <td style="padding: 40px 30px 30px; text-align: center;">
              <div style="display: inline-block; width: 80px; height: 80px; background: #dcfce7; border-radius: 50%; line-height: 80px; margin-bottom: 20px;">
                <span style="color: #16a34a; font-size: 48px;">✓</span>
              </div>
              <h2 style="margin: 0 0 10px; color: #16a34a; font-size: 24px;">Registration Successful!</h2>
              <p style="margin: 0; color: #64748b; font-size: 16px;">
                Welcome to TECH FLUENCE 6.0, ${details.fullName}!
              </p>
            </td>
          </tr>

          <!-- Team Code Highlight -->
          <tr>
            <td style="padding: 0 30px 30px;">
              <div style="background: linear-gradient(135deg, #f97316 0%, #fb923c 100%); border-radius: 8px; padding: 25px; text-align: center;">
                <p style="margin: 0 0 10px; color: #fef3c7; font-size: 12px; text-transform: uppercase; letter-spacing: 2px;">
                  Your Team Code
                </p>
                <p style="margin: 0; color: #ffffff; font-size: 36px; font-weight: bold; letter-spacing: 6px; font-family: 'Courier New', monospace;">
                  ${details.teamCode}
                </p>
                ${details.teamName
      ? `<p style="margin: 10px 0 0; color: #fef3c7; font-size: 16px;">${details.teamName}</p>`
      : ""
    }
              </div>
            </td>
          </tr>

          <!-- Registration Details -->
          <tr>
            <td style="padding: 0 30px 30px;">
              <h3 style="color: #ea580c; margin: 0 0 20px; font-size: 18px; border-bottom: 2px solid #fed7aa; padding-bottom: 10px;">
                📋 Registration Details
              </h3>

              <table width="100%" cellpadding="8" cellspacing="0">
                <tr>
                  <td style="color: #64748b; font-size: 14px; width: 40%;">Full Name:</td>
                  <td style="color: #1e293b; font-size: 14px; font-weight: 600;">${details.fullName}</td>
                </tr>
                <tr>
                  <td style="color: #64748b; font-size: 14px;">Registration No:</td>
                  <td style="color: #1e293b; font-size: 14px; font-weight: 600;">${details.registrationNumber}</td>
                </tr>
                <tr>
                  <td style="color: #64748b; font-size: 14px;">University:</td>
                  <td style="color: #1e293b; font-size: 14px; font-weight: 600;">${details.universityName}</td>
                </tr>
                <tr>
                  <td style="color: #64748b; font-size: 14px;">Course:</td>
                  <td style="color: #1e293b; font-size: 14px; font-weight: 600;">${details.course} - ${details.yearOfStudy}</td>
                </tr>
                <tr>
                  <td style="color: #64748b; font-size: 14px;">Email:</td>
                  <td style="color: #1e293b; font-size: 14px; font-weight: 600;">${details.email}</td>
                </tr>
                <tr>
                  <td style="color: #64748b; font-size: 14px;">Contact:</td>
                  <td style="color: #1e293b; font-size: 14px; font-weight: 600;">${details.contactNumber}</td>
                </tr>
                <tr>
                  <td style="color: #64748b; font-size: 14px;">Address:</td>
                  <td style="color: #1e293b; font-size: 14px; font-weight: 600;">${details.address}, ${details.city} - ${details.pincode}</td>
                </tr>
                <tr>
                  <td style="color: #64748b; font-size: 14px;">Event Type:</td>
                  <td>
                    <span style="display: inline-block; background: #dcfce7; color: #16a34a; padding: 4px 12px; border-radius: 4px; font-size: 13px; font-weight: 600;">
                      ${eventTypeDisplay}
                    </span>
                  </td>
                </tr>
                ${details.technicalSkills
      ? `
                <tr>
                  <td style="color: #64748b; font-size: 14px;">Technical Skills:</td>
                  <td style="color: #1e293b; font-size: 14px; font-weight: 600;">${details.technicalSkills}</td>
                </tr>
                `
      : ""
    }
              </table>

              ${teamMembersHTML}
            </td>
          </tr>

          <!-- Event Information -->
          <tr>
            <td style="padding: 0 30px 30px;">
              <div style="background: #fef3c7; border-left: 4px solid #ea580c; padding: 20px; border-radius: 4px;">
                <h3 style="color: #ea580c; margin: 0 0 15px; font-size: 18px;">📅 Event Information</h3>
                <p style="margin: 0 0 10px; color: #92400e; font-size: 14px;">
                  <strong>Event Date:</strong> 5th February 2026
                </p>
                <p style="margin: 0 0 10px; color: #92400e; font-size: 14px;">
                  <strong>Valid Until:</strong> 5th February 2026
                </p>
                <p style="margin: 0 0 10px; color: #92400e; font-size: 14px;">
                  <strong>Check-In:</strong> Present your Team Code at the registration desk
                </p>
                <p style="margin: 0; color: #92400e; font-size: 14px;">
                  <strong>Status:</strong> <span style="color: #16a34a; font-weight: bold;">✓ CONFIRMED</span>
                </p>
              </div>
            </td>
          </tr>

          <!-- Important Notes -->
          <tr>
            <td style="padding: 0 30px 30px;">
              <div style="background: #dbeafe; border-left: 4px solid #3b82f6; padding: 20px; border-radius: 4px;">
                <h3 style="color: #1e40af; margin: 0 0 15px; font-size: 18px;">⚠️ Important Notes</h3>
                <ul style="margin: 0; padding-left: 20px; color: #1e3a8a; font-size: 14px;">
                  <li style="margin-bottom: 8px;">Save this email and your <strong>Team Code (${details.teamCode})</strong> for event check-in</li>
                  <li style="margin-bottom: 8px;">You can view your full event pass and details in the Activity section after signing in</li>
                  <li style="margin-bottom: 8px;">Bring a valid ID proof along with your registration number for verification</li>
                  <li style="margin-bottom: 8px;">Team leaders are responsible for ensuring all team members are present</li>
                  <li>For any queries, please contact our support team</li>
                </ul>
              </div>
            </td>
          </tr>

          <!-- CTA Button -->
          <tr>
            <td style="padding: 0 30px 40px; text-align: center;">
              <a href="${window.location.origin}/activity"
                 style="display: inline-block; background: linear-gradient(135deg, #ea580c 0%, #fb923c 100%); color: #ffffff; text-decoration: none; padding: 16px 40px; border-radius: 8px; font-size: 16px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; box-shadow: 0 4px 6px rgba(234, 88, 12, 0.3);">
                View Your Activity
              </a>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background: #1e293b; padding: 30px; text-align: center;">
              <p style="margin: 0 0 10px; color: #94a3b8; font-size: 14px;">
                TECH FLUENCE 6.0 • Engineering Institute
              </p>
              <p style="margin: 0 0 15px; color: #64748b; font-size: 12px;">
                This is an automated confirmation email. Please do not reply to this message.
              </p>
              <div style="margin-top: 20px;">
                <a href="${window.location.origin}/terms" style="color: #94a3b8; text-decoration: none; font-size: 12px; margin: 0 10px;">Terms</a>
                <span style="color: #475569;">•</span>
                <a href="${window.location.origin}/privacy" style="color: #94a3b8; text-decoration: none; font-size: 12px; margin: 0 10px;">Privacy</a>
                <span style="color: #475569;">•</span>
                <a href="${window.location.origin}/contact" style="color: #94a3b8; text-decoration: none; font-size: 12px; margin: 0 10px;">Support</a>
              </div>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
};

/**
 * Sends registration confirmation email
 * This function uses Supabase Edge Function to send emails
 */
export const sendRegistrationEmail = async (
  details: RegistrationDetails
): Promise<{ success: boolean; error?: string }> => {
  try {
    const emailHTML = generateRegistrationEmail(details);

    // Call Supabase Edge Function to send email
    // You'll need to create this edge function in your Supabase project
    const { data, error } = await supabase.functions.invoke("send-registration-email", {
      body: {
        to: details.email,
        subject: `🎉 TECH FLUENCE 6.0 - Registration Confirmed! Team Code: ${details.teamCode}`,
        html: emailHTML,
      },
    });

    if (error) {
      console.error("Error sending email:", error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error: any) {
    console.error("Error in sendRegistrationEmail:", error);
    return { success: false, error: error.message || "Failed to send email" };
  }
};

/**
 * Alternative: Simple notification using browser-based methods
 * This is a fallback if Supabase Edge Functions are not set up
 */
export const logRegistrationDetails = (details: RegistrationDetails): void => {
  console.log("=".repeat(60));
  console.log("REGISTRATION CONFIRMATION EMAIL");
  console.log("=".repeat(60));
  console.log(`To: ${details.email}`);
  console.log(`Team Code: ${details.teamCode}`);
  console.log(`Name: ${details.fullName}`);
  console.log(`Event Type: ${details.eventType}`);
  if (details.teamName) {
    console.log(`Team Name: ${details.teamName}`);
  }
  if (details.teamMembers && details.teamMembers.length > 0) {
    console.log("\nTeam Members:");
    details.teamMembers.forEach((member) => {
      console.log(`  - ${member.name} (${member.registrationNumber}) - ${member.memberType}`);
    });
  }
  console.log("=".repeat(60));
};
