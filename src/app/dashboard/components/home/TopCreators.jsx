"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";

const TopCreators = () => {
  const topCreators = [
    {
      name: "Jameson Michelle",
      title: "Web3 Developer",
      avatar: "/images/Rectangle6.png",
      verified: true,
    },
    {
      name: "Kounde Harry",
      title: "Cybersecurity",
      avatar: "/images/Rectangle6.png",
      verified: true,
    },
    {
      name: "Damson Lamal",
      title: "Data Analyst",
      avatar: "/images/Rectangle6.png",
      verified: true,
    },
  ];

  return (
    <div className="bg-white rounded-lg p-4 mb-5 shadow">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-lg font-semibold">Top Creators</h1>
        <Link href="#" className="text-sm text-blue-500 hover:underline">
          See All
        </Link>
      </div>

      {/* Creator Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {topCreators.map((creator, index) => (
          <div
            key={index}
            className="flex flex-col items-center p-3 rounded-lg"
          >
            <Image
              src={creator.avatar}
              alt={creator.name}
              width={120}
              height={100}
              className="object-cover rounded mb-3"
            />
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 font-semibold text-sm text-gray-800">
                <h2 className="text-xs">{creator.name}</h2>
                {creator.verified && (
                  <Image
                    src="/images/verify.png"
                    alt="Verified"
                    width={14}
                    height={14}
                  />
                )}
              </div>
              <p className="text-xs text-gray-500">{creator.title}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopCreators;
