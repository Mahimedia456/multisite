import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import MIcon from "../components/MIcon";
import { useNavigate } from "react-router-dom";
import { apiFetch, getSession, logout } from "../lib/auth";

function StatCard({
  title,
  value,
  note,
  noteColor = "text-green-600",
  icon = "bar_chart",
}) {
  return (
    <div className="rounded-3xl bg-white/80 border border-[#efeaf6] shadow-sm p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-sm font-semibold text-violet-700">{title}</div>
          <div className="mt-3 text-4xl font-extrabold text-gray-900">
            {value}
          </div>
          <div className={`mt-2 text-sm font-semibold ${noteColor}`}>
            {note}
          </div>
        </div>

        <div className="w-10 h-10 rounded-2xl bg-violet-600 text-white flex items-center justify-center shadow-sm">
          <MIcon name={icon} className="text-[20px]" />
        </div>
      </div>
    </div>
  );
}

function Card({ title, right, children }) {
  return (
    <div className="rounded-3xl bg-white/80 border border-[#efeaf6] shadow-sm p-6">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-xl font-extrabold text-gray-900">{title}</h2>
        {right}
      </div>
      <div className="mt-5">{children}</div>
    </div>
  );
}

function ActivityItem({ icon, title, sub, time }) {
  return (
    <div className="flex items-start gap-4 py-4 border-b border-[#f0edf7] last:border-b-0">
      <div className="w-10 h-10 rounded-full bg-violet-100 flex items-center justify-center">
        <MIcon name={icon} className="text-[20px] text-violet-700" />
      </div>

      <div className="flex-1">
        <div className="text-sm font-bold text-gray-900">{title}</div>
        <div className="text-sm text-gray-700">{sub}</div>
        <div className="text-xs text-violet-600 mt-1 font-semibold">
          {time}
        </div>
      </div>
    </div>
  );
}

