import { Link, Route, Routes, useNavigate } from "react-router-dom";
import DashboardPage from "./pages/DashboardPage";
import ProductsPage from "./pages/ProductsPage";
import OrdersPage from "./pages/OrdersPage";
import UsersPage from "./pages/UsersPage";
import LoginPage from "./pages/LoginPage";
import RequireAdmin from "./components/RequireAdmin";
import { clearSession, isLoggedIn } from "./lib/auth";

function AdminLayout() {
  const navigate = useNavigate();

  function onLogout() {
    clearSession();
    navigate("/login");
  }

  return (
    <div className="admin-layout">
      <aside>
        <h2 style={{ marginTop: 0 }}>GlowBeauty</h2>
        <p style={{ fontSize: "0.75rem", color: "#9ca3af", marginTop: 0 }}>Admin Panel</p>
        <nav>
          <Link to="/">Dashboard</Link>
          <Link to="/products">Products</Link>
          <Link to="/orders">Orders</Link>
          <Link to="/users">Users</Link>
        </nav>
        <button className="btn-logout" type="button" onClick={onLogout}>
          Logout
        </button>
      </aside>
      <main>
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/users" element={<UsersPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/*"
        element={
          <RequireAdmin>
            <AdminLayout />
          </RequireAdmin>
        }
      />
    </Routes>
  );
}
