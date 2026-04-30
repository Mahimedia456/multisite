import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import MIcon from "../components/MIcon";

const BRAND_DB = {
  aamir: { name: "Aamir PetCare", status: "ACTIVE" },
  umair: { name: "Umair Trust Life", status: "ACTIVE" },
};

const TEMPLATE_DEFS = [
  {
    id: "global-header",
    nameKey: "brandTemplatesGlobalHeader",
    icon: "dock_to_bottom",
    status: "published",
    modified: "Oct 24, 2023 10:45 AM",
  },
  {
    id: "global-footer",
    nameKey: "brandTemplatesGlobalFooter",
    icon: "dock_to_bottom",
    status: "published",
    modified: "Oct 24, 2023 10:45 AM",
  },
  {
    id: "home",
    nameKey: "brandTemplatesHomePage",
    icon: "home",
    status: "published",
    modified: "Nov 02, 2023 03:12 PM",
  },
  {
    id: "about",
    nameKey: "brandTemplatesAboutUs",
    icon: "info",
    status: "draft",
    modifiedKey: "brandTemplatesYesterday",
  },
  {
    id: "services",
    nameKey: "brandTemplatesServices",
    icon: "medical_services",
    status: "published",
    modified: "Oct 29, 2023 09:00 AM",
  },
  {
    id: "contact",
    nameKey: "brandTemplatesContact",
    icon: "mail",
    status: "published",
    modified: "Oct 25, 2023 04:20 PM",
  },
  {
    id: "claims",
    nameKey: "brandTemplatesClaimsPortal",
    icon: "description",
    status: "draft",
    modified: "Nov 01, 2023 10:15 AM",
  },
];

function Pill({ children, tone = "green" }) {
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

  if (s === "published") {
    return <Pill tone="green">{t("brandTemplatesPublished")}</Pill>;
  }

  if (s === "draft") {
    return <Pill tone="amber">{t("brandTemplatesDraft")}</Pill>;
  }

  return <Pill tone="gray">{status}</Pill>;
}

function OverviewCard({ icon, title, value, sub }) {
  return (
    <div className="flex items-center gap-4">
      <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
        <MIcon name={icon} className="text-[22px]" />
      </div>

      <div>
        <div className="text-xs text-zinc-500">{title}</div>
        <div className="text-sm font-bold text-zinc-900">{value}</div>
        <div className="text-xs text-zinc-400">{sub}</div>
      </div>
    </div>
  );
}

function TemplatePreviewDrawer({ open, template, onClose, onEdit, t }) {
  return (
    <div
      className={[
        "fixed top-0 right-0 h-screen w-[380px] bg-white border-l border-zinc-200 shadow-xl z-50 transition-transform",
        open ? "translate-x-0" : "translate-x-full",
      ].join(" ")}
    >
      <div className="h-16 px-6 border-b border-zinc-200 flex items-center justify-between">
        <div>
          <div className="text-sm font-extrabold text-zinc-900">
            {t("brandTemplatesPreviewTitle")}
          </div>

          <div className="text-xs text-zinc-500">
            {template?.name} (
            {template?.status === "published"
              ? t("brandTemplatesPublished")
              : t("brandTemplatesDraft")}
            )
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-9 h-9 rounded-full hover:bg-zinc-100 flex items-center justify-center text-zinc-500"
        >
          <MIcon name="close" className="text-[20px]" />
        </button>
      </div>

      <div className="p-6">
        <div className="flex justify-center gap-3 mb-4">
          <button className="w-10 h-10 rounded-xl border border-zinc-200 bg-white flex items-center justify-center text-zinc-600">
            <MIcon name="desktop_windows" className="text-[20px]" />
          </button>

          <button className="w-10 h-10 rounded-xl border border-zinc-200 bg-white flex items-center justify-center text-zinc-600">
            <MIcon name="smartphone" className="text-[20px]" />
          </button>
        </div>

        <div className="rounded-2xl border border-zinc-200 bg-zinc-50 h-[520px] overflow-hidden relative">
          <div className="p-5 space-y-4">
            <div className="h-4 w-20 bg-zinc-200/70 rounded-full" />
            <div className="h-10 w-full bg-primary/10 rounded-2xl" />
            <div className="h-44 w-full bg-white rounded-2xl" />
            <div className="h-3 w-3/4 bg-zinc-200/60 rounded-full" />
            <div className="h-3 w-2/3 bg-zinc-200/60 rounded-full" />
            <div className="h-3 w-1/2 bg-zinc-200/60 rounded-full" />

            <div className="flex justify-center pt-6">
              <div className="w-28 h-28 bg-zinc-200/70 rounded-3xl rotate-12" />
            </div>
          </div>
        </div>

        <button
          onClick={onEdit}
          className="mt-6 w-full h-12 rounded-2xl bg-primary text-white font-extrabold shadow-lg shadow-primary/20 hover:bg-primary/90 transition flex items-center justify-center gap-2"
        >
          <MIcon name="edit" className="text-[18px]" />
          {t("brandTemplatesEditBuilder")}
        </button>
      </div>
    </div>
  );
}

