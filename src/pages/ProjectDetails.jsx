import { useParams } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import toast from "react-hot-toast";

import { getProjectById, closeProject } from "../services/projectService";
import { respondToProject } from "../services/taskService";

import Loader from "../components/Loader";
import { AuthContext } from "../context/AuthContext";

const ProjectDetails = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const data = await getProjectById(id);
        setProject(data);
      } catch (error) {
        toast.error("Failed to load project");
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  const handleRespond = async () => {
    setActionLoading(true);
    try {
      await respondToProject(project._id);
      toast.success("Response submitted successfully!");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to respond to emergency"
      );
    } finally {
      setActionLoading(false);
    }
  };

  const handleClose = async () => {
    setActionLoading(true);
    try {
      await closeProject(project._id);
      toast.success("Emergency closed successfully!");
      setProject({ ...project, status: "Closed" });
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to close emergency"
      );
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return <Loader />;
  if (!project) return <p>Project not found</p>;

  return (
    <div>
      <h2>{project.title}</h2>
      <p>Hospital: {project.hospitalName}</p>
      <p>City: {project.city}</p>
      <p>Blood Group: {project.requiredBloodGroup}</p>
      <p>Units Required: {project.unitsRequired}</p>
      <p>Urgency: {project.urgencyLevel}</p>
      <p>Status: {project.status}</p>

      {user?.role === "User" && project.status === "Active" && (
        <button onClick={handleRespond} disabled={actionLoading}>
          {actionLoading ? "Submitting..." : "Respond to Emergency"}
        </button>
      )}

      {user?.role === "Admin" && project.status === "Active" && (
        <button onClick={handleClose} disabled={actionLoading}>
          {actionLoading ? "Closing..." : "Close Emergency"}
        </button>
      )}
    </div>
  );
};

export default ProjectDetails;