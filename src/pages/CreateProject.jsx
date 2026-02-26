import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { createProject } from "../services/projectService";
import "./CreateProject.css";

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];
const URGENCY_LEVELS = ["Low", "Medium", "High", "Critical"];

const URGENCY_DESC = {
  Low: "Patient is stable. Donation needed within days.",
  Medium: "Required within 24–48 hours.",
  High: "Urgent — needed within hours.",
  Critical: "Life-threatening. Immediate response needed.",
};

const CreateProject = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    hospitalName: "",
    city: "",
    requiredBloodGroup: "",
    unitsRequired: "",
    urgencyLevel: "Medium",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createProject(formData);
      toast.success("Emergency case created!");
      navigate("/dashboard");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create case");
    } finally {
      setLoading(false);
    }
  };

  const urgencyClass = formData.urgencyLevel?.toLowerCase();

  return (
    <div className="page">
      <div className="cp-container animate-in">
        <div className="cp-header">
          <h1 className="section-title">Create Emergency Case</h1>
          <p className="section-subtitle">
            Post a blood donation request that donors can respond to immediately.
          </p>
        </div>

        <div className="cp-layout">
          <form onSubmit={handleSubmit} className="cp-form card">
            <div className="cp-form-section">
              <div className="cp-section-label">Case Info</div>
              <div className="form-group">
                <label className="form-label">Case Title</label>
                <input
                  className="form-input"
                  name="title"
                  placeholder='e.g. "O+ Needed Urgently for Surgery"'
                  required
                  onChange={handleChange}
                />
              </div>

              <div className="cp-form-row">
                <div className="form-group">
                  <label className="form-label">Hospital Name</label>
                  <input
                    className="form-input"
                    name="hospitalName"
                    placeholder="City General Hospital"
                    required
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">City</label>
                  <input
                    className="form-input"
                    name="city"
                    placeholder="Mumbai"
                    required
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            <div className="divider"></div>

            <div className="cp-form-section">
              <div className="cp-section-label">Blood Requirements</div>

              <div className="cp-form-row">
                <div className="form-group">
                  <label className="form-label">Blood Group</label>
                  <select
                    className="form-input"
                    name="requiredBloodGroup"
                    required
                    onChange={handleChange}
                    defaultValue=""
                  >
                    <option value="" disabled>Select type</option>
                    {BLOOD_GROUPS.map((bg) => (
                      <option key={bg} value={bg}>{bg}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Units Required</label>
                  <input
                    className="form-input"
                    type="number"
                    name="unitsRequired"
                    placeholder="e.g. 3"
                    min="1"
                    required
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            <div className="divider"></div>

            <div className="cp-form-section">
              <div className="cp-section-label">Urgency Level</div>
              <div className="cp-urgency-grid">
                {URGENCY_LEVELS.map((level) => (
                  <label
                    key={level}
                    className={`cp-urgency-option ${formData.urgencyLevel === level ? "selected" : ""}`}
                  >
                    <input
                      type="radio"
                      name="urgencyLevel"
                      value={level}
                      checked={formData.urgencyLevel === level}
                      onChange={handleChange}
                    />
                    <span className={`badge badge-${level.toLowerCase()}`}>{level}</span>
                    <span className="cp-urgency-desc">{URGENCY_DESC[level]}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="cp-submit-row">
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => navigate("/dashboard")}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary btn-lg"
                disabled={loading}
              >
                {loading ? (
                  <><span className="btn-spinner"></span> Creating...</>
                ) : (
                  "Create Emergency Case"
                )}
              </button>
            </div>
          </form>

          {/* Preview Panel */}
          <div className="cp-preview">
            <div className="cp-preview-label">Live Preview</div>
            <div className="card cp-preview-card">
              <div className="cp-preview-top">
                <div className="blood-tag">
                  {formData.requiredBloodGroup || "?"}
                </div>
                <span className={`badge badge-${urgencyClass}`}>
                  {formData.urgencyLevel}
                </span>
              </div>
              <div className="cp-preview-title">
                {formData.title || "Case title will appear here"}
              </div>
              <div className="case-card-meta" style={{ marginTop: 4 }}>
                <div className="case-meta-item">
                  <span className="case-meta-icon">🏥</span>
                  <span>{formData.hospitalName || "Hospital name"}</span>
                </div>
                <div className="case-meta-item">
                  <span className="case-meta-icon">📍</span>
                  <span>{formData.city || "City"}</span>
                </div>
                <div className="case-meta-item">
                  <span className="case-meta-icon">🩸</span>
                  <span>{formData.unitsRequired ? `${formData.unitsRequired} units needed` : "Units required"}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateProject;