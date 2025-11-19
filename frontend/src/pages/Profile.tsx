import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { useAuth } from "../contexts/AuthContext";
import { postService } from "../services/supabaseService";
import { supabase } from "../lib/supabase";
import { Post } from "../types";

interface Profile {
  id: string;
  username: string;
  email: string;
  bio?: string;
  profile_picture?: string;
  created_at: string;
}

export default function Profile() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedBio, setEditedBio] = useState("");
  const isOwnProfile = user?.id === id;

  useEffect(() => {
    const fetchProfileAndPosts = async () => {
      if (!id) return;

      try {
        setLoading(true);

        // Fetch profile
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", id)
          .single();

        if (profileError) throw profileError;
        setProfile(profileData);
        setEditedBio(profileData.bio || "");

        // Fetch user's posts
        const userPosts = await postService.getPostsByUser(id);
        setPosts(userPosts);
      } catch (error: any) {
        console.error("Error fetching profile:", error);
        toast.error("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfileAndPosts();
  }, [id]);

  const handleSaveBio = async () => {
    if (!profile) return;

    try {
      const { error } = await supabase
        .from("profiles")
        .update({ bio: editedBio })
        .eq("id", profile.id);

      if (error) throw error;

      setProfile({ ...profile, bio: editedBio });
      setIsEditing(false);
      toast.success("Bio updated successfully!");
    } catch (error: any) {
      console.error("Error updating bio:", error);
      toast.error("Failed to update bio");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="max-w-4xl mx-auto text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Profile Not Found
        </h2>
        <p className="text-gray-600 mb-6">
          The profile you're looking for doesn't exist.
        </p>
        <Link to="/home" className="btn-primary">
          Back to Feed
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Toaster position="top-center" reverseOrder={false} />

      {/* Profile Header */}
      <div className="bg-white rounded-lg shadow-md p-8 mb-6">
        <div className="flex items-start space-x-6">
          <img
            src={
              profile.profile_picture ||
              `https://ui-avatars.com/api/?name=${profile.username}&size=128&background=3b82f6&color=fff`
            }
            alt={profile.username}
            className="w-32 h-32 rounded-full ring-4 ring-gray-100"
          />
          <div className="flex-1">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {profile.username}
                </h1>
                <p className="text-gray-500">{profile.email}</p>
              </div>
              {isOwnProfile && (
                <Link
                  to="/settings"
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors text-sm font-medium"
                >
                  Edit Profile
                </Link>
              )}
            </div>

            {/* Bio Section */}
            <div className="mb-4">
              {isEditing ? (
                <div className="space-y-3">
                  <textarea
                    value={editedBio}
                    onChange={(e) => setEditedBio(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors resize-none"
                    rows={3}
                    placeholder="Tell us about yourself..."
                    maxLength={500}
                  />
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={handleSaveBio}
                      className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => {
                        setIsEditing(false);
                        setEditedBio(profile.bio || "");
                      }}
                      className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors text-sm font-medium"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <p className="text-gray-700 whitespace-pre-wrap">
                    {profile.bio || "No bio yet."}
                  </p>
                  {isOwnProfile && (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="mt-2 text-primary-600 hover:text-primary-700 text-sm font-medium"
                    >
                      Edit Bio
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Stats */}
            <div className="flex items-center space-x-6 text-sm">
              <div>
                <span className="font-bold text-gray-900">{posts.length}</span>
                <span className="text-gray-600 ml-1">Posts</span>
              </div>
              <div>
                <span className="font-bold text-gray-900">
                  {posts.reduce((acc, post) => acc + (post.likesCount || 0), 0)}
                </span>
                <span className="text-gray-600 ml-1">Likes Received</span>
              </div>
              <div>
                <span className="text-gray-600">
                  Joined{" "}
                  {new Date(profile.created_at).toLocaleDateString("en-US", {
                    month: "long",
                    year: "numeric",
                  })}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* User Posts */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          {isOwnProfile ? "Your Posts" : `${profile.username}'s Posts`}
        </h2>

        {posts.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <div className="text-gray-400 mb-4">
              <svg
                className="w-16 h-16 mx-auto"
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
            <p className="text-gray-600 mb-4">
              {isOwnProfile
                ? "Start sharing your code with the community!"
                : "This user hasn't posted anything yet."}
            </p>
            {isOwnProfile && (
              <Link to="/create-post" className="btn-primary inline-block">
                Create Your First Post
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => (
              <Link
                key={post.id}
                to={`/post/${post.id}`}
                className="block bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
              >
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {post.title}
                </h3>
                <p className="text-gray-700 mb-4 line-clamp-2">
                  {post.content}
                </p>

                {post.code_snippet && (
                  <div className="bg-gray-900 rounded-lg p-4 mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-gray-400 font-medium">
                        {post.language || "code"}
                      </span>
                    </div>
                    <pre className="text-sm text-gray-300 overflow-x-auto max-h-32">
                      <code>{post.code_snippet}</code>
                    </pre>
                  </div>
                )}

                {post.tags && post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
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

                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <span className="flex items-center">
                    <svg
                      className="w-4 h-4 mr-1"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
                    </svg>
                    {post.likesCount || 0}
                  </span>
                  <span className="flex items-center">
                    <svg
                      className="w-4 h-4 mr-1"
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
                    {post.commentCount || 0}
                  </span>
                  <span>
                    {new Date(
                      post.created_at || post.createdAt || ""
                    ).toLocaleDateString()}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
