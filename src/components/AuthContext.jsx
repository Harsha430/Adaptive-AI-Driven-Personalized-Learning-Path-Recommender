import { createContext, useContext, useMemo, useState } from "react";

const AuthContext = createContext(null);

// Hardcoded mock user for demo purposes
const MOCK_USER = { email: "student@example.com", password: "password123" };

export function AuthProvider({ children }) {
  // Initialize from localStorage synchronously to avoid redirect flicker on refresh
  const [user, setUser] = useState(() => {
    try {
      const token = localStorage.getItem("authToken");
      const userRaw = localStorage.getItem("authUser");
      if (token && userRaw) {
        return JSON.parse(userRaw);
      }
      return null;
    } catch (_) {
      return null;
    }
  });

  function login(email, password) {
    // This is called after successful backend authentication
    // Just update the local state with user info
    const nextUser = { email };
    setUser(nextUser);
    try {
      localStorage.setItem("authUser", JSON.stringify(nextUser));
    } catch (_) {}
    return { ok: true };
  }

  function register(email, password) {
    // This is called after successful backend registration
    // Just update the local state with user info
    const nextUser = { email };
    setUser(nextUser);
    try {
      localStorage.setItem("authUser", JSON.stringify(nextUser));
    } catch (_) {}
    return { ok: true };
  }

  function logout() {
    setUser(null);
    try {
      localStorage.removeItem("authUser");
      localStorage.removeItem("authToken");
    } catch (_) {}
  }

  const value = useMemo(() => ({ user, login, logout, register }), [user]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