export default function BrandTemplates() {
  const { brandId } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const brand = BRAND_DB[brandId] || BRAND_DB.aamir;

  const templates = useMemo(
    () =>
      TEMPLATE_DEFS.map((template) => ({
        ...template,
        name: t(template.nameKey),
        modified: template.modifiedKey ? t(template.modifiedKey) : template.modified,
      })),
    [t]
  );

  const [q, setQ] = useState("");
  const [selected, setSelected] = useState(templates[2]);

  const list = useMemo(() => {
    const search = q.trim().toLowerCase();

    return templates.filter(
      (template) => !search || template.name.toLowerCase().includes(search)
    );
  }, [q, templates]);

  const selectedTemplate =
    selected && templates.find((template) => template.id === selected.id)
      ? templates.find((template) => template.id === selected.id)
      : selected;

  return (
    <div className="relative">
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="text-xs text-zinc-400">
            {t("brandTemplatesBrands")} <span className="mx-2">›</span>{" "}
            {brand.name}
          </div>

          <div className="flex items-center gap-3 mt-1">
            <h1 className="text-3xl font-extrabold text-zinc-900">
              {brand.name}
            </h1>

            <Pill tone="green">{brand.status}</Pill>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button className="h-11 px-4 rounded-xl bg-white border border-zinc-200 text-sm font-bold text-zinc-700 hover:bg-zinc-50 flex items-center gap-2">
            <MIcon name="open_in_new" className="text-[18px]" />
            {t("brandTemplatesVisitSite")}
          </button>

          <button className="h-11 px-5 rounded-xl bg-primary text-white text-sm font-extrabold shadow-lg shadow-primary/20 hover:bg-primary/90 flex items-center gap-2">
            <MIcon name="add" className="text-[18px]" />
            {t("brandTemplatesNewTemplate")}
          </button>
        </div>
      </div>

      <div className="rounded-3xl bg-white/80 border border-zinc-200 shadow-sm p-6 mb-6">
        <div className="text-xs font-extrabold tracking-widest text-zinc-400 mb-4">
          {t("brandTemplatesBrandOverview")}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <OverviewCard
            icon="rocket_launch"
            title={t("brandTemplatesDeploymentStatus")}
            value={t("brandTemplatesProductionReady")}
            sub={t("brandTemplatesLastSynced")}
          />

          <OverviewCard
            icon="language"
            title={t("brandTemplatesPrimaryDomain")}
            value="insuranceco.com/aamir"
            sub={t("brandTemplatesSslActive")}
          />

          <OverviewCard
            icon="palette"
            title={t("brandTemplatesActiveTheme")}
            value={
              <span className="inline-flex items-center gap-2">
                {t("brandTemplatesSyncedGlobal")}{" "}
                <span className="w-2 h-2 rounded-full bg-primary inline-block" />
              </span>
            }
            sub={t("brandTemplatesThemeVersion")}
          />
        </div>
      </div>

      <div className="rounded-3xl bg-white/80 border border-zinc-200 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-zinc-200 flex items-center justify-between">
          <div className="text-xs font-extrabold tracking-widest text-zinc-400">
            {t("brandTemplatesPageTemplates")}
          </div>

          <div className="flex items-center gap-3">
            <div className="relative w-64">
              <MIcon
                name="search"
                className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 text-[18px]"
              />

              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                className="w-full bg-zinc-100 border-none rounded-full pl-9 pr-4 py-2 text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                placeholder={t("brandTemplatesSearchPlaceholder")}
              />
            </div>

            <button className="w-9 h-9 rounded-full hover:bg-zinc-100 flex items-center justify-center text-zinc-500">
              <MIcon name="tune" className="text-[18px]" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-[1fr,180px,220px,120px] px-6 py-3 text-[11px] font-extrabold tracking-widest text-zinc-400 border-b border-zinc-100">
          <div>{t("brandTemplatesTemplateName")}</div>
          <div>{t("brandTemplatesStatus")}</div>
          <div>{t("brandTemplatesLastModified")}</div>
          <div className="text-right">{t("brandTemplatesActions")}</div>
        </div>

        <div className="divide-y divide-zinc-100">
          {list.map((template) => (
            <div
              key={template.id}
              className="px-6 py-4 grid grid-cols-[1fr,180px,220px,120px] items-center hover:bg-primary/5 transition cursor-pointer"
              onClick={() => setSelected(template)}
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-zinc-100 flex items-center justify-center text-zinc-600">
                  <MIcon name={template.icon} className="text-[18px]" />
                </div>

                <div className="text-sm font-bold text-zinc-900">
                  {template.name}
                </div>
              </div>

              <div>
                <StatusTag status={template.status} t={t} />
              </div>

              <div className="text-sm text-zinc-500">{template.modified}</div>

              <div className="flex items-center justify-end gap-3 text-zinc-400">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelected(template);
                  }}
                  className="hover:text-zinc-700"
                  title={t("brandTemplatesPreview")}
                >
                  <MIcon name="visibility" className="text-[18px]" />
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/brands/${brandId}/templates/${template.id}/builder`);
                  }}
                  className="hover:text-zinc-700"
                  title={t("brandTemplatesEdit")}
                >
                  <MIcon name="settings" className="text-[18px]" />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="px-6 py-3 text-xs text-zinc-400 text-center">
          {t("brandTemplatesShowing", {
            count: list.length,
            brand: brand.name,
          })}
        </div>
      </div>

      <TemplatePreviewDrawer
        open={!!selectedTemplate}
        template={selectedTemplate}
        t={t}
        onClose={() => setSelected(null)}
        onEdit={() =>
          navigate(`/brands/${brandId}/templates/${selectedTemplate.id}/builder`)
        }
      />
    </div>
  );
}