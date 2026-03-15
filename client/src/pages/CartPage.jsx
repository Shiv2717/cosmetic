import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../lib/api";
import { isLoggedIn } from "../lib/auth";

export default function CartPage() {
  const navigate = useNavigate();
  const [cart, setCart] = useState(null);
  const [message, setMessage] = useState("");

  async function loadCart() {
    try {
      const data = await api.getCart();
      setCart(data);
    } catch (error) {
      setMessage(error.message);
    }
  }

  useEffect(() => {
    if (!isLoggedIn()) {
      navigate("/login");
      return;
    }
    loadCart();
  }, [navigate]);

  async function increaseQty(productId, currentQty) {
    try {
      const data = await api.updateCartItem(productId, { quantity: currentQty + 1 });
      setCart(data);
    } catch (error) {
      setMessage(error.message);
    }
  }

  async function removeItem(productId) {
    try {
      const data = await api.removeCartItem(productId);
      setCart(data);
    } catch (error) {
      setMessage(error.message);
    }
  }

  const total = useMemo(() => {
    if (!cart?.items?.length) {
      return 0;
    }
    return cart.items.reduce((sum, item) => sum + item.productId.price * item.quantity, 0);
  }, [cart]);

  return (
    <section className="page">
      <h2>Cart</h2>
      {message && <p>{message}</p>}
      <table width="100%">
        <thead>
          <tr>
            <th align="left">Product</th>
            <th align="left">Price</th>
            <th align="left">Quantity</th>
            <th align="left">Total</th>
            <th align="left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {cart?.items?.length ? (
            cart.items.map((item) => (
              <tr key={item.productId._id}>
                <td>{item.productId.name}</td>
                <td>Rs {item.productId.price}</td>
                <td>{item.quantity}</td>
                <td>Rs {item.productId.price * item.quantity}</td>
                <td>
                  <button
                    className="btn"
                    type="button"
                    onClick={() => increaseQty(item.productId._id, item.quantity)}
                  >
                    Increase Quantity
                  </button>
                  <button
                    className="btn"
                    type="button"
                    onClick={() => removeItem(item.productId._id)}
                    style={{ marginLeft: "0.5rem" }}
                  >
                    Remove Product
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5">Cart is empty</td>
            </tr>
          )}
        </tbody>
      </table>
      <h3 style={{ marginTop: "1rem" }}>Grand Total: Rs {total}</h3>
      <div style={{ marginTop: "1rem" }}>
        <Link to="/checkout">
          <button className="btn" type="button" disabled={!cart?.items?.length}>
            Proceed to Checkout
          </button>
        </Link>
      </div>
    </section>
  );
}
