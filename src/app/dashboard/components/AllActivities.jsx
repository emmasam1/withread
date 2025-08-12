"use client";
import { useApp } from "@/app/context/context";
import { Button } from "antd";
import axios from "axios";
import Image from "next/image";
import { useState, useEffect } from "react";


const AllActivities = () => {
  const { API_BASE_URL, setLoading, loading, user, token } = useApp();
  const [userWarning, setUserWarning] = useState([])

  const notifications = [
    {
      id: 1,
      user: {
        name: "Ramsey Gary",
        username: "@ramsey.gary07",
        avatar: "https://example.com/avatar1.jpg",
      },
      message: "New follower alert Ramsey is now following you...",
      time: "12:56 PM | 01-09-2024",
      type: "follow",
      read: false,
    },
    {
      id: 2,
      user: {
        name: "Jackson Halo",
        username: "@jackson_halo21",
        avatar: "https://example.com/avatar2.jpg",
      },
      message: "Just commented on your new post",
      time: "12:56 PM | 01-09-2024",
      type: "comment",
      read: false,
    },
    {
      id: 3,
      user: {
        name: "Monica Sarah",
        username: "@sarah_monk",
        avatar: "https://example.com/avatar3.jpg",
      },
      message: "Monica just viewed your profile",
      action: "View her profile",
      time: "12:56 PM | 01-09-2024",
      type: "profile-view",
      read: false,
    },
    {
      id: 4,
      user: {
        name: "Lincoln Timothy",
        username: "@timolin01",
        avatar: "https://example.com/avatar4.jpg",
      },
      message: "Just invited you to join UI/UX COMMUNITY",
      actions: ["Accept", "Reject"],
      time: "12:56 PM | 01-09-2024",
      type: "invite-community",
      read: false,
    },
    {
      id: 5,
      user: {
        name: "Jackson Halo",
        username: "@jackson_halo21",
        avatar: "https://example.com/avatar2.jpg",
      },
      message: "Just upvoted your comment in DESIGN/DEV COMMUNITY",
      time: "12:56 PM | 01-09-2024",
      type: "upvote-comment",
      read: false,
    },
    {
      id: 6,
      user: {
        name: "Mike Timber",
        username: "@mtimberlake",
        avatar: "https://example.com/avatar5.jpg",
      },
      message: "Just invited you to contribute on his post",
      actions: ["Accept", "Reject"],
      time: "12:56 PM | 01-09-2024",
      type: "invite-collaborate",
      read: false,
    },
    {
      id: 7,
      user: {
        name: "Rahman Jacky",
        username: "@rahmanjack",
        avatar: "https://example.com/avatar6.jpg",
      },
      message: "New activity from Rahman Jacky",
      time: "12:56 PM | 01-09-2024",
      type: "generic",
      read: false,
    },
  ];

  const getActivities = async() => {
    try {
      setLoading(true)
      const res = await axios.get(`${API_BASE_URL}/api/activity/activities`,{
        headers: { Authorization: `Bearer ${token}` }
      })
      setUserWarning(res?.data?.activities)
      // console.log(res)
    } catch (error) {
      console.log(error)
    }finally{
      setLoading(false)
    }
  }

  useEffect(()=> {
    if(!token) return
    getActivities()
  }, [token])


  const [responseState, setResponseState] = useState({}); // { [id]: { loading: boolean, accepted: boolean } }

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

  return (
    <div className="flex flex-col">
      {notifications.map((item, index) => {
        const state = responseState[item.id] || {};

        return (
          <div
            key={item.id}
            className={`flex justify-between items-start px-4 py-4 ${
              index !== notifications.length - 1 ? "border-b border-gray-200" : ""
            }`}
          >
            <div className="flex gap-2 items-start w-full">
              {!item.read && (
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
                  <div className="flex items-center gap-1.5">
                    <h1 className="font-semibold text-sm">{item.user.name}</h1>
                    <span className="text-sm text-gray-500">
                      {item.user.username}
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <p className="text-xs text-gray-600">{item.message}</p>
                    {item.action && (
                      <div className="-mt-1.5">
                        <button className="text-xs text-purple-600 underline">
                          {item.action}
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Buttons / Loader / Accepted State */}
                  {item.actions && (
                    <div className="flex gap-2 mt-2">
                      {state.accepted ? (
                        <Button
                          size="small"
                          className="!bg-[#F1F1F2] !text-black !rounded-full !border-0"
                        >
                            <Image src="/images/tick-circle.png" alt="icon" width={17} height={17} />
                          Invitation Accepted!
                        </Button>
                      ) : (
                        <>
                          <Button
                            size="small"
                            className="!bg-black !text-white !rounded-full hover:!text-white !border-0 px-2 py-1"
                            loading={state.loading}
                            onClick={() => handleAccept(item.id)}
                          >
                            Accept
                          </Button>
                          <Button
                            size="small"
                            disabled={state.loading}
                            className="!bg-[#F1F1F2] !text-black !rounded-full hover:!text-black !border-0 px-2 py-1"
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
              {item.time}
            </span>
          </div>
        );
      })}
    </div>
  );
};

export default AllActivities;
