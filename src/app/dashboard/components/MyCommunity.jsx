"use client";

import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useApp } from "@/app/context/context";
import Image from "next/image";
import { toast } from "react-toastify";


const MyCommunity = ({ selectedCommunityId, setSelectedCommunity }) => {
  const { API_BASE_URL, token } = useApp();
  const [communities, setCommunities] = useState([]);
  const hasSetDefaultCommunity = useRef(false); // 🆕 prevents repeated setting
  const [isLocalLoading, setIsLocalLoading] = useState(false);


  const fetchUserProfiles = async (communityId, memberIds) => {
    try {
      const res = await axios.get(
        `${API_BASE_URL}/api/community/${communityId}/members`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(res)
      return res.data.members;
    } catch (err) {
      console.error("Error fetching user profiles:", err);
      return [];
    }
  };

  const handleCommunityClick = async (community) => {
    try {
      const memberProfiles = await fetchUserProfiles(
        community._id,
        community.members.slice(0, 3)
      );
      const updatedCommunity = { ...community, memberProfiles };
      setSelectedCommunity(updatedCommunity);
    } catch (err) {
      toast.error("Failed to load members");
    }
  };

  useEffect(() => {
  const fetchCommunities = async () => {
    if (!API_BASE_URL || !token || isLocalLoading) return; // ✅ guard

    try {
      setIsLocalLoading(true);
      const res = await axios.get(`${API_BASE_URL}/api/community/my-community`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) {
        const communityList = res.data.communities;

        const enrichedCommunities = await Promise.all(
          communityList.map(async (community) => {
            const memberProfiles = await fetchUserProfiles(
              community._id,
              community.members.slice(0, 3)
            );
            return { ...community, memberProfiles };
          })
        );

        setCommunities(enrichedCommunities);

        if (
          !hasSetDefaultCommunity.current &&
          enrichedCommunities.length > 0
        ) {
          hasSetDefaultCommunity.current = true;
          setSelectedCommunity(enrichedCommunities[0]);
        }
      } else {
        toast.error("Failed to fetch communities");
      }
    } catch (error) {
      console.error("Error fetching communities:", error);
      toast.error("Error fetching communities");
    } finally {
      setIsLocalLoading(false);
    }
  };

  fetchCommunities();
}, [token, API_BASE_URL]);


console.log("MyCommunity render", { token, API_BASE_URL });
useEffect(() => {
  console.log("useEffect triggered");
}, [token, API_BASE_URL]);



  return (
    <div className="mt-3">
      <h1 className="font-medium my-3 text-md">My Community</h1>
      <div className="flex flex-col gap-3">
        {communities.map((community) => {
          const isActive = selectedCommunityId === community._id;
          return (
            <div
              key={community._id}
              onClick={() => handleCommunityClick(community)}
              className={`flex flex-col cursor-pointer p-3 rounded-md ${
                isActive ? "bg-[#F5F4FF]" : "hover:bg-[#F6F6F6]"
              }`}
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <Image
                    src={community.avatar || "/images/placeholder.jpg"}
                    alt={`${community.name} avatar`}
                    width={45}
                    height={45}
                    className="rounded-full object-cover h-10 w-10"
                  />
                  <h2>{community.name}</h2>
                </div>
                <div className="bg-[#B475CC] rounded-full h-5 w-5 flex items-center justify-center text-white text-xs">
                  {community.members.length}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MyCommunity;
