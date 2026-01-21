import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import MIcon from "../components/MIcon";
import { apiFetch } from "../lib/auth";

function StatusBadge({ status }) {
  const s = String(status || "").toLowerCase();
  const map = {
    live: "bg-green-50 text-green-600 border-green-100",
    published: "bg-green-50 text-green-600 border-green-100",
    active: "bg-green-50 text-green-600 border-green-100",

    draft: "bg-amber-50 text-amber-600 border-amber-100",
    inactive: "bg-amber-50 text-amber-600 border-amber-100",

    archived: "bg-zinc-50 text-zinc-500 border-zinc-100",
  };

  const label =
    s === "live" || s === "published" || s === "active"
      ? "LIVE"
      : s === "draft" || s === "inactive"
      ? "DRAFT"
      : "ARCHIVED";

  return (
    <span
      className={[
        "px-2 py-1 text-[10px] font-bold uppercase rounded border",
        map[s] || map.archived,
      ].join(" ")}
    >
      {label}
    </span>
  );
}

function TemplateCard({ t, onEdit, onView }) {
  return (
    <div className="bg-white/70 backdrop-blur-xl border border-white/60 rounded-xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all">
      <div className="flex items-start justify-between mb-6">
        <div className="w-12 h-12 bg-zinc-100 rounded-lg flex items-center justify-center">
          <MIcon name={t.icon} className="text-zinc-500 text-[24px]" />
        </div>
        <StatusBadge status={t.status} />
      </div>

      <h3 className="text-lg font-bold text-zinc-900 mb-1">{t.title}</h3>
      <p className="text-xs text-zinc-400 mb-6">
        Last Edited: {t.edited || "—"}
      </p>

      <div className="flex gap-3">
        <button
          onClick={onEdit}
          className="flex-1 h-10 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-primary/90 transition-colors"
        >
          Edit Template
        </button>

        <button
          onClick={onView}
          className="px-3 h-10 border border-zinc-200 text-zinc-600 rounded-lg hover:bg-zinc-50 transition-colors"
          title="View templates"
        >
          <MIcon name="visibility" className="text-[18px] align-middle" />
        </button>
      </div>
    </div>
  );
}

function timeAgoOrDate(v) {
  if (!v) return "—";
  const d = new Date(v);
  if (Number.isNaN(d.getTime())) return String(v);
  return d.toLocaleString();
}

