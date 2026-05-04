import { NavLink, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import MIcon from "./MIcon";
import { logout, getCurrentUser } from "../lib/auth";
import logo from "../assets/logo.svg";

const NAV_ITEMS = [
  { to: "/dashboard", label: "Overview", translationKey: "overview", icon: "grid_view" },
  { to: "/brands", label: "Brands", translationKey: "brands", icon: "layers" },
  { to: "/brand-inner-pages", label: "Brand Inner Pages", translationKey: "brandInnerPages", icon: "description" },
  { to: "/brand-unique-pages", label: "Brand Unique Pages", translationKey: "brandUniquePages", icon: "web" },
  { to: "/support-chat", label: "Support Chat", translationKey: "supportChat", icon: "forum" },
   // ✅ NEW BLOG MODULE
  { to: "/blogs", label: "Blogs", translationKey: "blogs", icon: "article" },
  { to: "/blog-settings", label: "Blog Settings", translationKey: "blogSettings", icon: "admin_panel_settings" },

];

export default function AdminSidebar({ collapsed = false, setCollapsed }) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const user = getCurrentUser();

  const nav = user?.permissions
    ? NAV_ITEMS.filter((item) => user.permissions.includes(item.label))
    : NAV_ITEMS;

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
    {/* HEADER */}
    <div className="shrink-0 border-b border-slate-200 dark:border-white/10 px-4 py-5">
      
      {/* Top Row: Logo + Collapse */}
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
          className="w-9 h-9 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 text-slate-700 dark:text-white hover:bg-[#007ab3]/10 hover:text-[#007ab3] flex items-center justify-center transition"
        >
          <MIcon
            name={collapsed ? "chevron_right" : "chevron_left"}
            className="text-[22px]"
          />
        </button>
      </div>

      {/* Title */}
      {!collapsed && (
        <div className="mt-4 text-center">
          <div className="font-extrabold text-gray-900 dark:text-white tracking-wide text-sm">
            ALLIANZ PANEL
          </div>
          <div className="text-[11px] text-[#007ab3] font-semibold">
            Admin Dashboard
          </div>
        </div>
      )}
    </div>

    {/* NAV */}
    <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden px-3 py-4">
      <nav className="space-y-1">
        {nav.map((item) => (
          <NavLink
            key={item.label}
            to={item.to}
            title={collapsed ? t(item.translationKey) : undefined}
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
              <span className="truncate">{t(item.translationKey)}</span>
            ) : null}
          </NavLink>
        ))}
      </nav>
    </div>

      <div className="shrink-0 px-3 pb-5 pt-4 border-t border-slate-200 dark:border-white/10 bg-white dark:bg-slate-950">
        <button
          onClick={() => navigate("/support-chat")}
          title={collapsed ? t("needHelp") : undefined}
          className={[
            "w-full h-11 rounded-2xl bg-gradient-to-r from-[#007ab3] to-[#005f8c]",
            "text-white font-bold shadow-lg shadow-[#007ab3]/20 hover:brightness-105 transition",
            "inline-flex items-center justify-center",
            collapsed ? "px-0" : "gap-2",
          ].join(" ")}
        >
          <MIcon name="swap_horiz" className="text-[20px]" />
          {!collapsed ? <span>{t("needHelp")}</span> : null}
        </button>

        <div className="mt-4 space-y-2">
          <button
            title={collapsed ? t("help") : undefined}
            className={[
              "w-full flex items-center rounded-2xl text-sm font-semibold",
              "text-gray-700 dark:text-slate-300 hover:bg-[#007ab3]/10 hover:text-[#007ab3] transition",
              collapsed ? "justify-center px-0 py-3" : "gap-3 px-4 py-3",
            ].join(" ")}
          >
            <MIcon name="help" className="text-[20px]" />
            {!collapsed ? <span>{t("help")}</span> : null}
          </button>

          <button
            onClick={handleLogout}
            title={collapsed ? t("logout") : undefined}
            className={[
              "w-full flex items-center rounded-2xl text-sm font-semibold",
              "text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition",
              collapsed ? "justify-center px-0 py-3" : "gap-3 px-4 py-3",
            ].join(" ")}
          >
            <MIcon name="logout" className="text-[20px]" />
            {!collapsed ? <span>{t("logout")}</span> : null}
          </button>
        </div>
      </div>
    </aside>
  );
}