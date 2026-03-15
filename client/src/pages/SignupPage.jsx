import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../lib/api";
import { setSession } from "../lib/auth";

export default function SignupPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });
  const [message, setMessage] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    try {
      const result = await api.signup(form);
      setSession(result.token, result.user);
      setMessage("Account created");
      navigate("/");
    } catch (error) {
      setMessage(error.message);
    }
  }

  return (
    <section className="page">
      <h2>Sign Up</h2>
      <form onSubmit={onSubmit}>
        <p>
          <label>Name</label><br />
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
            required
          />
        </p>
        <p>
          <label>Email</label><br />
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
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
          <label>Password</label><br />
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
            required
          />
        </p>
        <button className="btn" type="submit">Create Account</button>
      </form>
      {message && <p>{message}</p>}
    </section>
  );
}
