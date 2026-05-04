import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import MIcon from "../components/MIcon";
import { apiFetch } from "../lib/auth";

function StatusPill({ status, hidden }) {
  const s = String(status || "").toLowerCase();

  if (hidden || s === "hidden") {
    return (
      <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-100 px-3 py-1 text-[11px] font-black uppercase text-slate-500 dark:bg-slate-800 dark:text-slate-300 dark:border-white/10">
        <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
        Hidden
      </span>
    );
  }

  if (s === "published") {
    return (
      <span className="inline-flex items-center gap-2 rounded-full border border-green-100 bg-green-50 px-3 py-1 text-[11px] font-black uppercase text-green-700 dark:bg-green-950/30 dark:text-green-300 dark:border-green-900/40">
        <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
        Published
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-amber-100 bg-amber-50 px-3 py-1 text-[11px] font-black uppercase text-amber-700 dark:bg-amber-950/30 dark:text-amber-300 dark:border-amber-900/40">
      <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
      Draft
    </span>
  );
}

function formatDate(value) {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString();
}

export default function BlogsIndex() {
  const navigate = useNavigate();

  const [rows, setRows] = useState([]);
  const [brands, setBrands] = useState([]);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("all");
  const [brandId, setBrandId] = useState("all");
  const [loading, setLoading] = useState(true);

  async function loadBlogs() {
    setLoading(true);

    try {
      const params = new URLSearchParams();

      if (q.trim()) params.set("q", q.trim());
      if (status !== "all") params.set("status", status);
      if (brandId !== "all") params.set("brandId", brandId);

      const res = await apiFetch(`/admin/blogs?${params.toString()}`);
      const json = await res.json().catch(() => null);

      if (!res.ok || !json?.ok) {
        throw new Error(json?.message || "Failed to load blogs");
      }

      setRows(Array.isArray(json.data) ? json.data : []);
    } catch (e) {
      alert(e.message || "Failed to load blogs");
      setRows([]);
    } finally {
      setLoading(false);
    }
  }

  async function loadBrands() {
    try {
      const res = await apiFetch("/api/brands");
      const json = await res.json().catch(() => null);

      if (res.ok && json?.ok) {
        setBrands(Array.isArray(json.data) ? json.data : []);
      }
    } catch {
      setBrands([]);
    }
  }

  async function deleteBlog(id) {
    if (!window.confirm("Delete this blog?")) return;

    try {
      const res = await apiFetch(`/admin/blogs/${id}`, {
        method: "DELETE",
      });

      const json = await res.json().catch(() => null);

      if (!res.ok || !json?.ok) {
        throw new Error(json?.message || "Failed to delete blog");
      }

      loadBlogs();
    } catch (e) {
      alert(e.message || "Failed to delete blog");
    }
  }

  async function publishBlog(id) {
    try {
      const res = await apiFetch(`/admin/blogs/${id}/publish`, {
        method: "PATCH",
      });

      const json = await res.json().catch(() => null);

      if (!res.ok || !json?.ok) {
        throw new Error(json?.message || "Failed to publish blog");
      }

      loadBlogs();
    } catch (e) {
      alert(e.message || "Failed to publish blog");
    }
  }

  async function hideBlog(id) {
    try {
      const res = await apiFetch(`/admin/blogs/${id}/hide`, {
        method: "PATCH",
      });

      const json = await res.json().catch(() => null);

      if (!res.ok || !json?.ok) {
        throw new Error(json?.message || "Failed to hide blog");
      }

      loadBlogs();
    } catch (e) {
      alert(e.message || "Failed to hide blog");
    }
  }

  useEffect(() => {
    loadBrands();
  }, []);

  useEffect(() => {
    const timer = setTimeout(loadBlogs, 250);
    return () => clearTimeout(timer);
  }, [q, status, brandId]);

  const stats = useMemo(() => {
    const published = rows.filter((x) => x.status === "published" && !x.is_hidden).length;
    const drafts = rows.filter((x) => x.status === "draft").length;
    const hidden = rows.filter((x) => x.is_hidden || x.status === "hidden").length;

    return { total: rows.length, published, drafts, hidden };
  }, [rows]);

  return (
    <div className="space-y-8">
      <div className="rounded-[28px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 shadow-sm p-5 flex flex-col xl:flex-row xl:items-center xl:justify-between gap-5">
        <div>
          <div className="text-xs font-black uppercase tracking-[0.2em] text-[#007ab3]">
            Allianz Panel › Blog Manager
          </div>

          <h1 className="mt-1 text-2xl font-black text-gray-950 dark:text-white">
            Blogs
          </h1>

          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            WordPress-style blog management with SEO, publish, hide and brand visibility.
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate("/blogs/create")}
          className="h-12 rounded-2xl bg-gradient-to-r from-[#007ab3] to-[#005f8c] px-5 text-sm font-black text-white shadow-lg shadow-[#007ab3]/20 hover:brightness-105 transition inline-flex items-center justify-center gap-2"
        >
          <MIcon name="add" className="text-[20px]" />
          Add Blog
        </button>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        {[
          ["Total Blogs", stats.total, "article"],
          ["Published", stats.published, "check_circle"],
          ["Drafts", stats.drafts, "edit_document"],
          ["Hidden", stats.hidden, "visibility_off"],
        ].map(([title, value, icon]) => (
          <div
            key={title}
            className="rounded-[28px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 shadow-sm p-6"
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">
                  {title}
                </div>
                <div className="mt-3 text-3xl font-black text-gray-950 dark:text-white">
                  {value}
                </div>
              </div>

              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[#007ab3]/10 text-[#007ab3]">
                <MIcon name={icon} className="text-[22px]" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-[28px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 shadow-sm p-5 grid grid-cols-1 xl:grid-cols-[1fr,220px,260px] gap-4">
        <div className="relative">
          <MIcon
            name="search"
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-[20px]"
          />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search blogs..."
            className="w-full h-12 bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-2xl pl-12 pr-4 text-sm text-gray-950 dark:text-white outline-none focus:ring-4 focus:ring-[#007ab3]/20 focus:border-[#007ab3]"
          />
        </div>

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="h-12 bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-2xl px-4 text-sm font-bold text-gray-950 dark:text-white outline-none"
        >
          <option value="all">All Status</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
          <option value="hidden">Hidden</option>
        </select>

        <select
          value={brandId}
          onChange={(e) => setBrandId(e.target.value)}
          className="h-12 bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-2xl px-4 text-sm font-bold text-gray-950 dark:text-white outline-none"
        >
          <option value="all">All Brands</option>
          {brands.map((brand) => (
            <option key={brand.id} value={brand.id}>
              {brand.name}
            </option>
          ))}
        </select>
      </div>

      <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm dark:bg-slate-900 dark:border-white/10">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1100px]">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-left dark:bg-slate-950/60 dark:border-white/10">
                <th className="px-6 py-4 text-xs font-black uppercase tracking-[0.16em] text-slate-400">
                  Blog
                </th>
                <th className="px-6 py-4 text-xs font-black uppercase tracking-[0.16em] text-slate-400">
                  Brand
                </th>
                <th className="px-6 py-4 text-xs font-black uppercase tracking-[0.16em] text-slate-400">
                  Status
                </th>
                <th className="px-6 py-4 text-xs font-black uppercase tracking-[0.16em] text-slate-400">
                  Updated
                </th>
                <th className="px-6 py-4 text-right text-xs font-black uppercase tracking-[0.16em] text-slate-400">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 dark:divide-white/10">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-14 text-center text-sm text-slate-500">
                    Loading blogs...
                  </td>
                </tr>
              ) : rows.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-14 text-center text-sm text-slate-500">
                    No blogs found.
                  </td>
                </tr>
              ) : (
                rows.map((blog) => (
                  <tr key={blog.id} className="hover:bg-[#007ab3]/5 transition-colors">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-4">
                        <div className="grid h-11 w-11 place-items-center rounded-2xl bg-[#007ab3]/10 text-[#007ab3] shrink-0">
                          <MIcon name="article" className="text-[21px]" />
                        </div>

                        <div className="min-w-0">
                          <button
                            type="button"
                            onClick={() => navigate(`/blogs/${blog.id}/edit`)}
                            className="block text-left text-sm font-black text-gray-950 hover:text-[#007ab3] dark:text-white truncate"
                          >
                            {blog.title}
                          </button>

                          <p className="mt-1 text-xs font-semibold text-slate-400 truncate">
                            /blogs/{blog.slug}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-5 text-sm font-bold text-slate-600 dark:text-slate-300">
                      {blog.brand_name || blog.brand_slug || "—"}
                    </td>

                    <td className="px-6 py-5">
                      <StatusPill status={blog.status} hidden={blog.is_hidden} />
                    </td>

                    <td className="px-6 py-5 text-sm font-semibold text-slate-500 dark:text-slate-400">
                      {formatDate(blog.updated_at || blog.created_at)}
                    </td>

                    <td className="px-6 py-5">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => navigate(`/blogs/${blog.id}/edit`)}
                          className="grid h-9 w-9 place-items-center rounded-xl text-slate-400 hover:text-[#007ab3] hover:bg-[#007ab3]/10"
                          title="Edit"
                        >
                          <MIcon name="edit" />
                        </button>

                        <button
                          onClick={() => publishBlog(blog.id)}
                          className="grid h-9 w-9 place-items-center rounded-xl text-slate-400 hover:text-green-600 hover:bg-green-50"
                          title="Publish"
                        >
                          <MIcon name="check_circle" />
                        </button>

                        <button
                          onClick={() => hideBlog(blog.id)}
                          className="grid h-9 w-9 place-items-center rounded-xl text-slate-400 hover:text-amber-600 hover:bg-amber-50"
                          title="Hide"
                        >
                          <MIcon name="visibility_off" />
                        </button>

                        <button
                          onClick={() => deleteBlog(blog.id)}
                          className="grid h-9 w-9 place-items-center rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50"
                          title="Delete"
                        >
                          <MIcon name="delete" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}