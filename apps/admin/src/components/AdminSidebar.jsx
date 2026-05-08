import { NavLink, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import MIcon from "./MIcon";
import { logout, getCurrentUser } from "../lib/auth";
import logo from "../assets/logo.svg";

const MAIN_NAV_ITEMS = [
  {
    to: "/dashboard",
    label: "Overview",
    translationKey: "overview",
    icon: "grid_view",
  },
  {
    to: "/brands",
    label: "Brands",
    translationKey: "brands",
    icon: "layers",
  },
  {
    to: "/brand-inner-pages",
    label: "Brand Inner Pages",
    translationKey: "brandInnerPages",
    icon: "description",
  },
  {
    to: "/brand-unique-pages",
    label: "Brand Unique Pages",
    translationKey: "brandUniquePages",
    icon: "web",
  },
  {
    to: "/support-chat",
    label: "Support Chat",
    translationKey: "supportChat",
    icon: "forum",
  },
  {
    to: "/blogs",
    label: "Blogs",
    translationKey: "blogs",
    icon: "article",
  },
  {
    to: "/blog-categories",
    label: "Blog Categories",
    translationKey: "blogCategories",
    icon: "category",
  },

  // Knowledge Area agar sidebar mein chahiye to uncomment karo
  // {
  //   to: "/knowledge",
  //   label: "Knowledge Area",
  //   translationKey: "knowledgeArea",
  //   icon: "school",
  // },

  {
    to: "/settings",
    label: "Settings",
    translationKey: "settings",
    icon: "settings",
  },

  // ✅ New module: visible for full admin and brand admin
  {
    to: "/how-to-use",
    label: "How to Use",
    translationKey: "howToUse",
    icon: "help",
  },
];

function hasPermission(user, label) {
  if (!user?.permissions) return true;
  return user.permissions.includes(label);
}

function SidebarLink({ item, collapsed, t }) {
  return (
    <NavLink
      to={item.to}
      title={collapsed ? t(item.translationKey, item.label) : undefined}
      className={({ isActive }) =>
        [
          "flex items-center rounded-2xl text-sm font-semibold transition",
          collapsed ? "justify-center px-0 py-3" : "gap-3 px-4 py-3",
          isActive
            ? "bg-gradient-to-r from-[#007ab3] to-[#005f8c] text-white shadow-lg shadow-[#007ab3]/15"
            : "text-gray-700 dark:text-slate-300 hover:bg-[#007ab3]/10 hover:text-[#007ab3]",
        ].join(" ")
      }
    >
      <MIcon name={item.icon} className="text-[20px] shrink-0" />

      {!collapsed ? (
        <span className="truncate">{t(item.translationKey, item.label)}</span>
      ) : null}
    </NavLink>
  );
}

export default function AdminSidebar({ collapsed = false, setCollapsed }) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const user = getCurrentUser();

  const mainNav = MAIN_NAV_ITEMS.filter((item) => {
    // ✅ How to Use must be visible to every logged-in admin/brand admin
    if (item.to === "/how-to-use") return true;

    return hasPermission(user, item.label);
  });

  function handleLogout() {
    logout();
    navigate("/login", { replace: true });
  }

  return (
    <aside
      className={[
        "fixed left-0 top-0 z-50 h-screen bg-white dark:bg-slate-950",
        "border-r border-slate-200 dark:border-white/10",
        "flex flex-col overflow-hidden transition-all duration-300",
        collapsed ? "w-[88px]" : "w-[270px]",
      ].join(" ")}
    >
      <div className="shrink-0 border-b border-slate-200 px-4 py-5 dark:border-white/10">
        <div className="flex items-center justify-between">
          <img
            src={logo}
            alt="Allianz"
            className={[
              "object-contain transition-all dark:brightness-0 dark:invert",
              collapsed ? "h-9 w-9" : "h-12 w-auto max-w-[160px]",
            ].join(" ")}
          />

          <button
            type="button"
            onClick={() => setCollapsed?.((v) => !v)}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 transition hover:bg-[#007ab3]/10 hover:text-[#007ab3] dark:border-white/10 dark:bg-slate-900 dark:text-white"
          >
            <MIcon
              name={collapsed ? "chevron_right" : "chevron_left"}
              className="text-[22px]"
            />
          </button>
        </div>

        {!collapsed && (
          <div className="mt-4 text-center">
            <div className="text-sm font-extrabold tracking-wide text-gray-900 dark:text-white">
              ALLIANZ PANEL
            </div>

            <div className="text-[11px] font-semibold text-[#007ab3]">
              Admin Dashboard
            </div>
          </div>
        )}
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden px-3 py-4">
        <nav className="space-y-1">
          {mainNav.map((item) => (
            <SidebarLink
              key={item.to}
              item={item}
              collapsed={collapsed}
              t={t}
            />
          ))}
        </nav>
      </div>

      <div className="shrink-0 border-t border-slate-200 bg-white px-3 pb-5 pt-4 dark:border-white/10 dark:bg-slate-950">
        {hasPermission(user, "Support Chat") && (
          <button
            onClick={() => navigate("/support-chat")}
            title={collapsed ? t("needHelp", "Support Chat") : undefined}
            className={[
              "inline-flex h-11 w-full items-center justify-center rounded-2xl",
              "bg-gradient-to-r from-[#007ab3] to-[#005f8c]",
              "font-bold text-white shadow-lg shadow-[#007ab3]/20 transition hover:brightness-105",
              collapsed ? "px-0" : "gap-2",
            ].join(" ")}
          >
            <MIcon name="forum" className="text-[20px]" />
            {!collapsed ? <span>Support Chat</span> : null}
          </button>
        )}

        <button
          onClick={handleLogout}
          title={collapsed ? t("logout", "Logout") : undefined}
          className={[
            "mt-3 flex w-full items-center rounded-2xl text-sm font-semibold",
            "text-red-600 transition hover:bg-red-50 dark:hover:bg-red-950/30",
            collapsed ? "justify-center px-0 py-3" : "gap-3 px-4 py-3",
          ].join(" ")}
        >
          <MIcon name="logout" className="text-[20px]" />
          {!collapsed ? <span>{t("logout", "Logout")}</span> : null}
        </button>
      </div>
    </aside>
  );
}