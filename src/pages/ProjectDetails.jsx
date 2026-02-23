import { useParams } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import toast from "react-hot-toast";
import { getProjectById } from "../services/projectService";
import Loader from "../components/Loader";
import { AuthContext } from "../context/AuthContext";

const ProjectDetails = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

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
        <button>Respond to Emergency</button>
      )}

      {user?.role === "Admin" && project.status === "Active" && (
        <button>Close Emergency</button>
      )}
    </div>
  );
};

export default ProjectDetails;