"use client";
import { useApp } from "@/app/context/context";
import { Button, Skeleton } from "antd";
import axios from "axios";
import Image from "next/image";
import { useState, useEffect } from "react";

const AllActivities = () => {
  const { API_BASE_URL, setLoading, loading, token } = useApp();
  const [notifications, setNotifications] = useState([]);
  const [responseState, setResponseState] = useState({});

  const getActivities = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE_URL}/api/activity/activities`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifications(res?.data?.notifications || []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      await axios.patch(
        `${API_BASE_URL}/api/activity/${id}/read`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNotifications((prev) =>
        prev.map((n) =>
          n._id === id ? { ...n, isRead: true } : n
        )
      );
    } catch (error) {
      console.log(error);
    }
  };

  const handleAccept = (id) => {
    setResponseState((prev) => ({
      ...prev,
      [id]: { loading: true, accepted: false },
    }));

    setTimeout(() => {
      setResponseState((prev) => ({
        ...prev,
        [id]: { loading: false, accepted: true },
      }));
    }, 2000);
  };

  useEffect(() => {
    if (!token) return;
    getActivities();
  }, [token]);

  return (
    <div className="flex flex-col">
      {loading ? (
        Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex gap-2 px-4 py-4">
            <Skeleton.Avatar active size="large" shape="circle" />
            <div className="flex-1">
              <Skeleton active title={false} paragraph={{ rows: 2 }} />
            </div>
          </div>
        ))
      ) : (
        notifications.map((item, index) => {
          const state = responseState[item._id] || {};
          return (
            <div
              key={item._id}
              className={`flex justify-between items-start px-4 py-4 cursor-pointer hover:bg-gray-50 transition ${
                index !== notifications.length - 1
                  ? "border-b border-gray-200"
                  : ""
              }`}
              onClick={() => !item.isRead && markAsRead(item._id)}
            >
              <div className="flex gap-2 items-start w-full">
                {!item.isRead && (
                  <div className="w-2 h-2 mt-2 rounded-full bg-purple-500" />
                )}

                <div className="flex gap-2 w-full">
                  <div className="rounded-full h-10 w-10 overflow-hidden">
                    <Image
                      src="/images/Ellipse.png"
                      alt="avatar"
                      width={40}
                      height={40}
                      className="object-cover h-full w-full rounded-full"
                    />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">{item.message}</p>
                    {item.actions && (
                      <div className="flex gap-2 mt-2">
                        {state.accepted ? (
                          <Button
                            size="small"
                            className="!bg-[#F1F1F2] !text-black !rounded-full !border-0"
                          >
                            <Image
                              src="/images/tick-circle.png"
                              alt="icon"
                              width={17}
                              height={17}
                            />
                            Invitation Accepted!
                          </Button>
                        ) : (
                          <>
                            <Button
                              size="small"
                              className="!bg-black !text-white !rounded-full hover:!text-white !border-0 px-2 py-1"
                              loading={state.loading}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleAccept(item._id);
                              }}
                            >
                              Accept
                            </Button>
                            <Button
                              size="small"
                              disabled={state.loading}
                              className="!bg-[#F1F1F2] !text-black !rounded-full hover:!text-black !border-0 px-2 py-1"
                              onClick={(e) => e.stopPropagation()}
                            >
                              Reject
                            </Button>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <span className="text-xs text-gray-500 whitespace-nowrap">
                {new Date(item.createdAt).toLocaleString()}
              </span>
            </div>
          );
        })
      )}
    </div>
  );
};

export default AllActivities;
