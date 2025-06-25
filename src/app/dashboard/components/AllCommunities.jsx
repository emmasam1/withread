"use client";
import React, { useEffect, useState } from "react";
import { useApp } from "../../context/context";
import { Button, Card, Spin } from "antd";
import { toast } from "react-toastify";
import axios from "axios";
import Image from "next/image";
import WithReadLoader from "./WithReadLoader";

const { Meta } = Card;

const AllCommunities = () => {
  const [communities, setCommunities] = useState([]);
  const [localLoading, setLocalLoading] = useState(true); // ✅ use local loading
  const { API_BASE_URL } = useApp(); // removed setLoading here

  useEffect(() => {
    const getCommunities = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/community`);
        setCommunities(res.data.communities || []);
        console.log("Fetched communities:", res.data.communities);
      } catch (error) {
        console.error("Error fetching communities:", error);
        toast.error("Failed to load communities");
      } finally {
        setLocalLoading(false);
      }
    };

    getCommunities();
  }, [API_BASE_URL]); // ✅ no setLoading used

  if (localLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <WithReadLoader/>
      </div>
    );
  }

  return (
    <div className="p-3 rounded-tr-md rounded-tl-md bg-white">
      <h2 className="text-xl font-semibold mb-4">Discover Communities</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {communities.map((community) => (
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
              description={community.about?.slice(0, 80) + "..."}
            />
            <div className="flex justify-between items-center mt-3">
              <div>
                <Image
                  src={community?.creator.avatar}
                  alt="icon"
                  width={30}
                  height={30}
                  className="rounded-full w-10 h-10"
                />
                <p>{community?.members.length} Members</p>
              </div>
              <Button className="!bg-black !text-[#D9D9D9] !border-0 !rounded-full !py-3 !px-8">
                Join
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AllCommunities;
