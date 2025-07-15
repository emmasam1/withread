"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { GoArrowLeft } from "react-icons/go";
import { useApp } from "@/app/context/context";
import axios from "axios";
import { Button, Skeleton, Pagination } from "antd";

const Page = () => {
  const { API_BASE_URL, loading, setLoading } = useApp();
  const [post, setPost] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [totalPosts, setTotalPosts] = useState(0);
  const [skeletonLoading, setSkeletonLoading] = useState(true);

  const fetchTrendingPosts = async (page = 1) => {
    try {
      setSkeletonLoading(true);
      const res = await axios.get(
        `${API_BASE_URL}/api/post/trending?page=${page}&limit=6`
      );
      setPost(res.data.posts);
      setTotalPosts(res.data.totalPosts || 0);
    } catch (error) {
      console.error(error);
    } finally {
      setSkeletonLoading(false);
    }
  };

  useEffect(() => {
    if (API_BASE_URL) {
      fetchTrendingPosts(pageNumber);
    }
  }, [API_BASE_URL, pageNumber]);

  return (
    <div className="p-3">
      <Link
        href="/dashboard"
        className="flex items-center gap-2 !text-black text-sm w-20"
      >
        <GoArrowLeft />
        Back
      </Link>

      <div className="bg-white rounded-lg mt-4 p-3">
        <h1 className="font-semibold text-lg">Trending Contents</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
          {skeletonLoading
            ? Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} active avatar paragraph={{ rows: 4 }} />
              ))
            : post.map((post) => {
                const createdAt = new Date(post.createdAt).toLocaleDateString(
                  "en-GB",
                  {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  }
                );

                return (
                  <div
                    key={post._id}
                    className="rounded-lg p-3"
                  >
                    <div className="rounded-lg overflow-hidden h-60">
                      <Image
                        src={
                          post.images?.length > 0
                            ? post.images[0]
                            : "/images/no-image.jpg"
                        }
                        alt="Post"
                        width={400}
                        height={300}
                        className="rounded-lg object-cover h-full w-full"
                      />
                    </div>

                    <h1 className="font-normal mt-3 text-sm text-gray-700">
                      {post?.content.slice(0, 120) + "..."}
                    </h1>

                    <div className="flex justify-between items-center mt-3">
                      <div className="flex gap-3">
                        {!post.author.avatar ? (
                          <div className="rounded-full bg-gray-300 h-10 w-10 flex items-center justify-center font-bold capitalize">
                            {post.author.username.charAt(0).toUpperCase()}
                          </div>
                        ) : (
                          <Image
                            src={post.author.avatar}
                            alt="Author Avatar"
                            width={40}
                            height={40}
                            className="rounded-full object-cover h-10 w-10"
                          />
                        )}

                        <div>
                          <p className="text-sm font-medium text-[#333333]">
                            {post.author.username}
                          </p>
                          <p className="text-xs text-gray-400">{createdAt}</p>
                        </div>
                      </div>
                      <div>
                        <Button className="!bg-[#28303D08] !border-0 !rounded-full hover:!text-black">
                          Save for later
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
        </div>

        <div className="flex justify-center mt-6">
          <Pagination
            current={pageNumber}
            pageSize={6}
            total={totalPosts}
            onChange={(page) => setPageNumber(page)}
            showSizeChanger={false}
          />
        </div>
      </div>
    </div>
  );
};

export default Page;
