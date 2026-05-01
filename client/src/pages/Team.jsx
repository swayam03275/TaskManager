import { useEffect, useState } from "react";
import { addMember, fetchProjects } from "../api/projectApi.js";
import { fetchUsers } from "../api/userApi.js";

const Team = () => {
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [form, setForm] = useState({
    projectId: "",
    userId: "",
    role: "member",
  });

  const load = async () => {
    try {
      const [projectList, userList] = await Promise.all([
        fetchProjects(),
        fetchUsers(),
      ]);
      setProjects(projectList);
      setUsers(userList);
      setError(null);
      if (!form.projectId && projectList.length > 0) {
        setForm((prev) => ({ ...prev, projectId: projectList[0]._id }));
      }
    } catch (err) {
      setError(err.response?.data?.message || "Unable to load team data");
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
    setError(null);
    setSuccess(null);
    try {
      await addMember(form.projectId, {
        userId: form.userId,
        role: form.role,
      });
      setSuccess("Member successfully assigned to the project!");
      await load();
    } catch (err) {
      setError(err.response?.data?.message || "Unable to add member");
    }
  };

  return (
    <div className="d-flex flex-column gap-4">
      <div className="page-hero">
        <div className="d-flex flex-wrap justify-content-between align-items-center">
          <div>
            <h1 className="fw-bold mb-2">Team management</h1>
            <p className="mb-0">
              Assign people to the right projects and roles.
            </p>
          </div>
          <span className="pill">Admin only</span>
        </div>
      </div>
      <div className="row g-4">
        <div className="col-lg-6">
          <div className="panel">
            <h4 className="fw-bold">Add team member</h4>
            {error && <div className="alert alert-danger">{error}</div>}
            {success && <div className="alert alert-success">{success}</div>}
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Project</label>
                <select
                  className="form-select"
                  name="projectId"
                  value={form.projectId}
                  onChange={handleChange}
                  required
                >
                  {projects.map((project) => (
                    <option key={project._id} value={project._id}>
                      {project.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-3">
                <label className="form-label">User</label>
                <select
                  className="form-select"
                  name="userId"
                  value={form.userId}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select a user</option>
                  {users.map((user) => (
                    <option key={user._id} value={user._id}>
                      {user.name} ({user.email})
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-3">
                <label className="form-label">Role</label>
                <select
                  className="form-select"
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                >
                  <option value="member">Member</option>
                  <option value="owner">Owner</option>
                </select>
              </div>
              <button className="btn btn-accent w-100">Add member</button>
            </form>
          </div>
        </div>
        <div className="col-lg-6">
          <div className="panel">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h4 className="fw-bold mb-0">Projects overview</h4>
              <span className="text-muted small">
                {projects.length} projects
              </span>
            </div>
            {projects.map((project) => (
              <div key={project._id} className="mb-3">
                <div className="fw-semibold">{project.name}</div>
                <div className="text-muted small">
                  Members: {project.members?.length || 0}
                </div>
              </div>
            ))}
            {projects.length === 0 && (
              <div className="text-muted">No projects yet.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Team;
