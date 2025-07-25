"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Button, Dropdown, Skeleton, Space, Modal } from "antd";
import Image from "next/image";
import axios from "axios";
import { useApp } from "../../context/context";
import { toast } from "react-toastify";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

const ForYou = () => {
  const { user, API_BASE_URL, token, toggleFollowUser } = useApp();
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [likedAnimation, setLikedAnimation] = useState(null);
  const [loadingUserId, setLoadingUserId] = useState(null);
  const observerRef = useRef();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [blockUserId, seBlockUserId] = useState(false);

  console.log(posts);

  const showModal = (post) => {
    setSelectedPost(post);
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setSelectedPost(null);
  };

  const fetchPosts = async (pageNumber = 1, reset = false) => {
    if (!API_BASE_URL) return;

    const controller = new AbortController();
    const signal = controller.signal;

    try {
      if (reset) setLoading(true);

      const endpoint = token
        ? `${API_BASE_URL}/api/post/user/post-by-interest?page=${pageNumber}&limit=10`
        : `${API_BASE_URL}/api/post/all-posts?page=${pageNumber}&limit=10`;

      const res = await axios.get(endpoint, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        signal,
      });

      const fetchedPosts = res.data.posts || [];
      setPosts((prev) =>
        pageNumber === 1 || reset ? fetchedPosts : [...prev, ...fetchedPosts]
      );

      setHasMore(pageNumber < res.data.totalPages);
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("Previous fetch aborted");
      } else {
        console.error("Error fetching posts:", error);
      }
    } finally {
      if (reset) setLoading(false);
    }

    return () => controller.abort();
  };

  const notInterested = async (id) => {
    if (!id) return;
    try {
      await axios.put(
        `${API_BASE_URL}/api/preference/${id}/not-interested`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("Post removed.");
      setPosts((prev) => prev.filter((post) => post._id !== id)); // ✅ Optimistic update
    } catch (error) {
      toast.error("Failed to remove post.");
    }
  };

  const removePost = async (id) => {
    if (!id) return;
    try {
      const res = await axios.put(
        `${API_BASE_URL}/api/preference/${id}/remove`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("Post removed successfully.");
      console.log(res);
      setPosts((prev) => prev.filter((post) => post._id !== id)); // Optimistic update
    } catch (error) {
      console.error("Error removing post:", error);
      toast.error("Failed to remove post.");
    }
  };

  useEffect(() => {
    if (!API_BASE_URL) return;
    if (token === undefined) return; // Wait until token state is known

    // Clear posts immediately when switching auth state
    setPosts([]);
    setPage(1);

    fetchPosts(1, true); // Fetch correct feed for current state
  }, [API_BASE_URL, token]);

  const lastPostRef = useCallback(
    (node) => {
      if (loading) return;
      if (observerRef.current) observerRef.current.disconnect();

      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          const nextPage = page + 1;
          setPage(nextPage);
          fetchPosts(nextPage);
        }
      });

      if (node) observerRef.current.observe(node);
    },
    [loading, hasMore, page]
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

  const handleFollowToggle = async (userId) => {
    if (!user) return toast.error("You need to log in to follow users.");

    setLoadingUserId(userId);
    await toggleFollowUser(userId);
    setLoadingUserId(null);
  };

  console.log("Current following list:", user?.following);

  useEffect(() => {
    console.log("User context updated:", user);
  }, [user]);

  const AvatarPlaceholder = ({ text }) => (
    <h1 className="font-semibold text-gray-400">{text}</h1>
  );

  const blockUser = async () => {
    const id = selectedPost?.author?._id;
    if (!id) return;
    try {
      seBlockUserId(true);
      const res = await axios.post(
        `${API_BASE_URL}/api/user/block/${id}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log(res);
      toast.success("User blocked successfully.");
      setIsModalOpen(false);
      fetchPosts(1, true); // Refresh posts after blocking
      setSelectedPost(null);
    } catch (error) {
      console.error("Error blocking user:", error);
      toast.error("Failed to block user.");
    } finally {
      seBlockUserId(false);
    }
  };

  return (
    <div className="space-y-8 w-full">
      {/* Modal */}

      <Modal
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
        closable
        centered
        className="!p-8"
      >
        {!selectedPost ? (
          <div className="text-center">
            <Skeleton.Avatar
              active
              size={64}
              shape="circle"
              className="mx-auto mb-4"
            />
            <Skeleton active paragraph={{ rows: 2 }} />
          </div>
        ) : (
          <>
            <Image
              src="/images/block.png"
              alt="block icon"
              width={120}
              height={120}
              className="mx-auto mb-4"
            />

            <p className="text-center font-semibold text-2xl">
              Block <strong>@{selectedPost.author?.username}</strong>?
            </p>

            <p className="text-center mt-2 text-gray-500 text-sm">
              This user will not be able to follow you or view your posts, and
              you will not see posts or notifications from @
              {selectedPost.author?.username}.
            </p>

            <div className="flex justify-center gap-4 mt-6">
              <Button
                onClick={handleCancel}
                className="!bg-[#EDEDEE] !rounded-full !px-10 !py-5 !border-0 hover:!text-black"
              >
                Cancel
              </Button>
              <Button
                className="!bg-[#FF9E80] !rounded-full !text-white !px-10 !py-5 !border-0 hover:!text-white"
                onClick={() => {
                  blockUser(selectedPost.author?._id);
                }}
                loading={blockUserId}
              >
                Block
              </Button>
            </div>
          </>
        )}
      </Modal>

      {posts.map((post, index) => {
        const isLastPost = posts.length === index + 1;
        const initials = `${post?.author?.firstName?.[0] || ""}${
          post?.author?.lastName?.[0] || ""
        }`.toUpperCase();
        const isLiked = post.likes.includes(user?._id);

        const dropdownItems = [
          {
            label: "Not interested in this post",
            key: "0",
            onClick: () => notInterested(post._id),
          },
          {
            label: "Remove this post from my feed",
            key: "1",
            onClick: () => removePost(post._id),
          },
          { type: "divider" },
          { label: "Mute", key: "2" },
          {
            label: "Block",
            key: "3",
            onClick: () => showModal(post),
          },
          { label: "Report", key: "4" },
          { label: "Show fewer posts like this", key: "5" },
        ];

        let follow_text = user?.following?.includes(post?.author?._id)
          ? "Following"
          : "Follow";

        console.log(user?.following, "=============", post?.author?._id);

        return (
          <div
            key={post._id}
            ref={isLastPost ? lastPostRef : null}
            className="rounded-lg p-4 shadow-md w-full mx-auto bg-white"
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
                    {formatDistanceToNow(new Date(post.createdAt), {
                      addSuffix: true,
                    })}
                  </p>
                </div>
              </div>
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
                      {follow_text}
                    </Button>
                  )}

                {user && post?.author && post.author._id !== user._id ? (
                  <Dropdown menu={{ items: dropdownItems }} trigger={["click"]}>
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
                ) : null}
              </div>
            </div>

            {/* Image */}
            {post.images?.length > 0 ? (
              <div className="my-3">
                <Image
                  src={post.images[0]}
                  alt="Post image"
                  width={800}
                  height={300}
                  className="rounded w-full object-cover mb-2 max-h-130 object-top"
                />
              </div>
            ) : (
              <div className="my-3">
                <Image
                  src="/images/no-image.jpg"
                  alt="No image"
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

              <p className="text-sm text-gray-700 mb-2">
                {post.content.slice(0, 100)}...
                <Link
                  href={`/dashboard/feeds/${post._id}`}
                  className="text-blue-500 ml-1"
                >
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
                <p>{post.views || 0} Impressions</p>
              </div>
            </div>
          </div>
        );
      })}

      {/* Skeleton Loader */}
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
