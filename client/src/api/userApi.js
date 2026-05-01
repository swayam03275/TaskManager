import apiClient from "./apiClient.js";

export const fetchUsers = async () => {
  const { data } = await apiClient.get("/users");
  return data.users;
};

export const updateRole = async (userId, role) => {
  const { data } = await apiClient.patch(`/users/${userId}/role`, { role });
  return data.user;
};
