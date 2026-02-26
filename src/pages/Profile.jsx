import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Loader from "../components/Loader";
import { getCurrentUser } from "../services/authService";
import "./Profile.css";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getCurrentUser();
        setUser(data);
      } catch {
        toast.error("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) return <Loader text="Loading profile..." />;
  if (!user) return (
    <div className="page" style={{ textAlign: "center", paddingTop: "80px" }}>
      <p style={{ color: "var(--text-muted)" }}>Profile not found.</p>
    </div>
  );

  const initials = user.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="page">
      <div className="profile-container animate-in">
        {/* Profile Header */}
        <div className="profile-header card">
          <div className="profile-avatar-wrap">
            <div className="profile-avatar">{initials}</div>
            <div className={`profile-status-dot ${user.isAvailable ? "online" : "offline"}`}></div>
          </div>
          <div className="profile-header-info">
            <h1 className="profile-name">{user.name}</h1>
            <p className="profile-email">{user.email}</p>
            <div className="profile-header-badges">
              <span className={`badge ${user.role === "Admin" ? "badge-high" : "badge-active"}`}>
                {user.role}
              </span>
              <span className={`badge ${user.isAvailable ? "badge-active" : "badge-closed"}`}>
                {user.isAvailable ? "● Available to donate" : "Unavailable"}
              </span>
            </div>
          </div>
          {user.bloodGroup && (
            <div className="blood-tag blood-tag-lg profile-blood">
              {user.bloodGroup}
            </div>
          )}
        </div>

        {/* Info Cards */}
        <div className="profile-grid">
          <div className="profile-info-card card">
            <div className="profile-card-title">Personal Details</div>
            <div className="profile-fields">
              <div className="profile-field">
                <span className="profile-field-label">Full Name</span>
                <span className="profile-field-value">{user.name}</span>
              </div>
              <div className="profile-field">
                <span className="profile-field-label">Email</span>
                <span className="profile-field-value">{user.email}</span>
              </div>
              <div className="profile-field">
                <span className="profile-field-label">Phone</span>
                <span className="profile-field-value">{user.phone || "—"}</span>
              </div>
              <div className="profile-field">
                <span className="profile-field-label">City</span>
                <span className="profile-field-value">{user.city || "—"}</span>
              </div>
            </div>
          </div>

          <div className="profile-info-card card">
            <div className="profile-card-title">Donor Information</div>
            <div className="profile-fields">
              <div className="profile-field">
                <span className="profile-field-label">Blood Group</span>
                <span className="profile-field-value profile-field-blood">
                  {user.bloodGroup || "—"}
                </span>
              </div>
              <div className="profile-field">
                <span className="profile-field-label">Role</span>
                <span className="profile-field-value">{user.role}</span>
              </div>
              <div className="profile-field">
                <span className="profile-field-label">Availability</span>
                <span
                  className="profile-field-value"
                  style={{ color: user.isAvailable ? "var(--success)" : "var(--text-dim)" }}
                >
                  {user.isAvailable ? "Available to donate" : "Not available"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;