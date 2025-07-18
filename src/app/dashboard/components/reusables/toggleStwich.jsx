"use client";
import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

const ToggleSwitch = ({ value, onChange }) => {
  return (
    <div className="relative flex items-center bg-gray-100 rounded-full p-2 w-[150px]">
      {/* Sliding Active Background */}
      <motion.div
        layout
        className="absolute top-1 bottom-1 bg-white rounded-full"
        style={{ width: "65px" }} // smaller width for better fit
        animate={{ x: value ? 0 : 75 }} // shift correctly
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
      />

      {/* ON Button */}
      <button
        className="relative flex items-center gap-1 justify-center w-1/2 text-sm font-medium z-10"
        onClick={() => onChange(true)}
      >
        <Image
          src={value ? "/images/dot_on.png" : "/images/dot_off.png"}
          alt="dot"
          height={10}
          width={10}
        />
        <span className={value ? "text-black" : "text-gray-600"}>On</span>
      </button>

      {/* OFF Button */}
      <button
        className="relative w-1/2 text-sm font-medium z-10"
        onClick={() => onChange(false)}
      >
        <span className={!value ? "text-black" : "text-gray-600"}>Off</span>
      </button>
    </div>
  );
};

export default ToggleSwitch;
