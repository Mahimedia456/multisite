import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import MIcon from "../components/MIcon";
import { apiFetch, getCurrentUser } from "../lib/auth";

function num(value) {
  return Number(value || 0);
}

function formatDate(value) {
  if (!value) return "-";

  try {
    return new Intl.DateTimeFormat("de-DE", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(value));
  } catch {
    return "-";
  }
}

function StatCard({
  title,
  value,
  subtitle,
  icon,
  path,
  tone = "blue",
  navigate,
}) {
  const tones = {
    blue: "bg-[#007ab3]/10 text-[#007ab3]",
    green:
      "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300",
    amber:
      "bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-300",
    red: "bg-red-50 text-red-700 dark:bg-red-950/30 dark:text-red-300",
    violet:
      "bg-violet-50 text-violet-700 dark:bg-violet-950/30 dark:text-violet-300",
    slate: "bg-slate-100 text-slate-700 dark:bg-white/10 dark:text-slate-200",
  };

  return (
    <button
      type="button"
      onClick={() => path && navigate(path)}
      className="group rounded-[28px] border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-1 hover:border-[#007ab3]/30 hover:shadow-xl hover:shadow-[#007ab3]/10 dark:border-white/10 dark:bg-slate-900"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500">
            {title}
          </p>

          <div className="mt-3 text-3xl font-black text-slate-950 dark:text-white">
            {value}
          </div>

          <p className="mt-2 text-sm font-semibold leading-5 text-slate-500 dark:text-slate-300">
            {subtitle}
          </p>
        </div>

        <div
          className={`flex h-13 w-13 shrink-0 items-center justify-center rounded-2xl ${
            tones[tone] || tones.blue
          } transition group-hover:scale-105`}
        >
          <MIcon name={icon} className="text-3xl" />
        </div>
      </div>
    </button>
  );
}

function ModuleCard({ item, navigate, t }) {
  return (
    <button
      type="button"
      onClick={() => navigate(item.path)}
      className="group rounded-[24px] border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-1 hover:border-[#007ab3]/30 hover:shadow-lg hover:shadow-[#007ab3]/10 dark:border-white/10 dark:bg-slate-900"
    >
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#007ab3]/10 text-[#007ab3] transition group-hover:bg-[#007ab3] group-hover:text-white">
          <MIcon name={item.icon || "apps"} className="text-2xl" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-sm font-black text-slate-950 dark:text-white">
              {item.label}
            </h3>

            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-black text-slate-700 dark:bg-white/10 dark:text-slate-200">
              {num(item.count)}
            </span>
          </div>

          <div className="mt-2 flex items-center gap-2 text-xs font-black text-[#007ab3]">
            <span>{t("dashboardOpenModule")}</span>
            <MIcon
              name="arrow_forward"
              className="text-lg transition group-hover:translate-x-1"
            />
          </div>
        </div>
      </div>
    </button>
  );
}

