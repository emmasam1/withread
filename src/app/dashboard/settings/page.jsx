"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import Account from "../components/Account";
import Profile from "../components/Profile";
import Privacy from "../components/Privacy";

const Page = () => {
  const [activeTab, setActiveTab] = useState("1");

  const tabs = [
    { key: "1", label: "About", content: <Account /> },
    { key: "2", label: "Profile", content: <Profile />},
    { key: "3", label: "Privacy", content: <Privacy /> },
    { key: "4", label: "Notification", content: "Notification preferences." },
    { key: "5", label: "Help & Support", content: "Help & Support content." },
  ];

  return (
    <div className="p-3">
      {/* Tabs */}
     <div className="bg-white rounded-lg p-3">
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

        {/* Animated indicator */}
        <motion.div
          layout
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="absolute top-0 h-full bg-white rounded-full shadow z-0"
          style={{
            width: `${100 / tabs.length}%`,
            left: `${(parseInt(activeTab) - 1) * (100 / tabs.length)}%`,
          }}
        />
      </div>

      {/* Content */}
      <div className="text-gray-700 text-sm">
        {tabs.find((tab) => tab.key === activeTab)?.content}
      </div>
     </div>
    </div>
  );
};

export default Page;
