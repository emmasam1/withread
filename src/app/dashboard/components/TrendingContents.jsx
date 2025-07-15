"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Button, Skeleton } from "antd";
import Image from "next/image";
import { useApp } from "@/app/context/context";
import axios from "axios";

// Avatar placeholder component
const AvatarPlaceholder = ({ text }) => {
  return <span className="text-sm font-semibold text-gray-600">{text}</span>;
};

const TrendingContents = () => {
  const { API_BASE_URL, loading, setLoading } = useApp();
  const [trending, setTrending] = useState([]);

 useEffect(() => {
  const getTrending = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${API_BASE_URL}/api/post/trending?page=1&limit=4`
      );

      setTrending(res.data.posts);
      // console.log(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  getTrending();
}, [API_BASE_URL]);


  return (
    <div className="bg-white rounded-lg p-5 shadow-sm">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold">Trending Contents</h2>
        <Link href="/dashboard/trending-content" className="text-sm text-blue-500 hover:underline">
          See All
        </Link>
      </div>

      {/* Skeleton loader */}
      {loading
        ? Array(4)
            .fill(null)
            .map((_, index) => (
              <div key={index} className="mb-6 border-b border-gray-200 pb-5">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex gap-3 items-center">
                    <Skeleton.Avatar active size={45} shape="circle" />
                    <div>
                      <Skeleton.Input
                        active
                        size="small"
                        style={{ width: 100 }}
                      />
                      <Skeleton.Input
                        active
                        size="small"
                        style={{ width: 60, marginTop: 4 }}
                      />
                    </div>
                  </div>
                  <Skeleton.Button active size="small" style={{ width: 60 }} />
                </div>
                <Skeleton.Input active style={{ width: "100%", height: 20 }} />
                <div className="flex justify-between mt-4">
                  <Skeleton.Input
                    active
                    size="small"
                    style={{ width: "30%" }}
                  />
                  <Skeleton.Image style={{ width: 100, height: 80 }} active />
                </div>
              </div>
            ))
        : trending.map((trend, index) => {
            const initials = `${trend?.author?.username?.[0] || ""}${
              trend?.author?.username?.[1] || ""
            }`.toUpperCase();

            return (
              <div
                key={trend._id}
                className={`pb-5 ${
                  index < trending.length - 1
                    ? "border-b border-gray-200 mb-5"
                    : ""
                }`}
              >
                {/* User Row */}
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-3">
                    {trend.author?.avatar ? (
                      <Image
                        src={trend.author.avatar}
                        alt="User avatar"
                        width={45}
                        height={45}
                        className="rounded-full object-cover"
                      />
                    ) : (
                      <div className="bg-[#F6F6F6] rounded-full w-12 h-12 flex justify-center items-center">
                        <AvatarPlaceholder text={initials} />
                      </div>
                    )}
                    <div>
                      <p className="font-semibold">
                        {trend.author?.username || "Unknown"}
                      </p>
                      <p className="text-xs text-gray-500">Content Creator</p>
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
                      {trend.title}
                    </p>
                    <div className="flex gap-6 text-xs text-gray-400 mt-3">
                      <span>
                        {new Date(trend.createdAt).toLocaleDateString()}
                      </span>
                      <span>{trend.readTime || "3 min read"}</span>
                    </div>
                  </div>
                  <Image
                    src={
                      trend.images && trend.images.length > 0
                        ? trend.images[0]
                        : "/images/no-image.jpg"
                    }
                    alt="Post"
                    width={100}
                    height={80}
                    className="rounded-lg object-cover h-full"
                  />
                </div>
              </div>
            );
          })}
    </div>
  );
};

export default TrendingContents;
