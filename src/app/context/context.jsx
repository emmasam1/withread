"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

// Create the context
const AppContext = createContext();

// Provider
export const AppProvider = ({ children }) => {
  const API_BASE_URL = "https://withread-api-vah1.onrender.com";

  const [user, setUserState] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user from sessionStorage on mount
  useEffect(() => {
    const storedUser = sessionStorage.getItem("user");
    const token = sessionStorage.getItem("token");
    if (storedUser) {
      setUserState(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // Save user to sessionStorage whenever it changes
  const setUser = (userData) => {
    if (userData) {
      sessionStorage.setItem("user", JSON.stringify(userData));
    } else {
      sessionStorage.removeItem("user");
    }
    setUserState(userData);
  };

  return (
    <AppContext.Provider
      value={{
        API_BASE_URL,
        user,
        setUser,
        loading,
        setLoading,
        setToken,
        token
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

// Hook
export const useApp = () => useContext(AppContext);
