"use client";
import React, { useState, useEffect } from "react";
import { GoArrowLeft } from "react-icons/go";
import Link from "next/link";
import Image from "next/image";
import { Button, Skeleton } from "antd";
import axios from "axios";
import { useApp } from "@/app/context/context";

const Page = () => {
  const { API_BASE_URL, setLoading, loading, user } = useApp();
  const [topCreators, setTopCreators] = useState([]);
  const [followLoading, setFollowLoading] = useState(false)

  // const followUser = async (id) => {
  //   try {
  //     setFollowLoading(true)
  //     const res = await axios.post(`${API_BASE_URL}/api/user/follow/${id}`)
  //     messageApi.success(res?.data?.message)
  //   } catch (error) {
  //     console.log(error)
  //   }finally{
  //     setFollowLoading(false)
  //   }
    
  // }

  const getTopCreators = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE_URL}/api/user/top-creators`);
      setTopCreators(res?.data?.data);
      // console.log(res?.data)
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getTopCreators();
  }, []);

  return (
    <div className="p-4">
      <Link
        href="/dashboard"
        className="flex items-center gap-2 !text-black text-sm w-25"
      >
        <GoArrowLeft />
        Main Feed
      </Link>

      <div className="p-3 rounded-lg bg-white mt-4">
        <h1 className="font-semibold">Top Creators</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-4">
          {loading
            ? // Skeleton Loader
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="bg-white flex items-center gap-4">
                  <Skeleton.Image
                    active
                    style={{ width: 160, height: 160, borderRadius: 8 }}
                  />
                  <div className="flex-1">
                    <Skeleton
                      active
                      paragraph={{ rows: 3 }}
                      title={{ width: "60%" }}
                    />
                  </div>
                </div>
              ))
            : // Actual Data
              topCreators.map((person) => (
                <div
                  // key={person?._id}
                  className="bg-white flex items-center gap-4 rounded-lg"
                >
                  <div className="h-40 w-40 rounded-lg overflow-hidden">
                    <Image
                      src={
                        person?.author?.avatar ||
                        "/images/user-placeholder.png"
                      }
                      alt="user image"
                      height={160}
                      width={160}
                      className="shadow object-cover w-full h-full"
                    />
                  </div>
                  <div className="w-full">
                    <div className="flex justify-between">
                      <div>
                        <h1 className="font-semibold capitalize">
                          {person.firstName} {person.lastName}
                        </h1>
                        <span className="mt-2 text-[#333333E5] text-[.8rem]">
                          {/* Role if available */}
                        </span>
                        <div className="flex items-center gap-3 mt-2 text-[#333333a4] text-[.8rem]">
                          <span>{person?.totalPosts} Contents</span>
                          <Image
                            src="/images/dot.png"
                            alt="dot"
                            height={4}
                            width={4}
                          />
                          <span>800k Followers</span>
                        </div>
                      </div>
                    
                        <Button loading={followLoading} onClick={() => followUser(person?.authorId)} className="!bg-black !border-none !rounded-full hover:!border-none !text-white p-3">
                          Follow
                        </Button>
                   
                    </div>
                    <p className="mt-2 text-[.8rem] text-[#333333E5]">
                      {person?.topPost?.content?.slice(0, 170)}
                    </p>
                  </div>
                </div>
              ))}
        </div>
      </div>
    </div>
  );
};

export default Page;
