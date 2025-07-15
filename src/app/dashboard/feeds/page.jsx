"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Button, Dropdown, Skeleton, Space } from "antd";
import Image from "next/image";
import axios from "axios";
import { useApp } from "../../context/context";
import { toast } from "react-toastify";
import Link from "next/link";

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
  const { user, API_BASE_URL, token, toggleFollowUser } = useApp();
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [likedAnimation, setLikedAnimation] = useState(null);
  const observerRef = useRef();
  const [loadingUserId, setLoadingUserId] = useState(null);

  const fetchPosts = async (pageNumber = 1) => {
    if (!API_BASE_URL) return;

    try {
      setLoading(true);
      const endpoint =
        user && token
          ? `${API_BASE_URL}/api/post/user/post-by-interest?page=${pageNumber}&limit=10`
          : `${API_BASE_URL}/api/post/all-posts?page=${pageNumber}&limit=10`;

      const res = await axios.get(endpoint, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      // console.log(res);
      const fetchedPosts = res.data.posts || [];
      if (pageNumber === 1) {
        setPosts(fetchedPosts);
      } else {
        setPosts((prev) => [...prev, ...fetchedPosts]);
      }

      setHasMore(pageNumber < res.data.totalPages);
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if ((user && !token) || !API_BASE_URL) return;
    fetchPosts(1);
  }, [API_BASE_URL, user, token]);

  const lastPostRef = useCallback(
    (node) => {
      if (loading) return;
      if (observerRef.current) observerRef.current.disconnect();

      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prevPage) => {
            const nextPage = prevPage + 1;
            fetchPosts(nextPage);
            return nextPage;
          });
        }
      });

      if (node) observerRef.current.observe(node);
    },
    [loading, hasMore]
  );

  const handleLikeDislike = async (postId) => {
    if (!token) return toast.error("You need to log in to like posts.");

    const isLiked = posts
      .find((p) => p._id === postId)
      ?.likes.includes(user._id);

    if (!isLiked) {
      setLikedAnimation(postId);
      setTimeout(() => setLikedAnimation(null), 300);
    }

    try {
      const action = isLiked ? "dislike" : "like";
      const res = await axios.put(
        `${API_BASE_URL}/api/post/${postId}/like-dislike`,
        { action },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const updatedPost = res.data.post;
      setPosts((prev) => prev.map((p) => (p._id === postId ? updatedPost : p)));
      toast.success(res.data.message);
    } catch (err) {
      console.error("Like error:", err);
      toast.error("Something went wrong. Please try again.");
    }
  };

  const AvatarPlaceholder = ({ text }) => (
    <h1 className="font-semibold text-gray-400">{text}</h1>
  );

const handleFollowToggle = async (userId) => {
  setLoadingUserId(userId);         // 👈 local loading state
  await toggleFollowUser(userId);   // 👈 this still calls the one from context
  setLoadingUserId(null);
};


  return (
    <div className="space-y-8 w-full">
      {posts.map((post, index) => {
        const isLastPost = posts.length === index + 1;
        const initials = `${post?.author?.firstName?.[0] || ""}${
          post?.author?.lastName?.[0] || ""
        }`.toUpperCase();
        const isLiked = post.likes.includes(user?._id);

        return (
          <div
            key={post._id}
            ref={isLastPost ? lastPostRef : null}
            className=" rounded-lg p-4 shadow-md w-full mx-auto bg-white"
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-3">
                {post.isAnonymous ? (
                  <AvatarPlaceholder text="Anonymous" />
                ) : post.author?.avatar ? (
                  <div className="w-10 h-10 rounded-full">
                    <Image
                      src={post.author.avatar}
                      alt="user image"
                      width={45}
                      height={45}
                      className="rounded-full object-cover w-full h-full"
                    />
                  </div>
                ) : (
                  <div className="!bg-[#F6F6F6] rounded-full p-2 w-12 h-12 flex justify-center items-center">
                    <AvatarPlaceholder text={initials} />
                  </div>
                )}
                <div>
                  <p className="font-medium text-gray-800">
                    {post.isAnonymous
                      ? ""
                      : `${post.author?.firstName} ${post.author?.lastName}`}
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(post.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-3">
                  {!post.isAnonymous &&
                    post?.author &&
                    post.author._id !== user?._id && (
                      <Button
                        loading={loadingUserId === post?.author?._id}
                        onClick={() => handleFollowToggle(post?.author?._id)}
                        type="text"
                        className="!px-3 !bg-black !text-white !rounded-full"
                      >
                        {user?.following?.includes(post?.author?._id)
                          ? "Following"
                          : post.collaborators?.length > 0
                          ? "Follow Both"
                          : "Follow"}
                      </Button>
                    )}
                </div>

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

            {/* Image */}
            {post.images?.length > 0 && (
              <div className="my-3">
                <Image
                  src={post.images[0]}
                  alt="Post image"
                  width={800}
                  height={300}
                  className="rounded w-full object-cover mb-2 max-h-130 object-top"
                />
              </div>
            )}

            {/* Content */}
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-2">
                {post.title || "Untitled"}
              </h2>

              <p>
                {post.content.slice(0, 100)}...
                <Link href={`/dashboard/feeds/${post._id}`} className="text-sm">
                  Read More
                </Link>
              </p>
            </div>

            {/* Footer */}
            <div className="flex justify-between items-center mt-3">
              <div className="flex gap-6 items-center">
                <button
                  onClick={() => handleLikeDislike(post._id)}
                  className={`cursor-pointer flex items-center gap-1 text-xs rounded-full py-1 px-3 transition-all duration-300 ${
                    isLiked
                      ? "bg-blue-100 text-blue-600"
                      : "bg-gray-300 text-gray-800"
                  } ${likedAnimation === post._id ? "scale-110" : "scale-100"}`}
                >
                  <Image
                    src="/images/like.png"
                    alt="like icon"
                    width={15}
                    height={15}
                  />
                  {isLiked ? "Liked" : "Like"}
                  <Image src="/images/dot.png" alt="dot" width={3} height={3} />
                  {post.likes.length}
                </button>
                <Link href={`/dashboard/feeds/${post._id}`}>
                  <p className="flex items-center gap-1 text-xs cursor-pointer">
                    <Image
                      src="/images/comment.png"
                      alt="comment icon"
                      width={15}
                      height={15}
                    />
                    Comment
                  </p>
                </Link>
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
              <div className="flex gap-1.5 text-xs items-center">
                <p>{post.comments.length} Comments</p>
                <Image src="/images/dot.png" alt="dot" width={3} height={3} />
                <p>{post.comments.length} Impressions</p>
              </div>
            </div>
          </div>
        );
      })}

      {/* Loading Skeleton */}
      {loading && (
        <div className="space-y-4 max-w-3xl mx-auto">
          {Array(2)
            .fill(null)
            .map((_, i) => (
              <div key={i} className="bg-white rounded-lg p-4 shadow-md">
                <Skeleton active avatar paragraph={{ rows: 3 }} />
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default ForYou;
