import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import MIcon from "../components/MIcon";

const BRAND_DB = {
  aamir: { name: "Aamir PetCare", status: "ACTIVE" },
  umair: { name: "Umair Trust Life", status: "ACTIVE" },
};

const TEMPLATES = [
  { id: "global-header", name: "Global Header", icon: "dock_to_bottom", status: "published", modified: "Oct 24, 2023 10:45 AM" },
  { id: "global-footer", name: "Global Footer", icon: "dock_to_bottom", status: "published", modified: "Oct 24, 2023 10:45 AM" },
  { id: "home", name: "Home Page", icon: "home", status: "published", modified: "Nov 02, 2023 03:12 PM" },
  { id: "about", name: "About Us", icon: "info", status: "draft", modified: "Yesterday, 11:30 AM" },
  { id: "services", name: "Services", icon: "medical_services", status: "published", modified: "Oct 29, 2023 09:00 AM" },
  { id: "contact", name: "Contact", icon: "mail", status: "published", modified: "Oct 25, 2023 04:20 PM" },
  { id: "claims", name: "Claims Portal", icon: "description", status: "draft", modified: "Nov 01, 2023 10:15 AM" },
];

function Pill({ children, tone = "green" }) {
  const map = {
    green: "bg-green-50 text-green-700",
    amber: "bg-amber-50 text-amber-700",
    gray: "bg-zinc-100 text-zinc-600",
    purple: "bg-primary/10 text-primary",
  };
  return (
    <span className={["px-2.5 py-1 rounded-full text-[11px] font-bold uppercase", map[tone]].join(" ")}>
      {children}
    </span>
  );
}

function StatusTag({ status }) {
  const s = status.toLowerCase();
  if (s === "published") return <Pill tone="green">Published</Pill>;
  if (s === "draft") return <Pill tone="amber">Draft</Pill>;
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

function TemplatePreviewDrawer({ open, template, onClose, onEdit }) {
  return (
    <div
      className={[
        "fixed top-0 right-0 h-screen w-[380px] bg-white border-l border-zinc-200 shadow-xl z-50 transition-transform",
        open ? "translate-x-0" : "translate-x-full",
      ].join(" ")}
    >
      <div className="h-16 px-6 border-b border-zinc-200 flex items-center justify-between">
        <div>
          <div className="text-sm font-extrabold text-zinc-900">Template Preview</div>
          <div className="text-xs text-zinc-500">{template?.name} ({template?.status === "published" ? "Published" : "Draft"})</div>
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
          {/* simple skeleton preview like screenshot */}
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
          Edit in Builder
        </button>
      </div>
    </div>
  );
}

export default function BrandTemplates() {
const { brandId } = useParams();
  const brand = BRAND_DB[brandId] || BRAND_DB.aamir;
  const navigate = useNavigate();

  const [q, setQ] = useState("");
  const [selected, setSelected] = useState(TEMPLATES[2]); // Home default

  const list = useMemo(() => {
    const s = q.trim().toLowerCase();
    return TEMPLATES.filter((t) => !s || t.name.toLowerCase().includes(s));
  }, [q]);

  return (
    <div className="relative">
      {/* page header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="text-xs text-zinc-400">
            Brands <span className="mx-2">›</span> {brand.name}
          </div>
          <div className="flex items-center gap-3 mt-1">
            <h1 className="text-3xl font-extrabold text-zinc-900">{brand.name}</h1>
            <Pill tone="green">{brand.status}</Pill>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button className="h-11 px-4 rounded-xl bg-white border border-zinc-200 text-sm font-bold text-zinc-700 hover:bg-zinc-50 flex items-center gap-2">
            <MIcon name="open_in_new" className="text-[18px]" />
            Visit Site
          </button>

          <button className="h-11 px-5 rounded-xl bg-primary text-white text-sm font-extrabold shadow-lg shadow-primary/20 hover:bg-primary/90 flex items-center gap-2">
            <MIcon name="add" className="text-[18px]" />
            New Template
          </button>
        </div>
      </div>

      {/* Brand Overview card */}
      <div className="rounded-3xl bg-white/80 border border-zinc-200 shadow-sm p-6 mb-6">
        <div className="text-xs font-extrabold tracking-widest text-zinc-400 mb-4">
          BRAND OVERVIEW
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <OverviewCard
            icon="rocket_launch"
            title="Deployment Status"
            value="Production Ready"
            sub="Last synced 2h ago"
          />
          <OverviewCard
            icon="language"
            title="Primary Domain"
            value="insuranceco.com/aamir"
            sub="SSL Certificate Active"
          />
          <OverviewCard
            icon="palette"
            title="Active Theme"
            value={
              <span className="inline-flex items-center gap-2">
                Synced with Global <span className="w-2 h-2 rounded-full bg-primary inline-block" />
              </span>
            }
            sub="V2.4.0 High-Contrast"
          />
        </div>
      </div>

      {/* Templates table */}
      <div className="rounded-3xl bg-white/80 border border-zinc-200 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-zinc-200 flex items-center justify-between">
          <div className="text-xs font-extrabold tracking-widest text-zinc-400">
            PAGE TEMPLATES
          </div>

          <div className="flex items-center gap-3">
            <div className="relative w-64">
              <MIcon name="search" className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 text-[18px]" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                className="w-full bg-zinc-100 border-none rounded-full pl-9 pr-4 py-2 text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                placeholder="Search templates..."
              />
            </div>
            <button className="w-9 h-9 rounded-full hover:bg-zinc-100 flex items-center justify-center text-zinc-500">
              <MIcon name="tune" className="text-[18px]" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-[1fr,180px,220px,120px] px-6 py-3 text-[11px] font-extrabold tracking-widest text-zinc-400 border-b border-zinc-100">
          <div>TEMPLATE NAME</div>
          <div>STATUS</div>
          <div>LAST MODIFIED</div>
          <div className="text-right">ACTIONS</div>
        </div>

        <div className="divide-y divide-zinc-100">
          {list.map((t) => (
            <div
              key={t.id}
              className="px-6 py-4 grid grid-cols-[1fr,180px,220px,120px] items-center hover:bg-primary/5 transition cursor-pointer"
              onClick={() => setSelected(t)}
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-zinc-100 flex items-center justify-center text-zinc-600">
                  <MIcon name={t.icon} className="text-[18px]" />
                </div>
                <div className="text-sm font-bold text-zinc-900">{t.name}</div>
              </div>

              <div>
                <StatusTag status={t.status} />
              </div>

              <div className="text-sm text-zinc-500">{t.modified}</div>

              <div className="flex items-center justify-end gap-3 text-zinc-400">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelected(t);
                  }}
                  className="hover:text-zinc-700"
                  title="Preview"
                >
                  <MIcon name="visibility" className="text-[18px]" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/brands/${brandId}/templates/${t.id}/builder`);
                  }}
                  className="hover:text-zinc-700"
                  title="Edit"
                >
                  <MIcon name="settings" className="text-[18px]" />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="px-6 py-3 text-xs text-zinc-400 text-center">
          Showing {list.length} templates for {brand.name}
        </div>
      </div>

      {/* Right preview drawer */}
      <TemplatePreviewDrawer
        open={!!selected}
        template={selected}
        onClose={() => setSelected(null)}
        onEdit={() => navigate(`/brands/${brandId}/templates/${selected.id}/builder`)}
      />
    </div>
  );
}
