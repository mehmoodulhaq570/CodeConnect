# Supabase Configuration

This directory contains all Supabase-related configuration and code for the CodeConnect project.

## 📁 Directory Structure

```
supabase/
├── config.toml              # Supabase local development configuration
├── migrations/              # Database schema migrations
│   └── 20231118000000_initial_schema.sql
├── functions/               # Edge Functions (serverless functions)
│   └── hello-world/         # Sample Edge Function
│       └── index.ts
├── seed.sql                 # Sample data for development
└── README.md               # This file
```

## 🚀 Getting Started

### 1. Install Supabase CLI

```bash
npm install -g supabase
```

### 2. Initialize Supabase (if not already done)

```bash
# From the frontend directory
supabase init
```

### 3. Start Local Development

```bash
# Start local Supabase services
supabase start

# This will start:
# - PostgreSQL database (port 54322)
# - Supabase Studio (port 54323)
# - API Gateway (port 54321)
# - Auth server
# - Storage server
```

### 4. Apply Database Migrations

```bash
# Apply the initial schema
supabase db reset

# Or apply specific migration
supabase migration up
```

### 5. Seed Database (Optional)

```bash
# Load sample data
supabase db seed
```

## 🔧 Configuration

### Environment Variables

The main app uses these environment variables (set in `.env`):

- `VITE_SUPABASE_URL` - Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Your Supabase anonymous key

### OAuth Providers

To enable Google/GitHub login:

1. Go to your Supabase dashboard
2. Navigate to Authentication > Providers
3. Enable and configure Google/GitHub
4. Set redirect URLs to your app domain

## 📊 Database Schema

The database includes these main tables:

- **profiles** - User profiles (linked to auth.users)
- **posts** - Code posts with snippets
- **likes** - Post likes
- **comments** - Post comments

All tables have Row Level Security (RLS) enabled for data protection.

## ⚡ Edge Functions

Edge Functions are serverless TypeScript/JavaScript functions that run on Supabase's global network.

### Creating a New Function

```bash
# Create new function
supabase functions new my-function

# Deploy function
supabase functions deploy my-function
```

### Local Development

```bash
# Serve functions locally
supabase functions serve

# Test function
curl -X POST http://localhost:54321/functions/v1/hello-world \
  -H "Content-Type: application/json" \
  -d '{"name": "World"}'
```

## 🔄 Deployment

### Deploy to Production

```bash
# Link to your Supabase project
supabase link --project-ref your-project-ref

# Push database changes
supabase db push

# Deploy functions
supabase functions deploy
```

## 📝 Notes

- The TypeScript errors in Edge Functions are expected - they run in Deno environment
- Local development uses different ports than production
- All authentication is handled by Supabase Auth
- File uploads go to Supabase Storage buckets
