// BrandDetail.jsx
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import MIcon from "../components/MIcon";
import { apiFetch } from "../lib/auth";

function Modal({ open, title, children, onClose }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-xl rounded-[28px] bg-white dark:bg-slate-900 shadow-2xl border border-slate-200 dark:border-white/10 overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-200 dark:border-white/10 flex items-center justify-between">
          <div className="text-lg font-black text-gray-950 dark:text-white">{title}</div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl hover:bg-[#007ab3]/10 hover:text-[#007ab3] flex items-center justify-center transition"
          >
            <MIcon name="close" className="text-[20px]" />
          </button>
        </div>

        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const s = String(status || "").toLowerCase();
  const active = s === "live" || s === "published" || s === "active";
  const draft = s === "draft" || s === "inactive";

  return (
    <span
      className={[
        "inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-black uppercase border",
        active
          ? "bg-green-50 text-green-700 border-green-100 dark:bg-green-950/30 dark:text-green-300 dark:border-green-900/40"
          : draft
            ? "bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-950/30 dark:text-amber-300 dark:border-amber-900/40"
            : "bg-slate-100 text-slate-500 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-white/10",
      ].join(" ")}
    >
      <span className={["w-1.5 h-1.5 rounded-full", active ? "bg-green-500" : draft ? "bg-amber-500" : "bg-slate-400"].join(" ")} />
      {active ? "LIVE" : draft ? "DRAFT" : "ARCHIVED"}
    </span>
  );
}

function TemplateCard({ template, onEdit, onView, t }) {
  return (
    <div className="group rounded-[28px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 shadow-sm hover:shadow-xl hover:shadow-[#007ab3]/10 transition-all p-6 overflow-hidden relative">
      <div className="absolute -right-10 -top-10 w-32 h-32 rounded-full bg-[#007ab3]/10 group-hover:bg-[#007ab3]/15 transition" />

      <div className="relative">
        <div className="flex items-start justify-between mb-6">
          <div className="w-12 h-12 rounded-2xl bg-[#007ab3]/10 flex items-center justify-center">
            <MIcon name={template.icon} className="text-[#007ab3] text-[24px]" />
          </div>

          <StatusBadge status={template.status} />
        </div>

        <h3 className="text-lg font-black text-gray-950 dark:text-white mb-1">
          {template.title}
        </h3>

        <p className="text-xs text-slate-500 dark:text-slate-400 mb-6 font-semibold">
          {t("brandDetailLastEdited")}: {template.edited || "—"}
        </p>

        <div className="flex gap-3">
          <button
            onClick={onEdit}
            className="flex-1 h-11 rounded-2xl bg-gradient-to-r from-[#007ab3] to-[#005f8c] text-white text-sm font-black shadow-lg shadow-[#007ab3]/20 hover:brightness-105 transition"
          >
            {t("brandDetailEditTemplate")}
          </button>

          <button
            onClick={onView}
            className="w-11 h-11 border border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-300 rounded-2xl hover:bg-[#007ab3]/10 hover:text-[#007ab3] transition"
            title={t("brandDetailViewTemplates")}
          >
            <MIcon name="visibility" className="text-[19px] align-middle" />
          </button>
        </div>
      </div>
    </div>
  );
}

function InfoBox({ label, value, icon }) {
  return (
    <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-950 p-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-[#007ab3]/10 flex items-center justify-center shrink-0">
          <MIcon name={icon} className="text-[20px] text-[#007ab3]" />
        </div>
        <div className="min-w-0">
          <div className="text-xs text-slate-500 dark:text-slate-400 font-black uppercase tracking-[0.14em]">
            {label}
          </div>
          <div className="text-sm text-gray-950 dark:text-white font-bold truncate">
            {value || "—"}
          </div>
        </div>
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
      <div className="text-xs font-black text-slate-600 dark:text-slate-300 mb-1 uppercase tracking-[0.12em]">
        {label}
      </div>

      <input
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full h-11 px-4 rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-950 text-sm text-gray-950 dark:text-white placeholder:text-slate-400 outline-none focus:ring-4 focus:ring-[#007ab3]/20 focus:border-[#007ab3]"
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
  const { t } = useTranslation();

  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [brand, setBrand] = useState(null);
  const [templates, setTemplates] = useState([]);
  const [draft, setDraft] = useState(null);
  const [saving, setSaving] = useState(false);

  const [openColors, setOpenColors] = useState(false);
  const [openFonts, setOpenFonts] = useState(false);
  const [openLogo, setOpenLogo] = useState(false);
  const [openCompany, setOpenCompany] = useState(false);
  const [iconSearch, setIconSearch] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setErr("");

      try {
        const res = await apiFetch(`/admin/brands/${brandId}/detail`);
        const json = await res.json().catch(() => null);

        if (!res.ok || !json?.ok) {
          throw new Error(json?.message || t("brandDetailFailedToLoadBrand"));
        }

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
        if (!cancelled) setErr(e?.message || t("brandDetailFailedToLoadBrand"));
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    if (brandId) load();

    return () => {
      cancelled = true;
    };
  }, [brandId, t]);

  const topTemplates = useMemo(() => {
    const mapIcon = {
      header: "dock_to_bottom",
      footer: "dock_to_bottom",
      home: "home",
    };

    return (templates || [])
      .filter((template) => ["header", "footer", "home"].includes(template.key))
      .map((template) => ({
        id: template.id,
        key: template.key,
        title:
          template.key === "header"
            ? t("dashboardGlobalHeader")
            : template.key === "footer"
              ? "Global Footer"
              : t("dashboardHomePage"),
        status: template.status || "draft",
        icon: mapIcon[template.key] || "description",
        edited: timeAgoOrDate(template.updatedAt),
      }));
  }, [templates, t]);

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
          companyName: draft.company?.name || null,
          companyPhone: draft.company?.phone || null,
          companyWhatsapp: draft.company?.whatsapp || null,
          companyEmail: draft.company?.email || null,
          companyLocation: draft.company?.location || null,
        }),
      });

      const json = await res.json().catch(() => null);

      if (!res.ok || !json?.ok) {
        throw new Error(json?.message || t("brandDetailFailedToUpdateBrand"));
      }

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
      alert(t("brandDetailSaved"));
    } catch (e) {
      alert(e?.message || t("brandDetailFailedToSave"));
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto py-10 text-slate-500">
        {t("brandDetailLoading")}
      </div>
    );
  }

  if (err) {
    return (
      <div className="max-w-7xl mx-auto py-10">
        <div className="bg-red-50 border border-red-200 text-red-700 px-5 py-4 rounded-2xl">
          {err}
        </div>
      </div>
    );
  }

  const colors = brand?.colors || {};
  const fonts = brand?.fonts || {};
  const logoData = brand?.logo || {};
  const company = brand?.company || {};
  const brandName = brand?.name || "—";

  const iconOptions = MATERIAL_ICON_SUGGESTIONS.filter((x) =>
    !iconSearch ? true : x.toLowerCase().includes(iconSearch.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="rounded-[28px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 shadow-sm p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="text-xs font-black uppercase tracking-[0.2em] text-[#007ab3]">
            Allianz Panel
          </div>
          <h2 className="mt-1 text-2xl font-black text-gray-950 dark:text-white">
            {brandName}
          </h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {t("brandDetailTemplatesDesc", { brand: brandName })}
          </p>
        </div>

        <button
          onClick={() => navigate(`/brands/${brandId}/templates`)}
          className="h-11 px-5 rounded-2xl bg-gradient-to-r from-[#007ab3] to-[#005f8c] text-white text-sm font-black shadow-lg shadow-[#007ab3]/20 hover:brightness-105 transition inline-flex items-center justify-center gap-2"
        >
          <MIcon name="view_list" className="text-[20px]" />
          {t("brandDetailViewAllTemplates")}
        </button>
      </div>

      <section className="space-y-5">
        <div>
          <h2 className="text-xl font-black text-gray-950 dark:text-white">
            {t("brandDetailWebsiteTemplates")}
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {t("brandDetailTemplatesDesc", { brand: brandName })}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {topTemplates.map((template) => (
            <TemplateCard
              key={template.key}
              template={template}
              t={t}
              onEdit={() => navigate(`/brands/${brandId}/templates/${template.key}/builder`)}
              onView={() => navigate(`/brands/${brandId}/templates`)}
            />
          ))}
        </div>
      </section>

      <section className="space-y-5 pb-20">
        <div>
          <h2 className="text-xl font-black text-gray-950 dark:text-white">
            {t("brandDetailBrandVariables")}
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {t("brandDetailBrandVariablesDesc", { brand: brandName })}
          </p>
        </div>

        <div className="rounded-[28px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 shadow-sm overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-slate-200 dark:divide-white/10">
            <div className="p-6">
              <label className="block text-xs font-black text-slate-400 uppercase tracking-[0.18em] mb-5">
                {t("brandDetailPrimaryAccentColor")}
              </label>

              <div className="flex items-center gap-4">
                <div
                  className="w-14 h-14 rounded-2xl border-4 border-white dark:border-slate-800 shadow-lg ring-1 ring-slate-200 dark:ring-white/10"
                  style={{ background: draft?.accentColor || colors.primary || colors.accent || "#007ab3" }}
                />

                <div className="flex-1 min-w-0">
                  <div className="text-sm font-black text-gray-950 dark:text-white">
                    {t("brandDetailPrimary")}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 font-semibold truncate">
                    {draft?.accentColor || colors.primary || colors.accent || "—"}
                  </div>
                </div>
              </div>

              <button
                className="mt-5 h-10 px-4 rounded-2xl bg-[#007ab3]/10 text-[#007ab3] text-xs font-black hover:bg-[#007ab3]/15 transition"
                onClick={() => setOpenColors(true)}
              >
                {t("brandDetailChange")}
              </button>
            </div>

            <div className="p-6">
              <label className="block text-xs font-black text-slate-400 uppercase tracking-[0.18em] mb-5">
                {t("brandDetailTypographySet")}
              </label>

              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-[#007ab3]/10 rounded-2xl flex items-center justify-center text-xl font-black text-[#007ab3]">
                  Aa
                </div>

                <div className="flex-1 min-w-0">
                  <div className="text-sm font-black text-gray-950 dark:text-white truncate">
                    {draft?.typography?.family || fonts.family || "—"}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    {draft?.typography?.googleUrl || fonts.googleUrl ? t("brandDetailGoogleFonts") : "—"}
                  </div>
                </div>
              </div>

              <button
                className="mt-5 h-10 px-4 rounded-2xl bg-[#007ab3]/10 text-[#007ab3] text-xs font-black hover:bg-[#007ab3]/15 transition"
                onClick={() => setOpenFonts(true)}
              >
                {t("brandDetailEdit")}
              </button>
            </div>

            <div className="p-6">
              <label className="block text-xs font-black text-slate-400 uppercase tracking-[0.18em] mb-5">
                {t("brandDetailLogoVariant")}
              </label>

              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-[#007ab3]/10 rounded-2xl flex items-center justify-center overflow-hidden">
                  {draft?.logo?.type === "material" ? (
                    <span className="material-symbols-outlined text-[#007ab3]">
                      {draft?.logo?.value || logoData.value || "pets"}
                    </span>
                  ) : draft?.logo?.type === "emoji" ? (
                    <span className="text-2xl">{draft?.logo?.value || "✨"}</span>
                  ) : draft?.logo?.type === "image" && draft?.logo?.value ? (
                    <img src={draft.logo.value} alt="logo" className="w-10 h-10 object-contain" />
                  ) : (
                    <MIcon name="image" className="text-[#007ab3] text-[22px]" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="text-sm font-black text-gray-950 dark:text-white truncate">
                    {brandName}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 truncate">
                    {(draft?.logo?.type || logoData.type || "—")} • {(draft?.logo?.value || logoData.value || "—")}
                  </div>
                </div>
              </div>

              <button
                className="mt-5 h-10 px-4 rounded-2xl bg-[#007ab3]/10 text-[#007ab3] text-xs font-black hover:bg-[#007ab3]/15 transition"
                onClick={() => setOpenLogo(true)}
              >
                {t("brandDetailReplace")}
              </button>
            </div>
          </div>

          <div className="p-6 border-t border-slate-200 dark:border-white/10">
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="text-lg font-black text-gray-950 dark:text-white">
                  {t("brandDetailCompanyDetails")}
                </div>
                <div className="text-sm text-slate-500 dark:text-slate-400">
                  {t("brandDetailCompanyDetailsDesc")}
                </div>
              </div>

              <button
                onClick={() => setOpenCompany(true)}
                className="h-10 px-4 rounded-2xl border border-slate-200 dark:border-white/10 text-sm font-black text-slate-700 dark:text-slate-300 hover:bg-[#007ab3]/10 hover:text-[#007ab3] transition"
              >
                {t("brandDetailEdit")}
              </button>
            </div>

            <div className="mt-5 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              <InfoBox icon="business" label={t("brandDetailCompanyName")} value={company?.name} />
              <InfoBox icon="call" label={t("brandDetailPhone")} value={company?.phone} />
              <InfoBox icon="chat" label={t("brandDetailWhatsapp")} value={company?.whatsapp} />
              <InfoBox icon="mail" label={t("brandDetailEmail")} value={company?.email} />
              <InfoBox icon="location_on" label={t("brandDetailLocation")} value={company?.location} />
            </div>
          </div>

          <div className="p-5 bg-slate-50 dark:bg-slate-950/60 border-t border-slate-200 dark:border-white/10 flex flex-col md:flex-row justify-end gap-3">
            <button
              className="h-11 px-5 rounded-2xl text-sm font-black text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 transition"
              onClick={resetDraftToBrand}
            >
              {t("brandDetailCancelChanges")}
            </button>

            <button
              disabled={saving}
              onClick={saveVariables}
              className="h-11 px-6 rounded-2xl bg-gradient-to-r from-[#007ab3] to-[#005f8c] text-white text-sm font-black shadow-lg shadow-[#007ab3]/20 hover:brightness-105 transition disabled:opacity-60"
            >
              {saving ? t("brandDetailSaving") : t("brandDetailApplyGlobalStyles")}
            </button>
          </div>
        </div>
      </section>

      {/* Keep your existing modal contents below if needed */}
   

      {/* Modals */}
      <Modal
        open={openColors}
        title={t("brandDetailUpdateBrandColors")}
        onClose={() => setOpenColors(false)}
      >
        <div className="space-y-4">
          <div>
            <div className="text-xs font-bold text-zinc-600 mb-1">
              {t("brandDetailAccentColor")}
            </div>

            <div className="flex items-center gap-3">
              <input
                type="color"
                value={draft?.accentColor || "#2ec2b3"}
                onChange={(e) =>
                  setDraft((d) => ({ ...d, accentColor: e.target.value }))
                }
                className="w-12 h-10 p-0 border border-zinc-200 rounded"
              />

              <input
                value={draft?.accentColor || ""}
                onChange={(e) =>
                  setDraft((d) => ({ ...d, accentColor: e.target.value }))
                }
                placeholder="#2ec2b3"
                className="flex-1 h-10 px-3 rounded-lg border border-zinc-200 text-sm"
              />
            </div>
          </div>

          <div>
            <div className="text-xs font-bold text-zinc-600 mb-1">
              {t("brandDetailPrimaryColor")}
            </div>

            <div className="flex items-center gap-3">
              <input
                type="color"
                value={draft?.primaryColor || "#2ec2b3"}
                onChange={(e) =>
                  setDraft((d) => ({ ...d, primaryColor: e.target.value }))
                }
                className="w-12 h-10 p-0 border border-zinc-200 rounded"
              />

              <input
                value={draft?.primaryColor || ""}
                onChange={(e) =>
                  setDraft((d) => ({ ...d, primaryColor: e.target.value }))
                }
                placeholder="#2ec2b3"
                className="flex-1 h-10 px-3 rounded-lg border border-zinc-200 text-sm"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              onClick={() => setOpenColors(false)}
              className="h-10 px-4 rounded-lg border border-zinc-200 text-sm"
            >
              {t("brandDetailDone")}
            </button>
          </div>
        </div>
      </Modal>

      <Modal
        open={openFonts}
        title={t("brandDetailUpdateTypography")}
        onClose={() => setOpenFonts(false)}
      >
        <div className="space-y-4">
          <div>
            <div className="text-xs font-bold text-zinc-600 mb-1">
              {t("brandDetailFontFamily")}
            </div>

            <input
              value={draft?.typography?.family || ""}
              onChange={(e) =>
                setDraft((d) => ({
                  ...d,
                  typography: {
                    ...(d?.typography || {}),
                    family: e.target.value,
                  },
                }))
              }
              placeholder="Inter"
              className="w-full h-10 px-3 rounded-lg border border-zinc-200 text-sm"
            />
          </div>

          <div>
            <div className="text-xs font-bold text-zinc-600 mb-1">
              {t("brandDetailGoogleFontUrl")}
            </div>

            <input
              value={draft?.typography?.googleUrl || ""}
              onChange={(e) =>
                setDraft((d) => ({
                  ...d,
                  typography: {
                    ...(d?.typography || {}),
                    googleUrl: e.target.value,
                  },
                }))
              }
              placeholder="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap"
              className="w-full h-10 px-3 rounded-lg border border-zinc-200 text-sm"
            />
          </div>

          <div>
            <div className="text-xs font-bold text-zinc-600 mb-1">
              {t("brandDetailIconsUrlOptional")}
            </div>

            <input
              value={draft?.typography?.iconsUrl || ""}
              onChange={(e) =>
                setDraft((d) => ({
                  ...d,
                  typography: {
                    ...(d?.typography || {}),
                    iconsUrl: e.target.value,
                  },
                }))
              }
              placeholder="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0"
              className="w-full h-10 px-3 rounded-lg border border-zinc-200 text-sm"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              onClick={() => setOpenFonts(false)}
              className="h-10 px-4 rounded-lg border border-zinc-200 text-sm"
            >
              {t("brandDetailDone")}
            </button>
          </div>
        </div>
      </Modal>

      <Modal
        open={openLogo}
        title={t("brandDetailUpdateLogo")}
        onClose={() => setOpenLogo(false)}
      >
        <div className="space-y-4">
          <div className="text-xs font-bold text-zinc-600 mb-1">
            {t("brandDetailLogoType")}
          </div>

          <div className="flex gap-2">
            {["material", "emoji", "image"].map((logoType) => (
              <button
                key={logoType}
                onClick={() =>
                  setDraft((d) => ({
                    ...d,
                    logo: { ...(d?.logo || {}), type: logoType },
                  }))
                }
                className={[
                  "h-10 px-4 rounded-lg border text-sm font-semibold",
                  (draft?.logo?.type || "material") === logoType
                    ? "border-zinc-900 text-zinc-900"
                    : "border-zinc-200 text-zinc-600 hover:bg-zinc-50",
                ].join(" ")}
              >
                {logoType}
              </button>
            ))}
          </div>

          {draft?.logo?.type === "material" ? (
            <>
              <div className="text-xs font-bold text-zinc-600 mb-1">
                {t("brandDetailMaterialIcon")}
              </div>

              <input
                value={iconSearch}
                onChange={(e) => setIconSearch(e.target.value)}
                placeholder={t("brandDetailSearchIconPlaceholder")}
                className="w-full h-10 px-3 rounded-lg border border-zinc-200 text-sm"
              />

              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mt-3">
                {iconOptions.map((ic) => (
                  <button
                    key={ic}
                    onClick={() =>
                      setDraft((d) => ({
                        ...d,
                        logo: { ...(d?.logo || {}), value: ic },
                      }))
                    }
                    className={[
                      "h-12 rounded-xl border flex items-center justify-center gap-2 text-sm",
                      draft?.logo?.value === ic
                        ? "border-zinc-900"
                        : "border-zinc-200 hover:bg-zinc-50",
                    ].join(" ")}
                    title={ic}
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      {ic}
                    </span>
                  </button>
                ))}
              </div>

              <div className="text-xs text-zinc-500 mt-2">
                {t("brandDetailSelected")}:{" "}
                <span className="font-semibold text-zinc-800">
                  {draft?.logo?.value || "—"}
                </span>
              </div>
            </>
          ) : null}

          {draft?.logo?.type === "emoji" ? (
            <Field
              label={t("brandDetailEmoji")}
              value={draft?.logo?.value || ""}
              onChange={(v) =>
                setDraft((d) => ({
                  ...d,
                  logo: { ...(d?.logo || {}), value: v },
                }))
              }
              placeholder="🐾"
            />
          ) : null}

          {draft?.logo?.type === "image" ? (
            <>
              <Field
                label={t("brandDetailImageUrl")}
                value={draft?.logo?.value || ""}
                onChange={(v) =>
                  setDraft((d) => ({
                    ...d,
                    logo: { ...(d?.logo || {}), value: v },
                  }))
                }
                placeholder="https://.../logo.png"
              />

              <div className="text-xs text-zinc-500">
                {t("brandDetailImageUploadNote")}
              </div>
            </>
          ) : null}

          <div className="flex justify-end gap-2 pt-2">
            <button
              onClick={() => setOpenLogo(false)}
              className="h-10 px-4 rounded-lg border border-zinc-200 text-sm"
            >
              {t("brandDetailDone")}
            </button>
          </div>
        </div>
      </Modal>

      <Modal
        open={openCompany}
        title={t("brandDetailCompanyDetails")}
        onClose={() => setOpenCompany(false)}
      >
        <div className="space-y-4">
          <Field
            label={t("brandDetailCompanyName")}
            value={draft?.company?.name || ""}
            onChange={(v) =>
              setDraft((d) => ({
                ...d,
                company: { ...(d?.company || {}), name: v },
              }))
            }
            placeholder="Umair Trust Life"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field
              label={t("brandDetailPhone")}
              value={draft?.company?.phone || ""}
              onChange={(v) =>
                setDraft((d) => ({
                  ...d,
                  company: { ...(d?.company || {}), phone: v },
                }))
              }
              placeholder="+92 3xx xxxxxxx"
            />

            <Field
              label={t("brandDetailWhatsapp")}
              value={draft?.company?.whatsapp || ""}
              onChange={(v) =>
                setDraft((d) => ({
                  ...d,
                  company: { ...(d?.company || {}), whatsapp: v },
                }))
              }
              placeholder="+92 3xx xxxxxxx"
            />
          </div>

          <Field
            label={t("brandDetailEmail")}
            value={draft?.company?.email || ""}
            onChange={(v) =>
              setDraft((d) => ({
                ...d,
                company: { ...(d?.company || {}), email: v },
              }))
            }
            placeholder="support@domain.com"
          />

          <Field
            label={t("brandDetailLocation")}
            value={draft?.company?.location || ""}
            onChange={(v) =>
              setDraft((d) => ({
                ...d,
                company: { ...(d?.company || {}), location: v },
              }))
            }
            placeholder="Karachi, Pakistan"
          />

          <div className="flex justify-end gap-2 pt-2">
            <button
              onClick={() => setOpenCompany(false)}
              className="h-10 px-4 rounded-lg border border-zinc-200 text-sm"
            >
              {t("brandDetailCancel")}
            </button>

            <button
              disabled={saving}
              onClick={saveVariables}
              className="h-10 px-5 rounded-lg bg-zinc-900 text-white text-sm font-semibold hover:bg-zinc-800 disabled:opacity-60"
            >
              {saving ? t("brandDetailSaving") : t("brandDetailSave")}
            </button>
          </div>
        </div>
      </Modal>
     </div>
  );
}