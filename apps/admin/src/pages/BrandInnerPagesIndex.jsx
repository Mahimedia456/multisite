import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import MIcon from "../components/MIcon";
import { apiFetch } from "../lib/auth";

function Pill({ children, tone = "gray" }) {
  const map = {
    green:
      "bg-green-50 text-green-700 border-green-100 dark:bg-green-950/30 dark:text-green-300 dark:border-green-900/40",
    amber:
      "bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-950/30 dark:text-amber-300 dark:border-amber-900/40",
    gray:
      "bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-white/10",
    blue:
      "bg-[#007ab3]/10 text-[#007ab3] border-[#007ab3]/15",
  };

  return (
    <span
      className={[
        "inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-black uppercase border",
        map[tone] || map.gray,
      ].join(" ")}
    >
      {children}
    </span>
  );
}

function StatusTag({ status, t }) {
  const s = String(status || "").toLowerCase();

  if (s === "published" || s === "live" || s === "active") {
    return (
      <Pill tone="green">
        <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
        {t("innerPagesPublished")}
      </Pill>
    );
  }

  if (s === "draft" || s === "inactive") {
    return (
      <Pill tone="amber">
        <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
        {t("innerPagesDraft")}
      </Pill>
    );
  }

  return (
    <Pill tone="gray">
      <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
      {status || t("innerPagesDraft")}
    </Pill>
  );
}

function formatModified(value) {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return String(value);
  return d.toLocaleString();
}

