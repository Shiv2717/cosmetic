import { api } from "./api";
import { getToken } from "./auth";

const WISHLIST_KEY = "glowbeauty_wishlist";
const RECENT_KEY = "glowbeauty_recently_viewed";

function safeParse(raw, fallback) {
  try {
    return raw ? JSON.parse(raw) : fallback;
  } catch (_error) {
    return fallback;
  }
}

function getProductId(product) {
  return product?._id || product?.id || "";
}

function normalizeProduct(product) {
  return {
    _id: product?._id,
    id: product?.id,
    name: product?.name || "",
    brand: product?.brand || "",
    category: product?.category || "General",
    price: Number(product?.price || 0),
    rating: Number(product?.rating || 0),
    image: product?.image || "",
    description: product?.description || "",
    createdAt: product?.createdAt || new Date().toISOString()
  };
}

export function getWishlist() {
  return safeParse(localStorage.getItem(WISHLIST_KEY), []);
}

export async function syncWishlistFromServer() {
  if (!getToken()) {
    return getWishlist();
  }

  try {
    const items = await api.wishlist();
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(items || []));
    return items || [];
  } catch (_error) {
    return getWishlist();
  }
}

export async function isWishlisted(productId) {
  if (!productId) {
    return false;
  }

  await syncWishlistFromServer();
  return getWishlist().some((item) => getProductId(item) === productId);
}

export async function toggleWishlist(product) {
  const productId = getProductId(product);
  if (!productId) {
    return { added: false, items: getWishlist() };
  }

  if (getToken()) {
    try {
      const result = await api.toggleWishlist({ productId });
      const items = result?.items || [];
      localStorage.setItem(WISHLIST_KEY, JSON.stringify(items));
      return { added: Boolean(result?.added), items };
    } catch (_error) {
      return { added: false, items: getWishlist() };
    }
  }

  const current = getWishlist();
  const exists = current.some((item) => getProductId(item) === productId);
  const next = exists
    ? current.filter((item) => getProductId(item) !== productId)
    : [normalizeProduct(product), ...current].slice(0, 50);

  localStorage.setItem(WISHLIST_KEY, JSON.stringify(next));
  return { added: !exists, items: next };
}

export function getRecentlyViewed() {
  return safeParse(localStorage.getItem(RECENT_KEY), []);
}

export async function syncRecentlyViewedFromServer() {
  if (!getToken()) {
    return getRecentlyViewed();
  }

  try {
    const items = await api.recentlyViewed();
    localStorage.setItem(RECENT_KEY, JSON.stringify(items || []));
    return items || [];
  } catch (_error) {
    return getRecentlyViewed();
  }
}

export async function pushRecentlyViewed(product) {
  const productId = getProductId(product);
  if (!productId) {
    return getRecentlyViewed();
  }

  if (getToken()) {
    try {
      const items = await api.pushRecentlyViewed({ productId });
      localStorage.setItem(RECENT_KEY, JSON.stringify(items || []));
      return items || [];
    } catch (_error) {
      return getRecentlyViewed();
    }
  }

  const current = getRecentlyViewed();
  const next = [normalizeProduct(product), ...current.filter((item) => getProductId(item) !== productId)].slice(0, 12);
  localStorage.setItem(RECENT_KEY, JSON.stringify(next));
  return next;
}
