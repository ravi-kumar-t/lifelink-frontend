import api from "./api";

export const respondToProject = async (projectId) => {
  const response = await api.post("/tasks/respond", {
    projectId
  });
  return response.data;
};