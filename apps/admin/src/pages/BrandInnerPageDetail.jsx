import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import MIcon from "../components/MIcon";
import { INNER_PAGES, INNER_PAGE_SECTIONS } from "../data/innerPages";

function Pill({ children, tone = "gray" }) {
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

export default function BrandInnerPageDetail() {
  const navigate = useNavigate();
  const { brandId, pageId } = useParams();

  const page = INNER_PAGES.find((p) => p.id === pageId) || { id: pageId, name: pageId, status: "draft", modified: "-" };
  const sections = INNER_PAGE_SECTIONS[pageId] || [
    { id: "hero", name: "Hero", type: "HeroBlock", status: "draft" },
    { id: "content", name: "Content", type: "RichText", status: "draft" },
  ];

  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    return sections.filter((x) => !s || x.name.toLowerCase().includes(s) || x.type.toLowerCase().includes(s));
  }, [q, sections]);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="text-xs text-zinc-400">
            Brands <span className="mx-2">›</span> {brandId} <span className="mx-2">›</span> Inner Pages{" "}
            <span className="mx-2">›</span> {page.name}
          </div>

          <div className="flex items-center gap-3 mt-1">
            <h1 className="text-3xl font-extrabold text-zinc-900">{page.name}</h1>
            <StatusTag status={page.status} />
          </div>

          <p className="text-sm text-zinc-500 mt-2">
            Manage sections for this page. Sections will be visible in the frontend and editable from here.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(`/brands/${brandId}/pages`)}
            className="h-11 px-4 rounded-xl bg-white border border-zinc-200 text-sm font-bold text-zinc-700 hover:bg-zinc-50 flex items-center gap-2"
          >
            <MIcon name="arrow_back" className="text-[18px]" />
            Back
          </button>

          <button className="h-11 px-5 rounded-xl bg-primary text-white text-sm font-extrabold shadow-lg shadow-primary/20 hover:bg-primary/90 flex items-center gap-2">
            <MIcon name="add" className="text-[18px]" />
            Add Section
          </button>
        </div>
      </div>

      {/* Sections table */}
      <div className="rounded-3xl bg-white/80 border border-zinc-200 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-zinc-200 flex items-center justify-between">
          <div className="text-xs font-extrabold tracking-widest text-zinc-400">
            PAGE SECTIONS
          </div>

          <div className="relative w-72">
            <MIcon name="search" className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 text-[18px]" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="w-full bg-zinc-100 border-none rounded-full pl-9 pr-4 py-2 text-sm focus:ring-2 focus:ring-primary/20 outline-none"
              placeholder="Search sections..."
            />
          </div>
        </div>

        <div className="grid grid-cols-[1fr,240px,180px,120px] px-6 py-3 text-[11px] font-extrabold tracking-widest text-zinc-400 border-b border-zinc-100">
          <div>SECTION</div>
          <div>TYPE</div>
          <div>STATUS</div>
          <div className="text-right">ACTIONS</div>
        </div>

        <div className="divide-y divide-zinc-100">
          {filtered.map((s) => (
            <div
              key={s.id}
              className="px-6 py-4 grid grid-cols-[1fr,240px,180px,120px] items-center hover:bg-primary/5 transition cursor-pointer"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-zinc-100 flex items-center justify-center text-zinc-600">
                  <MIcon name="view_quilt" className="text-[18px]" />
                </div>
                <div className="text-sm font-bold text-zinc-900">{s.name}</div>
              </div>

              <div className="text-sm text-zinc-500">{s.type}</div>

              <div>
                <StatusTag status={s.status} />
              </div>

              <div className="flex items-center justify-end gap-3 text-zinc-400">
                <button onClick={(e) => e.stopPropagation()} className="hover:text-zinc-700" title="Edit">
                  <MIcon name="edit" className="text-[18px]" />
                </button>
                <button onClick={(e) => e.stopPropagation()} className="hover:text-zinc-700" title="Reorder">
                  <MIcon name="drag_indicator" className="text-[18px]" />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="px-6 py-3 text-xs text-zinc-400 text-center">
          Showing {filtered.length} sections for {page.name}
        </div>
      </div>
    </div>
  );
}
