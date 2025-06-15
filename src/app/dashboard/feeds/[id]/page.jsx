"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "next/navigation";
import { useApp } from "../../../context/context";
import Link from "next/link";
import Image from "next/image";
import { Button, Dropdown, Space, Input } from "antd";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import EmojiPicker from "emoji-picker-react";
import SimilarContent from "../../components/SimilarContent";
import WithReadLoader from "../../components/WithReadLoader";
import { useRouter } from "next/navigation";

/* ---------- Small Helpers ---------- */
const AvatarPlaceholder = ({ text }) => (
  <span className="font-semibold text-gray-400">{text}</span>
);

const menuItems = [
  { label: "Not interested in this post", key: "0" },
  { label: "Remove this post from my feed", key: "1" },
  { type: "divider" },
  { label: "Mute", key: "2" },
  { label: "Block", key: "3" },
  { label: "Report", key: "4" },
  { label: "Show fewer posts like this", key: "5" },
];
/* ---------------------------------- */

const Page = () => {
  const { API_BASE_URL, setLoading, token, user, loading } = useApp();
  const { id: postId } = useParams();
  const [activeTab, setActiveTab] = useState("1");

  const [post, setPost] = useState(null);
  const [error, setError] = useState("");
  const [likedAnimation, setLikedAnimation] = useState(null);
  const [replyingToIndex, setReplyingToIndex] = useState(null);
  const [replyInputs, setReplyInputs] = useState({});
  const [commentInput, setCommentInput] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [comments, setComments] = useState([]);
  const router = useRouter();

  const tabs = [
    { key: "1", label: "Open" },
    { key: "2", label: "Anonymous" },
  ];

  useEffect(() => {
    if (!API_BASE_URL || !postId) return;

    const fetchPost = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${API_BASE_URL}/api/post/${postId}`);
        // console.log(res);
        setPost(res.data.post);
      } catch (err) {
        console.error("Error fetching post:", err);
        setError("Post not found.");
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [API_BASE_URL, postId, token, setLoading]);

  const handleLikeDislike = async (postId) => {
    if (!token) return toast.error("You need to log in to like posts.");
    if (!post) return;

    const isLiked = post.likes.includes(user._id);

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

      setPost(res.data.post);
      toast.success(res.data.message);
    } catch (err) {
      console.error("Like error:", err);
      toast.error("Something went wrong. Please try again.");
    }
  };

  const extractEmojis = (text) => {
    // This regex extracts all emoji characters
    return (text.match(/([\u231A-\uD83E\uDDFF])/gu) || []).join("");
  };

  const addComment = async (postId) => {
    if (!user) {
      toast.error("You need to log in to comment.");
      router.push("/signin");
      return;
    }

    if (!commentInput.trim()) {
      toast.error("Comment cannot be empty.");
      return;
    }

    const payload = {
      body: commentInput.trim(),
      emojis: extractEmojis(commentInput),
    };

    try {
      setLoading(true);
      const res = await axios.post(
        `${API_BASE_URL}/api/comment/${postId}/comments`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const newComment = res.data.comment;

      // 🔁 Update local state with new comment
      setComments((prev) => [newComment, ...prev]);

      // ✅ Reset input
      setCommentInput("");
      toast.success("Comment added.");
      setShowEmojiPicker(false);
    } catch (error) {
      console.error("Add comment failed:", error);
      toast.error("Failed to add comment.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const getComment = async () => {
      const url = `${API_BASE_URL}/api/comment/${postId}`;

      try {
        const res = await axios.get(url);
        setComments(res.data.comments);
        console.log("comments", res.data.comments);
      } catch (error) {
        console.log(error);
      }
    };
    getComment();
  }, [API_BASE_URL, postId]);


  const handleReplySubmit = async (commentIdFromProp, index) => {
  const replyText = replyInputs[index]?.trim();
  if (!replyText) return;

  const commentId = comments[index]?._id;
  if (!commentId) {
    toast.error("Unable to find comment ID.");
    return;
  }

  try {
    const res = await axios.post(
      `${API_BASE_URL}/api/comment/${commentId}/reply`,
      { body: replyText },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("REPLY POST response:", res.data);

    // ✅ Use the correct field from response
    let newReply = res.data.comment;

    // 🛠 Ensure createdAt exists
    if (!newReply.createdAt) {
      newReply.createdAt = new Date().toISOString();
    }

    // ✅ Update local state
    setComments((prevComments) =>
      prevComments.map((comment, i) =>
        i === index
          ? {
              ...comment,
              replies: [...(comment.replies || []), newReply],
            }
          : comment
      )
    );

    // ✅ Reset reply UI state
    setReplyingToIndex(null);
    setReplyInputs((prev) => ({ ...prev, [index]: "" }));
    toast.success("Reply posted.");
  } catch (err) {
    console.error("Reply error:", err);
    toast.error("Failed to post reply.");
  }
};


  const handleEmojiClick = (emojiData) => {
    setCommentInput((prev) => prev + emojiData.emoji);
  };

  if (error)
    return (
      <div className="max-w-3xl mx-auto p-6 text-center text-red-600">
        {error}
      </div>
    );

  if (!post) return <WithReadLoader />;

  const isLiked = post.likes.includes(user?._id);
  const initials = `${post?.author?.firstName?.[0] || ""}${
    post?.author?.lastName?.[0] || ""
  }`.toUpperCase();

  const getUserInitials = (user) => {
    if (!user) return "??";
    const first = user.firstName?.trim()?.[0] || "";
    const last = user.lastName?.trim()?.[0] || "";
    return (first + last).toUpperCase() || "??";
  };

  const AvatarPlaceholder = ({ text }) => (
    <h1 className="font-semibold text-gray-400">{text}</h1>
  );

  return (
    <div className="p-4">
      {/* Back Link */}
      <Link href="/dashboard" className="flex items-center gap-1.5 mb-3">
        <Image src="/images/arrow-left.png" alt="Back" width={20} height={15} />
        <p className="text-sm text-black">Main Feed</p>
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-[2fr_450px] gap-6">
        {/* Post Content */}
        <div>
          <div className="space-y-6 bg-white p-3 rounded-md">
            {/* Author Info */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {post.isAnonymous ? (
                  <div className="bg-[#F6F6F6] rounded-full w-12 h-12 flex items-center justify-center">
                    <AvatarPlaceholder text="A" />
                  </div>
                ) : post.author?.avatar ? (
                  <Image
                    src={post.author.avatar}
                    alt="User"
                    width={48}
                    height={48}
                    className="rounded-full"
                  />
                ) : (
                  <div className="bg-[#F6F6F6] rounded-full w-12 h-12 flex items-center justify-center">
                    <AvatarPlaceholder text={initials} />
                  </div>
                )}

                <div>
                  {!post.isAnonymous && (
                    <p className="font-medium text-gray-800">
                      {post.author?.firstName} {post.author?.lastName}
                    </p>
                  )}
                  <p className="text-xs text-gray-500">
                    {new Date(post.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>

              <Dropdown menu={{ items: menuItems }} placement="bottomRight">
                <Space className="cursor-pointer">
                  <Image
                    src="/images/Frame.png"
                    alt="Options"
                    width={18}
                    height={12}
                  />
                </Space>
              </Dropdown>
            </div>

            {/* Post Image */}
            {post.images?.[0] && (
              <Image
                src={post.images[0]}
                alt="Post"
                width={800}
                height={400}
                className="rounded w-full object-cover"
              />
            )}

            {/* Post Title & Content */}
            <h1 className="text-2xl font-bold">{post.title}</h1>
            <p className="whitespace-pre-wrap text-gray-700 text-sm text-justify">
              {post.content}
            </p>

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
              <div className="flex gap-1.5 text-xs items-center">
                <p>{post.comments.length} Comments</p>
                <Image src="/images/dot.png" alt="dot" width={3} height={3} />
                <p>{post.comments.length} Impressions</p>
              </div>
            </div>
          </div>

          {/* Comments Section */}
          <div className="mt-8 bg-white rounded-md p-3">
            <div className="flex w-full items-center justify-between">
              <h1 className="font-semibold">Comments</h1>
              <div className="relative bg-gray-100 rounded-full w-64 h-10 p-1 flex items-center overflow-hidden">
                <motion.div
                  layout
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  className="absolute top-1 left-1 h-8 w-[calc(50%-0.25rem)] bg-white rounded-full shadow z-0"
                  style={{
                    left: activeTab === "1" ? "4px" : "calc(50% + 4px)",
                  }}
                />
                {tabs.map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`flex-1 z-10 text-sm font-medium transition-colors ${
                      activeTab === tab.key ? "text-black" : "text-gray-400"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-2">
              <div className="flex items-center gap-3">
                <Input
                  value={commentInput}
                  onChange={(e) => setCommentInput(e.target.value)}
                  placeholder="Add your comment"
                  className="!bg-[#F6F6F6] !border-none !outline-none !rounded-full !px-4 !py-3 focus:ring-0 focus:outline-none flex-1"
                />
                <Button
                  className="!bg-black !text-[#D9D9D9] !border-0 !rounded-full !py-5 !px-8"
                  onClick={() => addComment(post._id)}
                  loading={loading}
                >
                  Comment
                </Button>
                <motion.button
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  whileHover={{ scale: 1.2, rotate: 10 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="cursor-pointer"
                >
                  <Image
                    src="/images/emoji.png"
                    alt="emoji"
                    width={24}
                    height={24}
                  />
                </motion.button>
              </div>

              {showEmojiPicker && (
                <div className="mt-2">
                  <EmojiPicker
                    onEmojiClick={handleEmojiClick}
                    height={350}
                    width="100%"
                  />
                </div>
              )}
            </div>

            <div className="space-y-6 mt-6">
              {comments.map((comment, index) => (
                <div
                  key={comment._id}
                  className="bg-blue-50 p-4 rounded-lg shadow-sm"
                >
                  {/* Comment Header */}
                  <div className="flex gap-3 items-start">
                    <div className="shrink-0">
                      {comment.user?.avatar ? (
                        <Image
                          src={comment.user.avatar}
                          alt="avatar"
                          width={45}
                          height={45}
                          className="rounded-full"
                        />
                      ) : (
                        <div className="bg-gray-200 w-12 h-12 flex items-center justify-center rounded-full">
                          <AvatarPlaceholder
                            text={getUserInitials(comment.user)}
                          />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h2 className="font-semibold text-sm">
                        {comment.user?.firstName} {comment.user?.lastName}
                      </h2>
                      <p className="text-xs text-gray-500">
                        {new Date(comment.createdAt).toLocaleString()}
                      </p>
                      <p className="mt-2 text-sm text-gray-800">
                        {comment.body}
                      </p>

                      {/* Comment actions */}
                      <div className="flex gap-4 mt-2 text-xs text-blue-600">
                        <button>Like</button>
                        <button
                          onClick={() =>
                            setReplyingToIndex(
                              replyingToIndex === index ? null : index
                            )
                          }
                        >
                          Reply
                        </button>
                      </div>

                      {/* Reply Input */}
                      {replyingToIndex === index && (
                        <div className="mt-3">
                          <Input.TextArea
                            placeholder="Write a reply..."
                            value={replyInputs[index] || ""}
                            onChange={(e) =>
                              setReplyInputs({
                                ...replyInputs,
                                [index]: e.target.value,
                              })
                            }
                          />
                          <div className="mt-2 flex justify-end">
                            <Button
                              size="small"
                              type="primary"
                              onClick={() =>
                                handleReplySubmit(comment._id, index)
                              }
                            >
                              Send
                            </Button>
                          </div>
                        </div>
                      )}

                      {/* Replies */}
                      {Array.isArray(comment.replies) &&
                        comment.replies.length > 0 && (
                          <div className="mt-4 space-y-4 pl-6 border-l border-gray-200">
                            {comment.replies.map((reply) => (
                              <div
                                key={reply?._id}
                                className="bg-white p-3 rounded-md shadow-sm"
                              >
                                <div className="flex gap-3 items-start">
                                  <div className="shrink-0">
                                    {reply?.user?.avatar ? (
                                      <Image
                                        src={reply?.user?.avatar}
                                        alt="avatar"
                                        width={35}
                                        height={35}
                                        className="rounded-full"
                                      />
                                    ) : (
                                      <div className="bg-gray-200 w-10 h-10 flex items-center justify-center rounded-full">
                                        <AvatarPlaceholder
                                          text={getUserInitials(reply?.user)}
                                        />
                                      </div>
                                    )}
                                  </div>
                                  <div>
                                    <h3 className="font-medium text-sm">
                                      {reply?.user?.firstName}{" "}
                                      {reply?.user?.lastName}
                                    </h3>
                                    <p className="text-xs text-gray-500">
                                      {reply?.createdAt
                                        ? new Date(
                                            reply?.createdAt
                                          ).toLocaleString()
                                        : "Just now"}
                                    </p>
                                    <p className="mt-1 text-sm text-gray-800">
                                      {reply?.body}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column Placeholder */}
        <div className="">
          <SimilarContent />
        </div>
      </div>
    </div>
  );
};

export default Page;