function ProgressBar({ label, value, total, tone = "bg-[#007ab3]" }) {
  const safeTotal = Math.max(num(total), 1);
  const percent = Math.min(100, Math.round((num(value) / safeTotal) * 100));

  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-4 text-sm">
        <span className="font-bold text-slate-600 dark:text-slate-300">
          {label}
        </span>
        <span className="font-black text-slate-950 dark:text-white">
          {num(value)} / {num(total)}
        </span>
      </div>

      <div className="h-3 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
        <div
          className={`h-full rounded-full ${tone}`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}

function getModuleLabel(key, fallback, t) {
  const map = {
    brands: "dashboardAgencies",
    brand_inner_pages: "brandInnerPages",
    brand_unique_pages: "brandUniquePages",
    support_chat: "supportChat",
    blogs: "blogs",
    blog_categories: "blogCategories",
    settings: "settings",
    module_settings: "dashboardModuleSettings",
    website_settings: "dashboardWebsiteVisibility",
    admin_settings: "dashboardAdminSettings",
  };

  return t(map[key] || fallback, fallback);
}

export default function Dashboard() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const user = getCurrentUser?.();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    let alive = true;

    async function loadDashboard() {
      try {
        setLoading(true);
        setError("");

        const res = await apiFetch("/admin/dashboard-summary");
        const json = await res.json().catch(() => ({}));

        if (!res.ok) {
          throw new Error(json?.message || t("dashboardFailedLoad"));
        }

        if (!alive) return;
        setSummary(json?.data || null);
      } catch (err) {
        if (!alive) return;
        setError(err?.message || t("dashboardFailedLoad"));
      } finally {
        if (alive) setLoading(false);
      }
    }

    loadDashboard();

    return () => {
      alive = false;
    };
  }, [t]);

  const data = summary || {};

  const kpis = useMemo(() => {
    return [
      {
        title: t("dashboardAgencies"),
        value: num(data?.agencies?.total),
        subtitle: t("dashboardAgenciesSubtitle", {
          active: num(data?.agencies?.active),
          inactive: num(data?.agencies?.inactive),
        }),
        icon: "layers",
        path: "/brands",
        tone: "blue",
      },
      {
        title: t("dashboardPages"),
        value: num(data?.pages?.total),
        subtitle: t("dashboardPagesSubtitle", {
          published: num(data?.pages?.published),
          draft: num(data?.pages?.draft),
        }),
        icon: "web",
        path: "/brand-inner-pages",
        tone: "violet",
      },
      {
        title: t("dashboardSupport"),
        value: num(data?.support?.threads),
        subtitle: t("dashboardSupportSubtitle", {
          open: num(data?.support?.open),
          messages: num(data?.support?.messages),
        }),
        icon: "forum",
        path: "/support-chat",
        tone: "green",
      },
      {
        title: t("dashboardBlogs"),
        value: num(data?.blogs?.total),
        subtitle: t("dashboardBlogsSubtitle", {
          published: num(data?.blogs?.published),
          draft: num(data?.blogs?.draft),
          hidden: num(data?.blogs?.hidden),
        }),
        icon: "article",
        path: "/blogs",
        tone: "amber",
      },
      {
        title: t("dashboardBlogCategories"),
        value: num(data?.blogCategories?.total),
        subtitle: t("dashboardBlogCategoriesSubtitle", {
          active: num(data?.blogCategories?.active),
          inactive: num(data?.blogCategories?.inactive),
        }),
        icon: "category",
        path: "/blog-categories",
        tone: "slate",
      },
      {
        title: t("dashboardWebsiteVisibility"),
        value: num(data?.websiteSettings?.total),
        subtitle: t("dashboardWebsiteVisibilitySubtitle", {
          visible: num(data?.websiteSettings?.visible),
          hidden: num(data?.websiteSettings?.hidden),
        }),
        icon: "language",
        path: "/website-settings",
        tone: "blue",
      },
      {
        title: t("dashboardModuleSettings"),
        value: num(data?.moduleSettings?.total),
        subtitle: t("dashboardModuleSettingsSubtitle", {
          enabled: num(data?.moduleSettings?.enabled),
          disabled: num(data?.moduleSettings?.disabled),
        }),
        icon: "tune",
        path: "/settings/modules",
        tone: "green",
      },
      {
        title: t("dashboardAdminSettings"),
        value: num(data?.adminSettings?.adminUsers),
        subtitle: t("dashboardAdminSettingsSubtitle", {
          enabled: num(data?.adminSettings?.permissionsEnabled),
        }),
        icon: "manage_accounts",
        path: "/admin-settings",
        tone: "red",
      },
    ];
  }, [data, t, i18n.language]);

  const modules = Array.isArray(data?.modules)
    ? data.modules.map((item) => ({
        ...item,
        label: getModuleLabel(item.key, item.label, t),
      }))
    : [];

  const brands = Array.isArray(data?.brands) ? data.brands : [];

  const recentActivity = Array.isArray(data?.recentActivity)
    ? data.recentActivity
    : [];

  return (
    <div className="space-y-8">
      <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-slate-900">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className="text-xs font-black uppercase tracking-[0.22em] text-[#007ab3]">
              {t("dashboardAdminDashboard")}
            </div>

            <h1 className="mt-2 text-3xl font-black text-slate-950 dark:text-white">
              {t("dashboardWelcomeBack")}
              {user?.name ? `, ${user.name}` : ""}
            </h1>

            <p className="mt-2 max-w-3xl text-sm font-semibold leading-6 text-slate-500 dark:text-slate-300">
              {t("dashboardSubtitle")}
            </p>

            {user?.email ? (
              <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#007ab3]/10 px-4 py-2 text-xs font-black text-[#007ab3]">
                <MIcon name="person" className="text-lg" />
                {user.email}
              </div>
            ) : null}
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => navigate("/how-to-use")}
              className="inline-flex h-12 items-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 text-sm font-black text-slate-700 transition hover:bg-slate-50 dark:border-white/10 dark:bg-slate-950 dark:text-slate-200"
            >
              <MIcon name="help" className="text-xl" />
              {t("dashboardHowToUse")}
            </button>

            <button
              type="button"
              onClick={() => navigate("/brands")}
              className="inline-flex h-12 items-center gap-2 rounded-2xl bg-[#007ab3] px-5 text-sm font-black text-white shadow-lg shadow-[#007ab3]/20 transition hover:bg-[#005f8c]"
            >
              <MIcon name="layers" className="text-xl" />
              {t("dashboardOpenAgencies")}
            </button>
          </div>
        </div>

        {loading ? (
          <div className="mt-6 rounded-2xl bg-slate-50 p-4 text-sm font-bold text-slate-500 dark:bg-slate-950 dark:text-slate-300">
            {t("dashboardLoading")}
          </div>
        ) : null}

        {error ? (
          <div className="mt-6 rounded-2xl bg-red-50 p-4 text-sm font-bold text-red-600 dark:bg-red-950/30 dark:text-red-300">
            {error}
          </div>
        ) : null}
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {kpis.map((item) => (
          <StatCard key={item.title} {...item} navigate={navigate} />
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <section className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-slate-900">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="text-xs font-black uppercase tracking-[0.22em] text-[#007ab3]">
                {t("dashboardModules")}
              </div>

              <h2 className="mt-2 text-2xl font-black text-slate-950 dark:text-white">
                {t("dashboardModuleOverview")}
              </h2>
            </div>

            <div className="rounded-full bg-[#007ab3]/10 px-4 py-2 text-xs font-black text-[#007ab3]">
              {t("dashboardModulesCount", { count: modules.length })}
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {modules.map((item) => (
              <ModuleCard key={item.key} item={item} navigate={navigate} t={t} />
            ))}
          </div>
        </section>

        <section className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-slate-900">
          <div className="text-xs font-black uppercase tracking-[0.22em] text-[#007ab3]">
            {t("dashboardHealth")}
          </div>

          <h2 className="mt-2 text-2xl font-black text-slate-950 dark:text-white">
            {t("dashboardSystemHealth")}
          </h2>

          <div className="mt-6 space-y-5">
            <ProgressBar
              label={t("dashboardActiveAgencies")}
              value={data?.agencies?.active}
              total={data?.agencies?.total}
              tone="bg-[#007ab3]"
            />

            <ProgressBar
              label={t("dashboardPublishedPages")}
              value={data?.pages?.published}
              total={data?.pages?.total}
              tone="bg-violet-500"
            />

            <ProgressBar
              label={t("dashboardPublishedBlogs")}
              value={data?.blogs?.published}
              total={data?.blogs?.total}
              tone="bg-amber-500"
            />

            <ProgressBar
              label={t("dashboardVisibleWebsitePages")}
              value={data?.websiteSettings?.visible}
              total={data?.websiteSettings?.total}
              tone="bg-emerald-500"
            />

            <ProgressBar
              label={t("dashboardEnabledModules")}
              value={data?.moduleSettings?.enabled}
              total={data?.moduleSettings?.total}
              tone="bg-slate-700"
            />
          </div>
        </section>
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <section className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-slate-900">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="text-xs font-black uppercase tracking-[0.22em] text-[#007ab3]">
                {t("dashboardAgencies")}
              </div>

              <h2 className="mt-2 text-2xl font-black text-slate-950 dark:text-white">
                {t("dashboardAllBrandsAgencies")}
              </h2>
            </div>

            <button
              type="button"
              onClick={() => navigate("/brands")}
              className="inline-flex h-10 items-center gap-2 rounded-2xl bg-[#007ab3]/10 px-4 text-xs font-black text-[#007ab3] transition hover:bg-[#007ab3]/15"
            >
              {t("dashboardViewAll")}
              <MIcon name="arrow_forward" className="text-lg" />
            </button>
          </div>

          <div className="mt-6 overflow-hidden rounded-3xl border border-slate-200 dark:border-white/10">
            <div className="max-h-[420px] overflow-y-auto">
              {brands.length ? (
                <table className="w-full text-left text-sm">
                  <thead className="sticky top-0 bg-slate-50 text-xs uppercase tracking-wide text-slate-500 dark:bg-slate-950 dark:text-slate-400">
                    <tr>
                      <th className="px-4 py-3 font-black">
                        {t("dashboardAgency")}
                      </th>
                      <th className="px-4 py-3 font-black">
                        {t("dashboardSlug")}
                      </th>
                      <th className="px-4 py-3 font-black">
                        {t("dashboardStatus")}
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-200 dark:divide-white/10">
                    {brands.map((brand) => (
                      <tr
                        key={brand.id}
                        onClick={() => navigate(`/brands/${brand.id}`)}
                        className="cursor-pointer bg-white transition hover:bg-[#007ab3]/5 dark:bg-slate-900 dark:hover:bg-white/5"
                      >
                        <td className="px-4 py-4">
                          <div className="font-black text-slate-950 dark:text-white">
                            {brand.name || "-"}
                          </div>
                          <div className="mt-1 text-xs font-semibold text-slate-500 dark:text-slate-400">
                            {brand.route || "-"}
                          </div>
                        </td>

                        <td className="px-4 py-4 font-bold text-slate-600 dark:text-slate-300">
                          {brand.slug || "-"}
                        </td>

                        <td className="px-4 py-4">
                          <span className="rounded-full bg-[#007ab3]/10 px-3 py-1 text-xs font-black text-[#007ab3]">
                            {brand.status || t("dashboardUnknown")}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="p-8 text-center text-sm font-bold text-slate-500 dark:text-slate-300">
                  {t("dashboardNoAgencies")}
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-slate-900">
          <div className="text-xs font-black uppercase tracking-[0.22em] text-[#007ab3]">
            {t("dashboardActivity")}
          </div>

          <h2 className="mt-2 text-2xl font-black text-slate-950 dark:text-white">
            {t("dashboardRecentActivity")}
          </h2>

          <div className="mt-6 space-y-3">
            {recentActivity.length ? (
              recentActivity.map((item, index) => (
                <button
                  key={`${item.type}-${item.title}-${index}`}
                  type="button"
                  onClick={() => item.path && navigate(item.path)}
                  className="flex w-full items-start gap-4 rounded-3xl border border-slate-200 bg-slate-50 p-4 text-left transition hover:border-[#007ab3]/30 hover:bg-[#007ab3]/5 dark:border-white/10 dark:bg-slate-950 dark:hover:bg-white/5"
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#007ab3]/10 text-[#007ab3]">
                    <MIcon
                      name={item.type === "blog" ? "article" : "layers"}
                      className="text-2xl"
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="font-black text-slate-950 dark:text-white">
                      {item.title}
                    </div>

                    <div className="mt-1 text-sm font-semibold text-slate-500 dark:text-slate-300">
                      {item.description}
                    </div>

                    <div className="mt-2 text-xs font-bold text-slate-400 dark:text-slate-500">
                      {formatDate(item.date)}
                    </div>
                  </div>
                </button>
              ))
            ) : (
              <div className="rounded-3xl border border-dashed border-slate-300 p-8 text-center text-sm font-bold text-slate-500 dark:border-white/10 dark:text-slate-300">
                {t("dashboardNoRecentActivity")}
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}