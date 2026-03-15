import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { api } from "../lib/api";
import { clearSession, isLoggedIn } from "../lib/auth";
import { syncWishlistFromServer } from "../lib/shoppingPrefs";

export default function ProfilePage() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [orders, setOrders] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [form, setForm] = useState({ name: "", phone: "", address: "" });
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!isLoggedIn()) {
      navigate("/login");
      return;
    }

    async function load() {
      try {
        const [profileData, ordersData] = await Promise.all([api.profile(), api.myOrders()]);
        setProfile(profileData);
        setOrders(ordersData);
        setWishlist(await syncWishlistFromServer());
        setForm({
          name: profileData.name || "",
          phone: profileData.phone || "",
          address: profileData.address || ""
        });
      } catch (error) {
        setMessage(error.message);
      }
    }

    load();
  }, [navigate]);

  async function onSave(e) {
    e.preventDefault();
    try {
      const updated = await api.updateProfile(form);
      setProfile(updated);
      setMessage("Profile updated");
    } catch (error) {
      setMessage(error.message);
    }
  }

  function onLogout() {
    clearSession();
    navigate("/login");
  }

  return (
    <section className="page">
      <h2>User Profile</h2>
      {message && <p>{message}</p>}

      {profile && (
        <>
          <p>Email: {profile.email}</p>
          <form onSubmit={onSave}>
            <p>
              <label>Name</label><br />
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
              />
            </p>
            <p>
              <label>Phone</label><br />
              <input
                type="text"
                value={form.phone}
                onChange={(e) => setForm((prev) => ({ ...prev, phone: e.target.value }))}
              />
            </p>
            <p>
              <label>Saved Address</label><br />
              <textarea
                rows="2"
                value={form.address}
                onChange={(e) => setForm((prev) => ({ ...prev, address: e.target.value }))}
              />
            </p>
            <button className="btn" type="submit">Edit Profile</button>
          </form>
        </>
      )}

      <h3 style={{ marginTop: "1rem" }}>My Orders</h3>
      {orders.length ? (
        <ul>
          {orders.map((order) => (
            <li key={order._id}>
              {order._id} | Rs {order.totalAmount} | {order.paymentStatus}
            </li>
          ))}
        </ul>
      ) : (
        <p>No orders yet.</p>
      )}

      <h3 style={{ marginTop: "1rem" }}>Saved Items</h3>
      {wishlist.length ? (
        <div className="saved-grid">
          {wishlist.map((item) => (
            <article key={item._id || item.id} className="saved-card">
              <img src={item.image} alt={item.name} />
              <div>
                <strong>{item.name}</strong>
                <p>{item.brand}</p>
                <p>Rs {item.price}</p>
                <Link to={`/product/${item._id || item.id}`}>View Product</Link>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <p>No saved items yet.</p>
      )}

      <button className="btn" type="button" onClick={onLogout}>Logout</button>
    </section>
  );
}
