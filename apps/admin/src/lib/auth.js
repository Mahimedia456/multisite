// src/lib/auth.js

const SESSION_KEY = "session";

/* =========================
   Session helpers
========================= */

export function getSession() {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setSession(session) {
  try {
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  } catch {
    // ignore storage errors
  }
}

export function logout() {
  try {
    localStorage.removeItem(SESSION_KEY);
  } catch {
    // ignore
  }
}

/* =========================
   Small utils
========================= */

function getApiBase() {
  // If you set VITE_API_BASE_URL=http://localhost:5050 this works.
  // If not set, it will fallback to same-origin "" (useful with Vite proxy).
  return (import.meta?.env?.VITE_API_BASE_URL || "").replace(/\/+$/, "");
}

function isPlainObject(v) {
  return v && typeof v === "object" && !(v instanceof FormData) && !(v instanceof Blob);
}

function safeTrim(v) {
  return typeof v === "string" ? v.trim() : v;
}

/* =========================
   Login (Admin)
========================= */

export async function loginApi(a = {}, b, c) {
  // Supports BOTH:
  // 1) loginApi(email, password, remember)
  // 2) loginApi({ email, password, remember })

  let email = "";
  let password = "";
  let remember = false;

  // Style 1: loginApi(email, password, remember)
  if (typeof a === "string" || typeof b === "string") {
    email = typeof a === "string" ? a : "";
    password = typeof b === "string" ? b : "";
    remember = Boolean(c);
  } else {
    // Style 2: loginApi({ ... })
    const payload = a || {};
    const p = payload?.form ?? payload?.values ?? payload?.data ?? payload;

    email =
      p?.email ??
      p?.emailAddress ??
      p?.identifier ??
      p?.username ??
      p?.user ??
      p?.login ??
      "";

    password =
      p?.password ??
      p?.pass ??
      p?.pin ??
      p?.secret ??
      "";

    remember = Boolean(p?.remember ?? payload?.remember);
  }

  email = String(email).trim();
  password = String(password);

  const base = (import.meta?.env?.VITE_API_BASE_URL || "").replace(/\/+$/, "");
  const url = `${base}/admin/login`;

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, remember }),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data?.message || data?.error || `Login failed (${res.status})`);
  }

  const session = {
    ...data,
    access_token: data?.access_token ?? data?.token ?? data?.jwt ?? data?.data?.access_token,
    token: data?.token ?? data?.access_token ?? data?.jwt ?? data?.data?.access_token,
    user: data?.user ?? data?.admin ?? data?.profile ?? data?.data?.user ?? null,
    remember,
  };

  setSession(session);
  return { ok: true, data: session };
}
/* =========================
   Authenticated API Fetch
========================= */

export async function apiFetch(path, options = {}) {
  const session = getSession();

  const token =
    session?.access_token ||
    session?.token ||
    session?.jwt ||
    session?.data?.access_token;

  const headers = new Headers(options.headers || {});

  // Set JSON content-type if body is plain object OR stringifying is needed
  const hasBody = options.body !== undefined && options.body !== null;

  let body = options.body;

  // If body is a plain object, stringify it (common bug)
  if (hasBody && isPlainObject(body)) {
    if (!headers.has("Content-Type")) headers.set("Content-Type", "application/json");
    body = JSON.stringify(body);
  } else {
    // If body exists and is not FormData, ensure JSON header if not already set
    if (
      hasBody &&
      !(body instanceof FormData) &&
      !headers.has("Content-Type") &&
      typeof body === "string"
    ) {
      headers.set("Content-Type", "application/json");
    }
  }

  if (token && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const base = getApiBase();
  const url = `${base}${path.startsWith("/") ? path : `/${path}`}`;

  const res = await fetch(url, {
    ...options,
    body,
    headers,
  });

  // Auto logout on auth failure
  if (res.status === 401 || res.status === 403) {
    logout();
    throw new Error("Session expired. Please login again.");
  }

  return res;
}
