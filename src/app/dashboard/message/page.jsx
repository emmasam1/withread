"use client";
import Image from "next/image";
import React, { useState } from "react";
import dynamic from "next/dynamic";
import AllMessages from "../components/AllMessages";
import { Button } from "antd";
import { RxDotsVertical } from "react-icons/rx";

const MotionDiv = dynamic(
  () => import("framer-motion").then((mod) => mod.motion.div),
  { ssr: false }
);

const Page = () => {
  const [activeTab, setActiveTab] = useState("1");
  const [selectedMessage, setSelectedMessage] = useState(null);

  const tabs = [
    {
      key: "1",
      label: "All Messages",
      content: <AllMessages onSelectMessage={setSelectedMessage} />,
    },
    { key: "2", label: "Unread Messages", content: "<UnreadActivities />" },
    { key: "3", label: "Drafts Messages", content: "<ActivitieCommunity />" },
  ];

  return (
    <div>
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
          <div className="mt-6">
            {tabs.find((tab) => tab.key === activeTab)?.content}
          </div>
        </div>

        {/* RIGHT - Message Viewer */}
        <div className="bg-white rounded-lg p-4 h-screen overflow-auto">
          {!selectedMessage ? (
            <div className="flex flex-col items-center justify-center mx-auto w-80">
              <Image
                src="/images/add-circle-3d.png"
                alt="No messages"
                width={160}
                height={160}
              />
              <div className="text-center mt-4">
                <h1 className="font-semibold text-2xl">Select a message</h1>
                <span className="text-[#333333E5] mt-2 text-xs">
                  Choose from your existing conversations, start a new one, or
                  just keep vibing
                </span>
              </div>

              <Button className="!bg-black !text-white !rounded-full hover:!text-white !border-none mt-4 p-2">
                <Image
                  src="/images/add.png"
                  alt="Add message"
                  width={20}
                  height={20}
                />
                Start a new conversation
              </Button>
            </div>
          ) : (
            <div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="rounded-full h-12 w-12 bg-green-900"></div>
                  <h2 className="text-lg font-semibold">{selectedMessage.name}</h2>
                </div>

                <RxDotsVertical/>
              </div>

              <p className="mt-3 text-gray-700">{selectedMessage.text}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Page;
