import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import MIcon from "../components/MIcon";

const BRAND_DB = {
  aamir: {
    name: "Aamir PetCare",
    accent: "#008080",
    logoIcon: "pets",
    typography: { name: "Inter + Playfair", desc: "Sans & Serif Pairing" },
    logoFile: { name: "petcare_full.svg", meta: "2.4 MB · Optimized" },
    templates: [
      {
        id: "header",
        title: "Global Header",
        status: "live",
        icon: "dock_to_bottom",
        edited: "2 hours ago by Sarah M.",
      },
      {
        id: "footer",
        title: "Global Footer",
        status: "live",
        icon: "dock_to_bottom",
        edited: "Oct 12, 2023",
      },
      {
        id: "home",
        title: "Home Page",
        status: "draft",
        icon: "home",
        edited: "15 mins ago by You",
      },
      // extra (kept in DB for later)
      { id: "about", title: "About Us", status: "live", icon: "info", edited: "Sep 28, 2023" },
      { id: "services", title: "Services", status: "live", icon: "medical_services", edited: "Oct 05, 2023" },
      { id: "contact", title: "Contact Us", status: "archived", icon: "mail", edited: "Aug 12, 2023" },
    ],
  },

  umair: {
    name: "Umair Trust Life",
    accent: "#2563eb",
    logoIcon: "favorite",
    typography: { name: "Inter + DM Serif", desc: "Modern Pairing" },
    logoFile: { name: "trustlife_full.svg", meta: "1.8 MB · Optimized" },
    templates: [
      {
        id: "header",
        title: "Global Header",
        status: "live",
        icon: "dock_to_bottom",
        edited: "1 day ago by Umair",
      },
      {
        id: "footer",
        title: "Global Footer",
        status: "live",
        icon: "dock_to_bottom",
        edited: "Oct 10, 2023",
      },
      {
        id: "home",
        title: "Home Page",
        status: "live",
        icon: "home",
        edited: "Oct 12, 2023",
      },
      // extra (kept in DB for later)
      { id: "about", title: "About Us", status: "draft", icon: "info", edited: "Dec 01, 2023" },
      { id: "services", title: "Services", status: "live", icon: "medical_services", edited: "Oct 05, 2023" },
      { id: "contact", title: "Contact Us", status: "archived", icon: "mail", edited: "Aug 12, 2023" },
    ],
  },
};

function StatusBadge({ status }) {
  const map = {
    live: "bg-green-50 text-green-600 border-green-100",
    draft: "bg-amber-50 text-amber-600 border-amber-100",
    archived: "bg-zinc-50 text-zinc-500 border-zinc-100",
  };

  const label =
    status === "live" ? "LIVE" : status === "draft" ? "DRAFT" : "ARCHIVED";

  return (
    <span
      className={[
        "px-2 py-1 text-[10px] font-bold uppercase rounded border",
        map[status] || map.archived,
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
      <p className="text-xs text-zinc-400 mb-6">Last Edited: {t.edited}</p>

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

export default function BrandDetail() {
  const navigate = useNavigate();
  const { brandId } = useParams();

  const brand = BRAND_DB[brandId] || BRAND_DB.aamir;

  const style = useMemo(
    () => ({ ["--brand-accent"]: brand.accent }),
    [brand.accent]
  );

  // ✅ only show header/footer/home in cards
  const topTemplates = brand.templates.filter((t) =>
    ["header", "footer", "home"].includes(t.id)
  );

  return (
    <div style={style} className="max-w-7xl mx-auto space-y-12">
      {/* Website Templates */}
      <section>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-zinc-900">
              Website Templates
            </h2>
            <p className="text-zinc-500 text-sm">
              Manage and edit the core page components for {brand.name}.
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

        {/* ✅ ONLY 3 cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {topTemplates.map((t) => (
            <TemplateCard
              key={t.id}
              t={t}
              onEdit={() =>
                navigate(`/brands/${brandId}/templates/${t.id}/builder`)
              }
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
            Global style overrides that populate into all templates for{" "}
            {brand.name}.
          </p>
        </div>

        <div className="bg-white rounded-xl border border-zinc-200 overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 divide-y md:divide-y-0 md:divide-x border-b border-zinc-100">
            {/* Accent */}
            <div className="p-6">
              <label className="block text-xs font-bold text-zinc-400 uppercase tracking-widest mb-4">
                Primary Accent Color
              </label>
              <div className="flex items-center gap-4">
                <div
                  className="w-12 h-12 rounded-full border-4 border-white shadow-sm ring-1 ring-zinc-200"
                  style={{ background: "var(--brand-accent)" }}
                />
                <div className="flex-1">
                  <div className="text-sm font-semibold text-zinc-900">
                    Brand Accent
                  </div>
                  <div className="text-xs text-zinc-500">{brand.accent}</div>
                </div>
                <button className="text-primary text-xs font-bold hover:underline">
                  Change
                </button>
              </div>
            </div>

            {/* Typography */}
            <div className="p-6">
              <label className="block text-xs font-bold text-zinc-400 uppercase tracking-widest mb-4">
                Typography Set
              </label>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-zinc-50 rounded-lg flex items-center justify-center font-serif text-xl font-bold text-zinc-700">
                  Aa
                </div>
                <div className="flex-1">
                  <div className="text-sm font-semibold text-zinc-900">
                    {brand.typography.name}
                  </div>
                  <div className="text-xs text-zinc-500">
                    {brand.typography.desc}
                  </div>
                </div>
                <button className="text-primary text-xs font-bold hover:underline">
                  Edit
                </button>
              </div>
            </div>

            {/* Logo */}
            <div className="p-6">
              <label className="block text-xs font-bold text-zinc-400 uppercase tracking-widest mb-4">
                Logo Variant
              </label>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-zinc-50 rounded-lg flex items-center justify-center">
                  <MIcon
                    name={brand.logoIcon}
                    className="text-zinc-700 text-[22px]"
                  />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-semibold text-zinc-900">
                    {brand.logoFile.name}
                  </div>
                  <div className="text-xs text-zinc-500">
                    {brand.logoFile.meta}
                  </div>
                </div>
                <button className="text-primary text-xs font-bold hover:underline">
                  Replace
                </button>
              </div>
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
