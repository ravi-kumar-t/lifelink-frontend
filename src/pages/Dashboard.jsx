import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { getAllProjects } from "../services/projectService";
import Loader from "../components/Loader";

const Dashboard = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await getAllProjects();
        setProjects(data);
      } catch (error) {
        toast.error("Failed to load projects");
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  if (loading) return <Loader />;

  return (
    <div>
      <h2>Active Emergency Cases</h2>
      {projects.length === 0 && <p>No active projects</p>}

      {projects.map((project) => (
  <div
    key={project._id}
    style={{
      border: "1px solid gray",
      padding: "10px",
      marginBottom: "10px"
    }}
  >
    <h3>{project.title}</h3>
    <p>Hospital: {project.hospitalName}</p>
    <p>City: {project.city}</p>
    <p>Blood Group: {project.requiredBloodGroup}</p>
    <p>Units Required: {project.unitsRequired}</p>

    <Link to={`/projects/${project._id}`}>
      View Details
    </Link>
  </div>
))}
    </div>
  );
};

export default Dashboard;