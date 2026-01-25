# Clerk OAuth 404 Fix - Configuration Guide

## Problem
After Google OAuth sign-up, users were getting a `404: NOT_FOUND` error with ID like `bom1::nc42k-...`

## Code Changes Applied ✅

The following code changes have been implemented:

### 1. Fixed App.tsx
- Moved `BrowserRouter` outside `ClerkProvider`
- Added proper `navigate` prop using React Router's `useNavigate` hook
- Created `ClerkProviderWithRoutes` wrapper component

### 2. Fixed Auth.tsx
- Added `routing="path"` to both `ClerkSignUp` and `ClerkSignIn` components
- Added `path` prop to specify exact routes
- Added `signInUrl` and `signUpUrl` for cross-navigation

## Required Clerk Dashboard Configuration 🔧

To complete the fix, you **MUST** configure the following in your Clerk Dashboard:

### Step 1: Log into Clerk Dashboard
1. Go to https://dashboard.clerk.com
2. Select your application: `trusting-pelican-37`

### Step 2: Configure Redirect URLs

Navigate to: **Configure** → **Paths** in the sidebar

Add these URLs to **Allowed redirect URLs**:

#### For Local Development:
```
http://localhost:5173
http://localhost:5173/
http://localhost:5173/sign-up
http://localhost:5173/sign-in
http://localhost:5173/auth
```

#### For Production (replace with your domain):
```
https://yourdomain.com
https://yourdomain.com/
https://yourdomain.com/sign-up
https://yourdomain.com/sign-in
https://yourdomain.com/auth
```

### Step 3: Configure OAuth Settings

Navigate to: **Configure** → **SSO Connections** → **Google**

1. Ensure Google OAuth is enabled
2. Add **Authorized redirect URIs** in your Google Cloud Console:
   ```
   https://trusting-pelican-37.clerk.accounts.dev/v1/oauth_callback
   ```

### Step 4: Set Sign-in/Sign-up Paths

Navigate to: **Configure** → **Paths**

Set the following:
- **Sign-in path**: `/sign-in`
- **Sign-up path**: `/sign-up`
- **After sign-in URL**: `/`
- **After sign-up URL**: `/`

### Step 5: Enable Path-based Routing

Navigate to: **Configure** → **Paths**

- Enable **"Use path-based routing"** option if available

## Testing the Fix

1. Clear browser cache and cookies
2. Navigate to your sign-up page: `http://localhost:5173/sign-up`
3. Click "Continue with Google"
4. Complete the Google authentication
5. You should be redirected to `/` (home page) successfully

## Troubleshooting

If you still see 404 errors:

1. **Check Browser Console**: Look for any Clerk-related errors
2. **Verify Environment Variables**: Ensure `VITE_CLERK_PUBLISHABLE_KEY` is correct
3. **Check Clerk Dashboard**: Verify all redirect URLs are saved
4. **Clear Clerk Cache**:
   ```bash
   # Clear local storage in browser console
   localStorage.clear();
   ```
5. **Restart Dev Server**:
   ```bash
   npm run dev
   # or
   bun run dev
   ```

## Additional Notes

- The error `404: NOT_FOUND` typically indicates a redirect URL mismatch
- The error ID (`bom1::nc42k-...`) is from Clerk's edge network (BOM = Mumbai region)
- Path-based routing is more reliable than hash-based routing for OAuth flows

## What Changed in Code

**Before:**
```tsx
<ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY}>
  <BrowserRouter>
    {/* routes */}
  </BrowserRouter>
</ClerkProvider>
```

**After:**
```tsx
<BrowserRouter>
  <ClerkProvider
    publishableKey={CLERK_PUBLISHABLE_KEY}
    navigate={(to) => navigate(to)}
  >
    {/* routes */}
  </ClerkProvider>
</BrowserRouter>
```

And added routing configuration to Clerk components:
```tsx
<ClerkSignUp
  routing="path"
  path="/sign-up"
  signInUrl="/sign-in"
  afterSignUpUrl="/"
/>
```

---

**After completing the Clerk dashboard configuration, the Google OAuth sign-up should work perfectly!** 🎉
