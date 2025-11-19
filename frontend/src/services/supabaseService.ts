import { supabase } from "../lib/supabase";

// Profile Services
export const profileService = {
  async getProfile(userId: string) {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) throw error;
    return data;
  },

  async updateProfile(userId: string, updates: any) {
    const { data, error } = await supabase
      .from("profiles")
      .update(updates)
      .eq("id", userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },
};

// Post Services
export const postService = {
  async getPosts() {
    const { data, error } = await supabase
      .from("posts")
      .select(
        `
        *,
        profiles:profiles(username, avatar_url),
        likes:likes(count)
      `
      )
      .order("created_at", { ascending: false });

    if (error) throw error;

    return (
      data?.map((post: any) => ({
        ...post,
        author: {
          id: post.user_id,
          username: post.profiles?.username || "Unknown",
          profilePicture: post.profiles?.avatar_url || null,
        },
        likesCount: post.likes?.[0]?.count || 0,
      })) || []
    );
  },

  async getPost(id: string) {
    const { data, error } = await supabase
      .from("posts")
      .select(
        `
        *,
        profiles:profiles(username, avatar_url),
        likes:likes(count)
      `
      )
      .eq("id", id)
      .single();

    if (error) throw error;

    const post = data as any;
    return {
      ...post,
      author: {
        id: post.user_id,
        username: post.profiles?.username || "Unknown",
        profilePicture: post.profiles?.avatar_url || null,
      },
      likesCount: post.likes?.[0]?.count || 0,
    };
  },

  async createPost(post: any) {
    const { data, error } = await supabase
      .from("posts")
      .insert(post)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updatePost(id: string, updates: any) {
    const { data, error } = await supabase
      .from("posts")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deletePost(id: string) {
    const { error } = await supabase.from("posts").delete().eq("id", id);

    if (error) throw error;
  },

  async getUserPosts(userId: string) {
    const { data, error } = await supabase
      .from("posts")
      .select(
        `
        *,
        profiles:profiles(username, avatar_url),
        likes:likes(count)
      `
      )
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) throw error;

    return (
      data?.map((post: any) => ({
        ...post,
        author: {
          id: post.user_id,
          username: post.profiles?.username || "Unknown",
          profilePicture: post.profiles?.avatar_url || null,
        },
        likesCount: post.likes?.[0]?.count || 0,
      })) || []
    );
  },

  // Alias for getUserPosts
  getPostsByUser(userId: string) {
    return this.getUserPosts(userId);
  },
};

// Like Services
export const likeService = {
  async likePost(userId: string, postId: string) {
    const { data, error } = await supabase
      .from("likes")
      .insert({ user_id: userId, post_id: postId })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async unlikePost(userId: string, postId: string) {
    const { error } = await supabase
      .from("likes")
      .delete()
      .eq("user_id", userId)
      .eq("post_id", postId);

    if (error) throw error;
  },

  async isPostLiked(userId: string, postId: string) {
    const { data, error } = await supabase
      .from("likes")
      .select("*")
      .eq("user_id", userId)
      .eq("post_id", postId)
      .single();

    return !error && data;
  },

  async getUserLikedPosts(userId: string) {
    const { data, error } = await supabase
      .from("likes")
      .select(
        `
        posts:posts(*, profiles:profiles(username, avatar_url))
      `
      )
      .eq("user_id", userId);

    if (error) throw error;

    return (
      data?.map((like: any) => ({
        ...like.posts,
        author: {
          id: like.posts.user_id,
          username: like.posts.profiles?.username || "Unknown",
          profilePicture: like.posts.profiles?.avatar_url || null,
        },
      })) || []
    );
  },
};

// File Upload Service
export const uploadService = {
  async uploadAvatar(file: File, userId: string) {
    const fileExt = file.name.split(".").pop();
    const fileName = `${userId}/avatar.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(fileName, file, { upsert: true });

    if (uploadError) throw uploadError;

    const {
      data: { publicUrl },
    } = supabase.storage.from("avatars").getPublicUrl(fileName);

    return publicUrl;
  },

  async uploadPostImage(file: File, postId: string) {
    const fileExt = file.name.split(".").pop();
    const fileName = `${postId}/${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("post-images")
      .upload(fileName, file);

    if (uploadError) throw uploadError;

    const {
      data: { publicUrl },
    } = supabase.storage.from("post-images").getPublicUrl(fileName);

    return publicUrl;
  },
};
