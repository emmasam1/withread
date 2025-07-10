"use client";
import React, { useState } from "react";
import { Button } from "antd";
import Image from "next/image";
import dynamic from "next/dynamic";
import AllActivities from "../components/AllActivities";
import UnreadActivities from "../components/UnreadActivities";
import ActivitieCommunity from "../components/ActivitieCommunity";


// Dynamically import motion
const MotionDiv = dynamic(() =>
  import("framer-motion").then((mod) => mod.motion.div), { ssr: false });

const Page = () => {
  const [activeTab, setActiveTab] = useState("1");

  const tabs = [
    { key: "1", label: "All Activities", content: <AllActivities/> },
    { key: "2", label: "Unread activities", content: <UnreadActivities /> },
    { key: "3", label: "Communities", content: <ActivitieCommunity /> },
  ];

  return (
    <div className="p-3">
      <div className="p-3 bg-white rounded-lg">
        <div className="flex justify-between items-center">
          <h1 className="font-semibold">Activity</h1>
          <div className="relative flex bg-gray-100 rounded-full p-1 w-full max-w-md">
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
          <Button className="!bg-gray-100 !rounded-full !border-0 hover:!text-black">
            <Image src="/images/like.png" alt="icon" width={12} height={12} />
            Mark all as read
          </Button>
        </div>
        <div className="mt-6">{tabs.find((tab) => tab.key === activeTab)?.content}</div>
      </div>
    </div>
  );
};

export default Page;
