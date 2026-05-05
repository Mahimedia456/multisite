import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
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

function TextInput({ label, value, onChange, placeholder, required = false }) {
  return (
    <label className="block">
      <div className="mb-2 text-xs font-black uppercase tracking-[0.16em] text-slate-400">
        {label} {required ? <span className="text-red-500">*</span> : null}
      </div>
      <input
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm font-semibold text-gray-950 outline-none transition focus:border-[#007ab3] focus:ring-4 focus:ring-[#007ab3]/20 dark:border-white/10 dark:bg-slate-950 dark:text-white"
      />
    </label>
  );
}

function TextArea({ label, value, onChange, placeholder, rows = 4 }) {
  return (
    <label className="block">
      <div className="mb-2 text-xs font-black uppercase tracking-[0.16em] text-slate-400">
        {label}
      </div>
      <textarea
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="w-full resize-y rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-gray-950 outline-none transition focus:border-[#007ab3] focus:ring-4 focus:ring-[#007ab3]/20 dark:border-white/10 dark:bg-slate-950 dark:text-white"
      />
    </label>
  );
}

export default function BlogForm() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { blogId } = useParams();

  const isEdit = Boolean(blogId);

  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);

  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    brandId: "",
    categoryId: "",
    title: "",
    slug: "",
    excerpt: "",
    contentText: "",
    featuredImage: "",
    authorName: "",
    status: "draft",
    isHidden: false,

    seoTitle: "",
    seoDescription: "",
    seoKeywords: "",
    canonicalUrl: "",
    ogTitle: "",
    ogDescription: "",
    ogImage: "",
  });

  function setField(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  const previewSlug = useMemo(() => {
    return form.slug || slugify(form.title);
  }, [form.slug, form.title]);

  async function loadBrands() {
    try {
      const res = await apiFetch("/api/brands");
      const json = await res.json().catch(() => null);

      if (!res.ok || !json?.ok) {
        throw new Error(json?.message || t("blogFormFailedLoadBrands"));
      }

      const list = Array.isArray(json.data) ? json.data : [];
      setBrands(list);

      if (!isEdit && list.length && !form.brandId) {
        setForm((prev) => ({ ...prev, brandId: list[0].id }));
      }
    } catch (e) {
      console.error("[BlogForm loadBrands]", e);
      setBrands([]);
    }
  }

  async function loadCategories(brandId) {
    try {
      if (!brandId) {
        setCategories([]);
        return;
      }

      const params = new URLSearchParams();
      params.set("brandId", brandId);

      const res = await apiFetch(`/admin/blog-categories?${params.toString()}`);
      const json = await res.json().catch(() => null);

      if (!res.ok || !json?.ok) {
        throw new Error(json?.message || t("blogFormFailedLoadCategories"));
      }

      setCategories(Array.isArray(json.data) ? json.data : []);
    } catch (e) {
      console.error("[BlogForm loadCategories]", e);
      setCategories([]);
    }
  }

  async function loadBlog() {
    if (!isEdit) return;

    setLoading(true);

    try {
      const res = await apiFetch(`/admin/blogs/${blogId}`);
      const json = await res.json().catch(() => null);

      if (!res.ok || !json?.ok) {
        throw new Error(json?.message || t("blogFormFailedLoadBlog"));
      }

      const blog = json.data || {};
      const contentText =
        typeof blog.content === "string"
          ? blog.content
          : blog.content?.text || blog.content?.html || "";

      setForm({
        brandId: blog.brand_id || "",
        categoryId: blog.category_id || "",
        title: blog.title || "",
        slug: blog.slug || "",
        excerpt: blog.excerpt || "",
        contentText,
        featuredImage: blog.featured_image || "",
        authorName: blog.author_name || "",
        status: blog.status || "draft",
        isHidden: Boolean(blog.is_hidden),

        seoTitle: blog.seo_title || "",
        seoDescription: blog.seo_description || "",
        seoKeywords: blog.seo_keywords || "",
        canonicalUrl: blog.canonical_url || "",
        ogTitle: blog.og_title || "",
        ogDescription: blog.og_description || "",
        ogImage: blog.og_image || "",
      });

      await loadCategories(blog.brand_id);
    } catch (e) {
      alert(e.message || t("blogFormFailedLoadBlog"));
      navigate("/blogs");
    } finally {
      setLoading(false);
    }
  }

  async function saveBlog() {
    if (!form.title.trim()) {
      alert(t("blogFormTitleRequired"));
      return;
    }

    if (!isEdit && !form.brandId) {
      alert(t("blogFormSelectBrandRequired"));
      return;
    }

    setSaving(true);

    try {
      const payload = {
        brandId: form.brandId,
        categoryId: form.categoryId || null,
        title: form.title.trim(),
        slug: previewSlug,
        excerpt: form.excerpt,
        content: {
          type: "rich_text",
          text: form.contentText,
        },
        featuredImage: form.featuredImage,
        authorName: form.authorName,
        status: form.isHidden ? "hidden" : form.status,
        isHidden: form.isHidden,

        seoTitle: form.seoTitle,
        seoDescription: form.seoDescription,
        seoKeywords: form.seoKeywords,
        canonicalUrl: form.canonicalUrl,
        ogTitle: form.ogTitle,
        ogDescription: form.ogDescription,
        ogImage: form.ogImage,
      };

      const res = await apiFetch(isEdit ? `/admin/blogs/${blogId}` : "/admin/blogs", {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json().catch(() => null);

      if (!res.ok || !json?.ok) {
        throw new Error(json?.message || t("blogFormFailedSaveBlog"));
      }

      navigate("/blogs");
    } catch (e) {
      alert(e.message || t("blogFormFailedSaveBlog"));
    } finally {
      setSaving(false);
    }
  }

  async function deleteBlog() {
    if (!isEdit) return;
    if (!window.confirm(t("blogFormDeleteConfirm"))) return;

    try {
      const res = await apiFetch(`/admin/blogs/${blogId}`, {
        method: "DELETE",
      });

      const json = await res.json().catch(() => null);

      if (!res.ok || !json?.ok) {
        throw new Error(json?.message || t("blogFormFailedDeleteBlog"));
      }

      navigate("/blogs");
    } catch (e) {
      alert(e.message || t("blogFormFailedDeleteBlog"));
    }
  }

  useEffect(() => {
    loadBrands();
    loadBlog();
  }, [blogId]);

  useEffect(() => {
    if (form.brandId) {
      loadCategories(form.brandId);
    }
  }, [form.brandId]);

  if (loading) {
    return (
      <div className="p-8 text-slate-500 dark:text-slate-400">
        {t("blogFormLoading")}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-slate-900">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <div className="text-xs font-black uppercase tracking-[0.2em] text-[#007ab3]">
              {t("blogFormBreadcrumb")}
            </div>

            <h1 className="mt-1 text-2xl font-black text-gray-950 dark:text-white">
              {isEdit ? t("blogFormEdit") : t("blogFormAdd")}
            </h1>

            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              {t("blogFormSubtitle")}
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => navigate("/blogs")}
              className="h-12 rounded-2xl border border-slate-200 bg-white px-5 text-sm font-black text-slate-700 transition hover:bg-slate-50 dark:border-white/10 dark:bg-slate-950 dark:text-white"
            >
              {t("blogFormCancel")}
            </button>

            {isEdit ? (
              <button
                type="button"
                onClick={deleteBlog}
                className="h-12 rounded-2xl bg-red-600 px-5 text-sm font-black text-white transition hover:bg-red-700"
              >
                {t("blogFormDelete")}
              </button>
            ) : null}

            <button
              type="button"
              onClick={saveBlog}
              disabled={saving}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#007ab3] to-[#005f8c] px-5 text-sm font-black text-white shadow-lg shadow-[#007ab3]/20 transition hover:brightness-105 disabled:opacity-60"
            >
              <MIcon name="save" className="text-[20px]" />
              {saving ? t("blogFormSaving") : t("blogFormSave")}
            </button>
          </div>
        </div>
      </div>

      <div className="grid gap-8 xl:grid-cols-[1fr,360px]">
        <div className="space-y-8">
          <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-slate-900">
            <h2 className="text-lg font-black text-gray-950 dark:text-white">
              {t("blogFormContent")}
            </h2>

            <div className="mt-6 grid gap-5">
              <TextInput
                label={t("blogFormTitle")}
                required
                value={form.title}
                onChange={(v) => {
                  setField("title", v);
                  if (!isEdit && !form.slug) setField("slug", slugify(v));
                }}
                placeholder={t("blogFormTitlePlaceholder")}
              />

              <TextInput
                label={t("blogFormSlug")}
                value={form.slug}
                onChange={(v) => setField("slug", slugify(v))}
                placeholder={t("blogFormSlugPlaceholder")}
              />

              <TextArea
                label={t("blogFormExcerpt")}
                value={form.excerpt}
                onChange={(v) => setField("excerpt", v)}
                placeholder={t("blogFormExcerptPlaceholder")}
                rows={3}
              />

              <TextArea
                label={t("blogFormContentField")}
                value={form.contentText}
                onChange={(v) => setField("contentText", v)}
                placeholder={t("blogFormContentPlaceholder")}
                rows={14}
              />
            </div>
          </div>

          <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-slate-900">
            <h2 className="text-lg font-black text-gray-950 dark:text-white">
              {t("blogFormSEO")}
            </h2>

            <div className="mt-6 grid gap-5">
              <TextInput label={t("blogFormSEOTitle")} value={form.seoTitle} onChange={(v) => setField("seoTitle", v)} placeholder={t("blogFormMetaTitlePlaceholder")} />
              <TextArea label={t("blogFormSEODesc")} value={form.seoDescription} onChange={(v) => setField("seoDescription", v)} placeholder={t("blogFormMetaDescriptionPlaceholder")} rows={3} />
              <TextInput label={t("blogFormKeywords")} value={form.seoKeywords} onChange={(v) => setField("seoKeywords", v)} placeholder={t("blogFormKeywordsPlaceholder")} />
              <TextInput label={t("blogFormCanonical")} value={form.canonicalUrl} onChange={(v) => setField("canonicalUrl", v)} placeholder={t("blogFormCanonicalPlaceholder")} />
              <TextInput label={t("blogFormOGTitle")} value={form.ogTitle} onChange={(v) => setField("ogTitle", v)} placeholder={t("blogFormOGTitlePlaceholder")} />
              <TextArea label={t("blogFormOGDesc")} value={form.ogDescription} onChange={(v) => setField("ogDescription", v)} placeholder={t("blogFormOGDescPlaceholder")} rows={3} />
              <TextInput label={t("blogFormOGImage")} value={form.ogImage} onChange={(v) => setField("ogImage", v)} placeholder="https://..." />
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-slate-900">
            <h2 className="text-lg font-black text-gray-950 dark:text-white">
              {t("blogFormPublishing")}
            </h2>

            <div className="mt-6 grid gap-5">
              <label className="block">
                <div className="mb-2 text-xs font-black uppercase tracking-[0.16em] text-slate-400">
                  {t("blogFormBrand")}
                </div>
                <select
                  value={form.brandId}
                  onChange={(e) => {
                    setField("brandId", e.target.value);
                    setField("categoryId", "");
                  }}
                  disabled={isEdit}
                  className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm font-bold text-gray-950 outline-none dark:border-white/10 dark:bg-slate-950 dark:text-white disabled:opacity-60"
                >
                  <option value="">{t("blogFormSelectBrand")}</option>
                  {brands.map((brand) => (
                    <option key={brand.id} value={brand.id}>
                      {brand.name} ({brand.slug})
                    </option>
                  ))}
                </select>
              </label>

              <label className="block">
                <div className="mb-2 text-xs font-black uppercase tracking-[0.16em] text-slate-400">
                  {t("blogFormCategory")}
                </div>
                <select
                  value={form.categoryId}
                  onChange={(e) => setField("categoryId", e.target.value)}
                  className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm font-bold text-gray-950 outline-none dark:border-white/10 dark:bg-slate-950 dark:text-white"
                >
                  <option value="">{t("blogFormNoCategory")}</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block">
                <div className="mb-2 text-xs font-black uppercase tracking-[0.16em] text-slate-400">
                  {t("blogFormStatus")}
                </div>
                <select
                  value={form.status}
                  onChange={(e) => setField("status", e.target.value)}
                  className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm font-bold text-gray-950 outline-none dark:border-white/10 dark:bg-slate-950 dark:text-white"
                >
                  <option value="draft">{t("blogFormDraft")}</option>
                  <option value="published">{t("blogFormPublished")}</option>
                  <option value="hidden">{t("blogFormHidden")}</option>
                </select>
              </label>

              <label className="flex cursor-pointer items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-slate-950">
                <div>
                  <div className="text-sm font-black text-gray-950 dark:text-white">
                    {t("blogFormHideBlog")}
                  </div>
                  <div className="mt-1 text-xs font-semibold text-slate-500">
                    {t("blogFormHideNote")}
                  </div>
                </div>

                <input
                  type="checkbox"
                  checked={form.isHidden}
                  onChange={(e) => setField("isHidden", e.target.checked)}
                  className="h-5 w-5"
                />
              </label>
            </div>
          </div>

          <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-slate-900">
            <h2 className="text-lg font-black text-gray-950 dark:text-white">
              {t("blogFormMedia")}
            </h2>

            <div className="mt-6 grid gap-5">
              <TextInput
                label={t("blogFormImage")}
                value={form.featuredImage}
                onChange={(v) => setField("featuredImage", v)}
                placeholder="https://..."
              />

              <TextInput
                label={t("blogFormAuthor")}
                value={form.authorName}
                onChange={(v) => setField("authorName", v)}
                placeholder={t("blogFormAuthorPlaceholder")}
              />

              {form.featuredImage ? (
                <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-white/10">
                  <img src={form.featuredImage} alt="" className="h-48 w-full object-cover" />
                </div>
              ) : null}
            </div>
          </div>

          <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-slate-900">
            <h2 className="text-lg font-black text-gray-950 dark:text-white">
              {t("blogFormPreview")}
            </h2>

            <div className="mt-4 rounded-2xl bg-slate-50 p-4 text-sm font-mono font-bold text-slate-600 dark:bg-slate-950 dark:text-slate-300">
              /blogs/{previewSlug || t("blogFormPreviewSlugFallback")}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}