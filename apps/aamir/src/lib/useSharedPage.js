// src/hooks/useSharedPage.js
import { useEffect, useState } from "react";

const API_BASE = (import.meta.env.VITE_API_BASE_URL || "http://localhost:5050").replace(/\/+$/, "");

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
        const r = await fetch(`${API_BASE}/public/shared-pages/${encodeURIComponent(slug)}`);
        const j = await r.json().catch(() => null);

        if (!r.ok || !j?.ok) throw new Error(j?.message || "Failed to load shared page");

        const c = j?.data?.latestVersion?.content || null;
        if (!cancelled) setContent(c);
      } catch (e) {
        if (!cancelled) {
          setContent(null);
          setError(e?.message || "Failed to load");
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
