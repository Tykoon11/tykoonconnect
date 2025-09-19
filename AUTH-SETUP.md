# 🔐 Authentication Setup Guide

This guide shows how to set up real authentication with Google and GitHub OAuth providers in production.

## Current Status: Demo Mode ✅

The authentication system is currently running in **demo mode** with placeholder credentials. This allows you to:
- ✅ Test all auth forms and UI
- ✅ See Google and GitHub OAuth buttons
- ✅ Experience the complete signup/signin flow
- ✅ View success messages and error handling

## For Production: Set Up Real Authentication

### 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project"
3. Create a new organization and project
4. Wait for the project to be ready (2-3 minutes)

### 2. Get Supabase Credentials

From your Supabase project dashboard:

1. Go to **Settings** → **API**
2. Copy these values:
   - **Project URL** (e.g., `https://your-project-ref.supabase.co`)
   - **Anon public** key (starts with `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`)
   - **Service role** key (starts with `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`)

### 3. Configure OAuth Providers

#### Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing
3. Enable **Google+ API**
4. Go to **Credentials** → **Create Credentials** → **OAuth 2.0 Client IDs**
5. Set application type to **Web application**
6. Add authorized redirect URIs:
   ```
   https://your-project-ref.supabase.co/auth/v1/callback
   ```
7. Copy the **Client ID** and **Client Secret**

In Supabase:
1. Go to **Authentication** → **Providers** → **Google**
2. Enable Google provider
3. Add your Google **Client ID** and **Client Secret**
4. Save configuration

#### GitHub OAuth Setup

1. Go to [GitHub Settings](https://github.com/settings/applications/new)
2. Register a new OAuth app:
   - **Application name**: `tykoonConnect`
   - **Homepage URL**: `https://your-domain.com`
   - **Authorization callback URL**: `https://your-project-ref.supabase.co/auth/v1/callback`
3. Copy the **Client ID** and generate a **Client Secret**

In Supabase:
1. Go to **Authentication** → **Providers** → **GitHub**
2. Enable GitHub provider
3. Add your GitHub **Client ID** and **Client Secret**
4. Save configuration

### 4. Update Environment Variables

Replace the placeholder values in your `.env.local` file:

```bash
# Replace with your real Supabase credentials
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# Your site URL (update for production)
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

### 5. Set Up Database Schema

Run the Prisma migrations to set up your database schema:

```bash
# Set your database URL (get from Supabase Settings > Database)
DATABASE_URL="postgresql://postgres:your-password@db.your-project-ref.supabase.co:5432/postgres"

# Run migrations
npx prisma migrate dev --name init

# Generate Prisma client
npx prisma generate

# Optional: Seed with sample data
npx prisma db seed
```

### 6. Configure Site Settings

In Supabase:
1. Go to **Authentication** → **URL Configuration**
2. Add your site URL to **Site URL**: `https://your-domain.com`
3. Add redirect URLs for development: `http://localhost:3000`

### 7. Test Authentication

1. Restart your development server: `npm run dev`
2. Visit `http://localhost:3000/auth/signup`
3. Try signing up with Google or GitHub
4. Check that users are created in your Supabase **Authentication** tab

## Authentication Flow

### Magic Link (Email)
1. User enters email and form data
2. Supabase sends magic link via email
3. User clicks link → redirects to `/auth/callback`
4. Callback creates user profile in database
5. User is redirected to dashboard

### OAuth (Google/GitHub)
1. User clicks Google/GitHub button
2. Redirected to OAuth provider
3. After authorization → redirects to `/auth/callback`
4. Callback creates user profile in database
5. User is redirected to dashboard

## Security Features

✅ **Row Level Security (RLS)** - Users can only access their own data  
✅ **Email verification** - Magic links verify email ownership  
✅ **OAuth integration** - Secure third-party authentication  
✅ **Session management** - Automatic session refresh  
✅ **CSRF protection** - Built into Supabase Auth  

## User Profiles

The system automatically creates user profiles with:
- Basic info (name, email, handle)
- Role selection (client/freelancer/both)
- Profile customization (bio, skills, location)
- Rating system integration
- Payment preferences

## Demo vs Production

| Feature | Demo Mode | Production |
|---------|-----------|------------|
| **Form UI** | ✅ Full UI | ✅ Full UI |
| **Validation** | ✅ Client-side | ✅ Full validation |
| **OAuth Buttons** | ✅ Visible | ✅ Functional |
| **Email Links** | ❌ Simulated | ✅ Real emails |
| **User Creation** | ❌ Simulated | ✅ Real database |
| **Session Management** | ❌ Demo only | ✅ Real sessions |
| **Profile Pages** | ❌ Demo data | ✅ Real profiles |

## Troubleshooting

### Common Issues

1. **"Invalid redirect URL"** - Add your callback URL to Supabase settings
2. **OAuth provider errors** - Check client ID/secret in both provider and Supabase
3. **Database connection** - Verify DATABASE_URL is correct
4. **Email not sending** - Check Supabase email settings and quotas

### Development vs Production URLs

Make sure your OAuth redirect URLs match your environment:

**Development**: `https://your-project-ref.supabase.co/auth/v1/callback`  
**Production**: Same URL (Supabase handles the redirect back to your site)

---

**Need help?** Check the [Supabase Auth documentation](https://supabase.com/docs/guides/auth) or create an issue in this repository.