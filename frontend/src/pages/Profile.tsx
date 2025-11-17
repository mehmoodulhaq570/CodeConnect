import React from 'react';
import { useParams } from 'react-router-dom';

const Profile: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="max-w-4xl mx-auto">
      <div className="card">
        <h2 className="text-2xl font-bold mb-4">Profile Page</h2>
        <p className="text-gray-600">User ID: {id}</p>
        <p className="text-gray-600">This page will show user profile information, posts, and allow following/unfollowing.</p>
      </div>
    </div>
  );
};

export default Profile;
