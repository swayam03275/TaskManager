import apiClient from "./apiClient.js";

export const login = async (payload) => {
  const { data } = await apiClient.post("/auth/login", payload);
  return data;
};

export const signup = async (payload) => {
  const { data } = await apiClient.post("/auth/signup", payload);
  return data;
};

export const refresh = async () => {
  const { data } = await apiClient.post("/auth/refresh");
  return data;
};

export const logout = async () => {
  const { data } = await apiClient.post("/auth/logout");
  return data;
};

export const me = async () => {
  const { data } = await apiClient.get("/auth/me");
  return data;
};
