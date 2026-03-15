import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../lib/api";
import { isLoggedIn } from "../lib/auth";

export default function OrderHistoryPage() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!isLoggedIn()) {
      navigate("/login");
      return;
    }

    async function loadOrders() {
      try {
        const data = await api.myOrders();
        setOrders(data);
      } catch (error) {
        setMessage(error.message);
      }
    }

    loadOrders();
  }, [navigate]);

  return (
    <section className="page">
      <h2>Order History</h2>
      <p className="notice">Track your previous purchases and payment status.</p>
      {message && <p className="msg-inline">{message}</p>}

      {orders.length ? (
        <div className="history-list">
          {orders.map((order) => (
            <article key={order._id} className="history-card">
              <div className="history-row">
                <strong>Order #{order._id.slice(-8).toUpperCase()}</strong>
                <span className="status-chip">{order.paymentStatus}</span>
              </div>
              <div className="history-row muted-row">
                <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                <span>Rs {order.totalAmount}</span>
              </div>
              <p className="history-items">
                {order.items.map((item) => `${item.name} x${item.quantity}`).join(", ")}
              </p>
              <p className="muted-row">Delivery: {order.deliveryAddress}</p>
            </article>
          ))}
        </div>
      ) : (
        <p>No previous orders yet.</p>
      )}
    </section>
  );
}
