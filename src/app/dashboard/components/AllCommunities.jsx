"use client";

import React, { useEffect, useState } from "react";
import { useApp } from "../../context/context";
import { Button, Card } from "antd";
import { toast } from "react-toastify";
import axios from "axios";
import Image from "next/image";
import WithReadLoader from "./WithReadLoader";

const { Meta } = Card;

const AllCommunities = () => {
  const [communities, setCommunities] = useState([]);
  const [localLoading, setLocalLoading] = useState(true);
  const [joinedCommunities, setJoinedCommunities] = useState(new Set());
  const [joiningId, setJoiningId] = useState(null); // Track which button is loading

  const { API_BASE_URL, token, user, setUser } = useApp();

  // ✅ Join Community
  const joinCommunity = async (id) => {
    try {
      setJoiningId(id); // Start loading indicator for this button

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

      // ✅ Update joined set to show "Joined" button
      setJoinedCommunities((prev) => new Set(prev).add(id));

      // ✅ Update user context and sessionStorage
      const updatedUser = {
        ...user,
        communities: [...(user.communities || []), id],
      };
      setUser(updatedUser); // This also updates sessionStorage in your context
    } catch (error) {
      console.error("Join community error:", error);
      toast.error(error?.response?.data?.message || "Failed to join community");
    } finally {
      setJoiningId(null);
    }
  };

  // ✅ Fetch all communities
  useEffect(() => {
    const getCommunities = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/community?limit=3`);
        setCommunities(res.data.communities || []);
      } catch (error) {
        console.error("Error fetching communities:", error);
        toast.error("Failed to load communities");
      } finally {
        setLocalLoading(false);
      }
    };

    getCommunities();
  }, [API_BASE_URL]);

  if (localLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <WithReadLoader />
      </div>
    );
  }

  return (
    <div className="p-3 rounded-tr-md rounded-tl-md bg-white">
      <h2 className="text-xl font-semibold mb-4">Discover Communities</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {communities.map((community) => {
          const isJoined = user?.communities?.includes(community._id) || joinedCommunities.has(community._id);
          const isLoading = joiningId === community._id;

          return (
            <Card
              key={community._id}
              hoverable
              cover={
                <img
                  alt={community.name}
                  src={community.banner || "/images/placeholder.jpg"}
                  className="h-48 w-full object-cover"
                />
              }
            >
              <Meta
                title={community.name}
                description={
                  community.about
                    ? community.about.slice(0, 80) + "..."
                    : "No description available"
                }
              />
              <div className="flex justify-between items-center mt-3">
                <div className="flex items-center gap-2">
                  <Image
                    src={community?.creator?.avatar || "/images/placeholder.jpg"}
                    alt="creator avatar"
                    width={30}
                    height={30}
                    className="rounded-full w-10 h-10 object-cover"
                  />
                  <p className="text-sm text-gray-600">
                    {community?.members?.length || 0} Members
                  </p>
                </div>
                <Button
                  className="!bg-black !text-[#D9D9D9] !border-0 !rounded-full !py-3 !px-8"
                  onClick={(e) => {
                    e.preventDefault();
                    if (!isJoined) joinCommunity(community._id);
                  }}
                  disabled={isJoined}
                  loading={isLoading}
                >
                  {isJoined ? "Joined" : "Join"}
                </Button>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default AllCommunities;
