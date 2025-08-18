"use client";
import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import Account from "../components/Account";
import Profile from "../components/Profile";
import Privacy from "../components/Privacy";
import Notification from "../components/Notification";
import HelpandSupport from "../components/HelpandSupport";

const Page = () => {
  const [activeTab, setActiveTab] = useState("1");
  const searchParams = useSearchParams();

  const tabs = [
    { key: "1", label: "About", content: <Account /> },
    { key: "2", label: "Profile", content: <Profile /> },
    { key: "3", label: "Privacy", content: <Privacy /> },
    { key: "4", label: "Notification", content: <Notification /> },
    { key: "5", label: "Help & Support", content: <HelpandSupport /> },
  ];

   useEffect(() => {
    const tabFromURL = searchParams.get("tab");
    if (tabFromURL && tabs.find((t) => t.key === tabFromURL)) {
      setActiveTab(tabFromURL);
    }
  }, [searchParams]);

  return (
    <div className="p-3">
      <div className="bg-white rounded-lg p-3">
        {/* Tabs */}
        <div className="relative flex flex-wrap bg-gray-100 rounded-full p-1 mb-4 gap-1 sm:gap-0">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              className={`flex-1 text-xs sm:text-sm md:text-base z-10 py-2 px-1 sm:px-2 font-medium transition-colors text-center ${
                activeTab === tab.key ? "text-black" : "text-gray-400"
              }`}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
            </button>
          ))}

          {/* Animated Indicator */}
          <motion.div
            layout
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="absolute top-0 h-full bg-white rounded-full shadow z-0 hidden sm:block"
            style={{
              width: `${100 / tabs.length}%`,
              left: `${(parseInt(activeTab) - 1) * (100 / tabs.length)}%`,
            }}
          />
        </div>

        {/* Content */}
        <div className="text-gray-700 text-xs sm:text-sm md:text-base">
          {tabs.find((tab) => tab.key === activeTab)?.content}
        </div>
      </div>
    </div>
  );
};

export default Page;
