import { useEffect, useState } from "react";

const API_BASE = (
  import.meta.env.VITE_API_BASE_URL ||
  (import.meta.env.PROD ? "https://multisite-server-api.vercel.app" : "")
).replace(/\/+$/, "");

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
        if (!slug) throw new Error("Missing brand slug");

        const res = await fetch(
          `${API_BASE}/public/brands/${encodeURIComponent(slug)}/layout?t=${Date.now()}`,
          { cache: "no-store", headers: { Accept: "application/json" } }
        );

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
          setErr(e?.message || "Failed to load layout");
          setHeader(null);
          setFooter(null);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  return { loading, err, header, footer };
}