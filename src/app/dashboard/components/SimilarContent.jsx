"use client";

import Image from "next/image";
import Link from "next/link";
import React from "react";
import { useApp } from "../../context/context";

const SimilarContent = () => {
  const { user } = useApp();

  const initials = `${user?.firstName?.[0] || ""}${
    user?.lastName?.[0] || ""
  }`.toUpperCase();

  const AvatarPlaceholder = ({ text }) => (
    <h1 className="font-semibold text-gray-400">{text}</h1>
  );

  return (
    <div className="bg-white p-3 rounded-md">
      <div className="flex items-center justify-between">
        <h1 className="font-semibold">Similar Content</h1>
        <Link href="#">See all</Link>
      </div>

      <div className="mt-8">
        <div className="mb-4">
          <Image
            src="/images/dog.jpg"
            alt="post image"
            width={400}
            height={45}
            className="w-full object-cover rounded-md"
          />

          <p className="mt-4 text-sm">
            New Solar Panel Technology that Sell Sunlight at Night Increases
            Efficiency by 40%
          </p>

          <div className="flex items-center gap-3 mt-2">
            {user?.avatar ? (
              <div className="w-10 h-10 rounded-full">
                <Image
                  src={user?.avatar}
                  alt="post image"
                  width={45}
                  height={45}
                  className="w-full object-cover rounded-full h-full"
                />
              </div>
            ) : (
              <div className="!bg-[#F6F6F6] rounded-full p-2 w-12 h-12 flex justify-center items-center">
                <AvatarPlaceholder text={initials} />
              </div>
            )}
            <h2 className="font-semibold text-sm">Alex jumbo</h2>
            <Image
              src="/images/dot.png"
              alt="post image"
              width={3}
              height={3}
            />
            <p className="text-sm text-gray-400">29 - Aug - 2024</p>
          </div>
        </div>
        <div className="mb-4">
          <Image
            src="/images/dog.jpg"
            alt="post image"
            width={400}
            height={45}
            className="w-full object-cover rounded-md"
          />

          <p className="mt-4 text-sm">
            New Solar Panel Technology that Sell Sunlight at Night Increases
            Efficiency by 40%
          </p>

          <div className="flex items-center gap-3 mt-2">
            {user?.avatar ? (
              <div className="w-10 h-10 rounded-full">
                <Image
                  src={user?.avatar}
                  alt="post image"
                  width={45}
                  height={45}
                  className="w-full object-cover rounded-full h-full"
                />
              </div>
            ) : (
              <div className="!bg-[#F6F6F6] rounded-full p-2 w-12 h-12 flex justify-center items-center">
                <AvatarPlaceholder text={initials} />
              </div>
            )}
            <h2 className="font-semibold text-sm">Alex jumbo</h2>
            <Image
              src="/images/dot.png"
              alt="post image"
              width={3}
              height={3}
            />
            <p className="text-sm text-gray-400">29 - Aug - 2024</p>
          </div>
        </div>
        <div className="mb-4">
          <Image
            src="/images/dog.jpg"
            alt="post image"
            width={400}
            height={45}
            className="w-full object-cover rounded-md"
          />

          <p className="mt-4 text-sm">
            New Solar Panel Technology that Sell Sunlight at Night Increases
            Efficiency by 40%
          </p>

          <div className="flex items-center gap-3 mt-2">
            {user?.avatar ? (
              <div className="w-10 h-10 rounded-full">
                <Image
                  src={user?.avatar}
                  alt="post image"
                  width={45}
                  height={45}
                  className="w-full object-cover rounded-full h-full"
                />
              </div>
            ) : (
              <div className="!bg-[#F6F6F6] rounded-full p-2 w-12 h-12 flex justify-center items-center">
                <AvatarPlaceholder text={initials} />
              </div>
            )}
            <h2 className="font-semibold text-sm">Alex jumbo</h2>
            <Image
              src="/images/dot.png"
              alt="post image"
              width={3}
              height={3}
            />
            <p className="text-sm text-gray-400">29 - Aug - 2024</p>
          </div>
        </div>
        <div className="mb-4">
          <Image
            src="/images/dog.jpg"
            alt="post image"
            width={400}
            height={45}
            className="w-full object-cover rounded-md"
          />

          <p className="mt-4 text-sm">
            New Solar Panel Technology that Sell Sunlight at Night Increases
            Efficiency by 40%
          </p>

          <div className="flex items-center gap-3 mt-2">
            {user?.avatar ? (
              <div className="w-10 h-10 rounded-full">
                <Image
                  src={user?.avatar}
                  alt="post image"
                  width={45}
                  height={45}
                  className="w-full object-cover rounded-full h-full"
                />
              </div>
            ) : (
              <div className="!bg-[#F6F6F6] rounded-full p-2 w-12 h-12 flex justify-center items-center">
                <AvatarPlaceholder text={initials} />
              </div>
            )}
            <h2 className="font-semibold text-sm">Alex jumbo</h2>
            <Image
              src="/images/dot.png"
              alt="post image"
              width={3}
              height={3}
            />
            <p className="text-sm text-gray-400">29 - Aug - 2024</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimilarContent;
