import { useEffect, useState } from "react";

const API_BASE = (import.meta.env.VITE_API_BASE_URL || "/api").replace(/\/+$/, "");

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
        const url = `${API_BASE}/public/brands/${encodeURIComponent(slug)}/layout?t=${Date.now()}`;
const res = await fetch(url, { cache: "no-store" });
        const json = await res.json().catch(() => null);

        if (!res.ok || !json?.ok) {
          throw new Error(json?.message || `Failed to load layout (${res.status})`);
        }

        if (!cancelled) {
          setHeader(json?.data?.header || null);
          setFooter(json?.data?.footer || null);
        }
      } catch (e) {
        if (!cancelled) {
          setHeader(null);
          setFooter(null);
          setErr(e?.message || "Failed to load layout");
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

  return { loading, err, header, footer };
}
