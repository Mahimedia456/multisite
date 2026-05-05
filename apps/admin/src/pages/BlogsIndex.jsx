import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import MIcon from "../components/MIcon";
import { apiFetch } from "../lib/auth";

function StatusPill({ status, hidden, t }) {
  const s = String(status || "").toLowerCase();

  if (hidden || s === "hidden") {
    return (
      <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-100 px-3 py-1 text-[11px] font-black uppercase text-slate-500 dark:bg-slate-800 dark:text-slate-300 dark:border-white/10">
        <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
        {t("blogsHidden")}
      </span>
    );
  }

  if (s === "published") {
    return (
      <span className="inline-flex items-center gap-2 rounded-full border border-green-100 bg-green-50 px-3 py-1 text-[11px] font-black uppercase text-green-700 dark:bg-green-950/30 dark:text-green-300 dark:border-green-900/40">
        <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
        {t("blogsPublished")}
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-amber-100 bg-amber-50 px-3 py-1 text-[11px] font-black uppercase text-amber-700 dark:bg-amber-950/30 dark:text-amber-300 dark:border-amber-900/40">
      <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
      {t("blogsDraft")}
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
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [rows, setRows] = useState([]);
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);

  const [q, setQ] = useState("");
  const [status, setStatus] = useState("all");
  const [brandId, setBrandId] = useState("all");
  const [categoryId, setCategoryId] = useState("all");

  const [loading, setLoading] = useState(true);

  async function loadBlogs() {
    setLoading(true);

    try {
      const params = new URLSearchParams();

      if (q.trim()) params.set("q", q.trim());
      if (status !== "all") params.set("status", status);
      if (brandId !== "all") params.set("brandId", brandId);
      if (categoryId !== "all") params.set("categoryId", categoryId);

      const res = await apiFetch(`/admin/blogs?${params.toString()}`);
      const json = await res.json().catch(() => null);

      if (!res.ok || !json?.ok) {
        throw new Error(json?.message || t("blogsFailedLoad"));
      }

      setRows(Array.isArray(json.data) ? json.data : []);
    } catch (e) {
      alert(e.message || t("blogsFailedLoad"));
      setRows([]);
    } finally {
      setLoading(false);
    }
  }

  async function loadBrands() {
    try {
      const res = await apiFetch("/api/brands");
      const json = await res.json().catch(() => null);

      if (!res.ok || !json?.ok) {
        throw new Error(json?.message || t("blogsFailedLoadBrands"));
      }

      setBrands(Array.isArray(json.data) ? json.data : []);
    } catch (e) {
      console.error("[BlogsIndex loadBrands]", e);
      setBrands([]);
    }
  }

  async function loadCategories(nextBrandId = brandId) {
    try {
      const params = new URLSearchParams();

      if (nextBrandId !== "all") {
        params.set("brandId", nextBrandId);
      }

      const res = await apiFetch(`/admin/blog-categories?${params.toString()}`);
      const json = await res.json().catch(() => null);

      if (!res.ok || !json?.ok) {
        throw new Error(json?.message || t("blogsFailedLoadCategories"));
      }

      setCategories(Array.isArray(json.data) ? json.data : []);
    } catch (e) {
      console.error("[BlogsIndex loadCategories]", e);
      setCategories([]);
    }
  }

  async function deleteBlog(id) {
    if (!window.confirm(t("blogsDeleteConfirm"))) return;

    try {
      const res = await apiFetch(`/admin/blogs/${id}`, {
        method: "DELETE",
      });

      const json = await res.json().catch(() => null);

      if (!res.ok || !json?.ok) {
        throw new Error(json?.message || t("blogsFailedDelete"));
      }

      loadBlogs();
    } catch (e) {
      alert(e.message || t("blogsFailedDelete"));
    }
  }

  async function publishBlog(id) {
    try {
      const res = await apiFetch(`/admin/blogs/${id}/publish`, {
        method: "PATCH",
      });

      const json = await res.json().catch(() => null);

      if (!res.ok || !json?.ok) {
        throw new Error(json?.message || t("blogsFailedPublish"));
      }

      loadBlogs();
    } catch (e) {
      alert(e.message || t("blogsFailedPublish"));
    }
  }

  async function hideBlog(id) {
    try {
      const res = await apiFetch(`/admin/blogs/${id}/hide`, {
        method: "PATCH",
      });

      const json = await res.json().catch(() => null);

      if (!res.ok || !json?.ok) {
        throw new Error(json?.message || t("blogsFailedHide"));
      }

      loadBlogs();
    } catch (e) {
      alert(e.message || t("blogsFailedHide"));
    }
  }

  useEffect(() => {
    loadBrands();
    loadCategories("all");
  }, []);

  useEffect(() => {
    loadCategories(brandId);
    setCategoryId("all");
  }, [brandId]);

  useEffect(() => {
    const timer = setTimeout(loadBlogs, 250);
    return () => clearTimeout(timer);
  }, [q, status, brandId, categoryId]);

  const stats = useMemo(() => {
    const published = rows.filter(
      (x) => x.status === "published" && !x.is_hidden
    ).length;
    const drafts = rows.filter((x) => x.status === "draft").length;
    const hidden = rows.filter((x) => x.is_hidden || x.status === "hidden").length;

    return { total: rows.length, published, drafts, hidden };
  }, [rows]);

  const statCards = [
    [t("blogsTotal"), stats.total, "article"],
    [t("blogsPublished"), stats.published, "check_circle"],
    [t("blogsDrafts"), stats.drafts, "edit_document"],
    [t("blogsHidden"), stats.hidden, "visibility_off"],
  ];

  return (
    <div className="space-y-8">
      <div className="rounded-[28px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 shadow-sm p-5 flex flex-col xl:flex-row xl:items-center xl:justify-between gap-5">
        <div>
          <div className="text-xs font-black uppercase tracking-[0.2em] text-[#007ab3]">
            {t("blogsBreadcrumb")}
          </div>

          <h1 className="mt-1 text-2xl font-black text-gray-950 dark:text-white">
            {t("blogsTitle")}
          </h1>

          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {t("blogsSubtitle")}
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => navigate("/blog-categories")}
            className="h-12 rounded-2xl border border-slate-200 bg-white px-5 text-sm font-black text-slate-700 transition hover:bg-slate-50 dark:border-white/10 dark:bg-slate-950 dark:text-white"
          >
            {t("blogsCategoriesBtn")}
          </button>

          <button
            type="button"
            onClick={() => navigate("/blogs/create")}
            className="h-12 rounded-2xl bg-gradient-to-r from-[#007ab3] to-[#005f8c] px-5 text-sm font-black text-white shadow-lg shadow-[#007ab3]/20 hover:brightness-105 transition inline-flex items-center justify-center gap-2"
          >
            <MIcon name="add" className="text-[20px]" />
            {t("blogsAdd")}
          </button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        {statCards.map(([title, value, icon]) => (
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

      <div className="rounded-[28px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 shadow-sm p-5 grid grid-cols-1 xl:grid-cols-[1fr,200px,240px,240px] gap-4">
        <div className="relative">
          <MIcon
            name="search"
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-[20px]"
          />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={t("blogsSearch")}
            className="w-full h-12 bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-2xl pl-12 pr-4 text-sm text-gray-950 dark:text-white outline-none focus:ring-4 focus:ring-[#007ab3]/20 focus:border-[#007ab3]"
          />
        </div>

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="h-12 bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-2xl px-4 text-sm font-bold text-gray-950 dark:text-white outline-none"
        >
          <option value="all">{t("blogsAllStatus")}</option>
          <option value="published">{t("blogsPublished")}</option>
          <option value="draft">{t("blogsDraft")}</option>
          <option value="hidden">{t("blogsHidden")}</option>
        </select>

        <select
          value={brandId}
          onChange={(e) => setBrandId(e.target.value)}
          className="h-12 bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-2xl px-4 text-sm font-bold text-gray-950 dark:text-white outline-none"
        >
          <option value="all">{t("blogsAllBrands")}</option>
          {brands.map((brand) => (
            <option key={brand.id} value={brand.id}>
              {brand.name}
            </option>
          ))}
        </select>

        <select
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          className="h-12 bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-2xl px-4 text-sm font-bold text-gray-950 dark:text-white outline-none"
        >
          <option value="all">{t("blogsAllCategories")}</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm dark:bg-slate-900 dark:border-white/10">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1200px]">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-left dark:bg-slate-950/60 dark:border-white/10">
                <th className="px-6 py-4 text-xs font-black uppercase tracking-[0.16em] text-slate-400">
                  {t("blogsBlog")}
                </th>
                <th className="px-6 py-4 text-xs font-black uppercase tracking-[0.16em] text-slate-400">
                  {t("blogsBrand")}
                </th>
                <th className="px-6 py-4 text-xs font-black uppercase tracking-[0.16em] text-slate-400">
                  {t("blogsCategory")}
                </th>
                <th className="px-6 py-4 text-xs font-black uppercase tracking-[0.16em] text-slate-400">
                  {t("blogsStatus")}
                </th>
                <th className="px-6 py-4 text-xs font-black uppercase tracking-[0.16em] text-slate-400">
                  {t("blogsUpdated")}
                </th>
                <th className="px-6 py-4 text-right text-xs font-black uppercase tracking-[0.16em] text-slate-400">
                  {t("blogsActions")}
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 dark:divide-white/10">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-14 text-center text-sm text-slate-500">
                    {t("blogsLoading")}
                  </td>
                </tr>
              ) : rows.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-14 text-center text-sm text-slate-500">
                    {t("blogsNoData")}
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

                    <td className="px-6 py-5 text-sm font-bold text-slate-600 dark:text-slate-300">
                      {blog.category_name || "—"}
                    </td>

                    <td className="px-6 py-5">
                      <StatusPill status={blog.status} hidden={blog.is_hidden} t={t} />
                    </td>

                    <td className="px-6 py-5 text-sm font-semibold text-slate-500 dark:text-slate-400">
                      {formatDate(blog.updated_at || blog.created_at)}
                    </td>

                    <td className="px-6 py-5">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => navigate(`/blogs/${blog.id}/edit`)}
                          className="grid h-9 w-9 place-items-center rounded-xl text-slate-400 hover:text-[#007ab3] hover:bg-[#007ab3]/10"
                          title={t("blogsEditAction")}
                        >
                          <MIcon name="edit" />
                        </button>

                        <button
                          onClick={() => publishBlog(blog.id)}
                          className="grid h-9 w-9 place-items-center rounded-xl text-slate-400 hover:text-green-600 hover:bg-green-50"
                          title={t("blogsPublishAction")}
                        >
                          <MIcon name="check_circle" />
                        </button>

                        <button
                          onClick={() => hideBlog(blog.id)}
                          className="grid h-9 w-9 place-items-center rounded-xl text-slate-400 hover:text-amber-600 hover:bg-amber-50"
                          title={t("blogsHideAction")}
                        >
                          <MIcon name="visibility_off" />
                        </button>

                        <button
                          onClick={() => deleteBlog(blog.id)}
                          className="grid h-9 w-9 place-items-center rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50"
                          title={t("blogsDeleteAction")}
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