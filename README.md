# CodeConnect - Supabase + PostgreSQL + Edge Functions Stack

A modern developer community platform built with React, TypeScript, and Supabase.

## 🚀 Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Backend**: Supabase (PostgreSQL + Edge Functions)
- **Authentication**: Supabase Auth (Email + OAuth - Google/GitHub)
- **Database**: PostgreSQL with Row Level Security
- **Storage**: Supabase Storage for avatars and post images
- **Styling**: Tailwind CSS
- **Routing**: React Router v6

## 📋 Features

- ✅ User authentication (Email + Social OAuth)
- ✅ User profiles with avatars
- ✅ Create and share code posts
- ✅ Like/unlike posts
- ✅ Real-time updates
- ✅ Row-level security
- ✅ File uploads
- ✅ Responsive design

## 📁 Project Structure

```
CodeConnect/
├── frontend/                    # React application
│   ├── src/
│   │   ├── lib/supabase.ts     # Supabase client configuration
│   │   ├── services/           # API services
│   │   ├── contexts/           # React contexts (Auth)
│   │   ├── pages/              # React pages
│   │   └── components/         # React components
│   ├── supabase/               # Supabase configuration
│   │   ├── config.toml         # Local development config
│   │   ├── migrations/         # Database migrations
│   │   ├── functions/          # Edge Functions
│   │   └── seed.sql           # Sample data
│   └── .env.example           # Environment variables template
└── README.md                  # This file
```

## 🛠️ Setup Instructions

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd CodeConnect/frontend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set up Supabase

#### Option A: Use Existing Supabase Project
1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Go to Settings > API and copy your Project URL and Anon Key
3. Run the database schema from `supabase/migrations/20231118000000_initial_schema.sql` in the Supabase SQL Editor

#### Option B: Local Development with Supabase CLI
1. Install Supabase CLI: `npm install -g supabase`
2. Start local services: `supabase start`
3. Apply migrations: `supabase db reset`

### 4. Configure Environment Variables

Create a `.env` file in the `frontend` directory:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 5. Run the Application

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## 🔐 Authentication Setup

### Enable OAuth Providers (Optional)

1. Go to your Supabase dashboard
2. Navigate to Authentication > Providers
3. Enable Google and/or GitHub
4. Configure OAuth credentials
5. Set redirect URLs to your domain

## 🗄️ Database Schema

The application uses these main tables:

- **profiles** - User profiles (auto-created from auth.users)
- **posts** - Code posts with snippets and metadata
- **likes** - Post likes with user relationships
- **comments** - Post comments

All tables have Row Level Security (RLS) policies for data protection.

## ⚡ Edge Functions

Serverless functions for custom backend logic:

```bash
# Create new function
supabase functions new my-function

# Deploy function
supabase functions deploy my-function

# Test locally
supabase functions serve
```

## 🎨 Styling

The app uses Tailwind CSS with custom utility classes:

- `btn-primary` - Primary button styling
- `post-card` - Post card container
- `card` - Generic card styling

## 🚀 Deployment

### Frontend Deployment

Deploy to Vercel, Netlify, or any static hosting:

```bash
npm run build
```

### Supabase Deployment

```bash
# Link to your project
supabase link --project-ref your-project-ref

# Push database changes
supabase db push

# Deploy functions
supabase functions deploy
```

## 🔧 Development

### Local Development

```bash
# Start Supabase services
supabase start

# Start React app
npm run dev

# View Supabase Studio
open http://localhost:54323
```

### Database Changes

```bash
# Create new migration
supabase migration new migration_name

# Apply migrations
supabase db reset

# Generate TypeScript types
supabase gen types typescript --local > src/types/supabase.ts
```

## 🐛 Troubleshooting

### Common Issues

1. **Blank page**: Check if environment variables are set correctly
2. **Auth not working**: Verify Supabase URL and keys
3. **Database errors**: Ensure migrations are applied
4. **OAuth issues**: Check redirect URLs in Supabase dashboard

### Demo Mode

The app runs in demo mode when Supabase is not configured, showing sample content.

## 📚 Learn More

- [Supabase Documentation](https://supabase.com/docs)
- [React Documentation](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [Vite Documentation](https://vitejs.dev)

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 5. Enable OAuth Providers

In your Supabase dashboard:

1. Go to Authentication > Providers
2. Enable Google OAuth:
   - Add your Google Client ID and Secret
   - Set authorized redirect URL to `https://your-project-ref.supabase.co/auth/v1/callback`
3. Enable GitHub OAuth:
   - Add your GitHub Client ID and Secret
   - Set the same redirect URL

### 6. Set up Storage Buckets

The schema automatically creates storage buckets, but you can verify them in:
- Storage > Buckets > `avatars` (public)
- Storage > Buckets > `post-images` (public)

### 7. Run the Application

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## 📁 Project Structure

```
CodeConnect/
├── frontend/
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── contexts/       # React contexts (Auth)
│   │   ├── lib/           # Supabase client and types
│   │   ├── pages/         # Page components
│   │   ├── services/      # API services
│   │   ├── types/         # TypeScript types
│   │   └── utils/         # Utility functions
│   ├── public/
│   ├── .env.example
│   └── package.json
├── database/
│   └── schema.sql         # PostgreSQL schema
└── README.md
```

## 🔐 Authentication Flow

1. **Email/Password**: Traditional signup with email confirmation
2. **OAuth**: Google/GitHub OAuth with automatic profile creation
3. **Session Management**: Supabase handles sessions automatically
4. **Profile Creation**: Profiles are created automatically on signup

## 🗄️ Database Schema

### Tables:
- `profiles`: User profiles extending auth.users
- `posts`: Code posts with title, content, and code snippets
- `likes`: Post likes with unique constraints

### Features:
- Row Level Security (RLS) for data protection
- Automatic timestamp updates
- Like count triggers
- Profile auto-creation on signup

## 📝 API Services

The application uses a service layer pattern:

- `profileService`: Profile management
- `postService`: CRUD operations for posts
- `likeService`: Like/unlike functionality
- `uploadService`: File upload to Supabase Storage

## 🎨 Styling

- **Tailwind CSS**: Utility-first CSS framework
- **Responsive Design**: Mobile-first approach
- **Custom Components**: Reusable UI components
- **Dark Mode Ready**: CSS variables for theming

## 🚀 Deployment

### Frontend (Vercel/Netlify):
1. Build the app: `npm run build`
2. Deploy the `frontend/dist` folder
3. Add environment variables to your deployment platform

### Supabase:
- Database and auth are already hosted by Supabase
- Edge Functions can be added for additional backend logic

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -m 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Troubleshooting

### Common Issues:

1. **Environment Variables Not Working**
   - Make sure your `.env` file is in the `frontend` directory
   - Restart your dev server after adding env variables

2. **OAuth Not Working**
   - Check your redirect URLs in Supabase dashboard
   - Verify your OAuth app settings in Google/GitHub

3. **Database Errors**
   - Make sure you've run the schema.sql in Supabase SQL Editor
   - Check RLS policies if you're getting permission errors

4. **Storage Issues**
   - Verify storage buckets are created and public
   - Check storage policies in Supabase dashboard
