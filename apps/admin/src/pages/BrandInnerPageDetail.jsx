import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import MIcon from "../components/MIcon";
import { apiFetch } from "../lib/auth";

function uid() {
  return `${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

function clone(v) {
  return JSON.parse(JSON.stringify(v));
}

function move(arr, from, to) {
  if (to < 0 || to >= arr.length) return arr;
  const next = [...arr];
  const item = next.splice(from, 1)[0];
  next.splice(to, 0, item);
  return next;
}

function cleanSlug(value) {
  return String(value || "")
    .trim()
    .replace(/^\/+|\/+$/g, "");
}

function normalizeKey(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "")
    .replace(/[_-]/g, "");
}

function getBrandPreviewBase(page) {
  const brandSlug = normalizeKey(
    page?.brandSlug ||
      page?.brand_slug ||
      page?.brand?.slug ||
      page?.brandName ||
      page?.brand_name ||
      page?.brand?.name
  );

  if (
    brandSlug === "allianz4" ||
    brandSlug === "maamfashion" ||
    brandSlug.includes("allianz4")
  ) {
    return "https://www.maamfashion.com";
  }

  if (
    brandSlug === "kundler3" ||
    brandSlug === "allianz3" ||
    brandSlug === "digitraffic" ||
    brandSlug.includes("kundler3") ||
    brandSlug.includes("allianz3")
  ) {
    return "https://digitraffic.de";
  }

  return (
    page?.previewUrl ||
    page?.brandPreviewUrl ||
    page?.brand?.previewUrl ||
    page?.brand?.websiteUrl ||
    "https://digitraffic.de"
  );
}

const SECTION_LIBRARY = {
  Hero: {
    label: "Hero",
    defaults: {
      title: "Your Brand Title",
      subtitle: "Short description here",
      ctaLabel: "Get Started",
      ctaHref: "/contact",
      bgImage: "",
    },
  },
  Features: {
    label: "Features",
    defaults: {
      title: "Features",
      items: [
        { title: "Feature 1", desc: "Description" },
        { title: "Feature 2", desc: "Description" },
      ],
    },
  },
  CTA: {
    label: "CTA",
    defaults: {
      title: "Ready to start?",
      buttonLabel: "Contact",
      buttonHref: "/contact",
    },
  },
};

function TextInput({ label, value, onChange }) {
  return (
    <div>
      <label className="text-xs font-bold text-zinc-500">{label}</label>
      <input
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-violet-200"
      />
    </div>
  );
}

function TextArea({ label, value, onChange }) {
  return (
    <div>
      <label className="text-xs font-bold text-zinc-500">{label}</label>
      <textarea
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        rows={4}
        className="mt-1 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-violet-200"
      />
    </div>
  );
}

function GenericEditor({ section, onChange }) {
  const props = section?.props || {};

  return (
    <div className="space-y-4">
      {Object.entries(props).map(([key, value]) => {
        if (Array.isArray(value)) {
          return (
            <div key={key} className="space-y-2">
              <div className="text-xs font-bold text-zinc-500">{key}</div>

              {value.map((item, idx) => (
                <div
                  key={idx}
                  className="space-y-2 rounded-xl border border-zinc-200 bg-white p-3"
                >
                  {typeof item === "string" ? (
                    <TextInput
                      label={`${key} ${idx + 1}`}
                      value={item}
                      onChange={(val) => {
                        const arr = [...value];
                        arr[idx] = val;
                        onChange(key, arr);
                      }}
                    />
                  ) : (
                    Object.entries(item || {}).map(([k, v]) => (
                      <TextInput
                        key={k}
                        label={k}
                        value={v}
                        onChange={(val) => {
                          const arr = [...value];
                          arr[idx] = { ...arr[idx], [k]: val };
                          onChange(key, arr);
                        }}
                      />
                    ))
                  )}

                  <button
                    type="button"
                    onClick={() => onChange(key, value.filter((_, i) => i !== idx))}
                    className="text-xs font-bold text-red-600"
                  >
                    Remove
                  </button>
                </div>
              ))}

              <button
                type="button"
                onClick={() =>
                  onChange(key, [...value, { title: "New", desc: "Desc" }])
                }
                className="rounded-xl bg-violet-50 px-4 py-2 text-xs font-black text-violet-700"
              >
                + Add
              </button>
            </div>
          );
        }

        const lower = key.toLowerCase();

        if (
          lower.includes("desc") ||
          lower.includes("subtitle") ||
          lower.includes("body") ||
          lower.includes("quote")
        ) {
          return (
            <TextArea
              key={key}
              label={key}
              value={value}
              onChange={(v) => onChange(key, v)}
            />
          );
        }

        return (
          <TextInput
            key={key}
            label={key}
            value={value}
            onChange={(v) => onChange(key, v)}
          />
        );
      })}
    </div>
  );
}

export default function BrandInnerPageDetail() {
  const { pageId } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [page, setPage] = useState(null);
  const [sections, setSections] = useState([]);
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [previewVersion, setPreviewVersion] = useState(Date.now());

  const selected = sections[selectedIdx];

  const content = useMemo(
    () => ({
      templateKey: "shared-builder",
      sections,
    }),
    [sections]
  );

  const pageSlug = cleanSlug(page?.slug || page?.pageSlug || page?.path || "home");
  const previewBase = getBrandPreviewBase(page);
  const previewPath = pageSlug === "home" ? "" : `/${pageSlug}`;

  const previewUrl = `${previewBase}${previewPath}?pageId=${pageId}&preview=${previewVersion}`;

  useEffect(() => {
    let alive = true;

    async function load() {
      setLoading(true);

      try {
        const res = await apiFetch(`/admin/shared-pages/${pageId}`);
        const json = await res.json().catch(() => null);

        if (!res.ok || !json?.ok) {
          throw new Error(json?.message || "Failed to load page");
        }

        const pageData = json.data;
        const latestContent = pageData?.latestVersion?.content;

        const loadedSections = Array.isArray(latestContent?.sections)
          ? latestContent.sections
          : [];

        if (alive) {
          setPage(pageData);
          setSections(loadedSections);
          setSelectedIdx(0);
          setPreviewVersion(Date.now());
        }
      } catch (e) {
        alert(e?.message || "Failed to load page builder");
      } finally {
        if (alive) setLoading(false);
      }
    }

    if (pageId) load();

    return () => {
      alive = false;
    };
  }, [pageId]);

  function addSection(type) {
    const def = SECTION_LIBRARY[type];
    if (!def) return;

    const next = [
      ...sections,
      {
        id: uid(),
        type,
        props: clone(def.defaults),
      },
    ];

    setSections(next);
    setSelectedIdx(next.length - 1);
  }

  function removeSection(idx) {
    const next = sections.filter((_, i) => i !== idx);
    setSections(next);
    setSelectedIdx(Math.max(0, Math.min(idx, next.length - 1)));
  }

  function moveSection(from, to) {
    const next = move(sections, from, to);
    setSections(next);
    setSelectedIdx(to);
  }

  function toggleSectionVisibility(idx) {
    setSections((prev) =>
      prev.map((section, i) =>
        i === idx ? { ...section, hidden: !section.hidden } : section
      )
    );
  }

  function updateSelectedProp(key, value) {
    setSections((prev) =>
      prev.map((section, i) =>
        i === selectedIdx
          ? {
              ...section,
              props: {
                ...(section.props || {}),
                [key]: value,
              },
            }
          : section
      )
    );
  }

  async function save(status = "draft") {
    setSaving(true);

    try {
      const res = await apiFetch(`/admin/shared-pages/${pageId}/content`, {
        method: "PUT",
        body: {
          content,
          status,
        },
      });

      const json = await res.json().catch(() => null);

      if (!res.ok || !json?.ok) {
        throw new Error(json?.message || "Save failed");
      }

      setPreviewVersion(Date.now());

      alert(
        status === "published"
          ? "Page published successfully"
          : "Draft saved successfully"
      );
    } catch (e) {
      alert(e?.message || "Save failed");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <div className="p-8 text-zinc-500">Loading page builder...</div>;
  }

  return (
    <div className="fixed inset-0 z-[9999] bg-[#f6f2fb] text-zinc-900">
      <header className="flex h-16 items-center justify-between border-b border-zinc-200 bg-white px-6">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => navigate("/brand-inner-pages")}
            className="h-10 rounded-xl bg-zinc-900 px-4 text-sm font-black text-white"
          >
            Back Pages
          </button>

          <div>
            <div className="text-xs text-zinc-400">Shared Page Builder</div>

            <h1 className="text-base font-black">
              {page?.title || page?.slug || "Shared Page"}
            </h1>

            <div className="mt-0.5 text-[11px] text-zinc-400">
              Preview: {previewUrl}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <a
            href={previewUrl}
            target="_blank"
            rel="noreferrer"
            className="flex h-10 items-center rounded-xl border border-zinc-200 bg-white px-4 text-sm font-black text-zinc-700"
          >
            Open Preview
          </a>

          <button
            type="button"
            disabled={saving}
            onClick={() => save("draft")}
            className="h-10 rounded-xl bg-zinc-900 px-5 text-sm font-black text-white disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Draft"}
          </button>

          <button
            type="button"
            disabled={saving}
            onClick={() => save("published")}
            className="h-10 rounded-xl bg-violet-600 px-5 text-sm font-black text-white disabled:opacity-50"
          >
            {saving ? "Saving..." : "Publish"}
          </button>
        </div>
      </header>

      <div className="flex h-20 items-center gap-3 overflow-x-auto border-b border-zinc-200 bg-white px-6">
        <span className="shrink-0 text-xs font-black uppercase text-zinc-400">
          Add Section
        </span>

        {Object.entries(SECTION_LIBRARY).map(([type, def]) => (
          <button
            type="button"
            key={type}
            onClick={() => addSection(type)}
            className="h-10 shrink-0 rounded-xl border border-zinc-200 bg-zinc-50 px-4 text-xs font-black hover:bg-violet-50 hover:text-violet-700"
          >
            + {def.label}
          </button>
        ))}
      </div>

      <div className="grid h-[calc(100vh-144px)] grid-cols-[320px_1fr_420px]">
        <aside className="overflow-auto border-r border-zinc-200 bg-white p-4">
          <div className="mb-4 text-xs font-black uppercase text-zinc-400">
            Page Sections
          </div>

          <div className="space-y-2">
            {sections.map((section, idx) => {
              const active = idx === selectedIdx;

              return (
                <div
                  key={section.id || idx}
                  onClick={() => setSelectedIdx(idx)}
                  className={[
                    "cursor-pointer rounded-2xl border p-3 transition",
                    active
                      ? "border-violet-600 bg-violet-50"
                      : "border-zinc-200 bg-white hover:bg-zinc-50",
                    section.hidden ? "opacity-60" : "",
                  ].join(" ")}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <div className="text-sm font-black">
                        {idx + 1}.{" "}
                        {SECTION_LIBRARY[section.type]?.label || section.type}

                        {section.hidden ? (
                          <span className="ml-2 text-xs text-red-500">
                            Hidden
                          </span>
                        ) : null}
                      </div>

                      <div className="font-mono text-[11px] text-zinc-400">
                        {section.type}
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          moveSection(idx, idx - 1);
                        }}
                        className="grid h-8 w-8 place-items-center rounded-lg hover:bg-white"
                      >
                        <MIcon
                          name="keyboard_arrow_up"
                          className="text-[18px]"
                        />
                      </button>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          moveSection(idx, idx + 1);
                        }}
                        className="grid h-8 w-8 place-items-center rounded-lg hover:bg-white"
                      >
                        <MIcon
                          name="keyboard_arrow_down"
                          className="text-[18px]"
                        />
                      </button>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleSectionVisibility(idx);
                        }}
                        className="grid h-8 w-8 place-items-center rounded-lg hover:bg-white"
                      >
                        <MIcon
                          name={section.hidden ? "visibility_off" : "visibility"}
                          className="text-[18px]"
                        />
                      </button>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeSection(idx);
                        }}
                        className="grid h-8 w-8 place-items-center rounded-lg text-red-500 hover:bg-red-50"
                      >
                        <MIcon name="delete" className="text-[18px]" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}

            {!sections.length ? (
              <div className="rounded-2xl border border-dashed border-zinc-300 p-6 text-center text-sm text-zinc-500">
                No sections yet. Add a section from top.
              </div>
            ) : null}
          </div>
        </aside>

        <main className="overflow-hidden bg-zinc-100">
          <iframe
            key={previewUrl}
            title="Brand Preview"
            src={previewUrl}
            className="h-full w-full border-0 bg-white"
          />
        </main>

        <aside className="flex flex-col overflow-hidden border-l border-zinc-200 bg-white">
          <div className="border-b border-zinc-200 p-5">
            <div className="text-xs text-zinc-400">Edit Selected</div>

            <h2 className="text-xl font-black">
              {selected
                ? SECTION_LIBRARY[selected.type]?.label || selected.type
                : "None"}
            </h2>
          </div>

          <div className="flex-1 overflow-auto p-5">
            {selected ? (
              <GenericEditor section={selected} onChange={updateSelectedProp} />
            ) : (
              <div className="text-sm text-zinc-500">
                Select a section to edit.
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}