export default function BrandInnerPagesIndex() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [q, setQ] = useState("");
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  async function fetchPages(searchText) {
    setErr("");
    setLoading(true);

    try {
      const url = `/admin/shared-pages?q=${encodeURIComponent(
        (searchText || "").trim()
      )}`;

      const res = await apiFetch(url);
      const json = await res.json().catch(() => null);

      if (!res.ok || !json?.ok) {
        throw new Error(json?.message || `Failed (${res.status})`);
      }

      setRows(Array.isArray(json.data) ? json.data : []);
    } catch (e) {
      setRows([]);
      setErr(e?.message || t("innerPagesFailedFetch"));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchPages("");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => fetchPages(q), 250);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q]);

  const list = useMemo(() => rows, [rows]);

  const publishedCount = list.filter((page) =>
    ["published", "live", "active"].includes(
      String(page.status || "").toLowerCase()
    )
  ).length;

  const draftCount = list.length - publishedCount;

  return (
    <div className="space-y-8">
      <div className="rounded-[28px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 shadow-sm p-5 flex flex-col xl:flex-row xl:items-center xl:justify-between gap-5">
        <div>
          <div className="text-xs font-black uppercase tracking-[0.2em] text-[#007ab3]">
            {t("innerPagesAllBrands")} <span className="mx-2">›</span>{" "}
            {t("innerPagesSharedPages")}
          </div>

          <h1 className="mt-1 text-2xl font-black text-gray-950 dark:text-white">
            {t("innerPagesSharedPages")}
          </h1>

          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {t("innerPagesDescription")}
          </p>
        </div>

        <div className="relative w-full xl:w-80">
          <MIcon
            name="search"
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-[20px]"
          />

          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="w-full h-12 bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-2xl pl-12 pr-4 text-sm text-gray-950 dark:text-white placeholder:text-slate-400 outline-none focus:ring-4 focus:ring-[#007ab3]/20 focus:border-[#007ab3] transition"
            placeholder={t("innerPagesSearchPlaceholder")}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="group rounded-[28px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 shadow-sm hover:shadow-xl hover:shadow-[#007ab3]/10 transition-all p-6 overflow-hidden relative">
          <div className="absolute -right-10 -top-10 w-32 h-32 rounded-full bg-[#007ab3]/10" />
          <div className="relative flex items-start justify-between">
            <div>
              <div className="text-xs font-black text-slate-400 uppercase tracking-[0.18em]">
                {t("innerPagesAllPages")}
              </div>
              <div className="mt-3 text-3xl font-black text-gray-950 dark:text-white">
                {list.length}
              </div>
              <div className="mt-2 text-sm font-bold text-[#007ab3]">
                {t("innerPagesShowingPages", { count: list.length })}
              </div>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-b from-[#007ab3] to-[#005f8c] text-white flex items-center justify-center shadow-lg shadow-[#007ab3]/20">
              <MIcon name="description" className="text-[22px]" />
            </div>
          </div>
        </div>

        <div className="group rounded-[28px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 shadow-sm hover:shadow-xl hover:shadow-[#007ab3]/10 transition-all p-6 overflow-hidden relative">
          <div className="absolute -right-10 -top-10 w-32 h-32 rounded-full bg-green-500/10" />
          <div className="relative flex items-start justify-between">
            <div>
              <div className="text-xs font-black text-slate-400 uppercase tracking-[0.18em]">
                {t("innerPagesPublished")}
              </div>
              <div className="mt-3 text-3xl font-black text-gray-950 dark:text-white">
                {publishedCount}
              </div>
              <div className="mt-2 text-sm font-bold text-green-600 dark:text-green-300">
                Live / Active pages
              </div>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-green-50 dark:bg-green-950/30 text-green-600 dark:text-green-300 flex items-center justify-center">
              <MIcon name="check_circle" className="text-[22px]" />
            </div>
          </div>
        </div>

        <div className="group rounded-[28px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 shadow-sm hover:shadow-xl hover:shadow-[#007ab3]/10 transition-all p-6 overflow-hidden relative">
          <div className="absolute -right-10 -top-10 w-32 h-32 rounded-full bg-amber-500/10" />
          <div className="relative flex items-start justify-between">
            <div>
              <div className="text-xs font-black text-slate-400 uppercase tracking-[0.18em]">
                {t("innerPagesDraft")}
              </div>
              <div className="mt-3 text-3xl font-black text-gray-950 dark:text-white">
                {draftCount}
              </div>
              <div className="mt-2 text-sm font-bold text-amber-600 dark:text-amber-300">
                Draft / inactive pages
              </div>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-300 flex items-center justify-center">
              <MIcon name="edit_document" className="text-[22px]" />
            </div>
          </div>
        </div>
      </div>

      {err ? (
        <div className="rounded-2xl bg-red-50 dark:bg-red-950/30 border border-red-100 dark:border-red-900/40 text-red-700 dark:text-red-300 text-sm px-5 py-4 font-semibold">
          {err}
        </div>
      ) : null}

      <div className="rounded-[28px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-200 dark:border-white/10 flex items-center justify-between">
          <div>
            <div className="text-xs font-black tracking-[0.18em] uppercase text-[#007ab3]">
              {t("innerPagesAllPages")}
            </div>
            <div className="mt-1 text-sm text-slate-500 dark:text-slate-400 font-semibold">
              {t("innerPagesShowingPages", { count: list.length })}
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <div className="min-w-[860px]">
            <div className="grid grid-cols-[1fr,200px,230px,120px] px-6 py-4 text-[11px] font-black tracking-[0.16em] uppercase text-slate-400 bg-slate-50 dark:bg-slate-950/60 border-b border-slate-200 dark:border-white/10">
              <div>{t("innerPagesPageName")}</div>
              <div>{t("innerPagesStatus")}</div>
              <div>{t("innerPagesLastModified")}</div>
              <div className="text-right">{t("innerPagesActions")}</div>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-white/10">
              {loading ? (
                <div className="px-6 py-10 text-center text-sm text-slate-500">
                  {t("innerPagesLoading")}
                </div>
              ) : list.length === 0 ? (
                <div className="px-6 py-10 text-center text-sm text-slate-500">
                  {t("innerPagesNoPagesFound")}
                </div>
              ) : (
                list.map((page) => (
                  <div
                    key={page.id}
                    className="px-6 py-4 grid grid-cols-[1fr,200px,230px,120px] items-center hover:bg-[#007ab3]/5 transition cursor-pointer"
                    onClick={() => navigate(`/brand-inner-pages/${page.id}`)}
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      <div className="w-11 h-11 rounded-2xl bg-[#007ab3]/10 flex items-center justify-center text-[#007ab3] shrink-0">
                        <MIcon name="description" className="text-[21px]" />
                      </div>

                      <div className="min-w-0">
                        <div className="text-sm font-black text-gray-950 dark:text-white truncate">
                          {page.title || page.slug}
                        </div>

                        <div className="text-xs text-slate-400 mt-0.5 font-semibold truncate">
                          {t("innerPagesSlug")}: {page.slug}
                        </div>
                      </div>
                    </div>

                    <div>
                      <StatusTag status={page.status} t={t} />
                    </div>

                    <div className="text-sm text-slate-500 dark:text-slate-400 font-semibold">
                      {formatModified(page.modifiedAt || page.updatedAt)}
                    </div>

                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/brand-inner-pages/${page.id}`);
                        }}
                        className="w-9 h-9 text-slate-400 hover:text-[#007ab3] hover:bg-[#007ab3]/10 rounded-xl transition-all"
                        title={t("innerPagesManageSections")}
                      >
                        <MIcon name="settings" className="text-[18px]" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-slate-100 dark:border-white/10 bg-slate-50 dark:bg-slate-950/60 text-sm font-semibold text-slate-500 dark:text-slate-400 text-center">
          {t("innerPagesShowingPages", { count: list.length })}
        </div>
      </div>
    </div>
  );
}