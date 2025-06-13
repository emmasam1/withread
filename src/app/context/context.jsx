"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

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
        token,
        setToken,
        loading,
        setLoading,
        draftLoading,
        setDraftLoading
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

// Custom hook to use the context
export const useApp = () => useContext(AppContext);
