const SESSION_KEY = "admin_session_v1";
const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5050";

export function getSession() {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function setSession(session) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function logout() {
  localStorage.removeItem(SESSION_KEY);
}

// ✅ Use this from AdminLogin.jsx
export async function loginApi(email, password, remember = false) {
  try {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, remember }),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      return { ok: false, error: data?.error || "Invalid credentials" };
    }

    // expected response: { token, user }
    const session = {
      token: data.token,
      user: data.user,
      email: data.user?.email || email,
    };

    setSession(session);
    return { ok: true, session };
  } catch {
    return { ok: false, error: "API not reachable (server-api not running)" };
  }
}

// helper for protected API requests
export async function apiFetch(path, options = {}) {
  const session = getSession();
  const token = session?.token;

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  if (res.status === 401) {
    logout();
    throw new Error("Unauthorized");
  }

  return res;
}
