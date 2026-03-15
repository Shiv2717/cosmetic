import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../lib/api";
import { setSession } from "../lib/auth";

export default function LoginPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    try {
      const result = await api.login(form);
      setSession(result.token, result.user);
      setMessage("Login successful");
      navigate("/");
    } catch (error) {
      setMessage(error.message);
    }
  }

  return (
    <section className="page">
      <h2>Login</h2>
      <form onSubmit={onSubmit}>
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
          <label>Password</label><br />
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
            required
          />
        </p>
        <button className="btn" type="submit">Login</button>
      </form>
      {message && <p>{message}</p>}
    </section>
  );
}
