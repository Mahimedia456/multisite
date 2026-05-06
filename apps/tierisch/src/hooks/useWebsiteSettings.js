import { useEffect, useMemo, useState } from "react";

const API_BASE = (
  import.meta.env.VITE_API_BASE_URL ||
  "https://multisite-server-api.vercel.app"
).replace(/\/+$/, "");

export function useWebsiteSettings(brandSlug) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError("");

      try {
        const res = await fetch(
          `${API_BASE}/public/${encodeURIComponent(brandSlug)}/website-settings?t=${Date.now()}`,
          {
            cache: "no-store",
            headers: { Accept: "application/json" },
          }
        );

        const json = await res.json().catch(() => null);

        if (!res.ok || !json?.ok) {
          throw new Error(json?.message || `Failed (${res.status})`);
        }

        if (!cancelled) {
          setItems(Array.isArray(json.data) ? json.data : []);
        }
      } catch (e) {
        if (!cancelled) {
          setItems([]);
          setError(e?.message || "Failed to load website settings");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    if (brandSlug) load();

    return () => {
      cancelled = true;
    };
  }, [brandSlug]);

  const hidden = useMemo(() => {
    const set = new Set();

    items.forEach((item) => {
      if (item?.is_visible === false && item?.slug) {
        set.add(`${item.page_type}:${item.slug}`);
      }
    });

    return set;
  }, [items]);

  function isHidden(type, slug) {
    return hidden.has(`${type}:${slug}`);
  }

  return { items, loading, error, isHidden };
}