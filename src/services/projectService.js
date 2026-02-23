import api from "./api";

export const getAllProjects = async () => {
  const response = await api.get("/projects");
  return response.data;
};

export const getProjectById = async (id) => {
  const response = await api.get(`/projects/${id}`);
  return response.data;
};

export const closeProject = async (id) => {
  const response = await api.patch(`/projects/${id}/close`);
  return response.data;
};

export const createProject = async (data) => {
  const response = await api.post("/projects", data);
  return response.data;
};