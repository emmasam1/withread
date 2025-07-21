"use client";
import Image from "next/image";
import React, { useState } from "react";
import dynamic from "next/dynamic";
import AllMessages from "../components/AllMessages";

const MotionDiv = dynamic(
  () => import("framer-motion").then((mod) => mod.motion.div),
  { ssr: false }
);

const Page = () => {
  const [activeTab, setActiveTab] = useState("1");

  const tabs = [
    { key: "1", label: "All Messages", content: <AllMessages /> },
    { key: "2", label: "Unread Messages", content: "<UnreadActivities />" },
    { key: "3", label: "Drafts Messages", content: "<ActivitieCommunity />" },
  ];

  return (
    <div className="">
      {/* Left: sidebar (400px), Right: main reading pane (flexible) */}
      <div className="grid grid-cols-1 md:grid-cols-[400px_1fr] gap-7 p-4">
        {/* LEFT - Message List */}
        <div className="bg-white rounded-lg p-2 overflow-auto h-screen">
          <div className="flex justify-between items-center">
            <h2 className="font-medium">Messages</h2>
            <div className="flex items-center gap-3">
              <Image
                src="/images/add-circle.png"
                alt="message icon"
                width={20}
                height={20}
              />
              <Image
                src="/images/setting_black.png"
                alt="message icon"
                width={20}
                height={20}
              />
            </div>
          </div>
          <div className="relative flex bg-gray-100 rounded-full p-1 w-full max-w-md mt-5">
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

            <MotionDiv
              layout
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="absolute top-0 h-full bg-white rounded-full shadow w-1/3 z-0"
              style={{ left: `${(parseInt(activeTab) - 1) * 33.333}%` }}
            />
          </div>
          <div className="mt-6">{tabs.find((tab) => tab.key === activeTab)?.content}</div>
        </div>

        {/* RIGHT - Message Viewer */}
        <div className="bg-white rounded-lg p-4 h-screen overflow-auto">
          <h2 className="font-semibold mb-4">Message Viewer</h2>
          <p className="text-sm text-gray-500">Select a message to read.</p>
        </div>
      </div>
    </div>
  );
};

export default Page;
