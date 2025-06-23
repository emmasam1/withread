"use client";
import { Button, Input, Divider } from "antd";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { useApp } from "../../context/context";
import { motion } from "framer-motion";
import MyCommunity from "../components/MyCommunity";

const page = () => {
  const { isLoggedIn, API_BASE_URL, user, setUser, logout, loading } = useApp();
  const [activeTab, setActiveTab] = useState("1");
  const [selectedCommunity, setSelectedCommunity] = useState(null);

  const initials = `${user?.firstName?.[0] || ""}${
    user?.lastName?.[0] || ""
  }`.toUpperCase();

  const tabs = [
    { key: "1", label: "All Posts" },
    { key: "2", label: "Members" },
    { key: "3", label: "About" },
  ];

  return (
    <div className="p-3">
      <div className="grid grid-cols-[2fr_400px] gap-9">
        <div className="rounded-lg grid grid-cols">
          <div className="bg-white p-3 rounded-md w-full">
            <div className="h-70 relative">
              <Image
                src={selectedCommunity?.banner}
                alt="image"
                width={1000}
                height={500}
                className="w-full h-full object-cover rounded-md"
              />

              <div className="absolute h-25 w-25 rounded-full left-5 -bottom-12">
                <Image
                  src={selectedCommunity?.avatar}
                  alt="image"
                  width={1000}
                  height={500}
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="mt-15 ml-4">
                <h2 className="font-semibold">{selectedCommunity?.name}</h2>
                <p className="mt-2 text-sm">Public Community • 20.5K Members</p>
              </div>
              <div>
                <div className="flex items-center gap-2 justify-end">
                  <Button
                    className="!bg-[#F3F3F4] !text-black !border-0 !rounded-full !py-4 !px-4 flex mr-3"
                    // onClick={showModal}
                  >
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

                <div className="gap-3 w-75 flex justify-between mt-4">
                  <div className="flex">
                    <Image
                      src="/images/Ellipse.png"
                      //   src={user?.avatar} // fallback in case avatar is null
                      alt="user image"
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                    <Image
                      src="/images/Ellipse.png"
                      //   src={user?.avatar} // fallback in case avatar is null
                      alt="user image"
                      width={40}
                      height={40}
                      className="rounded-full relative -ml-5"
                    />
                    <Image
                      src="/images/Ellipse.png"
                      //   src={user?.avatar} // fallback in case avatar is null
                      alt="user image"
                      width={40}
                      height={40}
                      className="rounded-full relative -ml-5"
                    />
                  </div>
                  <div className="w-52">
                    <p className="text-sm">
                      Mario, Jackson, Allison and 54 others followers are
                      members
                    </p>
                  </div>
                </div>
              </div>
            </div>

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
                  style={{
                    left: `${(parseInt(activeTab) - 1) * 33.333}%`,
                  }}
                />
              </div>
              <div className="flex items-center gap-5">
                {user?.avatar ? (
                  <Image
                    src={user?.avatar} // fallback in case avatar is null
                    alt="user image"
                    width={45}
                    height={45}
                    className="rounded-full"
                  />
                ) : (
                  <div className="!bg-[#F6F6F6]  rounded-full p-2 w-12 h-12 flex justify-center items-center">
                    <h1 className="font-semibold text-gray-400">{initials}</h1>
                  </div>
                )}
                <Link href="/dashboard/newpost" className="w-full">
                  <Input
                    placeholder="Got something on your mind? Spill it out"
                    className="!bg-[#F6F6F6] !border-none !outline-none !rounded-full !px-4 !py-3 focus:ring-0 focus:outline-none"
                    readOnly
                  />
                </Link>
              </div>
              <Divider className="!bg-[#f6f6f6b3]" />
              <div className="flex items-center justify-between">
                <div className="flex gap-10 items-center">
                  <Link
                    href="/dashboard/newpost"
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
                    href="/dashboard/newpost"
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

          {/* content */}
          <div className="mt-5 p-3 bg-white rounded-md">ff</div>
        </div>
        <div className="overflow-auto fixed right-10 w-[400px] h-screen pb-23.5 bg-white p-3 rounded-tr-md rounded-tl-md">
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
          />
        </div>
      </div>
    </div>
  );
};

export default page;
