import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState(null);

  const handleChange = (event) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    try {
      await login(form);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="auth-shell">
      <div className="page-hero">
        <h1 className="fw-bold">Welcome back</h1>
        <p className="mt-2">
          Track priorities, unblock projects, and keep everyone aligned.
        </p>
        <div className="mt-4 d-flex flex-wrap gap-3">
          <span className="pill">Live status</span>
          <span className="pill">Team insights</span>
          <span className="pill">Project control</span>
        </div>
      </div>
      <div className="auth-panel glass-panel">
        <h2 className="fw-bold">Login</h2>
        <p className="text-muted">Access your workspace and tasks.</p>
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              className="form-control"
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              className="form-control"
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>
          <button className="btn btn-accent w-100" type="submit">
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
