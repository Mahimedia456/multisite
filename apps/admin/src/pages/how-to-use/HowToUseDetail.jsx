import { useEffect, useMemo, useState } from "react";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import MIcon from "../../components/MIcon";
import { apiFetch } from "../../lib/auth";

function localized(guide, lang, field) {
  const suffix = lang === "en" ? "en" : "de";
  return guide?.[`${field}_${suffix}`] || guide?.[field] || "";
}

function sanitizeHtml(html) {
  if (!html) return "";

  if (typeof window === "undefined" || typeof DOMParser === "undefined") {
    return String(html || "");
  }

  const parser = new DOMParser();
  const doc = parser.parseFromString(String(html || ""), "text/html");

  doc.querySelectorAll("script, style, iframe, object, embed").forEach((node) =>
    node.remove()
  );

  doc.body.querySelectorAll("*").forEach((node) => {
    [...node.attributes].forEach((attr) => {
      const name = attr.name.toLowerCase();
      const value = attr.value || "";

      if (name.startsWith("on")) {
        node.removeAttribute(attr.name);
      }

      if (
        ["href", "src"].includes(name) &&
        value.trim().toLowerCase().startsWith("javascript:")
      ) {
        node.removeAttribute(attr.name);
      }
    });
  });

  return doc.body.innerHTML;
}

function HtmlContent({ html, fallback }) {
  const clean = sanitizeHtml(html);

  if (!clean) {
    return fallback ? (
      <div className="text-sm font-semibold leading-7 text-slate-500 dark:text-slate-300">
        {fallback}
      </div>
    ) : null;
  }

  return (
    <div
      className="max-w-none text-sm font-semibold leading-7 text-slate-600 dark:text-slate-300 [&_a]:font-black [&_a]:text-[#007ab3] [&_br]:block [&_h1]:mb-3 [&_h1]:mt-5 [&_h1]:text-2xl [&_h1]:font-black [&_h2]:mb-3 [&_h2]:mt-5 [&_h2]:text-xl [&_h2]:font-black [&_h3]:mb-2 [&_h3]:mt-4 [&_h3]:text-lg [&_h3]:font-black [&_li]:ml-5 [&_ol]:my-3 [&_ol]:list-decimal [&_p]:my-3 [&_strong]:font-black [&_ul]:my-3 [&_ul]:list-disc"
      dangerouslySetInnerHTML={{ __html: clean }}
    />
  );
}

function normalizeStepImages(step = {}) {
  const fromImages = Array.isArray(step?.images)
    ? step.images
    : Array.isArray(step?.image_urls)
    ? step.image_urls.map((url) => ({ url, caption: "" }))
    : [];

  const legacyImage =
    step?.image_url || step?.image || step?.url
      ? [
          {
            url: step?.image_url || step?.image || step?.url || "",
            caption: step?.caption || "",
          },
        ]
      : [];

  const seen = new Set();

  return [...fromImages, ...legacyImage]
    .map((image) => ({
      url: String(image?.url || image?.image_url || "").trim(),
      caption: String(image?.caption || "").trim(),
    }))
    .filter((image) => {
      if (!image.url) return false;
      if (seen.has(image.url)) return false;
      seen.add(image.url);
      return true;
    });
}

function normalizeSteps(value) {
  if (!Array.isArray(value)) return [];

  return value
    .map((step) => {
      if (typeof step === "string") {
        return {
          title: "",
          text: step,
          image_url: "",
          caption: "",
          images: [],
        };
      }

      const images = normalizeStepImages(step);

      return {
        title: step?.title || "",
        text: step?.text || step?.body || step?.description || "",
        image_url: step?.image_url || step?.image || step?.url || images[0]?.url || "",
        caption: step?.caption || images[0]?.caption || "",
        images,
      };
    })
    .filter(
      (step) =>
        step.title || step.text || step.image_url || step.images?.length
    );
}

function localizedSteps(guide, lang) {
  const steps = lang === "en" ? guide?.steps_en : guide?.steps_de;
  return normalizeSteps(steps);
}

