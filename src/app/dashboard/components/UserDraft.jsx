"use client";
import React, { useEffect, useState } from "react";
import { useApp } from "../../context/context";
import { Card } from "antd";
import axios from "axios";
import { toast } from "react-toastify";

const { Meta } = Card;

const UserDraft = () => {
  const { API_BASE_URL, setLoading, loading, user, token } = useApp();
  const [drafts, setDrafts] = useState([]);

  useEffect(() => {
    const getDrafts = async () => {
      if (!API_BASE_URL || !token) return;
      try {
        setLoading(true);
        const res = await axios.get(`${API_BASE_URL}/api/post/user/drafts`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.data.success) {
            console.log(res)
        //   setDrafts(res.data.posts || []);
        //   console.log(res.data.posts, "Fetched Posts");
        } else {
          toast.error("Failed to fetch posts");
        }
      } catch (error) {
        console.error("Error fetching user posts:", error);
        toast.error("Error fetching user posts");
      } finally {
        setLoading(false);
      }
    };

    getDrafts();
  }, [API_BASE_URL, token]);

  return (
    <div>
      {/* <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts && posts.length > 0 ? (
          posts.map((post) => (
            <Card
              key={post._id}
              hoverable
              cover={
                <img
                  alt="Post cover"
                  src={post.images || "/images/placeholder.jpg"}
                  className="h-60 w-full object-cover"
                />
              }
            >
              <Meta
                title={post.title || "Untitled Post"}
                description={post.content?.slice(0, 100) || "No description available."}
              />
            </Card>
          ))
        ) : (
          <p>No posts found.</p>
        )}
      </div> */}
    </div>
  );
};

export default UserDraft;
