// BrandDetail.jsx (FULL FILE) ✅ Company Details UI + Save API wired
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import MIcon from "../components/MIcon";
import { apiFetch } from "../lib/auth";

/* =========================
   Small UI helpers
========================= */
function Modal({ open, title, children, onClose }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-zinc-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-zinc-100 flex items-center justify-between">
          <div className="text-sm font-extrabold text-zinc-900">{title}</div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-zinc-100 flex items-center justify-center"
          >
            <MIcon name="close" className="text-[18px] text-zinc-600" />
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}

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
      <p className="text-xs text-zinc-400 mb-6">Last Edited: {t.edited || "—"}</p>

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

function Field({ label, value, onChange, placeholder }) {
  return (
    <div>
      <div className="text-xs font-bold text-zinc-600 mb-1">{label}</div>
      <input
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full h-10 px-3 rounded-lg border border-zinc-200 text-sm outline-none focus:ring-2 focus:ring-primary/20"
      />
    </div>
  );
}

const MATERIAL_ICON_SUGGESTIONS = [
  "pets",
  "verified_user",
  "home",
  "favorite",
  "star",
  "support_agent",
  "shield",
  "health_and_safety",
  "paid",
  "savings",
  "apartment",
  "storefront",
  "shopping_bag",
  "local_shipping",
  "handshake",
  "workspace_premium",
  "public",
];

