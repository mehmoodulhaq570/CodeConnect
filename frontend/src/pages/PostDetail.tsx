import { useState, useEffect, FormEvent } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { useAuth } from "../contexts/AuthContext";
import { likeService } from "../services/supabaseService";
import { supabase } from "../lib/supabase";
import { Post } from "../types";

interface Comment {
  id: string;
  content: string;
  user_id: string;
  post_id: string;
  created_at: string;
  author: {
    id: string;
    username: string;
    profile_picture?: string;
  };
}

export default function PostDetail() {
  const { id } = useParams<{ id: string }>();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentText, setCommentText] = useState("");
  const [loading, setLoading] = useState(true);
  const [submittingComment, setSubmittingComment] = useState(false);

  useEffect(() => {
    const fetchPostAndComments = async () => {
      if (!id) return;

      try {
        setLoading(true);

        // Fetch post
        const { data: postData, error: postError } = await supabase
          .from("posts")
          .select(
            `
            *,
            author:profiles!posts_user_id_fkey(id, username, email, profile_picture),
            likes:likes(user_id)
          `
          )
          .eq("id", id)
          .single();

        if (postError) throw postError;

        setPost({
          ...postData,
          likesCount: postData.likes_count || 0,
          likes: postData.likes || [],
        });

        // Fetch comments
        const { data: commentsData, error: commentsError } = await supabase
          .from("comments")
          .select(
            `
            *,
            author:profiles!comments_user_id_fkey(id, username, profile_picture)
          `
          )
          .eq("post_id", id)
          .order("created_at", { ascending: false });

        if (commentsError) throw commentsError;
        setComments(commentsData || []);
      } catch (error: any) {
        console.error("Error fetching post:", error);
        toast.error("Failed to load post");
      } finally {
        setLoading(false);
      }
    };

    fetchPostAndComments();
  }, [id]);

  const handleLike = async () => {
    if (!isAuthenticated || !user || !post) {
      toast.error("Please sign in to like posts");
      return;
    }

    try {
      const isLiked = post.likes?.some((like) => like.id === user.id);

      if (isLiked) {
        await likeService.unlikePost(user.id, post.id);
        setPost({
          ...post,
          likes: (post.likes || []).filter((like) => like.id !== user.id),
          likesCount: (post.likesCount || 0) - 1,
        });
      } else {
        await likeService.likePost(user.id, post.id);
        toast.success("Post liked!");
        setPost({
          ...post,
          likes: [...(post.likes || []), user],
          likesCount: (post.likesCount || 0) + 1,
        });
      }
    } catch (error) {
      console.error("Failed to toggle like:", error);
      toast.error("Failed to update like");
    }
  };

  const handleSubmitComment = async (e: FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated || !user) {
      toast.error("Please sign in to comment");
      return;
    }

    if (!commentText.trim()) {
      toast.error("Comment cannot be empty");
      return;
    }

    if (!id) return;

    try {
      setSubmittingComment(true);

      const { data, error } = await supabase
        .from("comments")
        .insert([
          {
            post_id: id,
            user_id: user.id,
            content: commentText.trim(),
          },
        ])
        .select(
          `
          *,
          author:profiles!comments_user_id_fkey(id, username, profile_picture)
        `
        )
        .single();

      if (error) throw error;

      setComments([data, ...comments]);
      setCommentText("");
      toast.success("Comment posted!");

      // Update comment count
      if (post) {
        setPost({ ...post, commentCount: (post.commentCount || 0) + 1 });
      }
    } catch (error: any) {
      console.error("Error posting comment:", error);
      toast.error("Failed to post comment");
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleDeletePost = async () => {
    if (!post || !user || post.user_id !== user.id) return;

    if (!window.confirm("Are you sure you want to delete this post?")) return;

    try {
      const { error } = await supabase.from("posts").delete().eq("id", post.id);

      if (error) throw error;

      toast.success("Post deleted successfully");
      navigate("/home");
    } catch (error: any) {
      console.error("Error deleting post:", error);
      toast.error("Failed to delete post");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="max-w-4xl mx-auto text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Post Not Found
        </h2>
        <p className="text-gray-600 mb-6">
          The post you're looking for doesn't exist or has been deleted.
        </p>
        <Link to="/home" className="btn-primary">
          Back to Feed
        </Link>
      </div>
    );
  }

  const isLiked = post.likes?.some((like) => like.id === user?.id);
  const isAuthor = user?.id === post.user_id;

  return (
    <div className="max-w-4xl mx-auto">
      <Toaster position="top-center" reverseOrder={false} />

      {/* Post Content */}
      <div className="bg-white rounded-lg shadow-md p-8 mb-6">
        {/* Author Info */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center space-x-3">
            <img
              src={
                post.author.profilePicture ||
                `https://ui-avatars.com/api/?name=${post.author.username}&background=3b82f6&color=fff`
              }
              alt={post.author.username}
              className="w-12 h-12 rounded-full"
            />
            <div>
              <Link
                to={`/profile/${post.author.id}`}
                className="font-medium text-gray-900 hover:text-primary-600"
              >
                {post.author.username}
              </Link>
              <p className="text-sm text-gray-500">
                {new Date(
                  post.created_at || post.createdAt || ""
                ).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </div>

          {isAuthor && (
            <button
              onClick={handleDeletePost}
              className="text-red-600 hover:text-red-700 text-sm font-medium"
            >
              Delete Post
            </button>
          )}
        </div>

        {/* Post Content */}
        <h1 className="text-3xl font-bold text-gray-900 mb-4">{post.title}</h1>
        <p className="text-gray-800 whitespace-pre-wrap mb-6">{post.content}</p>

        {/* Code Snippet */}
        {post.code_snippet && (
          <div className="mb-6">
            <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-gray-400 font-medium uppercase">
                  {post.language || "code"}
                </span>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(post.code_snippet || "");
                    toast.success("Code copied to clipboard!");
                  }}
                  className="text-xs text-gray-400 hover:text-white transition-colors px-3 py-1 rounded hover:bg-gray-800"
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

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {post.tags.map((tag, index) => (
              <span
                key={index}
                className="inline-block bg-gray-100 text-gray-700 text-sm px-3 py-1 rounded-full"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Like and Comment Stats */}
        <div className="flex items-center space-x-6 pt-6 border-t border-gray-200">
          <button
            onClick={handleLike}
            disabled={!isAuthenticated}
            className={`flex items-center space-x-2 transition-colors ${
              isLiked
                ? "text-red-600 hover:text-red-700"
                : "text-gray-500 hover:text-red-600"
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            <svg
              className="w-6 h-6"
              fill={isLiked ? "currentColor" : "none"}
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
            <span className="font-medium">{post.likesCount || 0}</span>
          </button>

          <div className="flex items-center space-x-2 text-gray-500">
            <svg
              className="w-6 h-6"
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
            <span className="font-medium">{comments.length}</span>
          </div>
        </div>
      </div>

      {/* Comments Section */}
      <div className="bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Comments ({comments.length})
        </h2>

        {/* Comment Form */}
        {isAuthenticated ? (
          <form onSubmit={handleSubmitComment} className="mb-8">
            <div className="flex space-x-3">
              <img
                src={
                  user?.profilePicture ||
                  `https://ui-avatars.com/api/?name=${user?.username}&background=3b82f6&color=fff`
                }
                alt={user?.username}
                className="w-10 h-10 rounded-full flex-shrink-0"
              />
              <div className="flex-1">
                <textarea
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Add a comment..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors resize-none"
                  rows={3}
                  disabled={submittingComment}
                />
                <div className="mt-3 flex justify-end">
                  <button
                    type="submit"
                    disabled={submittingComment || !commentText.trim()}
                    className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submittingComment ? "Posting..." : "Post Comment"}
                  </button>
                </div>
              </div>
            </div>
          </form>
        ) : (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center mb-8">
            <p className="text-gray-600 mb-3">
              Sign in to join the conversation
            </p>
            <Link to="/login" className="btn-primary inline-block">
              Sign In
            </Link>
          </div>
        )}

        {/* Comments List */}
        {comments.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-3">
              <svg
                className="w-12 h-12 mx-auto"
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
            </div>
            <p className="text-gray-600">
              No comments yet. Be the first to comment!
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {comments.map((comment) => (
              <div key={comment.id} className="flex space-x-3">
                <img
                  src={
                    comment.author.profile_picture ||
                    `https://ui-avatars.com/api/?name=${comment.author.username}&background=3b82f6&color=fff`
                  }
                  alt={comment.author.username}
                  className="w-10 h-10 rounded-full flex-shrink-0"
                />
                <div className="flex-1">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <Link
                        to={`/profile/${comment.author.id}`}
                        className="font-medium text-gray-900 hover:text-primary-600"
                      >
                        {comment.author.username}
                      </Link>
                      <span className="text-xs text-gray-500">
                        {new Date(comment.created_at).toLocaleDateString(
                          "en-US",
                          {
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        )}
                      </span>
                    </div>
                    <p className="text-gray-800 whitespace-pre-wrap">
                      {comment.content}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
