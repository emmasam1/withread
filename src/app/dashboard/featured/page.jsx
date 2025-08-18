"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useApp } from "@/app/context/context";
import { formatDistanceToNow } from "date-fns";
import Image from "next/image";
import { Skeleton } from "antd";
import Link from "next/link";

const Page = () => {
  const { API_BASE_URL, token } = useApp();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/post/featured`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPosts(res.data.posts || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (API_BASE_URL && token) {
      fetchData();
    }
  }, [API_BASE_URL, token]);

  return (
    <div className="p-4">
      {loading ? (
        Array(4)
          .fill(null)
          .map((_, i) => (
            <div key={i} className="p-4 bg-white shadow rounded-lg mb-4">
              <Skeleton avatar active paragraph={{ rows: 4 }} />
            </div>
          ))
      ) : posts.length === 0 ? (
        <p className="text-center text-gray-500">No posts to display.</p>
      ) : (
        posts.map((post) => (
          <div key={post._id} className="p-4 bg-white shadow rounded-lg mb-4">
            {/* Header */}
            <div className="flex items-center mb-3 justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full">
                  {post.author.avatar ? (
                    <img
                      src={post.author.avatar}
                      alt="Avatar"
                      className="rounded-full w-10 h-10 object-cover"
                    />
                  ) : (
                    <span className="text-sm font-semibold text-gray-600 !bg-[#F6F6F6] rounded-full w-10 h-10 flex items-center justify-center">
                      {post?.author?.firstName?.charAt(0).toUpperCase()}
                      {post?.author?.lastName?.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
                <div>
                  <h1 className="font-medium text-sm text-gray-800">
                    {post.author.firstName} {post.author.lastName}
                  </h1>
                  <span className="text-xs text-gray-500">
                    {formatDistanceToNow(new Date(post.createdAt), {
                      addSuffix: true,
                    })}
                  </span>
                </div>
              </div>
              <div className="text-gray-400 text-lg font-bold">...</div>
            </div>

            {/* Post image */}
            <div className="rounded-lg overflow-hidden">
              {Array.isArray(post?.images) &&
                post.images.length > 0 &&
                post.images[0] && (
                  <Image
                    src={post.images[0]}
                    alt="Post image"
                    width={800}
                    height={300}
                    className="rounded w-full object-cover mb-2 max-h-[300px] sm:max-h-[400px] object-top"
                  />
                )}
            </div>

            {/* Post title and content */}
            <div className="mt-3">
              <h1 className="font-semibold">{post.title}</h1>
              <p className="text-sm text-gray-700 mt-2">
                {post.content?.slice(0, 200)}...
                <Link
                  href={`/dashboard/feeds/${post._id}`}
                  className="text-blue-500 ml-1"
                >
                  Read More
                </Link>
              </p>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Page;
