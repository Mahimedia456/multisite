import { useEffect, useMemo, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { useTranslation } from "react-i18next";
import MIcon from "../../components/MIcon";
import { apiFetch } from "../../lib/auth";
import { HOW_TO_USE_MODULES } from "../../constants/howToUseModules";

function getLocalized(item, lang, field) {
  const suffix = lang === "en" ? "en" : "de";
  return item?.[`${field}_${suffix}`] || item?.[field] || "";
}

export default function HowToUseIndex() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const { canManage } = useOutletContext();

  const [loading, setLoading] = useState(true);
  const [guides, setGuides] = useState([]);
  const [error, setError] = useState("");

  const lang = i18n.language === "en" ? "en" : "de";

  useEffect(() => {
    let alive = true;

    async function load() {
      try {
        setLoading(true);
        setError("");

        const res = await apiFetch("/admin/how-to-use");
        const json = await res.json().catch(() => ({}));

        if (!res.ok) {
          throw new Error(json?.message || "Failed to load guides");
        }

        if (!alive) return;
        setGuides(Array.isArray(json?.data) ? json.data : []);
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
  }, [t]);

  const mergedItems = useMemo(() => {
    return HOW_TO_USE_MODULES.map((moduleItem) => {
      const found = guides.find((guide) => guide.module_key === moduleItem.moduleKey);
      return {
        ...moduleItem,
        guide: found || null,
      };
    });
  }, [guides]);

  return (
    <div className="space-y-8">
      <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-slate-900">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className="text-xs font-black uppercase tracking-[0.22em] text-[#007ab3]">
              {t("howToUse")}
            </div>

            <h1 className="mt-2 text-2xl font-black text-slate-950 dark:text-white">
              {t("howToUseTitle")}
            </h1>

            <p className="mt-2 max-w-3xl text-sm font-semibold leading-6 text-slate-500 dark:text-slate-300">
              {t("howToUseSubtitle")}
            </p>
          </div>

          {canManage ? (
            <button
              type="button"
              onClick={() => navigate("/how-to-use/create")}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-[#007ab3] px-5 text-sm font-black text-white shadow-lg shadow-[#007ab3]/20 transition hover:bg-[#005f8c]"
            >
              <MIcon name="add" className="text-xl" />
              {t("howToUseCreate")}
            </button>
          ) : null}
        </div>

        {loading ? (
          <div className="mt-5 text-sm font-bold text-slate-500 dark:text-slate-300">
            {t("howToUseLoading")}
          </div>
        ) : null}

        {error ? (
          <div className="mt-5 rounded-2xl bg-red-50 p-4 text-sm font-bold text-red-600 dark:bg-red-950/30">
            {error}
          </div>
        ) : null}
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {mergedItems.map((item) => {
          const guide = item.guide;
          const title = guide ? getLocalized(guide, lang, "title") : t(item.titleKey);
          const description = guide
            ? getLocalized(guide, lang, "description")
            : t(item.descriptionKey);

          return (
            <button
              key={item.moduleKey}
              type="button"
              onClick={() => navigate(`/how-to-use/${guide?.slug || item.slug}`)}
              className="group rounded-[28px] border border-slate-200 bg-white p-6 text-left shadow-sm transition hover:-translate-y-1 hover:border-[#007ab3]/30 hover:shadow-xl hover:shadow-[#007ab3]/10 dark:border-white/10 dark:bg-slate-900 dark:hover:border-[#007ab3]/40"
            >
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#007ab3]/10 text-[#007ab3] transition group-hover:bg-[#007ab3] group-hover:text-white">
                <MIcon name={guide?.icon || item.icon} className="text-3xl" />
              </div>

              <div className="flex items-start justify-between gap-3">
                <h2 className="text-lg font-black text-slate-950 dark:text-white">
                  {title}
                </h2>

                {guide?.status === "draft" ? (
                  <span className="rounded-full bg-amber-50 px-2.5 py-1 text-[10px] font-black uppercase tracking-wide text-amber-700 dark:bg-amber-950/40 dark:text-amber-300">
                    {t("draft")}
                  </span>
                ) : null}
              </div>

              <p className="mt-2 text-sm font-semibold leading-6 text-slate-500 dark:text-slate-300">
                {description || t("howToUseNoDescription")}
              </p>

              <div className="mt-5 flex items-center gap-2 text-sm font-black text-[#007ab3]">
                <span>{t("howToUseOpen")}</span>
                <MIcon
                  name="arrow_forward"
                  className="text-xl transition group-hover:translate-x-1"
                />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}