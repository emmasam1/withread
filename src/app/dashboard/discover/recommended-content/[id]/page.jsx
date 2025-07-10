"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Button, Divider, Skeleton, Input } from "antd";
import { GoArrowLeft } from "react-icons/go";
import { motion } from "framer-motion";
import EmojiPicker from "emoji-picker-react";
import axios from "axios";
import { toast } from "react-toastify";
import { useApp } from "@/app/context/context";

const extractEmojis = (text) => {
  return [
    ...text.matchAll(
      /([\u{1F600}-\u{1F6FF}\u{1F300}-\u{1F5FF}\u{1F900}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}])/gu
    ),
  ].map((match) => match[0]);
};

const AvatarPlaceholder = ({ text }) => (
  <span className="font-semibold text-gray-400">{text}</span>
);

const PostPage = () => {
  const { API_BASE_URL, setLoading, loading, token, user, setUser } = useApp();
  const { id: postId } = useParams();
  const router = useRouter();

  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentInput, setCommentInput] = useState("");
  const [replyingToIndex, setReplyingToIndex] = useState(null);
  const [replyInputs, setReplyInputs] = useState({});
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [likedAnimation, setLikedAnimation] = useState(null);
  const [communityId, setCommunityId] = useState(null);
  const [joined, setJoined] = useState(false);
  const [joinLoading, setJoinLoading] = useState(false);
  const [commentLoading, setCommentLoading] = useState(false);
  const [replyEmojiPickers, setReplyEmojiPickers] = useState({});

  const isLiked = post?.likes?.includes(user?._id);
  const postImage = post?.images?.[0] || "/images/image1.png";

  const getUserInitials = (u) => {
    if (!u) return "??";
    const first = u.firstName?.trim()?.[0] || "";
    const last = u.lastName?.trim()?.[0] || "";
    return (first + last).toUpperCase() || "??";
  };

  const formatMemberCount = (num) => {
    if (num >= 1_000_000)
      return (num / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
    if (num >= 1_000) return (num / 1_000).toFixed(1).replace(/\.0$/, "") + "K";
    return num.toString();
  };

  useEffect(() => {
    if (!API_BASE_URL || !postId) return;
    const fetchPost = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${API_BASE_URL}/api/post/${postId}`);
        setPost(res.data.post);
        setCommunityId(res.data.post?.community?._id);
      } catch (err) {
        toast.error("Failed to load post.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [API_BASE_URL, postId]);

  useEffect(() => {
    if (!API_BASE_URL || !postId) return;
    const fetchComments = async () => {
      try {
        const { data } = await axios.get(
          `${API_BASE_URL}/api/comment/${postId}`
        );
        setComments(data.comments);
      } catch (err) {
        console.error("Fetch comments error:", err);
      }
    };
    fetchComments();
  }, [API_BASE_URL, postId]);

  useEffect(() => {
    if (user?.communities?.includes(communityId)) {
      setJoined(true);
    }
  }, [user, communityId]);

  const handleLikeDislike = async () => {
    if (!token) return toast.error("You need to log in to like posts.");
    if (!post) return;

    if (!isLiked) {
      setLikedAnimation(post._id);
      setTimeout(() => setLikedAnimation(null), 300);
    }

    try {
      const action = isLiked ? "dislike" : "like";
      const { data } = await axios.put(
        `${API_BASE_URL}/api/post/${postId}/like-dislike`,
        { action },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPost(data.post);
      toast.success(data.message);
    } catch (err) {
      console.error("Like error:", err);
      toast.error("Something went wrong. Please try again.");
    }
  };

  const addComment = async () => {
    if (!user) {
      toast.error("You need to log in to comment.");
      router.push("/signin");
      return;
    }
    if (!commentInput.trim()) return toast.error("Comment cannot be empty.");

    try {
      setCommentLoading(true);
      const payload = {
        body: commentInput.trim(),
        emojis: extractEmojis(commentInput),
      };
      const { data } = await axios.post(
        `${API_BASE_URL}/api/comment/${postId}/comments`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setComments((prev) => [data.comment, ...prev]);
      setCommentInput("");
      setShowEmojiPicker(false);
      toast.success("Comment added.");
    } catch (err) {
      console.error("Add comment failed:", err);
      toast.error("Failed to add comment.");
    } finally {
      setCommentLoading(false);
    }
  };

  const handleReplySubmit = async (commentId, index) => {
    const replyText = replyInputs[index]?.trim();
    if (!replyText) return;

    try {
      const { data } = await axios.post(
        `${API_BASE_URL}/api/comment/${commentId}/reply`,
        { body: replyText },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setComments((prev) =>
        prev.map((c, i) =>
          i === index
            ? { ...c, replies: [...(c.replies || []), data.comment] }
            : c
        )
      );
      setReplyingToIndex(null);
      setReplyInputs((prev) => ({ ...prev, [index]: "" }));
    } catch (err) {
      console.error("Reply error:", err);
      toast.error("Failed to post reply.");
    }
  };

  const handleReplyEmojiClick = (emojiData, index) => {
    setReplyInputs((prev) => ({
      ...prev,
      [index]: (prev[index] || "") + emojiData.emoji,
    }));
  };

  const joinCommunity = async () => {
    try {
      setJoinLoading(true);
      const res = await axios.post(
        `${API_BASE_URL}/api/community/${communityId}/join`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      toast.success(res.data.message || "Community joined!");
      setJoined(true);
      const updatedUser = {
        ...user,
        communities: [...(user?.communities || []), communityId],
      };
      setUser(updatedUser);
      sessionStorage.setItem("user", JSON.stringify(updatedUser));
    } catch (error) {
      console.error("Join community error:", error);
      toast.error(error?.response?.data?.message || "Failed to join community");
    } finally {
      setJoinLoading(false);
    }
  };

  return (
    <div className="p-3">
      <Link
        href="/dashboard/discover/recommended-content"
        className="flex gap-2 items-center !text-black text-xs"
      >
        <GoArrowLeft size="1rem" />
        Back
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-[2fr_400px] gap-7 p-4">
        {/* === MAIN CONTENT === */}
        <Skeleton
          loading={loading || !post}
          active
          avatar
          paragraph={{ rows: 10 }}
        >
          <div>
            {post && (
              <div className="bg-white p-3 rounded-lg">
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center gap-2">
                    <div className="rounded-full h-10 w-10 overflow-hidden bg-gray-300 flex items-center justify-center text-white font-semibold text-sm uppercase">
                      {post?.author?.avatar ? (
                        <Image
                          src={post.author.avatar}
                          alt="avatar"
                          height={40}
                          width={40}
                          className="object-cover w-full h-full rounded-full"
                        />
                      ) : (
                        <>
                          {post?.author?.firstName?.[0]}
                          {post?.author?.lastName?.[0]}
                        </>
                      )}
                    </div>

                    <div>
                      <div className="flex items-center gap-3">
                        <h1 className="text-xs">{post?.community?.name}</h1>
                        <Image
                          src="/images/dot.png"
                          alt="dot"
                          width={5}
                          height={5}
                        />
                        <h1 className="text-xs capitalize">
                          {post?.author?.firstName} {post?.author?.lastName}
                        </h1>
                      </div>
                      <p className="text-xs text-gray-400">
                        {new Date(post?.publishedAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>

                <Image
                  src={postImage}
                  alt="post image"
                  width={1000}
                  height={900}
                  className="rounded-lg w-full h-[500px] object-contain"
                />

                <div className="mt-4">
                  <h1 className="font-semibold">{post?.title}</h1>
                  <p className="mt-3 font-normal text-[.9rem] whitespace-pre-wrap">
                    {post?.content}
                  </p>
                </div>

                <div className="flex justify-between items-center mt-3">
                  <div className="flex gap-6 items-center">
                    <button
                      onClick={handleLikeDislike}
                      className={`cursor-pointer flex items-center gap-1 text-xs rounded-full py-1 px-3 transition-all duration-300 ${
                        isLiked
                          ? "bg-blue-100 text-blue-600"
                          : "bg-gray-300 text-gray-800"
                      } ${
                        likedAnimation === post?._id ? "scale-110" : "scale-100"
                      }`}
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
                      {post?.likes?.length}
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
                    <p>{post?.comments?.length} Comments</p>
                    <Image
                      src="/images/dot.png"
                      alt="dot"
                      width={3}
                      height={3}
                    />
                    <p>{post?.comments?.length} Impressions</p>
                  </div>
                </div>
              </div>
            )}

            <div className="bg-white mt-4 p-3 rounded-lg">
              <div className="flex items-center gap-3">
                <Input
                  value={commentInput}
                  onChange={(e) => setCommentInput(e.target.value)}
                  disabled={commentLoading}
                  placeholder="Add your comment"
                  className="!bg-[#F6F6F6] !border-none !outline-none !rounded-full !px-4 !py-3 focus:ring-0 focus:outline-none flex-1"
                />

                <Button
                  className="!bg-black !text-[#D9D9D9] !border-0 !rounded-full !py-5 !px-8"
                  onClick={addComment}
                  loading={commentLoading}
                  disabled={commentLoading}
                >
                  {commentLoading ? "Commenting..." : "Comment"}
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
                          className="cursor-pointer"
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
                              className="!bg-black !text-white !rounded-full"
                              size="small"
                              type="primary"
                              onClick={() =>
                                handleReplySubmit(comment._id, index)
                              }
                            >
                              Send
                            </Button>
                            <motion.button
                              onClick={() =>
                                setReplyEmojiPickers((prev) => ({
                                  ...prev,
                                  [index]: !prev[index],
                                }))
                              }
                              whileHover={{ scale: 1.2, rotate: 10 }}
                              transition={{ type: "spring", stiffness: 300 }}
                              className="cursor-pointer ml-2"
                            >
                              <Image
                                src="/images/emoji.png"
                                alt="emoji"
                                width={24}
                                height={24}
                              />
                            </motion.button>
                          </div>
                          {replyEmojiPickers[index] && (
                            <div className="mt-2">
                              <EmojiPicker
                                onEmojiClick={(emojiData) =>
                                  handleReplyEmojiClick(emojiData, index)
                                }
                                height={350}
                                width="100%"
                              />
                            </div>
                          )}
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
        </Skeleton>

        {/* === SIDEBAR === */}
        <Skeleton loading={loading || !post} active paragraph={{ rows: 12 }}>
          <div className="w-full relative lg:fixed lg:right-10 lg:w-[400px] lg:h-screen lg:pb-35 overflow-auto p-3 bg-white rounded-lg mb-30">
            <div className="flex justify-between items-center">
              <h1 className="font-semibold">Community Info</h1>
              <Button className="!rounded-full p-3 !bg-[#F3F3F4] !border-0 hover:!bg-[#F3F3F4] hover:!text-black">
                View Full Details
              </Button>
            </div>

            {post && (
              <div className="flex justify-center items-center flex-col mt-7">
                <div className="rounded-full h-30 w-30">
                  <Image
                    src={post?.community?.banner}
                    alt="community avatar"
                    width={500}
                    height={500}
                    className="object-cover rounded-full h-full w-full"
                  />
                </div>
                <h1 className="font-semibold my-3">{post?.community?.name}</h1>
                <p className="text-xs text-gray-600">
                  {formatMemberCount(post?.community?.members?.length)} Active
                  Members
                </p>
                <p className="mt-3 text-center text-[.8rem]">
                  {post?.community?.about
                    ? post.community.about.length > 100
                      ? post.community.about.slice(0, 100) + "..."
                      : post.community.about
                    : ""}
                </p>

                <Button
                  onClick={joinCommunity}
                  loading={joinLoading}
                  disabled={joined}
                  className={`!rounded-full mt-4 p-4 transition-all duration-300 ${
                    joined
                      ? "!bg-[#E4E4E7] !text-gray-500 cursor-not-allowed"
                      : "!bg-black !text-white hover:!bg-gray-800"
                  }`}
                >
                  {joined ? "Member" : "Join Community"}
                </Button>
              </div>
            )}

            <Divider />

            <div>
              <h1 className="font-semibold mb-3">Community Rules</h1>
              <ol className="list-decimal pl-7 flex flex-col gap-2 text-xs">
                {post?.community?.rules
                  ?.split(/\r?\n/)
                  .filter((rule) => rule.trim() !== "")
                  .map((rule, idx) => (
                    <li key={idx}>{rule.trim()}</li>
                  ))}
              </ol>
            </div>

            <Divider />

            <div>
              <h1 className="font-semibold mb-3">Moderators</h1>
              <div className="flex gap-3 flex-col">
                {post?.community?.moderators?.length > 0 && (
                  <div className="flex gap-3 items-center">
                    <div className="rounded-full w-10 h-10 bg-gray-300 flex items-center justify-center overflow-hidden text-white font-semibold text-sm">
                      {post.community.moderators[0].avatar ? (
                        <Image
                          src={post.community.moderators[0].avatar}
                          alt="moderator avatar"
                          height={40}
                          width={40}
                          className="object-cover w-full h-full rounded-full"
                        />
                      ) : (
                        <>
                          {post.community.moderators[0].firstName?.charAt(0)}
                          {post.community.moderators[0].lastName?.charAt(0)}
                        </>
                      )}
                    </div>
                    <div>
                      <h1 className="font-semibold">
                        {post.community.moderators[0].firstName}{" "}
                        {post.community.moderators[0].lastName}
                      </h1>
                      <p className="text-[.8rem]">
                        @{post.community.moderators[0].username}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Skeleton>
      </div>
    </div>
  );
};

export default PostPage;
