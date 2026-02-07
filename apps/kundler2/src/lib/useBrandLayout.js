// src/lib/useBrandLayout.js
import { useEffect, useMemo, useState } from "react";

const API_BASE = (
  import.meta.env.VITE_API_BASE_URL ||
  (import.meta.env.PROD ? "https://multisite-server-api.vercel.app" : "http://localhost:5050")
).replace(/\/+$/, "");

export function useBrandLayout(slug) {
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [header, setHeader] = useState(null);
  const [footer, setFooter] = useState(null);

  // stable url builder
  const layoutUrl = useMemo(() => {
    if (!slug) return "";
    const s = encodeURIComponent(String(slug).trim().toLowerCase());
    return `${API_BASE}/public/brands/${s}/layout?t=${Date.now()}`;
  }, [slug]);

  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      setLoading(true);
      setErr("");

      try {
        if (!slug) {
          setHeader(null);
          setFooter(null);
          setLoading(false);
          return;
        }

        if (!API_BASE) {
          throw new Error(
            "API base missing. Set VITE_API_BASE_URL in .env (or ensure server is running on localhost:5050)."
          );
        }

        const res = await fetch(layoutUrl, {
          cache: "no-store",
          signal: controller.signal,
          headers: { Accept: "application/json" },
        });

        const json = await res.json().catch(() => null);

        // ✅ DEBUG
        console.log("[useBrandLayout]", {
          slug,
          API_BASE,
          url: layoutUrl,
          status: res.status,
          ok: res.ok,
          json,
        });

        if (!res.ok || !json?.ok) {
          throw new Error(json?.message || `Failed to load layout (${res.status})`);
        }

        setHeader(json?.data?.header || null);
        setFooter(json?.data?.footer || null);
      } catch (e) {
        if (e?.name === "AbortError") return;

        console.error("[useBrandLayout] error:", e);
        setHeader(null);
        setFooter(null);
        setErr(e?.message || "Failed to load layout");
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    load();
    return () => controller.abort();
  }, [slug, layoutUrl]);

  return { loading, err, header, footer };
}
