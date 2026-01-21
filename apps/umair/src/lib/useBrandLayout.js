import { useEffect, useState } from "react";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5050";

export function useBrandLayout(slug) {
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [header, setHeader] = useState(null);
  const [footer, setFooter] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setErr("");
      try {
        const res = await fetch(`${API_BASE}/public/brands/${slug}/layout`);
        const json = await res.json().catch(() => null);

        if (!res.ok || !json?.ok) throw new Error(json?.message || "Failed to load layout");

        if (!cancelled) {
          setHeader(json.data.header || null);
          setFooter(json.data.footer || null);
        }
      } catch (e) {
        if (!cancelled) setErr(e?.message || "Failed to load layout");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    if (slug) load();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  return { loading, err, header, footer };
}
