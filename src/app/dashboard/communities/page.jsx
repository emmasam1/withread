"use client";

import { Button, Input, Divider, Dropdown, Space } from "antd";
import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect, useRef } from "react";
import { useApp } from "../../context/context";
import { motion } from "framer-motion";
import MyCommunity from "../components/MyCommunity";
import AllCommunities from "../components/AllCommunities";
import axios from "axios";

const Page = () => {
  const {
    isLoggedIn,
    API_BASE_URL,
    user,
    setUser,
    logout,
    loading,
    setLoading,
    token,
  } = useApp();
  const [activeTab, setActiveTab] = useState("1");
  const [communityPosts, setCommunityPosts] = useState([]);
  const [communities, setCommunities] = useState([]);

  useEffect(() => {
    const fetchCommunities = async () => {
      if (!API_BASE_URL || !token) return;

      try {
        const res = await axios.get(
          `${API_BASE_URL}/api/community/my-community`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        console.log(res);
      } catch (error) {
        console.error("Error fetching communities:", error);
        toast.error("Error fetching communities");
      }
    };

    fetchCommunities();
  }, [token, API_BASE_URL]);

  const initials = `${user?.firstName?.[0] || ""}${
    user?.lastName?.[0] || ""
  }`.toUpperCase();

  const tabs = [
    { key: "1", label: "All Posts" },
    { key: "2", label: "Members" },
    { key: "3", label: "About" },
  ];

  const hasSetDefault = useRef(false);

  const [selectedCommunity, setSelectedCommunity] = useState(() => {
    if (typeof window !== "undefined") {
      const stored = sessionStorage.getItem("selectedCommunity");
      return stored ? JSON.parse(stored) : null;
    }
    return null;
  });

  useEffect(() => {
    const getCommunityPosts = async () => {
      if (!selectedCommunity?._id) return;

      const id = selectedCommunity._id;
      const url = `${API_BASE_URL}/api/post/${id}/posts`;

      try {
        setLoading(true);
        const res = await axios.get(url);
        setCommunityPosts(res.data.posts || []);
        console.log("All Community post", res);
      } catch (error) {
        console.error("Error fetching community posts:", error);
      } finally {
        setLoading(false);
      }
    };

    getCommunityPosts();
  }, [selectedCommunity?._id]);

  useEffect(() => {
    if (selectedCommunity) return;

    const stored = sessionStorage.getItem("selectedCommunity");

    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setSelectedCommunity(parsed);
        return;
      } catch (err) {
        console.error("Invalid stored community", err);
      }
    }

    if (user?.communities?.length > 0) {
      setSelectedCommunity({ _id: user.communities[0] }); // fallback
    }
  }, [user, selectedCommunity]);

  //   useEffect(() => {
  //   const stored = sessionStorage.getItem("selectedCommunity");
  //   if (stored && !selectedCommunity) {
  //     try {
  //       const parsed = JSON.parse(stored);
  //       setSelectedCommunity(parsed);
  //     } catch (err) {
  //       console.error("Invalid stored community", err);
  //     }
  //   }
  // }, []);

  const shouldShowAllCommunities = !selectedCommunity;

  // ✅ Show loading skeleton
  if (loading) {
    return (
      <div className="p-6">
        <div className="grid grid-cols-[2fr_400px] gap-9">
          {/* Left column skeletons */}
          <div className="space-y-4">
            <div className="bg-white p-6 rounded-md h-[300px] animate-pulse" />
            <div className="bg-white p-6 rounded-md h-[150px] animate-pulse" />
            <div className="bg-white p-6 rounded-md h-[150px] animate-pulse" />
          </div>

          {/* Right sidebar skeleton */}
          <div className="fixed right-10 w-[400px] h-screen pb-24 bg-white p-4 rounded-tr-md rounded-tl-md space-y-5">
            <div className="h-10 bg-[#F6F6F6] rounded-full animate-pulse" />
            <div className="h-20 bg-[#F6F6F6] rounded-md animate-pulse" />
            <div className="h-20 bg-[#F6F6F6] rounded-md animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  // Dummy post
  const post = {
    _id: "dummy123",
    title: "How to Improve Your JavaScript Skills",
    content:
      "JavaScript is a powerful language used for frontend and backend development...",
    createdAt: new Date().toISOString(),
    isAnonymous: false,
    author: {
      firstName: "Eric",
      lastName: "Sam",
      avatar: null,
    },
    images: ["/images/banner.jpg"],
    likes: [1, 2, 3],
    comments: [1, 2],
    collaborators: [],
  };

  const handleLikeDislike = () => {
    console.log("Like clicked");
  };

  const isLiked = false;
  const likedAnimation = null;

  const items = [
    { key: "1", label: "Edit" },
    { key: "2", label: "Report" },
  ];

  return (
    <div className="p-3">
      {shouldShowAllCommunities ? (
        <AllCommunities />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-[2fr_400px] gap-7 p-4">
          {/* Left Column */}
          <div className="rounded-lg grid grid-cols">
            <div className="bg-white p-3 rounded-md w-full">
              {/* Community Banner */}
              <div className="h-70 relative">
                {selectedCommunity?.banner && (
                  <Image
                    src={selectedCommunity.banner}
                    alt="banner"
                    width={1000}
                    height={500}
                    className="w-full h-full object-cover rounded-md"
                  />
                )}
                <div className="absolute h-25 w-25 rounded-full left-5 -bottom-12">
                  {selectedCommunity?.avatar && (
                    <Image
                      src={selectedCommunity.avatar}
                      alt="avatar"
                      width={1000}
                      height={500}
                      className="w-full h-full object-cover rounded-full"
                    />
                  )}
                </div>
              </div>

              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="mt-15 ml-4">
                  <h2 className="font-semibold">{selectedCommunity?.name}</h2>
                  <p className="mt-2 text-sm">
                    Public Community • 20.5K Members
                  </p>
                </div>
                <div>
                  <div className="flex items-center gap-2 justify-end">
                    <Button className="!bg-[#F3F3F4] !text-black !border-0 !rounded-full !py-4 !px-4 flex mr-3">
                      Invite
                    </Button>
                    <div className="bg-[#F3F3F4] rounded-full p-2">
                      <Image
                        src="/images/sms.png"
                        width={20}
                        height={20}
                        alt="icon"
                      />
                    </div>
                    <div className="bg-[#F3F3F4] rounded-full p-2">
                      <Image
                        src="/images/notification-bing.png"
                        width={20}
                        height={20}
                        alt="icon"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Post Input */}
              <div className="rounded-lg p-3 my-6">
                <div className="relative flex bg-gray-100 rounded-full p-1 mb-4">
                  {tabs.map((tab) => (
                    <button
                      key={tab.key}
                      className={`flex-1 text-sm z-10 py-2 font-medium transition-colors ${
                        activeTab === tab.key ? "text-black" : "text-gray-400"
                      }`}
                      onClick={() => setActiveTab(tab.key)}
                    >
                      {tab.label}
                    </button>
                  ))}
                  <motion.div
                    layout
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className="absolute top-0 h-full bg-white rounded-full shadow w-1/3 z-0"
                    style={{ left: `${(parseInt(activeTab) - 1) * 33.333}%` }}
                  />
                </div>
                <div className="flex items-center gap-5">
                  {user?.avatar ? (
                  <div className="rounded-full w-12 h-12">
                      <Image
                      src={user.avatar}
                      alt="user image"
                      width={45}
                      height={45}
                      className="rounded-full object-cover h-full w-full"
                    />
                  </div>
                  ) : (
                    <div className="!bg-[#F6F6F6] rounded-full p-2 w-12 h-12 flex justify-center items-center">
                      <h1 className="font-semibold text-gray-400">
                        {initials}
                      </h1>
                    </div>
                  )}
                  <Link
                    href={`/dashboard/communities/${selectedCommunity?._id}`}
                    className="w-full"
                  >
                    <Input
                      placeholder="Got something on your mind? Spill it out"
                      className="!bg-[#F6F6F6] !border-none !outline-none !rounded-full !px-4 !py-3"
                      readOnly
                    />
                  </Link>
                </div>
                <Divider className="!bg-[#f6f6f6b3]" />
                <div className="flex items-center justify-between">
                  <div className="flex gap-10 items-center">
                    <Link
                      href={`/dashboard/communities/${selectedCommunity?._id}`}
                      className="flex tems-center !text-black justify-center gap-2 text-sm"
                    >
                      <Image
                        src="/images/photo.png"
                        alt="icon"
                        width={30}
                        height={30}
                        className="-mt-1"
                      />
                      Photo/Video
                    </Link>
                    <Link
                      href={`/dashboard/communities/${selectedCommunity?._id}`}
                      className="flex tems-center !text-black justify-center gap-2 text-sm"
                    >
                      <Image
                        src="/images/content.png"
                        alt="icon"
                        width={30}
                        height={30}
                        className="-mt-1"
                      />
                      Content
                    </Link>
                  </div>
                  <Button className="!bg-black !text-[#D9D9D9] !border-0 !rounded-full !py-5 !px-8">
                    <Link href="/dashboard/newpost">Post</Link>
                  </Button>
                </div>
              </div>
            </div>

            {/* Post Content */}
            {communityPosts.map((post) => {
              return (
                <div className="mt-5 p-3 bg-white rounded-md">
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-3">
                      {post.isAnonymous ? (
                        <div className="bg-gray-200 rounded-full w-12 h-12 flex items-center justify-center">
                          <span className="text-sm font-semibold">
                            Anonymous
                          </span>
                        </div>
                      ) : post.author?.avatar ? (
                       <div className="rounded-full w-12 h-12">
                         <Image
                          src={post.author.avatar}
                          alt="user image"
                          width={45}
                          height={45}
                          className="rounded-full object-cover h-full w-full"
                        />
                       </div>
                      ) : (
                        <div className="!bg-[#F6F6F6] rounded-full p-2 w-12 h-12 flex justify-center items-center">
                          <span className="text-sm text-gray-500 font-semibold">
                            {initials}
                          </span>
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
                          className="!p-0 !text-gray-500 hover:!text-gray-700"
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
                        height={200}
                        className="rounded-md w-full object-cover !h-90"
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
            })}
          </div>

          {/* Right Sidebar */}
          <div className="w-full relative lg:fixed lg:right-10 lg:w-[400px] lg:h-screen lg:pb-28 overflow-auto bg-white p-4 rounded-lg">
            <Input
              placeholder="Search anything..."
              className="mt-4 !rounded-full !bg-[#F6F6F6] !border-none"
              prefix={
                <Image
                  src="/images/search-normal.png"
                  alt="search icon"
                  width={20}
                  height={20}
                />
              }
            />
            <MyCommunity
              selectedCommunityId={selectedCommunity?._id}
              setSelectedCommunity={setSelectedCommunity}
              selectedCommunity={selectedCommunity}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Page;
