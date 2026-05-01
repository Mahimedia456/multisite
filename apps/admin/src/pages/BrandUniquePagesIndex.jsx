import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { apiGet } from "../lib/api";
import MIcon from "../components/MIcon";

function StatusPill({ active, t }) {
  return (
    <span
      className={[
        "inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-black uppercase border",
        active
          ? "bg-green-50 text-green-700 border-green-100 dark:bg-green-950/30 dark:text-green-300 dark:border-green-900/40"
          : "bg-slate-100 text-slate-500 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-white/10",
      ].join(" ")}
    >
      <span
        className={[
          "h-1.5 w-1.5 rounded-full",
          active ? "bg-green-500" : "bg-slate-400",
        ].join(" ")}
      />
      {active ? t("uniquePagesActive") : t("uniquePagesInactive")}
    </span>
  );
}

function StatCard({ title, value, note, icon, tone = "blue" }) {
  const isGreen = tone === "green";
  const isAmber = tone === "amber";

  return (
    <div className="group relative overflow-hidden rounded-[28px] bg-white p-6 shadow-sm border border-slate-200 transition-all hover:shadow-xl hover:shadow-[#007ab3]/10 dark:bg-slate-900 dark:border-white/10">
      <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-[#007ab3]/10 transition group-hover:bg-[#007ab3]/15" />

      <div className="relative flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">
            {title}
          </p>

          <h2 className="mt-3 text-3xl font-black text-gray-950 dark:text-white">
            {value}
          </h2>

          <p
            className={[
              "mt-2 text-sm font-bold",
              isGreen
                ? "text-green-600 dark:text-green-300"
                : isAmber
                  ? "text-amber-600 dark:text-amber-300"
                  : "text-[#007ab3]",
            ].join(" ")}
          >
            {note}
          </p>
        </div>

        <div
          className={[
            "grid h-12 w-12 place-items-center rounded-2xl",
            isGreen
              ? "bg-green-50 text-green-600 dark:bg-green-950/30 dark:text-green-300"
              : isAmber
                ? "bg-amber-50 text-amber-600 dark:bg-amber-950/30 dark:text-amber-300"
                : "bg-gradient-to-b from-[#007ab3] to-[#005f8c] text-white shadow-lg shadow-[#007ab3]/20",
          ].join(" ")}
        >
          <MIcon name={icon} className="text-[22px]" />
        </div>
      </div>
    </div>
  );
}

export default function BrandUniquePagesIndex() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [brands, setBrands] = useState([]);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [loading, setLoading] = useState(true);

  async function loadBrands() {
    setLoading(true);

    try {
      const res = await apiGet("/api/brands");
      setBrands(Array.isArray(res?.data) ? res.data : []);
    } catch (e) {
      alert(e?.message || t("uniquePagesFailedLoadBrands"));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadBrands();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredBrands = useMemo(() => {
    const q = query.trim().toLowerCase();

    return brands.filter((brand) => {
      const brandStatus = String(brand.status || "").toLowerCase();

      if (status !== "all" && brandStatus !== status) return false;

      if (!q) return true;

      return (
        String(brand.name || "").toLowerCase().includes(q) ||
        String(brand.slug || "").toLowerCase().includes(q) ||
        String(brand.route || "").toLowerCase().includes(q) ||
        brandStatus.includes(q)
      );
    });
  }, [brands, query, status]);

  const activeCount = brands.filter(
    (brand) => String(brand.status || "").toLowerCase() === "active"
  ).length;

  const inactiveCount = Math.max(0, brands.length - activeCount);
  const activeRate = brands.length
    ? Math.round((activeCount / brands.length) * 100)
    : 0;

  const showingFrom = filteredBrands.length ? 1 : 0;
  const showingTo = filteredBrands.length;

  if (loading) {
    return (
      <div className="p-8 text-slate-500 dark:text-slate-400">
        {t("uniquePagesLoadingBrands")}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="rounded-[28px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 shadow-sm p-5 flex flex-col xl:flex-row xl:items-center xl:justify-between gap-5">
        <div>
          <div className="text-xs font-black uppercase tracking-[0.2em] text-[#007ab3]">
            Allianz Panel
          </div>

          <h1 className="mt-1 text-2xl font-black text-gray-950 dark:text-white">
            {t("uniquePagesPortfolioTitle")}
          </h1>

          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {t("uniquePagesPortfolioDesc", {
              active: activeCount,
              inactive: inactiveCount,
            })}
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
              placeholder={t("uniquePagesSearchPlaceholder")}
              className="w-full h-12 bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-2xl pl-12 pr-4 text-sm text-gray-950 dark:text-white placeholder:text-slate-400 outline-none focus:ring-4 focus:ring-[#007ab3]/20 focus:border-[#007ab3] transition"
            />
          </div>

          <div className="flex items-center bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-2xl p-1 shadow-sm">
            {[
              { value: "all", label: t("uniquePagesAll") },
              { value: "active", label: t("uniquePagesActive") },
              { value: "inactive", label: t("uniquePagesInactive") },
            ].map((item) => (
              <button
                key={item.value}
                type="button"
                onClick={() => setStatus(item.value)}
                className={[
                  "h-10 rounded-xl px-4 text-xs font-black transition",
                  status === item.value
                    ? "bg-gradient-to-r from-[#007ab3] to-[#005f8c] text-white shadow-lg shadow-[#007ab3]/15"
                    : "text-slate-500 hover:bg-[#007ab3]/10 hover:text-[#007ab3]",
                ].join(" ")}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <StatCard
          icon="groups"
          title={t("uniquePagesTotalBrands")}
          value={String(brands.length)}
          note={t("uniquePagesActiveInactiveHint", {
            active: activeCount,
            inactive: inactiveCount,
          })}
        />

        <StatCard
          icon="check_circle"
          title={t("uniquePagesActiveRate")}
          value={`${activeRate}.0%`}
          note={t("uniquePagesPortfolioHealth")}
          tone="green"
        />

        <StatCard
          icon="history"
          title={t("uniquePagesSyncStatus")}
          value={t("uniquePagesUpToDate")}
          note={t("uniquePagesLastFetchOk")}
          tone="amber"
        />
      </div>

      <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm dark:bg-slate-900 dark:border-white/10">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[920px]">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-left dark:bg-slate-950/60 dark:border-white/10">
                <th className="px-6 py-4 text-xs font-black uppercase tracking-[0.16em] text-slate-400">
                  {t("uniquePagesBrandName")}
                </th>

                <th className="px-6 py-4 text-xs font-black uppercase tracking-[0.16em] text-slate-400">
                  {t("uniquePagesRoute")}
                </th>

                <th className="px-6 py-4 text-xs font-black uppercase tracking-[0.16em] text-slate-400">
                  {t("uniquePagesStatus")}
                </th>

                <th className="px-6 py-4 text-xs font-black uppercase tracking-[0.16em] text-slate-400">
                  {t("uniquePagesTemplates")}
                </th>

                <th className="px-6 py-4 text-xs font-black uppercase tracking-[0.16em] text-slate-400">
                  {t("uniquePagesLastUpdated")}
                </th>

                <th className="px-6 py-4 text-right text-xs font-black uppercase tracking-[0.16em] text-slate-400">
                  {t("uniquePagesActions")}
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 dark:divide-white/10">
              {filteredBrands.map((brand) => {
                const isActive =
                  String(brand.status || "").toLowerCase() === "active";

                return (
                  <tr
                    key={brand.id}
                    className="hover:bg-[#007ab3]/5 transition-colors"
                  >
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-4">
                        <div className="grid h-11 w-11 place-items-center rounded-2xl bg-[#007ab3]/10 text-[#007ab3] shrink-0">
                          <MIcon name="business" className="text-[21px]" />
                        </div>

                        <div className="min-w-0">
                          <button
                            type="button"
                            onClick={() =>
                              navigate(`/brand-unique-pages/${brand.id}`)
                            }
                            className="block text-left text-sm font-black text-gray-950 hover:text-[#007ab3] transition dark:text-white truncate"
                          >
                            {brand.name}
                          </button>

                          <p className="mt-1 text-xs font-semibold text-slate-400 truncate">
                            {brand.slug}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-5">
                      <span className="inline-flex rounded-xl bg-slate-100 dark:bg-slate-950 px-3 py-1.5 text-xs font-mono font-bold text-slate-600 dark:text-slate-300">
                        {brand.route || `/${brand.slug}`}
                      </span>
                    </td>

                    <td className="px-6 py-5">
                      <StatusPill active={isActive} t={t} />
                    </td>

                    <td className="px-6 py-5 text-sm font-black text-gray-950 dark:text-white">
                      {brand.templatesCount || 0}
                    </td>

                    <td className="px-6 py-5 text-sm font-semibold text-slate-500 dark:text-slate-400">
                      {brand.updated_at || brand.updatedAt
                        ? new Date(
                            brand.updated_at || brand.updatedAt
                          ).toLocaleString()
                        : "-"}
                    </td>

                    <td className="px-6 py-5">
                      <div className="flex justify-end gap-2 text-slate-400">
                        <button
                          type="button"
                          onClick={() =>
                            navigate(`/brand-unique-pages/${brand.id}`)
                          }
                          className="grid h-9 w-9 place-items-center rounded-xl hover:text-[#007ab3] hover:bg-[#007ab3]/10 transition"
                          title={t("uniquePagesManage")}
                        >
                          <MIcon name="settings" />
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            navigate(`/brand-unique-pages/${brand.id}`)
                          }
                          className="grid h-9 w-9 place-items-center rounded-xl hover:text-[#007ab3] hover:bg-[#007ab3]/10 transition"
                          title={t("uniquePagesOpen")}
                        >
                          <MIcon name="edit" />
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            navigate(`/brand-unique-pages/${brand.id}`)
                          }
                          className="grid h-9 w-9 place-items-center rounded-xl hover:text-[#007ab3] hover:bg-[#007ab3]/10 transition"
                          title={t("uniquePagesDuplicate")}
                        >
                          <MIcon name="content_copy" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {!filteredBrands.length ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-14 text-center text-sm text-slate-500"
                  >
                    {t("uniquePagesNoBrands")}
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-t border-slate-100 bg-slate-50 px-6 py-5 text-sm font-semibold text-slate-500 dark:bg-slate-950/60 dark:border-white/10 dark:text-slate-400">
          <span>
            {t("uniquePagesShowing", {
              from: showingFrom,
              to: showingTo,
              total: brands.length,
            })}
          </span>

          <div className="flex items-center gap-1">
            <button className="grid h-9 w-9 place-items-center rounded-xl text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800">
              <MIcon name="chevron_left" />
            </button>

            <button className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-r from-[#007ab3] to-[#005f8c] text-sm font-black text-white">
              1
            </button>

            <button className="grid h-9 w-9 place-items-center rounded-xl text-sm font-bold text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-800">
              2
            </button>

            <button className="grid h-9 w-9 place-items-center rounded-xl text-sm font-bold text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-800">
              3
            </button>

            <span className="px-2">...</span>

            <button className="grid h-9 w-9 place-items-center rounded-xl text-sm font-bold text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-800">
              6
            </button>

            <button className="grid h-9 w-9 place-items-center rounded-xl text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800">
              <MIcon name="chevron_right" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}