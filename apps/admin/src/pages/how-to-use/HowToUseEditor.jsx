import { useEffect, useMemo, useState } from "react";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import MIcon from "../../components/MIcon";
import { apiFetch } from "../../lib/auth";
import { HOW_TO_USE_MODULES } from "../../constants/howToUseModules";
import {
  getAllHowToUseMedia,
  getHowToUseMediaByModule,
} from "../../constants/howToUseMedia";

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
  const { canManage: layoutCanManage = false } = outletContext;

  const isEdit = Boolean(id);

  const [checkingAccess, setCheckingAccess] = useState(true);
  const [apiCanManage, setApiCanManage] = useState(false);

  const canManage = layoutCanManage || apiCanManage;

  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [mediaPicker, setMediaPicker] = useState({
    open: false,
    lang: "de",
    stepIndex: 0,
    search: "",
    selectedModuleKey: "",
  });

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

  const moduleMedia = useMemo(() => {
    return getHowToUseMediaByModule(form.module_key);
  }, [form.module_key]);

  const allMedia = useMemo(() => getAllHowToUseMedia(), []);

  const filteredMedia = useMemo(() => {
    const term = mediaPicker.search.trim().toLowerCase();
    const moduleKey = mediaPicker.selectedModuleKey || form.module_key;

    return allMedia.filter((image) => {
      const matchesModule = moduleKey ? image.moduleKey === moduleKey : true;

      const matchesSearch = term
        ? [
            image.label,
            image.url,
            image.moduleTitle,
            image.moduleKey,
          ]
            .filter(Boolean)
            .join(" ")
            .toLowerCase()
            .includes(term)
        : true;

      return matchesModule && matchesSearch;
    });
  }, [allMedia, mediaPicker.search, mediaPicker.selectedModuleKey, form.module_key]);

  useEffect(() => {
    let alive = true;

    async function checkAccess() {
      try {
        setCheckingAccess(true);

        const res = await apiFetch("/admin/how-to-use");
        const json = await res.json().catch(() => ({}));

        if (!alive) return;

        setApiCanManage(Boolean(json?.can_manage));
      } catch {
        if (!alive) return;
        setApiCanManage(false);
      } finally {
        if (alive) setCheckingAccess(false);
      }
    }

    checkAccess();

    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    let alive = true;

    async function load() {
      if (!isEdit) return;
      if (checkingAccess) return;
      if (!canManage) return;

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
  }, [id, isEdit, checkingAccess, canManage, t]);

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

  function openMediaPicker(lang, stepIndex) {
    setMediaPicker({
      open: true,
      lang,
      stepIndex,
      search: "",
      selectedModuleKey: form.module_key,
    });
  }

  function closeMediaPicker() {
    setMediaPicker((prev) => ({
      ...prev,
      open: false,
    }));
  }

  function selectMedia(image) {
    updateStep(mediaPicker.lang, mediaPicker.stepIndex, "image_url", image.url);

    const key = mediaPicker.lang === "en" ? "steps_en" : "steps_de";
    const currentStep = form[key]?.[mediaPicker.stepIndex];

    if (!currentStep?.caption) {
      updateStep(mediaPicker.lang, mediaPicker.stepIndex, "caption", image.label);
    }

    closeMediaPicker();
  }

  async function onSubmit(event) {
    event.preventDefault();

    if (!canManage) {
      setError("Only full admin can create or edit guides.");
      return;
    }

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

  if (checkingAccess) {
    return (
      <div className="rounded-[28px] border border-slate-200 bg-white p-6 text-sm font-bold text-slate-500 shadow-sm dark:border-white/10 dark:bg-slate-900 dark:text-slate-300">
        {t("howToUseLoading")}
      </div>
    );
  }

  if (!canManage) {
    return (
      <div className="rounded-[28px] border border-red-200 bg-red-50 p-6 shadow-sm dark:border-red-500/20 dark:bg-red-950/30">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-100 text-red-600 dark:bg-red-950/50">
            <MIcon name="lock" className="text-2xl" />
          </div>

          <div>
            <h1 className="text-xl font-black text-red-700 dark:text-red-300">
              Access denied
            </h1>

            <p className="mt-2 text-sm font-bold leading-6 text-red-600 dark:text-red-200">
              Only full admin can create or edit How to Use guides. Brand role
              can only view guides.
            </p>

            <button
              type="button"
              onClick={() => navigate("/how-to-use")}
              className="mt-5 inline-flex h-11 items-center gap-2 rounded-2xl bg-red-600 px-4 text-sm font-black text-white transition hover:bg-red-700"
            >
              <MIcon name="arrow_back" className="text-xl" />
              {t("howToUseBack")}
            </button>
          </div>
        </div>
      </div>
    );
  }

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
                onChange={(e) => updateStep(lang, index, "title", e.target.value)}
                placeholder={
                  isEnglish
                    ? t("howToUseStepTitleEn")
                    : t("howToUseStepTitleDe")
                }
                className="h-11 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-bold outline-none focus:border-[#007ab3] dark:border-white/10 dark:bg-slate-900 dark:text-white"
              />

              <textarea
                value={step.text}
                onChange={(e) => updateStep(lang, index, "text", e.target.value)}
                placeholder={
                  isEnglish
                    ? t("howToUseStepTextEn")
                    : t("howToUseStepTextDe")
                }
                rows={4}
                className="rounded-2xl border border-slate-200 bg-white p-4 text-sm font-bold outline-none focus:border-[#007ab3] dark:border-white/10 dark:bg-slate-900 dark:text-white"
              />

              <div className="grid gap-3 lg:grid-cols-[1fr_auto]">
                <input
                  value={step.image_url}
                  onChange={(e) =>
                    updateStep(lang, index, "image_url", e.target.value)
                  }
                  placeholder={t("howToUseStepImageUrl")}
                  className="h-11 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-bold outline-none focus:border-[#007ab3] dark:border-white/10 dark:bg-slate-900 dark:text-white"
                />

                <button
                  type="button"
                  onClick={() => openMediaPicker(lang, index)}
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-[#007ab3]/10 px-4 text-sm font-black text-[#007ab3] transition hover:bg-[#007ab3]/15"
                >
                  <MIcon name="perm_media" className="text-xl" />
                  Media
                </button>
              </div>

              <input
                value={step.caption}
                onChange={(e) =>
                  updateStep(lang, index, "caption", e.target.value)
                }
                placeholder={t("howToUseStepImageCaption")}
                className="h-11 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-bold outline-none focus:border-[#007ab3] dark:border-white/10 dark:bg-slate-900 dark:text-white"
              />

              {step.image_url ? (
                <div className="rounded-3xl border border-slate-200 bg-white p-3 dark:border-white/10 dark:bg-slate-900">
                  <img
                    src={step.image_url}
                    alt={step.caption || step.title || "Step"}
                    className="max-h-[280px] w-full rounded-2xl object-contain"
                  />
                </div>
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
    <>
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
                  onChange={(e) =>
                    updateField("description_de", e.target.value)
                  }
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
                  onChange={(e) =>
                    updateField("description_en", e.target.value)
                  }
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
                    onChange={(e) =>
                      updateField("sort_order", e.target.value)
                    }
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

                <div className="rounded-2xl bg-[#007ab3]/10 p-4 text-xs font-bold leading-5 text-[#007ab3]">
                  Media folder:{" "}
                  <span className="font-black">
                    public/how-to-use-media/
                  </span>
                  <br />
                  DB stores only image path, not image file.
                </div>

                {moduleMedia?.images?.length ? (
                  <div className="rounded-2xl border border-slate-200 p-3 dark:border-white/10">
                    <div className="mb-3 text-xs font-black uppercase tracking-wide text-slate-500 dark:text-slate-400">
                      Current module media
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      {moduleMedia.images.slice(0, 4).map((image) => (
                        <img
                          key={image.url}
                          src={image.url}
                          alt={image.label}
                          className="h-20 w-full rounded-xl border border-slate-200 object-cover dark:border-white/10"
                        />
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>
            </section>
          </aside>
        </div>
      </form>

      {mediaPicker.open ? (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm">
          <div className="max-h-[88vh] w-full max-w-6xl overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-2xl dark:border-white/10 dark:bg-slate-900">
            <div className="flex flex-col gap-4 border-b border-slate-200 p-5 dark:border-white/10 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <div className="text-xs font-black uppercase tracking-[0.22em] text-[#007ab3]">
                  Media Library
                </div>

                <h2 className="mt-1 text-2xl font-black text-slate-950 dark:text-white">
                  Select Step Image
                </h2>

                <p className="mt-1 text-sm font-semibold text-slate-500 dark:text-slate-300">
                  Images are loaded from public/how-to-use-media and saved as
                  URL/path in DB.
                </p>
              </div>

              <button
                type="button"
                onClick={closeMediaPicker}
                className="inline-flex h-11 items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-black text-slate-700 transition hover:bg-slate-50 dark:border-white/10 dark:bg-slate-950 dark:text-slate-200"
              >
                <MIcon name="close" className="text-xl" />
                Close
              </button>
            </div>

            <div className="grid gap-4 border-b border-slate-200 p-5 dark:border-white/10 lg:grid-cols-[260px_1fr]">
              <select
                value={mediaPicker.selectedModuleKey}
                onChange={(e) =>
                  setMediaPicker((prev) => ({
                    ...prev,
                    selectedModuleKey: e.target.value,
                  }))
                }
                className="h-12 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-bold outline-none focus:border-[#007ab3] dark:border-white/10 dark:bg-slate-950 dark:text-white"
              >
                <option value="">All modules</option>
                {HOW_TO_USE_MODULES.map((item) => (
                  <option key={item.moduleKey} value={item.moduleKey}>
                    {t(item.titleKey)}
                  </option>
                ))}
              </select>

              <input
                value={mediaPicker.search}
                onChange={(e) =>
                  setMediaPicker((prev) => ({
                    ...prev,
                    search: e.target.value,
                  }))
                }
                placeholder="Search media..."
                className="h-12 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-bold outline-none focus:border-[#007ab3] dark:border-white/10 dark:bg-slate-950 dark:text-white"
              />
            </div>

            <div className="max-h-[58vh] overflow-y-auto p-5">
              {filteredMedia.length ? (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {filteredMedia.map((image) => (
                    <button
                      key={`${image.moduleKey}-${image.url}`}
                      type="button"
                      onClick={() => selectMedia(image)}
                      className="group overflow-hidden rounded-3xl border border-slate-200 bg-slate-50 text-left transition hover:-translate-y-1 hover:border-[#007ab3]/40 hover:shadow-xl hover:shadow-[#007ab3]/10 dark:border-white/10 dark:bg-slate-950"
                    >
                      <div className="h-40 bg-white p-2 dark:bg-slate-900">
                        <img
                          src={image.url}
                          alt={image.label}
                          className="h-full w-full rounded-2xl object-cover"
                        />
                      </div>

                      <div className="p-4">
                        <div className="text-sm font-black text-slate-950 dark:text-white">
                          {image.label}
                        </div>

                        <div className="mt-1 text-xs font-bold text-[#007ab3]">
                          {image.moduleTitle}
                        </div>

                        <div className="mt-2 truncate text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                          {image.url}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="rounded-3xl border border-dashed border-slate-300 p-10 text-center text-sm font-bold text-slate-500 dark:border-white/10 dark:text-slate-300">
                  No media found. Add images inside public/how-to-use-media and
                  register them in src/constants/howToUseMedia.js.
                </div>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}