const TOKEN_KEY = "glowbeauty_token";
const USER_KEY = "glowbeauty_user";

export function getToken() {
  return localStorage.getItem(TOKEN_KEY) || "";
}

export function setSession(token, user) {
  localStorage.setItem(TOKEN_KEY, token || "");
  localStorage.setItem(USER_KEY, JSON.stringify(user || {}));
}

export function clearSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export function getSessionUser() {
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw);
  } catch (_error) {
    return null;
  }
}

export function isLoggedIn() {
  return Boolean(getToken());
}
