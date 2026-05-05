import { useEffect, useState } from "react";

const API_BASE = (
  import.meta.env.VITE_API_BASE_URL ||
  (import.meta.env.PROD
    ? "https://multisite-server-api.vercel.app"
    : "http://localhost:5050")
).replace(/\/+$/, "");

export function useBrandUniquePage(brandSlug, pageSlug) {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let alive = true;

    async function load() {
      setLoading(true);
      setError("");

      try {
        const res = await fetch(
          `${API_BASE}/public/brands/${brandSlug}/unique-pages/${pageSlug}?t=${Date.now()}`,
          { cache: "no-store" }
        );

        const json = await res.json().catch(() => null);

        if (!res.ok || !json?.ok) {
          throw new Error(json?.message || `Failed (${res.status})`);
        }

        if (alive) {
          setContent(json.data?.latestVersion?.content || null);
        }
      } catch (e) {
        if (alive) {
          setContent(null);
          setError(e?.message || "Failed to load page");
        }
      } finally {
        if (alive) setLoading(false);
      }
    }

    load();

    return () => {
      alive = false;
    };
  }, [brandSlug, pageSlug]);

  return { content, loading, error };
}