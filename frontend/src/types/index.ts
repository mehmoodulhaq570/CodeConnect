export interface User {
  id: string;
  username: string;
  email: string;
  bio?: string;
  skills?: string[];
  socialLinks?: {
    github?: string;
    linkedin?: string;
    twitter?: string;
    website?: string;
  };
  profilePicture?: string | null;
  followers?: User[];
  following?: User[];
  createdAt?: string;
}

export interface Post {
  id: string;
  user_id: string;
  author: User;
  title: string;
  content: string;
  code_snippet?: string | null;
  language?: string | null;
  likesCount?: number;
  likes?: User[];
  likeCount?: number;
  commentCount?: number;
  tags?: string[];
  isEdited?: boolean;
  created_at?: string;
  updated_at?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Comment {
  id?: string;
  post?: string;
  post_id?: string;
  author: User;
  content: string;
  parentComment?: string;
  parent_id?: string;
  replies?: Comment[];
  likeCount?: number;
  isEdited?: boolean;
  created_at?: string;
  updated_at?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthResponse {
  message?: string;
  user?: User;
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

export interface Profile {
  id: string;
  username: string;
  email: string;
  avatar_url?: string | null;
  created_at: string;
  updated_at: string;
}

export interface Like {
  id: string;
  user_id: string;
  post_id: string;
  created_at: string;
}
