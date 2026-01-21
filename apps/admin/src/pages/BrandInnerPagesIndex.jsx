import { useEffect, useMemo, useState } from "react";
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
    <span className={["px-2.5 py-1 rounded-full text-[11px] font-bold uppercase", map[tone]].join(" ")}>
      {children}
    </span>
  );
}

function StatusTag({ status }) {
  const s = String(status || "").toLowerCase();
  if (s === "published" || s === "live") return <Pill tone="green">Published</Pill>;
  if (s === "draft") return <Pill tone="amber">Draft</Pill>;
  return <Pill tone="gray">{status || "DRAFT"}</Pill>;
}

function formatModified(value) {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return String(value);
  return d.toLocaleString();
}

export default function BrandInnerPagesIndex() {
  const navigate = useNavigate();

  const [q, setQ] = useState("");
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  async function fetchPages(searchText) {
    setErr("");
    setLoading(true);
    try {
      // ✅ CHANGE THIS to match your backend route
      const url = `/admin/shared-pages?q=${encodeURIComponent((searchText || "").trim())}`;

      const res = await apiFetch(url);
      const json = await res.json().catch(() => null);

      if (!res.ok || !json?.ok) {
        throw new Error(json?.message || `Failed (${res.status})`);
      }

      setRows(Array.isArray(json.data) ? json.data : []);
    } catch (e) {
      setRows([]);
      setErr(e?.message || "Failed to fetch shared pages");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchPages("");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const t = setTimeout(() => fetchPages(q), 250);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q]);

  const list = useMemo(() => rows, [rows]);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-xs text-zinc-400">
            All Brands <span className="mx-2">›</span> Shared Pages
          </div>
          <h1 className="text-3xl font-extrabold text-zinc-900 mt-1">Shared Pages</h1>
          <p className="text-sm text-zinc-500 mt-1">Pages that apply to all brands (About, etc).</p>
          {err ? <div className="mt-3 text-sm text-red-600 font-semibold">{err}</div> : null}
        </div>
      </div>

      <div className="rounded-3xl bg-white/80 border border-zinc-200 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-zinc-200 flex items-center justify-between">
          <div className="text-xs font-extrabold tracking-widest text-zinc-400">ALL PAGES</div>

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
          {loading ? (
            <div className="px-6 py-10 text-center text-sm text-zinc-500">Loading...</div>
          ) : list.length === 0 ? (
            <div className="px-6 py-10 text-center text-sm text-zinc-500">No pages found.</div>
          ) : (
            list.map((p) => (
              <div
                key={p.id}
                className="px-6 py-4 grid grid-cols-[1fr,220px,220px,120px] items-center hover:bg-primary/5 transition cursor-pointer"
                onClick={() => navigate(`/brand-inner-pages/${p.id}`)}
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-zinc-100 flex items-center justify-center text-zinc-600">
                    <MIcon name="description" className="text-[18px]" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-zinc-900">{p.title || p.slug}</div>
                    <div className="text-xs text-zinc-400 mt-0.5">slug: {p.slug}</div>
                  </div>
                </div>

                <div><StatusTag status={p.status} /></div>
                <div className="text-sm text-zinc-500">{formatModified(p.modifiedAt || p.updatedAt)}</div>

                <div className="flex items-center justify-end gap-3 text-zinc-400">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/brand-inner-pages/${p.id}`);
                    }}
                    className="hover:text-zinc-700"
                    title="Manage sections"
                  >
                    <MIcon name="settings" className="text-[18px]" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="px-6 py-3 text-xs text-zinc-400 text-center">
          Showing {list.length} pages
        </div>
      </div>
    </div>
  );
}
