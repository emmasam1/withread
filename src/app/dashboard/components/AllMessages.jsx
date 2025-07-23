"use client";
import { useApp } from "@/app/context/context";
import { Skeleton } from "antd";
import axios from "axios";
import Image from "next/image";
import React, { useEffect, useState } from "react";

const AllMessages = ({ onSelectMessage }) => {
  const { API_BASE_URL, setLoading, loading, user, token } = useApp();

  const [chattables, setChattables] = useState([]);

  const getChattables = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/message/chattable`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setChattables(res.data.chattable);
      console.log("Chattables:", res.data);
    } catch (error) {
      console.log("Error fetching chattables:", error);
    }
  };

  useEffect(() => {
    if (!API_BASE_URL || !token) return;
    getChattables();
  }, [token]);

  const AvatarPlaceholder = ({ text }) => (
    <h1 className="font-semibold text-gray-400">{text}</h1>
  );

  const messages = [
    {
      id: 1,
      name: "Muna Jamaji",
      username: "@munajamaji",
      text: "💼 I'm considering a job offer, but I'm torn between...",
      time: "1:58 PM",
      count: 3,
    },
    {
      id: 2,
      name: "Ada Obi",
      username: "@adaobi",
      text: "🔥 The project is almost done, just adding final touches.",
      time: "12:30 PM",
      count: 1,
    },
    {
      id: 3,
      name: "John Doe",
      username: "@johndoe",
      text: "Hey! Are you coming to the event tonight?",
      time: "10:15 AM",
      count: 5,
    },
    {
      id: 4,
      name: "Sarah Mark",
      username: "@sarahmark",
      text: "Can you review my PR on GitHub? 🚀",
      time: "Yesterday",
      count: 0,
    },
  ];

  return (
    <div className="flex flex-col gap-1 max-h-full overflow-y-auto">
      {chattables.map((msg) => {
        const initials = `${msg?.user?.firstName?.[0] || ""}${
          msg?.user?.lastName?.[0] || ""
        }`.toUpperCase();
        return (
          <div
            key={msg._id}
            className="flex justify-between items-center bg-white p-3 rounded-md hover:bg-gray-50 cursor-pointer"
            onClick={() => onSelectMessage(msg)}
          >
            {/* Left - User Info */}
            <div className="flex items-center gap-2">
              <div className="rounded-full h-11 w-11">
                {msg.user?.avatar ? (
                  <Image
                    src={msg.user?.avatar}
                    alt="user avatar"
                    width={48}
                    height={48}
                    className="rounded-full h-full w-full object-cover"
                  />
                ) : (
                  <div className="!bg-[#F6F6F6] rounded-full p-2 w-12 h-12 flex justify-center items-center">
                    <AvatarPlaceholder text={initials} />
                  </div>
                )}
              </div>
              <div>
                <div className="flex gap-2">
                  <h1 className="font-semibold">
                    {msg.user?.firstName} {msg.user?.lastName}
                  </h1>
                  <span className="text-gray-500 text-xs mt-1">
                    @{msg.user?.username}
                  </span>
                </div>
                <span className="text-gray-500 text-xs truncate w-44 block">
                  {msg.text}
                </span>
              </div>
            </div>

            {/* Right - Time & Count */}
            <div className="flex flex-col items-end justify-center gap-1">
              <span className="text-gray-500 text-xs">{msg.time}</span>
              {msg.count > 0 && (
                <div className="flex justify-center items-center bg-[#B475CC] text-white rounded-full h-5 w-5 text-center">
                  <span className="text-xs">
                    {msg.count > 60 ? "60+" : msg.count}
                  </span>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default AllMessages;
