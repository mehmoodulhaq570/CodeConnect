# CodeConnect - Developer Community Platform

A niche social platform for developers to share code snippets, projects, and technical insights.

## 🚀 Features Implemented

### Backend (Node.js + Express + MongoDB)
- ✅ User Authentication (JWT-based register, login, logout)
- ✅ User Profiles with bio, skills, and social links
- ✅ Post system with code snippets and tags
- ✅ Likes system for posts
- ✅ Comments system (threaded)
- ✅ Follow/Unfollow functionality
- ✅ Feed system (posts from followed users)
- ✅ Input validation and error handling
- ✅ RESTful API design

### Frontend (React + TypeScript + Tailwind CSS)
- ✅ Modern React with TypeScript
- ✅ Tailwind CSS for styling
- ✅ React Router for navigation
- ✅ Authentication context and state management
- ✅ Responsive design
- ✅ Login and Register pages
- ✅ Home feed with posts
- ✅ Navbar with user authentication state
- ✅ API service layer with axios

## 📁 Project Structure

```
CodeConnect/
├── backend/                 # Node.js + Express API
│   ├── controllers/         # Route controllers
│   ├── models/             # MongoDB schemas
│   ├── routes/             # API routes
│   ├── middleware/         # Custom middleware
│   ├── .env                # Environment variables
│   └── server.js           # Express server
├── frontend/               # React + TypeScript client
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── contexts/       # React contexts
│   │   ├── services/       # API services
│   │   ├── types/          # TypeScript types
│   │   └── utils/          # Utility functions
│   ├── .env               # Environment variables
│   └── package.json       # Dependencies
└── README.md
```

## 🛠 Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **express-validator** - Input validation

### Frontend
- **React 18** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first CSS
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Vite** - Build tool

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (running locally or connection string)
- npm or yarn

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` with your configuration:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/codeconnect
   JWT_SECRET=your_super_secret_jwt_key_here
   JWT_EXPIRE=7d
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```
   
   The API will be available at `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   # Create .env file
   echo "VITE_API_URL=http://localhost:5000/api" > .env
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```
   
   The app will be available at `http://localhost:5173`

## 📚 API Documentation

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Users
- `GET /api/users/profile/:id` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `POST /api/users/follow/:id` - Follow user
- `DELETE /api/users/unfollow/:id` - Unfollow user
- `GET /api/users/search` - Search users

### Posts
- `GET /api/posts` - Get feed posts
- `POST /api/posts` - Create new post
- `GET /api/posts/:id` - Get single post
- `PUT /api/posts/:id` - Update post
- `DELETE /api/posts/:id` - Delete post
- `POST /api/posts/:id/like` - Like post
- `DELETE /api/posts/:id/unlike` - Unlike post
- `GET /api/posts/user/:userId` - Get user posts

### Comments
- `GET /api/posts/:postId/comments` - Get post comments
- `POST /api/posts/:postId/comments` - Add comment
- `PUT /api/comments/:id` - Update comment
- `DELETE /api/comments/:id` - Delete comment

## 🎯 Next Steps

### Phase 2 Features (To Implement)
- [ ] Post creation page with code editor
- [ ] Syntax highlighting with Prism.js
- [ ] Profile page with user posts
- [ ] Post detail page with comments
- [ ] Follow/unfollow functionality in UI
- [ ] File upload for profile pictures
- [ ] Real-time notifications
- [ ] Search functionality
- [ ] Mobile responsiveness improvements

### Phase 3 Features (Future)
- [ ] Code execution sandbox
- [ ] Achievement badges
- [ ] Learning paths
- [ ] Study buddy matching
- [ ] Analytics dashboard
- [ ] PWA capabilities

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with modern web technologies
- Inspired by developer community platforms
- Created for learning and portfolio purposes
