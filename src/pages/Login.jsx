import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { AuthContext } from "../context/AuthContext";
import { loginUser } from "../services/authService";
import "./Auth.css";

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await loginUser(formData);
      login(data);
      toast.success("Welcome back!");
      navigate("/dashboard");
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
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
          Blood doesn't<br />wait. Neither<br />
          <span>should you.</span>
        </h2>
        <p className="auth-sub">
          Sign in to access the emergency blood response network.
        </p>
      </div>

      <div className="auth-right">
        <div className="auth-card card animate-in">
          <div className="auth-card-header">
            <h2 className="auth-title">Sign In</h2>
            <p className="auth-desc">Welcome back to LifeLink</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                className="form-input"
                type="email"
                name="email"
                placeholder="you@example.com"
                required
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                className="form-input"
                type="password"
                name="password"
                placeholder="••••••••"
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
                  Signing in...
                </>
              ) : (
                "Sign In →"
              )}
            </button>
          </form>

          <div className="auth-footer">
            <p>
              No account?{" "}
              <Link to="/register" className="auth-link">
                Register as a donor
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;