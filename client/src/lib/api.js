import { getToken } from "./auth";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export async function apiRequest(path, options = {}) {
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {})
  };

  const token = getToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers
  });

  let payload = null;
  try {
    payload = await response.json();
  } catch (_error) {
    payload = null;
  }

  if (!response.ok) {
    throw new Error(payload?.message || "Request failed");
  }

  return payload;
}

export const api = {
  signup: (body) => apiRequest("/auth/signup", { method: "POST", body: JSON.stringify(body) }),
  login: (body) => apiRequest("/auth/login", { method: "POST", body: JSON.stringify(body) }),
  recoverPassword: (body) =>
    apiRequest("/auth/recover-password", { method: "POST", body: JSON.stringify(body) }),

  products: () => apiRequest("/products"),
  productById: (id) => apiRequest(`/products/${id}`),

  getCart: () => apiRequest("/cart"),
  addToCart: (body) => apiRequest("/cart", { method: "POST", body: JSON.stringify(body) }),
  updateCartItem: (id, body) =>
    apiRequest(`/cart/${id}`, { method: "PATCH", body: JSON.stringify(body) }),
  removeCartItem: (id) => apiRequest(`/cart/${id}`, { method: "DELETE" }),

  createOrder: (body) => apiRequest("/orders", { method: "POST", body: JSON.stringify(body) }),
  myOrders: () => apiRequest("/orders/my"),

  createPayment: (body) =>
    apiRequest("/payments/create", { method: "POST", body: JSON.stringify(body) }),
  verifyPayment: (body) =>
    apiRequest("/payments/verify", { method: "POST", body: JSON.stringify(body) }),

  profile: () => apiRequest("/profile"),
  updateProfile: (body) => apiRequest("/profile", { method: "PATCH", body: JSON.stringify(body) }),
  wishlist: () => apiRequest("/profile/wishlist"),
  toggleWishlist: (body) =>
    apiRequest("/profile/wishlist/toggle", { method: "POST", body: JSON.stringify(body) }),
  recentlyViewed: () => apiRequest("/profile/recently-viewed"),
  pushRecentlyViewed: (body) =>
    apiRequest("/profile/recently-viewed", { method: "POST", body: JSON.stringify(body) })
};
