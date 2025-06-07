"use client";

import React from "react";
import { Button, Dropdown, Space } from "antd";
import Image from "next/image";

const items = [
  { label: "Not interested in this post", key: "0" },
  { label: "Remove @ramsey’s post from my feed", key: "1" },
  { type: "divider" },
  { label: "Mute", key: "2" },
  { label: "Block", key: "3" },
  { label: "Report", key: "4" },
  { label: "Show fewer posts like this", key: "5" },
];

const ForYou = () => {
  const data = [
    {
      user1: "Jameson Michelle",
      user2: "Mark Jones",
      createdAt: "12-08-2024",
      topic:
        "New Solar Panel Technology that Sell Sunlight at Night Increases Efficiency by 40%",
      content:
        "New Solar Panel Technology that Sell Sunlight at Night Increases Efficiency by 40% New Solar Panel Technology that Sell Sunlight at Night Increases Efficiency by 40%, New Solar Panel Technology that Sell Sunlight at Night Increases Efficiency by 40%, New Solar Panel Technology that Sell Sunlight at Night Increases Efficiency by 40% New Solar Panel Technology that Sell Sunlight at Night Increases Efficiency by 40%....",
      like: 10,
      comment: 200,
      impressions: "2k",
      image: "/images/image1.png",
      verify: "/images/verify.png",
      userImage: "/images/Ellipse.png",
    },
    {
      user1: "Jameson Michelle",
      user2: "Mark Jones",
      createdAt: "12-08-2024",
      topic:
        "New Solar Panel Technology that Sell Sunlight at Night Increases Efficiency by 40%",
      content:
        "New Solar Panel Technology that Sell Sunlight at Night Increases Efficiency by 40% New Solar Panel Technology that Sell Sunlight at Night Increases Efficiency by 40%, New Solar Panel Technology that Sell Sunlight at Night Increases Efficiency by 40%, New Solar Panel Technology that Sell Sunlight at Night Increases Efficiency by 40% New Solar Panel Technology that Sell Sunlight at Night Increases Efficiency by 40%....",
      like: 10,
      comment: 200,
      impressions: "2k",
      image: "/images/image1.png",
      verify: "/images/verify.png",
      userImage: "/images/Ellipse.png",
    },
  ];

  return (
    <div className="space-y-8">
      {data.map((post, index) => (
        <div
          key={index}
          className="bg-white rounded-lg p-4 shadow-md w-full max-w-3xl mx-auto"
        >
          {/* User Info */}
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-3">
              <Image
                src={post.userImage}
                alt="User 1"
                width={40}
                height={40}
                className="rounded-full"
              />
              <Image
                src={post.userImage}
                alt="User 2"
                width={40}
                height={40}
                className="rounded-full -ml-7"
              />
              <div>
                <div className="flex items-center gap-1">
                  <p className="font-medium text-gray-800">{post.user1} &amp; {post.user2}</p>
                  <Image
                    src={post.verify}
                    alt="Verified"
                    width={18}
                    height={18}
                    className="inline"
                  />
                </div>
                <p className="text-xs text-gray-500">{post.createdAt}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button
                size="small"
                className="!bg-black !text-[#D9D9D9] !border-0 !rounded-full !py-1 !px-3"
              >
                Follow Both
              </Button>
              <Dropdown menu={{ items }} trigger={["click"]} placement="bottomRight">
                <a onClick={(e) => e.preventDefault()}>
                  <Space>
                    <Image
                      src="/images/Frame.png"
                      alt="More options"
                      width={18}
                      height={12}
                    />
                  </Space>
                </a>
              </Dropdown>
            </div>
          </div>
          {/* Post Image */}
          <div className="my-3">
            <Image
              src={post.image}
              alt="Post image"
              width={800}
              height={300}
              className="rounded w-full object-cover"
            />
          </div>
          {/* Post Content */}
          <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-2">
              {post.topic}
            </h2>
            <p className="text-sm text-gray-600">{post.content}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ForYou;
