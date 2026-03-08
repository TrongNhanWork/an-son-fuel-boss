import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { apiGet, apiPost } from "@/lib/api";
import { clearAuth, getRole, getToken, setAuth, type Role } from "@/lib/auth";

type MeResponse = { id: string; username: string; fullName: string; role: string };
type LoginResponse = { token: string; username: string; role: Role; fullName?: string };

type AuthState = {
  isReady: boolean;
  isAuthed: boolean;
  role: Role | null;
  username: string | null;
  fullName: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  refreshMe: () => Promise<void>;
};

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isReady, setIsReady] = useState(false);
  const [role, setRole] = useState<Role | null>(getRole());
  const [username, setUsername] = useState<string | null>(localStorage.getItem("username"));
  const [fullName, setFullName] = useState<string | null>(localStorage.getItem("fullName"));

  const isAuthed = !!getToken();

  async function refreshMe() {
    if (!getToken()) return;
    const me = await apiGet<MeResponse>("/api/auth/me");
    const r = (me.role as Role) ?? null;

    if (getToken() && r) {
      setAuth(getToken()!, r, me.username, me.fullName ?? "");
    }
    setRole(r);
    setUsername(me.username);
    setFullName(me.fullName ?? "");
  }

  useEffect(() => {
    (async () => {
      try {
        await refreshMe();
      } catch {
        clearAuth();
        setRole(null);
        setUsername(null);
        setFullName(null);
      } finally {
        setIsReady(true);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function login(u: string, p: string) {
    const res = await apiPost<LoginResponse>("/api/auth/login", { username: u, password: p });
    setAuth(res.token, res.role, res.username, res.fullName ?? "");
    setRole(res.role);
    setUsername(res.username);
    setFullName(res.fullName ?? "");
  }

  function logout() {
    clearAuth();
    setRole(null);
    setUsername(null);
    setFullName(null);
  }

  const value = useMemo<AuthState>(
    () => ({ isReady, isAuthed, role, username, fullName, login, logout, refreshMe }),
    [isReady, isAuthed, role, username, fullName]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}