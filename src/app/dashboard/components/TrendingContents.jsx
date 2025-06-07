import React from "react";
import Link from "next/link";
import { Button } from "antd";
import Image from "next/image";

const TrendingContents = () => {
  const data = [
    {
      username: "Micheal Reacher",
      occupation: "Technology",
      content:
        "New Solar Panel Technology that Sells Sunlight at Night Increases Efficiency by 40%",
      date: "29 - Aug - 2024",
      userImage: "/images/Ellipse.png",
      companyImage: "/images/Rectangle6.png",
      time: "3 min read",
    },
    {
      username: "Micheal Reacher",
      occupation: "Technology",
      content:
        "New Solar Panel Technology that Sells Sunlight at Night Increases Efficiency by 40%",
      date: "29 - Aug - 2024",
      userImage: "/images/Ellipse.png",
      companyImage: "/images/Rectangle6.png",
      time: "3 min read",
    },
    {
      username: "Micheal Reacher",
      occupation: "Technology",
      content:
        "New Solar Panel Technology that Sells Sunlight at Night Increases Efficiency by 40%",
      date: "29 - Aug - 2024",
      userImage: "/images/Ellipse.png",
      companyImage: "/images/Rectangle6.png",
      time: "3 min read",
    },
    {
      username: "Micheal Reacher",
      occupation: "Technology",
      content:
        "New Solar Panel Technology that Sells Sunlight at Night Increases Efficiency by 40%",
      date: "29 - Aug - 2024",
      userImage: "/images/Ellipse.png",
      companyImage: "/images/Rectangle6.png",
      time: "3 min read",
    },
   
  ];

  return (
    <div className="bg-white rounded-lg p-5 shadow-sm">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold">Trending Contents</h2>
        <Link href="#" className="text-sm text-blue-500 hover:underline">
          See All
        </Link>
      </div>

      {/* Content List */}
      {data.map((trend, index) => (
        <div
          key={index}
          className={`pb-5 ${index < data.length - 1 ? "border-b border-gray-200 mb-5" : ""}`}
        >
          {/* User Row */}
          <div className="flex justify-between items-start mb-3">
            <div className="flex items-center gap-3">
              <Image
                src={trend.userImage}
                alt="User avatar"
                width={45}
                height={45}
                className="rounded-full"
              />
              <div>
                <p className="font-semibold">{trend.username}</p>
                <p className="text-xs text-gray-500">{trend.occupation}</p>
              </div>
            </div>
            <Button
              className="!bg-[#F3F3F4] !border-none !rounded-full !py-1 !px-4 text-xs hover:brightness-95"
              size="small"
            >
              Save
            </Button>
          </div>

          {/* Content Row */}
          <div className="flex justify-between items-start gap-4">
            <div className="flex-1">
              <p className="text-sm text-gray-800 leading-snug">
                {trend.content}
              </p>
              <div className="flex gap-6 text-xs text-gray-400 mt-3">
                <span>{trend.date}</span>
                <span>{trend.time}</span>
              </div>
            </div>
            <Image
              src={trend.companyImage}
              alt="Company"
              width={100}
              height={80}
              className="rounded object-cover"
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default TrendingContents;
