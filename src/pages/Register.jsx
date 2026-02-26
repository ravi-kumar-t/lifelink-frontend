import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { registerUser } from "../services/authService";
import "./Auth.css";

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    bloodGroup: "",
    phone: "",
    city: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await registerUser(formData);
      toast.success("Registration successful!");
      navigate("/login");
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page auth-page-register">
      <div className="auth-left">
        <div className="auth-brand-mark">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
            <path d="M12 2L4 6V12C4 16.4 7.4 20.5 12 22C16.6 20.5 20 16.4 20 12V6L12 2Z"
              fill="#C8102E" opacity="0.2"/>
            <path d="M12 2L4 6V12C4 16.4 7.4 20.5 12 22C16.6 20.5 20 16.4 20 12V6L12 2Z"
              stroke="#C8102E" strokeWidth="1.5" fill="none"/>
            <path d="M9 12H15M12 9V15" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
          </svg>
        </div>
        <h2 className="auth-tagline">
          Your blood<br />can write<br />
          <span>someone's story.</span>
        </h2>
        <p className="auth-sub">
          Join thousands of donors saving lives across the country.
        </p>
      </div>

      <div className="auth-right">
        <div className="auth-card card animate-in">
          <div className="auth-card-header">
            <h2 className="auth-title">Create Account</h2>
            <p className="auth-desc">Register as a blood donor</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="auth-form-grid">
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input
                  className="form-input"
                  name="name"
                  placeholder="John Doe"
                  required
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Email</label>
                <input
                  className="form-input"
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  required
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                className="form-input"
                type="password"
                name="password"
                placeholder="Min. 8 characters"
                required
                onChange={handleChange}
              />
            </div>

            <div className="auth-form-grid">
              <div className="form-group">
                <label className="form-label">Blood Group</label>
                <select
                  className="form-input"
                  name="bloodGroup"
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
                <label className="form-label">Phone</label>
                <input
                  className="form-input"
                  name="phone"
                  placeholder="+91 98765 43210"
                  required
                  onChange={handleChange}
                />
              </div>
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

            <button
              type="submit"
              className="btn btn-primary btn-lg auth-submit"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="btn-spinner"></span>
                  Creating account...
                </>
              ) : (
                "Create Account →"
              )}
            </button>
          </form>

          <div className="auth-footer">
            <p>
              Already registered?{" "}
              <Link to="/login" className="auth-link">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;