import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import "./Home.css";

const Home = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className="home">
      <div className="home-hero">
        <div className="home-hero-eyebrow">
          <span className="badge badge-critical">● Live System</span>
        </div>
        <h1 className="home-hero-title">
          Every Drop<br />
          <span className="home-hero-accent">Saves a Life.</span>
        </h1>
        <p className="home-hero-desc">
          LifeLink connects emergency blood requests with willing donors in real time.
          Fast. Verified. Life-critical.
        </p>
        <div className="home-hero-actions">
          {user ? (
            <Link to="/dashboard" className="btn btn-primary btn-lg">
              View Emergency Cases
            </Link>
          ) : (
            <>
              <Link to="/register" className="btn btn-primary btn-lg">
                Become a Donor
              </Link>
              <Link to="/login" className="btn btn-outline btn-lg">
                Sign In
              </Link>
            </>
          )}
        </div>
      </div>

      <div className="home-stats">
        <div className="home-stat card animate-in animate-in-delay-1">
          <div className="stat-value">8</div>
          <div className="stat-label">Blood Types Supported</div>
        </div>
        <div className="home-stat card animate-in animate-in-delay-2">
          <div className="stat-value">24/7</div>
          <div className="stat-label">Emergency Response</div>
        </div>
        <div className="home-stat card animate-in animate-in-delay-3">
          <div className="stat-value">∞</div>
          <div className="stat-label">Lives to Save</div>
        </div>
      </div>

      <div className="home-how">
        <h2 className="section-title">How It Works</h2>
        <div className="home-steps">
          <div className="home-step card">
            <div className="home-step-num">01</div>
            <h3>Hospital Posts Case</h3>
            <p>Admins create emergency blood requests with urgency levels and required units.</p>
          </div>
          <div className="home-step card">
            <div className="home-step-num">02</div>
            <h3>Donors Respond</h3>
            <p>Registered donors browse active cases and volunteer to donate blood.</p>
          </div>
          <div className="home-step card">
            <div className="home-step-num">03</div>
            <h3>Admin Verifies</h3>
            <p>Admins approve and coordinate donors, then close the case when fulfilled.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;