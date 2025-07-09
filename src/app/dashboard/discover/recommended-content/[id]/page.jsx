"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useApp } from "@/app/context/context";
import Link from "next/link";
import { GoArrowLeft } from "react-icons/go";
import Image from "next/image";
import { Button, Divider, Skeleton, Input } from "antd";
import axios from "axios";
import { toast } from "react-toastify";

const PostPage = () => {
  const { API_BASE_URL, setLoading, loading, token, user } = useApp();
  const { id: postId } = useParams();
  const [post, setPost] = useState(null);
  const [likedAnimation, setLikedAnimation] = useState(null);
  const [replyingToIndex, setReplyingToIndex] = useState(null);
  const [replyInputs, setReplyInputs] = useState({});
  const [commentInput, setCommentInput] = useState("");
  const [comments, setComments] = useState([]);

  useEffect(() => {
    if (!API_BASE_URL || !postId) return;

    const getPost = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${API_BASE_URL}/api/post/${postId}`);
        setPost(res.data.post);
        console.log(res.data);
      } catch (err) {
        toast.error("Failed to load post.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    getPost();
  }, [postId, API_BASE_URL]);

  const addComment = async () => {
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
      const { data } = await axios.post(
        `${API_BASE_URL}/api/comment/${postId}/comments`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setComments((prev) => [data.comment, ...prev]);
      setCommentInput("");
      toast.success("Comment added.");
      setShowEmojiPicker(false);
    } catch (err) {
      console.error("Add comment failed:", err);
      toast.error("Failed to add comment.");
    } finally {
      setLoading(false);
    }
  };

  const isLiked = post?.likes?.includes(user?._id);

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

  const postImage =
    post?.images && post?.images.length > 0
      ? post.images[0]
      : "/images/image1.png";

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
                    <div className="rounded-full h-10 w-10 bg-red-500" />
                    <div>
                      <div className="flex items-center gap-3">
                        <h1 className="text-xs">Cyber Expert Community</h1>
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
                        {new Date(post.publishedAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>

                <Image
                  src={postImage}
                  alt="post image"
                  width={1000}
                  height={900}
                  className="rounded-lg w-full object-cover max-h-[500px]"
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

            <div className="flex justify-center items-center flex-col mt-7">
              <div className="rounded-full h-30 w-30">
                <Image
                  src="/images/image1.png"
                  alt="community avatar"
                  width={500}
                  height={500}
                  className="object-cover rounded-full h-full w-full"
                />
              </div>
              <h1 className="font-semibold my-3">Cyber Expert Community</h1>
              <p className="text-xs text-gray-600">50K Active Members</p>
              <p className="mt-3 text-center text-[.8rem]">
                New Solar Panel Technology that Sell Sunlight at Night Increases
                Efficiency by 40%...
              </p>

              <Button className="!bg-black !rounded-full !text-white mt-4 p-4">
                Join Community
              </Button>
            </div>

            <Divider />

            <div>
              <h1 className="font-semibold mb-3">Community Rules</h1>
              <ol className="list-decimal pl-7 flex flex-col gap-2 text-xs">
                <li>No Posting Of Fake Content</li>
                <li>No Spamming</li>
                <li>Respect Community Guidelines</li>
                <li>No Hate Speech</li>
                <li>No NSFW Content</li>
              </ol>
            </div>

            <Divider />

            <div>
              <h1 className="font-semibold mb-3">Moderators</h1>
              <div className="flex gap-3 flex-col">
                <div className="flex gap-3 items-center">
                  <div className="rounded-full w-10 h-10">
                    <Image
                      src="/images/Rectangle.png"
                      alt="user image"
                      height={50}
                      width={50}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <div>
                    <h1 className="font-semibold">Isreal Ackermann</h1>
                    <p className="text-[.8rem]">@ackermann</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Skeleton>
      </div>
    </div>
  );
};

export default PostPage;
