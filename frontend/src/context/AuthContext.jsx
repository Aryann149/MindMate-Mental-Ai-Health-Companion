import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { AuthAPI } from "../api/endpoints";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const hydrate = useCallback(async () => {
    const cached = localStorage.getItem("mindmate_user");
    if (cached) setUser(JSON.parse(cached));

    try {
      const { data } = await AuthAPI.me();
      setUser(data.user);
      localStorage.setItem("mindmate_user", JSON.stringify(data.user));
    } catch {
      setUser(null);
      localStorage.removeItem("mindmate_user");
      localStorage.removeItem("mindmate_token");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  const persistSession = (data) => {
    setUser(data.user);
    localStorage.setItem("mindmate_user", JSON.stringify(data.user));
    if (data.token) localStorage.setItem("mindmate_token", data.token);
  };

  const login = async (email, password) => {
    const { data } = await AuthAPI.login({ email, password });
    persistSession(data);
    return data.user;
  };

  const signup = async (payload) => {
    const { data } = await AuthAPI.signup(payload);
    persistSession(data);
    return data.user;
  };

  const logout = async () => {
    try {
      await AuthAPI.logout();
    } finally {
      setUser(null);
      localStorage.removeItem("mindmate_user");
      localStorage.removeItem("mindmate_token");
    }
  };

  const updateLocalUser = (partial) => {
    setUser((prev) => {
      const next = { ...prev, ...partial };
      localStorage.setItem("mindmate_user", JSON.stringify(next));
      return next;
    });
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, login, signup, logout, updateLocalUser, isAdmin: user?.role === "admin" }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
