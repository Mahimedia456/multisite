import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { useTranslation } from "react-i18next";
import MIcon from "../components/MIcon";
import logo from "../assets/logo.svg";

export default function AuthLayout() {
  const { i18n } = useTranslation();

  const [lang, setLang] = useState(localStorage.getItem("site_lang") || "de");
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [lang, theme]);

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
    <div className="min-h-screen relative overflow-hidden bg-[#f5f1fb] dark:bg-slate-950">
      <div className="pointer-events-none absolute -top-44 -left-52 w-[520px] h-[520px] rounded-full bg-[#007ab3]/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-56 -right-44 w-[620px] h-[620px] rounded-full bg-[#007ab3]/25 blur-3xl" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/40 via-white/20 to-white/40 dark:from-slate-950/70 dark:via-slate-950/40 dark:to-slate-950/80" />

      <header className="absolute top-0 left-0 right-0 z-20">
        <div className="h-20 px-6 md:px-10 flex items-center justify-between">
          <img src={logo} alt="Logo" className="h-12 w-auto object-contain" />

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={toggleTheme}
              className="h-10 px-4 rounded-full bg-white/80 dark:bg-slate-900 border border-black/5 dark:border-white/10 shadow-sm text-sm font-bold text-gray-800 dark:text-white flex items-center justify-center hover:bg-[#007ab3]/10 hover:text-[#007ab3] transition"
            >
              <MIcon
                name={theme === "dark" ? "light_mode" : "dark_mode"}
                className="text-[20px]"
              />
            </button>

            <button
              type="button"
              onClick={toggleLanguage}
              className="h-10 px-4 rounded-full bg-white/80 dark:bg-slate-900 border border-black/5 dark:border-white/10 shadow-sm text-sm font-bold text-gray-800 dark:text-white hover:bg-[#007ab3]/10 hover:text-[#007ab3] transition"
            >
              {lang === "de" ? "🇬🇧 EN" : "🇩🇪 DE"}
            </button>
          </div>
        </div>
      </header>

      <main className="relative z-10 min-h-screen flex items-center justify-center px-6 pt-24 pb-12">
        <Outlet />
      </main>
    </div>
  );
}