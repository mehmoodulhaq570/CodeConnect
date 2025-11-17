import React from 'react';
import { useParams } from 'react-router-dom';

const PostDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="max-w-4xl mx-auto">
      <div className="card">
        <h2 className="text-2xl font-bold mb-4">Post Detail</h2>
        <p className="text-gray-600">Post ID: {id}</p>
        <p className="text-gray-600">This page will show the full post with comments and allow interaction.</p>
      </div>
    </div>
  );
};

export default PostDetail;
