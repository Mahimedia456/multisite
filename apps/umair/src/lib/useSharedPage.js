import { useEffect, useState } from "react";

const API = import.meta.env.VITE_API_URL || "http://localhost:5050";

export function useSharedPage(slug) {
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [content, setContent] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setErr("");
      try {
        const res = await fetch(`${API}/public/shared-pages/${slug}`);
        const json = await res.json().catch(() => null);
        if (!res.ok || !json?.ok) throw new Error(json?.message || "Failed to load page");

        const c = json?.data?.latestVersion?.content || null;

        if (!cancelled) setContent(c);
      } catch (e) {
        if (!cancelled) setErr(e?.message || "Failed to load");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    if (slug) load();
    return () => (cancelled = true);
  }, [slug]);

  return { loading, err, content };
}
