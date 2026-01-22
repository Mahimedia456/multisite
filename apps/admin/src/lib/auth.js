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

/* =========================
   Utils
========================= */
function getApiBaseStrict() {
  const base = String(import.meta?.env?.VITE_API_BASE_URL || "").trim().replace(/\/+$/, "");

  // IMPORTANT: must be full http(s) URL in production
  if (!base) {
    throw new Error(
      "VITE_API_BASE_URL is missing. Set it in Vercel (admin project) to your server-api URL."
    );
  }

  if (!/^https?:\/\//i.test(base)) {
    throw new Error(
      `VITE_API_BASE_URL must start with http(s). Got: ${base}`
    );
  }

  return base;
}

function isPlainObject(v) {
  return v && typeof v === "object" && !(v instanceof FormData) && !(v instanceof Blob);
}

/* =========================
   Login (Admin)
========================= */
export async function loginApi(a = {}, b, c) {
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

  const base = getApiBaseStrict();
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
  const hasBody = options.body !== undefined && options.body !== null;
  let body = options.body;

  if (hasBody && isPlainObject(body)) {
    if (!headers.has("Content-Type")) headers.set("Content-Type", "application/json");
    body = JSON.stringify(body);
  }

  if (token && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const base = getApiBaseStrict();
  const url = `${base}${path.startsWith("/") ? path : `/${path}`}`;

  const res = await fetch(url, { ...options, body, headers });

  if (res.status === 401 || res.status === 403) {
    logout();
    throw new Error("Session expired. Please login again.");
  }

  return res;
}
