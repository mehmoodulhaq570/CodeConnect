import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { postService, likeService } from "../services/supabaseService";
import { isSupabaseConfigured } from "../lib/supabase";
import { Post } from "../types";

const Home: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);

        // If Supabase is not configured, show demo content
        if (!isSupabaseConfigured()) {
          // Mock posts for demo
          const mockPosts: Post[] = [
            {
              id: "1",
              user_id: "demo-user",
              title: "Welcome to CodeConnect!",
              content:
                "This is a demo post. To see real posts and use authentication, please set up your Supabase environment variables.",
              code_snippet: 'console.log("Hello, CodeConnect!");',
              language: "javascript",
              author: {
                id: "demo-user",
                username: "Demo User",
                email: "demo@example.com",
                profilePicture: null,
              },
              likesCount: 5,
              likes: [],
              created_at: new Date().toISOString(),
            },
          ];
          setPosts(mockPosts);
          setLoading(false);
          return;
        }

        const response = await postService.getPosts();
        setPosts(response);
      } catch (error: any) {
        setError(error.message || "Failed to fetch posts");
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const handleLike = async (postId: string) => {
    if (!isAuthenticated || !user) return;

    if (!isSupabaseConfigured()) {
      alert(
        "Supabase not configured. Please set up environment variables to use this feature."
      );
      return;
    }

    try {
      const post = posts.find((p) => p.id === postId);
      if (!post) return;

      const isLiked = post.likes?.some((like) => like.id === user.id) || false;

      if (isLiked) {
        await likeService.unlikePost(user.id, postId);
        setPosts(
          posts.map((p) =>
            p.id === postId
              ? {
                  ...p,
                  likes: (p.likes || []).filter((like) => like.id !== user.id),
                  likeCount: (p.likeCount || 0) - 1,
                }
              : p
          )
        );
      } else {
        await likeService.likePost(user.id, postId);
        setPosts(
          posts.map((p) =>
            p.id === postId
              ? {
                  ...p,
                  likes: [...(p.likes || []), user],
                  likeCount: (p.likeCount || 0) + 1,
                }
              : p
          )
        );
      }
    } catch (error) {
      console.error("Failed to toggle like:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded inline-block">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {!isSupabaseConfigured() && (
        <div className="mb-6 bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded">
          <h3 className="font-semibold">⚠️ Demo Mode</h3>
          <p className="text-sm mt-1">
            Supabase is not configured. Please set up your environment variables
            to enable full functionality.
            <br />
            <strong>Steps:</strong> Copy <code>.env.example</code> to{" "}
            <code>.env</code> and add your Supabase credentials.
          </p>
        </div>
      )}

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Developer Feed
        </h1>
        <p className="text-gray-600">
          Share code, learn together, build amazing things
        </p>
      </div>

      {isAuthenticated && (
        <div className="mb-6">
          <Link
            to="/create-post"
            className="btn-primary inline-flex items-center"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            New Post
          </Link>
        </div>
      )}

      {posts.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-500 mb-4">
            <svg
              className="w-16 h-16 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No posts yet
          </h3>
          <p className="text-gray-600">
            {isAuthenticated
              ? "Start following developers to see their posts here"
              : "Sign up to start sharing and discovering code snippets"}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <div key={post.id} className="post-card">
              <div className="flex items-start space-x-3 mb-4">
                <img
                  src={
                    post.author.profilePicture ||
                    `https://ui-avatars.com/api/?name=${post.author.username}&background=3b82f6&color=fff`
                  }
                  alt={post.author.username}
                  className="w-10 h-10 rounded-full"
                />
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <Link
                      to={`/profile/${post.author.id}`}
                      className="font-medium text-gray-900 hover:text-primary-600"
                    >
                      {post.author.username}
                    </Link>
                    <span className="text-gray-500 text-sm">
                      {new Date(
                        post.created_at || post.createdAt || ""
                      ).toLocaleDateString()}
                    </span>
                    {post.isEdited && (
                      <span className="text-gray-400 text-sm">(edited)</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {post.title}
                </h3>
                <p className="text-gray-800 whitespace-pre-wrap">
                  {post.content}
                </p>
              </div>

              {post.code_snippet && (
                <div className="mb-4">
                  <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-gray-400 font-medium">
                        {post.language || "code"}
                      </span>
                      <button
                        onClick={() =>
                          navigator.clipboard.writeText(post.code_snippet || "")
                        }
                        className="text-xs text-gray-400 hover:text-white transition-colors"
                      >
                        Copy
                      </button>
                    </div>
                    <pre className="text-sm text-gray-300">
                      <code>{post.code_snippet}</code>
                    </pre>
                  </div>
                </div>
              )}

              {post.tags && post.tags.length > 0 && (
                <div className="mb-4 flex flex-wrap gap-2">
                  {post.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <div className="flex items-center space-x-4">
                  {isAuthenticated && (
                    <button
                      onClick={() => handleLike(post.id)}
                      className={`flex items-center space-x-1 transition-colors ${
                        post.likes?.some((like) => like.id === user?.id)
                          ? "text-red-600 hover:text-red-700"
                          : "text-gray-500 hover:text-red-600"
                      }`}
                    >
                      <svg
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
                      </svg>
                      <span className="text-sm">
                        {post.likesCount || post.likeCount || 0}
                      </span>
                    </button>
                  )}
                  <Link
                    to={`/post/${post.id}`}
                    className="flex items-center space-x-1 text-gray-500 hover:text-primary-600 transition-colors"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                      />
                    </svg>
                    <span className="text-sm">{post.commentCount || 0}</span>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