function TenantCard({ path, name, active, latency, icon, activeLabel, latencyLabel }) {
  return (
    <div className="rounded-3xl bg-white/80 border border-[#efeaf6] shadow-sm p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-3xl bg-violet-100 flex items-center justify-center">
            <MIcon name={icon} className="text-[26px] text-violet-700" />
          </div>

          <div>
            <div className="text-lg font-extrabold text-gray-900">
              {path}{" "}
              <span className="text-gray-500 font-bold">({name})</span>
              <span className="ml-2 inline-block w-2.5 h-2.5 rounded-full bg-green-500 align-middle" />
            </div>

            <div className="mt-2 flex items-center gap-6 text-sm text-gray-600">
              <span className="inline-flex items-center gap-1.5">
                <MIcon name="group" className="text-[18px] text-gray-500" />
                {active} {activeLabel}
              </span>

              <span className="inline-flex items-center gap-1.5">
                <MIcon name="schedule" className="text-[18px] text-gray-500" />
                {latency} {latencyLabel}
              </span>
            </div>
          </div>
        </div>

        <div className="hidden md:flex items-end gap-1 h-10">
          {[8, 14, 10, 18, 12, 16, 9].map((h, i) => (
            <div
              key={i}
              className="w-2 rounded bg-violet-300"
              style={{ height: `${h * 2}px` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();
  const session = getSession();
  const { t } = useTranslation();

  const email = String(session?.user?.email || session?.email || "").toLowerCase();

  const visibleTenants = useMemo(() => {
    const all = [
      {
        key: "allianz3",
        name: "Allianz 3",
        path: "/kundler3",
        slug: "kundler3",
        icon: "shield",
      },
      {
        key: "allianz4",
        name: "Allianz 4",
        path: "/allianz4",
        slug: "allianz4",
        icon: "shield",
      },
    ];

    if (email.includes("allianz3")) {
      return all.filter((tenant) => tenant.key === "allianz3");
    }

    if (email.includes("allianz4")) {
      return all.filter((tenant) => tenant.key === "allianz4");
    }

    return all;
  }, [email]);

  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalBrands: 0,
    totalTemplates: 0,
    totalInnerPages: 0,
    uptime: "99.9%",
  });
  const [activity, setActivity] = useState([]);

  function onLogout() {
    logout();
    navigate("/login", { replace: true });
  }

  useEffect(() => {
    let alive = true;

    async function load() {
      try {
        setLoading(true);

        const sRes = await apiFetch("/admin/stats");
        const sJson = await sRes.json().catch(() => ({}));
        const sData = sJson?.data || sJson || {};

        let aJson = [];

        try {
          const aRes = await apiFetch("/admin/activity");
          aJson = await aRes.json().catch(() => []);
        } catch {
          aJson = [];
        }

        if (!alive) return;

        setStats({
          totalBrands: Number(sData?.brands ?? sData?.totalBrands ?? 0) || 0,
          totalTemplates:
            Number(sData?.templates ?? sData?.totalTemplates ?? 0) || 0,
          totalInnerPages:
            Number(sData?.sharedPages ?? sData?.totalInnerPages ?? 0) || 0,
          uptime: String(sData?.uptime ?? "99.9%"),
        });

        setActivity(
          Array.isArray(aJson?.data)
            ? aJson.data
            : Array.isArray(aJson)
              ? aJson
              : []
        );
      } catch {
        if (!alive) return;
      } finally {
        if (alive) setLoading(false);
      }
    }

    load();

    return () => {
      alive = false;
    };
  }, []);

  const effectiveStats = useMemo(() => {
    const isBrandUser = email.includes("allianz3") || email.includes("allianz4");

    if (!isBrandUser) return stats;

    return {
      ...stats,
      totalBrands: Math.min(stats.totalBrands || 1, 1),
    };
  }, [stats, email]);

  const perfTitle = useMemo(() => {
    if (visibleTenants.length === 1) {
      return `${visibleTenants[0].name} ${t("dashboardPerformance")}`;
    }

    return "Allianz 3 vs Allianz 4";
  }, [visibleTenants, t]);

  const fallbackActivity = [
    {
      icon: "edit",
      title: t("dashboardTemplateUpdated"),
      sub: t("dashboardGlobalHeader"),
      time: t("dashboardJustNow"),
    },
    {
      icon: "add",
      title: t("dashboardNewPageCreated"),
      sub: t("dashboardPrivacyPolicy"),
      time: t("dashboardTenMinsAgo"),
    },
    {
      icon: "check_circle",
      title: t("dashboardPublished"),
      sub: t("dashboardHomePage"),
      time: t("dashboardOneHourAgo"),
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600">
          {t("dashboardLoggedInAs")}{" "}
          <span className="font-bold text-gray-900">
            {session?.user?.email || session?.email || "Admin"}
          </span>

          {loading ? (
            <span className="ml-2 text-xs text-gray-400">
              ({t("dashboardLoading")})
            </span>
          ) : null}
        </div>

        <button
          onClick={onLogout}
          className="h-10 px-4 rounded-2xl bg-white/80 border border-[#efeaf6] shadow-sm text-sm font-bold text-red-600 hover:bg-red-50 transition inline-flex items-center gap-2"
        >
          <MIcon name="logout" className="text-[18px]" />
          {t("logout")}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <StatCard
          title={t("dashboardTotalBrands")}
          value={String(effectiveStats.totalBrands)}
          note={t("dashboardAcrossPortfolio")}
          noteColor="text-violet-700"
          icon="layers"
        />

        <StatCard
          title={t("dashboardTemplates")}
          value={String(effectiveStats.totalTemplates)}
          note={t("dashboardTemplatesNote")}
          icon="view_quilt"
        />

        <StatCard
          title={t("dashboardInnerPages")}
          value={String(effectiveStats.totalInnerPages)}
          note={t("dashboardInnerPagesNote")}
          noteColor="text-violet-700"
          icon="description"
        />

        <StatCard
          title={t("dashboardSystemHealth")}
          value={effectiveStats.uptime}
          note={t("dashboardUptimeNote")}
          noteColor="text-violet-700"
          icon="verified"
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <Card
            title={t("dashboardBrandPerformance")}
            right={
              <div className="flex items-center gap-4 text-sm font-semibold text-gray-600">
                <span className="inline-flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-violet-700" />
                  {visibleTenants[0]?.name || "Allianz 3"}
                </span>

                {visibleTenants.length > 1 ? (
                  <span className="inline-flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-violet-300" />
                    {visibleTenants[1]?.name || "Allianz 4"}
                  </span>
                ) : null}
              </div>
            }
          >
            <div className="text-sm text-violet-700 font-semibold">
              {perfTitle}
            </div>

            <div className="mt-6 h-[280px] rounded-3xl bg-gradient-to-b from-violet-50 to-transparent border border-[#f0edf7] flex items-center justify-center text-gray-400 text-center px-4">
              ({t("dashboardChartPlaceholder")})
            </div>

            <div className="mt-4 flex justify-between text-xs font-bold text-violet-700 px-2">
              <span>JAN</span>
              <span>MÄR</span>
              <span>MAI</span>
              <span>JUL</span>
              <span>SEP</span>
              <span>NOV</span>
            </div>
          </Card>
        </div>

        <div>
          <Card title={t("dashboardRecentActivity")}>
            <div className="divide-y divide-[#f0edf7]">
              {(activity.length ? activity : fallbackActivity)
                .slice(0, 6)
                .map((item, index) => (
                  <ActivityItem
                    key={index}
                    icon={item.icon}
                    title={item.title}
                    sub={item.sub}
                    time={item.time}
                  />
                ))}
            </div>

            <button className="mt-6 w-full h-11 rounded-2xl bg-violet-100 text-violet-700 font-bold hover:bg-violet-200 transition inline-flex items-center justify-center gap-2">
              <MIcon name="list" className="text-[18px]" />
              {t("dashboardViewAllActivity")}
            </button>
          </Card>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-extrabold text-gray-900">
          {t("dashboardTenantStatusHealth")}
        </h2>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {visibleTenants.map((tenant) => (
            <TenantCard
              key={tenant.key}
              path={tenant.path}
              name={tenant.name}
              active={tenant.key === "allianz3" ? "12.4k" : "8.9k"}
              latency={tenant.key === "allianz3" ? "42ms" : "38ms"}
              icon={tenant.icon}
              activeLabel={t("dashboardActive")}
              latencyLabel={t("dashboardLatency")}
            />
          ))}
        </div>
      </div>
    </div>
  );
}