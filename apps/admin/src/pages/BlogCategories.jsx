import { useEffect, useMemo, useState } from "react";
import MIcon from "../components/MIcon";
import { apiFetch } from "../lib/auth";

function slugify(value) {
  return String(value || "")
    .toLowerCase()
    .trim()
    .replace(/ä/g, "ae")
    .replace(/ö/g, "oe")
    .replace(/ü/g, "ue")
    .replace(/ß/g, "ss")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function formatDate(value) {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString();
}

export default function BlogCategories() {
  const [brands, setBrands] = useState([]);
  const [brandId, setBrandId] = useState("all");
  const [rows, setRows] = useState([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    id: "",
    brandId: "",
    name: "",
    slug: "",
    description: "",
    isHidden: false,
  });

  const isEdit = Boolean(form.id);

  function resetForm() {
    setForm({
      id: "",
      brandId: brands[0]?.id || "",
      name: "",
      slug: "",
      description: "",
      isHidden: false,
    });
  }

  async function loadBrands() {
    try {
      const res = await apiFetch("/api/brands");
      const json = await res.json().catch(() => null);

      if (!res.ok || !json?.ok) {
        throw new Error(json?.message || "Failed to load brands");
      }

      const list = Array.isArray(json.data) ? json.data : [];
      setBrands(list);

      setForm((prev) => ({
        ...prev,
        brandId: prev.brandId || list[0]?.id || "",
      }));
    } catch (e) {
      console.error("[BlogCategories loadBrands]", e);
      setBrands([]);
    }
  }

  async function loadCategories() {
    setLoading(true);

    try {
      const params = new URLSearchParams();

      if (brandId !== "all") params.set("brandId", brandId);
      if (q.trim()) params.set("q", q.trim());

      const res = await apiFetch(`/admin/blog-categories?${params.toString()}`);
      const json = await res.json().catch(() => null);

      if (!res.ok || !json?.ok) {
        throw new Error(json?.message || "Failed to load categories");
      }

      setRows(Array.isArray(json.data) ? json.data : []);
    } catch (e) {
      alert(e.message || "Failed to load categories");
      setRows([]);
    } finally {
      setLoading(false);
    }
  }

  async function saveCategory() {
    const name = form.name.trim();

    if (!name) {
      alert("Category name is required");
      return;
    }

    const selectedBrandId = form.brandId || brands[0]?.id || "";

    if (!isEdit && !selectedBrandId) {
      alert("Please select a brand");
      return;
    }

    setSaving(true);

    try {
      const payload = {
        brandId: selectedBrandId,
        name,
        slug: form.slug || slugify(name),
        description: form.description,
        isHidden: form.isHidden,
      };

      const res = await apiFetch(
        isEdit
          ? `/admin/blog-categories/${form.id}`
          : "/admin/blog-categories",
        {
          method: isEdit ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      const json = await res.json().catch(() => null);

      if (!res.ok || !json?.ok) {
        throw new Error(json?.message || "Failed to save category");
      }

      resetForm();
      loadCategories();
    } catch (e) {
      alert(e.message || "Failed to save category");
    } finally {
      setSaving(false);
    }
  }

  async function deleteCategory(id) {
    if (!window.confirm("Delete this category? Blogs will remain without category.")) {
      return;
    }

    try {
      const res = await apiFetch(`/admin/blog-categories/${id}`, {
        method: "DELETE",
      });

      const json = await res.json().catch(() => null);

      if (!res.ok || !json?.ok) {
        throw new Error(json?.message || "Failed to delete category");
      }

      if (form.id === id) resetForm();
      loadCategories();
    } catch (e) {
      alert(e.message || "Failed to delete category");
    }
  }

  function editCategory(row) {
    setForm({
      id: row.id,
      brandId: row.brand_id,
      name: row.name || "",
      slug: row.slug || "",
      description: row.description || "",
      isHidden: Boolean(row.is_hidden),
    });
  }

  useEffect(() => {
    loadBrands();
  }, []);

  useEffect(() => {
    const timer = setTimeout(loadCategories, 250);
    return () => clearTimeout(timer);
  }, [brandId, q]);

  const stats = useMemo(() => {
    return {
      total: rows.length,
      visible: rows.filter((x) => !x.is_hidden).length,
      hidden: rows.filter((x) => x.is_hidden).length,
      blogs: rows.reduce((sum, x) => sum + Number(x.blogs_count || 0), 0),
    };
  }, [rows]);

  return (
    <div className="space-y-8">
      <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-slate-900">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <div className="text-xs font-black uppercase tracking-[0.2em] text-[#007ab3]">
              Allianz Panel › Blogs
            </div>

            <h1 className="mt-1 text-2xl font-black text-gray-950 dark:text-white">
              Blog Categories
            </h1>

            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Create, edit, hide, and delete blog categories per brand.
            </p>
          </div>

          <button
            type="button"
            onClick={resetForm}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 text-sm font-black text-slate-700 transition hover:bg-slate-50 dark:border-white/10 dark:bg-slate-950 dark:text-white"
          >
            <MIcon name="refresh" className="text-[20px]" />
            Reset Form
          </button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        {[
          ["Total Categories", stats.total, "category"],
          ["Visible", stats.visible, "visibility"],
          ["Hidden", stats.hidden, "visibility_off"],
          ["Blogs Linked", stats.blogs, "article"],
        ].map(([title, value, icon]) => (
          <div
            key={title}
            className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-slate-900"
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

      <div className="grid gap-8 xl:grid-cols-[420px,1fr]">
        <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-slate-900">
          <h2 className="text-lg font-black text-gray-950 dark:text-white">
            {isEdit ? "Edit Category" : "Add Category"}
          </h2>

          <div className="mt-6 grid gap-5">
            <label className="block">
              <div className="mb-2 text-xs font-black uppercase tracking-[0.16em] text-slate-400">
                Brand
              </div>

              <select
                value={form.brandId}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, brandId: e.target.value }))
                }
                disabled={isEdit}
                className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm font-bold text-gray-950 outline-none dark:border-white/10 dark:bg-slate-950 dark:text-white disabled:opacity-60"
              >
                <option value="">Select Brand</option>
                {brands.map((brand) => (
                  <option key={brand.id} value={brand.id}>
                    {brand.name} ({brand.slug})
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <div className="mb-2 text-xs font-black uppercase tracking-[0.16em] text-slate-400">
                Category Name
              </div>

              <input
                value={form.name}
                onChange={(e) => {
                  const value = e.target.value;
                  setForm((prev) => ({
                    ...prev,
                    name: value,
                    slug: prev.slug || slugify(value),
                  }));
                }}
                placeholder="Tierkrankenversicherung"
                className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm font-semibold text-gray-950 outline-none focus:border-[#007ab3] focus:ring-4 focus:ring-[#007ab3]/20 dark:border-white/10 dark:bg-slate-950 dark:text-white"
              />
            </label>

            <label className="block">
              <div className="mb-2 text-xs font-black uppercase tracking-[0.16em] text-slate-400">
                Slug
              </div>

              <input
                value={form.slug}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    slug: slugify(e.target.value),
                  }))
                }
                placeholder="tierkrankenversicherung"
                className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm font-semibold text-gray-950 outline-none focus:border-[#007ab3] focus:ring-4 focus:ring-[#007ab3]/20 dark:border-white/10 dark:bg-slate-950 dark:text-white"
              />
            </label>

            <label className="block">
              <div className="mb-2 text-xs font-black uppercase tracking-[0.16em] text-slate-400">
                Description
              </div>

              <textarea
                value={form.description}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, description: e.target.value }))
                }
                rows={4}
                placeholder="Short category description"
                className="w-full resize-y rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-gray-950 outline-none focus:border-[#007ab3] focus:ring-4 focus:ring-[#007ab3]/20 dark:border-white/10 dark:bg-slate-950 dark:text-white"
              />
            </label>

            <label className="flex cursor-pointer items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-slate-950">
              <div>
                <div className="text-sm font-black text-gray-950 dark:text-white">
                  Hide Category
                </div>
                <div className="mt-1 text-xs font-semibold text-slate-500">
                  Hidden categories will not show on public website filters.
                </div>
              </div>

              <input
                type="checkbox"
                checked={form.isHidden}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    isHidden: e.target.checked,
                  }))
                }
                className="h-5 w-5"
              />
            </label>

            <button
              type="button"
              onClick={saveCategory}
              disabled={saving}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#007ab3] to-[#005f8c] px-5 text-sm font-black text-white shadow-lg shadow-[#007ab3]/20 transition hover:brightness-105 disabled:opacity-60"
            >
              <MIcon name="save" className="text-[20px]" />
              {saving ? "Saving..." : isEdit ? "Update Category" : "Create Category"}
            </button>
          </div>
        </div>

        <div className="space-y-5">
          <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-slate-900">
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1fr,260px]">
              <div className="relative">
                <MIcon
                  name="search"
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-[20px]"
                />

                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search categories..."
                  className="h-12 w-full rounded-2xl border border-slate-200 bg-white pl-12 pr-4 text-sm font-semibold text-gray-950 outline-none focus:border-[#007ab3] focus:ring-4 focus:ring-[#007ab3]/20 dark:border-white/10 dark:bg-slate-950 dark:text-white"
                />
              </div>

              <select
                value={brandId}
                onChange={(e) => setBrandId(e.target.value)}
                className="h-12 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-bold text-gray-950 outline-none dark:border-white/10 dark:bg-slate-950 dark:text-white"
              >
                <option value="all">All Brands</option>
                {brands.map((brand) => (
                  <option key={brand.id} value={brand.id}>
                    {brand.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm dark:border-white/10 dark:bg-slate-900">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px]">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-left dark:border-white/10 dark:bg-slate-950/60">
                    <th className="px-6 py-4 text-xs font-black uppercase tracking-[0.16em] text-slate-400">
                      Category
                    </th>
                    <th className="px-6 py-4 text-xs font-black uppercase tracking-[0.16em] text-slate-400">
                      Brand
                    </th>
                    <th className="px-6 py-4 text-xs font-black uppercase tracking-[0.16em] text-slate-400">
                      Blogs
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
                      <td
                        colSpan={6}
                        className="px-6 py-14 text-center text-sm text-slate-500"
                      >
                        Loading categories...
                      </td>
                    </tr>
                  ) : rows.length === 0 ? (
                    <tr>
                      <td
                        colSpan={6}
                        className="px-6 py-14 text-center text-sm text-slate-500"
                      >
                        No categories found.
                      </td>
                    </tr>
                  ) : (
                    rows.map((row) => (
                      <tr
                        key={row.id}
                        className="transition-colors hover:bg-[#007ab3]/5"
                      >
                        <td className="px-6 py-5">
                          <div className="text-sm font-black text-gray-950 dark:text-white">
                            {row.name}
                          </div>
                          <div className="mt-1 text-xs font-semibold text-slate-400">
                            {row.slug}
                          </div>
                        </td>

                        <td className="px-6 py-5 text-sm font-bold text-slate-600 dark:text-slate-300">
                          {row.brand_name || row.brand_slug || "—"}
                        </td>

                        <td className="px-6 py-5 text-sm font-black text-gray-950 dark:text-white">
                          {row.blogs_count || 0}
                        </td>

                        <td className="px-6 py-5">
                          {row.is_hidden ? (
                            <span className="inline-flex rounded-full border border-slate-200 bg-slate-100 px-3 py-1 text-[11px] font-black uppercase text-slate-500">
                              Hidden
                            </span>
                          ) : (
                            <span className="inline-flex rounded-full border border-green-100 bg-green-50 px-3 py-1 text-[11px] font-black uppercase text-green-700">
                              Visible
                            </span>
                          )}
                        </td>

                        <td className="px-6 py-5 text-sm font-semibold text-slate-500">
                          {formatDate(row.updated_at || row.created_at)}
                        </td>

                        <td className="px-6 py-5">
                          <div className="flex justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => editCategory(row)}
                              className="grid h-9 w-9 place-items-center rounded-xl text-slate-400 hover:bg-[#007ab3]/10 hover:text-[#007ab3]"
                              title="Edit"
                            >
                              <MIcon name="edit" />
                            </button>

                            <button
                              type="button"
                              onClick={() => deleteCategory(row.id)}
                              className="grid h-9 w-9 place-items-center rounded-xl text-slate-400 hover:bg-red-50 hover:text-red-600"
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

            <div className="border-t border-slate-100 bg-slate-50 px-6 py-4 text-center text-sm font-semibold text-slate-500 dark:border-white/10 dark:bg-slate-950/60 dark:text-slate-400">
              Categories are stored in blog_categories table.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}