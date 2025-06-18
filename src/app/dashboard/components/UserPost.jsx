"use client";
import React, { useEffect, useState } from "react";
import { useApp } from "../../context/context";
import { Card } from "antd";
import axios from "axios";
import { toast } from "react-toastify";
import WithReadLoader from "../components/WithReadLoader";

const { Meta } = Card;

const UserPost = () => {
  const { API_BASE_URL, setLoading, loading, user, token } = useApp();
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const getPost = async () => {
      if (!API_BASE_URL || !token) return;
      try {
        setLoading(true);
        const res = await axios.get(`${API_BASE_URL}/api/post/user/posts`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.data.success) {
          setPosts(res.data.posts || []);
          console.log(res.data.posts, "Fetched Posts");
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

    getPost();
  }, [API_BASE_URL, token]);

  return (
    <div>
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
    {loading ? (
        <WithReadLoader/>
      ) : (
        posts && posts.length > 0 ? (
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
                description={post.description || "No description available"}
              />
            </Card>
          ))
        ) : (
          <div className="col-span-3 text-center">
            <p>No posts found.</p>
          </div>
        )
      ) }
      </div>
    </div>
  );
};

export default UserPost;
