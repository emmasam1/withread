"use client";
import React, { useEffect, useState } from "react";

const AllMessages = ({ onSelectMessage }) => {
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
    <div className="flex flex-col gap-1">
      {messages.map((msg) => (
        <div
          key={msg.id}
          className="flex justify-between items-center bg-white p-3 rounded-md hover:bg-gray-50 cursor-pointer"
          onClick={() => onSelectMessage(msg)}
        >
          {/* Left - User Info */}
          <div className="flex items-center gap-2">
            <div className="rounded-full h-12 w-12 bg-green-900"></div>
            <div>
              <div className="flex gap-2">
                <h1 className="font-semibold">{msg.name}</h1>
                <span className="text-gray-500 text-xs mt-1">
                  {msg.username}
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
      ))}
    </div>
  );
};

export default AllMessages;
