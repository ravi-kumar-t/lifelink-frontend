import { Link, useLocation } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import "./Navbar.css";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-brand">
          <span className="navbar-brand-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L4 6V12C4 16.4 7.4 20.5 12 22C16.6 20.5 20 16.4 20 12V6L12 2Z" fill="#C8102E" opacity="0.3"/>
              <path d="M12 2L4 6V12C4 16.4 7.4 20.5 12 22C16.6 20.5 20 16.4 20 12V6L12 2Z" stroke="#C8102E" strokeWidth="1.5" fill="none"/>
              <path d="M9 12H15M12 9V15" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </span>
          <span className="navbar-brand-text">LifeLink</span>
        </Link>

        <div className={`navbar-links ${menuOpen ? "open" : ""}`}>
          {user && (
            <Link
              to="/dashboard"
              className={`navbar-link ${isActive("/dashboard") ? "active" : ""}`}
              onClick={() => setMenuOpen(false)}
            >
              Dashboard
            </Link>
          )}
          {user?.role === "Admin" && (
            <Link
              to="/create-project"
              className={`navbar-link ${isActive("/create-project") ? "active" : ""}`}
              onClick={() => setMenuOpen(false)}
            >
              + New Case
            </Link>
          )}
          {user && (
            <Link
              to="/profile"
              className={`navbar-link ${isActive("/profile") ? "active" : ""}`}
              onClick={() => setMenuOpen(false)}
            >
              Profile
            </Link>
          )}
        </div>

        <div className="navbar-actions">
          {user ? (
            <div className="navbar-user">
              <div className="navbar-avatar">
                {user.name?.charAt(0).toUpperCase()}
              </div>
              <span className="navbar-username">{user.name?.split(" ")[0]}</span>
              <button className="btn btn-outline btn-sm" onClick={logout}>
                Logout
              </button>
            </div>
          ) : (
            <div className="navbar-auth">
              <Link to="/login" className="btn btn-outline btn-sm">Login</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Register</Link>
            </div>
          )}
        </div>

        <button
          className="navbar-hamburger"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;