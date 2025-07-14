"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";

// Create the context
const AppContext = createContext();

// Provider
export const AppProvider = ({ children }) => {
  const API_BASE_URL = "https://withread-api-vah1.onrender.com";

  const [user, setUserState] = useState(null);
  const [token, setTokenState] = useState(null);
  const [loading, setLoading] = useState(true);
  const [draftLoading, setDraftLoading] = useState(false);

  // Load user and token from sessionStorage on mount
  useEffect(() => {
    try {
      const storedUser = sessionStorage.getItem("user");
      const storedToken = sessionStorage.getItem("token");

      if (storedUser) {
        setUserState(JSON.parse(storedUser));
      }

      if (storedToken) {
        setTokenState(storedToken);
      }
    } catch (error) {
      console.error("Error parsing stored user:", error);
      sessionStorage.removeItem("user");
      sessionStorage.removeItem("token");
    } finally {
      setLoading(false);
    }
  }, []);

  // Set user and persist to sessionStorage
  const setUser = (userData) => {
    if (userData) {
      sessionStorage.setItem("user", JSON.stringify(userData));
      setUserState(userData);
    } else {
      sessionStorage.removeItem("user");
      setUserState(null);
    }
  };

  // ✅ FIXED: updateUser now uses setUserState directly
  const updateUser = (newUserData) => {
    setUserState((prevUser) => {
      const updatedUser = {
        ...prevUser,
        ...newUserData,
      };
      sessionStorage.setItem("user", JSON.stringify(updatedUser));
      return updatedUser;
    });
  };

  //toggle follow across the application
  const toggleFollowUser = async (userId) => {
    if (!token || !user) {
      toast.error("You must be logged in to follow users.");
      return;
    }

    const isFollowing = user.following?.includes(userId);

    try {
      if (isFollowing) {
        // Unfollow
        const res = await axios.delete(
          `${API_BASE_URL}/api/user/unfollow/${userId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        updateUser({
          following: user.following.filter((id) => id !== userId),
        });

        toast.success(res.data?.message || "Unfollowed");
      } else {
        // Follow
        const res = await axios.post(
          `${API_BASE_URL}/api/user/follow/${userId}`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );

        updateUser({
          following: [...(user.following || []), userId],
        });

        toast.success(res.data?.message || "Followed");
      }
    } catch (error) {
      console.error(error);
      toast.error(`Failed to ${isFollowing ? "unfollow" : "follow"} user`);
    }
  };

  // Set token and persist to sessionStorage
  const setToken = (tokenValue) => {
    if (tokenValue) {
      sessionStorage.setItem("token", tokenValue);
      setTokenState(tokenValue);
    } else {
      sessionStorage.removeItem("token");
      setTokenState(null);
    }
  };

  return (
    <AppContext.Provider
      value={{
        API_BASE_URL,
        user,
        setUser,
        updateUser,
        token,
        setToken,
        loading,
        setLoading,
        draftLoading,
        setDraftLoading,
        toggleFollowUser,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

// Custom hook to use the context
export const useApp = () => useContext(AppContext);
