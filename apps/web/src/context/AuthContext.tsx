"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { UserPrivate } from "@blog/types";
import { api } from "@/lib/api";

interface AuthContextType {
  user: UserPrivate | null;
  loading: boolean;
  token: string | null;
  login: (token: string) => Promise<void>;
  logout: () => void;
  refetchUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  token: null,
  login: async () => {},
  logout: () => {},
  refetchUser: async () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserPrivate | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchCurrentUser = async (authToken?: string) => {
    const activeToken = authToken || (typeof window !== "undefined" ? localStorage.getItem("access_token") : null);
    if (!activeToken) {
      setUser(null);
      setToken(null);
      setLoading(false);
      return;
    }

    try {
      const response = await api.get<UserPrivate>("/api/users/me", {
        headers: { Authorization: `Bearer ${activeToken}` },
      });
      setUser(response.data);
      setToken(activeToken);
    } catch (error) {
      console.error("Failed to fetch current user:", error);
      if (typeof window !== "undefined") {
        localStorage.removeItem("access_token");
      }
      setUser(null);
      setToken(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  const login = async (newToken: string) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("access_token", newToken);
    }
    setToken(newToken);
    await fetchCurrentUser(newToken);
  };

  const logout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("access_token");
    }
    setUser(null);
    setToken(null);
    window.location.href = "/";
  };

  const refetchUser = async () => {
    await fetchCurrentUser();
  };

  return (
    <AuthContext.Provider value={{ user, loading, token, login, logout, refetchUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
