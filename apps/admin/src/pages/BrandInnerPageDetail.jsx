// admin/src/pages/BrandInnerPageDetail.jsx
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import MIcon from "../components/MIcon";
import { apiFetch } from "../lib/auth";

/* =========================
   UI bits
========================= */
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

function move(arr, from, to) {
  const next = [...arr];
  const item = next.splice(from, 1)[0];
  next.splice(to, 0, item);
  return next;
}

function Field({ field, value, onChange }) {
  if (field.kind === "textarea") {
    return (
      <div>
        <label className="text-xs font-bold text-zinc-500">{field.label}</label>
        <textarea
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value)}
          rows={4}
          className="mt-1 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20"
        />
      </div>
    );
  }

  if (field.kind === "list") {
    const list = Array.isArray(value) ? value : [];
    return (
      <div>
        <label className="text-xs font-bold text-zinc-500">{field.label}</label>

        <div className="mt-2 space-y-2">
          {list.map((item, idx) => (
            <div key={idx} className="flex gap-2">
              <input
                value={item ?? ""}
                onChange={(e) => {
                  const next = [...list];
                  next[idx] = e.target.value;
                  onChange(next);
                }}
                className="flex-1 rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20"
                placeholder="Item..."
              />
              <button
                type="button"
                className="w-10 h-10 rounded-xl border border-zinc-200 bg-white hover:bg-zinc-50 flex items-center justify-center text-zinc-500"
                onClick={() => onChange(list.filter((_, i) => i !== idx))}
                title="Remove item"
              >
                <MIcon name="close" className="text-[18px]" />
              </button>
            </div>
          ))}

          <button
            type="button"
            className="h-10 px-4 rounded-xl bg-primary/10 text-primary text-xs font-extrabold hover:bg-primary/15 flex items-center gap-2"
            onClick={() => onChange([...list, "New item"])}
          >
            <MIcon name="add" className="text-[16px]" />
            Add item
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <label className="text-xs font-bold text-zinc-500">{field.label}</label>
      <input
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20"
        placeholder={field.placeholder || ""}
      />
    </div>
  );
}

/* =========================
   Section registry
========================= */
const SECTION_DEFS = {
  Hero: {
    label: "Hero",
    fields: [
      { key: "title", label: "Title", kind: "text", placeholder: "Built on trust." },
      { key: "subtitle", label: "Subtitle", kind: "textarea" },
      { key: "highlight", label: "Highlight", kind: "text", placeholder: "Focused on what matters." },
      { key: "bgImage", label: "Background Image URL", kind: "text", placeholder: "https://..." },
    ],
    defaults: {
      title: "Built on trust.",
      subtitle: "Experience premium insurance solutions tailored for your modern family life.",
      highlight: "Focused on what matters.",
      bgImage: "",
    },
  },

  OurStory: {
    label: "Our Story",
    fields: [
      { key: "kicker", label: "Kicker", kind: "text", placeholder: "Our Heritage" },
      { key: "headline", label: "Headline", kind: "text", placeholder: "Founded with Purpose" },
      { key: "body", label: "Body", kind: "textarea" },
      { key: "timeline", label: "Timeline Items", kind: "list" },
    ],
    defaults: {
      kicker: "Our Heritage",
      headline: "Founded with Purpose",
      body: "Write your story...",
      timeline: [],
    },
  },

  MissionVision: {
    label: "Mission & Vision",
    fields: [
      { key: "visionTitle", label: "Vision Title", kind: "text", placeholder: "Our Vision" },
      { key: "visionBody", label: "Vision Body", kind: "textarea" },
      { key: "missionTitle", label: "Mission Title", kind: "text", placeholder: "Our Mission" },
      { key: "missionBody", label: "Mission Body", kind: "textarea" },
    ],
    defaults: {
      visionTitle: "Our Vision",
      visionBody: "Become the most trusted global insurance holding.",
      missionTitle: "Our Mission",
      missionBody: "Empower families through transparent, innovative insurance.",
    },
  },
};