export default function BrandDetail() {
  const navigate = useNavigate();
  const { brandId } = useParams();

  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [brand, setBrand] = useState(null);
  const [templates, setTemplates] = useState([]);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setErr("");
      try {
        const res = await apiFetch(`/admin/brands/${brandId}/detail`);
        const json = await res.json().catch(() => null);

        if (!res.ok || !json?.ok) {
          throw new Error(json?.message || "Failed to load brand");
        }

        if (!cancelled) {
          setBrand(json.data.brand);
          setTemplates(Array.isArray(json.data.templates) ? json.data.templates : []);
        }
      } catch (e) {
        if (!cancelled) setErr(e?.message || "Failed to load brand");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    if (brandId) load();
    return () => {
      cancelled = true;
    };
  }, [brandId]);

  const style = useMemo(() => {
    const accent = brand?.colors?.accent || brand?.colors?.primary || "#2ec2b3";
    return { ["--brand-accent"]: accent };
  }, [brand]);

  const topTemplates = useMemo(() => {
    // backend returns key header/footer/home
    const mapIcon = { header: "dock_to_bottom", footer: "dock_to_bottom", home: "home" };
    return (templates || [])
      .filter((t) => ["header", "footer", "home"].includes(t.key))
      .map((t) => ({
        id: t.id,
        key: t.key,
        title:
          t.key === "header"
            ? "Global Header"
            : t.key === "footer"
            ? "Global Footer"
            : "Home Page",
        status: t.status || "draft",
        icon: mapIcon[t.key] || "description",
        edited: timeAgoOrDate(t.updatedAt),
      }));
  }, [templates]);

  if (loading) {
    return <div className="max-w-7xl mx-auto py-10 text-zinc-500">Loading…</div>;
  }

  if (err) {
    return (
      <div className="max-w-7xl mx-auto py-10">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {err}
        </div>
      </div>
    );
  }

  const colors = brand?.colors || {};
  const fonts = brand?.fonts || {};
  const logo = brand?.logo || {};

  return (
    <div style={style} className="max-w-7xl mx-auto space-y-12">
      {/* Website Templates */}
      <section>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-zinc-900">Website Templates</h2>
            <p className="text-zinc-500 text-sm">
              Manage and edit the core page components for {brand?.name || "—"}.
            </p>
          </div>

          <button
            onClick={() => navigate(`/brands/${brandId}/templates`)}
            className="bg-primary hover:bg-primary/90 text-white text-sm font-semibold px-5 py-2.5 rounded-xl shadow-lg shadow-primary/20 flex items-center gap-2 transition-all"
          >
            <MIcon name="view_list" className="text-[20px]" />
            View All Templates
          </button>
        </div>

        {/* ✅ 3 cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {topTemplates.map((t) => (
            <TemplateCard
              key={t.key}
              t={t}
              onEdit={() => navigate(`/brands/${brandId}/templates/${t.key}/builder`)}
              onView={() => navigate(`/brands/${brandId}/templates`)}
            />
          ))}
        </div>
      </section>

      {/* Brand Variables */}
      <section className="border-t border-zinc-200 pt-12 pb-20">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-zinc-900">Brand Variables</h2>
          <p className="text-zinc-500 text-sm">
            Global style overrides that populate into all templates for {brand?.name || "—"}.
          </p>
        </div>

        <div className="bg-white rounded-xl border border-zinc-200 overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 divide-y md:divide-y-0 md:divide-x border-b border-zinc-100">
            {/* Colors */}
            <div className="p-6">
              <label className="block text-xs font-bold text-zinc-400 uppercase tracking-widest mb-4">
                Primary Accent Color
              </label>

              <div className="flex items-center gap-4">
                <div
                  className="w-12 h-12 rounded-full border-4 border-white shadow-sm ring-1 ring-zinc-200"
                  style={{ background: colors.primary || colors.accent || "#2ec2b3" }}
                />
                <div className="flex-1">
                  <div className="text-sm font-semibold text-zinc-900">Primary</div>
                  <div className="text-xs text-zinc-500">{colors.primary || colors.accent || "—"}</div>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="text-xs text-zinc-500">
                  <div className="font-bold text-zinc-700">Primary Dark</div>
                  <div>{colors.primaryDark || "—"}</div>
                </div>
                <div className="text-xs text-zinc-500">
                  <div className="font-bold text-zinc-700">Accent</div>
                  <div>{colors.accent || "—"}</div>
                </div>
              </div>

              <button className="mt-4 text-primary text-xs font-bold hover:underline">
                Change
              </button>
            </div>

            {/* Typography */}
            <div className="p-6">
              <label className="block text-xs font-bold text-zinc-400 uppercase tracking-widest mb-4">
                Typography Set
              </label>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-zinc-50 rounded-lg flex items-center justify-center text-xl font-bold text-zinc-700">
                  Aa
                </div>
                <div className="flex-1">
                  <div className="text-sm font-semibold text-zinc-900">
                    {fonts.family || "—"}
                  </div>
                  <div className="text-xs text-zinc-500">
                    {fonts.googleUrl ? "Google Fonts" : "—"}
                  </div>
                </div>
              </div>

              <div className="mt-4 text-xs text-zinc-500 break-all">
                <div className="font-bold text-zinc-700">Font URL</div>
                <div>{fonts.googleUrl || "—"}</div>
              </div>

              <button className="mt-4 text-primary text-xs font-bold hover:underline">
                Edit
              </button>
            </div>

            {/* Logo */}
            <div className="p-6">
              <label className="block text-xs font-bold text-zinc-400 uppercase tracking-widest mb-4">
                Logo Variant
              </label>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-zinc-50 rounded-lg flex items-center justify-center">
                  {logo.type === "material" ? (
                    <span className="material-symbols-outlined text-zinc-700">
                      {logo.value || "pets"}
                    </span>
                  ) : (
                    <MIcon name="image" className="text-zinc-700 text-[22px]" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="text-sm font-semibold text-zinc-900">
                    {logo.text || brand?.name || "—"}
                  </div>
                  <div className="text-xs text-zinc-500">
                    {logo.type || "—"} • {logo.value || "—"}
                  </div>
                </div>
              </div>

              <div className="mt-4 text-xs text-zinc-500 break-all">
                <div className="font-bold text-zinc-700">Icons URL</div>
                <div>{fonts.iconsUrl || "—"}</div>
              </div>

              <button className="mt-4 text-primary text-xs font-bold hover:underline">
                Replace
              </button>
            </div>
          </div>

          <div className="p-4 bg-zinc-50 flex justify-end gap-3">
            <button className="px-4 py-2 text-sm font-medium text-zinc-600 hover:text-zinc-900">
              Cancel Changes
            </button>
            <button className="px-6 py-2 bg-zinc-900 text-white text-sm font-semibold rounded-lg hover:bg-zinc-800 transition-colors">
              Apply Global Styles
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
