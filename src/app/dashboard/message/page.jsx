"use client";
import Image from "next/image";
import React, { useState } from "react";
import dynamic from "next/dynamic";
import AllMessages from "../components/AllMessages";
import { Button, Input } from "antd";
import { RxDotsVertical } from "react-icons/rx";
const { TextArea } = Input;

const MotionDiv = dynamic(
  () => import("framer-motion").then((mod) => mod.motion.div),
  { ssr: false }
);

const Page = () => {
  const [activeTab, setActiveTab] = useState("1");
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [value, setValue] = useState("");

  const tabs = [
    {
      key: "1",
      label: "All Messages",
      content: <AllMessages onSelectMessage={setSelectedMessage} />,
    },
    { key: "2", label: "Unread Messages", content: "<UnreadActivities />" },
    { key: "3", label: "Drafts Messages", content: "<ActivitieCommunity />" },
  ];

  const chatMessages = [
    {
      id: 1,
      text: "I'm considering a job offer, but I'm torn between the opportunity for growth and the fear of leaving my current comfort zone. Any thoughts?",
      time: "12:30 PM",
      sender: "other",
    },
    {
      id: 2,
      text: "I think you should take it! 🚀 It’s worth the risk.",
      time: "12:30 PM",
      sender: "me",
    },
    {
      id: 3,
      text: "That's true, I’ll give it serious thought. Thanks!",
      time: "12:32 PM",
      sender: "other",
    },
    {
      id: 4,
      text: "That's true, I’ll give it serious thought. Thanks!",
      time: "12:32 PM",
      sender: "other",
    },
  ];

  return (
    <div className="max-h-4/5">
      <div className="grid grid-cols-1 md:grid-cols-[400px_1fr] gap-7 p-4 max-h-11/12">
        {/* LEFT - Message List */}
        <div className="bg-white rounded-lg p-2 flex flex-col max-h-11/12">
          {/* Header */}
          <div className="flex justify-between items-center flex-shrink-0">
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

          {/* Tabs */}
          <div className="relative flex bg-gray-100 rounded-full p-1 w-full max-w-md mt-5 flex-shrink-0">
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

          {/* Messages */}
          <div className="mt-6 flex-1 overflow-y-auto">
            {tabs.find((tab) => tab.key === activeTab)?.content}
          </div>
        </div>

        {/* RIGHT - Message Viewer */}
        <div className="bg-white rounded-lg p-4 flex flex-col max-h-11/12">
          {!selectedMessage ? (
            <div className="flex flex-col items-center justify-center mx-auto w-80 flex-1">
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
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex justify-between items-center border-b border-[#DDDDDD33] pb-3 mb-3 flex-shrink-0">
                <div className="flex items-center gap-2">
                  <div className="rounded-full h-12 w-12 bg-green-900"></div>
                  <h2 className="text-lg font-semibold">
                    {selectedMessage.name}
                  </h2>
                </div>
                <RxDotsVertical className="text-gray-600 cursor-pointer" />
              </div>

              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto space-y-4">
                {chatMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${
                      msg.sender === "me" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-xs p-3 rounded-lg text-sm ${
                        msg.sender === "me"
                          ? "bg-black text-white rounded-br-none"
                          : "bg-gray-100 text-gray-800 rounded-bl-none"
                      }`}
                    >
                      {msg.text}
                      <div className="text-xs text-gray-400 mt-1 text-right">
                        {msg.time}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Message Input */}
              <div className="mt-3 flex-shrink-0">
                <div className="w-full bg-gray-100 p-3 rounded-lg">
                  <div className="w-full flex gap-2">
                    <TextArea
                      value={value}
                      onChange={(e) => setValue(e.target.value)}
                      placeholder="Type your message here...."
                      autoSize={{ minRows: 3, maxRows: 5 }}
                      className="!bg-transparent !border-none !outline-none w-full focus:!ring-0 focus:!border-none"
                    />
                    <Button className="!bg-black !text-white !rounded-full hover:!text-white !border-none px-5">
                      Send
                      <Image
                        src="/images/send.png"
                        alt="Send"
                        width={13}
                        height={13}
                      />
                    </Button>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <Image
                      src="/images/Smile_circle.png"
                      alt="smile"
                      width={20}
                      height={20}
                      className="cursor-pointer"
                    />
                    <Image
                      src="/images/Gallery.png"
                      alt="gallery"
                      width={20}
                      height={20}
                      className="cursor-pointer"
                    />
                    <Image
                      src="/images/link.png"
                      alt="link"
                      width={20}
                      height={20}
                      className="cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Page;
