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

function normalizeStep(step = {}) {
  if (typeof step === "string") {
    return {
      title: "",
      text: step,
      image_url: "",
      caption: "",
    };
  }

  return {
    title: step?.title || "",
    text: step?.text || step?.body || step?.description || "",
    image_url: step?.image_url || step?.image || step?.url || "",
    caption: step?.caption || "",
  };
}

function normalizeSteps(value) {
  if (!Array.isArray(value) || !value.length) {
    return [
      { title: "", text: "", image_url: "", caption: "" },
      { title: "", text: "", image_url: "", caption: "" },
      { title: "", text: "", image_url: "", caption: "" },
    ];
  }

  return value.map(normalizeStep);
}

function cleanSteps(steps) {
  return (Array.isArray(steps) ? steps : [])
    .map((step) => ({
      title: String(step?.title || "").trim(),
      text: String(step?.text || "").trim(),
      image_url: String(step?.image_url || "").trim(),
      caption: String(step?.caption || "").trim(),
    }))
    .filter((step) => step.title || step.text || step.image_url || step.caption);
}

export default function HowToUseEditor() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { t } = useTranslation();

  const outletContext = useOutletContext() || {};
  const { canManage = false } = outletContext;

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
    steps_de: normalizeSteps([]),
    steps_en: normalizeSteps([]),
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
          steps_de: normalizeSteps(data.steps_de),
          steps_en: normalizeSteps(data.steps_en),
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
        const moduleItem = HOW_TO_USE_MODULES.find(
          (item) => item.moduleKey === value
        );

        next.slug = moduleItem?.slug || toSlug(value);
        next.icon = moduleItem?.icon || "help";
        next.sort_order =
          HOW_TO_USE_MODULES.findIndex((m) => m.moduleKey === value) * 10 + 10;
      }

      return next;
    });
  }

  function updateStep(lang, index, field, value) {
    const key = lang === "en" ? "steps_en" : "steps_de";

    setForm((prev) => {
      const steps = [...prev[key]];
      steps[index] = {
        ...steps[index],
        [field]: value,
      };

      return {
        ...prev,
        [key]: steps,
      };
    });
  }

  function addStep(lang) {
    const key = lang === "en" ? "steps_en" : "steps_de";

    setForm((prev) => ({
      ...prev,
      [key]: [
        ...prev[key],
        {
          title: "",
          text: "",
          image_url: "",
          caption: "",
        },
      ],
    }));
  }

  function removeStep(lang, index) {
    const key = lang === "en" ? "steps_en" : "steps_de";

    setForm((prev) => ({
      ...prev,
      [key]: prev[key].filter((_, i) => i !== index),
    }));
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
        steps_de: cleanSteps(form.steps_de),
        steps_en: cleanSteps(form.steps_en),
        images_json: [],
        status: form.status,
      };

      const res = await apiFetch(
        isEdit ? `/admin/how-to-use/${id}` : "/admin/how-to-use",
        {
          method: isEdit ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

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

  function StepEditor({ lang, steps }) {
    const isEnglish = lang === "en";

    return (
      <div className="space-y-4">
        {steps.map((step, index) => (
          <div
            key={`${lang}-${index}`}
            className="rounded-[28px] border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-slate-950"
          >
            <div className="mb-4 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#007ab3] text-sm font-black text-white">
                  {index + 1}
                </div>

                <div className="text-sm font-black text-slate-950 dark:text-white">
                  {t("howToUseStep")} {index + 1}
                </div>
              </div>

              {steps.length > 1 ? (
                <button
                  type="button"
                  onClick={() => removeStep(lang, index)}
                  className="inline-flex h-9 items-center gap-2 rounded-xl bg-red-50 px-3 text-xs font-black text-red-600 transition hover:bg-red-100 dark:bg-red-950/30"
                >
                  <MIcon name="delete" className="text-lg" />
                  {t("delete")}
                </button>
              ) : null}
            </div>

            <div className="grid gap-3">
              <input
                value={step.title}
                onChange={(e) =>
                  updateStep(lang, index, "title", e.target.value)
                }
                placeholder={
                  isEnglish
                    ? t("howToUseStepTitleEn")
                    : t("howToUseStepTitleDe")
                }
                className="h-11 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-bold outline-none focus:border-[#007ab3] dark:border-white/10 dark:bg-slate-900 dark:text-white"
              />

              <textarea
                value={step.text}
                onChange={(e) =>
                  updateStep(lang, index, "text", e.target.value)
                }
                placeholder={
                  isEnglish
                    ? t("howToUseStepTextEn")
                    : t("howToUseStepTextDe")
                }
                rows={4}
                className="rounded-2xl border border-slate-200 bg-white p-4 text-sm font-bold outline-none focus:border-[#007ab3] dark:border-white/10 dark:bg-slate-900 dark:text-white"
              />

              <input
                value={step.image_url}
                onChange={(e) =>
                  updateStep(lang, index, "image_url", e.target.value)
                }
                placeholder={t("howToUseStepImageUrl")}
                className="h-11 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-bold outline-none focus:border-[#007ab3] dark:border-white/10 dark:bg-slate-900 dark:text-white"
              />

              <input
                value={step.caption}
                onChange={(e) =>
                  updateStep(lang, index, "caption", e.target.value)
                }
                placeholder={t("howToUseStepImageCaption")}
                className="h-11 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-bold outline-none focus:border-[#007ab3] dark:border-white/10 dark:bg-slate-900 dark:text-white"
              />

              {step.image_url ? (
                <img
                  src={step.image_url}
                  alt={step.caption || step.title || "Step"}
                  className="max-h-[280px] w-full rounded-3xl border border-slate-200 object-contain dark:border-white/10"
                />
              ) : null}
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={() => addStep(lang)}
          className="inline-flex h-11 items-center gap-2 rounded-2xl bg-[#007ab3]/10 px-4 text-sm font-black text-[#007ab3] transition hover:bg-[#007ab3]/15"
        >
          <MIcon name="add" className="text-xl" />
          {t("howToUseAddStep")}
        </button>
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
                rows={6}
                className="rounded-2xl border border-slate-200 bg-white p-4 text-sm font-bold outline-none focus:border-[#007ab3] dark:border-white/10 dark:bg-slate-950 dark:text-white"
              />
            </div>

            <div className="mt-6">
              <h3 className="mb-4 text-lg font-black text-slate-950 dark:text-white">
                {t("howToUseSteps")}
              </h3>

              <StepEditor lang="de" steps={form.steps_de} />
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
                rows={6}
                className="rounded-2xl border border-slate-200 bg-white p-4 text-sm font-bold outline-none focus:border-[#007ab3] dark:border-white/10 dark:bg-slate-950 dark:text-white"
              />
            </div>

            <div className="mt-6">
              <h3 className="mb-4 text-lg font-black text-slate-950 dark:text-white">
                {t("howToUseSteps")}
              </h3>

              <StepEditor lang="en" steps={form.steps_en} />
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
                  {t("howToUseSortOrder")}
                </span>

                <input
                  type="number"
                  value={form.sort_order}
                  onChange={(e) => updateField("sort_order", e.target.value)}
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
            </div>
          </section>
        </aside>
      </div>
    </form>
  );
}