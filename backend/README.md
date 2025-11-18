# Backend Directory - DEPRECATED

## ⚠️ Migration Notice

This backend directory is **no longer used** as the CodeConnect application has been migrated to **Supabase + PostgreSQL + Edge Functions**.

### What was removed:
- ❌ MongoDB models (User, Post, Comment)
- ❌ Express.js controllers and routes
- ❌ JWT authentication middleware
- ❌ Node.js server (server.js)
- ❌ MongoDB dependencies

### What replaced it:
- ✅ **Supabase Auth** - Handles user authentication with email + OAuth
- ✅ **PostgreSQL** - Database with Row Level Security
- ✅ **Supabase Client** - Direct database operations from frontend
- ✅ **Edge Functions** - Serverless functions (if needed)

### Current Architecture:
```
Frontend (React + TypeScript + Supabase Client)
    ↓
Supabase (Auth + Database + Storage + Edge Functions)
    ↓
PostgreSQL (with RLS policies)
```

### If you need Edge Functions:
You can use this directory for Supabase Edge Functions:
1. Install Supabase CLI: `npm install -g supabase`
2. Initialize: `supabase init`
3. Create functions: `supabase functions new function-name`
4. Deploy: `supabase functions deploy`

### To completely remove this directory:
```bash
cd ..
rm -rf backend
```

The entire application now runs on the frontend with Supabase handling all backend operations.
