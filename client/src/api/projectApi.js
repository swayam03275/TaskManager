import apiClient from "./apiClient.js";

export const fetchProjects = async () => {
  const { data } = await apiClient.get("/projects");
  return data.projects;
};

export const fetchProject = async (projectId) => {
  const { data } = await apiClient.get(`/projects/${projectId}`);
  return data.project;
};

export const createProject = async (payload) => {
  const { data } = await apiClient.post("/projects", payload);
  return data.project;
};

export const updateProject = async (projectId, payload) => {
  const { data } = await apiClient.patch(`/projects/${projectId}`, payload);
  return data.project;
};

export const addMember = async (projectId, payload) => {
  const { data } = await apiClient.post(
    `/projects/${projectId}/members`,
    payload,
  );
  return data.project;
};

export const removeMember = async (projectId, memberId) => {
  const { data } = await apiClient.delete(
    `/projects/${projectId}/members/${memberId}`,
  );
  return data.project;
};
