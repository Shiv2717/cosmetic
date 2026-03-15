import { getToken } from "./auth";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

async function request(path, options = {}) {
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {})
  };

  const token = getToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });

  let data = null;
  try {
    data = await res.json();
  } catch (_e) {
    data = null;
  }

  if (!res.ok) {
    throw new Error(data?.message || "Request failed");
  }

  return data;
}

export const api = {
  // Auth
  login: (body) => request("/auth/login", { method: "POST", body: JSON.stringify(body) }),

  // Stats
  stats: () => request("/admin/stats"),

  // Products
  products: () => request("/products"),
  addProduct: (body) => request("/admin/products", { method: "POST", body: JSON.stringify(body) }),
  updateProduct: (id, body) =>
    request(`/admin/products/${id}`, { method: "PATCH", body: JSON.stringify(body) }),
  deleteProduct: (id) => request(`/admin/products/${id}`, { method: "DELETE" }),

  // Orders
  allOrders: () => request("/admin/orders"),

  // Users
  allUsers: () => request("/admin/users")
};
