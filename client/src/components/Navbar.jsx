import { Link, useNavigate } from "react-router-dom";
import { clearSession, isLoggedIn } from "../lib/auth";

export default function Navbar() {
  const navigate = useNavigate();
  const loggedIn = isLoggedIn();

  function onLogout() {
    clearSession();
    navigate("/login");
  }

  return (
    <nav className="navbar">
      <div className="nav-brand">
        <span className="brand-dot" />
        <strong>GlowBeauty</strong>
      </div>
      <div className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/cart">Cart</Link>
        <Link to="/profile">Profile</Link>
        {loggedIn && <Link to="/history">History</Link>}
        {loggedIn && <Link to="/settings">Settings</Link>}
        {!loggedIn && <Link to="/login">Login</Link>}
        {!loggedIn && <Link to="/signup">Sign Up</Link>}
        {loggedIn && (
          <button className="btn" type="button" onClick={onLogout}>
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}
