"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useMemo,
  useCallback,
} from "react";
import api from "@/lib/api";
import { toast } from "react-toastify";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = useCallback(async () => {
    try {
      const res = await api.get("/auth/me");
      setUser(res.data.user);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await api.post("/auth/logout");
      setUser(null);
      toast.success("Logged out successfully")
    } catch (error) {
    toast.error("Logout failed")
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const contextValue = useMemo(
    () => ({
      user,
      loading,
      isAuthenticated: !!user,
      role: user?.role,
      logout,
      refetchUser: fetchUser,
    }),
    [user, loading, logout, fetchUser],
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
