"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useApp } from "@/app/context/context";
import Image from "next/image";
import { toast } from "react-toastify";

const MyCommunity = ({ selectedCommunityId, setSelectedCommunity }) => {
  const { API_BASE_URL, setLoading, loading, token } = useApp();
  const [communities, setCommunities] = useState([]);

  useEffect(() => {
    const fetchCommunities = async () => {
      if (!API_BASE_URL || !token) return;
      try {
        setLoading(true);
        const res = await axios.get(
          `${API_BASE_URL}/api/community/my-community`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        console.log(res.data)

        if (res.data.success) {
          const communityList = res.data.communities.slice(0, 4);
          setCommunities(communityList);

          // set first as default if not already set
          if (!selectedCommunityId && communityList.length > 0) {
            setSelectedCommunity(communityList[0]);
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
              onClick={() => setSelectedCommunity(community)}
              className={`flex justify-between items-center cursor-pointer py-1 px-2 rounded-md ${
                isActive ? "bg-[#F5F4FF]" : "hover:bg-[#F6F6F6]"
              }`}
            >
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
                4
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MyCommunity;
