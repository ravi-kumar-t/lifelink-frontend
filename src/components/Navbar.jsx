import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav style={{ display: "flex", gap: "20px", padding: "10px" }}>
      <Link to="/">Home</Link>
      {user && <Link to="/dashboard">Dashboard</Link>}
      {user?.role === "Admin" && <Link to="/create-project">Create Project</Link>}
      {user && <Link to="/profile">Profile</Link>}

      {user ? (
        <button onClick={logout}>Logout</button>
      ) : (
        <>
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
        </>
      )}
    </nav>
  );
};

export default Navbar;