import { getToken } from "./auth";

export async function apiGet(path) {
  const base = import.meta.env.VITE_API_BASE_URL || "https://multisite-server-api.vercel.app/";
  const token = getToken();

  const res = await fetch(`${base}${path}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.json();
}
