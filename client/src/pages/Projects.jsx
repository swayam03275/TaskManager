import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { createProject, fetchProjects } from "../api/projectApi.js";

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [form, setForm] = useState({ name: "", description: "" });
  const [error, setError] = useState(null);

  const load = async () => {
    try {
      const items = await fetchProjects();
      setProjects(items);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to load projects");
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleChange = (event) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await createProject(form);
      setForm({ name: "", description: "" });
      await load();
    } catch (err) {
      setError(err.response?.data?.message || "Unable to create project");
    }
  };

  return (
    <div className="d-flex flex-column gap-4">
      <div className="page-hero">
        <div className="d-flex flex-wrap justify-content-between align-items-center">
          <div>
            <h1 className="fw-bold mb-2">Projects</h1>
            <p className="mb-0">
              Create new projects and keep the pipeline moving.
            </p>
          </div>
          <span className="pill">Active work</span>
        </div>
      </div>
      <div className="row g-4">
        <div className="col-lg-4">
          <div className="panel">
            <h4 className="fw-bold">New project</h4>
            {error && <div className="alert alert-danger">{error}</div>}
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Name</label>
                <input
                  className="form-control"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Description</label>
                <textarea
                  className="form-control"
                  name="description"
                  rows="3"
                  value={form.description}
                  onChange={handleChange}
                />
              </div>
              <button className="btn btn-accent w-100">Create</button>
            </form>
          </div>
        </div>
        <div className="col-lg-8">
          <div className="panel">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h4 className="fw-bold mb-0">Projects</h4>
              <span className="text-muted small">{projects.length} total</span>
            </div>
            <div className="list-group">
              {projects.map((project) => (
                <Link
                  key={project._id}
                  className="list-group-item list-group-item-action d-flex flex-column gap-2"
                  to={`/projects/${project._id}`}
                >
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="fw-semibold">{project.name}</span>
                    <span className="badge bg-light text-dark badge-status">
                      {project.status}
                    </span>
                  </div>
                  <small className="text-muted">{project.description}</small>
                </Link>
              ))}
              {projects.length === 0 && (
                <div className="text-muted">No projects yet.</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Projects;
