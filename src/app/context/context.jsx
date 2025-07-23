"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";

const AppContext = createContext();

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

      if (storedUser) setUserState(JSON.parse(storedUser));
      if (storedToken) setTokenState(storedToken);
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

  // ✅ FIXED: updateUser merges the previous user object properly
const updateUser = (newUserData) => {
  setUserState((prevUser) => {
    const updatedUser = { ...prevUser, ...newUserData };
    sessionStorage.setItem("user", JSON.stringify(updatedUser));
    return updatedUser;
  });
};


  // ✅ Toggle follow/unfollow logic
 const toggleFollowUser = async (userId) => {
  if (!token || !user) {
    toast.error("You must be logged in to follow users.");
    return;
  }

  const userIdStr = String(userId);
  const isFollowing = (user.following || []).map(String).includes(userIdStr);

  // Optimistic update
  const updatedFollowing = isFollowing
    ? user.following.filter((id) => String(id) !== userIdStr)
    : [...(user.following || []), userIdStr];

  updateUser({ following: updatedFollowing });

  try {
    if (isFollowing) {
      await axios.delete(`${API_BASE_URL}/api/user/unfollow/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Unfollowed");
    } else {
      await axios.post(
        `${API_BASE_URL}/api/user/follow/${userId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Followed");
    }
  } catch (error) {
    console.error("Follow toggle failed:", error.response?.data || error);
    toast.error(error.response?.data?.message || "Action failed.");

    // Rollback on error
    updateUser({
      following: user.following,
    });
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

export const useApp = () => useContext(AppContext);
