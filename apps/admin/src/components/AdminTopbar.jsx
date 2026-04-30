import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MIcon from "./MIcon";
import { apiFetch } from "../lib/auth";

export default function AdminTopbar() {
  const navigate = useNavigate();
  const [count, setCount] = useState(0);
  const [lang, setLang] = useState(
    localStorage.getItem("site_lang") || "de"
  );

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
    loadCount();

    const timer = setInterval(loadCount, 10000);
    return () => clearInterval(timer);
  }, []);

  function toggleLanguage() {
  const select = document.querySelector(".goog-te-combo");
  if (!select) return;

  const next = lang === "de" ? "en" : "de";

  select.value = next;
  select.dispatchEvent(new Event("change"));

  localStorage.setItem("site_lang", next);
  setLang(next);
}

  return (
    <header className="sticky top-0 z-40 bg-[#f6f2fb]/80 backdrop-blur border-b border-[#efeaf6]">
      <div className="px-7 h-[76px] flex items-center justify-between gap-6">
        <div className="flex items-center gap-6 min-w-0">
          <h1 className="text-2xl font-extrabold text-gray-900 shrink-0">
            Overview
          </h1>

          <div className="hidden md:flex items-center gap-3 bg-white/80 border border-[#efeaf6] rounded-full px-4 h-11 w-[360px] max-w-full shadow-sm">
            <MIcon name="search" className="text-gray-400 text-[20px]" />
            <input
              className="bg-transparent outline-none text-sm w-full placeholder:text-gray-400"
              placeholder="Global Search"
            />
          </div>
        </div>

        <div className="flex items-center gap-4 shrink-0">
          <div className="hidden lg:block text-sm font-semibold text-violet-700">
            {new Date().toLocaleDateString(undefined, {
              weekday: "long",
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </div>

          {/* ✅ LANGUAGE SWITCH BUTTON */}
         <button
  onClick={() => {
    const currentUrl = window.location.href;
    const url =
      "https://translate.google.com/translate?sl=en&tl=de&u=" +
      encodeURIComponent(currentUrl);

    window.open(url, "_blank");
  }}
  className="px-3 h-10 rounded-full bg-white/80 border border-[#efeaf6] shadow-sm text-sm font-semibold flex items-center gap-2"
>
  🇩🇪 DE
</button>

          {/* 🔔 NOTIFICATIONS */}
          <button
            type="button"
            onClick={() => navigate("/notifications")}
            className="relative w-10 h-10 rounded-full bg-white/80 border border-[#efeaf6] shadow-sm flex items-center justify-center"
          >
            <MIcon name="notifications" className="text-[20px] text-gray-700" />

            {count > 0 ? (
              <span className="absolute -right-1 -top-1 grid min-h-5 min-w-5 place-items-center rounded-full bg-red-500 px-1 text-[10px] font-black text-white">
                {count > 99 ? "99+" : count}
              </span>
            ) : null}
          </button>

          {/* 👤 USER */}
          <div className="w-10 h-10 rounded-full bg-white/80 border border-[#efeaf6] shadow-sm flex items-center justify-center">
            <MIcon name="person" className="text-[22px] text-gray-700" />
          </div>
        </div>
      </div>
    </header>
  );
}