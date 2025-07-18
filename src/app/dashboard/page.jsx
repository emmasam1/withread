"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Button, Input, Divider } from "antd";
import { motion } from "framer-motion";
import { useApp } from "../context/context";
import Link from "next/link";

// import ForYou from "@/components/home/ForYou";

import TrendingContents from "./components/TrendingContents";
import TopCreators from "./components/home/TopCreators";
import ForYou from "./feeds/page";
// import Featured from "./featured/page";
import Following from "./following/page";

// const ForYou = () => <div className="p-4 bg-white shadow rounded">This is For You</div>;
const Featured = () => (
  <div className="p-4 bg-white shadow rounded">This is Featured</div>
);


const Page = () => {
  const [activeTab, setActiveTab] = useState("1");
  const { isLoggedIn, API_BASE_URL, user, setUser, logout, loading } = useApp();

  const tabs = [
    { key: "1", label: "For you", content: <ForYou /> },
    { key: "2", label: "Featured", content: <Featured /> },
    { key: "3", label: "Following", content: <Following /> },
  ];

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (user) {
        try {
          setUser(user);
        } catch (error) {
          console.error("Error parsing stored user:", error);
        }
      }
    }
  }, []);

  const initials = `${user?.firstName?.[0] || ""}${
    user?.lastName?.[0] || ""
  }`.toUpperCase();

  return (
    <div className="p-3">
      <div className="grid grid-cols-1 md:grid-cols-[2fr_400px] gap-7 p-4">
        {/* Left Column */}
        <div className="rounded-lg grid grid-cols">
          <div className="w-full">
            {user && (
              <>
                {/* Tab Header */}
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
                <div className="bg-white rounded-lg p-3 mb-6">
                  <div className="flex items-center gap-5">
                    {user?.avatar ? (
                      <div className="rounded-full w-12 h-12">
                        <Image
                        src={user?.avatar}
                        alt="user image"
                        width={45}
                        height={45}
                        className="rounded-full h-full w-full object-cover"
                      />
                      </div>
                    ) : (
                      <div className="!bg-[#F6F6F6]  rounded-full p-2 w-12 h-12 flex justify-center items-center">
                        <h1 className="font-semibold text-gray-400">
                          {initials}
                        </h1>
                      </div>
                    )}
                    <Link href="/dashboard/newpost" className="w-full">
                      <Input
                        placeholder="Got something on your mind? Spill it out"
                        className="!bg-[#F6F6F6] !border-none !outline-none !rounded-full !pl-4 !py-3"
                        readOnly
                      />
                    </Link>
                  </div>
                  <Divider className="!bg-[#f6f6f6b3]" />
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <div className="flex gap-10 items-center flex-wrap">
                      <Link
                        href="/dashboard/newpost"
                        className="flex items-center gap-2 text-sm"
                      >
                        <Image
                          src="/images/photo.png"
                          alt="icon"
                          width={30}
                          height={30}
                        />
                        Photo/Video
                      </Link>
                      <Link
                        href="/dashboard/newpost"
                        className="flex items-center gap-2 text-sm"
                      >
                        <Image
                          src="/images/content.png"
                          alt="icon"
                          width={30}
                          height={30}
                        />
                        Content
                      </Link>
                    </div>
                    <Button className="!bg-black !text-[#D9D9D9] !border-0 !rounded-full !py-2 !px-6">
                      <Link href="/dashboard/newpost">Post</Link>
                    </Button>
                  </div>
                </div>
              </>
            )}

            {/* Tab Content */}
            <div>{tabs.find((tab) => tab.key === activeTab)?.content}</div>
          </div>
        </div>

        {/* ✅ Right Column: no longer fixed or absolutely positioned */}
        <div className="w-full relative lg:fixed lg:right-10 lg:w-[400px] lg:h-screen lg:pb-28 overflow-auto">
          <TopCreators />
          <TrendingContents />
        </div>
      </div>
    </div>
  );
};

export default Page;
