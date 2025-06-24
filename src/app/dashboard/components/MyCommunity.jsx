"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useApp } from "@/app/context/context";
import Image from "next/image";
import { toast } from "react-toastify";

const MyCommunity = ({ selectedCommunityId, setSelectedCommunity }) => {
  const { API_BASE_URL, setLoading, token } = useApp();
  const [communities, setCommunities] = useState([]);

  const fetchUserProfiles = async (communityId, memberIds) => {
    try {
      console.log("Fetching profiles for:", communityId, memberIds);
      const res = await axios.get(
        `${API_BASE_URL}/api/community/${communityId}/members`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Fetched memberProfiles:", res.data.members);
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
      console.log("Updated selectedCommunity:", updatedCommunity);
      setSelectedCommunity(updatedCommunity);
    } catch (err) {
      toast.error("Failed to load members");
    }
  };

  useEffect(() => {
    const fetchCommunities = async () => {
      if (!API_BASE_URL || !token) return;
      try {
        setLoading(true);
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

          if (!selectedCommunityId && enrichedCommunities.length > 0) {
            setSelectedCommunity(enrichedCommunities[0]);
          }
        } else {
          toast.error("Failed to fetch communities");
        }
      } catch (error) {
        console.error("Error fetching communities:", error);
        toast.error("Error fetching communities");
      } finally {
        setLoading(false);
      }
    };

    fetchCommunities();
  }, [API_BASE_URL, token]);

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

              {/* {community.memberProfiles?.length > 0 && (
                <div className="flex justify-between items-center mt-3">
                  <div className="flex">
                    {community.memberProfiles.slice(0, 3).map((member, index) => (
                      <Image
                        key={member._id}
                        src={member.avatar || "/images/placeholder.jpg"}
                        alt={member.username}
                        width={40}
                        height={40}
                        className={`rounded-full object-cover ${index > 0 ? "-ml-5" : ""}`}
                      />
                    ))}
                  </div>

                  <div className="w-[200px] text-sm">
                    {community.memberProfiles
                      .slice(0, 3)
                      .map((m) => m.username)
                      .join(", ")}
                    {community.members.length > 3 && (
                      <> and {community.members.length - 3} others</>
                    )}{" "}
                    are members
                  </div>
                </div>
              )} */}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MyCommunity;
