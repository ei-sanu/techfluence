# Email Service Setup Guide

This guide explains how to set up email notifications for registration confirmations in your TECH FLUENCE 6.0 application.

## Current Implementation

The email service has been integrated into the registration flow and will:
- ✅ Send a detailed confirmation email after successful registration
- ✅ Include all registration details (personal info, event type, team details)
- ✅ Display the team code prominently for check-in
- ✅ Show team member information if applicable
- ✅ Provide event information and important notes
- ✅ Work for both new registrations and upgrades

## Option 1: Supabase Edge Functions (Recommended)

To enable actual email sending, you need to create a Supabase Edge Function:

### Step 1: Install Supabase CLI

```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login
```

### Step 2: Create Edge Function

```bash
# Initialize Supabase in your project (if not already done)
supabase init

# Create the email edge function
supabase functions new send-registration-email
```

### Step 3: Implement the Edge Function

Edit `supabase/functions/send-registration-email/index.ts`:

```typescript
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

serve(async (req) => {
  try {
    const { to, subject, html } = await req.json();

    // Using Resend.com for email delivery
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "TECH FLUENCE <noreply@yourdomain.com>", // Update with your domain
        to: [to],
        subject: subject,
        html: html,
      }),
    });

    const data = await res.json();

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }
});
```

### Step 4: Set Up Email Service (Resend.com)

1. Go to [resend.com](https://resend.com) and create an account
2. Verify your domain (or use their sandbox for testing)
3. Get your API key from the dashboard
4. Add the API key to your Supabase project secrets:

```bash
supabase secrets set RESEND_API_KEY=your_api_key_here
```

### Step 5: Deploy the Edge Function

```bash
# Deploy the function
supabase functions deploy send-registration-email

# Enable CORS if needed
supabase functions deploy send-registration-email --no-verify-jwt
```

## Option 2: Alternative Email Services

### Using SendGrid

Replace Resend with SendGrid in the edge function:

```typescript
const SENDGRID_API_KEY = Deno.env.get("SENDGRID_API_KEY");

const res = await fetch("https://api.sendgrid.com/v3/mail/send", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${SENDGRID_API_KEY}`,
  },
  body: JSON.stringify({
    personalizations: [{ to: [{ email: to }] }],
    from: { email: "noreply@yourdomain.com", name: "TECH FLUENCE" },
    subject: subject,
    content: [{ type: "text/html", value: html }],
  }),
});
```

### Using Mailgun

```typescript
const MAILGUN_API_KEY = Deno.env.get("MAILGUN_API_KEY");
const MAILGUN_DOMAIN = Deno.env.get("MAILGUN_DOMAIN");

const formData = new FormData();
formData.append("from", "TECH FLUENCE <noreply@yourdomain.com>");
formData.append("to", to);
formData.append("subject", subject);
formData.append("html", html);

const res = await fetch(
  `https://api.mailgun.net/v3/${MAILGUN_DOMAIN}/messages`,
  {
    method: "POST",
    headers: {
      Authorization: `Basic ${btoa(`api:${MAILGUN_API_KEY}`)}`,
    },
    body: formData,
  }
);
```

## Option 3: Development/Testing Mode

For development and testing without setting up email services:

The implementation already includes a fallback that logs email details to the browser console. Check the browser console after registration to see the email content that would have been sent.

```javascript
// Email details are logged using logRegistrationDetails()
// This shows all the information that would be included in the email
```

## Email Template Features

The email includes:

- ✨ Professional HTML template with branding
- 🎯 Prominent team code display
- 📋 Complete registration details
- 👥 Team member information (for hackathon registrations)
- 📅 Event date and venue information
- ⚠️ Important notes and instructions
- 🔗 Direct link to Activity page
- 📱 Mobile-responsive design
- 🌗 Works with both light and dark mode preferences

## Testing

1. Complete a test registration
2. Check the browser console for logged email details
3. If edge function is set up, check the user's email inbox
4. Verify all details are correct and formatted properly

## Troubleshooting

### Email not sending:
- Check Supabase edge function logs: `supabase functions logs send-registration-email`
- Verify API keys are set correctly
- Check email service status (Resend/SendGrid/etc.)

### Email goes to spam:
- Verify your domain with the email service
- Add SPF and DKIM records to your domain
- Use a verified sender email address

### Missing information:
- Check browser console for logged details
- Verify all form fields are being captured
- Check Supabase database for complete registration data

## Security Notes

- Never commit API keys to version control
- Use environment variables or Supabase secrets
- Validate email addresses before sending
- Implement rate limiting to prevent abuse
- Use CORS appropriately on edge functions

## Next Steps

1. ✅ Choose an email service provider
2. ✅ Set up and verify your domain
3. ✅ Create and deploy the Supabase edge function
4. ✅ Test with a sample registration
5. ✅ Monitor email delivery rates

For additional help, refer to:
- [Supabase Edge Functions Documentation](https://supabase.com/docs/guides/functions)
- [Resend Documentation](https://resend.com/docs)
- [SendGrid API Documentation](https://docs.sendgrid.com/api-reference)
