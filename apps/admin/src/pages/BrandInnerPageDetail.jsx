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

/* =========================
   Nested path helpers
========================= */
function getByPath(obj, path) {
  if (!path) return obj;
  return String(path)
    .split(".")
    .reduce((acc, k) => (acc && acc[k] !== undefined ? acc[k] : undefined), obj);
}

function setByPath(obj, path, value) {
  const keys = String(path).split(".");
  const next = { ...(obj || {}) };
  let cur = next;

  for (let i = 0; i < keys.length - 1; i++) {
    const k = keys[i];
    cur[k] = typeof cur[k] === "object" && cur[k] !== null ? { ...cur[k] } : {};
    cur = cur[k];
  }

  cur[keys[keys.length - 1]] = value;
  return next;
}

/* =========================
   Dynamic editor helpers
========================= */
function isPlainObject(v) {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

function guessKind(key, value) {
  if (typeof value === "boolean") return "boolean";
  if (typeof value === "number") return "number";

  if (typeof value === "string") {
    const k = String(key || "").toLowerCase();
    if (k.includes("body") || k.includes("description") || k.includes("subtitle")) return "textarea";
    if (value.length > 120) return "textarea";
    return "text";
  }

  if (Array.isArray(value)) return "array";
  if (isPlainObject(value)) return "object";
  return "text";
}

function prettyLabelFromKey(path) {
  const last = String(path).split(".").slice(-1)[0] || "";
  return last
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (m) => m.toUpperCase());
}

function getObjectFlavor(obj) {
  if (!isPlainObject(obj)) return "";
  const keys = Object.keys(obj);
  const hasLabelHref = keys.includes("label") && keys.includes("href");
  const hasUrlAlt = keys.includes("url") && (keys.includes("alt") || keys.includes("assetKey"));
  if (hasLabelHref) return "button";
  if (hasUrlAlt) return "image";
  return "object";
}

/* =========================
   Field UI (supports boolean/number/list)
========================= */
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

  if (field.kind === "boolean") {
    return (
      <label className="flex items-center gap-3">
        <input
          type="checkbox"
          checked={!!value}
          onChange={(e) => onChange(e.target.checked)}
          className="h-5 w-5 rounded border-zinc-300"
        />
        <span className="text-sm font-bold text-zinc-700">{field.label}</span>
      </label>
    );
  }

  if (field.kind === "number") {
    return (
      <div>
        <label className="text-xs font-bold text-zinc-500">{field.label}</label>
        <input
          type="number"
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value === "" ? "" : Number(e.target.value))}
          className="mt-1 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20"
        />
      </div>
    );
  }

  // list of primitives
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
   Dynamic editor (recursive)
