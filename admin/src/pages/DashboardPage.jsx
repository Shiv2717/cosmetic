import { useEffect, useState } from "react";
import { api } from "../lib/api";

export default function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api.stats()
      .then(setStats)
      .catch((err) => setError(err.message));
  }, []);

  return (
    <section className="panel">
      <h1 style={{ marginTop: 0 }}>Dashboard</h1>
      {error && <p className="msg">{error}</p>}
      {stats ? (
        <div className="stats-grid">
          <div className="stat-card">
            <span className="stat-num">{stats.totalProducts}</span>
            <span className="stat-label">Products</span>
          </div>
          <div className="stat-card">
            <span className="stat-num">{stats.totalOrders}</span>
            <span className="stat-label">Orders</span>
          </div>
          <div className="stat-card">
            <span className="stat-num">{stats.totalUsers}</span>
            <span className="stat-label">Users</span>
          </div>
          <div className="stat-card">
            <span className="stat-num">Rs {stats.totalRevenue}</span>
            <span className="stat-label">Revenue (Paid)</span>
          </div>
        </div>
      ) : (
        !error && <p>Loading stats...</p>
      )}
    </section>
  );
}
