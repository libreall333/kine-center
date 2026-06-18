"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import type { Role } from "@/lib/types";

export interface SessionUser {
  email: string;
  full_name: string;
  role: Role;
  patient_id?: string | null;
  professional_id?: string | null;
}

interface AuthContextValue {
  user: SessionUser | null;
  loading: boolean;
  login: (user: SessionUser) => void;
  logout: () => void;
}

const COOKIE = "kv_session";
const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function readCookie(): SessionUser | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.split("; ").find((c) => c.startsWith(`${COOKIE}=`));
  if (!match) return null;
  try {
    return JSON.parse(decodeURIComponent(match.split("=")[1]));
  } catch {
    return null;
  }
}

function writeCookie(user: SessionUser | null) {
  if (typeof document === "undefined") return;
  if (!user) {
    document.cookie = `${COOKIE}=; path=/; max-age=0`;
    return;
  }
  const value = encodeURIComponent(JSON.stringify(user));
  document.cookie = `${COOKIE}=${value}; path=/; max-age=${60 * 60 * 8}; samesite=lax`;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setUser(readCookie());
    setLoading(false);
  }, []);

  const login = useCallback((u: SessionUser) => {
    writeCookie(u);
    setUser(u);
  }, []);

  const logout = useCallback(() => {
    writeCookie(null);
    setUser(null);
  }, []);

  return <AuthContext.Provider value={{ user, loading, login, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de <AuthProvider>");
  return ctx;
}
