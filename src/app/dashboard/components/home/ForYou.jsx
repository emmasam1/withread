"use client";

import React, { useState, useEffect } from "react";
import { Button, Dropdown, Skeleton, Space } from "antd";
import Image from "next/image";
import axios from "axios";
import { useApp } from "../../../context/context";
import { toast } from "react-toastify";

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
  const [loading, setLoading] = useState(true); 
  const [likedAnimation, setLikedAnimation] = useState(null);


  const posts = user ? allInterestPost : allPost;

  useEffect(() => {
    if (!API_BASE_URL) return;
    if (user && !token) return;

    const fetchData = async () => {
      try {
        setLoading(true); 
        if (user && token) {
          const res = await axios.get(
            `${API_BASE_URL}/api/post/user/post-by-interest`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          setAllInterestPost(res.data.posts);
        } else {
          const res = await axios.get(`${API_BASE_URL}/api/post/all-posts`);
          setAllPost(res.data.posts);
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [API_BASE_URL, user, token]);

const handleLikeDislike = async (postId) => {
  if (!token) {
    toast.error("You need to log in to like posts.");
    return;
  }
  const currentPost = allPost.find(post => post._id === postId);
  const isLiked = currentPost?.likes.includes(user._id); 

  if (!isLiked) {
    setLikedAnimation(postId);
    setTimeout(() => setLikedAnimation(null), 300);
  }

  try {
    const action = isLiked ? "dislike" : "like";

    const response = await axios.put(
      `${API_BASE_URL}/api/post/${postId}/like-dislike`,
      { action },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const updatedPost = response.data.post;
    toast.success(response.data.message);

    const updateState = (prev) =>
      prev.map((post) => (post._id === postId ? updatedPost : post));

    setAllPost(updateState);
    setAllInterestPost(updateState);
  } catch (err) {
    console.error("Error toggling like/dislike:", err);
    toast.error("Something went wrong. Please try again.");
  }
};

      const AvatarPlaceholder = ({ text }) => (
               <h1 className="font-semibold text-gray-400">{text}</h1>
            );
      const isAnonymous = "Anonymous";

  return (
    <div className="space-y-8">
      {loading
        ? Array(3)
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
                    <Skeleton.Input style={{ width: 50 }} active size="small" />
                    <Skeleton.Input style={{ width: 50 }} active size="small" />
                    <Skeleton.Input style={{ width: 50 }} active size="small" />
                  </div>
                  <div className="flex gap-3">
                    <Skeleton.Input style={{ width: 10 }} active size="small" />
                  </div>
                </div>
              </div>
            ))
        : posts.map((post, index) => {
            const initials = `${post?.author?.firstName?.[0] || ""}${post?.author?.lastName?.[0] || ""}`.toUpperCase();
            const isLiked = post.likes.includes(user?._id);
            return (
              <div
                key={index}
                className="bg-white rounded-lg p-4 shadow-md w-full max-w-3xl mx-auto"
              >
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-3">
                  {post?.isAnonymous ? (
                     <AvatarPlaceholder text={isAnonymous} />
                    ) : post?.author?.avatar ? (
                      <Image
                        src={post.author.avatar}
                        alt="user image"
                        width={45}
                        height={45}
                        className="rounded-full"
                      />
                    ) : (
                      <div className="!bg-[#F6F6F6] rounded-full p-2 w-12 h-12 flex justify-center items-center">
                        <AvatarPlaceholder text={initials} />
                      </div>
                    )}
                    <div>
                      <p className="font-medium text-gray-800">
                        {post.isAnonymous ? '' : `${post.author?.firstName || ''} ${post.author?.lastName || ''}`}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(post.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                 <div className="flex items-center gap-3">
                    {!post.isAnonymous && (
                      <Button
                        type="text"
                        className="!p-0 !text-gray-500 hover:!text-gray-700"
                      >
                        {post.collaborators?.length > 0 ? 'Follow Both' : 'Follow'}
                      </Button>
                    )}
                    <Dropdown
                      menu={{ items }}
                      trigger={["click"]}
                      placement="bottomRight"
                    >
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
                    {post.title || "Untitled"}
                  </h2>
                  <p className="text-sm text-gray-600">{post.content}</p>
                </div>

                <div className="flex justify-between items-center mt-3">
                  <div className="flex justify-between items-center gap-6">
                  <button
                    onClick={() => handleLikeDislike(post._id, isLiked)}
                    className={`cursor-pointer flex items-center gap-1 text-xs rounded-full py-1 px-3 transition-all duration-300 ${
                      isLiked ? "bg-blue-100 text-blue-600" : "bg-gray-300 text-gray-800"
                    } ${likedAnimation === post._id ? "scale-110" : "scale-100"}`}
                  >
                    <Image
                      src="/images/like.png"
                      alt="like icon"
                      width={15}
                      height={15}
                    />
                    {isLiked ? "Liked" : "Like"}
                    <Image
                      src="/images/dot.png"
                      alt="dot"
                      width={3}
                      height={3}
                    />
                    {post.likes.length}
                  </button>
                    <p className="flex items-center gap-1 text-xs">
                      <Image
                        src="/images/comment.png"
                        alt="comment icon"
                        width={15}
                        height={15}
                      />
                      Comments
                    </p>
                    <p className="flex items-center gap-1 text-xs">
                      <Image
                        src="/images/share.png"
                        alt="share icon"
                        width={15}
                        height={15}
                      />
                      Share
                    </p>
                  </div>
                  <div className="flex justify-between items-center gap-1.5">
                    <p className="flex items-center gap-1 text-xs">
                      {post.comments.length} Comments
                    </p>
                    <Image src="/images/dot.png" alt="dot" width={3} height={3} />
                    <p className="flex items-center gap-1 text-xs">
                      {post.comments.length} Impressions
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
    </div>
  );
};

export default ForYou;
