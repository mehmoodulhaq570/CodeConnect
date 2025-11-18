# CodeConnect Setup Guide

## 🎯 Current Status
✅ **Frontend is running** - Your React app is live!
✅ **Supabase structure created** - All configuration files ready
⚠️ **Supabase CLI installation failed** - We'll use alternative setup

## 🚀 Next Steps (Choose Option A or B)

### Option A: Quick Setup with Supabase Cloud (Recommended)

#### 1. Create Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Sign up/login with GitHub
3. Click "New Project"
4. Choose organization and enter:
   - **Name**: CodeConnect
   - **Database Password**: (create a strong password)
   - **Region**: Choose closest to you

#### 2. Get Your Credentials
1. Go to **Settings** > **API**
2. Copy these values:
   - **Project URL** (looks like: `https://abcdefgh.supabase.co`)
   - **Anon public key** (starts with `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`)

#### 3. Configure Environment
1. Create `.env` file in the `frontend` folder:
```env
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

#### 4. Set Up Database
1. In Supabase dashboard, go to **SQL Editor**
2. Copy the contents of `frontend/supabase/migrations/20231118000000_initial_schema.sql`
3. Paste and run the SQL script
4. This creates all tables, policies, and functions

#### 5. Enable Authentication
1. Go to **Authentication** > **Providers**
2. **Email** should already be enabled
3. **Optional**: Enable Google/GitHub OAuth:
   - Click on Google/GitHub
   - Add your OAuth credentials
   - Set redirect URL to your domain

#### 6. Test Your App
1. Restart your dev server: `npm run dev`
2. The demo warning should disappear
3. Try signing up with email
4. Create a post and test functionality

---

### Option B: Alternative CLI Installation

If you want to try the CLI again:

#### Method 1: Direct Download
1. Go to [Supabase CLI Releases](https://github.com/supabase/cli/releases)
2. Download `supabase_windows_amd64.zip`
3. Extract and add to your PATH

#### Method 2: Using Scoop
```powershell
# Install Scoop first (if not installed)
Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
irm get.scoop.sh | iex

# Install Supabase CLI
scoop bucket add supabase https://github.com/supabase/scoop-bucket.git
scoop install supabase
```

#### Method 3: Using Chocolatey
```powershell
# Install Chocolatey first (if not installed)
Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))

# Install Supabase CLI
choco install supabase
```

---

## 🔧 Current App Status

Your app is running in **Demo Mode** because Supabase isn't configured yet. You'll see:
- ✅ Demo post with code snippet
- ✅ All UI components working
- ⚠️ Yellow warning banner about setup needed
- ❌ Authentication won't work until Supabase is configured

## 🎯 Recommended Path

**Go with Option A** - it's faster and doesn't require CLI installation. You can always install the CLI later for advanced features.

## 📞 Need Help?

If you encounter issues:
1. Check the browser console for errors
2. Verify your `.env` file has the correct values
3. Make sure the database schema was applied correctly
4. Check Supabase dashboard for any error logs

## 🎉 Once Setup is Complete

You'll have:
- ✅ Full authentication (email + OAuth)
- ✅ Real database with your posts
- ✅ File uploads for avatars
- ✅ Real-time updates
- ✅ Secure Row Level Security

Let me know which option you choose and I'll help you through it!
