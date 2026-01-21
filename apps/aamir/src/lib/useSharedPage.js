// src/hooks/useSharedPage.js
import { useEffect, useState } from "react";

const API_BASE = (import.meta.env.VITE_API_BASE_URL || "http://localhost:5050").replace(/\/+$/, "");

export function useSharedPage(slug) {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      try {
        const r = await fetch(`${API_BASE}/public/shared-pages/${encodeURIComponent(slug)}`);
        const j = await r.json().catch(() => null);
        if (!r.ok || !j?.ok) throw new Error(j?.message || "Failed to load shared page");

        // latest content
        if (!cancelled) setContent(j.data?.latestVersion?.content || null);
      } catch {
        if (!cancelled) setContent(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    if (slug) load();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  return { content, loading };
}
