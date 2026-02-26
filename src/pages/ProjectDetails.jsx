import { useParams } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import toast from "react-hot-toast";
import { getProjectById, closeProject } from "../services/projectService";
import {
  respondToProject,
  getResponsesForProject,
} from "../services/taskService";
import Loader from "../components/Loader";
import { AuthContext } from "../context/AuthContext";
import "./ProjectDetails.css";

const ProjectDetails = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [project, setProject] = useState(null);
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [hasResponded, setHasResponded] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const projectData = await getProjectById(id);
        setProject(projectData);

        // Backend tells us if this user already responded — persists across refresh
        if (projectData.hasUserResponded) {
          setHasResponded(true);
        }

        if (user?.role === "Admin") {
          const responseData = await getResponsesForProject(id);
          setResponses(responseData);
        }
      } catch {
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
      setHasResponded(true);
      toast.success("You've volunteered! Contact the hospital directly.");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to respond");
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
      toast.error(error.response?.data?.message || "Failed to close emergency");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return <Loader text="Loading case details..." />;
  if (!project) return (
    <div className="page" style={{ textAlign: "center", paddingTop: "80px" }}>
      <p style={{ color: "var(--text-muted)" }}>Emergency case not found.</p>
    </div>
  );

  const urgencyClass = project.urgencyLevel?.toLowerCase();
  const isCritical = project.urgencyLevel === "Critical";
  const adminPhone = project.createdBy?.phone;

  return (
    <div className="page">
      <div className="pd-container animate-in">

        {/* Header */}
        <div className="pd-header">
          <div className="pd-header-left">
            <div className="pd-badges">
              <span className={`badge badge-${urgencyClass}`}>
                {isCritical && "● "}
                {project.urgencyLevel} Priority
              </span>
              <span className={`badge badge-${project.status?.toLowerCase()}`}>
                {project.status}
              </span>
            </div>
            <h1 className="pd-title">{project.title}</h1>
          </div>
          <div className="blood-tag blood-tag-lg">
            {project.requiredBloodGroup}
          </div>
        </div>

        <div className="pd-body">

          {/* Info Grid */}
          <div className="pd-info-grid card">
            <div className="pd-info-item">
              <span className="pd-info-label">Hospital</span>
              <span className="pd-info-value">{project.hospitalName}</span>
            </div>
            <div className="pd-info-item">
              <span className="pd-info-label">City</span>
              <span className="pd-info-value">{project.city}</span>
            </div>
            <div className="pd-info-item">
              <span className="pd-info-label">Blood Group</span>
              <span className="pd-info-value">{project.requiredBloodGroup}</span>
            </div>
            <div className="pd-info-item">
              <span className="pd-info-label">Units Required</span>
              <span className="pd-info-value pd-units">{project.unitsRequired}</span>
            </div>
          </div>

          {/* Donor: respond + contact reveal */}
          {user?.role === "User" && project.status === "Active" && (
            <div className={`pd-action-card card ${hasResponded ? "pd-action-responded" : ""}`}>
              {!hasResponded ? (
                <>
                  <div>
                    <h3 className="pd-action-title">Ready to Help?</h3>
                    <p className="pd-action-desc">
                      Click to volunteer. The hospital contact will be revealed so you can call and coordinate directly.
                    </p>
                  </div>
                  <button
                    className="btn btn-primary btn-lg"
                    onClick={handleRespond}
                    disabled={actionLoading}
                  >
                    {actionLoading ? (
                      <><span className="btn-spinner"></span> Submitting...</>
                    ) : (
                      "🩸 Respond to Emergency"
                    )}
                  </button>
                </>
              ) : (
                <div className="pd-contact-revealed">
                  <div className="pd-contact-check">✓</div>
                  <div className="pd-contact-info">
                    <div className="pd-contact-title">You've volunteered — thank you!</div>
                    <div className="pd-contact-sub">
                      Call the hospital directly to confirm your donation appointment.
                    </div>
                    {adminPhone ? (
                      <a href={`tel:${adminPhone}`} className="pd-contact-phone">
                        📞 {adminPhone}
                        <span className="pd-contact-who"> (Admin / Hospital)</span>
                      </a>
                    ) : (
                      <span className="pd-contact-sub">
                        No phone number on file. Please check your email for contact details.
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Admin: close case */}
          {user?.role === "Admin" && project.status === "Active" && (
            <div className="pd-action-card pd-action-admin card">
              <div>
                <h3 className="pd-action-title">Close This Case</h3>
                <p className="pd-action-desc">
                  Mark this emergency as resolved once sufficient donors have been coordinated.
                </p>
              </div>
              <button
                className="btn btn-danger"
                onClick={handleClose}
                disabled={actionLoading}
              >
                {actionLoading ? (
                  <><span className="btn-spinner" style={{ borderTopColor: "#ff5252" }}></span> Closing...</>
                ) : (
                  "Close Emergency"
                )}
              </button>
            </div>
          )}

          {/* Admin: donor contact list */}
          {user?.role === "Admin" && (
            <div className="pd-responses">
              <div className="pd-responses-header">
                <h2 className="section-title" style={{ fontSize: "20px" }}>
                  Donor Volunteers
                </h2>
                <span className="badge badge-active">
                  {responses.length} responded
                </span>
              </div>

              {responses.length === 0 ? (
                <div className="pd-empty card">
                  <p>No responses yet.</p>
                  <span>Donors will appear here once they volunteer.</span>
                </div>
              ) : (
                <div className="pd-responses-list">
                  {responses.map((res, i) => (
                    <div
                      key={res._id}
                      className="pd-response-card card animate-in"
                      style={{ animationDelay: `${i * 0.05}s` }}
                    >
                      <div className="pd-donor-avatar">
                        {res.donorId?.name?.charAt(0).toUpperCase()}
                      </div>

                      <div className="pd-donor-details">
                        <div className="pd-donor-name">{res.donorId?.name}</div>
                        <div className="pd-donor-meta">
                          <span>✉ {res.donorId?.email}</span>
                          {res.donorId?.city && <span>📍 {res.donorId.city}</span>}
                        </div>
                      </div>

                      <div className="pd-donor-right">
                        {res.donorId?.bloodGroup && (
                          <div className="blood-tag" style={{ width: 36, height: 36, fontSize: 11 }}>
                            {res.donorId.bloodGroup}
                          </div>
                        )}
                        {res.donorId?.phone ? (
                          <a
                            href={`tel:${res.donorId.phone}`}
                            className="pd-call-btn btn btn-success btn-sm"
                          >
                            📞 {res.donorId.phone}
                          </a>
                        ) : (
                          <span className="pd-no-phone">No phone on file</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default ProjectDetails;