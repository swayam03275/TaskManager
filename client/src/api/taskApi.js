import apiClient from "./apiClient.js";

export const fetchTasks = async (projectId) => {
  const { data } = await apiClient.get(`/tasks/projects/${projectId}`);
  return data.tasks;
};

export const createTask = async (projectId, payload) => {
  const { data } = await apiClient.post(
    `/tasks/projects/${projectId}`,
    payload,
  );
  return data.task;
};

export const updateTask = async (taskId, payload) => {
  const { data } = await apiClient.patch(`/tasks/${taskId}`, payload);
  return data.task;
};
