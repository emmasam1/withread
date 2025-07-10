"use client";
import { Button } from "antd";
import Image from "next/image";

const AllActivities = () => {
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
      read: true,
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
      read: true,
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
      read: true,
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

  return (
    <div className="flex flex-col">
      {notifications.map((item, index) => (
        <div
          key={item.id}
          className={`flex justify-between items-start px-4 py-4 ${
            index !== notifications.length - 1 ? "border-b border-gray-200" : ""
          }`}
        >
          <div className="flex gap-2 items-start w-full">
            {/* Unread dot */}
            {!item.read && (
              <div className="w-2 h-2 mt-2 rounded-full bg-purple-500" />
            )}

            {/* Avatar and content */}
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
                
                 {/* Action link */}
                {item.action && (
                  <div className="-mt-1.5">
                    <button className="text-xs text-purple-600 underline">
                      {item.action}
                    </button>
                  </div>
                )}
              </div>

                {/* Action buttons */}
                {item.actions && (
                  <div className="flex gap-2 mt-2">
                    {item.actions.map((action, i) => (
                      <Button
                        key={i}
                        size="small"
                        className={
                          action === "Accept" ? "!bg-black !text-white !rounded-full hover:!text-white !border-0 px-2 py-1" : "!bg-[#F1F1F2] !text-black !rounded-full hover:!text-black !border-0 px-2 py-1"
                        }
                      >
                        {action}
                      </Button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <span className="text-xs text-gray-500 whitespace-nowrap">
            {item.time}
          </span>
        </div>
      ))}
    </div>
  );
};

export default AllActivities;
