import { useEffect, useState } from "react";

const API_BASE = (
  import.meta.env.VITE_API_BASE_URL ||
  "https://multisite-server-api.vercel.app"
).replace(/\/+$/, "");

export function useBrandUniquePagePreview({ brandSlug, pageSlug, pageId }) {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let alive = true;

    async function load() {
      setLoading(true);
      setError("");

      try {
        const query = pageId
          ? `pageId=${encodeURIComponent(pageId)}`
          : `brandSlug=${encodeURIComponent(brandSlug)}&pageSlug=${encodeURIComponent(pageSlug)}`;

        const res = await fetch(
          `${API_BASE}/public/brand-unique-pages/preview?${query}&t=${Date.now()}`,
          { cache: "no-store" }
        );

        const json = await res.json().catch(() => null);

        if (!res.ok || !json?.ok) {
          throw new Error(json?.message || "Failed to load preview");
        }

        if (alive) setContent(json.data?.content || null);
      } catch (e) {
        if (alive) setError(e?.message || "Failed to load preview");
      } finally {
        if (alive) setLoading(false);
      }
    }

    load();

    return () => {
      alive = false;
    };
  }, [brandSlug, pageSlug, pageId]);

  return { content, loading, error };
}