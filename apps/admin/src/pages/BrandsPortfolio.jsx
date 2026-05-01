import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import MIcon from "../components/MIcon";
import { apiFetch } from "../lib/auth";

function StatusPill({ status, t }) {
  const active = String(status || "").toLowerCase() === "active";

  return (
    <span
      className={[
        "inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-black uppercase border",
        active
          ? "bg-green-50 text-green-700 border-green-100 dark:bg-green-950/30 dark:text-green-300 dark:border-green-900/40"
          : "bg-slate-100 text-slate-500 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-white/10",
      ].join(" ")}
    >
      <span
        className={[
          "w-1.5 h-1.5 rounded-full",
          active ? "bg-green-500" : "bg-slate-400",
        ].join(" ")}
      />
      {active ? t("brandsPortfolioActive") : t("brandsPortfolioInactive")}
    </span>
  );
}

function KPI({ icon, title, value, hint, tone = "blue" }) {
  const isAmber = tone === "amber";
  const isGreen = tone === "green";

  return (
    <div className="group rounded-[28px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 shadow-sm hover:shadow-xl hover:shadow-[#007ab3]/10 transition-all p-6 overflow-hidden relative">
      <div className="absolute -right-10 -top-10 w-32 h-32 rounded-full bg-[#007ab3]/10 group-hover:bg-[#007ab3]/15 transition" />

      <div className="relative flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-black text-slate-400 uppercase tracking-[0.18em]">
            {title}
          </p>

          <p className="mt-3 text-3xl font-black text-gray-950 dark:text-white">
            {value}
          </p>

          <p
            className={[
              "mt-2 text-sm font-bold",
              isAmber
                ? "text-amber-600 dark:text-amber-300"
                : isGreen
                  ? "text-green-600 dark:text-green-300"
                  : "text-[#007ab3]",
            ].join(" ")}
          >
            {hint}
          </p>
        </div>

        <div className="w-12 h-12 rounded-2xl bg-gradient-to-b from-[#007ab3] to-[#005f8c] text-white flex items-center justify-center shadow-lg shadow-[#007ab3]/20">
          <MIcon name={icon} className="text-[22px]" />
        </div>
      </div>
    </div>
  );
}

function formatUpdated(updatedAt) {
  if (!updatedAt) return "-";
  const d = new Date(updatedAt);
  if (Number.isNaN(d.getTime())) return String(updatedAt);
  return d.toLocaleString();
}

