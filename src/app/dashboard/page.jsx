"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Button, Input, Divider } from "antd";
import { motion } from "framer-motion";
import { useApp } from "../context/context";

// import ForYou from "@/components/home/ForYou";
import ForYou from "./components/home/ForYou";
import TrendingContents from "./components/TrendingContents";
import TopCreators from "./components/home/TopCreators";

// const ForYou = () => <div className="p-4 bg-white shadow rounded">This is For You</div>;
const Featured = () => (
  <div className="p-4 bg-white shadow rounded">This is Featured</div>
);
const Following = () => (
  <div className="p-4 bg-white shadow rounded">This is Following</div>
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
      const storedUser = user;
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
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
    <div className="grid grid-cols-[2fr_450px] h-screen ">
      {/* Left Column */}
      <div className="rounded-lg p-4 grid grid-cols">
        <div className="w-[96%] -mt-4">
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
                  style={{
                    left: `${(parseInt(activeTab) - 1) * 33.333}%`,
                  }}
                />
              </div>

              {/* Post Input Box */}
              <div className="bg-white rounded-lg p-3 mb-6">
                <div className="flex items-center gap-5">
                  {user.avatar ? (
                    <Image
                      src={user?.avatar} // fallback in case avatar is null
                      alt="user image"
                      width={45}
                      height={45}
                      className="rounded-full"
                    />
                  ) : (
                    <div className="!bg-[#F6F6F6]  rounded-full p-2 w-12 h-12 flex justify-center items-center">
                      <h1 className="font-semibold text-gray-400">
                        {initials}
                      </h1>
                    </div>
                  )}
                  <Input
                    placeholder="Got something on your mind? Spill it out"
                    className="!bg-[#F6F6F6] !border-none !outline-none !rounded-full !px-4 !py-3 focus:ring-0 focus:outline-none"
                  />
                </div>
                <Divider className="!bg-[#f6f6f6b3]" />
                <div className="flex items-center justify-between">
                  <div></div>
                  <Button className="!bg-black !text-[#D9D9D9] !border-0 !rounded-full !py-5 !px-8">
                    Post
                  </Button>
                </div>
              </div>
            </>
          )}

          {/* Tab Content */}
          <div>{tabs.find((tab) => tab.key === activeTab)?.content}</div>
        </div>
      </div>

      {/* Right Column */}
      <div className="overflow-auto fixed right-10 w-[450px] h-screen pb-23.5">
        <TopCreators />
        <TrendingContents />
      </div>
    </div>
  );
};

export default Page;
