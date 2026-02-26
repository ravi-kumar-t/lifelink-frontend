import { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { getAllProjects } from "../services/projectService";
import { respondToProject } from "../services/taskService";
import { AuthContext } from "../context/AuthContext";
import Loader from "../components/Loader";
import "./Dashboard.css";

const URGENCY_ORDER = { Critical: 0, High: 1, Medium: 2, Low: 3 };

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [respondedIds, setRespondedIds] = useState(new Set());

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await getAllProjects();
        const sorted = [...data].sort(
          (a, b) => URGENCY_ORDER[a.urgencyLevel] - URGENCY_ORDER[b.urgencyLevel]
        );
        setProjects(sorted);

        // Pre-populate responded IDs from backend — survives page reload
        const alreadyResponded = new Set(
          data
            .filter((p) => p.hasUserResponded)
            .map((p) => p._id)
        );
        setRespondedIds(alreadyResponded);
      } catch {
        toast.error("Failed to load emergency cases");
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const handleRespond = async (e, projectId) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await respondToProject(projectId);
      setRespondedIds((prev) => new Set([...prev, projectId]));
      toast.success("You've volunteered! Contact the hospital directly.");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to respond");
    }
  };

  const filtered = projects.filter((p) => {
    const matchesFilter =
      filter === "All" || filter === p.urgencyLevel || filter === p.status;
    const matchesSearch =
      !search ||
      p.requiredBloodGroup?.toLowerCase().includes(search.toLowerCase()) ||
      p.city?.toLowerCase().includes(search.toLowerCase()) ||
      p.hospitalName?.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const stats = {
    total: projects.length,
    critical: projects.filter((p) => p.urgencyLevel === "Critical").length,
    active: projects.filter((p) => p.status === "Active").length,
  };

  if (loading) return <Loader text="Fetching emergency cases..." />;

  return (
    <div className="page">
      <div className="dashboard-header animate-in">
        <div>
          <h1 className="section-title">Emergency Cases</h1>
          <p className="section-subtitle">Real-time blood donation requests</p>
        </div>
        {user?.role === "Admin" && (
          <Link to="/create-project" className="btn btn-primary">
            + New Emergency
          </Link>
        )}
      </div>

      <div className="dashboard-stats animate-in animate-in-delay-1">
        <div className="dash-stat card">
          <div className="stat-value">{stats.total}</div>
          <div className="stat-label">Total Cases</div>
        </div>
        <div className="dash-stat card">
          <div className="stat-value" style={{ color: "var(--red-bright)" }}>
            {stats.critical}
          </div>
          <div className="stat-label">Critical</div>
        </div>
        <div className="dash-stat card">
          <div className="stat-value" style={{ color: "var(--success)" }}>
            {stats.active}
          </div>
          <div className="stat-label">Active</div>
        </div>
      </div>

      <div className="dashboard-controls animate-in animate-in-delay-2">
        <div className="dashboard-filters">
          {["All", "Critical", "High", "Medium", "Low", "Active", "Closed"].map((f) => (
            <button
              key={f}
              className={`filter-btn ${filter === f ? "active" : ""}`}
              onClick={() => setFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>
        <input
          className="form-input dashboard-search"
          placeholder="Search by blood group, city, hospital..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {filtered.length === 0 ? (
        <div className="dashboard-empty card">
          <div className="dashboard-empty-icon">🩸</div>
          <p>No emergency cases match your filters.</p>
        </div>
      ) : (
        <div className="dashboard-grid">
          {filtered.map((project, i) => (
            <CaseCard
              key={project._id}
              project={project}
              index={i}
              user={user}
              hasResponded={respondedIds.has(project._id)}
              onRespond={handleRespond}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const CaseCard = ({ project, index, user, hasResponded, onRespond }) => {
  const urgencyClass = project.urgencyLevel?.toLowerCase();
  const isActive = project.status === "Active";
  const isDonor = user?.role === "User";
  const isAdmin = user?.role === "Admin";
  const responseCount = project.responseCount ?? 0;
  const hasResponses = responseCount > 0;

  return (
    <div
      className="case-card card animate-in"
      style={{ animationDelay: `${index * 0.05}s` }}
    >
      {/* Top row: blood tag + badges */}
      <div className="case-card-top">
        <div className="blood-tag">{project.requiredBloodGroup}</div>
        <div className="case-card-badges">
          <span className={`badge badge-${urgencyClass}`}>
            {project.urgencyLevel === "Critical" && "● "}
            {project.urgencyLevel}
          </span>
          <span className={`badge badge-${project.status?.toLowerCase()}`}>
            {project.status}
          </span>
        </div>
      </div>

      <h3 className="case-card-title">{project.title}</h3>

      {/* Meta row: info left, status block right */}
      <div className="case-card-body">
        <div className="case-card-meta">
          <div className="case-meta-item">
            <span className="case-meta-icon">🏥</span>
            <span>{project.hospitalName}</span>
          </div>
          <div className="case-meta-item">
            <span className="case-meta-icon">📍</span>
            <span>{project.city}</span>
          </div>
          <div className="case-meta-item">
            <span className="case-meta-icon">🩸</span>
            <span>{project.unitsRequired} units needed</span>
          </div>
        </div>

        {/* Admin — pulsing responder block on the right */}
        {isAdmin && (
          <div className={`case-responder-block ${hasResponses ? "has-responses" : "no-responses"}`}>
            {hasResponses && <div className="case-responder-pulse" />}
            <div className="case-responder-number">{responseCount}</div>
            <div className="case-responder-label">
              {hasResponses
                ? responseCount === 1 ? "Donor" : "Donors"
                : "None"}
            </div>
          </div>
        )}

        {/* Donor — responded block on the right */}
        {isDonor && hasResponded && (
          <div className="case-user-responded-block">
            <div className="case-responder-pulse case-responder-pulse-green" />
            <div className="case-user-responded-check">✓</div>
            <div className="case-user-responded-label">Responded</div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="case-card-footer">
        <Link to={`/projects/${project._id}`} className="case-view-link">
          {isAdmin ? "Manage Case →" : "View Details →"}
        </Link>

        {isDonor && isActive && !hasResponded && (
          <button
            className="btn btn-primary btn-sm case-respond-btn"
            onClick={(e) => onRespond(e, project._id)}
          >
            🩸 Respond
          </button>
        )}
      </div>
    </div>
  );
};

export default Dashboard;