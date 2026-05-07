import { useEffect, useState } from "react";

const API_BASE = (
  import.meta.env.VITE_API_BASE_URL ||
  (import.meta.env.PROD ? "https://multisite-server-api.vercel.app" : "")
).replace(/\/+$/, "");

async function fetchJson(url) {
  const r = await fetch(url, { cache: "no-store" });
  const j = await r.json().catch(() => null);

  if (!r.ok || !j?.ok) {
    throw new Error(j?.message || `Failed (${r.status})`);
  }

  return j.data;
}

export function useBrandKnowledge(brandSlug) {
  const [state, setState] = useState({
    categories: [],
    articles: [],
    faqs: [],
    forms: [],
    settings: {},
    loading: true,
    error: "",
  });

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setState((p) => ({ ...p, loading: true, error: "" }));

      try {
        const data = await fetchJson(
          `${API_BASE}/public/${encodeURIComponent(brandSlug)}/knowledge`
        );

        if (!cancelled) {
          setState({
            categories: data?.categories || [],
            articles: data?.articles || [],
            faqs: data?.faqs || [],
            forms: data?.forms || [],
            settings: data?.settings || {},
            loading: false,
            error: "",
          });
        }
      } catch (e) {
        if (!cancelled) {
          setState((p) => ({
            ...p,
            loading: false,
            error: e?.message || "Failed to load knowledge area",
          }));
        }
      }
    }

    if (brandSlug) load();

    return () => {
      cancelled = true;
    };
  }, [brandSlug]);

  return state;
}

export function useBrandKnowledgeArticle(brandSlug, articleSlug) {
  const [state, setState] = useState({
    article: null,
    loading: true,
    error: "",
  });

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setState({ article: null, loading: true, error: "" });

      try {
        const data = await fetchJson(
          `${API_BASE}/public/${encodeURIComponent(
            brandSlug
          )}/knowledge/articles/${encodeURIComponent(articleSlug)}`
        );

        if (!cancelled) {
          setState({
            article: data || null,
            loading: false,
            error: "",
          });
        }
      } catch (e) {
        if (!cancelled) {
          setState({
            article: null,
            loading: false,
            error: e?.message || "Failed to load article",
          });
        }
      }
    }

    if (brandSlug && articleSlug) load();

    return () => {
      cancelled = true;
    };
  }, [brandSlug, articleSlug]);

  return state;
}

export function useBrandKnowledgeForm(brandSlug, formSlug) {
  const [state, setState] = useState({
    form: null,
    loading: true,
    error: "",
  });

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setState({ form: null, loading: true, error: "" });

      try {
        const data = await fetchJson(
          `${API_BASE}/public/${encodeURIComponent(
            brandSlug
          )}/knowledge/forms/${encodeURIComponent(formSlug)}`
        );

        if (!cancelled) {
          setState({
            form: data || null,
            loading: false,
            error: "",
          });
        }
      } catch (e) {
        if (!cancelled) {
          setState({
            form: null,
            loading: false,
            error: e?.message || "Failed to load form",
          });
        }
      }
    }

    if (brandSlug && formSlug) load();

    return () => {
      cancelled = true;
    };
  }, [brandSlug, formSlug]);

  return state;
}

export async function submitBrandKnowledgeForm({ brandSlug, formSlug, payload }) {
  return fetchJson(
    `${API_BASE}/public/${encodeURIComponent(
      brandSlug
    )}/knowledge/forms/${encodeURIComponent(formSlug)}/submit`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload || {}),
    }
  );
}