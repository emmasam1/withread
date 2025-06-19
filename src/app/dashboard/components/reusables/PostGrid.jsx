"use client";
import React, { useEffect, useState } from "react";
import { useApp } from "../../../context/context";
import { Card } from "antd";
import axios from "axios";
import { toast } from "react-toastify";
import WithReadLoader from "../WithReadLoader";

const { Meta } = Card;

const PostGrid = ({
  endpoint,
  titleKey = "title",
  descriptionKey = "content",
  imageKey = "images",
  emptyMessage = "No posts found.",
}) => {
  const { API_BASE_URL, setLoading, loading, token } = useApp();
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      if (!API_BASE_URL || !token) return;
      try {
        setLoading(true);
        const res = await axios.get(`${API_BASE_URL}${endpoint}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data.success) {
          setData(res.data.posts || res.data.drafts || res.data.savedPosts || []);
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

  return (
    <div className="mt-6 min-h-[300px] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {loading ? (
        <div className="col-span-full flex items-center justify-center">
          <WithReadLoader size={100}/>
        </div>
      ) : data && data.length > 0 ? (
        data.map((item) => (
          <Card
            key={item._id}
            hoverable
            cover={
              <img
                alt="Post cover"
                src={item[imageKey] || "/images/placeholder.jpg"}
                className="h-60 w-full object-cover"
              />
            }
          >
            <Meta
              title={item[titleKey] || "Untitled Post"}
              description={
                item[descriptionKey]?.slice(0, 100) ||
                "No description available."
              }
            />
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