export default function BrandsPortfolio() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");

  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function loadBrands() {
      try {
        setLoading(true);
        setErrorMsg("");

        const params = new URLSearchParams();
        if (query.trim()) params.set("q", query.trim());
        params.set("status", status);

        const res = await apiFetch(`/api/brands?${params.toString()}`, {
          signal: controller.signal,
        });

        const json = await res.json().catch(() => null);

        if (!res.ok || !json?.ok) {
          throw new Error(json?.message || t("brandsPortfolioFetchFailed"));
        }

        const normalized = (json.data || []).map((brand) => ({
          id: brand.id,
          name: brand.name,
          slug: brand.slug,
          route: brand.route || `/${brand.slug}`,
          status: brand.status || "inactive",
          templates: Number.isFinite(brand.templates) ? brand.templates : 0,
          updatedAt: brand.updatedAt || brand.updated_at || brand.updated,
          icon: brand.icon || "business",
        }));

        setBrands(normalized);
      } catch (e) {
        if (e?.name !== "AbortError") {
          console.error(e);
          setErrorMsg(e?.message || t("brandsPortfolioSomethingWrong"));
          setBrands([]);
        }
      } finally {
        setLoading(false);
      }
    }

    const timer = setTimeout(loadBrands, 250);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query, status, t]);

  const filtered = useMemo(() => {
    let email = "";

    for (const key of Object.keys(localStorage)) {
      try {
        const value = localStorage.getItem(key);
        const parsed = JSON.parse(value || "{}");

        if (parsed?.email) {
          email = String(parsed.email).toLowerCase();
          break;
        }

        if (parsed?.user?.email) {
          email = String(parsed.user.email).toLowerCase();
          break;
        }
      } catch {}
    }

    const allowSlugs =
      email === "admin2@mahimediasolutions.com"
        ? new Set(["kundler3", "allianz4", "dropbrand"])
        : new Set(["kundler3", "allianz4"]);

    return (brands || []).filter((brand) => {
      const slug = String(brand?.slug || "").trim().toLowerCase();
      const route = String(brand?.route || "").trim().toLowerCase().replace("/", "");
      return allowSlugs.has(slug) || allowSlugs.has(route);
    });
  }, [brands]);

  const totalCount = filtered.length;
  const activeCount = filtered.filter(
    (brand) => String(brand.status || "").toLowerCase() === "active"
  ).length;
  const inactiveCount = totalCount - activeCount;
  const activeRate = totalCount ? ((activeCount / totalCount) * 100).toFixed(1) : "0.0";

  const showingFrom = totalCount ? 1 : 0;
  const showingTo = totalCount;

  return (
    <div className="space-y-8">
      <div className="rounded-[28px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 shadow-sm p-5 flex flex-col xl:flex-row xl:items-center xl:justify-between gap-5">
        <div>
          <div className="text-xs font-black uppercase tracking-[0.2em] text-[#007ab3]">
            Allianz Panel
          </div>

          <h2 className="mt-1 text-2xl font-black text-gray-950 dark:text-white">
            {t("brandsPortfolioTitle")}
          </h2>

          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {t("brandsPortfolioDesc", { total: totalCount })}
          </p>
        </div>

        <div className="flex flex-col md:flex-row md:items-center gap-3">
          <div className="relative w-full md:w-80">
            <MIcon
              name="search"
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-[20px]"
            />

            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full h-12 bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-2xl pl-12 pr-4 text-sm text-gray-950 dark:text-white placeholder:text-slate-400 outline-none focus:ring-4 focus:ring-[#007ab3]/20 focus:border-[#007ab3] transition"
              placeholder={t("brandsPortfolioSearchPlaceholder")}
              type="text"
            />
          </div>

          <div className="flex items-center bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-2xl p-1 shadow-sm">
            {[
              ["all", t("brandsPortfolioAll")],
              ["active", t("brandsPortfolioActive")],
              ["inactive", t("brandsPortfolioInactive")],
            ].map(([key, label]) => (
              <button
                key={key}
                onClick={() => setStatus(key)}
                className={[
                  "px-4 h-10 text-xs font-black rounded-xl transition",
                  status === key
                    ? "bg-gradient-to-r from-[#007ab3] to-[#005f8c] text-white shadow-lg shadow-[#007ab3]/15"
                    : "text-slate-500 hover:bg-[#007ab3]/10 hover:text-[#007ab3]",
                ].join(" ")}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <KPI
          icon="groups"
          title={t("brandsPortfolioTotalBrands")}
          value={String(totalCount)}
          hint={t("brandsPortfolioActiveInactiveHint", {
            active: activeCount,
            inactive: inactiveCount,
          })}
        />

        <KPI
          icon="check_circle"
          title={t("brandsPortfolioActiveRate")}
          value={`${activeRate}%`}
          hint={t("brandsPortfolioHealth")}
          tone="green"
        />

        <KPI
          icon="history"
          title={t("brandsPortfolioSyncStatus")}
          value={loading ? t("brandsPortfolioSyncing") : t("brandsPortfolioUpToDate")}
          hint={errorMsg ? t("brandsPortfolioApiError") : t("brandsPortfolioLastFetchOk")}
          tone={errorMsg ? "red" : "amber"}
        />
      </div>

      {errorMsg ? (
        <div className="rounded-2xl bg-red-50 dark:bg-red-950/30 border border-red-100 dark:border-red-900/40 text-red-700 dark:text-red-300 text-sm px-5 py-4">
          {errorMsg}
        </div>
      ) : null}

      <div className="rounded-[28px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[920px] text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-950/60 border-b border-slate-200 dark:border-white/10">
                <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-[0.16em]">
                  {t("brandsPortfolioBrandName")}
                </th>

                <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-[0.16em]">
                  {t("brandsPortfolioRoute")}
                </th>

                <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-[0.16em]">
                  {t("brandsPortfolioStatus")}
                </th>

                <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-[0.16em]">
                  {t("brandsPortfolioTemplates")}
                </th>

                <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-[0.16em]">
                  {t("brandsPortfolioLastUpdated")}
                </th>

                <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-[0.16em] text-right">
                  {t("brandsPortfolioActions")}
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 dark:divide-white/10">
              {loading ? (
                <tr>
                  <td className="px-6 py-8 text-sm text-slate-500" colSpan={6}>
                    {t("brandsPortfolioLoadingBrands")}
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td className="px-6 py-8 text-sm text-slate-500" colSpan={6}>
                    {t("brandsPortfolioNoBrands")}
                  </td>
                </tr>
              ) : (
                filtered.map((brand) => (
                  <tr
                    key={brand.id}
                    className="hover:bg-[#007ab3]/5 transition-colors cursor-pointer"
                    onClick={() => navigate(`/brands/${brand.id}`)}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-2xl bg-[#007ab3]/10 flex items-center justify-center shrink-0">
                          <MIcon
                            name={brand.icon}
                            className="text-[21px] text-[#007ab3]"
                          />
                        </div>

                        <div className="min-w-0">
                          <div className="text-sm font-black text-gray-950 dark:text-white truncate">
                            {brand.name}
                          </div>
                          <div className="text-xs font-semibold text-slate-400 truncate">
                            {brand.slug}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <span className="inline-flex items-center rounded-xl bg-slate-100 dark:bg-slate-950 px-3 py-1.5 text-xs font-mono font-bold text-slate-600 dark:text-slate-300">
                        {brand.route}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <StatusPill status={brand.status} t={t} />
                    </td>

                    <td className="px-6 py-4">
                      <span className="text-sm font-black text-gray-950 dark:text-white">
                        {brand.templates}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-sm font-semibold text-slate-500 dark:text-slate-400">
                      {formatUpdated(brand.updatedAt)}
                    </td>

                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          className="w-9 h-9 text-slate-400 hover:text-[#007ab3] hover:bg-[#007ab3]/10 rounded-xl transition-all"
                          title={t("brandsPortfolioManage")}
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/brands/${brand.id}`);
                          }}
                        >
                          <MIcon name="settings" className="text-[18px]" />
                        </button>

                        <button
                          className="w-9 h-9 text-slate-400 hover:text-[#007ab3] hover:bg-[#007ab3]/10 rounded-xl transition-all"
                          title={t("brandsPortfolioEdit")}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <MIcon name="edit" className="text-[18px]" />
                        </button>

                        <button
                          className="w-9 h-9 text-slate-400 hover:text-[#007ab3] hover:bg-[#007ab3]/10 rounded-xl transition-all"
                          title={t("brandsPortfolioDuplicate")}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <MIcon name="content_copy" className="text-[18px]" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-4 border-t border-slate-100 dark:border-white/10 bg-slate-50 dark:bg-slate-950/60 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">
            {t("brandsPortfolioShowing", {
              from: showingFrom,
              to: showingTo,
              total: totalCount,
            })}
          </span>

          <div className="flex items-center gap-1">
            <button
              className="w-9 h-9 flex items-center justify-center text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-xl transition-colors disabled:opacity-30"
              disabled
            >
              <MIcon name="chevron_left" className="text-[20px]" />
            </button>

            <button className="w-9 h-9 flex items-center justify-center bg-gradient-to-r from-[#007ab3] to-[#005f8c] text-white text-xs font-black rounded-xl">
              1
            </button>

            <button className="w-9 h-9 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 text-xs font-black rounded-xl">
              2
            </button>

            <button className="w-9 h-9 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 text-xs font-black rounded-xl">
              3
            </button>

            <span className="px-1 text-slate-400">...</span>

            <button className="w-9 h-9 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 text-xs font-black rounded-xl">
              6
            </button>

            <button className="w-9 h-9 flex items-center justify-center text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-xl transition-colors">
              <MIcon name="chevron_right" className="text-[20px]" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}