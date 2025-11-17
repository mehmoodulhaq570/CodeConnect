import api from './api';
import { Post, PaginatedResponse } from '../types';

export const postService = {
  // Get all posts (feed)
  getPosts: async (page = 1, limit = 10): Promise<PaginatedResponse<Post>> => {
    const response = await api.get(`/posts?page=${page}&limit=${limit}`);
    return {
      data: response.data.posts,
      pagination: response.data.pagination,
    };
  },

  // Get single post
  getPost: async (id: string): Promise<{ post: Post }> => {
    const response = await api.get(`/posts/${id}`);
    return response.data;
  },

  // Create post
  createPost: async (content: string, codeSnippet?: { code: string; language: string }, tags?: string[]): Promise<{ post: Post }> => {
    const response = await api.post('/posts', { content, codeSnippet, tags });
    return response.data;
  },

  // Update post
  updatePost: async (id: string, content: string, codeSnippet?: { code: string; language: string }, tags?: string[]): Promise<{ post: Post }> => {
    const response = await api.put(`/posts/${id}`, { content, codeSnippet, tags });
    return response.data;
  },

  // Delete post
  deletePost: async (id: string): Promise<{ message: string }> => {
    const response = await api.delete(`/posts/${id}`);
    return response.data;
  },

  // Like post
  likePost: async (id: string): Promise<{ message: string; likeCount: number }> => {
    const response = await api.post(`/posts/${id}/like`);
    return response.data;
  },

  // Unlike post
  unlikePost: async (id: string): Promise<{ message: string; likeCount: number }> => {
    const response = await api.delete(`/posts/${id}/unlike`);
    return response.data;
  },

  // Get user posts
  getUserPosts: async (userId: string, page = 1, limit = 10): Promise<PaginatedResponse<Post>> => {
    const response = await api.get(`/posts/user/${userId}?page=${page}&limit=${limit}`);
    return {
      data: response.data.posts,
      pagination: response.data.pagination,
    };
  },
};
