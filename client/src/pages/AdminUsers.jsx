import { useEffect, useState } from "react";
import { fetchUsers, updateRole } from "../api/userApi.js";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);

  const load = async () => {
    try {
      const list = await fetchUsers();
      setUsers(list);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to load users");
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleRoleChange = async (userId, role) => {
    try {
      await updateRole(userId, role);
      await load();
    } catch (err) {
      setError(err.response?.data?.message || "Unable to update role");
    }
  };

  return (
    <div className="d-flex flex-column gap-4">
      <div className="page-hero">
        <div className="d-flex flex-wrap justify-content-between align-items-center">
          <div>
            <h1 className="fw-bold mb-2">Admin control</h1>
            <p className="mb-0">
              Manage roles and access across the workspace.
            </p>
          </div>
          <span className="pill">Admin only</span>
        </div>
      </div>
      <div className="panel">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h4 className="fw-bold mb-0">User management</h4>
          <span className="text-muted small">{users.length} users</span>
        </div>
        {error && <div className="alert alert-danger">{error}</div>}
        <table className="table align-middle">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>
                  <select
                    className="form-select"
                    value={user.role}
                    onChange={(event) =>
                      handleRoleChange(user._id, event.target.value)
                    }
                  >
                    <option value="admin">Admin</option>
                    <option value="member">Member</option>
                  </select>
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan="3" className="text-muted">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminUsers;
