import { Outlet, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useMemo, useState } from "react";
import MIcon from "../../components/MIcon";
import { HOW_TO_USE_MODULES } from "../../constants/howToUseModules";
import { getCurrentUser, getSession } from "../../lib/auth";

const PRIMARY = "#007ab3";

function normalize(value) {
  return String(value || "").toLowerCase().trim();
}

function getLoggedInUserBag() {
  const currentUser =
    typeof getCurrentUser === "function" ? getCurrentUser() : null;

  const session =
    typeof getSession === "function" ? getSession() : null;

  const raw = currentUser || session?.user || session || {};

  return {
    currentUser: currentUser || {},
    session: session || {},
    raw,
  };
}

function getUserRole(userBag) {
  const { currentUser, session, raw } = userBag;

  const roleCandidates = [
    raw?.role,
    raw?.user?.role,
    raw?.admin?.role,
    raw?.account_type,
    raw?.user_type,
    raw?.type,

    currentUser?.role,
    currentUser?.user?.role,
    currentUser?.admin?.role,
    currentUser?.account_type,
    currentUser?.user_type,
    currentUser?.type,

    session?.role,
    session?.user?.role,
    session?.admin?.role,
    session?.account_type,
    session?.user_type,
    session?.type,
  ];

  return normalize(roleCandidates.find(Boolean));
}

function getUserEmail(userBag) {
  const { currentUser, session, raw } = userBag;

  const emailCandidates = [
    raw?.email,
    raw?.user?.email,
    raw?.admin?.email,
    raw?.admin_email,

    currentUser?.email,
    currentUser?.user?.email,
    currentUser?.admin?.email,
    currentUser?.admin_email,

    session?.email,
    session?.user?.email,
    session?.admin?.email,
    session?.admin_email,
  ];

  return normalize(emailCandidates.find(Boolean));
}

function isAdminUser(userBag) {
  const role = getUserRole(userBag);
  const email = getUserEmail(userBag);

  if (
    [
      "admin",
      "super_admin",
      "full_admin",
      "support_admin",
      "administrator",
      "global_admin",
    ].includes(role)
  ) {
    return true;
  }

  if (role.includes("admin") && !role.includes("brand")) {
    return true;
  }

  if (
    email.endsWith("@mahimediasolutions.com") &&
    !email.includes("allianz3") &&
    !email.includes("allianz4")
  ) {
    return true;
  }

  return false;
}

export default function HowToUseLayout() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const userBag = getLoggedInUserBag();
  const user = userBag.raw;

  const [collapsed, setCollapsed] = useState(false);

  const role = getUserRole(userBag);
  const email = getUserEmail(userBag);
  const canManage = isAdminUser(userBag);

  const widthClass = collapsed ? "w-[88px]" : "w-[288px]";
  const modules = useMemo(() => HOW_TO_USE_MODULES, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950 dark:bg-slate-950 dark:text-white">
      <div className="flex min-h-screen">
        <aside
          className={`${widthClass} fixed left-0 top-0 z-40 hidden h-screen border-r border-slate-200 bg-white shadow-sm transition-all duration-300 dark:border-white/10 dark:bg-slate-900 lg:block`}
        >
          <div className="flex h-20 items-center justify-between border-b border-slate-200 px-4 dark:border-white/10">
            {!collapsed ? (
              <div>
                <div className="text-xs font-black uppercase tracking-[0.22em] text-[#007ab3]">
                  Allianz
                </div>
                <div className="text-lg font-black text-slate-950 dark:text-white">
                  {t("howToUse")}
                </div>
              </div>
            ) : (
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#007ab3]/10 text-[#007ab3]">
                <MIcon name="help" className="text-2xl" />
              </div>
            )}

            <button
              type="button"
              onClick={() => setCollapsed((v) => !v)}
              className="flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50 dark:border-white/10 dark:bg-slate-950 dark:text-slate-200"
              title={collapsed ? t("howToUseExpand") : t("howToUseCollapse")}
            >
              <MIcon
                name={
                  collapsed
                    ? "keyboard_double_arrow_right"
                    : "keyboard_double_arrow_left"
                }
                className="text-xl"
              />
            </button>
          </div>

          <div className="h-[calc(100vh-80px)] overflow-y-auto p-3">
            <button
              type="button"
              onClick={() => navigate("/how-to-use")}
              className="mb-3 flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left text-sm font-black text-[#007ab3] transition hover:bg-[#007ab3]/10"
            >
              <MIcon name="apps" className="text-2xl" />
              {!collapsed ? <span>{t("howToUseAllGuides")}</span> : null}
            </button>

            {canManage ? (
              <button
                type="button"
                onClick={() => navigate("/how-to-use/create")}
                className="mb-4 flex w-full items-center gap-3 rounded-2xl bg-[#007ab3] px-3 py-3 text-left text-sm font-black text-white shadow-lg shadow-[#007ab3]/20 transition hover:bg-[#005f8c]"
              >
                <MIcon name="add_circle" className="text-2xl" />
                {!collapsed ? <span>{t("howToUseCreate")}</span> : null}
              </button>
            ) : null}

            <div className="space-y-1">
              {modules.map((item) => (
                <button
                  key={item.moduleKey}
                  type="button"
                  onClick={() => navigate(`/how-to-use/${item.slug}`)}
                  className="flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left text-sm font-extrabold text-slate-700 transition hover:bg-slate-100 hover:text-[#007ab3] dark:text-slate-200 dark:hover:bg-white/10"
                >
                  <MIcon name={item.icon} className="text-2xl text-[#007ab3]" />
                  {!collapsed ? (
                    <span className="truncate">{t(item.titleKey)}</span>
                  ) : null}
                </button>
              ))}
            </div>
          </div>
        </aside>

        <main
          className={`min-h-screen flex-1 transition-all duration-300 ${
            collapsed ? "lg:pl-[88px]" : "lg:pl-[288px]"
          }`}
        >
          <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 px-4 py-4 backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/90 sm:px-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <div className="text-xs font-black uppercase tracking-[0.22em] text-[#007ab3]">
                  {t("howToUse")}
                </div>

                <h1 className="text-xl font-black text-slate-950 dark:text-white">
                  {t("howToUseTitle")}
                </h1>

                <p className="mt-1 text-sm font-semibold text-slate-500 dark:text-slate-300">
                  {email || "Admin"}

                  {role ? (
                    <span className="ml-2 rounded-full bg-[#007ab3]/10 px-2.5 py-1 text-xs font-black text-[#007ab3]">
                      {role}
                    </span>
                  ) : null}

                  {canManage ? (
                    <span className="ml-2 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-black text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300">
                      Manage enabled
                    </span>
                  ) : null}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => navigate("/dashboard")}
                  className="inline-flex h-11 items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-black text-slate-700 transition hover:bg-slate-50 dark:border-white/10 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-white/10"
                >
                  <MIcon name="arrow_back" className="text-xl" />
                  {t("howToUseBackToAdmin")}
                </button>

                <button
                  type="button"
                  onClick={() => navigate("/dashboard")}
                  className="inline-flex h-11 items-center gap-2 rounded-2xl bg-red-50 px-4 text-sm font-black text-red-600 transition hover:bg-red-100 dark:bg-red-950/30 dark:hover:bg-red-950/50"
                >
                  <MIcon name="close" className="text-xl" />
                  {t("howToUseExit")}
                </button>
              </div>
            </div>
          </header>

          <div className="p-4 sm:p-6 lg:p-8">
            <Outlet
              context={{
                canManage,
                role,
                email,
                primary: PRIMARY,
                user,
              }}
            />
          </div>
        </main>
      </div>
    </div>
  );
}