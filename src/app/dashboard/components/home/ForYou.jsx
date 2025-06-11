"use client";

import React, { useState, useEffect } from "react";
import { Button, Dropdown, Skeleton, Space } from "antd";
import Image from "next/image";
import axios from "axios";
import { useApp } from "../../../context/context";

const items = [
  { label: "Not interested in this post", key: "0" },
  { label: "Remove this post from my feed", key: "1" },
  { type: "divider" },
  { label: "Mute", key: "2" },
  { label: "Block", key: "3" },
  { label: "Report", key: "4" },
  { label: "Show fewer posts like this", key: "5" },
];

const ForYou = () => {
  const { user, API_BASE_URL, token } = useApp();
  const [allPost, setAllPost] = useState([]);
  const [allInterestPost, setAllInterestPost] = useState([]);

  
  const getAllPost = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/post/all-posts`);
      setAllPost(res.data.posts);
    } catch (error) {
      console.error("Error fetching all posts:", error);
    }
  };
  
 const getAllInterestPost = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/post/user/post-by-interest`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setAllInterestPost(res.data.posts);
    } catch (error) {
      console.error("Error fetching interest posts:", error);
    }
  };



  useEffect(() => {
    if (!API_BASE_URL) return;
    if (user) {
      getAllInterestPost();
    } else {
      getAllPost();
    }
  }, [API_BASE_URL, user]);

  const posts = user ? allInterestPost : allPost;

  return (
    <div className="space-y-8">
      {posts.length === 0 ? (
        Array(3)
          .fill(null)
          .map((_, index) => (
            <div
              key={index}
              className="bg-white rounded-lg p-2 shadow-md w-full max-w-3xl mx-auto"
            >
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-3">
                  <Skeleton.Avatar active size="default" shape="circle" />
                  <div className="space-y-1">
                    <Skeleton.Input style={{ width: 120 }} active size="small" />
                    <Skeleton.Input style={{ width: 100 }} active size="small" />
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Skeleton.Button active size="small" shape="round" />
                  <Skeleton.Input style={{ width: 20 }} active size="small" />
                </div>
              </div>
              <div className="my-3">
                <div className="w-full h-[200px] bg-gray-200 rounded" />
              </div>
              <div className="space-y-2">
                <Skeleton.Input style={{ width: 200 }} active size="default" />
                <Skeleton paragraph={{ rows: 2 }} active />
              </div>
              <div className="flex justify-between items-center mt-3">
                <div className="flex gap-6">
                  <Skeleton.Input style={{ width: 80 }} active size="small" />
                  <Skeleton.Input style={{ width: 80 }} active size="small" />
                  <Skeleton.Input style={{ width: 80 }} active size="small" />
                </div>
                <div className="flex gap-3">
                  <Skeleton.Input style={{ width: 80 }} active size="small" />
                  <Skeleton.Input style={{ width: 80 }} active size="small" />
                </div>
              </div>
            </div>
          ))
      ) : (
        posts.map((post, index) => (
          <div
            key={index}
            className="bg-white rounded-lg p-4 shadow-md w-full max-w-3xl mx-auto"
          >
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-3">
                <Image
                  src={post.author?.avatar || "/images/default-avatar.png"}
                  alt="User Avatar"
                  width={40}
                  height={40}
                  className="rounded-full"
                />
                <div>
                  <p className="font-medium text-gray-800">
                    {post.author?.firstName} {post.author?.lastName}
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(post.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  size="small"
                  className="!bg-black !text-[#D9D9D9] !border-0 !rounded-full !py-1 !px-3"
                >
                  Follow
                </Button>
                <Dropdown menu={{ items }} trigger={["click"]} placement="bottomRight">
                  <a onClick={(e) => e.preventDefault()}>
                    <Space>
                      <Image
                        src="/images/Frame.png"
                        alt="More options"
                        width={18}
                        height={12}
                      />
                    </Space>
                  </a>
                </Dropdown>
              </div>
            </div>

            {post.images?.length > 0 && (
              <div className="my-3">
                <Image
                  src={post.images[0]}
                  alt="Post image"
                  width={800}
                  height={300}
                  className="rounded w-full object-cover"
                />
              </div>
            )}

            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-2">
                {post.topic || "Untitled"}
              </h2>
              <p className="text-sm text-gray-600">{post.content}</p>
            </div>

            <div className="flex justify-between items-center mt-3">
              <div className="flex justify-between items-center gap-6">
                <p className="flex items-center gap-1 text-xs bg-gray-300 rounded-full py-1 px-3">
                  <Image src="/images/like.png" alt="icon" width={15} height={15} /> Likes{" "}
                  <Image src="/images/dot.png" alt="icon" width={3} height={3} />{" "}
                  {post.likes.length}
                </p>
                <p className="flex items-center gap-1 text-xs">
                  <Image src="/images/comment.png" alt="icon" width={15} height={15} />{" "}
                  Comments
                </p>
                <p className="flex items-center gap-1 text-xs">
                  <Image src="/images/share.png" alt="icon" width={15} height={15} /> Share
                </p>
              </div>
              <div className="flex justify-between items-center gap-1.5">
                <p className="flex items-center gap-1 text-xs">
                  {post.comments.length} Comments
                </p>
                <Image src="/images/dot.png" alt="icon" width={3} height={3} />
                <p className="flex items-center gap-1 text-xs">
                  {post.comments.length} Impressions
                </p>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default ForYou;
