import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import MIcon from "./MIcon";
import { apiFetch } from "../lib/auth";

const SEARCH_ITEMS = [
  {
    title: "Overview",
    titleDe: "Übersicht",
    module: "overview",
    path: "/dashboard",
    icon: "dashboard",
    keywords: [
      "overview",
      "dashboard",
      "home",
      "start",
      "main",
      "übersicht",
      "admin dashboard",
      "allianz admin dashboard",
    ],
  },
  {
    title: "Agencies",
    titleDe: "Agenturen",
    module: "brands",
    path: "/brands",
    icon: "business",
    keywords: [
      "brands",
      "brand",
      "agencies",
      "agency",
      "agenturen",
      "agentur",
      "kundler",
      "allianz",
      "portfolio",
      "brands portfolio",
      "agency portfolio",
    ],
  },

  // ✅ HIDDEN FROM ADMIN TOPBAR SEARCH
  // Code kept, but disabled from search.
  /*
  {
    title: "Generate Agency",
    titleDe: "Agentur generieren",
    module: "generate_brand",
    path: "/admin/generate-brand",
    icon: "auto_awesome",
    keywords: [
      "generate",
      "generate brand",
      "generate agency",
      "new agency",
      "create agency",
      "ai generate",
      "ai site",
      "site generator",
      "agency generator",
    ],
  },
  {
    title: "AI Site Builder",
    titleDe: "KI Site Builder",
    module: "ai_site_builder",
    path: "/admin/ai-site-builder",
    icon: "smart_toy",
    keywords: [
      "ai site builder",
      "site builder",
      "builder",
      "ai builder",
      "generate website",
      "ki site builder",
    ],
  },
  {
    title: "Main Website",
    titleDe: "Hauptwebseite",
    module: "main_website",
    path: "/site",
    icon: "language",
    keywords: [
      "main website",
      "hauptwebseite",
      "site",
      "site pages",
      "main pages",
      "website",
      "website pages",
      "pages",
      "templates",
    ],
  },
  */

  {
    title: "Agency Inner Pages",
    titleDe: "Agentur Innenseiten",
    module: "brand_inner_pages",
    path: "/brand-inner-pages",
    icon: "article",
    keywords: [
      "brand inner pages",
      "agency inner pages",
      "inner pages",
      "shared pages",
      "shared page",
      "page detail",
      "inner page builder",
      "agenturseiten",
      "innenseiten",
    ],
  },
  {
    title: "Agency Unique Pages",
    titleDe: "Agentur Einzelseiten",
    module: "brand_unique_pages",
    path: "/brand-unique-pages",
    icon: "dashboard_customize",
    keywords: [
      "brand unique pages",
      "agency unique pages",
      "unique pages",
      "unique page",
      "custom pages",
      "page builder",
      "brand page builder",
      "einzelseiten",
    ],
  },
  {
    title: "Support Chat",
    titleDe: "Support Chat",
    module: "support_chat",
    path: "/support-chat",
    icon: "support_agent",
    keywords: [
      "support",
      "support chat",
      "chat",
      "messages",
      "message",
      "threads",
      "brand messages",
      "notifications",
      "hilfe",
      "kunden support",
    ],
  },
  {
    title: "Notifications",
    titleDe: "Benachrichtigungen",
    module: "notifications",
    path: "/notifications",
    icon: "notifications",
    keywords: [
      "notifications",
      "notification",
      "alerts",
      "unread",
      "support notifications",
      "benachrichtigungen",
      "meldungen",
    ],
  },
  {
    title: "Blogs",
    titleDe: "Blogs",
    module: "blogs",
    path: "/blogs",
    icon: "newspaper",
    keywords: [
      "blogs",
      "blog",
      "posts",
      "post",
      "articles",
      "article",
      "blog posts",
      "news",
      "content",
    ],
  },
  {
    title: "Create Blog",
    titleDe: "Blog erstellen",
    module: "blogs",
    path: "/blogs/create",
    icon: "add_circle",
    keywords: [
      "create blog",
      "new blog",
      "add blog",
      "blog form",
      "write blog",
      "blog erstellen",
    ],
  },
  {
    title: "Blog Categories",
    titleDe: "Blog Kategorien",
    module: "blog_categories",
    path: "/blog-categories",
    icon: "category",
    keywords: [
      "blog categories",
      "blog category",
      "categories",
      "category",
      "kategorien",
      "blog kategorien",
    ],
  },
  {
    title: "Settings",
    titleDe: "Einstellungen",
    module: "settings",
    path: "/settings",
    icon: "settings",
    keywords: [
      "settings",
      "setting",
      "einstellungen",
      "configuration",
      "config",
      "setup",
      "admin settings index",
      "module settings",
      "website settings",
      "blog settings",
    ],
  },
  {
    title: "Admin Settings",
    titleDe: "Admin Einstellungen",
    module: "admin_settings",
    path: "/admin-settings",
    icon: "manage_accounts",
    keywords: [
      "admin settings",
      "admin setting",
      "permissions",
      "permission",
      "admin permissions",
      "module permissions",
      "users permissions",
      "email permissions",
      "role",
      "roles",
    ],
  },
  {
    title: "Module Settings",
    titleDe: "Moduleinstellungen",
    module: "module_settings",
    path: "/settings/modules",
    icon: "tune",
    keywords: [
      "module settings",
      "module setting",
      "modules",
      "module",
      "brand modules",
      "agency modules",
      "enable module",
      "disable module",
      "show module",
      "hide module",
      "moduleinstellungen",
    ],
  },
  {
    title: "Website Settings",
    titleDe: "Webseiten Einstellungen",
    module: "website_settings",
    path: "/website-settings",
    icon: "web",
    keywords: [
      "website settings",
      "website setting",
      "website visibility",
      "page visibility",
      "hide pages",
      "show pages",
      "visible pages",
      "shared page visibility",
      "unique page visibility",
      "webseiten einstellungen",
    ],
  },
  {
    title: "Blog Settings",
    titleDe: "Blog Einstellungen",
    module: "blog_settings",
    path: "/blog-settings",
    icon: "admin_panel_settings",
    keywords: [
      "blog settings",
      "blog setting",
      "blog permissions",
      "blog module",
      "blog visibility",
      "blog einstellungen",
    ],
  },

  // ✅ KNOWLEDGE MODULES HIDDEN FROM ADMIN TOPBAR SEARCH
  // Code kept, but disabled from search.
  /*
  {
    title: "Knowledge Area",
    titleDe: "Wissensbereich",
    module: "knowledge",
    path: "/knowledge",
    icon: "school",
    keywords: [
      "knowledge",
      "knowledge area",
      "wissen",
      "wissensbereich",
      "knowledge module",
      "knowledge dashboard",
      "help center",
      "forms",
      "faqs",
      "articles",
      "categories",
      "submissions",
    ],
  },
  {
    title: "Knowledge Categories",
    titleDe: "Wissens-Kategorien",
    module: "knowledge_categories",
    path: "/knowledge/categories",
    icon: "category",
    keywords: [
      "knowledge categories",
      "knowledge category",
      "wissen kategorien",
      "faq categories",
      "article categories",
    ],
  },
  {
    title: "Knowledge Articles",
    titleDe: "Wissens-Artikel",
    module: "knowledge_articles",
    path: "/knowledge/articles",
    icon: "article",
    keywords: [
      "knowledge articles",
      "knowledge article",
      "articles",
      "wissen artikel",
      "help articles",
      "content articles",
    ],
  },
  {
    title: "Knowledge FAQs",
    titleDe: "Wissens-FAQs",
    module: "knowledge_faqs",
    path: "/knowledge/faqs",
    icon: "quiz",
    keywords: [
      "knowledge faqs",
      "faq",
      "faqs",
      "questions",
      "answers",
      "frequently asked questions",
      "wissen faqs",
    ],
  },
  {
    title: "Knowledge Forms",
    titleDe: "Wissens-Formulare",
    module: "knowledge_forms",
    path: "/knowledge/forms",
    icon: "dynamic_form",
    keywords: [
      "knowledge forms",
      "forms",
      "form",
      "contact forms",
      "complaint forms",
      "submission forms",
      "formulare",
      "wissen formulare",
    ],
  },
  {
    title: "Knowledge Submissions",
    titleDe: "Wissens-Einsendungen",
    module: "knowledge_submissions",
    path: "/knowledge/submissions",
    icon: "inbox",
    keywords: [
      "knowledge submissions",
      "submissions",
      "form submissions",
      "leads",
      "requests",
      "submitted forms",
      "einsendungen",
      "anfragen",
    ],
  },
  {
    title: "Knowledge Settings",
    titleDe: "Wissens-Einstellungen",
    module: "knowledge_settings",
    path: "/settings/knowledge",
    icon: "settings_applications",
    keywords: [
      "knowledge settings",
      "knowledge setting",
      "wissen settings",
      "wissen einstellungen",
      "knowledge config",
      "knowledge permissions",
    ],
  },
  */
];

