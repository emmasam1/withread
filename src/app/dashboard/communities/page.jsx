"use client";

import { Button, Input, Divider, Dropdown, Space, Skeleton } from "antd";
import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect, useRef } from "react";
import { useApp } from "../../context/context";
import { motion } from "framer-motion";
import AllCommunities from "../components/AllCommunities";
import axios from "axios";
import { toast } from "react-toastify";

const Page = () => {
  const { API_BASE_URL, user, loading, setLoading, token } = useApp();

  const [activeTab, setActiveTab] = useState("1");
  const [communityPosts, setCommunityPosts] = useState([]);
  const [communities, setCommunities] = useState([]);
  const [isLocalLoading, setIsLocalLoading] = useState(true);
  const hasSetDefault = useRef(false);

  const [selectedCommunity, setSelectedCommunity] = useState(() => {
    if (typeof window !== "undefined") {
      const stored = sessionStorage.getItem("selectedCommunity");
      return stored ? JSON.parse(stored) : null;
    }
    return null;
  });

  // Fetch communities
  useEffect(() => {
    if (!token || !API_BASE_URL) return;

    const fetchCommunities = async () => {
      try {
        setIsLocalLoading(true);
        const res = await axios.get(
          `${API_BASE_URL}/api/community/my-community`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const list = res?.data?.communities || [];
        setCommunities(list);

        // Default community selection
        if (!hasSetDefault.current) {
          const stored = sessionStorage.getItem("selectedCommunity");
          if (stored) {
            try {
              setSelectedCommunity(JSON.parse(stored));
            } catch {}
          } else if (list.length > 0) {
            setSelectedCommunity(list[0]);
            sessionStorage.setItem("selectedCommunity", JSON.stringify(list[0]));
          }
          hasSetDefault.current = true;
        }
      } catch (error) {
        console.error("Error fetching communities:", error);
        toast.error("Error fetching communities.");
      } finally {
        setIsLocalLoading(false);
      }
    };

    fetchCommunities();
  }, [API_BASE_URL, token]);

  // Fetch posts
  useEffect(() => {
    if (!selectedCommunity?._id) return;
    const getCommunityPosts = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `${API_BASE_URL}/api/post/${selectedCommunity._id}/posts`
        );
        setCommunityPosts(res.data.posts || []);
      } catch (error) {
        console.error("Error fetching community posts:", error);
      } finally {
        setLoading(false);
      }
    };

    getCommunityPosts();
  }, [selectedCommunity?._id, API_BASE_URL, setLoading]);

 const shouldShowAllCommunities =
  !isLocalLoading && communities.length === 0;


  const initials = `${user?.firstName?.[0] || ""}${
    user?.lastName?.[0] || ""
  }`.toUpperCase();

  const tabs = [
    { key: "1", label: "All Posts" },
    { key: "2", label: "Members" },
    { key: "3", label: "About" },
  ];

  const handleCommunityClick = (community) => {
    setSelectedCommunity(community);
    sessionStorage.setItem("selectedCommunity", JSON.stringify(community));
  };

  const handleLikeDislike = (id) => {
    console.log("Like clicked for post", id);
  };

  const items = [
    { key: "1", label: "Edit" },
    { key: "2", label: "Report" },
  ];

  if (!token) {
    return <div className="p-6 text-center text-gray-500">Initializing session...</div>;
  }

  if (isLocalLoading) {
    return (
      <div className="p-6">
        <div className="grid grid-cols-[2fr_400px] gap-9">
          <div className="space-y-4">
            <div className="bg-white p-6 rounded-md h-[300px] animate-pulse" />
            <div className="bg-white p-6 rounded-md h-[150px] animate-pulse" />
            <div className="bg-white p-6 rounded-md h-[150px] animate-pulse" />
          </div>
          <div className="fixed right-10 w-[400px] h-screen pb-24 bg-white p-4 rounded-tr-md rounded-tl-md space-y-5">
            <div className="h-10 bg-[#F6F6F6] rounded-full animate-pulse" />
            <div className="h-20 bg-[#F6F6F6] rounded-md animate-pulse" />
            <div className="h-20 bg-[#F6F6F6] rounded-md animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  return (
     <div className="p-3">
    {shouldShowAllCommunities ? (
      <AllCommunities />
    ) : isLocalLoading ? (
      // Skeleton Loader
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
                    Public Community • {selectedCommunity?.members?.length || 0} Members
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

              {/* Tabs */}
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

                {/* Post Input */}
                <div className="flex items-center gap-5">
                  {user?.avatar ? (
                    <Image
                      src={user.avatar}
                      alt="user image"
                      width={45}
                      height={45}
                      className="rounded-full h-12 w-12 object-cover"
                    />
                  ) : (
                    <div className="!bg-[#F6F6F6] rounded-full p-2 w-12 h-12 flex justify-center items-center">
                      <h1 className="font-semibold text-gray-400">{initials}</h1>
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
              </div>
            </div>

            {/* Posts */}
            {communityPosts.map((post) => (
              <div key={post._id} className="mt-5 p-3 bg-white rounded-md">
                {/* Post Header */}
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-3">
                    {post.isAnonymous ? (
                      <div className="bg-gray-200 rounded-full w-12 h-12 flex items-center justify-center">
                        <span className="text-sm font-semibold">Anon</span>
                      </div>
                    ) : (
                      <Image
                        src={post.author?.avatar || "/images/placeholder.jpg"}
                        alt="user image"
                        width={45}
                        height={45}
                        className="rounded-full h-12 w-12 object-cover"
                      />
                    )}
                    <div>
                      <p className="font-medium text-gray-800">
                        {post.isAnonymous
                          ? "Anonymous"
                          : `${post.author?.firstName} ${post.author?.lastName}`}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(post.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <Dropdown menu={{ items }} trigger={["click"]} placement="bottomRight">
                    <a onClick={(e) => e.preventDefault()}>
                      <Space>
                        <Image src="/images/Frame.png" alt="More" width={18} height={12} />
                      </Space>
                    </a>
                  </Dropdown>
                </div>

                {/* Post Content */}
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
                <h2 className="text-lg font-semibold mb-2">{post.title}</h2>
                <p>
                  {post.content.slice(0, 100)}...
                  <Link href={`/dashboard/feeds/${post._id}`}>Read More</Link>
                </p>
              </div>
            ))}
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
            <div className="flex justify-between items-center mt-3">
              <h1 className="font-medium text-md">My Community</h1>
              <Link href="/dashboard/profile?tab=5">See all</Link>
            </div>

            <div className="flex flex-col gap-3 mt-2">
              {isLocalLoading ? (
                Array.from({ length: 4 }).map((_, index) => (
                  <Skeleton.Avatar key={index} active size="large" shape="circle" />
                ))
              ) : (
                communities.map((community) => (
                  <div
                    key={community._id}
                    onClick={() => handleCommunityClick(community)}
                    className={`cursor-pointer px-3 p-2 rounded-md ${
                      selectedCommunity?._id === community._id
                        ? "bg-[#F5F4FF]"
                        : "hover:bg-[#F6F6F6]"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Image
                          src={community.avatar || "/images/placeholder.jpg"}
                          alt={community.name}
                          width={45}
                          height={45}
                          className="rounded-full h-10 w-10 object-cover"
                        />
                        <h2>{community.name}</h2>
                      </div>
                      <div className="bg-[#B475CC] rounded-full h-5 w-5 flex items-center justify-center text-white text-xs">
                        {community.members.length}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Page;
