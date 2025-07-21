"use client";
import { useApp } from "@/app/context/context";
import { Button, Skeleton } from "antd";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { GoArrowLeft } from "react-icons/go";
import { toast } from "react-toastify";

const Page = () => {
  const { user, API_BASE_URL, token } = useApp();
  const [blockedAccounts, setBlockedAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingId, setLoadingId] = useState(null);

  const fetchBlockedAccounts = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/user/blocked-users`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setBlockedAccounts(response?.data.blockedUsers || []);
    } catch (error) {
      console.error("Error fetching blocked accounts:", error);
      toast.error("Failed to fetch blocked accounts.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!API_BASE_URL || !token) return;
    fetchBlockedAccounts();
  }, [API_BASE_URL, token]);

  const unBlockUser = async (userId) => {
    setLoadingId(userId);
    try {
      const res = await axios.delete(
        `${API_BASE_URL}/api/user/unblock/${userId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log(res);
      toast.success(res.data.message || "User unblocked successfully.");
      fetchBlockedAccounts();
    } catch (error) {
      console.error("Error unblocking user:", error);
      toast.error("Failed to unblock user.");
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="p-3">
      <Link
        href="/dashboard/settings"
        className="flex gap-2 items-center !text-black text-xs w-20"
      >
        <GoArrowLeft size="1rem" />
        Back
      </Link>

      <div className="rounded-lg bg-white p-3 mt-3">
        <h1 className="font-semibold">Blocked Accounts</h1>

        {/* Show skeleton loader while data is loading */}
        {loading ? (
          <div className="mt-6 space-y-5">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <Skeleton.Avatar active size="large" shape="circle" />
                  <div>
                    <Skeleton.Input
                      active
                      style={{ width: 120, height: 16, marginBottom: 5 }}
                    />
                    <Skeleton.Input active style={{ width: 80, height: 12 }} />
                  </div>
                </div>
                <Skeleton.Button
                  active
                  shape="round"
                  style={{ width: 80, height: 32 }}
                />
              </div>
            ))}
          </div>
        ) : blockedAccounts.length === 0 ? (
          <p className="text-sm text-gray-500 mt-5">No blocked accounts.</p>
        ) : (
          blockedAccounts.map((account) => (
            <div
              className="flex justify-between items-center mt-8"
              key={account._id}
            >
              <div className="flex items-center gap-3 ">
                <div className="rounded-full h-10 w-10">
                  {account.avatar ? (
                    <Image
                      src={account.avatar}
                      alt="Avatar"
                      className="rounded-full w-10 h-10 object-cover"
                      width={40}
                      height={40}
                    />
                  ) : (
                    <span className="text-sm font-semibold text-gray-600 !bg-[#F6F6F6] rounded-full w-10 h-10 flex items-center justify-center">
                      {account.firstName.charAt(0).toUpperCase()}
                      {account.lastName.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
                <div>
                  <h1 className="font-medium text-[#333333] -mb-2 capitalize">
                    {account.firstName} {account.lastName}
                  </h1>
                  <span className="text-[#333333] text-xs">
                    @{account.username}
                  </span>
                </div>
              </div>
              <Button
                className="!bg-black !text-white !rounded-full hover:!text-white !border-none mt-3"
                onClick={() => unBlockUser(account._id)}
                loading={loadingId === account._id}
              >
                Unblock
              </Button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Page;
