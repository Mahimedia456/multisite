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
  } catch {}
}

export function logout() {
  try {
    localStorage.removeItem(SESSION_KEY);
  } catch {}
}

export function getCurrentUser() {
  const session = getSession();
  return session?.user ?? null;
}

/* =========================
   Utils
========================= */
function getApiBase() {
  const raw = String(import.meta?.env?.VITE_API_BASE_URL || "").trim();
  const base = (raw || "https://multisite-server-api.vercel.app/").replace(/\/+$/, "");
  if (!/^https?:\/\//i.test(base)) {
    throw new Error(`VITE_API_BASE_URL must start with http(s). Got: ${base}`);
  }
  return base;
}

function isPlainObject(v) {
  return v && typeof v === "object" && !(v instanceof FormData) && !(v instanceof Blob);
}

async function safeJson(res) {
  return await res.json().catch(() => ({}));
}

/* =========================
   Login (Admin)
========================= */
export async function loginApi(a = {}, b, c) {
  let email = "";
  let password = "";
  let remember = false;

  // loginApi(email, password, remember)
  if (typeof a === "string" || typeof b === "string") {
    email = typeof a === "string" ? a : "";
    password = typeof b === "string" ? b : "";
    remember = Boolean(c);
  } else {
    // loginApi({ ... })
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

    password = p?.password ?? p?.pass ?? p?.pin ?? p?.secret ?? "";
    remember = Boolean(p?.remember ?? payload?.remember);
  }

  email = String(email).trim();
  password = String(password);

  const base = getApiBase();
  const url = `${base}/admin/login`;

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, remember }),
  });

  const data = await safeJson(res);

  if (!res.ok || !data?.ok) {
    throw new Error(data?.message || data?.error || `Login failed (${res.status})`);
  }

  // ✅ backend returns access_token
  const token =
    data?.token ??
    data?.access_token ??
    data?.jwt ??
    data?.data?.access_token ??
    null;

  const session = {
    ...data,
    ok: true,
    access_token: token,
    token: token, // ✅ ensure ProtectedRoute finds it
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
    session?.token ||
    session?.access_token ||
    session?.jwt ||
    session?.data?.access_token;

  const headers = new Headers(options.headers || {});
  let body = options.body;

  if (body !== undefined && body !== null && isPlainObject(body)) {
    if (!headers.has("Content-Type")) headers.set("Content-Type", "application/json");
    body = JSON.stringify(body);
  }

  if (token && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const base = getApiBase();
  const url = `${base}${path.startsWith("/") ? path : `/${path}`}`;

  const res = await fetch(url, { ...options, body, headers });

  if (res.status === 401 || res.status === 403) {
    logout();
    throw new Error("Session expired. Please login again.");
  }

  return res;
}

export async function apiFetchJSON(path, options = {}) {
  const res = await apiFetch(path, options);
  const data = await safeJson(res);

  if (!res.ok || !data?.ok) {
    throw new Error(data?.message || data?.error || `Request failed (${res.status})`);
  }

  return data;
}
