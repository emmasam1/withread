"use client";
import React, { useState, useEffect } from "react";
import { useApp } from "../../context/context";
import { toast } from "react-toastify";
import Image from "next/image";
import { Button } from "antd";
import { motion } from "framer-motion";
import UserPost from "../components/UserPost";
import UserDraft from "../components/UserDraft";
import AnonymousPost from "../components/AnonymousPost";
import SavedPost from "../components/SaveedPost";
import { EditOutlined } from "@ant-design/icons";
import { Tooltip } from "antd";
import Communities from "../components/Communities";
import { useSearchParams } from "next/navigation";

const Page = () => {
  const searchParams = useSearchParams();
  const { API_BASE_URL, setLoading, loading, user, token } = useApp();
  const [activeTab, setActiveTab] = useState("1");

 useEffect(() => {
  const tabFromURL = searchParams.get("tab");
  if (tabFromURL) {
    setActiveTab(tabFromURL);

    // Scroll to the tab area
    const el = document.getElementById("tab-section");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  }
}, [searchParams]);


  const tabs = [
    { key: "1", label: "My Posts", content: <UserPost /> },
    { key: "2", label: "Anonymous Posts", content: <AnonymousPost /> },
    { key: "3", label: "Saved Posts", content: <SavedPost /> },
    { key: "4", label: "Drafts", content: <UserDraft /> },
    { key: "5", label: "My Communities", content: <Communities /> },
  ];

  const activeIndex = tabs.findIndex((tab) => tab.key === activeTab);


  return (
    <div className="p-3 bg-white">
      {/* Banner */}
      <div className="rounded-tl-lg rounded-tr-lg">
        <div className="relative">
          <Tooltip title="Change Banner" placement="topLeft">
            <div className="rounded-full h-10 w-10 absolute bg-gray-50 right-5 top-3 flex justify-center items-center cursor-pointer">
              <EditOutlined className="text-lg" />
            </div>
          </Tooltip>
          <Image
            src={user?.banner || "/images/banner.jpg"}
            alt="banner"
            width={1000}
            height={200}
            className="w-full h-[250px] object-cover rounded-tl-lg rounded-tr-lg"
          />
        </div>
      </div>

      {/* Profile Info */}
      <div className="relative mx-auto w-9/10">
        <div className="flex">
          {/* Avatar and Name */}
          <div className="flex flex-col items-center">
            <div className="h-[120px] w-[120px] rounded-full border-2 border-gray-200 overflow-hidden relative -top-10">
              <Image
                src={user?.avatar || "/images/avatar.jpg"}
                alt="user image"
                width={500}
                height={500}
                className="w-full h-full object-cover"
              />

              {/* Always visible text overlay */}
              <div className="absolute bottom-0 w-full bg-black/60 text-white text-xs text-center py-1 cursor-pointer">
                Edit
              </div>
            </div>

            <p className="mt-2 -left-3 !text-left text-2xl relative -top-10 font-bold">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="text-xl -left-1 relative -top-11 text-gray-400">
              @{user?.username}
            </p>
          </div>

          {/* Followers and Button */}
          <div className="ml-auto w-4/5 flex justify-between items-center relative -top-14">
            <div className="flex items-center gap-10">
              <p className="font-semibold">
                4.3k <span className="font-light text-gray-400">Followers</span>
              </p>
              <p className="font-semibold">
                4.3k <span className="font-light text-gray-400">Following</span>
              </p>
            </div>
            <Button className="!bg-black !text-[#D9D9D9] !border-0 !rounded-full !py-4 !px-4 flex gap-2">
              Edit Profile
            </Button>
          </div>
        </div>

        <div className="relative1">
          <p className="relative -top-8">{user?.bio}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="relative mt-8 bg-gray-100 rounded-full h-10 overflow-hidden flex mx-auto w-9/10">
        {/* Highlight pill */}
        <motion.span
          layout
          transition={{ type: "spring", stiffness: 500, damping: 40 }}
          className="absolute top-1 h-8 bg-white rounded-full shadow"
          style={{
            width: `${100 / tabs.length}%`,
            left: `calc(${activeIndex} * (100% / ${tabs.length}))`,
          }}
        />

        {/* Tab buttons */}
        {tabs.map((tab) => (
          <button
          id="tab-section"
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`cursor-pointer flex-1 z-10 text-xs sm:text-sm font-medium transition-colors ${
              activeTab === tab.key ? "text-black" : "text-gray-500"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="mx-auto w-9/10 mt-6">
        {tabs.find((tab) => tab.key === activeTab)?.content}
      </div>
    </div>
  );
};

export default Page;
