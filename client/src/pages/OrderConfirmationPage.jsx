import { useLocation } from "react-router-dom";

export default function OrderConfirmationPage() {
  const { state } = useLocation();
  const order = state?.order;

  if (!order) {
    return (
      <section className="page">
        <h2>Order Successful</h2>
        <p>Your order has been placed.</p>
      </section>
    );
  }

  return (
    <section className="page">
      <h2>Order Successful</h2>
      <p>Order ID: {order._id}</p>
      <p>
        Items: {order.items.map((item) => `${item.name} x${item.quantity}`).join(", ")}
      </p>
      <p>Delivery Address: {order.deliveryAddress}</p>
      <p>
        Estimated Delivery Date: {new Date(order.estimatedDeliveryDate).toLocaleDateString()}
      </p>
    </section>
  );
}
