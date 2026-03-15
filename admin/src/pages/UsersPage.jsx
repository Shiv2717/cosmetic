import { useEffect, useState } from "react";
import { api } from "../lib/api";

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    api.allUsers()
      .then(setUsers)
      .catch((err) => setMessage(err.message));
  }, []);

  return (
    <section className="panel">
      <h2>Users Management</h2>
      {message && <p className="msg">{message}</p>}
      <table className="admin-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Role</th>
            <th>Joined</th>
          </tr>
        </thead>
        <tbody>
          {users.length ? users.map((user) => (
            <tr key={user._id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.phone}</td>
              <td>
                <span className={`badge ${user.role === "admin" ? "badge-green" : "badge-gray"}`}>
                  {user.role}
                </span>
              </td>
              <td style={{ fontSize: "0.8rem" }}>{new Date(user.createdAt).toLocaleDateString()}</td>
            </tr>
          )) : (
            <tr><td colSpan="5">No users found.</td></tr>
          )}
        </tbody>
      </table>
    </section>
  );
}
