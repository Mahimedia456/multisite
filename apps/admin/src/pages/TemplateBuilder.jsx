// admin/src/pages/TemplateBuilder.jsx
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import MIcon from "../components/MIcon";
import { apiFetch } from "../lib/auth";

/* =========================
   Small UI bits
========================= */
function Badge({ text }) {
  const s = String(text || "").toLowerCase();
  const tone =
    s === "published" || s === "live" || s === "active"
      ? "bg-green-50 text-green-700"
      : "bg-amber-50 text-amber-700";
  return (
    <span
      className={["px-2.5 py-1 rounded-full text-[11px] font-bold uppercase", tone].join(" ")}
    >
      {text || "draft"}
    </span>
  );
}

function Input({ label, value, onChange, placeholder }) {
  return (
    <div>
      <label className="text-xs font-bold text-zinc-500">{label}</label>
      <input
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="mt-1 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20"
      />
    </div>
  );
}

function TextArea({ label, value, onChange, placeholder, rows = 3 }) {
  return (
    <div>
      <label className="text-xs font-bold text-zinc-500">{label}</label>
      <textarea
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="mt-1 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20"
      />
    </div>
  );
}

function RowActions({ onUp, onDown, onDelete }) {
  return (
    <div className="flex items-center gap-1 text-zinc-400">
      <button
        type="button"
        onClick={onUp}
        className="w-8 h-8 rounded-xl hover:bg-zinc-100 flex items-center justify-center"
        title="Move up"
      >
        <MIcon name="keyboard_arrow_up" className="text-[18px]" />
      </button>
      <button
        type="button"
        onClick={onDown}
        className="w-8 h-8 rounded-xl hover:bg-zinc-100 flex items-center justify-center"
        title="Move down"
      >
        <MIcon name="keyboard_arrow_down" className="text-[18px]" />
      </button>
      <button
        type="button"
        onClick={onDelete}
        className="w-8 h-8 rounded-xl hover:bg-zinc-100 flex items-center justify-center"
        title="Delete"
      >
        <MIcon name="delete" className="text-[18px]" />
      </button>
    </div>
  );
}

function move(arr, from, to) {
  const next = [...arr];
  const item = next.splice(from, 1)[0];
  next.splice(to, 0, item);
  return next;
}

/* =========================
   URL helpers (href/to both)
========================= */
function getUrl(obj) {
  if (!obj) return "";
  return obj.to ?? obj.href ?? "";
}
function setUrl(obj, url) {
  // keep both for compatibility; your SiteHeader supports href/to
  return { ...(obj || {}), href: url, to: url };
}

/* =========================
   Mega helpers (skip empties)
========================= */
function isEmptyColumn(col) {
  const title = String(col?.title || "").trim();
  const items = Array.isArray(col?.items) ? col.items : [];
  const footerLabel = String(col?.footerLink?.label || "").trim();
  const hasAnyItem = items.some((it) => String(it?.label || "").trim());
  return !title && !hasAnyItem && !footerLabel;
}

function cleanMega(mega) {
  if (!mega || !Array.isArray(mega.columns)) return null;
  const columns = mega.columns
    .map((c) => ({
      ...c,
      title: c?.title ?? "",
      items: Array.isArray(c?.items) ? c.items : [],
      footerLink: c?.footerLink || null,
    }))
    .filter((c) => !isEmptyColumn(c));

  return { ...mega, columns };
}

/* =========================
   Defaults
========================= */
const DEFAULT_HEADER = {
  name: "",
  logoType: "material", // material | emoji | image
  logoValue: "pets",
  logoUrl: "",
  homeLinks: [
    { label: "Plans", href: "/#plans" },
    { label: "How it Works", href: "/#how" },
  ],
  login: { label: "Log In", to: "/login" },
  cta: { label: "Get a Quote", to: "/quote" },
};

const DEFAULT_FOOTER = {
  name: "",
  logoType: "emoji",
  logoValue: "✨",
  logoUrl: "",
  description: "",
  socials: [{ label: "f", href: "#" }],
  columns: [{ title: "Company", links: [{ label: "About Us", href: "/about" }] }],
  bottomLeft: "",
  bottomCenter: "",
  bottomRight: "",
};

/* =========================
   Reusable editors
========================= */
function LinkRow({
  value,
  onChangeLabel,
  onChangeUrl,
  labelLabel = "Label",
  urlLabel = "URL (href/to)",
  urlPlaceholder,
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      <Input label={labelLabel} value={value?.label || ""} onChange={onChangeLabel} />
      <Input
        label={urlLabel}
        value={getUrl(value)}
        onChange={onChangeUrl}
        placeholder={urlPlaceholder || "# or /about"}
      />
    </div>
  );
}

