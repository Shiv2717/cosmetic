import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../lib/api";

export default function CheckoutPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullName: "",
    address: "",
    phone: "",
    pinCode: "",
    paymentMethod: "UPI"
  });
  const [message, setMessage] = useState("");

  async function onSubmit(e) {
    e.preventDefault();

    try {
      const order = await api.createOrder(form);

      if (form.paymentMethod !== "Cash on Delivery") {
        if (!window.Razorpay) {
          throw new Error("Razorpay SDK failed to load. Refresh and try again.");
        }

        const payment = await api.createPayment({ amount: order.totalAmount, orderId: order._id });

        await new Promise((resolve, reject) => {
          const razorpay = new window.Razorpay({
            key: payment.keyId,
            amount: payment.order.amount,
            currency: payment.order.currency,
            name: "GlowBeauty",
            description: `Order #${order._id}`,
            order_id: payment.order.id,
            prefill: {
              name: form.fullName,
              contact: form.phone
            },
            handler: async function onPaymentSuccess(response) {
              try {
                await api.verifyPayment({
                  orderId: order._id,
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature
                });
                resolve();
              } catch (error) {
                reject(error);
              }
            },
            modal: {
              ondismiss: () => reject(new Error("Payment cancelled"))
            }
          });

          razorpay.open();
        });
      }

      navigate("/order-success", { state: { order } });
    } catch (error) {
      setMessage(error.message);
    }
  }

  return (
    <section className="page">
      <h2>Checkout</h2>
      <form onSubmit={onSubmit}>
        <p>
          <label>Full Name</label><br />
          <input
            type="text"
            name="fullName"
            value={form.fullName}
            onChange={(e) => setForm((prev) => ({ ...prev, fullName: e.target.value }))}
            required
          />
        </p>
        <p>
          <label>Address</label><br />
          <textarea
            name="address"
            rows="3"
            value={form.address}
            onChange={(e) => setForm((prev) => ({ ...prev, address: e.target.value }))}
            required
          />
        </p>
        <p>
          <label>Phone Number</label><br />
          <input
            type="tel"
            name="phone"
            value={form.phone}
            onChange={(e) => setForm((prev) => ({ ...prev, phone: e.target.value }))}
            required
          />
        </p>
        <p>
          <label>Pin Code</label><br />
          <input
            type="text"
            name="pinCode"
            value={form.pinCode}
            onChange={(e) => setForm((prev) => ({ ...prev, pinCode: e.target.value }))}
            required
          />
        </p>
        <p>
          <label>Payment Method</label><br />
          <select
            name="paymentMethod"
            value={form.paymentMethod}
            onChange={(e) => setForm((prev) => ({ ...prev, paymentMethod: e.target.value }))}
          >
            <option>UPI</option>
            <option>Credit Card</option>
            <option>Debit Card</option>
            <option>Net Banking</option>
            <option>Cash on Delivery</option>
          </select>
        </p>
        <button className="btn" type="submit">Place Order</button>
      </form>
      {message && <p>{message}</p>}
    </section>
  );
}
