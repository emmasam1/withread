"use client";
import React, { useState, useEffect, useMemo } from "react";
import { Avatar, Button, Skeleton } from "antd";
import { toast } from "react-toastify";
import { useApp } from "../../context/context";
import axios from "axios";

const CommunityMembers = ({ communityId }) => {
  const { API_BASE_URL, loading, token, setLoading, user } = useApp();
  const [members, setMembers] = useState([]);
  const [followLoadingId, setFollowLoadingId] = useState(null); // which member's button is loading
  const [followingIds, setFollowingIds] = useState(new Set());

  // Keep local following set in sync with logged-in user
  useEffect(() => {
    const ids = (user?.following || []).map(String);
    setFollowingIds(new Set(ids));
  }, [user]);

  const getCommunityMembers = async () => {
    if (!token) return;
    try {
      setLoading(true);
      const res = await axios.get(
        `${API_BASE_URL}/api/community/${communityId}/members`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log("Community members response:", res.data);
      setMembers(res.data.members || []);
    } catch (error) {
      console.error("Error fetching community members:", error);
      toast.error(error?.response?.data?.message || "Failed to load members.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCommunityMembers();
  }, [user, communityId]);

  const followMember = async (memberId) => {
    if (!token) return;
    try {
      setFollowLoadingId(memberId);
      const res = await axios.post(
        `${API_BASE_URL}/api/user/follow/${memberId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log("Follow response:", res.data);
      if (res.data?.message) toast.success(res.data.message);

      // Add to local following set so UI updates immediately
      setFollowingIds((prev) => new Set(prev).add(String(memberId)));
    } catch (error) {
      console.error("Error following member:", error);
      toast.error(error?.response?.data?.message || "Failed to follow member.");
    } finally {
      setFollowLoadingId(null);
    }
  };

  // Helper: Get initials from first + last name
  const getInitials = (firstName, lastName) => {
    const first = firstName?.charAt(0)?.toUpperCase() || "";
    const last = lastName?.charAt(0)?.toUpperCase() || "";
    return first + last;
  };

  return (
    <div className="p-4 space-y-6 bg-white rounded-2xl">
      {loading ? (
        <>
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-start gap-4">
              <Skeleton.Avatar active size={48} shape="circle" />
              <div className="flex-1">
                <Skeleton active title={false} paragraph={{ rows: 2 }} />
              </div>
            </div>
          ))}
        </>
      ) : members.length > 0 ? (
        members.map((member) => {
          const idStr = String(member?._id);
          const isFollowing = followingIds.has(idStr);
          const isSelf = user?._id && String(user._id) === idStr; // optional: prevent following yourself

          return (
            <div
              key={member?._id}
              className="flex items-start justify-between gap-4 pb-4"
            >
              {/* Left: Avatar + Info */}
              <div className="flex gap-4">
                <Avatar src={member.avatar || null} size={48} className="flex-shrink-0">
                  {!member.avatar && getInitials(member.firstName, member.lastName)}
                </Avatar>
                <div>
                  <div className="flex flex-col">
                    <span className="font-semibold text-gray-900">
                      {member.firstName} {member.lastName}
                    </span>
                    <span className="text-gray-500 text-sm">@{member.username}</span>
                  </div>
                  {member.bio && (
                    <p className="text-gray-700 text-sm mt-1">{member.bio}</p>
                  )}
                  {member.tags?.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-1">
                      {member.tags.map((tag, i) => (
                        <span key={i} className="text-gray-500 text-sm">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Right: Follow Button */}
              <div>
                <Button
                  type={isFollowing ? "default" : "primary"}
                  shape="round"
                  disabled={isFollowing || isSelf || followLoadingId === member._id}
                  loading={followLoadingId === member._id}
                  onClick={() => followMember(member._id)}
                  className={
                    isFollowing
                      ? "bg-gray-100 text-gray-800 border-none"
                      : "!bg-black !text-[#D9D9D9] !border-0 !rounded-full !py-2 !px-6"
                  }
                >
                  {isFollowing ? "Follow" : "Following"}
                </Button>
              </div>
            </div>
          );
        })
      ) : (
        <p className="text-gray-500 text-sm">No members found.</p>
      )}
    </div>
  );
};

export default CommunityMembers;
