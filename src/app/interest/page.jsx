"use client";

import { Form, Input, Button, Row, Col } from "antd";
import Image from "next/image";
import React, { useState } from "react";

const interestsList = [
  "Blockchain Technology",
  "Database Management",
  "Gaming Technology",
  "Network Security",
  "Tech content",
  "AR / VR",
  "IT Job Market Trends",
  "Network Protocols",
  "Cryptocurrency",
  "5G and Beyond",
];

const Page = () => {
  const [selectedInterests, setSelectedInterests] = useState([]);

  const toggleInterest = (interest) => {
    setSelectedInterests((prev) =>
      prev.includes(interest)
        ? prev.filter((item) => item !== interest)
        : [...prev, interest]
    );
  };

  const handleSubmit = () => {
    console.log("Selected Interests:", selectedInterests);
    // redirect or submit logic here
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-[2fr_600px]">
      {/* Left Column */}
      <div className="p-4 bg-white h-screen relative overflow-y-auto">
        <Image
          src="/images/Group.png"
          alt="icon"
          width={100}
          height={100}
          className="absolute top-0 left-0"
        />
        <Image
          src="/images/shape-99.png"
          alt="icon"
          width={100}
          height={100}
          className="absolute bottom-0 right-0"
        />

        <div className="flex justify-center items-center flex-col !mt-20 ">
          <div className="flex justify-center">
            <Image
              src="/images/login_logo.png"
              alt="logo"
              width={150}
              height={150}
            />
          </div>
          <h1 className="font-semibold text-center text-black text-2xl mt-3 mb-5">
            Welcome to Withread!
          </h1>

          <div>
            <h1 className="font-bold text-3xl text-black">
              What kind of interest do you want <br />
              on your feed?
            </h1>
            <p className="text-gray-500 mt-4">
              Select at least 4 for now. You can add more later
            </p>

            <div className="flex flex-wrap gap-3 mt-5 max-w-2xl">
              {interestsList.map((interest) => (
                <button
                  key={interest}
                  onClick={() => toggleInterest(interest)}
                  className={`px-5 py-2 rounded-full border text-sm font-medium transition-all cursor-pointer
              ${
                selectedInterests.includes(interest)
                  ? "bg-black text-white border-black"
                  : "bg-white text-black border-gray-300"
              }`}
                >
                  {interest}
                </button>
              ))}
            </div>

            <div className="flex justify-end">
              <Button
                type="primary"
                onClick={handleSubmit}
                className="mt-10 !bg-[#141823] !rounded-full !px-10 !py-5"
              >
                Continue
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column */}
      <div
        className="hidden md:block p-4 h-screen"
        style={{
          backgroundImage: "url('/images/bg-img.png')",
          backgroundPosition: "center",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
        }}
      ></div>
    </div>
  );
};

export default Page;