function MegaEditor({ mega, onChange }) {
  const safeMega = cleanMega(mega) || { columns: [] };
  const columns = safeMega.columns || [];

  return (
    <div className="mt-4 rounded-2xl border border-zinc-200 bg-white p-3">
      <div className="flex items-center justify-between">
        <div className="text-[11px] font-extrabold tracking-widest text-zinc-400">MEGA COLUMNS</div>

        <button
          type="button"
          onClick={() => {
            onChange({
              ...safeMega,
              columns: [
                ...columns,
                {
                  title: "New Column",
                  items: [{ label: "New Item", href: "#" }],
                  footerLink: { label: "Im Überblick", href: "#" },
                },
              ],
            });
          }}
          className="h-8 px-3 rounded-xl bg-primary/10 text-primary text-xs font-extrabold hover:bg-primary/15 flex items-center gap-2"
        >
          <MIcon name="add" className="text-[16px]" />
          Add Column
        </button>
      </div>

      <div className="mt-3 space-y-4">
        {columns.map((col, cIdx) => {
          const colItems = Array.isArray(col?.items) ? col.items : [];

          return (
            <div key={cIdx} className="rounded-2xl border border-zinc-200 bg-zinc-50 p-3">
              <div className="flex items-center justify-between">
                <div className="text-[11px] font-extrabold tracking-widest text-zinc-400">
                  COLUMN #{cIdx + 1}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      const nextCols = columns.filter((_, ii) => ii !== cIdx);
                      onChange({ ...safeMega, columns: nextCols });
                    }}
                    className="h-8 px-3 rounded-xl bg-white border border-zinc-200 text-xs font-extrabold text-red-600 hover:bg-red-50"
                  >
                    Remove
                  </button>

                  <RowActions
                    onUp={() => cIdx > 0 && onChange({ ...safeMega, columns: move(columns, cIdx, cIdx - 1) })}
                    onDown={() =>
                      cIdx < columns.length - 1 && onChange({ ...safeMega, columns: move(columns, cIdx, cIdx + 1) })
                    }
                    onDelete={() => {}}
                  />
                </div>
              </div>

              <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-3">
                <Input
                  label="Column Title"
                  value={col?.title || ""}
                  onChange={(v) => {
                    const nextCols = columns.map((cc, ii) => (ii === cIdx ? { ...cc, title: v } : cc));
                    onChange({ ...safeMega, columns: nextCols });
                  }}
                />

                <Input
                  label="Footer Label (optional)"
                  value={col?.footerLink?.label || ""}
                  onChange={(v) => {
                    const nextCols = columns.map((cc, ii) => {
                      if (ii !== cIdx) return cc;
                      return { ...cc, footerLink: { ...(cc.footerLink || {}), label: v } };
                    });
                    onChange({ ...safeMega, columns: nextCols });
                  }}
                  placeholder="Im Überblick"
                />
              </div>

              <div className="mt-2">
                <Input
                  label="Footer URL (optional)"
                  value={getUrl(col?.footerLink) || ""}
                  onChange={(v) => {
                    const nextCols = columns.map((cc, ii) => {
                      if (ii !== cIdx) return cc;
                      return { ...cc, footerLink: setUrl(cc.footerLink || {}, v) };
                    });
                    onChange({ ...safeMega, columns: nextCols });
                  }}
                  placeholder="#"
                />
              </div>

              {/* Items */}
              <div className="mt-3 rounded-2xl border border-zinc-200 bg-white p-3">
                <div className="flex items-center justify-between">
                  <div className="text-[11px] font-extrabold tracking-widest text-zinc-400">ITEMS</div>

                  <button
                    type="button"
                    onClick={() => {
                      const nextCols = columns.map((cc, ii) => {
                        if (ii !== cIdx) return cc;
                        return { ...cc, items: [...(cc.items || []), { label: "New Item", href: "#" }] };
                      });
                      onChange({ ...safeMega, columns: nextCols });
                    }}
                    className="h-8 px-3 rounded-xl bg-primary/10 text-primary text-xs font-extrabold hover:bg-primary/15 flex items-center gap-2"
                  >
                    <MIcon name="add" className="text-[16px]" />
                    Add Item
                  </button>
                </div>

                <div className="mt-3 space-y-3">
                  {colItems.map((it, itIdx) => (
                    <div key={itIdx} className="rounded-2xl border border-zinc-200 bg-zinc-50 p-3">
                      <div className="flex items-center justify-between">
                        <div className="text-[11px] font-extrabold tracking-widest text-zinc-400">
                          ITEM #{itIdx + 1}
                        </div>

                        <RowActions
                          onUp={() => {
                            if (itIdx <= 0) return;
                            const nextCols = columns.map((cc, ii) => {
                              if (ii !== cIdx) return cc;
                              return { ...cc, items: move(cc.items || [], itIdx, itIdx - 1) };
                            });
                            onChange({ ...safeMega, columns: nextCols });
                          }}
                          onDown={() => {
                            if (itIdx >= colItems.length - 1) return;
                            const nextCols = columns.map((cc, ii) => {
                              if (ii !== cIdx) return cc;
                              return { ...cc, items: move(cc.items || [], itIdx, itIdx + 1) };
                            });
                            onChange({ ...safeMega, columns: nextCols });
                          }}
                          onDelete={() => {
                            const nextCols = columns.map((cc, ii) => {
                              if (ii !== cIdx) return cc;
                              return { ...cc, items: (cc.items || []).filter((_, k) => k !== itIdx) };
                            });
                            onChange({ ...safeMega, columns: nextCols });
                          }}
                        />
                      </div>

                      <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-3">
                        <Input
                          label="Label"
                          value={it?.label || ""}
                          onChange={(v) => {
                            const nextCols = columns.map((cc, ii) => {
                              if (ii !== cIdx) return cc;
                              const nextItems = (cc.items || []).map((zz, k) =>
                                k === itIdx ? { ...zz, label: v } : zz
                              );
                              return { ...cc, items: nextItems };
                            });
                            onChange({ ...safeMega, columns: nextCols });
                          }}
                        />

                        <Input
                          label="URL (href/to)"
                          value={getUrl(it)}
                          onChange={(v) => {
                            const nextCols = columns.map((cc, ii) => {
                              if (ii !== cIdx) return cc;
                              const nextItems = (cc.items || []).map((zz, k) =>
                                k === itIdx ? setUrl(zz, v) : zz
                              );
                              return { ...cc, items: nextItems };
                            });
                            onChange({ ...safeMega, columns: nextCols });
                          }}
                          placeholder="#"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-2 text-[11px] text-zinc-500">
                Empty columns auto-hide (title + items + footer empty).
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* =========================
   Page
========================= */
export default function TemplateBuilder() {
  const { brandId, templateId } = useParams(); // templateId: header | footer
  const navigate = useNavigate();

  const isHeader = templateId === "header";
  const isFooter = templateId === "footer";

  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const [brand, setBrand] = useState(null);
  const [templateMeta, setTemplateMeta] = useState(null); // contains UUID in .id (brand_layout_templates.id)
  const [data, setData] = useState(isHeader ? DEFAULT_HEADER : DEFAULT_FOOTER);

  const [saving, setSaving] = useState(false);

  /* =========================
     Load template meta + latest content
  ========================= */
  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setErr("");
      try {
        if (!isHeader && !isFooter) {
          setErr("Only header/footer builder is enabled right now.");
          return;
        }

        const res = await apiFetch(`/admin/brands/${brandId}/detail`);
        const json = await res.json().catch(() => null);
        if (!res.ok || !json?.ok) throw new Error(json?.message || "Failed to load");

        const b = json.data.brand;
        const t = (json.data.templates || []).find((x) => x.key === templateId);
        const content = t?.latestVersion?.content;

        if (cancelled) return;

        setBrand(b);
        setTemplateMeta(t || null);

        if (content && typeof content === "object") {
          if (isHeader) {
            const merged = { ...DEFAULT_HEADER, ...content };
            // normalize urls
            merged.login = merged.login ? setUrl(merged.login, getUrl(merged.login)) : DEFAULT_HEADER.login;
            merged.cta = merged.cta ? setUrl(merged.cta, getUrl(merged.cta)) : DEFAULT_HEADER.cta;
            merged.homeLinks = Array.isArray(merged.homeLinks) ? merged.homeLinks : [];
            // clean mega
            merged.homeLinks = merged.homeLinks.map((l) => ({
              ...l,
              ...setUrl(l, getUrl(l)),
              mega: cleanMega(l.mega) || undefined,
            }));
            setData(merged);
          }

          if (isFooter) setData({ ...DEFAULT_FOOTER, ...content });
        } else {
          const base = isHeader ? DEFAULT_HEADER : DEFAULT_FOOTER;
          setData({ ...base, name: b?.name || "" });
        }
      } catch (e) {
        if (!cancelled) setErr(e?.message || "Failed to load");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    if (brandId && templateId) load();
    return () => {
      cancelled = true;
    };
  }, [brandId, templateId, isHeader, isFooter]);

  const title = useMemo(() => {
    if (isHeader) return "Global Header";
    if (isFooter) return "Global Footer";
    return templateId;
  }, [templateId, isHeader, isFooter]);

  const status = templateMeta?.status || "draft";

  async function refreshTemplateMeta() {
    const r2 = await apiFetch(`/admin/brands/${brandId}/detail`);
    const j2 = await r2.json().catch(() => null);
    if (!r2.ok || !j2?.ok) return;
    const t2 = (j2?.data?.templates || []).find((x) => x.key === templateId);
    if (t2) setTemplateMeta(t2);
  }

  /* =========================
     ✅ Save / Publish (DO NOT CHANGE)
     Server route exists:
     POST /admin/layout-templates/:templateId/versions
  ========================= */
  async function saveAsNewVersion(nextStatus) {
    if (!templateMeta?.id) {
      alert("template_id missing (seed header/footer rows for this brand)");
      return;
    }

    setSaving(true);
    try {
      const res = await apiFetch(`/admin/layout-templates/${templateMeta.id}/versions`, {
        method: "POST",
        body: {
          content: data,
          status: nextStatus || undefined, // "published" optional
        },
      });

      const json = await res.json().catch(() => null);
      if (!res.ok || !json?.ok) throw new Error(json?.message || "Failed to save template");

      await refreshTemplateMeta();
      alert(nextStatus ? "Saved & published" : "Saved");
    } catch (e) {
      alert(e?.message || "Save failed");
    } finally {
      setSaving(false);
    }
  }

  /* =========================
     Render guards
  ========================= */
  if (loading) return <div className="max-w-7xl mx-auto py-10 text-zinc-500">Loading…</div>;

  if (err) {
    return (
      <div className="max-w-7xl mx-auto py-10">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">{err}</div>
        <div className="mt-4">
          <button
            onClick={() => navigate(`/brands/${brandId}`)}
            className="h-11 px-4 rounded-xl bg-white border border-zinc-200 text-sm font-bold text-zinc-700 hover:bg-zinc-50 flex items-center gap-2"
          >
            <MIcon name="arrow_back" className="text-[18px]" />
            Back
          </button>
        </div>
      </div>
    );
  }

  const saveDisabled = saving || !templateMeta?.id;

  return (
    <div className="max-w-[1400px] mx-auto">
      {/* Header (no buttons here anymore) */}
      <div className="mb-6">
        <div className="text-xs text-zinc-400">
          Brands <span className="mx-2">›</span> {brand?.name || brandId} <span className="mx-2">›</span> Templates
        </div>

        <div className="flex items-center gap-3 mt-1 flex-wrap">
          <h1 className="text-2xl font-extrabold text-zinc-900">{title}</h1>
          <Badge text={status} />

          {templateMeta?.id ? (
            <span className="text-xs text-zinc-400">
              template_id: <span className="font-mono">{templateMeta.id}</span>
            </span>
          ) : (
            <span className="text-xs text-red-600 font-bold">template_id missing (seed header/footer rows)</span>
          )}
        </div>
      </div>

      {/* Layout (single column: Preview -> Actions -> Editor) */}
      <div className="space-y-6">
        {/* Preview */}
        <div className="rounded-3xl bg-white/80 border border-zinc-200 shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-zinc-200 flex items-center justify-between">
            <div>
              <div className="text-xs text-zinc-500">Simple visual preview</div>
              <div className="text-sm font-extrabold text-zinc-900">Preview</div>
            </div>
          </div>

          {/* ✅ Actions bar (buttons moved here) */}
          <div className="px-6 py-4 border-b border-zinc-200 bg-white flex items-center justify-end gap-3">
            <button
              onClick={() => navigate(`/brands/${brandId}`)}
              className="h-11 px-4 rounded-xl bg-white border border-zinc-200 text-sm font-bold text-zinc-700 hover:bg-zinc-50 flex items-center gap-2"
            >
              <MIcon name="arrow_back" className="text-[18px]" />
              Back
            </button>

            <button
              disabled={saveDisabled}
              onClick={() => saveAsNewVersion(undefined)}
              className={[
                "h-11 px-5 rounded-xl text-white text-sm font-extrabold",
                saveDisabled ? "bg-zinc-400" : "bg-zinc-900 hover:bg-zinc-800",
              ].join(" ")}
            >
              {saving ? "Saving…" : "Save Changes"}
            </button>

            <button
              disabled={saveDisabled}
              onClick={() => saveAsNewVersion("published")}
              className={[
                "h-11 px-5 rounded-xl text-white text-sm font-extrabold shadow-lg shadow-primary/20",
                saveDisabled ? "bg-primary/40" : "bg-primary hover:bg-primary/90",
              ].join(" ")}
            >
              {saving ? "Publishing…" : "Publish"}
            </button>
          </div>

          <div className="p-8 bg-zinc-50">
            <div className="w-full space-y-6">              {isHeader ? (
                <div className="rounded-3xl bg-white border border-zinc-200 p-6">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 overflow-hidden">
                        {data.logoType === "image" && data.logoUrl ? (
                          <img src={data.logoUrl} alt="logo" className="w-8 h-8 object-contain" />
                        ) : data.logoType === "emoji" ? (
                          <span className="text-2xl">{data.logoValue || "✨"}</span>
                        ) : (
                          <span className="material-symbols-outlined text-[22px] text-primary">
                            {data.logoValue || "pets"}
                          </span>
                        )}
                      </div>
                      <div className="font-extrabold text-zinc-900 truncate">{data.name || "Brand"}</div>
                    </div>

                    <div className="hidden md:flex items-center gap-6 text-sm text-zinc-600">
                      {(data.homeLinks || []).map((l, i) => (
                        <span key={i} className="hover:text-primary inline-flex items-center gap-2">
                          {l.label}
                          {l.mega ? <span className="text-[10px] text-zinc-400">(submenu)</span> : null}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      {data.login?.label ? (
                        <div className="text-sm font-semibold text-zinc-600">{data.login.label}</div>
                      ) : null}
                      <div className="h-10 px-5 rounded-xl bg-primary text-white text-sm font-bold flex items-center">
                        {data.cta?.label || "Get a Quote"}
                      </div>
                    </div>
                  </div>

                  {/* Mega preview */}
                  <div className="mt-5 border-t border-zinc-100 pt-4 space-y-3">
                    {(data.homeLinks || [])
                      .filter((x) => !!x.mega)
                      .slice(0, 2)
                      .map((x, idx) => {
                        const cols = cleanMega(x.mega)?.columns || [];
                        return (
                          <div key={idx} className="text-xs text-zinc-600">
                            <div className="font-extrabold text-zinc-900">{x.label} submenu</div>

                            {/* show up to 4 columns; if less, it will not show empties due to cleanMega */}
                            <div className="mt-1 grid grid-cols-1 md:grid-cols-2 gap-3">
                              {cols.slice(0, 4).map((c, i) => (
                                <div key={i} className="rounded-xl bg-zinc-50 border border-zinc-200 p-3">
                                  <div className="font-bold text-zinc-900">{c.title || "—"}</div>
                                  <div className="mt-2 space-y-1">
                                    {(c.items || []).slice(0, 4).map((it, k) => (
                                      <div key={k} className="text-zinc-600">
                                        • {it.label}
                                      </div>
                                    ))}
                                  </div>
                                  {c.footerLink?.label ? (
                                    <div className="mt-2 font-bold text-primary">{c.footerLink.label}</div>
                                  ) : null}
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>
              ) : null}

              {isFooter ? (
                <div className="rounded-3xl bg-white border border-zinc-200 p-6">
                  <div className="text-sm font-extrabold text-zinc-900">Footer preview</div>
                  <div className="text-xs text-zinc-500 mt-1">(Use your real footer component here if you want.)</div>
                </div>
              ) : null}

          
            </div>
          </div>
        </div>

        {/* Editor */}
        <div className="rounded-3xl bg-white/80 border border-zinc-200 shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-zinc-200">
            <div className="text-sm font-extrabold text-zinc-900">Editor</div>
            <div className="text-xs text-zinc-500">
              Update data for <span className="font-bold">{title}</span>
            </div>
          </div>

          <div className="p-5 space-y-6">
            <Input
              label="Brand Name"
              value={data.name}
              onChange={(v) => setData((d) => ({ ...d, name: v }))}
              placeholder="Allianz 4"
            />

            {/* Logo */}
            <div className="rounded-2xl border border-zinc-200 bg-white p-4">
              <div className="text-xs font-extrabold tracking-widest text-zinc-400">LOGO</div>

              <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-zinc-500">Logo Type</label>
                  <select
                    value={data.logoType || "material"}
                    onChange={(e) => setData((d) => ({ ...d, logoType: e.target.value }))}
                    className="mt-1 w-full h-10 rounded-xl border border-zinc-200 bg-zinc-50 px-3 text-sm outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    <option value="material">material</option>
                    <option value="emoji">emoji</option>
                    <option value="image">image</option>
                  </select>
                </div>

                {data.logoType === "image" ? (
                  <Input
                    label="Logo Image URL"
                    value={data.logoUrl || ""}
                    onChange={(v) => setData((d) => ({ ...d, logoUrl: v }))}
                    placeholder="https://.../logo.png"
                  />
                ) : (
                  <Input
                    label={data.logoType === "emoji" ? "Emoji" : "Material Icon Name"}
                    value={data.logoValue || ""}
                    onChange={(v) => setData((d) => ({ ...d, logoValue: v }))}
                    placeholder={data.logoType === "emoji" ? "🐾" : "shield"}
                  />
                )}
              </div>

              <div className="mt-3 text-[11px] text-zinc-500">
                Preview uses: <span className="font-mono">{data.logoType}</span>{" "}
                {data.logoType === "image" ? (
                  <>
                    • <span className="font-mono">logoUrl</span>
                  </>
                ) : (
                  <>
                    • <span className="font-mono">logoValue</span>
                  </>
                )}
              </div>
            </div>

            {/* Header Editor */}
            {isHeader ? (
              <>
                {/* MENU LINKS + MEGA */}
                <div className="rounded-2xl border border-zinc-200 bg-white p-4">
                  <div className="flex items-center justify-between">
                    <div className="text-xs font-extrabold tracking-widest text-zinc-400">MENU LINKS</div>
                    <button
                      type="button"
                      onClick={() =>
                        setData((d) => ({
                          ...d,
                          homeLinks: [...(d.homeLinks || []), { label: "New Link", href: "#" }],
                        }))
                      }
                      className="h-9 px-3 rounded-xl bg-primary/10 text-primary text-xs font-extrabold hover:bg-primary/15 flex items-center gap-2"
                    >
                      <MIcon name="add" className="text-[16px]" />
                      Add
                    </button>
                  </div>

                  <div className="mt-3 space-y-3">
                    {(data.homeLinks || []).map((l, idx) => {
                      const hasMega = !!l?.mega;

                      return (
                        <div key={idx} className="rounded-2xl border border-zinc-200 bg-zinc-50 p-3">
                          <div className="flex items-center justify-between">
                            <div className="text-[11px] font-extrabold tracking-widest text-zinc-400">
                              LINK #{idx + 1}{" "}
                              <span className="ml-2 text-[10px] font-bold text-zinc-500">
                                {hasMega ? "(has sub menu)" : "(simple link)"}
                              </span>
                            </div>

                            <div className="flex items-center gap-2">
                              {/* Toggle mega */}
                              <button
                                type="button"
                                onClick={() =>
                                  setData((d) => ({
                                    ...d,
                                    homeLinks: (d.homeLinks || []).map((x, i) => {
                                      if (i !== idx) return x;
                                      if (x.mega) {
                                        const { mega, ...rest } = x;
                                        return rest;
                                      }
                                      return {
                                        ...x,
                                        mega: {
                                          columns: [
                                            {
                                              title: "Column 1",
                                              items: [{ label: "New Item", href: "#" }],
                                              footerLink: { label: "Im Überblick", href: "#" },
                                            },
                                            {
                                              title: "Column 2",
                                              items: [{ label: "New Item", href: "#" }],
                                              footerLink: { label: "Im Überblick", href: "#" },
                                            },
                                            {
                                              title: "Column 3",
                                              items: [{ label: "New Item", href: "#" }],
                                              footerLink: { label: "Im Überblick", href: "#" },
                                            },
                                          ],
                                        },
                                      };
                                    }),
                                  }))
                                }
                                className={[
                                  "h-8 px-3 rounded-xl text-xs font-extrabold border",
                                  hasMega
                                    ? "bg-zinc-900 text-white border-zinc-900"
                                    : "bg-white text-zinc-700 border-zinc-200 hover:bg-zinc-100",
                                ].join(" ")}
                                title="Toggle Mega Menu"
                              >
                                {hasMega ? "Mega: ON" : "Mega: OFF"}
                              </button>

                              <RowActions
                                onUp={() =>
                                  idx > 0 && setData((d) => ({ ...d, homeLinks: move(d.homeLinks || [], idx, idx - 1) }))
                                }
                                onDown={() =>
                                  idx < (data.homeLinks || []).length - 1 &&
                                  setData((d) => ({ ...d, homeLinks: move(d.homeLinks || [], idx, idx + 1) }))
                                }
                                onDelete={() =>
                                  setData((d) => ({
                                    ...d,
                                    homeLinks: (d.homeLinks || []).filter((_, i) => i !== idx),
                                  }))
                                }
                              />
                            </div>
                          </div>

                          <div className="mt-2">
                            <LinkRow
                              value={l}
                              onChangeLabel={(v) =>
                                setData((d) => ({
                                  ...d,
                                  homeLinks: (d.homeLinks || []).map((x, i) => (i === idx ? { ...x, label: v } : x)),
                                }))
                              }
                              onChangeUrl={(v) =>
                                setData((d) => ({
                                  ...d,
                                  homeLinks: (d.homeLinks || []).map((x, i) => (i === idx ? setUrl(x, v) : x)),
                                }))
                              }
                              urlPlaceholder="# or /about"
                            />
                          </div>

                          {hasMega ? (
                            <MegaEditor
                              mega={l.mega}
                              onChange={(nextMega) =>
                                setData((d) => ({
                                  ...d,
                                  homeLinks: (d.homeLinks || []).map((x, i) =>
                                    i === idx ? { ...x, mega: cleanMega(nextMega) || undefined } : x
                                  ),
                                }))
                              }
                            />
                          ) : null}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Buttons */}
                <div className="rounded-2xl border border-zinc-200 bg-white p-4">
                  <div className="text-xs font-extrabold tracking-widest text-zinc-400">BUTTONS</div>

                  <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
                    <Input
                      label="Login Label"
                      value={data.login?.label || ""}
                      onChange={(v) => setData((d) => ({ ...d, login: { ...(d.login || {}), label: v } }))}
                    />
                    <Input
                      label="Login URL (href/to)"
                      value={getUrl(data.login)}
                      onChange={(v) => setData((d) => ({ ...d, login: setUrl(d.login || {}, v) }))}
                      placeholder="/login"
                    />
                    <Input
                      label="CTA Label"
                      value={data.cta?.label || ""}
                      onChange={(v) => setData((d) => ({ ...d, cta: { ...(d.cta || {}), label: v } }))}
                    />
                    <Input
                      label="CTA URL (href/to)"
                      value={getUrl(data.cta)}
                      onChange={(v) => setData((d) => ({ ...d, cta: setUrl(d.cta || {}, v) }))}
                      placeholder="/quote"
                    />
                  </div>

                  <div className="mt-3 text-[11px] text-zinc-500">
                    SiteHeader reads: <span className="font-mono">login.to</span> and{" "}
                    <span className="font-mono">cta.to/href</span>. We save both.
                  </div>
                </div>
              </>
            ) : null}

            {/* Footer Editor */}
            {isFooter ? (
              <>
                <TextArea
                  label="Footer Description (optional)"
                  value={data.description || ""}
                  onChange={(v) => setData((d) => ({ ...d, description: v }))}
                  placeholder="(optional)"
                  rows={3}
                />

                {/* SOCIALS */}
                <div className="rounded-2xl border border-zinc-200 bg-white p-4">
                  <div className="flex items-center justify-between">
                    <div className="text-xs font-extrabold tracking-widest text-zinc-400">SOCIALS</div>
                    <button
                      type="button"
                      onClick={() =>
                        setData((d) => ({
                          ...d,
                          socials: [...(d.socials || []), { label: "new", href: "#" }],
                        }))
                      }
                      className="h-9 px-3 rounded-xl bg-primary/10 text-primary text-xs font-extrabold hover:bg-primary/15 flex items-center gap-2"
                    >
                      <MIcon name="add" className="text-[16px]" />
                      Add
                    </button>
                  </div>

                  <div className="mt-3 space-y-3">
                    {(Array.isArray(data.socials) ? data.socials : []).map((s, idx) => (
                      <div key={idx} className="rounded-2xl border border-zinc-200 bg-zinc-50 p-3">
                        <div className="flex items-center justify-between">
                          <div className="text-[11px] font-extrabold tracking-widest text-zinc-400">
                            SOCIAL #{idx + 1}
                          </div>
                          <RowActions
                            onUp={() =>
                              idx > 0 && setData((d) => ({ ...d, socials: move(d.socials || [], idx, idx - 1) }))
                            }
                            onDown={() =>
                              idx < (data.socials || []).length - 1 &&
                              setData((d) => ({ ...d, socials: move(d.socials || [], idx, idx + 1) }))
                            }
                            onDelete={() =>
                              setData((d) => ({ ...d, socials: (d.socials || []).filter((_, i) => i !== idx) }))
                            }
                          />
                        </div>

                        <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-3">
                          <Input
                            label="Label"
                            value={s.label || ""}
                            onChange={(v) =>
                              setData((d) => ({
                                ...d,
                                socials: (d.socials || []).map((x, i) => (i === idx ? { ...x, label: v } : x)),
                              }))
                            }
                          />
                          <Input
                            label="URL"
                            value={s.href || ""}
                            onChange={(v) =>
                              setData((d) => ({
                                ...d,
                                socials: (d.socials || []).map((x, i) => (i === idx ? { ...x, href: v } : x)),
                              }))
                            }
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* COLUMNS / SECTIONS */}
                <div className="rounded-2xl border border-zinc-200 bg-white p-4">
                  <div className="flex items-center justify-between">
                    <div className="text-xs font-extrabold tracking-widest text-zinc-400">COLUMNS / SECTIONS</div>
                    <button
                      type="button"
                      onClick={() =>
                        setData((d) => ({
                          ...d,
                          columns: [
                            ...(d.columns || []),
                            { title: "NEW SECTION", links: [{ label: "New Link", href: "#" }] },
                          ],
                        }))
                      }
                      className="h-9 px-3 rounded-xl bg-primary/10 text-primary text-xs font-extrabold hover:bg-primary/15 flex items-center gap-2"
                    >
                      <MIcon name="add" className="text-[16px]" />
                      Add
                    </button>
                  </div>

                  <div className="mt-3 space-y-4">
                    {(Array.isArray(data.columns) ? data.columns : []).map((col, cIdx) => {
                      const colLinks = Array.isArray(col.links) ? col.links : [];
                      const hasCta = !!col.cta;
                      const hasRating = !!col.rating;

                      return (
                        <div key={cIdx} className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
                          <div className="flex items-center justify-between">
                            <div className="text-[11px] font-extrabold tracking-widest text-zinc-400">
                              SECTION #{cIdx + 1}
                            </div>
                            <RowActions
                              onUp={() =>
                                cIdx > 0 && setData((d) => ({ ...d, columns: move(d.columns || [], cIdx, cIdx - 1) }))
                              }
                              onDown={() =>
                                cIdx < (data.columns || []).length - 1 &&
                                setData((d) => ({ ...d, columns: move(d.columns || [], cIdx, cIdx + 1) }))
                              }
                              onDelete={() =>
                                setData((d) => ({ ...d, columns: (d.columns || []).filter((_, i) => i !== cIdx) }))
                              }
                            />
                          </div>

                          <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
                            <Input
                              label="Title"
                              value={col.title || ""}
                              onChange={(v) =>
                                setData((d) => ({
                                  ...d,
                                  columns: (d.columns || []).map((x, i) => (i === cIdx ? { ...x, title: v } : x)),
                                }))
                              }
                            />
                            <Input
                              label="(optional) type"
                              value={col.type || ""}
                              onChange={(v) =>
                                setData((d) => ({
                                  ...d,
                                  columns: (d.columns || []).map((x, i) => (i === cIdx ? { ...x, type: v } : x)),
                                }))
                              }
                              placeholder="career / rating / etc"
                            />
                          </div>

                          <div className="mt-3">
                            <TextArea
                              label="(optional) Description"
                              value={col.description || ""}
                              onChange={(v) =>
                                setData((d) => ({
                                  ...d,
                                  columns: (d.columns || []).map((x, i) => (i === cIdx ? { ...x, description: v } : x)),
                                }))
                              }
                              rows={2}
                              placeholder="(optional)"
                            />
                          </div>

                          {/* CTA */}
                          <div className="mt-3 rounded-2xl border border-zinc-200 bg-white p-3">
                            <div className="flex items-center justify-between">
                              <div className="text-[11px] font-extrabold tracking-widest text-zinc-400">
                                CTA (OPTIONAL)
                              </div>
                              <button
                                type="button"
                                onClick={() =>
                                  setData((d) => ({
                                    ...d,
                                    columns: (d.columns || []).map((x, i) =>
                                      i === cIdx ? { ...x, cta: x.cta ? null : { label: "BUTTON", href: "#" } } : x
                                    ),
                                  }))
                                }
                                className="h-8 px-3 rounded-xl bg-zinc-100 text-zinc-700 text-xs font-extrabold hover:bg-zinc-200 flex items-center gap-2"
                              >
                                <MIcon name={hasCta ? "remove" : "add"} className="text-[16px]" />
                                {hasCta ? "Remove" : "Add"}
                              </button>
                            </div>

                            {hasCta ? (
                              <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
                                <Input
                                  label="CTA Label"
                                  value={col.cta?.label || ""}
                                  onChange={(v) =>
                                    setData((d) => ({
                                      ...d,
                                      columns: (d.columns || []).map((x, i) =>
                                        i === cIdx ? { ...x, cta: { ...(x.cta || {}), label: v } } : x
                                      ),
                                    }))
                                  }
                                />
                                <Input
                                  label="CTA Href"
                                  value={col.cta?.href || ""}
                                  onChange={(v) =>
                                    setData((d) => ({
                                      ...d,
                                      columns: (d.columns || []).map((x, i) =>
                                        i === cIdx ? { ...x, cta: { ...(x.cta || {}), href: v } } : x
                                      ),
                                    }))
                                  }
                                />
                              </div>
                            ) : null}
                          </div>

                          {/* Rating */}
                          <div className="mt-3 rounded-2xl border border-zinc-200 bg-white p-3">
                            <div className="flex items-center justify-between">
                              <div className="text-[11px] font-extrabold tracking-widest text-zinc-400">
                                RATING (OPTIONAL)
                              </div>
                              <button
                                type="button"
                                onClick={() =>
                                  setData((d) => ({
                                    ...d,
                                    columns: (d.columns || []).map((x, i) =>
                                      i === cIdx
                                        ? { ...x, rating: x.rating ? null : { value: "5.0", count: "400+ Reviews" } }
                                        : x
                                    ),
                                  }))
                                }
                                className="h-8 px-3 rounded-xl bg-zinc-100 text-zinc-700 text-xs font-extrabold hover:bg-zinc-200 flex items-center gap-2"
                              >
                                <MIcon name={hasRating ? "remove" : "add"} className="text-[16px]" />
                                {hasRating ? "Remove" : "Add"}
                              </button>
                            </div>

                            {hasRating ? (
                              <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
                                <Input
                                  label="Rating Value"
                                  value={col.rating?.value || ""}
                                  onChange={(v) =>
                                    setData((d) => ({
                                      ...d,
                                      columns: (d.columns || []).map((x, i) =>
                                        i === cIdx ? { ...x, rating: { ...(x.rating || {}), value: v } } : x
                                      ),
                                    }))
                                  }
                                />
                                <Input
                                  label="Rating Count"
                                  value={col.rating?.count || ""}
                                  onChange={(v) =>
                                    setData((d) => ({
                                      ...d,
                                      columns: (d.columns || []).map((x, i) =>
                                        i === cIdx ? { ...x, rating: { ...(x.rating || {}), count: v } } : x
                                      ),
                                    }))
                                  }
                                />
                              </div>
                            ) : null}
                          </div>

                          {/* Links */}
                          <div className="mt-4 rounded-2xl border border-zinc-200 bg-white p-3">
                            <div className="flex items-center justify-between">
                              <div className="text-[11px] font-extrabold tracking-widest text-zinc-400">LINKS</div>
                              <button
                                type="button"
                                onClick={() =>
                                  setData((d) => ({
                                    ...d,
                                    columns: (d.columns || []).map((x, i) =>
                                      i === cIdx
                                        ? { ...x, links: [...(x.links || []), { label: "New Link", href: "#" }] }
                                        : x
                                    ),
                                  }))
                                }
                                className="h-8 px-3 rounded-xl bg-primary/10 text-primary text-xs font-extrabold hover:bg-primary/15 flex items-center gap-2"
                              >
                                <MIcon name="add" className="text-[16px]" />
                                Add
                              </button>
                            </div>

                            <div className="mt-3 space-y-3">
                              {colLinks.map((lnk, lIdx) => (
                                <div key={lIdx} className="rounded-2xl border border-zinc-200 bg-zinc-50 p-3">
                                  <div className="flex items-center justify-between">
                                    <div className="text-[11px] font-extrabold tracking-widest text-zinc-400">
                                      LINK #{lIdx + 1}
                                    </div>
                                    <RowActions
                                      onUp={() =>
                                        lIdx > 0 &&
                                        setData((d) => ({
                                          ...d,
                                          columns: (d.columns || []).map((x, i) =>
                                            i === cIdx ? { ...x, links: move(x.links || [], lIdx, lIdx - 1) } : x
                                          ),
                                        }))
                                      }
                                      onDown={() =>
                                        lIdx < colLinks.length - 1 &&
                                        setData((d) => ({
                                          ...d,
                                          columns: (d.columns || []).map((x, i) =>
                                            i === cIdx ? { ...x, links: move(x.links || [], lIdx, lIdx + 1) } : x
                                          ),
                                        }))
                                      }
                                      onDelete={() =>
                                        setData((d) => ({
                                          ...d,
                                          columns: (d.columns || []).map((x, i) =>
                                            i === cIdx
                                              ? { ...x, links: (x.links || []).filter((_, ii) => ii !== lIdx) }
                                              : x
                                          ),
                                        }))
                                      }
                                    />
                                  </div>

                                  <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-3">
                                    <Input
                                      label="Label"
                                      value={lnk.label || ""}
                                      onChange={(v) =>
                                        setData((d) => ({
                                          ...d,
                                          columns: (d.columns || []).map((x, i) =>
                                            i === cIdx
                                              ? {
                                                  ...x,
                                                  links: (x.links || []).map((z, zi) =>
                                                    zi === lIdx ? { ...z, label: v } : z
                                                  ),
                                                }
                                              : x
                                          ),
                                        }))
                                      }
                                    />
                                    <Input
                                      label="Href"
                                      value={lnk.href || ""}
                                      onChange={(v) =>
                                        setData((d) => ({
                                          ...d,
                                          columns: (d.columns || []).map((x, i) =>
                                            i === cIdx
                                              ? {
                                                  ...x,
                                                  links: (x.links || []).map((z, zi) =>
                                                    zi === lIdx ? { ...z, href: v } : z
                                                  ),
                                                }
                                              : x
                                          ),
                                        }))
                                      }
                                    />
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Bottom bar */}
                <div className="rounded-2xl border border-zinc-200 bg-white p-4">
                  <div className="text-xs font-extrabold tracking-widest text-zinc-400">BOTTOM BAR</div>
                  <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
                    <Input
                      label="Bottom Left"
                      value={data.bottomLeft || ""}
                      onChange={(v) => setData((d) => ({ ...d, bottomLeft: v }))}
                    />
                    <Input
                      label="Bottom Center"
                      value={data.bottomCenter || ""}
                      onChange={(v) => setData((d) => ({ ...d, bottomCenter: v }))}
                    />
                    <Input
                      label="Bottom Right"
                      value={data.bottomRight || ""}
                      onChange={(v) => setData((d) => ({ ...d, bottomRight: v }))}
                    />
                  </div>
                </div>
              </>
            ) : null}

            {/* Debug JSON (Editor side) */}
            
          </div>
        </div>
      </div>
    </div>
  );
}
