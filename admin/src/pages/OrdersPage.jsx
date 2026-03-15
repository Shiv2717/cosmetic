import { useEffect, useState } from "react";
import { api } from "../lib/api";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    api.allOrders()
      .then(setOrders)
      .catch((err) => setMessage(err.message));
  }, []);

  return (
    <section className="panel">
      <h2>Orders Management</h2>
      {message && <p className="msg">{message}</p>}
      <table className="admin-table">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Payment Method</th>
            <th>Payment Status</th>
            <th>Total (Rs)</th>
            <th>Address</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {orders.length ? orders.map((order) => (
            <tr key={order._id}>
              <td style={{ fontSize: "0.75rem" }}>{order._id}</td>
              <td>{order.paymentMethod}</td>
              <td>
                <span className={`badge ${
                  order.paymentStatus === "Paid" ? "badge-green" :
                  order.paymentStatus === "Pending" ? "badge-yellow" : "badge-gray"
                }`}>
                  {order.paymentStatus}
                </span>
              </td>
              <td>{order.totalAmount}</td>
              <td style={{ fontSize: "0.8rem" }}>{order.deliveryAddress}</td>
              <td style={{ fontSize: "0.8rem" }}>{new Date(order.createdAt).toLocaleDateString()}</td>
            </tr>
          )) : (
            <tr><td colSpan="6">No orders found.</td></tr>
          )}
        </tbody>
      </table>
    </section>
  );
}
