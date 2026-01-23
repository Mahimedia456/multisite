import { useEffect, useState } from "react";

const API_BASE =
  (import.meta.env.VITE_API_BASE_URL ||
    (import.meta.env.PROD ? "https://multisite-server-api.vercel.app" : ""))
  .replace(/\/+$/, "");
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
        if (!slug) {
          if (!cancelled) {
            setHeader(null);
            setFooter(null);
            setLoading(false);
          }
          return;
        }

        const url = `${API_BASE}/public/brands/${encodeURIComponent(slug)}/layout?t=${Date.now()}`;

        const res = await fetch(url, {
          cache: "no-store",
          headers: {
            Accept: "application/json",
          },
        });

        const json = await res.json().catch(() => null);

        // ✅ DEBUG (json yahin defined hai)
        console.log("[useBrandLayout]", {
          slug,
          url,
          status: res.status,
          ok: res.ok,
          json,
        });

        if (!res.ok || !json?.ok) {
          throw new Error(json?.message || `Failed to load layout (${res.status})`);
        }

        if (!cancelled) {
          setHeader(json?.data?.header || null);
          setFooter(json?.data?.footer || null);
        }
      } catch (e) {
        console.error("[useBrandLayout] error:", e);

        if (!cancelled) {
          setHeader(null);
          setFooter(null);
          setErr(e?.message || "Failed to load layout");
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
  console.log("[useBrandLayout]", { slug, url, status, ok, json });

}