========================= */
function DynamicEditor({ value, pathPrefix = "", onChange }) {
  // primitives
  if (!Array.isArray(value) && !isPlainObject(value)) {
    const kind = guessKind(pathPrefix, value);
    return (
      <Field
        field={{ label: prettyLabelFromKey(pathPrefix), kind }}
        value={value}
        onChange={(v) => onChange(v)}
      />
    );
  }

  // objects
  if (isPlainObject(value)) {
    const flavor = getObjectFlavor(value);
    const title =
      flavor === "button"
        ? "Button"
        : flavor === "image"
        ? "Image"
        : prettyLabelFromKey(pathPrefix) || "Object";

    return (
      <div className="rounded-2xl border border-zinc-200 bg-white p-4 space-y-4">
        <div className="text-xs font-extrabold tracking-widest text-zinc-400">{title}</div>

        {Object.keys(value).map((k) => {
          const nextPath = pathPrefix ? `${pathPrefix}.${k}` : k;
          return (
            <DynamicEditor
              key={nextPath}
              value={value[k]}
              pathPrefix={nextPath}
              onChange={(nextVal) => {
                const updated = { ...(value || {}) };
                updated[k] = nextVal;
                onChange(updated);
              }}
            />
          );
        })}
      </div>
    );
  }

  // arrays
  if (Array.isArray(value)) {
    const arr = value;
    const isPrimitiveArray = arr.every((x) => !Array.isArray(x) && !isPlainObject(x));

    // array of primitives => list field
    if (isPrimitiveArray) {
      return (
        <Field
          field={{ label: prettyLabelFromKey(pathPrefix), kind: "list" }}
          value={arr}
          onChange={(v) => onChange(v)}
        />
      );
    }

    // array of objects => repeater
    return (
      <div className="rounded-2xl border border-zinc-200 bg-white p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="text-xs font-extrabold tracking-widest text-zinc-400">
            {prettyLabelFromKey(pathPrefix) || "Items"}
          </div>

          <button
            type="button"
            className="h-9 px-3 rounded-xl bg-primary/10 text-primary text-xs font-extrabold hover:bg-primary/15 flex items-center gap-2"
            onClick={() => onChange([...(arr || []), {}])}
          >
            <MIcon name="add" className="text-[16px]" />
            Add
          </button>
        </div>

        <div className="space-y-4">
          {arr.map((item, idx) => {
            const rowTitle =
              (isPlainObject(item) && (item.title || item.name || item.label || item.year)) || `Item ${idx + 1}`;

            return (
              <div key={idx} className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-sm font-extrabold text-zinc-900 truncate">{rowTitle}</div>

                  <div className="flex items-center gap-1 text-zinc-500">
                    <button
                      type="button"
                      className="w-8 h-8 rounded-xl hover:bg-white flex items-center justify-center"
                      onClick={() => {
                        if (idx === 0) return;
                        const next = [...arr];
                        const it = next.splice(idx, 1)[0];
                        next.splice(idx - 1, 0, it);
                        onChange(next);
                      }}
                      title="Move up"
                    >
                      <MIcon name="keyboard_arrow_up" className="text-[18px]" />
                    </button>

                    <button
                      type="button"
                      className="w-8 h-8 rounded-xl hover:bg-white flex items-center justify-center"
                      onClick={() => {
                        if (idx === arr.length - 1) return;
                        const next = [...arr];
                        const it = next.splice(idx, 1)[0];
                        next.splice(idx + 1, 0, it);
                        onChange(next);
                      }}
                      title="Move down"
                    >
                      <MIcon name="keyboard_arrow_down" className="text-[18px]" />
                    </button>

                    <button
                      type="button"
                      className="w-8 h-8 rounded-xl hover:bg-white flex items-center justify-center"
                      onClick={() => onChange(arr.filter((_, i) => i !== idx))}
                      title="Delete"
                    >
                      <MIcon name="delete" className="text-[18px]" />
                    </button>
                  </div>
                </div>

                <DynamicEditor
                  value={item}
                  pathPrefix={`${pathPrefix}.${idx}`}
                  onChange={(nextItem) => {
                    const next = [...arr];
                    next[idx] = nextItem;
                    onChange(next);
                  }}
                />
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return null;
}

/* =========================
   Section registry (schema-less)
   Keep only label + defaults (optional)
========================= */
const SECTION_DEFS = {
  Hero: {
    label: "Hero",
    defaults: {
      badge: { icon: "favorite", label: "Our Heart & Soul" },
      title: { before: "Born from a Love for", highlight: "Furry Family", after: "." },
      description: "",
      backgroundImage: { url: "", alt: "", assetKey: "about.hero.bg" },
      founders: {
        name: "",
        role: "",
        avatars: [
          { url: "", alt: "", assetKey: "about.founder.1" },
          { url: "", alt: "", assetKey: "about.founder.2" }
        ]
      }
    }
  },
  MissionValues: {
    label: "Mission + Values",
    defaults: {
      missionTitle: "Our Mission",
      missionBody: "",
      valuesTitle: "Our Values",
      stats: [],
      values: []
    }
  },
  Timeline: { label: "Timeline", defaults: { kicker: "", title: "", items: [] } },
  TeamGrid: { label: "Team Grid", defaults: { title: "", subtitle: "", badgeIcon: "pets", members: [] } },
  FinalCTA: { label: "Final CTA", defaults: { title: "", primary: { label: "", href: "" }, secondary: { label: "", href: "" } } },

  // You can add more types freely:
  Intro: { label: "Intro", defaults: { id: "", title: "", body: "" } },
  Gallery: { label: "Gallery", defaults: { id: "", title: "", images: [] } },
  Benefits: { label: "Benefits", defaults: { id: "", title: "", subtitle: "", items: [] } }
};

/* =========================
   Previews (safe)
========================= */
function HeroPreview({ badge, title, description, backgroundImage, founders }) {
  const t =
    typeof title === "object" && title
      ? `${title.before || ""} ${title.highlight || ""}${title.after || ""}`.trim()
      : String(title || "");

  const bg = backgroundImage?.url || "";

  return (
    <div className="rounded-3xl overflow-hidden border border-zinc-200 bg-white">
      {bg ? (
        <div
          className="h-48 bg-zinc-100"
          style={{ backgroundImage: `url(${bg})`, backgroundSize: "cover", backgroundPosition: "center" }}
        />
      ) : (
        <div className="h-20 bg-zinc-100" />
      )}

      <div className="p-6">
        <div className="flex items-center gap-2 text-xs font-extrabold text-primary">
          {badge?.icon ? <span className="opacity-70">[{badge.icon}]</span> : null}
          <span>{badge?.label || ""}</span>
        </div>

        <div className="mt-2 text-2xl font-extrabold text-zinc-900">{t || "Hero title..."}</div>

        {description ? <p className="mt-2 text-sm text-zinc-600 leading-relaxed">{description}</p> : null}

        {founders?.name ? (
          <div className="mt-4 text-sm text-zinc-700">
            <div className="font-bold">{founders.name}</div>
            <div className="text-zinc-500">{founders.role}</div>
          </div>
        ) : null}
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
  templateKey: "about-shared",
  sections: [
    { type: "Hero", props: { ...SECTION_DEFS.Hero.defaults } },
    { type: "MissionValues", props: { ...SECTION_DEFS.MissionValues.defaults } },
    { type: "Timeline", props: { ...SECTION_DEFS.Timeline.defaults } },
    { type: "TeamGrid", props: { ...SECTION_DEFS.TeamGrid.defaults } },
    { type: "FinalCTA", props: { ...SECTION_DEFS.FinalCTA.defaults } }
  ]
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

  /* =========================
     Helpers: sections edit
  ========================= */
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
    const defaults = SECTION_DEFS[type]?.defaults || {};
    setData((d) => ({
      ...(d || {}),
      sections: [...((d && d.sections) || []), { type, props: { ...defaults } }]
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
     Save / Publish (DB direct)
  ========================= */
  async function saveAndMaybePublish(nextStatus) {
    if (!pageId) return;

    setSaving(true);
    try {
      const res = await apiFetch(`/admin/shared-pages/${pageId}/content`, {
        method: "PUT",
        body: { content: data, status: nextStatus || undefined }
      });

      const json = await res.json().catch(() => null);
      if (!res.ok || !json?.ok) throw new Error(json?.message || "Failed to save");

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
              saving ? "bg-zinc-400" : "bg-zinc-900 hover:bg-zinc-800"
            ].join(" ")}
          >
            {saving ? "Saving…" : "Save"}
          </button>

          <button
            disabled={saving}
            onClick={() => saveAndMaybePublish("published")}
            className={[
              "h-11 px-5 rounded-xl text-white text-sm font-extrabold shadow-lg shadow-primary/20",
              saving ? "bg-primary/40" : "bg-primary hover:bg-primary/90"
            ].join(" ")}
          >
            {saving ? "Publishing…" : "Publish"}
          </button>
        </div>
      </div>

      {/* Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-[320px,1fr] gap-6">
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
                      active ? "bg-primary/10" : ""
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
                      isActive ? "bg-primary/10" : ""
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
              <div className="text-xs text-zinc-500">Schema-less dynamic editor</div>
            </div>

            
          </div>

          <div className="p-5 space-y-5">
            {!selected ? (
              <div className="text-sm text-zinc-500">Select a section from left panel to edit.</div>
            ) : (
              <>
                <div className="rounded-2xl border border-zinc-200 bg-white p-4">
                  <div className="text-xs font-extrabold tracking-widest text-zinc-400">
                    EDITING: {SECTION_DEFS[selected.type]?.label || selected.type}
                  </div>
                  <div className="text-[11px] text-zinc-400 mt-1">
                    section #{selectedIdx + 1} • type: <span className="font-mono">{selected.type}</span>
                  </div>
                </div>

                <DynamicEditor
                  value={selected.props || {}}
                  pathPrefix=""
                  onChange={(nextProps) =>
                    setData((d) => {
                      const next = { ...(d || {}) };
                      const arr = [...(next.sections || [])];
                      const s = arr[selectedIdx] || { type: "Hero", props: {} };
                      arr[selectedIdx] = { ...s, props: nextProps };
                      next.sections = arr;
                      return next;
                    })
                  }
                />
              </>
            )}
          </div>
        </div>

        {/* Right */}
        {/* <div className="rounded-3xl bg-white/80 border border-zinc-200 shadow-sm overflow-hidden">
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
        </div> */}
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
