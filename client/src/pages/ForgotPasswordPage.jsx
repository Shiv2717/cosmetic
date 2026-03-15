import { useState } from "react";
import { api } from "../lib/api";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    try {
      const result = await api.recoverPassword({ email });
      setMessage(`Reset token: ${result.resetToken}`);
    } catch (error) {
      setMessage(error.message);
    }
  }

  return (
    <section className="page">
      <h2>Password Recovery</h2>
      <form onSubmit={onSubmit}>
        <p>
          <label>Email</label><br />
          <input
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </p>
        <button className="btn" type="submit">Send Recovery Link</button>
      </form>
      {message && <p>{message}</p>}
    </section>
  );
}
