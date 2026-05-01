import { createContext, useContext, useEffect, useMemo, useState } from "react";
import * as authApi from "../api/authApi.js";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const setAccessToken = (token) => {
    if (token) {
      localStorage.setItem("accessToken", token);
    } else {
      localStorage.removeItem("accessToken");
    }
  };

  const bootstrap = async () => {
    try {
      const refreshed = await authApi.refresh();
      if (refreshed.accessToken) {
        setAccessToken(refreshed.accessToken);
        const me = await authApi.me();
        setUser(me.user);
      }
    } catch (error) {
      setUser(null);
      setAccessToken(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    bootstrap();
  }, []);

  const login = async (payload) => {
    const data = await authApi.login(payload);
    setAccessToken(data.accessToken);
    setUser(data.user);
    return data;
  };

  const signup = async (payload) => {
    const data = await authApi.signup(payload);
    setAccessToken(data.accessToken);
    setUser(data.user);
    return data;
  };

  const logout = async () => {
    await authApi.logout();
    setAccessToken(null);
    setUser(null);
  };

  const value = useMemo(
    () => ({ user, loading, login, signup, logout }),
    [user, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
