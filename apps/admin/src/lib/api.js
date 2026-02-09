import { getToken } from "./auth";

export async function apiGet(path) {
  const base = import.meta.env.VITE_API_BASE_URL || "http://localhost:5050";
  const token = getToken();

  const res = await fetch(`${base}${path}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.json();
}
