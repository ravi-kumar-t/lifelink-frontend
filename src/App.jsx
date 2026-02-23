import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";

const Home = () => <h1>Home</h1>;
const Login = () => <h1>Login Page</h1>;
const Register = () => <h1>Register Page</h1>;
const Dashboard = () => <h1>Dashboard</h1>;

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;