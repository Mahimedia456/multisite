import { useEffect, useMemo, useState } from "react";

const API_BASE = (
  import.meta.env.VITE_API_BASE_URL ||
  import.meta.env.VITE_API_URL ||
  "https://multisite-server-api.vercel.app"
).replace(/\/api\/?$/, "");

function getJsonUrl(path) {
  return `${API_BASE}${path}`;
}

async function fetchJson(path) {
  const res = await fetch(getJsonUrl(path));
  const json = await res.json().catch(() => null);

  if (!res.ok || !json?.ok) {
    throw new Error(json?.message || "Failed to load knowledge data");
  }

  return json.data;
}

export function useBrandKnowledge(brandSlug) {
  const [data, setData] = useState({
    brand: null,
    settings: null,
    categories: [],
    articles: [],
    faqs: [],
    forms: [],
  });

  const [loading, setLoading] = useState(Boolean(brandSlug));
  const [error, setError] = useState("");

  useEffect(() => {
    let alive = true;

    async function load() {
      if (!brandSlug) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError("");

      try {
        const result = await fetchJson(`/public/${brandSlug}/knowledge`);

        if (!alive) return;

        setData({
          brand: result?.brand || null,
          settings: result?.settings || null,
          categories: result?.categories || [],
          articles: result?.articles || [],
          faqs: result?.faqs || [],
          forms: result?.forms || [],
        });
      } catch (e) {
        if (!alive) return;

        setError(e.message || "Failed to load knowledge data");
        setData({
          brand: null,
          settings: null,
          categories: [],
          articles: [],
          faqs: [],
          forms: [],
        });
      } finally {
        if (alive) setLoading(false);
      }
    }

    load();

    return () => {
      alive = false;
    };
  }, [brandSlug]);

  const enabled = Boolean(data.settings?.knowledge_enabled);

  return useMemo(
    () => ({
      ...data,
      enabled,
      loading,
      error,
    }),
    [data, enabled, loading, error]
  );
}

export function useBrandKnowledgeArticle(brandSlug, articleSlug) {
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(Boolean(brandSlug && articleSlug));
  const [error, setError] = useState("");

  useEffect(() => {
    let alive = true;

    async function load() {
      if (!brandSlug || !articleSlug) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError("");

      try {
        const result = await fetchJson(
          `/public/${brandSlug}/knowledge/articles/${articleSlug}`
        );

        if (!alive) return;
        setArticle(result || null);
      } catch (e) {
        if (!alive) return;
        setArticle(null);
        setError(e.message || "Failed to load article");
      } finally {
        if (alive) setLoading(false);
      }
    }

    load();

    return () => {
      alive = false;
    };
  }, [brandSlug, articleSlug]);

  return { article, loading, error };
}

export function useBrandKnowledgeForm(brandSlug, formSlug) {
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(Boolean(brandSlug && formSlug));
  const [error, setError] = useState("");

  useEffect(() => {
    let alive = true;

    async function load() {
      if (!brandSlug || !formSlug) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError("");

      try {
        const result = await fetchJson(
          `/public/${brandSlug}/knowledge/forms/${formSlug}`
        );

        if (!alive) return;
        setForm(result || null);
      } catch (e) {
        if (!alive) return;
        setForm(null);
        setError(e.message || "Failed to load form");
      } finally {
        if (alive) setLoading(false);
      }
    }

    load();

    return () => {
      alive = false;
    };
  }, [brandSlug, formSlug]);

  return { form, loading, error };
}

export async function submitBrandKnowledgeForm({ brandSlug, formSlug, payload }) {
  const res = await fetch(
    getJsonUrl(`/public/${brandSlug}/knowledge/forms/${formSlug}/submit`),
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    }
  );

  const json = await res.json().catch(() => null);

  if (!res.ok || !json?.ok) {
    throw new Error(json?.message || "Failed to submit form");
  }

  return json;
}