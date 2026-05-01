import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import MIcon from "./MIcon";
import { apiFetch } from "../lib/auth";

export default function AdminTopbar() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const [count, setCount] = useState(0);
  const [lang, setLang] = useState(localStorage.getItem("site_lang") || "de");
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  async function loadCount() {
    try {
      const res = await apiFetch("/admin/support-chat/notifications/count");
      const json = await res.json().catch(() => null);

      if (res.ok && json?.ok) {
        setCount(json.data?.count || 0);
      }
    } catch {}
  }

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.classList.toggle("dark", theme === "dark");

    loadCount();
    const timer = setInterval(loadCount, 10000);

    return () => clearInterval(timer);
  }, []);

  function toggleLanguage() {
    const next = lang === "de" ? "en" : "de";

    localStorage.setItem("site_lang", next);
    document.documentElement.lang = next;

    i18n.changeLanguage(next);
    setLang(next);
  }

  function toggleTheme() {
    const next = theme === "dark" ? "light" : "dark";

    localStorage.setItem("theme", next);
    document.documentElement.classList.toggle("dark", next === "dark");

    setTheme(next);
  }

  return (
    <header className="sticky top-0 z-40 bg-[#f7f4fb]/90 dark:bg-slate-950/95 backdrop-blur-xl border-b border-slate-200 dark:border-white/10">
      <div className="px-6 md:px-8 h-[76px] flex items-center justify-between gap-6">
        <div className="flex items-center gap-6 min-w-0">
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white shrink-0 leading-tight">
              {t("overview")}
            </h1>
            <p className="hidden sm:block text-xs font-semibold text-[#007ab3]">
              Allianz Admin Dashboard
            </p>
          </div>

          <div className="hidden md:flex items-center gap-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-full px-4 h-11 w-[360px] max-w-full shadow-sm">
            <MIcon name="search" className="text-slate-400 text-[20px]" />
            <input
              className="bg-transparent outline-none text-sm w-full text-gray-900 dark:text-white placeholder:text-slate-400"
              placeholder={t("globalSearch")}
            />
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="hidden lg:block text-sm font-bold text-[#007ab3]">
            {new Date().toLocaleDateString(lang === "de" ? "de-DE" : "en-US", {
              weekday: "long",
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </div>

          <button
            type="button"
            onClick={toggleTheme}
            className="h-10 min-w-10 px-3 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 shadow-sm text-sm font-bold text-gray-800 dark:text-white flex items-center justify-center hover:bg-[#007ab3]/10 hover:text-[#007ab3] transition"
            title={theme === "dark" ? "Light mode" : "Dark mode"}
          >
            <MIcon
  name={theme === "dark" ? "light_mode" : "dark_mode"}
  className="text-[20px]"
/>
          </button>

          <button
            type="button"
            onClick={toggleLanguage}
            className="h-10 px-4 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 shadow-sm text-sm font-bold text-gray-800 dark:text-white flex items-center gap-2 hover:bg-[#007ab3]/10 hover:text-[#007ab3] transition"
          >
            {lang === "de" ? "🇬🇧 EN" : "🇩🇪 DE"}
          </button>

          <button
            type="button"
            onClick={() => navigate("/notifications")}
            className="relative w-10 h-10 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 shadow-sm flex items-center justify-center hover:bg-[#007ab3]/10 transition"
            title={t("notifications")}
          >
            <MIcon name="notifications" className="text-[20px] text-gray-700 dark:text-slate-300" />

            {count > 0 ? (
              <span className="absolute -right-1 -top-1 grid min-h-5 min-w-5 place-items-center rounded-full bg-red-500 px-1 text-[10px] font-black text-white">
                {count > 99 ? "99+" : count}
              </span>
            ) : null}
          </button>

          <div className="w-10 h-10 rounded-full bg-gradient-to-b from-[#007ab3] to-[#005f8c] shadow-lg shadow-[#007ab3]/20 flex items-center justify-center text-white">
            <MIcon name="person" className="text-[22px]" />
          </div>
        </div>
      </div>
    </header>
  );
}