/* =========================
   Previews
========================= */
function HeroPreview({ title, subtitle, highlight, bgImage }) {
  return (
    <div className="rounded-3xl overflow-hidden border border-zinc-200 bg-white">
      {bgImage ? (
        <div
          className="h-48 bg-zinc-100"
          style={{ backgroundImage: `url(${bgImage})`, backgroundSize: "cover", backgroundPosition: "center" }}
        />
      ) : (
        <div className="h-20 bg-zinc-100" />
      )}
      <div className="p-6">
        <div className="text-2xl font-extrabold text-zinc-900">{title || "Hero title..."}</div>
        {highlight ? <div className="mt-2 text-sm font-bold text-primary">{highlight}</div> : null}
        {subtitle ? <p className="mt-2 text-sm text-zinc-600 leading-relaxed">{subtitle}</p> : null}
      </div>
    </div>
  );
}

function OurStoryPreview({ kicker, headline, body, timeline }) {
  const list = Array.isArray(timeline) ? timeline : [];
  return (
    <div className="rounded-3xl border border-zinc-200 bg-white p-6">
      {kicker ? <div className="text-xs font-extrabold tracking-widest text-zinc-400">{kicker}</div> : null}
      <div className="mt-1 text-xl font-extrabold text-zinc-900">{headline || "Our story..."}</div>
      {body ? <p className="mt-3 text-sm text-zinc-600 leading-relaxed">{body}</p> : null}

      {list.length ? (
        <div className="mt-4 space-y-2">
          {list.map((t, i) => (
            <div key={i} className="text-sm text-zinc-600 flex items-start gap-2">
              <span className="mt-1 w-2 h-2 rounded-full bg-zinc-300" />
              <span>{t}</span>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function MissionVisionPreview({ visionTitle, visionBody, missionTitle, missionBody }) {
  return (
    <div className="rounded-3xl border border-zinc-200 bg-white p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-2xl bg-zinc-50 border border-zinc-200 p-4">
          <div className="text-sm font-extrabold text-zinc-900">{visionTitle || "Vision"}</div>
          <div className="mt-2 text-sm text-zinc-600 leading-relaxed">{visionBody || "Vision body..."}</div>
        </div>
        <div className="rounded-2xl bg-zinc-50 border border-zinc-200 p-4">
          <div className="text-sm font-extrabold text-zinc-900">{missionTitle || "Mission"}</div>
          <div className="mt-2 text-sm text-zinc-600 leading-relaxed">{missionBody || "Mission body..."}</div>
        </div>
      </div>
    </div>
  );
}

function PreviewRenderer({ sections }) {
  return (
    <div className="space-y-4">
      {(sections || []).map((s, i) => {
        const props = s?.props || {};
        if (s?.type === "Hero") return <HeroPreview key={i} {...props} />;
        if (s?.type === "OurStory") return <OurStoryPreview key={i} {...props} />;
        if (s?.type === "MissionVision") return <MissionVisionPreview key={i} {...props} />;

        return (
          <div key={i} className="rounded-3xl bg-white border border-zinc-200 p-6">
            <div className="text-xs font-extrabold tracking-widest text-zinc-400">{s?.type || "SECTION"}</div>
            <pre className="mt-3 text-[12px] text-zinc-700 whitespace-pre-wrap break-words">
              {JSON.stringify(props, null, 2)}
            </pre>
          </div>
        );
      })}

      {!sections?.length ? <div className="text-sm text-zinc-500">No sections in this page.</div> : null}
    </div>
  );
}

/* =========================
   Default content
========================= */
const DEFAULT_PAGE_CONTENT = {
  sections: [
    { type: "Hero", props: { ...SECTION_DEFS.Hero.defaults } },
    { type: "OurStory", props: { ...SECTION_DEFS.OurStory.defaults } },
    { type: "MissionVision", props: { ...SECTION_DEFS.MissionVision.defaults } },
  ],
  templateKey: "about-shared",
};

export default function BrandInnerPageDetail() {
  const { pageId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const [page, setPage] = useState(null);
  const [versions, setVersions] = useState([]);
  const [activeVersionId, setActiveVersionId] = useState(null);

  const [data, setData] = useState(DEFAULT_PAGE_CONTENT);
  const [saving, setSaving] = useState(false);

  const [selectedIdx, setSelectedIdx] = useState(0);
  const [addType, setAddType] = useState("Hero");
  const [showAdd, setShowAdd] = useState(false);

  const pageTitle = useMemo(() => page?.title || page?.slug || "Shared Page", [page]);
  const status = page?.status || "draft";

  const sections = data?.sections || [];
  const selected = sections[selectedIdx] || null;
  const selectedDef = selected ? SECTION_DEFS[selected.type] : null;

  /* =========================
     Helpers: sections edit
  ========================= */
  function updateSectionProps(idx, patch) {
    setData((d) => {
      const next = { ...(d || {}) };
      const arr = [...(next.sections || [])];
      const s = arr[idx] || { type: "Hero", props: {} };
      arr[idx] = { ...s, props: { ...(s.props || {}), ...patch } };
      next.sections = arr;
      return next;
    });
  }

  function setSectionType(idx, nextType) {
    const defaults = SECTION_DEFS[nextType]?.defaults || {};
    setData((d) => {
      const next = { ...(d || {}) };
      const arr = [...(next.sections || [])];
      arr[idx] = { type: nextType, props: { ...defaults } };
      next.sections = arr;
      return next;
    });
  }

  function addSection(type) {
    const def = SECTION_DEFS[type];
    const defaults = def?.defaults || {};
    setData((d) => ({
      ...(d || {}),
      sections: [...((d && d.sections) || []), { type, props: { ...defaults } }],
    }));
    setSelectedIdx((sections?.length || 0));
  }

  function removeSection(idx) {
    setData((d) => {
      const nextSections = ((d && d.sections) || []).filter((_, i) => i !== idx);
      return { ...(d || {}), sections: nextSections };
    });
    setSelectedIdx((cur) => Math.max(0, Math.min(cur, (sections?.length || 1) - 2)));
  }

  function moveSection(from, to) {
    setData((d) => {
      const arr = [...((d && d.sections) || [])];
      if (from < 0 || to < 0 || from >= arr.length || to >= arr.length) return d;
      return { ...(d || {}), sections: move(arr, from, to) };
    });
    setSelectedIdx((cur) => (cur === from ? to : cur));
  }

  /* =========================
     Versions API
  ========================= */
  async function loadVersions(pid) {
    const r = await apiFetch(`/admin/shared-pages/${pid}/versions?limit=50`);
    const j = await r.json().catch(() => null);
    if (!r.ok || !j?.ok) throw new Error(j?.message || "Failed to load versions");
    setVersions(Array.isArray(j.data) ? j.data : []);
    return j.data;
  }

  async function applyVersion(v) {
    const base = DEFAULT_PAGE_CONTENT;
    const next = v?.content && typeof v.content === "object" ? { ...base, ...v.content } : base;
    setData(next);
    setActiveVersionId(v?.id || null);
    setSelectedIdx(0);
  }

  /* =========================
     ✅ Save / Publish (DB direct)
  ========================= */
  async function saveAndMaybePublish(nextStatus) {
    if (!pageId) return;

    setSaving(true);
    try {
      const res = await apiFetch(`/admin/shared-pages/${pageId}/content`, {
        method: "PUT",
        body: { content: data, status: nextStatus || undefined },
      });

      const json = await res.json().catch(() => null);
      if (!res.ok || !json?.ok) throw new Error(json?.message || "Failed to save");

      // reload page meta + latestVersion
      const res2 = await apiFetch(`/admin/shared-pages/${pageId}`);
      const j2 = await res2.json().catch(() => null);
      if (res2.ok && j2?.ok) {
        setPage(j2.data);
        const latest = j2.data?.latestVersion;
        if (latest?.content && typeof latest.content === "object") {
          setData({ ...DEFAULT_PAGE_CONTENT, ...latest.content });
          setActiveVersionId(latest.id || null);
        } else {
          setActiveVersionId(null);
        }
      }

      // reload versions list
      const v = await loadVersions(pageId);
      if (Array.isArray(v) && v.length) setActiveVersionId(v[0].id);

      alert(nextStatus ? "Saved & published" : "Saved");
    } catch (e) {
      alert(e?.message || "Save failed");
    } finally {
      setSaving(false);
    }
  }

  /* =========================
     Initial load
  ========================= */
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
        if (!cancelled && Array.isArray(v) && v.length) setActiveVersionId(v[0].id);

        setSelectedIdx(0);
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
  }, [pageId]);

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
            onClick={() => saveAndMaybePublish(undefined)}
            className={[
              "h-11 px-5 rounded-xl text-white text-sm font-extrabold shadow-lg",
              saving ? "bg-zinc-400" : "bg-zinc-900 hover:bg-zinc-800",
            ].join(" ")}
          >
            {saving ? "Saving…" : "Save"}
          </button>

          <button
            disabled={saving}
            onClick={() => saveAndMaybePublish("published")}
            className={[
              "h-11 px-5 rounded-xl text-white text-sm font-extrabold shadow-lg shadow-primary/20",
              saving ? "bg-primary/40" : "bg-primary hover:bg-primary/90",
            ].join(" ")}
          >
            {saving ? "Publishing…" : "Publish"}
          </button>
        </div>
      </div>

      {/* Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-[320px,540px,1fr] gap-6">
        {/* Left */}
        <div className="space-y-6">
          {/* Versions */}
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

          {/* Sections */}
          <div className="rounded-3xl bg-white/80 border border-zinc-200 shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-zinc-200 flex items-center justify-between">
              <div>
                <div className="text-sm font-extrabold text-zinc-900">Sections</div>
                <div className="text-xs text-zinc-500">Add / reorder / delete</div>
              </div>

              <button
                type="button"
                onClick={() => setShowAdd(true)}
                className="h-9 px-3 rounded-xl bg-primary/10 text-primary text-xs font-extrabold hover:bg-primary/15 flex items-center gap-2"
              >
                <MIcon name="add" className="text-[16px]" />
                Add
              </button>
            </div>

            <div className="divide-y divide-zinc-100">
              {sections.map((s, idx) => {
                const isActive = idx === selectedIdx;
                const label = SECTION_DEFS[s.type]?.label || s.type || "Section";
                return (
                  <div
                    key={idx}
                    className={[
                      "px-5 py-4 flex items-center justify-between hover:bg-primary/5 cursor-pointer transition",
                      isActive ? "bg-primary/10" : "",
                    ].join(" ")}
                    onClick={() => setSelectedIdx(idx)}
                  >
                    <div className="min-w-0">
                      <div className="text-sm font-extrabold text-zinc-900 truncate">
                        {idx + 1}. {label}
                      </div>
                      <div className="text-[11px] text-zinc-400 font-mono truncate">type: {s.type}</div>
                    </div>

                    <div className="flex items-center gap-1 text-zinc-400">
                      <button
                        type="button"
                        className="w-8 h-8 rounded-xl hover:bg-zinc-100 flex items-center justify-center"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (idx > 0) moveSection(idx, idx - 1);
                        }}
                        title="Move up"
                      >
                        <MIcon name="keyboard_arrow_up" className="text-[18px]" />
                      </button>
                      <button
                        type="button"
                        className="w-8 h-8 rounded-xl hover:bg-zinc-100 flex items-center justify-center"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (idx < sections.length - 1) moveSection(idx, idx + 1);
                        }}
                        title="Move down"
                      >
                        <MIcon name="keyboard_arrow_down" className="text-[18px]" />
                      </button>
                      <button
                        type="button"
                        className="w-8 h-8 rounded-xl hover:bg-zinc-100 flex items-center justify-center"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeSection(idx);
                        }}
                        title="Delete"
                      >
                        <MIcon name="delete" className="text-[18px]" />
                      </button>
                    </div>
                  </div>
                );
              })}

              {!sections.length ? <div className="px-6 py-6 text-sm text-zinc-500">No sections yet.</div> : null}
            </div>

            <div className="px-6 py-4 border-t border-zinc-100">
              <div className="text-[11px] text-zinc-400">templateKey</div>
              <input
                value={data.templateKey ?? ""}
                onChange={(e) => setData((d) => ({ ...(d || {}), templateKey: e.target.value }))}
                className="mt-1 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20"
                placeholder="about-shared"
              />
            </div>
          </div>
        </div>

        {/* Middle */}
        <div className="rounded-3xl bg-white/80 border border-zinc-200 shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-zinc-200 flex items-center justify-between">
            <div>
              <div className="text-sm font-extrabold text-zinc-900">Editor</div>
              <div className="text-xs text-zinc-500">Edit selected section fields</div>
            </div>

            {selected ? (
              <select
                value={selected.type}
                onChange={(e) => setSectionType(selectedIdx, e.target.value)}
                className="h-10 rounded-xl border border-zinc-200 bg-zinc-50 px-3 text-sm outline-none"
                title="Change section type"
              >
                {Object.keys(SECTION_DEFS).map((k) => (
                  <option key={k} value={k}>
                    {SECTION_DEFS[k].label}
                  </option>
                ))}
              </select>
            ) : null}
          </div>

          <div className="p-5 space-y-5">
            {!selected ? (
              <div className="text-sm text-zinc-500">Select a section from left panel to edit.</div>
            ) : (
              <>
                <div className="rounded-2xl border border-zinc-200 bg-white p-4">
                  <div className="text-xs font-extrabold tracking-widest text-zinc-400">
                    EDITING: {selectedDef?.label || selected.type}
                  </div>
                  <div className="text-[11px] text-zinc-400 mt-1">
                    section #{selectedIdx + 1} • type: <span className="font-mono">{selected.type}</span>
                  </div>
                </div>

                {(selectedDef?.fields || []).map((f) => (
                  <Field
                    key={f.key}
                    field={f}
                    value={selected.props?.[f.key]}
                    onChange={(val) => updateSectionProps(selectedIdx, { [f.key]: val })}
                  />
                ))}
              </>
            )}
          </div>
        </div>

        {/* Right */}
        <div className="rounded-3xl bg-white/80 border border-zinc-200 shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-zinc-200">
            <div className="text-sm font-extrabold text-zinc-900">Preview</div>
            <div className="text-xs text-zinc-500">Live preview (wireframe)</div>
          </div>

          <div className="p-8 bg-zinc-50 min-h-[640px]">
            <div className="max-w-[900px] mx-auto space-y-6">
              <PreviewRenderer sections={sections} />
              <div className="rounded-3xl bg-white border border-zinc-200 p-6">
                <div className="text-xs font-extrabold tracking-widest text-zinc-400 mb-2">PAGE JSON (read-only)</div>
                <pre className="text-[11px] text-zinc-700 whitespace-pre-wrap break-words">
                  {JSON.stringify(data, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Section Modal */}
      {showAdd ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
          <div className="w-full max-w-lg rounded-3xl bg-white border border-zinc-200 shadow-xl overflow-hidden">
            <div className="px-6 py-5 border-b border-zinc-200 flex items-center justify-between">
              <div>
                <div className="text-sm font-extrabold text-zinc-900">Add Section</div>
                <div className="text-xs text-zinc-500">Choose section type</div>
              </div>
              <button
                type="button"
                className="w-10 h-10 rounded-xl hover:bg-zinc-100 flex items-center justify-center text-zinc-600"
                onClick={() => setShowAdd(false)}
              >
                <MIcon name="close" className="text-[20px]" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="text-xs font-bold text-zinc-500">Section Type</label>
                <select
                  value={addType}
                  onChange={(e) => setAddType(e.target.value)}
                  className="mt-1 w-full h-11 rounded-xl border border-zinc-200 bg-zinc-50 px-3 text-sm outline-none focus:ring-2 focus:ring-primary/20"
                >
                  {Object.keys(SECTION_DEFS).map((k) => (
                    <option key={k} value={k}>
                      {SECTION_DEFS[k].label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  className="h-11 px-4 rounded-xl bg-white border border-zinc-200 text-sm font-bold text-zinc-700 hover:bg-zinc-50"
                  onClick={() => setShowAdd(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="h-11 px-5 rounded-xl bg-primary text-white text-sm font-extrabold shadow-lg shadow-primary/20 hover:bg-primary/90"
                  onClick={() => {
                    addSection(addType);
                    setShowAdd(false);
                  }}
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
