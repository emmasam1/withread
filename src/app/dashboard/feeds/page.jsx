"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Button,
  Dropdown,
  Skeleton,
  Space,
  Modal,
  Form,
  Input,
  Select,
} from "antd";
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
  const [reportModal, setReportModal] = useState(false);
  const [toReport, setToReport] = useState(null);
  const [form] = Form.useForm();

  const showModal = (post) => {
    setSelectedPost(post);
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setSelectedPost(null);
  };

  const handleReportModal = () => {
    setReportModal(false);
    form.resetFields();
  };

  const reportPost = (post) => {
    setToReport(post);
    setReportModal(true);
  };

  const handleReportSubmit = async (values) => {
    try {
      const { reason, target } = values;
      const { type: entityType, id: entityId } = JSON.parse(target);

      const payload = {
        entityType,
        entityId,
        reason,
      };

      const res = await axios.post(`${API_BASE_URL}/api/report`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      }); // adjust the URL if needed
      console.log(res);
      toast.success(res.data.mesage);
      handleReportModal();
    } catch (error) {
      console.error("Reporting failed:", error);
      toast.error("Failed to report. Please try again.");
    }
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

  // useEffect(() => {
  //   console.log("User context updated:", user);
  // }, [user]);

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

      <Modal
        open={reportModal}
        onCancel={handleReportModal}
        footer={null}
        title="Report Post or User"
        closable
        centered
        className="!p-8"
      >
        <Form form={form} layout="vertical" onFinish={handleReportSubmit}>
          <Form.Item
            label="Select an option"
            name="target"
            rules={[{ required: true, message: "Please select an option!" }]}
          >
            <Select
              placeholder="Select what you're reporting"
              options={[
                {
                  value: JSON.stringify({
                    type: "User",
                    id: toReport?.author?._id,
                  }),
                  label: "Report User",
                  disabled: !toReport?.author?._id,
                },
                {
                  value: JSON.stringify({
                    type: "Post",
                    id: toReport?._id,
                  }),
                  label: "Report Post",
                  disabled: !toReport?._id,
                },
              ]}
            />
          </Form.Item>

          <Form.Item
            label="Reason"
            name="reason"
            rules={[{ required: true, message: "Please add your reason!" }]}
          >
            <Input.TextArea
              rows={3}
              placeholder="Enter a reason"
              className="!resize-none"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="!bg-black text-white hover:!bg-black !rounded-full"
            >
              Submit Report
            </Button>
          </Form.Item>
        </Form>
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
          { label: "Report", key: "4", onClick: () => reportPost(post) },
          { label: "Show fewer posts like this", key: "5" },
        ];

        let follow_text = user?.following?.includes(post?.author?._id)
          ? "Following"
          : "Follow";

        return (
          <div
            key={post._id}
            ref={isLastPost ? lastPostRef : null}
            className="rounded-lg p-4 shadow-md w-full max-w-3xl mx-auto bg-white"
          >
            {/* Header */}
            <div className="flex sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
              <div className="flex items-center gap-3">
                {post.isAnonymous ? (
                  <AvatarPlaceholder text="Anonymous" />
                ) : post.author?.avatar ? (
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden">
                    <Image
                      src={post.author.avatar}
                      alt="user image"
                      width={48}
                      height={48}
                      className="rounded-full object-cover w-full h-full"
                    />
                  </div>
                ) : (
                  <div className="!bg-[#F6F6F6] rounded-full p-2 w-12 h-12 flex justify-center items-center">
                    <AvatarPlaceholder text={initials} />
                  </div>
                )}
                <div>
                  <p className="font-medium text-gray-800 text-sm sm:text-base">
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
                      className="!px-3 !bg-black !text-white !rounded-full text-xs sm:text-sm"
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
            <div className="my-3">
              <Image
                src={
                  post.images?.length > 0
                    ? post.images[0]
                    : "/images/placeholder-image.png"
                }
                alt="Post image"
                width={800}
                height={300}
                className="rounded w-full object-cover mb-2 max-h-[300px] sm:max-h-[400px] object-top"
              />
            </div>

            {/* Content */}
            <div>
              <h2 className="text-base sm:text-lg font-semibold text-gray-800 mb-2">
                {post.title || "Untitled"}
              </h2>

              <p className="text-sm sm:text-base text-gray-700 mb-2">
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
            <div className="flex flex-wrap sm:flex-nowrap justify-between items-center mt-3 gap-3 text-xs sm:text-sm">
              {/* Left side actions */}
              <div className="flex flex-nowrap gap-3 items-center">
                <button
                  onClick={() => handleLikeDislike(post._id)}
                  className={`cursor-pointer flex items-center gap-1 rounded-full py-1 px-3 transition-all duration-300 whitespace-nowrap
        ${isLiked ? "bg-blue-100 text-blue-600" : "bg-gray-300 text-gray-800"}
        ${likedAnimation === post._id ? "scale-110" : "scale-100"}`}
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

                <Link
                  href={`/dashboard/feeds/${post._id}`}
                  className="flex items-center gap-1 cursor-pointer whitespace-nowrap"
                >
                  <Image
                    src="/images/comment.png"
                    alt="comment icon"
                    width={15}
                    height={15}
                  />
                  Comment
                </Link>

                <div className="flex items-center gap-1 cursor-pointer whitespace-nowrap">
                  <Image
                    src="/images/share.png"
                    alt="share icon"
                    width={15}
                    height={15}
                  />
                  Share
                </div>
              </div>

              {/* Right side stats */}
              <div className="flex gap-2 items-center whitespace-nowrap">
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
