import { useEffect, useMemo, useState } from "react";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import MIcon from "../../components/MIcon";
import { apiFetch } from "../../lib/auth";

function localized(guide, lang, field) {
  const suffix = lang === "en" ? "en" : "de";
  return guide?.[`${field}_${suffix}`] || guide?.[field] || "";
}

function localizedSteps(guide, lang) {
  const steps = lang === "en" ? guide?.steps_en : guide?.steps_de;
  return Array.isArray(steps) ? steps : [];
}

function imagesList(guide) {
  return Array.isArray(guide?.images_json) ? guide.images_json : [];
}

export default function HowToUseDetail() {
  const navigate = useNavigate();
  const { slug } = useParams();
  const { t, i18n } = useTranslation();
  const { canManage } = useOutletContext();

  const [guide, setGuide] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
  const description = useMemo(() => localized(guide, lang, "description"), [guide, lang]);
  const content = useMemo(() => localized(guide, lang, "content"), [guide, lang]);
  const steps = useMemo(() => localizedSteps(guide, lang), [guide, lang]);
  const images = useMemo(() => imagesList(guide), [guide]);

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

              <p className="mt-2 max-w-3xl text-sm font-semibold leading-6 text-slate-500 dark:text-slate-300">
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

            {canManage ? (
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

      <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-slate-900">
            <h2 className="text-xl font-black text-slate-950 dark:text-white">
              {t("howToUseGuideContent")}
            </h2>

            <div className="mt-4 whitespace-pre-line text-sm font-semibold leading-7 text-slate-600 dark:text-slate-300">
              {content || t("howToUseNoContent")}
            </div>
          </section>

          <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-slate-900">
            <h2 className="text-xl font-black text-slate-950 dark:text-white">
              {t("howToUseSteps")}
            </h2>

            {steps.length ? (
              <div className="mt-5 space-y-4">
                {steps.map((step, index) => (
                  <div
                    key={`${step}-${index}`}
                    className="flex gap-4 rounded-3xl border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-slate-950"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#007ab3] text-sm font-black text-white">
                      {index + 1}
                    </div>

                    <div className="pt-2 text-sm font-semibold leading-6 text-slate-700 dark:text-slate-200">
                      {step}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-4 text-sm font-semibold text-slate-500 dark:text-slate-300">
                {t("howToUseNoSteps")}
              </p>
            )}
          </section>
        </div>

        <aside className="space-y-6">
          <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-slate-900">
            <h2 className="text-xl font-black text-slate-950 dark:text-white">
              {t("howToUseImages")}
            </h2>

            {images.length ? (
              <div className="mt-5 space-y-4">
                {images.map((img, index) => {
                  const url = typeof img === "string" ? img : img?.url;
                  const caption = typeof img === "string" ? "" : img?.caption;

                  return (
                    <figure
                      key={`${url}-${index}`}
                      className="overflow-hidden rounded-3xl border border-slate-200 bg-slate-50 dark:border-white/10 dark:bg-slate-950"
                    >
                      <img
                        src={url}
                        alt={caption || title}
                        className="h-auto w-full object-cover"
                      />

                      {caption ? (
                        <figcaption className="p-3 text-xs font-bold text-slate-500 dark:text-slate-300">
                          {caption}
                        </figcaption>
                      ) : null}
                    </figure>
                  );
                })}
              </div>
            ) : (
              <p className="mt-4 text-sm font-semibold text-slate-500 dark:text-slate-300">
                {t("howToUseNoImages")}
              </p>
            )}
          </section>

          <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-slate-900">
            <h2 className="text-xl font-black text-slate-950 dark:text-white">
              {t("howToUseInfo")}
            </h2>

            <div className="mt-4 space-y-3 text-sm font-semibold text-slate-600 dark:text-slate-300">
              <div className="flex justify-between gap-4">
                <span>{t("howToUseModuleKey")}</span>
                <span className="font-black text-slate-950 dark:text-white">
                  {guide.module_key}
                </span>
              </div>

              <div className="flex justify-between gap-4">
                <span>{t("status")}</span>
                <span className="font-black text-[#007ab3]">
                  {guide.status}
                </span>
              </div>
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}