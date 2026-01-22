// admin/src/lib/auth.js

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
    // ignore
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
  // IMPORTANT: VITE_ vars are injected at build time in Vercel.
  // If empty, it will fallback to same-origin (which causes /admin/login on Vercel => 405).
  const raw = (import.meta?.env?.VITE_API_BASE_URL || "").trim();

  // remove surrounding quotes if someone accidentally added
  const unquoted = raw.replace(/^['"]|['"]$/g, "");

  // remove trailing slashes
  return unquoted.replace(/\/+$/, "");
}

function isPlainObject(v) {
  return v && typeof v === "object" && !(v instanceof FormData) && !(v instanceof Blob);
}

function buildUrl(path) {
  const base = getApiBase();

  // If base is empty => same-origin (bad for deployed admin).
  // But keep fallback for local proxy setups.
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${base}${p}`;
}

async function safeJson(res) {
  try {
    return await res.json();
  } catch {
    return null;
  }
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

  if (typeof a === "string" || typeof b === "string") {
    email = typeof a === "string" ? a : "";
    password = typeof b === "string" ? b : "";
    remember = Boolean(c);
  } else {
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

  const url = buildUrl("/admin/login");

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, remember }),
  });

  const data = await safeJson(res);

  if (!res.ok) {
    const msg =
      data?.message ||
      data?.error ||
      `Login failed (${res.status})`;
    throw new Error(msg);
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
  } else if (
    hasBody &&
    !(body instanceof FormData) &&
    !headers.has("Content-Type") &&
    typeof body === "string"
  ) {
    headers.set("Content-Type", "application/json");
  }

  if (token && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const url = buildUrl(path);

  const res = await fetch(url, {
    ...options,
    headers,
    body,
  });

  if (res.status === 401 || res.status === 403) {
    logout();
    throw new Error("Session expired. Please login again.");
  }

  return res;
}
