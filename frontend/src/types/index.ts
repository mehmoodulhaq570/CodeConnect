export interface User {
  id: string;
  username: string;
  email: string;
  bio: string;
  skills: string[];
  socialLinks: {
    github?: string;
    linkedin?: string;
    twitter?: string;
    website?: string;
  };
  profilePicture: string;
  followers: User[];
  following: User[];
  createdAt: string;
}

export interface Post {
  _id: string;
  author: User;
  content: string;
  codeSnippet?: {
    code: string;
    language: string;
  };
  tags: string[];
  likes: User[];
  likeCount: number;
  commentCount: number;
  isEdited: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  _id: string;
  post: string;
  author: User;
  content: string;
  parentComment?: string;
  replies: Comment[];
  likeCount: number;
  isEdited: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}

export interface ApiResponse<T> {
  message?: string;
  data?: T;
  error?: string;
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationInfo;
}
