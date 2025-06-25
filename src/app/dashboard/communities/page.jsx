"use client";

import { Button, Input, Divider } from "antd";
import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { useApp } from "../../context/context";
import { motion } from "framer-motion";
import MyCommunity from "../components/MyCommunity";
import AllCommunities from "../components/AllCommunities";

const Page = () => {
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

   const shouldShowAllCommunities =
    !user || !Array.isArray(user.communities) || user.communities.length === 0;
  
  useEffect(() => {
    if (
      user &&
      Array.isArray(user.communities) &&
      user.communities.length > 0 &&
      !selectedCommunity
  ) {
    setSelectedCommunity(user.communities[0]); // ✅ set only once
  }
}, [user, selectedCommunity]);

if (loading) return null;

  return (
    <div className="p-3">
      {shouldShowAllCommunities ? (
        <AllCommunities />
      ) : (
        <>
          <div className="grid grid-cols-[2fr_400px] gap-9">
            <div className="rounded-lg grid grid-cols">
              <div className="bg-white p-3 rounded-md w-full">
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
                    {selectedCommunity?.memberProfiles?.length > 0 && (
                      <div className="gap-3 w-75 flex items-center justify-between mt-4">
                        <div className="flex">
                          {selectedCommunity?.memberProfiles
                            .slice(0, 3)
                            .map((member, index) => {
                              const initials = `${
                                member?.firstName?.[0] || ""
                              }${member?.lastName?.[0] || ""}`.toUpperCase();
                              const commonClass = `rounded-full object-cover ${
                                index > 0 ? "-ml-5" : ""
                              }`;

                              return member?.avatar ? (
                                <Image
                                  key={member?._id + index}
                                  src={member?.avatar}
                                  alt={member?.username}
                                  width={40}
                                  height={40}
                                  className={commonClass}
                                />
                              ) : (
                                <div
                                  key={member?._id + index}
                                  className={`bg-[#F6F6F6] text-gray-400 w-[40px] h-[40px] flex items-center justify-center ${commonClass}`}
                                >
                                  <span className="font-semibold text-sm">
                                    {initials}
                                  </span>
                                </div>
                              );
                            })}
                        </div>
                        <div className="w-52">
                          <p className="text-sm">
                            {selectedCommunity.memberProfiles
                              .slice(0, 3)
                              .map((m) => m.username)
                              .join(", ")}
                            {selectedCommunity.members.length > 3 && (
                              <>
                                {" "}
                                and {selectedCommunity.members.length - 3}{" "}
                                others
                              </>
                            )}{" "}
                            are members
                          </p>
                        </div>
                      </div>
                    )}
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
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 30,
                      }}
                      className="absolute top-0 h-full bg-white rounded-full shadow w-1/3 z-0"
                      style={{ left: `${(parseInt(activeTab) - 1) * 33.333}%` }}
                    />
                  </div>
                  <div className="flex items-center gap-5">
                    {user?.avatar ? (
                      <Image
                        src={user.avatar}
                        alt="user image"
                        width={45}
                        height={45}
                        className="rounded-full"
                      />
                    ) : (
                      <div className="!bg-[#F6F6F6] rounded-full p-2 w-12 h-12 flex justify-center items-center">
                        <h1 className="font-semibold text-gray-400">
                          {initials}
                        </h1>
                      </div>
                    )}
                    <Link href="/dashboard/newpost" className="w-full">
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
        </>
      )}
    </div>
  );
};

export default Page;
