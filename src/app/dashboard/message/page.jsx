"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import AllMessages from "../components/AllMessages";
import { Button, Input } from "antd";
import { RxDotsVertical } from "react-icons/rx";
import { useApp } from "@/app/context/context";
import { motion } from "framer-motion";
import EmojiPicker from "emoji-picker-react";
import axios from "axios";
import { ReactionBarSelector } from "@charkour/react-reactions";

const { TextArea } = Input;
const MotionDiv = dynamic(
  () => import("framer-motion").then((mod) => mod.motion.div),
  { ssr: false }
);

const Page = () => {
  const [activeTab, setActiveTab] = useState("1");
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [message, setMessage] = useState([]);
  const [value, setValue] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [replyToMessage, setReplyToMessage] = useState(null);
  const [reactioningTo, setReactioningTo] = useState(null);
  const { API_BASE_URL, setLoading, token, user, loading } = useApp();

  const tabs = [
    {
      key: "1",
      label: "All Messages",
      content: <AllMessages onSelectMessage={setSelectedMessage} />,
    },
    { key: "2", label: "Unread Messages", content: "<UnreadActivities />" },
    { key: "3", label: "Drafts Messages", content: "<ActivitieCommunity />" },
  ];

  const emojiMap = {
    thumbsup: "👍",
    heart: "❤️",
    smile: "😊",
    laugh: "😂",
    angry: "😡",
    cry: "😢",
    clap: "👏",
    fire: "🔥",
    // add more if needed
  };

  const handleEmojiClick = (emojiData) => {
    const emoji = emojiData.emoji;
    setValue((prev) => prev + emoji);
  };

  const sendMessage = async () => {
    if (!value.trim() || !selectedMessage) return;

    const payLoad = {
      receiver: selectedMessage?.user?._id,
      content: value,
      ...(replyToMessage ? { replyTo: replyToMessage._id } : {}),
    };

    try {
      setLoading(true);
      await axios.post(`${API_BASE_URL}/api/message/send`, payLoad, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setValue("");
      setReplyToMessage(null);
      getChats();
    } catch (error) {
      console.log("Error sending message:", error);
    } finally {
      setLoading(false);
    }
  };

  const getReactions = async (messageId) => {
    if (!messageId) {
      console.warn("No messageId provided to getReactions");
      return [];
    }

    try {
      const res = await axios.get(
        `${API_BASE_URL}/api/message/${messageId}/reactions`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log(res.data.reactions);
      return res.data.reactions || [];
    } catch (error) {
      console.error("Error fetching reactions:", error);
      return [];
    }
  };

  const reactToMessage = async (messageId, emojiShortCode) => {
    try {
      await axios.post(
        `${API_BASE_URL}/api/message/react/${messageId}`,
        { emoji: emojiShortCode },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Refresh the entire chat after reacting
      await getChats();
    } catch (error) {
      console.error("Reaction error:", error);
    } finally {
      setReactioningTo(null);
    }
  };

  const getChats = async () => {
    if (!API_BASE_URL || !token || !selectedMessage) return;
    try {
      setLoading(true);
      const res = await axios.get(
        `${API_BASE_URL}/api/message/history/${selectedMessage?.user?._id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log("this are the selected messages", res);
      setMessage(res.data.messages || []);
    } catch (error) {
      console.log("Error fetching chats:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedMessage) {
      getChats();
      getReactions(selectedMessage._id);
    }
  }, [selectedMessage]);

  const initials = `${selectedMessage?.user?.firstName?.[0] || ""}${
    selectedMessage?.user?.lastName?.[0] || ""
  }`.toUpperCase();

  const handleReply = (msg) => setReplyToMessage(msg);

  return (
    <div className="h-[86vh]">
      <div className="grid grid-cols-1 md:grid-cols-[400px_1fr] gap-7 p-4 h-full">
        <div className="bg-white rounded-lg p-2 flex flex-col max-h-full">
          <div className="flex justify-between items-center">
            <h2 className="font-medium">Messages</h2>
            <div className="flex items-center gap-3">
              <Image
                src="/images/add-circle.png"
                alt="Add"
                width={20}
                height={20}
              />
              <Image
                src="/images/setting_black.png"
                alt="Settings"
                width={20}
                height={20}
              />
            </div>
          </div>

          <div className="relative flex bg-gray-100 rounded-full p-1 mt-5">
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

          <div className="mt-6 flex-1 overflow-y-auto">
            {tabs.find((tab) => tab.key === activeTab)?.content}
          </div>
        </div>

        {/* Chat Window */}
        <div className="bg-white rounded-lg p-4 flex flex-col h-full overflow-hidden">
          {!selectedMessage ? (
            <div className="flex flex-col items-center justify-center mx-auto w-80 flex-1">
              <Image
                src="/images/add-circle-3d.png"
                alt="No messages"
                width={160}
                height={160}
              />
              <h1 className="font-semibold text-2xl mt-4">Select a message</h1>
              <span className="text-[#333333E5] text-xs mt-2 text-center">
                Choose from your existing conversations, start a new one, or
                just keep vibing
              </span>
              <Button className="!bg-black !text-white !rounded-full hover:!text-white !border-none mt-4 p-2">
                <Image src="/images/add.png" alt="Add" width={20} height={20} />
                Start a new conversation
              </Button>
            </div>
          ) : (
            <>
              <div className="flex justify-between items-center border-b border-[#DDDDDD33] pb-3 mb-3 flex-shrink-0">
                <div className="flex items-center gap-2">
                  {selectedMessage.user?.avatar ? (
                    <div className="rounded-full h-11 w-11">
                      <Image
                        src={selectedMessage.user.avatar}
                        alt="Avatar"
                        width={44}
                        height={44}
                        className="rounded-full h-full w-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="bg-[#F6F6F6] w-11 h-11 rounded-full flex items-center justify-center">
                      <span className="font-semibold text-gray-400">
                        {initials}
                      </span>
                    </div>
                  )}
                  <h2 className="text-lg font-semibold">
                    {selectedMessage?.user?.username}
                  </h2>
                </div>
                <RxDotsVertical className="text-gray-600" />
              </div>

              <div className="flex-1 overflow-y-auto space-y-4 pr-2">
                {message.map((msg) => {
                  const isMe = msg.sender?._id === user?._id;
                  const time = new Date(
                    msg.sentAt || msg.createdAt
                  ).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  });

                  return (
                    <div
                      key={msg._id}
                      className={`flex flex-col ${
                        isMe ? "items-end" : "items-start"
                      }`}
                    >
                      <div className="relative group">
                        <div
                          className={`max-w-xs p-3 rounded-lg text-sm ${
                            isMe
                              ? "bg-black text-white rounded-br-none"
                              : "bg-gray-100 text-gray-800 rounded-bl-none"
                          }`}
                        >
                          {msg.replyTo && (
                            <div className="text-xs bg-gray-200 text-gray-700 p-1 rounded mb-1">
                              Replying to: {msg.replyTo.content}
                            </div>
                          )}
                          {msg.content}
                          {msg.emojis && msg.emojis.length > 0 && (
                            <div className="mt-2 flex gap-1 flex-wrap">
                              {msg.emojis.map((emoji, idx) => (
                                <span key={idx} className="text-sm">
                                  {emoji}
                                </span>
                              ))}
                            </div>
                          )}

                          <div className="mt-2 flex items-center gap-2">
                            {(() => {
                              const grouped = {};

                              // Group reactions by emoji
                              msg.reactions?.forEach((r) => {
                                if (!r?.emoji) return;
                                if (!grouped[r.emoji]) grouped[r.emoji] = [];
                                grouped[r.emoji].push(r.user);
                              });

                              const emojiEntries = Object.entries(grouped);
                              const maxDisplay = 5;
                              const displayed = emojiEntries.slice(
                                0,
                                maxDisplay
                              );
                              const extraCount =
                                emojiEntries.length - maxDisplay;

                              // Total count from all emojis
                              const totalCount = emojiEntries.reduce(
                                (acc, [_, users]) => acc + users.length,
                                0
                              );

                              return (
                                <div className="flex items-center gap-2">
                                  {/* Emoji stack */}
                                  <div className="flex flex-row-reverse space-x-reverse space-x-[-6px] relative">
                                    {displayed.map(([emojiKey], idx) => (
                                      <motion.div
                                        key={idx}
                                        whileHover={{ scale: 1.1 }}
                                        className="w-6 h-6 flex items-center justify-center rounded-full shadow-sm bg-white text-lg"
                                        transition={{
                                          type: "spring",
                                          stiffness: 300,
                                        }}
                                      >
                                        {emojiMap[emojiKey] || emojiKey}
                                      </motion.div>
                                    ))}

                                    {/* If more than maxDisplay emojis, show +N */}
                                    {extraCount > 0 && (
                                      <div className="w-6 h-6 flex items-center justify-center rounded-full bg-gray-200 text-[10px] font-medium border">
                                        +{extraCount}
                                      </div>
                                    )}
                                  </div>
                                  {/* Total count */}
                                  <div
                                    className={`text-sm font-semibold text-gray-700 ${
                                      isMe ? "text-white" : ""
                                    }`}
                                  >
                                    {/* {totalCount} */}
                                  </div>
                                </div>
                              );
                            })()}
                          </div>
                        </div>

                        <div className="mt-1 text-right">
                          <button
                            onClick={() => handleReply(msg)}
                            className="text-xs text-blue-500 mt-1 hover:underline mx-2"
                          >
                            Reply
                          </button>
                          <Image
                            src="/images/emoji.png"
                            alt="React"
                            width={20}
                            height={20}
                            className="inline-block mx-2 cursor-pointer"
                            onClick={() => setReactioningTo(msg._id)}
                          />
                          <span className="text-xs text-gray-400 mx-2">
                            {time}
                          </span>
                        </div>

                        {reactioningTo === msg._id && (
                          <div
                            className="absolute z-50 top-full left-0 mt-1"
                            onMouseLeave={() => setReactioningTo(null)}
                          >
                            <div className="flex gap-2 bg-white shadow p-2 rounded-full">
                              {Object.entries(emojiMap).map(([name, emoji]) => (
                                <span
                                  key={name}
                                  className="text-2xl cursor-pointer hover:scale-125 transition-transform"
                                  title={name}
                                  onClick={() => reactToMessage(msg._id, name)}
                                >
                                  {emoji}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {replyToMessage && (
                <div className="bg-gray-200 text-sm p-2 mb-2 rounded flex justify-between items-center">
                  <span>
                    Replying to: <strong>{replyToMessage.content}</strong>
                  </span>
                  <button
                    onClick={() => setReplyToMessage(null)}
                    className="text-red-500 text-xs"
                  >
                    Cancel
                  </button>
                </div>
              )}

              <div className="mt-3 flex-shrink-0 sticky bottom-0 bg-white pt-2">
                <div className="bg-gray-100 p-3 rounded-lg">
                  <div className="flex gap-2">
                    <TextArea
                      value={value}
                      onChange={(e) => setValue(e.target.value)}
                      placeholder="Type your message..."
                      autoSize={{ minRows: 3, maxRows: 5 }}
                      className="!bg-transparent !border-none !outline-none w-full focus:!ring-0 focus:!border-none"
                    />
                    <Button
                      className="!bg-black !text-white !rounded-full hover:!text-white !border-none px-5 flex items-center gap-2"
                      onClick={sendMessage}
                    >
                      Send
                      <motion.div
                        animate={
                          loading
                            ? { rotate: [0, 20, -20, 0], scale: [1, 1.2, 1] }
                            : { rotate: 0, scale: 1 }
                        }
                        transition={
                          loading
                            ? {
                                duration: 0.6,
                                repeat: Infinity,
                                ease: "easeInOut",
                              }
                            : { duration: 0.2 }
                        }
                      >
                        <Image
                          src="/images/send.png"
                          alt="Send"
                          width={15}
                          height={15}
                        />
                      </motion.div>
                    </Button>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <motion.button
                      onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                      whileHover={{ scale: 1.2, rotate: 10 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <Image
                        src="/images/Smile_circle.png"
                        alt="Emoji"
                        width={20}
                        height={20}
                      />
                    </motion.button>
                    <Image
                      src="/images/Gallery.png"
                      alt="Gallery"
                      width={20}
                      height={20}
                    />
                    <Image
                      src="/images/link.png"
                      alt="Link"
                      width={20}
                      height={20}
                    />
                  </div>
                  {showEmojiPicker && (
                    <div className="mt-2">
                      <EmojiPicker
                        onEmojiClick={handleEmojiClick}
                        height={350}
                        width="100%"
                      />
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Page;
