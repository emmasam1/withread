"use client";
import { Button, Input, Divider } from "antd";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { useApp } from "../../context/context";

const page = () => {
  const { isLoggedIn, API_BASE_URL, user, setUser, logout, loading } = useApp();

  const initials = `${user?.firstName?.[0] || ""}${
    user?.lastName?.[0] || ""
  }`.toUpperCase();

  return (
    <div className="p-3">
      <div className="grid grid-cols-[2fr_450px] ">
        <div className="rounded-lg grid grid-cols">
          <div className="bg-white p-3 rounded-md">
            <div className="h-70 relative">
              <Image
                src="/images/community.png"
                alt="image"
                width={1000}
                height={500}
                className="w-full h-full object-cover rounded-md"
              />

              <div className="absolute bg-red-400 h-25 w-25 rounded-full left-5 -bottom-12">
                <Image
                  src="/images/roundImg.png"
                  alt="image"
                  width={1000}
                  height={500}
                  className="w-full h-full object-cover rounded-md"
                />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="mt-15 ml-4">
                <h2 className="font-semibold">UI/UX Design Community</h2>
                <p className="mt-2 text-sm">Public Community • 20.5K Members</p>
              </div>
              <div>
                <div className="flex items-center gap-2 justify-end">
                  <Button
                    className="!bg-[#F3F3F4] !text-black !border-0 !rounded-full !py-4 !px-4 flex mr-3"
                    // onClick={showModal}
                  >
                    Invite
                  </Button>
                  <div className="bg-[#F3F3F4] rounded-full p-2">
                    <Image
                      src="/images/sms.png"
                      width={20}
                      height={20}
                      alt="icon"
                    />
                  </div>
                  <div className="bg-[#F3F3F4] rounded-full p-2">
                    <Image
                      src="/images/notification-bing.png"
                      width={20}
                      height={20}
                      alt="icon"
                    />
                  </div>
                </div>
                <div className="gap-3 w-75 flex justify-between mt-4">
                  <div className="flex">
                    <Image
                      src="/images/Ellipse.png"
                      //   src={user?.avatar} // fallback in case avatar is null
                      alt="user image"
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                    <Image
                      src="/images/Ellipse.png"
                      //   src={user?.avatar} // fallback in case avatar is null
                      alt="user image"
                      width={40}
                      height={40}
                      className="rounded-full relative -ml-5"
                    />
                    <Image
                      src="/images/Ellipse.png"
                      //   src={user?.avatar} // fallback in case avatar is null
                      alt="user image"
                      width={40}
                      height={40}
                      className="rounded-full relative -ml-5"
                    />
                  </div>
                  <div className="w-52">
                    <p className="text-sm">
                      Mario, Jackson, Allison and 54 others followers are
                      members
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-3 rounded-lg p-3 mb-6">
              <div className="flex items-center gap-5">
                {user?.avatar ? (
                  <Image
                    src={user?.avatar} // fallback in case avatar is null
                    alt="user image"
                    width={45}
                    height={45}
                    className="rounded-full"
                  />
                ) : (
                  <div className="!bg-[#F6F6F6]  rounded-full p-2 w-12 h-12 flex justify-center items-center">
                    <h1 className="font-semibold text-gray-400">{initials}</h1>
                  </div>
                )}
                <Link href="/dashboard/newpost" className="w-full">
                  <Input
                    placeholder="Got something on your mind? Spill it out"
                    className="!bg-[#F6F6F6] !border-none !outline-none !rounded-full !px-4 !py-3 focus:ring-0 focus:outline-none"
                    readOnly
                  />
                </Link>
              </div>
              <Divider className="!bg-[#f6f6f6b3]" />
              <div className="flex items-center justify-between">
                <div className="flex gap-10 items-center">
                  <Link
                    href="/dashboard/newpost"
                    className="flex tems-center !text-black justify-center gap-2 text-sm"
                  >
                    <Image
                      src="/images/photo.png"
                      alt="icon"
                      width={30}
                      height={30}
                      className="-mt-1"
                    />
                    Photo/Video
                  </Link>
                  <Link
                    href="/dashboard/newpost"
                    className="flex tems-center !text-black justify-center gap-2 text-sm"
                  >
                    <Image
                      src="/images/content.png"
                      alt="icon"
                      width={30}
                      height={30}
                      className="-mt-1"
                    />
                    Content
                  </Link>
                </div>
                <Button className="!bg-black !text-[#D9D9D9] !border-0 !rounded-full !py-5 !px-8">
                  <Link href="/dashboard/newpost">Post</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
        <div className="overflow-auto fixed right-10 w-[450px] h-screen pb-23.5"></div>
      </div>
    </div>
  );
};

export default page;
