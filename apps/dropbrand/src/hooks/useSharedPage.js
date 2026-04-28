import { useEffect, useState } from "react";

const API_BASE = (
  import.meta.env.VITE_API_BASE_URL ||
  (import.meta.env.PROD ? "https://multisite-server-api.vercel.app" : "")
).replace(/\/+$/, "");

export function useSharedPage(slug) {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError("");

      try {
        const res = await fetch(
          `${API_BASE}/public/shared-pages/${encodeURIComponent(slug)}`,
          { cache: "no-store" }
        );

        const json = await res.json().catch(() => null);
        if (!res.ok || !json?.ok) {
          throw new Error(json?.message || `Failed (${res.status})`);
        }

        const next = json?.data?.latestVersion?.content || null;
        if (!cancelled) setContent(next);
      } catch (e) {
        if (!cancelled) {
          setContent(null);
          setError(e?.message || "Failed to fetch shared page");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    if (slug) load();

    return () => {
      cancelled = true;
    };
  }, [slug]);

  return { content, loading, error };
}