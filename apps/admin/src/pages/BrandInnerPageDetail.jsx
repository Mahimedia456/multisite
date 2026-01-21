import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import MIcon from "../components/MIcon";
import { apiFetch } from "../lib/auth";

function Badge({ text }) {
  const s = String(text || "").toLowerCase();
  const tone =
    s === "published" || s === "live" || s === "active"
      ? "bg-green-50 text-green-700"
      : "bg-amber-50 text-amber-700";
  return (
    <span className={["px-2.5 py-1 rounded-full text-[11px] font-bold uppercase", tone].join(" ")}>
      {text || "draft"}
    </span>
  );
}

function timeAgoOrDate(v) {
  if (!v) return "—";
  const d = new Date(v);
  if (Number.isNaN(d.getTime())) return String(v);
  return d.toLocaleString();
}

// Your page content shape can evolve; keeping it flexible:
const DEFAULT_PAGE_CONTENT = {
  sections: [
    { type: "Hero", props: { title: "About Us", subtitle: "Your story goes here." } },
    { type: "Content", props: { body: "Write your content..." } },
  ],
};

export default function BrandInnerPageDetail() {
  const { pageId } = useParams(); // route: /brand-inner-pages/:pageId
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const [page, setPage] = useState(null);
  const [versions, setVersions] = useState([]);
  const [activeVersionId, setActiveVersionId] = useState(null);

  const [data, setData] = useState(DEFAULT_PAGE_CONTENT);
  const [saving, setSaving] = useState(false);

  const pageTitle = useMemo(() => page?.title || page?.slug || "Page", [page]);

  async function loadVersions(pid) {
    const r = await apiFetch(`/admin/shared-pages/${pid}/versions?limit=50`);
    const j = await r.json().catch(() => null);
    if (!r.ok || !j?.ok) throw new Error(j?.message || "Failed to load versions");
    setVersions(Array.isArray(j.data) ? j.data : []);
    return j.data;
  }

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setErr("");
      try {
        if (!pageId) throw new Error("Missing pageId");

        const res = await apiFetch(`/admin/shared-pages/${pageId}`);
        const json = await res.json().catch(() => null);
        if (!res.ok || !json?.ok) throw new Error(json?.message || "Failed to load page");

        if (cancelled) return;

        setPage(json.data);

        const latest = json.data?.latestVersion;
        const base = DEFAULT_PAGE_CONTENT;

        if (latest?.content && typeof latest.content === "object") {
          setData({ ...base, ...latest.content });
          setActiveVersionId(latest.id || null);
        } else {
          setData(base);
          setActiveVersionId(null);
        }

        const v = await loadVersions(pageId);
        if (!cancelled && Array.isArray(v) && v.length && !activeVersionId) {
          setActiveVersionId(v[0].id);
        }
      } catch (e) {
        if (!cancelled) setErr(e?.message || "Failed to load");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageId]);

  async function applyVersion(v) {
    const base = DEFAULT_PAGE_CONTENT;
    setData({ ...base, ...(v?.content || {}) });
    setActiveVersionId(v?.id || null);
  }

  async function saveAsNewVersion(nextStatus) {
    setSaving(true);
    try {
      const res = await apiFetch(`/admin/shared-pages/${pageId}/versions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: data,
          status: nextStatus, // "published" optional
        }),
      });

      const json = await res.json().catch(() => null);
      if (!res.ok || !json?.ok) throw new Error(json?.message || "Failed to save version");

      const newList = await loadVersions(pageId);
      const latest = Array.isArray(newList) ? newList[0] : null;
      if (latest) await applyVersion(latest);

      alert(nextStatus ? `Saved & published` : "Saved new version");
    } catch (e) {
      alert(e?.message || "Save failed");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div className="max-w-7xl mx-auto py-10 text-zinc-500">Loading…</div>;

  if (err) {
    return (
      <div className="max-w-7xl mx-auto py-10">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">{err}</div>
        <div className="mt-4">
          <button
            onClick={() => navigate(`/brand-inner-pages`)}
            className="h-11 px-4 rounded-xl bg-white border border-zinc-200 text-sm font-bold text-zinc-700 hover:bg-zinc-50 flex items-center gap-2"
          >
            <MIcon name="arrow_back" className="text-[18px]" />
            Back
          </button>
        </div>
      </div>
    );
  }

  const status = page?.status || "draft";

  return (
    <div className="max-w-[1500px] mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="text-xs text-zinc-400">
            Shared Pages <span className="mx-2">›</span> {pageTitle}
          </div>
          <div className="flex items-center gap-3 mt-1">
            <h1 className="text-2xl font-extrabold text-zinc-900">{pageTitle}</h1>
            <Badge text={status} />
            <span className="text-xs text-zinc-400">
              page_id: <span className="font-mono">{page?.id}</span>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(`/brand-inner-pages`)}
            className="h-11 px-4 rounded-xl bg-white border border-zinc-200 text-sm font-bold text-zinc-700 hover:bg-zinc-50 flex items-center gap-2"
          >
            <MIcon name="arrow_back" className="text-[18px]" />
            Back
          </button>

          <button
            disabled={saving}
            onClick={() => saveAsNewVersion(undefined)}
            className={[
              "h-11 px-5 rounded-xl text-white text-sm font-extrabold",
              saving ? "bg-zinc-400" : "bg-zinc-900 hover:bg-zinc-800",
            ].join(" ")}
          >
            {saving ? "Saving…" : "Save Version"}
          </button>

          <button
            disabled={saving}
            onClick={() => saveAsNewVersion("published")}
            className={[
              "h-11 px-5 rounded-xl text-white text-sm font-extrabold shadow-lg shadow-primary/20",
              saving ? "bg-primary/40" : "bg-primary hover:bg-primary/90",
            ].join(" ")}
          >
            Publish
          </button>
        </div>
      </div>

      {/* Layout: Versions + Editor + Preview */}
      <div className="grid grid-cols-1 xl:grid-cols-[320px,540px,1fr] gap-6">
        {/* Left: versions */}
        <div className="rounded-3xl bg-white/80 border border-zinc-200 shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-zinc-200">
            <div className="text-sm font-extrabold text-zinc-900">Versions</div>
            <div className="text-xs text-zinc-500">Latest first</div>
          </div>

          <div className="divide-y divide-zinc-100">
            {versions.map((v) => {
              const active = v.id === activeVersionId;
              return (
                <button
                  key={v.id}
                  onClick={() => applyVersion(v)}
                  className={[
                    "w-full text-left px-5 py-4 hover:bg-primary/5 transition",
                    active ? "bg-primary/10" : "",
                  ].join(" ")}
                >
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-extrabold text-zinc-900">v{v.version}</div>
                    {active ? (
                      <span className="text-[11px] font-bold text-primary">ACTIVE</span>
                    ) : (
                      <span className="text-[11px] text-zinc-400"> </span>
                    )}
                  </div>
                  <div className="text-xs text-zinc-500 mt-1">{timeAgoOrDate(v.created_at)}</div>
                  <div className="text-[11px] text-zinc-400 mt-1 font-mono truncate">{v.id}</div>
                </button>
              );
            })}
            {!versions.length ? <div className="px-6 py-6 text-sm text-zinc-500">No versions yet.</div> : null}
          </div>
        </div>

        {/* Middle: editor (JSON textarea) */}
        <div className="rounded-3xl bg-white/80 border border-zinc-200 shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-zinc-200">
            <div className="text-sm font-extrabold text-zinc-900">Editor</div>
            <div className="text-xs text-zinc-500">Edit JSON sections</div>
          </div>

          <div className="p-5 space-y-4">
            <div>
              <label className="text-xs font-bold text-zinc-500">CONTENT JSON</label>
              <textarea
                value={JSON.stringify(data, null, 2)}
                onChange={(e) => {
                  try {
                    const next = JSON.parse(e.target.value);
                    setData(next);
                  } catch {
                    // keep typing; don't crash
                  }
                }}
                rows={22}
                className="mt-1 w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-[12px] font-mono outline-none focus:ring-2 focus:ring-primary/20"
              />
              <div className="text-[11px] text-zinc-400 mt-2">
                Tip: JSON invalid ho to save na karo. (Typing time pe ignore)
              </div>
            </div>
          </div>
        </div>

        {/* Right: Preview */}
        <div className="rounded-3xl bg-white/80 border border-zinc-200 shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-zinc-200">
            <div className="text-sm font-extrabold text-zinc-900">Preview</div>
            <div className="text-xs text-zinc-500">Simple wireframe preview</div>
          </div>

          <div className="p-8 bg-zinc-50 min-h-[640px]">
            <div className="max-w-[900px] mx-auto space-y-4">
              {(data.sections || []).map((s, idx) => (
                <div key={idx} className="rounded-3xl bg-white border border-zinc-200 p-6">
                  <div className="text-xs font-extrabold tracking-widest text-zinc-400">{s.type || "SECTION"}</div>
                  <pre className="mt-3 text-[12px] text-zinc-700 whitespace-pre-wrap break-words">
                    {JSON.stringify(s.props || {}, null, 2)}
                  </pre>
                </div>
              ))}
              {!data.sections?.length ? (
                <div className="text-sm text-zinc-500">No sections in this page.</div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
