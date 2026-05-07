import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import MIcon from "../../components/MIcon";
import { apiFetch } from "../../lib/auth";

const EMPTY_FORM = {
  category_id: "",
  title_de: "",
  title_en: "",
  slug: "",
  excerpt_de: "",
  excerpt_en: "",
  content_de: "",
  content_en: "",
  status: "draft",
  sort_order: 0,
};

function makeSlug(value) {
  return String(value || "")
    .toLowerCase()
    .trim()
    .replace(/[ä]/g, "ae")
    .replace(/[ö]/g, "oe")
    .replace(/[ü]/g, "ue")
    .replace(/[ß]/g, "ss")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function KnowledgeArticles() {
  const { t } = useTranslation();

  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const categoryMap = useMemo(() => {
    return Object.fromEntries(categories.map((cat) => [cat.id, cat]));
  }, [categories]);

  const sortedItems = useMemo(() => {
    return [...items].sort((a, b) => {
      const orderA = Number(a.sort_order || 0);
      const orderB = Number(b.sort_order || 0);

      if (orderA !== orderB) return orderA - orderB;

      return String(a.title_de || "").localeCompare(String(b.title_de || ""));
    });
  }, [items]);

  async function loadData() {
    setLoading(true);

    try {
      const [articlesRes, categoriesRes] = await Promise.all([
        apiFetch("/admin/knowledge/articles"),
        apiFetch("/admin/knowledge/categories"),
      ]);

      const articlesJson = await articlesRes.json().catch(() => null);
      const categoriesJson = await categoriesRes.json().catch(() => null);

      if (!articlesRes.ok || !articlesJson?.ok) {
        throw new Error(articlesJson?.message || t("knowledgeArticlesFailedLoad"));
      }

      if (!categoriesRes.ok || !categoriesJson?.ok) {
        throw new Error(categoriesJson?.message || t("knowledgeCategoriesFailedLoad"));
      }

      setItems(articlesJson.data || []);
      setCategories(categoriesJson.data || []);
    } catch (e) {
      alert(e.message || t("knowledgeArticlesFailedLoad"));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  function openCreate() {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setShowForm(true);
  }

  function openEdit(item) {
    setEditingId(item.id);

    setForm({
      category_id: item.category_id || "",
      title_de: item.title_de || "",
      title_en: item.title_en || "",
      slug: item.slug || "",
      excerpt_de: item.excerpt_de || "",
      excerpt_en: item.excerpt_en || "",
      content_de: item.content_de || "",
      content_en: item.content_en || "",
      status: item.status || "draft",
      sort_order: Number(item.sort_order || 0),
    });

    setShowForm(true);
  }

  function closeForm() {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setShowForm(false);
  }

  function updateField(name, value) {
    setForm((prev) => {
      const next = {
        ...prev,
        [name]: value,
      };

      if (name === "title_de" && !editingId) {
        next.slug = makeSlug(value);
      }

      return next;
    });
  }

  async function saveItem(e) {
    e.preventDefault();

    if (!form.title_de.trim()) {
      alert(t("knowledgeArticleTitleDeRequired"));
      return;
    }

    if (!form.slug.trim()) {
      alert(t("knowledgeSlugRequired"));
      return;
    }

    setSaving(true);

    try {
      const payload = {
        ...form,
        slug: makeSlug(form.slug),
        category_id: form.category_id || null,
        sort_order: Number(form.sort_order || 0),
      };

      const res = await apiFetch(
        editingId
          ? `/admin/knowledge/articles/${editingId}`
          : "/admin/knowledge/articles",
        {
          method: editingId ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const json = await res.json().catch(() => null);

      if (!res.ok || !json?.ok) {
        throw new Error(json?.message || t("knowledgeArticlesFailedSave"));
      }

      await loadData();
      closeForm();
    } catch (e) {
      alert(e.message || t("knowledgeArticlesFailedSave"));
    } finally {
      setSaving(false);
    }
  }

  async function deleteItem(item) {
    const ok = window.confirm(
      t("knowledgeArticleDeleteConfirm", {
        title: item.title_de || item.slug,
      })
    );

    if (!ok) return;

    try {
      const res = await apiFetch(`/admin/knowledge/articles/${item.id}`, {
        method: "DELETE",
      });

      const json = await res.json().catch(() => null);

      if (!res.ok || !json?.ok) {
        throw new Error(json?.message || t("knowledgeArticlesFailedDelete"));
      }

      await loadData();
    } catch (e) {
      alert(e.message || t("knowledgeArticlesFailedDelete"));
    }
  }

  return (
    <div className="space-y-8">
      <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-slate-900">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="text-xs font-black uppercase tracking-[0.22em] text-[#007ab3]">
              {t("knowledgeArea")}
            </div>

            <h1 className="mt-2 text-2xl font-black text-slate-950 dark:text-white">
              {t("knowledgeArticles")}
            </h1>

            <p className="mt-2 max-w-3xl text-sm font-semibold leading-6 text-slate-500 dark:text-slate-300">
              {t("knowledgeArticlesPageSubtitle")}
            </p>
          </div>

          <button
            type="button"
            onClick={openCreate}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#007ab3] px-5 py-3 text-sm font-black text-white shadow-lg shadow-[#007ab3]/20 transition hover:bg-[#005f8c]"
          >
            <MIcon name="add" className="text-xl" />
            {t("knowledgeAddArticle")}
          </button>
        </div>
      </div>

      {showForm ? (
        <form
          onSubmit={saveItem}
          className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-slate-900"
        >
          <div className="mb-6 flex items-center justify-between gap-4">
            <h2 className="text-lg font-black text-slate-950 dark:text-white">
              {editingId ? t("knowledgeEditArticle") : t("knowledgeAddArticle")}
            </h2>

            <button
              type="button"
              onClick={closeForm}
              className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-black text-slate-600 hover:bg-slate-50 dark:border-white/10 dark:text-slate-200 dark:hover:bg-white/5"
            >
              {t("knowledgeCancel")}
            </button>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <label className="space-y-2">
              <span className="text-sm font-black text-slate-700 dark:text-slate-200">
                {t("knowledgeArticleTitleDe")}
              </span>
              <input
                value={form.title_de}
                onChange={(e) => updateField("title_de", e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold outline-none focus:border-[#007ab3] dark:border-white/10 dark:bg-slate-950 dark:text-white"
              />
            </label>

            <label className="space-y-2">
              <span className="text-sm font-black text-slate-700 dark:text-slate-200">
                {t("knowledgeArticleTitleEn")}
              </span>
              <input
                value={form.title_en}
                onChange={(e) => updateField("title_en", e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold outline-none focus:border-[#007ab3] dark:border-white/10 dark:bg-slate-950 dark:text-white"
              />
            </label>

            <label className="space-y-2">
              <span className="text-sm font-black text-slate-700 dark:text-slate-200">
                {t("knowledgeSlug")}
              </span>
              <input
                value={form.slug}
                onChange={(e) => updateField("slug", e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold outline-none focus:border-[#007ab3] dark:border-white/10 dark:bg-slate-950 dark:text-white"
              />
            </label>

            <label className="space-y-2">
              <span className="text-sm font-black text-slate-700 dark:text-slate-200">
                {t("knowledgeCategory")}
              </span>
              <select
                value={form.category_id}
                onChange={(e) => updateField("category_id", e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold outline-none focus:border-[#007ab3] dark:border-white/10 dark:bg-slate-950 dark:text-white"
              >
                <option value="">{t("knowledgeNoCategory")}</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.title_de}
                  </option>
                ))}
              </select>
            </label>

            <label className="space-y-2">
              <span className="text-sm font-black text-slate-700 dark:text-slate-200">
                {t("knowledgeStatus")}
              </span>
              <select
                value={form.status}
                onChange={(e) => updateField("status", e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold outline-none focus:border-[#007ab3] dark:border-white/10 dark:bg-slate-950 dark:text-white"
              >
                <option value="draft">{t("knowledgeDraft")}</option>
                <option value="published">{t("knowledgePublished")}</option>
              </select>
            </label>

            <label className="space-y-2">
              <span className="text-sm font-black text-slate-700 dark:text-slate-200">
                {t("knowledgeSortOrder")}
              </span>
              <input
                type="number"
                value={form.sort_order}
                onChange={(e) => updateField("sort_order", e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold outline-none focus:border-[#007ab3] dark:border-white/10 dark:bg-slate-950 dark:text-white"
              />
            </label>

            <label className="space-y-2 md:col-span-2">
              <span className="text-sm font-black text-slate-700 dark:text-slate-200">
                {t("knowledgeExcerptDe")}
              </span>
              <textarea
                rows={3}
                value={form.excerpt_de}
                onChange={(e) => updateField("excerpt_de", e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold outline-none focus:border-[#007ab3] dark:border-white/10 dark:bg-slate-950 dark:text-white"
              />
            </label>

            <label className="space-y-2 md:col-span-2">
              <span className="text-sm font-black text-slate-700 dark:text-slate-200">
                {t("knowledgeExcerptEn")}
              </span>
              <textarea
                rows={3}
                value={form.excerpt_en}
                onChange={(e) => updateField("excerpt_en", e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold outline-none focus:border-[#007ab3] dark:border-white/10 dark:bg-slate-950 dark:text-white"
              />
            </label>

            <label className="space-y-2 md:col-span-2">
              <span className="text-sm font-black text-slate-700 dark:text-slate-200">
                {t("knowledgeContentDe")}
              </span>
              <textarea
                rows={8}
                value={form.content_de}
                onChange={(e) => updateField("content_de", e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold leading-6 outline-none focus:border-[#007ab3] dark:border-white/10 dark:bg-slate-950 dark:text-white"
              />
            </label>

            <label className="space-y-2 md:col-span-2">
              <span className="text-sm font-black text-slate-700 dark:text-slate-200">
                {t("knowledgeContentEn")}
              </span>
              <textarea
                rows={8}
                value={form.content_en}
                onChange={(e) => updateField("content_en", e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold leading-6 outline-none focus:border-[#007ab3] dark:border-white/10 dark:bg-slate-950 dark:text-white"
              />
            </label>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#007ab3] px-6 py-3 text-sm font-black text-white shadow-lg shadow-[#007ab3]/20 transition hover:bg-[#005f8c] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <MIcon name="save" className="text-xl" />
              {saving ? t("knowledgeSaving") : t("knowledgeSave")}
            </button>
          </div>
        </form>
      ) : null}

      <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm dark:border-white/10 dark:bg-slate-900">
        {loading ? (
          <div className="p-6 text-sm font-bold text-slate-500 dark:text-slate-300">
            {t("knowledgeArticlesLoading")}
          </div>
        ) : sortedItems.length === 0 ? (
          <div className="p-6 text-sm font-bold text-slate-500 dark:text-slate-300">
            {t("knowledgeNoArticles")}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs font-black uppercase tracking-wider text-slate-500 dark:bg-white/5 dark:text-slate-300">
                <tr>
                  <th className="px-5 py-4">{t("knowledgeArticle")}</th>
                  <th className="px-5 py-4">{t("knowledgeCategory")}</th>
                  <th className="px-5 py-4">{t("knowledgeSlug")}</th>
                  <th className="px-5 py-4">{t("knowledgeStatus")}</th>
                  <th className="px-5 py-4">{t("knowledgeSortOrder")}</th>
                  <th className="px-5 py-4 text-right">{t("knowledgeActions")}</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 dark:divide-white/10">
                {sortedItems.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-slate-50/70 dark:hover:bg-white/5"
                  >
                    <td className="px-5 py-4 font-black text-slate-900 dark:text-white">
                      {item.title_de}
                      {item.title_en ? (
                        <div className="mt-1 text-xs font-bold text-slate-400">
                          {item.title_en}
                        </div>
                      ) : null}
                    </td>

                    <td className="px-5 py-4 font-semibold text-slate-500 dark:text-slate-300">
                      {categoryMap[item.category_id]?.title_de ||
                        t("knowledgeNoCategory")}
                    </td>

                    <td className="px-5 py-4 font-semibold text-slate-500 dark:text-slate-300">
                      {item.slug}
                    </td>

                    <td className="px-5 py-4">
                      <span className="rounded-full bg-[#007ab3]/10 px-3 py-1 text-xs font-black text-[#007ab3]">
                        {t(`knowledgeStatusValue_${item.status || "draft"}`)}
                      </span>
                    </td>

                    <td className="px-5 py-4 font-semibold text-slate-500 dark:text-slate-300">
                      {item.sort_order || 0}
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => openEdit(item)}
                          className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-black text-slate-600 hover:bg-slate-50 dark:border-white/10 dark:text-slate-200 dark:hover:bg-white/5"
                        >
                          {t("knowledgeEdit")}
                        </button>

                        <button
                          type="button"
                          onClick={() => deleteItem(item)}
                          className="rounded-xl border border-red-200 px-3 py-2 text-xs font-black text-red-600 hover:bg-red-50 dark:border-red-500/30 dark:text-red-300 dark:hover:bg-red-500/10"
                        >
                          {t("knowledgeDelete")}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}