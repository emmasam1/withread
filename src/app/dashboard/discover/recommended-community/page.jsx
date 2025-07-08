"use client";
import { useApp } from "@/app/context/context";
import Link from "next/link";
import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { GoArrowLeft } from "react-icons/go";
import { Skeleton, Card, Button } from "antd";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import Image from "next/image";

const { Meta } = Card;

function CommunityPageContent() {
  const { API_BASE_URL, setLoading, loading, token } = useApp();
  const [communities, setCommunities] = useState([]);
  const [totalPages, setTotalPages] = useState(1);

  const searchParams = useSearchParams();
  const router = useRouter();
  const currentPage = parseInt(searchParams.get("page") || "1");

  useEffect(() => {
    if (!token) return;

    const fetchCommunities = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `${API_BASE_URL}/api/community/suggestions?page=${currentPage}&limit=6`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setCommunities(res.data?.communities || []);
        setTotalPages(res.data?.totalPages || 1);
      } catch (error) {
        toast.error("Failed to fetch communities");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchCommunities();
  }, [currentPage, token, API_BASE_URL]);

  const handlePageChange = (newPage) => {
    router.push(`?page=${newPage}`);
  };

    const formatMemberCount = (num) => {
    if (num >= 1_000_000)
      return (num / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
    if (num >= 1_000) return (num / 1_000).toFixed(1).replace(/\.0$/, "") + "K";
    return num.toString();
  };

  return (
    <div className="p-3">
      <Link href="/dashboard/discover" className="flex gap-2 items-center !text-black">
        <GoArrowLeft size="1rem" />
        Back
      </Link>

      <div className="bg-white mt-5 p-3">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-semibold">Popular Communities</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => (
                <Skeleton active key={i} className="h-[340px]" />
              ))
            : communities.map((item) => {
                const initials = `${item?.creator?.firstName?.[0] || ""}${
                  item?.creator?.lastName?.[0] || ""
                }`.toUpperCase();

                return (
                  <Link
                    key={item._id}
                    href={`/dashboard/discover/recommended-community/${item._id}`}
                  >
                    <div className="h-full flex flex-col">
                      <Card
                        hoverable
                        className="flex flex-col justify-between h-full"
                        cover={
                          <img
                            alt={item.name || "Community"}
                            src={item.avatar}
                            className="h-40 w-full object-cover"
                          />
                        }
                      >
                        <Meta
                          description={`Join the thousands of aspiring members in ${item.name}!`}
                        />
                        <div className="flex justify-between items-center mt-4">
                          <div className="flex items-center gap-4">
                            <div className="rounded-full w-10 h-10">
                              {item?.creator?.avatar ? (
                                <Image
                                  src={item.creator.avatar}
                                  alt={item.creator.firstName}
                                  width={40}
                                  height={40}
                                  className="h-full w-full rounded-full object-cover"
                                />
                              ) : (
                                <div className="bg-[#F6F6F6] rounded-full w-10 h-10 flex justify-center items-center">
                                  <span className="font-semibold text-gray-400">
                                    {initials}
                                  </span>
                                </div>
                              )}
                            </div>
                            <div>
                              <h3 className="font-semibold text-[.7rem]">{item.name}</h3>
                              <p className="text-xs">{formatMemberCount(item?.members?.length) || 0} Members</p>
                            </div>
                          </div>
                          <Button className="!bg-black !text-white !rounded-full !border-0">
                            Join
                          </Button>
                        </div>
                      </Card>
                    </div>
                  </Link>
                );
              })}
        </div>

        {/* Pagination Controls */}
        <div className="flex justify-center items-center gap-4 mt-6">
          <Button
            disabled={currentPage === 1}
            onClick={() => handlePageChange(currentPage - 1)}
          >
            Previous
          </Button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <Button
            disabled={currentPage >= totalPages}
            onClick={() => handlePageChange(currentPage + 1)}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}

// Suspense wrapper to fix useSearchParams warning
const Page = () => {
  return (
    <Suspense fallback={<div className="p-4">Loading...</div>}>
      <CommunityPageContent />
    </Suspense>
  );
};

export default Page;
