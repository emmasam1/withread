"use client";
import React, { useEffect, useState } from "react";
import { Button, Dropdown, Space, Skeleton } from "antd";
import axios from "axios";
import { useApp } from "@/app/context/context";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

const items = [
  { label: "Not interested in this post", key: "0" },
  { label: "Remove this post from my feed", key: "1" },
  { type: "divider" },
  { label: "Mute", key: "2" },
  { label: "Block", key: "3" },
  { label: "Report", key: "4" },
  { label: "Show fewer posts like this", key: "5" },
];

const Page = () => {
  const { API_BASE_URL, setLoading, loading, token, user, setUser } = useApp();
  const [interestsList, setInterestsList] = useState([]);
  const [selectedInterestId, setSelectedInterestId] = useState(null);
  const [communityPosts, setCommunityPosts] = useState([]);
  const [isLoadingInterests, setIsLoadingInterests] = useState(true);
  const [communities, setCommunities] = useState([]);
  const [singleCommunity, setSingleCommunities] = useState([]);
  const [loadingCommunities, setLoadingCommunities] = useState(true);
  const [joinLoadingMap, setJoinLoadingMap] = useState({});
  const [likedAnimation, setLikedAnimation] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchInterests = async () => {
      setIsLoadingInterests(true);
      try {
        const res = await axios.get(`${API_BASE_URL}/api/interest/interests`);
        const categories = res.data.categories || [];
        setInterestsList(categories);
        if (categories.length > 0) {
          const firstId = categories[0]._id;
          setSelectedInterestId(firstId);
          fetchCommunityPosts(firstId);
        }
      } catch (error) {
        console.error("Failed to fetch interests:", error);
        toast.error("Failed to load interests.");
      } finally {
        setIsLoadingInterests(false);
      }
    };

    fetchInterests();
  }, [API_BASE_URL]);

  const fetchCommunityPosts = async (interestId) => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${API_BASE_URL}/api/post/by-interest?interestId=${interestId}&page=1&limit=5`
      );
      setCommunityPosts(res.data.posts || []);
      console.log("intrest from community", res.data);
    } catch (error) {
      console.error("Error fetching community posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (interestId) => {
    setSelectedInterestId(interestId);
    fetchCommunityPosts(interestId);
  };

  const AvatarPlaceholder = ({ text }) => (
    <h1 className="font-semibold text-gray-400">{text}</h1>
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

  useEffect(() => {
    const getCommunities = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/community`);
        setCommunities(res.data.communities || []);
        const justOne = res.data?.communities?.slice(0, 1);
        setSingleCommunities(justOne);
      } catch (error) {
        console.error("Error fetching communities:", error);
        toast.error("Failed to load communities");
      } finally {
        setLoadingCommunities(false);
      }
    };

    getCommunities();
  }, [API_BASE_URL]);

  const formatMemberCount = (num) => {
    if (num >= 1_000_000)
      return (num / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
    if (num >= 1_000) return (num / 1_000).toFixed(1).replace(/\.0$/, "") + "K";
    return num.toString();
  };

  const joinCommunity = async (id) => {
    if (!user) {
      router.push("/signin");
      return;
    }

    setJoinLoadingMap((prev) => ({ ...prev, [id]: true }));

    try {
      const res = await axios.post(
        `${API_BASE_URL}/api/community/${id}/join`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      toast.success(res.data.message || "Community joined!");

      // Update user context
      const updatedUser = {
        ...user,
        communities: [...(user?.communities || []), id],
      };
      setUser(updatedUser);
      sessionStorage.setItem("user", JSON.stringify(updatedUser));
    } catch (error) {
      toast.error("Failed to join community");
      console.error(error);
    } finally {
      setJoinLoadingMap((prev) => ({ ...prev, [id]: false }));
    }
  };

  return (
    <div className="p-3">
      <div className="grid grid-cols-1 md:grid-cols-[2fr_400px] gap-7 p-4">
        <div className="rounded-lg grid grid-cols">
          <div className="bg-white p-3 rounded-md w-full">
            <h1 className="font-semibold">Best Match For You</h1>
            {isLoadingInterests ? (
              <div className="flex flex-wrap gap-3 mt-5 max-w-2xl">
                {[...Array(10)].map((_, index) => (
                  <div
                    key={index}
                    className="h-8 w-24 rounded-full bg-gray-200 animate-pulse"
                  ></div>
                ))}
              </div>
            ) : (
              <div className="flex flex-wrap gap-3 mt-5 max-w-2xl">
                {interestsList.map((interest) => (
                  <button
                    key={interest._id}
                    onClick={() => handleSelect(interest._id)}
                    className={`px-5 py-1 rounded-full border text-sm font-medium transition-all cursor-pointer ${
                      selectedInterestId === interest._id
                        ? "bg-black text-white border-black"
                        : "bg-white text-black border-gray-300"
                    }`}
                  >
                    {interest.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          {loading ? (
            // Show loading skeletons
            [...Array(2)].map((_, index) => (
              <div
                key={index}
                className="bg-white p-3 rounded-md w-full mt-5 animate-pulse"
              >
                <Skeleton active avatar paragraph={{ rows: 4 }} />
              </div>
            ))
          ) : communityPosts.length === 0 ? (
            // Show "No posts" message
            <div className="text-center mt-10 p-6 bg-white rounded-md shadow-sm">
              <Image
                src="/images/no-image-found.png" // Replace with your preferred icon/image
                alt="No posts"
                width={150}
                height={150}
                className="mx-auto mb-4 w-full"
              />
              <h2 className="text-xl font-semibold text-gray-700">
                No posts in this community yet
              </h2>
              <p className="text-sm text-gray-500 mt-2">
                Be the first to share something valuable with the community!
              </p>
            </div>
          ) : (
            // Render community posts
            communityPosts.map((post, index) => {
              const initials = `${post?.author?.firstName?.[0] || ""}${
                post?.author?.lastName?.[0] || ""
              }`.toUpperCase();
              const isLiked = post.likes?.includes("user123");

              return (
                <div
                  key={post._id}
                  className="bg-white p-3 rounded-md w-full mt-5"
                >
                  {/* Header */}
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-3">
                      {post.isAnonymous ? (
                        <AvatarPlaceholder text="Anonymous" />
                      ) : post.author?.avatar ? (
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
                      {!post.isAnonymous && (
                        <Button
                          type="text"
                          className="!px-3 !bg-black !text-white !rounded-full"
                        >
                          {post.collaborators?.length > 0
                            ? "Follow Both"
                            : "Follow"}
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

                  {/* Image */}
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

                  {/* Content */}
                  <div>
                    <h2 className="text-lg font-semibold text-gray-800 mb-2">
                      {post.title || "Untitled"}
                    </h2>
                    <p>
                      {post.content.slice(0, 100)}...
                      <Link
                        href={`/dashboard/feeds/${post._id}`}
                        className="text-sm"
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
                        } ${
                          likedAnimation === post._id
                            ? "scale-110"
                            : "scale-100"
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
                      <Image
                        src="/images/dot.png"
                        alt="dot"
                        width={3}
                        height={3}
                      />
                      <p>{post.comments.length} Impressions</p>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div className="w-full relative lg:fixed lg:right-10 lg:w-[400px] lg:h-screen lg:pb-28 overflow-auto">
          <div className="bg-white rounded-md p-3">
            <div className="flex justify-between items-center">
              <h1 className="font-semibold">Recommended Contents</h1>
              <Link href="#" className="text-xs">
                See all
              </Link>
            </div>
            {loadingCommunities
              ? [...Array(1)].map((_, i) => (
                  <Skeleton
                    key={i}
                    active
                    avatar
                    paragraph={{ rows: 4 }}
                    className="mt-5"
                  />
                ))
              : singleCommunity.map((e) => (
                  <div key={e._id}>
                    <Image
                      src={e.banner}
                      alt={e.name}
                      width={600}
                      height={500}
                      className="mt-5 rounded-md"
                    />
                    <h1 className="mt-2 text-[.8rem] font-semibold">
                      {e.name}
                    </h1>
                    <p className="mt-2 text-[.8rem]">
                      {e.about?.slice(0, 100)}..
                    </p>
                    <div className="mt-2 flex gap-3 items-center">
                      <div className="rounded-full h-10 w-10">
                        <Image
                          src={e?.creator?.avatar}
                          alt={e.creator?.username}
                          width={40}
                          height={20}
                          className="h-full w-full rounded-full object-cover"
                        />
                      </div>
                      <h1 className="mt-2 text-[.8rem] font-semibold">
                        {e.creator.username}
                      </h1>
                    </div>
                  </div>
                ))}
          </div>

          <div className="bg-white rounded-md p-3 mt-4">
            <div className="flex justify-between items-center">
              <h1 className="font-semibold">Popular Communities</h1>
              <Link href="#" className="text-xs">
                See all
              </Link>
            </div>

            {loadingCommunities
              ? [...Array(3)].map((_, i) => (
                  <Skeleton
                    key={i}
                    active
                    avatar
                    paragraph={{ rows: 1 }}
                    className="mt-4"
                  />
                ))
              : communities.map((community) => {
                  const initials = `${community?.name?.[0] || ""}${
                    community?.name?.[1] || ""
                  }`.toUpperCase();
                  return (
                    <div
                      key={community._id}
                      className="flex justify-between items-center mt-4 mb-3"
                    >
                      <div className="flex items-center gap-3">
                        <div className="rounded-full h-10 w-10">
                          {community?.avatar ? (
                            <Image
                              src={community.avatar}
                              alt={community.name}
                              height={500}
                              width={500}
                              className="rounded-full w-full h-full object-cover"
                            />
                          ) : (
                            <div className="!bg-[#F6F6F6] rounded-full p-2 w-12 h-12 flex justify-center items-center">
                              <h1 className="font-semibold text-gray-400">
                                {initials}
                              </h1>
                            </div>
                          )}
                        </div>
                        <div>
                          <h2 className="font-semibold text-[.7rem]">
                            {community?.name.slice(0, 25)}
                          </h2>
                          <p className="text-xs">
                            {formatMemberCount(community?.members.length) || 0}{" "}
                            Active Members
                          </p>
                        </div>
                      </div>
                      <div>
                        <Button
                          loading={joinLoadingMap[community._id]}
                          onClick={() => {
                            if (!user?.communities?.includes(community._id)) {
                              joinCommunity(community._id);
                            }
                          }}
                          disabled={user?.communities?.includes(community._id)}
                          className={`!rounded-full !border-none ${
                            user?.communities?.includes(community._id)
                              ? "!bg-green-100 !text-green-700 cursor-default"
                              : "!bg-[#F3F3F4] hover:!text-black"
                          }`}
                        >
                          {user?.communities?.includes(community._id)
                            ? "Joined"
                            : "Join Community"}
                        </Button>
                      </div>
                    </div>
                  );
                })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
