import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import MIcon from "../components/MIcon";
import { apiFetch } from "../lib/auth";

function Pill({ children, tone = "gray" }) {
  const map = {
    green: "bg-green-50 text-green-700",
    amber: "bg-amber-50 text-amber-700",
    gray: "bg-zinc-100 text-zinc-600",
    purple: "bg-primary/10 text-primary",
  };

  return (
    <span
      className={[
        "px-2.5 py-1 rounded-full text-[11px] font-bold uppercase",
        map[tone],
      ].join(" ")}
    >
      {children}
    </span>
  );
}

function StatusTag({ status, t }) {
  const s = String(status || "").toLowerCase();

  if (s === "published" || s === "live" || s === "active") {
    return <Pill tone="green">{t("innerPagesPublished")}</Pill>;
  }

  if (s === "draft" || s === "inactive") {
    return <Pill tone="amber">{t("innerPagesDraft")}</Pill>;
  }

  return <Pill tone="gray">{status || t("innerPagesDraft")}</Pill>;
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

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-xs text-zinc-400">
            {t("innerPagesAllBrands")} <span className="mx-2">›</span>{" "}
            {t("innerPagesSharedPages")}
          </div>

          <h1 className="text-3xl font-extrabold text-zinc-900 mt-1">
            {t("innerPagesSharedPages")}
          </h1>

          <p className="text-sm text-zinc-500 mt-1">
            {t("innerPagesDescription")}
          </p>

          {err ? (
            <div className="mt-3 text-sm text-red-600 font-semibold">
              {err}
            </div>
          ) : null}
        </div>
      </div>

      <div className="rounded-3xl bg-white/80 border border-zinc-200 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-zinc-200 flex items-center justify-between">
          <div className="text-xs font-extrabold tracking-widest text-zinc-400">
            {t("innerPagesAllPages")}
          </div>

          <div className="relative w-72">
            <MIcon
              name="search"
              className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 text-[18px]"
            />

            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="w-full bg-zinc-100 border-none rounded-full pl-9 pr-4 py-2 text-sm focus:ring-2 focus:ring-primary/20 outline-none"
              placeholder={t("innerPagesSearchPlaceholder")}
            />
          </div>
        </div>

        <div className="grid grid-cols-[1fr,220px,220px,120px] px-6 py-3 text-[11px] font-extrabold tracking-widest text-zinc-400 border-b border-zinc-100">
          <div>{t("innerPagesPageName")}</div>
          <div>{t("innerPagesStatus")}</div>
          <div>{t("innerPagesLastModified")}</div>
          <div className="text-right">{t("innerPagesActions")}</div>
        </div>

        <div className="divide-y divide-zinc-100">
          {loading ? (
            <div className="px-6 py-10 text-center text-sm text-zinc-500">
              {t("innerPagesLoading")}
            </div>
          ) : list.length === 0 ? (
            <div className="px-6 py-10 text-center text-sm text-zinc-500">
              {t("innerPagesNoPagesFound")}
            </div>
          ) : (
            list.map((page) => (
              <div
                key={page.id}
                className="px-6 py-4 grid grid-cols-[1fr,220px,220px,120px] items-center hover:bg-primary/5 transition cursor-pointer"
                onClick={() => navigate(`/brand-inner-pages/${page.id}`)}
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-zinc-100 flex items-center justify-center text-zinc-600">
                    <MIcon name="description" className="text-[18px]" />
                  </div>

                  <div>
                    <div className="text-sm font-bold text-zinc-900">
                      {page.title || page.slug}
                    </div>

                    <div className="text-xs text-zinc-400 mt-0.5">
                      {t("innerPagesSlug")}: {page.slug}
                    </div>
                  </div>
                </div>

                <div>
                  <StatusTag status={page.status} t={t} />
                </div>

                <div className="text-sm text-zinc-500">
                  {formatModified(page.modifiedAt || page.updatedAt)}
                </div>

                <div className="flex items-center justify-end gap-3 text-zinc-400">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/brand-inner-pages/${page.id}`);
                    }}
                    className="hover:text-zinc-700"
                    title={t("innerPagesManageSections")}
                  >
                    <MIcon name="settings" className="text-[18px]" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="px-6 py-3 text-xs text-zinc-400 text-center">
          {t("innerPagesShowingPages", { count: list.length })}
        </div>
      </div>
    </div>
  );
}