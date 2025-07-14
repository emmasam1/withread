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
  const { API_BASE_URL, setLoading, loading, token, toggleFollowUser } = useApp();
  const [posts, setPosts] = useState([]);
  const [totalPages, setTotalPages] = useState(1);

  const searchParams = useSearchParams();
  const router = useRouter();
  const currentPage = parseInt(searchParams.get("page") || "1");

  useEffect(() => {
    if (!token || !API_BASE_URL) return;

    const fetchPosts = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `${API_BASE_URL}/api/post/user/suggested?page=${currentPage}&limit=6`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setPosts(res.data?.posts || []);
        setTotalPages(res.data?.totalPages || 1);
        console.log(res)
      } catch (error) {
        toast.error("Failed to fetch content.");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [currentPage, token, API_BASE_URL]);

  const handlePageChange = (newPage) => {
    router.push(`?page=${newPage}`);
  };

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="p-3">
      <Link
        href="/dashboard/discover"
        className="flex gap-2 items-center !text-black text-xs w-20"
      >
        <GoArrowLeft size="1rem" />
        Back
      </Link>

      <div className="bg-white mt-5 p-3 rounded-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-semibold">Recommended Contents</h2>
        </div>

        {/* Content Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => (
                <Skeleton
                  active
                  key={i}
                  className="!h-[340px] rounded-lg"
                  paragraph={{ rows: 4 }}
                />
              ))
            : posts.map((post) => {
                const initials = `${post?.author?.firstName?.[0] || ""}${
                  post?.author?.lastName?.[0] || ""
                }`.toUpperCase();

                const postImage =
                  post.images && post.images.length > 0
                    ? post.images[0]
                    : "/images/image1.png";

                return (
                  <Link
                    key={post._id}
                    href={`/dashboard/discover/recommended-content/${post._id}`}
                  >
                    <Card
                      hoverable
                      className="flex flex-col justify-between h-full"
                      cover={
                        <img
                          alt="post image"
                          src={postImage}
                          className="h-40 w-full object-cover rounded-t-lg"
                        />
                      }
                    >
                      <Meta
                        title={post.title}
                        description={post?.content?.slice(0, 120) + "..."}
                      />

                      <div className="flex justify-between items-center mt-4">
                        <div className="flex items-center gap-3 justify-between">
                          <div className="rounded-full w-10 h-10">
                            {post?.author?.avatar ? (
                              <Image
                                src={post.author.avatar}
                                alt={post.author.firstName}
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
                          <div className="flex items-center gap-1 text-xs">
                            <span className="font-semibold capitalize">
                              {post?.author?.firstName} {post?.author?.lastName}
                            </span>
                            <Image src="/images/dot.png" alt="dot" width={3} height={3} />
                            <span className="text-gray-300 text-xs">Follow</span>
                          </div>
                        </div>
                          <span className="text-gray-400">
                            {formatDate(post.publishedAt)}
                          </span>
                      </div>
                    </Card>
                  </Link>
                );
              })}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
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
        )}
      </div>
    </div>
  );
}

// Wrap with Suspense for useSearchParams support
const Page = () => {
  return (
    <Suspense fallback={<div className="p-4">Loading...</div>}>
      <CommunityPageContent />
    </Suspense>
  );
};

export default Page;
