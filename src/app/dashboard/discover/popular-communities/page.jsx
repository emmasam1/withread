"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import Image from "next/image";
import { GoArrowLeft } from "react-icons/go";
import { AnimatePresence, motion } from "framer-motion";
import { useApp } from "@/app/context/context";
import { Button, Skeleton } from "antd";
import { toast } from "react-toastify";

const Page = () => {
  const [communities, setCommunities] = useState([]);
  const [isGridView, setIsGridView] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(6);
  const [joiningId, setJoiningId] = useState(null);
  const [joinedIds, setJoinedIds] = useState([]);
  // const [communityId, setCommunityId] = useState(null);

  const { API_BASE_URL, setLoading, loading, token, user, setUser } = useApp();

  const formatMemberCount = (num = 0) => {
    if (typeof num !== "number") return "0";
    if (num >= 1_000_000)
      return (num / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
    if (num >= 1_000) return (num / 1_000).toFixed(1).replace(/\.0$/, "") + "K";
    return num.toString();
  };

  useEffect(() => {
    if (!token || !API_BASE_URL) return;

    const fetchCommunities = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${API_BASE_URL}/api/community/suggestions`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCommunities(res.data?.communities || []);
        const hasImage = res.data?.communities?.some((item) => item.banner || item.image);
        setPerPage(hasImage ? 6 : 9);
      } catch (err) {
        console.error("Error fetching communities", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCommunities();
  }, [token, API_BASE_URL]);

  const joinCommunity = async (id) => {
    if (!id) return;
    try {
      setJoiningId(id);
      const res = await axios.post(
        `${API_BASE_URL}/api/community/${id}/join`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (res.status === 200 || res.data.success) {
        toast.success(res.data.message || "Community joined!");
        const updatedUser = {
          ...user,
          communities: [...(user?.communities || []), id],
        };
        setUser(updatedUser);
        sessionStorage.setItem("user", JSON.stringify(updatedUser));
        setJoinedIds((prev) => [...prev, id]);
      } else {
        toast.error("Failed to join community");
      }
    } catch (error) {
      console.error("Join community error:", error);
      toast.error(error?.response?.data?.message || "Failed to join community");
    } finally {
      setJoiningId(null);
    }
  };

  const totalItems = communities.length;
  const totalPages = Math.ceil(totalItems / perPage);
  const startIndex = (currentPage - 1) * perPage;
  const paginatedData = communities.slice(startIndex, startIndex + perPage);

  const variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -30 },
  };

  return (
    <div className="p-4">
      <Link
        href="/dashboard/discover"
        className="flex items-center gap-2 !text-black text-sm w-20"
      >
        <GoArrowLeft />
        Back
      </Link>

      <div className="mt-4 bg-white rounded-lg p-3">
        <div className="flex justify-between items-center">
          <h1 className="text-lg font-semibold mb-4">Popular Communities</h1>
          <Image
            src={isGridView ? "/images/row-vertical.png" : "/images/element-4.png"}
            alt="Toggle view"
            height={20}
            width={20}
            onClick={() => setIsGridView(!isGridView)}
            className="cursor-pointer"
          />
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {[...Array(perPage)].map((_, idx) => (
              <Skeleton active key={idx} paragraph={{ rows: 3 }} />
            ))}
          </div>
        ) : (
          <>
            <AnimatePresence mode="wait">
              {isGridView ? (
                <motion.div
                  key="grid"
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  variants={variants}
                  className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5"
                >
                  {paginatedData.map((item, index) => (
                    <div key={item._id || index}>
                    <Link href={`/dashboard/discover/popular-communities/${item._id}`}>
                      {item.banner || item.image ? (
                        <Image
                          src={item.banner}
                          alt="banner"
                          width={500}
                          height={250}
                          className="w-full h-40 object-cover rounded-md"
                        />
                      ) : (
                        <Image
                          src="/images/no-image.jpg"
                          alt="banner"
                          width={500}
                          height={250}
                          className="w-full h-40 object-cover rounded-md"
                        />
                      )}
                      <p className="mt-2 text-sm text-black">
                        {item?.about
                          ? item.about.length > 100
                            ? item.about.slice(0, 100) + "..."
                            : item.about
                          : ""}
                      </p>
                      <div className="mt-3 flex items-center justify-between">
                        <div className="flex gap-2 items-center">
                          <div className="w-10 h-10 rounded-full">
                            <Image
                              src={item.avatar}
                              alt="avatar"
                              width={35}
                              height={35}
                              className="rounded-full object-cover w-full h-full"
                            />
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-black">{item.name}</p>
                            <p className="text-xs text-gray-500">
                              {formatMemberCount(item?.members?.length)} Members
                            </p>
                          </div>
                        </div>
                        <Button
                          onClick={() => {
                            // setCommunityId(item._id); // Set current ID
                            joinCommunity(item?._id); // Join using it
                          }}
                          loading={joiningId === item._id}
                          disabled={joinedIds.includes(item._id)}
                          className={`!rounded-full px-4 py-1 text-xs transition-all duration-300 hover:!border-none ${
                            joinedIds.includes(item._id)
                              ? "!bg-[#E4E4E7] !text-gray-500 cursor-not-allowed"
                              : "!bg-black !text-white hover:!bg-gray-800"
                          }`}
                        >
                          {joinedIds.includes(item._id) ? "Member" : "Join"}
                        </Button>
                      </div>
                    </Link>
                    </div>
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  key="list"
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  variants={variants}
                  className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5"
                >
                  {paginatedData.map((item, index) => (
                    <div
                      key={item._id || index}
                      className="bg-gray-100 p-4 rounded-lg"
                    >
                      <div className="flex justify-between items-center">
                        <div className="flex gap-2 items-center">
                          <div className="w-10 h-10 rounded-full">
                            <Image
                              src={item.avatar}
                              alt="avatar"
                              width={35}
                              height={35}
                              className="rounded-full object-cover w-full h-full"
                            />
                          </div>
                          <div>
                            <p className="text-xs font-semibold">{item.name}</p>
                            <p className="text-xs text-gray-500">
                              {formatMemberCount(item?.members?.length)} Members
                            </p>
                          </div>
                        </div>
                        <Button
                          onClick={() => {
                            // setCommunityId(item._id); // Set current ID
                            joinCommunity(item?._id); // Join using it
                          }}
                          loading={joiningId === item._id}
                          disabled={joinedIds.includes(item._id)}
                          className={`!rounded-full px-4 py-1 text-xs transition-all duration-300 hover:!border-none ${
                            joinedIds.includes(item._id)
                              ? "!bg-[#E4E4E7] !text-gray-500 cursor-not-allowed"
                              : "!bg-black !text-white hover:!bg-gray-800"
                          }`}
                        >
                          {joinedIds.includes(item._id) ? "Member" : "Join"}
                        </Button>
                      </div>
                      <p className="mt-3 text-sm">
                       {item?.about
                          ? item.about.length > 100
                            ? item.about.slice(0, 100) + "..."
                            : item.about
                          : ""}
                      </p>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            {totalPages > 1 && (
              <div className="mt-6 flex justify-center items-center gap-3">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 text-sm rounded border disabled:opacity-40"
                >
                  Prev
                </button>
                <span className="text-sm font-medium">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 text-sm rounded border disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Page;
