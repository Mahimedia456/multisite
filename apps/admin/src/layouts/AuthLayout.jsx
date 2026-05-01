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
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-[#eef8fd] via-white to-[#e7f5fb] dark:from-slate-950 dark:via-slate-950 dark:to-[#001f33]">
      <div className="pointer-events-none absolute -top-48 -left-48 h-[520px] w-[520px] rounded-full bg-[#007ab3]/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-52 -right-44 h-[620px] w-[620px] rounded-full bg-[#007ab3]/14 blur-3xl" />

      <header className="absolute top-0 left-0 right-0 z-20">
        <div className="h-24 px-6 md:px-10 flex items-center justify-between">
          <img
            src={logo}
            alt="Logo"
            className="h-14 w-auto object-contain dark:brightness-0 dark:invert"
          />

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={toggleTheme}
              className="h-10 min-w-10 px-3 rounded-full bg-white/90 dark:bg-slate-900 border border-slate-200 dark:border-white/10 shadow-sm text-gray-800 dark:text-white flex items-center justify-center hover:bg-[#007ab3]/10 hover:text-[#007ab3] transition"
            >
              <MIcon
                name={theme === "dark" ? "light_mode" : "dark_mode"}
                className="text-[20px]"
              />
            </button>

            <button
              type="button"
              onClick={toggleLanguage}
              className="h-10 px-4 rounded-full bg-white/90 dark:bg-slate-900 border border-slate-200 dark:border-white/10 shadow-sm text-sm font-bold text-gray-800 dark:text-white hover:bg-[#007ab3]/10 hover:text-[#007ab3] transition"
            >
              {lang === "de" ? "EN" : "DE"}
            </button>
          </div>
        </div>
      </header>

      <main className="relative z-10 min-h-screen flex items-center justify-center px-6 pt-28 pb-12">
        <Outlet />
      </main>
    </div>
  );
}