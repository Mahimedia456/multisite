import { useEffect, useState } from "react";

const API_BASE = (
  import.meta.env.VITE_API_BASE_URL ||
  "https://multisite-server-api.vercel.app"
).replace(/\/+$/, "");

function makePublicUrl(path) {
  const clean = String(path || "").replace(/^\/+/, "");

  if (clean.startsWith("api/")) {
    return `${API_BASE}/${clean}`;
  }

  return `${API_BASE}/${clean}`;
}

export function useSharedBrandBlogs(slug, options = {}) {
  const { limit = 100, search = "", category = "" } = options;

  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setErr("");

      try {
        if (!slug) {
          if (!cancelled) {
            setBlogs([]);
            setLoading(false);
          }
          return;
        }

        const params = new URLSearchParams();

        if (search) params.set("search", search);
        if (category) params.set("category", category);
        if (limit) params.set("limit", String(limit));
        params.set("t", String(Date.now()));

        const url = makePublicUrl(
          `/public/${encodeURIComponent(slug)}/blogs?${params.toString()}`
        );

        const res = await fetch(url, {
          cache: "no-store",
          headers: { Accept: "application/json" },
        });

        const json = await res.json().catch(() => null);

        console.log("[useSharedBrandBlogs]", {
          slug,
          url,
          status: res.status,
          ok: res.ok,
          json,
        });

        if (!res.ok || !json?.ok) {
          throw new Error(json?.message || `Failed to load blogs (${res.status})`);
        }

        if (!cancelled) {
          setBlogs(Array.isArray(json.data) ? json.data : []);
        }
      } catch (e) {
        console.error("[useSharedBrandBlogs] error:", e);

        if (!cancelled) {
          setBlogs([]);
          setErr(e?.message || "Failed to load blogs");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [slug, limit, search, category]);

  return { loading, err, blogs };
}

export function useSharedBrandBlogCategories(slug) {
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setErr("");

      try {
        if (!slug) {
          if (!cancelled) {
            setCategories([]);
            setLoading(false);
          }
          return;
        }

        const url = makePublicUrl(
          `/public/${encodeURIComponent(slug)}/blog-categories?t=${Date.now()}`
        );

        const res = await fetch(url, {
          cache: "no-store",
          headers: { Accept: "application/json" },
        });

        const json = await res.json().catch(() => null);

        console.log("[useSharedBrandBlogCategories]", {
          slug,
          url,
          status: res.status,
          ok: res.ok,
          json,
        });

        if (!res.ok || !json?.ok) {
          throw new Error(
            json?.message || `Failed to load blog categories (${res.status})`
          );
        }

        if (!cancelled) {
          setCategories(Array.isArray(json.data) ? json.data : []);
        }
      } catch (e) {
        console.error("[useSharedBrandBlogCategories] error:", e);

        if (!cancelled) {
          setCategories([]);
          setErr(e?.message || "Failed to load blog categories");
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

  return { loading, err, categories };
}

export function useSharedBrandBlogDetail(slug, blogSlug) {
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [blog, setBlog] = useState(null);
  const [related, setRelated] = useState([]);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setErr("");

      try {
        if (!slug || !blogSlug) {
          if (!cancelled) {
            setBlog(null);
            setRelated([]);
            setLoading(false);
          }
          return;
        }

        const url = makePublicUrl(
          `/public/${encodeURIComponent(slug)}/blogs/${encodeURIComponent(
            blogSlug
          )}?t=${Date.now()}`
        );

        const res = await fetch(url, {
          cache: "no-store",
          headers: { Accept: "application/json" },
        });

        const json = await res.json().catch(() => null);

        console.log("[useSharedBrandBlogDetail]", {
          slug,
          blogSlug,
          url,
          status: res.status,
          ok: res.ok,
          json,
        });

        if (!res.ok || !json?.ok) {
          throw new Error(json?.message || `Failed to load blog (${res.status})`);
        }

        if (!cancelled) {
          setBlog(json.data || null);
          setRelated(Array.isArray(json.related) ? json.related : []);
        }
      } catch (e) {
        console.error("[useSharedBrandBlogDetail] error:", e);

        if (!cancelled) {
          setBlog(null);
          setRelated([]);
          setErr(e?.message || "Failed to load blog");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [slug, blogSlug]);

  return { loading, err, blog, related };
}