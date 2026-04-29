import { getToken } from "./auth";

function getApiBase() {
  return String(
    import.meta.env.VITE_API_BASE_URL || "https://multisite-server-api.vercel.app"
  )
    .trim()
    .replace(/\/+$/, "");
}

function cleanPath(path) {
  return `/${String(path || "").replace(/^\/+/, "")}`;
}

export async function apiGet(path) {
  const base = getApiBase();
  const token = getToken();

  const res = await fetch(`${base}${cleanPath(path)}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.json();
}