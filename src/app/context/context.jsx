"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { applyTheme } from "../../../utils/theme";

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const API_BASE_URL = "https://withread-api-vah1.onrender.com";

  const [user, setUserState] = useState(null);
  const [token, setTokenState] = useState(null);
  const [loading, setLoading] = useState(true);
  const [draftLoading, setDraftLoading] = useState(false);
  const [theme, setTheme] = useState("System");
  const [searchResults, setSearchResults] = useState(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState(null);

  // Load theme on mount
  useEffect(() => {
    const storedTheme = localStorage.getItem("theme") || "System";
    setTheme(storedTheme);
    applyTheme(storedTheme);
  }, []);

  const updateTheme = (newTheme) => {
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    applyTheme(newTheme);
  };

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

const performSearch = async (q, type = "all", page = 1, limit = 10) => {
  if (!q || q.trim() === "") {
    toast.error("Search query is required");
    return;
  }

  setSearchLoading(true);
  setSearchError(null);

  try {
    const res = await axios.get(
      `${API_BASE_URL}/api/search?q=${encodeURIComponent(q)}&type=${type}&page=${page}&limit=${limit}`,
      {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      }
    );

    const rawResults = res.data.results;

    // Normalize response to always have { users, posts, communities }
    let normalized = { users: [], posts: [], communities: [] };

    if (type === "all") {
      normalized.users = rawResults?.users || [];
      normalized.posts = rawResults?.posts || [];
      normalized.communities = rawResults?.communities || [];
    } else {
      normalized[type] = Array.isArray(rawResults) ? rawResults : [];
    }

    const finalData = { ...res.data, results: normalized };
    setSearchResults(finalData);

    return finalData;
  } catch (error) {
    console.error("Search failed:", error.response?.data || error);
    setSearchError(error.response?.data?.message || "Search failed");
    toast.error(error.response?.data?.message || "Search failed");
  } finally {
    setSearchLoading(false);
  }
};



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

  // Merge update to user
  const updateUser = (newUserData) => {
    setUserState((prevUser) => {
      const updatedUser = { ...prevUser, ...newUserData };
      sessionStorage.setItem("user", JSON.stringify(updatedUser));
      return updatedUser;
    });
  };

  // Fetch logged-in user profile
  const getLoggedInUser = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/user/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(res.data);
    } catch (error) {
      console.error("Failed to fetch profile:", error);
    }
  };

  // Fetch user whenever token changes
  useEffect(() => {
    if (token) {
      getLoggedInUser();
    }
  }, [token]);

  // Toggle follow/unfollow
  const toggleFollowUser = async (targetUserId) => {
    if (!token || !user) {
      toast.error("You must be logged in to follow users.");
      return;
    }

    const userIdStr = String(targetUserId);
    const isFollowing = (user.following || []).map(String).includes(userIdStr);

    try {
      if (isFollowing) {
        // Unfollow
        await axios.delete(`${API_BASE_URL}/api/user/unfollow/${targetUserId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        updateUser({
          following: user.following.filter((id) => String(id) !== userIdStr),
        });
        toast.success("Unfollowed successfully");
      } else {
        // Follow
        await axios.post(
          `${API_BASE_URL}/api/user/follow/${targetUserId}`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
        updateUser({
          following: [...(user.following || []), userIdStr],
        });
        toast.success("Followed successfully");
      }
    } catch (error) {
      console.error("Follow toggle failed:", error.response?.data || error);
      toast.error(error.response?.data?.message || "Action failed.");
    }
  };

  // Set token and persist
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
        theme,
        updateTheme,
        searchResults,
        searchLoading,
        searchError,
        performSearch,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
