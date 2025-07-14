"use client";
import React, { useState } from "react";

const Page = () => {
  const [message, setMessage] = useState([]);

  return (
    <div className="">
      {/* Left: sidebar (400px), Right: main reading pane (flexible) */}
      <div className="grid grid-cols-1 md:grid-cols-[400px_1fr] gap-7 p-4">
        
        {/* LEFT - Message List */}
        <div className="bg-white rounded-lg p-4 overflow-auto h-screen">
          <h2 className="font-semibold mb-4">Inbox</h2>
          {message.length === 0 ? (
            <p className="text-sm text-gray-500">No messages</p>
          ) : (
            <ul>
              {message.map((msg, index) => (
                <li key={index} className="mb-2 p-2 border rounded">
                  {msg.title}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* RIGHT - Message Viewer */}
        <div className="bg-white rounded-lg p-4 h-screen overflow-auto">
          <h2 className="font-semibold mb-4">Message Viewer</h2>
          <p className="text-sm text-gray-500">
            Select a message to read.
          </p>
        </div>

      </div>
    </div>
  );
};

export default Page;
