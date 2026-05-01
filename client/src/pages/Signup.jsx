import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const Signup = () => {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState(null);

  const handleChange = (event) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    try {
      await signup(form);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="auth-shell">
      <div className="page-hero">
        <h1 className="fw-bold">Create your workspace</h1>
        <p className="mt-2">
          Bring projects, tasks, and teams under one focused dashboard.
        </p>
        <div className="mt-4 d-flex flex-wrap gap-3">
          <span className="pill">Admin control</span>
          <span className="pill">Task tracking</span>
          <span className="pill">Team visibility</span>
        </div>
      </div>
      <div className="auth-panel glass-panel">
        <h2 className="fw-bold">Signup</h2>
        <p className="text-muted">Start managing your team today.</p>
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Name</label>
            <input
              className="form-control"
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>
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
              minLength={8}
            />
          </div>
          <button className="btn btn-accent w-100" type="submit">
            Create account
          </button>
        </form>
      </div>
    </div>
  );
};

export default Signup;