export default function HowToUseDetail() {
  const navigate = useNavigate();
  const { slug } = useParams();
  const { t, i18n } = useTranslation();

  const outletContext = useOutletContext() || {};
  const { canManage = false } = outletContext;

  const [guide, setGuide] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [apiCanManage, setApiCanManage] = useState(false);

  const effectiveCanManage = canManage || apiCanManage;
  const lang = i18n.language === "en" ? "en" : "de";

  useEffect(() => {
    let alive = true;

    async function load() {
      try {
        setLoading(true);
        setError("");

        const res = await apiFetch(`/admin/how-to-use/${slug}`);
        const json = await res.json().catch(() => ({}));

        if (!res.ok) {
          throw new Error(json?.message || t("howToUseFailedLoad"));
        }

        if (!alive) return;

        setGuide(json?.data || null);
        setApiCanManage(Boolean(json?.can_manage));
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
  }, [slug, t]);

  const title = useMemo(() => localized(guide, lang, "title"), [guide, lang]);
  const description = useMemo(
    () => localized(guide, lang, "description"),
    [guide, lang]
  );
  const content = useMemo(() => localized(guide, lang, "content"), [guide, lang]);
  const steps = useMemo(() => localizedSteps(guide, lang), [guide, lang]);

  if (loading) {
    return (
      <div className="rounded-[28px] border border-slate-200 bg-white p-6 text-sm font-bold text-slate-500 shadow-sm dark:border-white/10 dark:bg-slate-900 dark:text-slate-300">
        {t("howToUseLoading")}
      </div>
    );
  }

  if (error || !guide) {
    return (
      <div className="rounded-[28px] border border-red-200 bg-red-50 p-6 text-sm font-bold text-red-600 dark:border-red-500/20 dark:bg-red-950/30">
        {error || t("howToUseNotFound")}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-slate-900">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-[#007ab3]/10 text-[#007ab3]">
              <MIcon name={guide.icon || "help"} className="text-4xl" />
            </div>

            <div>
              <div className="text-xs font-black uppercase tracking-[0.22em] text-[#007ab3]">
                {t("howToUse")}
              </div>

              <h1 className="mt-2 text-3xl font-black text-slate-950 dark:text-white">
                {title}
              </h1>

              <p className="mt-2 max-w-4xl text-sm font-semibold leading-6 text-slate-500 dark:text-slate-300">
                {description}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => navigate("/how-to-use")}
              className="inline-flex h-11 items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-black text-slate-700 transition hover:bg-slate-50 dark:border-white/10 dark:bg-slate-950 dark:text-slate-200"
            >
              <MIcon name="arrow_back" className="text-xl" />
              {t("howToUseBack")}
            </button>

            {effectiveCanManage ? (
              <button
                type="button"
                onClick={() => navigate(`/how-to-use/${guide.id}/edit`)}
                className="inline-flex h-11 items-center gap-2 rounded-2xl bg-[#007ab3] px-4 text-sm font-black text-white shadow-lg shadow-[#007ab3]/20 transition hover:bg-[#005f8c]"
              >
                <MIcon name="edit" className="text-xl" />
                {t("howToUseEdit")}
              </button>
            ) : null}
          </div>
        </div>
      </div>

      <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-slate-900">
        <h2 className="text-xl font-black text-slate-950 dark:text-white">
          {t("howToUseGuideContent")}
        </h2>

        <div className="mt-4">
          <HtmlContent html={content} fallback={t("howToUseNoContent")} />
        </div>
      </section>

      <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-slate-900">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="text-xs font-black uppercase tracking-[0.22em] text-[#007ab3]">
              {t("howToUseSteps")}
            </div>

            <h2 className="mt-2 text-2xl font-black text-slate-950 dark:text-white">
              {t("howToUseStepByStep")}
            </h2>
          </div>

          <div className="rounded-full bg-[#007ab3]/10 px-4 py-2 text-xs font-black text-[#007ab3]">
            {steps.length} {t("howToUseSteps")}
          </div>
        </div>

        {steps.length ? (
          <div className="mt-6 space-y-6">
            {steps.map((step, index) => {
              const images = normalizeStepImages(step);

              return (
                <article
                  key={`${step.title}-${index}`}
                  className="overflow-hidden rounded-[28px] border border-slate-200 bg-slate-50 dark:border-white/10 dark:bg-slate-950"
                >
                  <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-start">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#007ab3] text-lg font-black text-white shadow-lg shadow-[#007ab3]/20">
                      {index + 1}
                    </div>

                    <div className="min-w-0 flex-1">
                      <h3 className="text-lg font-black text-slate-950 dark:text-white">
                        {step.title || `${t("howToUseStep")} ${index + 1}`}
                      </h3>

                      {step.text ? (
                        <div className="mt-2">
                          <HtmlContent html={step.text} />
                        </div>
                      ) : null}
                    </div>
                  </div>

                  {images.length ? (
                    <div className="space-y-4 border-t border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-slate-900">
                      {images.map((image, imageIndex) => (
                        <div
                          key={`${image.url}-${imageIndex}`}
                          className="rounded-3xl border border-slate-200 bg-slate-50 p-3 dark:border-white/10 dark:bg-slate-950"
                        >
                          <img
                            src={image.url}
                            alt={
                              image.caption ||
                              step.title ||
                              `${t("howToUseStep")} ${index + 1}`
                            }
                            className="max-h-[520px] w-full rounded-2xl object-contain"
                          />

                          {image.caption ? (
                            <div className="mt-3 text-center text-xs font-bold text-slate-500 dark:text-slate-300">
                              {image.caption}
                            </div>
                          ) : null}
                        </div>
                      ))}
                    </div>
                  ) : null}
                </article>
              );
            })}
          </div>
        ) : (
          <p className="mt-4 text-sm font-semibold text-slate-500 dark:text-slate-300">
            {t("howToUseNoSteps")}
          </p>
        )}
      </section>

      <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-slate-900">
        <h2 className="text-xl font-black text-slate-950 dark:text-white">
          {t("howToUseInfo")}
        </h2>

        <div className="mt-4 grid gap-3 text-sm font-semibold text-slate-600 dark:text-slate-300 sm:grid-cols-2">
          <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-950">
            <div className="text-xs font-black uppercase tracking-wide text-slate-400">
              {t("howToUseModuleKey")}
            </div>
            <div className="mt-1 font-black text-slate-950 dark:text-white">
              {guide.module_key}
            </div>
          </div>

          <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-950">
            <div className="text-xs font-black uppercase tracking-wide text-slate-400">
              {t("status")}
            </div>
            <div className="mt-1 font-black text-[#007ab3]">
              {guide.status}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}