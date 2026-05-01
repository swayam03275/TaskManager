import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchProject } from "../api/projectApi.js";
import { createTask, fetchTasks, updateTask } from "../api/taskApi.js";
import { useAuth } from "../context/AuthContext.jsx";

const ProjectDetail = () => {
  const { projectId } = useParams();
  const { user } = useAuth();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    assignee: "",
  });
  const [error, setError] = useState(null);

  const load = async () => {
    try {
      const data = await fetchProject(projectId);
      const taskList = await fetchTasks(projectId);
      setProject(data);
      setTasks(taskList);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to load project");
    }
  };

  useEffect(() => {
    load();
  }, [projectId]);

  const handleChange = (event) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const payload = { ...form };
      if (!payload.assignee) {
        delete payload.assignee;
      }
      await createTask(projectId, payload);
      setForm({ title: "", description: "", assignee: "" });
      await load();
    } catch (err) {
      setError(err.response?.data?.message || "Unable to add task");
    }
  };

  const handleStatusChange = async (taskId, status) => {
    try {
      await updateTask(taskId, { status });
      await load();
    } catch (err) {
      setError(err.response?.data?.message || "Unable to update task");
    }
  };

  const handleAssigneeChange = async (taskId, assigneeId) => {
    try {
      // If assigneeId is empty, we send null to unassign.
      await updateTask(taskId, { assignee: assigneeId || null });
      await load();
    } catch (err) {
      setError(err.response?.data?.message || "Unable to update task assignee");
    }
  };

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  if (!project) {
    return <div>Loading project...</div>;
  }

  const isAdminOrOwner =
    user?.role === "admin" ||
    (project?.owner && project.owner._id === user?._id);

  // Get project members including owner for the dropdown
  const assignableUsers = project?.owner
    ? [project.owner, ...project.members.map((m) => m.user)]
    : [];

  // Deduplicate assignable users just in case
  const uniqueAssignableUsers = [];
  const seenIds = new Set();
  assignableUsers.forEach((u) => {
    if (u && !seenIds.has(u._id)) {
      seenIds.add(u._id);
      uniqueAssignableUsers.push(u);
    }
  });

  return (
    <div className="d-flex flex-column gap-4">
      <div className="page-hero">
        <div className="d-flex flex-wrap justify-content-between align-items-center">
          <div>
            <h1 className="fw-bold mb-2">{project.name}</h1>
            <p className="mb-0">{project.description || "Project overview"}</p>
          </div>
          <span className="pill">{project.status}</span>
        </div>
      </div>
      <div className="row g-4">
        <div className="col-lg-4">
          <div className="panel">
            <h5 className="fw-bold">New task</h5>
            <form onSubmit={handleSubmit}>
              <div className="mb-2">
                <label className="form-label">Title</label>
                <input
                  className="form-control"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-2">
                <label className="form-label">Description</label>
                <textarea
                  className="form-control"
                  name="description"
                  rows="3"
                  value={form.description}
                  onChange={handleChange}
                />
              </div>
              {isAdminOrOwner && (
                <div className="mb-3">
                  <label className="form-label">Assignee</label>
                  <select
                    className="form-select"
                    name="assignee"
                    value={form.assignee}
                    onChange={handleChange}
                  >
                    <option value="">Unassigned</option>
                    {uniqueAssignableUsers.map((u) => (
                      <option key={u._id} value={u._id}>
                        {u.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              <button className="btn btn-accent w-100">Add task</button>
            </form>
          </div>
        </div>
        <div className="col-lg-8">
          <div className="panel">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="fw-bold mb-0">Tasks</h5>
              <span className="text-muted small">{tasks.length} items</span>
            </div>
            <div className="list-group">
              {tasks.map((task) => (
                <div key={task._id} className="list-group-item">
                  <div className="d-flex justify-content-between gap-3 flex-wrap">
                    <div>
                      <div className="fw-semibold">{task.title}</div>
                      <small className="text-muted d-block">
                        {task.description}
                      </small>
                      <small className="text-primary mt-1 d-block fw-semibold">
                        {task.taken
                          ? `Taken by ${task.assignee?.name}`
                          : "Unassigned"}
                      </small>
                    </div>
                    <div className="d-flex gap-2 align-items-center">
                      {isAdminOrOwner && (
                        <select
                          style={{ minWidth: "140px" }}
                          className="form-select w-auto"
                          value={task.assignee?._id || ""}
                          onChange={(e) =>
                            handleAssigneeChange(task._id, e.target.value)
                          }
                        >
                          <option value="">Unassigned</option>
                          {uniqueAssignableUsers.map((u) => (
                            <option key={u._id} value={u._id}>
                              {u.name}
                            </option>
                          ))}
                        </select>
                      )}
                      <select
                        style={{ minWidth: "120px" }}
                        className="form-select w-auto"
                        value={task.status}
                        onChange={(event) =>
                          handleStatusChange(task._id, event.target.value)
                        }
                      >
                        <option value="todo">To Do</option>
                        <option value="in_progress">In Progress</option>
                        <option value="done">Done</option>
                      </select>
                    </div>
                  </div>
                </div>
              ))}
              {tasks.length === 0 && (
                <div className="text-muted">No tasks yet.</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;
