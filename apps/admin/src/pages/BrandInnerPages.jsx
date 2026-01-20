import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import MIcon from "../components/MIcon";
import { INNER_PAGES } from "../data/innerPages";

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

export default function BrandInnerPages() {
  const navigate = useNavigate();
  const { brandId } = useParams();

  const [q, setQ] = useState("");

  const list = useMemo(() => {
    const s = q.trim().toLowerCase();
    return INNER_PAGES.filter((p) => !s || p.name.toLowerCase().includes(s));
  }, [q]);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="text-xs text-zinc-400">
            Brands <span className="mx-2">›</span> {brandId} <span className="mx-2">›</span> Inner Pages
          </div>
          <h1 className="text-3xl font-extrabold text-zinc-900 mt-1">Inner Pages</h1>
          <p className="text-sm text-zinc-500 mt-1">
            All pages for this brand (20–30 pages). Click any page to manage its sections.
          </p>
        </div>

        <button className="h-11 px-5 rounded-xl bg-primary text-white text-sm font-extrabold shadow-lg shadow-primary/20 hover:bg-primary/90 flex items-center gap-2">
          <MIcon name="add" className="text-[18px]" />
          Add New Page
        </button>
      </div>

      {/* table */}
      <div className="rounded-3xl bg-white/80 border border-zinc-200 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-zinc-200 flex items-center justify-between">
          <div className="text-xs font-extrabold tracking-widest text-zinc-400">
            ALL PAGES
          </div>

          <div className="relative w-72">
            <MIcon name="search" className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 text-[18px]" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="w-full bg-zinc-100 border-none rounded-full pl-9 pr-4 py-2 text-sm focus:ring-2 focus:ring-primary/20 outline-none"
              placeholder="Search pages..."
            />
          </div>
        </div>

        <div className="grid grid-cols-[1fr,220px,220px,120px] px-6 py-3 text-[11px] font-extrabold tracking-widest text-zinc-400 border-b border-zinc-100">
          <div>PAGE NAME</div>
          <div>STATUS</div>
          <div>LAST MODIFIED</div>
          <div className="text-right">ACTIONS</div>
        </div>

        <div className="divide-y divide-zinc-100">
          {list.map((p) => (
            <div
              key={p.id}
              className="px-6 py-4 grid grid-cols-[1fr,220px,220px,120px] items-center hover:bg-primary/5 transition cursor-pointer"
              onClick={() => navigate(`/brands/${brandId}/pages/${p.id}`)}
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-zinc-100 flex items-center justify-center text-zinc-600">
                  <MIcon name="description" className="text-[18px]" />
                </div>
                <div className="text-sm font-bold text-zinc-900">{p.name}</div>
              </div>

              <div>
                <StatusTag status={p.status} />
              </div>

              <div className="text-sm text-zinc-500">{p.modified}</div>

              <div className="flex items-center justify-end gap-3 text-zinc-400">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/brands/${brandId}/pages/${p.id}`);
                  }}
                  className="hover:text-zinc-700"
                  title="Manage sections"
                >
                  <MIcon name="settings" className="text-[18px]" />
                </button>

                <button
                  onClick={(e) => e.stopPropagation()}
                  className="hover:text-zinc-700"
                  title="Duplicate"
                >
                  <MIcon name="content_copy" className="text-[18px]" />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="px-6 py-3 text-xs text-zinc-400 text-center">
          Showing {list.length} pages for brand: {brandId}
        </div>
      </div>
    </div>
  );
}
