"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useApp } from "@/app/context/context";
import axios from "axios";
import { Skeleton } from "antd";

const TopCreators = () => {
  const { API_BASE_URL, setLoading, loading } = useApp();
  const [creators, setCreators] = useState([]);

  const getTopCreators = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${API_BASE_URL}/api/user/top-creators?page=1&limit=3`
      );
      setCreators(res?.data?.data || []);
    } catch (error) {
      console.error("Error fetching top creators:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getTopCreators();
  }, []);

  return (
    <div className="bg-white rounded-lg p-4 mb-5 shadow">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-lg font-semibold">Top Creators</h1>
        <Link
          href="/dashboard/top-creators"
          className="text-sm text-blue-500 hover:underline"
        >
          See All
        </Link>
      </div>

      {/* Creator Grid */}
      <div className="flex overflow-x-auto gap-3 sm:grid sm:grid-cols-2 md:grid-cols-3 justify-center">
        {loading
          ? // Skeleton Loader
            Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="flex flex-col items-center min-w-[100px] sm:min-w-0 p-2 rounded-lg"
              >
                <Skeleton.Avatar
                  active
                  size={64}
                  shape="circle"
                  className="mb-2"
                />
                <Skeleton.Input
                  active
                  size="small"
                  style={{ width: 60, height: 14 }}
                />
              </div>
            ))
          : // Render creators
            creators.map((creator) => (
              <div
                key={creator?._id}
                className="flex flex-col items-center min-w-[100px] sm:min-w-0 p-2 rounded-lg"
              >
                <Image
                  src={
                    creator?.topPost?.Image?.[0] ||
                    "/images/placeholder-image.png"
                  }
                  alt={`${creator?.firstName || ""} ${
                    creator?.lastName || ""
                  }`}
                  width={100}
                  height={60}
                  className="object-cover rounded mb-2"
                />
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 text-[10px] font-medium text-gray-800">
                    <h2 className="truncate max-w-[60px]">
                      {creator?.firstName} {creator?.lastName}
                    </h2>
                    {creator?.verified && (
                      <Image
                        src="/images/verify.png"
                        alt="Verified"
                        width={10}
                        height={10}
                      />
                    )}
                  </div>
                </div>
              </div>
            ))}
      </div>
    </div>
  );
};

export default TopCreators;