function normalizeText(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function getSearchHaystack(item) {
  return normalizeText(
    [
      item.title,
      item.titleDe,
      item.module,
      item.path,
      ...(item.keywords || []),
    ].join(" ")
  );
}

export default function AdminTopbar() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const searchRef = useRef(null);

  const [count, setCount] = useState(0);
  const [lang, setLang] = useState(localStorage.getItem("site_lang") || "de");
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  const [query, setQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

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

  useEffect(() => {
    function onDocMouseDown(e) {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setSearchOpen(false);
      }
    }

    document.addEventListener("mousedown", onDocMouseDown);

    return () => {
      document.removeEventListener("mousedown", onDocMouseDown);
    };
  }, []);

  const searchResults = useMemo(() => {
    const q = normalizeText(query);

    if (!q) return SEARCH_ITEMS.slice(0, 8);

    const words = q.split(" ").filter(Boolean);

    return SEARCH_ITEMS.filter((item) => {
      const haystack = getSearchHaystack(item);
      return words.every((word) => haystack.includes(word));
    }).slice(0, 10);
  }, [query]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  function goToResult(item) {
    if (!item?.path) return;

    setQuery("");
    setSearchOpen(false);
    setActiveIndex(0);
    navigate(item.path);
  }

  function handleSearchKeyDown(e) {
    if (!searchOpen && ["ArrowDown", "Enter"].includes(e.key)) {
      setSearchOpen(true);
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) =>
        searchResults.length ? Math.min(prev + 1, searchResults.length - 1) : 0
      );
      return;
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) => Math.max(prev - 1, 0));
      return;
    }

    if (e.key === "Enter") {
      e.preventDefault();
      const selected = searchResults[activeIndex] || searchResults[0];
      if (selected) goToResult(selected);
      return;
    }

    if (e.key === "Escape") {
      e.preventDefault();
      setSearchOpen(false);
    }
  }

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

          <div ref={searchRef} className="relative hidden md:block">
            <div className="flex items-center gap-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-full px-4 h-11 w-[420px] max-w-full shadow-sm focus-within:ring-4 focus-within:ring-[#007ab3]/10 focus-within:border-[#007ab3]/40 transition">
              <MIcon name="search" className="text-slate-400 text-[20px]" />

              <input
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setSearchOpen(true);
                }}
                onFocus={() => setSearchOpen(true)}
                onKeyDown={handleSearchKeyDown}
                className="bg-transparent outline-none text-sm w-full text-gray-900 dark:text-white placeholder:text-slate-400"
                placeholder={
                  t("globalSearch") || "Search modules, settings, pages..."
                }
                autoComplete="off"
              />

              {query ? (
                <button
                  type="button"
                  onClick={() => {
                    setQuery("");
                    setSearchOpen(false);
                  }}
                  className="w-6 h-6 rounded-full hover:bg-slate-100 dark:hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-white transition"
                  title="Clear search"
                >
                  <MIcon name="close" className="text-[18px]" />
                </button>
              ) : null}
            </div>

            {searchOpen ? (
              <div className="absolute left-0 top-[52px] w-[460px] max-w-[calc(100vw-48px)] rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 shadow-2xl shadow-slate-900/10 overflow-hidden z-50">
                <div className="px-4 py-3 border-b border-slate-100 dark:border-white/10">
                  <div className="text-xs font-black uppercase tracking-wide text-slate-400">
                    {query ? "Search results" : "Quick navigation"}
                  </div>
                </div>

                <div className="max-h-[390px] overflow-y-auto p-2">
                  {searchResults.length ? (
                    searchResults.map((item, index) => {
                      const isActive = index === activeIndex;
                      const label =
                        lang === "de" ? item.titleDe || item.title : item.title;

                      return (
                        <button
                          key={`${item.path}-${item.title}`}
                          type="button"
                          onMouseEnter={() => setActiveIndex(index)}
                          onMouseDown={(e) => {
                            e.preventDefault();
                            goToResult(item);
                          }}
                          className={[
                            "w-full flex items-center gap-3 rounded-xl px-3 py-3 text-left transition",
                            isActive
                              ? "bg-[#007ab3]/10 text-[#007ab3]"
                              : "hover:bg-slate-50 dark:hover:bg-white/5 text-slate-700 dark:text-slate-200",
                          ].join(" ")}
                        >
                          <span
                            className={[
                              "w-9 h-9 rounded-xl flex items-center justify-center shrink-0",
                              isActive
                                ? "bg-[#007ab3] text-white"
                                : "bg-slate-100 dark:bg-white/10 text-slate-500 dark:text-slate-300",
                            ].join(" ")}
                          >
                            <MIcon name={item.icon} className="text-[20px]" />
                          </span>

                          <span className="min-w-0 flex-1">
                            <span className="block text-sm font-extrabold truncate">
                              {label}
                            </span>
                            <span className="block text-xs font-semibold text-slate-400 truncate">
                              {item.module} · {item.path}
                            </span>
                          </span>

                          <MIcon
                            name="keyboard_return"
                            className="text-[18px] text-slate-300"
                          />
                        </button>
                      );
                    })
                  ) : (
                    <div className="px-4 py-8 text-center">
                      <div className="w-12 h-12 mx-auto rounded-2xl bg-slate-100 dark:bg-white/10 flex items-center justify-center text-slate-400">
                        <MIcon name="search_off" className="text-[26px]" />
                      </div>
                      <div className="mt-3 text-sm font-extrabold text-slate-700 dark:text-slate-200">
                        No results found
                      </div>
                      <div className="mt-1 text-xs font-semibold text-slate-400">
                        Try settings, blogs, brands, pages, support, or modules.
                      </div>
                    </div>
                  )}
                </div>

                <div className="px-4 py-2 border-t border-slate-100 dark:border-white/10 text-[11px] font-bold text-slate-400 flex items-center justify-between">
                  <span>Searches active modules only</span>
                  <span>Enter open · Esc close</span>
                </div>
              </div>
            ) : null}
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
            <MIcon
              name="notifications"
              className="text-[20px] text-gray-700 dark:text-slate-300"
            />

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