export default function BrandDetail() {
  const navigate = useNavigate();
  const { brandId } = useParams();

  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [brand, setBrand] = useState(null);
  const [templates, setTemplates] = useState([]);

  // editable draft
  const [draft, setDraft] = useState(null);
  const [saving, setSaving] = useState(false);

  // modals
  const [openColors, setOpenColors] = useState(false);
  const [openFonts, setOpenFonts] = useState(false);
  const [openLogo, setOpenLogo] = useState(false);
  const [openCompany, setOpenCompany] = useState(false);

  // logo picker local state
  const [iconSearch, setIconSearch] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setErr("");
      try {
        const res = await apiFetch(`/admin/brands/${brandId}/detail`);
        const json = await res.json().catch(() => null);

        if (!res.ok || !json?.ok) throw new Error(json?.message || "Failed to load brand");

        if (!cancelled) {
          setBrand(json.data.brand);
          setTemplates(Array.isArray(json.data.templates) ? json.data.templates : []);

          const b = json.data.brand || {};
          setDraft({
            accentColor: b?.colors?.accent || b?.colors?.primary || "",
            primaryColor: b?.colors?.primary || "",
            typography: {
              family: b?.fonts?.family || "",
              googleUrl: b?.fonts?.googleUrl || "",
              iconsUrl: b?.fonts?.iconsUrl || "",
            },
            logo: {
              type: b?.logo?.type || "material",
              value: b?.logo?.value || "pets",
            },
            company: {
              name: b?.company?.name || b?.companyName || "",
              phone: b?.company?.phone || b?.companyPhone || "",
              whatsapp: b?.company?.whatsapp || b?.companyWhatsapp || "",
              email: b?.company?.email || b?.companyEmail || "",
              location: b?.company?.location || b?.companyLocation || "",
            },
          });
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
    const accent =
      draft?.accentColor || brand?.colors?.accent || brand?.colors?.primary || "#2ec2b3";
    return { ["--brand-accent"]: accent };
  }, [brand, draft]);

  const topTemplates = useMemo(() => {
    const mapIcon = { header: "dock_to_bottom", footer: "dock_to_bottom", home: "home" };
    return (templates || [])
      .filter((t) => ["header", "footer", "home"].includes(t.key))
      .map((t) => ({
        id: t.id,
        key: t.key,
        title: t.key === "header" ? "Global Header" : t.key === "footer" ? "Global Footer" : "Home Page",
        status: t.status || "draft",
        icon: mapIcon[t.key] || "description",
        edited: timeAgoOrDate(t.updatedAt),
      }));
  }, [templates]);

  function resetDraftToBrand() {
    const b = brand || {};
    setDraft({
      accentColor: b?.colors?.accent || b?.colors?.primary || "",
      primaryColor: b?.colors?.primary || "",
      typography: {
        family: b?.fonts?.family || "",
        googleUrl: b?.fonts?.googleUrl || "",
        iconsUrl: b?.fonts?.iconsUrl || "",
      },
      logo: {
        type: b?.logo?.type || "material",
        value: b?.logo?.value || "pets",
      },
      company: {
        name: b?.company?.name || "",
        phone: b?.company?.phone || "",
        whatsapp: b?.company?.whatsapp || "",
        email: b?.company?.email || "",
        location: b?.company?.location || "",
      },
    });
  }

  async function saveVariables() {
    if (!draft) return;
    setSaving(true);
    try {
      const res = await apiFetch(`/admin/brands/${brandId}/variables`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          accentColor: draft.accentColor,
          primaryColor: draft.primaryColor,
          logoType: draft.logo?.type,
          logoValue: draft.logo?.value,
          typography: {
            family: draft.typography?.family || null,
            googleUrl: draft.typography?.googleUrl || null,
            iconsUrl: draft.typography?.iconsUrl || null,
          },

          // ✅ company details (new)
          companyName: draft.company?.name || null,
          companyPhone: draft.company?.phone || null,
          companyWhatsapp: draft.company?.whatsapp || null,
          companyEmail: draft.company?.email || null,
          companyLocation: draft.company?.location || null,
        }),
      });

      const json = await res.json().catch(() => null);
      if (!res.ok || !json?.ok) throw new Error(json?.message || "Failed to update brand");

      // reflect saved changes in the page
      setBrand((prev) => {
        const p = prev || {};
        const accent = json.data.accentColor || draft.accentColor || p?.colors?.accent;
        const primary = json.data.primaryColor || draft.primaryColor || p?.colors?.primary || accent;

        return {
          ...p,
          colors: { ...(p.colors || {}), accent, primary },
          fonts: {
            ...(p.fonts || {}),
            family: json.data.typography?.family || draft.typography?.family || p?.fonts?.family,
            googleUrl: json.data.typography?.googleUrl || draft.typography?.googleUrl || p?.fonts?.googleUrl,
            iconsUrl: json.data.typography?.iconsUrl || draft.typography?.iconsUrl || p?.fonts?.iconsUrl,
          },
          logo: {
            ...(p.logo || {}),
            type: json.data.logoType || draft.logo?.type,
            value: json.data.logoValue || draft.logo?.value,
            text: p?.name || "",
          },
          company: {
            name: json.data.company?.name ?? draft.company?.name ?? p?.company?.name ?? "",
            phone: json.data.company?.phone ?? draft.company?.phone ?? p?.company?.phone ?? "",
            whatsapp: json.data.company?.whatsapp ?? draft.company?.whatsapp ?? p?.company?.whatsapp ?? "",
            email: json.data.company?.email ?? draft.company?.email ?? p?.company?.email ?? "",
            location: json.data.company?.location ?? draft.company?.location ?? p?.company?.location ?? "",
          },
        };
      });

      setOpenCompany(false);
      alert("Saved");
    } catch (e) {
      alert(e?.message || "Failed to save");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div className="max-w-7xl mx-auto py-10 text-zinc-500">Loading…</div>;

  if (err) {
    return (
      <div className="max-w-7xl mx-auto py-10">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">{err}</div>
      </div>
    );
  }

  const colors = brand?.colors || {};
  const fonts = brand?.fonts || {};
  const logo = brand?.logo || {};
  const company = brand?.company || {};

  const iconOptions = MATERIAL_ICON_SUGGESTIONS.filter((x) =>
    !iconSearch ? true : x.toLowerCase().includes(iconSearch.toLowerCase())
  );

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
                  style={{
                    background: draft?.accentColor || colors.primary || colors.accent || "#2ec2b3",
                  }}
                />
                <div className="flex-1">
                  <div className="text-sm font-semibold text-zinc-900">Primary</div>
                  <div className="text-xs text-zinc-500">
                    {draft?.accentColor || colors.primary || colors.accent || "—"}
                  </div>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="text-xs text-zinc-500">
                  <div className="font-bold text-zinc-700">Primary</div>
                  <div>{draft?.primaryColor || colors.primary || "—"}</div>
                </div>
                <div className="text-xs text-zinc-500">
                  <div className="font-bold text-zinc-700">Accent</div>
                  <div>{draft?.accentColor || colors.accent || "—"}</div>
                </div>
              </div>

              <button className="mt-4 text-primary text-xs font-bold hover:underline" onClick={() => setOpenColors(true)}>
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
                    {draft?.typography?.family || fonts.family || "—"}
                  </div>
                  <div className="text-xs text-zinc-500">
                    {draft?.typography?.googleUrl || fonts.googleUrl ? "Google Fonts" : "—"}
                  </div>
                </div>
              </div>

              <div className="mt-4 text-xs text-zinc-500 break-all">
                <div className="font-bold text-zinc-700">Font URL</div>
                <div>{draft?.typography?.googleUrl || fonts.googleUrl || "—"}</div>
              </div>

              <button className="mt-4 text-primary text-xs font-bold hover:underline" onClick={() => setOpenFonts(true)}>
                Edit
              </button>
            </div>

            {/* Logo */}
            <div className="p-6">
              <label className="block text-xs font-bold text-zinc-400 uppercase tracking-widest mb-4">
                Logo Variant
              </label>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-zinc-50 rounded-lg flex items-center justify-center overflow-hidden">
                  {draft?.logo?.type === "material" ? (
                    <span className="material-symbols-outlined text-zinc-700">
                      {draft?.logo?.value || logo.value || "pets"}
                    </span>
                  ) : draft?.logo?.type === "emoji" ? (
                    <span className="text-2xl">{draft?.logo?.value || "✨"}</span>
                  ) : draft?.logo?.type === "image" && draft?.logo?.value ? (
                    <img src={draft.logo.value} alt="logo" className="w-10 h-10 object-contain" />
                  ) : (
                    <MIcon name="image" className="text-zinc-700 text-[22px]" />
                  )}
                </div>

                <div className="flex-1">
                  <div className="text-sm font-semibold text-zinc-900">{brand?.name || "—"}</div>
                  <div className="text-xs text-zinc-500">
                    {(draft?.logo?.type || logo.type || "—")} • {(draft?.logo?.value || logo.value || "—")}
                  </div>
                </div>
              </div>

              <div className="mt-4 text-xs text-zinc-500 break-all">
                <div className="font-bold text-zinc-700">Icons URL</div>
                <div>{draft?.typography?.iconsUrl || fonts.iconsUrl || "—"}</div>
              </div>

              <button className="mt-4 text-primary text-xs font-bold hover:underline" onClick={() => setOpenLogo(true)}>
                Replace
              </button>
            </div>
          </div>

          {/* ✅ Company Details (summary row) */}
          <div className="p-6 border-b border-zinc-100">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-extrabold text-zinc-900">Company Details</div>
                <div className="text-xs text-zinc-500">Shown on admin and can be used in templates/pages.</div>
              </div>
              <button
                onClick={() => setOpenCompany(true)}
                className="h-10 px-4 rounded-lg border border-zinc-200 text-sm font-semibold text-zinc-700 hover:bg-zinc-50"
              >
                Edit
              </button>
            </div>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
              <div className="rounded-xl border border-zinc-200 p-4">
                <div className="text-xs text-zinc-500 font-bold">Company Name</div>
                <div className="text-zinc-900 font-semibold">{company?.name || "—"}</div>
              </div>
              <div className="rounded-xl border border-zinc-200 p-4">
                <div className="text-xs text-zinc-500 font-bold">Phone</div>
                <div className="text-zinc-900 font-semibold">{company?.phone || "—"}</div>
              </div>
              <div className="rounded-xl border border-zinc-200 p-4">
                <div className="text-xs text-zinc-500 font-bold">WhatsApp</div>
                <div className="text-zinc-900 font-semibold">{company?.whatsapp || "—"}</div>
              </div>
              <div className="rounded-xl border border-zinc-200 p-4">
                <div className="text-xs text-zinc-500 font-bold">Email</div>
                <div className="text-zinc-900 font-semibold">{company?.email || "—"}</div>
              </div>
              <div className="rounded-xl border border-zinc-200 p-4 md:col-span-2 lg:col-span-2">
                <div className="text-xs text-zinc-500 font-bold">Location</div>
                <div className="text-zinc-900 font-semibold">{company?.location || "—"}</div>
              </div>
            </div>
          </div>

          <div className="p-4 bg-zinc-50 flex justify-end gap-3">
            <button
              className="px-4 py-2 text-sm font-medium text-zinc-600 hover:text-zinc-900"
              onClick={resetDraftToBrand}
            >
              Cancel Changes
            </button>

            <button
              disabled={saving}
              onClick={saveVariables}
              className="px-6 py-2 bg-zinc-900 text-white text-sm font-semibold rounded-lg hover:bg-zinc-800 transition-colors disabled:opacity-60"
            >
              {saving ? "Saving..." : "Apply Global Styles"}
            </button>
          </div>
        </div>
      </section>

      {/* =========================
          Modals
      ========================= */}

      <Modal open={openColors} title="Update Brand Colors" onClose={() => setOpenColors(false)}>
        <div className="space-y-4">
          <div>
            <div className="text-xs font-bold text-zinc-600 mb-1">Accent Color</div>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={draft?.accentColor || "#2ec2b3"}
                onChange={(e) => setDraft((d) => ({ ...d, accentColor: e.target.value }))}
                className="w-12 h-10 p-0 border border-zinc-200 rounded"
              />
              <input
                value={draft?.accentColor || ""}
                onChange={(e) => setDraft((d) => ({ ...d, accentColor: e.target.value }))}
                placeholder="#2ec2b3"
                className="flex-1 h-10 px-3 rounded-lg border border-zinc-200 text-sm"
              />
            </div>
          </div>

          <div>
            <div className="text-xs font-bold text-zinc-600 mb-1">Primary Color</div>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={draft?.primaryColor || "#2ec2b3"}
                onChange={(e) => setDraft((d) => ({ ...d, primaryColor: e.target.value }))}
                className="w-12 h-10 p-0 border border-zinc-200 rounded"
              />
              <input
                value={draft?.primaryColor || ""}
                onChange={(e) => setDraft((d) => ({ ...d, primaryColor: e.target.value }))}
                placeholder="#2ec2b3"
                className="flex-1 h-10 px-3 rounded-lg border border-zinc-200 text-sm"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button onClick={() => setOpenColors(false)} className="h-10 px-4 rounded-lg border border-zinc-200 text-sm">
              Done
            </button>
          </div>
        </div>
      </Modal>

      <Modal open={openFonts} title="Update Typography" onClose={() => setOpenFonts(false)}>
        <div className="space-y-4">
          <div>
            <div className="text-xs font-bold text-zinc-600 mb-1">Font Family</div>
            <input
              value={draft?.typography?.family || ""}
              onChange={(e) =>
                setDraft((d) => ({ ...d, typography: { ...(d?.typography || {}), family: e.target.value } }))
              }
              placeholder="Inter"
              className="w-full h-10 px-3 rounded-lg border border-zinc-200 text-sm"
            />
          </div>

          <div>
            <div className="text-xs font-bold text-zinc-600 mb-1">Google Font URL</div>
            <input
              value={draft?.typography?.googleUrl || ""}
              onChange={(e) =>
                setDraft((d) => ({ ...d, typography: { ...(d?.typography || {}), googleUrl: e.target.value } }))
              }
              placeholder="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap"
              className="w-full h-10 px-3 rounded-lg border border-zinc-200 text-sm"
            />
          </div>

          <div>
            <div className="text-xs font-bold text-zinc-600 mb-1">Icons URL (optional)</div>
            <input
              value={draft?.typography?.iconsUrl || ""}
              onChange={(e) =>
                setDraft((d) => ({ ...d, typography: { ...(d?.typography || {}), iconsUrl: e.target.value } }))
              }
              placeholder="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0"
              className="w-full h-10 px-3 rounded-lg border border-zinc-200 text-sm"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button onClick={() => setOpenFonts(false)} className="h-10 px-4 rounded-lg border border-zinc-200 text-sm">
              Done
            </button>
          </div>
        </div>
      </Modal>

      <Modal open={openLogo} title="Update Logo" onClose={() => setOpenLogo(false)}>
        <div className="space-y-4">
          <div className="text-xs font-bold text-zinc-600 mb-1">Logo Type</div>
          <div className="flex gap-2">
            {["material", "emoji", "image"].map((t) => (
              <button
                key={t}
                onClick={() => setDraft((d) => ({ ...d, logo: { ...(d?.logo || {}), type: t } }))}
                className={[
                  "h-10 px-4 rounded-lg border text-sm font-semibold",
                  (draft?.logo?.type || "material") === t
                    ? "border-zinc-900 text-zinc-900"
                    : "border-zinc-200 text-zinc-600 hover:bg-zinc-50",
                ].join(" ")}
              >
                {t}
              </button>
            ))}
          </div>

          {draft?.logo?.type === "material" ? (
            <>
              <div className="text-xs font-bold text-zinc-600 mb-1">Material Icon</div>
              <input
                value={iconSearch}
                onChange={(e) => setIconSearch(e.target.value)}
                placeholder="Search icon… (pets, home, star)"
                className="w-full h-10 px-3 rounded-lg border border-zinc-200 text-sm"
              />

              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mt-3">
                {iconOptions.map((ic) => (
                  <button
                    key={ic}
                    onClick={() => setDraft((d) => ({ ...d, logo: { ...(d?.logo || {}), value: ic } }))}
                    className={[
                      "h-12 rounded-xl border flex items-center justify-center gap-2 text-sm",
                      draft?.logo?.value === ic ? "border-zinc-900" : "border-zinc-200 hover:bg-zinc-50",
                    ].join(" ")}
                    title={ic}
                  >
                    <span className="material-symbols-outlined text-[20px]">{ic}</span>
                  </button>
                ))}
              </div>

              <div className="text-xs text-zinc-500 mt-2">
                Selected: <span className="font-semibold text-zinc-800">{draft?.logo?.value || "—"}</span>
              </div>
            </>
          ) : null}

          {draft?.logo?.type === "emoji" ? (
            <Field
              label="Emoji"
              value={draft?.logo?.value || ""}
              onChange={(v) => setDraft((d) => ({ ...d, logo: { ...(d?.logo || {}), value: v } }))}
              placeholder="🐾"
            />
          ) : null}

          {draft?.logo?.type === "image" ? (
            <>
              <Field
                label="Image URL"
                value={draft?.logo?.value || ""}
                onChange={(v) => setDraft((d) => ({ ...d, logo: { ...(d?.logo || {}), value: v } }))}
                placeholder="https://.../logo.png"
              />
              <div className="text-xs text-zinc-500">
                (Next: upload to Supabase Storage and store public URL here.)
              </div>
            </>
          ) : null}

          <div className="flex justify-end gap-2 pt-2">
            <button onClick={() => setOpenLogo(false)} className="h-10 px-4 rounded-lg border border-zinc-200 text-sm">
              Done
            </button>
          </div>
        </div>
      </Modal>

      {/* ✅ Company modal (functional + saves via same PUT variables) */}
      <Modal open={openCompany} title="Company Details" onClose={() => setOpenCompany(false)}>
        <div className="space-y-4">
          <Field
            label="Company Name"
            value={draft?.company?.name || ""}
            onChange={(v) => setDraft((d) => ({ ...d, company: { ...(d?.company || {}), name: v } }))}
            placeholder="Umair Trust Life"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field
              label="Company Phone"
              value={draft?.company?.phone || ""}
              onChange={(v) => setDraft((d) => ({ ...d, company: { ...(d?.company || {}), phone: v } }))}
              placeholder="+92 3xx xxxxxxx"
            />
            <Field
              label="Company WhatsApp"
              value={draft?.company?.whatsapp || ""}
              onChange={(v) => setDraft((d) => ({ ...d, company: { ...(d?.company || {}), whatsapp: v } }))}
              placeholder="+92 3xx xxxxxxx"
            />
          </div>
          <Field
            label="Company Email"
            value={draft?.company?.email || ""}
            onChange={(v) => setDraft((d) => ({ ...d, company: { ...(d?.company || {}), email: v } }))}
            placeholder="support@domain.com"
          />
          <Field
            label="Company Location"
            value={draft?.company?.location || ""}
            onChange={(v) => setDraft((d) => ({ ...d, company: { ...(d?.company || {}), location: v } }))}
            placeholder="Karachi, Pakistan"
          />

          <div className="flex justify-end gap-2 pt-2">
            <button
              onClick={() => setOpenCompany(false)}
              className="h-10 px-4 rounded-lg border border-zinc-200 text-sm"
            >
              Cancel
            </button>
            <button
              disabled={saving}
              onClick={saveVariables}
              className="h-10 px-5 rounded-lg bg-zinc-900 text-white text-sm font-semibold hover:bg-zinc-800 disabled:opacity-60"
            >
              {saving ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
