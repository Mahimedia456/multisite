import { useNavigate } from "react-router-dom";
import MIcon from "../components/MIcon";

const pages = [
  { id: "site-header", title: "Global Header", status: "live", icon: "dock_to_bottom", updated: "2 hours ago by Sarah M." },
  { id: "site-footer", title: "Global Footer", status: "live", icon: "dock_to_bottom", updated: "Oct 12, 2023" },
  { id: "home", title: "Home Page", status: "draft", icon: "home", updated: "15 mins ago by You" },
  { id: "about", title: "About Us", status: "live", icon: "info", updated: "Sep 28, 2023" },
  { id: "services", title: "Services", status: "live", icon: "medical_services", updated: "Oct 05, 2023" },
  { id: "contact", title: "Contact Us", status: "archived", icon: "mail", updated: "Aug 12, 2023" },
];

function StatusPill({ status }) {
  const map = {
    live: "bg-green-50 text-green-600 border-green-100",
    draft: "bg-amber-50 text-amber-600 border-amber-100",
    archived: "bg-zinc-50 text-zinc-500 border-zinc-100",
  };
  const label = status === "live" ? "LIVE" : status === "draft" ? "DRAFT" : "ARCHIVED";

  return (
    <span
      className={[
        "px-2 py-1 text-[10px] font-bold uppercase rounded border",
        map[status] || "bg-zinc-50 text-zinc-500 border-zinc-100",
      ].join(" ")}
    >
      {label}
    </span>
  );
}

export default function SitePages() {
  const navigate = useNavigate();

  return (
    <div className="max-w-7xl mx-auto space-y-10">
      {/* Header row */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <div className="text-sm font-semibold text-gray-500">Admin &nbsp;›&nbsp; Main Website</div>
          <h1 className="text-3xl font-extrabold text-gray-900 mt-2">Website Templates</h1>
          <p className="text-gray-500 text-sm mt-1">
            Manage and edit the core page components for the Holding Co. main website.
          </p>
        </div>

        <button
          className="h-11 px-5 rounded-2xl bg-violet-600 hover:bg-violet-700 text-white text-sm font-bold shadow-lg shadow-violet-500/20 transition inline-flex items-center gap-2"
          onClick={() => alert("Later: create new template")}
        >
          <MIcon name="add" className="text-[20px]" />
          New Template
        </button>
      </div>

      {/* Templates grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pages.map((t) => (
          <div
            key={t.id}
            className="rounded-3xl bg-white/70 backdrop-blur-md border border-[#efeaf6] shadow-sm p-6 hover:shadow-xl hover:-translate-y-1 transition-all"
          >
            <div className="flex items-start justify-between mb-6">
              <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center text-gray-600">
                <MIcon name={t.icon} className="text-[22px]" />
              </div>
              <StatusPill status={t.status} />
            </div>

            <h3 className="text-lg font-extrabold text-gray-900 mb-1">{t.title}</h3>
            <p className="text-xs text-gray-400 mb-6">Last Edited: {t.updated}</p>

            <div className="flex gap-3">
              <button
                className="flex-1 h-10 rounded-2xl bg-violet-600 text-white text-sm font-bold hover:bg-violet-700 transition"
                onClick={() => navigate(`/site/templates/${t.id}/builder`)}
              >
                Edit Template
              </button>

              <button
                className="w-11 h-10 rounded-2xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition inline-flex items-center justify-center"
                onClick={() => alert("Preview later")}
                title="Preview"
              >
                <MIcon name="visibility" className="text-[20px]" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
