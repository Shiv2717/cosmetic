import { useEffect, useState } from "react";
import { api } from "../lib/api";

const EMPTY_FORM = { name: "", brand: "", description: "", price: "", category: "General", image: "", rating: "" };

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editId, setEditId] = useState(null);
  const [message, setMessage] = useState("");

  async function load() {
    try {
      const data = await api.products();
      setProducts(data);
    } catch (err) {
      setMessage(err.message);
    }
  }

  useEffect(() => { load(); }, []);

  function startEdit(product) {
    setEditId(product._id);
    setForm({
      name: product.name,
      brand: product.brand,
      description: product.description,
      price: product.price,
      category: product.category,
      image: product.image,
      rating: product.rating
    });
  }

  function cancelEdit() {
    setEditId(null);
    setForm(EMPTY_FORM);
    setMessage("");
  }

  async function onSubmit(e) {
    e.preventDefault();
    setMessage("");
    const payload = { ...form, price: Number(form.price), rating: Number(form.rating) };
    try {
      if (editId) {
        await api.updateProduct(editId, payload);
        setMessage("Product updated");
      } else {
        await api.addProduct(payload);
        setMessage("Product added");
      }
      cancelEdit();
      load();
    } catch (err) {
      setMessage(err.message);
    }
  }

  async function onDelete(id) {
    if (!window.confirm("Delete this product?")) return;
    try {
      await api.deleteProduct(id);
      load();
    } catch (err) {
      setMessage(err.message);
    }
  }

  return (
    <section className="panel">
      <h2>Products Management</h2>
      {message && <p className="msg">{message}</p>}

      <form className="admin-form" onSubmit={onSubmit}>
        <h3>{editId ? "Edit Product" : "Add Product"}</h3>
        <div className="form-row">
          <div className="form-group">
            <label>Name</label>
            <input value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} required />
          </div>
          <div className="form-group">
            <label>Brand</label>
            <input value={form.brand} onChange={(e) => setForm((p) => ({ ...p, brand: e.target.value }))} required />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Price (Rs)</label>
            <input type="number" min="0" value={form.price} onChange={(e) => setForm((p) => ({ ...p, price: e.target.value }))} required />
          </div>
          <div className="form-group">
            <label>Rating (0–5)</label>
            <input type="number" min="0" max="5" step="0.1" value={form.rating} onChange={(e) => setForm((p) => ({ ...p, rating: e.target.value }))} />
          </div>
          <div className="form-group">
            <label>Category</label>
            <select value={form.category} onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}>
              <option>General</option>
              <option>Lipstick</option>
              <option>Foundation</option>
              <option>Face Wash</option>
              <option>Perfume</option>
              <option>Nail Polish</option>
              <option>Skin Care</option>
            </select>
          </div>
        </div>
        <div className="form-group">
          <label>Image URL</label>
          <input value={form.image} onChange={(e) => setForm((p) => ({ ...p, image: e.target.value }))} />
        </div>
        <div className="form-group">
          <label>Description</label>
          <textarea rows="2" value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} />
        </div>
        <button className="btn" type="submit">{editId ? "Update Product" : "Add Product"}</button>
        {editId && <button className="btn btn-secondary" type="button" onClick={cancelEdit}>Cancel</button>}
      </form>

      <table className="admin-table">
        <thead>
          <tr>
            <th>Name</th><th>Brand</th><th>Category</th><th>Price</th><th>Rating</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.length ? products.map((p) => (
            <tr key={p._id}>
              <td>{p.name}</td>
              <td>{p.brand}</td>
              <td>{p.category}</td>
              <td>Rs {p.price}</td>
              <td>{p.rating}</td>
              <td>
                <button className="btn btn-sm" type="button" onClick={() => startEdit(p)}>Edit</button>
                <button className="btn btn-danger btn-sm" type="button" onClick={() => onDelete(p._id)}>Delete</button>
              </td>
            </tr>
          )) : (
            <tr><td colSpan="6">No products found.</td></tr>
          )}
        </tbody>
      </table>
    </section>
  );
}
