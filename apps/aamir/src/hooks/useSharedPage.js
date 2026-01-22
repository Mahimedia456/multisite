import { useEffect, useState } from "react";

const API_BASE = (import.meta.env.VITE_API_BASE_URL || "/api").replace(/\/+$/, "");

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
        const url = `${API_BASE}/public/shared-pages/${encodeURIComponent(slug)}?t=${Date.now()}`;
const r = await fetch(url, { cache: "no-store" });
        const j = await r.json().catch(() => null);

        if (!r.ok || !j?.ok) {
          throw new Error(j?.message || `Failed (${r.status})`);
        }

        const next = j?.data?.latestVersion?.content || null;

        if (!cancelled) setContent(next);
      } catch (e) {
        if (!cancelled) {
          setContent(null);
          setError(e?.message || "Failed to fetch");
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
