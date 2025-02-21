import React, { createContext, useContext, useState } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const API_URL = "http://localhost:3000";
  axios.defaults.withCredentials = true;

  const login = async (credentials) => {
    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/api/auth/login`, credentials);
      setUser(response.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await axios.get(`${API_URL}/api/auth/logout`);
      setUser(null);
    } catch (err) {
      setError(err.response?.data?.message || "Logout failed");
    }
  };

  const authValues = {
    user,
    loading,
    error,
    login,
    logout,
    isAgent: user?.userType === "agent",
    isClient: user?.userType === "client",
  };

  return <AuthContext.Provider value={authValues}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
