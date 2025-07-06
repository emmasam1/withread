"use client";
import React, { useEffect, useState } from "react";
import { useApp } from "../../../context/context";
import { Card, Button } from "antd";
import axios from "axios";
import { toast } from "react-toastify";
import WithReadLoader from "../WithReadLoader";
import { useRouter } from "next/navigation";

const { Meta } = Card;

const PostGrid = ({
  endpoint,
  descriptionKey = "content",
  imageKey = "images",
  emptyMessage = "No posts found.",
}) => {
  const { API_BASE_URL, setLoading, loading, token, user } = useApp();
  const [data, setData] = useState([]);
  const [dataType, setDataType] = useState("");
  const [publishing, setPublishing] = useState({});
  const [editing, setEditing] = useState({});

  const router = useRouter();

  const isDraftMode = endpoint === "/api/api/post/user/drafts";

  useEffect(() => {
    const fetchPosts = async () => {
      if (!API_BASE_URL || !token) return;
      try {
        setLoading(true);
        const res = await axios.get(`${API_BASE_URL}${endpoint}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log(res.data);

        if (res.data.success) {
          let content = [];
          if (res.data.posts) {
            content = res.data.posts;
            setDataType("posts");
          } else if (res.data.drafts) {
            content = res.data.drafts;
            setDataType("drafts");
          } else if (res.data.savedPosts) {
            content = res.data.savedPosts;
            setDataType("savedPosts");
          } else if (res.data.communities) {
            content = res.data.communities;
            setDataType("communities");
          }
          setData(content);
        } else {
          toast.error("Failed to fetch posts");
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
        toast.error("Error fetching posts");
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [API_BASE_URL, token, endpoint]);

  const publishPost = async (id) => {
    const url = `${API_BASE_URL}/api/post/drafts/${id}/publish`;

    // Set only this ID to true
    setPublishing((prev) => ({ ...prev, [id]: true }));

    try {
      const res = await axios.patch(
        url,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        toast.success(res.data.message || "Draft published!");

        // Remove published item from list
        setData((prev) => prev.filter((item) => item._id !== id));
      } else {
        toast.error(res.data.message || "Publish failed");
      }
    } catch (err) {
      console.error("Publish error:", err);
      toast.error("Error publishing draft");
    } finally {
      // Turn off loading for this ID
      setPublishing((prev) => ({ ...prev, [id]: false }));
    }
  };

  const editPost = (id) => {
  setEditing((prev) => ({ ...prev, [id]: true }));
  try {
    router.push(`/dashboard/newpost?id=${id}`);
  } catch (error) {
    console.error(error);
  } finally {
    setTimeout(() => {
      setEditing((prev) => ({ ...prev, [id]: false }));
    }, 1000);
  }
};


  const handleCardClick = (post) => {
    if (isDraftMode && post?._id) {
      localStorage.setItem("selectedDraft", JSON.stringify(post));
      router.push(`/dashboard/newpost`);
    }
  };

  return (
    <div className="mt-6 min-h-[300px] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {loading ? (
        <div className="col-span-full flex items-center justify-center">
          <WithReadLoader size={100} />
        </div>
      ) : data && data.length > 0 ? (
        data.map((item) => (
          <Card
            key={item._id}
            hoverable={isDraftMode}
            onClick={() => handleCardClick(item._id)}
            className={isDraftMode ? "cursor-pointer" : ""}
            cover={
              <img
                alt="Post cover"
                src={
                  Array.isArray(item[imageKey])
                    ? item[imageKey][0]
                    : item[imageKey] || "/images/placeholder.jpg"
                }
                className="h-60 w-full object-cover"
              />
            }
          >
            {dataType === "communities" ? (
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2">
                  {item.avatar ? (
                    <img
                      src={item.avatar}
                      alt="community avatar"
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-white font-medium text-sm">
                      {item.name?.slice(0, 2).toUpperCase() || "UN"}
                    </div>
                  )}
                  <span className="font-semibold text-sm">{item.name}</span>
                </div>
                <p className="text-xs text-gray-600">
                   {item.creator === user?._id ? "Admin" : "Joined"}{" "}
                  {new Date(item.createdAt).toLocaleDateString()}
                </p>
              </div>
            ) : (
              <Meta
                title={item.title || "Untitled"}
                {...(dataType !== "communities" && {
                  description:
                    item[descriptionKey]?.slice(0, 100) ||
                    "No description available",
                })}
              />
            )}
            {dataType?.toLowerCase() === "drafts" && (
              <div className="mt-4 flex justify-end gap-2">
                <Button
                  type="primary"
                  size="small"
                  className="!bg-black !text-[#D9D9D9]"
                  onClick={() => publishPost(item._id)}
                  loading={publishing[item._id]}
                >
                  Publish
                </Button>
                <Button
                  size="small"
                  onClick={() => editPost(item._id)}
                  loading={editing[item._id]}
                >
                  Edit
                </Button>
              </div>
            )}
          </Card>
        ))
      ) : (
        <div className="col-span-full text-center">
          <p>{emptyMessage}</p>
        </div>
      )}
    </div>
  );
};

export default PostGrid;
