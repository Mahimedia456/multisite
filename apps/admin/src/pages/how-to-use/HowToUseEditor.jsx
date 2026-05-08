import { useEffect, useMemo, useState } from "react";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import MIcon from "../../components/MIcon";
import { apiFetch } from "../../lib/auth";
import { HOW_TO_USE_MODULES } from "../../constants/howToUseModules";

function toSlug(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/_/g, "-")
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function linesToArray(value) {
  return String(value || "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

function imageLinesToArray(value) {
  return String(value || "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((url) => ({ url, caption: "" }));
}

function arrayToLines(value) {
  if (!Array.isArray(value)) return "";
  return value
    .map((item) => {
      if (typeof item === "string") return item;
      return item?.url || "";
    })
    .filter(Boolean)
    .join("\n");
}

export default function HowToUseEditor() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { t } = useTranslation();
  const { canManage } = useOutletContext();

  const isEdit = Boolean(id);

  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    module_key: "dashboard",
    slug: "dashboard",
    icon: "dashboard",
    sort_order: 10,
    title_de: "",
    title_en: "",
    description_de: "",
    description_en: "",
    content_de: "",
    content_en: "",
    steps_de_text: "",
    steps_en_text: "",
    images_text: "",
    status: "active",
  });

  const selectedModule = useMemo(() => {
    return HOW_TO_USE_MODULES.find((item) => item.moduleKey === form.module_key);
  }, [form.module_key]);

  useEffect(() => {
    if (!canManage) {
      navigate("/how-to-use", { replace: true });
    }
  }, [canManage, navigate]);

  useEffect(() => {
    let alive = true;

    async function load() {
      if (!isEdit) return;

      try {
        setLoading(true);
        setError("");

        const res = await apiFetch(`/admin/how-to-use/by-id/${id}`);
        const json = await res.json().catch(() => ({}));

        if (!res.ok) {
          throw new Error(json?.message || t("howToUseFailedLoad"));
        }

        const data = json?.data || {};

        if (!alive) return;

        setForm({
          module_key: data.module_key || "dashboard",
          slug: data.slug || "",
          icon: data.icon || "help",
          sort_order: Number(data.sort_order || 0),
          title_de: data.title_de || "",
          title_en: data.title_en || "",
          description_de: data.description_de || "",
          description_en: data.description_en || "",
          content_de: data.content_de || "",
          content_en: data.content_en || "",
          steps_de_text: Array.isArray(data.steps_de) ? data.steps_de.join("\n") : "",
          steps_en_text: Array.isArray(data.steps_en) ? data.steps_en.join("\n") : "",
          images_text: arrayToLines(data.images_json),
          status: data.status || "active",
        });
      } catch (err) {
        if (!alive) return;
        setError(err?.message || t("howToUseFailedLoad"));
      } finally {
        if (alive) setLoading(false);
      }
    }

    load();

    return () => {
      alive = false;
    };
  }, [id, isEdit, t]);

  function updateField(name, value) {
    setForm((prev) => {
      const next = { ...prev, [name]: value };

      if (name === "module_key") {
        const moduleItem = HOW_TO_USE_MODULES.find((item) => item.moduleKey === value);
        next.slug = moduleItem?.slug || toSlug(value);
        next.icon = moduleItem?.icon || "help";
      }

      return next;
    });
  }

  async function onSubmit(event) {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");

      const payload = {
        module_key: form.module_key,
        slug: form.slug || toSlug(form.module_key),
        icon: form.icon || selectedModule?.icon || "help",
        sort_order: Number(form.sort_order || 0),
        title_de: form.title_de,
        title_en: form.title_en,
        description_de: form.description_de,
        description_en: form.description_en,
        content_de: form.content_de,
        content_en: form.content_en,
        steps_de: linesToArray(form.steps_de_text),
        steps_en: linesToArray(form.steps_en_text),
        images_json: imageLinesToArray(form.images_text),
        status: form.status,
      };

      const res = await apiFetch(isEdit ? `/admin/how-to-use/${id}` : "/admin/how-to-use", {
        method: isEdit ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const json = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(json?.message || t("howToUseFailedSave"));
      }

      const saved = json?.data;
      navigate(`/how-to-use/${saved?.slug || payload.slug}`);
    } catch (err) {
      setError(err?.message || t("howToUseFailedSave"));
    } finally {
      setSaving(false);
    }
  }

  if (!canManage) return null;

  if (loading) {
    return (
      <div className="rounded-[28px] border border-slate-200 bg-white p-6 text-sm font-bold text-slate-500 shadow-sm dark:border-white/10 dark:bg-slate-900 dark:text-slate-300">
        {t("howToUseLoading")}
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-slate-900">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className="text-xs font-black uppercase tracking-[0.22em] text-[#007ab3]">
              {t("howToUse")}
            </div>

            <h1 className="mt-2 text-2xl font-black text-slate-950 dark:text-white">
              {isEdit ? t("howToUseEdit") : t("howToUseCreate")}
            </h1>

            <p className="mt-2 max-w-3xl text-sm font-semibold leading-6 text-slate-500 dark:text-slate-300">
              {t("howToUseEditorSubtitle")}
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => navigate("/how-to-use")}
              className="inline-flex h-11 items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-black text-slate-700 transition hover:bg-slate-50 dark:border-white/10 dark:bg-slate-950 dark:text-slate-200"
            >
              <MIcon name="close" className="text-xl" />
              {t("cancel")}
            </button>

            <button
              type="submit"
              disabled={saving}
              className="inline-flex h-11 items-center gap-2 rounded-2xl bg-[#007ab3] px-5 text-sm font-black text-white shadow-lg shadow-[#007ab3]/20 transition hover:bg-[#005f8c] disabled:opacity-60"
            >
              <MIcon name="save" className="text-xl" />
              {saving ? t("howToUseSaving") : t("save")}
            </button>
          </div>
        </div>

        {error ? (
          <div className="mt-5 rounded-2xl bg-red-50 p-4 text-sm font-bold text-red-600 dark:bg-red-950/30">
            {error}
          </div>
        ) : null}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-slate-900">
            <h2 className="text-xl font-black text-slate-950 dark:text-white">
              {t("howToUseContentGerman")}
            </h2>

            <div className="mt-5 grid gap-4">
              <input
                value={form.title_de}
                onChange={(e) => updateField("title_de", e.target.value)}
                placeholder={t("howToUseTitleDe")}
                className="h-12 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-bold outline-none focus:border-[#007ab3] dark:border-white/10 dark:bg-slate-950 dark:text-white"
              />

              <textarea
                value={form.description_de}
                onChange={(e) => updateField("description_de", e.target.value)}
                placeholder={t("howToUseDescriptionDe")}
                rows={3}
                className="rounded-2xl border border-slate-200 bg-white p-4 text-sm font-bold outline-none focus:border-[#007ab3] dark:border-white/10 dark:bg-slate-950 dark:text-white"
              />

              <textarea
                value={form.content_de}
                onChange={(e) => updateField("content_de", e.target.value)}
                placeholder={t("howToUseContentDe")}
                rows={8}
                className="rounded-2xl border border-slate-200 bg-white p-4 text-sm font-bold outline-none focus:border-[#007ab3] dark:border-white/10 dark:bg-slate-950 dark:text-white"
              />

              <textarea
                value={form.steps_de_text}
                onChange={(e) => updateField("steps_de_text", e.target.value)}
                placeholder={t("howToUseStepsDePlaceholder")}
                rows={6}
                className="rounded-2xl border border-slate-200 bg-white p-4 text-sm font-bold outline-none focus:border-[#007ab3] dark:border-white/10 dark:bg-slate-950 dark:text-white"
              />
            </div>
          </section>

          <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-slate-900">
            <h2 className="text-xl font-black text-slate-950 dark:text-white">
              {t("howToUseContentEnglish")}
            </h2>

            <div className="mt-5 grid gap-4">
              <input
                value={form.title_en}
                onChange={(e) => updateField("title_en", e.target.value)}
                placeholder={t("howToUseTitleEn")}
                className="h-12 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-bold outline-none focus:border-[#007ab3] dark:border-white/10 dark:bg-slate-950 dark:text-white"
              />

              <textarea
                value={form.description_en}
                onChange={(e) => updateField("description_en", e.target.value)}
                placeholder={t("howToUseDescriptionEn")}
                rows={3}
                className="rounded-2xl border border-slate-200 bg-white p-4 text-sm font-bold outline-none focus:border-[#007ab3] dark:border-white/10 dark:bg-slate-950 dark:text-white"
              />

              <textarea
                value={form.content_en}
                onChange={(e) => updateField("content_en", e.target.value)}
                placeholder={t("howToUseContentEn")}
                rows={8}
                className="rounded-2xl border border-slate-200 bg-white p-4 text-sm font-bold outline-none focus:border-[#007ab3] dark:border-white/10 dark:bg-slate-950 dark:text-white"
              />

              <textarea
                value={form.steps_en_text}
                onChange={(e) => updateField("steps_en_text", e.target.value)}
                placeholder={t("howToUseStepsEnPlaceholder")}
                rows={6}
                className="rounded-2xl border border-slate-200 bg-white p-4 text-sm font-bold outline-none focus:border-[#007ab3] dark:border-white/10 dark:bg-slate-950 dark:text-white"
              />
            </div>
          </section>
        </div>

        <aside className="space-y-6">
          <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-slate-900">
            <h2 className="text-xl font-black text-slate-950 dark:text-white">
              {t("howToUseSettings")}
            </h2>

            <div className="mt-5 space-y-4">
              <label className="block">
                <span className="mb-2 block text-xs font-black uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  {t("howToUseModule")}
                </span>

                <select
                  value={form.module_key}
                  onChange={(e) => updateField("module_key", e.target.value)}
                  disabled={isEdit}
                  className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm font-bold outline-none focus:border-[#007ab3] disabled:opacity-70 dark:border-white/10 dark:bg-slate-950 dark:text-white"
                >
                  {HOW_TO_USE_MODULES.map((item) => (
                    <option key={item.moduleKey} value={item.moduleKey}>
                      {t(item.titleKey)}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block">
                <span className="mb-2 block text-xs font-black uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  {t("howToUseSlug")}
                </span>

                <input
                  value={form.slug}
                  onChange={(e) => updateField("slug", toSlug(e.target.value))}
                  className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm font-bold outline-none focus:border-[#007ab3] dark:border-white/10 dark:bg-slate-950 dark:text-white"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-xs font-black uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  {t("howToUseIcon")}
                </span>

                <input
                  value={form.icon}
                  onChange={(e) => updateField("icon", e.target.value)}
                  className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm font-bold outline-none focus:border-[#007ab3] dark:border-white/10 dark:bg-slate-950 dark:text-white"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-xs font-black uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  {t("status")}
                </span>

                <select
                  value={form.status}
                  onChange={(e) => updateField("status", e.target.value)}
                  className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm font-bold outline-none focus:border-[#007ab3] dark:border-white/10 dark:bg-slate-950 dark:text-white"
                >
                  <option value="active">{t("active")}</option>
                  <option value="draft">{t("draft")}</option>
                  <option value="inactive">{t("inactive")}</option>
                </select>
              </label>

              <label className="block">
                <span className="mb-2 block text-xs font-black uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  {t("howToUseImages")}
                </span>

                <textarea
                  value={form.images_text}
                  onChange={(e) => updateField("images_text", e.target.value)}
                  placeholder={t("howToUseImagesPlaceholder")}
                  rows={7}
                  className="w-full rounded-2xl border border-slate-200 bg-white p-4 text-sm font-bold outline-none focus:border-[#007ab3] dark:border-white/10 dark:bg-slate-950 dark:text-white"
                />
              </label>
            </div>
          </section>
        </aside>
      </div>
    </form>
  );
}