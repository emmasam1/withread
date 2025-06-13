// "use client";
// import { useApp } from "../../../context/context";
// import React from "react";

// const PostDetails = async ({ params }) => {
//   const { API_BASE_URL, setLoading, loading, setUser, user, setToken } =
//     useApp();

//   // ✅ Server-side data fetching
//   const fetchPost = async (id) => {
//     const res = await fetch(`${API_BASE_URL}/api/post/${id}`, {
//       cache: "no-store",
//     });

//     if (!res.ok) throw new Error("Post not found");
//     return res.json();
//   };
//   const { id } = params; // ✅ this is the correct way
//   const data = await fetchPost(id);
//   const post = data.post;
//   console.log(id);

//   return (
//     <div className="max-w-3xl mx-auto p-4">
//       <h1 className="text-2xl font-bold">{post.title}</h1>
//       <p className="mt-2 text-gray-700 whitespace-pre-wrap">{post.content}</p>
//     </div>
//   );
// };

// export default PostDetails;

'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useApp } from '../../../context/context';

const Page = ({ params }) => {
  const { API_BASE_URL, setLoading, user, token } = useApp();
  const { id } = params;

  const [post, setPost] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPost = async () => {
      if (!API_BASE_URL || !id) return;

      try {
        setLoading(true);
        const res = await axios.get(`${API_BASE_URL}/api/post/${id}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        setPost(res.data.post);
      } catch (err) {
        console.error('Error fetching post:', err);
        setError('Post not found.');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [API_BASE_URL, id, token, setLoading]);

  if (error) {
    return (
      <div className="max-w-3xl mx-auto p-6 text-red-600 text-center">
        {error}
      </div>
    );
  }

  if (!post) {
    return (
      <div className="max-w-3xl mx-auto p-6 text-gray-600 text-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold">{post.title}</h1>
      <p className="mt-4 text-gray-700 whitespace-pre-wrap">{post.content}</p>
    </div>
  );
};

export default Page;



