import { useParams } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import toast from "react-hot-toast";

import {
  getProjectById,
  closeProject
} from "../services/projectService";

import {
  respondToProject,
  getResponsesForProject,
  updateTaskStatus
} from "../services/taskService";

import Loader from "../components/Loader";
import { AuthContext } from "../context/AuthContext";

const ProjectDetails = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);

  const [project, setProject] = useState(null);
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const projectData = await getProjectById(id);
        setProject(projectData);

        if (user?.role === "Admin") {
          const responseData = await getResponsesForProject(id);
          setResponses(responseData);
        }

      } catch (error) {
        toast.error("Failed to load project details");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, user]);

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

  const handleStatusUpdate = async (taskId, status) => {
    try {
      await updateTaskStatus(taskId, status);
      toast.success(`Donor ${status} successfully`);

      // Update UI instantly
      setResponses((prev) =>
        prev.map((res) =>
          res._id === taskId ? { ...res, status } : res
        )
      );

    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to update status"
      );
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

      {/* User Respond Button */}
      {user?.role === "User" && project.status === "Active" && (
        <button onClick={handleRespond} disabled={actionLoading}>
          {actionLoading ? "Submitting..." : "Respond to Emergency"}
        </button>
      )}

      {/* Admin Close Button */}
      {user?.role === "Admin" && project.status === "Active" && (
        <button onClick={handleClose} disabled={actionLoading}>
          {actionLoading ? "Closing..." : "Close Emergency"}
        </button>
      )}

      {/* Admin Responses Section */}
      {user?.role === "Admin" && (
        <div style={{ marginTop: "20px" }}>
          <h3>Donor Responses</h3>

          {responses.length === 0 && <p>No responses yet.</p>}

          {responses.map((res) => (
            <div
              key={res._id}
              style={{
                border: "1px solid gray",
                padding: "8px",
                marginBottom: "8px"
              }}
            >
              <p>Name: {res.donorId?.name}</p>
              <p>Email: {res.donorId?.email}</p>
              <p>Blood Group: {res.donorId?.bloodGroup}</p>
              <p>Status: {res.status}</p>

              {res.status === "Pending" && (
                <>
                  <button
                    onClick={() =>
                      handleStatusUpdate(res._id, "Approved")
                    }
                  >
                    Approve
                  </button>

                  <button
                    onClick={() =>
                      handleStatusUpdate(res._id, "Rejected")
                    }
                    style={{ marginLeft: "10px" }}
                  >
                    Reject
                  </button>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProjectDetails;