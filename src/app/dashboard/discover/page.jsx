"use client";
import React, { useEffect, useState } from "react";
import { Button, Dropdown, Space, Skeleton } from "antd";
import axios from "axios";
import { useApp } from "@/app/context/context";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

const items = [
  { label: "Not interested in this post", key: "0" },
  { label: "Remove this post from my feed", key: "1" },
  { type: "divider" },
  { label: "Mute", key: "2" },
  { label: "Block", key: "3" },
  { label: "Report", key: "4" },
  { label: "Show fewer posts like this", key: "5" },
];

const Page = () => {
  const { API_BASE_URL, setLoading, loading, token, user, setUser } = useApp();
  const [interestsList, setInterestsList] = useState([]);
  const [selectedInterestId, setSelectedInterestId] = useState(null);
  const [communityPosts, setCommunityPosts] = useState([]);
  const [isLoadingInterests, setIsLoadingInterests] = useState(true);
  const [communities, setCommunities] = useState([]);
  const [singleCommunity, setSingleCommunities] = useState([]);
  const [loadingCommunities, setLoadingCommunities] = useState(true);
  const [joinLoadingMap, setJoinLoadingMap] = useState({});
  const router = useRouter();

  useEffect(() => {
    const fetchInterests = async () => {
      setIsLoadingInterests(true);
      try {
        const res = await axios.get(`${API_BASE_URL}/api/interest/interests`);
        const categories = res.data.categories || [];
        setInterestsList(categories);
        if (categories.length > 0) {
          const firstId = categories[0]._id;
          setSelectedInterestId(firstId);
          fetchCommunityPosts(firstId);
        }
      } catch (error) {
        console.error("Failed to fetch interests:", error);
        toast.error("Failed to load interests.");
      } finally {
        setIsLoadingInterests(false);
      }
    };

    fetchInterests();
  }, [API_BASE_URL]);

  const fetchCommunityPosts = async (interestId) => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${API_BASE_URL}/api/post/user/post-by-interest?interestId=${interestId}`
      );
      setCommunityPosts(res.data.posts || []);
    } catch (error) {
      console.error("Error fetching community posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (interestId) => {
    setSelectedInterestId(interestId);
    fetchCommunityPosts(interestId);
  };

  const AvatarPlaceholder = ({ text }) => (
    <h1 className="font-semibold text-gray-400">{text}</h1>
  );

  const dummyPosts = [
    {
      _id: "1",
      title: "Getting Started with React",
      content:
        "React is a powerful JavaScript library for building user interfaces. In this post, we'll cover the basics and how to get started...",
      createdAt: new Date().toISOString(),
      isAnonymous: false,
      author: {
        firstName: "John",
        lastName: "Doe",
        avatar: null,
      },
      images: ["/images/banner.jpg"],
      likes: [],
      comments: [1, 2, 3],
      collaborators: [],
    },
    {
      _id: "2",
      title: "Mastering Tailwind CSS",
      content:
        "Tailwind CSS is a utility-first framework that enables fast and responsive design. Here's why you should start using it today...",
      createdAt: new Date().toISOString(),
      isAnonymous: true,
      author: {},
      images: [],
      likes: ["user123"],
      comments: [],
      collaborators: [],
    },
  ];

  useEffect(() => {
    const getCommunities = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/community`);
        setCommunities(res.data.communities || []);
        const justOne = res.data?.communities?.slice(0, 1);
        setSingleCommunities(justOne);
      } catch (error) {
        console.error("Error fetching communities:", error);
        toast.error("Failed to load communities");
      } finally {
        setLoadingCommunities(false);
      }
    };

    getCommunities();
  }, [API_BASE_URL]);

  const formatMemberCount = (num) => {
    if (num >= 1_000_000)
      return (num / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
    if (num >= 1_000) return (num / 1_000).toFixed(1).replace(/\.0$/, "") + "K";
    return num.toString();
  };

  // const joinCommunity = async (id) => {
  //   if (!user) {
  //     router.push("/signin");
  //     return;
  //   }

  //   const url = `${API_BASE_URL}/api/community/${id}/join`;

  //   try {
  //     setJoinLoading(true);

  //     const res = await axios.post(
  //       url,
  //       {},
  //       {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //           "Content-Type": "application/json",
  //         },
  //       }
  //     );

  //     toast.success(res.data.message || "Community joined!");

  //     // ✅ Update user context locally
  //     setUser((prevUser) => ({
  //       ...prevUser,
  //       communities: [...(prevUser?.communities || []), id],
  //     }));
  //   } catch (error) {
  //     toast.error("Failed to join community");
  //     console.error(error);
  //   } finally {
  //     setJoinLoading(false);
  //   }
  // };

  const joinCommunity = async (id) => {
    if (!user) {
      router.push("/signin");
      return;
    }

    setJoinLoadingMap((prev) => ({ ...prev, [id]: true }));

    try {
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

      toast.success(res.data.message || "Community joined!");

      // Update user context
      const updatedUser = {
        ...user,
        communities: [...(user?.communities || []), id],
      };
      setUser(updatedUser);
      sessionStorage.setItem("user", JSON.stringify(updatedUser));
    } catch (error) {
      toast.error("Failed to join community");
      console.error(error);
    } finally {
      setJoinLoadingMap((prev) => ({ ...prev, [id]: false }));
    }
  };

  return (
    <div className="p-3">
      <div className="grid grid-cols-1 md:grid-cols-[2fr_400px] gap-7 p-4">
        <div className="rounded-lg grid grid-cols">
          <div className="bg-white p-3 rounded-md w-full">
            <h1 className="font-semibold">Best Match For You</h1>
            {isLoadingInterests ? (
              <div className="flex flex-wrap gap-3 mt-5 max-w-2xl">
                {[...Array(10)].map((_, index) => (
                  <div
                    key={index}
                    className="h-8 w-24 rounded-full bg-gray-200 animate-pulse"
                  ></div>
                ))}
              </div>
            ) : (
              <div className="flex flex-wrap gap-3 mt-5 max-w-2xl">
                {interestsList.map((interest) => (
                  <button
                    key={interest._id}
                    onClick={() => handleSelect(interest._id)}
                    className={`px-5 py-1 rounded-full border text-sm font-medium transition-all cursor-pointer ${
                      selectedInterestId === interest._id
                        ? "bg-black text-white border-black"
                        : "bg-white text-black border-gray-300"
                    }`}
                  >
                    {interest.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          {(loading ? [...Array(2)] : dummyPosts).map((post, index) => {
            if (loading || !post) {
              return (
                <div
                  key={index}
                  className="bg-white p-3 rounded-md w-full mt-5 animate-pulse"
                >
                  <Skeleton active avatar paragraph={{ rows: 4 }} />
                </div>
              );
            }

            const initials = `${post?.author?.firstName?.[0] || ""}${
              post?.author?.lastName?.[0] || ""
            }`.toUpperCase();
            const isLiked = post.likes?.includes("user123");

            return (
              <div
                key={post._id}
                className="bg-white p-3 rounded-md w-full mt-5"
              >
                {/* Content omitted for brevity (same as your original post card) */}
                <h2 className="text-lg font-semibold text-gray-800 mb-2">
                  {post.title || "Untitled"}
                </h2>
              </div>
            );
          })}
        </div>

        <div className="w-full relative lg:fixed lg:right-10 lg:w-[400px] lg:h-screen lg:pb-28 overflow-auto">
          <div className="bg-white rounded-md p-3">
            <div className="flex justify-between items-center">
              <h1 className="font-semibold">Recommended Contents</h1>
              <Link href="#" className="text-xs">
                See all
              </Link>
            </div>
            {loadingCommunities
              ? [...Array(1)].map((_, i) => (
                  <Skeleton
                    key={i}
                    active
                    avatar
                    paragraph={{ rows: 4 }}
                    className="mt-5"
                  />
                ))
              : singleCommunity.map((e) => (
                  <div key={e._id}>
                    <Image
                      src={e.banner}
                      alt={e.name}
                      width={600}
                      height={500}
                      className="mt-5 rounded-md"
                    />
                    <h1 className="mt-2 text-[.8rem] font-semibold">
                      {e.name}
                    </h1>
                    <p className="mt-2 text-[.8rem]">
                      {e.about?.slice(0, 100)}..
                    </p>
                    <div className="mt-2 flex gap-3 items-center">
                      <div className="rounded-full h-10 w-10">
                        <Image
                          src={e?.creator?.avatar}
                          alt={e.creator?.username}
                          width={40}
                          height={20}
                          className="h-full w-full rounded-full object-cover"
                        />
                      </div>
                      <h1 className="mt-2 text-[.8rem] font-semibold">
                        {e.creator.username}
                      </h1>
                    </div>
                  </div>
                ))}
          </div>

          <div className="bg-white rounded-md p-3 mt-4">
            <div className="flex justify-between items-center">
              <h1 className="font-semibold">Popular Communities</h1>
              <p>See all</p>
            </div>

            {loadingCommunities
              ? [...Array(3)].map((_, i) => (
                  <Skeleton
                    key={i}
                    active
                    avatar
                    paragraph={{ rows: 1 }}
                    className="mt-4"
                  />
                ))
              : communities.map((community) => {
                  const initials = `${community?.name?.[0] || ""}${
                    community?.name?.[1] || ""
                  }`.toUpperCase();
                  return (
                    <div
                      key={community._id}
                      className="flex justify-between items-center mt-4 mb-3"
                    >
                      <div className="flex items-center gap-3">
                        <div className="rounded-full h-10 w-10">
                          {community?.avatar ? (
                            <Image
                              src={community.avatar}
                              alt={community.name}
                              height={500}
                              width={500}
                              className="rounded-full w-full h-full object-cover"
                            />
                          ) : (
                            <div className="!bg-[#F6F6F6] rounded-full p-2 w-12 h-12 flex justify-center items-center">
                              <h1 className="font-semibold text-gray-400">
                                {initials}
                              </h1>
                            </div>
                          )}
                        </div>
                        <div>
                          <h2 className="font-semibold text-[.7rem]">
                            {community?.name.slice(0, 25)}
                          </h2>
                          <p className="text-xs">
                            {formatMemberCount(community?.members.length) || 0}{" "}
                            Active Members
                          </p>
                        </div>
                      </div>
                      <div>
                        <Button
                          loading={joinLoadingMap[community._id]}
                          onClick={() => {
                            if (!user?.communities?.includes(community._id)) {
                              joinCommunity(community._id);
                            }
                          }}
                          disabled={user?.communities?.includes(community._id)}
                          className={`!rounded-full !border-none ${
                            user?.communities?.includes(community._id)
                              ? "!bg-green-100 !text-green-700 cursor-default"
                              : "!bg-[#F3F3F4] hover:!text-black"
                          }`}
                        >
                          {user?.communities?.includes(community._id)
                            ? "Joined"
                            : "Join Community"}
                        </Button>
                      </div>
                    </div>
                  );
                })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
