# Authentication Setup Guide

## 🔐 Enable Google OAuth in Supabase

### Step 1: Configure Google OAuth
1. Go to your Supabase Dashboard
2. Navigate to **Authentication** → **Providers**
3. Find **Google** and click **Configure**
4. Enable Google provider
5. Add your Google OAuth credentials:
   - **Client ID**: Get from Google Cloud Console
   - **Client Secret**: Get from Google Cloud Console

### Step 2: Get Google OAuth Credentials
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Go to **Credentials** → **Create Credentials** → **OAuth 2.0 Client IDs**
5. Set Application type to **Web application**
6. Add authorized redirect URIs:
   ```
   https://your-project-id.supabase.co/auth/v1/callback
   ```
7. Copy Client ID and Client Secret to Supabase

### Step 3: Configure Site URL
1. In Supabase Dashboard, go to **Authentication** → **Settings**
2. Set **Site URL** to: `http://localhost:5173` (for development)
3. Add **Redirect URLs**:
   ```
   http://localhost:5173
   http://localhost:5173/**
   ```

### Step 4: Disable Email Confirmation (for testing)
1. Go to **Authentication** → **Settings**
2. Turn OFF **Enable email confirmations**
3. Turn OFF **Enable phone confirmations**

## 🛠️ Troubleshooting Authentication

### Common Issues:

**1. "Unsupported provider" Error**
- Ensure Google provider is enabled in Supabase
- Check OAuth credentials are correctly entered
- Verify redirect URLs are properly configured

**2. "Database error saving new user"**
- Check if user_profiles table exists
- Verify RLS policies allow user creation
- Check handle_new_user trigger is working

**3. Redirect Issues**
- Ensure Site URL matches your development URL
- Add all possible redirect URLs
- Check for trailing slashes

### Testing Steps:
1. Try email/password signup first
2. Check if user appears in Authentication → Users
3. Verify user_profiles table gets populated
4. Test Google OAuth after email works

## 📧 Email/Password Authentication

### Enable Email Auth:
1. Go to **Authentication** → **Providers**
2. Ensure **Email** is enabled
3. Configure email templates if needed
4. Test signup/login flow

### Test User Creation:
```sql
-- Check if user was created
SELECT * FROM auth.users ORDER BY created_at DESC LIMIT 5;

-- Check if profile was created
SELECT * FROM user_profiles ORDER BY created_at DESC LIMIT 5;
```

Your authentication should now work properly! 🎉
</AUTHENTICATION_SETUP.md>